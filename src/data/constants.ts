export const LOCATION_LOGIN = 'LOCATION_LOGIN'
export const LOCATION_HOME = 'LOCATION_HOME'
export const LOCATION_EDIT_MEDIA = 'LOCATION_EDIT_MEDIA'
export const LOCATION_DELETE_MEDIA = 'LOCATION_DELETE_MEDIA'
export const LOCATION_DELETE_PLAYLIST = 'LOCATION_DELETE_PLAYLIST'
export const LOCATION_EDIT_PLAYLIST = 'LOCATION_EDIT_PLAYLIST'
export const LOCATION_CONTENT_PLAYLIST = 'LOCATION_CONTENT_PLAYLIST'

export const ERROR_TIMEOUT = 3000;

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message
    return String(error)
}