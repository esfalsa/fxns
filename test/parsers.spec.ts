import { describe, it, expect } from 'vitest';
import { NationParser } from '../src/parsers';
import type { Nation } from '../src/shards';
import { nationXML } from './fixtures/nation';

describe('NationParser', () => {
	it('parses nation data from a ReadableStream', async () => {
		const parser = new NationParser();
		const stream = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(new TextEncoder().encode(nationXML));
				controller.close();
			},
		});

		expect(await parser.parseStream(stream)).toEqual({
			name: 'Esfalsa',
			type: 'Flagless Nation',
			category: 'Civil Rights Lovefest',
			population: 18028,
			demonym2plural: 'Esfalsans',
			flag: 'https://www.nationstates.net/images/flags/uploads/esfalsa__372439.svg',
			admirables: [
				'cultured',
				'efficient',
				'environmentally stunning',
				'genial',
				'safe',
				'socially progressive',
			],
			notable:
				'parental licensing program, keen interest in outer space, and stringent health and safety legislation',
		} satisfies Nation);
	});

	it('resets parser state while parsing', () => {
		const parser = new NationParser();
		const chunks = nationXML.match(/.{1,10}/g)!;

		for (const chunk of chunks.slice(0, chunks.length / 2)) {
			parser.write(chunk);
		}

		expect(parser.data).not.toEqual({});
		parser.reset();
		expect(parser.data).toEqual({});
	});

	it('parses chunked data', () => {
		const parser = new NationParser();
		const chunks = nationXML.match(/.{1,10}/g)!;

		for (const chunk of chunks) {
			parser.write(chunk);
		}

		parser.end();

		expect(parser.data).toEqual({
			name: 'Esfalsa',
			type: 'Flagless Nation',
			category: 'Civil Rights Lovefest',
			population: 18028,
			demonym2plural: 'Esfalsans',
			flag: 'https://www.nationstates.net/images/flags/uploads/esfalsa__372439.svg',
			admirables: [
				'cultured',
				'efficient',
				'environmentally stunning',
				'genial',
				'safe',
				'socially progressive',
			],
			notable:
				'parental licensing program, keen interest in outer space, and stringent health and safety legislation',
		} satisfies Nation);
	});
});
