// export const getContractAbi = () => PropertyEscrowContract;

export const getContractAddress = () =>
  "0xe58505ce40507E04f6be4587bD8B41922d7B3Cfa";

export const getProviderURL = (network) => {
  console.debug("network", network);
  switch (network) {
    case "ROPSTEN":
      return "https://eth-ropsten.alchemyapi.io/v2/MzQ5PAmiP3qH9nhONMES98WfElPeh05n";
    default:
      return "https://eth-ropsten.alchemyapi.io/v2/MzQ5PAmiP3qH9nhONMES98WfElPeh05n";
  }
};
