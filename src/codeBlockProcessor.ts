import { parseYaml } from "obsidian";

import { query } from "./query";

import type { FcPlugin } from "./plugin";
import type { FcSettings } from "./settingsTab";

function parseSource(source: string, settings: FcSettings) {
	const { as, on, query } = parseYaml(source);
	return {
		path: on ?? settings.path,
		prompt: query,
		view: as ?? settings.view,
	};
}

function renderResults(
	results: string[],
	into: HTMLElement,
	as: "list" | "gallery"
) {
	if (results.length === 0) {
		into.createEl("p", { text: "No results" });
		return;
	}

	if (as === "list") {
		const ul = into.createEl("ul");
		for (const result of results) {
			const li = ul.createEl("li");
			li.createEl("a", { attr: { href: result }, text: result });
		}
	} else if (as === "gallery") {
		const gallery = into.createDiv({ cls: "fc4r-gallery-grid" });
		for (const result of results) {
			gallery.createEl("img", { attr: { src: result } });
		}
	} else {
		throw new Error(`Unknown view "${as}"`);
	}
}

export function registerCodeBlockProcessor(plugin: FcPlugin) {
	plugin.registerMarkdownCodeBlockProcessor(
		"fc4r",
		async (source, el, ctx) => {
			try {
				const config = parseSource(source, plugin.settings);
				el.createEl("p", {
					text: `QUERY "${config.prompt}" ON "${config.path}"`,
					cls: "blabla",
				});

				const resultsWrapper = el.createDiv();
				resultsWrapper.createEl("p", { text: "Loading..." });

				const results = await query(config);

				resultsWrapper.empty();
				renderResults(results, resultsWrapper, config.view);
			} catch (e) {
				el.innerHTML = e.message;
			}
		}
	);
}
