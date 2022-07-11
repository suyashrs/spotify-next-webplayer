import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import SpotifyProvider from 'next-auth/providers/spotify'
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify'

async function refreshAccessToken(token: JWT){
    try {
        spotifyApi.setAccessToken(token.accessToken as string);
        spotifyApi.setRefreshToken(token.refreshToken as string);
    
        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    
        return {
          ...token,
          accessToken: refreshedToken.access_token,
          accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // 1 hour as 3600 returns from Spotify API
          refreshToken: refreshedToken.refresh_token ?? token.refreshToken, //Replace if new, else use old refresh token
        };
      } catch (error) {
        console.error(error);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      //initial login
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at! * 1000, //convert expiry time to milliseconds
        };
      }
      //Return previous token if it has not expired yet
      if (Date.now() < (token.accessTokenExpires as Number)) {
        return token;
      }

      //if token expires
      console.log("Access expired! Refreshing...");
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.username = token.username;

      return session;
    },
  },
});
