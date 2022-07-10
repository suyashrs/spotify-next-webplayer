import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from '../atoms/songAtom';
import useSpotify from './useSpotify'

function useSongInfo() {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    type song = Awaited<Promise<SpotifyApi.SingleTrackResponse>>
    const [trackInfo, setTrackInfo] = useState<null|song>(null);
    
    useEffect(() => {
        const fetchTrackInfo = async () => {
            if(currentTrackId){
                const songInfo = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, 
                {
                    headers: {
                        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                    }

                }).then(response => response.json());
                setTrackInfo(songInfo)
            }
        }
        fetchTrackInfo();
    }, [currentTrackId, spotifyApi]); 
    return trackInfo;
}

export default useSongInfo