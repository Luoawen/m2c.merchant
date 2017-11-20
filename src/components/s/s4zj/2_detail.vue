<template>
  <div role="tabpanel" class="tab-pane fade in active"  aria-labelledby="home-tab" style="margin-top: 20px;width: 100%;margin-top: 130px;margin-left: 20px;">
    <div class="goods_search" style="width: 100%; height: 40px;">
      <div  style="float: left">
        业务类型:
        <el-select v-model="search_params.businessType" placeholder="请选择业务类型">
          <el-option v-for="item in expectations" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div  style="float: left">
        收入方式:
        <el-select v-model="search_params.inoutType" placeholder="请选择收入方式">
          <el-option v-for="item in inoutTypes" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div><!-- 售后期望-->
      <div class="ops_time" style="float:left;width: 540px;">生成时间:
        <el-date-picker  v-model="search_params.startTime"   type="date"  placeholder="选择日期"   format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
        </el-date-picker>
        -
        <el-date-picker v-model="search_params.endTime" type="date"  placeholder="选择日期"  format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
        </el-date-picker>
      </div><!--时间-->
      <div class="search" style="width: 350px;float: left">
        <el-input placeholder="输入业务号  " v-model="search_params.condition" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click.native="orderStore()"></el-button>
        </el-input>
      </div>
      <div><button type="button" style="margin-right: 100px;margin-top: 6px" class="btn btn-default pull-right operation" @click="exportDetail()">导出</button></div>
    </div>
    <div class="order_tab_list" style="margin-top: 20px;">
      <el-table
        ref="multipleTable"
        :data="orderStoreData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          width="50">
        </el-table-column>
        <el-table-column
          label="业务号"
          width="300">
          <template slot-scope="scope"><span v-if="scope.row.businessType != 4 && scope.row.businessType != 5">{{scope.row.businessId}}</span><span v-if="scope.row.businessType == 4">售后单号：&nbsp{{scope.row.correlationBusinessId}}</span><span v-if="scope.row.businessType == 5">售后单号：&nbsp{{scope.row.correlationBusinessId}}</span><br/>
            <span v-if="scope.row.businessType == 4 || scope.row.businessType == 5"  style="font-size:3px;color: lightsteelblue ">{{scope.row.businessId}}</span></template>
        </el-table-column>
        <el-table-column
          label="业务类型"
          width="300"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.businessType==1?'销售分成':scope.row.businessType==2?'活动分摊':scope.row.businessType==3?'提现':scope.row.businessType==4?'分成退款':scope.row.businessType==5?'分摊退款':'-'}}</span></template>
        </el-table-column>
        <el-table-column
          label="收入/元"
          width="300"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>+{{(scope.row.amount/100 > 0?(scope.row.amount)/100:0).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column
          label="支出/元"
          width="300"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{(scope.row.amount/100 < 0?(scope.row.amount)/100:0).toFixed(2)}}</span></template>
        </el-table-column>
        <!--<el-table-column
          label="商家信息"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.platformName}}</span></template>
        </el-table-column>-->
        <el-table-column
          label="生成时间"
          width="400"
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
      <div class="block" style="margin: 20px;float: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="rows"
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
          label: '全部'
        }, {
          value: '1',
          label: '收入'
        }, {
          value: '2',
          label: '支出'
        }],

        expectations:[{
          value: '',
          label: '全部'
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
        search_params: { inoutType:'',condition: '', startTime: '', endTime: '',businessType:'' }
        ,orderStoreData:[]
      }
    },
    methods: {
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
            businessIdOrDealerName:that.search_params.condition.replace(/\s+/g,""),
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
