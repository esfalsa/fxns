import { describe, expect, it } from 'vitest';
import { $createTagsRegExp } from '../src/macros';

describe('nation tag regular expression', () => {
	it('is equivalent to a manually generated regular expression', () => {
		const created = $createTagsRegExp('nation');
		const expected =
			/<(?<tag>NAME|TYPE|CATEGORY|FLAG|POPULATION|DEMONYM2PLURAL|NOTABLE|ADMIRABLE)>(?<content>.+?)<\/(?:\k<tag>)>/g;
		expect(created.source).toBe(expected.source);
		expect(created.global).toBe(expected.global);
		expect(created.ignoreCase).toBe(expected.ignoreCase);
		expect(created.multiline).toBe(expected.multiline);
	});

	it('matches XML tags and content', () => {
		const hasMatch = '<NAME>Maxtopia</NAME>';
		const noMatch = '<TYPO>Fixed, thanks.</TYPO>';
		const regex = $createTagsRegExp('nation');
		expect(regex.test(hasMatch)).toBe(true);
		expect(regex.test(noMatch)).toBe(false);
	});

	it('stops matching at the first matching closing tag', () => {
		const text = '<NAME>Maxtopia <TYPE>Father Knows Best State</TYPE></NAME>';
		const regex = $createTagsRegExp('nation');
		const matches = text.match(regex);

		expect(matches?.length).toBe(1);
		expect(matches?.[0]).toBe(
			'<NAME>Maxtopia <TYPE>Father Knows Best State</TYPE></NAME>',
		);
	});

	it('matches multiple tags and content', () => {
		const text = '<NAME>Maxtopia</NAME><TYPE>Father Knows Best State</TYPE>';
		const regex = $createTagsRegExp('nation');
		const matches = [...text.matchAll(regex)];

		expect(matches.length).toBe(2);
		expect(matches[0]?.[0]).toBe('<NAME>Maxtopia</NAME>');
		expect(matches[0]?.groups?.tag).toBe('NAME');
		expect(matches[0]?.groups?.content).toBe('Maxtopia');
		expect(matches[1]?.[0]).toBe('<TYPE>Father Knows Best State</TYPE>');
		expect(matches[1]?.groups?.tag).toBe('TYPE');
		expect(matches[1]?.groups?.content).toBe('Father Knows Best State');
	});
});
