<template>
  <div class="content clear">
    <div class="searcWrap">
      <el-select v-model="search_params.expectation" placeholder="请选择售后期望">
        <el-option v-for="item in expectations" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="search_params.afterSaleStatus" placeholder="请选择售后状态">
        <el-option v-for="item in afterSales" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="search_params.hasMedia" placeholder="请选择媒体信息">
        <el-option v-for="item in mediaStatus" :key="item.value" :label="item.label" :value="item.value">
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
      <el-input v-model="search_params.condition" placeholder="输入商品名称/订货号/售后号" title="输入商品名称/订货号/售后号"></el-input>
      <el-button type="primary" size="medium" @click="orderStore()" class="btn-search">搜索</el-button>
      <el-button type="primary" size="medium" icon="el-icon-download" @click.native="exportSearch()" class="fr">导出</el-button>
    </div>
    <div class="order_tab_list" style="margin-top: 20px;">
      <el-table
        ref="multipleTable"
        :data="orderStoreData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="操作"
          width="120"
          >
          <template slot-scope="scope">
            <!--<el-dropdown trigger="click">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail')">详情</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>-->
            <el-button
              @click.native.prevent="handleCommand(scope.$index, scope.row,'_detail')"
              type="text"
              size="small">
              详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="商品信息"
          width="300">
          <template slot-scope="scope"><img v-bind:src="JSON.parse(scope.row.goodsInfo.goodsImage == ''? '[]': scope.row.goodsInfo.goodsImage)[0]" style="width: 60px;height:60px;margin-right:10px;" class="fl"/>
          <a class="ellipsis2 width190" style="margin-left:70px;margin-top:8px;" :title="scope.row.goodsInfo.goodsName">
            <i v-if="scope.row.goodsInfo.isChange==1" class="changeGood"></i>
            {{scope.row.goodsInfo.goodsName}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="afterSellOrderId"
          label="单号"
          width="300">
        </el-table-column>
        <el-table-column
          label="售后期望"
          >
          <template slot-scope="scope"><span>{{scope.row.orderType==0?'换货':scope.row.orderType==1?'退货退款':scope.row.orderType==2?'仅退款':'-'}}</span></template>
        </el-table-column>
        <el-table-column
          label="售后总额/元"
          >
          <template slot-scope="scope"><span>{{((parseFloat(scope.row.strBackMoney) + parseFloat(scope.row.strRtFreight))).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column
          label="售后状态"
          >
          <template slot-scope="scope">
            <span>
            <!--{{scope.row.status==0?'申请退货':scope.row.status==1?'申请换货':scope.row.status==2?'申请退款':scope.row.status==3?'拒绝':scope.row.status==4?'已同意申请':scope.row.status==5?'客户已寄出':scope.row.status==6?'商家已收到':scope.row.status==7?'商家已寄出':scope.row.status==8?'客户收到':scope.row.status==9?'已同意退款':scope.row.status==10?'已退款':scope.row.status==11?'售后完成':scope.row.status==-1?'取消':'-'}}-->
              {{scope.row.orderType==0?(scope.row.status==-1?'售后已取消':scope.row.status==3?'商家已拒绝':scope.row.status==1?'待商家同意':scope.row.status==4?'待顾客寄回商品':(scope.row.status==5||scope.row.status==6)?'待商家发货':scope.row.status==7?'待顾客收货':scope.row.status>=8?'售后已完成':'--'):scope.row.orderType==1?(scope.row.status==-1?'售后已取消':scope.row.status==3?'商家已拒绝':scope.row.status==0?'待商家同意':scope.row.status==4?'待顾客寄回商品':(scope.row.status==5||scope.row.status==6)?'待商家确认退款':scope.row.status>=9?'售后已完成':'--'):scope.row.orderType==2?(scope.row.status==-1?'售后已取消':scope.row.status==3?'商家已拒绝':scope.row.status==2?'待商家同意':scope.row.status==4?'待商家确认退款':scope.row.status>=9?'售后已完成':'--'):'--'}}
            </span></template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          width="200"
          >
          <template slot-scope="scope"><span >{{date_format(new Date(scope.row.createDate), 'yyyy-MM-dd hh:mm:ss')  }}</span></template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin: 20px;float: left">
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
          label: '售后期望'
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
          label: '售后状态'
        }, {
          value: '20',
          label: '待商家同意'
        }, {
          value: '21',
          label: '待顾客寄回商品'
        }, {
          value: '22',
          label: '待商家确认退款'
        }, {
          value: '23',
          label: '待商家发货'
        }, {
          value: '24',
          label: '待顾客收货'
        }, {
          value: '25',
          label: '售后已完成'
        }, {
          value: '26',
          label: '售后已取消'
        },{
          value: '27',
          label: '商家已拒绝'
        }],
        afterSaleStatus:'',//售后状态
        mediaStatus:[{
          value: '',
          label: '媒体信息'
        }, {
          value: '1',
          label: '有媒体信息'
        }, {
          value: '0',
          label: '无媒体信息'
        }],
        // 搜索参数
        search_params: { expectation: '', afterSaleStatus: '', condition: '', startTime: '', endTime: '',hasMedia:'' }
        ,orderStoreData:[],
        time:''
        ,isChangePage:false
      }
    },
    methods: {
      //时间赋值
      timeCheck () {
        let that = this
        if(that.time != null){
          that.search_params.startTime = that.time[0]
          that.search_params.endTime = that.time[1]
        }else{
          that.search_params.startTime = ''
          that.search_params.endTime = ''
        }
      },
      // 获取全部订单信息
      orderStore () {
        let that = this;
        if(!that.isChangePage){
          that.currentPage = 1
        }
        console.log("that.pageRows==" + that.pageRows + ";"+ that.currentPage);
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/dealerorderafter/web/dealerorderafterselllist',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            rows: that.pageRows,                     // 每页多少条数据
            pageNum: that.currentPage,    // 请求第几页*/
            orderType:that.search_params.expectation,
            status:that.search_params.afterSaleStatus,
            condition:that.search_params.condition.replace(/\s+/g,""),
            startTime:that.search_params.startTime,
            endTime:that.search_params.endTime,
            mediaInfo:that.search_params.hasMedia
          },
          success: function (result) {
            console.log(result);
            if (result.status === 200){
              // 获取商品列表

              that.orderStoreData = result.content
              that.totalCount = result.totalCount
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
        that.isChangePage = true
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
      },
      exportSearch (){
        let that = this
        if (that.search_params.startTime > that.search_params.endTime) {
          that.show_tip('开始时间不能大于结束时间')
          return
        }
        // search_params: { expectation: '', afterSaleStatus: '', condition: '', startTime: '', endTime: '',hasMedia:'' }
        let url=that.localbase + 'm2c.scm/order/export/saleafter?dealerId='+JSON.parse(sessionStorage.getItem('mUser')).dealerId+'&status='+that.search_params.afterSaleStatus+'&orderType='+that.search_params.expectation+'&condition='+that.search_params.condition+'&startTime='+that.search_params.startTime+'&mediaInfo='+that.search_params.hasMedia+'&endTime='+that.search_params.endTime;
        window.location.href=url
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
