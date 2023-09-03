import { App, PluginSettingTab, Setting } from "obsidian";

import { FcPlugin } from "./plugin";

export interface FcSettings {
	path: string;
	view: string;
}

export class FcSettingTab extends PluginSettingTab {
	plugin: FcPlugin;

	constructor(app: App, plugin: FcPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Default Path")
			.setDesc("Your FC4R root folder")
			.addText((text) =>
				text
					.setPlaceholder("Example ../")
					.setValue(this.plugin.settings.path)
					.onChange(async (value) => {
						this.plugin.settings.path = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Default View")
			.setDesc("Default rendering of results")
			.addText((text) =>
				text
					.setPlaceholder("Example: gallery")
					.setValue(this.plugin.settings.view)
					.onChange(async (value) => {
						this.plugin.settings.view = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

export function setupSettingTab(plugin: FcPlugin) {
	plugin.addSettingTab(new FcSettingTab(plugin.app, plugin));
}
