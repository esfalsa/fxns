import { describe, expect, it } from 'vitest';
import { html } from '../src/escaping';

describe('html string escaping', () => {
	it('does not escape directly passed html', async () => {
		expect(
			// prettier-ignore
			await html`<script>alert('hi');</script>`,
		).toBe("<script>alert('hi');</script>");
	});

	it('escapes templated html strings', async () => {
		expect(
			// prettier-ignore
			await html`<script>alert(${`'hi'`});</script>`,
		).toEqual(`<script>alert(&#39;hi&#39;);</script>`);
	});

	it('escapes multiple templated html strings', async () => {
		expect(
			// prettier-ignore
			await html`<script>alert(${`'hi'`});</script><script>alert(${`'bye'`});</script>`,
		).toEqual(
			`<script>alert(&#39;hi&#39;);</script><script>alert(&#39;bye&#39;);</script>`,
		);
	});

	it('escapes templated html tags', async () => {
		expect(
			// prettier-ignore
			await html`<html>${`<script>alert('hi');</script>`}</html>`,
		).toEqual(`<html>&lt;script&gt;alert(&#39;hi&#39;);&lt;/script&gt;</html>`);
	});
});
