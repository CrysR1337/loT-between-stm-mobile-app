// miniprogram/pages/billing.js
Page({
  data: {
    hours: 0,
    minuters: 0,
    seconds: 0,
    billing: "正在计时"
  },
  // 页面加载
  onLoad: function (options) {
    // 获取扫码成功页传过来的车牌号，再定义一个定时器
    this.setData({
      number: options.number,
      timer: this.timer
    })
    // 初始化计时器
    let s = 0;
    let m = 0;
    let h = 0;
    // 计时开始
    this.timer = setInterval(() => {
      this.setData({
        seconds: s++
      })
      if (s == 60) {
        s = 0;
        m++;
        setTimeout(() => {
          this.setData({
            minuters: m
          });
        }, 1000)
        if (m == 60) {
          m = 0;
          h++
          setTimeout(() => {
            this.setData({
              hours: h
            });
          }, 1000)
        }
      };
    }, 1000)
  },
  // 结束骑行，清除定时器
  endRide: function () {
    clearInterval(this.timer);
    this.timer = "";
    this.setData({
      billing: "共享雨伞一共保护您：",
      disabled: true
    })
  },
  // 携带定时器状态回到地图
  moveToIndex: function () {
    // 如果定时器为空
    if (this.timer == "") {
      // 关闭计费页跳到地图
      wx.switchTab({
        url: '../map/map'
      })
      // 保留计费页跳到地图，带上计时器状态
    } else {
      wx.switchTab({
        url: '../map/map?timer=' + this.timer
      })
    }
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

  }
})