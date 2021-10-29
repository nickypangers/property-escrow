const { expect } = require("chai");

describe("PropertyEscrow contract", function () {
  let Escrow;
  let propertyEscrow;

  beforeEach(async function () {
    Escrow = await ethers.getContractFactory("PropertyEscrow");
    propertyEscrow = await Escrow.deploy();
  });

  describe("View", function () {
    it("Deployment should assign properties length 0", async function () {
      const propertiesLength = await propertyEscrow.getPropertyLength();
      expect(propertiesLength).to.equal(0);
    });
  });

  describe("Admin", async function () {
    beforeEach(async function () {
      [owner, addr1] = await ethers.getSigners();
    });

    it("Get is owner a manager should return true", async function () {
      const isManager = await propertyEscrow.isManager(owner.address);
      expect(isManager).to.equal(true);
    });

    it("Get is addr1 a manager should return false", async function () {
      const isManager = await propertyEscrow.isManager(addr1.address);
      expect(isManager).to.equal(false);
    });

    it("Execute set manager from non-owner should revert Only owner can execute", async function () {
      await expect(
        propertyEscrow.connect(addr1.address).setManager(addr1.address, true)
      ).to.be.reverted;
    });

    it("Add addr1 to manager and get should return true", async function () {
      const isManager = await propertyEscrow.isManager(addr1.address);
      expect(isManager).to.equal(false);

      await propertyEscrow.setManager(addr1.address, true);
      const newIsManager = await propertyEscrow.isManager(addr1.address);
      expect(newIsManager).to.equal(true);
    });
  });

  describe("Property", async function () {
    beforeEach(async function () {
      [owner, addr1] = await ethers.getSigners();

      const propertiesLength = await propertyEscrow.getPropertyLength();
      expect(propertiesLength).to.equal(0);
      await propertyEscrow.createListing(
        "Flat H, 20/F, Block 16",
        "Park Island",
        "Ma Wan",
        "NT",
        "00000",
        "HK",
        "PI1620H",
        "Some description",
        1
      );
    });

    it("Create property should increase properties by 1", async function () {
      const newPropertiesLength = await propertyEscrow.getPropertyLength();
      expect(newPropertiesLength).to.equal(1);
    });

    it("Get property is active should return true", async function () {
      const propertyIsActive = await propertyEscrow.getPropertyIsActive(1);
      expect(propertyIsActive).to.equal(true);
    });

    it("Get property price should return 1", async function () {
      const price = await propertyEscrow.getPropertyPrice(1);
      expect(price).to.equal(1);
    });

    it("Incorrect property id should return revert Property not found", async function () {
      await expect(propertyEscrow.getPropertyIsActive(9)).to.be.revertedWith(
        "Property not found"
      );
    });

    it("Cancel listing then get property is active should return false", async function () {
      await propertyEscrow.cancelListing(1);
      const isActive = await propertyEscrow.getPropertyIsActive(1);
      expect(isActive).to.equal(false);
    });

    it("Cancel listing by non-property owner should revert", async function () {
      await expect(propertyEscrow.connect(addr1.address).cancelListing(1)).to.be
        .reverted;
    });

    it("Get property is sold of unsold property should return false", async function () {
      const isSold = await propertyEscrow.getPropertyIsSold(1);
      expect(isSold).to.be.equal(false);
    });

    it("Purchse own property should revert", async function () {
      await expect(
        propertyEscrow.payProperty(1, { from: owner.address, value: 1 })
      ).to.be.reverted;
    });

    it("Purchase property from non-property owner then get property is sold should return true", async function () {
      await propertyEscrow
        .connect(addr1)
        .payProperty(1, { from: addr1.address, value: 1 });
      const isSold = await propertyEscrow.getPropertyIsSold(1);
      expect(isSold).to.be.equal(true);
    });

    it("Purchase property from non-property owner then get property is active should return false", async function () {
      await propertyEscrow
        .connect(addr1)
        .payProperty(1, { from: addr1.address, value: 1 });
      const isSold = await propertyEscrow.getPropertyIsActive(1);
      expect(isSold).to.be.equal(false);
    });

    it("Get property should return property", async function () {
      const property = await propertyEscrow.getPropertyDetail(1);
      //    "Flat H, 20/F, Block 16",
      //     "Park Island",
      //     "Wa Wan",
      //     "NT",
      //     "00000",
      //     "HK",
      //     "PI1620H",
      //     "Some description",
      //     1
      expect(property.propertyAddress.address1).to.equal(
        "Flat H, 20/F, Block 16"
      );
      expect(property.propertyAddress.address2).to.equal("Park Island");
      expect(property.propertyAddress.city).to.equal("Ma Wan");
      expect(property.propertyAddress.province).to.equal("NT");
      expect(property.propertyAddress.postcode).to.equal("00000");
      expect(property.propertyAddress.country).to.equal("HK");
      expect(property.name).to.equal("PI1620H");
      expect(property.description).to.equal("Some description");
      expect(property.price).to.equal(1);
    });
  });
});
