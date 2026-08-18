import {MockService} from "./mock_service.ts";
import type {LoginData, Media, PlayList} from "../data/data.ts";

export interface IService {
    proceedLogin: (login: string, password: string) => Promise<LoginData>;
    searchMedia(searchMedia: string): Promise<Media[]>;
    searchPlaylists(searchList: string): Promise<PlayList[]>;
    updateMedia(adding: any, id: any, description: string): Promise<Media>;
    deleteMedia(ids: string[]): Promise<void>;
    deletePlaylist(ids: string[]): Promise<void>;
    updatePlaylist(newData: PlayList): Promise<void>;
    addPlaylist(newData: PlayList): Promise<void>;
    addMediaToPlaylist(playlistId: any, mediaIds: string[]): Promise<void>;
    getMediaForPlaylist(playlistId: any): Promise<Media[]>;
    removeMediaFromPlaylist(playlistId: any, selectedPlaylistMedia: string[]): Promise<void>;
}

export const getService = (): IService => {
    return new MockService()
}

let serverUrl: string = ''

export const getServerUrl = async (): Promise<string> => {
    if (serverUrl.length > 0) {
        return serverUrl
    }

    const response = await fetch('/config/config.json');

    if (!response.ok) {
        throw new Error('Failed to load config');
    }

    const config = await response.json();

    serverUrl =  config.url;

    return serverUrl;
}
