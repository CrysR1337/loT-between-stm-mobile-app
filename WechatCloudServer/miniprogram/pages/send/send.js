//pages/send.js
import { getBLEName } from '../../utils/tools'
var app = getApp();
Page({
  data: {
    item: [
      { name: 'Hex收', value: 'Hex收', checked: 'flase' },
    ],
    items: [
      { name: 'Hex发', value: 'Hex发', checked: 'true' },
      { name: 'Hex连续发', value: '连续发', checked: 'flase' },
    ],
    radioItems: [
      { name: 'FFE1', value: 'FFE1', checked: 'true' },
      { name: 'FFE2', value: 'FFE2' },
    ],
    checkboxItems: [
      { name: '车辆1', value: 'car1', checked: 'true' },
      { name: '车辆2', value: 'car2' },
      { name: '车辆3', value: 'car3' },
      // { name: '车辆4', value: 'car4' },
    ],
    wcharffex: "FFE1",
    HEXRev: true,
    SendSet: "a",//是否HEX发
    ReplSet: "a", //是否重复发
    receivcedata: "",
    receivcedatacount: 0,
    senddata: "",
    senddatacount: 0,
    scene: "",  //存放扫码的MAC地址
    mac: "11",
    connectedDeviceId: "", //已连接设备uuid  
    services: "", // 连接设备的服务集合  
    serviceId: "", //可以操作的服务 0000FFE0-0000-1000-8000-00805F9B34FB
    characteristics: "",   // 连接设备的状态值  
    writeServicweId: "", // 可写服务uuid  
    writeCharacteristicsId: "",//可写特征值uuid  
    FFE2: "",
    readServicweId: "", // 可读服务uuid  
    readCharacteristicsId: "",//可读特征值uuid  
    notifyServicweId: "", //通知服务UUid  
    notifyCharacteristicsId: "", //通知特征值UUID 

    //发送数据
    package_head: "fffe",//包头
    package_type: "02",//包类型
    //package_length:"",//包体长度
    package_direct: "",//包体第一位，控制方向 01前进  02后退  03左转  04右转
    package_car: "",

  },
  revChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value.length > 0) {
      this.setData({ HEXRev: true })
    } else {
      this.setData({ HEXRev: false })
    }
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    console.log(this.data.items[0].checked);
    this.setData({ SendSet: e.detail.value })
  },

  replaceChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    console.log(this.data.items[1].checked);
    this.setData({ ReplSet: e.detail.value })
  },

  onLoad: function (option) {
    var that = this;
    this.setData({
      mac: option.mac,
    });
    wx.getSystemInfo({
      success: function (res) {
        //that.data.systeminfo = res.platform;
        if (res.platform == "ios") {
          that.IOSconnect();
        } else {
          // that.IOSconnect();
          var mymac = "";
          for (var i = 0; i < option.mac.length; i += 2) {
            console.log(option.mac.substr(i, 2));
            mymac = mymac + ":" + option.mac.substr(i, 2);
          }
          mymac = mymac.substr(1, 18).toUpperCase();
          that.setData({ connectedDeviceId: mymac });
          that.StartConectDev();
        }
      },
      fail: function (res) {
        wx.showToast({
          title: res.errMsg,
        })
      }
    });
  },
  IOSconnect: function () {
    //首先要获取已经连接的设备 
    var that = this;
    wx.getBluetoothDevices({
      success: function (res) {
        var isfound = false;
        console.log("getBluetoothDevices", res);
        //that.setData({ msg: JSON.stringify(res.devices) });
        if (res.devices.length != 0) {
          //如果没有匹配的,也要去发现     
          for (var i = 0; i < res.devices.length; i++) {
            try {
              var mac = ab2hex(res.devices[i].advertisData);
              mac = mac.slice(8, 20);//取MAC
              var maccode = that.data.mac.replace(/:/g, "");
              if (mac.toUpperCase() == maccode.toUpperCase()) {
                var deviceId = res.devices[i]['deviceId'];
                //that.data.connectedDeviceId = deviceId;
                that.setData({ connectedDeviceId: deviceId });
                console.log("已经连上的" + deviceId);
                isfound = true;
                break;
              }
            } catch (e) {
              console.log(e);
            }
          }
        }
        if (!isfound) {
          //没有已连接的设备开启扫描
          wx.showLoading({
            title: '扫描',
          })
          setTimeout(function () {
            that.ScanBLDevice();  //开启扫描找啊找
          }, 100)
        } else {
          //连接设备
          setTimeout(function () {
            that.StartConectDev();
          }, 100)
        }
      }
    });
  },
  //设备可能有多个...
  onBluetoothDeviceFound: function () {
    var that = this;
    console.log('onBluetoothDeviceFound');
    wx.onBluetoothDeviceFound(function (res) {
      console.log(res);
      if (res.devices[0]) {
        //*try {
        var mac = ab2hex(res.devices[0].advertisData);
        var sn = mac.slice(4, 8);
        console.log(sn);
        if (sn == getBLEName()) {

          mac = mac.slice(8, 20);//取MAC
          var maccode = that.data.mac.replace(/:/g, "");
          console.log("mac" + mac);
          console.log("maccode" + maccode);
          console.log("当前:" + that.data.connectedDeviceId);
          if (mac.toUpperCase() == maccode.toUpperCase()) {
            wx.hideLoading(); //关闭掉扫描           
            var deviceId = res.devices[0]['deviceId'];
            that.setData({ connectedDeviceId: deviceId });
            console.log("扫描到" + deviceId);
            //停止扫描
            wx.stopBluetoothDevicesDiscovery({
              success: function (res) {
                console.log(res)
              }
            })
            //开始连接设备
            setTimeout(function () {
              that.StartConectDev();
            }, 100)

          }
        }

        //   } catch (e) {
        //   console.log(e)
        //  }
      }       //[0]  
    })
  },

  ScanBLDevice: function () {
    var that = this;
    //开始搜索咯
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        if (!res.isDiscovering) {
          //that.getBluetoothAdapterState();
          wx.showModal({
            title: '蓝牙连接',
            content: '搜索失败',
          })
        } else {
          //setTimeout(function(){
          that.onBluetoothDeviceFound(); //启动设备发现
          // },100)

        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: '搜索失败',
          content: res.errMsg,
        })
      }
    })
  },
  //开始蓝牙连接 安卓可以直接这步
  StartConectDev: function () {
    var that = this;
    console.log("开始连接");
    wx.showLoading({
      title: '连接中',
    })
    console.log("devid" + that.data.connectedDeviceId);
    wx.createBLEConnection({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log(res.errMsg);
        // 获取连接设备的service服务  
        setTimeout(function () {
          that.getBLService();
        }, 100);
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res);
        wx.showModal({
          title: '蓝牙连接',
          content: '连接设备失败,请重试', // + that.data.connectedDeviceId,
          showCancel: false
        })
      }
    })
  },
  // 获取连接设备的service服务  
  getBLService: function () {
    var that = this;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log('device services:', JSON.stringify(res.services));
        that.setData({
          services: res.services,
          // msg: JSON.stringify(res.services),
        }),
          setTimeout(function () {
            that.getBLcharac();//获取characterstic值
          }, 100)
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: '获取service服务失败',
          content: res.errMsg,
        })
      }
    })
  },
  //获取连接设备的所有特征值  for循环获取不到值  
  //注意services是个数组
  getBLcharac: function () {
    var that = this;
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      serviceId: that.data.services[0].uuid,
      //serviceId: that.data.serviceId,
      success: function (res) {
        for (var i = 0; i < res.characteristics.length; i++) {
          if (res.characteristics[i].properties.notify) {
            //console.log("1", that.data.services[0].uuid);
            console.log("2", res.characteristics[i].uuid);
            console.log("notify: characteristics[", i, "]");
            that.setData({
              // notifyServicweId: that.data.serviceId,
              notifyServicweId: that.data.services[0].uuid,
              notifyCharacteristicsId: res.characteristics[0].uuid,
            })
          }
          if (res.characteristics[i].properties.write) {
            console.log("write: characteristics[", i, "]");
            if (res.characteristics.length >= 2) {
              var FFE2 = res.characteristics[1].uuid
            } else {
              var FFE2 = ""
            }
            //console.log(FFE2);
            that.setData({
              writeServicweId: that.data.services[0].uuid,
              //writeServicweId: that.data.serviceId,
              writeCharacteristicsId: res.characteristics[0].uuid,
              FFE2: FFE2

            })

          } else if (res.characteristics[i].properties.read) {
            console.log("read: characteristics[", i, "]");
            that.setData({
              readServicweId: that.data.services[0].uuid,
              //readServicweId: that.data.serviceId,
              readCharacteristicsId: res.characteristics[0].uuid,
            })
          }
        }
        console.log('device getBLEDeviceCharacteristics:', res.characteristics);
        //开启监听
        //监听值变化
        setTimeout(function () {
          wx.notifyBLECharacteristicValueChange({
            state: true, // 启用 notify 功能  
            // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
            deviceId: that.data.connectedDeviceId,
            // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
            serviceId: that.data.notifyServicweId,
            // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
            characteristicId: that.data.notifyCharacteristicsId,
            success: function (res) {
              console.log('notifyBLECharacteristicValueChange success', res.errMsg)
              // 这里的回调可以获取到 write 导致的特征值改变  
              wx.onBLECharacteristicValueChange(function (characteristic) {
                let buffer = characteristic.value
                let dataView = new DataView(buffer);
                var len2 = dataView.byteLength;
                that.setData({ receivcedatacount: that.data.receivcedatacount + len2 });


                if (that.data.HEXRev) {
                  console.log("16进制收");
                  that.setData({ receivcedata: that.data.receivcedata + ab2hex(buffer) });
                  console.log("接收数据:" + ab2hex(buffer));
                } else {
                  console.log("ASCII收");
                  that.setData({ receivcedata: that.data.receivcedata + ab2str(buffer) });
                  console.log("接收数据:" + ab2str(buffer));
                }
                console.log("shoudao:", that.data.receivcedata);
                console.log("fas:", that.data.senddata);
                wx.redirectTo({
                  url: '../scanresult/scanresult?password=' + that.data.receivcedata + '&number=' + that.data.senddata,
                  success: function (res) {
                    wx.showToast({
                      title: '获取密码成功',
                      duration: 1000
                    })
                  }
                })


              })

            },
            fail: function (res) {
              console.log(res.errMsg);
              wx.showModal({
                title: '监听特征值失败',
                content: res.errMsg,
                showCancel: false
              })

            }, complete: function () {
              wx.hideLoading(); //连接结束了
            }
          }) //nofify
        }, 0)  //监听


      },
      fail: function () {
        console.log("fail");
      },
      complete: function () {
        console.log("complete");
      }
    })
  },

  reconvert: function () {   //数据接收解析

  },
  onUnload: function () {
    var that = this;
    wx.closeBLEConnection({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log(res)
      }
    })
  },
  senddata: function () {
    var that = this;
    var data1 = that.data.sendddata;
    if (!data1) {
      wx.showToast({
        title: "请输入数据!",
        icon: "none",
      })
      return;
    }
    //console.log(data1);
    console.log("SendSet", that.data.SendSet.length);
    that.setData({ senddatacount: that.data.senddatacount + data1.length });
    let buf;
    if (that.data.SendSet.length > 0) {
      //16进制换算及校验码
      if (data1.length % 2 == 0) {
        console.log("HEX发送");
        buf = that.hexStringToArrayBuffer(data1);
      } else {
        wx.showToast({
          title: "数据必须成两位一组",
          icon: "none"
        })
        return;
      }
    } else {
      console.log("ASCII发送");
      buf = that.string2buffer(data1);
    }

    console.log("发送数据:" + ab2hex(buf) + " 原始数据:" + data1);
    if (!ab2hex(buf)) {
      wx.showToast({
        title: "数据转换失败",
        icon: "none"
      })
      return;
    }
    var ffid = that.data.wcharffex == "FFE1" ? that.data.writeCharacteristicsId : that.data.FFE2;
    if (!ffid) {
      wx.showToast({
        title: "FFE2不存在"
      })
      return;
    }
    console.log("wid", ffid)
    wx.writeBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: that.data.writeServicweId,
      characteristicId: ffid,
      value: buf,
      success: function (res) {
        //指令发送成功
        if (that.data.ReplSet.length == 0) {
          //停止了
          return;
        }
        setTimeout(function () {
          //继续发送数据
          that.senddata();
        }, 1000);
        
      },
      fail: function (res) {
        wx.showModal({
          title: '发送错误！',
          content: res.errMsg,
          showCancel: false
        })
      },
    })
  },
  SendInput: function (e) {
    var that = this;
    this.setData({ sendddata: e.detail.value });
  },
  hexStringToArrayBuffer(str) {  //16进制返回buff
    var that = this;
    if (!str || str.length < 2) {
      return new ArrayBuffer(0);
    }
    var buffer = new ArrayBuffer(str.length / 2);
    let dataView = new DataView(buffer)
    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      //console.log(str.substr(i, 2));
      //console.log(ind);
      dataView.setUint8(ind, code)
      ind++
    }
    //console.log("长度"+buffer.length);
    return buffer;
  },
  StringToArrayBuffer(str) {  //16进制返回buff
    var that = this;
    if (!str) {
      return new ArrayBuffer(0);
    }
    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer);
    for (var i = 0, len = str.length; i < len; i++) {
      let code = parseInt(str.substr(i, 1));
      dataView.setUint8(i, code)
    }
    return buffer;
  },
  string2buffer: function (str) {
    // 首先将字符串转为16进制
    let val = ""
    for (let i = 0; i < str.length; i++) {
      if (val === '') {
        val = str.charCodeAt(i).toString(16)
      } else {
        val += ',' + str.charCodeAt(i).toString(16)
      }
    }
    // 将16进制转化为ArrayBuffer
    return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
  },
  revInput: function (e) {//no use?
    this.setData({
      receivcedata: e.detail.value,
    })
  },
  btnClear: function () {  //清除接收框
    this.setData({
      receivcedata: "",
      receivcedatacount: 0
    })
  },
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({ wcharffex: e.detail.value });
  },


})

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

// ArrayBuffer转为字符串，参数为ArrayBuffer对象
function ab2str(buf) {
  let dataView = new DataView(buf)
  var len2 = dataView.byteLength;
  var xx = "";
  for (let i = 0; i < dataView.byteLength; i++) {
    //console.log("0x" + dataView.getUint8(i).toString(16))           
    //dataView.getUint8(i).toString(16);
    //console.log(dataView.getUint8(i));
    xx = xx + String.fromCharCode(dataView.getUint8(i))
  }
  return xx;
}

//连续
function countDown(that) {
  if (!that.data.ReplSet) {
    //停止了
    return;
  }
  setTimeout(function () {
    //发送数据
    that.senddata();
    countDown(that);
  }, 1000);
}