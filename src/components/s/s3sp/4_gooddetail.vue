<template>
  <div class="goods_detail" >
    <div class="col-sm-12 detail_container">
      <div class="nav">
      <span class="nav_tit" :class="{active:showactive01}" @click="Togactive01"><a>商品详情</a></span>
      <!-- <span class="nav_tit" :class="{active:showactive02}" @click="Togactive02"><a>媒体资源</a></span> -->
      </div>
      <!--商品详情-->
      <div v-show="showactive01" class="g_detail">
      	<div>
      		<div class="tit0 mt20 mb10 clear"><b>基本信息</b></div>
      		<table class="tab_detail">
      				<tr>
      					<td class="a1">
      						商品名称
      					</td>
      					<td class="a2">
      						<div class="wobse">{{data.goodsName}}</div>
      					</td>
      					<td class="a3">
      						商品副标题
      					</td>
      					<td class="a4">{{data.goodsSubTitle}}</td>
      				</tr>
      				<tr>
      					<td class="a1">
      						商品分类
      					</td>
      					<td class="a2">
      						<div class="wobse">{{data.goodsClassify}}</div>
      					</td>
      					<td class="a3">
      						商品品牌
      					</td>
      					<td class="a4">{{data.goodsBrandName}}</td>
      				</tr>
      				<tr>
      					<td class="a1">
      						计量单位
      					</td>
      					<td class="a2">
      						<div class="wobse">{{data.goodsUnitName}}</div>
      					</td>
      					<td class="a3">
      						最小起订量
      					</td>
      					<td class="a4">{{data.goodsMinQuantity}}</td>
      				</tr>
      				<tr>
      					<td class="a1">
      						运费模板
      					</td>
      					<td class="a2">
      						<div class="wobse">{{data.modelName}}</div>
      					</td>
      					<td class="a3">
      						商品条形码
      					</td>
      					<td class="a4">{{data.goodsBarCode}}</td>
      				</tr>
      				<tr>
      					<td class="a1">
      						关键词
      					</td>
      					<td class="a2" colspan="3">
      						<div class="wobse">{{goodsKeyWord}}</div>
      					</td>
      				</tr>
      				<tr>
      					<td class="a1">
      						商品保障
      					</td>
      					<td class="a2" colspan="3">
      						<div class="wobse">{{goodsGuarantee}}</div>
      					</td>
      				</tr>
      		</table>
      		<div class="tit0 mt20 mb20 clear"><b>商品规格</b></div>
					<template v-if="data.skuFlag==0">
						<table class="tab_detail02">
							<thead>
								<tr>
									<td>规格</td>
									<td>库存</td>
									<td>重量/kg（个）</td>
									<td>拍获价/元</td>
									<td>市场价/元</td>
									<td>{{countMode==1?'供货价':'服务费率/%'}}</td>
									<td>商品编码</td>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(good,index) in goodsSKUs">
									<td>无</td>
									<td>{{good.availableNum}}</td>
									<td>{{good.weight}}</td>
									<td>{{good.photographPrice}}</td>
									<td>{{good.marketPrice}}</td>
									<td v-if="countMode==1">{{good.supplyPrice}}</td>
            			<td v-if="countMode==2">{{serviceRate}}</td>
									<td>{{good.goodsCode}}</td>
								</tr>
							</tbody>
						</table>
					</template>
      		<template v-if="data.skuFlag==1">
						<table class="tab_detail02">
							<thead>
								<tr>
									<td>规格</td>
									<td>规格值</td>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item,index) in goodsSpecifications">
									<td>{{item.itemName}}</td>
									<td>
										<template v-for="tag in item.itemValue">{{tag.spec_name+"  &nbsp; "}}</template>
									</td>
								</tr>
							</tbody>
						</table>
						<table class="tab_detail02">
							<thead>
								<tr>
									<td>规格值</td>
									<td>对外展示</td>
									<td>*库存</td>
									<td>*重量/kg（个）</td>
									<td>*拍获价/元</td>
									<td>市场价/元</td>
									<td>{{countMode==1?'供货价':'服务费率/%'}}</td>
									<td>商品编码</td>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(good,index) in goodsSKUs">
            			<td>{{good.skuName}}</td>
									<td>
										<el-switch disabled
											v-model="good.showStatus==2"
											active-color="#13ce66"
											inactive-color="#ccc">
										</el-switch>
									</td>
									<td>{{good.availableNum}}</td>
									<td>{{good.weight}}</td>
									<td>{{good.photographPrice}}</td>
									<td>{{good.marketPrice}}</td>
									<td v-if="countMode==1">{{good.supplyPrice}}</td>
            			<td v-if="countMode==2">{{serviceRate}}</td>
									<td>{{good.goodsCode}}</td>
								</tr>
							</tbody>
						</table>
					</template>
      		<div class="tit0 mt20 mb20 clear"><b>商品详情</b></div>
      		<div class="div_detail">
      			<div class="clear">
      				<span class="tit01 fl">商品主图</span>
      				<span class="t_img fl">
								<template v-for="file in fileList">
									<img :src='file'/>
								</template>
							</span>
      			</div>
      			<div class="clear mt20">
      				<span class="tit01 fl">图文详情</span>
							<span class="t_img fl">
      				<div v-html="info">
								{{info}}
							</div>
							</span>
      			</div>
      		</div>
      	</div>
      </div>
      <!--媒体资源-->
      <!-- <div v-show="showactive02" class="media_resources">
      	<table class="tab_detail03">
      		<thead>
      			<tr>
      				<td>已绑定媒体/5</td>
      				<td>合作方式</td>
      				<td>已绑定广告位/25</td>
      				<td>详情</td>
      			</tr>
      		</thead>
      		<tbody>
      			<tr>
      				<td>万豪酒店集团</td>
      				<td>平台型</td>
      				<td>3</td>
      				<td>
      					<i class="icon_back" v-show="showback" @click="Showtab02"></i>
      					<i class="icon_open" v-show="showopen" @click="Showtab"></i>
      				</td>
      			</tr>
      			<tr v-show="showback">
      				<td colspan="4" style="padding: 0px;">
      					<table class="tab_detail04">
      						<thead>
      							<tr>
      								<td>广告位名</td>
      								<td>广告位ID</td>
      								<td>广告位分类</td>
      								<td>媒介属性</td>
      								<td>展现形式</td>
      								<td>有效时间</td>
      								<td>地理位置</td>
      							</tr>
      						</thead>
      						<tbody>
      							<tr>
      								<td>电梯A座1号广告位</td>
      								<td>1</td>
      								<td>2</td>
      								<td>3</td>
      								<td>4</td>
      								<td>5</td>
      								<td>广东省深圳市南山区</td>
      							</tr>
      						</tbody>
      					</table>
      				</td>
      			</tr>
      		</tbody>
      	</table>
      </div> -->
    </div>
  <!--返回-->
  <div class="return poi3">
  	<button class="r_fh" @click="goBack()">返回</button>
  </div>
  </div>
