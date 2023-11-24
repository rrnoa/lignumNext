"use client";
import Image from 'next/image'
import styles from './page.module.css'
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <Link className="button button--brand" href="/main">
        <h2>
            Art Attack <span>-&gt;</span>
          </h2>
          <p>The journey begins</p>
        </Link>
        
      </div>
    </main>
  )
}
