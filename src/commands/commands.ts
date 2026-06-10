import { Editor, MarkdownView, Notice, Plugin } from "obsidian";
import { Draw } from "src/draw/draw";
import { drawCommands, files } from "src/types";

export class DrawPluginCommands {
	drawer: Draw;
	commands: drawCommands;

	constructor(plugin: Plugin, commands: drawCommands) {
		this.commands = commands;
		// @ts-ignore cus of basepath .-.
		this.drawer = new Draw(plugin.app.vault.adapter.basePath, this.commands);
	}

	getFileName(editor: Editor): files | null {
		let line = editor.getLine(editor.getCursor().line);
		if (!line.startsWith("![[") || !line.endsWith(".png]]")) {
			new Notice("Need an image as ![[path/to/image.png]]");
			return null;
		}
		line = line.replace("![[", "").replace("]]", "").replace("\n", "");
		return this.drawer.enrich({
			file: line.replace(".png", this.commands.filetype),
			dest: line,
		});
	}

	loadCommands(plugin: Plugin) {
		plugin.addCommand({
			id: 'draw-build',
			name: 'Export draw',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const fs = this.getFileName(editor);
				if (!fs) return;
				this.drawer.build(fs);
			}
		});

		plugin.addCommand({
			id: 'draw-open',
			name: 'Open draw',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const fs = this.getFileName(editor);
				if (!fs) return;
				this.drawer.openProgram(fs);
			}
		});

		plugin.addCommand({
			id: 'draw-create',
			name: 'Create draw',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const fs = this.getFileName(editor);
				if (!fs) return;
				this.drawer.create(fs);
			}
		});

		plugin.addCommand({
			id: 'draw',
			name: 'Draw (All)',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const fs = this.getFileName(editor);
				if (!fs) return;
				this.drawer.all(fs);
			}
		});
	}
}
