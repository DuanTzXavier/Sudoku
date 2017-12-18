Page({
  data: {
    listData: [
      { "code": "1", "text": "1", "type": "01" },
      { "code": "2", "text": "1", "type": "01" },
      { "code": "03", "text": "01", "type": "01" },
      { "code": "04", "text": "01", "type": "01" },
      { "code": "05", "text": "01", "type": "01" },
      { "code": "06", "text": "01", "type": "01" },
      { "code": "07", "text": "01", "type": "01" },
      { "code": "07", "text": "01", "type": "01" },
      { "code": "07", "text": "01", "type": "01" }
    ]
  },
  onLoad: function () {
    console.log('onLoad')
  },

  click: function(event) {
    console.log('onLoad')
    console.log(event)
  }

})