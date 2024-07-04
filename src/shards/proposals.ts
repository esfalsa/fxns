/**
 * A mapping from XML tags to the corresponding shard name.
 */
export const proposalTags = {
	NAME: 'name',
	CATEGORY: 'category',
	CREATED: 'created',
	PROPOSED_BY: 'proposedBy',
	APPROVALS: 'approvals',
	LEGAL: 'legal',
	ILLEGAL: 'illegal',
	DISCARD: 'discard',
} as const satisfies Record<string, keyof Proposal>;

/**
 * A mapping from the name of each shard to its corresponding type in a parsed
 * proposal object.
 */
export type Proposal = {
	name: string;
	category: string;
	created: Date;
	proposedBy: string;
	approvals: string[];
	legal: string[];
	illegal: string[];
	discard: string[];
};
