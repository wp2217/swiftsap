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
  onLoad: function(options) {
    this.setData({
      category: options.cate
    });

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
      success: function(res) {
        wx.hideNavigationBarLoading()
        if (!res.data.data) {
          util.showModel("提示", '无数据，请重试！');
        } else {
          const num = 15;
          let count = 0;
          let result = new Array();

          result = result.concat(res.data.data);
          for (let idx in result) {
            count = count + result[idx].records.length;
            if (result[idx].week == 0) {
              result[idx].week = '星期日';
            } else if (result[idx].week == 1) {
              result[idx].week = '星期一';
            } else if (result[idx].week == 2) {
              result[idx].week = '星期二';
            } else if (result[idx].week == 3) {
              result[idx].week = '星期三';
            } else if (result[idx].week == 4) {
              result[idx].week = '星期四';
            } else if (result[idx].week == 5) {
              result[idx].week = '星期五';
            } else if (result[idx].week == 6) {
              result[idx].week = '星期六';
            } else {}
          }
          //处理记录少的情况占满页面
          count = num - count;
          do {
            result.push({
              display: 'hidden'
            });
            count--;
          } while (count > 0);
          //console.log(result);
          that.setData({
            items: result
          });
        }
      },
      fail: function(res) {
        wx.hideNavigationBarLoading()
        util.showModel("失败提示", res);
      },
      complete: function(res) {
        wx.hideNavigationBarLoading()
      }
    })

    // var data = {
    //   items: [{
    //     date: '20180922', 
    //     week: '周一',
    //     records: [
    //       {
    //         name: 'Roc Wang',
    //         time: '18:09:35',
    //         subcategory: 'E-invoice',
    //         subject: '请审批Request INV8999',
    //         requestid: 'INV8999'
    //         idrequest:
    //         idreqjson:
    //       },
    //       {
    //         name: 'Roc Wang',
    //         time: '18:19:35',
    //         subcategory: 'E-invoice',
    //         subject: '请审批Request INV9000',
    //         requestid: 'INV9000'

    //       }]
    // }

    // this.setData({ data: data });

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

  goToDetail: function(e) {
    if (e.currentTarget.dataset.idrequest) {
      wx.navigateTo({
        url: '../detail/detail?idrequest=' + e.currentTarget.dataset.idrequest +
          '&idreqjson=' + e.currentTarget.dataset.idreqjson
      });
    }
  }
})