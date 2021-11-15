<template>
  <div>
    <form class="w-full flex flex-col items-start" @submit.prevent="submitForm">
      <label for="address1"> Address 1:</label>
      <input
        type="text"
        name="address1"
        id="address1"
        v-model="property.propertyAddress.address1"
        :disabled="isEdit"
      />
      <label for="address2">Address 2:</label>
      <input
        type="text"
        name="address2"
        id="address2"
        v-model="property.propertyAddress.address2"
        :disabled="isEdit"
      />
      <label for="city">City:</label>
      <input
        type="text"
        name="city"
        id="city"
        v-model="property.propertyAddress.city"
        :disabled="isEdit"
      />
      <label for="province">Province:</label>
      <select
        name="province"
        id="province"
        v-model="property.propertyAddress.province"
        :disabled="isEdit"
      >
        <option
          v-for="(province, index) in provinceList"
          :key="'province-' + index"
          :value="province"
        >
          {{ province }}
        </option>
      </select>
      <label for="postcode">Postcode:</label>
      <input
        type="text"
        name="postcode"
        id="postcode"
        v-model="property.propertyAddress.postcode"
        :disabled="isEdit"
      />
      <label for="country">Country:</label>
      <select
        name="country"
        id="country"
        v-model="property.propertyAddress.country"
        :disabled="isEdit"
      >
        <option
          v-for="(country, index) in countryList"
          :key="'country-' + index"
          :value="country"
        >
          {{ country }}
        </option>
      </select>
      <label for="name">Property Name:</label>
      <input type="text" name="name" id="name" v-model="property.name" />
      <label for="description">Property Description:</label>
      <input
        type="text"
        name="description"
        id="description"
        v-model="property.description"
      />
      <label for="price">Price:</label>
      <input type="text" name="price" id="price" v-model="price" />
      <div class="mt-6 w-full flex" v-show="!isTransactionLoading">
        <input
          type="submit"
          class="flex-grow bg-green-accent"
          :value="submitText"
          v-show="!isTransactionLoading"
        />
        <div class="w-3" v-if="isEdit"></div>
        <button
          class="flex-grow bg-red-accent"
          v-if="isEdit"
          @click="emit('cancelListing')"
        >
          Cancel Listing
        </button>
      </div>
    </form>
    <div v-if="isTransactionLoading" class="mt-6 flex justify-center">
      <hollow-dots-spinner :dot-size="15" :dots-num="3" color="#3498db" />
    </div>
  </div>
</template>
<script>
import { ref, computed, watch, onMounted } from "vue";
import countries from "@/assets/data/countries.min.json";
import { HollowDotsSpinner } from "epic-spinners";
import { formatEtherBalance } from "@/common/web3.js";
// import { ethers } from "ethers";

export default {
  name: "PropertyForm",
  components: {
    HollowDotsSpinner,
  },
  props: {
    modelValue: {
      type: Object,
    },
    isTransactionLoading: Boolean,
    submitText: {
      type: String,
      default: "",
    },
    callback: Function,
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "cancelListing"],
  setup(props, { emit }) {
    // const price = computed({
    //   get: () => {
    //     return formatEtherBalance(property.value.price, 18);
    //     // return property.value.price;
    //   },
    //   set: (val) => {
    //     console.log(val);
    //     property.value.price = ethers.utils.parseEther(`${val}`, "ether");
    //   },
    // });
    const price = ref(0);

    const property = computed({
      get: () => props.modelValue,
      set: (value) => {
        console.debug("value", value);
        emit("update:modelValue", value);
      },
    });

    const submitForm = () => {
      property.value.price = price.value;
      props.callback(property.value);
    };

    const propertyCountry = computed(
      () => property.value.propertyAddress.country
    );

    const provinceList = computed(() => {
      return countries[property.value.propertyAddress.country];
    });

    // const countryList = computed(() => countries.sort());
    const countryList = computed(() => Object.keys(countries).sort());

    watch(propertyCountry, (value, oldVal) => {
      // console.debug("oldVal country", oldVal);
      // console.debug("value country", value);
      if (oldVal != value) {
        property.value.propertyAddress.province = provinceList.value[0];
      }
    });

    onMounted(() => {
      console.log(provinceList.value);
      console.log(props.modelValue);
      if (!props.isEdit) {
        property.value.propertyAddress.province = provinceList.value[0];
      }
      if (property.value.price != "") {
        price.value = formatEtherBalance(property.value.price, 18);
      }
    });

    return {
      property,
      countryList,
      price,
      provinceList,
      submitForm,
      emit,
    };
  },
};
</script>
<style lang="scss" scoped>
input,
select {
  @apply border p-3 rounded-xl;
}

input[type="text"],
select {
  @apply w-full bg-white;
}

input:disabled,
select:disabled {
  @apply bg-gray-200 text-gray-500;
}

label {
  @apply mt-3;
}

input[type="submit"],
button {
  @apply rounded-xl text-white;
}

input[type="submit"] {
  @apply bg-green-accent;
}
</style>
