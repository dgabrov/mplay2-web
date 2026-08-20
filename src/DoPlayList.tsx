import {useEffect, useRef, useState} from "react";
import {getService} from "./service/service.ts";
import type {Media} from "./data/data.ts";
import {pushError} from "./slices/mediaReducer.ts";
import {useAppDispatch, useAppSelector} from "./store.ts";
import {LOCATION_HOME} from "./data/constants.ts";
import {navigate} from "./slices/locationReducer.ts";
import {v7} from "uuid";

const DoPlayList = () => {

    const dispatch = useAppDispatch()

    const ppl = useAppSelector(state => state.media.proceedPlayList)
    const serverUrl = useAppSelector((state) => state.media.serverUrl);

    const [playlistMedia, setPlaylistMedia] = useState<Media[]>([])
    const [mediaIndex, setMediaIndex] = useState(0)

    const mediaComponent = useRef<HTMLVideoElement>(null)

    const [currentGuid, setCurrentGuid] = useState<string>('')


    const mediaEnded = () => {
        if (mediaIndex < playlistMedia.length - 1) {
            next();

            // now this won't be playing, so ensure you start it
            start()
        }
    }

    const previous = () => {
        if (playlistMedia.length > 0 && mediaIndex > 0) {
            const playing = isPlaying()

            setMediaIndex(mediaIndex - 1)

            if (playing) {
                start()
            }
        }
    }

    const leftTenSec = () => {
        // TODO
    }

    const togglePlay = () => {
        if (isPlaying()) {
            stop()
        } else {
            if (playlistMedia.length > 0) {
                start()
            }
        }
    }

    const rightTenSec = () => {
        // TODO
    }

    const next = () => {
        const size = playlistMedia.length
        if (mediaIndex < size - 1) {
            const playing = isPlaying()

            changeMediaIndex(mediaIndex + 1)

            if (playing) {
                start()
            }
        }
    }

    const changeMediaIndex = (index : number, force = true)=> {
        if (force || index !== mediaIndex) {
            // first stop the processing
            stop()

            //set the media index
            setMediaIndex(index)

            if (playlistMedia?.length > 0) {
                // and now rearrange the url
                mediaComponent.current!!.src = getFullUrl();
            }
        }
    }

    const isPlaying = () : boolean => {
        return ! mediaComponent.current?.paused
    }

    const stop = () => {
        if (mediaComponent.current && !mediaComponent.current.paused) {
            mediaComponent.current.pause()
        }
    }

    const start = () => {
        if (mediaComponent.current && mediaComponent.current.paused) {
            mediaComponent.current.play()
        }
    }

    const getFullUrl = (): string => {
        let id = ''
        if (playlistMedia?.length > 0 && mediaIndex >= 0 && mediaIndex < playlistMedia.length) {
            id = playlistMedia[mediaIndex].id;
        }

        return `${window.location.origin}${serverUrl}/playMedia?id=${id}&uid=${currentGuid}`;
    }

    const play = (index: number) => {
        return (event: any) => {
            event.preventDefault();
            event.stopPropagation()

            if (index !== mediaIndex) {
                changeMediaIndex(index, false);

                // always be playing, as the button has "play" on it
                start()
            }
        }
    }

    const back = () => {
        dispatch(navigate(LOCATION_HOME))
    }

    useEffect(() => {
        // generate a new guid for this particular page to avoid caching
        setCurrentGuid(v7())

        // load memory playlist
        getService().getMediaForPlaylist(ppl!!.playlistId).then((result: Media[]) => {
            setPlaylistMedia(result);

            changeMediaIndex(0, true)
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
                    <div className="video-placeholder"><video controls src={''} ref={mediaComponent} onEnded={mediaEnded}/></div>

                    <div className="controls-section">
                        <div className="controls">
                            <button className="control-btn" onClick={previous}>Previous</button>
                            <button className="control-btn secondary" onClick={leftTenSec}>&lt; 10sec</button>
                            <button className="control-btn primary" onClick={togglePlay}>Start/Stop</button>
                            <button className="control-btn secondary" onClick={rightTenSec}>&gt; 10sec</button>
                            <button className="control-btn" onClick={next}>Next</button>
                        </div>
                    </div>
                </div>

                <div className="player-sidebar">
                    <h3>Playlist</h3>
                    <ul className="playlist">
                        {
                            playlistMedia.map((item, index) =>
                                <li className={index === mediaIndex ? "playlist-item current" : "playlist-item"} key={item.id} onClick={
                                    () => {
                                        changeMediaIndex(index, false)
                                    }}>
                                    <a href="#" onClick={play(index)}>play</a>
                                    {item.description}
                                </li>)
                        }
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
