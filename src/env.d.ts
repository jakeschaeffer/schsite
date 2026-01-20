declare module "@pagefind/default-ui" {
	declare class PagefindUI {
		constructor(arg: unknown);
	}
}

interface ImportMetaEnv {
	readonly TMDB_API_KEY: string;
	readonly TRAKT_CLIENT_ID?: string;
	readonly TRAKT_ACCESS_TOKEN?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
