import Login from "./Login.tsx";
import NotFound from "./NotFound.tsx";
import {useAppDispatch, useAppSelector} from "./store.ts";
import Header from "./Header.tsx";
import {useEffect} from "react";
import {clearError} from "./slices/mediaReducer.ts";

import {
    ERROR_TIMEOUT,
    LOCATION_CONTENT_PLAYLIST,
    LOCATION_DELETE_MEDIA,
    LOCATION_DELETE_PLAYLIST,
    LOCATION_EDIT_MEDIA,
    LOCATION_EDIT_PLAYLIST,
    LOCATION_HOME,
    LOCATION_LOGIN,
    LOCATION_PLAY_MEDIA,
    LOCATION_PLAY_PLAYLIST
} from "./data/constants";

import Home from "./Home.tsx";
import EditMedia from "./EditMedia.tsx";
import CdelMedia from "./CdelMedia.tsx";
import CdelPlaylist from "./CdelPlaylist.tsx";
import EditPlaylist from "./EditPlaylist.tsx";
import ContentPlaylist from "./ContentPlaylist.tsx";
import DoPlayMedia from "./DoPlayMedia.tsx";
import DoPlayList from "./DoPlayList.tsx";

const locationMap: { [key: string]: any } = {}
locationMap[LOCATION_LOGIN] = <Login/>
locationMap[LOCATION_HOME] = <Home/>
locationMap[LOCATION_EDIT_MEDIA] = <EditMedia/>
locationMap[LOCATION_DELETE_MEDIA] = <CdelMedia/>
locationMap[LOCATION_DELETE_PLAYLIST] = <CdelPlaylist/>
locationMap[LOCATION_EDIT_PLAYLIST] = <EditPlaylist/>
locationMap[LOCATION_CONTENT_PLAYLIST] = <ContentPlaylist/>
locationMap[LOCATION_PLAY_MEDIA] = <DoPlayMedia/>
locationMap[LOCATION_PLAY_PLAYLIST] = <DoPlayList/>


const App = () => {

    const location = useAppSelector((state) => state.location.location);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const trigger = setInterval(() => {
            dispatch(clearError())
        }, ERROR_TIMEOUT)

        return () => {
            clearInterval(trigger)
        }
    }, [])

    let component = <NotFound/>
    if (Object.hasOwn(locationMap, location)) {
        component = locationMap[location];
    }

    return (
        <>
            <Header/>
            {component}
        </>
    );
}

export default App;
