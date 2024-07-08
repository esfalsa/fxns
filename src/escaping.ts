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

function dedent(str: string) {
	return str.replace(/\n^\s+/gm, '\n');
}

export function html(strings: TemplateStringsArray, ...values: string[]) {
	let res = dedent(strings[0]!);
	for (const [index, value] of values.entries()) {
		res += encodeEntities(value.toString()) + dedent(strings[index + 1]!);
	}
	return res;
}
