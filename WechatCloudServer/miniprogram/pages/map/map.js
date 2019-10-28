// pages/map/map.js
const app = getApp()
Page({
  data: {
    longitude: 116.4965075,
    latitude: 40.006103,
    speed: 0,
    accuracy: 0,
    scale: 18,
    logged: app.data.loginstatus
  },
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      // 点击立即用车，判断当前是否正在计费，此处只需要知道是调用扫码，后面会讲到this.timer是怎么来的
      case 2: if (this.timer === "" || this.timer === undefined) {
        // 没有在计费就扫码
        wx.scanCode({
          success: (res) => {
            // 正在获取密码通知
            wx.showLoading({
              title: '正在获取密码',
              mask: true // 显示蒙层
            })
            // 请求服务器获取密码和车号
            const db = wx.cloud.database()
            // 查询当前用户所有的 counters
            db.collection('umbcode').where({
              _openid: this.data.openid
            }).get({
              success: (res) => {
                // 请求密码成功隐藏等待框
                wx.hideLoading();
                // 携带密码和车号跳转到密码页
                wx.redirectTo({
                  url: '../unlock/unlock?password=' + res.data.data.password + '&number=' + res.data.data.number,
                  success: function (res) {
                    wx.showToast({
                      title: '获取密码成功',
                      duration: 1000
                    })
                  }
                })
                let user = res.data;
                console.log(res.data);
                console.log(this.loginName);
                for (let i = 0; i < user.length; i++) {  //遍历数据库对象集合
                  console.log(i);
                  console.log(loginName);
                  console.log('xxxx');
                  console.log(user[i].loginName);
                  if (loginName === user[i].loginName) { //用户名存在
                    console.log('2');
                    if (password !== user[i].password) {  //判断密码是否正确
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
                      wx.switchTab({   //跳转首页
                        url: '/pages/unlock/unlock',  //这里的URL是你登录完成后跳转的界面
                      })
                    }
                  } else {   //不存在
                    wx.showToast({
                      title: '无此用户名！！',
                      icon: 'success',
                      duration: 2500
                    })
                  }
                }
              }
            })
          }
        })
        // 当前已经在计费就回退到计费页
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
        break;
      // 点击保障控件，跳转到报障页
      case 3: wx.navigateTo({

        url: '../userConsole/userConsole'
      });
        break;
      default: break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timer = options.timer;
    var that = this
    wx.showLoading({
      title: "定位中",
      mask: true
    })
    wx.getLocation({
      type: 'gcj02',
      altitude: true,//高精度定位
      //定位成功，更新定位结果
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({
          longitude: longitude,
          latitude: latitude,
          speed: speed,
          accuracy: accuracy
        })
      },
      //定位失败回调
      fail: function () {
        wx.showToast({
          title: "定位失败",
          icon: "none"
        })
      },
      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/images/getlocation.png',
            position: {
              left: 20,
              top: res.windowHeight - 80,
              width: 50,
              height: 50
            },
            clickable: true
          },
          {
            id: 3,
            iconPath: '/images/user-unlogin.png',
            position: {
              left: res.windowWidth - 70,
              top: res.windowHeight - 80,
              width: 50,
              height: 50
            },
            clickable: true
          },
          {
            id: 2,
            iconPath: '/images/timg.jpg',

            position: {
              left: res.windowWidth / 2 - 45,
              top: res.windowHeight - 100,
              width: 90,
              height: 90
            },
            clickable: true
          }
          ]
        })
      },
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
    this.mapCtx = wx.createMapContext("maps");
    this.movetoPosition()
  },
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
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