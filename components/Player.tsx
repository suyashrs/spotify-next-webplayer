import {  HeartIcon, ReplyIcon, VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import { RewindIcon, FastForwardIcon, PauseIcon, PlayIcon, VolumeUpIcon, SwitchHorizontalIcon } from '@heroicons/react/solid'
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify'

function Player() {
    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);
    const songInfo = useSongInfo(); //info about the currently selected song

    const fetchCurrentSongInfo = () => {
        if(!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentTrackId(data.body?.item?.id);
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                });
            });
        }
    }
    const handlePlayPause = () => {
         spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
         });
    }
    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            
             spotifyApi.setVolume(volume);
        }, 500), 
        []
    );
    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId) {
            //fetch song info 
            fetchCurrentSongInfo();
            setVolume(20);
        }
    }, [currentTrackId,spotifyApi, session])
    useEffect(() => {
        if(volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume);
        }
    })
  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-800 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
        <div className="flex items-center space-x-4">
            <img className="hidden md:inline h-10 w-10" 
            src={songInfo?.album.images[0]?.url} alt="" />
            <div>
                <h3>{songInfo?.name}</h3>
                <p>{songInfo?.artists[0]?.name}</p>
            </div>
        </div>
        <div className="flex items-center justify-evenly">
            <SwitchHorizontalIcon className="button"/>
             <RewindIcon
             //onClick={skipToPrevious};  API is not working
             className="button"/>
            {
            isPlaying ? (
                <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"/>
            ) : (
                <PlayIcon onClick={handlePlayPause} className="button w-10 h-10"/>
            )
            }
            <FastForwardIcon className='button'
            //onClick = {Skip to Next}; Api call is not working
            />
            <ReplyIcon className="button "/>
        </div>
        <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
            <VolumeDownIcon className='button' onClick={() => volume > 0 && setVolume(volume-10)}/>
            <input className="w-24 md:w-28" type="range" value={volume} min={0} max={100} 
            onChange={(e) => setVolume(Number(e.target.value))}
            />
            <VolumeUpIcon className='button' onClick={() => volume < 10 && setVolume(volume+10)}/>
        </div>
    </div>
  )
}

export default Player