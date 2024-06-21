import type { StatusError } from 'itty-router';
import { error } from 'itty-router';
import { canonicalize } from './nationstates';
import type { Nation, Proposal } from './shards';
import { html } from './escaping';
import type { Awaitable } from './types';

export const htmlResponse = async (
	body: Awaitable<string>,
	init?: ResponseInit,
) => {
	return new Response(await body, {
		headers: {
			'Content-Type': 'text/html;charset=UTF-8',
			...init?.headers,
		},
		...init,
	});
};

async function formatResponse(
	canonicalURL: string,
	title: string,
	description: string,
	image: string,
	imageAlt: string,
) {
	return await html`<!doctype html>
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
		</html>`;
}

export const nationResponse = async (nation: Awaitable<Nation>) => {
	const data = await nation;

	const canonicalURL = `https://www.nationstates.net/nation=${canonicalize(data.name)}`;
	const fullName = `The ${data.type} of ${data.name}`;

	const admirables = data.admirables
		.sort(() => 0.5 - Math.random())
		.slice(0, 3);
	const population =
		data.population > 1000 ?
			`${(data.population / 1000).toFixed(3)} billion`
		:	`${data.population} million`;

	const description = `${admirables[0]!.charAt(0).toUpperCase() + admirables[0]!.slice(1)}, ${admirables[1]}, and ${admirables[2]} ${data.category} with ${population} ${data.demonym2plural}, notable for its ${data.notable}.`;

	return htmlResponse(
		formatResponse(
			canonicalURL,
			fullName,
			description,
			data.flag,
			`Flag of ${data.name}`,
		),
		{
			headers: {
				'Cache-Control': 'max-age=86400, must-revalidate',
			},
		},
	);
};

export const proposalResponse = async (
	proposal: Awaitable<Proposal>,
	id: string,
) => {
	const data = await proposal;

	const canonicalURL = `https://www.nationstates.net/page=UN_view_proposal/id=${id}`;

	return htmlResponse(
		formatResponse(
			canonicalURL,
			`Proposal | ${data.name}`,
			`A ${data.category} proposal by ${data.proposedBy} created on ${data.created.toLocaleDateString('en-US')} with ${data.approvals.length} approvals.\n\nLegal: ${data.legal.length} | Illegal: ${data.illegal.length} | Discard: ${data.discard.length}`,
			'https://www.nationstates.net/images/waflag.svg',
			'World Assembly logo',
		),
		{
			headers: { 'Cache-Control': 'max-age=86400, must-revalidate' },
		},
	);
};

export const nationStatesRedirectResponse = async (
	url: Awaitable<ConstructorParameters<typeof URL>[0]>,
	status?: Awaitable<number>,
) => {
	return Response.redirect(
		Object.assign<URL, { [K in keyof URL]?: URL[K] }>(new URL(await url), {
			hostname: 'www.nationstates.net',
			protocol: 'https:',
		}).href,
		await status,
	);
};

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
