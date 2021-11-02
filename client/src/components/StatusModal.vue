<template>
  <div
    class="
      fixed
      z-10
      w-screen
      h-screen
      pt-24
      overflow-auto
      bg-gray-100
      opacity-50
    "
  >
    <div class="m-auto p-2 w-4/5">testing</div>
  </div>
</template>
<script>
export default {
  name: "StatusModal",
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  setup() {
    return {};
  },
};
</script>
