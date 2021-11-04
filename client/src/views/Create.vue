<template>
  <div class="container mx-auto px-20">
    <div class="flex justify-between items-end py-3">
      <h1 class="font-bold">Create Listing</h1>
      <button class="p-3 rounded-xl bg-gray-200" @click="router.go(-1)">
        Back
      </button>
    </div>
    <form @submit.prevent="createListing" class="w-full flex flex-col">
      <input
        type="text"
        name="address1"
        id="address1"
        v-model="listing.address1"
        placeholder="Address 1"
      />
      <input
        type="text"
        name="address2"
        id="address2"
        v-model="listing.address2"
        placeholder="Address 2"
      />
      <input
        type="text"
        name="city"
        id="city"
        v-model="listing.city"
        placeholder="City"
      />
      <input
        type="text"
        name="region"
        id="region"
        v-model="listing.region"
        placeholder="Region"
      />
      <input
        type="text"
        name="postcode"
        id="postcode"
        v-model="listing.postcode"
        placeholder="Postcode"
      />
      <input
        type="text"
        name="country"
        id="country"
        v-model="listing.country"
        placeholder="Country"
      />
      <input
        type="text"
        name="name"
        id="name"
        v-model="listing.name"
        placeholder="Name"
      />
      <input
        type="text"
        name="description"
        id="description"
        v-model="listing.description"
        placeholder="Description"
      />
      <input
        type="number"
        name="price"
        id="price"
        step="any"
        v-model="listing.price"
        placeholder="Price"
      />
      <input
        type="submit"
        value="Create Listing"
        v-show="!isTransactionLoading"
      />
      <button
        class="w-full flex justify-center mt-3 py-3"
        v-show="isTransactionLoading"
      >
        <hollow-dots-spinner :dot-size="15" :dots-num="3" color="#3498db" />
      </button>
    </form>
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
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import contract from "@/common/contract.js";
import Modal from "@/components/util/Modal";
import { HollowDotsSpinner } from "epic-spinners";
export default {
  name: "Create",
  components: {
    Modal,
    // ButtonLoader,
    HollowDotsSpinner,
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
      address1: "",
      address2: "",
      city: "",
      region: "",
      postcode: "",
      country: "",
      name: "",
      description: "",
      price: "",
    });

    const resetListing = () => {
      listing.address1 = "";
      listing.address2 = "";
      listing.city = "";
      listing.region = "";
      listing.postcode = "";
      listing.country = "";
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

    return {
      router,
      listing,
      createListing,
      isVisible,
      modal,
      closeModal,
      isTransactionLoading,
    };
  },
};
</script>
<style lang="scss" scoped>
input {
  @apply w-full border p-3;
}
</style>
