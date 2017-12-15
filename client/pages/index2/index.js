// pages/index2/index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    logged: false,
  },

  onReady: function () {
    this.userLogin()
  },

  onSuccessLogin: function (result) {
    util.showSuccess('登录成功')
    this.setData({
      userInfo: result,
      logged: true
    })
    setTimeout(function(){
      wx.redirectTo({
        url: '../index/index'
      })
    }, 1000)
    
  },

  userLogin: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          that.onSuccessLogin(result)
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              that.onSuccessLogin(result.data.data)
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        wx.hideToast()
        wx.showModal({
          title: '警告',
          content: '若不授权微信登录，则无法使用Sudoku数独功能，点击重新获取授权，则可重新使用',
          confirmText: '授权',
          cancelText: '不授权',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  if (res.authSetting["scope.userInfo"]) {
                    wx.showToast({
                      title: '登录失败',
                    })
                  } else {
                    that.userLogin()
                  }
                }
              })
            } else if (res.cancel) {
              wx.showToast({
                title: '登录失败',
              })
            }
          }
        })    
      }
    })
  },
})