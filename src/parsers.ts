import type { ShardTag, Nation, Proposal, Region } from './shards';
import { $createTagsRegExp } from './macros' with { type: 'macro' };
import type { PartialPick } from './types';

export function parseNation(xml: string) {
	const tagRegExp = $createTagsRegExp('nation');

	const nation: PartialPick<Nation, 'admirables'> = { admirables: [] };

	for (const match of xml.matchAll(tagRegExp)) {
		if (!match.groups || !match.groups.content) break;

		switch (match.groups.tag as ShardTag<'nation'>) {
			case 'NAME':
				nation.name = match.groups.content;
				break;
			case 'TYPE':
				nation.type = match.groups.content;
				break;
			case 'CATEGORY':
				nation.category = match.groups.content;
				break;
			case 'DEMONYM2PLURAL':
				nation.demonym2plural = match.groups.content;
				break;
			case 'POPULATION':
				nation.population = Number(match.groups.content);
				break;
			case 'FLAG':
				nation.flag = match.groups.content;
				break;
			case 'ADMIRABLE':
				nation.admirables.push(match.groups.content);
				break;
			case 'NOTABLE':
				nation.notable = match.groups.content;
				break;
		}
	}

	return nation as Nation;
}

export function parseRegion(xml: string) {
	const tagRegExp = $createTagsRegExp('region');

	const region: Partial<Region> = {};

	for (const match of xml.matchAll(tagRegExp)) {
		if (!match.groups || !match.groups.content) break;

		switch (match.groups.tag as ShardTag<'region'>) {
			case 'NAME':
				region.name = match.groups.content;
				break;
			case 'NUMNATIONS':
				region.numnations = Number(match.groups.content);
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

		switch (match.groups.tag as ShardTag<'proposals'>) {
			case 'NAME':
				proposal.name = match.groups.content;
				break;
			case 'CATEGORY':
				proposal.category = match.groups.content;
				break;
			case 'CREATED':
				proposal.created = new Date(match.groups.content);
				break;
			case 'PROPOSED_BY':
				proposal.proposedBy = match.groups.content;
				break;
			case 'APPROVALS':
				proposal.approvals.push(match.groups.content);
				break;
			case 'LEGAL':
				proposal.legal.push(match.groups.content);
				break;
			case 'ILLEGAL':
				proposal.illegal.push(match.groups.content);
				break;
			case 'DISCARD':
				proposal.discard.push(match.groups.content);
				break;
		}
	}

	return proposal as Proposal;
}
