import {useAppDispatch, useAppSelector} from "./store.ts";
import {navigate} from "./slices/locationReducer.ts";
import {LOCATION_HOME} from "./data/constants.ts";

const DoPlayMedia = () => {

    const dispatch = useAppDispatch();

    const media = useAppSelector((state) => state.media.playMedia)

    const id = media ? media.id : "";
    const description = media ? media.description : "";

    const goBack = () => {
        dispatch(navigate(LOCATION_HOME))
    }

    return (
        <div className="content">
            <h1>Play</h1>
            <h2>Media: {description}</h2>

            <div>video tag here {id}</div>

            <div className="margin-top">
                <button className="regular-btn">&lt; 10sec</button>
                <button className="regular-btn">Start/Stop</button>
                <button className="regular-btn">&gt; 10sec</button>
            </div>
            <div>
                <button className="regular-btn margin-top" onClick={goBack}>Back</button>
            </div>

        </div>
    )
}

export default DoPlayMedia;
