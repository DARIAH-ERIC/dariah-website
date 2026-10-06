import blueskyLogo from "#/assets/images/logo-bluesky.svg";
import facebookLogo from "#/assets/images/logo-facebook.svg";
import flickrLogo from "#/assets/images/logo-flickr.svg";
import instagramLogo from "#/assets/images/logo-instagram.svg";
import linkedinLogo from "#/assets/images/logo-linkedin.svg";
import mastodonLogo from "#/assets/images/logo-mastodon.svg";
import twitterLogo from "#/assets/images/logo-twitter.svg";
import vimeoLogo from "#/assets/images/logo-vimeo.svg";
import websiteLogo from "#/assets/images/logo-website.svg";
import youtubeLogo from "#/assets/images/logo-youtube.svg";
import type { SiteMetadata } from "#/lib/api/schemas.ts";

export type SocialMediaKind = SiteMetadata["socialMedia"][number]["type"];

/**
 * Each social media service's mark, e.g. for the footer's links or a member's. `other` has no mark of its own, so it
 * falls back to the generic globe. `next/image` is off limits here, so the static import itself stands in for
 * `StaticImageData`. Being `<img>`s, the marks cannot pick up `currentColor`: their `--color-icon-accent` is baked into
 * the files as `#0870ac`, and has to be kept in sync by hand.
 */
export const socialMediaLogos: Record<SocialMediaKind, typeof blueskyLogo> = {
	bluesky: blueskyLogo,
	facebook: facebookLogo,
	flickr: flickrLogo,
	instagram: instagramLogo,
	linkedin: linkedinLogo,
	mastodon: mastodonLogo,
	other: websiteLogo,
	twitter: twitterLogo,
	vimeo: vimeoLogo,
	website: websiteLogo,
	youtube: youtubeLogo,
};
