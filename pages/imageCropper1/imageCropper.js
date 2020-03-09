// pages/imageCropper/imageCropper.js
const app = getApp()
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileType: '',//学历：E, 车：C, 房：H, 头像：H, 用户图片：U,兴趣爱好：I
    isupdate: '',//是否更新照片
    src: '',
    width: 380,//宽度
    height: 316,//高度
    limit_move: true,//是否禁用旋转
    max_width: 250,
    max_height: 250,
    disable_width: true,
    disable_height: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    //获取到image-cropper对象
    this.cropper = this.selectComponent("#image-cropper");
    const filePath = decodeURIComponent(option.image); //图片临时地址
    // console.log(width * option.width / 750)
    console.log(width)
    //开始裁剪
    this.setData({
      src: filePath,
     
    });
    wx.showLoading({
      title: '加载中'
    })
  },
  cropperload(e) {
    console.log("cropper初始化完成");
  },
  loadimage(e) {
    console.log("图片加载完成", e.detail);
    wx.hideLoading();
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },
  clickcut(e) {
    console.log(e.detail);
    //点击裁剪框阅览图片
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  submit: function () {
    this.cropper.getImg((obj) => {
      // app.globalData.imgSrc = obj.url;
      // wx.navigateBack({
      //   delta: -1
      // })
      const src = obj.url;
      const _this = this;
      wx.showLoading({
        title: '上传中...',
        mask: true,
      });
      wx.uploadFile({
        url: ''
      })
    });
  },
  rotate() {
    //在用户旋转的基础上旋转90°
    this.cropper.setAngle(this.cropper.data.angle += 90);
  },
  end(e) {
    clearInterval(this.data[e.currentTarget.dataset.type]);
  },

})