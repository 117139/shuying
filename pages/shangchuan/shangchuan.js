// pages/index/index.js
var htmlStatus = require('../../utils/htmlStatus/index.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookname: '三国演义',
    book_img1: '',
    book_img2: '',
    book_img3: '',
    homeTeacher: '',
    homeVideo: '',
   
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    that.setData({
      bookname:options.name
    })
    // that.getdata()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
	retry() {
    this.getdata()
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
    wx.stopPullDownRefresh();
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

  },
  scpic(e) {
    var that = this
    console.log(e.currentTarget.dataset.type)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        wx.navigateTo({
          url: '/pages/cropper/cropper-example?image=' + tempFilePaths + '&type=' + e.currentTarget.dataset.type,
        })
        /*const imglen = that.data.imgb.length
        that.upimg(tempFilePaths, 0)*/

      }
    })
  },
  upimg(imgs, i) {
    var that = this
    const imglen = that.data.imgb.length
    var newlen = Number(imglen) + Number(i)
    if (imglen == 9) {
      wx.showToast({
        icon: 'none',
        title: '最多可上传九张'
      })
      return
    }
    // console.log(img1)
    wx.uploadFile({
      url: app.IPurl, //仅为示例，非真实的接口地址
      filePath: imgs[i],
      name: 'upfile',
      formData: {
        'apipage': 'uppic',
      },
      success(res) {
        // console.log(res.data)
        var ndata = JSON.parse(res.data)
        if (ndata.error == 0) {
          console.log(imgs[i], i, ndata.url)
          var newdata = that.data.imgb
          console.log(i)
          newdata.push(ndata.url)
          that.setData({
            imgb: newdata
          })
          // i++
          // that.upimg(imgs, i)
          var news1 = that.data.imgb.length
          if (news1 < 9) {
            i++
            that.upimg(imgs, i)
          }
        } else {
          wx.showToast({
            icon: "none",
            title: "上传失败"
          })
        }
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    
   
    var fs = e.detail.value
    if (!fs.book_img1 & !fs.book_img2 & !fs.book_img3) {
      wx.showToast({
        icon: 'none',
        title: '请上传至少一张图片'
      })
      return
    }
    /*if (!fs.book_img1) {
      wx.showToast({
        icon: 'none',
        title: '请上传图片(书脊)'
      })
      return
    }
    if (!fs.book_img2) {
      wx.showToast({
        icon: 'none',
        title: '请上传图片(封面)'
      })
      return
    }
    if (!fs.book_img3) {
      wx.showToast({
        icon: 'none',
        title: '请上传图片(其他)'
      })
      return
    }*/
    if (!fs.book_h) {
      wx.showToast({
        icon: 'none',
        title: '请输入图书高'
      })
      return
    }
    if (!fs.book_myname) {
      wx.showToast({
        icon: 'none',
        title: '请输入您的姓名'
      })
      return
    }
    
    wx.showModal({
      title: '提示',
      content: '是否上传',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '正在提交。。',
            mask:true
          })

          wx.request({
            url: app.IPurl + '/api/index/save',
            data: {
              
              title: that.data.bookname,
              book_width: fs.book_h,//(图书高)
              author: fs.book_user,//(作者)
              isbn: fs.book_ISBN,//(ISBN)
              name: fs.book_myname,//(姓名)
              tel: fs.book_tel,//(联系方式)
              pic_book: fs.book_img1,//(书脊)
              pic_cover: fs.book_img2,//(封面)
              pic_rests: fs.book_img3,//(其他)
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            method: 'POST',
            success(res) {
              wx.hideLoading()
              console.log(res.data)


              if (res.data.code == 1) {

                wx.showToast({
                  icon: 'none',
                  title: '提交成功',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack()

                }, 1000)

              } else {
                if (res.data.msg) {
                  wx.showToast({
                    icon: 'none',
                    title: res.data.msg
                  })
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: '操作失败'
                  })
                }
              }


            },
            fail() {
              wx.hideLoading()
              wx.showToast({
                icon: 'none',
                title: '操作失败'
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  jump(e){
    console.log(e.currentTarget.dataset.type)
    if (e.currentTarget.dataset.type==2){
      wx.switchTab({
        url: e.currentTarget.dataset.url
      })
    } else {
      app.jump(e)
    }
  },
	kffuc(e){
		console.log(e)
	}
})