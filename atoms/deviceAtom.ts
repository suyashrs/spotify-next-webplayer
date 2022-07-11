import { atom } from "recoil";

export const currentDeviceState = atom<any> ({
    key:"currentDeviceState",
    default: null
});