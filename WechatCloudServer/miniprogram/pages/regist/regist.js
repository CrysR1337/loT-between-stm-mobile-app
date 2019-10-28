// pages/regist/regist.js
const app = getApp();
Page({
  data: {
    userInfo: {
      avatarUrl: "",
      nickName: "未登录"
    },
    counterId:undefined,
     stuName:undefined,
     stuid:undefined,
     email:undefined,
     tel:undefined,
     password:undefined,
     ensurepassword:undefined,
     passwordFlag:undefined,
     //标示用户名是否可用，1为可用，0为不可用
     telFlag:undefined,
     emailFlag:undefined,
     idFlag:undefined
  },
  regist:function(){ 
    if (this.data.stuName && this.data.stuid && this.data.tel && this.data.email && this.data.password && this.data.ensurepassword){
       if(!this.data.idFlag){
          wx.showToast({
            title: '用户名已经被占用，请修改',
            icon:"none"
          })  
       }else if(!this.data.passwordFlag){
         wx.showToast({
           title: '两次密码不一致',
           icon:"none"
         }) 
       } else if (!this.data.telFlag) {
         wx.showToast({
           title: '电话格式错误',
           icon: "none"
         })
       }
    else{
         wx.getStorage({
           key: 'userInfo',
           // 能获取到则显示用户信息，并保持登录状态，不能就什么也不做
           success: (res) => {
             wx.hideLoading();
             this.setData({
               userInfo: {
                 avatarUrl: res.data.userInfo.avatarUrl,
                 nickName: res.data.userInfo.nickName
               }
             })
           }
         });
           const db = wx.cloud.database()
           db.collection('logindata').add({
             data: {
               stuName: this.data.stuName,
               stuid:this.data.stuid,
               email: this.data.email,
               tel:this.data.tel,
               password: this.data.password,
               wechatnickName:this.data.userInfo.nickName
             },
             success: res => {
               // 在返回结果中会包含新创建的记录的 _id
               this.setData({
                 counterId: res._id,
               })
               console.log(this.data.stuName)
               wx.showToast({
                 title: '注册成功',
               })
               var pages=getCurrentPages();
               var prepages=pages[pages.length-2];
               prepages.setData({
                 stulock:1,
                 counterId:this.data.counterId
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
               wx.navigateBack();
        //       console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
             },
             fail: err => {
               wx.showToast({
                 icon: 'none',
                 title: '新增记录失败'
               })
        //       console.error('[数据库] [新增记录] 失败：', err)
             }
           })
       }
     }else{
       wx.showModal({
         title: '提示',
         content: '请将信息填写完整后提交',
         showCancel:false
       })
     }
  },
  goLogin:function(){
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },
  getstuName:function(e){
    if (e.detail.value) {
      this.setData({
        stuName:e.detail.value
      })
    }
    //console.log(this.data.userName);
  },   
  getpassword:function(e){
    if (e.detail.value) {
    this.setData({
      password :e.detail.value
    })
    }
  },
  getstuid:function(e){
    if(e.detail.value){
      this.setData({
        stuid:e.detail.value
      })
      var currentFlag= 1;
      var that = this;
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('logindata').where({
        _openid: this.data.openid
      }).get({
        success: (res) => {
          let user = res.data;
          for (let i = 0; i < user.length; i++) {  //遍历数据库对象集合
            console.log(i);
            if (this.data.stuid !== user[i].stuid) { //用户名不存在
              currentFlag = 1 ;
            that.setData({
              idFlag: currentFlag
            })
            } 
            else {   //存在
              currentFlag = 0;
              wx.showToast({
              title: '该用户名已经被占用',
              icon:"none",
            })
              that.setData({
              idFlag: currentFlag
            })
            }
          }
        }
      })
      console.log(this.data.idFlag);
      //var that = this;
      // wx.request({
      //   url: app.addressUrl+'/getUserByLoginName?loginName='+this.data.loginName,
      //  header:{
      //    'content-type':'application/json'
      //  },
      //  success:function(res){
      //    if(res.data.resultObj==1){
      //      //用户名可用
      //      currentFlag = 1
      //      that.setData({
      //        flag: currentFlag
      //      })
      //    }else{
      //      //用户名非法（已经在数据库中存在）
      //      currentFlag = 0
      //      wx.showToast({
      //        title: '该用户名已经被占用',
      //        icon:"none",
      //      })
      //      that.setData({
      //        flag: currentFlag
      //      })
      //    }
      //  } 
      // }) 
    }else{
      this.setData({
        loginName: undefined
      })
    }
  },
  getEmail:function(e){
    if (e.detail.value) {
      this.setData({
        email:e.detail.value
      })
    }
  },
  gettel: function (e) {
    if (e.detail.value) {
      this.setData({
        tel: e.detail.value
      })
      var currentFlag = 1;
      var that=this;
      if (e.detail.value.length != 11) {
        currentFlag = 0;
        that.setData({
          telFlag: currentFlag
        })
        wx.showToast({
          title: '电话号码格式错误',
          icon: "none",
        })
      } else {   //不存在
        currentFlag = 1;
        that.setData({
          telFlag: currentFlag
        })
      }
    }
    
  },
  getEnsurePassword:function(e){
    if (e.detail.value) {
      this.setData({
        ensurepassword:e.detail.value
      })
      var currentFlag = 1
      var that = this;
      if (this.data.ensurepassword != this.data.password){
          wx.showToast({
            title: '两次密码不一致',
            icon:"none"
          })
          currentFlag = 0
          that.setData({
            passwordFlag:0
          })
      }else{
        that.setData({
          passwordFlag: 1
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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