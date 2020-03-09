// pages/imageCropper/imageCropper.js
const app = getApp()
import WeCropper from '../../vendor/we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = width

Page({
  data: {
    type:'',
    btnkg:0,
    cropperOpt: {
      id: 'cropper', //用于收拾操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width,
      height,
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: { // 裁剪框x轴起点   裁剪框y轴期起点
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300, // 裁剪框宽度
        height: 300 // 裁剪框高度
      },
      boundStyle: {
        color: 'rgba(0,0,0,0.8)',
        lineWidth: 1
      },
    }
  },
  onLoad(option) {
    console.log(option);
    this.setData({
      type:option.type
    })
    // const widthHeightScale = option.width / option.height;
    const {
      cropperOpt
    } = this.data;
    const filePath = decodeURIComponent(option.image); //图片临时地址


    /*cropperOpt.cut = {
      x: (width - width * option.width / 750) / 2,
      y: (height - width * option.height / 750) / 2,
      width: width * option.width / 750,
      height: width * option.height / 750,
    };
    this.setData({
      cropperOpt
    })*/
    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          mask: true,
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
    //  获取裁剪图片资源后，给data添加src属性及其值
    this.cropper.pushOrign(filePath);
  },
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    console.log(e)
    console.log(1)
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },
  getCropperImage() {
    let _this = this;
    if (_this.data.btnkg==0){
      _this.setData({
        btnkg:1
      })
    }else{
      return
    }
    this.cropper.getCropperImage()
      .then((src) => {
        console.log(src);
        // wx.previewImage({
        //   current: '', // 当前显示图片的http链接
        //   urls: [src] // 需要预览的图片http链接列表
        // });
        wx.showLoading({
          title: '上传中...',
          mask: true,
        });

        wx.uploadFile({
          url: app.IPurl +'/api/uploads/upload_more', //接口地址
          filePath: src,
          name: 'file',
          success(res) {
            wx.hideLoading();
            console.log(res)
            var ndata = JSON.parse(res.data)
            if (ndata.code == 1) {
              console.log(ndata)
              if (ndata.data){
                var newdata = ndata.data
              }else{
                wx.showToast({
                  icon: "none",
                  title: "操作失败，请稍后重试"
                })
                setTimeout(function(){
                  wx.navigateBack()
                },1000)
                return
              }
              

              var pages = getCurrentPages();
              var backPage = pages[pages.length - 2]; //上一个页面
              //将上传返回的图片地址记录下来，设置到上一个界面的this.data.promotionIcon中
              console.log(_this.data.type)
              if (_this.data.type == 1) {
                backPage.setData({
                  book_img1: newdata
                });
              } else if (_this.data.type == 2) {
                backPage.setData({
                  book_img2: newdata
                });
              } else if (_this.data.type == 3) {
                backPage.setData({
                  book_img3: newdata
                });
              }

              wx.hideLoading()
              //成功了返回到上一个界面
              wx.navigateBack()
            } else {
              console.log(ndata)
              _this.setData({
                btnkg: 0
              })
              if(ndata.msg){
                wx.showToast({
                  icon: "none",
                  title: ndata.msg
                })
              }else{
                wx.showToast({
                  icon: "none",
                  title: "上传失败"
                })
              }
              
            }
            
          },
          fail(err) {
            wx.hideLoading();
            wx.showToast({
              icon: "none",
              title: "上传失败，请稍后重试"
            })
            console.log(err)
            _this.setData({
              btnkg: 0
            })
            //console.log(err);
          },
          complete: function () {
            
            
          }
        })

      })
      .catch(() => {
        _this.setData({
          btnkg: 0
        })
        wx.showToast({
          icon: "none",
          title: "获取图片失败，请返回上一页面重试"
        })
        console.log('获取图片地址失败，请稍后重试')
      })
  },

})