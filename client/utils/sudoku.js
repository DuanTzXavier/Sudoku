var util = require('util.js')
var sudokuui = require('sudokuui.js')

/**
 * 将纯数字数独map转为对象array
 */
var convertNumberMap2Obj = (numberMap) => {
  var dataList = new Array()
  var numberLines = numberMap.split("\n")
  for (var i in numberLines) {
    var numberItems = numberLines[i].split("")
    var numberObjs = new Array()
    for (var j in numberItems) {
      var item = new Object()
      if (numberItems[j] != 0) {
        item.number = numberItems[j]
        item.editable = false
      } else {
        item.editable = true
      }
      //TODO 配置文件获取色值
      if (sudokuui.isMiddleSubgrids(j, i)) {
        item.color = "burlywood"
      } else {
        item.color = "bisque"
      }
      item.positionX = j
      item.positionY = i
      item.position = j + "" + i
      numberObjs.push(item)
    }
    var items = new Object()
    items.items = numberObjs
    dataList.push(items)
  }
  return dataList
}

/**
 * 通过唯一值获取 position 格子中的唯一值
 * 
 * callback(allNumber) 返回这个格子中所有的唯一值
 */
var uniqueCandidate = (listData, position, callback) => {
  var allNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9,]

  //先删除这行和这列的数字
  for (var index = 0; index < 9; index++) {
    util.remove(allNumber, listData[index].items[position[0]].number)
  }

  for (var index = 0; index < 9; index++) {
    util.remove(allNumber, listData[position[1]].items[index].number)
  }

  //然后求出position的九宫格的位置
  var positionColumn = parseInt(position[0] / 3)
  var positionRow = parseInt(position[1] / 3)

  //删除九宫格内的数字
  for (var x = positionRow * 3; x < positionRow * 3 + 3; x++) {
    for (var y = positionColumn * 3; y < positionColumn * 3 + 3; y++) {
      util.remove(allNumber, listData[x].items[y].number)
    }
  }

  callback(allNumber)
}

/**
 * 检查此位置所填的数字是否为有效的
 */
var checkValidity = (listData, position, value) => {
  var isValidity = true
  var allSetNumber = new Array()
  //先添加这行和这列的数字
  for (var index = 0; index < 9; index++) {
    if (index != position[1]){
      isValidity = sudokuui.showInValidity(listData, index, position[0], value)
    }
  }

  for (var index = 0; index < 9; index++) {
    if (index != position[0]) {
      isValidity = sudokuui.showInValidity(listData, position[1], index, value)
    }
  }

  //然后求出position的九宫格的位置
  var positionColumn = parseInt(position[0] / 3)
  var positionRow = parseInt(position[1] / 3)

  //添加九宫格内的数字
  for (var x = positionRow * 3; x < positionRow * 3 + 3; x++) {
    for (var y = positionColumn * 3; y < positionColumn * 3 + 3; y++) {
      if (x != position[1] && y != position[0]){
        isValidity = sudokuui.showInValidity(listData, x, y, value)
      }
    }
  }
  return isValidity
}

var test = callback => {
  var a = 1
  return callback(a)
}

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

module.exports = { convertNumberMap2Obj, uniqueCandidate, findUnique, saveOnlyOne, compareAll, isSpecial, test, checkValidity}