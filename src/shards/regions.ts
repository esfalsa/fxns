/**
 * A mapping from XML tags to the corresponding shard name.
 */
export const regionTags = {
	NAME: 'name',
	NUMNATIONS: 'numnations',
	FLAG: 'flag',
	POWER: 'power',
	TAG: 'tags',
	FOUNDER: 'founder',
	GOVERNOR: 'governor',
	DELEGATE: 'delegate',
} as const satisfies Record<string, keyof Region>;

/**
 * A mapping from the name of each shard to its corresponding type in a parsed
 * region object.
 */
export type Region = {
	name: string;
	numnations: number;
	flag: string;
	power: string;
	tags: Set<string>;
	founder: string | null;
	governor: string | null;
	delegate: string | null;
};
