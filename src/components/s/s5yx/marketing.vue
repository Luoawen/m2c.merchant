<template>
  <div class="content clear">
    <div class="searchWarp search" >
      <el-row :gutter="20" >  
        <el-col :span='3' >
          <el-select v-model="search_params.status">
            <el-option v-for="item in statuses" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>  
         <el-col :span='3' >
          <el-select v-model="search_params.full_cut_type">
            <el-option v-for="item in fullCtuType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        </el-col>
        <el-col :span='3' >
            <el-select v-model="search_params.use_type">
               <el-option v-for="item in useType " :key="item.value" :label="item.label" :value="item.value"></el-option>
           </el-select >
        </el-col>  
         <el-col :span='5' style="margin:7px 10px 0 0" >
            <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd"
            @change="timeCheck">
          </el-date-picker>
        </el-col> 
        <el-col :span='3'>
            <el-input v-model="search_params.full_cut_no" placeholder="满减编号"  @blur="formValidator(1)" ></el-input>
        </el-col>
        <el-col :span='3'>
            <el-input v-model="search_params.full_cut_name" placeholder="满减名称"  :maxlength="11"  ></el-input>
        </el-col>
      </el-row>
        <el-row width="50%"> 
           <el-col>
              <el-button type="primary" size="medium"  @click="goto($event,'/s/fullCut')"  path="/s/fullCut" >新增满减</el-button>  
              <el-button type="primary" size="medium" @click="resetSearchParams()">重置搜索条件</el-button>
              <el-button type="primary" size="medium" @click="getFullCutList()" class="btn-search">搜索</el-button>
           </el-col>
        </el-row>

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
                label="编号">
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
       <!-- 遮罩层s -->
    <div v-show="modalShadow" class="modal-backdrop fade in" style="z-index:1;"></div>
       <!-- 遮罩层e -->
      <!-- 确认删除框 -->
    <div class="delectSizeWrap" v-show="modalShadow">
      <div class="delectSizeCon">
        <p>请确认是否终止该活动</p>
        <button class="blueBtn" @click="delete_confirm()">确定</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button class="defultBtn" @click="deleteCancle()">取消</button>
        <a class="colseDelectBox" @click="deleteCancle()"><span><img
          src="../../../assets/images/ico_close.png" height="24" width="24"/></span></a>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        deleteRow:'',
        modalShadow:false,
        takeover:'',
        time:[],
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
        ,statuses:[{
          value: 0,
          label: '全部状态'
        },{
          value: 1,
          label: '未生效'
        }, {
          value: 2,
          label: '已生效'
        }, {
          value: 3,
          label: '已失效'
        }]
        ,fullCtuType:[{
          value: 0,
          label: '全部形式'
        },{
          value: 1,
          label: '减钱'
        }, {
          value: 2,
          label: '打折'
        }, {
          value: 3,
          label: '换购'
        }],
        useType:[{
          value: 0,
          label: '使用情况'
        },{
          value: 1,
          label: '正常'
        }, {
          value: 2,
          label: '无可用'
        }],
        isChangePage:false //搜索时是否是页码切换请求 以判断是否要重置页码
      }
    },
    methods: {
      deleteCancle(){
        let that =this
        that.modalShadow= false
      },
      delete_confirm(){
        let that =this
        that.modalShadow= false
              that.$.ajax({
                type: 'post',
                url: that.base +'m2c.market/fullcut/stop/' + that.deleteRow.fullCutId,
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

      },
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
        that.getFullCutList()
      }
      ,goodsStoreHandleCurrentChange(val) {
        let that = this
        that.goodsStoreCurrentPage=val
         that.isChangePage = true
        that.getFullCutList()
      },
        handleCommand (index,row,action,to) {
        let that = this
        let fullCutId = row.fullCutId
          sessionStorage.setItem('full_cut_id', row.fullCutId)
        if (action === '_detail') {
          that.$router.push({name:'fullCutDetail'});
        } else if (action === '_modify') {
          that.$router.push({name:'fullCutModify'});
        } else if (action === '_forbid') {
           that.deleteGoods(row,to);
        }
      }
       ,deleteGoods (row,to){//终止
        let that = this
        sessionStorage.setItem('full_cut_id', row.fullCutId)
        // 弹框弹出
          that.modalShadow= true
          that.deleteRow = row
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
      goto ($event,path) {
        let that = this
        // console.log($event.target,"event.target")
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
        // 操作日期控件 恢复初始状态
        that.time=""
        that.getFullCutList()
      },
      // 获取满减列表
      getFullCutList () {
        let that = this
         if(!that.isChangePage){
          that.goodsStoreCurrentPage = 1
        }
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
            page_size: that.goodsStorePageRows,      // 每页多少条数据
            page_no: that.goodsStoreCurrentPage,    // 请求第几页
        },
        success: function (result) {
          console.log("my data",result)
          that.goodsStoreData = result.content
          that.goodsStoreTotalCount = result.totalCount
        }
      })
      that.isChangePage = false
      },
       
    },
    mounted () {
      let that = this
      that.getFullCutList()
    }
  }
</script>

<style lang="scss" scoped>
.delectSizeWrap {
    position: fixed;
    width: 380px;
    height: 280px;
    padding: 10px;
    border-radius: 10px;
    top: 40%;
    left: 50%;
    margin-left: -200px;
    background: #fff;
    z-index: 999;
      p {
      line-height: 200px;
      font-size: 18px;
      color: #333333;
      text-align: center;
    }
      .colseDelectBox {
    position: absolute;
    left: 335px;
    top: 25px;
    border-radius: 5px;
  }
    .blueBtn,
  .defultBtn {
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    border: none !important;
  }
  .blueBtn {
    background: #0086FF;
    border-radius: 2px;
    font-size: 14px;
    color: #FFFFFF;
    margin-left: 85px;
  }

  .defultBtn {
    background: #ccc;
    border: 1px solid #CCCCCC;
    font-size: 14px;
    border-radius: 4px;
    text-align: center;
    color: #fff;
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
    min-width:500px;
    .button{background-color: rgb(4, 136, 255);color:#fff;margin-left:10px}
    span:first-child{margin-right:10px}
    .search_cell{display:inline-block;margin-top:10px;margin-right:30px;}
    .search_button{border-radius:0;padding-left:20px;padding-right:20px;background-color:#60AEF6;width:130px;height:34px;color:white}
    .area_select{width:90px;display:inline-block;vertical-align:middle;border-radius:0;margin-right:5px;}
    .search_input,.search_button,.area_select{height:36px;line-height:36px;padding-top:0;padding-bottom:0;}
  }
  
</style>