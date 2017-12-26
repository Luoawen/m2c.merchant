<template>
  <div class="content clear">
    <div class="line"></div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="商品库" name="first">
        <div role="tabpanel" class="tab-pane fade in active" aria-labelledby="home-tab">
          <div class="searcWrap">
            <el-cascader expand-trigger="hover" :options="goodsClassifys" v-model="selectedOptions1" change-on-select placeholder="商品分类":props="goodsClassifyProps"></el-cascader>
            <el-select v-model="search_goods_params.goodsStatus" placeholder="请选择商品状态">
              <el-option v-for="item in goodsStatus" :key="item.value" :label="item.label" :value="item.value">
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
            <el-input v-model="search_goods_params.condition" placeholder="输入商品名称/编码/条形码/品牌" title="输入商品名称/编码/条形码/品牌"></el-input>
            <el-button type="primary" size="medium" @click="goodsStoreSearch()" class="btn-search">搜索</el-button>
            <div style="width:100px;position:relative; right:280px; top:7px" class = "fr">
              <el-button type="default" size="medium"    id="lotsOptionBtn" @click.stop='lotsOptionShow = !lotsOptionShow'> 批量操作 </el-button>
                <div v-show = 'lotsOptionShow' class='lotsOptionShowStyle'>
                  <ul class=" el-select-dropdown__list" id="lotsOptionselection">
                    <li class="el-select-dropdown__item" @click.stop='lotsOptionGoods(1)'>批量上架</li>
                    <li class="el-select-dropdown__item" @click.stop='lotsOptionGoods(2)'>批量下架</li>
                  </ul>
                </div>
            </div>
            <el-button type="primary" size="medium" @click="newGoods"  style='margin-top:6px;margin-left:4px'  class="fr">新增</el-button>
            <el-button type="primary" size="medium" icon="el-icon-download" @click.native="exportSearch()" class="fr">导出</el-button>
          </div>
          <div class="good_info" style="margin-top: 20px;">
            <el-table
              ref="multipleTable"
              :data="goodsStoreData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChangeGoods"
              >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="操作"
                width="120"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-col :span="12">
                    <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','a')">详情</el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.goodsStatus==1" @click.native="handleCommand(scope.$index, scope.row,'_soldup','a')">上架</el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.goodsStatus!=1" @click.native="handleCommand(scope.$index, scope.row,'_soldout','a')">下架</el-dropdown-item>
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_edit','a')">编辑
                          </el-dropdown-item>
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_delete','a')">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="商品信息"
                width="300">
                <template slot-scope="scope"><img v-bind:src="scope.row.goodsImageUrl" style="width: 60px;height: 60px;display:inline-block;float:left;"/>
                <a class="ellipsis2" :title="scope.row.goodsName">
                    {{scope.row.goodsName}}
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                prop="goodsClassify"
                label="分类">
              </el-table-column>
              <el-table-column
                prop="brandName"
                label="品牌"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="goodsPrice"
                label="拍货价/元"
                show-overflow-tooltip>
                <template slot-scope="scope"><span >{{scope.row.goodsPrice}}</span></template>
              </el-table-column>
              <el-table-column
                prop="stockNum"
                label="库存"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="sellNum"
                label="销量"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                label="状态"
                show-overflow-tooltip>
                <template slot-scope="scope"><span >{{scope.row.goodsStatus==1?'仓库中':scope.row.goodsStatus==2?'出售中':scope.row.goodsStatus==3?'已售罄':''}}</span></template>
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
      </el-tab-pane>
      <el-tab-pane label="商品审核" name="second">
        <div role="tabpanel" class="tab-pane fade in active"  aria-labelledby="home-tab">
          <div class="searchWrap">
            <el-cascader expand-trigger="hover" :options="goodsClassifys" v-model="selectedOptions2" change-on-select placeholder="商品分类":props="goodsClassifyProps"></el-cascader><!--商品分类-->
            <el-select v-model="search_goodsCheck_params.approveStatus" placeholder="请选择商品状态">
              <el-option v-for="item in approveStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select><!--商品状态-->
            <el-date-picker
              v-model="time"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd"
              @change="timeCheck">
            </el-date-picker><!--时间-->
            <el-input v-model="search_goodsCheck_params.condition" placeholder="输入商品名称/编码/条形码/品牌" title="输入商品名称/编码/条形码/品牌"></el-input>
            <el-button type="primary" size="medium" @click="goodsCheckStoreSearch()" class="btn-search">搜索</el-button>
          </div>
          <div class="good_info" style="margin-top: 20px;">
            <el-table
              ref="multipleTable"
              :data="goodsCheckStoreData"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                label="操作"
                width="120"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-col :span="12">
                    <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','b')">详情</el-dropdown-item>
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_edit','b')">编辑</el-dropdown-item>
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_delete','b')">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="商品信息"
                width="300">
                <template slot-scope="scope"><img :src="scope.row.goodsImageUrl" style="width: 60px;height: 60px;display:inline-block;float:left;"/>
                  <a class="ellipsis2" :title="scope.row.goodsName">
                    {{scope.row.goodsName}}
                    <!-- <div class="goodsName">
                      {{scope.row.goodsName}}
                    </div> -->
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                prop="goodsClassify"
                label="分类">
              </el-table-column>
              <el-table-column
                prop="brandName"
                label="品牌"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="goodsPrice"
                label="拍货价/元"
                show-overflow-tooltip>
                <template slot-scope="scope"><span >{{scope.row.goodsPrice}}</span></template>
              </el-table-column>
              <el-table-column
                prop="stockNum"
                label="库存"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.approveStatus==1?'审核中':scope.row.approveStatus==2?'审核不通过':''}}</span>
                  <div class="ico_msg" v-if="scope.row.approveStatus==2">
                    <div>{{scope.row.rejectReason}}</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="block fl" style="margin: 20px;">
              <el-pagination
                @size-change="goodsCheckStoreHandleSizeChange"
                @current-change="goodsCheckStoreHandleCurrentChange"
                :current-page="goodsCheckStoreCurrentPage"
                :page-sizes="[5, 10, 20, 30]"
                :page-size="goodsCheckStorePageRows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="goodsCheckStoreTotalCount">
              </el-pagination>
            </div>
          </div>
        </div>

      </el-tab-pane>
      <el-tab-pane label="已删商品" name="delete">
        <div class="searchWrap">
          <el-cascader expand-trigger="hover" :options="goodsClassifys" v-model="selectedOptions3" change-on-select placeholder="商品分类":props="goodsClassifyProps"></el-cascader><!--商品分类-->
          <el-input v-model="search_goodsCheck_params.condition" placeholder="输入商品名称/编码/条形码/品牌" title="输入商品名称/编码/条形码/品牌"></el-input>
          <el-button type="primary" size="medium" @click="goodsDeleteStore()" class="btn-search" >搜索</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="goodsDelStoreData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            label="操作"
            width="120"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-col :span="12">
                <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','c')">详情</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column
            label="商品信息"
            width="300">
            <template slot-scope="scope"><img :src="scope.row.goodsImageUrl" style="width: 60px;height: 60px;display:inline-block;float:left;"/>
              <a class="ellipsis2" :title="scope.row.goodsName">
                {{scope.row.goodsName}}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsClassify"
            label="分类">
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="品牌"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="goodsPrice"
            label="拍货价/元"
            show-overflow-tooltip>
            <template slot-scope="scope"><span >{{scope.row.goodsPrice}}</span></template>
          </el-table-column>
          <el-table-column
            prop="stockNum"
            label="库存"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="sellNum"
            label="销量"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div class="block" style="margin:20px;float:left">
          <el-pagination
            @size-change="goodsDelStoreHandleSizeChange"
            @current-change="goodsDelStoreHandleCurrentChange"
            :current-page="goodsDelStoreCurrentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="goodsDelStorePageRows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="goodsDelStoreTotalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 删除弹框 -->
    <div class="delectGoodBg" v-if="delectGoodBg"></div>
     <div class="delectGoodCon" v-if="delectGood" >
        <div class="agreetc_header">
          <span>提示</span>
          <span class="fr" @click="delectGoodHide()">X</span>
        </div>
      <div class="agreetc_body">{{delectCon}}</div>
      <div class="agreetc_footer">
        <button type="button" class="btn save" @click = "deleteConfirmFn()">确认</button>
        <button type="button" class="btn cancel" @click="delectGoodHide()">取消</button>
      </div>
    </div>
        <!--商品库批量上下架确认弹框 商品审核 同意上架商品 -->
    <div class="delectGoodBg" v-if="agreeGoodBg"></div>
    <div class="delectGoodWrap" v-if="agreeGoodBg">
      <div class="delectGoodCon" v-if="agreeGood" >
        <div class="agreetc_header">
           <span>提示</span>
          <span class="fr" style='cursor:pointer' @click="agreeGoodHide()">X</span>
        </div>
          <div class="agreetc_body" v-if="agreeTypeFlag===1? true:false">是否上架商品？</div>
          <div class="agreetc_body" v-if="agreeTypeFlag===2? true:false">是否下架商品？</div>
        <div class="agreetc_footer">
          <button type="button" class="btn save" @click = "agree_confirm()">确认</button>
          <button type="button" class="btn cancel" @click="agreeGoodHide()">取消</button>
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
        agreeTypeFlag:'',// 判断同意类型
        agreeGoodBg:false,// 弹层背景
        agreeGood: false,
        goodsIds:'',
        // approveIds:'',
        multipleSelectionGoods:[], // 商品库 存储checkbox选中的对象
        multipleSelection:[], // 商品审核 存储checkbox选中的对象
        lotsOptionShow: false, //批量操作下拉框显示
        lotsOptionShow:false,
        delete_paramsRow:[],
        delete_params_goodsTo:'',
        delectGoodBg: false, // 弹层背景
        delectGood: false, // 删除盒子
        time:'',
        goodsStorePageRows:10,
        goodsStoreCurrentPage: 1,
        goodsStoreTotalCount:0,
        goodsStatus:[{
          value: '',
          label: '商品状态'
        }, {
          value: '1',
          label: '仓库中'
        }, {
          value: '2',
          label: '出售中'
        }, {
          value: '3',
          label: '已售罄'
        }],
        goodsClassifys:[],
        goodsClassifyProps: {
          value: 'classifyId',
          children: 'subClassify',
          label:'classifyName',
        },
        search_goods_params: { goodsClassifyId: '', goodsStatus: '', condition: '', startTime: '', endTime: '' },
        activeName: this.$route.query.activeName==undefined?'first':this.$route.query.activeName,
        selectedOptions1: [''],
        selectedOptions2: [''],
        selectedOptions3: [''],
        goodsStoreData:[],
        goodsCheckStorePageRows:10,
        goodsCheckStoreCurrentPage: 1,
        goodsCheckStoreTotalCount:0,
        goodsCheckStoreData:[],
        approveStatus:[{
          value: '',
          label: '审核状态'
        }, {
          value: '1',
          label: '审核中'
        }, {
          value: '2',
          label: '审核不通过'
        }],
        search_goodsCheck_params: { goodsClassifyId: '', approveStatus: '', condition: '', startTime: '', endTime: '' },
        goodsDelStorePageRows:10,
        goodsDelStoreCurrentPage: 1,
        goodsDelStoreTotalCount:0,
        goodsDelStoreData:[],
        isChangePage:false,
        delectCon:''
      }
    },
    methods: {
         //商品库获取复选框选中对象
      handleSelectionChangeGoods(val) {
        this.multipleSelectionGoods = val;
         console.log('this.multipleSelectionGoods',this.multipleSelectionGoods)
      },
         //商品库 批量操作
      lotsOptionGoods(flag){
        let that = this
        if(that.multipleSelectionGoods.length<=0){
            that.$message({
            message:'请选择品牌',
            center: true,
            duration:1000,
            type:'info',
          });
        return;
        }
        that.goodsIds = that.multipleSelectionGoods.map(function(item){return item.goodsId}).toString()
        // 弹出确认弹层
         that.agreeGoodBg =true
         that.agreeGood = true
        if(flag === 1){
          that.agreeTypeFlag = 1
        }else{
          that.agreeTypeFlag = 2
        }
      },
      agree_confirm(){
        let that = this
        //商品库批量同意上下架 商品审核申请批量同意上架
          that.$.ajax({
            url: that.base +(that.agreeTypeFlag === 1 ?'m2c.scm/web/goods/up/shelfbatch?token=' : that.agreeTypeFlag === 2 ?'m2c.scm/web/goods/off/shelfbatch?token=':'')+sessionStorage.getItem('mToken')+'&goodsIds='+that.goodsIds,
            type:'PUT',
            data: {},
            success: function (result) {
              // 获取商品列表
            that.agreeTypeFlag = ''
            that.goodsStore()
            that.agreeGoodHide()
            }
          })
      },
      // 同意盒子隐藏
      agreeGoodHide () {
        let that = this
        that.agreeGood = false
        that.agreeGoodBg = false
      },
      deleteConfirmFn (){
        let that =this
        that.deleteGoods(that.delete_paramsRow,that.delete_params_goodsTo)
      },
      //时间赋值
      timeCheck () {
        let that = this
        if(that.time != null){
          if(that.activeName == 'first'){
            that.search_goods_params.startTime = that.time[0]
            that.search_goods_params.endTime = that.time[1]
          } else if(that.activeName == 'second'){
            that.search_goodsCheck_params.startTime = that.time[0]
            that.search_goodsCheck_params.endTime = that.time[1]
          }else {
            return false
          }
        }else{
          if(that.activeName == 'first'){
            that.search_goods_params.startTime = ''
            that.search_goods_params.endTime = ''
          } else if(that.activeName == 'second'){
            that.search_goodsCheck_params.startTime = ''
            that.search_goodsCheck_params.endTime = ''
          }else {
            return false
          }
        }
      },
      // 点击新增时校验店铺信息是否存在
      newGoods () {
        let that = this
        that.$.ajax({
          type: 'GET',
          url: that.localbase + 'm2c.scm/shop/sys/shopInfo',
          data: {
            dealerId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            if(result.content==""){
              that.show_tip("店铺信息不存在！")
            }else{
              that.$router.push({name:'goodAddModify',query:{isAdd:'add'}})
            }
          }
        })
      },
      goodsClassify () {//商品分类树
        let that = this
        that.$.ajax({
          type: 'GET',
          url: that.localbase + 'm2c.scm/web/goods/classify/tree',
          data: {parentClassifyId:-1},
          success: function (result) {
            that.goodsClassifys=result.content;
            //that.goodsClassifys.unshift({"parentClassifyId":'',"classifyId":'',"serviceRate":'',"classifyName":"全部" });
          }
        })
      }
      ,deleteGoods (row,to){//删除商品
        let that = this
        that.$.ajax({
          type: 'DELETE',
          url: to === 'a' ? that.localbase + 'm2c.scm/web/goods/' + row.goodsId:that.localbase + 'm2c.scm/web/goods/approve/' + row.goodsId,
          data: {},
          success: function (result) {
            if (result.status === 200){

              // 获取商品列表
              if(to === 'a'){
                that.goodsStore()
               that. delectGoodHide()
              } else if(to === 'b'){
                that.goodsCheckStore()
                that. delectGoodHide()
              }
            } else {
              alert('商品删除异常');
            }
          }
        })
      },
      soldupGoods (row,to){//上架商品
        let that = this
          that.$.ajax({
            type: 'put',
            url: that.localbase + 'm2c.scm/web/goods/up/shelf/' + row.goodsId,
            data: {},
            success: function (result) {
              if (result.status == 200){
                that.show_tip("操作成功")
                that.goodsStore()
              } else {
                that.show_tip('上架异常')
              }
            }
          })
      }
      ,soldGoods (row,to){//下架商品
        let that = this
        that.$.ajax({
          type: 'put',
          url: that.localbase + 'm2c.scm/web/goods/off/shelf/' + row.goodsId,
          data: {},
          success: function (result) {
            if (result.status == 200){
              // 获取商品列表
              if(to === 'a'){
                that.goodsStore()
              } else if(to === 'b'){
                that.goodsCheckStore()
              }
            } else {
              alert('下架异常')
            }
          }
        })
      }
      ,handleTabClick (tab, event) {//tab切换
        let that = this

        that.goodsStorePageRows=10
        that.goodsStoreCurrentPage= 1
        that.goodsStoreTotalCount=0
        that.goodsCheckStorePageRows=10,
        that.goodsCheckStoreCurrentPage= 1,
        that.goodsCheckStoreTotalCount=0,
        that.goodsDelStorePageRows=10,
        that.goodsDelStoreCurrentPage=1,
        that.goodsDelStoreTotalCount=0,

        that.selectedOptions1=['']
        that.selectedOptions2=['']
        that.selectedOptions3=['']
        that.search_goods_params.goodsClassifyId=''
        that.search_goods_params.goodsStatus=''
        that.search_goods_params.condition=''
        that.search_goods_params.startTime=''
        that.search_goods_params.endTime=''

        that.search_goodsCheck_params.goodsClassifyId=''
        that.search_goodsCheck_params.approveStatus=''
        that.search_goodsCheck_params.condition=''
        that.search_goodsCheck_params.startTime=''
        that.search_goodsCheck_params.endTime=''
        if (tab.paneName==='first'){
          that.goodsStore()//商品列表
        }else if (tab.paneName==='second'){
          that.goodsCheckStore()//商品审核列表
        }else if (tab.paneName==='delete'){
          that.goodsDeleteStore()//删除商品列表
        }
      }

      ,goodsStore () {
        let that = this
        if(!that.isChangePage){
          that.currentPage = 1
        }
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/web/goods',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            rows: that.goodsStorePageRows,                     // 每页多少条数据
            pageNum: that.goodsStoreCurrentPage,    // 请求第几页*/
            goodsClassifyId:that.selectedOptions1[that.selectedOptions1.length-1],
            goodsStatus:that.search_goods_params.goodsStatus,
            condition:that.search_goods_params.condition.replace(/\s+/g,""),
            startTime:that.search_goods_params.startTime,
            endTime:that.search_goods_params.endTime
          },
          success: function (result) {
            if (result.status === 200){
              // 获取商品列表
              that.goodsStoreData = result.content
              that.goodsStoreTotalCount = result.totalCount
            }
          }
        })
        that.isChangePage = false
      },
      goodsStoreSearch () {
        let that = this
        if (that.search_goods_params.startTime > that.search_goods_params.endTime) {
          that.show_tip('开始时间不能大于结束时间')
          return
        }
        that.goodsStore()
      }
      ,goodsStoreHandleSizeChange(val) {
        let that = this
        that.goodsStorePageRows=val
        that.goodsStore();
      }
      ,goodsStoreHandleCurrentChange(val) {
        let that = this
        that.goodsStoreCurrentPage=val
        that.isChangePage = true
        that.goodsStore();
      }
      ,exportSearch (){
        let that = this
        if (that.search_goods_params.startTime > that.search_goods_params.endTime) {
          that.show_tip('开始时间不能大于结束时间')
          return
        }
        let url=that.localbase + 'm2c.scm/web/goods/export?dealerId='+JSON.parse(sessionStorage.getItem('mUser')).dealerId+'&goodsClassifyId='+that.search_goods_params.goodsClassifyId+'&goodsStatus='+that.search_goods_params.goodsStatus+'&condition='+that.search_goods_params.condition+'&startTime='+that.search_goods_params.startTime+'&endTime='+that.search_goods_params.endTime;
        window.location.href=url
      }
      ,goodsCheckStore () {
        let that = this
         if(!that.isChangePage){
          that.currentPage = 1
        }
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/web/goods/approve',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            rows: that.goodsStorePageRows,                     // 每页多少条数据
            pageNum: that.goodsStoreCurrentPage,    // 请求第几页*/
            goodsClassifyId:that.selectedOptions2[that.selectedOptions2.length-1],
            approveStatus:that.search_goodsCheck_params.approveStatus,
            condition:that.search_goodsCheck_params.condition.replace(/\s+/g,""),
            startTime:that.search_goodsCheck_params.startTime,
            endTime:that.search_goodsCheck_params.endTime
          },
          success: function (result) {
            if (result.status === 200){
              // 获取商品列表
              that.goodsCheckStoreData = result.content
              that.goodsCheckStoreTotalCount = result.totalCount
            }
          }
        })
        that.isChangePage= false
      }
      ,goodsCheckStoreSearch (){
        let that = this
        if (that.search_goodsCheck_params.startTime > that.search_goodsCheck_params.endTime) {
          that.show_tip('开始时间不能大于结束时间')
          return
        }
        that.goodsCheckStore()
      }
      ,goodsCheckStoreHandleSizeChange(val) {
        let that = this
        that.goodsCheckStorePageRows=val
        that.goodsCheckStore();
      }
      ,goodsCheckStoreHandleCurrentChange(val) {
        let that = this
        that.goodsCheckStoreCurrentPage=val
        that.isChangePage = true;
        that.goodsCheckStore();
      }
      ,handleCommand (index,row,action,to) {
        let that = this
        if (action === '_detail') {
          let goodsId = row.goodsId
          if(to=='a'){
            that.$router.push({name:'gooddetail',query:{goodsId:row.goodsId,from:to}});
          }else if(to=='b'){
            let approveStatus = row.approveStatus
            that.$router.push({name:'gooddetail',query:{goodsId:goodsId,approveStatus:approveStatus,from:to}});
          }else{
            that.$router.push({name:'gooddetail',query:{goodsId:row.goodsId,from:to}});
          }
        } else if (action === '_soldout') {
          that.soldGoods(row,to)
        } else if (action === '_soldup') {
          that.soldupGoods(row,to)
        }
        else if (action === '_edit') {
          let goodsId = row.goodsId
          if(to=='a'){
            that.$router.push({name:'goodAddModify',query:{isAdd:'modify',goodsId:goodsId,from:to}});
          }else if(to=='b'){
            let approveStatus = row.approveStatus
            that.$router.push({name:'goodAddModify',query:{isAdd:'modify',goodsId:goodsId,approveStatus:approveStatus,from:to}});
          }
        } else if (action === '_delete') {
          if(to=='a'){
            that.delete_params_goodsTo= 'a'
            that.delectCon = "是否删除商品?"
          }else{
            that.delete_params_goodsTo= 'b'
            that.delectCon = "是否删除审核记录?"
          }
          that.delete_paramsRow=row
          that.delectGoodShow()
          // that.deleteGoods(row,to);
        }
      },
         // 删除盒子显示
      delectGoodShow () {
        let that = this
        that.delectGood = true
        that.delectGoodBg = true
      },
      // 删除盒子隐藏
      delectGoodHide () {
        let that = this
        that.delectGood = false
        that.delectGoodBg = false
      }
      ,goodsDeleteStore () {
        let that = this
         if(!that.isChangePage){
          that.currentPage = 1
        }
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/web/goods',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            rows: that.goodsDelStorePageRows,                     // 每页多少条数据
            pageNum: that.goodsDelStoreCurrentPage,    // 请求第几页*/
            condition:that.search_goodsCheck_params.condition.replace(/\s+/g,''),
            goodsClassifyId:that.selectedOptions3[that.selectedOptions3.length-1],
            delStatus:2,
          },
          success: function (result) {
            if (result.status === 200){
              // 获取商品列表
              that.goodsDelStoreData = result.content
              that.goodsDelStoreTotalCount = result.totalCount
            }
          }
        })
         that.isChangePage = false
      }
      ,goodsDelStoreHandleSizeChange(val) {
        let that = this
        that.goodsDelStorePageRows=val
        that.goodsDeleteStore();
      }
      ,goodsDelStoreHandleCurrentChange(val) {
        let that = this
        that.goodsDelStoreCurrentPage=val
        that.isChangePage =true;
        that.goodsDeleteStore();
      }
  },
    created() {
      // 点击到弹框外其他地方 弹框收起
      let body = document.querySelector('body')
      body.addEventListener('click',(e)=>{
      if(e.target.id === 'lotsOptionBtn' || e.target.id === 'lotsOptionBtnselection'){
          this.lotsOptionShow = true
      }else {
          this.lotsOptionShow = false
      }
      },false)
    },
    mounted () {
      let that = this
      if (that.$route.query.activeName == 'second') {
        that.goodsCheckStore()
      } else if (that.$route.query.activeName == 'delete'){
        that.goodsDeleteStore()
      } else{
        if(that.$route.query.goodsStatus===2){
          that.search_goods_params.goodsStatus = '2'
        }
        that.goodsStore()
      }
      that.goodsClassify()
    }
  }
