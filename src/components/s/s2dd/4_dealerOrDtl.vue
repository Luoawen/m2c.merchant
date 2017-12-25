<template>
  <div class="detail poi1">
    <div class="nav clear">
      <span :class="{active:showactive}" @click="customerdetail"><a>订货单详情</a></span>
      <span :class="{active:showactive02}" @click="customerfreight"><a>发货详情</a></span>
      <span :class="{active:showactive03}" @click="customerecord"><a>操作记录</a></span>
      <!--<button type="button" class="btn btn-info pull-right operation">修改地址</button>-->
      <!--<button type="button">修改运费</button>-->
      <span class="fr" v-show="showactive">
      <a v-show="!bModify">
      	<i class="ico_print"></i>
      	<span class="dy" @click="gotoprint()">打印</span>
      </a>
      <button type="button" class="fah" v-show="!bModify && orderStatus == 1" @click="Deliver=true">发货</button>
        <button type="button" class="fah" v-show="bModify||fModify" @click="saveDealerOrder()">保存</button>
        <button type="button" class="fah" v-show="bModify||fModify" @click="bModify = false,fModify = false">取消</button>
      </span>

    </div>
    <!-- 订货单详情 -->
    <div v-show="showactive" class="customerdetail_container">
      <!-- 拒绝结果，做法根据后台返回数据判断v-show -->
      <!-- <div class="detail_tit02">顾客发起售后申请，请处理</div> -->
      <!--待收货状态会出现收货单，请注意-->
      <div class="detail_tit" v-show="showAfter">售后单：<span>{{strSaleAfterNo}}</span></div>
      <div class="detail_top mt20 clear">
        <div class="col-sm-9 detail_cen">
          <div>
            <span class="tit01">订单状态</span>
            <span class="ml20 redcolor" style="font-size: 18px;">{{strOrderStatus}}</span>
          </div>
          <div class="clear">
          	<div class="col-sm-4 pad0">
            <span class="tit01">订货号</span>
            <span class="ml20">{{dealerOrderId}}</span>
            </div>
            <div class="col-sm-4 pad0">
            <span class="tit01">下单时间</span>
            <span class="ml20">{{createdDate}}</span>
            </div>
          </div>
          <div class="clear">
          	<div class="col-sm-4 pad0">
            <span class="tit01">支付方式</span>
            <span class="ml20">{{payWay === 1 ? '支付宝': payWay === 2 ? '微信': '--'}}</span>
           	</div>
           	<div class="col-sm-4 pad0">
            <span class="tit01">支付时间</span>
            <span class="ml20">{{payTime==''?'--':payTime}}</span>
            </div>
            <div class="col-sm-4 pad0">
            <span class="tit01">支付单号</span>
            <span class="ml20">{{payNo==''?'--':payNo}}</span>
            </div>
          </div>

        </div>
        <div class="col-sm-11 detail_cen">
        <div>
          <span class="tit01">收货信息</span>
          <span class="ml20">
          	<span>{{recvAddr}}</span>
          	<i class="ico_compile" v-show="orderStatus === 0||orderStatus === 1 ? !bModify : bModify" @click="modifyFreight(true)"></i>
          </span>
        </div>
        	<!--点击ico_compile后出现编辑地址-->
        <div class="clear" v-show="bModify">
        		<span class="tit01 fl"></span>
          	<span class="ml20 fl">
          	<span class="fl mr20">
          		<select class="bj_select form-control" v-model="provinceCode" id="province_select">
          			<option v-for="(cell,index) in province_all_search" :key="index" :value="cell.code">
                  {{cell.name}}
                </option>
          		</select>
          	</span>
          	<span  class="fl mr20">
          		<select class="bj_select form-control" v-model="cityCode" id="city_select">
          			<option v-for="(cell,index) in city_all_search" :key="index" :value="cell.code">
                  {{cell.name}}
                </option>
          		</select>
          	</span>
          	<span  class="fl mr20">
          		<select class="bj_select form-control" v-model="areaCode" id="area_select">
          			<option v-for="(cell,index) in area_all_search" :key="index" :value="cell.code">
                  {{cell.name}}
                </option>
          		</select>
          	</span>
          	<span class="fl mr20">
          		<input class="bj02_select form-control" maxlength="20" v-model="streetAddr"/>
          	</span>
              <span class="fl mr20">
          		<input class="bj_select form-control" maxlength="10" v-model="revPerson"/>
          	</span>
              <span class="fl mr20">
          		<input class="bj_select form-control" maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="phone"/>
          	</span>
          	</span>
        </div>
        <div>
          <span class="tit01">发票信息</span>
          <span class="ml20">{{invoiceInfo==''?'--':invoiceInfo}}</span>
        </div>

        <div>
          <span class="tit01">买家留言</span>
          <span class="ml20 ">{{noted==''?'--':noted}}</span>
        </div>
        </div>
      </div>

      <table class="mt20 detail_table">
        <thead>
          <tr>
            <td class="a1">商品信息</td>
            <td class="a2">广告位信息</td>
            <td class="a3">数量</td>
            <td class="a4">单位</td>
            <td class="a5">单价/元</td>
            <td class="a5">商品金额/元</td>
            <td class="a6">运费</td>
          </tr>
        </thead>
        <tbody id="goodsTabBody" v-for="(goods,index) in goodses">
        	<tr>
        		<td class="a1 clear">
        			<div class="a1_img mr10 fl"><img :src="JSON.parse(goods.goodsImage == ''? '[]': goods.goodsImage)[0]" /></div>
            	<!-- <div> -->
              <div class="wose wid mt10">
                <i v-if="goods.isChange==1" class="changeGood"></i>
                {{goods.goodsName}}
              </div>
              <div class="blue" v-if="goods.skuName != ''">规格：{{goods.skuName}}</div>
            	<!-- </div> -->
        		</td>
            <td class="a2">{{goods.mediaResId!=''?(typeof(mediaResInfos[goods.mediaResId])!='undefined'?mediaResInfos[goods.mediaResId].name : ''):''}}
              <br>{{goods.mediaResId!=''?(typeof(mediaResInfos[goods.mediaResId])!='undefined'?mediaResInfos[goods.mediaResId].cateName:''):''}}</td>
            <td class="a3">{{goods.sellNum}}</td>
            <td class="a4">{{goods.unitName}}</td>
            <td class="a5">
              <template v-if="goods.isSpecial==1">特惠价 {{(goods.strSpecialPrice)}}</template>
              <p :class="{'lineThrough':goods.isSpecial==1}">{{(goods.strPrice)}}</p>
            </td>
            <td class="a5">{{(goods.strTotalPrice)}}</td>
            <td class="a6">
            	<span :id="'spanFreight' + index" v-show="!fModify">{{(goods.strFreight)}}</span>
            	<i class="ico_compile" @click="modifyFreight1(true)" v-show="orderStatus === 0 ? !fModify : fModify"></i>
            	<!--点击ico_compile后会出现input-->
            	<input class="form-control a6_input" :id="'freight'+ index" v-show="fModify" v-model="goods.strFreight" type="number"/>
            </td>
        	</tr>
        </tbody>
        <tbody class="js_num">
        	<tr>
        		<td colspan="5"></td>
        		<td>
        			<div>商品总额</div>
							<div>运费</div>
							<div>优惠金额</div>
							<!--<div>商家优惠券</div>-->
							<div>订单总额</div>
        		</td>
        		<td class="pr40">
        			<div>{{(totalData.strTotalOrderPrice)}}</div>
							<div>{{(totalData.strTotalFreight)}}</div>
							<div>{{(totalData.strPlateformDiscount)}}</div>
							<!--<div>{{totalData.dealerDiscount}}</div>-->
							<div class="redcolor" style="font-size: 18px;">{{(totalData.orderPrice)}}</div>
        		</td>
        	</tr>
        </tbody>
      </table>
    </div>
    <!-- 发货详情 -->
    <div v-show="showactive02" class="customerdetail_container">
      <div class="detail_top mt20 clear">
        <div class="col-sm-9 detail_cen">
          <div>
            <span class="tit01">订单状态</span>
            <span class="ml20 redcolor" style="font-size: 18px;">{{strOrderStatus}}</span>
          </div>
          <div>
            <span class="tit01">订货号</span>
            <span class="ml20">{{dealerOrderId}}</span>
            <!--<span class="tit01">下单时间</span>
            <span class="ml20">{{createdDate}}</span>-->
          </div>
        </div>
        <div class="col-sm-11 detail_cen">
          <div>
            <span class="tit01">收货信息</span>
            <span class="ml20">{{recvAddr}}</span>
          </div>
        </div>
      </div>

      <table class="mt20 detail_table">
        <thead>
        	<tr class="fh">
      		<td colspan="2">{{orderStatus === 1 ? '待发货数：' + expressNum : orderStatus == 2 ? '待收货数：' + expressNum: orderStatus > 2 ? '已收货数：' + expressNum:'--'}}</td>
      		<td>
      			<button class="fah fr mr10" @click="deliver" v-show="orderStatus==1">发货</button>
      		</td>
      	</tr>
        <tr>
          <td class="a1">商品信息</td>
          <td class="a2">订货数</td>
          <td class="a3">待发货数</td>
        </tr>
        </thead>
        <tbody id="sendTabBody" v-for="(goods,index) in goodses">
        	<tr>
        		<td class="a1 clear">
        			<div class="a1_img mr10 fl"><img :src="JSON.parse(goods.goodsImage == ''? '[]': goods.goodsImage)[0]"/></div>
              <div class="wose wid mt10">
                <i v-if="goods.isChange==1" class="changeGood"></i>
                {{goods.goodsName}}</div>
              <div class="blue" v-if="goods.skuName != ''">规格：{{goods.skuName}}</div>
        		</td>
        		<td>{{goods.sellNum}}</td>
        		<td>{{(orderStatus==1 || orderStatus==0)? (goods.sellNum - goods.afNum) : 0}}</td>
        	</tr>
        </tbody>
        <tbody class="deliver_tb">
          <tr>
            <td colspan="3">
            <div class="mt10 mb10">
              <span class="mr20 tit_tb">配送方式</span>
              <span class="ml20">
                <span>{{orderStatus>=2? (expressWay==0?'物流发货':expressWay==1?'自有物流':'-') :'-'}}
                  <span class="mr20 tit_tbb">{{orderStatus>=2? (expressWay==0?'物流公司':expressWay==1?'配送员':''):''}}</span>
                  <span class="ml20">{{expressWay==0?expressName:expressWay==1?expressPerson+'， '+expressPhone:''}}</span>
                </span>
              </span>
            </div>
            <div class="mt10 mb10" v-show="expressWay==0">
              <span class="mr20 tit_tb">物流单号</span>
              <span class="ml20">
              <span>{{orderStatus>=2? expressNo:'-'}}</span>
              </span>
            </div>
            <div class="mt10 mb10">
              <span class="mr20 tit_tb">备注</span>
              <span class="ml20">
              <span>{{orderStatus>=2? expressNote:'-'}}</span>
              </span>
            </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  	<!--发货弹层-->
  	<div class="poi2 deliver col-sm-12" v-show="Deliver===true">
    <div class="poi1">
      <i class="poi2 ico_close02" @click="Deliver=false"></i>
      <div class="deliver_tit">发货信息</div>
      <div class="deliver_type01 mt20 clear">
        <span class="mr20 tit01 fl">
        <span class="redcolor">*</span>
        <span>配送方式</span>
        </span>
        <template>
          <el-radio v-model="expressWay" label="0" @click="expressCheck(0)" >物流发货</el-radio>
          <el-radio v-model="expressWay" label="1" @click="expressCheck(1)">自有物流</el-radio>
        </template>
        <div class="tit03 clear">若有自己的配送车队，可选自有物流</div>
      </div>
      <div class="deliver_type01 clear">
        <div class=""  v-show="expressWay != 1">
        <span class="mr20 tit01 mt10 fl">
        <span class="redcolor">*</span>
        <span style="line-height:40px">物流公司</span>
        </span>
        <span>
          <select class="form-control deliver_input fl" placeholder="请选择" v-model="expressCode" id="ship_select">
            <option v-for="(item,index) in shipments" :key="index" :value="item.expressCode">{{item.expressName}}</option>
          </select>
        </span>
        </div>
        <div class="" v-show="expressWay == 1">
        <span class="mr20 tit01 fl">
          <span class="redcolor">*</span>
          <span>配送员姓名</span>
        </span>
          <span>
          <input class="form-control deliver_input" placeholder="请填写" maxlength="10" v-model="expressPerson"/>
        </span>
        </div>
      </div>
      <div class="deliver_type01 mb10 clear" style="margin-top:-10px;">
        <div class="">
        <span class="mr20 tit01 fl">
           <span class="redcolor" v-show="expressWay != 1">*</span>
           <span v-show="expressWay == 1">运单号</span>
           <span  v-show="expressWay != 1">物流单号</span>
        </span>
        <span>
          <input v-show="expressWay == 1" class="form-control deliver_input" placeholder="选填" maxlength="30" v-model="expressNo"/>
          <input v-show="expressWay != 1" class="form-control deliver_input" placeholder="请填写" maxlength="30" v-model="expressNo"/>
        </span>
        </div>

          <div class="" v-show="expressWay == 1">
        <span class="mr20 tit01 fl">
        <span class="redcolor">*</span>
        <span>配送员手机号</span>
        </span>
            <span>
          <input class="form-control deliver_input" placeholder="请填写" maxlength="11" v-model="expressPhone"/>
        </span>
          </div>
        <div class="">
        <span class="mr20 tit01 fl">
        <span>备注</span>
        </span>
          <span>
          <input class="form-control deliver_input" placeholder="选填" maxlength="100" v-model="expressNote"/>
        </span>
        </div>
      </div>
      <div class="deliver_type01 mt20 mb10 clear">
        <button class="deliversure btn01 mr20 ml20" @click="deliverDealerOrder()">确定发货</button>
        <button class="btn01 deliverdel" @click="Deliver=false">取消</button>
        <span class="ml20 redcolor bz">请仔细填写发货信息，一旦确定，不可修改！</span>
      </div>
      </div>
  	</div>
    <!-- 操作记录 -->
    <div v-show="showactive03">
        <!--<table id="logTable" style="table-layout:fixed"></table>-->
      <div class="ops_red">
        <div class="ops_tabs">

          <el-table
            :data="operatingRecords"
            style="width: 100%">
            <el-table-column
              prop="optTime"
              label="操作时间">
              <template slot-scope="scope">{{date_format(new Date(scope.row.optTime), 'yyyy-MM-dd hh:mm:ss')  }}</template>
            </el-table-column>
            <el-table-column
              prop="optContent"
              label="操作内容">
            </el-table-column>
            <el-table-column
              prop="optUserStr"
              label="操作人">
            </el-table-column>
          </el-table>
        </div>

        <div class="page_pus" style="margin-top: 20px;float: right;margin-right: 30px;height: 60px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="pageRows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        goodsMoney: 0,
        orderFreight: 0,
        is_Success: false,
        showactive: true,
        showactive02: false,
        showactive03: false,
        showAfter: false,
        Deliver: false,
        strOrderStatus: '',
        orderStatus: 0,
        dealerOrderId: '',
        createdDate: '',
        payWay: '',
        payNo: '',
        payTime: '',
        recvAddr: '',
        invoiceInfo: '',
        noted: '',
        goodses: [],
        totalData: {},
        bModify: false,
        fModify: false,
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        area: '',
        areaCode: '',
        streetAddr: '',
        revPerson: '',
        phone: '',
        strSaleAfterNo: ''
        ,shipments: []
        ,expressNote: ''
        ,expressNo: ''
        ,expressName: ''
        ,expressCode: ''
        ,expressWay: '0'
        ,expressPhone: ''
        ,expressPerson: ''
        ,province_all_search: []
        // 可选的城市(供搜索使用)
        ,city_all_search: []
        // 所有的区(供搜索使用)
        ,area_all_search: []
        ,expressNum:0
        ,pageRows:5
        ,currentPage: 1
        ,totalCount:0
        ,operatingRecords:[]
        ,orderNo:''
        ,mediaResInfos : {}
        ,isGetUserRuning: false
        ,_map :{},
        shopName:''
      }
    },
    watch: {
      // 查询时监控省份
      'provinceCode': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.city_show = false
            that.area_show = false
            return
          }
          if (code !== oldCode) {
            // // console.log('(查询)省份选择变化,新的省份code:' + code + ',旧的省份code:' + oldCode)
            that.$.ajax({
              url: that.base + 'm2c.support/regn/cits',
              data: {
                token: sessionStorage.getItem('mToken'),
                province: code
              },
              success: function (result) {
                // console.log('(查询)获得的市信息列表: ', result)
                that.city_all_search = result.content
                that.city_show = true
                that.area_show = false
                if (that.isModify === true) {
                  that.area_show = true
                  that.isModify = false
                }
              }
            })
          }
        },
        deep: true
      },
      // 查询时监控城市
      'cityCode': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.area_show = false
            return
          }
          if (code !== oldCode) {
            // // console.log('(查询)城市选择变化,新的城市code:' + code + ',旧的城市code:' + oldCode)
            that.$.ajax({
              url: that.base + 'm2c.support/regn/areas',
              data: {
                token: sessionStorage.getItem('mToken'),
                city: code
              },
              success: function (result) {
                // console.log('(查询)获得的区域信息列表: ', result)
                that.area_all_search = result.content
                //that.area_show = true
              }
            })
          }
        },
        deep: true
      }
    },
    methods: {
      gotoprint(dealerOrId) {
        let that = this
        //var path='printSendOrder';
        that.$router.push({name : 'printSendOrder',query: {dealerOrderId: that.dealerOrderId,orderNo:that.orderNo}})
      },
      // 获取全部订单信息
      customerdetail () {
        var that = this
        that.showactive = true;
        that.showactive02 = false;
        that.showactive03 = false;
      },
      customerfreight () {
        var that = this
        that.$.ajax({
          //url: that.base + 'm2c.scm/order/dealer/sendOrderDetail',
          //url: 'http://localhost:8080/m2c.scm/dealer/sendOrderDetail',
          url: that.base + 'm2c.scm/order/dealer/expressDetail',
          type: 'get',
          cache: false,
          pagination: true,
          data: {
            dealerOrderId: that.dealerOrderId
          },
          success: function (result) {
            if (result.status === 200) {
              that.expressNote  =result.content[0].expressNote
              that.expressNo    =result.content[0].expressNo
              that.expressName  =result.content[0].expressName
              that.expressWay   =result.content[0].expressWay
              that.expressPerson=result.content[0].expressPerson
              that.expressPhone =result.content[0].expressPhone
              that.expressCode  =result.content[0].expressCode
            }
          }
        })
        that.showactive02 = true;
        that.showactive = false;
        that.showactive03 = false;
      },
      customerecord () {
        var that = this
        that.showactive03 = true;
        that.showactive02 = false;
        that.showactive = false;
      },
      deliver () {
        var that = this
        that.Deliver = true
      }
      ,expressCheck(val) {
        let that = this;
        that.expressWay = val;
        console.log(that.$("#classify2").val());
      }
      //列表
      ,getDealerOrderInfo () {
        let that = this;
        that.$.ajax({
          url: that.base + 'm2c.scm/order/dealer/orderdetail',
          //url: 'http://localhost:8080/m2c.scm/order/dealer/orderdetail',
          type: 'get',
          cache: false,
          pagination: true,
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerOrderId: that.dealerOrderId
          },
          success: function (result) {

            if (result.status === 200) {
              that.setReturnData(result.content);
            }
          }
        })

        that.get_log_info();
        that.shipment();
      },

      setReturnData: function (data) {
        let that = this;

          that.goodsMoney = data.orderPrice;
          that.orderFreight = data.orderFreight;
        that.orderStatus = data.orderStatus;
          that.strOrderStatus = data.orderStatus === 0? '待付款': data.orderStatus === 1? '待发货': data.orderStatus === 2? '待收货': data.orderStatus === 3? '已完成': data.orderStatus === 4? '交易完成': data.orderStatus === 5? '交易关闭': data.orderStatus === -1? '已取消': '--';
          //that.dealerOrderId = dealerOrderId;
          var d = new Date(data.createdDate);
          that.createdDate = that.date_format(d, 'yyyy-MM-dd hh:mm:ss');
          that.payWay = data.payWay;
          that.payNo = data.payNo;
        that.provinceCode = data.privinceCode;
        console.warn("data.privinceCode="+that.provinceCode)
        that.cityCode = data.cityCode;
        that.areaCode = data.areaCode;
          if (data.payDate != null) {
            d = new Date(data.payDate)
            that.payTime  = that.date_format(d, 'yyyy-MM-dd hh:mm:ss');
          }
          that.city = data.city;
          that.province = data.province;
          console.log(data.provinceCode)
        that.area = data.areaCounty;
        that.phone = data.revPhone;
        that.revPerson = data.revPerson;
        that.streetAddr = data.streetAddr;

          that.recvAddr = data.province + data.city + data.areaCounty + data.streetAddr + " " + data.revPerson + " " + data.revPhone;
          if (data.invoiceType != -1) {
            if (data.invoiceType==1)
              that.invoiceInfo = "发票抬头：" + data.invoiceHeader + " 纳税人标识：" + data.invoiceCode + "发票内容：明细"; //data.invoiceName +
            else if (data.invoiceType==0)
              that.invoiceInfo = "发票抬头：" + data.invoiceHeader + "发票内容：明细"; //data.invoiceName;
          }
          that.noted = data.noted;

          that.setGoodsTable(data.goodsInfoBeans, data);
      },
      setGoodsTable: function (goodses, totalData) {
        let that = this;
        that.goodses = goodses;
        that.totalData = totalData;
        that.expressNum = 0;
        var resIds = '';
        that.goodses.forEach(function(val, index) {
          val.freight = val.freight;
          //val.mediaResId='18AD16F1F35C569E4C1785DF22FA47652789';
          if(typeof(val.mediaResId)=='undefined' || val.mediaResId==null ||  val.mediaResId=='')
            ;//val.mediaResId = '-'
          else {
            if (index > 0)
              resIds += ',';
            resIds += '"'+val.mediaResId+'"';
          }
          that.expressNum += val.sellNum - val.afNum;
        });
        that.getMediaResInfo(resIds);
      },
      get_log_info () {
        let that = this
        that.is_Success = false
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.scm/order/logs/' + that.dealerOrderId,
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            orderId: that.$route.query.orderId,
            rows: that.pageRows,                     // 每页多少条数据
            pageNum: that.currentPage,    // 请求第几页*/
          },
          success: function (result) {
            if (result.status === 200){
              // 获取订单操作列表
              that.operatingRecords = result.content;
              that.totalCount = result.totalCount;
              var uIds = '';
              var ct = 0;
              for (var i=0; i< that.operatingRecords.length; i++) {
                var usId = that.operatingRecords[i].optUser;
                that.operatingRecords[i].optUserStr = '--';
                if (uIds.indexOf(usId) == -1) {
                  if (ct>0)
                    uIds +=',';
                  ct ++;
                  uIds += usId;
                }
              }
              that.totalCount = result.totalCount;
              console.log('fanjc======' + uIds)
              that.getUserByIds(uIds);
            }
          }
        });
      },
      modifyFreight (isModify) {
        let that = this;
        if(that.orderStatus <= 1)
          that.bModify = isModify;
      },
      modifyFreight1 (isModify) {
        let that = this;
        if(that.orderStatus < 1)
          that.fModify = isModify;
      },
      deliverDealerOrder(){
        // 发货请求
        let that=this;
        if (that.expressWay == 0) {
          if (that.expressCode == '') {
            that.show_tip('请选择物流公司')
            return
          }
          if (that.expressNo == '') {
            that.show_tip('请填写物流单号')
            return
          }
          var pattern = /^[0-9a-zA-Z]{1,30}$/
          if (!pattern.test(that.expressNo)){
            that.show_tip('物流单号只可以输入字母或数字')
            return
          }
        }
        if (that.expressWay == 1) {
          if (that.expressPerson == '') {
            that.show_tip('请填写配送员姓名')
            return
          }
          if (that.expressPhone == '') {
            that.show_tip('请填写配送员手机号')
            return
          }
          var pattern = /^(13|14|15|17|18)[0-9]{9}$/
          if (!pattern.test(that.expressPhone)){
            that.show_tip('请填写正确的配送员手机号')
            return
          }
        }
        let select = document.querySelector('#ship_select')
        if (select !== null) {
          let options = select.options
          let index = select.selectedIndex
          if (index === -1) {
            //that.expressName = ''
          } else {
            that.expressName = options[index].text
          }
        }
        that.$.ajax({
          url: that.base + 'm2c.scm/order/dealer/sendOrder',
          //url: 'http://localhost:8080/m2c.scm/order/dealer/sendOrder',
          type: 'put',
          cache: false,
          pagination: true,
          data: {
            token: sessionStorage.getItem('mToken'),
            expressNo: that.expressNo,
            expressName: that.expressName,
            expressNote: that.expressNote,
            expressPerson: that.expressPerson,
            expressPhone: that.expressPhone,
            expressWay: that.expressWay,
            expressCode: that.expressCode,
            dealerOrderId: that.dealerOrderId
            ,userId: JSON.parse(sessionStorage.getItem('mUser')).userId,
            orderId: that.orderNo,
            shopName: that.shopName
          },
          success: function (result) {
            console.log(result);
            if (result.status === 200) {
              that.Deliver = false;
              that.customerdetail();
              that.getDealerOrderInfo();
              that.show_tip('发货成功！');
            }
            else {
              that.show_tip('发货失败！');
            }
          }
        })
      },
      saveDealerOrder  () {
        // 保存 修改收货地址 运费
        let that = this;
        let select = document.querySelector('#province_select')
        if(that.bModify == true){
        if (select !== null) {
          let options = select.options
          let index = select.selectedIndex
          if (index === -1) {
            that.show_tip("请选择省份");
            return;
          } else {
            that.province = options[index].text
          }
        }
        select = document.querySelector('#city_select')
        if (select !== null) {
          let options = select.options
          let index = select.selectedIndex
          if (index === -1) {
            that.show_tip("请选择城市");
            return;
          } else {
            that.city = options[index].text
          }
        }
        select = document.querySelector('#area_select')
        if (select !== null) {
          let options = select.options
          let index = select.selectedIndex
          if (index === -1) {
            that.show_tip("请选择地区");
            return;
          } else {
            that.area = options[index].text
          }
        }
        }
        if(that.$(".a6_input").val()<0){
          that.show_tip("输入金额不能位负数")
          return
        }
        var pattern =/^[0-9]+([.]\d{1,2})?$/;
        if(!pattern.test(that.$(".a6_input").val())){
          that.show_tip("请输入数字(例:0.00),最高保留两位小数");
          return
        }
        if(that.streetAddr==''){
          that.show_tip("请输入详细地址")
          return
        }
        if(that.revPerson == ''){
          that.show_tip("请输入收货人姓名")
          return
        }
        if(that.phone == ''){
          that.show_tip("请输入收货人手机号")
          return
        }

        var freightStr='';
        that.goodses.forEach(function(val, index) {
          if (index > 0)
            freightStr += ',';
          freightStr += (val.skuId + ':' + val.freight);
        });
        freightStr = '{' + freightStr + '}';
        // 发请求
        that.$.ajax({
          url: that.base + 'm2c.scm/dealerorder/addrfreight',
          //url: 'http://localhost:8080/m2c.scm/dealerorder/addrfreight',
          type: 'put',
          cache: false,
          pagination: true,
          data: {
            token: sessionStorage.getItem('mToken'),
            province: that.province,
            provCode: that.provinceCode,
            city: that.city,
            cityCode: that.cityCode,
            area: that.area,
            areaCode: that.areaCode,
            revPerson: that.revPerson,
            phone: that.phone,
            street: that.streetAddr,
            dealerOrderId: that.dealerOrderId,
            freights: freightStr
            ,userId: JSON.parse(sessionStorage.getItem('mUser')).userId
          },
          success: function (result) {
            //console.log(result)
            if (result.status === 200) {
              that.bModify = false;
              that.fModify = false;
              that.getDealerOrderInfo();
              that.show_tip('修改成功！');
            }
          }
        })
      }
      ,shipment(){
        let that = this
        that.$.ajax({
          type: 'GET',
          url: this.base + 'm2c.scm/order/dealer/express',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false
          },
          success: function (result) {
            //console.log("shipment:" + result);
            if (result.status === 200){
              // 物流列表
              that.shipments= result.content
            }
          }
        })
      }
      ,getUserByIds(ids) {
        console.log('fanjc======getUserByIds');
        let that = this;
        if (that.isGetUserRuning)
          return;
        that.isGetUserRuning = true;
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.users/user/getUserInfoByIds',
          data: {
            token: sessionStorage.getItem('mToken'),
            userIds: ids
          },
          success: function (result) {
            //console.log('fanjc======')
            //console.log(result);
            if (result.status === 200){
              that._map = {};
              var sz = result.content.length;
              for(var i=0; i<sz; i++) {
                var obj = result.content[i];
                that._map[obj.userId] = obj.mobile + '[' + obj.userName + ']';
              }
              for (var i=0; i< that.operatingRecords.length> 0; i++) {
                if (typeof(that._map[that.operatingRecords[i].optUser]) != 'undefined') {
                  that.operatingRecords[i].optUserStr = that._map[that.operatingRecords[i].optUser];
              } else {
                  that.operatingRecords[i].optUserStr = that.operatingRecords[i].optUser;
                }
              }
            }
            console.log(that.operatingRecords);
            that.isGetUserRuning = false;
          }
        });
      }
      ,handleSizeChange(val) {
        let that = this
        that.pageRows=val
        that.get_log_info();
      }
      ,handleCurrentChange(val) {
        let that = this
        that.currentPage=val
        that.get_log_info();
      }
      ,getMediaResInfo(resIds) {
        if (resIds == '') {
          return;
        }
        let that = this;
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.media/mres/byIdList/mu',
          data: {
            token: sessionStorage.getItem('mToken'),
            mresIdList: '[' + resIds + ']'
          },
          success: function (result) {
            console.log(result);
            if (result.status == 200) {
              result.content;
              that.mediaResInfos = {};

              for (var i=0; i<result.content.length; i++) {
                var a = {};
                a.name = result.content[i].mresName;
                a.cateName = result.content[i].cateName;
                that.mediaResInfos[result.content[i].mresId] = a;
              }
              console.log("mediaResInfos:");
              console.log(that.mediaResInfos);
            }
          }
        });
      },
      // 查找经销商信息
      getDealerMess () {
        const that = this
        that.$.ajax({
          type: 'get',
          url: this.localbase + 'm2c.scm/shop/sys/shopInfo',
          data: {
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
          },
          success: function (res) {
            console.log(res)
            that.shopName = res.content.shopName
          }
        })
      },
    }
    ,mounted () {
      let that = this;
      that.dealerOrderId = that.$route.query.dealerOrderId;
      that.orderNo = that.$route.query.orderId
      that.getDealerMess()
      that.getDealerOrderInfo();
      that.$.ajax({
        url: that.base + 'm2c.support/regn/provs',
        data: {
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          console.log('获得的省份信息列表: ', result.content)
          that.province_all_search = result.content;
        }
      })
    }
  }
