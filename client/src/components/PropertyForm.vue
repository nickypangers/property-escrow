<template>
  <div>
    <form class="w-full flex flex-col items-start" @submit.prevent="callback">
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
      <!-- <input
        type="text"
        name="province"
        id="province"
        v-model="property.propertyAddress.province"
        :disabled="isEdit"
      /> -->
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
      <input
        type="submit"
        class="mt-3"
        :value="submitText"
        v-show="!isTransactionLoading"
      />
    </form>
    <div v-if="isTransactionLoading" class="mt-3 flex justify-center">
      <hollow-dots-spinner :dot-size="15" :dots-num="3" color="#3498db" />
    </div>
  </div>
</template>
<script>
import { computed, watch, onMounted } from "vue";
import countries from "@/assets/data/countries.min.json";
import { HollowDotsSpinner } from "epic-spinners";
// import { formatEtherBalance } from "@/common/web3.js";
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
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const price = computed({
      get: () => {
        // return formatEtherBalance(property.value.price, 18);
        return property.value.price;
      },
      set: (val) => {
        console.log(val);
        property.value.price = `${val}`;
      },
    });

    const property = computed({
      get: () => props.modelValue,
      set: (value) => {
        console.debug("value", value);
        emit("update:modelValue", value);
      },
    });

    const propertyCountry = computed(
      () => property.value.propertyAddress.country
    );

    const provinceList = computed(() => {
      return countries[property.value.propertyAddress.country];
    });

    // const countryList = computed(() => countries.sort());
    const countryList = computed(() => Object.keys(countries).sort());

    watch(
      propertyCountry,
      (value, oldVal) => {
        // console.debug("oldVal country", oldVal);
        // console.debug("value country", value);
        if (oldVal != value) {
          property.value.propertyAddress.province = provinceList.value[0];
        }
      }
      //   { deep: true }
    );

    onMounted(() => {
      console.log(provinceList.value);
      if (!props.isEdit) {
        property.value.propertyAddress.province = provinceList.value[0];
      }
    });

    return {
      property,
      countryList,
      price,
      provinceList,
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
