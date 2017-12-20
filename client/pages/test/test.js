var util = require('../../utils/util.js')
var sudoku = require('../../utils/sudoku.js')

Page({

  data: {
    listData: {},
    lastClick: undefined,
    originListData: {},
    ALL_NUMBER: [1, 2, 3, 4, 5, 6, 7, 8, 9,],
    positions: {}
  },

  onLoad: function () {
    // var datas = "200673040\n050020003\n000000009\n000000004\n000058001\n000017002\n000500428\n800000906\n600000007"
    var datas = "020006005\n000307000\n005000009\n500100080\n104000903\n070004002\n800000700\n000703000\n300400050"
    var convertData = this.convertListData(datas)
    this.setData({
      listData: convertData,
      originListData: new Object(convertData)
    })
  },

  //构造闭包
  convertListData: function (data) {
    var dataList = new Array()
    var dataLines = data.split("\n")
    for (var line in dataLines) {
      var lineItems = new Array()
      var dataLineSplit = dataLines[line].split("")
      for (var lineItem in dataLineSplit) {
        var item = new Object()
        if (dataLineSplit[lineItem] != 0) {
          item.number = dataLineSplit[lineItem]
          item.editable = false
        } else {
          item.editable = true
        }
        if (this.checkEdgeSquared(lineItem, line)) {
          item.color = "burlywood"
        } else {
          item.color = "bisque"
        }
        item.position = lineItem + "" + line
        lineItems.push(item)
      }
      var items = new Object()
      items.items = lineItems
      dataList.push(items)
    }
    return dataList
  },

  checkEdgeSquared: function (x, y) {
    if ((x > 2 && x < 6) && (y <= 2)) {
      return true
    }

    if ((x >= 6) && (y > 2 && y < 6)) {
      return true
    }

    if ((x <= 2) && (y > 2 && y < 6)) {
      return true
    }

    if ((x > 2 && x < 6) && (y >= 6)) {
      return true
    }
    return false
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
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        var position = new Array()
        position.push(i)
        position.push(j)
        if (this.checkEditable(position)) {
          this.nineNumberUnique(position)
        }
      }
    }

  },

  nineNumberUnique: function (position) {
    var AllNumber = util.cloneObject(this.data.ALL_NUMBER)

    for (var index = 0; index < 9; index++) {
      util.remove(AllNumber, this.data.listData[index].items[position[0]].number)
    }

    for (var index = 0; index < 9; index++) {
      util.remove(AllNumber, this.data.listData[position[1]].items[index].number)
    }
    var positionColumn = parseInt(position[0] / 3)
    var positionRow = parseInt(position[1] / 3)
    for (var x = positionRow * 3; x < positionRow * 3 + 3; x++) {
      for (var y = positionColumn * 3; y < positionColumn * 3 + 3; y++) {
        util.remove(AllNumber, this.data.listData[x].items[y].number)
      }
    }
    var positionList = new Array()
    if (AllNumber.length == 1) {
      this.data.listData[position[1]].items[position[0]].editable = false
      this.data.listData[position[1]].items[position[0]].number = AllNumber
    } else {
      positionList.push(position)
      this.data.listData[position[1]].items[position[0]].temp = AllNumber
      console.log(this.data.listData[position[1]].items[position[0]])
    }

    this.setData({
      listData: this.data.listData,
      positions: positionList,
      originListData: util.cloneObject(this.data.listData)
    })
  },

  test2: function () {
    // var AllNumber = util.cloneObject(this.data.ALL_NUMBER)
    // AllNumber.push(1)
    // AllNumber = AllNumber.concat(this.data.ALL_NUMBER)
    // console.log(AllNumber)
    // console.log(sudoku.findUnique(AllNumber))

    this.data.listData = util.cloneObject(this.data.originListData)
    this.findSquarePosition()
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
        originListData: util.cloneObject(this.data.listData)
      })
    }
  },

  setValue: function (position, value) {
    if (this.checkEditable(position)) {
      this.data.listData[position[1]].items[position[0]].editable = false
      this.data.listData[position[1]].items[position[0]].number = value
      this.data.listData[position[1]].items[position[0]].temp = undefined
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
      if (tempNumbers[i].temp.length > tempNumbers.length){
        continue
      }else{
        var times = this.compareAll(tempNumbers, tempNumbers[i].temp)
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

  compareAll: function (tempNumbers, temp){
    var times = 0; 
    for (var i = 0; i < tempNumbers.length; i++) {
      if (this.isContains(temp.toString(), tempNumbers[i].temp.toString())) {
        times++
      }
    }
    return times
  },

  removeAllSame: function (tempNumbers, temp){
    for (var i = 0; i < tempNumbers.length; i++) {
      if (!this.isContains(temp.toString(), tempNumbers[i].temp.toString())) {
        for (var j = 0; j < temp.length; j++) {
          util.remove(tempNumbers[i].temp, temp[j])
        }
        var position = tempNumbers[i].position.split("")
        this.setTemp(position, tempNumbers[i].temp)
        console.log(position)
      }
    }
  },

  isContains:function(str, substr) {
    console.log(str)
    console.log(substr)
    console.log(str.indexOf(substr) >= 0)
    return str.indexOf(substr) >= 0
  },

  setTemp: function (position, value) {
    if (this.checkEditable(position)) {
      this.data.listData[position[1]].items[position[0]].temp = value
    } else {
      console.log("ERROR 1111 数独错误")
    }
  },



})