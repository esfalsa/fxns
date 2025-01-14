import { decodeEntities } from './escaping';
import { $createTagsRegExp } from './macros' with { type: 'macro' };
import { prettify } from './nationstates';
import type { Nation, Proposal, Region, ShardTag } from './shards';
import type { PartialPick } from './types';

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

	const region: PartialPick<Region, 'tags'> = {
		tags: new Set<string>(),
	};

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
			case 'FLAG':
				region.flag = content;
				break;
			case 'POWER':
				region.power = content;
				break;
			case 'TAG':
				region.tags.add(content);
				break;
			case 'DELEGATE':
				region.delegate = content === '0' ? null : prettify(content);
				break;
			case 'FOUNDER':
				region.founder = content === '0' ? null : prettify(content);
				break;
			case 'GOVERNOR':
				region.governor = content === '0' ? null : prettify(content);
				break;
		}
	}

	return region as Region;
}

export function parseProposal(xml: string, id: string) {
	const tagRegExp = $createTagsRegExp('proposals');

	const proposal: PartialPick<
		Proposal,
		'approvals' | 'legal' | 'illegal' | 'discard' | 'id'
	> = {
		approvals: [],
		legal: [],
		illegal: [],
		discard: [],
		id,
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
				proposal.proposedBy = prettify(content);
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
