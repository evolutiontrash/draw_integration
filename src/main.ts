import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import { files, Draw } from "./draw";
import { DrawAppSettings, SettingTab, DEFAULT_SETTINGS } from "./settings"

export default class DrawPlugin extends Plugin {
	settings: DrawAppSettings;
	drawer: Draw;

	getFileName(editor: Editor): files | null {
		let line = editor.getLine(editor.getCursor().line);
		if (!line.startsWith("![[") || !line.endsWith(".png]]")) {
			new Notice("Need an image as ![[path/to/image.png]]");
			return null;
		}
		line = line.replace("![[", "").replace("]]", "").replace("\n", "");
		return this.drawer.enrich({
			file: line.replace(".png", this.settings.filetype),
			dest: line,
		});
	}

	async onload() {
		await this.loadSettings();
		await this.loadDrawer();

		this.addCommand({
			id: 'draw-build',
			name: 'Export draw',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const fs = this.getFileName(editor);
				if (!fs) return;
				this.drawer.build(fs);
			}
		});

		this.addCommand({
			id: 'draw-open',
			name: 'Open draw',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const fs = this.getFileName(editor);
				if (!fs) return;
				this.drawer.create(fs);
				this.drawer.open(fs);
			}
		});

		this.addSettingTab(new SettingTab(this.app, this));

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async loadDrawer() {
		// @ts-ignore cus of basepath .-.
		this.drawer = new Draw(this.app.vault.adapter.basePath, this.settings);
	}
}
