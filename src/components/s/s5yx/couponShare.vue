<template>
	<div class="Issuing_coupons_container">
		<el-col :span="24" class="">
			<div class="Issuing_coupons poi1">
				<!--切换栏-->
				<div class="nav_container">
					<div class="navli">
						<a :class="showactive=='hand'?'f_active':''">手动发放优惠券</a>
					</div>
				</div>
				<!--新增优惠券  优惠券选择-请做判断,此弹窗有多处可复用-->
				<el-dialog title="选择优惠券" :visible.sync="centerDialogVisible" width="920px" center  :modal-append-to-body="false"  :close-on-click-modal="false" >
					<div class="Select_coupons">
						<div class="Select_coupons_t">
							<div class="pt3 mr20">
								<el-input v-model="cashAndDiscount_parmas.coupon_name" class="" placeholder="请输入优惠券名称进行搜索"></el-input>
							</div>
							<div class="pt3 mr20">
								<el-input v-model="cashAndDiscount_parmas.coupon_no" class="mr20" placeholder="请输入优惠券编号进行搜索"></el-input>
							</div>
							<div class="pt3">
								<el-button @click="get_cashAndDiscount">查询</el-button>
								<el-button @click="reset">重置查询条件</el-button>
							</div>
						</div>
						<div class="Select_coupons_b clear" v-if="showactive != 'hand'" @scroll="lazyload">
							<div  v-for="(item,i) in coupon_list" :key='i' class="fl mr10 Select_box" :class="pre_sel_coupon.couponId == item.couponId?'f-active':''" @click="Selectcouponsactive(item)">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h" v-if="item.same == 1">{{item.faceValue}}{{item.couponForm == 1 ? '元':'折'}}</span>
										<span class="tit_s_s tit_s_h" v-if="item.same == 0 && (item.minValue.length + item.maxValue.length <= 6)">{{item.minValue}}~{{item.maxValue}}{{item.couponForm == 1 ? '元':'折'}}</span>
										<div v-if="item.same == 0 && (item.minValue.length + item.maxValue.length > 6)">
											<p class="tit_s_s tit_h">{{item.minValue}}{{item.couponForm == 1 ? '元':'折'}}</p>
											<p class="tit_s_s tit_h">~</p>
											<p class="tit_s_s tit_h">{{item.maxValue}}{{item.couponForm == 1 ? '元':'折'}}</p>
										</div>
									</div>
									<div class="tit_s_s ">
										{{item.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div>{{item.couponName}}</div>
									<div class="tit02">{{item.rangeContent}}</div>
									<div class="tit02">{{item.expirationTimeStart}} - {{item.expirationTimeEnd}}</div>
								</div>
							</div>
							<!--<div class="nomore">没有更多了...</div>-->
						</div>
						<div class="Select_coupons_b clear" v-if="showactive == 'hand'" @scroll="lazyload">
							<div v-for="(item,i) in cashAndDiscount_list" :key='i' class="fl mr10 Select_box" :class="pre_sel_coupon.couponId == item.couponId?'f-active':''" @click="Selectcouponsactive(item)">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h" >{{item.faceValue}}{{item.couponForm == 1 ? '元':'折'}}</span>
										<!--<span class="tit_s_s tit_s_h" v-if="item.same == 0 && (item.minValue.length + item.maxValue.length <= 6)">{{item.minValue}}~{{item.maxValue}}{{item.couponForm == 1 ? '元':'折'}}</span>
										<div v-if="item.same == 0 && (item.minValue.length + item.maxValue.length > 6)">
											<p class="tit_s_s tit_h">{{item.minValue}}{{item.couponForm == 1 ? '元':'折'}}</p>
											<p class="tit_s_s tit_h">~</p>
											<p class="tit_s_s tit_h">{{item.maxValue}}{{item.couponForm == 1 ? '元':'折'}}</p>
										</div>-->
									</div>
									<div class="tit_s_s ">
										{{item.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div>{{item.couponName}}</div>
									<div class="tit02">{{item.rangeContent}}</div>
									<div class="tit02">{{item.expirationTimeStart}} - {{item.expirationTimeEnd}}</div>
								</div>
							</div>
							<!--<div class="nomore">没有更多了...</div>-->
						</div>

					</div>
					<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="coupon_selected">确 定</el-button>
						<el-button @click="coupon_select_cancle">取 消</el-button>
						<!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
					</span>
				</el-dialog>
				<!--手动发放优惠券-->
				<div class="Issuingcen03" v-show="showactive=='hand'">
					<!--已发送记录-->
					<div class="Is03_t_b">
						<div class="Is03_user">
							<div class="Is03_user_top">
								已选择发放
								<span class="bluecolor02">{{sel_user.total}}</span>
								位用户
							</div>
							<div class="Is03_user_btn">
								<!--无数据-->
								<div class="Is03_user_boxnone" v-if="sel_user.total==0">
									当前暂无已选择发放的用户
								</div>
								<!--有数据-->
								<div class="Is03_user_box" v-if="sel_user.total>0" >
									{{sel_user.mobiles}} 
									<span v-show="sel_user.total>23" class="totaluser">......共{{sel_user.total}}位用户</span>
								</div>
							</div>
						</div>
						<div class="Is03_user02 " >
							<el-button @click="goto('couponShareRecord')">
								查看发放记录
							</el-button>
						</div>
					</div>
					<!--左边表格-->
					<div class="Is03_t_b02">
						<div class="Is03_t_b02_l">
							<div class="form_top">
								<el-form :inline="true"  class="demo-form-inline">
									<el-form-item   style='line-height:50px' label="选择发放人群">
										<el-input v-model="user_list_parmas.mobileOrUserId" placeholder="请输入手机号/账号/用户编号"></el-input>
									</el-form-item>
									<el-form-item style='line-height:50px'  label="注册">
										<div class="search_cell">
											<el-date-picker
												v-model="time"
												width="350"
												:editable="false"
												type="daterange"
												range-separator="-"
												start-placeholder="开始日期"
												end-placeholder="结束日期"
												style="margin-top:9px"
												>
											</el-date-picker>
										</div>
									</el-form-item>
									<el-form-item>
										<el-button type="primary"  size='medium'  @click="get_user_list">查询</el-button>
										<el-button type=""   size='medium' @click="reset_user_params">清空查询条件</el-button>
									</el-form-item>
								</el-form>
							</div>
							<div class="table">
								<!--<el-table  border style="width: 100%" @selection-change="handleSelectionChange"  ref="multipleTable" :data="tableData3" tooltip-effect="dark">-->
								<el-table :data="user_list" 
								slot="empty" 
								stripe  
								@select-all="sel_all" 
								@select="sel"
								:row-key = "get_key"
								style="width: 100%; margin-top: 20px">
									<el-table-column type="selection" 
								    :reserve-selection = "rem_seleted"  width="55">
									</el-table-column>
									<el-table-column prop="mobile" label="手机号/账号">
									</el-table-column>
									<el-table-column prop="userId" label="用户编号">
									</el-table-column>
									<el-table-column prop="createdDate" label="新增时间" width="250">
										<template slot-scope="scope">
											<span>{{date_format(new Date(scope.row.createdDate),'yy-MM-dd hh:mm:ss')}}</span>
										</template>
									</el-table-column>
								</el-table>
								<div class="fr mt10">
									<el-pagination 
									@size-change="handleSizeChange"
									@current-change="handleCurrentChange" 
									:current-page="pagination.pageNum" 
									:page-sizes="[5,10, 20, 50, 100]" 
									:page-size="pagination.rows" 
									layout="total, sizes, prev, pager, next, jumper" 
									:total="pagination.total">
									</el-pagination>
								</div>
							</div>
						</div>
						<!--右边选择优惠券-->
						<div class="Is03_t_b02_r">
							<div class="">发放优惠券选择</div>
							<!--无优惠券显示+,点击+会出现新增优惠券弹出窗-->
							<!--<div class="mt10 Selection_of_couponsbox"  @click="centerDialogVisible = true" style="display: none;">+</div>-->
							<div class="mt10 Selection_of_couponsbox" @click="reselect" v-show="hand_add_show"><span style="font-size: 30px;">+</span>选择</div>
							<!--已选择优惠券显示优惠券-->
							<div class="Select_box mt10 f-active" v-show="!hand_add_show ">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h">{{hand_edit_coupon.faceValue}}{{hand_edit_coupon.couponForm == 1 ? '元':'折'}}</span>
									</div>
									<div class="tit_s_s ">
										{{hand_edit_coupon.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div class="mt10">{{hand_edit_coupon.couponName}}</div>
									<div class="tit02">{{hand_edit_coupon.rangeContent}}</div>
									<div class="tit02">{{hand_edit_coupon.expirationTimeStart}} - {{hand_edit_coupon.expirationTimeEnd}}</div>
								</div>
							</div>
							<div class="mt10">
								<a class="greycolor02  mr10" @click="goto('coupon_list')">新增优惠券</a>
								<a class="bluecolor02" v-show="!hand_add_show" @click="reselect">重新选择优惠券</a>
							</div>
						</div>
					</div>
					<!--底部按钮-->
					<div class="b_button">
						<div class="marauto wid280">
							<el-button type="primary" @click="send">发放</el-button>
							<el-button @click="centerDialogVisible02 = true">导入批量发放</el-button>
						</div>
					</div>
				</div>
				<!--点击批量发放-->
				<el-dialog title="导入批量发放"  :visible.sync="centerDialogVisible02" width="890px" center  :modal-append-to-body="false"  :close-on-click-modal="false">
					<div class="addquan_c">
						<div class="addquan_c_t">已选择发放的优惠券</div>
						<div class="addquan_c_b">
							<!--已选择的优惠券-->
							<div class="Is03_user_boxnone" v-if="hand_add_show">
									当前暂无已选择发放的优惠券
							</div>
							<div class="Select_box mt10 f-active fl mr10" v-show="hand_edit_coupon.couponId && !hand_add_show ">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h">{{hand_edit_coupon.faceValue}}{{hand_edit_coupon.couponForm == 1 ? '元':'折'}}</span>
									</div>
									<div class="tit_s_s ">
										{{hand_edit_coupon.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div class="mt10">{{hand_edit_coupon.couponName}}</div>
									<div class="tit02">{{hand_edit_coupon.rangeContent}}</div>
									<div class="tit02">{{hand_edit_coupon.expirationTimeStart}} - {{hand_edit_coupon.expirationTimeEnd}}</div>
								</div>
							</div>
						</div>
					</div>

					<div class=" mt30">
						<span class="mr10">导入需要发放优惠券的用户</span>
						<!--判断-未导入时候上传批量发放表-->
						<span v-show="excel_file == ''">
							<el-button @click="sel_file"> 上传批量发放表</el-button>
						</span>
						<input type="file" id="upload" style="display:none" @change="file_upload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
						<span v-show="excel_file != ''">
							<el-button class="mr10 yellowcolor" @click="sel_file">重新上传</el-button>
							<span class="bluecolor02">已导入{{send_num}}位用户</span>
						</span>
					</div>
					<div class="mt10">
						<span class="tit11 mr10">批量发放表的格式必须同模板一致，仅一列，第一行命名为手机号</span>
						<el-button @click="download">下载模板</el-button>
					</div>
					<span slot="footer" class="dialog-footer mt30">
						<el-button type="primary" @click="excel_send">确定发放</el-button>
						<el-button @click="centerDialogVisible02 = false">取消发放</el-button>
						<span class="fr addquan_t poi2">发送后将不可以撤销，请认真核对发送信息</span>
					</span>
				</el-dialog>
				<!--确认发送结果-->
				<el-dialog  :visible.sync="result"  width="650px" center  :modal-append-to-body="false"  :close-on-click-modal="false">
					<div  class="send_suc">
						<el-progress type="circle" :percentage="100" :width="136"  status="success"></el-progress>
					</div>
					<div class="cen">总共发送{{send_result.sendTotal}}位用户 </div>
					<div class="cen"> <span>发送成功{{send_result.sendSuccess}}位</span> <span >{{send_result.sendfail}}位用户发送失败</span>  <el-button class="dre" v-if="send_result.sendfail != 0" type="primary" plain>导出失败用户</el-button></div>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="result = false">确定</el-button>
					</div>
				</el-dialog>
			</div>
		</el-col>
	</div>
</template>

<script>
export default {
	data() {
		return {
			result:false,
			// 发送结果
			send_result:'',
			// 
			excel_file:'',
			// 发送人数
			send_num:0,
			time:'',
			// 记住选择
			rem_seleted:true,
			// tab栏切换
			showactive: 'hand',
			// 选中的用户
			sel_user:{mobiles:'',total:0},
			sel_user_mobiles:[],
			//  查询用户列表参数
			user_list_parmas: { mobileOrUserId: '', startTime: '', endTime: ''},
			// 用户列表  分页
			pagination: { rows: 5, pageNum: 1, total: 0 },
			// 查询代金或折扣券列表参数
			cashAndDiscount_parmas: { coupon_no: '', coupon_name: '', page_no: 1, page_size: 15 },
			// 优惠券请求页数
			pre: 1,
			// 手动
			hand_coupon_list: [],
			// 用户列表
			user_list:[],
			// 代金或折扣券列表
			cashAndDiscount_list:[],
			//  点击的优惠券
			pre_sel_coupon:{},
			// 手动发放选择的优惠券
			hand_edit_coupon:{},
			// 手动发放的加号
			hand_add_show:true,
			maxReceive: '',
			maxmoney: '',
			// 选择优惠券弹窗
			newaddReceive: false,
			centerDialogVisible:false,
			centerDialogVisible02: false,
		}
	},
	watch: {
	 'time': {
        handler (val, oldVal) {
          let that = this
          if (!oldVal) return
          if (val == oldVal) return
          if (!val) {
            that.user_list_parmas.startTime = ''
            that.user_list_parmas.endTime = ''
          }
        },
        deep: true
      },
	  'centerDialogVisible02': {
        handler (val, oldVal) {
          if (!val) {
			  document.querySelector('#upload').value = ''
			  this.excel_file = ''
			  this.send_num = 0
          }
        },
        deep: true
      }
	},
	methods: {
		// 给表格唯一的KEY
		get_key(row){
			return row.userId
		},
		sel_file() {
			document.querySelector('#upload').click()
		},
		// 文件上传
		file_upload(event) {
			let that = this
			let target = event.target
			let obj = window.URL.createObjectURL(target.files[0])
			console.log('文件',obj)
			var formData = new FormData()
			formData.append("upfile",target.files[0])
			// 存一次上传的文件
			this.excel_file = target.files[0]
			this.$.ajax({
				url:  `${this.base}m2c.market/coupon/read/user/excel/count`,
				type: "POST",
				data: formData,
				/**
				*必须false才会自动加上正确的Content-Type
				*/
				contentType: false,
				/**
				* 必须false才会避开jQuery对 formdata 的默认处理
				* XMLHttpRequest会对 formdata 进行正确的处理
				*/
				processData: false,
				success: function (res) {
					if (res.status == '200') {
						// alert("上传成功！")
						that.$message({
							message: '上传成功！',
							type: 'success'
						})
						that.send_num = res.content.rows
					}
				},
				error: function () {
					console.log('上传内容格式错误，请下载模板参照！')
					that.$message.error('上传内容格式错误，请下载模板参照！')
				}
			});

		},
		// 下载
		download () {
			location.href=`${this.base}m2c.market/coupon/read/user/excel/count`
		},
		// 确定发送
		send(){
			let that = this
			console.log(that.hand_edit_coupon)
			if (that.hand_edit_coupon.couponId == undefined) {
				this.$message.error('请选择优惠券！')
				return
			}
			if (that.sel_user.mobiles == '') {
				this.$message.error('请选择发放用户')
				return 
			}
			let formDate = {
					coupon_id:that.hand_edit_coupon.couponId,
					mobiles:that.sel_user.mobiles,
				}
			that.$.ajax({
				method: 'post',
				url: that.localbase + 'm2c.market/coupon/platform/batch/send/user',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(formDate),
				success: function(res) {
					if (res.status == 200) {
						console.log('发放结果',res.content)
						that.send_result = res.content
					}
					that.result = true
				}
			})
		},
		// excel批量发放
		excel_send () {
			let that = this
			console.log(that.hand_edit_coupon)
			this.centerDialogVisible02 = false
			if (that.hand_edit_coupon.couponId == undefined) {
				this.$message.error('请选择优惠券！')
				return
			}
			if (that.excel_file == '') {
				this.$message.error('请选择批量发送用户文件')
				return 
			}
			let formData = new FormData()
			formData.append("upfile",that.excel_file)
			formData.append('coupon_id',that.hand_edit_coupon.couponId)
			that.$.ajax({
				method: 'post',
				url: that.localbase + 'm2c.market/coupon/platform/read/excel/batch/send',
				// contentType: 'application/json; charset=utf-8',
				// dataType: 'json',
				contentType: false,
				data: formData,
				processData: false,
				success: function(res) {
					if (res.status == 200) {
						console.log('发放结果',res.content)
						that.send_result = res.content
					}
					that.result = true
				}
			})
		},	
		// 重置搜索查询条件
		reset() {
			this.cashAndDiscount_parmas.coupon_no = ''
			this.cashAndDiscount_parmas.coupon_name = ''
		},
		// 分页功能
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`)
			this.pagination.rows = val
			this.get_user_list()
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`)
			this.pagination.pageNum = val
			this.get_user_list()
		},
		sel_all(val) {
			console.log('全选的',val)
			this.sel_user_mobiles = []
			val.map(item=>{
				this.sel_user_mobiles.push(item.mobile)
			})
			this.sel_user.total = this.sel_user_mobiles.length
			this.sel_user.mobiles = this.sel_user_mobiles.join(' , ')
		},
		//   点击表格选择
		sel(selection, row) {
			let len = this.sel_user_mobiles.length
			let len_c = selection.length
			if (len_c > len) {
				this.sel_user_mobiles.push(row.mobile)
			} else {
				this.sel_user_mobiles.some((item,i) =>{
					if (item== row.mobile) {
						this.sel_user_mobiles.splice(i,1)
					}
				})
			}
			this.sel_user.total = this.sel_user_mobiles.length
			this.sel_user.mobiles = this.sel_user_mobiles.join(' , ')
		},
		// 重新选择优惠券
		reselect () {
			this.handle_type = 'edit'
			this.centerDialogVisible = true
			this.pre_sel_coupon = this.hand_edit_coupon 
			console.log('this.centerDialogVisible', this.centerDialogVisible)
		},
		goto(path) {
			let that = this
			if (that.active_path === path) {
				that.$router.go(0)
				return
			}
			that.$goRoute({ path: path })
		},
		// 懒加载分享优惠券列表
		lazyload(e) {
			let box = document.getElementsByClassName('Select_coupons_b')[0]
			if (box.scrollTop > 90 * this.pre) {
				this.pre++ 
				this.cashAndDiscount_parmas.page_no = 4 + this.pre
				this.cashAndDiscount_parmas.page_size = 3
			}
		},
		// 获取代金或折扣券列表
		get_cashAndDiscount () {
			let that = this
			that.$.ajax({
				method: 'get',
				url: that.localbase + 'm2c.market/coupon/cashAndDiscount/page',
				data: that.cashAndDiscount_parmas,
				success: function(res) {
					if (res.status == 200) {
						that.cashAndDiscount_list = res.content
						console.log('that.cashAndDiscount_list',that.cashAndDiscount_list)
					}
				}
			})
		},
		// 点击优惠券
		Selectcouponsactive(item) {
			this.pre_sel_coupon = item
		},
		// 确认选择优惠券
		coupon_selected() {
			let that = this
			console.log('手动发放')
			this.hand_add_show = false
			this.hand_edit_coupon = this.pre_sel_coupon
			this.centerDialogVisible = false
			console.log('this.hand_edit_coupon',this.hand_edit_coupon)

		},
		// 取消选择优惠券
		coupon_select_cancle () {
			this.pre_sel_coupon = {}
			this.centerDialogVisible = false 
		},
		
		// 获取用户列表
		get_user_list () {
			let that = this
			if (that.time !== null && that.time !== '') {
				that.user_list_parmas.startTime = that.date_format(new Date(that.time[0]),"yyyy-MM-dd")
				that.user_list_parmas.endTime = that.date_format(new Date(that.time[1]),"yyyy-MM-dd")
			}
			that.$.ajax({
				method: 'get',
				url: that.localbase + 'm2c.users/user/getUserInfoByMobileAndCreateTime',
				data: Object.assign(that.user_list_parmas,that.pagination),
				success: function(res) {
					if (res.status == 200) {
						// if (res.content.length > 0) {
							that.user_list = res.content
						// }
						that.pagination.total = res.totalCount
						console.log('that.user_list',that.user_list)
					}
				}
			})
		},
		// reset_user_params
		reset_user_params() {
            this.user_list_parmas.mobileOrUserId= ''
			this.time = null
		},
		// 用于生成领取规则ID
		S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
		},
		guid() {
			return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4())
		}
	},
	mounted() {
		this.get_cashAndDiscount()
		this.get_user_list()
	}
}

</script>

<style lang="scss" scoped>
    //  发送成功的样式
	.send_suc{
		width:136px;
		margin-left:50%;
		transform: translateX(-50%);
		font-size:18px;
	}
	// 导出按钮样式
	.dre{
		position: absolute;
		top:-10px;
		right:50px;
	}
	.cen{
		position: relative;
		text-align: center;
	}
    .Issuing_coupons{
		min-width:1282px;
	}
	.Issuing_coupons_container {
		min-width: 910px;
		padding: 15px 26px;
		.Issuing_table {
			padding-right: 10px;
		}
		.tit11 {
			color: #CCCCCC;
		}
		.yellowcolor {
			background: #F5BD23;
			border-color: #F5BD23;
			color: #FFFFFF;
		}
		.greycolor {
			color: #CCCCCC;
			font-size: 12px;
		}
		.greycolor02 {
			color: #666666;
			font-size: 12px;
		}
		.addquan_t {
			line-height: 40px;
			display: inline-block;
			color: #cccccc;
			font-size: 12px;
			right: 90px;
		}
		.addquan_c {
			width: 100%;
			/*height: 150px;*/
			border: 1px solid #E6E8F2;
			.addquan_c_t {
				width: 100%;
				height: 30px;
				background: rgba(249, 250, 254, 1);
				border-radius: 3px 3px 0px 0px;
				line-height: 30px;
				border-bottom: 1px solid #E6E8F2;
				font-size: 14px;
				padding-left: 20px;
				color: #999999;
			}
			.addquan_c_b {
				padding: 10px;
				overflow-y: auto;
				height: 130px;
			}
		}
		.Select_box {
			width: 270px;
			height: 90px;
			margin-bottom: 10px;
			background: url(../../../assets/images/icon_quan_gray.png) no-repeat center;
			cursor: pointer;
			.s-t_b {
				width: 85px;
				color: #878787;
				height: 100%;
				font-size: 12px;
				text-align: center;
				padding-top: 20px;
				.tit01 {
					font-size: 18px;
				}
				.tit_s {
					font-size: 16px;
				}
				.tit_s_s {
					font-size: 12px;
				}
				.tit_h {
					line-height: 14px;
					margin: 0;
				}
				.tit_s_h {
					line-height: 28px;
				}
			}
			.s-t_b02 {
				width: 183px;
				height: 100%;
				padding: 7px;
				font-size: 12px;
				padding-left: 12px;
				.tit02 {
					color: #878787;
					line-height: 16px;
				}
			}
		}
		.f-active {
			background: url(../../../assets/images/icon_quan_blue.png) no-repeat center!important;
			position: relative;
			.icon_selected {
				position: absolute;
				background: url(../../../assets/images/icon_selected.png) no-repeat center;
				width: 18px;
				height: 18px;
				right: 0px;
				bottom: 0px;
			}
		}
		.b_button {
			padding-top: 20px;
			padding-bottom: 5px;
			margin-top: 10px;
			background: #fff;
			position: fixed;
			z-index: 99;
			bottom: 0px;
			width: 100%;
			left: 200px;
			border-top: 1px solid #E6E8F2;
		}
		.icon-intro {
			width: 15px;
			height: 15px;
			background: url(../../../assets/images/icon-intro02.png) no-repeat center;
			display: inline-block;
		}
		.Issuing_coupons {
			background: #FFFFFF;
			min-height: 800px;
			.nav_container {
				width: 100%;
				height: 40px;
				line-height: 40px;
				display: flex;
				border-bottom: 1px solid #EDF0F7;
				.navli {
					width: 250px;
					height: 100%;
					text-align: center;
					a {
						text-decoration: none;
						display: inline-block;
						line-height: 38px;
						font-size: 16px;
						font-family: PingFangSC-Regular;
						color: rgba(102, 102, 102, 1);
					}
					.f_active {
						border-bottom: 2px solid #0086FF;
						color: #0086FF;
					}
				}
			}
			.Issuingcen01,
			.Issuingcen02 {
				padding-left: 30px;
				.add_button {
					display: inline-block;
				}
				.Issuing_bt {
					margin-top: 20px;
					margin-bottom: 10px;
					font-size: 14px;
					font-family: PingFangSC-Regular;
					color: rgba(51, 51, 51, 1);
				}
				.Issuing_ct {
					width: 100%;
					padding-right: 10px;
				}
				.range {
					margin-left: 140px;
					padding: 0 20px;
					background-color: #F9FAFE;
					border: 1px solid #E6E8F2;
					min-width: 1060px;
				}
			}
			.Issuingcen03 {
				min-width: 910px;
				.Is03_t_b {
					padding-left: 10px;
					position: relative;
					padding-right: 360px; 
					display: flex;
					.Is03_user {
						width: 908px;
						// width: 100%;
						// min-width: 550px;
						height: 110px;
						border: 1px solid #E6E8F2;
						margin-top: 20px;
						.Is03_user_top {
							padding-left: 20px;
							font-size: 14px;
							width: 100%;
							height: 30px;
							line-height: 30px;
							border-bottom: 1px solid #E6E8F2;
						}
						.Is03_user_btn {
							width: 100%;
							height: 80px;
							/*text-align: center;*/
							.Is03_user_boxnone {
								text-align: center;
								font-size: 14px;
								color: #999999;
								line-height: 80px;
							}
						}
					}
					.Is03_user02 {
						// position: absolute;
						// right: 0;
						// top: 0;
						// width: 350px;
						// float: right;
						// padding-left: 10px;
						 margin-left: 20px;
						padding-top: 20px;
					}
				}
				.Is03_t_b02 {
					width: 100%;
					background: #F3F4F9;
					min-height: 615px;
					padding: 10px 360px 0 0; // display: flex;
					margin: 18px 0 100px 0;
					position: relative;
					.Is03_t_b02_l {
						background: #fff;
						min-height: 550px;
						width: 100%;
						min-width: 930px;
						margin-right: 10px;
						padding-bottom: 10px;
						.form_top {
							min-width:930px;
							padding: 10px;
							padding-bottom: initial;
							.el-form{
								min-width:930px;
							}
						}
						.table {
							padding: 10px;
							padding-top: initial;
						}
					}

					.Is03_t_b02_r {
						position: absolute;
						background: #fff;
						width: 350px;
						min-height: 550px;
						padding: 10px;
						right: 0;
						top: 10px;
						.Selection_of_couponsbox {
							width: 270px;
							height: 90px;
							line-height: 90px;
							color: #879CB8;
							// font-size: 30px;
							text-align: center;
							border: 1px dotted #879CB8;
							cursor: pointer;
						}
					}
				}
			}
		}
		.newaddReceive {
			width: 560px; // height: 350px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
			top: 145px;
			left: 30px;
			background: #FFFFFF;
			border: 1px solid #CCCCCC;
			z-index: 9;
			padding: 25px 25px 25px 15px;
			.newaddspan {
				display: inline-block;
				width: 60px;
				text-align: right;
			}
			.newaddinput {
				width: 300px!important;
				height: 32px!important;
			}
			.add_quan {
				width: 270px;
				height: 90px;
				background: rgba(255, 255, 255, 1);
				display: inline-block;
				border: 1px dotted #B7C9E1;
				text-align: center;
				margin-left: 10px;
				cursor: pointer;
				.jiahao {
					font-size: 35px;
					border-radius: 1px;
					color: rgba(135, 156, 184, 1);
					text-align: center;
					line-height: 80px;
					display: inline-block;
					margin-left: 100px;
				}
				.c_jh {
					font-size: 14px;
					color: rgba(204, 204, 204, 1);
					line-height: 85px;
					display: inline-block;
				}
			}
			.edit_quan {
				width: 270px;
				height: 90px;
				background: rgba(255, 255, 255, 1);
				display: inline-block;
				cursor: pointer;
			}
			.footer {
				width: 100%;
				border-top: 1px solid #CCCCCC;
				padding-top: 10px;
				margin-top: 20px;
				text-align: center;
			}
			.add_tit {
				font-size: 12px;
				font-family: PingFangSC-Regular;
				color: rgba(204, 204, 204, 1);
				width: 154px;
				margin-left: 10px;
			}
		}
		
		.editReceive {
			width: 560px; // height: 350px;
			// box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
			// top: 145px;
			// left: 30px;
			// background: #FFFFFF;
			// border: 1px solid #CCCCCC;
			// z-index: 9;
			// padding: 25px 25px 25px 15px;
			.newaddspan {
				display: inline-block;
				width: 60px;
				text-align: right;
			}
			.newaddinput {
				width: 300px!important;
				height: 32px!important;
			}
			.add_quan {
				width: 270px;
				height: 90px;
				background: rgba(255, 255, 255, 1);
				display: inline-block;
				border: 1px dotted #B7C9E1;
				text-align: center;
				margin-left: 10px;
				cursor: pointer;
				.jiahao {
					font-size: 35px;
					border-radius: 1px;
					color: rgba(135, 156, 184, 1);
					text-align: center;
					line-height: 80px;
					display: inline-block;
					margin-left: 100px;
				}
				.c_jh {
					font-size: 14px;
					color: rgba(204, 204, 204, 1);
					line-height: 85px;
					display: inline-block;
				}
			}
			.edit_quan {
				width: 270px;
				height: 90px;
				background: rgba(255, 255, 255, 1);
				display: inline-block;
				cursor: pointer;
			}
			.footer {
				width: 100%;
				border-top: 1px solid #CCCCCC;
				padding-top: 10px;
				margin-top: 20px;
				text-align: center;
			}
			.add_tit {
				font-size: 12px;
				font-family: PingFangSC-Regular;
				color: rgba(204, 204, 204, 1);
				width: 154px;
				margin-left: 10px;
			}
		}
		.Select_coupons {
			width: 875px; // height: 470px;
			border: 1px solid #E6E8F2;
			.Select_coupons_t {
				width: 100%;
				/*height: 50px;*/
				background: rgba(249, 250, 254, 1);
				border-radius: 3px 3px 0px 0px;
				border-bottom: 1px solid #E6E8F2;
				padding: 10px;
				display: flex;
				.sort {
					width: 380px!important;
					height: 32px!important;
					margin-right: 10px;
				}
				.sort02 {
					width: 340px!important;
					height: 32px!important;
					margin-right: 10px;
				}
				.btn {
					width: 60px;
					height: 30px;
					background: rgba(255, 255, 255, 1);
					border-radius: 3px 2px 2px 3px;
					border: 1px solid #E6E8F2;
					background: #fff;
					color: #0086FF;
					font-size: 14px;
				}
			}
			.Select_coupons_b {
				width: 100%;
				height: 416px;
				overflow-y: auto;
				padding-top: 18px;
				padding-bottom: 18px;
				padding-left: 15px;
				.Select_box {
					width: 270px;
					height: 90px;
					margin-bottom: 10px;
					background: url(../../../assets/images/icon_quan_gray.png) no-repeat center;
					cursor: pointer;
					.s-t_b {
						width: 85px;
						color: #878787;
						height: 100%;
						font-size: 12px;
						text-align: center;
						padding-top: 20px;
						.tit01 {
							font-size: 18px;
						}
					}
					.s-t_b02 {
						width: 183px;
						height: 100%;
						padding: 7px;
						font-size: 12px;
						padding-left: 12px;
						.tit02 {
							color: #878787;
						}
					}
				}
				.f-active {
					background: url(../../../assets/images/icon_quan_blue.png) no-repeat center!important;
					position: relative;
					.icon_selected {
						position: absolute;
						background: url(../../../assets/images/icon_selected.png) no-repeat center;
						width: 18px;
						height: 18px;
						right: 0px;
						bottom: 0px;
					}
				}
			}
			.nomore {
				text-align: center;
			}
		}
	}

	.f-active {
		background: url(../../../assets/images/icon_quan_blue.png) no-repeat center!important;
		position: relative;
		.icon_selected {
			position: absolute;
			background: url(../../../assets/images/icon_selected.png) no-repeat center;
			width: 18px;
			height: 18px;
			right: 0px;
			bottom: 0px;
		}
	}

	.Is03_user_box{
		padding:5px  20px 0 20px;
		width:908px;
		height:100%;
		overflow: hidden;
		position: relative;
		line-height: 24px;
		word-wrap:break-word;
	}
	.totaluser{
		position: absolute;
		width:160px;
		bottom:5px;
		right:22px;
		background-color: #fff;
	}

	.mt30 {
		margin-top: 30px;
	}

	.border_top {
		border-top: 1px solid #E5E5E5;
	}

	.pt3 {
		padding-top: 3px;
	}

	.marauto {
		margin: auto;
	}

	.widnone {
		width: initial!important;
	}

	.mr20 {
		margin-right: 20px;
	}

	.hght50 {
		height: 50px;
	}

	.mt5 {
		margin-top: 5px;
	}

	.wid180 {
		width: 180px;
	}

	.poi1 {
		position: relative;
	}

	.overflowy {
		overflow-y: auto;
	}

	.mb10 {
		margin-bottom: 10px;
	}

	.mr5 {
		margin-right: 5px;
	}

	.poi2 {
		position: absolute;
	}

	.poi3 {
		position: fixed;
	}

	.wose {
		white-space: nowrap;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.wose02 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.bluecolor {
		background: #0086FF;
		color: #FFFFFF;
	}

	.bluecolor02 {
		color: #0086FF;
	}

	.wid280 {
		width: 280px;
	}

	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	.clear {
		clear: both;
		overflow: hidden;
	}

	.mt10 {
		margin-top: 10px;
	}

	.mr10 {
		margin-right: 10px;
	}

	.mt20 {
		margin-top: 20px;
	}

	.ml10 {
		margin-left: 10px;
	}

	.ml100 {
		margin-left: 100px;
	}

	.ml75 {
		margin-left: 75px;
	}

	.linh35 {
		line-height: 35px;
		display: inline-block;
	}

	.ml60 {
		margin-left: 60px;
	}

	.mr10 {
		margin-right: 10px;
	}

	.fontstyle {
		font-style: normal;
	}
	.mobile {
		margin: 5px;
	}

</style>
