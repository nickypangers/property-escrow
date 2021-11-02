<template>
  <div class="container mx-auto px-20">
    <div>Create Listing</div>
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
      <input type="submit" value="Create Listing" />
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
        <button v-if="!isTransactionLoading">See Listings</button>
      </template>
    </modal>
  </div>
</template>
<script>
import { ref, reactive } from "vue";
// import { useStore } from "vuex";
import { useRouter } from "vue-router";
import contract from "@/common/contract.js";
import Modal from "@/components/util/Modal";
export default {
  name: "Create",
  components: {
    Modal,
  },
  setup() {
    // const store = useStore();
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
      isTransactionLoading.value = true;
      setModal("Create Listing", "Creating");
      let receipt = await contract.createListing(listing);
      if (receipt == null) {
        alert("Unable to create listing. Transaction cancelled.");
        return;
      }
      resetListing();
      console.debug("receipt", receipt);
      isTransactionLoading.value = false;
      setModal(
        "Create Listing Success",
        `Transaction ID: ${receipt.transaction}`
      );
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
