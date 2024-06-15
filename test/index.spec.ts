import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

describe('healthcheck (/)', async () => {
	const res = await SELF.fetch('https://example.com', { redirect: 'manual' });

	it('responds with redirect status 302', async () => {
		expect(res.status).toBe(302);
	});

	it('redirects to the GitHub repository', async () => {
		expect(res.headers.get('Location')).toBe('https://github.com/esfalsa/fxns');
	});
});
