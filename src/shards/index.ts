import { nationTags, type Nation } from './nations';
import { proposalTags, type Proposal } from './proposals';
import type { Region } from './regions';
import { regionTags } from './regions';

export type { Nation } from './nations';
export type { Region } from './regions';
export type { Proposal } from './proposals';

export type EndpointType = 'nation' | 'region' | 'proposals';

export const shardTags = {
	nation: nationTags,
	region: regionTags,
	proposals: proposalTags,
} as const;

/**
 * A union of the XML tag names for an endpoint type `T`.
 */
export type ShardTag<T extends EndpointType> = string &
	keyof (typeof shardTags)[T];

/**
 * The type of a parsed object for an endpoint type `T`.
 */
export type ShardObject<T extends EndpointType> = {
	nation: Nation;
	region: Region;
	proposals: Proposal;
}[T];

export function isShardTag<T extends EndpointType>(
	str: string,
	endpoint: T,
): str is ShardTag<T> {
	return str in shardTags[endpoint];
}
