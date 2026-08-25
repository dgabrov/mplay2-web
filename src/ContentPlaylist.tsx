import {useAppDispatch, useAppSelector} from "./store.ts";
import {useEffect, useState} from "react";
import {LOCATION_HOME} from "./data/constants.ts";
import {navigate} from "./slices/locationReducer.ts";
import type {ExtendedMedia, Media} from "./data/data.ts";
import {pushError} from "./slices/mediaReducer.ts";
import {getService} from "./service/service.ts";
import {DraggableListItem} from "./DraggableListItem.tsx";
import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";

const ContentPlaylist = () => {
    const dispatch = useAppDispatch();
    const playlistId = useAppSelector(state => state.media.contentPlaylist);
    const list = useAppSelector(state => state.media.playList);

    const filtered = list.filter((item) => item.playlistId === playlistId);
    const playList = filtered[0]

    const [searchMedia, setSearchMedia] = useState("");
    const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
    const [media, setMedia] = useState<Media[]>([]);

    const [selectedPlaylistMedia, setSelectedPlaylistMedia] = useState<string[]>([]);
    const [playlistMedia, setPlaylistMedia] = useState<ExtendedMedia[]>([]);

    const back = () => {
        dispatch(navigate(LOCATION_HOME))
    }


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent): void => {
        const {active, over} = event;

        console.log(`current values: ${active.id} and over: ${over && over.id}`);

        if (over && active.id !== over.id) {

            // TODO here is where you call the service to switch the seqNo for the two numbers

            setPlaylistMedia((prevItems) => {
                const oldIndex = prevItems.findIndex((item) => item.id === active.id);
                const newIndex = prevItems.findIndex((item) => item.id === over.id);

                return arrayMove(prevItems, oldIndex, newIndex);
            });
        }
    };

    const triggerSearchMedia = async () => {
        try {
            const foundMedia = await getService().searchMedia(searchMedia);

            setSelectedMedia([])
            setMedia(foundMedia)
        } catch (err: any) {
            dispatch(pushError(err))
        }
    }

    useEffect(() => {
        getService().getMediaForPlaylist(playlistId).then((result: ExtendedMedia[]) => {
            setPlaylistMedia(result);
        }).catch((err: any) => {
            dispatch(pushError(err))
        })
    }, [])


    const addMedia = async () => {
        try {
            if (selectedMedia.length > 0) {
                await getService().addMediaToPlaylist(playlistId, selectedMedia)

                // no longer any media selected
                setSelectedMedia([])

                // add media in the playlist media
                setSelectedPlaylistMedia([])

                const items: ExtendedMedia[] = await getService().getMediaForPlaylist(playlistId)
                setPlaylistMedia(items)
            } else {
                dispatch(pushError('please select at leat one media item to add to the current playlist'))
            }
        } catch (err: any) {
            dispatch(pushError(err))
        }
    }

    const removeMedia = async () => {
        try {
            if (selectedPlaylistMedia.length > 0) {
                await getService().removeMediaFromPlaylist(playlistId, selectedPlaylistMedia)

                setPlaylistMedia(playlistMedia.filter(media => !selectedPlaylistMedia.includes(media.id)))
                setSelectedPlaylistMedia([])
            } else {
                dispatch(pushError('please select which media you want to remove from the current playlist'))
            }
        } catch (err: any) {
            dispatch(pushError(err))
        }
    }

    const isMediaSelected = (id: string): boolean => {
        return selectedMedia.includes(id)
    }

    const changeMediaSelected = (id: string) => {
        return (event: any) => {
            const checked = event.target.checked;

            const newSelected = selectedMedia.filter((currentId) => currentId !== id);
            if (checked) {
                newSelected.push(id);
            }

            setSelectedMedia(newSelected);
        }
    }

    const isPlaylistChecked = (id: string) => {
        return selectedPlaylistMedia.includes(id)
    }

    const changePlaylistMediaSelected = (id: string) => {
        return (event: any) => {
            const checked = event.target.checked;

            const newSelected = selectedPlaylistMedia.filter((currentId) => currentId !== id);
            if (checked) {
                newSelected.push(id);
            }

            setSelectedPlaylistMedia(newSelected);
        }
    }

    return (
        <div className="content">
            <h1>Contents</h1>
            <h2>Playlist: {playList.description}</h2>

            <table className="table margin-top">
                <thead>
                <tr>
                    <td>Media</td>
                    <td>Playlist</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={2}>
                        <input
                            type="text"
                            className="form-input margin-left"
                            value={searchMedia}
                            placeholder="Search Media"
                            onChange={(e) => setSearchMedia(e.target.value)}
                        />

                        <button className="regular-btn margin-left" onClick={triggerSearchMedia}>Search</button>
                    </td>
                </tr>
                <tr>
                    <td className="align-top">
                        <ul className="margin-left no-bullet padding-double">
                            {
                                media?.length > 0 &&
                                media.map(item =>
                                    <li key={item.id} className={'margin-bottom'}>
                                        <input type="checkbox" checked={isMediaSelected(item.id)}
                                               onChange={changeMediaSelected(item.id)}/>
                                        <span className={'margin-left'}>{item.description}</span>
                                    </li>)
                            }
                            {
                                media?.length === 0 && <li><span className={'margin-left'}>No items...</span></li>
                            }
                        </ul>
                    </td>
                    <td className="align-top">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}>
                        <ul className="margin-left no-bullet padding-double">
                            <SortableContext items={playlistMedia.map(item => item.id)} strategy={verticalListSortingStrategy}>
                            {playlistMedia.map(
                                item =>
                                    <DraggableListItem
                                        key={item.id}
                                        id={item.id}
                                        description={item.description}
                                        checkedVerifier={isPlaylistChecked(item.id)}
                                        changeTrigger={changePlaylistMediaSelected(item.id)}
                                    />
                            )}
                            </SortableContext>
                        </ul>
                        </DndContext>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button className="regular-btn" onClick={addMedia}>Add</button>
                    </td>
                    <td>
                        <button className="regular-btn" onClick={removeMedia}>Remove</button>
                    </td>
                </tr>
                </tbody>
            </table>
            <button className="regular-btn margin-top" onClick={back}>Back</button>

        </div>
    )
}

export default ContentPlaylist

