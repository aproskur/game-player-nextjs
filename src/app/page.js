import React from 'react';
import styles from "./page.module.css";
import GameScreenRenderer from "./components/GameScreenRenderer";

export default function Home() {
  console.log('Home component rendered');

  return (
    <main className={styles.main}>
      <GameScreenRenderer localDevelopment={true} />
    </main>
  );
}
