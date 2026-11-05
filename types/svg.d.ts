/** The markup of an svg, from the `?raw` rule in `next.config.ts`. */
declare module "*.svg?raw" {
	const markup: string;

	export default markup;
}
