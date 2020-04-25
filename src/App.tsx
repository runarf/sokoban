import React from "react";
import "./App.css";
import game from "./Game/Game";
import { IonPhaser } from "@ion-phaser/react";
function App() {
  return <IonPhaser game={game} />;
}

export default App;
