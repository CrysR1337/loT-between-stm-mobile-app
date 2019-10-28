// pages/login/login.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginName: undefined,
    password: undefined
  },
  goregist: function (e) {
    wx.redirectTo({
      url: '/pages/regist/regist',
    })
  },
  getLoginName: function (e) {
    console.log(e.detail.value)
    this.setData({
      loginName: e.detail.value
    })
    //console.log(this.data.loginName)
  },
  getPassword: function (e) {
    console.log(e.detail.value)
    this.setData({
      password: e.detail.value
    })
  },
  login: function (e) {
    if (this.data.loginName && this.data.password) {
      console.log(this.data.loginName);
        let that = this;
        //登陆获取用户信息
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('logindata').where({
        _openid: this.data.openid
      }).get({
          success: (res) => {
            let user = res.data;
            console.log(res.data);
            console.log(this.data.loginName);
            for (let i = 0; i < user.length; i++) {  //遍历数据库对象集合
              if (this.data.loginName === user[i].stuid) { //用户名存在
                if (this.data.password !== user[i].password) {  //判断密码是否正确
                  wx.showToast({
                    title: '密码错误！！',
                    icon: 'success',
                    duration: 2500
                  })
                } else {
                  console.log('登陆成功！')
                  wx.showToast({
                    title: '登陆成功！！',
                    icon: 'success',
                    duration: 2500
                  })
                  var pages = getCurrentPages();
                  var prepages = pages[pages.length - 2];
                  prepages.setData({
                    stulock: 1,
                    counterId: user[i]._id
                  })
                  wx.setStorage({
                    key: 'userInfo',
                    data: {
                      bType: "warn",
                      actionText: "退出登录",
                      counterId: user[i]._id
                    },
                    success: function (res) {
                      console.log("存储成功")
                    }
                  })
                  wx.switchTab({
                    url: '../userConsole/userConsole'
                  })
                  break;
                }
              } else {   //不存在
                console.log('3');
                wx.showToast({
                  title: '无此用户名！！',
                  icon: 'success',
                  duration: 2500
                })
              }
            }
          }
        })
      

      // wx.request({   
      //   url: app.addressUrl + '/login?loginName=' + this.data.loginName + "&password=" + this.data.password,
      //   method: 'POST',
      //   success: function (res) {
      //     var result = res.data.resultObj;
      //     console.log(res.data);
      //     //result=1表示登录成功
      //     if (result == 1) {
      //       //存储用户名
      //       wx.redirectTo({
      //         url: '/pages/index/index',
      //       })
      //       wx.set
      //     } else {
      //       wx.showModal({
      //         title: '温馨提示',
      //         content: '用户名密码错误',
      //         showCancel: false,
      //         success: function (res) {

      //         }
      //       })
      //     }
      //     console.log('submit success');
      //   },
      //   fail: function (res) {
      //     wx.showToast({
      //       title: '您的网络开小差啦~~~',
      //       icon: "none"
      //     })
      //   },
      //   complete: function (res) {
      //     console.log('submit complete');
      //   }
      // })
    } else {
      wx.showToast({
        title: '请将信息填写完整后提交',
        icon: "none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userName = wx.getStorageSync('userName');
    var userPassword = wx.getStorageSync('userPassword');

    console.log(userName);
    console.log(userPassword);
    if (userName) {
      this.setData({ userName: userName });
    }
    if (userPassword) {
      this.setData({ userPassword: userPassword });
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