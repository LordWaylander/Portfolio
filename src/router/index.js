import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import AboutMe from "../views/AboutMe.vue";
import GameLifeView from "../views/GameLifeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/aboutMe",
      name: "aboutMe",
      component: AboutMe,
    },
    {
      path: "/gameLife",
      name: "gameLife",
      component: GameLifeView,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
