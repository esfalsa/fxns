import { shardTags, type EndpointType } from './shards';

export function $createTagsRegExp<T extends EndpointType>(endpoint: T) {
	const tags = Object.keys(shardTags[endpoint]);
	return new RegExp(
		`<(?<tag>${tags.join('|')})>(?<content>.+?)<\\/(?:${tags.join('|')})>`,
		'g',
	);
}
