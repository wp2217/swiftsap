//index.js
//获取应用实例
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
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
  onLoad: function (options) {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: config.service.categoryUrl,
      method: 'GET',
      data: {
        userid: '2',
        inout: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        console.log(res.data);
        that.setData({ cates: res.data.data });
      },
      fail: function (res) {
        wx.hideNavigationBarLoading()
        console.log(res.data);
        util.showModel("请求失败", res.data);
      },
      complete: function (res) {
        wx.hideNavigationBarLoading()
        // complete
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  goToItem: function (e) {
    // console.log(e);
    wx.redirectTo({
      url: '../item/item'
    });

    wx.request({
      url: config.service.categoryUrl,
      data: {
        wxid: 'tianya_1235'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        //util.showSuccess("请求成功");
        util.showModel("请求OK", res.data);
      },
      fail: function (res) {
        console.log(res.data);
        util.showModel("请求失败", res.data);
      },
    })
  }
})

