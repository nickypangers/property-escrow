<template>
  <div class="container mx-auto px-20">
    <div class="flex justify-between items-end py-3">
      <h1 class="font-bold">Create Listing</h1>
      <button class="p-3 rounded-xl bg-gray-200" @click="router.go(-1)">
        Back
      </button>
    </div>
    <property-form
      v-model="listing"
      submit-text="Create Listing"
      :is-transaction-loading="isTransactionLoading"
      :callback="createListing"
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
import { useRouter } from "vue-router";
import contract from "@/common/contract.js";
import Modal from "@/components/util/Modal";
import countries from "@/assets/data/countries.json";
import PropertyForm from "@/components/PropertyForm";
export default {
  name: "Create",
  components: {
    Modal,
    // ButtonLoader,
    PropertyForm,
  },
  setup() {
    const router = useRouter();

    const isTransactionLoading = ref(false);
    const isVisible = ref(false);
    const modal = reactive({
      title: "",
      body: "",
    });
    const listing = reactive({
      propertyAddress: {
        address1: "",
        address2: "",
        city: "",
        province: "",
        postcode: "",
        country: "Afghanistan",
      },
      name: "",
      description: "",
      price: "",
    });
    const countryList = computed(() => countries.sort());
    const resetListing = () => {
      listing.address1 = "";
      listing.address2 = "";
      listing.city = "";
      listing.province = "";
      listing.postcode = "";
      listing.country = countryList.value[0];
      listing.name = "";
      listing.description = "";
      listing.price = 0;
    };

    const closeModal = () => {
      if (isTransactionLoading.value) {
        return;
      }
      isVisible.value = false;
    };

    const createListing = async () => {
      console.debug("listing", listing);
      try {
        isTransactionLoading.value = true;
        let receipt = await contract.createListing(listing);
        if (receipt == null) {
          alert("Unable to create listing. Transaction cancelled.");
          isTransactionLoading.value = false;
          return;
        }
        resetListing();
        console.debug("receipt", receipt);
        isTransactionLoading.value = false;
        setModal(
          "Create Listing Success",
          `Transaction ID: ${receipt.transaction}`
        );
      } catch (e) {
        isTransactionLoading.value = false;
        alert(e);
      }
    };

    const setModal = (title, body) => {
      modal.title = title;
      modal.body = body;
      isVisible.value = true;
    };

    onMounted(() => {
      listing.country = countryList.value[0];
    });

    return {
      router,
      listing,
      createListing,
      isVisible,
      modal,
      closeModal,
      isTransactionLoading,
      countryList,
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
