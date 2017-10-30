<template>
  <div class="Ordernote clear">
    <div class="poi1">
      <div class="dropdown">
        <div id="dLabel1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="sort">
          <select v-model="search_params.orderType" name="orderType" >
            <option value="" selected>订单状态</option>
            <option value="">全部</option>
            <option value="1">待付款</option>
            <option value="2">待发货</option>
            <option value="3">待收货</option>
            <option value="4">交易完成</option>
            <option value="5">交易关闭</option>
          </select>
        </div>
      </div>
      <div class="dropdown">
        <div id="dLabel2" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="state">
          <select v-model="search_params.status" name="status" >
            <option value="" selected>售后状态</option>0,1申请换货,2,3拒绝,4同意(退换货),5客户寄出,6商家收到,7商家寄出,8客户收到,9同意退款, 10确认退款,11交易关闭
            <option value="0">申请退货</option>
            <option value="1">申请换货</option>
            <option value="2">申请退款</option>
            <option value="3">商家拒绝申请</option>
            <option value="4">商家同意申请</option>
            <option value="5">客户寄出</option>
            <option value="6">商家收到</option>
            <option value="7">商家寄出</option>
            <option value="8">客户收到</option>
            <option value="9">同意退款</option>
            <option value="10">确认退款</option>
            <option value="11">交易关闭</option>
          </select>
        </div>
      </div>
      <div class="search_cell">

        <span>下单时间<i class="glyphicon glyphicon-calendar" @click="timeBox()"></i></span><router-link :to="{ name : 'dealerOrDtl', query: {orderId: '20171018142052LOKIJN',dealerOrderId: '20171026161652LOKIXX0'}}">xineeeee</router-link>
        <div class="time" v-show="is_Success">
          <input type="date" class="form-control search_input search_input_date_l start" v-model="search_params.startTime"><span class="separator">-</span><input type="date" class="form-control search_input search_input_date_r end" v-model="search_params.endTime">
        </div>

      </div>
      <div class="search">
        <input type="text" class="inp" value=""  v-model="search_params.condition" placeholder="输入商品名称/订单号/支付单号/收货人号码">
        <i class="glyphicon glyphicon-search" id="searchIco" @click="search()"></i>
      </div>
      <span class="ml10 gjsort" @click="Advancedsearch">高级搜索</span>
      <button type="button" class="btn btn-default pull-right operation">批量操作</button>
      <!-- 高级搜索 -->
      <div class="poi2 Advanced_s" v-show="Advancedshow===true">
        <div class="">
          <div class="titbt">高级搜索</div>
          <div class="clear">
            <div class="col-sm-6 left">
              <div class="clear mt10 mb20">
                <span class="bt fl ">关键词</span>
                <input class="form-control fl " placeholder="输入商品名称/订单号/支付单号/收货人号码" />
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">订单状态</span>
                <select class="form-control fl ">
                  <option value="">全部</option>
                </select>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">售后状态</span>
                <select class="form-control fl ">
                  <option value="">全部</option>
                </select>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">广告位</span>
                <select class="form-control fl ">
                  <option value="">全部</option>
                </select>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">开发票</span>
                <select class="form-control fl ">
                  <option value="">全部</option>
                </select>
              </div>
            </div>
            <div class="col-sm-6 right">
              <div class="clear mt10 mb20">
                <span class="bt fl ">下单时间</span>
                <span class="clear">
                  <span class="fl"><input class="form-control time" type="date"/></span>
                  <span class="fl mr10" style="display:inline-block;line-height:40px;">~</span>
                  <span class="fl"><input class="form-control time" type="date"/></span>
                </span>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">评论状态</span>
                <select class="form-control fl ">
                  <option value="">全部</option>
                </select>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">订单类型</span>
                <select class="form-control fl ">
                  <option value="">全部</option>
                </select>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">支付方式</span>
                <select class="form-control fl ">
                  <option value="">全部</option>
                </select>
              </div>
            </div>
          </div>
          <div class="footer clear">
            <button class="footerbtn sort" @click="Advancedshow=false">搜索</button>
            <button class="footerbtn ml20 czt" >重置</button>
          </div>
        </div>
      </div>
    </div>
    <div class="good_info ">
      <table id="table"  class="notetable col-sm-12">
        <thead>
        <tr>
          <td>
                <span class=" mt10">
                  <!-- type="checkbox" :id="'classify_'+index" @click="setClassify(classify.classifyId)" v-model="rangeClassifyList" :value="classify.classifyId" -->
                  <input class="input_check" type="checkbox" id="classify" />
                  <label for="classify" class="fl mt10"></label>
                </span>
            <span class="ml10">商品信息</span></td>
          <td>单价/元</td>
          <td>数量</td>
          <td>售后状态</td>
          <td>订单总额/元</td>
          <td>下单时间</td>
          <td>收货人</td>
          <td>订货单状态</td>
        </tr>
        </thead>
        <!-- 在tbody上v-for循环 -->
        <tbody>
        <tr>
          <td colspan="8" class="bt clear">
            <div class="fl">
                      <span data-v-6f270b16="" class="mt10">
                        <input data-v-6f270b16="" type="checkbox" id="classify1" class="input_check">
                        <label data-v-6f270b16="" for="classify1" class="fl mt10">
                        </label>
                      </span>
              <span class="ml10">订货号：</span><span>345654345634</span>
            </div>
            <div class="fr detail">查看详情</div>
          </td>
        </tr>
        <!-- 按照设计，同一个买家多个商品，则循环a1~a4,第一行a5~a8加上属性rowspan="2"需要js做控制，请与设计协商 -->
        <tr class="content clear">
          <td class="a1 clear">
            <div class="a1_img mr10 fl"><img /></div>
            <div>
              <div class="wose wid">冬季新款侧开叉高领毛衣女不规则套头针织衫宽松.</div>
              <div class="blue">规格：蓝色，L</div>
            </div>
          </td>
          <td class="a2">
            299.00
          </td>
          <td class="a3">
            1
          </td>
          <td class="a4 border_r">
            <!-- 有几种情况的不同表现方 -->
            <div style="">
              <div class="mt10">待退货确认</div>
              <div class="mt5"><button class="a4_btn" @click="agreeshow">同意</button></div>
              <div class="mt5"><button class="a4_btn" @click="refuseshow">拒绝</button></div>
            </div>
            <!-- <div>
              <span>已拒绝</span>
              <i class="ico_explain"></i>
            </div> -->
          </td>
          <td class="a5">
            589.00
          </td>
          <td class="a6">
            2017-10-1023:22:37
          </td>
          <td class="a7">
            <div>肖悦悦</div>
            <div>13845678763</div>
          </td>
          <!-- 代发货和交易关闭时字体为红色，请注意 -->
          <td class="a8">
            <span>待付款</span>
            <!-- <span class="red_fh">待发货</span>
            <span class="red_fh">待发货</span> -->
          </td>
        </tr>
        </tbody>
      </table>
      <div class="block" style="margin: 20px;float: right">
        <el-pagination
          @size-change="goodsCommentHandleSizeChange"
          @current-change="goodsCommentHandleCurrentChange"
          :current-page="goodsCommentCurrentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="goodsCommentPageRows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="goodsCommentTotalCount">
        </el-pagination>
      </div>
    </div>
    <!-- &lt;!&ndash; 是否同意 或者拒绝浮层弹框 &ndash;&gt; -->
    <div class="agreetc"  style="" v-show="Agreeshow===true||Refuseshow===true||TowAgreeshow===true">

    </div>
    <!-- &lt;!&ndash; 是否同意弹框 &ndash;&gt; -->
    <div class="agreetc_content" v-show="Agreeshow===true" >
      <div class="agreetc_header">
        <span>提示</span>
        <span class="fr" @click="Agreeshow=false">X</span>
      </div>
      <div class="agreetc_body">是否同意退货申请？</div>
      <div class="agreetc_footer">
        <button type="button" class="btn save" >确认</button>
        <button type="button" class="btn cancel" @click="Agreeshow=false">取消</button>
      </div>
    </div>
    <!-- &lt;!&ndash; 拒绝原因 &ndash;&gt; -->
    <div class="refuse_content" v-show="Refuseshow===true">
      <div class="refuse_header">
        <span>拒绝理由</span>
        <span class="fr" @click="Refuseshow=false">X</span>
      </div>
      <div class="refuse_body">
        <textarea placeholder="请填写"></textarea>
      </div>
      <div class="refuse_footer">
        <button type="button" class="btn save"  @click="towAgreeshow">确认</button>
        <button type="button" class="btn cancel" @click="Refuseshow=false">取消</button>
      </div>
    </div>
    <!-- v-show="TowAgreeshow===true" -->
    <div class="TowAgreeshow_content" v-show="TowAgreeshow===true" >
      <div class="agreetc_header">
        <span>提示</span>
        <span class="fr" @click="TowAgreeshow=false">X</span>
      </div>
      <div class="TowAgreeshow_body">
        <div class="tit01">是否确认退货？</div>
        <div class="tit02">款项将原路退回给顾客</div>
      </div>
      <div class="agreetc_footer">
        <button type="button" class="btn save" >确认</button>
        <button type="button" class="btn cancel" @click="TowAgreeshow=false">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent,no-trailing-spaces,semi-spacing,no-unused-vars,space-infix-ops,no-multi-spaces */

  export default {
    name: '',
    data () {
      return {
        amout: '',
        number: '',
        is_Success: false,
        Advancedshow: false,
        Agreeshow: false,
        Refuseshow: false,
        TowAgreeshow: false,
        // 搜索参数
        search_params: { orderType: '', status: sessionStorage.getItem('statusFlag'), startTime: sessionStorage.getItem('startTime'), endTime: sessionStorage.getItem('endTime'), condition: '' }
      }
    },
    methods: {
    // 获取全部订单信息
  agreeshow () {
    var that = this;
    that.Agreeshow = true;
  },
    get_good_info () {
      let that = this
      that.is_Success = false
    },
    refuseshow () {
      var that = this
      that.Refuseshow = true
    },
    towAgreeshow () {
      var that = this
      that.TowAgreeshow = true
    },

    timeBox () {
      this.is_Success = true
    },
    search () {
      this.get_good_info()
    },
    Advancedsearch () {
      var that = this;
      that.Advancedshow = true
    }
  },
  mounted () {
    this.get_good_info()
  }
  }

