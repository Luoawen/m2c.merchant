<template>
  <div class="survey_contaner content clear">
    <div style="height: 10px"></div>
    <div style="padding:0 10px"><strong>我的资产</strong><a class="ruleShow fr" @click="ruleShow">结算规则说明</a></div>
    <el-row class="survey_c_top clear" :gutter="20">
      <el-col :span='6'>
        <div class="survey_c_tbox">
          <div class="tit">
            <span>待结算金额（元）</span>
            <div class="icon">
              <div class="tips">
                <p>客户付款后，待系统结算的金额</p>
              </div>
            </div>
          </div>
          <div class="tit02 clear">
            <span style="font-size: 30px">{{content.settleAmount == undefined || '' ? '-' :(content.settleAmount)}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="survey_c_tbox">
          <div class="tit">
            <span>提现中金额（元）</span>
            <div class="icon">
              <div class="tips">
                <p>待处理的提现金额</p>
              </div>
            </div>
            <router-link class="fr" :to="{name:'record'}">详情</router-link>
          </div>
          <div class="tit02 clear">
            <span style="font-size: 30px">{{content.tradableingAmount ==  null ? '-' : (content.tradableingAmount)}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="survey_c_tbox">
          <div class="tit">
            <span>平台质保金（元）</span>
          </div>
          <div class="tit02 clear">
            <span style="font-size: 30px">{{platePositisCache == undefined || '' ? '-' : platePositisCache}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="survey_c_tbox">
          <div class="tit">
            <span>可用金额（元）</span>
            <div class="icon">
              <div class="tips">
                <p>已结算的金额，可用金额可提现</p>
              </div>
            </div>
          </div>
          <div class="tit02 clear">
            <span style="font-size: 30px">{{content.tradableAmount == undefined ? '-' : (content.tradableAmount)}}</span>
            <el-button @click="pullMoney()" size="mini" type="primary" class="fr">提现</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div style="height: 20px"></div>
    <div style="height: 30px;padding:0 10px;"><strong>提现记录</strong></div>
    <div class="survey_c_cen clear">
      <table class="col-sm-12 notetable">
        <thead>
          <tr>
            <td width="25%">提现单号</td>
            <td width="20%">申请金额/元</td>
            <td width="20%">提现状态</td>
            <td width="25%">申请时间</td>
          </tr>
        </thead>
        <tbody v-if="contents.length==0">
          <tr>
            <td colspan="4" style='background:#fff;text-align:center;line-height:60px;color:#5a5e66;'>暂无数据</td>
          </tr>
        </tbody>
        <tbody v-if="contents.length>0">
          <tr v-for="item in contents" class="clear">
            <td>{{item.withdrawalId}}</td>
            <td>{{(item.amount)}}</td>
            <td>{{item.wdStatus == 0?'处理中':item.wdStatus == 1?'待审批':item.wdStatus == 2?'待转账':item.wdStatus == 3?'不通过':item.wdStatus == 4?'已转账':item.wdStatus == 5?'作废':'-'}}</td>
            <td>{{date_format(new Date(item.createdTime), 'yyyy-MM-dd hh:mm:ss')  }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="block" style="margin: 20px;float: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="goodsCheckStorePageRows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 规则弹框 -->
    <div class="hptczp" v-show="backgroundBg"></div>
    <div class="hptczp_content inputInfo" v-show="ruleShowBox" style="height:360px">
      <div class="hptczp_header">
        <span>结算规则</span>
        <span class="iconfont fr" @click="ruleClose">&#xe661;</span>
      </div>
      <div class="hptczp_body textIndent" style='text-align:left;margin-top:-20px;margin-left:20px'>
        <h5>待结算金额</h5>
        <p><span>1、</span>顾客完成付款后，款项先显示在待结算金额中；</p>
        <p><span>2、</span>当日订单总金额不一定等于当日待结算金额；</p>
        <p><span>1）</span>下单时间、付款时间可能不在同一天；</p>
        <p><span>2）</span>商家退款成功，待结算金额相应扣除；</p>
        <h5>结算时间、方式</h5>
        <p><span>1、</span>订单交易完成（关闭）T+7工作日结算款项到商家可用金额，结算之前款项显示在待结算金额；</p>
        <p><span>2、</span>结算后，款项进入商家可用金额的同时结算服务费、活动分摊，商家可用余额可提现。若需要查询单号是否已经结算，可在结算查询中查看结算状态。</p>
      </div>
    </div>
    <!-- 是否有交易密码 -->   
    <div class='hptczp' v-show="cashPassShow"></div>
    <div class="hptczp_content " v-show="cashPassShow">
      <div class="hptczp_header">
        <span>提示</span>
        <span class="iconfont fr" @click="cashPassHide">&#xe661;</span>
      </div>
      <div class="hptczp_body">
        <h5>是否设置交易密码</h5>
        <p>您还未设置交易密码</p>
      </div>
      <div class="hptczp_footer">
        <el-button  @click="cashPassHide">取消</el-button>&nbsp;
        <el-button type="primary" @click='showTransaction=true;cashPassShow =false'>确定</el-button>
      </div>
    </div>
        <!-- 设置交易密码 -->   
    <div class='hptczp' v-show="showTransaction"></div>
    <div class="hptczp_content inputInfo clear" v-show="showTransaction">
      <div class="hptczp_header ">
        <span>设置交易密码</span>
        <span class="iconfont fr" @click="cancel">&#xe661;</span>
      </div>
      <div class="hptczp_body" style='height:180px,vertical-align:middle'>
        <!-- <div>
          &nbsp;&nbsp;&nbsp;<label style="color: red">*</label>验证码
          <input type="text" class="formControl" id="verifyCode" v-model="Info.verifyCode" placeholder="4位数验证码" maxlength="4">
            <el-button  style='width:80px;float:right;margin-right:26px' type="plain" @click="sendVerficode" :disabled="disabled"> 
              <span v-show="show" id="sendVer">获取验证码</span><span v-show="!show" class="count">{{count}} s</span> 
            </el-button> 
              <p  v-show="isSuccess" style='font-size:12px;color:#ccc;text-align:left;margin:4px 0 -10px 76px' >已向手机号<label style="color:red;">{{userPhone}}</label>发送验证码</p>
        </div>
      <div>
        <label style="color: red">*</label>交易密码
        <input type="password" class="formControl" id="newPass" v-model="Info.newPass"  minlength="6" maxlength="6" placeholder="6位数字密码">
      </div>
      <div><label style="color: red">*</label>再次确认 
        <input type="password" class="formControl" id="confirmNewPass" v-model="Info.confirmNewPass" maxlength="6" minlength="6"  placeholder="6位数字密码">
      </div> -->
            <el-row :gutter="10" >
            <el-col  :span="3" :offset="1" > <label style="color: red">*</label>验证码</el-col>
            <el-col  :span="8" > <input type="text" class="formControl" id="verifyCode" v-model="Info.verifyCode" placeholder="4位数验证码" maxlength="4">
              <p  v-show="isSuccess" style='font-size:12px;color:#ccc;text-align:left;heigh：12px;line-height:12px;margin:4px 0 -6px 0' >已向手机号<span style="color: red;">{{userPhone}}</span>发送验证码</p>
            </el-col>
            <el-col :span="3"  :offset="3"> 
              <el-button  class='w100' style='box-sizing: border-box' type="plain" @click="sendVerficode" :disabled="disabled"> 
                <span v-show="show"  id="sendVer">获取验证码</span><span v-show="!show" class="count">{{count}} s</span> 
              </el-button> 
            </el-col>
          </el-row>
          <div class="clear" style="height:10px"></div>
        <el-row :gutter="10" >
            <el-col  :span="3"  :offset="1" > <label style="color: red">*</label>交易密码</el-col>
            <el-col   :span="6" >  <input type="password" class="formControl" id="newPass" v-model="Info.newPass" 
          minlength="6" maxlength="6" placeholder="6位数字密码"> </el-col>
        </el-row>
        <div class="clear" style="height:10px"></div>
        <el-row :gutter="10" >
            <el-col :span="3"  :offset="1" > <label style="color: red">*</label>再次确认 </el-col>
            <el-col :span="6" > <input type="password" class="formControl" id="confirmNewPass" v-model="Info.confirmNewPass" maxlength="6" minlength="6"  placeholder="6位数字密码"> </el-col>
        </el-row>
      </div>
      <div class="hptczp_footer clear">
         <el-row :gutter="20" style='margin-top:30px;height:60px;text-align:left' >
          <el-col   :span="6" :offset="4"  ><el-button  type="primary" @click="modify_pass()">保存</el-button> 
          <el-button type="plain"  @click="cancel">取消</el-button>
          </el-col>
       </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:'',
    data(){
      return{
        goodsCheckStorePageRows:5,
        currentPage:1,
        totalCount:0,
        content:'',
        dealerName:'',
        contents:'',
        createdTime:'',
        ruleShowBox: false, // 结算规则
        backgroundBg: false, // 弹层背景
        cashPassShow: false, // 交易密码
        showTransaction:false, //设置交易密码
        platePositisCache:'',
        payPwdSetFlag:'',// 是否有交易密码标识
         dealerId: JSON.parse(sessionStorage.getItem('mUser'))?JSON.parse(sessionStorage.getItem('mUser')).dealerId:'',
        userPhone: JSON.parse(sessionStorage.getItem('mUser')).mobile,
        show: true,
        count: sessionStorage.getItem('totalT') == null || sessionStorage.getItem('totalT') == '' ? 60 : sessionStorage.getItem('totalT'),
        total: '',
        isSuccess: false,
        masage:'',
        disabled: false,
        Info:{},
        flage:''
      }
    },
    methods:{
      ruleShow () {
        this.ruleShowBox = true
        this.backgroundBg = true
      },
      ruleClose () {
        this.ruleShowBox = false
        this.backgroundBg = false
      },
      pullMoney () {
        let that = this
        if(that.payPwdSetFlag === 1){
          that.$router.push({name:'cash'})
        }else{
          that.cashPassShow = true
        }
      }
    ,handleSizeChange(val) {
      let that = this
      that.goodsCheckStorePageRows=val
      that.amountList();
    }
    ,handleCurrentChange(val) {
      let that = this
      that.currentPage=val
      that.amountList();
    },
      cashPassHide () {
        let that = this
        that.backgroundBg = false
        that.cashPassShow = false
      },
      amount () {
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.trading/web/account/dealer/amount.web',
          data: {
            token: sessionStorage.getItem('mToken'),
            correlationId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
          },
          success: function (result) {
            if (result.status === 200){
              that.content = result.content
              console.log(that.content)
            }
          }
        })
      },
      amountList(){
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.trading/web/withdrawal/dealer/list',
          data: {
            token: sessionStorage.getItem('mToken'),
            pageNum:that.currentPage,
            rows:that.goodsCheckStorePageRows,
            correlationId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
          },
          success: function (result) {
            if (result.status === 200){
              that.contents = result.content
              that.totalCount = result.totalCount
            }
          }
        })
      },
      plateDiposit(){
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/dealer/sys/web/dealerDeposit',
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser'))?JSON.parse(sessionStorage.getItem('mUser')).dealerId:'',
          },
          success: function (result) {
            if (result.status === 200){
              that.platePositisCache = result.content
            }
          }
        })
      },
      getpayPwdSetFlag(){
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.trading/web/account/dealer/payPwdSetFlag',
          data: {
            token: sessionStorage.getItem('mToken'),
            correlationId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            correlationType:2
          },
          success: function (result) {
            if (result.status === 200){
              that.payPwdSetFlag = result.content.payPwdSetFlag
            }
          }
        })
      },
     cancel(){
        this.showTransaction = false
        this.cashPassShow = false
      },
      timekeeping () {
        let that = this
        // 把按钮设置为不可以点击
        that.show = false
        var interval = setInterval(function () { // 每秒读取一次cookie
          // 从cookie 中读取剩余倒计时
          that.total = sessionStorage.getItem('totalT')
          // 在发送按钮显示剩余倒计时
          if (that.total == 1) {
            that.count = 60
          } else {
            that.count = that.total
          }
          // 把剩余总倒计时减掉1
          that.total--
          if (that.total <= 0) { // 剩余倒计时为零，则显示 重新发送，可点击
            // 清除定时器
            clearInterval(interval)
            // 删除cookie
            sessionStorage.removeItem('totalT')
            // 显示重新发送 把发送按钮设置为可点击
            that.show = true
            if(that.flage!=='save'){
              that.$("#sendVer").text("重新发送")
            }
            that.disabled = false
            that.isSuccess = false
          } else { // 剩余倒计时不为零
            // 重新写入总倒计时
            sessionStorage.setItem('totalT', that.total)
          }
        }, 1000)
      },
      sendVerficode () {
        //alert(0)
        let that = this
        if(that.disabled == true){
          return
        }
        that.disabled = true // 把按钮设置为不可以点击
        that.$.ajax({
          url: that.base + 'm2c.users/user/sendSms',
          timeout : 5000, //超时时间设置，单位毫秒
          type: 'post',
          data: {
            token: sessionStorage.getItem('mToken'),
            codeType: 5,
            mobile: JSON.parse(sessionStorage.getItem('mUser')).mobile
          },
          success: function (result) {
            if (result.status === 200) {
              that.isSuccess = true
              sessionStorage.setItem('totalT', 60)
              that.timekeeping()
              that.show_tip('已发送短信注意查收')
            } else {
              that.show_tip(result.errorMessage)
              that.disabled = false
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
    　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
    　　　　　 //ajaxTimeoutTest.abort();
    　　　　　 that.show_tip("请求超时");
              that.disabled = false
    　　　　}
      　　}
        })
      },
      modify_pass () {
        let that = this
        let verifyCode = that.$('#verifyCode').val()
        if (verifyCode.length !== 4) {
          that.show_tip('验证码长度必须4位')
          return false
        }
        $('#newPass').bind('input propertychange',function(){ //添加监听input值的改变事件
          let tvalmum;
          //统计input输入字段的长度
          tvalnum = $(this).val().length;
          //如果大于8个字直接进行字符串截取
          if(tvalnum>16){
            var tval = $(this).val();
            tval = tval.substring(6,16);
            $(this).val(tval);
            that.show_tip('长度超过限制！');
          }
        });
        let pass = that.$('#newPass').val()
        if (pass.length < 6 || pass.length > 16) {
          that.show_tip('密码长度6-16位')
          return false
        }
        let confirmNewPass = that.$('#confirmNewPass').val()
        if (confirmNewPass !== pass) {
          that.show_tip('两次密码不一致')
          return false
        }
				that.$.ajax({
          type: 'post',
          url: that.base + 'm2c.trading/web/account/dealer/payPassword',
          data: {
            token: sessionStorage.getItem('mToken'),
						mobile: that.userPhone,
            newPass: that.md5(pass).toLowerCase(),
            verifyCode: verifyCode,
            correlationType: 2,
            correlationId: that.dealerId
          },
          success: function (result) {
            if (result.status === 200) {
              // 删除cookie
              sessionStorage.removeItem('totalT')
              // 显示重新发送 把发送按钮设置为可点击
              that.show = true
              that.isSuccess = false
              JSON.parse(sessionStorage.getItem('mUser')).dealerTradePassword = that.md5(pass).toLowerCase()
              that.show_tip('修改操作成功')
              that.$("#sendVer").text("获取验证码")
              that.flage = 'save'
              that.text = ''
              that.Info = {}
              if(that.$route.query.from == 'cash'){
                that.$router.push({name:'cash'})
              }
            }else {
              that.show_tip(result.errorMessage)
            }
          }
        })
      }
    },
    clear(){
      let that = this
      that.text = ''
    },
    mounted(){
      let that = this;
      that.amount();
      that.amountList();
      that.plateDiposit();
      that.getpayPwdSetFlag()
    }
  }
