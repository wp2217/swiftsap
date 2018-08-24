//index.js
//获取应用实例
var config = require('../../../config')
var util = require('../../../utils/util.js')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cates: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: config.service.categoryUrl,
      method: 'GET',
      data: {
        iduser: '1',
        inout: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.hideNavigationBarLoading()
        if (!res.data.data) {
          util.showModel("无数据，请重试！", res.data);
        } else {
          //处理记录少的情况占满页面
          const num = 10;
          let cates = new Array();

          cates = cates.concat(res.data.data);
          let length = cates.length;
          let count = num - length;
          do {
            cates.push({});
            count--;
          } while (count > 0);

          that.setData({
            cates: cates
          });
        }
      },
      fail: function(res) {
        wx.hideNavigationBarLoading()
        util.showModel("请求失败", res.data);
      },
      complete: function(res) {
        wx.hideNavigationBarLoading()
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  goToItem: function(e) {
    if (e.currentTarget.dataset.cate) {
      wx.navigateTo({
        url: '../item/item?cate=' + e.currentTarget.dataset.cate
      });
    }
  }
})