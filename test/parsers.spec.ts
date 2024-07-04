import { describe, expect, it } from 'vitest';
import { parseNation, parseProposal, parseRegion } from '../src/parsers';
import type { Nation, Proposal, Region } from '../src/shards';
import * as fixtures from './fixtures';

describe('parseNation', () => {
	it('parses a complete response correctly', () => {
		expect(parseNation(fixtures.nation)).toEqual({
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

describe('parseRegion', () => {
	it('parses a complete response correctly', () => {
		expect(parseRegion(fixtures.region)).toEqual({
			name: 'the South Pacific',
			numnations: 4875,
			power: 'Extremely High',
			flag: 'https://www.nationstates.net/images/flags/uploads/rflags/the_south_pacific__652104.png',
			tags: new Set([
				'Fantasy Tech',
				'LGBT',
				'Feeder',
				'Map',
				'Outer Space',
				'Gargantuan',
				'Governorless',
				'Game Player',
				'Feminist',
				'Egalitarian',
				'Democratic',
				'Snarky',
				'Offsite Forums',
				'Social',
				'Featured',
				'Offsite Chat',
				'Regional Government',
				'Security Council',
				'Issues Player',
				'Silly',
				'Casual',
				'Role Player',
				'Trading Cards',
				'World Assembly',
				'Modern Tech',
				'General Assembly',
				'Anti-Fascist',
				'Defender',
				'Future Tech',
			]),
		} satisfies Region);
	});
});

describe('parseProposal', () => {
	it('parses a complete response correctly', () => {
		expect(
			parseProposal(fixtures.proposals, fixtures.standardProposalID),
		).toEqual({
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
		expect(parseProposal(fixtures.proposals, 'missing')).toBeUndefined();
	});

	it('parses a proposal with encoded entities', () => {
		expect(
			parseProposal(fixtures.proposals, fixtures.entityProposalID),
		).toEqual({
			name: 'Repeal "Sensible Limits on Hunting"',
			category: 'Repeal',
			created: new Date(1716956683 * 1000),
			discard: [],
			illegal: [],
			legal: ['desmosthenes_and_burke', 'barfleur', 'imperium_anglorum'],
			proposedBy: 'the_ice_states',
			approvals:
				'waffenbrightonburg:vosko:franconia_empire:zombiedolphins:san_lumen:shawrmastan:tueytonia:south_china_sea_islands:fachumonn:anti-void:bali_kingdom:united_lammunist_republic:sneyland:the_kharkivan_cossacks:shattered_cascadia:fictia:hey_man_nation:thesapphire:north_nixia:the_duss:kalustyan:denathor:cedar_tree:mail_jeevas:lergotum:quetesia:lamoni:darkarion:newer_ostland:ancientania:lurusitania:impera_lunara:kazakhstan_rss:the_umns:andrw_tate:betashock:faygoer:star_forge:enslavetopia:the_auglands:chesapeake_founder:ubernech:secret_agent_99:ebonhand:wolfs_brigade:typica:sanctaria:s0uth_afr1ca:kolatis:henrylands:lennonia:kzdor:kantabria:sussywussyland:mark:zvlokiquix:eco-paris_reformation:the_unsgr_senate:island_of_avalon:koac:united_bongo_states_of_the_new_america:new_samba:jakapil_island:the_bladeist_association_of_brazil:newtexas:qudrath:roylaii:the_surviving_canadian_resistance:east_embia_albils:hemogard:new_vonderland:balkaniciana:sarvanti:alkhen-morrensk:perlito:kethania:southern_caek_saimatertoutari:kewl_kids'.split(
					':',
				),
		} satisfies Proposal);
	});

	it('parses a proposal with illegal and discard votes', () => {
		expect(
			parseProposal(fixtures.illegalProposals, fixtures.illegalProposalID),
		).toEqual({
			name: 'Illegal Proposal',
			category: 'Free Trade',
			created: new Date(1720076086 * 1000),
			discard: ['discard 1', 'discard 2'],
			illegal: ['illegal 1', 'illegal 2'],
			legal: ['legal 1', 'legal 2'],
			proposedBy: 'nooby_mc_noobface',
			approvals: [],
		} satisfies Proposal);
	});
});
