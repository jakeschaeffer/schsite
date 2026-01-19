declare module "@pagefind/default-ui" {
	declare class PagefindUI {
		constructor(arg: unknown);
	}
}

interface ImportMetaEnv {
	readonly TMDB_API_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