</script>
<style lang="scss" scoped>
a{text-decoration:none}
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
.pad0{
	padding:0px;
}
.detail{
    width:95%;
    min-height: 84px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .deliver{
    	background: #fff;
    	height: auto;
      top: 0px;
      left: 0px;
      padding:30px;
      padding-top:20px;
      box-shadow: 0px 6px 6px #ccc;
      .ico_close02{
        width: 24px;
        height: 24px;
        display: inline-block;
        background: url(../../../assets/images/ico_close02.png);
        top: 0px;
        right: 0px;
      }
      .deliver_tit{
        font-size: 18px;
        color: #333333;
      }
      .deliver_type01{
        padding-left: 20px;
        .bz{
          font-size: 12px;
        }
        .btn01{
          border-radius: 2px;
          line-height: 30px;
          height: 30px;
          padding-left: 30px;
          padding-right: 30px;
          border: none;
        }
        .deliversure{
          background: #0086FF;
          color: #fff;
        }
        .deliverdel{
          background: #fff;
          border: 1px solid #CCCCCC;
          border-radius: 2px;
          color: #444;
        }
        .tit01{
          /*display: inline-block;*/
          width: 120px;
          display: inline-block;
          line-height: 30px;
          text-align: right;
        }
        .el-radio{
          line-height:30px;
        }
        .tit02{
          span{
            display: inline-block;
            line-height: 30px;
          }
        }
        .tit03{
          font-size: 12px;
          color: #999999;
          margin-left: 142px;
          }
          .deliver_input{
            width: 30%;
            height: 40px;
            margin:15px 0;
          }
      }
    }
    .fah{
    		background: #0086FF;
				border-radius: 2px;
				width: 80px;
				height: 30px;
				color: #fff;
				text-align: center;
				line-height: 30px;
				border: none;
				margin-top: 5px;
    	}
    .nav{
    	.ico_print{
    		width: 16px;
    		height: 16px;
    		display: inline-block;
    		margin-right: 5px;
    		background: url(../../../assets/images/ico_print.png);
    	}
    	.fah{
    		background: #0086FF;
				border-radius: 2px;
				width: 80px;
				height: 30px;
				color: #fff;
				text-align: center;
				line-height: 30px;
				border: none;
				margin-top: 5px;
    	}
    	.dy{
    		padding-left: 0px;
    		line-height: 38px;
    	}
      .active{
        border-bottom:1px solid #0086FF;
      }
      height: 38px;
      line-height: 38px;
      border-bottom:1px solid #e7e7e7 ;
      span{
        display: inline-block;
        padding-left: 30px;
        padding-right: 30px;
        line-height: 35px;
      }
    }
    .customerdetail_container{
      .detail_table{
        margin: auto;
        border: 1px solid #e7e7e7;
        width: 99%;
        margin-top: 20px;
        .fh{
        background: #fff;
    	 }
       .deliver_tb{
         background: #fff;
         .tit_tb{
           display: inline-block;
           width: 80px;
           text-align: right;
           color: #666666;
         }
         .tit_tbb{
           display: inline-block;
           margin-left: 150px;
           width: 80px;
           text-align: right;
           color: #666666;
         }
       }
        td{
          padding-left: 20px;
          p.lineThrough{text-decoration:line-through;font-size:12px;color:#999;}
        }
        .a1_img{
            img{
              width: 50px;
              height: 50px;
              margin-top: 20px;
              margin-bottom: 20px;
            }
          }
        .a1{
          width: 22%;
          .a1tab{
          	padding-left: 50px;
          }
        }
        .a2{
          width:11%;
        }
        .a3{
          width:7%;
        }
        .a4{
          width:7.5%;
        }
        .a5{
          width:8%;
        }
        .a6{
          width:10%;
        }
        .a7{
          width:7.5%;
        }
        .a6_input{
        	border: 1px solid #E6E8F2;
        	width: 100px;
        	height: 40px;
        }
        thead{
          background: #DFE9F6;
          line-height: 40px;
          height: 40px;
        }
        tbody{
        	border-bottom: 1px solid #E5E5E5;
        	background: #F4F5FA;
        }
        .js_num{
        	background: #fff;
        	padding-top: 20px;
        	padding-bottom: 20px;
        	td{
        		padding-top: 20px;
        		padding-bottom: 20px;
        		line-height: 30px;
        		text-align: right;
        	}
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
          .bj_select{
          	width: 120px;
          	height: 34px;
            line-height: 34px;
            padding:0 10px;
            margin-top:8px;
          option{
          	height: 40px;
          	line-height: 40px;
          }
          }
          .bj02_select{
          	width: 350px;
          	height: 34px;
            line-height: 34px;
            margin-top:8px;
          }
        }
      }
    }
    .ico_compile{
     	width: 16px;
      height: 16px;
      background: url(../../../assets/images/ico_compile.png);
      display: inline-block;
      margin-left: 10px;
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
  .pr20{
  	padding-right: 20px;
  }
  .pr40{
  	padding-right: 40px;
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
    height:48px;padding-top:5px;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .blue{
    float: left;
  	font-size: 12px;
		color: #999;
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
    width: 17px;
    height: 17px;
    visibility: hidden;
  }
  .input_check + label {
    display: inline-block;
    width: 17px;
    height: 17px;
    border-radius: 2px;
    background:url(../../../assets/images/ico_radio_default.png) no-repeat center;
  }
  .input_check:checked + label {
    display: inline-block;
    width: 17px;
    height: 17px;
    background:url(../../../assets/images/ico_radio_select.png) no-repeat center;
  }

</style>
