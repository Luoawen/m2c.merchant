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
            <el-dropdown-item><div @click="goto"  path='/s/userInfo'> <i   path='/s/userInfo'   class=" icon iconfont">&#xe688;</i> 账户信息</div></el-dropdown-item>
            <el-dropdown-item><div @click="goto" path='/s/updatePass'><i  path='/s/updatePass' class=" icon iconfont">&#xe689;</i> 登录密码</div></el-dropdown-item>
            <el-dropdown-item><div @click="goto" path='/s/cashPass'><i  path='/s/cashPass' class=" icon iconfont">&#xe67e;</i> 交易密码</div></el-dropdown-item>
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
			</div>
      <div class="public_nav" @click="slide"><i class="nav_count"></i>结算</div>
      <div class="content_container">
				<div path='/s/countQuery' class="content_s">结算查询</div>
			</div>
      <div class="public_nav" @click="slide" ><i class="nav_marketing"></i>营销</div>
      <div class="content_container">
				<div path='/s/marketingTools' class="content_s">工具</div>
			</div>
      <!-- <div class="public_nav" path='/s/data'><i class="nav_data"></i>数据</div> -->
      <div class="public_nav" @click="slide"><i class="nav_setting"></i>设置</div>
      <div class="content_container">
				<div path='/s/information' class="content_s">店铺信息</div>
				<div path='/s/administer' class="content_s">品牌管理</div>
				<div path='/s/formwork' class="content_s">运费模板</div>
				<div path='/s/address' class="content_s">通用设置</div>
			</div>
    </div>
    <div class="right_nav">
      <i></i>
      <a @click="goto_right_nav($event,0)" path='/s/home' style='padding-right: 5px; text-decoration: none;'>首页</a>
      <router-link v-for='item in breadArray'  :key='item.id' :to="{name:item.goto}" class="right_nav_content " > {{item.breadObjName}}</router-link>
    </div>
    <!-- 商家提示框样式 -->
    <div class="modal_refund_bg" v-show="sign_out_tip.isShow"></div>
    <!-- 退出-->
    <div class="modal_refund_s" v-show="sign_out_tip.isShow">
      <div class="modal_refund_top">提示<div class="modal_refund_close"  @click="sign_out_tips_close"></div></div>
      <div class="modal_refund_content">是否退出商家平台?</div>
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
        breadArray:[],
        life: 'beforeCreate',
        sign_out_tip: { isShow: false },
        three_level: '',
        dealerName: JSON.parse(sessionStorage.getItem('mUser')).dealerName
      }
    },
    methods: {
      slide (event) {
        let target1 = event.currentTarget.nextSibling.nextSibling
        //console.log(target1)
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
        console.log('元素', that.$(event.target).text())
        let path = event.target.getAttribute('path')
        if (!path) return
        that.$goRoute({path: path})
        console.log(path)
        Array.from(document.querySelectorAll('[path]')).map(function (x) {
          that.$(x).removeClass('avter')
        })
        that.$('[path="' + path + '"]').addClass('avter')
        // sessionStorage.setItem('Path', '')
        // sessionStorage.setItem('startTime', '')
        // sessionStorage.setItem('endTime', '')
        // sessionStorage.setItem('statusFlag', '')
        // sessionStorage.setItem('trailStatus', '')
        // sessionStorage.setItem('replyStatus', '')
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
      goto_right_nav (event,index) {
        let that = this
        let path = event.target.getAttribute('path')
        if (!path) return
        that.$goRoute({path: path})
        sessionStorage.setItem('Path', '')
        if (path === '/s/home') {
          that.$('.right_nav_content').attr('path', path)
          that.$('.right_nav_content').text('')
          that.active_path = ' '
          that.$('#public_nav_three_level').text('')
          return
        }
        that.$('.right_nav_content').attr('path', path)
        that.active_path = ' ' + '>' + ' ' + that.$(event.target).text()
        that.$('#public_nav_three_level').text('')
      },
      show_tips: function (content, title = '提示') {
        let that = this
        document.querySelector('#modal_tipLabel').innerHTML = title
        document.querySelector('#modal_tip_content').innerHTML = content
        that.$('#modal_tip').modal('show')
      },
      change(){
        let path = this.$route.meta.pathR!=undefined?this.$route.meta.pathR:this.$route.path
        console.log('--path',path)
        this.$nextTick(()=>{
          this.$('.content_s').removeClass('avter')
          this.$('.public_nav').removeClass('avter')
          this.$('[path="' + path + '"]').addClass('avter')
          this.$('[path="' + path + '"]').parent(".content_container").css('display','block')
          if(this.$route.meta.title==''||this.$route.meta.title==undefined){
            document.title = '商家平台-拍获'
            this.$('.right_nav_content').text('')
          }else{
            document.title = this.$route.meta.title+'-商家平台-拍获'
            this.breadArray=this.$route.meta.breadObj
          }
        })
      }
    },
    mounted () {
      let that = this
      window.onbeforeunload = function () {
        console.log('sessionStorage',sessionStorage)
        sessionStorage.setItem('active_path', that.$('.right_nav_content').text())
      }
    },
    created() {
     // 组件创建完后获取数据，
     // 此时 data 已经被 observed 了
     this.change();
    },
    beforeCreate () {
      //document.title = '拍获-商家平台'
      document.querySelector('#favicon').href = '/static/favicon_s.ico'
      if (!sessionStorage.getItem('mToken')) {
        this.$goRoute({path: '/slogin'})
        return
      }
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
  background: #F4F5FA; 
  height: 100%;
}
  ::-ms-reveal{display: none;}
  label{font-weight: normal;}
  select {
      width:100%;height:34px;border:solid 1px #d8dce5;font-size:12px;line-height:34px;border-radius:3px;margin-top:7px;
      padding-right: 14px;padding-left:10px;
      appearance:none;
      -moz-appearance:none;
      -webkit-appearance:none;
      background: url(../assets/images/ico_arrows.png) no-repeat scroll right center transparent;
    }
  i.changeGood{line-height:30px;width:24px;height:14px;background:url(../assets/images/ico_huan.png) no-repeat 0 0;display:inline-block;margin-right:6px;}
  i.red{
    color: red;display:inline-block;padding-right:6px;font-size:12px;
		font-style: normal;
  }
  i.redTip{
    padding-left:10px;
    padding-top:10px;
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
    margin:25px;
    margin-top:145px;
    min-height: 500px;
    padding:25px;
    background-color: #fff;
    position: relative;
    box-sizing: border-box;
    .searcWrap{width:100%;height:auto;position:relative;}
    .line{height:1px;margin-left:-25px;margin-right:-25px;background:#dfe4ed;position:absolute;width:100%;top:49px;}
  }
  .clear{
    clear: both;
    overflow: hidden;
  }
  ul{list-style:none;}
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
        list-style: none;
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
      background:#4E8FF5 ;
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
      z-index: 99; // top: 4.29rem;
      width: 200px; // height: 99999999px;
      line-height: 50px;
      background: #505562;
      color: #B0B8BD;
      // text-align: center;
      padding-top: 7rem;
      padding-bottom:1rem;
      height:100%;
      box-sizing:border-box;
      margin-top: 0rem;
      margin-bottom: 0px;
      min-width: 100px;
      .content_container {
        background: #505562;
      }
      .content_s {
        height: 40px;
        line-height: 40px;
        color: #fff;
        padding-left: 40px;
        font-size: 13px;
        cursor: pointer;
        background: #494E5A;
      }
      .avter {
        background: #4E8FF5; // color: #fff;
      }
      // .content_s:hover {
      //   color: #B7CAE2;
      // }
      i {
        position: absolute;
        top: 50%;
        margin-top: -12px;
        left: 21px;
        width: 22px;
        height: 22px;
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
      .nav_count {
        background: url(../assets/images/nav_clearing.png) no-repeat;
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
        display: inline-block;
        cursor: pointer;
        text-decoration: none;
        //增大响应
        background-origin: content-box;
        background-clip: content-box;
        margin-right: 10px;
      }
      // span {
      //   margin: 5px;
      // }
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
        // width: 30px;
        cursor: pointer;
        color: #2699FF;
        font-size: 14px;
        float: left;
      }
      i {
        background: url(../assets/images/ico_home.png) no-repeat;
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
    // .ico_msg{
    //   width: 16px;
    //   height: 16px;
    //   display: inline-block;
    //   background: url(../assets/images/ico_msg.png);
    //   cursor: pointer;
    //   position: relative;
    //   font-style: normal;
    // }
    // .ico_msg:hover .ico-tit{
    //   display: block;
    // }
    // .ico-tit{
    //   display: none;
    //   color: #333;
    //   font-size: 12px;
    //   position:absolute;
    //   border: 1px solid #F5BD23;
    //   box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
    //   border-radius: 2px;
    //   width: 228px;
    //   min-height: 82px;
    //   background: #fff;
    //   padding: 10px;
    //   top: 20px;
    //   left: -100px;
    //   word-break:break-all;
    //   z-index:3;
    // }
  }
  @media print {.title{display: none;}.left_nav{display: none;}.right_nav{display: none;}.s{padding-left: 0px;}.printSendOrder{height:1000px;margin: 0px;font-size: 8px;position: absolute;top: -300px;}a{display: none;}}
  table th:nth-child(1),table td:nth-child(1){padding-left:30px;}
  
}
.searcWrap{
  a.gjsort{white-space:nowrap;}
}
/*高级搜索*/
.soloSearchBox{position:absolute;top:0;left:0;height:auto;padding:10px 20px;width:100%;background:#fff;z-index:2;
box-shadow:0 2px 4px 0 rgba(0,0,0,0.10);border-left:1px solid rgba(0, 0, 0, 0.1);border-right:1px solid rgba(0, 0, 0, 0.1);
    h4 a.close{
      opacity:1;display:inline-block;width:24px;height:24px;float:right;background:url(../assets/images/ico_close.png) no-repeat center center;
    }
    .searcWrap{width:100%;height:auto;position:relative;}
    .mess{
      margin-top: 30px;padding:0px 40px;padding-bottom:30px;background:#fff;
      h4{
        line-height:50px;
        margin-bottom:10px;
        font-size:16px;
        color:#333;
      }
      .inline{display:inline-block;line-height:50px;}
      .modify{margin-left:10px;line-height:50px;width:16px;height:16px;background:url(../assets/images/ico_compile.png) no-repeat center center;}
    }
    .alginRight{text-align: right; line-height:50px;color:#666;}
    .formControl{display:inline-block;width:100%;height:36px;padding:6px 12px; line-height:50px;font-size:14px;background:#fff;border:1px solid #ccc;border-radius:4px;}
    .el-row:last-child{margin-top:20px;}
  }
</style>