</script>
<style lang="scss" scoped>
.delectSizeBg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1500px;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }
  .delectSizeWrap {
    position: fixed;
    width: 50%;
    height: auto;
    padding: 0;
    top: 200px;
    left: 50%;
    margin-left: -25%;
    background: #fff;
    z-index: 999;
    .agreetc_header{
      width:100%;
      height: 50px;
      background: #DFE9F6;
      span{
        font-size:16px;padding-left:20px;line-height:50px;color:#666;
      }
      span.fr{margin-right:20px;cursor:pointer;}
    }
    .delectGoodCon{padding:0 30px 40px 30px;
      h5,p{
        line-height: 24px;
        font-size: 14px;
        color: #333333;
      }
      h5{
        line-height: 30px;
        margin-top:20px;
        font-size: 14px;
        font-weight: 700;
      }
    }
    .tipsCon{
      padding:30px;text-align: center;
      h5,p{
        line-height: 30px;
        font-size: 14px;
        color: #333333;
        //line-height:50px;font-size:20px;color:#333333;
      }
      h5{
        line-height:50px;font-size:20px;
      }
      p{margin-bottom:30px;}
    }
  }
  .cashPassCon{
    width: 30%;
    left: 50%;
    margin-left: -15%;
  }
  .survey_contaner{
    a.ruleShow{margin-right:20px;color: #667991;font-size:14px;cursor: pointer;}
    .survey_c_top{
      min-height: 120px;
      width: 100%;
      padding: 10px;
      // border-bottom: 1px solid #D2D4E2;
      .survey_c_tbox{
        // width: 360px;
        height: 100px;
        background: #EDF0F7;
        padding: 20px;
        // margin:10px;
        .tit{
          font-size: 12px;
          color: #333333;
          margin-right:5px;
        }
        .tit02{
          font-size: 20px;
          color: #333333;
          width: 100%;
          display: inline-block;
        }
        .tit_span{
          width: 50%;
          height: 40px;
          display: inline-block;
          border-left: 1px solid #D2D4E2;
          padding-left: 20px;
          padding-right: 20px;
          font-size: 12px;
          color: #666666;
        }
        .problem{
          background: url(../../../assets/images/ico_explain02.png) no-repeat center;
          width: 16px;
          height: 16px;
          display: inline-block;
        }
      }
    }
    .survey_c_sort{
      width: 100%;
      height: 60px;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 20px;
      .search{
        position: relative;
        width:302px;
        height:42px;
        .inp{
          width:100%;
          height: 100%;
          background: #FFFFFF;
          border: 1px solid #E6E8F2;
        }
        i{
          width: 50px;
          height: 42px;
          line-height: 42px;
          text-align: center;
          border: 1px solid #ccc;
          background: #F4F5FA;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
    .inputInfo{
     width: 780px;
     margin-left:-390px;
     margin-top:-160px;
     height:auto;
     .hptczp_body{padding-top:20px;}
     h5{font-size:16px;color:#333;font-weight: 700;}
     .textIndent p{
       margin-bottom:0px;
       margin-right:20px;padding-left:20px;line-height:24px;font-size:12px;color:#666;
       span{margin-left:-20px;}
     }
    }
    .survey_c_cen{
      min-height: 40px;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 20px;
      .notetable{
        min-height: 40px;
        border: 1px solid #e5e5e5;
        thead{
          background: #DFE9F6;
          tr{
            height: 40px;
            line-height: 40px;
            td{
              padding-left:40px;
            }
          }
        }
        tbody{
          tr{
            height: 40px;
            td{padding-left:40px;}
          }
          tr:nth-child(2n){
            background:#f4f5fa;
          }
          tr:nth-child(2n+1){
            background:#edf0f7;
          }
          .content{
            padding-top: 20px;
            padding-bottom: 20px;
            td{
              padding-left:40px;
            }
          }
        }
      }
    }
  }
  /*公用样式*/
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .clear{
    clear: both;
    overflow: hidden;
  }
  .mr20{
    margin-right: 20px;
  }
  .poi1{
    position: relative;
  }
  .poi2{
    position: absolute;
  }
  .poi3{
    position: fixed;
  }
</style>
