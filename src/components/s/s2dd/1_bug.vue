<template>
  <div class="Ordernote clear">
    <div class="poi1">
      <div class="dropdown">
        <div id="dLabel1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="sort">
          <select v-model="searchParams.orderStatus" >
            <option value="" selected>订单状态</option>
            <option value="0">待付款</option>
            <option value="1">待发货</option>
            <option value="2">待收货</option>
            <option value="3">确认收货</option>
            <option value="4">交易完成</option>
          </select>
        </div>
      </div>
      <div class="dropdown">
        <div id="dLabel2" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="state">
          <select v-model="searchParams.afterSellStatus" >
            <option value="" selected>售后状态</option>
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
      <!--<div class="search_cell">

        <span>下单时间<i class="glyphicon glyphicon-calendar" @click="timeBox()"></i></span>
        <div class="time" v-show="is_Success">
          <input type="date" class="form-control search_input search_input_date_l start" v-model="searchParams.startTime"><span class="separator">-</span><input type="date" class="form-control search_input search_input_date_r end" v-model="searchParams.endTime">
        </div>

      </div>-->
      <div class="search_cell">
        <span class="zIndex2" @click="is_Success=!is_Success">下单时间<i class="icon timeIcon"></i></span>
        <div class="time" v-if="is_Success">
          <el-date-picker v-model="searchParams.startTime"   type="date"  placeholder="选择日期"   format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-date-picker v-model="searchParams.endTime" type="date"  placeholder="选择日期"  format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd" @change="search()">
          </el-date-picker>
        </div>
      </div>
      <div class="search">
        <input type="text" class="inp" v-model="searchParams.condition" placeholder="输入商品名称/订单号/支付单号/收货人号码">
        <i class="icon searchIcon" id="searchIco" @click="search()"></i>
      </div>
      <span class="ml10 gjsort" @click="Advancedsearch">高级搜索</span>
      <el-button type="primary" icon="el-icon-download" @click.native="exportSearch()" class="pull-right operation">导出</el-button>
      <!-- 高级搜索 -->
      <div class="poi2 Advanced_s" v-show="Advancedshow===true">
        <div class="">
          <div class="titbt">高级搜索</div>
          <div class="clear">
            <div class="col-sm-6 left">
              <div class="clear mt10 mb20">
                <span class="bt fl ">关键词</span>
                <input class="form-control fl " placeholder="输入商品名称/订单号/支付单号/收货人号码" v-model="searchParams.condition"/>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">订单状态</span>
                <select class="form-control fl " v-model="searchParams.orderStatus">
                  <option value="" selected>全部</option>
                  <option value="0">待付款</option>
                  <option value="1">待发货</option>
                  <option value="2">待收货</option>
                  <option value="3">确认收货</option>
                  <option value="4">交易完成</option>
                </select>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">售后状态</span>
                <select class="form-control fl " v-model="searchParams.afterSellStatus">
                  <option value="" selected>全部</option>
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
              <div class="clear mt10 mb20">
                <span class="bt fl ">广告位</span>
                <select class="form-control fl " v-model="searchParams.hasMedia">
                  <option value="" selected>全部</option>
                  <option value="1" >有</option>
                  <option value="0" >无</option>
                </select>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">开发票</span>
                <select class="form-control fl " v-model="searchParams.invoice">
                  <option value="">全部</option>
                  <option value="0" >个人</option>
                  <option value="1" >公司</option>
                </select>
              </div>
            </div>
            <div class="col-sm-6 right">
              <div class="clear mt10 mb20">
                <span class="bt fl ">下单时间</span>
                <span class="clear">
                  <span class="fl"><input class="form-control time" type="date" v-model="searchParams.startTime"/></span>
                  <span class="fl mr10" style="display:inline-block;line-height:40px;">~</span>
                  <span class="fl"><input class="form-control time" type="date" v-model="searchParams.endTime"/></span>
                </span>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">评论状态</span>
                <select class="form-control fl " v-model="searchParams.commentStatus">
                  <option value="" selected>全部</option>
                  <option value="1">有</option>
                  <option value="0">无</option>
                </select>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">订单类型</span>
                <select class="form-control fl " v-model="searchParams.orderClassify">
                  <option value="" selected>全部</option>
                </select>
              </div>
              <div class="clear mt10 mb20">
                <span class="bt fl ">支付方式</span>
                <select class="form-control fl " v-model="searchParams.payWay">
                  <option value="" selected>全部</option>
                  <option value="1" >支付宝</option>
                  <option value="2" >微信</option>
                </select>
              </div>
            </div>
          </div>
          <div class="footer clear">
            <button class="footerbtn sort" @click="search()">搜索</button>
            <button class="footerbtn ml20 czt" @click="clearAll()">重置</button>
          </div>
        </div>
      </div>
    </div>
    <div class="good_info ">
      <table id="table"  class="notetable col-sm-12">
        <thead>
        <tr>
          <td class="a1">
              <!--  <span class=" mt10">
                  &lt;!&ndash;<input class="input_check" type="checkbox" id="classify" />
                  <label for="classify" class="fl mt10"></label>&ndash;&gt;
                  <el-checkbox @change="checkAll" id="ck_all"></el-checkbox>
                </span>-->
            <span class="ml10">商品信息</span></td>
          <td class="a2">单价/元</td>
          <td class="a3">数量</td>
          <td class="a4">售后状态</td>
          <td class="a5">订单总额/元</td>
          <td class="a6">下单时间</td>
          <td class="a7">收货人</td>
          <td class="a8">订货单状态</td>
        </tr>
        </thead>
        <!-- 在tbody上v-for循环 -->
        <tbody v-for="(item,index) in resultdata">
        <tr>
          <td colspan="8" class="bt clear">
            <span class="ml10">订货号：{{item.dealerOrderId}}</span>  <span style="color: #ccc">&nbsp;|</span></span> <span class="ml10" v-show="item.payNo != '' ? true : false">支付单号：{{item.payNo}}</span>
      <!--      <div class="fl">
                      <span  class="mt10">
                        &lt;!&ndash;<input  type="checkbox" :id="'aa'+index" class="input_check" :value="item.dealerOrderId">
                        <label  :for="'aa'+index" class="fl mt10">
                        </label>&ndash;&gt;
                        <el-checkbox @change="checkClick(index)" :label="'订货号：' + item.dealerOrderId" :name="'ck'+index"></el-checkbox>
                      </span>
              &lt;!&ndash;<span class="ml10">订货号：</span><span>{{item.dealerOrderId}}</span>&ndash;&gt;
            </div>-->
            <div class="fr detail" @click="gotoDetail(item.dealerOrderId, item.orderId)">查看详情</div>
          </td>
        </tr>
        <tr class="content clear" >
         <td colspan="8" class="clear">
            <div class="cont col-sm-8 " style="width:60%;" >
              <div class="fl border_r" style="width:100%;min-height:100px"  v-for="goodsItem in item.goodsList">
              <div class="a1 fl" id="a1" style="width:50%;">
                <div class="a1_img mr10 fl"><img :src="JSON.parse(goodsItem.goodsImage == ''? '[]': goodsItem.goodsImage)[0]"/></div>
                <div class="fl">
                  <div class="wose wid">{{goodsItem.goodsName}}</div>
                  <div class="blue" v-if="goodsItem.skuName != ''">规格：{{goodsItem.skuName}}</div>
                </div>
              </div>
              <div class="a2 fl mt20" id="a2" style="width: 14%;">
                {{goodsItem.discountPrice/100}}
              </div>
              <div class="a3 fl mt20" id="a3" style="width: 18%;text-align: center;padding-right: 40px;">
                {{goodsItem.sellNum}}
              </div>
              <div class="a4 fl mt10" style="width:14%;text-align:center;">
                <!-- 有几种情况的不同表现方 -->
                <div style="">
                  <div class="">{{goodsItem.afStatus==0? '申请退货' : goodsItem.afStatus==1? '申请换货' : goodsItem.afStatus==2? '申请退款' : goodsItem.afStatus==3? '拒绝' : goodsItem.afStatus==4? '同意申请': goodsItem.afStatus==5? '客户寄出' :'--'}}</div>
                  <div class="mt5"><button class="a4_btn" @click="agreeShow(goodsItem.afStatus, goodsItem.skuId)" v-show="goodsItem.afStatus<=2 && goodsItem.afStatus>-1">同意</button></div>
                  <div class="mt5"><button class="a4_btn" @click="refuseShow(goodsItem.skuId)" v-show="goodsItem.afStatus==0">拒绝</button></div>
                </div>
                <div v-show="goodsItem.afStatus==3">
                  <span>已拒绝</span>
                  <i class="ico_explain"></i>
                </div>
              </div>
            </div>
            </div>

            <div class="cont col-sm-4" style="width:40%;">
              <div class="a5" style="width:25%;">
                {{(item.goodsMoney + item.orderFreight - item.dealerDiscount - item.plateDiscount)/100}}
              </div>
              <div class="a6 mt10" style="width:28%;">
                {{date_format(new Date(item.createdDate), 'yyyy-MM-dd hh:mm:ss')}}
              </div>
              <div class="a7 mt10" style="width:28%">
                <div>{{item.revPerson}}</div>
                <div>{{item.revPhone}}</div>
              </div>
              <div class="a8" style="width:10%">
                <span>{{item.orderStatus==0?'待付款': item.orderStatus==1? '待发货' : item.orderStatus==2?'待收货' : item.orderStatus==3 ? '已完成' : item.orderStatus==4 ? '交易完成' : item.orderStatus==5?'交易关闭': '--'}}</span>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="block" style="margin: 20px;float: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
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
      <div class="agreetc_body">确认同意{{afStatus==0?'退货':afStatus==1?'换货':afStatus==2?'退款' : '--'}}申请？</div>
      <div class="agreetc_footer">
        <button type="button" class="btn save" @click="agreeApply()">确认</button>
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
  /* eslint-disable indent,no-trailing-spaces,semi-spacing,no-unused-vars,space-infix-ops,no-multi-spaces,quotes,no-undef,space-before-blocks,semi,no-eval */

  export default {
    name: '',
    data () {
      return {
        isIndeterminate: true,
        amout: '',
        number: '',
        is_Success: false,
        Advancedshow: false,
        Agreeshow: false,
        Refuseshow: false,
        TowAgreeshow: false,
        resultdata: [],
        selDealerOrder:[],
        pageSize: 5,
        pageIndex: 1,
        totalCount: 0,
        dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,//'JXS42ACB6D352E9417FBBCF03908219AAF1',
        // 搜索参数
        searchParams: { orderStatus: '', afterSellStatus: '', startTime: '', endTime: '', condition: '',orderClassify:'', payWay:'', hasMedia:'', invoice: '',commentStatus:''}
        ,afStatus : -2
        ,strSkuId : ''
      }
    },
    methods: {
    // 获取全部订单信息
      agreeShow (_afStatus, strSkuId) {
      var that = this;
      that.Agreeshow = true;
      that.afStatus=_afStatus;
      that.strSkuId = strSkuId;
    },
    getDealerOrders () {
      let that = this
      that.is_Success = false
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/dealerorder/dealerorderlist',
        //url: 'http://localhost:8080/m2c.scm/dealerorder/dealerorderlist',
        data: {
          dealerId: that.dealerId
          ,orderStatus: that.searchParams.orderStatus
          ,afterSellStatus: that.searchParams.afterSellStatus
          ,startTime: that.searchParams.startTime
          ,endTime: that.searchParams.endTime
          ,condition: that.searchParams.condition
          ,payWay: that.searchParams.payWay
          ,invoice: that.searchParams.invoice
          ,commentStatus: that.searchParams.commentStatus
          ,pageNum: that.pageIndex
          ,rows: that.pageSize
        },
        success: function (res) {
          var resultData = res.content;
          that.totalCount = res.totalCount;
          that.resultdata= resultData;
          console.log(res);
        }
      })
    },
    exportSearch (){
      let that = this
      if (that.searchParams.startTime > that.searchParams.endTime) {
        that.show_tip('开始时间不能大于结束时间')
        return
      }
      let url=that.localbase + 'm2c.scm/order/export/dealerorderlist?dealerId='+JSON.parse(sessionStorage.getItem('mUser')).dealerId+
        '&orderStatus='+that.searchParams.orderStatus+
        '&afterSellStatus='+that.searchParams.afterSellStatus+
        '&condition='+that.searchParams.condition+
        '&startTime='+that.searchParams.startTime+
        '&endTime='+that.searchParams.endTime+
        '&payWay='+that.searchParams.payWay+
        '&invoice='+that.searchParams.invoice+
        '&commentStatus='+that.searchParams.commentStatus;
      window.location.href=url
    },
    refuseShow () {
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
        let that=this;
      that.pageIndex = 1;
      this.getDealerOrders()
      that.Advancedshow = false

    },
    Advancedsearch () {
      var that = this;
      that.Advancedshow = true
    }
    ,handleSizeChange (sz) {
        let that = this;
        that.pageSize = sz;
        that.getDealerOrders();
      }
      ,handlePageChange (sz) {
        let that = this;
        that.pageIndex = sz;
        that.getDealerOrders();
      }
      ,gotoDetail(dealerOrId, orderId) {
        let that = this
        var path='dealerOrDtl';
        //sessionStorage.setItem('dealerOrderId', dealerOrId);
        that.$router.push({name : path,query: {dealerOrderId: dealerOrId, orderId:orderId}})
        //that.$goRoute({name:'dealerOrDtl',});
      }
      ,clearAll() {
        let that = this;
        that.searchParams.orderStatus= '';
        that.searchParams.afterSellStatus='';
        that.searchParams.startTime= '';
        that.searchParams.endTime= '';
        that.searchParams.condition= '';
        that.searchParams.orderClassify='';
        that.searchParams.payWay='';
        that.searchParams.hasMedia='';
        that.searchParams.invoice='';
        that.searchParams.commentStatus='';
        that.searchParams.orderStatus1='';
        that.searchParams.afterSellStatus='';
        that.searchParams.condition1= '';
        that.searchParams.startTime1= '';
        that.searchParams.endTime1= '';
      }
      ,agreeApply() {
        let that = this;
        that.$.ajax({
          type: 'put',
          url: that.localbase + 'm2c.scm/order/dealer/agree-apply-sale',
          //url: 'http://localhost:8080/m2c.scm/dealerorder/dealerorderlist',
          data: {
            dealerId: that.dealerId
            ,orderStatus: that.afStatus
            ,afterSellStatus: that.strSkuId
          },
          success: function (res) {
            var resultData = res.content;
            that.Agreeshow = false;
          }
        });
      }
      ,checkClick(index) {
        let that = this;
        var dId = that.resultdata[index].dealerOrderId;
        if(that.$("input[name='ck" + index + "']").prop("checked")) {
          that.selDealerOrder.push(dId);
        }
        else {
          var ct = -1;
          for(var i=0; i<that.selDealerOrder.length; i++){
            if (dId == that.selDealerOrder[i])
              ct = i;
          }
          if (ct != -1)
          that.selDealerOrder.splice(ct);
        }
        //console.log(that.selDealerOrder);
      }
      ,checkAll(val) {
        let that = this;
        var len = that.resultdata.length;
        for (var i = 0; i < len; i++) {
          //console.log(typeof(that.$("input[name='ck" + i + "']").prop("checked")));
          if(that.$("input[name='ck" + i + "']").prop("checked") != val)
            that.$("input[name='ck" + i + "']").click();
        }
      }
  },
  mounted () {
    this.getDealerOrders()
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
        width: 600px;
        height: 61px;
        position: absolute;
        left: 0px;
        top: 55px;
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
        color: #333333;
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
          display: inline-block;
        }
        .a2{
          width: 10%;
          display: inline-block;
        }
        .a3{
          width: 10%;
          display: inline-block;
        }
        .a4{
          width:10% ;
          display: inline-block;

        }
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
        .a5{
          width: 10%;
          display: inline-block;
        }
        .a6{
          width:10% ;
          display: inline-block;
        }
        .a7{
          width:10% ;
          display: inline-block;
        }
        .a8{
          width:10% ;
          display: inline-block;
        }
        .b1{
        	width: 40%;
        	 display: inline-block;
        }
        .b2{
        	width: 400px;
        	display: table-cell;
        	text-align: center;
        }
        .b3{
        	width: 300px;
        	display: table-cell;
        	text-align: center;
        }
        .b4{
        	width: 400px;
        	display: table-cell;
        	text-align: center;
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
            .cont{

            }
            td{
              /*padding-bottom: 10px;*/
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
  .mt20{
    margin-top: 20px;
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
  .border_b{
    border-bottom: 1px solid #e5e5e5;
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
  .zIndex2{z-index:21;}
  .icon{width:40px;height:40px;z-index:11;display:inline-block;}
  .timeIcon{background:url(../../../assets/images/ico_calendar@2x.png) no-repeat center bottom;background-size:19px 20px;}
  .searchIcon{background:url(../../../assets/images/ico_search.png) no-repeat center center;background-size:20px 20px;}
</style>
