<template>
  <div>
    <pre>{{ property }}</pre>
  </div>
</template>
<script>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import contract from "@/common/contract.js";
export default {
  name: "PropertyDetail",
  setup() {
    const route = useRoute();

    const property = ref({});

    onMounted(() => {
      console.log(route.params.id);
      contract.getPropertyDetail(route.params.id).then((res) => {
        console.log(res);
        property.value = res;
      });
    });
    return {
      route,
      property,
    };
  },
};
</script>
