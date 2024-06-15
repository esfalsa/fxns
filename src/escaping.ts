import { Awaitable } from './types';

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

async function escapeString(str: string) {
	return str.replace(/[&<>'"]/g, replaceTag);
}

export async function html(strings: TemplateStringsArray, ...values: string[]) {
	const res: Awaitable<string>[] = [strings[0]!];

	for (const [index, value] of values.entries()) {
		res.push(escapeString(value.toString()), strings[index + 1]!);
	}

	return await Promise.all(res).then((res) => res.join(''));
}
