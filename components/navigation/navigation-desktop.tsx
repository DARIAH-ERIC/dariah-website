import type { ReactNode } from "react";

import { NavMenu, NavMenuSeparator, NavMenuTrigger } from "@/components/navigation";
import { Button } from "@/components/ui/button/button";
import { SearchIcon } from "@/components/ui/icons/search";
import { NavButton } from "@/components/ui/navigation/nav-button";
import { NavMenuItem } from "@/components/ui/navigation/nav-menu-item";
import type { NavigationConfig } from "@/lib/navigation/navigation";

interface NavigationDesktopProps {
	navigation: NavigationConfig;
}

export function NavigationDesktop(props: Readonly<NavigationDesktopProps>): ReactNode {
	const { navigation } = props;
	return (
		<div className="hidden flex-wrap items-center gap-6 lg:flex 2xl:gap-22">
			<ul className="flex flex-wrap items-center gap-x-6" role="list">
				{Object.entries(navigation).map(([id, item]) => {
					switch (item.type) {
						case "action": {
							return <li key={id}></li>;
						}

						case "link": {
							return (
								<li key={id}>
									<NavButton href={item.href} isLinkElement={true}>
										{item.label}
									</NavButton>
								</li>
							);
						}

						case "menu": {
							return (
								<li key={id}>
									<NavMenuTrigger>
										<NavButton>{item.label}</NavButton>
										<NavMenu>
											{Object.entries(item.children).map(([id, item]) => {
												switch (item.type) {
													case "action": {
														return (
															<NavMenuItem key={id} onAction={item.onAction}>
																{item.label}
															</NavMenuItem>
														);
													}

													case "link": {
														return (
															<NavMenuItem key={id} href={item.href}>
																{item.label}
															</NavMenuItem>
														);
													}

													case "separator": {
														return <NavMenuSeparator key={id} />;
													}
												}
											})}
										</NavMenu>
									</NavMenuTrigger>
								</li>
							);
						}

						case "separator": {
							return <li key={id}></li>;
						}
					}
				})}
			</ul>
			<Button variant="icon-button">
				<SearchIcon className="size-6" />
			</Button>
		</div>
	);
}
