<script>
    export let videoId;
    export let channelId;
    export let title;
    export let channelTitle;
    export let description;
    export let thumbnails;

    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    const channelLink = `https://www.youtube.com/channel/${channelId}`;
    const thumbnail = thumbnails.medium.url;

    const AddToBookmarks = () => {
        const toUpdate = {};
        toUpdate[videoId] = null;
        bookmarkRef.update(toUpdate);
    }
</script>

<div class="searchResult">
    <a href={videoLink}><img src={thumbnail} alt="thumbnail" /></a>

    <div class="panel">
        <div class="titles">
            <a class="title" href={videoLink}><h2>{title}</h2></a>
            <a class="channel" href={channelLink}><h4>{channelTitle}</h4></a>
        </div>
        <p class="description">{description}</p>
        <button on:click={AddToBookmarks}>BOOKMARK</button>
    </div>
</div>

<style lang="scss">
    .searchResult {
        width: 100%;
        display: flex;
        margin-bottom: 50px;

        @media (max-width: 900px) {
            flex-direction: column;
            text-align: center;
        }
    }

    img {
        @media (min-width: 900px) { margin-right: 30px }
        @media (max-width: 900px) { margin-bottom: 30px }
    }

    .panel {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        @media (max-width: 900px) {
            align-items: center;

            .description { margin: 25px 0 }
        }
    }

    .titles {
        .title { font-size: 0.9em }
        .channel { color: #aaa; transition: none }
        .channel:hover { color: #fff }
    }

    button {
        width: 120px;
        padding: 8px 0;
        opacity: .8;
        cursor: pointer;

        &:hover { opacity: 1; border-radius: 5px }
    }
</style>