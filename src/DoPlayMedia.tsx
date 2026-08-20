import {useAppDispatch, useAppSelector} from "./store.ts";
import {navigate} from "./slices/locationReducer.ts";
import {LOCATION_HOME} from "./data/constants.ts";
import {useState} from "react";

const DoPlayMedia = () => {

    const dispatch = useAppDispatch();

    const media = useAppSelector((state) => state.media.playMedia)
    const serverUrl = useAppSelector((state) => state.media.serverUrl);
    const id = media ? media.id : "";

    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

    const fullUrl = `${window.location.origin}${serverUrl}/playMedia?id=${id}`;

    const description = media ? media.description : "";

    const goBack = () => {
        if (videoElement) {
            videoElement.pause();
        }
        dispatch(navigate(LOCATION_HOME))
    }

    const removeTen = () => {
        if (videoElement) {
            videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
        }
    }

    const addTen = () => {
        if (videoElement) {
            videoElement.currentTime = videoElement.currentTime + 10;
        }
    }

    const startStop = () => {
        if (videoElement) {
            if (videoElement.paused) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        }
    }

    return (
        <div className="content">
            <h1>Play</h1>
            <h2>Media: {description}</h2>

            <div><video src={fullUrl} ref={(video) => setVideoElement(video)} controls style={{cursor: 'pointer'}}/></div>

            <div className="margin-top">
                <button className="regular-btn" onClick={removeTen}>&lt; 10sec</button>
                <button className="regular-btn margin-left" onClick={startStop}>Start/Stop</button>
                <button className="regular-btn margin-left" onClick={addTen}>&gt; 10sec</button>
            </div>
            <div>
                <button className="regular-btn margin-top" onClick={goBack}>Back</button>
            </div>

        </div>
    )
}

export default DoPlayMedia;
