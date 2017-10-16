 // 解决IE打不开问题
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import base64 from 'base-64'
import utf8 from 'utf8'
import md5 from 'md5'
import Vuex from 'vuex'
import store from './vuex/store'
import VueResource from 'vue-resource'
import 'bootstrap'
import 'bootstrap-table'
import 'tableexport'
import './assets/css/bootstrap3.0.min.css'
import './assets/css/manage.css'

// 导入ueditor相关
// import '../static/UE/ueditor.config.js'
// import '../static/UE/ueditor.all.js'
// import '../static/UE/lang/zh-cn/zh-cn.js'
// import '../static/UE/ueditor.parse.min.js'

Vue.use(VueResource)
Vue.use(Vuex)
// 关闭生产模式下给出的提示
Vue.config.productionTip = false

{
  // bootstrap-table中文显示设置
  (function ($) {
    'use strict'
    $.fn.bootstrapTable.locales['zh-CN'] = {
      formatLoadingMessage: function () {
        return '正在努力地加载数据中，请稍候……'
      },
      formatRecordsPerPage: function (pageNumber) {
        return '每页显示 ' + pageNumber + ' 条记录'
      },
      formatShowingRows: function (pageFrom, pageTo, totalRows) {
        return '显示第 ' + pageFrom + ' 到第 ' + pageTo + ' 条记录，总共 ' + totalRows + ' 条记录'
      },
      formatSearch: function () {
        return '搜索'
      },
      formatNoMatches: function () {
        return '没有找到匹配的记录'
      },
      formatPaginationSwitch: function () {
        return '隐藏/显示分页'
      },
      formatRefresh: function () {
        return '刷新'
      },
      formatToggle: function () {
        return '切换'
      },
      formatColumns: function () {
        return '列'
      },
      formatExport: function () {
        return '导出数据'
      },
      formatClearFilters: function () {
        return '清空过滤'
      }
    }
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN'])
  })($)
  // 设置表格的不可点击按钮
  {
    let _onLoadSuccess = 'onLoadSuccess' in $.fn.bootstrapTable.defaults ? $.fn.bootstrapTable.defaults.onLoadSuccess : function () { return }
    $.fn.bootstrapTable.defaults.onLoadSuccess = function (data) {
      $("[data-toggle='popover']").popover()
      $('.page-number.active, .page-last-separator.disabled, .page-first-separator.disabled').click(function () {
        return false
      })
      _onLoadSuccess()
    }
  }
  // 模态框阴影点击后不关闭
  $.fn.modal.Constructor.DEFAULTS.backdrop = 'static'

  // 设置localStorage
  localStorage.setItem('biUser', 'dev')
  // 设置mBase
  {
    let href = window.location.href
    if (href.includes('m2c2017dev')) { // 开发环境
      Vue.prototype.base = 'http://api.m2c2017dev.com:80/'
    } else if (href.includes('m2c2017test')) { // 测试环境
      Vue.prototype.base = 'http://api.m2c2017test.com:80/'
    } else if (href.includes('localhost')) { // 本地环境
      Vue.prototype.base = 'http://api.m2c2017dev.com:80/'
      Vue.prototype.mobanbase = 'http://10.0.40.242:9104/'
    } else { // 演示环境
      Vue.prototype.base = 'http://api.m2c2017.com:80/'
    }
  }
  // 设置jQuery方法
  Vue.prototype.$ = $
  // 设置路由跳转方法
  Vue.prototype.$goRoute = function (index) {
    this.$router.push(index)
  }
  // 设置base64和urf8转化方法
  Vue.prototype.base64 = base64
  Vue.prototype.utf8 = utf8
  // 设置提示框
  let showTip = function (content, className = 'show_tip_frame_logo_warn', callback) {
    if (document.querySelector('#show_tip').style['display'] !== 'none') return
    document.querySelector('#show_tip .show_tip_frame_logo').className = `show_tip_frame_logo ${className}`
    document.querySelector('#show_tip .show_tip_frame_content').innerText = content
    document.querySelector('#show_tip').style['display'] = 'block'
    document.querySelector('#show_tip .show_tip_frame').className = 'show_tip_frame show_tip_frame_in'
    document.querySelector('#show_tip .show_tip_frame_close button').focus()
    document.querySelector('#show_tip .show_tip_frame_close button').onclick = function () {
      document.querySelector('#show_tip').style['display'] = 'none'
      if (callback) {
        callback()
      }
    }
  }
  Vue.prototype.show_tip = showTip
  // 设置等待图标的打开和关闭
  Vue.prototype.show_loading = function () {
    document.querySelector('#loading_layer').style['display'] = 'block'
  }
  let hideLoading = function () {
    document.querySelector('#loading_layer').style['display'] = 'none'
  }
  Vue.prototype.hide_loading = hideLoading
  // 设置md5加密方法
  Vue.prototype.md5 = md5
  // 设置日期时间戳转化的方法
  Vue.prototype.date_format = function (date, fmt) {
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  }
  // 设置获取元素样式的方法
  Vue.prototype.getStyle = function (obj, attr) {
    if (obj.currentStyle) {
      return obj.currentStyle[attr]
    } else {
      return window.getComputedStyle(obj, null)[attr]
    }
  }
  // 获取用户m_roleID(m新增角色时使用)
  Vue.prototype.get_m_ROLE_ID = function (callback) {
    let that = this
    that.$.ajax({
      type: 'get',
      url: this.base + 'm2c.system/getid',
      data: {
        idType: 'ROLE_ID',
        userName: JSON.parse(sessionStorage.getItem('mUser')).userName,
        systemAccessToken: sessionStorage.getItem('mToken')
      },
      success (result) {
        result = that.base64.decode(result.content)
        result = that.utf8.decode(result)
        that.$store.commit('set_m_role_ID', JSON.parse(result)['id'])
        console.log('获取的m_role_ID:', that.m_role_ID)
        callback()
      }
    })
  }
  // 获取用户m_userID(m新增用户时使用)
  Vue.prototype.get_m_USER_ID = function (callback) {
    let that = this
    that.$.ajax({
      type: 'get',
      url: this.base + 'm2c.system/getid',
      data: {
        idType: 'USER_ID',
        userName: JSON.parse(sessionStorage.getItem('mUser')).userName,
        systemAccessToken: sessionStorage.getItem('mToken')
      },
      success (result) {
        result = that.base64.decode(result.content)
        result = that.utf8.decode(result)
        that.$store.commit('set_m_user_ID', JSON.parse(result)['id'])
        console.log('获取的m_user_ID:', that.m_user_ID)
        callback()
      }
    })
  }
  // 获取用户m_forbidID(m新增用户时使用)
  Vue.prototype.get_m_FORBID_ID = function (callback) {
    let that = this
    that.$.ajax({
      type: 'get',
      url: this.base + 'm2c.system/getid',
      data: {
        idType: 'FORBID_ID',
        userName: JSON.parse(sessionStorage.getItem('mUser')).userName,
        systemAccessToken: sessionStorage.getItem('mToken')
      },
      success (result) {
        result = that.base64.decode(result.content)
        result = that.utf8.decode(result)
        that.$store.commit('set_m_forbid_ID', JSON.parse(result)['id'])
        console.log('获取的m_forbid_ID:', that.m_forbid_ID)
        callback()
      }
    })
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
