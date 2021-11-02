<template>
  <div class="container mx-auto px-20">
    <section>
      <property-list-table
        :property-list="propertyList"
        @purchase="purchaseProperty"
      />
    </section>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import contract from "@/common/contract.js";
import PropertyListTable from "@/components/PropertyListTable";
export default {
  name: "App",
  components: {
    PropertyListTable,
  },
  setup() {
    const store = useStore();

    const propertyList = ref([]);

    async function initApp() {
      let list = await contract.getPropertyList();
      console.debug(list);
      propertyList.value = list;
    }

    const purchaseProperty = async (property) => {
      let transaction = await contract.purchaseProperty(property);
      console.log(transaction);
    };

    onMounted(async () => {
      await initApp();
    });

    return {
      store,
      propertyList,
      purchaseProperty,
    };
  },
};
</script>
