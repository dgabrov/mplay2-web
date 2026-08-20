import {useAppDispatch, useAppSelector} from "./store.ts";
import {LOCATION_HOME} from "./data/constants.ts";
import {afterPlaylistDelete, pushError} from "./slices/mediaReducer.ts";
import {navigate} from "./slices/locationReducer.ts";
import {getService} from "./service/service.ts";

const CdelPlaylist = () => {
    const dispatch = useAppDispatch();

    const playList = useAppSelector((state) => state.media.playList)
    const ids = useAppSelector((state) => state.media.deletePlaylist)

    const filteredPlaylist = playList.filter((item) => ids.includes(item.playlistId))


    const cancel = () => {
        dispatch(navigate(LOCATION_HOME))
    }

    const proceedDelete = async () => {
        try {
            await getService().deletePlaylist(ids)

            dispatch(afterPlaylistDelete(ids))
            dispatch(navigate(LOCATION_HOME))
        } catch(e: any){
            dispatch(pushError(e))
        }
    }

    return (
        <div className="content">
            <h1>Confirm Delete</h1>
            <h2>Please confirm deletion of the playlists below</h2>

            <table className="table margin-top">
                <thead>
                <tr>
                    <td>Playlist</td>
                </tr>
                </thead>
                <tbody>
                {filteredPlaylist.map((playlist) => (<tr key={playlist.playlistId}><td>{playlist.description}</td></tr>))}
                </tbody>
            </table>
            <button className="regular-btn margin-top" onClick={proceedDelete}>Delete</button>
            <button className="regular-btn margin-top" onClick={cancel}>Cancel</button>
        </div>

    )
}

export default CdelPlaylist;
