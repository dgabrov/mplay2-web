import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {v7} from "uuid";
import {getErrorMessage} from "../data/constants.ts";
import type {ErrorData, LoginData, Media, PlayList} from "../data/data.ts";

export interface AfterEditMedia extends Media {
    adding: boolean
}

export interface CompleteEditPlaylist extends EditPlaylist {
    description: string
    userId: string
}

export interface EditPlaylist {
    adding: boolean
    id: string
}


export interface EditMedia {
    id: string
    adding: boolean
}

export interface MediaStore {
    errors: ErrorData[]
    version: string
    user: LoginData
    mediaList: Media[]
    playList: PlayList[]
    editMedia: EditMedia
    deleteMedia: string[]
    deletePlaylist: string[]
    editPlaylist: EditPlaylist
    contentPlaylist: string
    playMedia: Media | null | undefined
    proceedPlayList: PlayList | null | undefined
}

const initialState: MediaStore = {
    errors: [],
    version: '',
    user: {
        id: '',
        login: '',
        name: '',
    },
    mediaList: [],
    playList: [],
    editMedia: {
        adding: true, id: ''
    },
    deleteMedia: [],
    deletePlaylist: [],
    editPlaylist: {id: '', adding: false},
    contentPlaylist: '',
    playMedia: null,
    proceedPlayList: null,
}

const errorImplementation = (state: MediaStore, action: PayloadAction<any>) => {
    const message = getErrorMessage(action.payload)

    state.errors.push({
        id: v7(),
        message,
        date: new Date()
    })
}

const clearErrorImplementation = (state: MediaStore) => {
    const now = new Date()
    const threeSecondsAgo = new Date(now.getTime() - 3000)
    state.errors = state.errors.filter(error => error.date > threeSecondsAgo)
}


const afterLoginImplementation = (state: MediaStore, action: PayloadAction<LoginData>) => {
    const loginData = action.payload
    state.user = {...loginData}
};

const logoutImplementation = (state: MediaStore, _action: PayloadAction<void>) => {
    Object.assign(state, initialState)
}

const setMediaListImplementation = (state: MediaStore, mediaList: PayloadAction<Media[]>) => {
    let newMediaList = mediaList.payload
    newMediaList = newMediaList == null ? [] : newMediaList

    state.mediaList = newMediaList
};

const setPlayListImplementation = (state: MediaStore, playList: PayloadAction<PlayList[]>) => {
    state.playList = playList.payload
};

const editMediaImplementation = (state: MediaStore, editMedia: PayloadAction<EditMedia>) => {
    state.editMedia = editMedia.payload
}

const afterEditMediaImplementation = (state: MediaStore, afterEdit: PayloadAction<AfterEditMedia>) => {
    const value : AfterEditMedia = afterEdit.payload
    const adding = value.adding

    const newMedia : Media = {
        id: value.id,
        userId: value.userId,
        description: value.description,
        contentType: value.contentType,
        size: value.size,
        width: value.width,
        height: value.height,
    };

    if (adding) {
        state.mediaList.push(newMedia)
    } else {
        state.mediaList = state.mediaList.map(item => {
            const currentId = item.id
            if (currentId === value.id) {
                return newMedia
            } else {
                return item
            }
        })
    }
}

const afterMediaDeleteImplementation = (state: MediaStore, afterDelete: PayloadAction<string[]>) => {
    const ids : string[] = afterDelete.payload

    state.mediaList = state.mediaList.filter(item => {!ids.includes(item.id)})
    state.deleteMedia = [];
}

const afterPlaylistDeleteImplementation = (state: MediaStore, playlist: PayloadAction<string[]>) => {
    const ids : string[] = playlist.payload

    state.playList = state.playList.filter(item => !ids.includes(item.playlistId))
    state.deletePlaylist = [];
}

const deleteMediaImplementation = (state: MediaStore, ids: PayloadAction<string[]>) => {
    state.deleteMedia = ids.payload
}

const deletePlaylistImplementation = (state: MediaStore, ids: PayloadAction<string[]>) => {
    state.deletePlaylist = ids.payload
}

const editPlaylistImplementation = (state: MediaStore, editPlaylist: PayloadAction<EditPlaylist>) => {
    state.editPlaylist = editPlaylist.payload
}

const contentPlaylistImplementation = (state: MediaStore, playlistId: PayloadAction<string>) => {
    state.contentPlaylist = playlistId.payload;
}

const afterEditPlaylistImplementation = (state: MediaStore, editPlayList: PayloadAction<CompleteEditPlaylist>) => {
    const acdt = editPlayList.payload
    const id = acdt.id;

    const adding = acdt.adding
    const playlist = {playlistId: acdt.id, description: acdt.description, userId: acdt.userId};

    if (adding) {
        state.playList.push(playlist)
    } else {
        state.playList = state.playList.map(item => {
            const currentId = item.playlistId
            let res = item;

            if (id === currentId) {
                res = {...playlist}
            }

            return res;
        });
    }
}

const playListImplementation = (state: MediaStore, playList: PayloadAction<PlayList>) => {
    state.proceedPlayList = playList.payload
}

const playMediaImplementation = (state: MediaStore, media: PayloadAction<Media>) => {
    state.playMedia = media.payload
}


export const mediaReducer = createSlice({
    name: 'store',
    initialState,
    reducers: {
        pushError: errorImplementation,
        clearError: clearErrorImplementation,
        afterLogin: afterLoginImplementation,
        logout: logoutImplementation,
        setMediaList: setMediaListImplementation,
        setPlayList: setPlayListImplementation,
        goEditMedia: editMediaImplementation,
        afterEditMedia: afterEditMediaImplementation,
        afterMediaDelete: afterMediaDeleteImplementation,
        afterPlaylistDelete: afterPlaylistDeleteImplementation,
        deleteMedia: deleteMediaImplementation,
        deletePlaylist: deletePlaylistImplementation,
        editPlaylist: editPlaylistImplementation,
        afterEditPlaylist: afterEditPlaylistImplementation,
        contentPlaylist: contentPlaylistImplementation,
        doPlayList: playListImplementation,
        doPlayMedia: playMediaImplementation
    },
})

export const {
    pushError,
    clearError,
    afterLogin,
    logout,
    setMediaList,
    setPlayList,
    goEditMedia,
    afterEditMedia,
    afterMediaDelete,
    afterPlaylistDelete,
    deleteMedia,
    deletePlaylist,
    editPlaylist,
    afterEditPlaylist,
    contentPlaylist,
    doPlayList,
    doPlayMedia,
} = mediaReducer.actions

const reducer = mediaReducer.reducer

export default reducer
