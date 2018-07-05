
const readline = require('readline');
var rl = null;

/**
 * ask - prompt user at terminal
 *
 * @param  {String} question the prompt to display
 * @return {Promise}         resolves with answer
 */
var ask = (question) => {
  return new Promise((resolve,reject) => {
    if (!rl) {
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }
    if (!question.endsWith(' ')) question += ' ';
    rl.question(question, answer => {
      resolve(answer);
    });
  })
}

module.exports = ask;
