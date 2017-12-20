var util = require('util.js')
var findUnique = array => {
  var arrayTemp = new Array()
  while (array.length > 0){
    var tempUnique = array[0]
    util.remove(array, tempUnique)
    if (util.indexOf(array, tempUnique) != -1){
      util.removeAll(array, tempUnique)
    }else{
      arrayTemp.push(tempUnique)
    }
  }
  return arrayTemp
}

module.exports = { findUnique }