<template>
  <div>
    <nav-bar />
    <!-- <div class="m-3 bg-red-300 w-full py-3">testing</div> -->
    <div class="w-full p-3">
      <div class="w-full bg-red-300 rounded-xl p-3">
        This app is created as a personal project and is for entertainment
        purposes only. The contract has not been audited. Please do not fill in
        any personal information. Feel free to check out my porfolio
        <a href="http://nickypangers.com" class="text-blue-500 underline"
          >here</a
        >
      </div>
    </div>
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
