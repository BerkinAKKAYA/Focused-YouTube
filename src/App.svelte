<script>
    import { FirebaseApp, User, Doc } from "sveltefire";
    import SearchResults from './SearchResults.svelte';
    import PageButtons from './PageButtons.svelte';
    import firebase from "firebase/app";
    import "firebase/firestore";
    import "firebase/auth";
    import "firebase/performance";
    import "firebase/analytics";

    const firebaseConfig = {
        apiKey: PROCESS.env.FIREBASE_API_KEY,
        authDomain: "focused-yt.firebaseapp.com",
        databaseURL: "https://focused-yt.firebaseio.com",
        projectId: "focused-yt",
        storageBucket: "focused-yt.appspot.com",
        messagingSenderId: PROCESS.env.MESSAGING_SENDER_ID,
        appId: PROCESS.env.APP_ID,
        measurementId: PROCESS.env.MEASUREMENT_ID
    };

    const authProvider = new firebase.auth.GoogleAuthProvider();
    firebase.initializeApp(firebaseConfig);

    // INITIALIZE FIRESTORE
    let bookmarkSnippets = [];
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var docRef = firebase.firestore().collection("bookmarks").doc(user.uid);

            docRef.get().then(doc => {
                if (!doc.exists) {
                    docRef.set({});
                }

                // !doc.exists && docRef.set({})
            });

            docRef.onSnapshot(async (doc) => {
                const keys = Object.keys(doc.data());
                bookmarkSnippets = [];

                for (const key of keys) {
                    const snippet = await GetSnippetByID(key);
                    bookmarkSnippets = [...bookmarkSnippets, snippet];
                }
            })
        }
    });

    let searchInput = "";
    let searchResults = null;
    
    const API_KEY = PROCESS.env.YOUTUBE_API_KEY;
    const BASE_URL = "https://www.googleapis.com/youtube/v3";

    let prevPageToken = "no-token",
        nextPageToken = "no-token";
    const ResetTokens = () => { prevPageToken = nextPageToken = "no-token" }

    function GetPage(pageToken) {
        if (pageToken == "no-token") { return }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        GetSearchResults(searchInput, pageToken)
            .then(results => {
                searchResults = results.items;
                prevPageToken = results.prevPageToken || "";
                nextPageToken = results.nextPageToken || "";
            });
    }
    function Search(e) { if (e.keyCode === 13) { GetPage("") } }

    async function GetSnippetByID(id) {
        const URL = `${BASE_URL}/videos?part=snippet&key=${API_KEY}&id=${id}`;
        const res = await fetch(URL);
        const json = await res.json();
        return json.items ? json.items[0] : null;
    }
    async function GetSearchResults(searchInput, pageToken="") {
        const URL = `${BASE_URL}/search?part=snippet&key=${API_KEY}&type=video&maxResults=10&q=${searchInput}&pageToken=${pageToken}`;
        const res = await fetch(URL);
        const json = await res.json();

        json.error && alert(json.error.errors[0].reason);
        return json;
    }
</script>

<FirebaseApp {firebase}>
    <User let:user let:auth>
        <!-- [HEADER] SIGN IN -->
        <div id="sign-in-panel" slot="signed-out">
            <header><img src="/img/logo.png" alt="logo" /></header>
            <h1>YouTube without distractions</h1>
            <h2>See only what you decide to see.</h2>
            <div id="sign-in-button" on:click={() => auth.signInWithPopup(authProvider)}></div>
        </div>

        <!-- [HEADER] SIGNED IN -->
        <header>
            <img
                src="/img/logo.png"
                alt="logo"
                on:click={() => {searchResults=""; ResetTokens()}} />

            <input
                type="text"
                bind:value={searchInput}
                on:keyup={Search}
                placeholder="Search..." />

            <p id="sign-out" on:click={() => auth.signOut()}>Sign Out</p>
        </header>

        <Doc path={`bookmarks/${user.uid}`} let:data={bookmarks} let:ref={bookmarkRef} log>
            <span slot="loading">Loading...</span>
            <span slot="fallback">An error occurred!</span>

            {#if searchResults}
                <SearchResults bind:searchResults { bookmarkRef } />
                <PageButtons {GetPage} bind:prevPageToken bind:nextPageToken />
            {:else}
                <!-- BOOKMARKS -->
                {#if bookmarkSnippets.length > 0}
                    <div id="bookmarks">
                        {#each bookmarkSnippets as bookmark}
                        <div class="bookmark">
                            <a href={`https://www.youtube.com/watch?v=${bookmark.id.videoId}`}>
                                <img src={bookmark.snippet.thumbnails.medium.url} alt="thumbnail" />
                            </a>
                            <div class="titles">
                                <a class="title" href={`https://www.youtube.com/watch?v=${bookmark.id.videoId}`}>
                                    <h2>{bookmark.snippet.title}</h2>
                                </a>
                                <a class="channel" href={`https://www.youtube.com/channel/${bookmark.snippet.channelId}`}>
                                    <h4>{bookmark.snippet.channelTitle}</h4>
                                </a>
                            </div>
                            <button
                                class="remove"
                                on:click={() => {
                                    const toDelete = {};
                                    toDelete[bookmark.id] = firebase.firestore.FieldValue.delete();
                                    bookmarkRef.update(toDelete);
                                }}>REMOVE FROM BOOKMARKS</button>
                        </div>
                        {/each}
                    </div>
                {:else}
                    <p id="no-bookmarks">YOU HAVE NO BOOKMARKS</p>
                {/if}
            {/if}
        </Doc>
    </User>
</FirebaseApp>
<footer><a href="https://berkinakkaya.github.io">Berkin AKKAYA</a></footer>

<style lang="scss">
    header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 75px;

        img {
            height: 45px;
            cursor: pointer;
        }

        input {
            margin: 0 100px;
            padding: 14px 16px;
            width: 350px;
            background-color: #000;
            color: white;
            font-size: 1.05em;
            border-bottom: 2px solid #333;

            &:hover { border-color: #666 }
            &:focus { border-color: #aaa }
        }

        #sign-out {
            opacity: .75;
            font-size: 1.1em;
            color: #aaa;
            cursor: pointer;
            padding: 10px 0;
            min-width: 100px;
            text-align: center;

            &:hover { color: #fff }
        }

        @media (max-width: 900px) {
            flex-direction: column;
            input { margin: 30px 0 }
        }
    }
    #sign-in-panel {
        margin: 100px 50px;
        display: flex;
        flex-direction: column;
        align-items: center;

        h1,h2 { text-align: center }
        h2 { color: #999; padding-top: 20px }

        #sign-in-button {
            width: 288px;
            height: 80px;
            margin-top: 80px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            background-image: url("/img/sign-in.png");
            cursor: pointer;
        }
    }

    #bookmarks {
        width: 1000px;
        max-width: 80vw;

        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 20px;
        row-gap: 20px;

        .bookmark {
            .title h2 { font-size: 1.3em; padding: 20px 0 10px 0 }
            .channel { color: #aaa }
            .channel:hover { color: #fff }
            .remove { margin-top: 10px; padding: 5px }
        }
    }
    #no-bookmarks {
        text-align: center;
        font-size: 1.7em;
        padding: 50px 0;
    }
    footer {
        text-align: center;
        font-size: 1.1em;
        margin: 75px;
    }
</style>