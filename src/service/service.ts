import {MockService} from "./mock_service.ts";
import type {LoginData, Media, PlayList} from "../data/data.ts";

export interface IService {
    Login: (login: string, password: string) => Promise<LoginData>;

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

export const getService = () : IService => {
    return new MockService()
}
