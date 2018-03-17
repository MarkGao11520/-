// pages/posts/post.js

// 引入其他文件的js数据
var postData = require("../../data/posts-data.js")

Page({
  data:{
    // 小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A，
    // 而动作A的执行是在onload事件之后发生的
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // this.data.posts_key = postData.postList;
      this.setData({ 
        posts_key: postData.postList
      });
  },

  onPostTap: function(event){
    //  event（事件）
    //     -> currentTarget(当前鼠标点击的组件)
    //     -> dataset (所有自定义数据的集合)
    //     -> postId (变量名)
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId,
    })
  }
})
