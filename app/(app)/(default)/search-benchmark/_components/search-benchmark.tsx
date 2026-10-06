"use client";

/** Measurements must not overlap, so the benchmark awaits them one at a time. */
/* oxlint-disable no-await-in-loop */

import { Fragment, type ReactNode, useId, useRef, useState } from "react";

import type { SearchBenchmarkResponse } from "#/app/(api)/api/search-benchmark/route.ts";
import { type SearchBenchmarkScenario, scenarios } from "#/app/(app)/(default)/search-benchmark/scenarios.ts";
import { type CreateSearchServiceParams, type SearchService, createSearchService } from "#/lib/search/index.ts";

interface SearchBenchmarkConnection extends Pick<CreateSearchServiceParams, "apiKey" | "collections"> {
	host: string;
	port: number;
	protocol: "http" | "https";
}

const metrics = [
	{ key: "server", label: "Server path: keystroke → results rendered" },
	{ key: "serverCached", label: "Server path, query cached on the server" },
	{ key: "direct", label: "Direct: browser → typesense" },
	{ key: "functionToTypesense", label: "Function → typesense, measured in the function" },
	{ key: "browserToFunction", label: "Browser → function round trip, excluding the search" },
] as const;

type Metric = (typeof metrics)[number]["key"];

interface ScenarioResult {
	samples: Record<Metric, Array<number>>;
	errors: Array<string>;
}

interface BenchmarkRun {
	startedAt: string;
	url: string;
	userAgent: string;
	/** The vercel region the function ran in, as reported by the api route. */
	region: string | null;
	queriesPerScenario: number;
	results: Record<string, ScenarioResult>;
}

/** Words which occur in both collections, so the queries have realistic result sets. */
const words = [
	"archive",
	"corpus",
	"digital",
	"edition",
	"heritage",
	"history",
	"language",
	"literature",
	"museum",
	"network",
	"research",
	"text",
];

function pick<T>(items: ReadonlyArray<T>): T {
	return items[Math.floor(Math.random() * items.length)]!;
}

/**
 * Queries as they look while typing the second word, e.g. "digital her". Random combinations make them new for every
 * run, so they miss the server's in-memory result cache, which outlives a run.
 */
function createQueries(count: number): Array<string> {
	const queries = new Set<string>();

	while (queries.size < count) {
		const second = pick(words);
		queries.add(`${pick(words)} ${second.slice(0, 2 + Math.floor(Math.random() * (second.length - 1)))}`);
	}

	return [...queries];
}

function getMessage(error: unknown): string {
	return typeof error === "object" && error != null && "message" in error ? String(error.message) : String(error);
}

function timeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
	return Promise.race([
		promise,
		new Promise<never>((_, reject) => {
			setTimeout(() => {
				reject(new Error(message));
			}, ms);
		}),
	]);
}

function getSearchForm(frame: HTMLIFrameElement): HTMLFormElement | null {
	return frame.contentDocument?.querySelector<HTMLFormElement>("form[role=search]") ?? null;
}

/** Loads a search page into the frame, and waits until react has hydrated its search form. */
async function loadSearchPage(frame: HTMLIFrameElement, url: string): Promise<void> {
	const loaded = new Promise<void>((resolve) => {
		frame.addEventListener(
			"load",
			() => {
				resolve();
			},
			{ once: true },
		);
	});
	frame.src = url;
	await timeout(loaded, 30_000, `Timed out loading ${url}.`);

	const hydrated = new Promise<void>((resolve) => {
		function check(): void {
			const form = getSearchForm(frame);
			if (form != null && Object.keys(form).some((key) => key.startsWith("__reactFiber$"))) {
				resolve();
			} else {
				setTimeout(check, 50);
			}
		}
		check();
	});
	await timeout(hydrated, 30_000, `Timed out waiting for ${url} to hydrate.`);
}

/**
 * Types a query into the search page in the frame, like a keystroke would, and measures until its results are rendered:
 * the form's spinner has come and gone, and the url carries the query.
 */
function searchThroughServer(frame: HTMLIFrameElement, query: string): Promise<number> {
	/** The frame's own globals, since a node from its document only works with the frame's constructors. */
	const view = frame.contentWindow as (Window & typeof globalThis) | null;
	const form = getSearchForm(frame);
	const input = form?.querySelector<HTMLInputElement>("input[type=search]");
	const status = form?.querySelector("[role=status]");

	if (view == null || input == null || status == null) {
		return Promise.reject(new Error("Search form not found."));
	}

	const done = new Promise<number>((resolve) => {
		const start = performance.now();
		let isPending = false;

		function check(observer: MutationObserver): void {
			if (status!.childElementCount > 0) {
				isPending = true;
			} else if (isPending) {
				if (new URL(view!.location.href).searchParams.get("q") === query) {
					observer.disconnect();
					resolve(performance.now() - start);
				} else {
					/** The url may be updated just after the results are committed. */
					setTimeout(() => {
						check(observer);
					}, 1);
				}
			}
		}

		new view.MutationObserver((_records, observer) => {
			check(observer);
		}).observe(status, { childList: true, subtree: true });

		/** Set the value the way typing does, so react's change tracking sees it. */
		Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, "value")!.set!.call(input, query);
		input.dispatchEvent(new view.Event("input", { bubbles: true }));
	});

	return timeout(done, 15_000, `Timed out searching for "${query}" through the server.`);
}

