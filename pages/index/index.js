//index.js
//获取应用实例
import relationship from "../../utils/relationship"
const app = getApp()
const AudioCxt = wx.createInnerAudioContext()

Page({
  data: {
    previous: [],
    txt: '',
    result: '',
    more: [],
    resultTop: 0,
    reverse: false,
    sex: 0,
    //语音功能
    switchVoice: false
  },
  onLoad: function () {

  },

  getRelationship: function (e, options) {
    let self = this
    let tmparr = this.data.previous
    let txt = this.data.txt,
      sex = this.data.sex,
      reverse = this.data.reverse
    if (tmparr.length > 16) {
      tmparr = tmparr.filter((resobj, resindex) => resindex > (tmparr.length - 16))
    }
    if (options) {
      txt = options.txt
      sex = options.sex
      reverse = options.reverse
    }
    if (txt) {
      let options = {
        text: txt,
        sex,
        reverse,
        type: 'default' //转换类型：'default'算称谓,'chain'算关系(此时reverse无效)
      };
      let result = relationship(options);

      if (result.length > 0) {
        tmparr.push({
          origin: txt,
          result: result[0]
        })
        console.log("结果", result)
        this.setData({
          previous: tmparr,
          txt: '',
          result: result[0],
          more: result
        })
      } else {
        this.setData({
          txt: '',
          result: '太複雜了，我不知道～',
          more: result
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

    if (this.data.switchVoice && e.currentTarget.dataset.voice) {
      AudioCxt.src = e.currentTarget.dataset.voice
      AudioCxt.play()
    }
  },

  /**
   * 清除
   */
  clear: function () {
    this.setData({
      txt: '',
      result: '',
      previous: [],
      more: [],
      resultTop: 0
    })
  },
  clearLine: function () {
    this.setData({
      txt: '',
      result: '',
      more: [],
    })
  },

  /**
   * 性別轉換
   */
  handleSex: function () {
    let self = this
    //this.clearLine()
    this.setData({
      sex: this.data.sex == 0 ? 1 : 0
    }, (self.data.previous.length > 0) && function () {
      self.getRelationship('', {
        txt: self.data.previous[self.data.previous.length - 1].origin,
        sex: self.data.sex,
        reverse: self.data.reverse
      })
    })
  },

  /**
   * 轉換稱呼
   */
  handleReverse: function () {
    let self = this
    //this.clearLine()
    this.setData({
      reverse: !this.data.reverse
    }, (self.data.previous.length > 0) && function () {
      self.getRelationship('', {
        txt: self.data.previous[self.data.previous.length - 1].origin,
        sex: self.data.sex,
        reverse: self.data.reverse
      })
    })
  },

  //切换语音
  handleswitchVoice: function () {
    this.setData({
      switchVoice: !this.data.switchVoice
    })
  },

  onShareAppMessage: function () {
    return {
      title: '潮语亲戚计算器',
      imageUrl: '../../static/images/cover.jpg'
    }
  }
})