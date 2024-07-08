import { describe, expect, it } from 'vitest';
import { canonicalize, prettify } from '../src/nationstates';

describe('canonicalize', () => {
	it('converts a name to its canonical form in a NationStates URL', () => {
		expect(canonicalize('Esfalsa')).toBe('esfalsa');
	});

	it('replaces spaces with underscores', () => {
		expect(canonicalize('The South Pacific')).toBe('the_south_pacific');
	});
});

describe('prettify', () => {
	it('converts a string to title case', () => {
		expect(prettify('esfalsa')).toBe('Esfalsa');
		expect(prettify('civil rights lovefest')).toBe('Civil Rights Lovefest');
	});

	it('keeps non-leading short words lowercase', () => {
		expect(prettify('the flagless nation of esfalsa')).toBe(
			'The Flagless Nation of Esfalsa',
		);
	});

	it('replaces underscores with spaces', () => {
		expect(prettify('the_south_pacific')).toBe('The South Pacific');
	});
});
