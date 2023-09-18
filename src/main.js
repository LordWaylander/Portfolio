import "./assets/main.scss";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import GameLifeBoard from "./components/GameLifeBoard.vue";
import Presentation from "./components/Presentation.vue";
import Realisations from "./components/Realisations.vue";
import Experiences from "./components/Experiences.vue";
import SavoirFaire from "./components/SavoirFaire.vue";
import Card from "./components/Card.vue";

const app = createApp(App);

app.use(router);
app.component("GameLifeBoard", GameLifeBoard);
app.component("Presentation", Presentation);
app.component("Realisations", Realisations);
app.component("Experiences", Experiences);
app.component("SavoirFaire", SavoirFaire);
app.component("Card", Card);

app.mount("#app");
