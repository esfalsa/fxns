import { StatusError } from 'itty-router';
import { shardTags } from './shards';
import { parseNation, parseProposal, parseRegion } from './parsers';

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
		const body = await this.fetch(
			endpoint({ nation, q: Object.values(shardTags.nation).join('+') }),
		).then((res) => res.text());
		return parseNation(body);
	},

	async region(region: string) {
		const body = await this.fetch(
			endpoint({ region, q: Object.values(shardTags.region).join('+') }),
		).then((res) => res.text());
		return parseRegion(body);
	},

	async proposal(id: string) {
		const body = await this.fetch(endpoint({ wa: '', q: 'proposals' })).then(
			(res) => res.text(),
		);
		const proposal = parseProposal(body, id);
		if (!proposal) {
			throw new StatusError(404);
		}
		return proposal;
	},

	async fetch(endpoint: Parameters<typeof fetch>[0]) {
		const res = await fetch(endpoint, {
			headers: {
				'User-Agent': userAgent,
			},
		});

		if (!res.ok) {
			throw new StatusError(res.status);
		}

		return res;
	},
};

export function canonicalize(name: string) {
	return name.toLowerCase().replace(/ /g, '_');
}
