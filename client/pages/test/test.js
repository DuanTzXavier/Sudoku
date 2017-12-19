var util = require('../../utils/util.js')

Page({

  data: {
    listData: {},
    lastClick: undefined,
    originListData: {},
    ALL_NUMBER:[1,2,3,4,5,6,7,8,9,],
    positions:{}
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
      listData: this.data.listData
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
      lastClick:position
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

  test: function(){
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
          var position = new Array()
          position.push(i)
          position.push(j)
          if (this.checkEditable(position)){
            this.nineNumberUnique(position)
          }
      }
    }
    
  },

  nineNumberUnique: function(position){
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
    if (AllNumber.length == 1){
      this.data.listData[position[1]].items[position[0]].editable = false
    }else{
      positionList.push(position)
    }
    this.data.listData[position[1]].items[position[0]].number = AllNumber
    console.log(AllNumber)
    this.setData({
      listData: this.data.listData,
      positions:positionList,
    })
  },

  test2: function () {
    // for (var i = 0; i < 9; i++) {
    //   for (var j = 0; j < 9; j++) {
    //     var position = new Array()
    //     position.push(i)
    //     position.push(j)
    //     if (this.checkEditable(position)) {
    //       this.nineNumberUnique(position)
    //     }
    //   }
    // }

    var AllNumber = util.cloneObject(this.data.ALL_NUMBER)
    AllNumber.push(1)
    console.log(this.removeSameNumber(AllNumber))

   
    // for (var index in positions){
      
    // }

  },

  removeSameNumber: function (AllNumber){
    for (var index in AllNumber){
      var x = this.isShowMore(AllNumber[index], AllNumber)
      if (x > 1){
        util.removeAll(AllNumber, AllNumber[index])
      }
    }
    return AllNumber
  },

  isShowMore: function(value, AllNumber){
    var x = 0
    for (var index in AllNumber) {
      if (AllNumber[index] == value) {
        x++
      }
    }
    return x
  },



})