<template>
  <div>
    <div class="sp" v-if="isShow">
    <div class="dropdown">
      <div id="dLabel1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="sort">商品分类
        <span class="caret"></span>
      </div>
      <ul class="dropdown-menu" aria-labelledby="dLabel1">
        <li>家电<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>手机数码<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>家居<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>服装<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>个性化妆<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>鞋帽箱包<i class="glyphicon glyphicon-menu-right"></i></li>
      </ul>
    </div>
    <div class="dropdown">
      <div id="dLabel2" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="state">商品状态
        <span class="caret"></span>
      </div>
      <ul class="dropdown-menu" aria-labelledby="dLabel2">
        <li>全部<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>出售中<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>审核中<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>审核未通过<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>仓库中<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>已售罄<i class="glyphicon glyphicon-menu-right"></i></li>
        <li>草稿<i class="glyphicon glyphicon-menu-right"></i></li>
      </ul>
    </div>
    <div class="search">
      <input type="text" class="inp" value="输入商品名称 / 编码 / 条形码 / 品牌 "><i class="glyphicon glyphicon-search"></i>
    </div>
    <span>高级搜索</span>
    <button type="button" class="btn btn-info pull-right add" @click="clickadd()">新增</button>
    <button type="button" class="btn btn-default pull-right operation">批量操作</button>
    <div class="good_info">
      <table id="table" style="table-layout:fixed"></table>
    </div>
  </div>
  <div class="addMess" v-if="!isShow">
    4645645646
  </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        amout: '',
        number: '',
        isShow: true,
        is_Success: false,
        // 搜索参数
        search_params: { orderNo: '', keywordType: '', statusFlag: sessionStorage.getItem('statusFlag'), payWay: '', startTime: sessionStorage.getItem('startTime'), endTime: sessionStorage.getItem('endTime'), keyword: '' }
      }
    },
    methods: {
      // 获取全部订单信息
      get_good_info () {
        let that = this
        that.is_Success = false
        that.$('#table').bootstrapTable('destroy').bootstrapTable({
          method: 'get',
          url: this.base + 'm2c.order/order/list/for/dealer',
          queryParams: function (params) {
            return Object.assign({}, {
              token: sessionStorage.getItem('mToken'),
              isEncry: false,
              dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
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
            // console.log(result)
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
            width: '50',
            formatter: function (x, y) {
              return `
                <a path='/s/s22czdd' order=true handle=true>操作</a>
              `
            },
            align: 'center',
            valign: 'middle'
          }, {
            field: 'orderNo',
            title: '分类',
            align: 'center',
            valign: 'middle',
            width: '155'
          }, {
            field: 'goodsName',
            title: '品牌',
            align: 'center',
            valign: 'middle',
            width: '155'
          }, {
            field: 'payTradeNo',
            title: '拍货价/元',
            align: 'center',
            valign: 'middle',
            width: '155'
          }, {
            field: 'receiverName',
            title: '库存',
            align: 'center',
            valign: 'middle',
            width: '80'
          }, {
            title: '销量',
            align: 'center',
            valign: 'middle',
            width: '155',
            formatter: function (x, y) {
              let d = new Date(y.commitTime)
              return that.date_format(d, 'yyyy-MM-dd hh:mm:ss')
            }
          }, {
            title: '状态',
            align: 'center',
            valign: 'middle',
            width: '100',
            formatter: function (x, y) {
              return y.trailStatus === 1 ? '待付款' : y.trailStatus === 2 ? '待发货' : y.trailStatus === 3 ? '商家已发货' : y.trailStatus === 4 ? '已收货' : y.trailStatus === 5 ? '订单完成' : '-'
            }
          }, {
            title: '操作',
            align: 'center',
            valign: 'middle',
            width: '80',
            formatter: function (x, y) {
              return y.payWay === 1 ? '支付宝' : y.payWay === 2 ? '微信' : '-'
            }
          }]
        })
      },
      clickadd () {
        this.isShow = false
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
