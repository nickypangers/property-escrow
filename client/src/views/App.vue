<template>
  <div class="container mx-auto px-20">
    <section id="actions">
      <div class="w-full flex justify-end items-center">
        <button
          class="bg-green-200 rounded-xl p-3"
          @click="router.push('/app/create')"
        >
          Create Listing
        </button>
      </div>
    </section>
    <section id="table">
      <property-list-table
        :property-list="propertyList"
        @refresh="getPropertyList"
      />
    </section>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import contract from "@/common/contract.js";
import PropertyListTable from "@/components/PropertyListTable";
export default {
  name: "App",
  components: {
    PropertyListTable,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const propertyList = ref([]);

    async function getPropertyList() {
      let list = await contract.getPropertyList();
      console.debug(list);
      propertyList.value = list;
    }

    const purchaseProperty = async (property) => {
      let transaction = await contract.purchaseProperty(property);
      console.log(transaction);
    };

    onMounted(async () => {
      await getPropertyList();
    });

    return {
      store,
      propertyList,
      purchaseProperty,
      router,
      getPropertyList,
    };
  },
};
</script>
