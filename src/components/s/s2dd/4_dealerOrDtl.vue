<template>
  <div class="detail">
    <div class="nav clear">
      <span :class="{active:showactive}" @click="customerdetail"><a>订货单详情</a></span>
      <span :class="{active:showactive02}" @click="customerfreight"><a>发货详情</a></span>
      <span :class="{active:showactive03}" @click="customerecord"><a>操作记录</a></span>
      <!--<button type="button" class="btn btn-info pull-right operation">修改地址</button>-->
      <!--<button type="button">修改运费</button>-->
      <span class="fr" v-show="showactive">
      <a>
      	<i class="ico_print"></i>
      	<span class="dy">打印</span>
      </a> 
      <button type="button" class="fah">发货</button>
      </span>
      
    </div>
    <!-- 订货单详情 -->
    <div v-show="showactive" class="customerdetail_container">
      <!-- 拒绝结果，做法根据后台返回数据判断v-show -->
      <!-- <div class="detail_tit02">顾客发起售后申请，请处理</div> -->
      <!--待收货状态会出现收货单，请注意-->
      <div class="detail_tit">售后单：<span>3454345，23453245</span></div>
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
            <span class="ml20">{{payWay === 1 ? '': payWay === 2 ? '': '-'}}</span>
           	</div>
           	<div class="col-sm-4 pad0">
            <span class="tit01">支付时间</span>
            <span class="ml20">{{payTime}}</span>
            </div>
            <div class="col-sm-4 pad0">
            <span class="tit01">支付单号</span>
            <span class="ml20">{{payNo}}</span>
            </div>
          </div>

        </div>
        <div class="col-sm-11 detail_cen">
        <div>
          <span class="tit01">收货信息</span>
          <span class="ml20">
          	<span>{{recvAddr}}</span>
          	<i class="ico_compile"></i>
          </span>
        </div>
        	<!--点击ico_compile后出现编辑地址-->
        <div class="clear">
        		<span class="tit01 fl"></span>
          	<span class="ml20 fl">
          	<span class="fl mr20">
          		<select class="bj_select form-control">
          			<option></option>
          		</select>
          	</span>
          	<span  class="fl mr20">
          		<select class="bj_select form-control">
          			<option></option>
          		</select>
          	</span>
          	<span  class="fl mr20">
          		<select class="bj_select form-control">
          			<option></option>
          		</select>
          	</span>
          	<span class="fl mr20">
          		<input class="bj02_select form-control" />
          	</span>
          	</span>
        </div>
        <div>
          <span class="tit01">发票信息</span>
          <span class="ml20">{{invoiceInfo}}</span>
        </div>

        <div>
          <span class="tit01">买家留言</span>
          <span class="ml20 ">{{noted}}</span>
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
        <tbody id="goodsTabBody">
        	<tr>
        		<td class="a1 clear">
        			<div class="a1_img mr10 fl"><img /></div>
            	<div>
              <div class="wose wid mt10">冬季新款侧开叉高领毛衣女不规则套头针织衫宽松.</div>
              <div class="blue">规格：蓝色，L</div>
            	</div>
        		</td>
            <td class="a2">广告位信息</td>
            <td class="a3">数量</td>
            <td class="a4">单位</td>
            <td class="a5">单价/元</td>
            <td class="a5">商品金额/元</td>
            <td class="a6">
            	<!--<span>运费</span>           	
            	<i class="ico_compile"></i>-->
            	<!--点击ico_compile后会出现input-->
            	<input class="form-control a6_input" />
            </td>
        	</tr>
        </tbody>
        <tbody class="js_num">
        	<tr>
        		<td colspan="5"></td>
        		<td>
        			<div>商品总额</div>
							<div>运费</div>
							<div>平台优惠券</div>
							<div>商家优惠券</div>
							<div>订单总额</div>
        		</td>
        		<td class="pr40">
        			<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div class="redcolor" style="font-size: 18px;">1</div>
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
      		<td colspan="2">待发货 2    已发货 0</td>
      		<td>
      			<button class="fah fr mr10">发货</button>
      		</td>
      	</tr>
        <tr>
          <td class="a1">商品信息</td>
          <td class="a2">订货数</td>
          <td class="a3">待发货数</td>
        </tr>
        </thead>
        <tbody id="sendTabBody">
        	<tr>
        		<td class="a1 clear">
        			<div class="a1_img mr10 fl"><img /></div>
            	<div>
              <div class="wose wid mt20">冬季新款侧开叉高领毛衣女不规则套头针织衫宽松.</div>
              <div class="blue">规格：蓝色，L</div>
            	</div>
        		</td>
        		<td>1</td>
        		<td>2</td>
        	</tr>
        </tbody>
      </table>

    </div>
    <!-- 操作记录 -->
    <div v-show="showactive03">
        <table id="logTable" style="table-layout:fixed"></table>
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
        strOrderStatus: '',
        dealerOrderId: '',
        createdDate: '',
        payWay: '',
        payNo: '',
        payTime: '',
        recvAddr: '',
        invoiceInfo: '',
        noted: ''
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
      },
      //列表
      getDealerOrderInfo () {
        let that = this;
        that.$.ajax({
          url: that.base + 'm2c.scm/order/dealer/orderdetail',
          //url: 'http://localhost:8080/m2c.scm/order/dealer/orderdetail',
          type: 'get',
          cache: false,
          pagination: true,
          data: {
            token: sessionStorage.getItem('mToken'),
            orderNo: that.$route.query.orderId,
            dealerOrderId: that.$route.query.dealerOrderId
          },
          success: function (result) {
            console.log(result)
            if (result.status === 200) {
              that.setReturnData(result.content);
            }
          }
        })

        that.get_log_info();
      },

      setReturnData: function (data) {
        let that = this;
          that.goodsMoney = data.orderPrice;
          that.orderFreight = data.orderFreight;
          that.strOrderStatus = data.orderStatus === 0? '未支付': data.orderStatus === 1? '待发货': data.orderStatus === 2? '待收货': data.orderStatus === 3? '确认收货': data.orderStatus === 4? '交易完成': '关闭';
          that.dealerOrderId = that.$route.query.dealerOrderId;
          var d = new Date(data.createdDate);
          that.createdDate = that.date_format(d, 'yyyy-MM-dd hh:mm:ss');
          that.payWay = data.payWay;
          that.payNo = data.payNo;
          if (data.payDate != null) {
            d = new Date(data.payDate)
            that.payTime  = that.date_format(d, 'yyyy-MM-dd hh:mm:ss');
          }

          that.recvAddr = data.province + data.city + data.areaCounty + data.streetAddr + " " + data.revPerson + " " + data.revPhone;
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
        var tbodyHtml = '';
        var sendHtml = '';
//      for (var i in goodses) {
//        tbodyHtml +='<tr style="background: #F4F5FA;box-shadow: 0 1px 0 0 #E5E5E5;"><td class="a1"><div class="a1tab fl" style="float: left;padding-left: 20px;padding-top: 20px;padding-bottom:20px;margin-right: 10px;"><img style="width:50px;height:50px;" src="' + JSON.parse(goodses[i].goodsImage)[0] + '" width="80"/></div>'; //' + JSON.parse(goodses[i].goodsImage)[0] + '
//        tbodyHtml +='<div style="margin-top: 20px;margin-bottom: 20px;font-size: 14px;"><div style="height: 40px;">'+ goodses[i].goodsName+ '</div>';
//        tbodyHtml +='<div style="font-size: 12px;color: #999999;">' + goodses[i].skuName + '</div></div></td>';
//
//        sendHtml +='<tr><td class="a1"><div class="a1tab fl"><img src="' + JSON.parse(goodses[i].goodsImage)[0] + '" width="80"/></div>';
//        sendHtml +='<div><div>'+ goodses[i].goodsName+ '</div>';
//        sendHtml +='<div>' + goodses[i].skuName + '</div></div></td>';
//        sendHtml +='<td class="a3">' +goodses[i].sellNum + '</td>';
//        sendHtml +='<td class="a3">' +goodses[i].sellNum + '</td></tr>';
//
//        tbodyHtml +='<td class="a2" style="padding-left: 20px;">' + goodses[i].mediaResId + '</td>';
//        tbodyHtml +='<td class="a3" style="padding-left: 20px;">' +goodses[i].sellNum + '</td>';
//        tbodyHtml +='<td class="a4" style="padding-left: 20px;">' +goodses[i].unitName + '</td>';
//        tbodyHtml +='<td class="a5" style="padding-left: 20px;">' +goodses[i].price/100 + '</td>';
//        tbodyHtml +='<td class="a5" style="padding-left: 20px;">' +goodses[i].totalPrice/100 +'</td>';
//        tbodyHtml +='<td class="a6" style="padding-left: 20px;">' +goodses[i].freight/100 +'<i style="width: 16px;height: 16px;background: url(../../../assets/images/ico_compile.png);display: inline-block;margin-left: 10px;">'+ '</td>';
//        tbodyHtml +='</tr>';
//      }

//      tbodyHtml +='<tr><td colspan="6" class="a1">商品总额</td><td>'+ totalData.totalOrderPrice/100 +'</td></tr>';
//      tbodyHtml +='<tr><td colspan="6" class="a1">运费</td><td>'+ totalData.totalFreight/100 +'</td></tr>';
//      tbodyHtml +='<tr><td colspan="6" class="a1">平台优惠</td><td>'+ totalData.plateformDiscount/100 +'</td></tr>';
//      tbodyHtml +='<tr><td colspan="6" class="a1">商家优惠</td><td>'+ totalData.dealerDiscount/100 +'</td></tr>';
//      tbodyHtml +='<tr><td colspan="6" class="a1">订单总额</td><td>'+ totalData.orderPrice/100 +'</td></tr>';
//      that.$("#goodsTabBody").html(tbodyHtml);
//
//      that.$("#sendTabBody").html(sendHtml);
      },
      get_log_info () {
        let that = this
        that.is_Success = false
        that.$('#logTable').bootstrapTable('destroy').bootstrapTable({
          method: 'get',
          url: that.base + 'm2c.scm/order/logs/' + that.$route.query.dealerOrderId,
          //url: 'http://localhost:8080/m2c.scm/order/logs/' + that.$route.query.dealerOrderId,
          queryParams: function (params) {
            return Object.assign({}, {
              token: sessionStorage.getItem('mToken'),
              isEncry: false,
              orderId: that.$route.query.orderId,
              rows: params.limit,                     // 每页多少条数据
              pageNumber: params.offset / params.limit + 1    // 请求第几页
            })
          },
          pagination: true,
          pageNumber: 1,
          pageSize: 10,
          pageList: [5, 10, 20, 100],
          striped: true,
          showExport: true,
          exportDataType: 'selected',
          queryParamsType: 'limit',
          sidePagination: 'server',
          contentType: 'application/x-www-form-urlencoded',
          responseHandler: function (result) {
            console.log(result)
            return {
              total: result.totalCount,    // 总页数
              rows: result.content         // 数据
            }
          },
          columns: [{
            title: '操作时间',
            events: 'handle',
            width: '150',
            formatter: function (x, y) {
              let d = new Date(y.optTime)
              return that.date_format(d, 'yyyy-MM-dd hh:mm:ss')
            },
            align: 'center',
            valign: 'middle'
          }, {
            field: 'optContent',
            title: '操作内容',
            align: 'center',
            valign: 'middle',
            width: '250'
          }, {
            field: 'optUser',
            title: '操作人',
            align: 'center',
            valign: 'middle',
            width: '120'
          }]
        })
      }
    },
    mounted () {
      this.getDealerOrderInfo();
      //this.getDealerGoods();
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
.pad0{
	padding:0px;
}
.detail{
    width:95%;
    min-height: 84px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
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
        td{
          padding-left: 20px;
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
          	height: 40px;
          	line-height: 40px;
          option{
          	height: 40px;
          	line-height: 40px;
          }
          }
          .bj02_select{
          	width: 380px;
          	height: 40px;
          	line-height: 40px;
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
