<template>
  <div class="home">
    <div>{{ testing }}</div>
    <div>{{ address }}</div>
    <div>{{ balance }}</div>
    <div>
      <button @click="connect">Connect Account</button>
    </div>
    <div v-show="isConnected">
      <div>
        <button @click="getPropertyLength">Get Property Length</button>
      </div>
      <div>
        {{ listing }}
        <form @submit.prevent="createListing">
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
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch, ref, reactive } from "vue";
import { useStore } from "vuex";
import { initWeb3, getBalance } from "@/common/web3.js";
import contract from "@/common/contract.js";

export default {
  name: "Home",
  components: {},
  setup() {
    const testing = "hi";

    const store = useStore();

    const isConnected = ref(false);

    const address = ref("");
    const balance = ref(0.0);

    const accounts = computed(() => store.state.accounts);

    const listing = reactive({
      address1: "",
      address2: "",
      city: "",
      region: "",
      postcode: "",
      country: "",
      name: "",
      description: "",
      price: 0,
    });

    watch(accounts, (newVal) => {
      if (newVal.length > 0) {
        address.value = accounts.value[0];
      }
    });

    const connect = async () => {
      try {
        await initWeb3();
        isConnected.value = true;
        getBalance(store.state.accounts[0]).then((response) => {
          balance.value = response;
        });
      } catch (e) {
        alert(e);
      }
    };

    const getPropertyLength = async () => {
      let contract = store.state.contract;
      const propertyLength = await contract.getPropertyLength();
      console.debug("Property Length", propertyLength.toNumber());
    };

    const createListing = async () => {
      console.debug("listing", listing);
      let receipt = await contract.createListing(listing);
      console.debug("receipt", receipt);
    };

    return {
      testing,
      address,
      connect,
      balance,
      getPropertyLength,
      isConnected,
      listing,
      createListing,
    };
  },
};
</script>
