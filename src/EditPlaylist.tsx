import {useAppDispatch, useAppSelector} from "./store.ts";
import {useState} from "react";
import {LOCATION_HOME} from "./data/constants.ts";
import {navigate} from "./slices/locationReducer.ts";
import {afterEditPlaylist, pushError} from "./slices/mediaReducer.ts";
import type {PlayList} from "./data/data.ts";
import {getService} from "./service/service.ts";

const EditPlaylist = () => {

    const dispatch = useAppDispatch()

    const editP = useAppSelector((state) => state.media.editPlaylist)
    const playList = useAppSelector((state) => state.media.playList)
    const userId = useAppSelector((state) => state.media.user.id)
    const adding = editP.adding

    let startDescription = ''
    if (!adding) {
        // get the current playlist and populate the value
        const editPlaylist = playList.filter((item) => item.playlistId === editP.id)

        if (editPlaylist.length > 0) {
            startDescription = editPlaylist[0].description
        }
    }

    const [newDescription, setNewDescription] = useState<string>(startDescription);

    const cancel = () => {
        dispatch(navigate(LOCATION_HOME))
    }

    const save = async () => {
        try {
            const newData: PlayList = {
                playlistId: editP.id, description: newDescription, userId: userId
            }

            if (adding) {
                await getService().addPlaylist(newData)
            } else {
                await getService().updatePlaylist(newData)
            }

            // if all good, after editing
            dispatch(afterEditPlaylist({id: editP.id, adding, userId, description: newDescription}))

            // go back
            dispatch(navigate(LOCATION_HOME))
        } catch (e: any) {
            dispatch(pushError(e))
        }
    }

    return (
        <div className="content">
            <h1>
                {adding && 'Add'} {!adding && 'Edit'} Playlist
            </h1>

            <table className="table margin-top">
                <tbody>
                <tr>
                    <td>Description:</td>
                    <td>
                        <input
                            type="text"
                            className="form-input"
                            value={newDescription}
                            onChange={(event) => setNewDescription(event.target.value)}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            <button className="regular-btn margin-top" onClick={save}>Save</button>
            <button className="regular-btn margin-top" onClick={cancel}>Cancel</button>
        </div>
    )
}

export default EditPlaylist;

