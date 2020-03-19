const app = getApp()
let cropper = null;

Page({


  data: {
    type: '',
    btnkg: 0,
  },


//////////////  init /////////////////////////
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    var filePath = decodeURIComponent(options.image); //图片临时地址
    console.log(filePath)
    cropper = this.selectComponent('#cropper');
    cropper.fnInit({
      imagePath: filePath,       //*必填
      debug: true,                        //可选。是否启用调试，默认值为false。true：打印过程日志；false：关闭过程日志
      outputFileType: 'jpg',              //可选。目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
      quality: 0.5,                         //可选。图片的质量。默认值为1，即最高质量。目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
      // aspectRatio: 1,                  //可选。裁剪的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0
      minBoxWidthRatio: 0.01,              //可选。最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
      minBoxHeightRatio: 0.01,             //可选。同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。
      initialBoxWidthRatio: 1,          //可选。剪裁框初始大小比率。默认值0.6，即剪裁框默认宽度为图片宽度的0.6倍。
      initialBoxHeightRatio:1          //可选。同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
      });


  },

  ////////  cancel ///////////////////
  fnCancel:function(){
    wx.navigateBack()
    console.log('cancel')
    //todo something
  },

////////// do crop ////////////////////
  fnSubmit:function(){
    let _this = this;
    if (_this.data.btnkg == 0) {
      _this.setData({
        btnkg: 1
      })
    } else {
      return
    }
    console.log('submit')
    //do crop
    cropper.fnCrop({

      //剪裁成功的回调
      success:function(res){
        console.log(res)
         //生成文件的临时路径
        console.log(res.tempFilePath);
        /*wx.previewImage({
          urls: [res.tempFilePath],
        })*/
        wx.showLoading({
          title: '上传中...',
          mask: true,
        });

        wx.uploadFile({
          url: app.IPurl + '/api/uploads/upload_more', //接口地址
          filePath: res.tempFilePath,
          name: 'file',
          success(res) {
            wx.hideLoading();
            console.log(res)
            var ndata = JSON.parse(res.data)
            if (ndata.code == 1) {
              console.log(ndata)
              if (ndata.data) {
                var newdata = ndata.data
              } else {
                wx.showToast({
                  icon: "none",
                  title: "操作失败，请稍后重试"
                })
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
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
              if (ndata.msg) {
                wx.showToast({
                  icon: "none",
                  title: ndata.msg
                })
              } else {
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
      },
      //剪裁失败的回调
      fail:function(res){
        console.log(res);
        
         /* res=JSON.stringify(res)
        
        wx.showToast({
          title: res,
        })*/
        _this.setData({
          btnkg: 0
        })
        wx.showToast({
          icon: "none",
          title: "获取图片失败，请返回上一页面重试"
        })
      },

      //剪裁结束的回调
      complete:function(){
        //complete
      }
    });
  }
})