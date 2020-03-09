// pages/index/index.js
var htmlStatus = require('../../utils/htmlStatus/index.js')
var WxParse = require('../../vendor/wxParse/wxParse.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    explain:'',
    search_name: '',
    ss_data:[],
    pages:1,



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
    that.getdata()
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
    this.getdata()
    
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
  ss_name(e){
    console.log(e.detail.value)
    this.setData({
      ss_data:[],
      page:1,
      search_name: e.detail.value
    })
  },
  sousuo() {
    var that = this
    console.log(that.data.search_name)
    /*wx.navigateTo({
      url: '/pages/shangchuan/shangchuan?name=' + that.data.search_name,
    })*/
    if (!that.data.search_name){
      wx.showToast({
        icon: 'none',
        title: '请输入书名',
      })
      return
    }
    wx.request({
      url: app.IPurl + '/api/index/search/',
      data: {

        "page": 1,
        page_size:'20',
        "search": that.data.search_name
      },
      // header: {
      // 	'content-type': 'application/x-www-form-urlencoded'
      // },
      dataType: 'json',
      method: 'get',
      success(res) {
        console.log(res.data)


        if (res.data.code == 1) {
          
          var rlist=res.data.data.data
          if (rlist.length >0){
            
            wx.showToast({
              icon: 'none',
              title: '书名已存在,拍张更好的',
            })
            that.setData({
              search_name:''
            })
            /*wx.showModal({
              // title: '提示',
              content: '书名已存在,拍张更好的',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  // wx.navigateTo({
                  //   url: '/pages/shangchuan/shangchuan?name=' + that.data.search_name,
                  // })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })*/
            /*that.setData({
              ss_data: rlist,
              pages: 2
            })*/
          }
         

          if (rlist.length == 0) {

           /* wx.showToast({
              icon: 'none',
              title: '书名不存在'
            })*/
            /*setTimeout(function(){*/
              wx.navigateTo({
                url: '/pages/shangchuan/shangchuan?name=' + that.data.search_name,
              })
            /*},500)*/
            
          }
        }
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '操作失败'
        })
      }
    })


  }, 
  sousuo1() {
    var that = this
    if (!that.data.search_name) {
      wx.showToast({
        icon: 'none',
        title: '请输入书名',
      })
      return
    }

    wx.request({
      url: app.IPurl + '/api/community/index',
      data: {

        "page": that.data.pages,
        page_size: '20',
        "search": that.data.search_name
      },
      // header: {
      // 	'content-type': 'application/x-www-form-urlencoded'
      // },
      dataType: 'json',
      method: 'get',
      success(res) {
        console.log(res.data)


        if (res.data.code == 1) {
          var rlist = res.data.data.data
          if(rlist.length>0){
            that.data.pages++
            that.data.ss_data = that.data.ss_data.concat(rlist)
            console.log(rlist)
            that.setData({
              ss_data: that.data.ss_data,
              pages: that.data.pages
            })
          }else {
            wx.showToast({
              icon: 'none',
              title: '暂无更多数据'
            })
          }
        }
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '操作失败'
        })
      }
    })


  },
  getdata(){
    ///api/homeIndex
    var that = this
    that.setData({
      page: 1,
      ss_data: [],
      search_name:''
    })
    const htmlStatus1 = htmlStatus.default(that)
    wx.request({
      url: app.IPurl + '/api/index/index',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {
        // 停止下拉动作
        wx.stopPullDownRefresh();
        htmlStatus1.finish()
        console.log(res.data)
        if (res.data.code == 1) {  //数据为空

          that.setData({
            banner: res.data.data.banner,
            explain: res.data.data.explain.text
          })
          var article = res.data.data.explain.text+''
          var subStr = new RegExp('<div>&nbsp;</div>', 'ig');
          article = article.replace(subStr, "<text style='margin-bottom:1em;'></text>");
          WxParse.wxParse('article', 'html', article, that, 5);
          
        } else {
          htmlStatus1.error()
          wx.showToast({
            icon: 'none',
            title: '加载失败'
          })

        }
      },
      fail() {
        // 停止下拉动作
        wx.stopPullDownRefresh();
        htmlStatus1.error()
        wx.showToast({
          icon: 'none',
          title: '加载失败'
        })

      },
      complete() {
        // // 停止下拉动作
        // wx.stopPullDownRefresh();
      }
    })
  },
  jumpsc(e){
    console.log(e.currentTarget.dataset.name)
    wx.navigateTo({
      url: '/pages/shangchuan/shangchuan?name=' + e.currentTarget.dataset.name,
    })
  },
	kffuc(e){
		console.log(e)
	}
})