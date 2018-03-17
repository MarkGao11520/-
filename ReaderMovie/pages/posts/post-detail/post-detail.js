// pages/posts/post-detail/post-detail.js
var postsData = require("../../../data/posts-data.js");
var app = getApp();
Page({

  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    var postData = postsData.postList[postId];
    this.data.currentPostId = postId;

    // 设置数据
    this.setData({
      postData: postData
    })

    // 是否收藏的缓存 
    var postsCollected = wx.getStorageSync("posts_collected");
    if (postsCollected) {
      var collected = postsCollected[postId];
      this.setData({
        collected: collected
      });
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected);
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicoMonitor();
  },

  /**
   * 设置音乐监听状态
   */
  setMusicoMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
      that.setData({
        isPlayingMusic: true
      })
    });

    wx.onBackgroundAudioPause(function () {
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
      that.setData({
        isPlayingMusic: false
      })
    });
  },

  // 收藏监听事件
  onCollectinTap: function (event) {
    this.getPostsCollectedSync();
    // this.getPostsCollectedAsc();
  },

  // 分享监听事件
  onShareTap: function (event) {
    var itemList = ["分享到微信好友", "分享到朋友圈", "分享到QQ", "分享到微博"];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function (res) {
        // res.tapIndex 从0开始，代表点击数组的序号
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: "现在无法实现分享功能，什么时候实现呢",
        })
      }
    })
  },

  /**
   * 监听音乐事件
   */
  onMusicTap: function (event) {
    var currentId = this.data.currentPostId
    var postData = postsData.postList[currentId].music
    var isPlayingMusic = this.data.isPlayingMusic
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        title: postData.title,
        dataUrl: postData.url,
        coverImgUrl: postData.coverImgUrl
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },


  /**
   * 异步获取收藏缓存状态
   */
  getPostsCollectedAsc: function () {
    var that = this
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        // 收藏->未收藏，未收藏->收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected
        // this.showModal(postsCollected, postCollected);
        that.showToast(postsCollected, postCollected);
      },
    })
  },

  /** 
   * 同步获取收藏缓存状态
   */
  getPostsCollectedSync: function () {
    var postsCollected = wx.getStorageSync("posts_collected");
    var postCollected = postsCollected[this.data.currentPostId];
    // 收藏->未收藏，未收藏->收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected
    // this.showModal(postsCollected, postCollected);
    this.showToast(postsCollected, postCollected);
  },

  /**
   * 可选提示框
   */
  showModal: function (postsCollected, postCollected) {
    var that = this
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章?' : '取消收藏该文章? ',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function (res) {
        // res.cencel 用户是否点击了取消按钮
        if (res.confirm) {
          // 更新文章是否收藏的缓存值
          wx.setStorageSync("posts_collected", postsCollected)
          // 更新数据绑定变量，从而实现切换图片
          that.setData({ // this 指函数调用上下文环境
            collected: postCollected
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 自动消失提示框
   */
  showToast: function (postsCollected, postCollected) {
    // 更新文章是否收藏的缓存值
    wx.setStorageSync("posts_collected", postsCollected)
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 500,
      mask: true
    })
  },


})