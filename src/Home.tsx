import {useAppDispatch, useAppSelector} from "./store.ts";
import {useState} from "react";
import {
    contentPlaylist,
    deleteMedia,
    deletePlaylist, doPlayList, doPlayMedia,
    editPlaylist,
    goEditMedia,
    pushError,
    setMediaList,
    setPlayList
} from "./slices/mediaReducer.ts";
import {getService} from "./service/service.ts";
import type {Media, PlayList} from "./data/data.ts";
import {v7} from "uuid";
import {navigate} from "./slices/locationReducer.ts";
import {
    LOCATION_CONTENT_PLAYLIST,
    LOCATION_DELETE_MEDIA,
    LOCATION_DELETE_PLAYLIST,
    LOCATION_EDIT_MEDIA,
    LOCATION_EDIT_PLAYLIST, LOCATION_PLAY_MEDIA, LOCATION_PLAY_PLAYLIST
} from "./data/constants.ts";

const Home = () => {

    const dispatch = useAppDispatch();

    const mediaList = useAppSelector((store) => store.media.mediaList);
    const [searchMedia, setSearchMedia] = useState<string>('');
    const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

    const playlists = useAppSelector((store) => store.media.playList);
    const [searchList, setSearchList] = useState<string>('');
    const [selectedPlaylist, setSelectedPlaylist] = useState<string[]>([]);


    async function proceedSearchMedia() {
        try {
            // search
            const newMediaList: Media[] = await getService().searchMedia(searchMedia)
            dispatch(setMediaList(newMediaList))

            setSelectedMedia([])
        } catch (e: any) {
            dispatch(pushError(e))
        }
    }

    function clearMediaList() {
        dispatch(setMediaList([]))
        setSelectedMedia([])
    }

    function trimMedia() {
        if (selectedMedia.length > 0) {
            const filteredMedia = mediaList.filter((media) => selectedMedia.includes(media.id))

            dispatch(setMediaList(filteredMedia))
        }
    }

    function toggleSelectAllMedia(event: any) {
        const checked = event.target.checked

        let newSelected: string[] = []

        if (checked) {
            newSelected = mediaList.map((media) => media.id)
        }

        setSelectedMedia(newSelected)
    }

    function isSelectAllMedia(): boolean {
        let res = true;

        if (mediaList.length != selectedMedia.length) {
            res = false;
        } else if (mediaList.length === 0) {
            res = false;
        } else {
            const presentMedia = mediaList.filter((item) => selectedMedia.includes(item.id));
            if (presentMedia.length != mediaList.length) {
                res = false;
            }
        }

        return res
    }

    function isSelectedMedia(id: string): boolean {
        return selectedMedia.includes(id);
    }

    function edit(id: string) {
        return (event: any) => {
            event.preventDefault();
            const adding = false;

            dispatch(goEditMedia({id, adding}))
            dispatch(navigate(LOCATION_EDIT_MEDIA))
        }
    }

    function play(id: string) {
        return (event: any) => {
            event.preventDefault();

            const item = mediaList.find((media) => media.id === id)
            dispatch(doPlayMedia(item!!))
            dispatch(navigate(LOCATION_PLAY_MEDIA))
        }
    }

    async function proceedSearchPlaylist() {
        try {
            const newPlaylist: PlayList[] = await getService().searchPlaylists(searchList);
            dispatch(setPlayList(newPlaylist))

            setSelectedPlaylist([])
        } catch (e: any) {
            dispatch(pushError(e))
        }
    }

    function clearPlayList() {
        dispatch(setPlayList([]))
        setSelectedPlaylist([])
    }

    function trimPlayList() {
        if (selectedPlaylist.length > 0) {
            const newPlaylist = playlists.filter((item) => selectedPlaylist.includes(item.playlistId))

            dispatch(setPlayList(newPlaylist))
        }
    }

    function toggleSelectOneMedia(id: string) {
        return (event: any) => {
            const checked = event.target.checked
            const filterSelected = selectedMedia.filter((currentId) => currentId !== id)

            if (checked) {
                filterSelected.push(id)
            }

            setSelectedMedia(filterSelected)
        }
    }

    function toggleSelectAllPlaylist(event: any) {
        const checked = event.target.checked
        let newSelected: string[] = []

        if (checked) {
            newSelected = playlists.map((item) => item.playlistId)
        }

        setSelectedPlaylist(newSelected)
    }

    function isSelectAllPlaylist(): boolean {
        let res = true;

        if (selectedPlaylist.length !== playlists.length) {
            res = false;
        } else if (selectedPlaylist.length === 0) {
            res = false;
        } else {
            const filteredLists = playlists.filter((item) => selectedPlaylist.includes(item.playlistId))

            if (filteredLists.length != selectedPlaylist.length) {
                res = false;
            }
        }

        return res;
    }

    function toggleSelectOnePlaylist(id: string) {
        return (event: any) => {
            const checked = event.target.checked

            let filteredIds = selectedPlaylist.filter((currentId) => currentId !== id)

            if (checked) {
                filteredIds.push(id)
            }

            setSelectedPlaylist(filteredIds)
        }
    }

    function isSelectedPlaylist(id: string): boolean {
        return selectedPlaylist.includes(id);
    }

    function playPlaylist(playlistId: string) {
        return () => {
            const pll = playlists.find((playlist) => playlist.playlistId === playlistId);

            dispatch(doPlayList(pll!!))
            dispatch(navigate(LOCATION_PLAY_PLAYLIST))
        }
    }

    function proceedEditPlaylist(id: string) {
        return (event: any) => {
            event.preventDefault();

            const adding = false;

            dispatch(editPlaylist({adding, id}))
            dispatch(navigate(LOCATION_EDIT_PLAYLIST))
        }
    }

    function content(id: string) {
        return (event: any) => {
            event.preventDefault();

            dispatch(contentPlaylist(id))
            dispatch(navigate(LOCATION_CONTENT_PLAYLIST))
        }
    }

    function addMedia() {
        const id = v7();
        const adding = true;

        dispatch(goEditMedia({id, adding}))
        dispatch(navigate(LOCATION_EDIT_MEDIA))
    }

    function removeMedia() {
        if (selectedMedia.length > 0) {
            dispatch(deleteMedia(selectedMedia))
            dispatch(navigate(LOCATION_DELETE_MEDIA))
        } else {
            dispatch(pushError('please select at least one media to delete'))
        }
    }


    function addPlaylist() {
        const id = v7();
        const adding = true;

        dispatch(editPlaylist({adding, id}))
        dispatch(navigate(LOCATION_EDIT_PLAYLIST))
    }

    function removePlaylist() {
        if (selectedPlaylist.length > 0) {
            dispatch(deletePlaylist(selectedPlaylist))
            dispatch(navigate(LOCATION_DELETE_PLAYLIST))
        } else {
            dispatch(pushError('please select at least one playlist'))
        }
    }

    return (
        <div className="content">
            <div className="fl">
                <h1>Media</h1>
                <div>
                    Search:
                    <input type="text" className="form-input margin-left" onChange={(e) => setSearchMedia(e.target.value)}
                           value={searchMedia}/>
                    <button className="regular-btn margin-left" onClick={proceedSearchMedia}>Search</button>
                    <button className="regular-btn margin-left" onClick={clearMediaList}>Clear</button>
                    <button className="regular-btn margin-left" onClick={trimMedia}>Trim</button>
                </div>
                <table className="table margin-top">
                    <thead>
                    <tr>
                        <td><input type="checkbox" onChange={toggleSelectAllMedia} checked={isSelectAllMedia()}/></td>
                        <td>Name</td>
                        <td>Play</td>
                        <td>Edit</td>
                    </tr>
                    </thead>
                    <tbody>
                    {mediaList.length > 0 && mediaList.map((media: Media) => (
                        <tr key={media.id}>
                            <td><input type={'checkbox'} checked={isSelectedMedia(media.id)}
                                       onChange={toggleSelectOneMedia(media.id)}/></td>
                            <td>{media.description}</td>
                            <td><a href={'#'} onClick={play(media.id)}>Play</a></td>
                            <td><a href={'#'} onClick={edit(media.id)}>Edit</a></td>
                        </tr>
                    ))}
                    {mediaList.length === 0 && <tr key={'no items'}>
                        <td colSpan={4}>No items...</td>
                    </tr>}
                    </tbody>
                </table>
                <button className="regular-btn margin-top" onClick={addMedia}>Add</button>
                <button className="regular-btn margin-top margin-left" onClick={removeMedia}>Remove</button>
            </div>

            <div className="fl margin-top">
                <h1>Playlist</h1>
                <div>
                    Search:
                    <input type="text" className="form-input margin-left" value={searchList}
                           onChange={(e) => setSearchList(e.target.value)}/>
                    <button className="regular-btn margin-left" onClick={proceedSearchPlaylist}>Search</button>
                    <button className="regular-btn margin-left" onClick={clearPlayList}>Clear</button>
                    <button className="regular-btn margin-left" onClick={trimPlayList}>Trim</button>
                </div>
                <table className="table margin-top">
                    <thead>
                    <tr>
                        <td><input type="checkbox" onChange={toggleSelectAllPlaylist} checked={isSelectAllPlaylist()}/>
                        </td>
                        <td>Name</td>
                        <td>Play</td>
                        <td>Edit</td>
                        <td>Content</td>
                    </tr>
                    </thead>
                    <tbody>
                    {playlists.length > 0 && playlists.map((play: PlayList) => (
                        <tr key={play.playlistId}>
                            <td><input type="checkbox" onChange={toggleSelectOnePlaylist(play.playlistId)}
                                       checked={isSelectedPlaylist(play.playlistId)}/></td>
                            <td>{play.description}</td>
                            <td><a href="#" onClick={playPlaylist(play.playlistId)}>Play</a></td>
                            <td><a href="#" onClick={proceedEditPlaylist(play.playlistId)}>Edit</a></td>
                            <td><a href="#" onClick={content(play.playlistId)}>Content</a></td>
                        </tr>
                    ))}
                    {playlists.length === 0 && <tr key={'no items'}>
                        <td colSpan={5}>No items...</td>
                    </tr>}
                    </tbody>
                </table>
                <button className="regular-btn margin-top" onClick={addPlaylist}>Add</button>
                <button className="regular-btn margin-top margin-left" onClick={removePlaylist}>Remove</button>
            </div>
        </div>
    )
}

export default Home;
