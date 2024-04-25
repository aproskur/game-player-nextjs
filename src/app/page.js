import styles from "./page.module.css";
import GameScreenRenderer from "./components/GameScreenRenderer"

export default function Home() {


  return (

    <main className={styles.main}>
      <GameScreenRenderer />
      <div>This is the child component</div>
    </main>
  );
}