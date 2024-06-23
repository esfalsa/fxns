import { describe, expect, it } from 'vitest';
import { createTagsRegExp } from '../src/macros';

describe('tag macros', () => {
	it('is equivalent to a manually generated macro', () => {
		const created = createTagsRegExp(['NAME', 'TYPE', 'CATEGORY']);
		const expected =
			/<(?<tag>NAME|TYPE|CATEGORY)>(?<content>.+)<\/(?:NAME|TYPE|CATEGORY)>/g;
		expect(created.source).toBe(expected.source);
		expect(created.global).toBe(expected.global);
		expect(created.ignoreCase).toBe(expected.ignoreCase);
		expect(created.multiline).toBe(expected.multiline);
	});

	it('matches XML tags and content', () => {});

	it('matches multiple tags and content', () => {});
});
