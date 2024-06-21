/**
 * A mapping from XML tags to the corresponding shard name.
 */
export const nationTags = {
	NAME: 'name',
	TYPE: 'type',
	CATEGORY: 'category',
	FLAG: 'flag',
	POPULATION: 'population',
	DEMONYM2PLURAL: 'demonym2plural',
	NOTABLE: 'notable',
	ADMIRABLE: 'admirables',
} as const satisfies Record<string, keyof Nation>;

/**
 * A mapping from the name of each shard to its corresponding type in a parsed
 * nation object.
 */
export type Nation = {
	name: string;
	type: string;
	category: string;
	flag: string;
	population: number;
	demonym2plural: string;
	notable: string;
	admirables: string[];
};
