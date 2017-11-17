<template>
  <div class="printSendOrder">
  	<div class="bt">
  		一拍即获商城发货单
  	</div>
  	<div class="printSend_top">
  		<el-row>
  			<el-col :span="8">
  				<div class="grid-content">
  					<div class="tit">
  						<span class="tit_span">收货人：</span>
  						<span>谁谁谁</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span">订单号：</span>
  						<span>123456</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span">订单总额：</span>
  						<span>123456</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span">收货地址：</span>
  						<span>世外桃源</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span">留言：</span>
  						<span>666</span>
  					</div>
  				</div>
  			</el-col>
  			<el-col :span="8">
  				<div class="grid-content">
  				<div class="tit">
  						<span class="tit_span">收货人号码：</span>
  						<span>1355350246456</span>
  					</div>
  				</div>
  				<div class="tit">
  						<span class="tit_span">下单时间：</span>
  						<span>20121212</span>
  				</div>
  				<div class="tit">
  						<span class="tit_span">优惠金额：</span>
  						<span>500</span>
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
  			<tbody>
  				<tr>
  					<td></td>
  					<td></td>
  					<td></td>
  					<td></td>
  					<td></td>
  					<td></td>
  				</tr>
  			</tbody>
  		</table>
  		<div class="mt30">
  			<el-row>
  			<el-col :span="8">
  				<div class="grid-content">
  					<div class="tit">
  						<span class="tit_span">商家：</span>
  						<span>商家名称</span>
  					</div>
  					<div class="tit">
  						<span class="tit_span">商家客服：</span>
  						<span>客服号码</span>
  					</div>
  				</div>
  			</el-col>
  			<el-col :span="8">
  				<div class="grid-content">
  					<div class="tit">
  						<span class="tit_span">美图溪客服</span> 						
  					</div>
  					<div class="tit">
  						<span class="tit_span">400-400-400（工作日9：00~18：00）</span>
  					</div>
  				</div>
  			</el-col>
  			</el-row>
  		</div>
  	</div>
  </div>
</template>
<script>
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

</style>
