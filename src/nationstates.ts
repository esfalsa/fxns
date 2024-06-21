import { StatusError } from 'itty-router';
import {
	NationParser,
	ProposalsParser,
	RegionParser,
	type GenericParser,
} from './parsers';
import { shardTags, type EndpointType } from './shards';

const base = 'https://www.nationstates.net/cgi-bin/api.cgi';
const userAgent = 'fxns/0.1.0 (by:Esfalsa)';

function endpoint(params: Record<string, string>) {
	const res = [];
	for (const key in params) {
		res.push(key + '=' + params[key]);
	}
	return base + '?' + res.join('&');
}

export const nationstates = {
	async nation(nation: string) {
		return await this.fetch<'nation'>(
			endpoint({ nation, q: Object.values(shardTags.nation).join('+') }),
			new NationParser(),
		);
	},

	async region(region: string) {
		return await this.fetch<'region'>(
			endpoint({ region, q: Object.values(shardTags.region).join('+') }),
			new RegionParser(),
		);
	},

	async proposal(id: string) {
		return await this.fetch<'proposals'>(
			// apparent an empty value for the `wa` parameter returns data from both
			// the GA and SC, letting us avoid making two separate requests since the
			// URL of a proposal on NationStates includes only the proposal ID and
			// not which chamber it was proposed in.
			endpoint({ wa: '', q: 'proposals' }),
			new ProposalsParser(id),
		);
	},

	async fetch<T extends EndpointType>(
		endpoint: Parameters<typeof fetch>[0],
		parser: GenericParser<T>,
		options?: Parameters<typeof fetch>[1],
	) {
		const res = await fetch(endpoint, {
			...options,
			headers: {
				...options?.headers,
				'User-Agent': userAgent,
			},
		});

		if (!res.ok) {
			throw new StatusError(res.status);
		}

		if (!res.body) {
			throw new StatusError(500);
		}

		// the `body` of a fetch response should be a `ReadableStream<Uint8Array>`
		// when read incrementally (see https://fetch.spec.whatwg.org/#bodies).
		// while the TypeScript DOM library types it as such,
		// `@cloudflare/workers-types` doesn't, but this seems to work fine.
		return parser.parseStream(res.body as ReadableStream<Uint8Array>);
	},
};

export function canonicalize(name: string) {
	return name.toLowerCase().replace(/ /g, '_');
}
