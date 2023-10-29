// https://github.com/CRREL/to-snake-case/blob/master/index.js
module.exports = str => str.replace(/[A-Z]/g, $1 => `_${$1.toLowerCase()}`)
