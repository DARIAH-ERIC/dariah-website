import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** The skip link's target, so every page's main content has to be rendered with `<Main>`. */
export const mainContentId = "main-content";

interface MainProps extends Omit<ComponentPropsWithoutRef<"main">, "id"> {}

export function Main(props: Readonly<MainProps>): ReactNode {
	return <main {...props} id={mainContentId} />;
}
