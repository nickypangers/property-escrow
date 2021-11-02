import store from "@/store/index.js";
import { ethers } from "ethers";

export default {
  async createListing(listing) {
    try {
      let contract = store.state.contract;
      const txResponse = await contract.createListing(
        listing.address1,
        listing.address2,
        listing.city,
        listing.region,
        listing.postcode,
        listing.country,
        listing.name,
        listing.description,
        ethers.utils.parseEther(`${listing.price}`, "ether")
      );
      const txReceipt = await txResponse.wait();
      console.debug("txReceipt", txReceipt);
      return { transaction: txReceipt.transactionHash };
    } catch (e) {
      alert(e);
    }
  },
  async getPropertyList() {
    try {
      let contract = store.state.contract;
      return await contract.getPropertyList();
    } catch (e) {
      alert(e);
    }
  },
  async purchaseProperty(property) {
    console.debug("property", property.price);
    try {
      let contract = store.state.contract;
      const txResponse = await contract.payProperty(property.id, {
        from: store.state.accounts[0],
        value: property.price,
      });
      const txReceipt = await txResponse.wait();
      console.debug("txReceipt", txReceipt);
      return { transaction: txReceipt.transactionHash };
    } catch (e) {
      alert(e);
    }
  },
};
