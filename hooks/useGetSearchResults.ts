// hooks/useSearchResultsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { fetchSearchResults, SearchResult } from "@/api/MockApi";

type UseSearchResultsQueryOptions = {
	searchTerm: string; // The debounced search term
	minQueryLength: number;
	isSearchEnabled: boolean; // e.g., isFocused
}

export const useSearchResultsQuery = ({
	searchTerm,
	minQueryLength,
	isSearchEnabled,
}: UseSearchResultsQueryOptions) => {
	const {
		data: searchResults,
		isLoading,
		isError,
		error,
		refetch,
		isFetching, // Useful to know if a refetch is in progress
	} = useQuery<SearchResult[], Error>({
		queryKey: ["searchResults", searchTerm], // Use the debounced searchTerm directly
		queryFn: () => fetchSearchResults(searchTerm),
		enabled: isSearchEnabled && searchTerm.length >= minQueryLength,
	});

	return {
		searchResults,
		isLoadingSearchResults: isLoading,
		isFetchingSearchResults: isFetching, // Export isFetching
		isErrorSearchResults: isError,
		searchError: error,
		refetchSearchResults: refetch,
	};
};
