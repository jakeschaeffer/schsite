/**
 * TMDB (The Movie Database) API Integration
 * Fetches movie and TV show data at build time
 */

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Type definitions for TMDB API responses
export interface Movie {
	id: number;
	title: string;
	poster_path: string | null;
	release_date: string;
	vote_average: number;
	overview: string;
}

export interface TVShow {
	id: number;
	name: string;
	poster_path: string | null;
	first_air_date: string;
	vote_average: number;
	overview: string;
	number_of_seasons: number;
	number_of_episodes: number;
}

/**
 * Get the full poster image URL
 */
export function getPosterUrl(posterPath: string | null): string | null {
	if (!posterPath) return null;
	return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
}

/**
 * Fetch movie details from TMDB API
 */
async function fetchMovie(movieId: number): Promise<Movie | null> {
	const apiKey = import.meta.env.TMDB_API_KEY;

	if (!apiKey) {
		console.error("TMDB_API_KEY is not set in environment variables");
		return null;
	}

	try {
		const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}`);

		if (!response.ok) {
			console.error(`Failed to fetch movie ${movieId}: ${response.status} ${response.statusText}`);
			return null;
		}

		const data = await response.json();
		return data as Movie;
	} catch (error) {
		console.error(`Error fetching movie ${movieId}:`, error);
		return null;
	}
}

/**
 * Fetch TV show details from TMDB API
 */
async function fetchTVShow(showId: number): Promise<TVShow | null> {
	const apiKey = import.meta.env.TMDB_API_KEY;

	if (!apiKey) {
		console.error("TMDB_API_KEY is not set in environment variables");
		return null;
	}

	try {
		const response = await fetch(`${TMDB_BASE_URL}/tv/${showId}?api_key=${apiKey}`);

		if (!response.ok) {
			console.error(`Failed to fetch TV show ${showId}: ${response.status} ${response.statusText}`);
			return null;
		}

		const data = await response.json();
		return data as TVShow;
	} catch (error) {
		console.error(`Error fetching TV show ${showId}:`, error);
		return null;
	}
}

/**
 * Fetch multiple movies by their IDs
 */
export async function getMovies(movieIds: number[]): Promise<Movie[]> {
	const movies = await Promise.all(movieIds.map((id) => fetchMovie(id)));
	return movies.filter((movie): movie is Movie => movie !== null);
}

/**
 * Fetch multiple TV shows by their IDs
 */
export async function getTVShows(showIds: number[]): Promise<TVShow[]> {
	const shows = await Promise.all(showIds.map((id) => fetchTVShow(id)));
	return shows.filter((show): show is TVShow => show !== null);
}

/**
 * Get the year from a date string (YYYY-MM-DD)
 */
export function getYear(dateString: string): string {
	if (!dateString) return "N/A";
	return dateString.split("-")[0] || "N/A";
}

/**
 * Format rating to 1 decimal place
 */
export function formatRating(rating: number): string {
	return rating.toFixed(1);
}
