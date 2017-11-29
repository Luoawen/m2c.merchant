<template>
  <div class="content clear">
    <div class="searchWarp search" >
           <div class="search_cell">
        <select data-v-0c409cb2="" class="form-control search_input"  v-model="search_params.status">
            <option data-v-0c409cb2="" value="0" >全部状态</option>
            <option data-v-0c409cb2="" value="1">未生效</option>
            <option data-v-0c409cb2="" value="2">已生效</option>
            <option data-v-0c409cb2="" value="3">已失效</option>
        </select>
      </div>
      <!-- <div class="search_cell"> -->
        <!-- <span>生成时间</span>
        <input type="date" class="form-control search_input search_input_date_l" v-model="search_params.start_time" :max="search_params.end_time">
        ~
        <input type="date" class="form-control search_input search_input_date_r" v-model="search_params.end_time" :min="search_params.start_time"> -->
      <!-- </div> -->
      <!-- <span @click="sevenDay()">最近7天</span> -->
      <!-- </br> -->
      <div class="search_cell">
        <select data-v-0c409cb2="" class="form-control search_input" v-model="search_params.full_cut_type">
            <option data-v-0c409cb2="" value="0">全部形式</option>
            <option data-v-0c409cb2="" value="1">减钱</option>
            <option data-v-0c409cb2="" value="2">打折</option>
            <option data-v-0c409cb2="" value="3">换购</option>
        </select>
      </div>
      <div class="search_cell">
        <select data-v-0c409cb2="" class="form-control search_input" v-model="search_params.use_type">
          <option data-v-0c409cb2="" value="0">使用情况</option>
          <option data-v-0c409cb2="" value="1">正常</option>
          <option data-v-0c409cb2="" value="2">无可用</option>
        </select>
      </div>
        <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" value-format="yyyy-MM-dd"
        @change="timeCheck">
      </el-date-picker>
       <div class="search_cell ">
        <input class="form-control search_input  " v-model="search_params.full_cut_no" placeholder="满减编号" @blur="formValidator(1)">
      </div>
      <div class="search_cell">
        <input class="form-control search_input" v-model="search_params.full_cut_name" placeholder="满减名称" maxlength="11">
      </div>
   <br/>
      <div class="search_cell">
       
        <el-button type="primary" size="medium"  @click="goto($event,'/s/fullCut')"  path="/s/fullCut" >新增满减</el-button>  
        <!-- <router-link  type="primary"   :to="{ path: '/s/fullCut' }">新增满减</router-link> -->
        <el-button type="primary" size="medium" @click="resetSearchParams()">重置搜索条件</el-button>
         <el-button type="primary" size="medium" @click="getFullCutList()" class="btn-search">搜索</el-button>
      </div>
    </div>
         <div class="good_info" style="margin-top: 20px;">
            <el-table
              ref="multipleTable"
              :data="goodsStoreData"
              tooltip-effect="dark"
              style="width: 100%;">
              <el-table-column    label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-col :span="24"  >
                      <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','a')">详情</el-dropdown-item>
                        <el-dropdown-item  v-if="scope.row.status<3" @click.native="handleCommand(scope.$index, scope.row,'_modify','a')">修改</el-dropdown-item>
                        <el-dropdown-item  style="color:red" v-if="scope.row.status<3" @click.native="handleCommand(scope.$index, scope.row,'_forbid','a')">终止</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
               prop="fullCutNo"
                label="编号"
                        >
              </el-table-column>
              <el-table-column
                prop="fullCutName"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="totalNum"
                label="数量"
                show-overflow-tooltip>
                 <template slot-scope="scope">
                   <span v-if='scope.row.totalNum ===0' >无限制</span>
                   <span v-else>{{scope.row.totalNum}}</span>
                 </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                show-overflow-tooltip>
                 <template slot-scope="scope"><span >{{scope.row.status==1?'未生效':scope.row.status==2?'已生效':scope.row.status==3?'已失效':''}}</span></template>
              </el-table-column>
              <el-table-column
                prop="isUse"
                label="使用情况"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="生成时间"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <div class="block fl" style="margin: 20px;">
                <el-pagination
                  @size-change="goodsStoreHandleSizeChange"
                  @current-change="goodsStoreHandleCurrentChange"
                  :current-page="goodsStoreCurrentPage"
                  :page-sizes="[5, 10, 20, 30]"
                  :page-size="goodsStorePageRows"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="goodsStoreTotalCount">
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
        time:'',
        goodsStoreData:[],
        goodsStorePageRows:10,
        goodsStoreCurrentPage: 1,
        goodsStoreTotalCount:0,
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
       goodsStoreHandleSizeChange(val) {
        let that = this
        that.goodsStorePageRows=val
        // that.goodsStore();
        that.getFullCutList()
      }
      ,goodsStoreHandleCurrentChange(val) {
        let that = this
        that.goodsStoreCurrentPage=val
        // that.goodsStore();
        that.getFullCutList()
      },
        handleCommand (index,row,action,to) {
        let that = this
        let fullCutId = row.fullCutId
          sessionStorage.setItem('full_cut_id', row.fullCutId)
        if (action === '_detail') {
          that.$router.push({name:'fullCutDetail'});
        } else if (action === '_modify') {
          // that.soldGoods(row,to)
          that.$router.push({name:'fullCutModify'});
        } else if (action === '_forbid') {
          // that.soldupGoods(row,to)
           that.deleteGoods(row,to);
        }
      }
       ,deleteGoods (row,to){//终止
        let that = this
        let target = event.target
        sessionStorage.setItem('full_cut_id', row.fullCutId)
          if (confirm('确定要终止该满减?')) {
              that.$.ajax({
                type: 'post',
                url: that.base +'m2c.market/fullcut/stop/' + row.fullCutId,
                data: {
                  // token: sessionStorage.getItem('mToken')
                  token:sessionStorage.getItem('access_token')
                },
                success: function (result) {
                  if (result.status == 200) {
                    console.log('status:', result.status)
                     that.show_tip("满减终止成功!")
                    that.getFullCutList()
                  } else {
                    that.show_tip("满减终止失败!")
                  }
                }
              })
            }
      },
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
      // sevenDay(){
      //   let that = this
      //   var date1 = new Date()
      //   that.search_params.end_time = that.formatDate(date1, 'yyyy-MM-dd')
      //   var date2 = new Date(date1)
      //   date2.setDate(date1.getDate() - 7)
      //   that.search_params.start_time = that.formatDate(date2, 'yyyy-MM-dd')
      // },
      goto ($event,path) {
        let that = this
        console.log(event.target,"event.target")
        // let path = event.target.getAttribute('path')
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
        //给的参数 含有creator 商家的id （只请求到该商家id的数据 ）
        that.search_params = {full_cut_no: '', full_cut_name: '', status: 0, start_time: '', end_time: '', full_cut_type: 0, creator_type: '2', use_type: 0,creator:JSON.parse(sessionStorage.getItem('mUser')).dealerId}
        //  操作日期控件 恢复状态
        that.time=""
        that.getFullCutList()
      },
      // 获取满减列表
      getFullCutList () {
        let that = this
        this.$("[data-toggle='popover']").popover('hide')
       that.$.ajax({
         type:'get',
         url: that.base + 'm2c.market/fullcut/page',
        data: {
            token: sessionStorage.getItem('access_token'),
            full_cut_no:that.search_params.full_cut_no,
            full_cut_name:that.search_params.full_cut_name,
            status:that.search_params.status,
            start_time:that.search_params.startTime,
            end_time:that.search_params.endTime,
            full_cut_type:that.search_params.full_cut_type,
            use_type:that.search_params.use_type,
            creator:that.search_params.creator,
            creator_type:2,
            isEncry: false,
            page_size: that.goodsStorePageRows,                     // 每页多少条数据
            page_no: that.goodsStoreCurrentPage,    // 请求第几页
        },
        success: function (result) {
          console.log("my data",result)
          that.goodsStoreData = result.content
          that.goodsStoreTotalCount = result.totalCount
        }
      })},
       
