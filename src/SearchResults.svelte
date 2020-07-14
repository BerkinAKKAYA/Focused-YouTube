<script>
    import SearchResult from './SearchResult.svelte';
    export let searchResults;
    export let bookmarkRef;
</script>

<div id="searchResults">
    {#each searchResults as result}
        <SearchResult
            videoId={result.id.videoId}
            {...result.snippet} 
            { bookmarkRef } />
    {/each}
</div>

<style> #searchResults { width: 1000px; max-width: 80vw } </style>