import { StatusError } from 'itty-router';
import { Parser } from 'htmlparser2';

const base = 'https://www.nationstates.net/cgi-bin/api.cgi';
const userAgent = 'fxns/0.1.0 (by:Esfalsa)';

function endpoint(params: Record<string, string>) {
	const res = [];
	for (const key in params) {
		res.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]!));
	}
	return base + '?' + res.join('&');
}

const shards = {
	NAME: { propertyName: 'name', shardName: 'name' },
	TYPE: { propertyName: 'type', shardName: 'type' },
	CATEGORY: { propertyName: 'category', shardName: 'category' },
	FLAG: { propertyName: 'flag', shardName: 'flag' },
	POPULATION: { propertyName: 'population', shardName: 'population' },
	DEMONYM2PLURAL: { propertyName: 'demonymPlural', shardName: 'demonym2plural' },
	NOTABLE: { propertyName: 'notable', shardName: 'notable' },
	ADMIRABLE: { propertyName: 'admirables', shardName: 'admirables' },
} as const;

type ShardTag = keyof typeof shards;
type ShardProperty = (typeof shards)[ShardTag]['propertyName'];
type ShardValue<S extends ShardProperty> =
	S extends 'population' ? number
	: S extends 'admirables' ? string[]
	: string;

export type Nation = { [P in ShardProperty]: ShardValue<P> };

export const nationstates = {
	async nation(nation: string) {
		const res = await fetch(
			endpoint({
				nation,
				q: Object.values(shards)
					.map(({ shardName }) => shardName)
					.join('+'),
			}),
			{
				headers: {
					'User-Agent': userAgent,
				},
			},
		);

		if (!res.ok) {
			throw new StatusError(res.status);
		}

		if (!res.body) {
			throw new StatusError(500);
		}

		// we store text from the response as strings so that we can easiily
		// concatenate them if they are split across multiple chunks
		const data: Record<ShardProperty, string> = {
			name: '',
			type: '',
			category: '',
			flag: '',
			population: '',
			demonymPlural: '',
			notable: '',
			admirables: '',
		};
		let state: ShardProperty | null = null;

		const nationParser = new Parser(
			{
				onopentag(name) {
					if (name in shards) {
						state = shards[name as ShardTag].propertyName;
					}
				},
				ontext(text) {
					if (!state) {
						return;
					}

					data[state] += text;
				},
				onclosetag() {
					// separate admirals with a comma so we can split it later
					if (state === 'admirables') {
						data[state] += ',';
					}

					state = null;
				},
			},
			{
				xmlMode: true,
			},
		);

		for await (const chunk of res.body.pipeThrough(new TextDecoderStream())) {
			nationParser.write(chunk);
		}

		nationParser.end();

		return {
			name: data.name,
			type: data.type,
			category: data.category,
			flag: data.flag,
			population: Number(data.population),
			demonymPlural: data.demonymPlural,
			notable: data.notable,
			admirables: data.admirables.split(',').slice(0, -1),
		} satisfies Nation;
	},
};

export function canonicalize(nation: string) {
	return nation.toLowerCase().replace(/ /g, '_');
}
