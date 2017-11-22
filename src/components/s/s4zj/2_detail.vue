<template>
  <div class="content clear">
    <div class="searcWrap">
        <el-select v-model="search_params.businessType" placeholder="业务类型">
          <el-option v-for="item in expectations" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="search_params.inoutType" placeholder="收入方式">
          <el-option v-for="item in inoutTypes" :key="item.value" :label="item.label" :value="item.value">
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
      <el-input v-model="search_params.condition" placeholder="输入业务号" title="输入业务号"></el-input>
      <el-button type="primary" size="medium" @click="orderStore()">搜索</el-button>
      <el-button type="primary" size="medium" icon="el-icon-download" @click.native="exportDetail()" class="fr">导出</el-button>
    </div>
    <div class="order_tab_list" style="margin-top: 20px;">
      <el-table
        ref="multipleTable"
        :data="orderStoreData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="业务号"
          width="300">
          <template slot-scope="scope"><span v-if="scope.row.businessType != 4 && scope.row.businessType != 5">{{scope.row.businessId}}</span><span v-if="scope.row.businessType == 4">售后单号：&nbsp{{scope.row.correlationBusinessId}}</span><span v-if="scope.row.businessType == 5">售后单号：&nbsp{{scope.row.correlationBusinessId}}</span><br/>
            <span v-if="scope.row.businessType == 4 || scope.row.businessType == 5"  style="font-size:3px;color: lightsteelblue ">{{scope.row.businessId}}</span></template>
        </el-table-column>
        <el-table-column
          label="业务类型"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.businessType==1?'销售入账':scope.row.businessType==2?'活动分摊':scope.row.businessType==3?'服务费':scope.row.businessType==4?'提现':scope.row.businessType==5?'分摊退款':scope.row.businessType==6?'服务费退款':scope.row.businessType==7?'销售退款':'-'}}</span></template>
        </el-table-column>
        <el-table-column
          label="收入/元"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>+{{scope.row.inoutType == 1 ?(scope.row.amount/100).toFixed(2):(1-1).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column
          label="支出/元"
          show-overflow-tooltip>
          <template slot-scope="scope"><span v-if="scope.row.amount>=0">-{{scope.row.inoutType == 2 ?(scope.row.amount/100).toFixed(2):(1-1).toFixed(2)}}</span> <span v-if="scope.row.amount <0">{{scope.row.inoutType == 2 ?(scope.row.amount/100).toFixed(2):(1-1).toFixed(2)}}</span></template>
        </el-table-column>
        <!--<el-table-column
          label="商家信息"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.platformName}}</span></template>
        </el-table-column>-->
        <el-table-column
          label="生成时间"
          width="300"
          show-overflow-tooltip>
          <template slot-scope="scope"><span >{{scope.row.createDate }}</span></template>
        </el-table-column>
        <!--<el-table-column
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-col :span="12">
              <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                      </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail')">详情</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="block fl" style="margin: 20px;">
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

        inoutTypes:[{
          value: '',
          label: '收入方式'
        }, {
          value: '1',
          label: '收入'
        }, {
          value: '2',
          label: '支出'
        }],

        expectations:[{
          value: '',
          label: '业务类型'
        }, {
          value: '1',
          label: '销售入账'
        }, {
          value: '2',
          label: '活动分摊'
        },{
          value: '3',
          label: '服务费'
        },{
          value: '4',
          label: '提现'
        },{
          value: '5',
          label: '分摊退款'
        },{
          value: '6',
          label: '服务费退款'
        },{
          value: '7',
          label: '销售退款'
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
        search_params: { inoutType: '', condition: '', startTime: '', endTime: '', businessType: '' },
        orderStoreData: [],
        time: ''
      }
    },
    methods: {
      // 时间赋值
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
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.trading/web/accounting/dealer/inout/detail/page',
          data: {
            dealerId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            token: sessionStorage.getItem('mToken'),
            pageSize: that.pageRows,                     // 每页多少条数据
            pageNo: that.currentPage,    // 请求第几页*/
            businessId:that.search_params.condition.replace(/\s+/g,""),
            businessType:that.search_params.businessType,
            inoutType:that.search_params.inoutType,
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
      },
      exportDetail () {
        let that = this
        let url = that.localbase + 'm2c.trading/web/accounting/dealer/inout/detail/export?businessIdOrDealerName='+that.search_params.condition+'&startDate='+that.search_params.startTime+"&endDate="+that.search_params.endTime+"&inoutType="+that.search_params.inoutType+"&businessType="+that.search_params.businessType+"&dealerId="+JSON.parse(sessionStorage.getItem('mUser')).dealerId
        window.location.href = url
      }
      ,handleSizeChange(val) {
        let that = this
        that.pageRows=val
        that.orderStore();
      }
      ,handleCurrentChange(val) {
        let that = this
        that.currentPage=val
        that.orderStore();
      }
      ,handleCommand (index,row,action) {
        let that = this
        if (action === '_detail') {
          let path='details';
          sessionStorage.setItem('afterSale:afterSellOrderId', row.afterSellOrderId)
          that.$goRoute({path: path})
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
    height: 84px;
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
