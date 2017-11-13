<template>
  <div class="survey_contaner col-sm-11">
    <div style="height: 10px"></div>
    <div style="font-size: 20px">&nbsp;&nbsp;<b>我的资产</b></div>
    <div class="survey_c_top clear">
      <div class="survey_c_tbox fl mr20">
        <div class="tit">
          <span>待结算金额（元）</span>
          <i class="problem"></i>
        </div>
        <div class="tit02 clear">
          <span style="font-size: 30px">{{content.settleAmount/100}}</span>
        </div>
      </div>
      <div class="survey_c_tbox fl mr20">
        <div class="tit">
          <span>提现中金额（元）</span>
          <i class="problem"></i>
        </div>
        <div class="tit02 clear">
          <span style="font-size: 30px">{{content.tradableingAmount/100 == '' ? 0 : content.totalTradableAmount/100}}</span>
        </div>
      </div>
      <div class="survey_c_tbox fl mr20">
        <div class="tit">
          <span>平台质保金（元）</span>
          <i class="problem"></i>
        </div>
        <div class="tit02 clear">
          <span style="font-size: 30px">{{content.totalTradableAmount/100 == '' ? 0 : content.totalTradableAmount/100}}</span>
        </div>
      </div>
      <div class="survey_c_tbox fl mr20">
        <div class="tit">
          <span>可用金额（元）</span>
          <i class="problem"></i>
        </div>
        <div class="tit02 clear">
          <span style="font-size: 30px">{{content.tradableAmount/100}}</span>
        </div>
      </div>

    </div>
    <div style="height: 20px"></div>
    <div style="height: 30px"><span style="font-size: 20px;">&nbsp;&nbsp;<b>提现记录</b></span></div>
    <div class="survey_c_cen clear">
      <table  class="col-sm-12 surveytab">
        <thead>
        <tr>
          <td><b>提现单号</b></td>
          <td><b>申请金额/元</b></td>
          <td><b>体现状态</b></td>
          <td><b>申请时间</b></td>
        </tr>
        </thead>
        <tbody v-for="item in contents">
        <tr>
          <td>{{item.withdrawalId}}</td>
          <td>{{item.amount/100}}</td>
          <td>{{item.wdStatus/100}}</td>
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
  </div>
</template>

<script>
  export  default {
    name:'',
    data(){
      return{
        goodsCheckStorePageRows:5,
        currentPage:1,
        content:'',
        dealerName:'',
        contents:'',
        createdTime:'',
      }
    },
    methods:{
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
      }


    },

    mounted(){
      let that = this;
      that.amount();
      that.amountList();
    }

  }
</script>
<style lang="scss" scoped>
  .survey_contaner{
    margin: auto;
    background: #FFFFFF;
    margin-left: 30px;
    margin-top: 20px;
    padding: 0!important;
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
