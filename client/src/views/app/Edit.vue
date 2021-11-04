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
        v-model="property.propertyAddress.address1"
        placeholder="Address 1"
        disabled
      />
      <input
        type="text"
        name="address2"
        id="address2"
        v-model="property.propertyAddress.address2"
        placeholder="Address 2"
        disabled
      />
      <input
        type="text"
        name="city"
        id="city"
        v-model="property.propertyAddress.city"
        placeholder="City"
        disabled
      />
      <input
        type="text"
        name="region"
        id="region"
        v-model="property.propertyAddress.region"
        placeholder="Region"
        disabled
      />
      <input
        type="text"
        name="postcode"
        id="postcode"
        v-model="property.propertyAddress.postcode"
        placeholder="Postcode"
        disabled
      />
      <select
        name="country"
        id="country"
        v-model="property.propertyAddress.country"
        disabled
      >
        <option
          v-for="(country, index) in countryList"
          :key="'country-' + index"
          :value="country"
        >
          {{ country }}
        </option>
      </select>
      <!-- <pre>{{ countries }}</pre> -->
      <input
        type="text"
        name="name"
        id="name"
        v-model="property.name"
        placeholder="Name"
      />
      <input
        type="text"
        name="description"
        id="description"
        v-model="property.description"
        placeholder="Description"
      />
      <input
        type="number"
        name="price"
        id="price"
        step="any"
        v-model="property.price"
        placeholder="Price"
      />
      <input
        type="submit"
        value="Edit Listing"
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
      :is-visible="showModal"
      @cancel="closeModal"
      @confirm="router.push(`/`)"
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
import { useRouter, useRoute } from "vue-router";
import contract from "@/common/contract.js";
import Modal from "@/components/util/Modal";
import { HollowDotsSpinner } from "epic-spinners";
import countries from "@/assets/data/countries.json";
export default {
  name: "Edit",
  components: {
    Modal,
    HollowDotsSpinner,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const countryList = computed(() => countries.sort());
    const property = ref({});
    const isTransactionLoading = ref(false);
    const showModal = ref(false);
    const modal = reactive({
      title: "",
      body: "",
    });

    const setModal = (title, body) => {
      modal.title = title;
      modal.body = body;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    onMounted(() => {
      contract.getPropertyDetail(route.params.id).then((res) => {
        property.value = res;
      });
    });

    return {
      router,
      countryList,
      property,
      isTransactionLoading,
      showModal,
      closeModal,
      setModal,
    };
  },
};
</script>
<style lang="scss" scoped>
input,
select {
  @apply w-full border p-3;
}
</style>
