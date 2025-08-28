import type metadata from "@/content/en-GB/metadata/index.json";
import { defaultLocale } from "@/lib/i18n/locales";
import type messages from "@/messages/en-GB.json";

type Messages = typeof messages;
type Metadata = typeof metadata;

export async function getIntlMessages() {
	const _messages = (await import(`@/messages/${defaultLocale}.json`)) as Messages;
	const _metadata = (await import(`@/content/${defaultLocale}/metadata/index.json`)) as Metadata;

	const _social: Record<string, string> = {};

	_metadata.social.forEach((entry) => {
		_social[entry.kind] = entry.href;
	});

	const messages = {
		..._messages,
		metadata: {
			..._metadata,
			social: _social,
		},
	};

	return messages;
}

export type IntlMessages = Awaited<ReturnType<typeof getIntlMessages>>;
