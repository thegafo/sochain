

// Create simple transaction

var ask = require('./ask');
var bitcoin = require('bitcoinjs-lib');
var SoChain = require('./index');


var network = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4, //  for segwit (start with 2)
  wif: 0xef
};

var chain = new SoChain('LTCTEST');


(async () => {

  var address = await ask('sending address:');

  var utxos = (await chain.utxos(address)).txs;
  console.log('\nUTXOS:');
  utxos.map(u => {
    var satoshis = Math.floor(parseFloat(u.value)*100000000)
    console.log(`\t${satoshis} (${parseFloat(u.value).toFixed(2)}) ${u.txid} [${u.output_no}]`)
  });
  console.log();

  var recipient = await ask('recipient address:');
  var utxid = await ask('utxo ID:')
  var utxindex = parseInt(await ask('utxo index:'));
  var amount = parseInt(await ask('amount:'));
  var fee = parseInt(await ask('fee:'));
  var secret = await ask('secret:');

  var txb = new bitcoin.TransactionBuilder(network);
  txb.addInput(utxid, utxindex);
  txb.addOutput(recipient, amount-fee);

  var keyPair = bitcoin.ECPair.fromWIF(secret, network);

  txb.sign(0, keyPair);

  var hex = txb.build().toHex();

  if ((await ask('broadcast?')).startsWith('y')) {
    console.log(await chain.broadcast(hex));
    process.exit();
  }


})();
