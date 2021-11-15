<template>
  <div class="grid grid-cols-6 gap-4 bg-gray-blue py-3">
    <app-side-bar />
    <div class="col-span-5 container">
      <router-view class="px-3" />
    </div>
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
