import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { NavMenu, NavMenuSeparator, NavMenuTrigger } from "@/components/navigation";
import { Button } from "@/components/ui/button/button";
import { SearchIcon } from "@/components/ui/icons/search";
import { Link } from "@/components/ui/link/link";
import { NavButton } from "@/components/ui/navigation/nav-button";
import { NavMenuItem } from "@/components/ui/navigation/nav-menu-item";
import type { NavigationConfig, NavigationLink } from "@/lib/navigation/navigation";
import logo from "@/public/assets/images/logo-dariah-eu.svg";

interface NavigationProps {
	label: string;
	navigation: NavigationConfig & { home: NavigationLink };
}

export function Navigation(props: Readonly<NavigationProps>): ReactNode {
	const { label, navigation } = props;

	return (
		<nav aria-label={label} className="hidden justify-between lg:flex">
			<Link className="py-0!" href={navigation.home.href}>
				<span className="sr-only">{navigation.home.label}</span>
				<Image
					alt=""
					className="w-50 h-15"
					decoding="auto"
					fetchPriority="high"
					loading="eager"
					preload={true}
					src={logo}
				/>
			</Link>

			<div className="flex flex-wrap items-center gap-22">
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
		</nav>
	);
}
