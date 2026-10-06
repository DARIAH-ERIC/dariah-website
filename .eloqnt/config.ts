import { defineConfig } from "@eloqnt/cli";

import { messages, srcPath } from "#/configs/i18n/messages.config.ts";

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
	messages,
	srcPath,
});
