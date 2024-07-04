import { nationTags } from './nations';
import { proposalTags } from './proposals';
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
