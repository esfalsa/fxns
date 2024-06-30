import type { ShardTag, Nation, Proposal, Region } from './shards';
import { $createTagsRegExp } from './macros' with { type: 'macro' };
import type { PartialPick } from './types';
import { decodeEntities } from './escaping';

export function parseNation(xml: string) {
	const tagRegExp = $createTagsRegExp('nation');

	const nation: PartialPick<Nation, 'admirables'> = { admirables: [] };

	for (const match of xml.matchAll(tagRegExp)) {
		if (!match.groups || !match.groups.content) return;

		const content = decodeEntities(match.groups.content);

		switch (match.groups.tag as ShardTag<'nation'>) {
			case 'NAME':
				nation.name = content;
				break;
			case 'TYPE':
				nation.type = content;
				break;
			case 'CATEGORY':
				nation.category = content;
				break;
			case 'DEMONYM2PLURAL':
				nation.demonym2plural = content;
				break;
			case 'POPULATION':
				nation.population = Number(content);
				break;
			case 'FLAG':
				nation.flag = content;
				break;
			case 'ADMIRABLE':
				nation.admirables.push(content);
				break;
			case 'NOTABLE':
				nation.notable = content;
				break;
		}
	}

	return nation as Nation;
}

export function parseRegion(xml: string) {
	const tagRegExp = $createTagsRegExp('region');

	const region: Partial<Region> = {};

	for (const match of xml.matchAll(tagRegExp)) {
		if (!match.groups || !match.groups.content) return;

		const content = decodeEntities(match.groups.content);

		switch (match.groups.tag as ShardTag<'region'>) {
			case 'NAME':
				region.name = content;
				break;
			case 'NUMNATIONS':
				region.numnations = Number(content);
				break;
		}
	}
}

export function parseProposal(xml: string, id: string) {
	const tagRegExp = $createTagsRegExp('proposals');

	const proposal: PartialPick<
		Proposal,
		'approvals' | 'legal' | 'illegal' | 'discard'
	> = {
		approvals: [],
		legal: [],
		illegal: [],
		discard: [],
	};

	const proposalXML = xml.match(
		new RegExp(`<PROPOSAL id="${id}">(.+?)<\\/PROPOSAL>`, 's'),
	)?.[1];

	if (!proposalXML) return;

	for (const match of proposalXML.matchAll(tagRegExp)) {
		if (!match.groups || !match.groups.content) return;

		const content = decodeEntities(match.groups.content);

		switch (match.groups.tag as ShardTag<'proposals'>) {
			case 'NAME':
				proposal.name = content;
				break;
			case 'CATEGORY':
				proposal.category = content;
				break;
			case 'CREATED':
				proposal.created = new Date(Number(content) * 1000);
				break;
			case 'PROPOSED_BY':
				proposal.proposedBy = content;
				break;
			case 'APPROVALS':
				proposal.approvals = content.split(':');
				break;
			case 'LEGAL':
				proposal.legal.push(content);
				break;
			case 'ILLEGAL':
				proposal.illegal.push(content);
				break;
			case 'DISCARD':
				proposal.discard.push(content);
				break;
		}
	}

	return proposal as Proposal;
}