</template>

<script>
  export default {
		name: '',
    data () {
      return {
				showactive01: true,
				showactive02: false,
				showback: false,
				showopen: true,
				goodsId: this.$route.query.goodsId,
				data:'',
				goodsSpecifications:[],
				goodsSKUs:[],
				fileList:[],
				goodsKeyWord:'',
				goodsGuarantee:'',
				countMode:'',
				info:''
      }
    },
    methods: {
			goBack(){
        this.$router.go(-1)
      },
			Togactive01 () {
				var that = this
				that.showactive01 = true 
				that.showactive02 = false
			},
			Togactive02 () {
				var that = this
				that.showactive02 = true 
				that.showactive01 = false
			},
			Showtab () {
				var that = this
				that.showback = true
				that.showopen = false
			},
			Showtab02 () {
				var that = this
				that.showopen = true
				that.showback = false
			}
    },
    mounted () {
			let that = this
			// 获取商家结算模式
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/dealer/sys/' + JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        data:{
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          that.countMode = result.content.countMode
        }
      })
			that.$.ajax({
				type: 'get',
				url: (that.$route.query.approveStatus==''||that.$route.query.approveStatus==undefined)?that.localbase + 'm2c.scm/goods/' + that.$route.query.goodsId:that.localbase + 'm2c.scm/goods/approve/' + that.$route.query.goodsId,
				//url:that.localbase + 'm2c.scm/goods/' + that.$route.query.goodsId,
				data:{
					token: sessionStorage.getItem('mToken')
				},
				success: function (result) {
					that.data = result.content
					that.data.skuFlag = result.content.skuFlag.toString()
					that.goodsSpecifications = result.content.goodsSpecifications
					that.goodsSKUs = result.content.goodsSKUs
					that.fileList = result.content.goodsMainImages
					that.info=result.content.goodsDesc
					that.goodsKeyWord = result.content.goodsKeyWord.join("/")
					that.goodsGuarantee = result.content.goodsGuarantee.join("/")
					console.log(that.goodsGuarantee)
				}
			})
    }
  }
