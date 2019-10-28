// pages/my/index.js
const app = getApp()
Page({
  data: {
    // 用户信息
    hasUserInfo: false,
    userInfo: {
      avatarUrl: "",
      nickName: "未登录"
    },
    bType: "primary", // 按钮类型
    actionText: "登录", // 按钮文字提示
    lock: false, //登录按钮状态，false表示未登录
    stulock: false,
    counterId:undefined
  },
  // 页面加载
  onLoad: function () {
    // 设置本页导航标题
    wx.setNavigationBarTitle({
      title: '个人界面'
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    // 获取本地数据-用户信息
    wx.getStorage({
      key: 'userInfo',
      // 能获取到则显示用户信息，并保持登录状态，不能就什么也不做
      success: (res) => {
        wx.hideLoading();
        this.setData({
          userInfo: {
            avatarUrl: res.data.userInfo.avatarUrl,
            nickName: res.data.userInfo.nickName
          },
          bType: res.data.bType,
          actionText: res.data.actionText,
          lock: true,
          counterId:res.data.counterId
        })
      }
    });
  },
  // 登录或退出登录按钮点击事件
  bindAction: function () {
    this.data.lock = !this.data.lock
    // 如果没有登录，登录按钮操作
    if (this.data.lock) {
      wx.showLoading({
        title: "正在登录"
      });
      //console.log('1234');
      wx.login({
        success: (res) => {
          wx.hideLoading();
          wx.getUserInfo({
            withCredentials: false,
            success: (res) => {
              this.setData({
                userInfo: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName
                },
                bType: "warn",
                actionText: "退出登陆"
              });
              console.log('1234');
              console.log(this.data.userInfo.nickName);
              // 存储用户信息到本地
              wx.setStorage({
                key: 'userInfo',
                data: {
                  userInfo: {
                    avatarUrl: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName
                  },
                  bType: "primary",
                  actionText: "未登录成功，重新登陆"
                },
                success: function (res) {
                  console.log("存储成功")
                }
              })
            }
          })
        }
      })
      wx.navigateTo({
        url: '/pages/regist/regist',
      })
      if(this.data.stulock!=0){
        wx.setStorage({
          key: 'userInfo',
          data: {
            userInfo: {
              avatarUrl: this.data.userInfo.avatarUrl,
              nickName: this.data.userInfo.nickName
            },
            bType: "warn",
            actionText: "退出登录",
            counterId:this.data.counterId
          },
          success: function (res) {
            console.log("存储成功")
          }
        });
        this.setData({
          userInfo: {
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName
          },
          bType: "warn",
          actionText: "退出登录",
          lock:true,
          counterId: this.data.counterId
        })
      }
      // 如果已经登录，退出登录按钮操作     
    } else {
      wx.showModal({
        title: "确认退出?",
        content: "退出后将不能使用ofo",
        success: (res) => {
          if (res.confirm) {
            console.log("确定")
            // 退出登录则移除本地用户信息
            wx.removeStorageSync('userInfo')
            this.setData({
              userInfo: {
                avatarUrl: "",
                nickName: "未登录"
              },
              bType: "primary",
              actionText: "登录",
              counterId:"",
              lock:false,
              stulock:0
            })
          } else {
            console.log("cancel")
            this.setData({
              lock: true
            })
          }
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 跳转至钱包
  movetoWallet: function () {
    wx.navigateTo({
      url: '../wallet/index'
    })
  }
})