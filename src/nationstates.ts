import { StatusError } from 'itty-router';
import { NationParser } from './parsers';

const base = 'https://www.nationstates.net/cgi-bin/api.cgi';
const userAgent = 'fxns/0.1.0 (by:Esfalsa)';

function endpoint(params: Record<string, string>) {
	const res = [];
	for (const key in params) {
		res.push(key + '=' + params[key]);
	}
	return base + '?' + res.join('&');
}

export const shards = {
	NAME: { propertyName: 'name', shardName: 'name' },
	TYPE: { propertyName: 'type', shardName: 'type' },
	CATEGORY: { propertyName: 'category', shardName: 'category' },
	FLAG: { propertyName: 'flag', shardName: 'flag' },
	POPULATION: { propertyName: 'population', shardName: 'population' },
	DEMONYM2PLURAL: {
		propertyName: 'demonymPlural',
		shardName: 'demonym2plural',
	},
	NOTABLE: { propertyName: 'notable', shardName: 'notable' },
	ADMIRABLE: { propertyName: 'admirables', shardName: 'admirables' },
} as const;

export type ShardTag = keyof typeof shards;
export type ShardProperty = (typeof shards)[ShardTag]['propertyName'];
export type ShardValue<S extends ShardProperty> =
	S extends 'population' ? number
	: S extends 'admirables' ? string[]
	: string;

export type Nation = { [P in ShardProperty]: ShardValue<P> };

const serializedShards = Object.values(shards)
	.map(({ shardName }) => shardName)
	.join('+');

export const nationstates = {
	async nation(nation: string) {
		const res = await fetch(endpoint({ nation, q: serializedShards }), {
			headers: {
				'User-Agent': userAgent,
			},
		});

		if (!res.ok) {
			throw new StatusError(res.status);
		}

		if (!res.body) {
			throw new StatusError(500);
		}

		const parser = new NationParser();
		await parser.writeStream(res.body);

		return parser.getData() as Nation;
	},
};

export function canonicalize(name: string) {
	return name.toLowerCase().replace(/ /g, '_');
}
