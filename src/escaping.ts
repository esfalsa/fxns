import type { Awaitable } from './types';

type HTMLEscaped = { escaped: true };
type EscapedString = string & HTMLEscaped;

const replacements = new Map([
	['&', '&amp;'],
	['<', '&lt;'],
	['>', '&gt;'],
	["'", '&apos;'],
	['"', '&quot;'],
]);

const reverseReplacements = new Map([
	['&amp;', '&'],
	['&lt;', '<'],
	['&gt;', '>'],
	['&apos;', "'"],
	['&quot;', '"'],
]);

export function encodeEntities(str: string) {
	return str.replace(/[&<>'"]/g, (match) => replacements.get(match)!);
}

export function decodeEntities(str: string) {
	return str.replace(
		/&(?:(?:quo|[gl])t|a(?:pos|mp));/g,
		(match) => reverseReplacements.get(match)!,
	);
}

export function html(
	strings: TemplateStringsArray,
	...values: (string | EscapedString)[]
) {
	const res: Awaitable<string>[] = [strings[0]!];

	for (const [index, value] of values.entries()) {
		res.push(encodeEntities(value.toString()), strings[index + 1]!);
	}

	return res.join('');
}
