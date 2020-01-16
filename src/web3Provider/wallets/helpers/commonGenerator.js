import Common from 'ethereumjs-common';

const commonGenerator = network => {
  const customCommon = Common.forCustomChain('mainnet', {
    name: network.name_long,
    chainId: network.chainID
  });
  return new Common(customCommon._chainParams, 'petersburg', ['petersburg']);
};

export default commonGenerator;
