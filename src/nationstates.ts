import { StatusError } from 'itty-router';
import { shardTags } from './shards';
import { parseNation, parseProposal, parseRegion } from './parsers';

const base = 'https://www.nationstates.net/cgi-bin/api.cgi';
const userAgent = 'fxns/0.1.0 (by:Esfalsa)';

function endpoint(params: Record<string, string>) {
	const url = new URL(base);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.append(key, value);
	}
	return url.toString();
}

export const nationstates = {
	async nation(name: string) {
		const body = await this.fetch(
			endpoint({ nation: name, q: Object.values(shardTags.nation).join('+') }),
		).then((res) => res.text());
		const nation = parseNation(body);
		if (!nation) {
			throw new StatusError(404);
		}
		return nation;
	},

	async region(name: string) {
		const body = await this.fetch(
			endpoint({ region: name, q: Object.values(shardTags.region).join('+') }),
		).then((res) => res.text());
		const region = parseRegion(body);
		if (!region) {
			throw new StatusError(404);
		}
		return region;
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
