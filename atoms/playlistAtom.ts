import { atom, atomFamily, selector } from "recoil";
import spotifyApi from "../lib/spotify";

export const playlistState=atom<SpotifyApi.SinglePlaylistResponse|null>({
    key: "playlistState",
    default: null
})

export const playlistIdState = atom({
    key: "playlistIdState",
    default: '6Lgk7UoopJ57buB6p2dQLU'
})