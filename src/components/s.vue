<template>
  <div class="s">
    <div class="title">
      <div class="left_title">
        <i class="logo"></i>
        <span>拍获 |</span>
        <span class="logo_sty">商家平台</span>
      </div>
      <div class="right_title">
        <el-dropdown trigger="click" class="right_title_name">
          <span class="el-dropdown-link">
            {{dealerName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item><div @click="goto" path='/s/userInfo'>账户信息</div></el-dropdown-item>
            <el-dropdown-item><div @click="goto" path='/s/updatePass'>登录密码</div></el-dropdown-item>
            <el-dropdown-item><div @click="goto" path='/s/cashPass'>交易密码</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="right_title_quit" @click="sign_out_tips">退出</div>
      </div>
    </div>
    <div class="left_nav" @click="goto">
      <div class="public_nav" path='/s/home'><i class="nav_home"></i>首页</div>
      <div class="public_nav" @click="slide"><i class="nav_order"></i>订单</div>
      <div class="content_container">
				<div path='/s/bug' class="content_s">订货单</div>
				<div path='/s/afterSale' class="content_s">售后单</div>
			</div>
      <div class="public_nav" @click="slide"><i class="nav_change"></i>商品</div>
      <div class="content_container">
				<div path='/s/goodList' class="content_s">商品列表</div>
				<div path='/s/goodAppraise' class="content_s">商品评价</div>
			</div>
      <div class="public_nav" @click="slide"><i class="nav_asset_m"></i>资金</div>
      <div class="content_container">
				<div path='/s/survey' class="content_s">资金概况</div>
				<div path='/s/detail' class="content_s">收支明细</div>
				<div path='/s/record' class="content_s">提现记录</div>
				<div path='/s/countQuery' class="content_s">结算查询</div>
			</div>
      <div class="public_nav" @click="slide" ><i class="nav_marketing"></i>营销</div>
      <div class="content_container">
				<div path='/s/marketing' class="content_s">工具</div>
			</div>
      <div class="public_nav" path='/s/data'><i class="nav_data"></i>数据</div>
      <div class="public_nav" @click="slide"><i class="nav_setting"></i>设置</div>
      <div class="content_container">
				<div path='/s/information' class="content_s">店铺信息</div>
				<div path='/s/administer' class="content_s">品牌管理</div>
				<div path='/s/formwork' class="content_s">运费模板</div>
				<div path='/s/address' class="content_s">售后地址</div>
				<!-- <div path='/s/cashPass' class="content_s">交易密码</div> -->
			</div>
      <!-- <div class="public_nav" path='/s/updatePass'><i class="nav_setting"></i>修改密码</div> -->
    </div>
    <div class="right_nav">
      <i></i>
      <a @click="goto_right_nav" path='/s/home'>首页</a>
      <div class="right_nav_content" path='' @click="goto_right_nav"></div>
      <div id="public_nav_three_level"></div>
    </div>
    <!-- 供应商提示框样式 -->
    <div class="modal_refund_bg" v-show="sign_out_tip.isShow"></div>
    <!-- 退出-->
    <div class="modal_refund_s" v-show="sign_out_tip.isShow">
      <div class="modal_refund_top">提示<div class="modal_refund_close"  @click="sign_out_tips_close"></div></div>
      <div class="modal_refund_content">是否退出供应商服务平台?</div>
      <div>
        <button class="button_refund1" @click="sign_out">退出</button>
        <button class="button_refund2" @click="sign_out_tips_close">取消</button>
      </div>

    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        life: 'beforeCreate',
        sign_out_tip: { isShow: false },
        three_level: '',
        dealerName: JSON.parse(sessionStorage.getItem('mUser')).dealerName
      }
    },
    methods: {
      slide (event) {
        let target1 = event.currentTarget.nextSibling.nextSibling
        console.log(target1)
        this.$(target1).slideToggle(200)
      },
      // 退出提示框
      sign_out_tips () {
        this.sign_out_tip.isShow = true
      },
      // 关闭提示框
      sign_out_tips_close () {
        this.sign_out_tip.isShow = false
      },
      // 点击退出
      sign_out () {
        sessionStorage.clear()
        this.$router.push({path: '/slogin'})
      },
      // 左侧导航跳转
      goto (event) {
        let that = this
        //alert(0)
        console.log('元素', that.$(event.target).text())
        let path = event.target.getAttribute('path')
        if (!path) return
        that.$goRoute({path: path})
        console.log(path)
        Array.from(document.querySelectorAll('[path]')).map(function (x) {
          that.$(x).removeClass('avter')
        })
        that.$('[path="' + path + '"]').addClass('avter')
        sessionStorage.setItem('Path', '')
        sessionStorage.setItem('startTime', '')
        sessionStorage.setItem('endTime', '')
        sessionStorage.setItem('statusFlag', '')
        sessionStorage.setItem('trailStatus', '')
        sessionStorage.setItem('replyStatus', '')
        // if (path === '/s/home') {
        //   that.$('.right_nav_content').attr('path', path)
        //   that.$('.right_nav_content').text('')
        //   that.$('#public_nav_three_level').text('')
        //   return
        // }
        // that.$('.right_nav_content').attr('path', path)
        // that.$('.right_nav_content').text(' > ' + that.$(event.target).text())
        // that.$('#public_nav_three_level').text('')
      },
      // 右侧导航跳转
      goto_right_nav (event) {
        let that = this
        console.log('元素', that.$(event.target).text())
        let path = event.target.getAttribute('path')
        if (!path) return
        that.$goRoute({path: path})
        console.log(path)
        Array.from(document.querySelectorAll('[path]')).map(function (x) {
          that.$(x).removeClass('avter')
        })
        that.$('[path="' + path + '"]').addClass('avter')
        sessionStorage.setItem('Path', '')
        if (path === '/s/home') {
          that.$('.right_nav_content').attr('path', path)
          that.$('.right_nav_content').text('')
          that.active_path = ' '
          that.$('#public_nav_three_level').text('')
          return
        }
        that.$('.right_nav_content').attr('path', path)
        // that.active_path = ' ' + '>' + ' ' + that.$(event.target).text()
        that.$('#public_nav_three_level').text('')
      },
      show_tips: function (content, title = '提示') {
        let that = this
        document.querySelector('#modal_tipLabel').innerHTML = title
        document.querySelector('#modal_tip_content').innerHTML = content
        that.$('#modal_tip').modal('show')
      },
      change(){
        console.log(this.$route.path)
        console.log(this.$route.meta.title)
        let path = this.$route.path
        this.$nextTick(()=>{
          this.$('.content_s').removeClass('avter')
          this.$('[path="' + this.$route.path + '"]').addClass('avter')
          this.$('[path="' + this.$route.path + '"]').parent(".content_container").css('display','block')
          if(this.$route.meta.title==''||this.$route.meta.title==undefined){
            this.$('.right_nav_content').text('')
          }else{
            this.$('.right_nav_content').text(' > ' + this.$route.meta.title)
          }
        })
      }
    },
    mounted () {
      let that = this
      // window.onpopstate = function() {
      //   window.location.reload();
      //  };
      if (sessionStorage.length === 0) {
        that.$goRoute({path: '/slogin'})
        return
      }
      window.onbeforeunload = function () {
        sessionStorage.setItem('active_path', that.$('.right_nav_content').text())
      }
    },
    created() {
     // 组件创建完后获取数据，
     // 此时 data 已经被 observed 了
     this.change();
    },
    beforeCreate () {
      document.title = '一拍即获-商家平台'
      document.querySelector('#favicon').href = '/static/favicon_s.ico'

    },
    watch: {
      '$route':"change"
    }
  }
