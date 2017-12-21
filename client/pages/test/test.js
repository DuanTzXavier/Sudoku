var util = require('../../utils/util.js')
var sudoku = require('../../utils/sudoku.js')
var sudokuui = require('../../utils/sudokuui.js')

Page({

  data: {
    listData: {},
    lastClick: undefined,
    originListData: {},
    ALL_NUMBER: [1, 2, 3, 4, 5, 6, 7, 8, 9,],
    positions: {},
    isAdd:false
  },

  onLoad: function () {
    // var datas = "200673040\n050020003\n000000009\n000000004\n000058001\n000017002\n000500428\n800000906\n600000007"
    // var datas = "020006005\n000307000\n005000009\n500100080\n104000903\n070004002\n800000700\n000703000\n300400050"
    var datas = "200080600\n003009740\n190650020\n600400830\n400026007\n078030004\n020067083\n046100500\n005040006"
    var convertData = sudoku.convertNumberMap2Obj(datas)
    this.setData({
      listData: convertData,
      originListData: new Object(convertData)
    })
  },

  click: function (event) {

    this.resumeLastClickPosition()

    var position = event.currentTarget.dataset.hi.split("")

    if (this.checkEditable(position)) {
      this.selectPosition(position)
    } else {
      this.findAllThisNumber(position)
    }


  },

  findAllThisNumber: function (position) {
    var thisNumber = this.data.listData[position[1]].items[position[0]].number
    for (var i = 0; i < this.data.listData.length; i++) {
      for (var j = 0; j < this.data.listData[i].items.length; j++) {
        if (thisNumber == this.data.listData[i].items[j].number) {
          this.data.listData[i].items[j].color = "cadetblue"
        }
      }
    }

    this.setData({
      listData: this.data.listData,
    })
  },

  checkEditable: function (position) {
    return this.data.listData[position[1]].items[position[0]].editable
  },
  resumeLastClickPosition: function () {
    this.data.listData = util.cloneObject(this.data.originListData)
  },
  selectPosition: function (position) {
    this.selectRow(position)
    this.selectColumn(position)
    this.selectSquared(position)
    this.setData({
      listData: this.data.listData,
      lastClick: position,
    })
  },
  selectSquared: function (position) {
    var positionColumn = parseInt(position[0] / 3)
    var positionRow = parseInt(position[1] / 3)
    for (var x = positionRow * 3; x < positionRow * 3 + 3; x++) {
      for (var y = positionColumn * 3; y < positionColumn * 3 + 3; y++) {
        this.data.listData[x].items[y].color = "cadetblue"
      }
    }
  },
  selectColumn: function (position) {
    for (var index = 0; index < 9; index++) {
      this.data.listData[index].items[position[0]].color = "cadetblue"
    }
  },
  selectRow: function (position) {
    for (var index = 0; index < 9; index++) {
      this.data.listData[position[1]].items[index].color = "cadetblue"
    }
  },

  test: function () {
    this.data.listData = util.cloneObject(this.data.originListData)
    var isChanged = false
    var that = this
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        var position = new Array()
        position.push(i)
        position.push(j)
        if (this.checkEditable(position)) {
          sudoku.uniqueCandidate(that.data.listData, position, (candidates) => {
            if (candidates == undefined || candidates.length == 0){
              console.log("ERROR")//TODO 
            }else if (candidates.length > 1){
              //TODO 与其他方法叠加
              that.data.listData[position[1]].items[position[0]].temp = candidates
            } else if (candidates.length == 1){
              that.setValue(position, candidates)
              that.data.isAdd = true
              isChanged = true
            }
          })
        }
      }
    }
    if (isChanged){
      this.setData({
        listData: this.data.listData,
        // positions: positionList,
        originListData: util.cloneObject(this.data.listData),
      })
    }
  },

  test2: function () {
    this.data.listData = util.cloneObject(this.data.originListData)
    this.findSquarePosition()
    // this.findLine()
  },

  findLine:function(){
    for (var i = 0; i < 9; i++) {
      var arr = new Array()
      for (var j = 0; j < 9; j++) {
        var position = new Array()
        position.push(i)
        position.push(j)
        if (this.checkEditable(position)) {
          arr.push(this.data.listData[i].items[j])
        }
      }
      this.connectFindUnique(arr)
    }

    for (var i = 0; i < 9; i++) {
      var arr = new Array()
      for (var j = 0; j < 9; j++) {
        var position = new Array()
        position.push(i)
        position.push(j)
        if (this.checkEditable(position)) {
          arr.push(this.data.listData[j].items[i])
        }
      }
      this.connectFindUnique(arr)
    }
  },

  findSquarePosition: function () {
    for (var squareX = 0; squareX < 3; squareX++) {
      for (var squareY = 0; squareY < 3; squareY++) {
        var arr = new Array()
        arr.push(squareY)
        arr.push(squareX)
        var tempNumbers = this.findSquareAll(arr)
        this.connectFindUnique(tempNumbers)
      }
    }

  },

  findSquareAll: function (position) {
    var positionColumn = position[0]
    var positionRow = position[1]
    var tempNumbers = new Array()
    for (var x = positionRow * 3; x < positionRow * 3 + 3; x++) {
      for (var y = positionColumn * 3; y < positionColumn * 3 + 3; y++) {
        if (this.data.listData[x].items[y].editable) {
          tempNumbers.push(this.data.listData[x].items[y])
        }
      }
    }

    return tempNumbers
  },

  connectFindUnique: function (tempNumbers) {
    var tempArr = new Array()
    for (var i = 0; i < tempNumbers.length; i++) {
      tempArr = tempArr.concat(tempNumbers[i].temp)
    }
    var uniqueArr = sudoku.findUnique(tempArr)
    if (uniqueArr.length > 0) {
      for (var i = 0; i < uniqueArr.length; i++) {
        for (var j = 0; j < tempNumbers.length; j++) {
          if (util.indexOf(tempNumbers[j].temp, uniqueArr[i]) != -1) {
            var position = tempNumbers[j].position.split("")
            this.setValue(position, uniqueArr[i])
          }
        }
      }

      this.setData({
        listData: this.data.listData,
        originListData: util.cloneObject(this.data.listData),
        isAdd: true
      })
    }
  },

  setValue: function (position, value) {
    if (this.checkEditable(position)) {
      this.data.listData[position[1]].items[position[0]].editable = false
      this.data.listData[position[1]].items[position[0]].number = value
      this.data.listData[position[1]].items[position[0]].temp = undefined
      this.data.originListData[position[1]].items[position[0]].editable = false
      this.data.originListData[position[1]].items[position[0]].number = value
      this.data.originListData[position[1]].items[position[0]].temp = undefined
    } else {
      console.log("ERROR 0011 数独错误")
    }
  },

  test3: function () {
    this.findSquarePositionS()

    for (var i = 0; i < 9; i++) {
      var arr = new Array()
      for (var j = 0; j < 9; j++) {
        var position = new Array()
        position.push(i)
        position.push(j)
        if (this.checkEditable(position)) {
          arr.push(this.data.listData[i].items[j])
        }
      }
      this.findGroup(arr)
    }

    for (var i = 0; i < 9; i++) {
      var arr = new Array()
      for (var j = 0; j < 9; j++) {
        var position = new Array()
        position.push(i)
        position.push(j)
        if (this.checkEditable(position)) {
          arr.push(this.data.listData[j].items[i])
        }
      }
      this.findGroup(arr)
    }
  },

  findSquarePositionS: function () {
    for (var squareX = 0; squareX < 3; squareX++) {
      for (var squareY = 0; squareY < 3; squareY++) {
        var arr = new Array()
        arr.push(squareY)
        arr.push(squareX)
        var tempNumbers = this.findSquareAll(arr)
        this.findGroup(tempNumbers)
      }
    }

  },

  findGroup: function (tempNumbers) {
    for (var i = 0; i < tempNumbers.length;i++){
      if (tempNumbers[i].temp == undefined){
        continue
      }
      if (tempNumbers[i].temp.length > tempNumbers.length){
        continue
      }else{
        var times = sudoku.compareAll(tempNumbers, tempNumbers[i].temp)
        if (tempNumbers[i].temp.length == times){
          this.removeAllSame(tempNumbers, tempNumbers[i].temp)
        } else if (tempNumbers[i].temp.length < times){
          console.log("ERROR 0012 数独错误")
        } else {
          //TODO Nothing
        }
      }
    }
  },

  removeAllSame: function (tempNumbers, temp){
    for (var i = 0; i < tempNumbers.length; i++) {
      if (tempNumbers[i].temp == undefined){
        continue
      }
      if (!util.isContains(temp.toString(), tempNumbers[i].temp.toString())) {
        for (var j = 0; j < temp.length; j++) {
          util.remove(tempNumbers[i].temp, temp[j])
        }
        var position = tempNumbers[i].position.split("")
        if (tempNumbers[i].temp.length == 1){
          this.setValue(position, tempNumbers[i].temp[0])
          this.setData({
            listData: this.data.listData,
            originListData: util.cloneObject(this.data.listData),
            isAdd: true
          })
        }else{
          this.setTemp(position, tempNumbers[i].temp)
        }
      }
    }
  },

  setTemp: function (position, value) {
    if (this.checkEditable(position)) {
      this.data.listData[position[1]].items[position[0]].temp = value
    } else {
      console.log("ERROR 1111 数独错误")
    }
  },

  test4: function (){
    do{
      this.data.isAdd = false
      this.test()
      // this.test2()
      this.test3()
      // this.test5()
    } while (this.data.isAdd)
    console.log("完成")
  },

  test5: function (){
    this.findSquarePositionX()
  },

  findSquarePositionX: function () {
    for (var squareX = 0; squareX < 3; squareX++) {
      for (var squareY = 0; squareY < 3; squareY++) {
        var arr = new Array()
        arr.push(squareY)
        arr.push(squareX)
        var tempNumbers = this.findSquareAll(arr)
        this.findSpecialLine(tempNumbers)
      }
    }

  },

  findSpecialLine: function (tempNumbers){
    var tempArr = new Array()
    for (var i = 0; i < tempNumbers.length; i++) {
      tempArr = tempArr.concat(tempNumbers[i].temp)
    }
    tempArr = sudoku.saveOnlyOne(tempArr)
    util.remove(tempArr, temp)
    while(tempArr.length > 0){
      var temp = tempArr.pop()
      var arr = new Array()
      for (var i = 0; i < tempNumbers.length; i++){
        if (util.isContains(tempNumbers[i].temp, temp)){
          arr.push(tempNumbers[i])
        }
      }
      if (arr.length > 3){
        continue
      }else{
        var x = new Array()
        var y = new Array()
        for (var i = 0; i < arr.length; i++) {
          var position = arr[i].position.split("")
          x.push(position[1])
          y.push(position[0])
        }
        if (sudoku.isSpecial(x)){
          this.getRidOfX(temp, x[0], y)
        } else if (sudoku.isSpecial(y)){
          this.getRidOfY(temp, y[0], x)
        }
      }
    }
  },

  getRidOfX: function (temp, row, y){
    for (var i = 0; i < 9; i++) {
      if (util.indexOf(y, i) == -1){
        if (this.data.listData[row].items[i].editable){
          util.remove(this.data.listData[row].items[i].temp, temp)
          this.setData({
            listData: this.data.listData,

          })
        }
      }
    }
  },

  getRidOfY: function (temp, column, x){
    for (var i = 0; i < 9; i++) {
      if (util.indexOf(x, i) == -1) {
        if (this.data.listData[column].items[i].editable) {
          util.remove(this.data.listData[i].items[column].temp, temp)
          this.setData({
            listData: this.data.listData,

          })
        }
      }
    }
  },
  click1: function(event){
    if (this.data.lastClick == undefined){
      return
    }
    
    if (this.checkEditable(this.data.lastClick)){
      this.setValue(this.data.lastClick, event.currentTarget.dataset.hi)
      this.setData({
        listData: this.data.listData,
      })
    }
  }


})