<template>
  <div class="sp">
    <div class="dropdown">
      <div id="dLabel1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="sort">
        <select v-model="search_params.orderType" name="orderType" >
          <option value="" selected>订单状态</option>
          <option value="">全部</option>
          <option value="1">待付款</option>
          <option value="2">待发货</option>
          <option value="3">待收货</option>
          <option value="4">交易完成</option>
          <option value="5">交易关闭</option>
        </select>
      </div>

    </div>
    <div class="dropdown">
      <div id="dLabel2" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="state">
        <select v-model="search_params.status" name="status" >
          <option value="" selected>售后状态</option>0,1申请换货,2,3拒绝,4同意(退换货),5客户寄出,6商家收到,7商家寄出,8客户收到,9同意退款, 10确认退款,11交易关闭
          <option value="0">申请退货</option>
          <option value="1">申请换货</option>
          <option value="2">申请退款</option>
          <option value="3">商家拒绝申请</option>
          <option value="4">商家同意申请</option>
          <option value="5">客户寄出</option>
          <option value="6">商家收到</option>
          <option value="7">商家寄出</option>
          <option value="8">客户收到</option>
          <option value="9">同意退款</option>
          <option value="10">确认退款</option>
          <option value="11">交易关闭</option>
        </select>
      </div>
    </div>
    <div class="search_cell">

      <span>下单时间<i class="glyphicon glyphicon-calendar" @click="timeBox()"></i></span>
      <div class="time" v-show="is_Success">
        <input type="date" class="form-control search_input search_input_date_l start" v-model="search_params.startTime"><span class="separator">-</span><input type="date" class="form-control search_input search_input_date_r end" v-model="search_params.endTime">
      </div>

    </div>
    <div class="search">
      <input type="text" class="inp" value=""  v-model="search_params.condition"><i class="glyphicon glyphicon-search" id="searchIco" @click="search()"></i>
    </div>
    <span>高级搜索</span>
    <button type="button" class="btn btn-default pull-right operation">导出</button>
    <div class="good_info">
      <table id="table" style="table-layout:fixed"></table>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent,no-trailing-spaces */

  export default {
    name: '',
    data () {
      return {
        amout: '',
        number: '',
        is_Success: false,
        // 搜索参数
        search_params: { orderType: '', status: sessionStorage.getItem('statusFlag'), startTime: sessionStorage.getItem('startTime'), endTime: sessionStorage.getItem('endTime'), condition: '' }
      }
    },
    methods: {
      // 获取全部订单信息
      get_good_info () {
        let that = this
        that.is_Success = false
        that.$('#table').bootstrapTable('destroy').bootstrapTable({
          method: 'get',
          // url: this.base + 'm2c.scm/dealerorderafter/dealerorderafterselllist',
          url: this.base + 'm2c.scm/dealerorder/dealerorderlist',
          queryParams: function (params) {
            return Object.assign({}, {
              token: sessionStorage.getItem('mToken'),
              isEncry: false,
              dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId, // JSON.parse(sessionStorage.getItem('mUser')).dealerId,
              rows: params.limit,                     // 每页多少条数据
              pageNumber: params.offset / params.limit + 1    // 请求第几页
            }, that.search_params)
          },
          pagination: true,
          pageNumber: 1,
          pageSize: 10,
          pageList: [5, 10, 20, 100],
          striped: true,
          showExport: true,
          exportDataType: 'selected',
          queryParamsType: 'limit',
          sidePagination: 'server',
          contentType: 'application/x-www-form-urlencoded',
          responseHandler: function (result) {
            console.log(result)
            return {
              total: result.totalCount,    // 总页数
              rows: result.content         // 数据
            }
          },
          columns: [{
            checkbox: true,
            valign: 'middle'
          }, {
            title: '商品信息',
            events: 'handle',
            width: '150',
            formatter: function (x, y) {
              return "<image src='" + JSON.parse(y.goodsInfo.goodsImage)[0] + "' width='50'></image>" + y.goodsInfo.goodsName + y.goodsInfo.skuName
            },
            align: 'center',
            valign: 'middle'
          }, {
            field: 'afterSellOrderId',
            title: '单价/元',
            align: 'center',
            valign: 'middle',
            width: '155'
          }, {
              field: 'sellNum',
              title: '单价/元',
              align: 'center',
              valign: 'middle',
              width: '155'
            }, {
            title: '售后期望',
            align: 'center',
            valign: 'middle',
            width: '155',
            formatter: function (x, y) {
              return y.orderType === 0 ? '换货' : y.orderType === 1 ? '退货' : y.orderType === 2 ? '仅退款' : '-'
            }
          }, {
            field: 'backMoney',
            title: '售后总金额/元',
            align: 'center',
            valign: 'middle',
            width: '155',
            formatter: function (x, y) {
              return y.backMoney / 100
            }
          }, {
            title: '售后状态',
            align: 'center',
            valign: 'middle',
            width: '80',
            // 0申请退货,1申请换货,2申请退款,3拒绝,4同意(退换货),5客户寄出,6商家收到,7商家寄出,8客户收到,9同意退款, 10确认退款,11交易关闭
            formatter: function (x, y) {
              return y.status === 0 ? '申请退货' : y.status === 1 ? '申请换货' : y.status === 2 ? '申请退款' : y.status === 3 ? '拒绝' : y.status === 4 ? '同意' : y.status === 5 ? '客户寄出' : y.status === 6 ? '商家收到' : y.status === 7 ? '商家寄出' : y.status === 8 ? '客户收到' : y.status === 9 ? '同意退款' : '-'
            }
          }, {
            title: '申请时间',
            align: 'center',
            valign: 'middle',
            width: '155',
            formatter: function (x, y) {
              let d = new Date(y.createDate)
              return that.date_format(d, 'yyyy-MM-dd hh:mm:ss')
            }
          }, {
            title: '操作',
            align: 'center',
            valign: 'middle',
            width: '80',
            formatter: function (x, y) {
              return '<a href=#>详情</a>'
            }
          }]
        })
      },
      timeBox () {
        this.is_Success = true
      },
      search () {
        this.get_good_info()
      }
    },
    mounted () {
      this.get_good_info()
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
