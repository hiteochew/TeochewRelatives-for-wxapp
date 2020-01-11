//index.js
//获取应用实例
import relationship from "../../utils/relationship"
const app = getApp()

Page({
  data: {
    previous: [],
    txt: '',
    result: '',
    resultTop: 0,
    reverse: false,
    sex: 0
  },
  onLoad: function () {

  },

  getRelationship: function () {
    let self = this
    if (this.data.txt) {
      let tmparr = this.data.previous
      let txt = this.data.txt
      let options = {
        text: txt,
        sex: this.data.sex,
        type: 'default', //转换类型：'default'算称谓,'chain'算关系(此时reverse无效)
        reverse: this.data.reverse //称呼方式：true对方称呼我,false我称呼对方
      };
      let result = relationship(options);

      if (result.length > 0) {
        tmparr.push(txt + '是' + result[0])
        console.log("结果", result, tmparr)
        this.setData({
          previous: tmparr,
          txt: '',
          result: result[0]
        })
      } else {
        this.setData({
          txt: '',
          result: '太複雜了，我不知道～'
        })
      }
    }
    const query = wx.createSelectorQuery()
    query.select('#result').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      self.setData({
        resultTop: res[1].scrollHeight
      })
    })
  },

  /**
   * 按键
   * @param {*} e 
   */
  insert: function (e) {
    let self = this
    let txt = ''
    console.log("按键", e.currentTarget.dataset.txt)

    if (this.data.result && this.data.result !== '太複雜了，我不知道～') {
      txt += this.data.result
      this.setData({
        result: ''
      })
    } else if (this.data.result == '太複雜了，我不知道～') {
      this.setData({
        result: ''
      })
    }
    if (txt && this.data.txt) {
      txt += '的' + this.data.txt
    } else if (this.data.txt) {
      txt += this.data.txt
    }
    if (txt.length < 126) {
      txt += (txt ? '的' + e.currentTarget.dataset.txt : e.currentTarget.dataset.txt)
      this.setData({
        txt: txt
      })
    } else {
      this.setData({
        txt: '',
        result: "太複雜了，我不知道～"
      })
    }

    const query = wx.createSelectorQuery()
    query.select('#result').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log('选择', res)
      self.setData({
        resultTop: res[1].scrollHeight
      })
    })
  },

  /**
   * 清除
   */
  clear: function () {
    this.setData({
      txt: '',
      result: '',
      previous: [],
      resultTop: 0
    })
  },
  clearLine: function () {
    this.setData({
      txt: '',
      result: ''
    })
  },

  /**
   * 性別轉換
   */
  handleSex: function () {
    this.clearLine()
    this.setData({
      sex: this.data.sex == 0 ? 1 : 0
    })
  },

  /**
   * 轉換稱呼
   */
  handleReverse: function () {
    this.clearLine()
    this.setData({
      reverse: !this.data.reverse
    })
  }
})