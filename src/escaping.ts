import type { Awaitable } from './types';

type HTMLEscaped = { escaped: true };
type EscapedString = string & HTMLEscaped;

const replacements: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	"'": '&#39;',
	'"': '&quot;',
};

function replaceTag(tag: string) {
	return replacements[tag] || tag;
}

function escapeString(str: string) {
	return str.replace(/[&<>'"]/g, replaceTag);
}

export function html(
	strings: TemplateStringsArray,
	...values: (string | EscapedString)[]
) {
	const res: Awaitable<string>[] = [strings[0]!];

	for (const [index, value] of values.entries()) {
		if ((value as EscapedString).escaped) {
			res.push(value.toString(), strings[index + 1]!);
		} else {
			res.push(escapeString(value.toString()), strings[index + 1]!);
		}
	}

	return res.join('');
}

export function raw(value: string) {
	const escapedString = new String(value) as EscapedString;
	escapedString.escaped = true;
	return escapedString;
}
