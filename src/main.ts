import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { query } from "./query";
import { parseYaml } from "obsidian";

interface FcSettings {
	mySetting: string;
}

const defaultSettings: FcSettings = {
	mySetting: "default",
};

export default class FcPlugin extends Plugin {
	settings: FcSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new FcSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor(
			"fc4r",
			async (source, el, ctx) => {
				try {
					const config = parseYaml(source);
					const results = await query({
						prompt: config.query,
						path: "D:\\User\\Google Drive\\Default",
					});
					el.createEl("pre", { text: results.join("\n") });
				} catch (e) {
					el.innerHTML = e.message;
				}
			}
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = {
			defaultSettings,
			...(await this.loadData()),
		};
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class FcSettingTab extends PluginSettingTab {
	plugin: FcPlugin;

	constructor(app: App, plugin: FcPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
