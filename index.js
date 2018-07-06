
const request = require('request');

class SoChain {

  constructor (network) {
    this.network = network;
  }

  /**
   * get - perform GET request
   *
   * @param  {String} url the URL to GET
   * @return {Promise}    resolves with result data
   */
  get (url) {
    return new Promise((resolve,reject) => {
      var options = {
        uri: url,
        method: 'GET'
      };
      request(options, (err,res,body) => {
        if (err) return reject(err);
        if (res.statusCode == 200) {
          resolve(JSON.parse(body).data);
        } else {
          reject(new Error(body));
        }
      })
    });
  }

  /**
   * post - description
   *
   * @param  {String} url  the URL to POST
   * @param  {Object} data the JSON data to POST
   * @return {Promise}     resolves with result data
   */
   post (url, data) {
     return new Promise((resolve,reject) => {
       var options = {
         uri: url,
         method: 'POST',
         json: data
       };
       request(options, (err,res,body) => {
         if (err) return reject(err);
         if (res.statusCode == 200) {
           resolve(body.data);
         } else {
           console.log(body);
           reject(new Error(body));
         }
       })
     });
   }

  /**
   * async info - get network info
   *
   * @return {Promise}  resolves with network info
   */
  async info () {
    return await this.get(`https://chain.so/api/v2/get_info/${this.network}`);
  }


  /**
   * async prices - get network prices
   *
   * @return {Promise}  resolves with network prices
   */
  async prices() {
    return await this.get(`https://chain.so/api/v2/get_price/${this.network}`);
  }


  /**
   * async block - get block data
   *
   * @param  {String} id block hash or number
   * @return {Promise}   resolves with block data
   */
  async block(id) {
    return await this.get(`https://chain.so/api/v2/block/${this.network}/${id}`);
  }

  /**
   * async tx - get transaction data
   *
   * @param  {String} id transaction ID
   * @return {Promise}   resolves with tx data
   */
  async tx(id) {
    return await this.get(`https://chain.so/api/v2/get_tx/${this.network}/${id}`);
  }

  /**
   * async address - get address data
   *
   * @param  {String} id the address to lookup
   * @return {Promise}   resolves with address data
   */
  async address(id) {
    return await this.get(`https://chain.so/api/v2/address/${this.network}/${id}`);
  }

  /**
   * async utxos - get UTXOs for address
   *
   * @param  {String} address the address to lookup
   * @return {Promise}        resolves with utxo data
   */
  async utxos(address) {
    return await this.get(`https://chain.so/api/v2/get_tx_unspent/${this.network}/${address}`);
  }

  /**
   * async broadcast - broadcast signed transaction hex
   *
   * @param  {String} hex the signed hex string to send
   * @return {Promise}    resolves with broadcast result
   */
  async broadcast(hex) {
    return await this.post(`https://chain.so/api/v2/send_tx/${this.network}`, {tx_hex: hex});
  }

}

module.exports = SoChain;
