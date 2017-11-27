<template>
  <div class="printSendOrder">
  	<div class="bt">
  		拍获商城发货单
      <a @click="print_order" class="print_order_style">
        <i class="ico_print"></i>
        <span class="dy" >打印</span>
      </a>
  	</div>
  	<div class="printSend_top">
  		<el-row>
  			<el-col :span="8">
  				<div class="grid-content">
  					<div class="tit">
  						<span class="tit_span">收货人：</span>
  						<span>{{revPerson}}</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span">订单号：</span>
  						<span>{{orderId}}</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span">订单总额：</span>
  						<span>{{(goodsMoney/100).toFixed(2)}}</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span1">收货地址：</span>
  						<span style="width:500px">{{recvAddr}}</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span">留言：</span>
  						<span>{{noted}}</span>
  					</div>
  				</div>
  			</el-col>
  			<el-col :span="8">
  				<div class="grid-content">
  				<div class="tit">
  						<span class="tit_span">收货人号码：</span>
  						<span>{{phone}}</span>
  					</div>
  				</div>
  				<div class="tit">
  						<span class="tit_span">下单时间：</span>
  						<span>{{createdDate}}</span>
  				</div>
  				<div class="tit">
  						<span class="tit_span">优惠金额：</span>
  						<span>{{(freeMoney).toFixed(2)}}</span>
  				</div>
  			</el-col>
			</el-row>
  	</div>
  	<div class="printSend_cen">
  		<table class="printSend_tab">
  			<thead>
  				<tr>
  					<td class="a1">序号</td>
  					<td class="a2">商品名称</td>
  					<td class="a3">规格</td>
  					<td class="a4">单价/元</td>
  					<td class="a5">数量</td>
  					<td class="a6">商品金额/元</td>
  				</tr>
  			</thead>
  			<tbody v-for="(goods,index) in goodses">
  				<tr>
  					<td>{{++index}}</td>
  					<td>{{goods.goodsName}}</td>
  					<td>{{goods.skuName}}</td>
  					<td>{{goods.price/100}}</td>
  					<td>{{goods.sellNum}}</td>
  					<td>{{((goods.price * goods.sellNum)/100).toFixed(2)}}</td>
  				</tr>
  			</tbody>
        <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>商品金额/元</td>
          <td>
            {{(goodsTotalMoney/100).toFixed(2)}}
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>运费/元</td>
          <td>{{(totalFreight/100).toFixed(2)}}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>优惠金额/元</td>
          <td>{{freeMoney.toFixed(2)}}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>订单总额/元</td>
          <td>{{(goodsMoney/100).toFixed(2)}}</td>
        </tr>
        </tbody>
  		</table>
  		<div class="mt30">
  			<el-row>
  			<el-col :span="8">
  				<div class="grid-content">
  					<div class="tit">
  						<span class="tit_span">商家：</span>
  						<span>{{dealerName}}</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span">商家客服：</span>
  						<span>{{custmerTel}}</span>
  					</div>
  				</div>
  			</el-col>
  			<el-col :span="8">
  				<div class="grid-content">
  					<div class="tit">
  						<span class="tit_span">美图溪客服</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span">400-101-3888（工作日9：00~18：00）</span>
  					</div>
  				</div>
  			</el-col>
  			</el-row>
  		</div>
  	</div>
  </div>
