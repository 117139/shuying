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
  onLoad: function (options) {
    var filePath = decodeURIComponent(options.image); //图片临时地址
    console.log(filePath)
    cropper = this.selectComponent('#cropper');
    cropper.fnInit({
      imagePath: filePath,       //*必填
      debug: true,                        //可选。是否启用调试，默认值为false。true：打印过程日志；false：关闭过程日志
      outputFileType: 'jpg',              //可选。目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
      quality: 1,                         //可选。图片的质量。默认值为1，即最高质量。目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
      aspectRatio: 1.25,                  //可选。裁剪的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0
      minBoxWidthRatio: 0.2,              //可选。最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
      minBoxHeightRatio: 0.2,             //可选。同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。
      initialBoxWidthRatio: 0.6,          //可选。剪裁框初始大小比率。默认值0.6，即剪裁框默认宽度为图片宽度的0.6倍。
      initialBoxHeightRatio: 0.6          //可选。同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
    });
  },
  fnSubmit: function () {
    //do crop
    cropper.fnCrop({

      //剪裁成功的回调
      success: function (res) {
        //生成文件的临时路径
        console.log(res.tempFilePath);
        wx.previewImage({
          urls: [res.tempFilePath],
        })
      }

    });
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