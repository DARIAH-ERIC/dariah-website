import {
	type MiddlewareConfig,
	type NextMiddleware,
	type NextRequest,
	NextResponse,
} from "next/server";

export const middleware: NextMiddleware = (_request: NextRequest) => {
	return NextResponse.next();
};

export const config: MiddlewareConfig = {
	matcher: [
		"/",
		/**
		 * Next.js does not support arbitrary expressions for `matcher`.
		 *
		 * @see https://github.com/vercel/next.js/issues/56398
		 */
		"/:path*",
		"/api/:path*",
	],
};
