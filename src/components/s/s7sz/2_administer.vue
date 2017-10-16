<template>
  <div class="bs-example bs-example-tabs sz" data-example-id="togglable-tabs">
    <ul id="myTabs" class="nav nav-tabs" role="tablist">
      <li role="presentation" class="active"><a href="#home" id="home-tab" role="tab" data-toggle="tab" aria-controls="home" aria-expanded="true">品牌库</a></li>
      <li role="presentation"><a href="#profile" role="tab" id="profile-tab" data-toggle="tab" aria-controls="profile">品牌审核</a></li>
      <button type="button" class="btn btn-info pull-right btn-lg">新增</button>
    </ul>
    <div id="myTabContent" class="tab-content">

      <div role="tabpanel" class="tab-pane fade in active" id="home" aria-labelledby="home-tab">
        <div class="search_cell">
          <span>申请时间<i class="glyphicon glyphicon-calendar" @click="timeBox()"></i></span>
          <div class="time" v-show="is_Success">
            <input type="date" class="form-control search_input search_input_date_l start" v-model="search_params.startTime"><span class="separator">-</span><input type="date" class="form-control search_input search_input_date_r end" v-model="search_params.endTime">
          </div>
        </div>
        <div class="search">
          <input type="text" class="inp" value="输入商品名称 / 编码 / 条形码 / 品牌 "><i class="glyphicon glyphicon-search"></i>
        </div>
        <div class="comment_info">
          <table id="table" style="table-layout:fixed"></table>
        </div>
      </div>

      <div role="tabpanel" class="tab-pane fade" id="profile" aria-labelledby="profile-tab">
        <div class="dropdown">
          <div id="dLabel1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="sort">品牌状态
            <span class="caret"></span>
          </div>
          <ul class="dropdown-menu" aria-labelledby="dLabel1">
            <li>全部<i class="glyphicon glyphicon-menu-right"></i></li>
            <li>申请中<i class="glyphicon glyphicon-menu-right"></i></li>
            <li>审核不通过<i class="glyphicon glyphicon-menu-right"></i></li>
          </ul>
        </div>
        <div class="search_cell">
          <span>申请时间<i class="glyphicon glyphicon-calendar" @click="timeBox()"></i></span>
          <div class="time" v-show="is_Success">
            <input type="date" class="form-control search_input search_input_date_l start" v-model="search_params.startTime"><span class="separator">-</span><input type="date" class="form-control search_input search_input_date_r end" v-model="search_params.endTime">
          </div>
        </div>
        <div class="search">
          <input type="text" class="inp" value="输入商品名称 / 编码 / 条形码 / 品牌 "><i class="glyphicon glyphicon-search"></i>
        </div>
        <div class="comment_info">
          <table id="table1" style="table-layout:fixed"></table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        is_Success: false,
        // 搜索参数
        search_params: {orderNo: '', settleBillId: '', dealerKey: '', mediaKey: '', salerKey: '', startTime: '', endTime: ''}
      }
    },
    methods: {
      // 获取结算单列表
      get_comment_info () {
        let that = this
        this.$("[data-toggle='popover']").popover('hide')
        that.$('#table').bootstrapTable('destroy').bootstrapTable({
          cache: false,
          url: that.base + 'm2c.pay/settle/bill/list',
          queryParams: function (params) {
            return Object.assign({}, {
              token: sessionStorage.getItem('mToken'),
              isEncry: false,
              rows: params.limit,                          // 每页多少条数据
              pageNumber: params.offset / params.limit + 1    // 请求第几页
            }, that.search_params)
          },
          pagination: true,
          pageNumber: 1,
          pageSize: 10,
          pageList: [5, 10, 20, 100, 200, 500],
          striped: true,
          queryParamsType: 'limit',
          sidePagination: 'server',
          contentType: 'application/x-www-form-urlencoded',
          responseHandler: function (result) {
            // console.log('结算单列表:', result)
            return {
              total: result.totalCount,    // 总页数
              rows: result.content         // 数据
            }
          },
          columns: [{
            title: '品牌名称',
            align: 'center',
            valign: 'middle',
            formatter: function (x, y) {
              let orderNo = y.orderNo
              let l = orderNo.length
              return `<span class="tooltip-test" data-container="body" data-toggle="popover" data-placement="right" data-content="${orderNo}">${orderNo.slice(l - 5, l)}</span>`
            }
          }, {
            title: '申请时间',
            align: 'center',
            valign: 'middle',
            width: 100,
            formatter: function (x, y) {
              let d = new Date(y.settleTime)
              return that.date_format(d, 'yyyy-MM-dd hh:mm:ss')
            }
          }, {
            field: 'createdUserName',
            title: '操作',
            align: 'center',
            valign: 'middle',
            formatter: function () {
              return `<img :src='../../../assets/images/ico_more.png' width='17px' height='16px'>`
            }
          }]
        })
      },
      get_comment_info1 () {
        let that = this
        this.$("[data-toggle='popover']").popover('hide')
        that.$('#table1').bootstrapTable('destroy').bootstrapTable({
          cache: false,
          url: that.base + 'm2c.pay/settle/bill/list',
          queryParams: function (params) {
            return Object.assign({}, {
              token: sessionStorage.getItem('mToken'),
              isEncry: false,
              rows: params.limit,                          // 每页多少条数据
              pageNumber: params.offset / params.limit + 1    // 请求第几页
            }, that.search_params)
          },
          pagination: true,
          pageNumber: 1,
          pageSize: 10,
          pageList: [5, 10, 20, 100, 200, 500],
          striped: true,
          queryParamsType: 'limit',
          sidePagination: 'server',
          contentType: 'application/x-www-form-urlencoded',
          responseHandler: function (result) {
            // console.log('结算单列表:', result)
            return {
              total: result.totalCount,    // 总页数
              rows: result.content         // 数据
            }
          },
          columns: [{
            title: '评论内容',
            align: 'center',
            valign: 'middle',
            formatter: function (x, y) {
              let orderNo = y.orderNo
              let l = orderNo.length
              return `<span class="tooltip-test" data-container="body" data-toggle="popover" data-placement="right" data-content="${orderNo}">${orderNo.slice(l - 5, l)}</span>`
            }
          },
          {
            title: '评价星级',
            align: 'center',
            valign: 'middle',
            formatter: function (x, y) {
              return (y.dealerPercent ? y.dealerPercent * 100 + '%' : 0) + ' : ' + (y.mediaPercent ? y.mediaPercent * 100 + '%' : 0) + ' : ' + (y.salerPercent ? y.salerPercent * 100 + '%' : 0) + ' : ' + (y.platformPercent ? y.platformPercent * 100 + '%' : 0)
            }
          }, {
            field: 'dealerName',
            title: '商品名称',
            align: 'center',
            valign: 'middle'
          }, {
            field: 'mediaName',
            title: '订单号',
            align: 'center',
            valign: 'middle'
          }, {
            field: 'salerName',
            title: '顾客信息',
            align: 'center',
            valign: 'middle'
          }, {
            title: '评价时间',
            align: 'center',
            valign: 'middle',
            width: 100,
            formatter: function (x, y) {
              let d = new Date(y.settleTime)
              return that.date_format(d, 'yyyy-MM-dd hh:mm:ss')
            }
          }, {
            field: 'createdUserName',
            title: '操作',
            align: 'center',
            valign: 'middle'
          }]
        })
      },
      timeBox () {
        this.is_Success = true
      }
    },
    mounted () {
      this.get_comment_info()
      this.get_comment_info1()
    }
  }
</script>
<style lang="scss" scoped>
.sz{
    width: 1620px;
    height: 880px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .nav{
      height: 50px;
      button{
        height: 40px;
        margin-top: 5px;
        margin-right: 15px;
      }
    }
    .tab-content{
      .tab-pane{
        .search_cell{
          display: inline-block;
          position: relative;
          height: 84px;
          line-height: 84px;
          span{
            font-size: 16px;
            margin-right: 25px;
            margin-left: 20px;
            i{
              font-size: 20px;
              padding-left: 10px;
            }
          }
          .time{
            width: 330px;
            height: 61px;
            position: absolute;
            left: -61px;
            top: 41px;
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
              left: 141px;
              top: -16px;
            }
            .end{
              right: 20px;
            }
          }
        }
      }
    }
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
        .comment_info{
          table {
            td {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .pagination{
            margin: 0;
          }
        }
    }
    
}
</style>
