// pages/me/me.js
Page({
  data: {
    time: 9 // 默认计时时长，这里设短一点，用于调试，ofo app是90s
  },
  // 页面加载
  onLoad: function (options) {
    // 获取密码
    this.setData({
      password: options.password
    })
    // 设置初始计时秒数
    let time = 9;
    // 开始定时器
    this.timer = setInterval(() => {
      this.setData({
        time: --time // 倒计时
      });
      // 读完秒后携带单车号码跳转到计费页
      if (time = 0) {
        clearInterval(this.timer)
        wx.redirectTo({
          url: '../billing/index?number=' + options.number
        })
      }
    }, 1000)
  },
  // 点击去首页报障
  moveToWarn: function () {
    // 清除定时器
    clearInterval(this.timer)
    wx.redirectTo({
      url: '../index/index'
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

  }
})