import { Parser as XMLParser } from 'htmlparser2';
import {
	isShardTag,
	type EndpointType,
	type ShardObject,
	type ShardTag,
} from './shards';

export abstract class GenericParser<T extends EndpointType> {
	private parser: XMLParser;
	private _data: Partial<ShardObject<T>>;
	private state: ShardTag<T> | null = null;
	private currentText = '';
	private emptyData: Partial<ShardObject<T>>;

	constructor(
		endpoint: T,
		handlers: {
			[tag in ShardTag<T>]: (
				text: string,
				data: Partial<ShardObject<T>>,
			) => void;
		},
		options: { initialData?: Partial<ShardObject<T>> } = {},
	) {
		this.emptyData = options?.initialData || {};
		this._data = structuredClone(this.emptyData);
		this.parser = new XMLParser(
			{
				onopentag: (name) => {
					if (isShardTag(name, endpoint)) {
						this.state = name;
					}
				},
				ontext: (text) => {
					if (this.state) {
						this.currentText += text;
					}
				},
				onclosetag: (name) => {
					if (name !== this.state) {
						return;
					}

					if (this.state) {
						handlers[this.state](this.currentText, this._data);
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

	write(chunk: string) {
		this.parser.write(chunk);
	}

	end() {
		this.parser.end();
	}

	async parseStream(
		stream: ReadableStream<Uint8Array>,
	): Promise<ShardObject<T>> {
		this.reset();
		for await (const chunk of stream.pipeThrough(new TextDecoderStream())) {
			this.parser.write(chunk);
		}
		this.parser.end();
		return this._data as ShardObject<T>;
	}

	/**
	 * Resets the parser to a blank state, clearing all parsed data.
	 */
	reset() {
		this.parser.reset();
		this._data = structuredClone(this.emptyData);
		this.state = null;
		this.currentText = '';
	}

	get data() {
		return this._data;
	}
}

export class NationParser extends GenericParser<'nation'> {
	constructor() {
		super('nation', {
			ADMIRABLE: (text, data) => {
				data.admirables ||= [];
				data.admirables.push(text);
			},
			POPULATION: (text, data) => {
				data.population = Number(text);
			},
			CATEGORY: (text, data) => {
				data.category = text;
			},
			DEMONYM2PLURAL: (text, data) => {
				data.demonym2plural = text;
			},
			FLAG: (text, data) => {
				data.flag = text;
			},
			NAME: (text, data) => {
				data.name = text;
			},
			NOTABLE: (text, data) => {
				data.notable = text;
			},
			TYPE: (text, data) => {
				data.type = text;
			},
		});
	}
}

export class RegionParser extends GenericParser<'region'> {
	constructor() {
		super('region', {
			NAME: (text, data) => {
				data.name = text;
			},
			NUMNATIONS: (text, data) => {
				data.numnations = Number(text);
			},
		});
	}
}
