// pages/imageCropper/imageCropper.js
const app = getApp()
import WeCropper from '../../vendor/we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = width

Page({
  data: {
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
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },
  getCropperImage() {
    let _this = this;
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
          url: app.IPurl, //接口地址
          filePath: src,
          name: 'upfile',
          success(res) {

          },
          fail(err) {
            //console.log(err);
          },
          complete: function () {
            wx.hideLoading();
          }
        })

      })
      .catch(() => {
        console.log('获取图片地址失败，请稍后重试')
      })
  },

})