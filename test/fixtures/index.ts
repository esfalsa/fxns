import nation from './nation.xml?raw';
// @ts-expect-error apparently Cloudflare Vitest workers handles this import as
// a string, and marks it using a query parameter which means we can't
// also use `?raw`
import nation404 from './nation-404.html';
import region from './region.xml?raw';
import proposals from './proposals.xml?raw';
import illegalProposals from './proposals-illegal.xml?raw';

export { nation, nation404, region, proposals, illegalProposals };

export const standardProposalID = 'westinor_1718510253';
export const entityProposalID = 'the_ice_states_1716956683';
export const illegalProposalID = 'nooby_mc_noobface_1720076086';
