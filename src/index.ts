import { IttyRouter, StatusError } from 'itty-router';
import { errorResponse, nationResponse } from './responses';
import { nationstates } from './nationstates';

const router = IttyRouter();

router
	.get('/', () => Response.redirect('https://github.com/esfalsa/fxns', 302))
	.get('/nation=:nation', async ({ params }) => {
		return nationResponse(nationstates.nation(params.nation!));
	})
	.get('/:nation', async ({ params }) => {
		return nationResponse(nationstates.nation(params.nation!));
	})
	.all('*', () => {
		throw new StatusError(404);
	});

export default {
	fetch: (request, ...args) =>
		router.fetch(request, ...args).catch(errorResponse),
} satisfies ExportedHandler;
