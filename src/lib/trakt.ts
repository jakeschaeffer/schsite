/**
 * Trakt.tv API Integration
 * Fetches watch history from Trakt at build time
 */

import type { Rating, WatchEntry, YearGroup } from "@/data/watch-history";

const TRAKT_BASE_URL = "https://api.trakt.tv";
const TRAKT_API_VERSION = "2";

// Temporary interface for entries with watch dates (used internally)
interface TraktWatchEntry {
	tmdbId: number;
	type: "movie" | "tv";
	notes?: string;
	rating?: Rating | undefined;
	watchedAt: string;
}

// Trakt API response types
interface TraktMovie {
	movie: {
		title: string;
		year: number;
		ids: {
			trakt: number;
			slug: string;
			imdb: string;
			tmdb: number;
		};
	};
	watched_at: string;
	rating?: number;
}

interface TraktShow {
	show: {
		title: string;
		year: number;
		ids: {
			trakt: number;
			slug: string;
			imdb: string;
			tmdb: number;
		};
	};
	seasons: Array<{
		number: number;
		episodes: Array<{
			number: number;
			watched_at: string;
			rating?: number;
		}>;
	}>;
}

/**
 * Map Trakt rating (1-10 scale) to our thumbs system
 */
function mapTraktRating(rating?: number): Rating | undefined {
	if (!rating) return undefined;
	if (rating >= 8) return "up"; // 8-10 = thumbs up
	if (rating >= 5) return "meh"; // 5-7 = meh
	return "down"; // 1-4 = thumbs down
}

/**
 * Format episode range for notes
 */
function formatEpisodeRange(episodes: number[]): string {
	if (episodes.length === 0) return "";
	if (episodes.length === 1) return `E${episodes[0]}`;

	// Sort episodes
	const sorted = [...episodes].sort((a, b) => a - b);

	// Find consecutive ranges
	const ranges: string[] = [];
	let start = sorted[0]!;
	let end = sorted[0]!;

	for (let i = 1; i <= sorted.length; i++) {
		if (i < sorted.length && sorted[i] === end + 1) {
			end = sorted[i]!;
		} else {
			if (start === end) {
				ranges.push(`E${start}`);
			} else {
				ranges.push(`E${start}-${end}`);
			}
			if (i < sorted.length) {
				start = sorted[i]!;
				end = sorted[i]!;
			}
		}
	}

	return ranges.join(", ");
}

/**
 * Fetch watched movies from Trakt
 */
async function fetchWatchedMovies(): Promise<TraktWatchEntry[]> {
	const clientId = import.meta.env.TRAKT_CLIENT_ID;
	const accessToken = import.meta.env.TRAKT_ACCESS_TOKEN;

	if (!clientId || !accessToken) {
		console.log("Trakt credentials not configured, skipping movie fetch");
		return [];
	}

	try {
		const response = await fetch(`${TRAKT_BASE_URL}/sync/watched/movies`, {
			headers: {
				"Content-Type": "application/json",
				"trakt-api-version": TRAKT_API_VERSION,
				"trakt-api-key": clientId,
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			console.error(`Failed to fetch Trakt movies: ${response.status} ${response.statusText}`);
			return [];
		}

		const data = (await response.json()) as TraktMovie[];

		return data.map((item) => ({
			tmdbId: item.movie.ids.tmdb,
			type: "movie" as const,
			notes: item.movie.title,
			rating: mapTraktRating(item.rating) as Rating | undefined,
			watchedAt: item.watched_at,
		}));
	} catch (error) {
		console.error("Error fetching Trakt movies:", error);
		return [];
	}
}

/**
 * Fetch watched TV shows from Trakt
 */
async function fetchWatchedShows(): Promise<TraktWatchEntry[]> {
	const clientId = import.meta.env.TRAKT_CLIENT_ID;
	const accessToken = import.meta.env.TRAKT_ACCESS_TOKEN;

	if (!clientId || !accessToken) {
		console.log("Trakt credentials not configured, skipping TV show fetch");
		return [];
	}

	try {
		const response = await fetch(`${TRAKT_BASE_URL}/sync/watched/shows`, {
			headers: {
				"Content-Type": "application/json",
				"trakt-api-version": TRAKT_API_VERSION,
				"trakt-api-key": clientId,
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			console.error(`Failed to fetch Trakt shows: ${response.status} ${response.statusText}`);
			return [];
		}

		const data = (await response.json()) as TraktShow[];

		// Group episodes by season for each show
		const entries: TraktWatchEntry[] = [];

		for (const item of data) {
			for (const season of item.seasons) {
				if (season.episodes.length === 0) continue;

				const episodeNumbers = season.episodes.map((ep) => ep.number);
				const episodeRange = formatEpisodeRange(episodeNumbers);
				const notes = `S${season.number}${episodeRange}`;

				// Use the rating from the first episode (if available)
				const rating = mapTraktRating(season.episodes[0]?.rating);

				// Use the last watch date as the entry date
				const lastWatchDate =
					season.episodes[season.episodes.length - 1]?.watched_at || new Date().toISOString();

				entries.push({
					tmdbId: item.show.ids.tmdb,
					type: "tv" as const,
					notes,
					rating,
					watchedAt: lastWatchDate,
				});
			}
		}

		return entries;
	} catch (error) {
		console.error("Error fetching Trakt shows:", error);
		return [];
	}
}

/**
 * Fetch all watch history from Trakt and organize by year
 */
export async function getTraktWatchHistory(): Promise<YearGroup[]> {
	const [movies, shows] = await Promise.all([fetchWatchedMovies(), fetchWatchedShows()]);

	const allEntries = [...movies, ...shows];

	// Group by year based on watched_at date
	const byYear = new Map<number, WatchEntry[]>();

	for (const entry of allEntries) {
		const watchedAt = (entry as any).watchedAt;
		if (!watchedAt) continue;

		const year = new Date(watchedAt).getFullYear();
		if (!byYear.has(year)) {
			byYear.set(year, []);
		}

		// Remove watchedAt from the final entry
		const { watchedAt: _, ...cleanEntry } = entry as any;
		byYear.get(year)!.push(cleanEntry);
	}

	// Convert to YearGroup array and sort by year (most recent first)
	const yearGroups: YearGroup[] = Array.from(byYear.entries())
		.map(([year, entries]) => ({ year, entries }))
		.sort((a, b) => b.year - a.year);

	return yearGroups;
}

/**
 * Check if Trakt is configured
 */
export function isTraktConfigured(): boolean {
	return !!(import.meta.env.TRAKT_CLIENT_ID && import.meta.env.TRAKT_ACCESS_TOKEN);
}
