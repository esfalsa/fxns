/**
 * A mapping from the name of each shard to its corresponding XML tag.
 */
export const regionTags = {
	NAME: 'name' as const,
	NUMNATIONS: 'numnations' as const,
} as const satisfies Record<string, keyof Region>;

/**
 * A mapping from the name of each shard to its corresponding type in a parsed
 * nation object.
 */
export type Region = {
	name: string;
	numnations: number;
};
