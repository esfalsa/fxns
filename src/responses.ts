import { StatusError, error } from 'itty-router';
import { canonicalize, type Nation } from './nationstates';
import { html } from './utils';
import { Awaitable } from './types';

export const jsonResponse = async (body: Awaitable<object>) => {
	return new Response(JSON.stringify(await body), {
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	});
};

export const htmlResponse = async (body: Awaitable<string>, init?: ResponseInit) => {
	return new Response(await body, {
		headers: {
			'Content-Type': 'text/html;charset=UTF-8',
			...init?.headers,
		},
		...init,
	});
};

export const nationResponse = async (nation: Awaitable<Nation>) => {
	const data = await nation;

	const canonicalURL = `https://www.nationstates.net/nation=${canonicalize(data.name)}`;
	const fullName = `The ${data.type} of ${data.name}`;

	const admirables = data.admirables.sort(() => 0.5 - Math.random()).slice(0, 3);
	const population =
		data.population > 1000 ? `${(data.population / 1000).toFixed(3)} billion` : `${data.population} million`;

	const description = `${admirables[0]!.charAt(0).toUpperCase() + admirables[0]!.slice(1)}, ${admirables[1]}, and ${admirables[2]} ${data.category} with ${population} ${data.demonymPlural}, notable for its ${data.notable}.`;

	return htmlResponse(
		await html` <!doctype html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<link rel="canonical" href="${canonicalURL}" />

					<title>${fullName}</title>
					<meta name="description" content="${description}" />

					<!-- required Open Graph metadata -->
					<meta property="og:title" content="${fullName}" />
					<meta property="og:type" content="website" />
					<meta property="og:image" content="${data.flag}" />
					<meta property="og:url" content="${canonicalURL}" />

					<!-- optional Open Graph metadata -->
					<meta property="og:description" content="${description}" />
					<meta property="og:site_name" content="NationStates" />

					<!-- structured properties Open Graph metadata -->
					<meta property="og:image:alt" content="Flag of ${data.name}" />

					<!-- Twitter metadata -->
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:site" content="@NationStates" />
					<meta name="twitter:description" content="${description}" />
					<meta name="twitter:title" content="${fullName}" />
					<meta name="twitter:image" content="${data.flag}" />
					<meta name="twitter:image:alt" content="Flag of ${data.name}" />
				</head>
				<body></body>
			</html>`,
	);
};

export async function errorResponse(status?: number, body?: Awaitable<string | object>): Promise<Response>;
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
