import { Plugin } from 'obsidian';
import { DrawPluginCommands } from './commands/commands';
import { SettingTab, DEFAULT_SETTINGS } from "./settings/settings"
import { drawCommands } from './types';

export default class DrawPlugin extends Plugin {
	commands: drawCommands;
	oCommands: DrawPluginCommands


	async onload() {
		await this.loadSettings();
		await this.loadCommands();


		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.commands = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.addSettingTab(new SettingTab(this.app, this));
	}

	async saveSettings() {
		await this.saveData(this.commands);
	}

	async loadCommands() {
		this.oCommands = new DrawPluginCommands(this, this.commands);
		this.oCommands.onLoad()
	}
}
