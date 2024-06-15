import { StatusError, error } from 'itty-router';
import { canonicalize, type Nation } from './nationstates';
import { html } from './utils';

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
	let data = await nation;

	const canonicalURL = `https://www.nationstates.net/nation=${canonicalize(data.name)}`;

	return htmlResponse(
		await html`<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<link rel="canonical" href="${canonicalURL}" />

					<title>The ${data.type} of ${data.name}</title>

					<meta name="description" content="${data.category}" />

					<!-- required Open Graph metadata -->
					<meta property="og:title" content="The ${data.type} of ${data.name}" />
					<meta property="og:type" content="website" />
					<meta property="og:image" content="${data.flag}" />
					<meta property="og:url" content="${canonicalURL}" />

					<!-- optional Open Graph metadata -->
					<meta property="og:description" content="${data.category}" />
					<meta property="og:site_name" content="NationStates" />

					<!-- structured properties Open Graph metadata -->
					<meta property="og:image:alt" content="Flag of ${data.name}" />

					<!-- Twitter metadata -->
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:site" content="@NationStates" />
					<meta name="twitter:description" content="${data.category}" />
					<meta name="twitter:title" content="The ${data.type} of ${data.name}" />
					<meta name="twitter:image" content="${data.flag}" />
					<meta name="twitter:image:alt" content="Flag of ${data.name}" />
				</head>
				<body></body>
			</html>`
	);
};

export async function errorResponse(status?: number, body?: Awaitable<string | object>): Promise<Response>;
export async function errorResponse(error: StatusError): Promise<Response>;
export async function errorResponse(
	errorOrStatus?: StatusError | number,
	body?: Awaitable<string | object>
): Promise<Response> {
	if (errorOrStatus instanceof Error) {
		return error(errorOrStatus);
	}
	return error(errorOrStatus, await body);
}