</script>
<style lang="scss" scoped>
  .lotsOptionShowStyle {
    position:absolute;
    top:32px;
    z-index:2;
    border:1px solid transparent;
    border-radius:6px;
    li{
        background:#fff
    }
    li:hover{background:rgb(236, 245, 255) }
  }
  .ico_msg{
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(../../../assets/images/ico_msg.png);
    position:relative;
    div{display:none;width:150px;background:#fff;position: fixed;margin-top:20px;z-index:2;height:auto;
      padding:10px; margin-left:-120px;border:1px solid #ccc; border-radius:3px;box-shadow:0px 3px 3px #ccc;
    }
  }
  .ico_msg:hover div{
      display: inline-block;
    }
  .sz{
    width: 1620px;
    height: 880px;
    margin-left: 0px;
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
      position: relative;
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
      line-height: 68px;
      margin-left: 10px;
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


  /*详情*/
  #myTabContent{position:relative;}
  .goodInfo{position:absolute;top:0;left:0;width:100%;height:840px;padding-top:40px;background:#fff;z-index:99;}
  .goodInfo p,.goodInfo div,.goodInfo button{margin-left:40px;margin-top:20px;}
  .goodInfo div img{width:60px;height:60px; display:inline-block;}
  .goodInfo button{width:150px;height:50px;border:1px solid #ccc; text-align: center;}
  /*删除*/
  .delectGoodBg{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:999;}
  .delectGoodCon {
  width: 400px;
  height: 280px;
  background: #fff;
  z-index: 9999;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -180px;
  background: #FFFFFF;
  border-radius: 4px;
  .agreetc_header{
    width: 100%;
    height: 50px;
    background: #DFE9F6;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 16px;
    span {
      display: inline-block;
      line-height: 50px;
    }
  }
  .agreetc_body{
  padding-left: 20px;
  padding-right: 20px;
  background: #FFFFFF;
  margin-top: 10px;
  text-align: center;
  font-size: 20px;
  color: #333333;
  line-height: 150px;
}
.agreetc_footer{
  height: 80px;
  padding-top: 10px;
  padding-left: 50%;
  .btn {
    width: 80px;
    height: 30px;
    border: none;
    border-radius: 2px;
    color: #fff;
  }

  .save {
    margin-left: -110px;
    background: #0086FF;
  }
  .cancel {
    margin-left: 40px;
    background: #FFF;
    border: 1px solid #CCCCCC;
    color: #444;
  }
}
}
  .blueBtn,.defultBtn{background:rgb(96, 174, 246);width:80px;height:30px;border-radius:4px;text-align: center;color:#fff;}
  .defultBtn{background:#ccc;}
  /*修改/新增*/
  .changeGoodInfo input,.changeGoodInfo select{width:200px;line-height:40px;color:#666;}
  .glyphicon{width:40px;height:24px;z-index:11;}
  span.ellipsis{width:190px;margin-left:10px;overflow: hidden;display:inline-block;
text-overflow:ellipsis;
white-space: nowrap;}
  a.ellipsis2{
    width:180px;
    color:#5a5e66;
    margin-left:10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    position: relative;
    float: left;
  }
  a.ellipsis2:hover{ text-decoration:none;}

</style>
