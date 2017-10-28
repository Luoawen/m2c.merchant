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
        <div class="col-sm-4 detail_cen">
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
        <div class="col-sm-4 detail_cen">
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
            <td class="a1 clear">
              <div class="a1tab fl mr20"><img /></div>
              <div class="a1tit fl">
                <div class="wobse top">
                  冬季新款侧开叉高领毛衣女不规则套头针织衫宽松...
                </div>
                <div class="btm">
                  规格：蓝色，L
                </div>
              </div>
            </td>
            <td class="a2">-</td>
            <td class="a3">299.00</td>
            <td class="a4">1</td>
            <td class="a5">299.00</td>
            <td class="a5">-</td>
            <td class="a6">
              <div class="btm" @click="showagree">同意</div>
              <div class="btm mt10" @click="showrefuses">拒绝</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 是否同意 或者拒绝浮层弹框 -->
  <div class="agreetc"  style="" v-show="showagrees===true||showrefuse===true">

  </div>
  <!-- 是否同意弹框 -->
  <div class="agreetc_content"  v-show="showagrees===true">
      <div class="agreetc_header">
        <span>提示</span>
        <span class="fr" @click="showagrees=false">X</span>
      </div>
      <div class="agreetc_body">是否同意退货申请？</div>
      <div class="agreetc_footer">
        <button type="button" class="btn save" >确认</button>
        <button type="button" class="btn cancel" @click="showagrees=false">取消</button>
      </div>
  </div>
  <!-- 拒绝原因 -->
  <div class="refuse_content" v-show="showrefuse===true">
      <div class="refuse_header">
        <span>拒绝理由</span>
        <span class="fr" @click="showrefuse=false">X</span>
      </div>
      <div class="refuse_body">
          <textarea placeholder="请填写"></textarea>
      </div>
      <div class="refuse_footer">
        <button type="button" class="btn save"  >确认</button>
        <button type="button" class="btn cancel" @click="showrefuse=false">取消</button>
      </div>
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
        showagrees: false,
        showrefuse: false,
        // 搜索参数
        search_params: { orderNo: '', keywordType: '', statusFlag: sessionStorage.getItem('statusFlag'), payWay: '', startTime: sessionStorage.getItem('startTime'), endTime: sessionStorage.getItem('endTime'), keyword: '' }
      }
    },
    methods: {
      // 获取全部订单信息
      customerdetail () {
        var that = this
        that.showactive = true
        that.showactive02 = false
        that.showactive03 = false
      },
      customerfreight () {
        var that = this
        that.showactive02 = true
        that.showactive = false
        that.showactive03 = false
      },
      customerecord () {
        var that = this
        that.showactive03 = true
        that.showactive02 = false
        that.showactive = false
      },
      showagree () {
        var that = this
        that.showagrees= true
      },
      showrefuses () {
        var that = this
        that.showrefuse= true
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
.mr20{
  margin-right: 20px;
}
.ml20{
  margin-left: 20px;
}
.mt10{
  margin-top: 10px;
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
.wobse{
overflow:hidden;
text-overflow:ellipsis;
display:-webkit-box;
-webkit-box-orient:vertical;
-webkit-line-clamp:2;
}
.detail{
    /*width: 1583px;*/
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
          width: 22%;
          padding-top: 20px;
          padding-bottom: 20px;
          .a1tab{
            width: 50px;
            height: 50px;
            img{
              width: 50px;
              height: 50px;
            }
          }
          .a1tit{
            .top{
              width:85%;
              height: 40px;
              line-height: 20px;
              font-size: 14px;
              color: #333333;
            }
            .btm{
              font-size: 12px;
              color: #999999;
            }
          }
        }
        .a2{
          width:11%;
        }
        .a3{
          width:7%;
        }
        .a4{
          width:7%;
        }
        .a5{
          width:8%;
        }
        .a6{
          width:10%;
          .btm{
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            border-radius: 2px;
            width: 60px;
            height: 24px;
            line-height: 24px;
            font-size: 12px;
            color: #333;
            text-align: center;
            cursor: pointer;
          }
        }
        .a7{
          width:7%;
        }
        thead{
          background: #DFE9F6;
          line-height: 40px;
          height: 40px;
        }
      }
      /*width: 1583px;*/
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
    .agreetc{
      width: 100%;
      height: 100%;
      display: block;
      position: fixed;
      left: 0px;
      top: 0px;
      background: #000;
      z-index: 999;
      opacity: 0.5;

    }
    .agreetc_content,.refuse_content{
      width: 400px;
      height: 280px;
      background: #fff;
      z-index: 9999;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -200px;
      margin-top: -180px;
      background: #FFFFFF;
      border-radius: 4px;
      .agreetc_header,.refuse_header{
        width:100%;
        height: 50px;
        background: #DFE9F6;
        padding-left: 20px;
        padding-right: 20px;
        font-size: 16px;
        span{
          display: inline-block;
          line-height: 50px;
        }
      }
      .agreetc_body{
        padding-left: 20px;
        padding-right: 20px;
        background: #FFFFFF;
        margin-top: 10px;
        text-align: center;
        font-size: 20px;
        color: #333333;
        line-height: 150px;
      }
      .refuse_body{
        padding-left: 20px;
        padding-right: 20px;
        background: #FFFFFF;
        margin-top: 10px;
        textarea{
          width: 100%;
          height: 100%;
          border: 1px solid #E5E5E5;
          width: 360px;
          height: 140px;
          padding-left: 10px;
          padding-right: 10px;
          padding-top: 5px;
          padding-bottom: 5px;
        }
      }
      .agreetc_footer,.refuse_footer{
          height: 80px;
          padding-top: 10px;
          padding-left: 50%;
          .btn {
            width: 80px;
            height: 30px;
            border: none;
            border-radius: 2px;
            color: #fff;
          }
          .save {
            margin-left: -110px;
            background: #0086FF;
          }
          .cancel {
            margin-left: 40px;
            background: #FFF;
            border: 1px solid #CCCCCC;
            color: #444;
          }

      }
    }
}
</style>
