<template>
  <div>
    <nav-bar />
    <div class="lg:grid lg:grid-cols-6 gap-4 bg-gray-blue py-3">
      <app-side-bar />
      <div class="col-span-5 container mt-3 lg:mt-0">
        <router-view class="px-3" />
      </div>
    </div>
  </div>
</template>
<script>
import AppSideBar from "@/components/util/AppSideBar";
import NavBar from "@/components/util/NavBar";
export default {
  name: "App",
  components: {
    AppSideBar,
    NavBar,
  },
  setup() {},
};
</script>
