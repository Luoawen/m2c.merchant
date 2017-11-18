<template>
  <div class="survey_contaner col-sm-11">
    <div style="height: 10px"></div>
    <div style="font-size: 20px">&nbsp;&nbsp;<strong>我的资产</strong><a class="ruleShow" @click="ruleShow">结算规则说明</a></div>
    <div class="survey_c_top clear">
      <div class="survey_c_tbox fl mr20">
        <div class="tit">
          <span>待结算金额（元）</span>
          <div class="icon">
            <div class="tips">
              <p>客户付款后，待系统结算的金额</p>
            </div>
          </div>
        </div>
        <div class="tit02 clear">
          <span style="font-size: 30px">{{content.settleAmount == undefined || '' ? '-' :(content.settleAmount/100).toFixed(2)}}</span>
        </div>
      </div>
      <div class="survey_c_tbox fl mr20">
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
          <span style="font-size: 30px">{{content.tradableingAmount ==  null ? '-' : (content.tradableingAmount/100).toFixed(2)}}</span>
        </div>
      </div>
      <div class="survey_c_tbox fl mr20">
        <div class="tit">
          <span>平台质保金（元）</span>
        </div>
        <div class="tit02 clear">
          <span style="font-size: 30px">{{platePositisCache == undefined || '' ? '-' : (platePositisCache/100).toFixed(2)}}</span>
        </div>
      </div>
      <div class="survey_c_tbox fl mr20">
        <div class="tit">
          <span>可用金额（元）</span>
          <div class="icon">
            <div class="tips">
              <p>已结算的金额，可用金额可提现</p>
            </div>
          </div>
        </div>
        <div class="tit02 clear">
          <span style="font-size: 30px">{{content.tradableAmount/100 == NaN || undefined || '' ? '-' : (content.tradableAmount/100).toFixed(2)}}</span>
          <el-button @click="pullMoney()" size="mini" type="primary"> 提现 </el-button>
        </div>
      </div>

    </div>
    <div style="height: 20px"></div>
    <div style="height: 30px"><span style="font-size: 20px;">&nbsp;&nbsp;<strong>提现记录</strong></span></div>
    <div class="survey_c_cen clear">
      <table  class="col-sm-12 surveytab">
        <thead>
        <tr>
          <td><strong>提现单号</strong></td>
          <td><strong>申请金额/元</strong></td>
          <td><strong>体现状态</strong></td>
          <td><strong>申请时间</strong></td>
        </tr>
        </thead>
        <tbody v-for="item in contents">
        <tr>
          <td>{{item.withdrawalId}}</td>
          <td>{{(item.amount/100).toFixed(2)}}</td>
          <td>{{item.wdStatus == 0?'处理中':item.wdStatus == 1?'待审批':item.wdStatus == 2?'待转账':item.wdStatus == 3?'不通过':item.wdStatus == 4?'已转账':item.wdStatus == 5?'作废':'-'}}</td>
          <td>{{date_format(new Date(item.createdTime), 'yyyy-MM-dd hh:mm:ss')  }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="block" style="margin: 20px;float: right">
      <el-pagination
        :page-sizes="[5, 10, 20, 30]"
        :page-size="goodsCheckStorePageRows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="currentPage">
      </el-pagination>
    </div>
    <!-- 规则 -->
    <div class="delectSizeBg" v-show="backgroundBg"></div>
    <div class="delectSizeWrap" v-show="ruleShowBox">
      <div class="agreetc_header">
        <span>结算规则</span>
        <span class="fr" @click="ruleClose">X</span>
      </div>
      <div class="delectGoodCon">
        <h5>待结算金额</h5>
        <p>1、顾客完成付款后，款项先显示在待结算金额中；</p>
        <p>2、当日订单总金额不一定等于当日待结算金额；</p>
        <p>1）下单时间、付款时间可能不在同一天；</p>
        <p>2）商家退款成功，待结算金额相应扣除；</p>
        <h5>结算时间、方式</h5>
        <p>1、订单交易完成（关闭）T+7工作日结算款项到商家可用金额，结算之前款项显示在待结算金额；</p>
        <p>2、结算后，款项进入商家可用金额的同时结算服务费、活动分摊，商家可用余额可提现。若需要查询单号是否已经结算，可在结算查询中查看结算状态。</p>
      </div>
    </div>
    <!-- 是否有交易密码 -->
    <div class="delectSizeWrap cashPassCon" v-show="cashPassShow">
      <div class="agreetc_header">
        <span>提示</span>
        <span class="fr" @click="cashPassHide">X</span>
      </div>
      <div class="tipsCon">
        <h5>是否设置交易密码</h5>
        <p>您还未设置交易密码</p>
        <router-link :to="{name:'cashPass'}"><el-button type="primary">确定</el-button></router-link>
        <el-button @click="cashPassHide">取消</el-button>
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
        content:'',
        dealerName:'',
        contents:'',
        createdTime:'',
        ruleShowBox: false, // 结算规则
        backgroundBg: false, // 弹层背景
        cashPassShow: false, // 交易密码
        platePositisCache:'',
        payPwdSetFlag:''// 是否有交易密码标识
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
          that.backgroundBg = true
          that.cashPassShow = true
        }
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
            }
          }
        })
      },
      plateDiposit(){
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/dealer/sys/dealerDeposit',
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
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
      }
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
    .delectGoodCon{padding:30px;padding-bottom:40px;
      h5,p{
        line-height: 24px;
        font-size: 14px;
        color: #333333;
      }
      h5{
        line-height: 30px;
        margin-top:20px;
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
    margin: auto;
    background: #FFFFFF;
    margin-left: 30px;
    margin-top: 20px;
    padding: 0!important;
    a.ruleShow{float:right;margin-right:20px;color:#667991;font-size:14px;}
    .survey_c_top{
      min-height: 120px;
      width: 100%;
      padding: 10px;
      border-bottom: 1px solid #D2D4E2;
      .survey_c_tbox{
        width: 360px;
        height: 100px;
        background: #EDF0F7;
        padding: 20px;
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
    .survey_c_cen{
      min-height: 40px;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 20px;
      .surveytab{
        border:1px solid #D2D4E2;
        thead{
          background: #DFE9F6;
          font-size: 14px;
          color: #333333;
          tr{
            height:40px;
            td{
              line-height: 40px;
              padding-left: 40px;
              text-align: left;
            }
          }
        }
        tbody{
          background: #EDF0F7;
          font-size: 14px;
          color: #333333;
          tr{
            height:40px;
            td{
              line-height: 40px;
              padding-left: 40px;
              text-align: left;
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
