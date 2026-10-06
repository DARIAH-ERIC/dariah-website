import { describe, expect, test } from "bun:test";

import type { JSONContent } from "@tiptap/core";

import {
	collectFootnotes,
	collectHeadings,
	identifyHeadings,
	isEmptyRichTextDocument,
	numberFootnotes,
	toPlainText,
} from "#/lib/rich-text.ts";

function paragraph(...content: Array<JSONContent>): JSONContent {
	return { type: "paragraph", content };
}

function text(value: string): JSONContent {
	return { type: "text", text: value };
}

function heading(level: number, ...content: Array<JSONContent>): JSONContent {
	return { type: "heading", attrs: { level }, content };
}

function footnote(note: JSONContent | null): JSONContent {
	return { type: "footnote", attrs: { content: note } };
}

describe("isEmptyRichTextDocument", () => {
	test("treats null content as empty", () => {
		expect(isEmptyRichTextDocument(null)).toBeTrue();
		expect(isEmptyRichTextDocument(undefined)).toBeTrue();
	});

	test("treats a doc with no paragraphs, or only blank ones, as empty", () => {
		expect(isEmptyRichTextDocument({ type: "doc", content: [] })).toBeTrue();
		expect(isEmptyRichTextDocument({ type: "doc", content: [paragraph()] })).toBeTrue();
		expect(isEmptyRichTextDocument({ type: "doc", content: [paragraph(text("  "))] })).toBeTrue();
	});

	test("treats a blank lead-in like a blank paragraph", () => {
		expect(isEmptyRichTextDocument({ type: "doc", content: [{ type: "leadIn" }] })).toBeTrue();
		expect(
			isEmptyRichTextDocument({ type: "doc", content: [{ type: "leadIn", content: [text("Lead.")] }] }),
		).toBeFalse();
	});

	test("is not empty once a paragraph carries text, or the document holds any other node", () => {
		expect(isEmptyRichTextDocument({ type: "doc", content: [paragraph(text("hello"))] })).toBeFalse();
		expect(isEmptyRichTextDocument({ type: "doc", content: [{ type: "horizontalRule" }] })).toBeFalse();
	});
});

describe("numberFootnotes / collectFootnotes", () => {
	test("numbers footnote markers by their position and collects their notes in the same order", () => {
		const first = footnote(paragraph(text("first note")));
		const second = footnote(paragraph(text("second note")));
		const content: JSONContent = {
			type: "doc",
			content: [paragraph(text("a"), first, text("b"), second)],
		};

		const numbered = numberFootnotes(content);
		const markers = numbered.content?.[0]?.content?.filter((node) => node.type === "footnote") ?? [];

		expect(markers.map((marker) => marker.attrs?.number as number | undefined)).toEqual([1, 2]);
		expect(collectFootnotes(numbered)).toEqual([paragraph(text("first note")), paragraph(text("second note"))]);
	});

	test("numbers markers nested anywhere in the input, e.g. inside a table caption", () => {
		const content = {
			type: "table",
			attrs: { caption: paragraph(text("see"), footnote(paragraph(text("note")))) },
			content: [],
		};

		expect(numberFootnotes(content)).toEqual({
			type: "table",
			attrs: {
				caption: paragraph(text("see"), {
					type: "footnote",
					attrs: { content: paragraph(text("note")), number: 1 },
				}),
			},
			content: [],
		});
	});

	test("collects a null note for a marker whose content was never written", () => {
		const content: JSONContent = { type: "doc", content: [paragraph(footnote(null))] };

		expect(collectFootnotes(content)).toEqual([null]);
	});

	test("leaves input with no footnotes unchanged", () => {
		const content: JSONContent = { type: "doc", content: [paragraph(text("no notes here"))] };

		expect(collectFootnotes(content)).toEqual([]);
		expect(numberFootnotes(content)).toEqual(content);
	});
});

