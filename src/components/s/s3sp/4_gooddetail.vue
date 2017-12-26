<template>
  <div class="goods_detail" >
    <div class="col-sm-12 detail_container">
<!--      <div class="nav">
      <span class="nav_tit" :class="{active:showactive01}" @click="Togactive01"><a>商品详情</a></span>
      &lt;!&ndash; <span class="nav_tit" :class="{active:showactive02}" @click="Togactive02"><a>媒体资源</a></span> &ndash;&gt;
      </div>-->
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
      						<div class="wobse">{{data.goodsPostageName}}</div>
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
      						<div class="wobse"><p v-for="(item,index) in goodsGuarantee">{{index+1}}.{{item.guaranteeName}}<span v-if="item.guaranteeDesc !=undefined && item.guaranteeDesc !=''">-{{item.guaranteeDesc}}</span></p></div>
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
									<td>重量/kg{{data.goodsUnitName==''?'':'（'+data.goodsUnitName+'）'}}<div class="icon">
                    <div class="tips" style="width:400px;z-index:2;">
                      <p>表示每个计量单位对应的重量，比如0.05kg(个)表示每个重量为0.05kg</p>
                    </div>
                  </div></td>
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
            			<td v-if="countMode==2">{{data.serviceRate}}</td>
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
									<td>库存</td>
									<td>重量/kg{{data.goodsUnitName==''?'':'（'+data.goodsUnitName+'）'}}<div class="icon">
                    <div class="tips" style="width:400px;z-index:2;">
                      <p>表示每个计量单位对应的重量，比如0.05kg(个)表示每个重量为0.05kg</p>
                    </div>
                  </div></td>
									<td>拍获价/元</td>
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
											v-model="good.show"
											active-color="#13ce66"
											inactive-color="#ccc">
										</el-switch>
									</td>
									<td>{{good.availableNum}}</td>
									<td>{{good.weight}}</td>
									<td>{{good.photographPrice}}</td>
									<td>{{good.marketPrice}}</td>
									<td v-if="countMode==1">{{good.supplyPrice}}</td>
            			<td v-if="countMode==2">{{data.serviceRate}}</td>
									<td>{{good.goodsCode}}</td>
								</tr>
							</tbody>
						</table>
					</template>
      		<div class="tit0 mt20 mb20 clear"><b>商品详情</b></div>
      		<div class="div_detail">
						<div class="clear mt20" v-if="data.approveStatus == ''|| data.approveStatus == undefined">
      				<span class="tit01 fl">商品识别图</span>
      				<span class="t_img fl recognizedImg">
								<!-- <template v-for="file in goodsRecognized"> -->
								<template v-for="(file,index) in goodsRecognized" v-if="index<6">
									<div class="conimg" @click="imgWrapShow(index)">
										<img class="conimg mr10 fl" :src="file" />
										<div><i class="el-icon-zoom-in"></i></div>
									</div>
								</template>
								<a v-if="goodsRecognized.length>6" @click="imgWrapShow(0)" class="lookMore">查看更多</a>
							</span>
      			</div>
						<!-- 图片弹层 -->
            <div class="hptczp" v-show="imgWrap"></div>
            <div class="imgWrap" v-show="imgWrap">
							<div class="imgUl">
								<ul>
									<li>
										<img :src="goodsRecognized[imgIndex]" />
									</li>
								</ul>
							</div>
							<div class="ctrl">
								<a @click="prev" class="prev" v-if="imgIndex > 0"></a>
								<a @click="next" class="next" v-if="imgIndex < goodsRecognized.length-1"></a>
							</div>
							<div class="ctrlImg">
								<a @click="prevImg" class="prevImg"><</a>
								<div class="ctrlImgUl">
									<ul id="ctrlImgUl">
										<li v-for="(file,index) in goodsRecognized" class="mr10 fl" :class="{'active':index==imgIndex}" @click="checkImg(index)">
											<img :src="file" />
										</li>
									</ul>
								</div>
								<a @click="nextImg" class="nextImg">></a>
							</div>
							<a class="close" @click="imgWrap=!imgWrap"></a>
            </div>
						<div class="clear">
							<span class="t_img fl" v-if="goodsRecognized.length>0" style="font-size:12px;color:#999;display:block;margin:10px 0;margin-left:120px;">用于客户端拍摄广告图识别商品</span>
						</div>
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
				goodsGuarantee:[],
				countMode:'',
				info:'',
				goodsRecognized:[],
				imgWrap:false, //图片盒子显示隐藏
        imgIndex:0,
      }
    },
    methods: {
			// 图片放大
      imgWrapShow(index){
				let that = this
				that.imgWrap = true
				that.imgIndex = index
				let l = that.goodsRecognized.length * 74 + 'px'
				document.getElementById('ctrlImgUl').style.width=l
      },
      prev(){
        let that = this
        if(that.imgIndex > 0){
          that.imgIndex--
        }
				let i = Math.ceil((that.imgIndex+1)/8)-1
				document.getElementById('ctrlImgUl').style.marginLeft = -i*'592'+'px'
      },
      next(){
        let that = this
        if(that.imgIndex < that.goodsRecognized.length-1){
          that.imgIndex++
        }
				let i = Math.ceil((that.imgIndex+1)/8)-1
				document.getElementById('ctrlImgUl').style.marginLeft = -i*'592'+'px'
			},
			// 小图
			nextImg(){
				let that = this
				let l = Math.ceil(that.goodsRecognized.length/8)
				let i = Math.ceil((that.imgIndex+1)/8)-1
				if(i<l-1)
				i++
				console.log(i)
				document.getElementById('ctrlImgUl').style.marginLeft = -i*'592'+'px'
				that.imgIndex = i*8
				console.log(that.imgIndex)
			},
			prevImg(){
				let that = this
				let l = Math.ceil(that.goodsRecognized.length/8)
				let i = Math.ceil((that.imgIndex+1)/8)-1
				if(i>0)
				i--
				console.log(i)
				document.getElementById('ctrlImgUl').style.marginLeft = -i*'592'+'px'
				that.imgIndex = i*8
				console.log(that.imgIndex)
			},
			checkImg(index){
				let that = this
				that.imgIndex = index
			},
			goBack(){
        if(this.$route.query.from=='a'){
					this.$router.push({name:'goodList',query:{activeName:'first'}})
				}else if(this.$route.query.from=='b'){
					this.$router.push({name:'goodList',query:{activeName:'second'}})
				}else{
					this.$router.push({name:'goodList',query:{activeName:'delete'}})
				}
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
			that.$.ajax({
				type: 'get',
				url: (that.$route.query.approveStatus==''||that.$route.query.approveStatus==undefined)?that.localbase + 'm2c.scm/goods/' + that.$route.query.goodsId:that.localbase + 'm2c.scm/goods/approve/' + that.$route.query.goodsId,
				//url:that.localbase + 'm2c.scm/goods/' + that.$route.query.goodsId,
				data:{
					token: sessionStorage.getItem('mToken'),
					isDelete:that.$route.query.from=='c'?'2':''
				},
				success: function (result) {
					that.data = result.content
					that.data.skuFlag = result.content.skuFlag.toString()
					that.goodsSpecifications = result.content.goodsSpecifications
					that.goodsSKUs = result.content.goodsSKUs
					that.fileList = result.content.goodsMainImages
					that.goodsRecognized = result.content.goodsRecognized
					that.info=result.content.goodsDesc
					that.goodsKeyWord = result.content.goodsKeyWord.join("/")
					that.goodsGuarantee = result.content.goodsGuarantee
          that.countMode = result.content.settlementMode
				}
			})
    }
  }