//         that.$('#table').bootstrapTable('destroy').bootstrapTable({
//           cache: false,
//           url: that.base + 'm2c.market/fullcut/page',
// //          url: 'http://localhost:8080/m2c.market/fullcut/page',
//           queryParams: function (params) {
//             return Object.assign({}, {
//               // token: sessionStorage.getItem('mToken'),
//               token: sessionStorage.getItem('access_token'),
//               isEncry: false,
//               page_size: params.limit,                     // 每页多少条数据
//               page_no: params.offset / params.limit + 1    // 请求第几页
//             }, that.search_params)
//           },
//           pagination: true,
//           pageNumber: 1,
//           pageSize: 10,
//           pageList: [5, 10, 20, 100, 200, 500],
//           striped: true,
//           queryParamsType: 'limit',
//           sidePagination: 'server',
//           contentType: 'application/x-www-form-urlencoded',
//           responseHandler: function (result) {
//             return {
//               total: result.totalCount,    // 总页数
//               rows: result.content         // 数据
//             }
//           },
      //     columns: [
      //       {
      //         title: '操作',
      //         events: 'handle',
      //         align: 'center',
      //         valign: 'middle',
      //         formatter: function (x,y) {
      //              if (y.status < 3) {
      //             return "<a class='color_default' modify='true' style='cursor:pointer;' path='/s/fullCutDetail' handle='true'>详情</a>&nbsp;&nbsp;" +
      //               "<a style='color:red;cursor:pointer;' forbid='true' handle='true'>终止</a>&nbsp;&nbsp;" +
      //               "<a class='color_default' style='cursor:pointer;' path='/s/fullCutModify' handle='true'>修改</a>"
      //           } else {
      //             return "<a class='color_default'  modify='true' style='cursor:pointer;' path='/s/fullCutDetail' handle='true'>详情</a>&nbsp;&nbsp;"
      //           }
      //         }
      //       },
      //       {
      //         field: 'fullCutNo',
      //         title: '编号',
      //         align: 'center',
      //         valign: 'middle'
      //       },
      //       {
      //         field: 'fullCutName',
      //         title: '名称',
      //         align: 'center',
      //         valign: 'middle'
      //       },
      //       {
      //         field: 'totalNum',
      //         title: '数量',
      //         align: 'center',
      //         valign: 'middle',
      //         formatter: function (x, y) {
      //           return y.totalNum == null ? '无限制' : y.totalNum == 0 ? '无限制' : y.totalNum
      //         }
      //       },
      //       {
      //         field: 'status',
      //         title: '状态',
      //         align: 'center',
      //         valign: 'middle',
      //         formatter: function (x, y) {
      //           return y.status === 1 ? '未生效' : y.status === 2 ? '已生效' : y.status === 3 ? '已失效' : ''
      //         }
      //       },
      //       {
      //         field: 'isUse',
      //         title: '使用情况',
      //         align: 'center',
      //         valign: 'middle'
      //       },
      //       {
      //         field: 'createTime',
      //         title: '生成时间',
      //         align: 'center',
      //         valign: 'middle',
      //         width: 100
      //       }
      //     ]
      //   })
      // },
      // 在表格上操作订单
    //   handle_td_click (toggle, row, event) {
    //     // let that = this
    //     sessionStorage.setItem('full_cut_id', row.fullCutId)
    //     this.goto(event)
    //       console.log('-row---',row)
    //     // let array = []
    //     // array.push(row.fullCutId)
    //     // sessionStorage.setItem('Array', JSON.stringify(array))
    //   }
    },
    mounted () {
      let that = this
      that.getFullCutList()
      // window.handle = {
      //   'click [handle]': function (event, value, row, index) {
      //     sessionStorage.setItem('full_cut_id', row.fullCutId)
      //     // that.handle_td_click('search', row, event)
      //          let target = event.target
      //     if (target.getAttribute('forbid')) { // 操作--终止
      //       if (confirm('确定要终止该满减?')) {
      //         that.$.ajax({
      //           type: 'post',
      //           url: that.base +'m2c.market/web/fullcut/stop/' + row.fullCutId,
      //           data: {},
      //           success: function (result) {
      //             if (result.status == 200) {
      //               console.log('status:', result.status)
      //                that.show_tip("满减终止成功!")
      //               that.getFullCutList()
      //             } else {
      //               that.show_tip("满减终止失败!")
      //             }
      //           }
      //         })
      //       }
      //     }
      //   }
      // }
    }
  }
</script>

<style lang="scss" scoped>
.modal-open{
  #handle{display:flex}
  #handle.in{z-index:2000}
}

 .btn_table:link,.btn_table:visited,.btn_table:hover,.btn_table:active{color:white !important}
  .btn_table{height:26px !important;line-height:26px !important;padding-top:0 !important;padding-bottom:0 !important;}
  .m{padding-top:140px}
  // 搜索框的样式
  .search{
    min-width:500px;
    .button{background-color: rgb(4, 136, 255);color:#fff;margin-left:10px}
    span:first-child{margin-right:10px}
    .search_cell{display:inline-block;margin-top:10px;margin-right:30px;}
    .search_input{display:inline-block;vertical-align:middle;border-radius:5px;width:200px;height:36px}
    .search_input_date_l{width:160px;margin-right:5px}
    .search_input_date_r{width:160px;margin-left:5px}
    .search_button{border-radius:0;padding-left:20px;padding-right:20px;background-color:#60AEF6;width:130px;height:34px;color:white}
    .area_select{width:90px;display:inline-block;vertical-align:middle;border-radius:0;margin-right:5px;}
    .search_input,.search_button,.area_select{height:36px;line-height:36px;padding-top:0;padding-bottom:0;}
  }
  
</style>