import { describe, it, expect } from 'vitest';
import { NationParser, ProposalsParser } from '../src/parsers';
import type { Nation, Proposal } from '../src/shards';
import { nationXML } from './fixtures/nation';
import { proposalsXML } from './fixtures/proposals';

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

		expect(parser.data).not.toEqual(NationParser.initialData);
		parser.reset();
		expect(parser.data).toEqual(NationParser.initialData);
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

describe('ProposalsParser', () => {
	it('parses proposal data from a ReadableStream', async () => {
		const parser = new ProposalsParser('westinor_1718510253');
		const stream = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(new TextEncoder().encode(proposalsXML));
				controller.close();
			},
		});

		expect(await parser.parseStream(stream)).toEqual({
			name: 'Commend Nasicournia',
			category: 'Commendation',
			created: new Date(1718510253 * 1000),
			discard: [],
			illegal: [],
			legal: ['crazy_girl', 'refuge_isle'],
			proposedBy: 'westinor',
			approvals:
				'vosko:waffenbrightonburg:tomoras:franconia_empire:monsmearc:zombiedolphins:tueytonia:san_lumen:tamiara:glorious_canada:simone_republic:malalonius:fachumonn:aquilea_empire:economy_stimulators:the_two_islands:bali_kingdom:hulldom:china_free_state:sneyland:the_kharkivan_cossacks:shattered_cascadia:fictia:divayo:pinkienia:gran_river:azmeny:lergotum:vangaurdis:new_federal_district:darkarion:asase_lewa:haymarket_riot:kazakhstan_rss:silibidor:lodgi:the_auglands:enslavetopia:star_forge:chesapeake_founder:potatoville:ubernech:secret_agent_99:the_divin_fist:junastria:etwepe:aserlandia:wolfs_brigade:s0uth_afr1ca:kolatis:torvien:shanlix:mark:eco-paris_reformation:island_of_avalon:free_aratinshvand:sedgistan:chaosdom:jakapil_island:qudrath:the_surviving_canadian_resistance:hemogard:upc:maurnindaia:alkhen-morrensk:the_shadow_fold:eurogoslavia:tinhampton:astrobolt'.split(
					':',
				),
		} satisfies Proposal);
	});

	it('resets parser state while parsing', () => {
		const parser = new ProposalsParser('westinor_1718510253');
		const chunks = proposalsXML.match(/.{1,10}/g)!;

		for (const chunk of chunks.slice(0, (3 * chunks.length) / 3)) {
			parser.write(chunk);
		}

		expect(parser.data).not.toEqual(ProposalsParser.initialData);
		parser.reset();
		expect(parser.data).toEqual(ProposalsParser.initialData);
	});
});
