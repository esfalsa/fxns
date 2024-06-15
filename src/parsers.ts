import { Parser } from 'htmlparser2';
import { Nation, ShardTag, shards } from './nationstates';

export class NationParser {
	private parser: Parser;
	private data: Partial<Nation>;
	private state: ShardTag | null = null;
	private currentText = '';

	constructor() {
		this.data = { admirables: [] };
		this.parser = new Parser(
			{
				onopentag: (name) => {
					if (name in shards) {
						this.state = name as ShardTag;
					}
				},
				ontext: (text) => {
					if (this.state) {
						this.currentText += text;
					}
				},
				onclosetag: () => {
					if (this.state === 'ADMIRABLE') {
						this.data.admirables!.push(this.currentText);
					} else if (this.state === 'POPULATION') {
						this.data.population = Number(this.currentText);
					} else if (this.state) {
						this.data[shards[this.state].propertyName] = this.currentText;
					}

					this.state = null;
					this.currentText = '';
				},
			},
			{
				xmlMode: true,
			},
		);
	}

	write(data: string) {
		this.parser.write(data);
	}

	end() {
		this.parser.end();
	}

	async writeStream(stream: ReadableStream<Uint8Array>) {
		for await (const chunk of stream.pipeThrough(new TextDecoderStream())) {
			// console.log({ chunk, data: this.data });
			this.parser.write(chunk);
		}
		this.parser.end();
	}

	getData() {
		return this.data as Nation;
	}
}
