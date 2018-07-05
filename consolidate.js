
var ask = require('./ask');
var bitcoin = require('bitcoinjs-lib');
var SoChain = require('./index');
var chain = new SoChain('LTCTEST');

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


var address = 'n3RoUiNsi2Atrhk45eFGJbXCvpenU5Jjdd';
var secret = 'cQDR2qX6KEeBbYYzgSTYVgnjK9maptCKUPFWbGMhJpKwueuY6Dzu';
var keyPair = bitcoin.ECPair.fromWIF(secret, network);

var fee = 100000;





chain.utxos(address)
  .then(async data => {
    var txs = data.txs;

    var txb = new bitcoin.TransactionBuilder(network);
    var sum = 0;
    for (var [index,tx] of txs.entries()) {
      sum += Math.floor(parseFloat(tx.value)*100000000)
      txb.addInput(tx.txid, tx.output_no)
    }
    console.log(`There are ${txs.length} txs to consolidate`);
    console.log(`Total value is ${(sum/100000000).toFixed(4)}`);

    if (await ask('continue?') != 'y') return process.exit();
    var fee = parseInt(await ask('fee? (satoshis)'));

    txb.addOutput(address, sum-fee);
    for (var [index,tx] of txs.entries()) {
      txb.sign(index, keyPair);
    }
    var hex = txb.build().toHex();

    console.log(txs.length);
    console.log(sum);
    console.log(sum/100000000);
    console.log(hex);

    console.log('estimated fees', hex.length/2*6);


    if (await ask('broadcast?') != 'y') return process.exit();

    chain.broadcast(hex).then(console.log).catch(console.error);


  });
