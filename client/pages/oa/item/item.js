// pages/item/item.js
var config = require('../../../config');
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: '',
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ category: options.cate });

    var that = this;
    wx.request({
      url: config.service.itemUrl,
      data: {
        iduser: '1',
        inout: '1',
        category: that.options.cate
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        if (!res.data.data) {
          util.showModel("提示",'无数据，请重试！');
        } else {
          that.setData({ items: res.data.data });
        }
      },
      fail: function (res) {
        wx.hideNavigationBarLoading()
        util.showModel("失败提示", res);
      },
      complete: function (res) {
        wx.hideNavigationBarLoading()
      }
    })

    // var data = {
    //   items: [{
    //     dateWeek: {date: '20180922', week: '周一'},
    //     records: [
    //       {
    //         name: 'Roc Wang',
    //         time: '18:09:35',
    //         subcategory: 'E-invoice',
    //         subject: '请审批Request INV8999',
    //         requestid: 'INV8999'
    //       },
    //       {
    //         name: 'Roc Wang',
    //         time: '18:19:35',
    //         subcategory: 'E-invoice',
    //         subject: '请审批Request INV9000',
    //         requestid: 'INV9000'

    //       }]
    //   },
    //   {
    //     dateWeek: {date: '20180923', week: '周二'},
    //     records: [
    //       {
    //         name: '李磊',
    //         time: '18:09:35',
    //         subcategory: 'E-invoice',
    //         subject: '请审批Request INV6666',
    //         requestid: 'INV6666'
    //       },
    //       {
    //         name: 'Roc Wang',
    //         time: '18:09:35',
    //         subcategory: 'E-invoice',
    //         subject: '请审批Request INV8999',
    //         requestid: 'INV8999'
    //       },
    //       {
    //         name: 'Roc Wang',
    //         time: '18:19:35',
    //         subcategory: 'E-invoice',
    //         subject: '请审批Request INV9000',
    //         requestid: 'INV9000'

    //       }]
    //   }

    // ]
    // }

    // this.setData({ data: data });

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

  goToDetail: function (e) {
    wx.showNavigationBarLoading();
    wx.navigateTo({
      url: '../detail/detail',
    });

    wx.request({
      url: config.service.requestfromsapUrl,
      method: 'GET',
      data: {
        wxid: 'tianya_1235',
        json: {
          name: 'roc',
          tel: '13764089092'
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        console.log(res.data);
        that.setData({ subCates: res.data.data });
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

  }
})