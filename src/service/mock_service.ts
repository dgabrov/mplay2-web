import type {IService} from "./service.ts";

import type {LoginData, Media, PlayList} from "../data/data.ts";

const users: { [key: string]: LoginData } = {
    'login1': {name: 'The First', id: '1', login: 'login1'},
    'login2': {name: 'The Second', id: '2', login: 'login2'}
}

let currentUserId: string = '';

const mediaMap: { [key: string]: Media[] } = {};
const playlistMap: { [key: string]: PlayList[] } = {};
const playlistMediaMap: { [key: string]: string[] } = {};

function initializeMockData() {
    const mediaNames = [
        'Summer Vibes', 'Night Drive', 'Study Focus', 'Workout Energy', 'Chill Beats',
        'Jazz Classics', 'Electronic Dreams', 'Rock Anthology', 'Pop Hits', 'Indie Folk',
        'Hip Hop Mix', 'Classical Symphony', 'Ambient Sounds', 'Retro Disco', 'Modern Pop',
        'Deep House', 'Acoustic Sessions', 'Funk Groove', 'Synthwave Nights', 'Blues Collection'
    ];

    const playlistNames = [
        'Morning Commute', 'Evening Relaxation', 'Gym Session', 'Party Time', 'Dinner Ambiance',
        'Late Night Coding', 'Road Trip Soundtrack', 'Meditation', 'Focus Music', 'Upbeat Mood',
        'Melancholy Moods', 'Birthday Bash', 'Holiday Classics', 'Summer Playlist', 'Winter Chill',
        'Nostalgic Hits', 'Discovery Mix', 'Favorites', 'Guilty Pleasures', 'Motivational Tracks'
    ];

    ['1', '2'].forEach(userId => {
        const mediaList: Media[] = [];
        const playlistList: PlayList[] = [];

        // Create 20 media items for each user
        for (let i = 0; i < 20; i++) {
            mediaList.push({
                id: `media_${userId}_${i + 1}`,
                userId,
                description: mediaNames[i],
                contentType: 'audio/mpeg',
                size: Math.floor(Math.random() * 50000000) + 1000000,
                width: 0,
                height: 0
            });
        }

        // Create 20 playlists for each user
        for (let i = 0; i < 20; i++) {
            playlistList.push({
                playlistId: `playlist_${userId}_${i + 1}`,
                userId,
                description: playlistNames[i]
            });
        }

        mediaMap[userId] = mediaList;
        playlistMap[userId] = playlistList;
    });
}

initializeMockData();

export class MockService implements IService {
    async updateMedia(adding: boolean, id: any, description: string): Promise<Media> {
        if (!currentUserId) {
            throw new Error('User not logged in');
        }

        const userMedia = mediaMap[currentUserId];
        if (!userMedia) {
            throw new Error('No media found for user');
        }

        if (adding) {
            const newMedia: Media = {
                id: id,
                userId: currentUserId,
                description,
                contentType: 'audio/mpeg',
                size: Math.floor(Math.random() * 50000000) + 1000000,
                width: 0,
                height: 0
            };
            userMedia.push(newMedia);
            return newMedia;
        } else {
            const mediaIndex = userMedia.findIndex(m => m.id === id);
            if (mediaIndex === -1) {
                throw new Error(`Media with id ${id} not found`);
            }
            const updatedMedia = structuredClone(userMedia[mediaIndex]);
            updatedMedia.description = description;
            userMedia[mediaIndex] = updatedMedia;
            return updatedMedia;
        }
    }

    async Login(login: string, _password: string): Promise<LoginData> {
        let res : LoginData
        if (Object.hasOwn(users, login)){
            res = users[login]

            currentUserId = res.id
        } else {
            throw new Error(`${login} not found`)
        }

        return res
    }

    async searchMedia(searchTerm: string): Promise<Media[]> {
        if (!currentUserId) return [];

        const userMedia = mediaMap[currentUserId] || [];
        const term = searchTerm.toLowerCase();

        return userMedia.filter(media =>
            media.description.toLowerCase().includes(term)
        );
    }

