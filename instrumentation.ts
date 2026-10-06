/**
 * Environment variables which are only needed at runtime are not validated when building the app, because a production
 * build must not need access to runtime secrets. We therefore validate the full environment when a server instance
 * starts, so a misconfigured deployment fails immediately, instead of on the first request which happens to read one.
 *
 * Note that next.js does not call `register` during a production build.
 */
export async function register(): Promise<void> {
	await import("#/configs/env.config.ts");
}
