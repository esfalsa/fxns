import { describe, it, expect } from 'vitest';
import { NationParser } from '../src/parsers';
import { Nation } from '../src/nationstates';
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
		await parser.writeStream(stream);

		expect(parser.getData()).toEqual({
			name: 'Esfalsa',
			type: 'Flagless Nation',
			category: 'Civil Rights Lovefest',
			population: 18028,
			demonymPlural: 'Esfalsans',
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

	it('parses chunked data', async () => {
		const parser = new NationParser();
		const chunks = nationXML.match(/.{1,10}/g)!;

		for (const chunk of chunks) {
			parser.write(chunk);
		}

		parser.end();

		expect(parser.getData()).toEqual({
			name: 'Esfalsa',
			type: 'Flagless Nation',
			category: 'Civil Rights Lovefest',
			population: 18028,
			demonymPlural: 'Esfalsans',
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
