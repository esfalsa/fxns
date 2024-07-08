import type { StatusError } from 'itty-router';
import { error } from 'itty-router';
import { canonicalize } from './nationstates';
import type { Nation, Proposal, Region } from './shards';
import { html } from './escaping';
import type { Awaitable } from './types';

export class HTMLResponse extends Response {
	constructor(body: string, init?: ResponseInit) {
		super(body, {
			headers: {
				'Content-Type': 'text/html;charset=UTF-8',
				...init?.headers,
			},
			...init,
		});
	}
}

export class OpenGraphResponse extends HTMLResponse {
	constructor({
		canonicalURL,
		title,
		description,
		image,
		imageAlt,
	}: {
		canonicalURL: string;
		title: string;
		description: string;
		image: string;
		imageAlt: string;
	}) {
		super(
			html`<!doctype html>
				<html lang="en">
					<head>
						<meta charset="UTF-8" />
						<link rel="canonical" href="${canonicalURL}" />

						<title>${title}</title>
						<meta name="description" content="${description}" />

						<!-- required Open Graph metadata -->
						<meta property="og:title" content="${title}" />
						<meta property="og:type" content="website" />
						<meta property="og:image" content="${image}" />
						<meta property="og:url" content="${canonicalURL}" />

						<!-- optional Open Graph metadata -->
						<meta property="og:description" content="${description}" />
						<meta property="og:site_name" content="NationStates" />

						<!-- structured properties Open Graph metadata -->
						<meta property="og:image:alt" content="${imageAlt}" />

						<!-- non-standard Open Graph metadata -->
						<meta property="og:ignore_canonical" content="true" />

						<!-- Twitter metadata -->
						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:site" content="@NationStates" />
						<meta name="twitter:description" content="${description}" />
						<meta name="twitter:title" content="${title}" />
						<meta name="twitter:image" content="${image}" />
						<meta name="twitter:image:alt" content="${imageAlt}" />
					</head>
					<body></body>
				</html>`,
		);
	}
}

export class NationResponse extends OpenGraphResponse {
	constructor(nation: Nation) {
		const admirables = nation.admirables
			.sort(() => 0.5 - Math.random())
			.slice(0, 3);
		const population =
			nation.population > 1000 ?
				`${(nation.population / 1000).toFixed(3)} billion`
			:	`${nation.population} million`;

		const description = `${admirables[0]!.charAt(0).toUpperCase() + admirables[0]!.slice(1)}, ${admirables[1]}, and ${admirables[2]} ${nation.category} with ${population} ${nation.demonym2plural}, notable for its ${nation.notable}.`;

		super({
			canonicalURL: `https://www.nationstates.net/nation=${canonicalize(nation.name)}`,
			title: `The ${nation.type} of ${nation.name}`,
			description,
			image: nation.flag,
			imageAlt: `Flag of ${nation.name}`,
		});
	}
}

export class RegionResponse extends OpenGraphResponse {
	constructor(region: Region) {
		let size = '';
		for (const sizeTag of [
			'Gargantuan',
			'Enormous',
			'Large',
			'Medium',
			'Small',
			'Minuscule',
		]) {
			if (region.tags.has(sizeTag)) {
				size = sizeTag.toLocaleLowerCase('en-US');
				break;
			}
		}

		let kind = 'region';
		for (const kindTag of [
			'Feeder',
			'Frontier',
			'Class',
			'Warzone',
			'Restorer',
			'Sinker',
		]) {
			if (region.tags.has(kindTag)) {
				kind = kindTag.toLocaleLowerCase('en-US');
				break;
			}
		}

		let leaders = '';
		if (region.founder) {
			leaders += `founded by ${region.founder}`;
			if (region.delegate || region.governor) {
				leaders += ' and ';
			}
		}
		if (region.delegate && region.governor) {
			leaders += `led by Delegate ${region.delegate} and Governor ${region.governor}`;
		} else if (region.delegate) {
			leaders += `led by Delegate ${region.delegate}`;
		} else if (region.governor) {
			leaders += `led by Governor ${region.governor}`;
		}

		super({
			canonicalURL: `https://www.nationstates.net/region=${canonicalize(region.name)}`,
			title: region.name,
			description: `A ${size} ${kind} with ${region.numnations.toLocaleString('en-US')} nations and ${region.power.toLocaleLowerCase('en-US')} regional power, ${leaders}.`,
			image: region.flag,
			imageAlt: `Flag of ${region.name}`,
		});
	}
}

export class ProposalResponse extends OpenGraphResponse {
	constructor(proposal: Proposal) {
		super({
			canonicalURL: `https://www.nationstates.net/page=UN_view_proposal/id=${canonicalize(proposal.id)}`,
			title: `Proposal | ${proposal.name}`,
			description: `A ${proposal.category} proposal by ${proposal.proposedBy} created on ${proposal.created.toLocaleDateString('en-US', { dateStyle: 'long' })} with ${proposal.approvals.length} approvals.\n\nLegal: ${proposal.legal.length} | Illegal: ${proposal.illegal.length} | Discard: ${proposal.discard.length}`,
			image: 'https://www.nationstates.net/images/waflag.svg',
			imageAlt: 'World Assembly logo',
		});
	}
}

export class NationStatesRedirect extends Response {
	constructor(url: ConstructorParameters<typeof URL>[0], status?: number) {
		super(null, {
			status: status ?? 302,
			headers: {
				Location: Object.assign(new URL(url), {
					hostname: 'www.nationstates.net',
					port: '',
					protocol: 'https',
				}).href,
			},
		});
	}
}

export async function errorResponse(
	status?: number,
	body?: Awaitable<string | object>,
): Promise<Response>;
export async function errorResponse(error: StatusError): Promise<Response>;
export async function errorResponse(
	errorOrStatus?: StatusError | number,
	body?: Awaitable<string | object>,
): Promise<Response> {
	if (errorOrStatus instanceof Error) {
		return error(errorOrStatus);
	}
	return error(errorOrStatus, await body);
}
