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

var saveOnlyOne = array => {
  var arrayTemp = new Array()
  while (array.length > 0){
    var tempUnique = array.pop()
    if (util.indexOf(arrayTemp, tempUnique) == -1) {
      arrayTemp.push(tempUnique)
    }
  }
  return arrayTemp
}

var compareAll = (arr, temp) => {
  var times = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].temp == undefined) {
      continue
    }
    if (util.isContains(temp.toString(), arr[i].temp.toString())) {
      times++
    }
  }
  return times
}

var isSpecial = (array) => {
  if (array.length == 0){
    return false
  }
  var tempArray = util.cloneObject(array)
  var temp = tempArray.pop()
  while (tempArray.length > 0){
    var temp2 = tempArray.pop()
    if (!util.isSame(temp2, temp)){
      return false
    }
  }

  return true
}

module.exports = { findUnique, saveOnlyOne, compareAll, isSpecial}