import "server-nodejs-only";

import { client as documentation } from "@/lib/content/client/documentation";
import { client as indexPage } from "@/lib/content/client/index-page";
import { client as navigation } from "@/lib/content/client/navigation";
import type { Client } from "@/lib/content/types";

export const client = {
	collections: {
		documentation,
	},
	singletons: {
		indexPage,
		navigation,
	},
} satisfies Client;
