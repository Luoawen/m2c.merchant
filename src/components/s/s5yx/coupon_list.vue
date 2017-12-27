<template>
  <div class="content clear">
    <div class="searchWarp search" >
      <el-col :span="24">
        <el-form :inline="true"  :model="searchParams" style="margin-bottom:-20px">
          <el-form-item>
            <el-input  v-model="searchParams.coupon_no" placeholder="请输入优惠券编号" @keydown.enter="getCouponList" @blur="formValidator('1')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input  v-model="searchParams.coupon_name" placeholder="请输入优惠券名称" @keydown.enter="getCouponList" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchParams.coupon_status" clearable placeholder="全部有效状态" @change="getCouponList">
              <el-option label="未生效" value="1"></el-option>
              <el-option label="已生效" value="2"></el-option>
              <el-option label="已失效" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker style='margin-top:9px'
              v-model="searchParams.time"
              type="daterange"
              clearable
              align="left"
              :editable="false"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchParams.coupon_type" clearable placeholder="全部类型" @change="getCouponList">
              <el-option label="代金券" value="1"></el-option>
              <el-option label="折扣券" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchParams.use_status" clearable placeholder="全部使用状态" @change="getCouponList">
              <el-option label="正常" value="1"></el-option>
              <el-option label="无可用" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="tablecontainer">
        <el-button  class="tbcolor01" @click="centerDialogVisible = true">新增优惠券</el-button>
        <el-button  class="tbcolor02" @click="gotoSendCoupon()">发放优惠券</el-button>
        <el-button type="primary" class="sort btn-search" @click="getCouponList()">搜索</el-button>
        <el-button plain @click="resetSearchParams()">重置搜索条件</el-button>
      </el-col>
    </div>
    <div class="tab">
      <el-table :data="tableData.content" style="width: 100%">
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
             <el-col :span="24"  >
                <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="scope.row.creatorType === 2" @click.native="handleCommand(scope.$index, scope.row,'_detail','a')">详情</el-dropdown-item>
                  <el-dropdown-item  v-if="scope.row.couponStatus<3 && scope.row.creatorType === 2" @click.native="handleCommand(scope.$index, scope.row,'_modify','a')">修改</el-dropdown-item>
                  <el-dropdown-item  style="color:red" v-if="scope.row.couponStatus<3" @click.native="handleCommand(scope.$index, scope.row,'_forbid','a')">终止</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="couponNo">
        </el-table-column>
        <el-table-column label="创建者"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.creatorType === 1 ? '平台' : scope.row.creatorType === 2 ? '商家' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="couponName">
        </el-table-column>
        <el-table-column label="数量（剩余／总数量）" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.couponTotal === 0 ? '∞' : scope.row.couponRemain}}/{{scope.row.couponTotal === 0 ? '∞' : scope.row.couponTotal}}</span>
          </template>
        </el-table-column>
        <el-table-column label="面值" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.couponForm === 1 ? scope.row.value + '元' : scope.row.value + '折'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.couponType === 1 ? '代金券' : scope.row.couponType === 2 ? '折扣券' : scope.row.couponType === 3 ? '分享券' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.couponStatus === 1 ? '未生效' : scope.row.couponStatus === 2 ? '已生效' : scope.row.couponStatus === 3 ? '已失效' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.useStatus === 1 ? '正常' : scope.row.useStatus === 2 ? '无可用' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="生成时间" align="center" prop="createTime">
        </el-table-column>
      </el-table>
      <div class="fl mt10">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParams.page_no"
        :page-sizes="[10, 15, 20, 40]"
        :page-size="searchParams.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="选择需要新增的优惠券的类型"
      :visible.sync="centerDialogVisible"
      width="30%"
      center :modal-append-to-body="false"
      :close-on-click-modal="false"
      >
      <div class="add_xzyh clear">
        <div :class="['add_xbox', 'fl', create_flag == 'cash' ? 'c_active' : '']" @click="create_flag = 'cash'">
          <div class="add_xbox_bg"></div>
          <div class="tit">代金券</div>
          <div class="tit01">用户使用该优惠券减对 应金额，可后台发放</div>
          <!--选中的时候请做出判断出现icon_selected-->
          <i class="icon_selected" v-if="create_flag == 'cash'"></i>
        </div>
        <div :class="['add_xbox', 'fr', create_flag == 'discount' ? 'c_active' : '']"  @click="create_flag = 'discount'">
          <div class="add_xbox_bg"></div>
          <div class="tit">折扣券</div>
          <div class="tit01">用户使用该优惠券减对 应折扣，可后台发放</div>
          <i class="icon_selected" v-if="create_flag == 'discount'"></i>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="gotoCreateVue()">下一步</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      create_flag: 'cash',
      centerDialogVisible: false,
      tableData: '',
      searchParams: {
        coupon_no: '',
        coupon_name: '',
        coupon_type: '',
        coupon_status: '',
        time: [],
        start_time: '',
        end_time: '',
        creator_type: '',
        creator: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        use_status: '',
        page_no: 1,
        page_size: 10
      },
    }
  },
  watch: {
    'searchParams.time': {
      handler (val, oldVal) {
        let that = this
        if (!oldVal) return
        if (val == oldVal) return
        if (!val) {
          that.searchParams.start_time = ''
          that.searchParams.end_time = ''
        }
      },
      deep: true
    }
  },
  mounted () {
    let _this = this
    _this.getCouponList()
  },
  methods: {
    formatDate (date, fmt) {
      let that = this
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : that.padLeftZero(str))
        }
      }
      return fmt
    },
    padLeftZero (str) {
      return ('00' + str).substr(str.length)
    },
    // 验证输入条件
    formValidator (flag) {
      let _this = this
      // flag--1:编号
      if (flag === '0' || flag === '1') {
        let reg = /^[0-9]*$/
        if (reg.test(_this.searchParams.coupon_no) === false) {
          _this.searchParams.coupon_no = ''
          alert('优惠券编号只能是数字')
        }
      }
    },
    // 重置搜索条件
    resetSearchParams () {
      let _this = this
      _this.searchParams = {
        coupon_no: '',
        coupon_name: '',
        coupon_status: '',
        start_time: '',
        end_time: '',
        coupon_type: '',
        creator_type: '',
        use_status: '',
        page_no: 1,
        page_size: 10
      }
      _this.getCouponList()
    },
    // 获取满减列表
    getCouponList () {
      let _this = this
      if (_this.searchParams.time != null && _this.searchParams.time.length > 0) {
        _this.searchParams.start_time = _this.formatDate(_this.searchParams.time[0], 'yyyy-MM-dd')
        _this.searchParams.end_time = _this.formatDate(_this.searchParams.time[1], 'yyyy-MM-dd')
      }
      _this.$.ajax({
        url: _this.localbase + 'm2c.market/coupon/page',
//        url: 'http://localhost:8080/m2c.market/coupon/page',
        data: Object.assign({}, {token: sessionStorage.getItem('access_token'), isEncry: false}, _this.searchParams),
        success: function (result) {
          _this.tableData = result
        }
      })
    },
    // 终止优惠券
    stopCoupon (couponId) {
      let _this = this
      if (confirm('确定要终止该优惠券?')) {
        _this.$.ajax({
          type: 'post',
          url: _this.localbase + 'm2c.market/coupon/end/' + couponId,
//          url: 'http://localhost:8080/m2c.market/coupon/end/' + couponId,
          success: function (result) {
            if (result.status === 200) {
              console.log('status:', result.status)
              alert('优惠券终止成功!')
              _this.getCouponList()
            } else {
              alert('优惠券终止失败!')
            }
          }
        })
      }
    },
    handleSizeChange (pageSize) {
      let _this = this
      _this.searchParams.page_size = pageSize
      _this.getCouponList()
    },
    handleCurrentChange (pageNo) {
      let _this = this
      _this.searchParams.page_no = pageNo
      _this.getCouponList()
    },
    // 跳转创建优惠券页面
    gotoCreateVue () {
      let _this = this
      if (_this.create_flag === 'cash') { // 创建代金券
        _this.$goRoute({path: 'coupon_cash_dealer'})
      }
      if (_this.create_flag === 'discount') { // 创建折扣券
        _this.$goRoute({path: 'coupon_discount_dealer'})
      }
      _this.centerDialogVisible = false
    },
    // 优惠券详情
    detailCoupon1 (couponId) {
      let _this = this
      _this.$goRoute({path: 'coupon_detail_dealer'})
    },
    modifyCoupon1 (couponId) {
      let _this = this
      _this.$goRoute({path: 'coupon_modify_dealer'})
    },
    //  跳转到发放优惠券
    gotoSendCoupon () {
       let _this = this
        // sessionStorage.setItem('coupon_id', couponId)
      _this.$goRoute({path: 'couponShare'})
    },
      handleCommand (index,row,action,to) {
        let that = this
        sessionStorage.setItem('coupon_id', row.couponId)
        if (action === '_detail') {
         that.detailCoupon1(row.couponId);
        } else if (action === '_modify') {
         that.modifyCoupon1(row.couponId);
        } else if (action === '_forbid') {
           that.stopCoupon(row.couponId);
        }
      }
  }
}
</script>