    async searchPlaylists(searchTerm: string): Promise<PlayList[]> {
        if (!currentUserId) return [];

        const userPlaylists = playlistMap[currentUserId] || [];
        const term = searchTerm.toLowerCase();

        return userPlaylists.filter(playlist =>
            playlist.description.toLowerCase().includes(term)
        );
    }

    async deleteMedia(ids: string[]): Promise<void> {
        if (!currentUserId) {
            throw new Error('User not logged in');
        }

        const userMedia = mediaMap[currentUserId];
        if (!userMedia) {
            throw new Error('No media found for user');
        }

        mediaMap[currentUserId] = userMedia.filter(m => !ids.includes(m.id));
    }

    async deletePlaylist(ids: string[]): Promise<void> {
        if (!currentUserId) {
            throw new Error('User not logged in');
        }

        const userPlaylists = playlistMap[currentUserId];
        if (!userPlaylists) {
            throw new Error('No playlists found for user');
        }

        playlistMap[currentUserId] = userPlaylists.filter(p => !ids.includes(p.playlistId));
    }

    async addPlaylist(newData: PlayList): Promise<void> {
        if (!currentUserId) {
            throw new Error('User not logged in');
        }

        const userPlaylists = playlistMap[currentUserId];
        if (!userPlaylists) {
            throw new Error('No playlists found for user');
        }

        userPlaylists.push(structuredClone(newData));
    }

    async updatePlaylist(newData: PlayList): Promise<void> {
        if (!currentUserId) {
            throw new Error('User not logged in');
        }

        const userPlaylists = playlistMap[currentUserId];
        if (!userPlaylists) {
            throw new Error('No playlists found for user');
        }

        const playlistIndex = userPlaylists.findIndex(p => p.playlistId === newData.playlistId);
        if (playlistIndex === -1) {
            throw new Error(`Playlist with id ${newData.playlistId} not found`);
        }

        userPlaylists[playlistIndex] = structuredClone(newData);
    }

    async addMediaToPlaylist(playlistId: any, mediaIds: string[]): Promise<void> {
        if (!currentUserId) {
            throw new Error('User not logged in');
        }

        const userPlaylists = playlistMap[currentUserId];
        if (!userPlaylists) {
            throw new Error('No playlists found for user');
        }

        const playlist = userPlaylists.find(p => p.playlistId === playlistId);
        if (!playlist) {
            throw new Error(`Playlist with id ${playlistId} not found`);
        }

        if (!playlistMediaMap[playlistId]) {
            playlistMediaMap[playlistId] = [];
        }

        for (const mediaId of mediaIds) {
            if (!playlistMediaMap[playlistId].includes(mediaId)) {
                playlistMediaMap[playlistId].push(mediaId);
            }
        }
    }

    async getMediaForPlaylist(playlistId: string): Promise<Media[]> {
        if (!currentUserId) {
            throw new Error('User not logged in');
        }

        const userMedia = mediaMap[currentUserId];
        if (!userMedia) {
            return [];
        }

        const mediaIds = playlistMediaMap[playlistId];
        if (!mediaIds || mediaIds.length === 0) {
            return [];
        }

        return userMedia.filter(m => mediaIds.includes(m.id));
    }

    async removeMediaFromPlaylist(playlistId: any, selectedPlaylistMedia: string[]): Promise<void> {
        if (!currentUserId) {
            throw new Error('User not logged in');
        }

        const userPlaylists = playlistMap[currentUserId];
        if (!userPlaylists) {
            throw new Error('No playlists found for user');
        }

        const playlist = userPlaylists.find(p => p.playlistId === playlistId);
        if (!playlist) {
            throw new Error(`Playlist with id ${playlistId} not found`);
        }

        if (playlistMediaMap[playlistId]) {
            playlistMediaMap[playlistId] = playlistMediaMap[playlistId].filter(
                mediaId => !selectedPlaylistMedia.includes(mediaId)
            );
        }
    }

}