describe("toPlainText", () => {
	test("joins the text of a document, separating block boundaries with a single space", () => {
		const content: JSONContent = {
			type: "doc",
			content: [paragraph(text("first")), paragraph(text("second"))],
		};

		expect(toPlainText(content)).toBe("first second");
	});

	test("keeps a run split across marks as one word, and has no text for empty content", () => {
		expect(toPlainText(paragraph(text("DARIAH"), text("-EU")))).toBe("DARIAH-EU");
		expect(toPlainText(null)).toBe("");
		expect(toPlainText({ type: "doc", content: [paragraph()] })).toBe("");
	});
});

describe("identifyHeadings / collectHeadings", () => {
	test("slugs every heading's own text and collects the outline in reading order", () => {
		const blocks = [
			{ type: "rich_text", content: { type: "doc", content: [heading(2, text("What is DARIAH?"))] } },
			{ type: "rich_text", content: { type: "doc", content: [heading(3, text("Research & Development"))] } },
		];

		expect(collectHeadings(identifyHeadings(blocks))).toEqual([
			{ id: "what-is-dariah", level: 2, text: "What is DARIAH?" },
			{ id: "research-and-development", level: 3, text: "Research & Development" },
		]);
	});

	test("suffixes a repeated slug, across blocks, without stealing an id a later heading spells out", () => {
		const blocks = [
			{ type: "rich_text", content: { type: "doc", content: [heading(2, text("Background"))] } },
			{ type: "rich_text", content: { type: "doc", content: [heading(2, text("Background"))] } },
			{ type: "rich_text", content: { type: "doc", content: [heading(2, text("Background 2"))] } },
		];

		expect(collectHeadings(identifyHeadings(blocks)).map((item) => item.id)).toEqual([
			"background",
			"background-2",
			"background-2-2",
		]);
	});

	test("gives a heading with no text of its own an anchor, but leaves it out of the outline", () => {
		const blocks = [{ type: "rich_text", content: { type: "doc", content: [heading(2), heading(2, text("Aims"))] } }];
		const identified = identifyHeadings(blocks) as Array<{ content: JSONContent }>;
		const headings = identified[0]?.content.content ?? [];

		expect(headings.map((node) => node.attrs?.id as string | undefined)).toEqual(["section", "aims"]);
		expect(collectHeadings(identified).map((item) => item.id)).toEqual(["aims"]);
	});

	test("skips headings inside an accordion, whose panels are collapsed", () => {
		const blocks = [
			{ type: "rich_text", content: { type: "doc", content: [heading(2, text("Aims"))] } },
			{
				type: "accordion",
				items: [
					{
						title: "How do I join?",
						blocks: [{ type: "rich_text", content: { type: "doc", content: [heading(3, text("Eligibility"))] } }],
					},
				],
			},
		];

		expect(collectHeadings(identifyHeadings(blocks)).map((item) => item.id)).toEqual(["aims"]);
	});

	test("finds headings nested in a callout, and leaves every other node untouched", () => {
		const blocks = [
			{
				type: "callout",
				title: "Note",
				blocks: [
					{ type: "rich_text", content: { type: "doc", content: [heading(2, text("Aims")), paragraph(text("a"))] } },
				],
			},
		];

		expect(collectHeadings(identifyHeadings(blocks))).toEqual([{ id: "aims", level: 2, text: "Aims" }]);
		expect(identifyHeadings([paragraph(text("no headings here"))])).toEqual([paragraph(text("no headings here"))]);
	});

	test("numbers footnotes inside a heading without disturbing its anchor", () => {
		const blocks = [
			{
				type: "rich_text",
				content: { type: "doc", content: [heading(2, text("Aims"), footnote(paragraph(text("note"))))] },
			},
		];

		const identified = numberFootnotes(identifyHeadings(blocks));

		expect(collectHeadings(identified)).toEqual([{ id: "aims", level: 2, text: "Aims" }]);
		expect(collectFootnotes(identified)).toEqual([paragraph(text("note"))]);
	});
});
