import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import App from "../views/App.vue";
import AppHome from "../views/app/Home.vue";
import Create from "../views/Create.vue";
import PropertyDetail from "../views/PropertyDetail.vue";
import store from "@/store/index.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/app",
    name: "App",
    component: App,
    beforeEnter(to, from, next) {
      if (store.state.contract == null) {
        next("/");
      } else {
        next();
      }
    },
    children: [
      {
        path: "",
        name: "AppHome",
        component: AppHome,
      },
      {
        path: "create",
        name: "Create",
        component: Create,
      },
      {
        path: "detail/:id",
        name: "PropertyDetail",
        component: PropertyDetail,
      },
    ],
  },

  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
