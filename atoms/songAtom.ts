import { atom } from "recoil";

export const currentTrackIdState = atom<any> ({
    key: "currentTrackIdState",
    default:null,
});

export const isPlayingState = atom<any> ({
    key: "isPlayingState",
    default: false
});