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
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const videoElement = useRef<HTMLVideoElement>(null)

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

    const removeTen = () => {
        if (videoElement.current) {
            videoElement.current.currentTime = Math.max(0, videoElement.current.currentTime - 10);
        }
    }

    const addTen = () => {
        if (videoElement.current) {
            videoElement.current.currentTime = videoElement.current.currentTime + 10;
        }
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
                videoElement.current!!.src = getFullUrl();
            }
        }
    }

    const isPlaying = () : boolean => {
        return ! videoElement.current?.paused
    }

    const stop = () => {
        if (videoElement.current && !videoElement.current.paused) {
            videoElement.current.pause()
        }
    }

    const start = () => {
        if (videoElement.current && videoElement.current.paused) {
            videoElement.current.play()
        }
    }

    const getFullUrl = (): string => {
        let id = ''
        if (playlistMedia?.length > 0 && mediaIndex >= 0 && mediaIndex < playlistMedia.length) {
            id = playlistMedia[mediaIndex].id;
        }

        let fullUrl = `${window.location.origin}${serverUrl}/playMedia?id=${id}&uid=${currentGuid}`;
        console.log(`full url: ${fullUrl}`);

        return fullUrl;
    }

    const play = (index: number) => {
        return (event: any) => {
            event.preventDefault();
            event.stopPropagation()

            if (index !== mediaIndex) {
                changeMediaIndex(index, false);
            }

            if (!isPlaying()) {
                // always be playing, as the button has "play" on it
                start();
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
        }).catch((err: any) => {
            dispatch(pushError(err))
        })
    }, [])

    useEffect(() => {
        if (playlistMedia.length > 0) {
            changeMediaIndex(0, true)
        }
    }, [playlistMedia])


    return (
        <div className="content">
            <h1>Play</h1>
            <h2>Media: {ppl!!.description}</h2>

            <div><video controls ref={videoElement} onEnded={mediaEnded}/></div>

            <div className="margin-top">
                <button className="regular-btn" onClick={previous}>Previous</button>
                <button className="regular-btn margin-left" onClick={removeTen}>&lt; 10sec</button>
                <button className="regular-btn margin-left" onClick={togglePlay}>Start/Stop</button>
                <button className="regular-btn margin-left" onClick={addTen}>&gt; 10sec</button>
                <button className="regular-btn margin-left" onClick={next}>Next</button>
            </div>

            <div className="margin-top">
                <h3>Playlist</h3>
                <ul className="no-bullet playlists">
                    {
                        playlistMedia.map((item, index) => {
                            let className = '';
                            if (index === mediaIndex) className += 'selected';
                            if (hoveredIndex === index) className += (className ? ' ' : '') + 'hover';
                            return (
                                <li key={item.id} className={className} onClick={() => changeMediaIndex(index, false)}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}>
                                    <a href="#" onClick={play(index)}>play</a>
                                    <span className={'margin-left'}>{item.description}</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <div>
                <button className="regular-btn margin-top" onClick={back}>Back</button>
            </div>

        </div>
    )
}

export default DoPlayList
