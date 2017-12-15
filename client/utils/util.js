const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

var showAuthModel = function(callback) {
  wx.showModal({
    title: '警告',
    content: '若不授权微信登录，则无法使用Sudoku数独功能，点击重新获取授权，则可重新使用',
    confirmText: '授权',
    cancelText: '不授权',
    success: function (res) {
      if (res.confirm) {
        // (callback && typeof (callback) === "function") && callback();
      } else if (res.cancel) {
        wx.showToast({
          title: '登录失败',
        })
      }
    }
  })
}

module.exports = { formatTime, showBusy, showSuccess, showModel }
