import { PluginSettingTab, App, Setting } from 'obsidian';
import DrawPlugin from '../main';
import { drawCommands } from 'src/types';

export const DEFAULT_SETTINGS: drawCommands = {
	create: "cp ~/Templates/draw.kra ${this.file}",
	open: "krita ${this.file}",
	build: "krita ${this.file} --export --export-filename ${this.dest}",
	dest: ".krita",
	filetype: ".kra",
}

export class SettingTab extends PluginSettingTab {
	plugin: DrawPlugin;

	async writer(mod: string, value: string) {
		mod = value
		await this.plugin.saveSettings();
	}

	constructor(app: App, plugin: DrawPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Destiny')
			.setDesc('The destiny for the project files (better to have them apart).')
			.addText(text =>
				text
					.setPlaceholder('.krita')
					.setValue(this.plugin.commands.dest)
					.onChange(async (value) => {
						this.plugin.commands.dest = value;
						await this.plugin.saveSettings();
					})
					.inputEl.addClass('large-text-field'))
		new Setting(containerEl)
			.setName('File extension')
			.setDesc('following .kra, .ora, etc.')
			.addText(text =>
				text
					.setPlaceholder('.kra')
					.setValue(this.plugin.commands.filetype)
					.onChange(async (value) => {
						this.plugin.commands.filetype = value;
						await this.plugin.saveSettings();
					})
					.inputEl.addClass('large-text-field'));
		new Setting(containerEl)
			.setName('Creation command')
			.setDesc('How you create a draw from the command line. (kra, svg, psd, etc). You might require the {this.file} to indicate where it should be created.')
			.addText(text => text
				.setPlaceholder('cp /path/to/template/draw.kra ${this.file}')
				.setValue(this.plugin.commands.create)
				.onChange(async (value) => {
					this.plugin.commands.create = value;
					await this.plugin.saveSettings();
				})
				.inputEl.addClass('large-text-field'));
		new Setting(containerEl)
			.setName('Open command')
			.setDesc('You might require {this.file} to indicate your program where is the file.')
			.addText(text => text
				.setPlaceholder('krita ${this.file}')
				.setValue(this.plugin.commands.open)
				.onChange(async (value) => {
					this.plugin.commands.open = value;
					await this.plugin.saveSettings();
				})
				.inputEl.addClass('large-text-field'));
		new Setting(containerEl)
			.setName('Build command')
			.setDesc('Command to build your draw. {this.file} for the location of the project, {this.dest} to where it should be exported.')
			.addText(text => text
				.setPlaceholder('magick {this.file} {this.dest}')
				.setValue(this.plugin.commands.build)
				.onChange(async (value) => {
					this.plugin.commands.build = value;
					await this.plugin.saveSettings();
				})
				.inputEl.addClass('large-text-field'));
	}
}
