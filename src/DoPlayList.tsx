import {useEffect, useState} from "react";
import {getService} from "./service/service.ts";
import type {Media} from "./data/data.ts";
import {pushError} from "./slices/mediaReducer.ts";
import {useAppDispatch, useAppSelector} from "./store.ts";
import {LOCATION_HOME} from "./data/constants.ts";
import { navigate } from "./slices/locationReducer.ts";

const DoPlayList = () => {

    const dispatch = useAppDispatch()

    const ppl = useAppSelector(state => state.media.proceedPlayList)
    const [playlistMedia, setPlaylistMedia] = useState<Media[]>([])


    const play = (index: number) => {
        return (event: any)=> {
            // TODO
            console.log(event + "," + index)
        }
    }

    const back = () => {
        dispatch(navigate(LOCATION_HOME))
    }

    useEffect(() => {
        getService().getMediaForPlaylist(ppl!!.playlistId).then((result: Media[]) => {
            setPlaylistMedia(result);
        }).catch((err: any) => {
            dispatch(pushError(err))
        })
    }, [])


    return (
        <div className="content">
            <h1>Play</h1>
            <h2>Media: {ppl!!.description}</h2>

            <div className="player-container">
                <div className="player-main">
                    <div className="video-placeholder">video tag here</div>

                    <div className="controls-section">
                        <div className="controls">
                            <button className="control-btn">Previous</button>
                            <button className="control-btn secondary">&lt; 10sec</button>
                            <button className="control-btn primary">Start/Stop</button>
                            <button className="control-btn secondary">&gt; 10sec</button>
                            <button className="control-btn">Next</button>
                        </div>
                    </div>
                </div>

                <div className="player-sidebar">
                    <h3>Playlist</h3>
                    <ul className="playlist">
                        {playlistMedia.map((item, index) => <li className="playlist-item" key={item.id}><a href="#" onClick={play(index)}>play</a> {item.description}</li>)}
                    </ul>
                </div>
            </div>

            <div className="footer-controls">
                <button className="regular-btn" onClick={back}>Back</button>
            </div>

        </div>
    )
}

export default DoPlayList
