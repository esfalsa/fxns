import { describe, expect, it } from 'vitest';
import { html, raw } from '../src/escaping';

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
		).toEqual(`<script>alert(&#39;hi&#39;);</script>`);
	});

	it('escapes multiple templated html strings', () => {
		expect(
			// prettier-ignore
			html`<script>alert(${`'hi'`});</script><script>alert(${`'bye'`});</script>`,
		).toEqual(
			`<script>alert(&#39;hi&#39;);</script><script>alert(&#39;bye&#39;);</script>`,
		);
	});

	it('escapes templated html tags', () => {
		expect(
			// prettier-ignore
			html`<html>${`<script>alert('hi');</script>`}</html>`,
		).toEqual(`<html>&lt;script&gt;alert(&#39;hi&#39;);&lt;/script&gt;</html>`);
	});

	it('');

	it('ignores raw text', () => {
		const name = 'Max &quot;[violet]&quot; Barry';
		expect(
			// prettier-ignore
			html`<p>Who is ${raw(name)}?</p>`,
		).toEqual('<p>Who is Max &quot;[violet]&quot; Barry?</p>');
	});
});
