import { describe, it, expect } from 'vitest';
import { parseNation, parseProposal } from '../src/parsers';
import type { Nation, Proposal } from '../src/shards';
import { nationXML, proposalsXML } from './fixtures';

describe('parseNation', () => {
	it('parses a complete response correctly', () => {
		expect(parseNation(nationXML)).toEqual({
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

describe('parseProposal', () => {
	it('parses a complete response correctly', () => {
		expect(parseProposal(proposalsXML, 'westinor_1718510253')).toEqual({
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

	it('returns undefined for a missing proposal', () => {
		expect(parseProposal(proposalsXML, 'missing')).toBeUndefined();
	});
});
