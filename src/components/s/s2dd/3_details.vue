<template>
  <div class="detail">
    <div class="nav">
      <span :class="{active:showactive}" @click="customerdetail"><a>售后单详情</a></span>
      <span :class="{active:showactive02}" @click="customerfreight"><a>售后物流</a></span>
      <span :class="{active:showactive03}" @click="customerecord"><a>操作记录</a></span>
    </div>
    <!-- 售后单详情 -->
    <div v-show="showactive" class="customerdetail_container">
      <!-- 拒绝结果，做法根据后台返回数据判断v-show -->
      <div class="detail_tit">已拒绝顾客售后申请</div>
      <!-- <div class="detail_tit02">顾客发起售后申请，请处理</div> -->
      <div class="detail_top mt20 clear">
        <div class="col-sm-3 detail_cen">
          <div>
            <span class="tit01">售后状态</span>
            <span class="ml20">待退货审核</span>
          </div>
          <div>
            <span class="tit01">售后单号</span>
            <span class="ml20">65432134562354</span>
          </div>
          <div>
            <span class="tit01">申请原因</span>
            <span class="ml20">质量有问题</span>
          </div>
          <div>
            <span class="tit01">关联订货号</span>
            <span class="ml20">672634532432445324</span>
          </div>
          <div>
            <span class="tit01">订单总额</span>
            <span class="ml20">309.00元（含运费<span>10.00</span>元）</span>
          </div>
        </div>
        <div class="col-sm-3 detail_cen">
          <div>
            <span class="tit01">售后期望</span>
            <span class="ml20">退货退款</span>
          </div>
          <div>
            <span class="tit01">售后金额</span>
            <span class="ml20 redcolor">101.00元（含运费5.00元）</span>
          </div>
          <div>
            <span class="tit01">申请时间</span>
            <span class="ml20">2017-09-22 20:35:58</span>
          </div>
          <div>
            <span class="tit01">拒绝原因</span>
            <span class="ml20"></span>
          </div>
        </div>
      </div>
      <table class="mt20 detail_table">
        <thead>
          <tr>
            <td class="a1">商品信息</td>
            <td class="a2">广告位信息</td>
            <td class="a3">单价</td>
            <td class="a4">数量</td>
            <td class="a5">商品金额/元</td>
            <td class="a5">商品金额/元</td>
            <td class="a6">操作</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="a1">
              <div class="a1tab fl"><img /></div>
              <div>
                <div>
                </div>
                <div>
                </div>
              </div>
            </td>
            <td class="a2"></td>
            <td class="a3"></td>
            <td class="a4"></td>
            <td class="a5"></td>
            <td class="a5"></td>
            <td class="a6"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 售后物流 -->
    <div v-show="showactive02">

    </div>
    <!-- 操作记录 -->
    <div v-show="showactive03">
      333
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        amout: '',
        number: '',
        is_Success: false,
        showactive: true,
        showactive02: false,
        showactive03: false,
        // 搜索参数
        search_params: { orderNo: '', keywordType: '', statusFlag: sessionStorage.getItem('statusFlag'), payWay: '', startTime: sessionStorage.getItem('startTime'), endTime: sessionStorage.getItem('endTime'), keyword: '' }
      }
    },
    methods: {
      // 获取全部订单信息
      customerdetail () {
        var that = this
        that.showactive = true;
        that.showactive02 = false;
        that.showactive03 = false;
      },
      customerfreight () {
        var that = this
        that.showactive02 = true;
        that.showactive = false;
        that.showactive03 = false;
      },
      customerecord () {
        var that = this
        that.showactive03 = true;
        that.showactive02 = false;
        that.showactive = false;
      }

    },
    mounted () {
      // this.get_good_info()
    }
  }
</script>
<style lang="scss" scoped>
.mt20{
  margin-top: 20px;
}
.redcolor{
  color: red;
}
.ml20{
  margin-left: 20px;
}
.mt20{
  margin-top: 20px;
}
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
.detail{
    width: 1583px;
    min-height: 84px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .nav{
      .active{
        border-bottom:1px solid #0086FF;
      }
      height: 40px;
      line-height: 40px;
      border-bottom:1px solid #e7e7e7 ;
      span{
        display: inline-block;
        padding-left: 30px;
        padding-right: 30px;
        line-height: 40px;
      }
    }
    .customerdetail_container{
      .detail_table{
        margin: auto;
        border: 1px solid #e7e7e7;
        width: 99%;
        td{
          padding-left: 10px;
        }
        .a1{
          width: 360px;
        }
        .a2{
          width:185px;
        }
        .a3{
          width:120px;
        }
        .a4{
          width:120px;
        }
        .a5{
          width:130px
        }
        .a6{
          width:170px;
        }
        .a7{
          width:120px;
        }
        thead{
          background: #DFE9F6;
          line-height: 40px;
          height: 40px;
        }
      }
      width: 1583px;
      min-height: 670px;
      .detail_tit{
        height: 60px;
        width: 99%;
        line-height: 60px;
        margin-left: 10px;
        padding-left: 20px;
        background: #FFF9EE;
        font-size: 18px;
        color: #F5A623;
      }
      .detail_tit02{
        height: 60px;
        width: 99%;
        line-height: 60px;
        margin-left: 10px;
        padding-left: 20px;
        background: #FBF5EF;
        font-size: 18px;
        color: #FD3242;
      }
      .detail_top{
        .detail_cen{
          .tit01{
            display: inline-block;
            width: 90px;
            height: 40px;
            line-height:40px;
            text-align: right;
          }
        }
      }
    }
}
</style>
