
const SoChain = require('.');


(async () => {
  const chain = new SoChain('BTC');
  let info = await chain.info();
  let { prices } = await chain.prices();
  let block = await chain.block('588396');
  let tx = await chain.tx('ea19dc68977685c080f524924e9f9d0e8f0371dcacc1333b0cdc114fc8126c02');
  let address = await chain.address('1C81BGyi8SJ919UxnHm2iwNmaN2RHfU4us');
  let utxos = await chain.utxos('1C81BGyi8SJ919UxnHm2iwNmaN2RHfU4us');
})();
