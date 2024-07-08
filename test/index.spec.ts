import { beforeAll, afterEach, describe, it, expect } from 'vitest';
import { fetchMock } from 'cloudflare:test';
import * as fixtures from './fixtures';
import app from '../src/index';

beforeAll(() => {
	fetchMock.activate();
	fetchMock.disableNetConnect();
});
afterEach(() => fetchMock.assertNoPendingInterceptors());

const BASE = 'https://fxns.pronoun.workers.dev/';

function appFetch(
	path: string,
	opts?: RequestInit<IncomingRequestCfProperties<unknown>>,
) {
	return app.fetch(
		new Request(new URL(path, BASE), opts),
		undefined,
		undefined as unknown as ExecutionContext,
	) as Promise<Response>;
}

function ogTag(property: string, content: string) {
	return `<meta property="og:${property}" content="${content}" />`;
}

describe('healthcheck (/)', async () => {
	const res = await appFetch('/');

	it('responds with redirect status 302', () => {
		expect(res.status).toBe(302);
	});

	it('redirects to the GitHub repository', () => {
		expect(res.headers.get('Location')).toBe('https://github.com/esfalsa/fxns');
	});
});

describe('favicon request', async () => {
	for (const path of [
		'/favicon.ico',
		'/favicon-32x32.png',
		'/favicon-16x16.png',
	]) {
		const res = await appFetch(path);

		it('responds with redirect status 301', () => {
			expect(res.status).toBe(301);
		});

		it('redirects to the NationStates favicon', () => {
			expect(res.headers.get('Location')).toBe(
				`https://www.nationstates.net${path}`,
			);
		});
	}
});

describe('apple touch icon request', async () => {
	const res = await appFetch('/apple-touch-icon.png');

	it('responds with redirect status 301', () => {
		expect(res.status).toBe(301);
	});

	it('redirects to the NationStates apple touch icon', () => {
		expect(res.headers.get('Location')).toBe(
			'https://www.nationstates.net/apple-touch-icon.png',
		);
	});
});

describe('android chrome icon request', async () => {
	const res = await appFetch('/android-chrome-192x192.png');

	it('responds with redirect status 301', () => {
		expect(res.status).toBe(301);
	});

	it('redirects to the NationStates apple touch icon', () => {
		expect(res.headers.get('Location')).toBe(
			'https://www.nationstates.net/android-chrome-192x192.png',
		);
	});
});

describe('nation opengraph request', async () => {
	fetchMock
		.get('https://www.nationstates.net')
		.intercept({ path: /.*/ })
		.reply(200, fixtures.nation);

	const res = await appFetch('/nation=esfalsa', {
		headers: { 'User-Agent': 'curl/8.4.0' },
	});
	const body = await res.text();

	it('lists the nation as the title', () => {
		expect(body).toContain(ogTag('title', 'The Flagless Nation of Esfalsa'));
	});

	it("lists the nation's flag as the image", () => {
		expect(body).toContain(
			ogTag(
				'image',
				'https://www.nationstates.net/images/flags/uploads/esfalsa__372439.svg',
			),
		);
	});
});

describe('region opengraph request', async () => {
	fetchMock
		.get('https://www.nationstates.net')
		.intercept({ path: /.*/ })
		.reply(200, fixtures.region);

	const res = await appFetch('/region=the_south_pacific', {
		headers: { 'User-Agent': 'curl/8.4.0' },
	});
	const body = await res.text();

	it('matches snapshopt', () => {
		expect(body).toMatchSnapshot();
	});
});

describe('proposal opengraph request', async () => {
	fetchMock
		.get('https://www.nationstates.net')
		.intercept({ path: /.*/ })
		.reply(200, fixtures.proposals);

	const res = await appFetch(
		`/page=UN_view_proposal/id=${fixtures.standardProposalID}`,
		{
			headers: { 'User-Agent': 'curl/8.4.0' },
		},
	);
	const body = await res.text();

	it('matches snapshopt', () => {
		expect(body).toMatchSnapshot();
	});
});

describe('nation 404 request', async () => {
	fetchMock
		.get('https://www.nationstates.net')
		.intercept({ path: /.*/ })
		.reply(404, fixtures.nation404);

	const res = await appFetch('/nation=thisnationdoesnotexist', {
		headers: { 'User-Agent': 'curl/8.4.0' },
	});
	const body = await res.text();

	it('responds with status 404', () => {
		expect(res.status).toBe(404);
	});

	it('matches snapshopt', () => {
		expect(body).toMatchSnapshot();
	});
});
