import type { ReactNode } from "react";

import { Image } from "@/components/image";
import {
	NavLink,
	NavMenu,
	NavMenuButton,
	NavMenuItem,
	NavMenuSeparator,
	NavMenuTrigger,
} from "@/components/navigation";
import type { NavigationConfig, NavigationLink } from "@/lib/navigation/navigation";
import logo from "@/public/assets/images/logo-dariah-eu.svg";

interface NavigationProps {
	label: string;
	navigation: NavigationConfig & { home: NavigationLink };
}

export function Navigation(props: Readonly<NavigationProps>): ReactNode {
	const { label, navigation } = props;

	return (
		<nav aria-label={label} className="hidden lg:flex lg:gap-x-6">
			<NavLink href={navigation.home.href}>
				<span className="sr-only">{navigation.home.label}</span>
				<Image
					alt=""
					className="h-8 w-auto"
					decoding="auto"
					fetchPriority="high"
					loading="eager"
					preload={true}
					src={logo}
				/>
			</NavLink>

			<ul className="flex flex-wrap items-center gap-x-2" role="list">
				{Object.entries(navigation).map(([id, item]) => {
					switch (item.type) {
						case "action": {
							return <li key={id}></li>;
						}

						case "link": {
							return (
								<li key={id}>
									<NavLink href={item.href}>{item.label}</NavLink>
								</li>
							);
						}

						case "menu": {
							return (
								<li key={id}>
									<NavMenuTrigger>
										<NavMenuButton>{item.label}</NavMenuButton>
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
		</nav>
	);
}
