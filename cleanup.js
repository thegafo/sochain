
var SoChain = require('./index');
var chain = new SoChain('LTCTEST');
var bitcoin = require('bitcoinjs-lib');


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

var target = 'msUqchEy8C3xVwLJvyLSBxSRFVr799BTAY';

var keys = [
  {public: 'n3W7zxDnHbcpm8gTiB6j9mG1puzQs3hCMQ', secret: 'cPzrcwryoBi1s7oHfLp4fsCY8DUH7yuJBETQWXUA4hwdhq9PVmWX'},
  {public: 'n1rj8pz1wBNEP8ci1rFuqsRiszeBDgDeSC', secret: 'cT2hqu3wN6XbAx3rq2XBppJDzmJMfWgty51gWYVJx57vz3EB5UpC'},
  {public: 'mjP9VNn9pEh3Lb7YKQYN3Fog5d5ELPEWxo', secret: 'cTRavFLT9iDS9J3XEGvYyTHKgXVcR6syds9CYeJxpaT1QLF9vBXR'},
  {public: 'n3RoUiNsi2Atrhk45eFGJbXCvpenU5Jjdd', secret: 'cQDR2qX6KEeBbYYzgSTYVgnjK9maptCKUPFWbGMhJpKwueuY6Dzu'},
];

var utxos = [];
var feeRate = 10;

(async () => {

  var sum = 0;
  for (var key of keys) {
    var outputs = (await chain.utxos(key.public)).txs;
    for (var o of outputs) {
      o.public = key.public;
      o.secret = key.secret;
      o.amount = Math.floor(parseFloat(o.value)*100000000);
      sum += o.amount;
      utxos.push(o);
    }
  }

  if (!utxos.length) return console.log(`NO UTXOs to consolidate!`);
  console.log(`Consolidating ${utxos.length} UTXOs`);

  // estimate fees
  var txb = new bitcoin.TransactionBuilder(network);
  for (var u of utxos) {
    txb.addInput(u.txid, u.output_no);
  }
  txb.addOutput(target, sum-10000);
  for (var [index,u] of utxos.entries()) {
    var keyPair = bitcoin.ECPair.fromWIF(u.secret, network);
    txb.sign(index, keyPair);
  }
  var prehex = txb.build().toHex();
  var fee = prehex.length/2*feeRate;
  console.log(`estimated fee is ${fee}`);

  txb = new bitcoin.TransactionBuilder(network);
  for (var u of utxos) {
    txb.addInput(u.txid, u.output_no);
  }
  txb.addOutput(target, sum-fee);
  for (var [index,u] of utxos.entries()) {
    var keyPair = bitcoin.ECPair.fromWIF(u.secret, network);
    txb.sign(index, keyPair);
  }

  var hex = txb.build().toHex();
  console.log(await chain.broadcast(hex));

})();
