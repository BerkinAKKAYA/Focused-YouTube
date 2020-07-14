<script>
    export let GetPage;
    export let prevPageToken;
    export let nextPageToken;
</script>

<div id="pageButtons">
    <button
        on:click={() => GetPage(prevPageToken)}
        class={prevPageToken ? "" : "disabled"}
    >Previous Page</button>
    <button
        on:click={() => GetPage(nextPageToken)}
        class={nextPageToken ? "" : "disabled"}
    >Next Page</button>
</div>

<style lang="scss">
    button { padding: 10px; border-radius: 5px; }
    button.disabled {
        opacity: .5;
        cursor: not-allowed;
    }
    button:not(.disabled) {
        opacity: .8;
        cursor: pointer;

        &:hover { opacity: 1 }
    }
</style>