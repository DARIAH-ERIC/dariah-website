import cn from "clsx/lite";
import { connection } from "next/server";
import { useTranslations } from "next-intl";
import { type ComponentProps, type ReactNode, Suspense } from "react";

import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { NavLink } from "@/components/nav-link";
import {
	BlueskyIcon,
	FlickrIcon,
	LinkedInIcon,
	MastodonIcon,
	TwitterIcon,
	YouTubeIcon,
} from "@/components/social-media-icons";
import { useMetadata } from "@/lib/i18n/metadata";
import { createHref } from "@/lib/navigation/create-href";
import type { NavigationConfig, NavigationLink } from "@/lib/navigation/navigation";
import logo from "@/public/assets/images/logo-dariah-eu-white.svg";

interface DefaultFooterProps extends ComponentProps<"footer"> {}

export function DefaultFooter(props: Readonly<DefaultFooterProps>): ReactNode {
	const { className, ...rest } = props;

	const t = useTranslations("DefaultFooter");
	const meta = useMetadata();

	const navigation = {
		home: {
			type: "link",
			href: createHref({ pathname: "/" }),
			label: t("navigation.items.home"),
		},
		contact: {
			type: "link",
			href: createHref({ pathname: "/contact" }),
			label: t("navigation.items.contact"),
		},
		imprint: {
			type: "link",
			href: createHref({ pathname: "/imprint" }),
			label: t("navigation.items.imprint"),
		},
	} satisfies Record<string, NavigationLink>;

	const socialMedia = {
		bluesky: {
			type: "link",
			href: meta.social.bluesky,
			label: t("navigation-social-media.items.bluesky"),
			icon: <BlueskyIcon />,
		},
		flickr: {
			type: "link",
			href: meta.social.flickr,
			label: t("navigation-social-media.items.flickr"),
			icon: <FlickrIcon />,
		},
		linkedin: {
			type: "link",
			href: meta.social.linkedin,
			label: t("navigation-social-media.items.linkedin"),
			icon: <LinkedInIcon />,
		},
		mastodon: {
			type: "link",
			href: meta.social.mastodon,
			label: t("navigation-social-media.items.mastodon"),
			icon: <MastodonIcon />,
		},
		twitter: {
			type: "link",
			href: meta.social.twitter,
			label: t("navigation-social-media.items.twitter"),
			icon: <TwitterIcon />,
		},
		youtube: {
			type: "link",
			href: meta.social.youtube,
			label: t("navigation-social-media.items.youtube"),
			icon: <YouTubeIcon />,
		},
	} satisfies NavigationConfig;

	return (
		<footer
			{...rest}
			className={cn(
				"bg-[#2C3547] text-[#fcfcfc]",
				"mx-auto flex w-full max-w-(--breakpoint-2xl) items-center justify-between gap-x-8 px-6 py-3.5",
				className,
			)}
		>
			<Link href={navigation.home.href}>
				<span className="sr-only">{navigation.home.label}</span>
				<Image alt="" className="h-auto w-48" loading="eager" src={logo} />
			</Link>

			<Suspense>
				<CurrentYear />
			</Suspense>
		</footer>
	);
}

async function CurrentYear() {
	/** Ensure `new Date()` is computed at request time. */
	await connection();

	return <span>{new Date().getUTCFullYear()}</span>;
}
