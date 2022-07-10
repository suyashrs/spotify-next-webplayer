import type { NextPage } from 'next'
import { getSession, GetSessionParams } from 'next-auth/react'
import Head from 'next/head'
import MainContent from '../components/MainContent'
import Center from '../components/MainContent'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Web App</title>
        <link rel='icon' href='/assets/favicon.ico' />
      </Head>
      <main className="flex">
        <Sidebar/>
        <MainContent/>    
      </main>
      <div className="sticky bottom-0">
        <Player/>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const session = await getSession(context);

  return {
    props: {
      session,
    }
  };
}
