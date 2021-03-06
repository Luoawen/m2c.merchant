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
//import VueResource from 'vue-resource'
import Element from 'element-ui'
import './assets/css/index.css'
// import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap'
//import 'bootstrap-table'
import 'tableexport'
import './assets/css/bootstrap3.0.min.css'
import './assets/css/manage.css'
import './assets/css/iconfont_s/iconfont.css'
//由于qiniu不是基于标准的commonjs开发的，所以要写全路径
require('qiniu-js/dist/qiniu.min');
// import 'addressCheckbox/js/RegionalChoice.js'
// import 'addressCheckbox/css.css'
// 导入ueditor相关
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'
//Vue.use(VueResource)
Vue.use(Vuex)
// 关闭生产模式下给出的提示
Vue.config.productionTip = false
Vue.use(Element)
{
  // bootstrap-table中文显示设置
  // (function ($) {
  //   'use strict'
  //   $.fn.bootstrapTable.locales['zh-CN'] = {
  //     formatLoadingMessage: function () {
  //       return '正在努力地加载数据中，请稍候……'
  //     },
  //     formatRecordsPerPage: function (pageNumber) {
  //       return '每页显示 ' + pageNumber + ' 条记录'
  //     },
  //     formatShowingRows: function (pageFrom, pageTo, totalRows) {
  //       return '显示第 ' + pageFrom + ' 到第 ' + pageTo + ' 条记录，总共 ' + totalRows + ' 条记录'
  //     },
  //     formatSearch: function () {
  //       return '搜索'
  //     },
  //     formatNoMatches: function () {
  //       return '没有找到匹配的记录'
  //     },
  //     formatPaginationSwitch: function () {
  //       return '隐藏/显示分页'
  //     },
  //     formatRefresh: function () {
  //       return '刷新'
  //     },
  //     formatToggle: function () {
  //       return '切换'
  //     },
  //     formatColumns: function () {
  //       return '列'
  //     },
  //     formatExport: function () {
  //       return '导出数据'
  //     },
  //     formatClearFilters: function () {
  //       return '清空过滤'
  //     }
  //   }
  //   $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN'])
  // })($)
  // 设置表格的不可点击按钮
  // {
  //   let _onLoadSuccess = 'onLoadSuccess' in $.fn.bootstrapTable.defaults ? $.fn.bootstrapTable.defaults.onLoadSuccess : function () { return }
  //   $.fn.bootstrapTable.defaults.onLoadSuccess = function (data) {
  //     $("[data-toggle='popover']").popover()
  //     $('.page-number.active, .page-last-separator.disabled, .page-first-separator.disabled').click(function () {
  //       return false
  //     })
  //     _onLoadSuccess()
  //   }
  // }
  // 模态框阴影点击后不关闭
  $.fn.modal.Constructor.DEFAULTS.backdrop = 'static'

    {
      document.body.addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
          let elements = [].slice.call(document.querySelectorAll('.btn-search'))
          elements.forEach( item => { item.click() })
        }})
    }

  // 设置localStorage
  localStorage.setItem('biUser', 'dev')
  // 设置mBase
  {
    let href = window.location.href
    if (href.includes('m2c2017dev')) { // 开发环境
      // Vue.prototype.base = 'http://api.m2c2017dev.com:80/'
      Vue.prototype.localbase = 'http://api.m2c2017dev.com:80/'
      Vue.prototype.base = 'http://api.m2c2017dev.com:80/'
    } else if (href.includes('m2c2017test')) { // 测试环境
      Vue.prototype.base = 'http://api.m2c2017test.com:80/'
      Vue.prototype.localbase = 'http://api.m2c2017test.com:80/'
    }
    else if (href.includes('m2c2017local')) { // 本地环境
      Vue.prototype.base = 'http://api.m2c2017local.com:80/'
      Vue.prototype.localbase = 'http://api.m2c2017local.com:80/'
    } else if (href.includes('m2c2017final')) { // 预演环境
      Vue.prototype.base = 'http://api.m2c2017final.com/'
      Vue.prototype.localbase = 'http://api.m2c2017final.com:80/'
    }
    else if (href.includes('localhost')) { // 本地环境
      Vue.prototype.base = 'http://api.m2c2017local.com:80/'
      Vue.prototype.localbase = 'http://api.m2c2017local.com:80/'
    }

    else { // 演示环境
      Vue.prototype.base = 'http://api.m2c2017.com:80/'
      Vue.prototype.localbase = 'http://api.m2c2017.com:80/'
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
  // 扩展ajax
  {
    let _ajax = $.ajax
    let that = this
    $.ajax = function (options) {
      let _success = 'success' in options ? options.success : function () { return }
      let _error = 'error' in options ? options.error : function () { return }
      // if(!sessionStorage.getItem("dealerId") || sessionStorage.getItem("dealerId")==''){
      //   window.href = window.location.origin
      //   return
      // }
      let _options = $.extend(options, {
        headers:{'attach':(sessionStorage.getItem('mUser')!=null||sessionStorage.getItem('mUser')!=undefined)?getattach():"",
        'X-Authorization': sessionStorage.getItem('token')},
            // 在排除登录验证用url  其他的请求都check是否有dealerId  没有的情况(清除缓存)调用登出接口
        beforeSend:function(XMLHttpRequest){
          console.log('options  -------------'   ,options.url)
          let TheUrl = options.url.toString()
          // let urlArray = 
          console.log(null)

          if((TheUrl.indexOf('m2c.users/user/dlogin')==-1)&&(TheUrl.indexOf('m2c.users/user/findPassword')==-1)&&(TheUrl.indexOf('m2c.users/user/sendSms')==-1)){
            console.log(0)
            if((JSON.parse(sessionStorage.getItem('mUser'))||JSON.parse(sessionStorage.getItem('mToken')))== null || undefined ||''){
              alert(1)    
              window.location.href = window.location.origin}
          }
      },  
        success: function (result) {
          if (result.status === 800000 || result.status === 800001 || result.status === 800002 || result.status === 800003 || result.status === 800004) {
            // showTip(result.errorMessage)
            sessionStorage.clear()
            sessionStorage.setItem('loginout', 1)//此段代码意思是在登录页判断 是否需要登出 然后调用登出接口
            window.location.href = window.location.origin
            return
          }
          _success(result)
        }
      })
      _ajax(_options)
    }
  }
  // 封装客户端操作对象
  function getattach(){
    let attach;
    if(sessionStorage.getItem('mUser')){
      let userInfo =JSON.parse(sessionStorage.getItem('mUser'))
      attach={userName:encodeURI(userInfo.dealerName),userId:userInfo.dealerId,browserInfo:browserInfo(),ip:'127.0.0.1',userType:1};
      return JSON.stringify(attach)
    }
  }
  // 抓取浏览器客户端函数
  function browserInfo (){
    var browserInfo={system:'',appName:'',version:''}
    var agent = navigator.userAgent.toLowerCase() ;
    var system = agent.split(' ')[1].split(' ')[0].split('(')[1];
    browserInfo.system=system;
    var regStr_edge = /edge\/[\d.]+/gi;
    var regStr_ie = /trident\/[\d.]+/gi ;
    var regStr_ff = /firefox\/[\d.]+/gi;
    var regStr_chrome = /chrome\/[\d.]+/gi ;
    var regStr_saf = /safari\/[\d.]+/gi ;
    var regStr_opera = /opr\/[\d.]+/gi;
    //IE
    if(agent.indexOf("trident") > 0){
      browserInfo.appName=agent.match(regStr_ie)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_ie)[0].split('/')[1]
      return browserInfo;
    }
    //Edge
    if(agent.indexOf('edge') > 0){
      browserInfo.appName=agent.match(regStr_edge)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_edge)[0].split('/')[1];
      return browserInfo;
    }
    //firefox
    if(agent.indexOf("firefox") > 0){
      browserInfo.appName=agent.match(regStr_ff)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_ff)[0].split('/')[1];
      return browserInfo;
    }
    //Opera
    if(agent.indexOf("opr")>0){
      browserInfo.appName=agent.match(regStr_opera)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_opera)[0].split('/')[1];
      return browserInfo;
    }
    //Safari
    if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0){
      browserInfo.appName=agent.match(regStr_saf)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_saf)[0].split('/')[1];
      return browserInfo;
    }
    //Chrome
    if(agent.indexOf("chrome") > 0){
      browserInfo.appName=agent.match(regStr_chrome)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_chrome)[0].split('/')[1];
      return browserInfo;
    }else{
      // arr.push('请更换主流浏览器，例如chrome,firefox,opera,safari,IE,Edge!')
      return browserInfo;
    }
  }
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
