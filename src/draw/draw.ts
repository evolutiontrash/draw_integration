import { spawn } from "child_process";
import { existsSync, mkdirSync } from 'fs';
import * as path from "path";
import { drawCommands, files } from "src/types";

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

	public async all(io: files) {
		await this.create(io);
		await this.openProgram(io);
		await this.build(io);
	}

	public async create(io: files) {
		if (existsSync(io.file) || existsSync(io.dest)) return;
		const dir = io.file.replace(io.file.split("/").pop()!, "");
		mkdirSync(dir, { recursive: true });
		await this.exec(this.settings.create, io);
	}

	public async openProgram(io: files) {
		await this.exec(this.settings.open, io);
	}

	public async build(io: files) {
		const dir = io.dest.replace(io.dest.split("/").pop()!, "");
		mkdirSync(dir, { recursive: true });
		await this.exec(this.settings.build, io);
	}

	private filler(template: string, vars: files) {
		return new Function("return `" + template + "`;").call(vars)
	}

	private exec(command: string, io: files): Promise<number> {
		return new Promise((resolve, reject) => {
			const comm = this.filler(command, io);
			const coms = comm.split(" ");
			const child = spawn(coms[0], coms.slice(1));
			child.stdout.on('data', data => {
				console.log(`${io.dest}, ${data}`)
			})
			child.stderr.on('error', err => {
				console.error(`${io.dest}, ${err}`)
			})
			child.on('close', code => {
				console.log(`${io.dest}, ${code}`)
				if (code === 0) {
					resolve(code)
				} else {
					reject(code)
				}
			});
		})
	}
}
