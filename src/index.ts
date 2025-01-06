import { IttyRouter, StatusError } from 'itty-router';
import {
	errorResponse,
	NationResponse,
	NationStatesRedirect,
	RegionResponse,
	ProposalResponse,
} from './responses';
import { nationstates } from './nationstates';
import { isBot } from './user-agents';

const router = IttyRouter();

router
	.get('/', () => Response.redirect('https://github.com/esfalsa/fxns', 302))
	.get('/favicon*', (req) => new NationStatesRedirect(req.url, 301))
	.get('/apple-touch-*', (req) => new NationStatesRedirect(req.url, 301))
	.get('/android-chrome-*', (req) => new NationStatesRedirect(req.url, 301))
	.get('/nation=:nation', async ({ params, headers, url }) => {
		const userAgent = headers.get('User-Agent');
		if (!userAgent || isBot(userAgent)) {
			return new NationResponse(await nationstates.nation(params.nation!));
		}
		return new NationStatesRedirect(url, 302);
	})
	.get('/region=:region', async ({ params, headers, url }) => {
		const userAgent = headers.get('User-Agent');
		if (!userAgent || isBot(userAgent)) {
			return new RegionResponse(await nationstates.region(params.region!));
		}
		return new NationStatesRedirect(url, 302);
	})
	.get('/page=UN_view_proposal/id=:id', async ({ params, headers, url }) => {
		const userAgent = headers.get('User-Agent');
		if (!userAgent || isBot(userAgent)) {
			return new ProposalResponse(await nationstates.proposal(params.id!));
		}
		return new NationStatesRedirect(url, 302);
	})
	.get('/:nation', async ({ params, headers, url }) => {
		const userAgent = headers.get('User-Agent');
		if (!userAgent || isBot(userAgent)) {
			return new NationResponse(await nationstates.nation(params.nation!));
		}
		return new NationStatesRedirect(url, 302);
	})
	.all('*', () => {
		throw new StatusError(404);
	});

export default {
	fetch: (request, ...args) =>
		router.fetch(request, ...args).catch(errorResponse),
} satisfies ExportedHandler;
