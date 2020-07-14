<script>
    import Bookmark from './Bookmark.svelte';
    export let bookmarkSnippets;
    export let bookmarkRef;
    export let firebase;
</script>

<div id="bookmarks">
    {#each bookmarkSnippets as bookmark}
    <Bookmark {bookmarkRef} {firebase} videoId={bookmark.id} {...bookmark.snippet} />
    {/each}
</div>

<style>
    #bookmarks {
        width: 1000px;
        max-width: 80vw;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 25px;
        row-gap: 25px;
    }
</style>