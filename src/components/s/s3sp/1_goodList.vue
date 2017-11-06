<template>
  <div class="goods_block" style="background: #FFFFFF;padding-left: 20px;">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="商品库" name="first">
        <div role="tabpanel" class="tab-pane fade in active" aria-labelledby="home-tab">
          <div class="goods_search" style="width: 100%; height: 40px;">
            <div  style="float: left">
              商品分类:<el-cascader expand-trigger="hover" :options="goodsClassifys" v-model="selectedOptions1" change-on-select :props="goodsClassifyProps"></el-cascader>
            </div><!--商品分类-->
            <div style="float: left">
              商品状态:
              <el-select v-model="search_goods_params.goodsStatus" placeholder="请选择商品状态">
                <el-option v-for="item in goodsStatus" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div><!--商品状态-->
            <div class="ops_time" style="float:left;width: 540px;">时间选择:
              <el-date-picker  v-model="search_goods_params.startTime"   type="date"  placeholder="选择日期"   format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
              </el-date-picker>
              -
              <el-date-picker v-model="search_goods_params.endTime" type="date"  placeholder="选择日期"   format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
              </el-date-picker>
            </div><!--时间-->
            <div class="search" style="width: 400px;float: left">
              <el-input placeholder="输入商品名称 / 编码 / 条形码 / 品牌" v-model="search_goods_params.condition" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click.native="goodsStoreSearch()"></el-button>
              </el-input>
            </div>
            <div class="advanced" style="width: 50px;float: left;margin-left: 30px">
             <!-- <el-dropdown  @command="handleCommand">
                <el-button type="primary">
                  批量操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="putaway">批量上架</el-dropdown-item>
                  <el-dropdown-item command="soldout">批量下架</el-dropdown-item>
                  <el-dropdown-item command="delete">批量删除</el-dropdown-item>
                  <el-dropdown-item command="export">导出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>-->
              <el-button type="primary" icon="el-icon-download" @click.native="exportSearch()">导出</el-button>
            </div>
          </div>
          <div class="good_info" style="margin-top: 20px;">
            <el-table
              ref="multipleTable"
              :data="goodsStoreData"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="商品信息"
                width="300">
                <template slot-scope="scope"><img v-bind:src="scope.row.goodsImageUrl" style="width: 60px;height: 60px;"/><span class="ellipsis">{{scope.row.goodsName}}</span></template>
              </el-table-column>
              <el-table-column
                prop="goodsClassify"
                label="分类"
                width="200">
              </el-table-column>
              <el-table-column
                prop="brandName"
                label="品牌"
                width="200"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="goodsPrice"
                label="拍货价/元"
                show-overflow-tooltip>
                <template slot-scope="scope"><span >{{scope.row.goodsPrice/100}}</span></template>
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
                <template slot-scope="scope"><span >{{scope.row.goodsStatus==1?'仓库':scope.row.goodsStatus==2?'出售中':scope.row.goodsStatus==3?'已售罄':''}}</span></template>
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
            </el-table>
            <div class="block" style="margin: 20px;float: right">
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
          <div class="goods_search" style="width: 100%; height: 40px;">
            <div  style="float: left">
              商品分类:<el-cascader  :options="goodsClassifys" v-model="selectedOptions2"  change-on-select :props="goodsClassifyProps"></el-cascader>
            </div><!--商品分类-->
            <div style="float: left">
              商品状态:
             <el-select v-model="search_goodsCheck_params.approveStatus" placeholder="请选择商品状态">
                <el-option v-for="item in approveStatus" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
             </el-select>
            </div><!--商品状态-->
            <div class="ops_time" style="float:left;width: 540px;">时间选择:
             <el-date-picker  v-model="search_goodsCheck_params.startTime"   type="date"  placeholder="选择日期"   format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
              </el-date-picker>
              -
              <el-date-picker v-model="search_goodsCheck_params.endTime" type="date"  placeholder="选择日期"  format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
              </el-date-picker>
            </div><!--时间-->
            <div class="search" style="width: 400px;float: left">
             <el-input placeholder="输入商品名称 / 编码 / 条形码 / 品牌" v-model="search_goodsCheck_params.condition" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click.native="goodsCheckStoreSearch()"></el-button>
              </el-input>
            </div>
            <div class="advanced" style="width: 50px;float: left;margin-left: 30px"><!--<el-button round>批量操作</el-button>--></div>
          </div>
          <div class="good_info" style="margin-top: 20px;">
            <el-table
              ref="multipleTable"
              :data="goodsCheckStoreData"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="商品信息"
                width="200">
                <template slot-scope="scope"><img :src="scope.row.goodsImageUrl" style="width: 60px;height: 60px;"/><span >{{scope.row.goodsName}}</span></template>
              </el-table-column>
              <el-table-column
                prop="goodsClassify"
                label="分类"
                width="200">
              </el-table-column>
              <el-table-column
                prop="brandName"
                label="品牌"
                width="200"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="goodsPrice"
                label="拍货价/元"
                show-overflow-tooltip>
                <template slot-scope="scope"><span >{{scope.row.goodsPrice/100}}</span></template>
              </el-table-column>
              <el-table-column
                prop="stockNum"
                label="库存"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                label="状态"
                show-overflow-tooltip>
                <template slot-scope="scope"><span >{{scope.row.approveStatus==1?'审核中':scope.row.approveStatus==2?'审核不通过':''}}</span></template>
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
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','b')">详情</el-dropdown-item>
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_edit','b')">编辑</el-dropdown-item>
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_delete','b')">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </template>
              </el-table-column>
            </el-table>
            <div class="block" style="margin: 20px;float: right">
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
        <div class="goods_search" style="width: 100%; height: 40px;">
          <div  style="float: left">
            商品分类:<el-cascader  :options="goodsClassifys" v-model="selectedOptions2"  change-on-select :props="goodsClassifyProps"></el-cascader>
          </div><!--商品分类-->
          <div class="search" style="width: 400px;float: left">
            <el-input placeholder="输入商品名称 / 编码 / 条形码 / 品牌" v-model="search_goodsCheck_params.condition" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click.native="goodsDeleteStore()"></el-button>
            </el-input>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="goodsDelStoreData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="商品信息"
            width="200">
            <template slot-scope="scope"><img v-bind:src="scope.row.goodsImageUrl" style="width: 60px;height: 60px;"/><span >{{scope.row.goodsName}}</span></template>
          </el-table-column>
          <el-table-column
            prop="goodsClassify"
            label="分类"
            width="200">
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="品牌"
            width="200"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="goodsPrice"
            label="拍货价/元"
            show-overflow-tooltip>
            <template slot-scope="scope"><span >{{scope.row.goodsPrice/100}}</span></template>
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
            label="操作"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-col :span="12">
                <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','a')">详情</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin: 20px;float: right">
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
      <el-button type="primary" @click="newGoods">新增</el-button>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        goodsStorePageRows:5,
        goodsStoreCurrentPage: 1,
        goodsStoreTotalCount:0,
        goodsStatus:[{
          value: '',
          label: '全部'
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
        activeName: 'first',
        selectedOptions1: [''],
        selectedOptions2: [''],
        selectedOptions3: [''],
        goodsStoreData:[],
        goodsCheckStorePageRows:5,
        goodsCheckStoreCurrentPage: 1,
        goodsCheckStoreTotalCount:0,
        goodsCheckStoreData:[],
        approveStatus:[{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '审核中'
        }, {
          value: '2',
          label: '审核不通过'
        }],
        search_goodsCheck_params: { goodsClassifyId: '', approveStatus: '', condition: '', startTime: '', endTime: '' },
        goodsDelStorePageRows:5,
        goodsDelStoreCurrentPage: 1,
        goodsDelStoreTotalCount:0,
        goodsDelStoreData:[]
      }
    },
    methods: {
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
        url: that.localbase + 'm2c.scm/goods/classify/tree',
        data: {parentClassifyId:-1},
        success: function (result) {
          that.goodsClassifys=result.content;
          that.goodsClassifys.unshift({"parentClassifyId":'',"classifyId":'',"serviceRate":'',"classifyName":"全部" });
        }
      })
    }
      ,deleteGoods (row,to){//删除商品
        let that = this
        that.$.ajax({
          type: 'DELETE',
          url: to === 'a' ? that.localbase + 'm2c.scm/goods/' + row.goodsId:that.localbase + 'm2c.scm/goods/approve/' + row.goodsId,
          data: {},
          success: function (result) {
            if (result.status === 200){
              // 获取商品列表
              if(to === 'a'){
                that.goodsStore()
              } else if(to === 'b'){
                that.goodsCheckStore()
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
            url: that.localbase + 'm2c.scm/goods/up/shelf/' + row.goodsId,
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
          url: that.localbase + 'm2c.scm/goods/off/shelf/' + row.goodsId,
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

        that.goodsStorePageRows=5
        that.goodsStoreCurrentPage= 1
        that.goodsStoreTotalCount=0
        that.goodsCheckStorePageRows=5,
        that.goodsCheckStoreCurrentPage= 1,
        that.goodsCheckStoreTotalCount=0,
        that.goodsDelStorePageRows=5,
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
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/goods',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            rows: that.goodsStorePageRows,                     // 每页多少条数据
            pageNum: that.goodsStoreCurrentPage,    // 请求第几页*/
            goodsClassifyId:that.selectedOptions1[that.selectedOptions1.length-1],
            goodsStatus:that.search_goods_params.goodsStatus,
            condition:that.search_goods_params.condition,
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
        that.goodsStore();
      }
      ,exportSearch (){
        let that = this
        if (that.search_goods_params.startTime > that.search_goods_params.endTime) {
          that.show_tip('开始时间不能大于结束时间')
          return
        }
        let url=that.localbase + 'm2c.scm/goods/export?dealerId='+JSON.parse(sessionStorage.getItem('mUser')).dealerId+'&goodsClassifyId='+that.search_goods_params.goodsClassifyId+'&goodsStatus='+that.search_goods_params.goodsStatus+'&condition='+that.search_goods_params.condition+'&startTime='+that.search_goods_params.startTime+'&endTime='+that.search_goods_params.endTime;
        window.location.href=url
      }

      ,goodsCheckStore () {
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/goods/approve',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            rows: that.goodsStorePageRows,                     // 每页多少条数据
            pageNum: that.goodsStoreCurrentPage,    // 请求第几页*/
            goodsClassifyId:that.selectedOptions2[that.selectedOptions2.length-1],
            goodsStatus:that.search_goodsCheck_params.goodsStatus,
            condition:that.search_goodsCheck_params.condition,
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
        that.goodsCheckStore();
      }
      ,handleCommand (index,row,action,to) {
        let that = this
        if (action === '_detail') {
          let goodsId = row.goodsId
          if(to=='a'){
            that.$router.push({name:'gooddetail',query:{goodsId:row.goodsId}});
          }else{
            let approveStatus = row.approveStatus
            that.$router.push({name:'gooddetail',query:{goodsId:goodsId,approveStatus:approveStatus}});
          }
        } else if (action === '_soldout') {
          that.soldGoods(row,to)
        } else if (action === '_soldup') {
          that.soldupGoods(row,to)
        }
        else if (action === '_edit') {
          let goodsId = row.goodsId
          if(row.approveStatus==''||row.approveStatus==undefined){
            that.$router.push({name:'goodAddModify',query:{isAdd:'modify',goodsId:goodsId}});
          }else{
            let approveStatus = row.approveStatus
            that.$router.push({name:'goodAddModify',query:{isAdd:'modify',goodsId:goodsId,approveStatus:approveStatus}});
          }
        } else if (action === '_delete') {
          that.deleteGoods(row,to);
        }
      }
      ,goodsDeleteStore () {
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/goods',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            rows: that.goodsDelStorePageRows,                     // 每页多少条数据
            pageNum: that.goodsDelStoreCurrentPage,    // 请求第几页*/
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
      }
      ,goodsDelStoreHandleSizeChange(val) {
        let that = this
        that.goodsDelStorePageRows=val
        that.goodsDeleteStore();
      }
      ,goodsDelStoreHandleCurrentChange(val) {
        let that = this
        that.goodsDelStoreCurrentPage=val
        that.goodsDeleteStore();
      }
  },
    mounted () {
      let that = this
      that.goodsClassify()
      that.goodsStore()

    }
  }
</script>
<style lang="scss" scoped>

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
  .delectGoodBg{position:absolute;top:0;left:0;width:100%;height:880px;background:rgba(0,0,0,0.6);z-index:99;}
  .delectGoodWrap{position:absolute;width:380px;height:280px;padding:10px;border-radius:10px;top:50%;left:50%;margin-left:-200px;background:#fff;z-index:99;}
  .delectGoodWrap p{line-height:50px;}
  .blueBtn,.defultBtn{background:rgb(96, 174, 246);width:80px;height:30px;border-radius:4px;text-align: center;color:#fff;}
  .defultBtn{background:#ccc;}
  /*修改/新增*/
  .changeGoodInfo input,.changeGoodInfo select{width:200px;line-height:40px;color:#666;}
  .glyphicon{width:40px;height:24px;z-index:11;}
  span.ellipsis{width:190px;margin-left:10px;overflow: hidden;display:inline-block;
text-overflow:ellipsis;
white-space: nowrap;}
</style>
