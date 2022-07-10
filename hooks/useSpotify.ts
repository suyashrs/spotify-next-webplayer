import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import spotifyApi from "../lib/spotify";

function useSpotify() {
    const { data: session } = useSession();

    useEffect(() => {
        if(session){
            if(session.error === "RefreshAccessTokenError"){
                signIn();
            }

            spotifyApi.setAccessToken(session.accessToken as string);
        }
    }, [session]);

    return spotifyApi;
}

export default useSpotify;