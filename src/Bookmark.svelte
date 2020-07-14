<script>
    import Toast from 'svelte-toast';
    const toast = new Toast({position: 'bottom-center'});

    export let videoId;
    export let channelId;
    export let title;
    export let channelTitle;
    export let thumbnails;
    export let firebase;
    export let bookmarkRef;

    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    const channelLink = `https://www.youtube.com/channel/${channelId}`;
    const thumbnail = thumbnails.medium.url;

    const RemoveFromBookmarks = () => {
        const toDelete = {};
        toDelete[videoId] = firebase.firestore.FieldValue.delete();
        bookmarkRef.update(toDelete);
        toast.error("Bookmark Removed");
    }
</script>

<div class="bookmark">
    <a href={videoLink}><img src={thumbnail} alt="thumbnail" /></a>
    <div class="titles">
        <a class="title" href={videoLink}><h2>{title}</h2></a>
        <a class="channel" href={channelLink}><h4>{channelTitle}</h4></a>
    </div>
    <button on:click={RemoveFromBookmarks}>REMOVE</button>
</div>

<style>
    .bookmark {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    h2 { font-size: 1.2em; margin-top: 20px }
    h4 { color: #aaa; margin: 10px 0 }
    h4:hover { color: #fff }
    img { max-width: 100% }
    button { padding: 10px; background-color: #aaa; cursor: pointer; margin-top: 15px }
    button:hover { background-color: rgb(255, 155, 155) }
</style> 