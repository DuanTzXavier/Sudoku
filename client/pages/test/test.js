Page({
  data: {
    listData: [
      { "code": "1", "text": "1", "type": "01" },
      { "code": "2", "text": "1", "type": "01" },
      { "code": "", "text": "01", "type": "01" },
      { "code": "04", "text": "01", "type": "01" },
      { "code": "05", "text": "01", "type": "01" },
      { "code": "06", "text": "01", "type": "01" },
      { "code": "07", "text": "01", "type": "01" },
      { "code": "07", "text": "01", "type": "01" },
      { "code": "07", "text": "01", "type": "01" }
    ],
    viewBg: 'bisque'
  },
  onLoad: function () {
    console.log('onLoad')
  },

  click: function(event) {
    console.log('onLoad')
    console.log(event)
    if (event.target.dataset.hi != null){
      wx.showToast({
        title: event.target.dataset.hi,
      })
    }else{
      wx.showToast({
        title: "null",
      })
    }
    
  }

})