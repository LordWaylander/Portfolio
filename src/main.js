import "./assets/main.scss";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import GameLifeBoard from "./projects/GameLife/GameLifeBoard.vue";
import Presentation from "./components/Presentation.vue";
import Realisations from "./components/Realisations.vue";
import Experiences from "./components/Experiences.vue";
import SavoirFaire from "./components/SavoirFaire.vue";
import Footer from "./components/Footer.vue";
import Card from "./components/Card.vue";
import SocialsLinks from "./components/SocialsLinks.vue";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.component("GameLifeBoard", GameLifeBoard);
app.component("Presentation", Presentation);
app.component("Realisations", Realisations);
app.component("Experiences", Experiences);
app.component("SavoirFaire", SavoirFaire);
app.component("Card", Card);
app.component("Footer", Footer);
app.component("SocialsLinks", SocialsLinks);

app.mount("#app");
