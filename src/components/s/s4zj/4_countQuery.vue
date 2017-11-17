<template>
  <div role="tabpanel" class="tab-pane fade in active"  aria-labelledby="home-tab" style="margin-top: 20px;width: 100%;margin-top: 130px;margin-left: 20px;">
    <div class="goods_search" style="width: 100%; height: 40px;">
      <div  style="float: left">
        结算状态:
        <el-select v-model="search_params.SettleStatus" placeholder="请选择结算状态">
          <el-option v-for="item in expectations" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div><!-- 售后期望-->
      <div class="ops_time" style="float:left;width: 540px;">申请时间:
        <el-date-picker  v-model="search_params.startTime"   type="date"  placeholder="选择日期"   format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
        </el-date-picker>
        -
        <el-date-picker v-model="search_params.endTime" type="date"  placeholder="选择日期"  format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
        </el-date-picker>
      </div><!--时间-->
      <div class="search" style="width: 350px;float: left">
        <el-input placeholder="输入结算号 / 订货号 / 商家名称" v-model="search_params.condition" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click.native="orderStore()"></el-button>
        </el-input>
      </div>
    </div>
    <div class="order_tab_list" style="margin-top: 20px;">
      <el-table
        ref="multipleTable"
        :data="orderStoreData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          width="20">
        </el-table-column>
        <el-table-column
          label="结算号"
          width="300">
          <template slot-scope="scope"><span >{{scope.row.settleId}}</span></template>
        </el-table-column>
        <el-table-column
          label="订货号"
          width="350"
          show-overflow-tooltip>
          <template slot-scope="scope"><span><!--{{scope.row.orderType==0?'换货':scope.row.orderType==1?'退货':scope.row.orderType==2?'仅退款':'-'}}-->{{scope.row.dealerOrderId}}</span></template>
        </el-table-column>
        <el-table-column
          label="订货金额/元"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{(scope.row.goodsTotalAmount/100).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column
          label="售后金额/元"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{(scope.row.afterSellAmount/100).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column
          label="服务费/元"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.serviceTotalCharge == undefined ? '-':(scope.row.serviceTotalCharge/100).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column
          label="活动分摊/元"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.activityTotalAmount == undefined ? '-':(scope.row.activityTotalAmount/100).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column
          label="结算总额/元"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.settleTotalAmount == undefined ? '-':(scope.row.settleTotalAmount/100).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column
          label="结算状态"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.settleStatus==1?'未结算':scope.row.settleStatus == 2 ?'已结算':'-'}}</span></template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          width="200"
          show-overflow-tooltip>
          <template slot-scope="scope"><span >{{date_format(new Date(scope.row.updatedTime), 'yyyy-MM-dd hh:mm:ss')  }}</span></template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin: 20px;float: right">
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
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        pageRows:5,
        currentPage: 1,
        totalCount:0,
        expectations:[{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '未结算'
        }, {
          value: '2',
          label: '已结算'
        }],
//        mediaStatus:[{
//          value: '',
//          label: '全部'
//        }, {
//          value: '1',
//          label: '有媒体信息'
//        }, {
//          value: '2',
//          label: '无媒体信息'
//        }],
        // 搜索参数
        search_params: { dealerOrderId: '',condition: '', startTime: '', endTime: '',SettleStatus:'' }
        ,orderStoreData:[]
      }
    },
    methods: {
      // 获取全部订单信息
      orderStore () {
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.trading/web/settle/dealer/pager.web',
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            pageRows: that.pageRows,                     // 每页多少条数据
            pageNo: that.currentPage,    // 请求第几页*/
            keyword:that.search_params.condition,
            settleStatus:that.search_params.SettleStatus,
            startDate:that.search_params.startTime,
            endDate:that.search_params.endTime
          },
          success: function (result) {
            if (result.status === 200){
              // 获取商品列表

              that.orderStoreData = result.content
              that.totalCount = result.totalCount
            }
          }
        })
      }
      ,handleSizeChange(val) {
        let that = this
        that.goodsStorePageRows=val
        that.goodsStore();
      }
      ,handleCurrentChange(val) {
        let that = this
        that.goodsStoreCurrentPage=val
        that.goodsStore();
      }
      ,handleCommand (index,row,action) {
        let that = this
        if (action === '_detail') {
          that.$router.push({name: 'countQueryDetail', query:{settleId:row.settleId}})
        }
      }
    },
    mounted () {
      this.orderStore()
    }
  }

</script>
<style lang="scss" scoped>
  .sp{
    width: 1583px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .dropdown{
      display: inline-block;
      font-size: 16px;
      line-height: 84px;
      .sort{
        display: inline;
        margin: 0 20px 0 30px;
      }
      .state{
        display: inline;
        margin-right: 20px;
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
      padding: 10px;
      position: relative;
      .bootstrap-table {
        margin: 0;
      }
      [tableexport-id] {
        width: 120px;
        height: 25px;
        color: #fff;
        line-height: 25px;
        border-radius: 2px;
        border: none;
        margin-bottom: 12px;
        position: absolute;
        top: 10px;
        left: 134px;
        background: #F56C6C;
      }
      .public_button {
        width: 120px;
        height: 25px;
        color: #fff;
        border-radius: 2px;
        border: none;
      }
      .print_order {
        background: #18DCF6;
      }
      //表格样式
      table {
        td {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
