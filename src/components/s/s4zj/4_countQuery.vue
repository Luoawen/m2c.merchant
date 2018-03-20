<template>
  <div class="content clear">
    <div class="searcWrap">
      <el-select v-model="search_params.SettleStatus" placeholder="结算状态">
        <el-option v-for="item in expectations" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" value-format="yyyy-MM-dd"
        @change="timeCheck">
      </el-date-picker>
      <el-input v-model="search_params.condition" placeholder="输入结算号/订货号" title="输入结算号/订货号"></el-input>
      <el-button type="primary" size="medium" @click="orderStore()" class="btn-search">搜索</el-button>
    </div>
    <div class="order_tab_list" style="margin-top: 20px;">
      <table class="tableHead" style="z-index:2;">
        <tr>
          <th width="300">结算号</th>
          <th width="200">订货号</th>
          <th>订货金额/元</th>
          <th>售后金额/元</th>
          <th>服务费/元
            <div class="icon">
              <div class="tips">
                <p>使用平台的服务费</p>
              </div>
            </div>
          </th>
          <th>满减分摊/元
            <div class="icon">
              <div class="tips">
                <p>满减活动，商家承担的活动成本</p>
              </div>
            </div>
          </th>
          <th>优惠券分摊/元
            <div class="icon">
              <div class="tips">
                <p>使用优惠券，商家承担的活动成本</p>
              </div>
            </div>
          </th>
          <th>结算总额/元
            <div class="icon">
              <div class="tips">
                <p>商家最终结算的金额</p>
              </div>
            </div>
          </th>
          <th>结算状态</th>
          <th width="200">更新时间</th>
        </tr>
      </table>
      <!-- -->
      <el-table
        id="multipleTable" :show-header=false
        :data="orderStoreData"
        tooltip-effect="dark"
        style="z-index:1;">
        <el-table-column
         width="300"
          label="结算号">
          <template slot-scope="scope"><span >{{scope.row.settleId}}</span></template>
        </el-table-column>
        <el-table-column
          label="订货号"
           width="200"
          >
          <template slot-scope="scope"><span><!--{{scope.row.orderType==0?'换货':scope.row.orderType==1?'退货':scope.row.orderType==2?'仅退款':'-'}}-->{{scope.row.dealerOrderId}}</span></template>
        </el-table-column>
        <el-table-column
          label="订货金额/元"
          >
          <template slot-scope="scope"><span>{{(scope.row.goodsTotalAmount)}}</span></template>
        </el-table-column>
        <el-table-column
          label="售后金额/元"
          >
          <template slot-scope="scope"><span>{{(scope.row.afterSellAmount)}}</span></template>
        </el-table-column>
        <el-table-column
          label="服务费/元"
          >
          <template slot-scope="scope"><span>{{scope.row.serviceTotalCharge == undefined ? '-':(scope.row.serviceTotalCharge)}}</span></template>
        </el-table-column>
        <el-table-column
          label="满减分摊/元"
          >
          <template slot-scope="scope"><span>{{scope.row.activityTotalAmount == undefined ? '-':(scope.row.activityTotalAmount)}}</span></template>
        </el-table-column>
         <el-table-column
          label="优惠券分摊/元"
          >
          <template slot-scope="scope"><span>{{scope.row.couponShareTotalAmount == undefined ? '-':(scope.row.couponShareTotalAmount)}}</span></template>
        </el-table-column>
        <el-table-column
          label="结算总额/元"
          >
          <template slot-scope="scope"><span>{{scope.row.settleTotalAmount == undefined ? '-':(scope.row.settleTotalAmount)}}</span></template>
        </el-table-column>
        <el-table-column
          label="结算状态"
          >
          <template slot-scope="scope"><span>{{scope.row.settleStatus==1?'待结算':scope.row.settleStatus == 2 ?'已结算':'-'}}</span></template>
        </el-table-column>
        <el-table-column
          label="更新时间"
           width="200"
          >
          <template slot-scope="scope"><span >{{scope.row.updatedTime == undefined ? '-' : date_format(new Date(scope.row.updatedTime), 'yyyy-MM-dd hh:mm:ss')  }}</span></template>
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
        pageRows:10,
        currentPage: 1,
        totalCount:0,
        expectations:[{
          value: '',
          label: '结算状态'
        }, {
          value: '1',
          label: '待结算'
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
        search_params: { dealerOrderId: '', condition: '', startTime: '', endTime: '', SettleStatus: '' },
       orderStoreData: [/*{settleId:'',dealerOrderId:'',goodsTotalAmount:'',afterSellAmount:'',serviceTotalCharge:'',activityTotalAmount:'',settleTotalAmount:'',settleStatus:'',updatedTime:''}*/],
        time: '',
        isChangePage:false,
      }
    },
    methods: {
      timeCheck () {
        let that = this
        if (that.time != null) {
          that.search_params.startTime = that.time[0]
          that.search_params.endTime = that.time[1]
        } else {
          that.search_params.startTime = ''
          that.search_params.endTime = ''
        }
      },
      // 获取全部订单信息
      orderStore () {
        let that = this
        if(!that.isChangePage){
          that.currentPage = 1
        }
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.trading/web/settle/dealer/pager.web',
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser'))?JSON.parse(sessionStorage.getItem('mUser')).dealerId:'',
            rows: that.pageRows,                     // 每页多少条数据
            pageNumber: that.currentPage,    // 请求第几页*/
            keyword:that.search_params.condition.replace(/\s+/g,""),
            settleStatus:that.search_params.SettleStatus,
            startDate:that.search_params.startTime,
            endDate:that.search_params.endTime
          },
          success: function (result) {
            if (result.status === 200){
              // 获取商品列表
              that.orderStoreData = result.content
              that.totalCount = result.totalCount
              that.$nextTick(()=>{
                let th=that.$(".tableHead").find("th")
                for(var i=0;i<th.length;i++){
                  // console.log(th.eq(i).width()+"px")
                  that.$('#multipleTable').find(".cell").eq(i).css('width',th.eq(i).width()+"px")
                }
              })
            }
          }
        })
         that.isChangePage = false
      }
      ,handleSizeChange(val) {
        let that = this
        that.pageRows=val
        that.orderStore();
      }
      ,handleCurrentChange(val) {
        let that = this
        that.currentPage=val
        that.isChangePage = true
        that.orderStore();
      }
      ,handleCommand (index,row,action) {
        let that = this
        if (action === '_detail') {
          that.$router.push({name: 'countQueryDetail', query:{settleId:row.settleId}})
        }
      }
    },
    mounted () {
      let that = this
      if(that.$route.query.SettleStatus==='1'){
        that.search_params.SettleStatus = '1'
      }
      this.orderStore()
    }
  }
</script>
<style lang="scss" scoped>
  table{ table-layout:fixed;}
    .tableHead{width:100%;border:none;margin:none;padding:0px;z-index:2;position: relative;
      tr th{height:40px;background:#F4F5FA;box-shadow: 0 1px 0 0 #E5E5E5;line-height:40px;font-size: 14px;
      color: #333;text-align: left;padding-left:20px;}
      tr:hover td{background: #DFE9F6;}
      tr th{background: #DFE9F6;font-weight:normal;
        div.icon{width:16px;height:16px; display:inline-block; position:relative;background:url(../../../assets/images/ico_explain.png) no-repeat 0 0;
          div.tips{display:none;width:100px;height:auto;background:#fff;border:1px solid #E5E5E5;border-radius: 4px;box-shadow: 0 1px 0 0 #E5E5E5;position: absolute;top:18px;left:0px; text-indent: 0;padding:6px;font-weight:normal;
            p{line-height:24px;font-size:12px; color:#666;}
          }
        }
        div.icon:hover div.tips{display:block;}
      }
      tr td.sums{
        text-align: right;
        padding-right:60px;
        height:50px;
      }
    }
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
