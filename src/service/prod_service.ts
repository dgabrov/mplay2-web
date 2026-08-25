import axios from "axios";
import {getServerUrl, type IService} from "./service.ts";
import type {ExtendedMedia, LoginData, Media, PlayList} from "../data/data.ts";

export class ProdService implements IService {
    async proceedLogin(login: string, password: string): Promise<LoginData> {
        return processPost({login, password}, "/login");
    }

    async addMediaToPlaylist(playlistId: any, ids: string[]): Promise<void> {
        return processPost({playlistId, ids}, "/addMediaToPlaylist");
    }

    async addPlaylist(newData: PlayList): Promise<void> {
        let id = newData.playlistId;
        let description = newData.description;

        return processPost({id, description}, "/addPlaylist");
    }

    async deleteMedia(ids: string[]): Promise<void> {
        return processPost({ids}, "/deleteMedia");
    }

    async deletePlaylist(ids: string[]): Promise<void> {
        return processPost({ids}, "/deletePlaylist");
    }

    async getMediaForPlaylist(playlistId: string): Promise<ExtendedMedia[]> {
        return processGet(`/getMediaForPlaylist?playlistId=${playlistId}`);
    }

    async removeMediaFromPlaylist(playlistId: string, ids: string[]): Promise<void> {
        return processPost({playlistId, ids}, "/removeMediaFromPlaylist")
    }

    async searchMedia(searchMedia: string): Promise<Media[]> {
        let encodedSearch = encodeURIComponent(searchMedia);

        return processGet(`/searchMedia?searchMedia=${encodedSearch}`);
    }

    async searchPlaylists(searchList: string): Promise<PlayList[]> {
        let encodedSearch = encodeURIComponent(searchList);

        return processGet(`/searchPlaylist?searchPlaylist=${encodedSearch}`);
    }

    async updateMedia(adding: any, id: any, description: string, file: File|null, onProgress?: (progress: string) => void): Promise<Media> {
        const formData = new FormData();

        formData.append('id', id);
        formData.append('adding', adding);
        formData.append('description', description);

        if (file !== null) {
            formData.append('file', file);
        }

        const url = await getServerUrl();
        const response = await axios.post(`${url}/updateMedia`, formData, {
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total && progressEvent.total > 0) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    let formattedProgress = percentCompleted.toFixed(2);

                    onProgress(formattedProgress);
                }
            },
        });

        return response.data;
    }

    async updatePlaylist(newData: PlayList): Promise<void> {
        let id = newData.playlistId;
        let description = newData.description;

        return processPost({id, description}, "/updatePlaylist")
    }

    async switchMedia(playlistId: string, media1: string, media2: string): Promise<void> {
        const payload : any = {
            playlistId, media1, media2
        }

        await processPost(payload, "/switchSeq")
    }
}

async function processPost(obj: any, suffix: string) {
    const url = await getServerUrl();
    let finalURL = `${url}${suffix}`;

    const response = await axios.post(finalURL, obj, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.data;
}

async function processGet(urlSuffix: string) {
    const url = await getServerUrl();
    let finalURL = `${url}${urlSuffix}`;

    const response = await axios.get(finalURL);

    return response.data;
}