</template>
<script>

  export default{
    name:'',
    data(){
      return{
        goodsTotalMoney:0,
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
        orderId:'',
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
        ,expressPerson: '',
        freeMoney:'',
        dealerName:JSON.parse(sessionStorage.getItem('mUser')).dealerName,
        totalFreight:0,
        custmerTel:''
      }
    },
    methods: {
      print_order () {
        window.print()
      },
      getDealerOrderInfo() {
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
      },
      getCustmerTel(){
        let that = this;
        that.$.ajax({
          url: that.base + 'm2c.scm/shop/sys/dealerShopDetail',
          //url: 'http://localhost:8080/m2c.scm/order/dealer/orderdetail',
          type: 'get',
          cache: false,
          pagination: true,
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
          },
          success: function (result) {
            if (result.status === 200) {
              that.custmerTel = result.content
            }
          }
        })
      },
    setReturnData: function (data) {
      let that = this;
      that.totalFreight = data.totalFreight
     // that.dealerName = data.dealerName
      that.orderId = data.orderId;
      that.goodsMoney = data.orderPrice;
      that.orderFreight = data.orderFreight;
      that.orderStatus = data.orderStatus;
      that.strOrderStatus = data.orderStatus === 0? '待付款': data.orderStatus === 1? '待发货': data.orderStatus === 2? '待收货': data.orderStatus === 3? '已完成': data.orderStatus === 4? '交易完成': data.orderStatus === 5? '交易关闭': '--';
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
      that.freeMoney = (data.plateformDiscount + data.dealerDiscount)/100;
      that.revPerson = data.revPerson;
      that.streetAddr = data.streetAddr;
      that.recvAddr = data.province + data.city + data.areaCounty + data.streetAddr;



      if (data.invoiceType != -1) {
        if (data.invoiceType==1)
          that.invoiceInfo = "发票台头：" + data.invoiceHeader + " 发票名称：" +  data.invoiceName + " 纳税人标识：" + data.invoiceCode;
        else if (data.invoiceType==0)
          that.invoiceInfo = "发票台头：" + data.invoiceHeader + " 发票名称：" +  data.invoiceName;
      }
      that.noted = data.noted;

      that.setGoodsTable(data.goodsInfoBeans, data);
    },
    setGoodsTable: function (goodses, totalData) {
      let that = this;
      that.goodses = goodses;
      for(var i = 0; i < that.goodses.length;i++){
        that.goodsTotalMoney += goodses[i].sellNum * goodses[i].price;
      }
      that.totalData = totalData;
      that.expressNum = 0;
      that.goodses.forEach(function(val, index) {
        val.freight = val.freight/100;
        if(typeof(val.mediaResId)=='undefined' || val.mediaResId==null ||  val.mediaResId=='')
          val.mediaResId = '-';
        that.expressNum +=val.sellNum;
      });

    }
    },
    mounted(){
      let that = this;
      that.dealerOrderId = that.$route.query.dealerOrderId;
      console.log("----------------------------DealerOrderId:"+that.$route.query.dealerOrderId)
      that.getDealerOrderInfo()
      that.getCustmerTel()
    }
  }
</script>
<style lang="scss" scoped>
.printSendOrder{
	width: 95%;
	margin: auto;
	margin-left: 30px;
	margin-top: 150px;
	background: #fff;
	padding-bottom: 80px;
	.bt{
		width: 100%;
		height: 150px;
		border-bottom: 1px solid #E5E5E5;
		text-align: center;
		line-height: 150px;
		font-size: 24px;
    position: relative;
	}
	.printSend_top{
		width: 100%;
		min-height: 150px;
		border-bottom: 1px solid #E5E5E5;
		padding: 30px 50px;
		.tit{
			line-height: 35px;
			.tit_span{
				display: inline-block;
				height: 35px;
				/*width: 100px;*/
			}
		}
	}
	.printSend_cen{
		width: 100%;
		min-height: 150px;
		padding: 30px 50px;
		.printSend_tab{
			width:100%;
			thead{
				background: #DFE9F6;
			}
			tr{
				td{
					height: 40px;
					line-height: 40px;
					border: 1px solid #ccc;
					text-align: center;
				}
			}
		}
		.tit{
			line-height: 35px;
			.tit_span{
				display: inline-block;
				height: 35px;
				/*width: 100px;*/
			}
		}
	}
}

 /*公用样式*/
.clear{
  clear: both;
  overflow: hidden;
}
.pad0{
	padding:0px;
}
  .mt5{
    margin-top: 5px;
  }
  .mt10{
    margin-top: 10px;
  }
  .mt30{
  	margin-top: 30px;
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
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .blue{
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
.dy{
  padding-left: 0px;
  line-height: 38px;
  font-size: 18px;
  cursor: pointer;
}
.ico_print{
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-right: 5px;
  background: url(../../../assets/images/ico_print.png);
}
.print_order_style {
  position: absolute;
  top:0px;
  right: 0px;
}
</style>
