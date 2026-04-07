import {
	BlueskyIcon,
	EmailIcon,
	FacebookIcon,
	FlickrIcon,
	GitHubIcon,
	InstagramIcon,
	LinkedInIcon,
	MastodonIcon,
	OrcidIcon,
	RssIcon,
	TwitterIcon,
	VimeoIcon,
	WebsiteIcon,
	YouTubeIcon,
} from "@/lib/social-media/social-media-icons";

export const config = {
	bluesky: { icon: BlueskyIcon },
	email: { icon: EmailIcon },
	facebook: { icon: FacebookIcon },
	flickr: { icon: FlickrIcon },
	github: { icon: GitHubIcon },
	instagram: { icon: InstagramIcon },
	linkedin: { icon: LinkedInIcon },
	mastodon: { icon: MastodonIcon },
	orcid: { icon: OrcidIcon },
	rss: { icon: RssIcon },
	twitter: { icon: TwitterIcon },
	website: { icon: WebsiteIcon },
	youtube: { icon: YouTubeIcon },
	vimeo: { icon: VimeoIcon },
};

export type SocialMediaKind = keyof typeof config;