</script>
<style lang="scss" scoped>
	.hptczp{
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
  .imgWrap{
    width:670px;
    height:685px;
    // background: #ffffff;
    // border-radius:10px;
    position: fixed;
    top:50%;left:50%;
    margin-top:-343px;
    margin-left:-335px;
    z-index: 999;
		.ctrlImg{width:100%;height:70px;margin-top:15px;position: absolute;top:615px;left:0; 
			a.prevImg,a.nextImg{display:inline-block;width:30px;height:70px;margin-right:5px;background:#fff;float:left;border-radius:5px;opacity:0.6;padding-left:10px;line-height: 70px;font-size:34px;font-family: "宋体";color:#999;text-decoration:none;transition: all .3s ease;}
			a.nextImg{padding-left:6px;}
			a.prevImg:hover,a.nextImg:hover{opacity:1; text-decoration:none; cursor:pointer;padding-left:10px;}
			a.prevImg:hover{padding-left:6px;}
			.ctrlImgUl{width:600px;height:70px;border-radius:5px;background:#fff;padding:5px 10px;margin-right:5px;float:left;overflow: hidden;
				ul{width:auto; list-style:none;transition: all .3s ease;
					li{width:60px;height:60px;margin-right:14px;
						img{width:100%;height:100%;}
					}
					li.active{border:4px solid #18DCF6;}
				}
			}
			a.nextImg{margin-right:0px;}
		}
    a.close{
      display:inline-block;width:30px;height:30px;opacity: 1;
      position: absolute;top:-60px;right:-200px; background:url(../../../assets/images/ico_close_close.png) no-repeat 0 0;
    }
    div.imgUl{
      width:600px;
      height:600px;
      position: absolute;
      top:0px;left:35px;
      vertical-align: middle;
      display: table;
      ul{
        width:600px;
        height:600px;white-space:nowrap; float: left;list-style-type:none;
        li{
          line-height:600px;text-align:center;
          width:600px;
          height:600px;
          img{max-width:600px;max-height:600px;}
        }
      }
    }
    div.ctrl{
      position: absolute;
      top:260px;
      left:-130px;
      width:920px;
      a{
        width:50px;height:50px;display:inline-block;position:absolute;
      }
      a.prev{top:0;left:0px;background:url(../../../assets/images/ico_leftarrows_pressed.png) no-repeat 0 0;opacity:0.4}
      a.next{top:0;right:0px;background:url(../../../assets/images/ico_rightarrows_pressed.png) no-repeat 0 0;opacity:0.4}
      a.prev:hover{transition: all 0.2s ease;opacity:1}
      a.next:hover{transition: all 0.2s ease;opacity:1}
    }
  }
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
					p{padding-top:6px;
						span{color:#999;}
					}
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
				a.lookMore{display:inline-block;width:100px;height:100px; border:1px solid #E6E8F2;text-align: center;line-height: 100px;color:#667991; cursor:pointer;}
				.conimg{
          width: 100px;
          height: 100px;
          position: relative;
          display: inline-block;float:left;margin-right:20px;
          div{
            position: absolute;
            width:100px;height:100px;
            top: 0;
            left: 0;
            background:rgba(255,255,255,0.5);
            display: none;
            i{width:16px;height:16px;position:absolute;top:44px;left:44px;}
          }
        }
        .conimg:hover div{
          display: block;
        }
  			.tit01{
  				font-size: 14px;
					color: #666666;
					display: inline-block;
					line-height: 40px;
					margin-right: 20px;
					width:100px;text-align:right;
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
