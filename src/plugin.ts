import { Plugin } from "obsidian";

import { setupSettingTab } from "./settingsTab";
import { registerCodeBlockProcessor } from "./codeBlockProcessor";

import type { FcSettings } from "./settingsTab";

const defaultSettings: FcSettings = {
	path: "../",
};

export class FcPlugin extends Plugin {
	settings: FcSettings;

	async onload() {
		await this.loadSettings();

		setupSettingTab(this);
		registerCodeBlockProcessor(this);
	}

	onunload() {}

	async loadSettings() {
		this.settings = {
			...defaultSettings,
			...(await this.loadData()),
		};
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
