<template>
  <div class="container mx-auto px-20">
    <div class="flex justify-between items-end py-3">
      <h1 class="font-bold">Edit Listing</h1>
      <button class="p-3 rounded-xl bg-gray-200" @click="router.go(-1)">
        Back
      </button>
    </div>
    <property-form
      v-model="listing"
      :callback="editProperty"
      submit-text="Edit"
      :is-transaction-loading="isTransactionLoading"
      :is-edit="true"
    />
    <modal
      :is-visible="isVisible"
      @cancel="closeModal"
      @confirm="router.push('/app')"
    >
      <template v-slot:title>{{ modal.title }}</template>
      <template v-slot:body>
        <p>{{ modal.body }}</p>
      </template>
      <template v-slot:confirm-button>
        <button>See Listings</button>
      </template>
    </modal>
  </div>
</template>
<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import contract from "@/common/contract.js";
import Modal from "@/components/util/Modal";
// import { HollowDotsSpinner } from "epic-spinners";
import countries from "@/assets/data/countries.json";
import PropertyForm from "@/components/PropertyForm";
export default {
  name: "Create",
  components: {
    Modal,
    PropertyForm,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const listing = ref({
      propertyAddress: {
        address1: "",
        address2: "",
        city: "",
        province: "",
        postcode: "",
        country: "",
      },
      name: "",
      description: "",
      price: "",
    });
    const countryList = computed(() => {
      return countries.sort();
    });
    const isPropertyLoaded = ref(false);
    const isTransactionLoading = ref(false);
    const modal = reactive({
      title: "",
      body: "",
    });
    const isVisible = ref(false);
    const closeModal = () => {
      isVisible.value = false;
    };
    const setModal = (title, body) => {
      modal.title = title;
      modal.body = body;
      isVisible.value = true;
    };

    const editProperty = async () => {
      try {
        isTransactionLoading.value = true;
        const transaction = await contract.editProperty(listing.value);
        isTransactionLoading.value = false;
        setModal(
          "Success",
          `Property edited successfully. Transaction ID: ${transaction.transaction}`
        );
        getPropertyDetail();
      } catch (e) {
        isTransactionLoading.value = false;
        alert(e);
      }
    };

    const getPropertyDetail = async () => {
      listing.value = await contract.getPropertyDetail(route.params.id);
    };

    onMounted(async () => {
      getPropertyDetail();
      // console.log(listing.value);
    });

    return {
      router,
      countryList,
      listing,
      isPropertyLoaded,
      closeModal,
      setModal,
      isVisible,
      isTransactionLoading,
      editProperty,
      modal,
    };
  },
};
</script>
<style lang="scss" scoped>
input,
select {
  @apply w-full border p-3;
}

label {
  @apply mt-3;
}
</style>
