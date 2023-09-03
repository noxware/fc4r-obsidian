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
				el.createEl("p", {
					text: `QUERY "${config.prompt}" ON "${config.path}"`,
				});

				const resultsWrapper = el.createDiv();
				resultsWrapper.createEl("p", { text: "Loading..." });

				const results = await query(config);

				resultsWrapper.empty();
				const resultsEl = resultsWrapper.createEl("ul");
				for (const r of results) {
					resultsEl.createEl("li", { text: r });
				}
			} catch (e) {
				el.innerHTML = e.message;
			}
		}
	);
}
