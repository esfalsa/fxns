import { Parser as XMLParser } from 'htmlparser2';
import {
	isShardTag,
	type EndpointType,
	type ShardObject,
	type ShardTag,
} from './shards';

type ParserOptions<T extends EndpointType> = {
	handlers?: {
		[tag in ShardTag<T>]?: (
			text: string,
			data: Partial<ShardObject<T>>,
		) => void;
	};
	/**
	 * A matcher that checks whether a tag is the root tag to start parsing. For
	 * example, the API only allows retrieving all proposals at once, rather than
	 * a single proposal, so the parser should only start parsing if the root tag
	 * is a <PROPOSAL> tag with the correct ID attribute.
	 *
	 * @param name the name of the tag
	 * @param attribs the attributes of the tag
	 * @returns whether or not the tag is the root tag
	 */
	rootOpenMatcher?: (name: string, attribs: Record<string, string>) => boolean;
	/**
	 * A matcher that checks whether a tag is the root tag to stop parsing.
	 * @param name the name of the tag
	 * @returns whether or not the tag is the root tag
	 */
	rootCloseMatcher?: (name: string) => boolean;
	initialData?: Partial<ShardObject<T>>;
};

export abstract class GenericParser<T extends EndpointType> {
	private parser: XMLParser;
	private _data: Partial<ShardObject<T>>;
	private state: ShardTag<T> | null = null;
	private currentText = '';
	private options: ParserOptions<T>;
	private inRoot: boolean;

	constructor(endpoint: T, options: ParserOptions<T> = {}) {
		this.options = options;
		this._data = this.options.initialData || {};
		this.inRoot = !options.rootOpenMatcher; // start parsing if no root matcher
		this.parser = new XMLParser(
			{
				onopentag: (name, attribs) => {
					// if we are not in a root element, check if we should start parsing
					if (!this.inRoot) {
						this.inRoot = this.options.rootOpenMatcher!(name, attribs);
						return;
					}

					if (isShardTag(name, endpoint)) {
						this.state = name;
					}
				},
				ontext: (text) => {
					if (this.inRoot && this.state) {
						this.currentText += text;
					}
				},
				onclosetag: (name) => {
					if (this.inRoot && this.options.rootCloseMatcher?.(name)) {
						this.inRoot = false;
						this.state = null;
						this.currentText = '';
						return;
					}

					if (name !== this.state) {
						return;
					}

					if (this.state && this.options.handlers?.[this.state]) {
						this.options.handlers[this.state]!(this.currentText, this._data);
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

	parseString(str: string): ShardObject<T> {
		// this.reset();
		this.parser.write(str);
		this.parser.end();
		return this._data as ShardObject<T>;
	}

	/**
	 * Resets the parser to a blank state, clearing all parsed data.
	 */
	reset() {
		this.parser.reset();
		this._data = this.options.initialData || {};
		this.state = null;
		this.currentText = '';
	}

	get data() {
		return this._data;
	}
}

export class NationParser extends GenericParser<'nation'> {
	static initialData = {
		admirables: [],
	};

	constructor() {
		super('nation', {
			handlers: {
				ADMIRABLE: (text, data) => {
					data.admirables!.push(text);
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
			},
			initialData: NationParser.initialData,
		});
	}
}

export class RegionParser extends GenericParser<'region'> {
	constructor() {
		super('region', {
			handlers: {
				NAME: (text, data) => {
					data.name = text;
				},
				NUMNATIONS: (text, data) => {
					data.numnations = Number(text);
				},
			},
		});
	}
}

export class ProposalsParser extends GenericParser<'proposals'> {
	static initialData = {
		approvals: [],
		discard: [],
		illegal: [],
		legal: [],
	};

	constructor(id: string) {
		super('proposals', {
			handlers: {
				CATEGORY: (text, data) => {
					data.category = text;
				},
				APPROVALS: (text, data) => {
					data.approvals = text.split(':');
				},
				CREATED: (text, data) => {
					data.created = new Date(Number(text) * 1000);
				},
				// the API uses <DISCARD>, <ILLEGAL>, and <LEGAL> tags both for
				// containing the name of the GenSec voter and to contain those tags, so
				// text may be empty
				DISCARD: (text, data) => {
					if (text) {
						data.discard!.push(text.trim());
					}
				},
				ILLEGAL: (text, data) => {
					if (text) {
						data.illegal!.push(text.trim());
					}
				},
				LEGAL: (text, data) => {
					if (text) {
						data.legal!.push(text.trim());
					}
				},
				NAME: (text, data) => {
					data.name = text;
				},
				PROPOSED_BY: (text, data) => {
					data.proposedBy = text;
				},
			},
			// the API only allows retrieving all proposals at once, so we need to
			// only start parsing if the root tag is for the <PROPOSAL> element with
			// the correct proposal ID
			rootOpenMatcher(name, attribs) {
				return name === 'PROPOSAL' && attribs.id === id;
			},
			rootCloseMatcher(name) {
				return name === 'PROPOSAL';
			},
			initialData: ProposalsParser.initialData,
		});
	}
}
