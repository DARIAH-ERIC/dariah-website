import "next";

declare module "next" {
	interface NavigationRootParams {
		locale: never;
	}
}
