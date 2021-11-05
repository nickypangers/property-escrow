import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import App from "../views/App.vue";
import AppHome from "../views/app/Home.vue";
import Create from "../views/app/Create.vue";
import Edit from "../views/app/Edit.vue";
import PropertyDetail from "../views/app/PropertyDetail.vue";
import store from "@/store/index.js";
// import contract from "@/common/contract.js";

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
      {
        path: "edit/:id",
        name: "Edit",
        component: Edit,
        beforeEnter: async (to, from, next) => {
          let id = to.params.id;
          let contract = store.state.contract;
          const propertyDetail = await contract.getPropertyDetail(id);
          if (propertyDetail.owner != store.state.accounts[0]) {
            next(false);
            return;
          }
          if (!propertyDetail.isActive) {
            next(false);
            return;
          }
          next();
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
