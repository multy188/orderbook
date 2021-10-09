import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { OrderBook } from '../components';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Order Book</title>
        <meta name="description" content="Order book for Bitcoin and Ethereum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <OrderBook />
      </main>
    </div>
  )
}

export default Home
