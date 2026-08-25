export interface ErrorData {
    id: string
    message: string
    date: number
}

export interface LoginData {
    login: string
    name: string
    id: string
}

export interface Media {
    id: string
    userId: string
    description: string
    contentType: string
    size: number
    width: number
    height: number
}

export interface ExtendedMedia extends Media {
    seqNo: number;
}

export interface PlayList {
    playlistId: string
    userId: string
    description: string
}

