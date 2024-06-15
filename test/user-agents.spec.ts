import { describe, expect, it } from 'vitest';
import { isBot } from '../src/user-agents';
import crawlers from 'crawler-user-agents';

describe('bot user agent detection', () => {
	it('detects Google crawler', () => {
		const instances = crawlers
			.filter((c) => /googlebot/i.test(c.pattern))
			.map((c) => c.instances)
			.flat();
		for (const instance of instances) {
			expect(isBot(instance)).toBe(true);
		}
	});

	it('detects Facebook crawler', () => {
		const instances = crawlers
			.filter((c) => /facebook/i.test(c.pattern))
			.map((c) => c.instances)
			.flat();
		for (const instance of instances) {
			expect(isBot(instance)).toBe(true);
		}
	});

	it('detects Twitter crawler', () => {
		const instances = crawlers
			.filter((c) => /twitter/i.test(c.pattern))
			.map((c) => c.instances)
			.flat();
		for (const instance of instances) {
			expect(isBot(instance)).toBe(true);
		}
	});

	it('detects Discord crawler', () => {
		const instances = crawlers
			.filter((c) => /discord/i.test(c.pattern))
			.map((c) => c.instances)
			.flat();
		for (const instance of instances) {
			expect(isBot(instance)).toBe(true);
		}
	});

	it('detects Telegram crawler', () => {
		const instances = crawlers
			.filter((c) => /telegram/i.test(c.pattern))
			.map((c) => c.instances)
			.flat();
		for (const instance of instances) {
			expect(isBot(instance)).toBe(true);
		}
	});

	it('detects curl user agent', () => {
		const instances = crawlers
			.filter((c) => /curl/i.test(c.pattern))
			.map((c) => c.instances)
			.flat();
		for (const instance of instances) {
			expect(isBot(instance)).toBe(true);
		}
	});

	it('detects Discourse crawler', () => {
		// see https://github.com/discourse/discourse/blob/516d14d59ba6fb3bf2cc53b5f02b749f27291a99/config/initializers/100-onebox_options.rb#L15
		expect(isBot('Discourse Forum Onebox v3.3.0.beta3-dev')).toBe(true);
		expect(isBot('Discourse Forum Onebox v3.2.0')).toBe(true);
	});
});
