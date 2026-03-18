"use client";

import { type ReactNode, useState } from "react";

import { Image } from "@/components/image";
import { NavigationDesktop } from "@/components/navigation/navigation-desktop";
import { NavigationMobile } from "@/components/navigation/navigation-mobile";
import { Button } from "@/components/ui/button/button";
import { CloseIcon } from "@/components/ui/icons/close";
import { MenuIcon } from "@/components/ui/icons/menu";
import { Link } from "@/components/ui/link/link";
import type { NavigationConfig, NavigationLink } from "@/lib/navigation/navigation";
import logo from "@/public/assets/images/logo-dariah-eu.svg";

interface NavigationProps {
	label: string;
	navigation: NavigationConfig & { home: NavigationLink };
}

export function Navigation(props: Readonly<NavigationProps>): ReactNode {
	const { label, navigation } = props;
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleMobileMenuToggle = (): void => {
		document.body.style.overflow = isMobileMenuOpen ? "" : "hidden";
		setIsMobileMenuOpen((prev) => {
			return !prev;
		});
	};

	const { home, ...menuNavigation } = navigation;

	return (
		<>
			<nav aria-label={label} className="justify-between flex items-center">
				<Link
					className="py-0!"
					href={home.href}
					onClick={() => {
						if (isMobileMenuOpen) handleMobileMenuToggle();
					}}
				>
					<span className="sr-only">{home.label}</span>
					<Image
						alt=""
						className="w-35.5 xl:w-50 xl:h-15"
						decoding="auto"
						fetchPriority="high"
						loading="eager"
						preload={true}
						src={logo}
					/>
				</Link>

				<NavigationDesktop navigation={menuNavigation} />
				<Button className="lg:hidden" onClick={handleMobileMenuToggle} variant="icon-button">
					{isMobileMenuOpen ? (
						<CloseIcon className="fill-primary! size-8 lg:hidden" />
					) : (
						<MenuIcon className="fill-primary! size-8 lg:hidden" />
					)}
				</Button>
			</nav>
			{isMobileMenuOpen && (
				<NavigationMobile
					handleMobileMenuToggle={handleMobileMenuToggle}
					navigation={menuNavigation}
				/>
			)}
		</>
	);
}
