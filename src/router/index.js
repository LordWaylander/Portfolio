import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Presentation from "../views/Presentation.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/presentation",
      name: "presentation",
      component: Presentation,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
