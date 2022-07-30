import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import HomePageLayout from '../layout/Home'
import styles from '../styles/Home.module.css'

const Home = () => {
  return (
    <div className={styles.container}>
    </div>
  )
}

Home.getLayout = (page: React.ReactElement) => {
  return <HomePageLayout>{page}</HomePageLayout>
}

export default Home
