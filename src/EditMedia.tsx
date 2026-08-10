import {useAppDispatch, useAppSelector} from "./store.ts";
import {useState} from "react";
import {LOCATION_HOME} from "./data/constants.ts";
import {navigate} from "./slices/locationReducer.ts";
import {type AfterEditMedia, afterEditMedia, pushError} from "./slices/mediaReducer.ts";
import {getService} from "./service/service.ts";
import type {Media} from "./data/data.ts";

const EditMedia = () => {
    const emed = useAppSelector(state => state.media.editMedia)
    const mediaList = useAppSelector(state => state.media.mediaList)

    const adding = emed.adding

    const id = emed.id

    const dispatch = useAppDispatch()

    // get the media by id
    let descr = ''
    if (!adding) {
        const foundMedia = mediaList.find(media => media.id === id)!!;
        descr = foundMedia.description
    }

    const [description, setDescription] = useState(descr)

    async function save() {
        try {
            const responseMedia : Media = await getService().updateMedia(adding, id, description);
            const aem: AfterEditMedia = {
                id: responseMedia.id,
                userId: responseMedia.userId,
                description: responseMedia.description,
                contentType: responseMedia.contentType,
                size: responseMedia.size,
                width: responseMedia.width,
                height: responseMedia.height,
                adding
            }

            dispatch(afterEditMedia(aem))
            dispatch(navigate(LOCATION_HOME))
        } catch(err : any){
            dispatch(pushError(err))
        }
    }

    function cancel() {
        dispatch(navigate(LOCATION_HOME))
    }

    return (
        <div className="content">
            <h1>{adding ? 'Add' : 'Edit'} Media</h1>

            <table className="table margin-top">
                <tbody>
                <tr>
                    <td>Description:</td>
                    <td><input type="text" className="form-input" value={description} onChange={(event: any) => setDescription(event.target.value)}/></td>
                </tr>
                <tr>
                    <td>File:</td>
                    <td><input type="file" /></td>
                </tr>
                </tbody>
            </table>
            <button className="regular-btn margin-top" onClick={save}>Save</button>
            <button className="regular-btn margin-top" onClick={cancel}>Cancel</button>
        </div>
    )
}

export default EditMedia