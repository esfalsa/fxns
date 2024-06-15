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

export type Nation = {
	name: string;
	type: string;
	category: string;
	flag: string;
};

export const nationstates = {
	async nation(nation: string) {
		const res = await fetch(
			endpoint({
				nation,
				q: 'name+type+category+flag',
			}),
			{
				headers: {
					'User-Agent': userAgent,
				},
			}
		);

		if (!res.ok) {
			throw new StatusError(res.status);
		}

		if (!res.body) {
			throw new StatusError(500);
		}

		const data: Partial<Nation> = {};
		let state: keyof Nation | null = null;

		const nationParser = new Parser(
			{
				onopentag(name) {
					switch (name) {
						case 'NAME':
							state = 'name';
							break;
						case 'TYPE':
							state = 'type';
							break;
						case 'CATEGORY':
							state = 'category';
							break;
						case 'FLAG':
							state = 'flag';
							break;
					}
				},
				ontext(text) {
					if (state) {
						data[state] = text;
					}
				},
				onclosetag() {
					state = null;
				},
			},
			{
				xmlMode: true,
			}
		);

		for await (const chunk of res.body.pipeThrough(new TextDecoderStream())) {
			nationParser.write(chunk);
		}

		nationParser.end();

		return data as Nation;
	},
};

export function canonicalize(nation: string) {
	return nation.toLowerCase().replace(/ /g, '_');
}