</script>


<style lang="scss">
// 忘记密码弹窗样式
//评价回复弹出
// 退款弹窗样式
html {
  font-size: 14px
}

// @media screen and (min-width:1024px) and (max-width:1199px){html{font-size:10px}}
// @media screen and (min-width:1200px) and (max-width:1439px){html{font-size:14px}}
// @media screen and (min-width:1440px) and (max-width:1680px){html{font-size:16px}}
// @media screen and (min-width:1681px) and (max-width:1920px){html{font-size:18px}}

body {
  background: #F4F5FA; // height: 100%;
}
  div.icon{
    width:16px;height:16px; display:inline-block; position:relative;
    background:url(../assets/images/ico_explain.png) no-repeat 0 0;
    div.tips{display:none;width:100px;height:auto;background:#fff;
      border:1px solid #E5E5E5;border-radius: 4px;
      box-shadow: 0 1px 0 0 #E5E5E5;position: absolute;
      top:18px;left:0px; text-indent: 0;padding:6px;font-weight:normal;
      p{line-height:24px;font-size:12px; color:#666;}
    }
  }
  div.icon:hover div.tips{display:block;}
  .content{
    width: 100%;
    min-height: 500px;
    padding:15px;
    background-color: #fff;
    position: relative;
    .searcWrap{width:100%;height:auto;position:relative;}
  }
  .clear{
    clear: both;
    overflow: hidden;
  }
  .ellipsis{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .ellipsis2{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  a.ellipsis2{
    color:#5a5e66;
  }
  a.ellipsis2:hover{ text-decoration:none;}
  .fl{float:left;}
  .fr{float:right;}
  .width190{width:190px;}
* {
  margin: 0;
  padding: 0;
  .s {
    width: 100%;
    padding-left: 200px;
    // padding-left: 10%;
    // height: 100%;
    // background: #F4F5FA;
    position: relative;
    z-index: 1;
    margin-top: 120px;
    .show_tip_cover {
      display: block;
    }
    .modal_refund_bg {
      position: fixed;
      z-index: 9999;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      opacity: 0.3;
      background: #000000;
      filter: Alpha(opacity=30);
    }
    // 退出提示框
    .modal_refund_s {
      width: 500px;
      height: 300px;
      position: fixed;
      z-index: 99999;
      top: 50%;
      left: 50%;
      margin-left: -250px;
      margin-top: -150px;
      background: #fff;
      .public_span_refund {
        font-size: 14px;
        color: #666666;
        margin-right: 20px;
      }
      .public_span_p1 {
        line-height: 40px;
      }
      .public_span_p2 {
        line-height: 80px;
        vertical-align: top;
      }
      .public_span_p3 {
        position: absolute;
        top: 50px;
        left: 8px;
      }
      .modal_refund_top {
        position: relative;
        line-height: 50px;
        text-align: center;
        background: #DFE9F6;
        font-size: 16px;
        font-weight: 600;
        color: #666666;
        border-radius: 4px 4px 0 0;
        .modal_refund_close {
          width: 24px;
          height: 24px;
          cursor: pointer;
          position: absolute;
          top: 10px;
          right: 5px;
          background: url(../assets/images/ico_close.png) no-repeat;
        }
      }
      .modal_refund_content {
        margin: 60px 125px;
        font-size: 20px;
        color: #333333;
      }
      ul {
        margin-top: 30px;
        margin-left: 40px;
        list-style-type: none;
        li {
          margin-bottom: 10px;
          position: relative;
          a {
            font-size: 14px;
            color: #0086FF;
            cursor: pointer;
          }
        }
      }
      input {
        width: 200px;
        height: 40px;
        padding-left: 10px;
        margin-right: 20px;
        border: 1px solid #E5E5E5;
        font-size: 14px;
        color: #999999;
      }
      textarea {
        width: 344px;
        height: 80px;
        padding-left: 10px;
        padding-top: 8px;
        border: 1px solid #E5E5E5;
        font-size: 14px;
        color: #999999;
        resize: none;
      }
      button {
        width: 100px;
        height: 40px;
        border: none;
        border-radius: 2px;
      }
      .button_refund1 {
        // margin-top: 20px;
        margin-left: 140px;
        margin-right: 8px;
        background: #0086FF;
        font-size: 14px;
        color: #FFFFFF;
      }
      .button_refund2 {
        border: 1px solid #CCCCCC;
        border-radius: 2px;
        font-size: 14px;
        color: #999999;
        background: #fff;
      }
    }
    input:focus {
      // border: 0;
      outline: none;
    }
    .title {
      position: fixed;
      z-index: 999;
      top: 0px;
      left: 0px;
      height: 4.29rem;
      padding-left: 5.57rem;
      width: 100%;
      line-height: 4.29rem;
      font-size: 1.43rem;
      color: #F2FAFA;
      background-image: linear-gradient(-269deg, #2F9CFF 0%, #0086FF 44%, #0078E4 100%);
      .left_title {
        position: relative;
        font-weight: 600;
        font-size: 20px;
        .logo {
          // display: block;
          position: absolute;
          top: 1.21rem;
          left: -2.86rem;
          width: 2rem;
          height: 1.88rem;
          background: url(../assets/images/bg_logo.png) no-repeat;
        }
        .logo_sty {
          // margin-left: 11px;
          font-size: 16px;
        }
      }
      .right_title {
        position: absolute;
        font-size: 14px;
        top: 0px;
        right: 0px;
        width: 500px;
        height: 60px;
        line-height: 60px;
        color: #fff;
        .right_title_name {
          position: absolute;
          top: 0px;
          right: 80px;
          // width: 100px;
          color: #fff;
        }
        .right_title_quit {
          position: absolute;
          top: 0px;
          right: 50px;
          cursor: pointer;
          text-decoration:underline;
        }
      }
    }
    .left_nav {
      position: fixed;
      top: 0px;
      left: 0px;
      z-index: 999; // top: 4.29rem;
      width: 200px; // height: 99999999px;
      line-height: 50px;
      background: #505562;
      color: #B0B8BD;
      // text-align: center;
      padding-top: 3rem;
      padding-bottom:1rem;
      height:100%;
      box-sizing:border-box;
      margin-top: 4.29rem;
      margin-bottom: 0px;
      min-width: 100px;
      .avter {
        background: #0078E4; // color: #fff;
      }
      .content_container {
        background: #494D5A;
      }
      .content_s {
        height: 40px;
        line-height: 40px;
        color: #fff;
        padding-left: 40px;
        font-size: 13px;
        cursor: pointer;
      }
      .content_s:hover {
        color: #B7CAE2;
      }
      i {
        position: absolute;
        top: 50%;
        margin-top: -12px;
        left: 21px;
        width: 24px;
        height: 24px;
      }
      .public_nav {
        position: relative;
        padding-left: 54px;
        color: #fff;
        cursor: pointer;
      }
      .nav_home {
        background: url(../assets/images/nav_home.png) no-repeat;
      }
      .nav_order {
        background: url(../assets/images/nav_order.png) no-repeat;
      }
      .nav_change {
        background: url(../assets/images/nav_commodity.png) no-repeat;
      }
      .nav_asset_m {
        background: url(../assets/images/nav_finance.png) no-repeat;
      }
      .nav_marketing {
        background: url(../assets/images/nav_marketing.png) no-repeat;
      }
      .nav_data {
        background: url(../assets/images/nav_sell.png) no-repeat;
      }
      .nav_setting {
        background: url(../assets/images/nav_set.png) no-repeat;
      }
    }
    .right_nav {
      position: fixed;
      top: 60px;
      left: 0px;
      z-index: 999;
      width: 100%;
      margin-left: 200px;
      height: 60px;
      line-height: 60px;
      padding-left: 3.29rem;
      border-bottom: none;
      background: #fff;
      .right_nav_content {
        float: left;
        margin-left: 5px;
        cursor: pointer;
      }
      span {
        margin: 5px;
      }
      .public_nav_click {
        cursor: pointer;
        height: 50px;
        float: left;
      }
      #public_nav_three_level {
        float: left;
        background: #fff;
        z-index: 2;
        margin-left: 5px;
      }
      a {
        width: 30px;
        cursor: pointer;
        color: #2699FF;
        font-size: 14px;
        float: left;
      }
      i {
        background: url(../assets/images/nav_home.png) no-repeat;
        display: block;
        position: absolute;
        top: 20px;
        left: 1.43rem;
        width: 1.14rem;
        height: 1.14rem;
      }
    } //表格样式
    // .bootstrap-table {
    //   // width: 100%;
    //   thead {
    //     height: 37px;
    //   }
    // }
    .table-striped tbody tr:nth-of-type(odd) {
      background: #F4F5FA;
      font-size: 14px;
      color: #333333;
    }
    .table-striped tbody tr:nth-of-type(even) {
      background: #EFF2F8;
      font-size: 14px;
      color: #333333;
    }
    .bootstrap-table thead tr {
      background: #DFE9F6;
      font-size: 14px;
      color: #333333;
    }
    .ico_msg{
      width: 16px;
      height: 16px;
      display: inline-block;
      background: url(../assets/images/ico_msg.png);
      cursor: pointer;
      position: relative;
      font-style: normal;
    }
    .ico_msg:hover .ico-tit{
      display: block;
    }
    .ico-tit{
      display: none;
      color: #333;
      font-size: 12px;
      position:absolute;
      border: 1px solid #F5BD23;
      box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
      border-radius: 2px;
      width: 228px;
      min-height: 82px;
      background: #fff;
      padding: 10px;
      top: 20px;
      left: -100px;
      word-break:break-all;
      z-index:3;
    }
  }
  @media print {.title{display: none;}.left_nav{display: none;}.right_nav{display: none;}.s{padding-left: 0px;}.printSendOrder{height:1000px;margin: 0px;font-size: 8px;position: absolute;top: -300px;}a{display: none;}}

}
</style>
