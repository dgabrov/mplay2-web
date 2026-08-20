import {useAppDispatch, useAppSelector} from "./store.ts";
import {navigate} from "./slices/locationReducer.ts";
import {LOCATION_HOME} from "./data/constants.ts";
import type {Media} from "./data/data.ts";
import {afterMediaDelete, pushError} from "./slices/mediaReducer.ts";
import {getService} from "./service/service.ts";

const CdelMedia = () => {

    const dispatch = useAppDispatch();

    // get the slice from the store and proceed with it
    const ids : string[] = useAppSelector((state) => state.media.deleteMedia);
    const mediaList: Media[] = useAppSelector((state) => state.media.mediaList);

    const filteredMedia = mediaList.filter((media: Media) => ids.includes(media.id))

    const proceedDelete = async () => {
        try {
            await getService().deleteMedia(ids)

            // remove the list from the medialist
            dispatch(afterMediaDelete(ids))

            // go back to the page
            dispatch(navigate(LOCATION_HOME))
        } catch(e: any){
            dispatch(pushError(e));
        }


    };

    const cancel = () => {
        dispatch(navigate(LOCATION_HOME))
    }

    return (
        <div className="content">
            <h1>Confirm Delete</h1>
            <h2>Please confirm deletion of the items below</h2>

            <table className="table margin-top">
                <thead>
                <tr>
                    <td>Name</td>
                </tr>
                </thead>
                <tbody>
                {filteredMedia.map((media: Media) => (
                    <tr key={media.id}>
                        <td>{media.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className="regular-btn margin-top" onClick={proceedDelete}>Delete</button>
            <button className="regular-btn margin-top" onClick={cancel}>Cancel</button>
        </div>
    );

}

export default CdelMedia;
