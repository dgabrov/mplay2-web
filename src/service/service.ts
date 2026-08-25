import type {ExtendedMedia, LoginData, Media, PlayList} from "../data/data.ts";
import {ProdService} from "./prod_service.ts";

export interface IService {
    proceedLogin: (login: string, password: string) => Promise<LoginData>;
    searchMedia(searchMedia: string): Promise<Media[]>;
    searchPlaylists(searchList: string): Promise<PlayList[]>;
    updateMedia(adding: any, id: any, description: string, file: File|null, onProgress? : (progress: string) => void): Promise<Media>;
    deleteMedia(ids: string[]): Promise<void>;
    deletePlaylist(ids: string[]): Promise<void>;
    updatePlaylist(newData: PlayList): Promise<void>;
    addPlaylist(newData: PlayList): Promise<void>;
    addMediaToPlaylist(playlistId: any, mediaIds: string[]): Promise<void>;
    getMediaForPlaylist(playlistId: any): Promise<ExtendedMedia[]>;
    removeMediaFromPlaylist(playlistId: any, selectedPlaylistMedia: string[]): Promise<void>;
}

export const getService = (): IService => {
    return new ProdService()
}

let serverUrl: string = ''

export const getServerUrl = async (): Promise<string> => {
    if (serverUrl.length > 0) {
        return serverUrl
    }

    let location = window.location.href;
    if (! location.endsWith("/")) {
        location = location + "/"
    }
    const response = await fetch(location + "config/config.json");

    if (!response.ok) {
        throw new Error('Failed to load config');
    }

    const config = await response.json();

    serverUrl =  config.url;

    return serverUrl;
}

export const getSyncServerUrl = () => {
    return serverUrl
}