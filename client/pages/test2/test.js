var util = require('../../utils/util.js')

Page({

  data: {
    listData: {},
    lastClick:undefined,
    originListData: {},
  },

  onLoad: function () {
    var datas = "200673045\n050020003\n000000009\n000000004\n000058001\n000017002\n000500428\n800000906\n600000007"
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
    for (var line in dataLines){
      var lineItems = new Array()
      var dataLineSplit = dataLines[line].split("")
      for (var lineItem in dataLineSplit){
        var item = new Object()
        if (dataLineSplit[lineItem] != 0){
          item.number = dataLineSplit[lineItem]
          item.editable = false
        }else{
          item.editable = true
        }
        if (this.checkEdgeSquared(lineItem, line)){
          item.color = "burlywood"
        }else{
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

  checkEdgeSquared: function (x, y){
    if ((x > 2 && x < 6)&&(y <= 2)){
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

    this.selectPosition(position)
  },

  checkEditable:function (position){
    return this.data.listData[position[1]].items[position[0]].editable
  },
  resumeLastClickPosition: function(){
    if (this.data.lastClick != undefined) {
      
      // this.setData({
      //   listData: new Object(this.data.originListData)
      // })
    }
    // this.data.listData = new Object(this.data.originListData)
    this.data.listData = util.cloneObject(this.data.originListData)
    console.log(this.data.listData)
    console.log(this.data.originListData)
  },
  selectPosition: function(position){
    this.selectRow(position)
    this.selectColumn(position)
    this.selectSquared(position)
    this.setData({
      listData: this.data.listData
    })
  },
  selectSquared: function(position){
    var tempData = this.data.listData
    var positionColumn = parseInt(position[0]/3)
    var positionRow = parseInt(position[1]/3)
    for (var x = positionRow * 3; x < positionRow * 3 + 3; x++){
      for (var y = positionColumn * 3; y < positionColumn * 3 + 3; y++) {
        this.data.listData[x].items[y].color = "cadetblue"
      }
    }
  },
  selectColumn: function (position){
    for (var index = 0; index < 9; index++){
      this.data.listData[index].items[position[0]].color = "cadetblue"
    }
  },
  selectRow: function (position){
    var tempData = this.data.listData
    for (var index = 0; index < 9; index++) {
      this.data.listData[position[1]].items[index].color = "cadetblue"
    }
  },
})