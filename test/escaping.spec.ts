import { describe, expect, it } from 'vitest';
import { decodeEntities, encodeEntities, html } from '../src/escaping';

describe('html string escaping', () => {
	it('does not escape directly passed html', () => {
		expect(
			// prettier-ignore
			html`<script>alert('hi');</script>`,
		).toBe("<script>alert('hi');</script>");
	});

	it('escapes templated html strings', () => {
		expect(
			// prettier-ignore
			html`<script>alert(${`'hi'`});</script>`,
		).toEqual(`<script>alert(&apos;hi&apos;);</script>`);
	});

	it('escapes multiple templated html strings', () => {
		expect(
			// prettier-ignore
			html`<script>alert(${`'hi'`});</script><script>alert(${`'bye'`});</script>`,
		).toEqual(
			`<script>alert(&apos;hi&apos;);</script><script>alert(&apos;bye&apos;);</script>`,
		);
	});

	it('escapes templated html tags', () => {
		expect(
			// prettier-ignore
			html`<html>${`<script>alert('hi');</script>`}</html>`,
		).toEqual(
			`<html>&lt;script&gt;alert(&apos;hi&apos;);&lt;/script&gt;</html>`,
		);
	});
});

describe('xml entity decoding', () => {
	it('decodes entities', () => {
		expect(decodeEntities(/* html */ `&quot; &lt; &gt; &apos; &amp;`)).toEqual(
			`" < > ' &`,
		);
	});
});

describe('xml entity encoding', () => {
	it('encodes entities', () => {
		expect(encodeEntities(`" < > ' &`)).toEqual(
			'&quot; &lt; &gt; &apos; &amp;',
		);
	});
});
