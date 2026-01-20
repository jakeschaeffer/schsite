/**
 * Watch History Data
 * Organized by year with notes about what was watched
 */

export type WatchType = "movie" | "tv";
export type Rating = "up" | "down" | "meh";

export interface WatchEntry {
	tmdbId: number;
	type: WatchType;
	notes?: string; // What you watched (e.g., "S1E1-3", "All of Season 1", etc.)
	rating?: Rating; // Optional thumbs up/down/meh rating
}

export interface YearGroup {
	year: number;
	entries: WatchEntry[];
}

/**
 * Watch history organized by year
 * Most recent year first
 */
export const watchHistory: YearGroup[] = [
	{
		year: 2025,
		entries: [
			{ tmdbId: 864, type: "movie", notes: "Cool Runnings" },
			{ tmdbId: 1438, type: "tv", notes: "The Wire S1E9-11" },
			{ tmdbId: 249522, type: "tv", notes: "Beast Games S1" },
			// Note: "Life in Yakult" not found on TMDB
			{ tmdbId: 95396, type: "tv", notes: "Severance S2E1" },
			{ tmdbId: 95396, type: "tv", notes: "Severance S2E2" },
			{ tmdbId: 864, type: "movie", notes: "Cool Runnings (rewatch)" },
			{ tmdbId: 249522, type: "tv", notes: "Beast Games E5" },
			{ tmdbId: 95396, type: "tv", notes: "Severance S2E3" },
			// Note: "Grammys" and "Superbowl" are not on TMDB (live events)
			{ tmdbId: 974576, type: "movie", notes: "Conclave" },
			{ tmdbId: 249522, type: "tv", notes: "Beast Games (continued)" },
			{ tmdbId: 95396, type: "tv", notes: "Severance S2E4" },
			{ tmdbId: 974576, type: "movie", notes: "Conclave (rewatch)" },
			{ tmdbId: 1013850, type: "movie", notes: "A Real Pain" },
			{ tmdbId: 95396, type: "tv", notes: "Severance S2E5-8" },
			{ tmdbId: 489, type: "movie", notes: "Good Will Hunting" },
			// Note: "Hadestown" is a Broadway show, not on TMDB
			{ tmdbId: 228878, type: "tv", notes: "Common Side Effects E1" },
			// Note: "We Live In Time" - need to verify if this is the movie
			{ tmdbId: 95396, type: "tv", notes: "Severance S2E9" },
			{ tmdbId: 95396, type: "tv", notes: "Severance S2E10" },
			{ tmdbId: 95396, type: "tv", notes: "Severance S2E10 (rewatch)" },
			// Note: "Pick of the litter" - unclear which title this refers to
			{ tmdbId: 1064213, type: "movie", notes: "Anora" },
			{ tmdbId: 111803, type: "tv", notes: "White Lotus S3E6-E8" },
			{ tmdbId: 549509, type: "movie", notes: "The Brutalist" },
			// Note: "Pick of the Litter" mentioned again
			{ tmdbId: 14658, type: "tv", notes: "Survivor S48" },
			{ tmdbId: 1104, type: "tv", notes: "Mad Men S1E1" },
			{ tmdbId: 100088, type: "tv", notes: "The Last of Us S2E1-3" },
			{ tmdbId: 204284, type: "tv", notes: "The Rehearsal S2E1-2" },
			{ tmdbId: 100088, type: "tv", notes: "TLOU S2E4-5" },
			{ tmdbId: 250307, type: "tv", notes: "The Pitt E1-3" },
			{ tmdbId: 250307, type: "tv", notes: "The Pitt E4-15" },
			{ tmdbId: 204284, type: "tv", notes: "The Rehearsal S2E4" },
			{ tmdbId: 93241, type: "tv", notes: "Uzumaki E4" },
			{ tmdbId: 1104, type: "tv", notes: "Mad Men S1E2" },
			{ tmdbId: 661539, type: "movie", notes: "A Complete Unknown" },
			{ tmdbId: 823219, type: "movie", notes: "Flow (cat left boat)" },
			{ tmdbId: 157744, type: "tv", notes: "1923 E1" },
			{ tmdbId: 9614, type: "movie", notes: "Happy Gilmore (halfway)" },
			{ tmdbId: 247767, type: "tv", notes: "The Studio E1-3" },
			{ tmdbId: 1078605, type: "movie", notes: "Weapons" },
			{ tmdbId: 247767, type: "tv", notes: "The Studio E4" },
			{ tmdbId: 247619, type: "tv", notes: "Overcompensating" },
			{ tmdbId: 552524, type: "movie", notes: "Lilo & Stitch (new)" },
			{ tmdbId: 253941, type: "tv", notes: "The Paper E1-2" },
			{ tmdbId: 1429, type: "tv", notes: "Attack on Titan S1" },
			{ tmdbId: 1018, type: "movie", notes: "Mulholland Drive" },
			{ tmdbId: 14658, type: "tv", notes: "Survivor S49E1-4" },
			{ tmdbId: 1429, type: "tv", notes: "Attack on Titan S2E1-3" },
			{ tmdbId: 60573, type: "tv", notes: "Silicon Valley S1E1-7" },
			{ tmdbId: 4586, type: "tv", notes: "Gilmore Girls S1E1" },
			{ tmdbId: 75656, type: "movie", notes: "Now You See Me (halfway)" },
			{ tmdbId: 1429, type: "tv", notes: "Attack on Titan S2E4-12" },
			{ tmdbId: 95730, type: "tv", notes: "Love on the Spectrum S3E3" },
			{ tmdbId: 225171, type: "tv", notes: "Pluribus E1-3" },
			{ tmdbId: 1278719, type: "movie", notes: "Desire: The Carl Craig Story" },
			{ tmdbId: 152601, type: "movie", notes: "Her" },
			{ tmdbId: 1429, type: "tv", notes: "Attack on Titan S3E1-" },
		],
	},
	// Add more years as needed
	// {
	//   year: 2024,
	//   entries: [...]
	// },
];

