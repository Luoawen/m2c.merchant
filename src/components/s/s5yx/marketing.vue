<template>
  <div class="marketing">
    <div class="search " >
      <div class="search_cell ">
        <span>编号</span>
        <input class="form-control search_input  " v-model="search_params.full_cut_no" placeholder="满减编号" @blur="formValidator(1)">
      </div>
      <div class="search_cell">
        <span>满减名称</span>
        <input class="form-control search_input" v-model="search_params.full_cut_name" placeholder="满减名称" maxlength="11">
      </div>
      <div class="search_cell">
        <span>状态</span>
        <select data-v-0c409cb2="" class="form-control search_input"  v-model="search_params.status">
            <option data-v-0c409cb2="" value="0" >全部</option>
            <option data-v-0c409cb2="" value="1">未生效</option>
            <option data-v-0c409cb2="" value="2">已生效</option>
            <option data-v-0c409cb2="" value="3">已失效</option>
        </select>
      </div>
      <div class="search_cell">
        <span>生成时间</span>
        <input type="date" class="form-control search_input search_input_date_l" v-model="search_params.start_time" :max="search_params.end_time">
        ~
        <input type="date" class="form-control search_input search_input_date_r" v-model="search_params.end_time" :min="search_params.start_time">
      </div><span @click="sevenDay()">最近7天</span>
      </br>
      <div class="search_cell">
          <span>形式</span>
        <select data-v-0c409cb2="" class="form-control search_input" v-model="search_params.full_cut_type">
            <option data-v-0c409cb2="" value="0">全部</option>
            <option data-v-0c409cb2="" value="1">减钱</option>
            <option data-v-0c409cb2="" value="2">打折</option>
            <option data-v-0c409cb2="" value="3">换购</option>
        </select>
      </div>
      <div class="search_cell">
        <span>使用情况</span>
        <select data-v-0c409cb2="" class="form-control search_input" v-model="search_params.use_type">
          <option data-v-0c409cb2="" value="0">全部</option>
          <option data-v-0c409cb2="" value="1">正常</option>
          <option data-v-0c409cb2="" value="2">无可用</option>
        </select>
      </div><br/>
      <div class="search_cell">
        <button class="btn button btn-info" @click="goto"  path="/s/fullCut">新增满减</button>
        <button class="btn button btn-warning" @click="resetSearchParams()">重置搜索条件</button>
        <button class="btn button btn-primary" @click="getFullCutList()"  >搜索</button>
      </div>
    </div>

    <table id="table" @click="goto"></table>

  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        // 搜索参数
        // search_params: {orderNo: '', settleBillId: '', dealerKey: '', mediaKey: '', salerKey: '', startTime: '', endTime: ''}
        search_params: {
          full_cut_no: '',
          full_cut_name: '',
          status: 0,
          start_time: '',
          end_time: '',
          full_cut_type: 0,
          creator_type: 2,
          use_type: 0,
          creator: JSON.parse(sessionStorage.getItem('mUser')).dealerId
        }
      }
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
      sevenDay(){
        let that = this
        var date1 = new Date()
        that.search_params.end_time = that.formatDate(date1, 'yyyy-MM-dd')
        var date2 = new Date(date1)
        date2.setDate(date1.getDate() - 7)
        that.search_params.start_time = that.formatDate(date2, 'yyyy-MM-dd')
      },
      goto (event) {
        let that = this
        let path = event.target.getAttribute('path')
        if (!path) return
        if (that.active_path === path) {
          that.$router.go(0)
          return
        }
        that.$goRoute({path: path})
      },
      formValidator(flag) {
        let that = this
        //falg--1:编号
        if (flag == 0 || flag == 1) {
          var reg = /^[0-9]*$/
          console.log('reg:', reg.test(that.search_params.full_cut_no))
          if (reg.test(that.search_params.full_cut_no) == false) {
            that.search_params.full_cut_no = ''
            alert("满减编号只能是数字")
          }
        }
      },
      resetSearchParams(){
        let that = this
        that.search_params = {full_cut_no: '', full_cut_name: '', status: 0, start_time: '', end_time: '', full_cut_type: 0, creator_type: 0, use_type: 0}
        that.getFullCutList()
      },
      // 获取满减列表
      getFullCutList () {
        let that = this
        this.$("[data-toggle='popover']").popover('hide')
        that.$('#table').bootstrapTable('destroy').bootstrapTable({
          cache: false,
          url: that.base + 'm2c.market/fullcut/page',
//          url: 'http://localhost:8080/m2c.market/fullcut/page',
          queryParams: function (params) {
            return Object.assign({}, {
              token: sessionStorage.getItem('mToken'),
              isEncry: false,
              page_size: params.limit,                     // 每页多少条数据
              page_no: params.offset / params.limit + 1    // 请求第几页
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
            return {
              total: result.totalCount,    // 总页数
              rows: result.content         // 数据
            }
          },
          columns: [
            {
              title: '操作',
              events: 'handle',
              align: 'center',
              valign: 'middle',
              formatter: function () {
                return `<a class="color_default" modify="true" path="/s/fullCutDetail" handle="true">详情</a>
                &nbsp;&nbsp;<a class="color_red" forbid="true" path="/s/fullCutModify" handle="true">修改</a>`
              }
            },
            {
              field: 'fullCutNo',
              title: '编号',
              align: 'center',
              valign: 'middle'
            },
            // {
            //   field: 'creatorType',
            //   title: '生成者',
            //   align: 'center',
            //   valign: 'middle',
            //   formatter: function (x, y) {
            //     return y.creatorType === 1 ? '平台' : y.creatorType === 2 ? '商家' : ''
            //   }
            // },
            {
              field: 'fullCutName',
              title: '名称',
              align: 'center',
              valign: 'middle'
            },
            {
              field: 'totalNum',
              title: '数量',
              align: 'center',
              valign: 'middle',
              formatter: function (x, y) {
                return y.totalNum == null ? '无限制' : y.totalNum == 0 ? '无限制' : y.totalNum
              }
            },
            {
              field: 'status',
              title: '状态',
              align: 'center',
              valign: 'middle',
              formatter: function (x, y) {
                return y.status === 1 ? '未生效' : y.status === 2 ? '已生效' : y.status === 3 ? '已失效' : ''
              }
            },
            {
              field: 'isUse',
              title: '使用情况',
              align: 'center',
              valign: 'middle'
            },
            {
              field: 'createTime',
              title: '生成时间',
              align: 'center',
              valign: 'middle',
              width: 100
            }
          ]
        })
      },
      // 在表格上操作订单
      handle_td_click (toggle, row, event) {
        // let that = this
        sessionStorage.setItem('full_cut_id', row.fullCutId)
        this.goto(event)
        // let array = []
        // array.push(row.fullCutId)
        // sessionStorage.setItem('Array', JSON.stringify(array))
      }
    },
    mounted () {
      let that = this
      that.getFullCutList()
      window.handle = {
        'click [handle]': function (event, value, row, index) {
          sessionStorage.setItem('full_cut_id', row.fullCutId)
          that.handle_td_click('search', row, event)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.search{
  min-height: 180px;
  margin: 10px 30px 0 30px;
  padding:30px 26px ;
  background-color: #fff;
  .search_cell{
    margin-top:0;
    margin-bottom: 14px;
    // color:red;
  }
  .button{
    border-radius: 0;
    min-width: 130px;
    height: 34px;
    color: white;
    margin:10px  20px 0 0;
    padding: 0 5px;
  }
}

.modal-open{
  #handle{display:flex}
  #handle.in{z-index:2000}
}

 .btn_table:link,.btn_table:visited,.btn_table:hover,.btn_table:active{color:white !important}
  .btn_table{height:26px !important;line-height:26px !important;padding-top:0 !important;padding-bottom:0 !important;}
  .m{padding-top:140px}
  // 搜索框的样式
  .search{
    /*
    search_input:正常的input框/select框
    search_input_date_l:左侧日期选择框
    search_input_date_r:右侧日期选择框
    */
    margin-left:30px;min-width:500px;
    span:first-child{margin-right:10px}
    .search_cell{display:inline-block;margin-top:10px;margin-right:30px;}
    .search_input{display:inline-block;vertical-align:middle;border-radius:0;width:130px;}
    .search_input_date_l{width:160px;margin-right:5px}
    .search_input_date_r{width:160px;margin-left:5px}
    .search_button{border-radius:0;padding-left:20px;padding-right:20px;background-color:#60AEF6;width:130px;height:34px;color:white}
    .area_select{width:90px;display:inline-block;vertical-align:middle;border-radius:0;margin-right:5px;}
    .search_input,.search_button,.area_select{height:26px;line-height:26px;padding-top:0;padding-bottom:0;}
  }
  
</style>