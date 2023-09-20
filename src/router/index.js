import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import AboutMe from "../views/AboutMe.vue";
import GameLife from "../views/GameLife.vue";
import test from "../views/test.vue";

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
      component: GameLife,
    },
    {
      path: "/test",
      name: "test",
      component: test,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
