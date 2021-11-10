<template>
  <section id="propertyDetail">
    <div v-if="property == null" class="w-full flex justify-center">
      <hollow-dots-spinner :dot-size="15" :dots-num="3" color="#3498db" />
    </div>
    <div
      v-if="property != null"
      class="flex flex-col align-center justify-center"
    >
      <div class="pb-5 text-right">
        <button class="p-3 rounded-xl bg-gray-200" @click="router.go(-1)">
          Back
        </button>
      </div>
      <!-- <pre>{{ property.isSold }}</pre> -->
      <table class="table-auto border-collapse border border-green-800">
        <tr>
          <th>Property Name</th>
          <td>{{ property.name }}</td>
        </tr>
        <tr>
          <th>Property Description</th>
          <td>{{ property.description }}</td>
        </tr>
        <tr>
          <th>Property Address 1</th>
          <td>{{ property.propertyAddress.address1 }}</td>
        </tr>
        <tr>
          <th>Property Address 2</th>
          <td>{{ property.propertyAddress.address2 }}</td>
        </tr>
        <tr>
          <th>Property City</th>
          <td>{{ property.propertyAddress.city }}</td>
        </tr>
        <tr>
          <th>Property Province</th>
          <td>{{ property.propertyAddress.province }}</td>
        </tr>
        <tr>
          <th>Property Postcode</th>
          <td>{{ property.propertyAddress.postcode }}</td>
        </tr>
        <tr>
          <th>Property Country</th>
          <td>{{ property.propertyAddress.country }}</td>
        </tr>
        <tr>
          <th>Seller</th>
          <td>{{ concealAddress(property.owner) }}</td>
        </tr>
        <tr v-if="property.isSold">
          <th>Buyer</th>
          <td>
            {{ concealAddress(property.buyer) }}
          </td>
        </tr>
        <tr>
          <th>Listed Price</th>
          <td>{{ price }} ETH</td>
        </tr>
      </table>
      <div class="mt-3 text-left" v-if="!property.isSold">
        <template v-if="!property.isSold && !isOwner">
          <button
            class="mr-3 p-3 rounded-xl bg-blue-200"
            v-if="!isPurchaseLoading"
            @click="purchaseProperty"
          >
            <p>Purchase</p>
          </button>
          <button
            class="mr-3 p-3 rounded-xl bg-blue-200"
            v-if="isPurchaseLoading"
          >
            <hollow-dots-spinner :dot-size="15" :dots-num="3" color="#3498db" />
          </button>
        </template>

        <button
          class="mr-3 p-3 rounded-xl bg-gray-200 cursor-normal"
          v-if="property.isSold && !isOwner"
        >
          Sold
        </button>
        <button
          class="p-3 rounded-xl bg-blue-200"
          v-if="!property.isSold && property.isActive && isOwner"
          @click="router.push(`/app/edit/${property.id}`)"
        >
          Edit
        </button>
      </div>
    </div>
    <modal
      :is-visible="showModal"
      @cancel="closeModal"
      @confirm="router.push('/app')"
    >
      <template v-slot:title>{{ modal.title }}</template>
      <template v-slot:body>
        <p>{{ modal.body }}</p>
      </template>
      <template v-slot:confirm-button>
        <button v-show="modal.showConfirm">See Listings</button>
      </template>
    </modal>
  </section>
</template>
<script>
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, computed, onMounted } from "vue";
import contract from "@/common/contract.js";
import { HollowDotsSpinner } from "epic-spinners";
import { formatEtherBalance } from "@/common/web3.js";
import { useStore } from "vuex";
import { concealAddress } from "@/common/strings.js";
import Modal from "@/components/util/Modal";

export default {
  name: "PropertyDetail",
  components: {
    HollowDotsSpinner,
    Modal,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const isPurchaseLoading = ref(false);
    const showModal = ref(false);
    const property = ref(null);
    const modal = reactive({
      title: "",
      body: "",
      showConfirm: false,
    });

    const price = computed(() => {
      return formatEtherBalance(property.value.price, 18);
    });

    const isOwner = computed(() => {
      return store.state.accounts[0] === property.value.owner;
    });

    const getEtherscanLink = (address) => {
      return "https://ropsten.etherscan.io/address/" + address;
    };

    const getPropertyDeatil = (callback) => {
      contract.getPropertyDetail(route.params.id).then((res) => {
        // console.log(res);
        property.value = res;
        callback;
      });
    };

    const setModal = (title, body, showConfirm = true) => {
      modal.title = title;
      modal.body = body;
      modal.showConfirm = showConfirm;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const purchaseProperty = async () => {
      try {
        isPurchaseLoading.value = true;
        let receipt = await contract.purchaseProperty(property.value);
        console.log(receipt);

        getPropertyDeatil(() => {
          isPurchaseLoading.value = false;
          setModal(
            "Purchase Success",
            `Transaction ID: ${receipt.transaction}`
          );
        });
      } catch (e) {
        isPurchaseLoading.value = false;
        setModal("Purchase Failed", e.code, false);
      }
    };

    onMounted(() => {
      // console.log(route.params.id);
      getPropertyDeatil();
    });
    return {
      router,
      route,
      property,
      formatEtherBalance,
      getEtherscanLink,
      isOwner,
      concealAddress,
      purchaseProperty,
      isPurchaseLoading,
      closeModal,
      showModal,
      price,
      modal,
    };
  },
};
</script>
<style lang="scss" scoped>
th {
  @apply text-left;
}
td {
  @apply text-center;
}

th,
td {
  @apply p-3 border border-black;
}
</style>