async function searchDirectly(
	service: SearchService,
	scenario: SearchBenchmarkScenario,
	query: string,
): Promise<number> {
	const start = performance.now();
	const result = await scenario.search(service, query);
	const duration = performance.now() - start;

	if (result.isErr()) {
		throw new Error(`Direct search for "${query}" failed.`);
	}

	return duration;
}

async function searchInFunction(
	scenario: SearchBenchmarkScenario,
	query: string,
): Promise<SearchBenchmarkResponse & { total: number }> {
	const start = performance.now();
	const response = await fetch(`/api/search-benchmark?${new URLSearchParams({ scenario: scenario.id, q: query })}`, {
		cache: "no-store",
	});
	if (!response.ok) {
		throw new Error(`Api route responded with ${String(response.status)} for "${query}".`);
	}
	const body = (await response.json()) as SearchBenchmarkResponse;

	return { ...body, total: performance.now() - start };
}

function createEmptyResult(): ScenarioResult {
	return {
		samples: { server: [], serverCached: [], direct: [], functionToTypesense: [], browserToFunction: [] },
		errors: [],
	};
}

interface Stats {
	n: number;
	min: number;
	p50: number;
	p90: number;
	max: number;
	mean: number;
}

function getStats(samples: ReadonlyArray<number>): Stats | null {
	if (samples.length === 0) {
		return null;
	}

	const sorted = samples.toSorted((a, b) => a - b);
	function percentile(p: number): number {
		return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))]!;
	}

	return {
		n: sorted.length,
		min: sorted[0]!,
		p50: percentile(0.5),
		p90: percentile(0.9),
		max: sorted.at(-1)!,
		mean: sorted.reduce((sum, value) => sum + value, 0) / sorted.length,
	};
}

/** How many server path queries are repeated, to measure searches answered from the server's result cache. */
const cachedQueriesPerScenario = 10;

interface RunBenchmarkParams {
	connection: SearchBenchmarkConnection;
	frame: HTMLIFrameElement;
	queriesPerScenario: number;
	onProgress: (progress: string | null) => void;
	/** Called with the results so far after each scenario. */
	onResult: (run: BenchmarkRun) => void;
}

/** Runs every scenario one after another. Measurement errors are recorded per scenario; others abort the run. */
async function runBenchmark(params: RunBenchmarkParams): Promise<BenchmarkRun> {
	const { connection, frame, queriesPerScenario, onProgress, onResult } = params;

	/** Uncached like the server leg, and with the key in the url like `typesense-js`'s search-only client does. */
	const service = createSearchService({
		apiKey: connection.apiKey,
		nodes: [{ host: connection.host, port: connection.port, protocol: connection.protocol }],
		collections: connection.collections,
		config: { cacheSearchResultsForSeconds: 0, sendApiKeyAsQueryParam: true },
	});

	const run: BenchmarkRun = {
		startedAt: new Date().toISOString(),
		url: window.location.origin,
		userAgent: navigator.userAgent,
		region: null,
		queriesPerScenario,
		results: {},
	};

	function snapshot(): BenchmarkRun {
		return { ...run, results: { ...run.results } };
	}

	try {
		for (const scenario of scenarios) {
			const result = createEmptyResult();
			run.results[scenario.id] = result;

			async function measure(fn: () => Promise<void>): Promise<void> {
				try {
					await fn();
				} catch (error) {
					result.errors.push(getMessage(error));
				}
			}

			onProgress(`${scenario.label}: loading the page`);
			await loadSearchPage(frame, scenario.url);

			/** Warm up connections - and the function, which may start cold - without recording. */
			const [warmup = "warmup"] = createQueries(1);
			await measure(async () => {
				await searchThroughServer(frame, warmup);
			});
			await measure(async () => {
				await searchDirectly(service, scenario, warmup);
			});
			const { region } = await searchInFunction(scenario, warmup);
			run.region = region;

			const queries = createQueries(queriesPerScenario);
			const measurements = [
				async (query: string) => {
					result.samples.server.push(await searchThroughServer(frame, query));
				},
				async (query: string) => {
					result.samples.direct.push(await searchDirectly(service, scenario, query));
				},
				async (query: string) => {
					const { duration, total } = await searchInFunction(scenario, query);
					result.samples.functionToTypesense.push(duration);
					result.samples.browserToFunction.push(total - duration);
				},
			];

			for (const [index, query] of queries.entries()) {
				onProgress(`${scenario.label}: query ${String(index + 1)} of ${String(queries.length)}`);
				/** Rotate the order, so neither path is systematically measured first. */
				for (let offset = 0; offset < measurements.length; offset++) {
					const measurement = measurements[(index + offset) % measurements.length]!;
					await measure(() => measurement(query));
				}
			}

			onProgress(`${scenario.label}: repeating queries`);
			for (const query of queries.slice(0, cachedQueriesPerScenario)) {
				/** Search for something else first, so the repeated query is a navigation again. */
				await measure(async () => {
					await searchThroughServer(frame, `${query}x`);
				});
				await measure(async () => {
					result.samples.serverCached.push(await searchThroughServer(frame, query));
				});
			}

			onResult(snapshot());
		}

		onProgress(null);
	} catch (error) {
		onProgress(`Aborted: ${getMessage(error)}`);
	}

	return snapshot();
}