<style lang="scss" scoped>
.fl{
  float: left;
}
.fr{
  float: right;
}
.clear{
  clear: both;
}
.mt10{
  margin-top: 10px;
}
.mr60{
	margin-right: 60px;
}
.ml40{
	margin-left: 40px;
}
  .add_xzyh{
  	height: 330px;
  	border-bottom: 1px solid #E5E5E5;
  	overflow: auto;
  	.c_active{
  		border: 1px solid #0086FF!important;
  		position: relative;
  		.tit{
  			color: #0086FF!important;
  		}
  		.icon_selected{
  			position: absolute;
  			background: url(../../../assets/images/icon_selected.png) no-repeat center;
  			width:18px;
				height:18px;
				right: 0px;
				bottom: 0px;
  		}
  	}
  	.add_xbox{
  		width: 200px;
    	height: 250px;
    	border: 1px solid #E6E8F2;
    	padding-top: 36px;
    	margin-bottom: 20px;
    	margin-left: 5%;
    	cursor: pointer;
  		.add_xbox_bg{
  		width: 100px;
  		height: 60px;
  		background: url(../../../assets/images/icon_quan.png) no-repeat center;
  		margin: auto;
  		margin-bottom: 27px;
  		}
  		.tit{
			font-size:16px;
			font-family:PingFangSC-Medium;
			color:#333;
			line-height:22px;
			margin-bottom: 20px;
			text-align: center;
  		}
  		.tit01{
  		width: 120px;
			font-size:12px;
			font-family:PingFangSC-Light;
			color:rgba(51,51,51,1);
			line-height:20px;
			text-align: center;
			margin: auto;
  		}
  	}
  }
  .search_c{
    background-color: #fff;
    padding: 14px 35px;
    padding-top: 28px;
    margin-bottom: 10px;
  }
  .tablecontainer{
    background-color: #fff;
    padding: 10px;
    .tbcolor01{
      background: #11D2EB;
      border: 1px solid #11D2EB;
      color: #fff;
    }
    .tbcolor02{
      background: #F5BD23;
      border: 1px solid #F5BD23;
      color: #fff;
    }
    .tbcolor03{
      background: #88BAF4;
      border: 1px solid #88BAF4;
      color: #fff;
    }
  }

</style>
