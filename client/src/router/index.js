import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import App from "../views/AppHome.vue";
import AppHome from "../views/app/Home.vue";
import Create from "../views/app/Create.vue";
import Edit from "../views/app/Edit.vue";
import PropertyDetail from "../views/app/PropertyDetail.vue";
import store from "@/store/index.js";
import ManageMyListings from "../views/app/ManageMyListings.vue";
import PurchaseHistory from "../views/app/PurchaseHistory.vue";
import About from "../views/app/About.vue";

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
    // beforeEnter(to, from, next) {
    //   if (store.getters.activeContract == null) {
    //     next("/");
    //   } else {
    //     next();
    //   }
    // },
    children: [
      {
        path: "",
        name: "AppHome",
        component: AppHome,
      },
      {
        path: "manage",
        name: "ManageMyListings",
        component: ManageMyListings,
        beforeEnter(to, from, next) {
          if (store.state.isConnected) {
            next();
          }
          next("/app");
        },
      },
      {
        path: "orders",
        name: "PurchaseHistory",
        component: PurchaseHistory,
        beforeEnter(to, from, next) {
          if (store.state.isConnected) {
            next();
          }
          next("/app");
        },
      },
      {
        path: "create",
        name: "Create",
        component: Create,
        beforeEnter(to, from, next) {
          if (store.state.isConnected) {
            next();
          }
          next("/app");
        },
      },
      {
        path: "detail/:id",
        name: "PropertyDetail",
        component: PropertyDetail,
      },
      {
        path: "edit/:id",
        name: "Edit",
        component: Edit,
        beforeEnter: async (to, from, next) => {
          if (store.state.isConnected) {
            next();
          } else {
            next("/app");
          }

          let id = to.params.id;
          let contract = store.getters.activeContract;
          const propertyDetail = await contract.getPropertyDetail(id);
          if (propertyDetail.owner != store.state.accounts[0]) {
            next(false);
            return;
          }
          if (!propertyDetail.isActive) {
            next(false);
          }
          next();
        },
      },
      {
        path: "about",
        name: "About",
        component: About,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