export function SearchBenchmark(props: Readonly<{ connection: SearchBenchmarkConnection }>): ReactNode {
	const { connection } = props;

	const frameRef = useRef<HTMLIFrameElement>(null);
	const [queriesPerScenario, setQueriesPerScenario] = useState(20);
	const [isRunning, setIsRunning] = useState(false);
	const [progress, setProgress] = useState<string | null>(null);
	const [run, setRun] = useState<BenchmarkRun | null>(null);
	const [copied, setCopied] = useState(false);
	const countId = useId();

	async function start(): Promise<void> {
		const frame = frameRef.current;
		if (frame == null) {
			return;
		}

		setIsRunning(true);
		setCopied(false);

		const result = await runBenchmark({
			connection,
			frame,
			queriesPerScenario,
			onProgress: setProgress,
			onResult: setRun,
		});

		setRun(result);
		setIsRunning(false);
	}

	async function copy(): Promise<void> {
		if (run == null) {
			return;
		}

		await navigator.clipboard.writeText(JSON.stringify(run, null, 2));
		setCopied(true);
	}

	return (
		<section>
			<div>
				<label htmlFor={countId}>Queries per scenario</label>
				<input
					disabled={isRunning}
					id={countId}
					max={100}
					min={5}
					onChange={(event) => {
						setQueriesPerScenario(event.currentTarget.valueAsNumber);
					}}
					type="number"
					value={queriesPerScenario}
				/>
				<button
					disabled={isRunning}
					onClick={() => {
						void start();
					}}
					type="button"
				>
					{isRunning ? "Running…" : "Run benchmark"}
				</button>
				{run != null && !isRunning ? (
					<button
						onClick={() => {
							void copy();
						}}
						type="button"
					>
						{copied ? "Copied" : "Copy results as json"}
					</button>
				) : null}
			</div>

			<p role="status">{progress}</p>

			{run != null ? (
				<div>
					<p>
						Function region: {run.region ?? "unknown"} · started {run.startedAt}
					</p>
					{scenarios.map((scenario) => {
						const result = run.results[scenario.id];

						if (result == null) {
							return null;
						}

						return <ScenarioTable key={scenario.id} label={scenario.label} result={result} />;
					})}
				</div>
			) : null}

			{/* The benchmark drives this same-origin page through its dom, which rules out a sandbox. */}
			{/* oxlint-disable-next-line react/iframe-missing-sandbox */}
			<iframe className="h-80 w-full border" ref={frameRef} title="Search page under test" />
		</section>
	);
}

function ScenarioTable(props: Readonly<{ label: string; result: ScenarioResult }>): ReactNode {
	const { label, result } = props;

	return (
		<Fragment>
			<table>
				<caption>{label}, in milliseconds</caption>
				<thead>
					<tr>
						<th scope="col">Measurement</th>
						<th scope="col">n</th>
						<th scope="col">min</th>
						<th scope="col">p50</th>
						<th scope="col">p90</th>
						<th scope="col">max</th>
						<th scope="col">mean</th>
					</tr>
				</thead>
				<tbody>
					{metrics.map((metric) => {
						const stats = getStats(result.samples[metric.key]);

						return (
							<tr key={metric.key}>
								<th scope="row">{metric.label}</th>
								{stats != null ? (
									<Fragment>
										<td>{stats.n}</td>
										<td>{Math.round(stats.min)}</td>
										<td>{Math.round(stats.p50)}</td>
										<td>{Math.round(stats.p90)}</td>
										<td>{Math.round(stats.max)}</td>
										<td>{Math.round(stats.mean)}</td>
									</Fragment>
								) : (
									<td colSpan={6}>no samples</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
			{result.errors.length > 0 ? (
				<details>
					<summary>{result.errors.length} errors</summary>
					<ul>
						{result.errors.map((error, index) => (
							// oxlint-disable-next-line react/no-array-index-key
							<li key={index}>{error}</li>
						))}
					</ul>
				</details>
			) : null}
		</Fragment>
	);
}
