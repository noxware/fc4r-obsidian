import { parseYaml } from "obsidian";

import { query } from "./query";

import type { FcPlugin } from "./plugin";
import type { FcSettings } from "./settingsTab";

function parseSource(source: string, settings: FcSettings) {
	const { on, query } = parseYaml(source);
	return {
		path: on ?? settings.path,
		prompt: query,
	};
}

export function registerCodeBlockProcessor(plugin: FcPlugin) {
	plugin.registerMarkdownCodeBlockProcessor(
		"fc4r",
		async (source, el, ctx) => {
			try {
				const config = parseSource(source, plugin.settings);
				el.createEl("pre", {
					text: JSON.stringify(config, null, "  "),
				});
				const results = await query(config);
				el.createEl("pre", { text: results.join("\n") });
			} catch (e) {
				el.innerHTML = e.message;
			}
		}
	);
}