</script>
<style lang="scss" scoped>
.goods_detail{
  /*background: #fff;*/
  padding: 20px 30px;
  .return{
  	width: 100%;
  	height: 65px;
  	background: #FFFFFF;
		box-shadow: 0 -1px 3px 0 rgba(0,0,0,0.30);
		line-height: 60px;
		padding-left: 30px;
		bottom: 0px;
		left: 0px;
		padding-left:228px;
		.r_fh{
			border: 1px solid #CCCCCC;
			border-radius: 2px;
			font-size: 14px;
			color: #333333;	
			width: 80px;
			height: 30px;
			line-height: 30px;
			background: #fff;
		}
  }
  .detail_container{
  	min-height: 800px;
  	background: #fff;
  	padding:0px;
  	margin-bottom: 50px;
  	padding-bottom: 30px;
  	.nav{
  		box-shadow: 0 1px 0 0 #EDF0F7;
  		width: 100%;
  		height: 40px;
  		line-height: 40px;
  		.nav_tit{
  			width:130px;
  			height:40px;
  		 	display: inline-block;
  		 	text-align:center;
  			a{
  			color: #666666;
  			text-decoration: none;
  			cursor: pointer;
  		}
  		}
  		.active{
  			border-bottom: 2px solid #0086FF;
  			a{
  				color:#0086FF;
  			}
  		}
  	}
  	.g_detail{
  		.tit0{
  			font-size: 16px;
				color: #333333;
				padding-left: 20px;
				line-height: 30px;
  		}
  		.tab_detail{
  			border: 1px solid #E5E5E5;
  			margin: auto;
  			width: 95%;
  			tr{
  				min-height: 40px;
  				border-bottom: 1px solid #E5E5E5;
  				td{
  					height: 40px;
  					text-align: center;
  				}
  			}
  			.a1{
  				width: 13.8%;
  				background-color: rgb(244, 245, 255);
  				font-size: 14px;
					color: #666666;
  			}
  			.a2{
  				width: 36%;
  				text-align: left;
  				padding-left: 10px;
  			}
  			.a3{
  				width: 13.8%;
  				background-color: rgb(244, 245, 255);
  				font-size: 14px;
					color: #666666;
  			}
  			.a4{
  				width: 36%;
  				text-align: left;
					padding-left: 10px;
  			}
  		}
  		.tab_detail02{
  			margin: 20px auto;
  			width: 95%;
  			thead{
  				background: #DFE9F6;
  				td{
  					height: 40px;
  				}
  			}
  			tbody{
  				background: #f4f5ff;
  				td{
  					height: 60px;
  				}
  			}
  			td{
  				text-align: left;
  				padding-left: 30px;
  				
  			}
  		}
  		.div_detail{
  			margin: auto;
  			width: 95%;
  			padding-left: 30px;
  			.tit01{
  				font-size: 14px;
					color: #666666;
					display: inline-block;
					line-height: 40px;
					margin-right: 20px;
  			}
  			.t_img{
  				img{
  					width: 101px;
  					height: 101px;
  					margin-right: 20px;
  				}
  			}
  			.t_img02{
  				border: 1px solid #E6E8F2;
					border-radius: 2px;
					width: 70%;
					max-height: 367px;
					overflow-y: auto;
  				img{
  					width: 750px;
  					height: 367px;
  					margin-right: 20px;
  				}
  			}
  		}
  	}
  	.media_resources{
  		width: 95%;
  		margin: auto;
  		.tab_detail03{
  			width:100%;
  			margin-top:30px;
  			border:1px solid #E5E5E5;
  			thead{
  				background: #DFE9F6;
  				td{
  					height: 40px;
  					padding-left: 30px;
  					font-size: 14px;
						color: #333333;
  				}
  			}
  			tbody{
  				background: #fff;
  				tr{
  					border-bottom:1px solid #E5E5E5;
  					td{
  					height: 60px;
  					padding-left: 30px;
  					font-size: 16px;
						color: #333333;
						.icon_back{
							width: 16px;
							height: 16px;
							display: block;
							background: url(../../../assets/images/ico_back02.png);
							cursor: pointer;
						}
						.icon_open{
							width: 16px;
							height: 16px;
							display: block;
							background: url(../../../assets/images/ico_open02.png);
							cursor: pointer;
						}
  				}
  				}
  				
  			}
  		}
  		.tab_detail04{
  			width: 100%;
  			thead{
  				background: #F4F5FA;
  				tr{
  					td{
  						height: 40px;
  						font-size: 14px;
							color: #666666;
  					}
  				}
  			}
  			tbody{
  				background: #EDF0F7;
					box-shadow: 0 1px 0 0 #E5E5E5;
  				tr{
  					td{
  						height: 60px;
  						font-size: 14px;
  					}
  				}
  			}
  		}
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


</style>