/**
 * Get all entries for a specific year
 */
export function getEntriesByYear(year: number): WatchEntry[] {
	const yearGroup = watchHistory.find((group) => group.year === year);
	return yearGroup ? yearGroup.entries : [];
}

/**
 * Get movie entries with notes for a specific year
 * Only returns entries that have notes (to display what was watched)
 */
export function getMovieEntriesWithNotes(year: number): WatchEntry[] {
	const entries = getEntriesByYear(year);
	return entries.filter((entry) => entry.type === "movie" && entry.notes);
}

/**
 * Get TV show entries with notes for a specific year
 * Only returns entries that have notes (to display what was watched)
 */
export function getTVShowEntriesWithNotes(year: number): WatchEntry[] {
	const entries = getEntriesByYear(year);
	return entries.filter((entry) => entry.type === "tv" && entry.notes);
}

/**
 * Get all unique movie IDs for a specific year (with notes only)
 */
export function getMovieIdsByYear(year: number): number[] {
	const entries = getMovieEntriesWithNotes(year);
	const movieIds = entries.map((entry) => entry.tmdbId);
	// Remove duplicates
	return [...new Set(movieIds)];
}

/**
 * Get all unique TV show IDs for a specific year (with notes only)
 */
export function getTVShowIdsByYear(year: number): number[] {
	const entries = getTVShowEntriesWithNotes(year);
	const tvIds = entries.map((entry) => entry.tmdbId);
	// Remove duplicates
	return [...new Set(tvIds)];
}

/**
 * Get all years in watch history
 */
export function getAllYears(): number[] {
	return watchHistory.map((group) => group.year);
}

/**
 * Get watch history from Trakt (if configured) or fall back to manual data
 * This async function should be called at build time in pages
 */
export async function getWatchHistory(): Promise<YearGroup[]> {
	// Try to import Trakt integration
	try {
		const { getTraktWatchHistory, isTraktConfigured } = await import("@/lib/trakt");

		if (isTraktConfigured()) {
			console.log("Loading watch history from Trakt...");
			const traktHistory = await getTraktWatchHistory();

			if (traktHistory.length > 0) {
				console.log(`Loaded ${traktHistory.length} years of data from Trakt`);
				return traktHistory;
			}

			console.log("Trakt returned no data, falling back to manual data");
		} else {
			console.log("Trakt not configured, using manual watch history");
		}
	} catch (error) {
		console.error("Error loading from Trakt, falling back to manual data:", error);
	}

	// Fall back to manual data
	return watchHistory;
}
