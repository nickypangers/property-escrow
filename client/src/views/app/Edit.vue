<template>
  <div>
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
      v-if="hasProperty"
      @cancel-listing="cancelListing"
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
        <button v-if="modal.showFooter">See Listings</button>
      </template>
    </modal>
  </div>
</template>
<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import contract from "@/common/contract.js";
import Modal from "@/components/util/Modal";
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
    const listing = ref({});
    const countryList = computed(() => {
      return countries.sort();
    });
    const isPropertyLoaded = ref(false);
    const isTransactionLoading = ref(false);
    const modal = reactive({
      title: "",
      body: "",
      showFooter: false,
    });
    const isVisible = ref(false);
    const closeModal = () => {
      isVisible.value = false;
    };
    const setModal = (title, body, showFooter = true) => {
      modal.title = title;
      modal.body = body;
      modal.showFooter = showFooter;
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
        setModal("Unable to edit", e.message, false);
      }
    };

    const getPropertyDetail = async () => {
      listing.value = await contract.getPropertyDetail(route.params.id);
      hasProperty.value = true;
    };

    const cancelListing = async () => {
      try {
        isTransactionLoading.value = true;
        console.debug("id", route.params.id);
        const transaction = await contract.cancelListing(route.params.id);
        isTransactionLoading.value = false;
        setModal(
          "Success",
          `Listing cancelled successfully. Transaction ID: ${transaction.transaction}`
        );
        getPropertyDetail();
      } catch (e) {
        isTransactionLoading.value = false;
        setModal("Unable to cancel", e.message, false);
      }
    };

    const hasProperty = ref(false);

    onMounted(async () => {
      await getPropertyDetail();
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
      hasProperty,
      cancelListing,
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
