import { IttyRouter, StatusError } from 'itty-router';
import {
	errorResponse,
	nationResponse,
	nationStatesRedirectResponse,
	proposalResponse,
} from './responses';
import { canonicalize, nationstates } from './nationstates';
import { isBot } from './user-agents';
import { ProposalsParser } from './parsers';

import { proposalsXML } from '../test/fixtures/proposals';

const router = IttyRouter();

router
	.get('/', () => Response.redirect('https://github.com/esfalsa/fxns', 302))
	.get('/favicon*', (req) => nationStatesRedirectResponse(req.url, 301))
	.get('/apple-touch-*', (req) => nationStatesRedirectResponse(req.url, 301))
	.get('/android-chrome-*', (req) => nationStatesRedirectResponse(req.url, 301))
	.get('/nation=:nation', async ({ params, headers }) => {
		const userAgent = headers.get('User-Agent');
		if (!userAgent || isBot(userAgent)) {
			return nationResponse(nationstates.nation(params.nation!));
		}
		return Response.redirect(
			`https://www.nationstates.net/nation=${canonicalize(params.nation!)}`,
			302,
		);
	})
	.get('/page=UN_view_proposal/id=:id', async ({ params, headers }) => {
		const userAgent = headers.get('User-Agent');
		if (!userAgent || isBot(userAgent)) {
			return proposalResponse(nationstates.proposal(params.id!), params.id!);
		}
		return Response.redirect(
			`https://www.nationstates.net/page=UN_view_proposal/id=${params.id}`,
			302,
		);
	})
	.get('/static-test-page', () => {
		const parser = new ProposalsParser('westinor_1718510253');
		const data = parser.parseString(proposalsXML);
		return proposalResponse(data, 'westinor_1718510253');
	})
	.get('/:nation', async ({ params, headers }) => {
		const userAgent = headers.get('User-Agent');
		if (!userAgent || isBot(userAgent)) {
			return nationResponse(nationstates.nation(params.nation!));
		}

		return Response.redirect(
			`https://www.nationstates.net/nation=${canonicalize(params.nation!)}`,
			302,
		);
	})
	.all('*', () => {
		throw new StatusError(404);
	});

export default {
	fetch: (request, ...args) =>
		router.fetch(request, ...args).catch(errorResponse),
} satisfies ExportedHandler;
