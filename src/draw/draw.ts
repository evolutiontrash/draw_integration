import { spawn } from "child_process";
import { existsSync, mkdirSync } from 'fs';
import { Notice } from "obsidian";
import * as path from "path";
import { drawCommands } from "src/types";

export type files = {
	file: string;
	dest: string;
}

export class Draw {
	settings: drawCommands;
	path: string;

	constructor(vault: string, settings: drawCommands) {
		this.path = vault;
		this.settings = settings;
	}

	public enrich(io: files): files {
		return {
			file: path.join(this.path, this.settings.dest, io.file),
			dest: path.join(this.path, io.dest),
		}
	}

	public create(io: files) {
		if (existsSync(io.file) || existsSync(io.dest)) return;
		const dir = io.file.replace(io.file.split("/").pop()!, "");
		mkdirSync(dir, {recursive: true});
		this.run(this.settings.create, io);
	}

	public open(io: files) {
		this.run(this.settings.open, io);
	}

	public build(io: files) {
		const dir = io.dest.replace(io.dest.split("/").pop()!, "");
		mkdirSync(dir, {recursive: true});
		this.run(this.settings.build, io);
	}

	private filler(template: string, vars: files) {
		return new Function("return `" + template + "`;").call(vars)
	}

	private run(command: string, io: files) {
		const comm = this.filler(command, io);
		const coms = comm.split(" ");
		const child = spawn(coms[0], coms.slice(1));
		child.stdout.on('data', (chunk) => console.log(chunk));
		child.stderr.on('error', (error) => console.log(error)); // Don't know if it works, don't ask.-.
		child.on('close', (code) => new Notice(`exited with ${code}`));
	}
}
