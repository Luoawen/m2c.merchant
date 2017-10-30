<template>
  <div role="tabpanel" class="tab-pane fade in active"  aria-labelledby="home-tab">
    <div class="goods_search" style="width: 100%; height: 40px;">
      <div  style="float: left">
        售后期望:
          <el-select v-model="search_params.expectation" placeholder="请选择售后期望">
            <el-option v-for="item in expectations" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
      </div><!-- 售后期望-->
      <div style="float: left">
        售后状态:
          <el-select v-model="search_params.afterSaleStatus" placeholder="请选择售后状态">
            <el-option v-for="item in afterSales" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
      </div><!--售后状态-->
      <div style="float: left">
        媒体信息:
        <el-select v-model="search_params.hasMedia" placeholder="请选择媒体信息">
          <el-option v-for="item in mediaStatus" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div><!--售后状态-->
      <div class="ops_time" style="float:left;width: 540px;">申请时间:
      <el-date-picker  v-model="search_params.startTime"   type="date"  placeholder="选择日期"   format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
        </el-date-picker>
        -
        <el-date-picker v-model="search_params.endTime" type="date"  placeholder="选择日期"  format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
        </el-date-picker>
      </div><!--时间-->
      <div class="search" style="width: 350px;float: left">
        <el-input placeholder="输入商品名称 / 订货号 / 售后号" v-model="search_params.condition" class="input-with-select">
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
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="商品信息"
          width="200">
          <template slot-scope="scope"><img v-bind:src="JSON.parse(scope.row.goodsInfo.goodsImage)[0]" style="width: 60px;height: 60px;"/><span >{{scope.row.goodsInfo.goodsName}}</span></template>
        </el-table-column>
        <el-table-column
          prop="afterSellOrderId"
          label="单号"
          width="200">
        </el-table-column>
        <el-table-column
          label="售后期望"
          width="200"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.orderType==0?'换货':scope.row.orderType==1?'退货':scope.row.orderType==2?'仅退款':'-'}}</span></template>
        </el-table-column>
        <el-table-column
          label="售后总额/元"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.backMoney/100}}</span></template>
        </el-table-column>
        <el-table-column
          label="售后状态"
          width="200"
          show-overflow-tooltip>
          <template slot-scope="scope"><span>{{scope.row.status==0?'申请退货':scope.row.status==1?'申请换货':scope.row.status==2?'申请退款':scope.row.status==3?'拒绝':scope.row.status==4?'同意':scope.row.status==5?'客户寄出':scope.row.status==6?'商家收到':scope.row.status==7?'商家寄出':scope.row.status==8?'客户收到':scope.row.status==9?'同意退款':'-'}}</span></template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          show-overflow-tooltip>
          <template slot-scope="scope"><span >{{handleDate(scope.row.createDate)}}</span></template>
        </el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-col :span="12">
              <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail')">详情</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </template>
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
          value: '2',
          label: '仅退款'
        }, {
          value: '1',
          label: '退货退款'
        }, {
          value: '0',
          label: '换货'
        }],
        afterSales:[{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '申请退货'
        }, {
          value: '1',
          label: '申请换货'
        }, {
          value: '2',
          label: '申请退款'
        }, {
          value: '3',
          label: '拒绝'
        }, {
          value: '4',
          label: '同意'
        }, {
          value: '5',
          label: '客户寄出'
        }, {
          value: '6',
          label: '商家收到'
        }, {
          value: '7',
          label: '商家寄出'
        }, {
          value: '8',
          label: '客户收到'
        }, {
          value: '9',
          label: '同意退款'
        }],
        afterSaleStatus:'',//售后状态
        mediaStatus:[{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '有媒体信息'
        }, {
          value: '2',
          label: '无媒体信息'
        }],
        // 搜索参数
        search_params: { expectation: '', afterSaleStatus: '', condition: '', startTime: '', endTime: '',hasMedia:'' }
        ,orderStoreData:[]
      }
    },
    methods: {
      // 获取全部订单信息
       orderStore () {
      let that = this
      that.$.ajax({
        type: 'get',
        url: this.base + 'm2c.scm/dealerorderafter/dealerorderafterselllist',
        data: {
          token: sessionStorage.getItem('mToken'),
          isEncry: false,
          /*dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,*/
          dealerId:'JXS42ACB6D352E9417FBBCF03908219AAF1',
          rows: that.pageRows,                     // 每页多少条数据
          pageNum: that.currentPage,    // 请求第几页*/
          orderType:that.search_params.expectation,
          status:that.search_params.afterSaleStatus,
          condition:that.search_params.condition,
          startTime:that.search_params.startTime,
          endTime:that.search_params.endTime
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
      ,exportSaleOrder () {
        let that = this
        let strHref = this.base + 'm2c.scm//order/export/saleafter?'
        let strParam = "dealerId=" + JSON.parse(sessionStorage.getItem('mUser')).dealerId
        that.$.each(that.search_params, function (i, n) {
          strParam +=  "&" + i + "=" + n;
        });
        window.open(strHref + strParam, '_export')
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
      ,handleDate (input){
        var d = new Date(input);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
        var hour = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        return  year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
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
