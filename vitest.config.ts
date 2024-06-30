import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import macros from 'unplugin-parcel-macros';

export default defineWorkersConfig({
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
			},
		},
		coverage: {
			provider: 'istanbul',
			include: ['src/**/*.ts'],
		},
	},
	plugins: [macros.vite()],
});