</script>
<style lang="scss" scoped>
  .Ordernote{
    width: 95%;
    min-height: 484px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .Advanced_s{
      width: 100%;
      min-height: 430px;
      background: #fff;
      z-index: 99;
      top: 0px;
      left: 0px;
      padding:20px;
      .left,.right{
        .bt{
          display: inline-block;
          width: 80px;
          line-height: 40px;
          text-align: right;
          padding-right: 10px;
        }
        input,select{
          width: 75%;
          height: 40px;
          line-height: 40px;
        }
        .time{
          width: 165px;
          margin-right: 10px;

        }
      }
      .titbt{
        font-size: 18px;
        color: #333333;
      }
      .footer{
        padding-left: 30px;
        .footerbtn{
          border: 1px solid #CCCCCC;
          border-radius: 2px;
          width: 80px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          color: #333333;
          text-align: center;
        }
        .sort{
          background: #0086FF;
          border-radius: 2px;
          color: #FFFFFF;
        }
        .czt{
          background: #fff;
        }
      }
    }
    .dropdown{
      display: inline-block;
      font-size: 16px;
      line-height: 84px;
      .sort{
        display: inline;
        margin: 0 20px 0 30px;
        font-size: 14px;
        color: #333333;
        line-height: 30px;
      }
      .state{
        display: inline;
        margin-right: 20px;
        font-size: 14px;
        color: #333333;
      }
      .gjsort{
        font-size: 14px;
        color: #667991;
      }
      .dropdown-menu {
        li{
          line-height: 30px;
          padding-left: 25px;
          position: relative;
          i{
            font-size: 10px;
            color: gray;
            padding-left: 15px;
            position: absolute;
            top: 8px;
            right: 19px;
          }
        }
      }
    }
    .search_cell{
      display: inline-block;
      position: relative;
      font-size: 14px;
      color: #333333;
      span{
        font-size: 16px;
        margin-right: 25px;
        i{
          font-size: 20px;
          padding-left: 10px;
        }
      }
      .time{
        width: 330px;
        height: 61px;
        position: absolute;
        left: -123px;
        top: 19px;
        z-index: 10;
        .form-control{
          width: 139px;
          height: 31px;
          position: absolute;
          top: 12px;
        }
        .start{
          left: 20px;
        }
        .separator{
          position: absolute;
          left: 162px;
          top: 12px;
        }
        .end{
          right: 20px;
        }
      }
    }
    .search{
      display: inline-block;
      position: relative;
      .inp{
        width: 380px;
        height: 39px;
        color: #ccc;
        padding-left: 10px;
      }
      i{
        width: 50px;
        height: 39px;
        line-height: 39px;
        text-align: center;
        border: 1px solid #ccc;
        background-color: rgba(242, 242, 242, 1);
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    span{
      cursor: pointer;
    }
    .add{
      margin-top: 31px;
      margin-right: 15px;
    }
    .operation{
      margin-top: 31px;
      margin-right: 15px;
    }
    .good_info {
      background: #fff;
      margin-top: 10px;
      padding-top: 10px;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 10px;
      .notetable{
        min-height: 40px;
        border: 1px solid #e5e5e5;
        .a1{
          width:30%;
        }
        .a2{
          width: 10%;
        }
        .a3{
          width: 10%;
        }
        .a4{
          width:10% ;
          .a4_btn{
            border: 1px solid #CCCCCC;
            border-radius: 2px;
            padding-left: 20px;
            padding-right: 20px;
            line-height: 24px;
            height: 24px;
            font-size: 12px;
            color: #333333;
            background: initial;
          }
          .ico_explain{
            width: 16px;
            height: 16px;
            background: url(../../../assets/images/ico_explain.png) no-repeat center;
            display: inline-block;
          }
        }
        .a5{
          width: 10%;
        }
        .a6{
          width:10% ;
        }
        .a7{
          width:10% ;
        }
        .a8{
          width:10% ;
        }
        thead{
          background: #DFE9F6;
          tr{
            height: 40px;
            line-height: 40px;
          }
        }
        .red_fh{
          color: red;
        }
        tbody{
          height: 40px;
          .content{
            background: rgba(244,245,250,0.00);
            box-shadow: 0 -1px 0 0 #E5E5E5;
            padding-top: 20px;
            padding-bottom: 20px;
            td{
              padding-bottom: 10px;
            }
          }
          .a1_img{
            padding-left: 25px;
            img{
              width: 50px;
              height: 50px;
              margin-top: 20px;
              margin-bottom: 20px;
            }
          }
          .wid{
            width: 180px;
            height: 40px;
            font-size: 14px;
            color: #333333;
            line-height: 20px;
            margin-top: 16px;
            margin-bottom: 5px;
          }
          .blue{
            font-size: 12px;
            color: #999999;
          }
          .bt{
            background: #F4F5FA;
            height: 40px;
            line-height: 40px;
            padding-right: 30px;
            .detail{
              font-size: 13px;
              color: #667991;
              cursor: pointer;
            }
          }
        }
        td{
          padding-left: 30px;
        }
        tr{

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
  .agreetc_content,.refuse_content,.TowAgreeshow_content{
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
    .TowAgreeshow_body{
      text-align: center;
      margin-top: 50px;
      margin-bottom: 20px;

      .tit01{
        font-size: 20px;
        color: #333333;
      }
      .tit02{
        margin-top: 10px;
        font-size: 14px;
        color: #333333;
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
  /*公用样式*/
  .mt5{
    margin-top: 5px;
  }
  .mt10{
    margin-top: 10px;
  }
  .ml10{
    margin-left: 10px;
  }
  .ml20{
    margin-left: 20px;
  }
  .mr20{
    margin-right: 20px;
  }
  .mr10{
    margin-right: 10px;
  }
  .mb10{
    margin-bottom: 10px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .ml30{
    margin-left: 30px;
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
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .wose{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .clear{
    clear: both;
    overflow: hidden;
  }
  .border_r{
    border-right: 1px solid #e5e5e5;
  }
  .input_check {
    position: absolute;
    width: 20px;
    height: 20px;
    visibility: hidden;
  }
  .input_check + label {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 2px;
    background:url(../../../assets/images/ico_default01.png) no-repeat center;
  }
  .input_check:checked + label {
    display: inline-block;
    width: 15px;
    height: 15px;
    background:url(../../../assets/images/ico_select.png) no-repeat center;
  }

</style>
