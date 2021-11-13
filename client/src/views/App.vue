<template>
  <div class="grid grid-cols-6 gap-4 bg-gray-blue pt-3 h-full">
    <app-side-bar />
    <router-view class="col-span-5 container" />
  </div>
</template>
<script>
import AppSideBar from "@/components/util/AppSideBar";
export default {
  name: "App",
  components: {
    AppSideBar,
  },
  setup() {},
};
</script>
