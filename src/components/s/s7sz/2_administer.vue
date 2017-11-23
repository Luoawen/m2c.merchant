<template>
  <div class="content clear">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="品牌库" name="first">
        <div class="searchWrap">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd"
            @change="timeCheck">
          </el-date-picker>
          <el-input v-model="search_params.condition" placeholder="输入品牌名称"></el-input>
          <el-button type="primary" size="medium" @click="get_comment_info()">搜索</el-button>
          <el-button type="primary" size="medium" class="fr" @click="addGood()">新增</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="bindsList"
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
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','a')">详情</el-dropdown-item>
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_edit','a')">编辑
                      </el-dropdown-item>
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_delete','a')">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="品牌名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="申请时间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div class="block" style="margin:20px;float:left">
          <el-pagination
            @size-change="bindsSizeChange"
            @current-change="bindsCurrentChange"
            :current-page="bindsCurrentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="bindPageRows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="bindsTotalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="品牌审核" name="second">
        <div class="searchWrap">
          <el-select v-model="search_approve.approveStatus" placeholder="品牌状态">
            <el-option
              v-for="brandStatu in brandStatus"
              :key="brandStatu.value"
              :label="brandStatu.label"
              :value="brandStatu.value">
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
          <el-input v-model="search_approve.condition" placeholder="输入品牌名称"></el-input>
          <el-button type="primary" size="medium" @click="get_comment_info1()">搜索</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="bindsApproveList"
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
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_edit','b')">编辑
                      </el-dropdown-item>
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_delete','b')">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="品牌名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="申请时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="品牌状态"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span >{{scope.row.approveStatus==1?'审批中':scope.row.approveStatus==2?'审批不通过':''}}</span>
              <el-tooltip class="item" effect="dark" :content="scope.row.rejectReason" placement="bottom-start">
                <div class="ico_msg" v-if="scope.row.approveStatus==2"></div>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin:20px;float:left">
          <el-pagination
            @size-change="bindsApproveSizeChange"
            @current-change="bindsApproveCurrentChange"
            :current-page="bindsApproveCurrentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="bindApprovePageRows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="bindsApproveTotalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--详情-->
      <em class="bread" v-if="goodInfoShow">> 品牌详情</em>
      <div class="goodInfo" v-if="goodInfoShow">
        <p><span>品牌名称：</span>{{goodInfo.brandName==''?'--':goodInfo.brandName}}</p>
        <p><span>英文名称：</span>{{goodInfo.brandNameEn==''?'--':goodInfo.brandNameEn}}</p>
        <p><span>品牌区域：</span>
          <span v-if="goodInfo.firstAreaName=='' && goodInfo.twoAreaName=='' && goodInfo.threeAreaName==''">--</span>
          <span v-if="goodInfo.firstAreaName != '' || goodInfo.twoAreaName!='' || goodInfo.threeAreaName!=''">
          {{goodInfo.firstAreaName==''?'':goodInfo.firstAreaName}}
          {{goodInfo.twoAreaName=='' ? '': ','+ goodInfo.twoAreaName}}
          {{goodInfo.threeAreaName==''? '': ',' + goodInfo.threeAreaName}}</span>
        </p>
        <div><span>品牌LOGO：</span>
          <span v-if="goodInfo.brandLogo != ''"><img :src="goodInfo.brandLogo" /></span>
          <span v-if="goodInfo.brandLogo == ''">--</span>
        </div>
        <div v-show="isBrandApprove">
          <p class="goodInfop" v-show="goodInfo.rejectReason!==''"><span>拒绝原因：</span>{{goodInfo.rejectReason}}</p>
        </div>
        <button @click="goodInfoShow=!goodInfoShow">返回</button>
      </div>
      <!--删除-->
      <div class="delectGoodBg" v-if="delectGoodBg"></div>
      <div class="delectGoodWrap" v-if="delectGoodBg">
        <div class="delectGoodCon" v-if="delectGood" >
          <div class="agreetc_header">
            <span>提示</span>
            <span class="fr" @click="delectGoodHide()">X</span>
          </div>
          <div class="agreetc_body">是否删除品牌</div>
          <div class="agreetc_footer">
            <button type="button" class="btn save" @click = "delete_confirm()">确认</button>
            <button type="button" class="btn cancel" @click="delectGoodHide()">取消</button>
          </div>
        </div>

        <div class="delectGoodCon" v-if="delectApprove" >
          <div class="agreetc_header">
            <span>提示</span>
            <span class="fr" @click="delectApproveHide()">X</span>
          </div>
          <div class="agreetc_body">是否删除品牌审核</div>
          <div class="agreetc_footer">
            <button type="button" class="btn save" @click = "deleteApprove_confirm()">确认</button>
            <button type="button" class="btn cancel" @click="delectApproveHide()">取消</button>
          </div>
        </div>
      </div>
      <!--修改/新增-->
      <em class="bread" v-if="changeGoodShow && handle_toggle=='add'">> 新增品牌</em>
      <em class="bread" v-if="changeGoodShow && handle_toggle!='add'">> 修改品牌</em>
      <div class="goodInfo changeGoodInfo" v-if="changeGoodShow">
        <p><span style="color: red">*</span>品牌名称：<input type="text" v-model="add_modify_params.brandName"  maxlength="10" placeholder="1-10字符"/></p>
        <p>英文名称：<input type="text" v-model="add_modify_params.brandNameEn"  maxlength="20" placeholder="1-20字符"/></p>
        <div>品牌区域：
          <select id="country_select" v-model="add_modify_params.firstAreaCode">
            <option value=""></option>
            <option v-for="(cell,index) in country_all_search" :key="index" :value="cell.code">
              {{cell.name}}
            </option>
          </select>
          <select id="province_select" v-model="add_modify_params.twoAreaCode" v-if="province_show">
            <option value=""></option>
            <option v-for="(cell,index) in province_all_search" :key="index" :value="cell.code">
              {{cell.name}}
            </option>
          </select>
          <select id="city_select" v-model="add_modify_params.threeAreaCode" v-if="city_show">
            <option value=""></option>
            <option v-for="(cell,index) in city_all_search" :key="index" :value="cell.code">
              {{cell.name}}
            </option>
          </select>
        </div>
        <div>品牌LOGO：
          <input type="file" id="m11yhgl_img_input" style="display:none" @change="upload_img()">
                <div class="img_up">
                  <img width="60" height="60" v-show='imgshow' id="m11yhgl_img">
                </div>
                <span class="upload" onclick="document.querySelector('#m11yhgl_img_input').click()"><div style="color:#337ab7;cursor:pointer;display:inline;">点击上传(小于1M)</div></span>
        </div>
        <button @click="change_confirm()">保存</button>
        <button v-show="" @click="approve_confirm()">提交审核</button>
        <button @click="changeGoodShow=!changeGoodShow">返回</button>
      </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        time:'',
        activeName:'first',
        btnShow: true,
        bindPageRows:10,
        bindsCurrentPage: 1,
        bindsTotalCount:0,
        bindApprovePageRows:10,
        bindsApproveCurrentPage: 1,
        bindsApproveTotalCount:0,
        goodsDelStoreData:[],
        goodInfoShow: false, // 详情盒子
        delectGoodBg: false, // 弹层背景
        delectGood: false, // 删除盒子
        delectApprove: false, // 删除品牌审核
        changeGoodShow: false,
        bindsList:[],
        bindsApproveList:[],
        // 搜索参数
        search_params: {condition: '', startTime: '', endTime: ''},
        search_approve: {condition: '', startTime: '', endTime: '', approveStatus: ''},
        goodInfo: [],
        delete_params: {brandId: ''},
        deleteApproveId: '',
        change_params: {brandId: ''},
        brandStatus: [
          {value:'',label:'品牌状态'},{value:'1',label:'申请中'},{value:'2',label:'审核不通过'}
        ],
        // 上传图片后返回的地址
        imgshow: false,
        add_modify_params_imgurl: '',
        // 新增/修改的数据
        add_modify_params: {approveId: '', brandId: '', brandName: '', brandNameEn: '', firstAreaCode: '', twoAreaCode: '', threeAreaCode: '', firstAreaName: '', twoAreaName: '', threeAreaName: '', brandLogo: ''},
        // 控制新增/修改的参数
        handle_toggle: '',
        // 上传头像标识
        touxiang_change: false,
        // 所有的国家(供搜索使用)
        country_all_search: [],
        // 可选的省份(供搜索使用)
        province_all_search: [],
        // 所有的城市(供搜索使用)
        city_all_search: [],
        province_show: false,
        city_show: false,
        modifyLocal: '',
        isBrandApprove: false,
      }
    },
    watch: {
      // 查询时监控国家
      'add_modify_params.firstAreaCode': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.add_modify_params.twoAreaCode = ''
            return
          }
          if (code !== oldCode) {
            that.$.ajax({
              url: that.base + 'm2c.operate/address/getintel.web',
              data: {
                token: sessionStorage.getItem('mToken'),
                parentCode: code
              },
              success: function (result) {
                that.province_all_search = result.content
                if (result.content.length > 0) {
                  that.province_show = true
                  that.city_show = false
                }
              }
            })
          }
        },
        deep: true
      },
      // 查询时监控省份
      'add_modify_params.twoAreaCode': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.add_modify_params.threeAreaCode = ''
            return
          }
          if (code !== oldCode) {
            that.$.ajax({
              url: that.base + 'm2c.operate/address/getintel.web',
              data: {
                token: sessionStorage.getItem('mToken'),
                parentCode: code
              },
              success: function (result) {
                that.city_all_search = result.content
                if (result.content.length > 0) {
                  that.city_show = true
                }
              }
            })
          }
        },
        deep: true
      }
    },
    methods: {
      handleTabClick (tab, event) {//tab切换
        let that = this
        that.search_params = {condition: '', startTime: '', endTime: ''},
        that.search_approve = {condition: '', startTime: '', endTime: '', approveStatus: ''}
        that.time = ''
        if (tab.paneName==='first'){
          that.get_comment_info()//品牌库列表
        }else if (tab.paneName==='second'){
          that.get_comment_info1()//品牌审核列表
        }
      },
      //时间赋值
      timeCheck () {
        let that = this
        if(that.time != null){
          if(that.activeName=='first'){
            that.search_params.startTime = that.time[0]
            that.search_params.endTime = that.time[1]
          }else{
            that.search_approve.startTime = that.time[0]
            that.search_approve.endTime = that.time[1]
          }
        }else{
          if(that.activeName=='first'){
            that.search_params.startTime = ''
            that.search_params.endTime = ''
          }else{
            that.search_approve.startTime = ''
            that.search_approve.endTime = ''
          }
        }
      },
      bindsSizeChange(val) {
        let that = this
        that.bindPageRows=val
        that.get_comment_info();
      }
      ,bindsCurrentChange(val) {
        let that = this
        that.bindsCurrentPage=val
        that.get_comment_info();
      },
      bindsApproveSizeChange(val) {
        let that = this
        that.bindApprovePageRows=val
        that.get_comment_info1();
      }
      ,bindsApproveCurrentChange(val) {
        let that = this
        that.bindsApproveCurrentPage=val
        that.get_comment_info1();
      },
      handleCommand (index,row,action,to) {
        let that = this
        if (action === '_detail') {
          if(to=='a'){
            that.goodInfoShow = true
            that.$.ajax({
              url: that.localbase + 'm2c.scm/brand/' + row.brandId,
              success: function (result) {
                that.goodInfo = result.content
              }
            })
          }else{
            that.goodInfoShow = true
            that.$.ajax({
              url: that.localbase + 'm2c.scm/brand/approve/' + row.approveId,
              success: function (result) {
                that.goodInfo = result.content
                console.warn(that.goodInfo)
              }
            })
          }
        } else if (action === '_edit') {
          that.area()
          that.touxiang_change = false
          that.handle_toggle = 'modify'
          if (to == 'a') {
            that.changeGoodShow = true
            // let row = this.$('#table').bootstrapTable('getSelections')[0]
            that.$.ajax({
              url: that.localbase + 'm2c.scm/brand/' + row.brandId,
              success: function (result) {
                that.add_modify_params = result.content
                /* 初始化图片 */
                document.querySelector('#m11yhgl_img').src = result.content.brandLogo ? result.content.brandLogo : ''
                if (result.content.brandLogo && result.content.brandLogo != '') {
                  that.imgshow = true
                } else {
                  that.imgshow = false
                }
              }
            })
          } else {
            that.changeGoodShow = true
            // let row = this.$('#table').bootstrapTable('getSelections')[0]
            that.$.ajax({
              url: that.localbase + 'm2c.scm/brand/approve/' + row.approveId,
              success: function (result) {
                that.add_modify_params = result.content
                /* 初始化图片 */
                document.querySelector('#m11yhgl_img').src = result.content.brandLogo ? result.content.brandLogo : ''
                if (result.content.brandLogo && result.content.brandLogo != '') {
                  that.imgshow = true
                } else {
                  that.imgshow = false
                }
              }
            })
          }
        } else if (action === '_delete') {
          if(to=='a'){
            that.delete_params.brandId = row.brandId
            that.delectGoodShow()
          }else{
            that.deleteApproveId = row.approveId
            that.deleteApprove()
          }
        }
      },
      area () {
        let that = this
        // 获取省市区列表
        that.$.ajax({
          url: that.base + 'm2c.operate/address/getintel.web',
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.country_all_search = result.content
          }
        })
      },
      // 重置
      reset_add_modify_params_bind () {
        this.add_modify_params.brandId = ''
        this.add_modify_params.brandName = ''
        this.add_modify_params.brandNameEn = ''
        this.add_modify_params.firstAreaCode = ''
        this.add_modify_params.twoAreaCode = ''
        this.add_modify_params.threeAreaCode = ''
        this.add_modify_params.firstAreaName = ''
        this.add_modify_params.twoAreaName = ''
        this.add_modify_params.threeAreaName = ''
        this.add_modify_params.brandLogo = ''
      },
      // 新增
      addGood () {
        let that = this
        that.area()
        that.reset_add_modify_params_bind()
        that.province_show = false
        that.city_show = false
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/brand/approve/id',
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.add_modify_params.approveId = result.content
            that.changeGoodShow = true
            that.handle_toggle = 'add'
          }
        })
      },
      // 上传图片时获取本地地址
      getObjectURL (file) {
        let url = null
        if (window.createObjectURL !== undefined) { // basic
          url = window.createObjectURL(file)
        } else if (window.URL !== undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file)
        } else if (window.webkitURL !== undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file)
        }
        return url
      },
      // 上传图片
      upload_img () {
        let target = event.target
        let objUrl = this.getObjectURL(target.files[0])
        let size = target.files[0].size
        if (size >= 102400 * 10) this.show_tip('图片超过1M了哦')
        else {
          if (objUrl) {
            // this.img_url = objUrl
            this.imgshow = true
            document.querySelector('#m11yhgl_img').src = objUrl
            this.touxiang_change = true
          }
        }
      },
      // 新增/修改上传图片处理
      add_modify_imgStep (callback) {
        let that = this
        if (!that.touxiang_change) {
          callback()
        } else {
          let formData = new FormData()
          formData.append('img', document.querySelector('#m11yhgl_img_input').files[0])
          formData.append('token', sessionStorage.getItem('mToken'))
          formData.append('imgGroup', 4)
          that.$.ajax({
            type: 'post',
            url: that.localbase + 'm2c.support/img/upload',
            data: formData,
            processData: false,
            contentType: false,
            success: function (result) {
              result = JSON.parse(result)
              // document.querySelector('#m11yhgl_img').src = that.img_url
              if (result.errorMessage && result.errorMessage !== '') {
                that.show_tip(result.errorMessage)
                return
              }
              // console.log('上传图片成功,返回结果是: ', result)
              that.add_modify_params_imgurl = result.content.url
              // console.warn(that.add_modify_params_imgurl)
              callback()
            }
          })
        }
      },
      // 修改保存
      change_confirm () {
        let that = this
        if (that.add_modify_params.brandName === '') {
          that.show_tip('品牌名称不能为空')
          return
        }
        // that.reset_add_modify_params_bind()
        that.add_modify_imgStep(function () {
          // 根据国家的code获取省份名字
          {
            let select = document.querySelector('#country_select')
            let options = select.options
            let index = select.selectedIndex
            if (index === -1) {
              that.add_modify_params.firstAreaName = ''
            } else {
              that.add_modify_params.firstAreaName = options[index].text
            }
          }
          // 根据省份code获取城市名字
          {
            let select = document.querySelector('#province_select')
            if (select !== null) {
              let options = select.options
              let index = select.selectedIndex
              if (index === -1) {
                that.add_modify_params.twoAreaName = ''
              } else {
                that.add_modify_params.twoAreaName = options[index].text
              }
            }
          }
          // 根据城市code获取区域名字
          {
            let select = document.querySelector('#city_select')
            if (select !== null) {
              let options = select.options
              let index = select.selectedIndex
              if (index === -1) {
                that.add_modify_params.threeAreaName = ''
              } else {
                that.add_modify_params.threeAreaName = options[index].text
              }
            }
          }
          that.$.ajax({
            type: that.handle_toggle === 'add' ? 'post' : that.activeName == 'first' ? 'post' : 'put',
            url: that.handle_toggle === 'add' ? (that.localbase + 'm2c.scm/brand/approve') : that.activeName == 'first' ? that.localbase + 'm2c.scm/brand/approve/' + that.add_modify_params.brandId : that.localbase + 'm2c.scm/brand/approve/' + that.add_modify_params.approveId,
            // data: Object.assign({}, that.add_modify_params, that.touxiang_change ? {icon: that.add_modify_params_imgurl} : {}, {
            data: Object.assign({
              token: sessionStorage.getItem('mToken'),
              dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
              dealerName: JSON.parse(sessionStorage.getItem('mUser')).dealerName
            }, that.add_modify_params, that.touxiang_change ? {brandLogo: that.add_modify_params_imgurl} : {}),
            success: function (result) {
              if (result.status === '200' || result.status === 200) {
                that.get_comment_info1()
                that.changeGoodShow = false
              } else {
                that.show_tip(result.errorMessage)
                return
              }
            }
          })
        })
      },
      // 删除品牌审核弹层显示
      deleteApprove () {
        let that = this
        that.delectApprove = true
        that.delectGoodBg = true
      },
      // 删除品牌审核确认
      deleteApprove_confirm () {
        let that = this
        // that.reset_add_modify_params_bind()
        that.$.ajax({
          type: 'delete',
          url: that.localbase + 'm2c.scm/brand/approve/' + that.deleteApproveId,
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            if (result.status == 200) {
              that.show_tip('删除成功')
              that.delectApproveHide()
              that.get_comment_info1()
            } else {
              that.show_tip(result.errorMessage)
            }
          }
        })
      },
      // 删除确认
      delete_confirm () {
        let that = this
        // that.reset_add_modify_params_bind()
        that.$.ajax({
          type: 'delete',
          url: that.localbase + 'm2c.scm/brand/' + that.delete_params.brandId,
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            if(result.status ==  -1 || result == 200){
              tnat.show_tip('删除成功')
              that.delectGoodHide()
              that.get_comment_info()
            }else{
              that.show_tip(result.errorMessage)
              that.delectGoodHide()
              that.get_comment_info()
            }
          }
        })
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
      },
      // 删除品牌审核盒子隐藏
      delectApproveHide () {
        let that = this
        that.delectApprove = false
        that.delectGoodBg = false
      },

      // 获取商品库列表
      get_comment_info () {
        let that = this
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.scm/brand',
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            rows: that.bindPageRows,                     // 每页多少条数据
            pageNum: that.bindsCurrentPage,    // 请求第几页*/
            condition:that.search_params.condition.replace(/\s+/g,""),
            startTime:that.search_params.startTime,
            endTime:that.search_params.endTime
          },
          success: function (result) {
            if (result.status === 200){
              // 获取商品列表
              that.bindsList = result.content
              that.bindsTotalCount = result.totalCount
              console.log(that.bindsList)
            }
          }
        })
      },
      // 获取审核列表
      get_comment_info1 () {
        let that = this
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.scm/brand/approve',
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            rows: that.bindApprovePageRows,                     // 每页多少条数据
            pageNum: that.bindsApproveCurrentPage,    // 请求第几页*/
            condition:that.search_approve.condition.replace(/\s+/g,""),
            startTime:that.search_approve.startTime,
            endTime:that.search_approve.endTime,
            approveStatus:that.search_approve.approveStatus
          },
          success: function (result) {
            if (result.status === 200){
              // 获取商品列表
              that.bindsApproveList = result.content
              that.bindsApproveTotalCount = result.totalCount
              console.log(that.bindsApproveList)
            }
          }
        })
      }
    },
    mounted () {
      let that = this
      that.get_comment_info()
      that.modifyLocal = 1
      that.province_show = false
      that.city_show = false
      that.isBrandApprove = false
      that.rejectShow = false
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
        padding-left:10px;
        width: 380px;
        height: 39px;
        color: #666;
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
.nav-tabs{
  .active{
    border-bottom: 2px solid #0086FF;
    a{color:#0086FF;}
  }
  li{
    font-size: 16px;
    width: 129px;
    height: 50px;
    display: inline-block;
    text-align: center;
    line-height: 48px;
    a{
      line-height: 48px;
      display: inline-block;
       cursor: initial;
       background-color: initial;
       border: initial;
       border-bottom-color: initial;
      padding: initial;
      color:#444;
    }
    a:active,a:focus,a:hover{
      color: #0086FF;
      cursor: initial;
      background-color:initial;
      border: initial;
      border-bottom-color: initial;
    }
  }
}
.ico_msg{
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(../../../assets/images/ico_msg.png);
}
/*详情*/
#myTabContent{position:relative;}
em.bread{position:fixed; top:80px;left:367px;font-style:normal;color:#333;z-index:9999;}
.goodInfo{position:absolute;top:-50px;left:0;width:100%;height:840px;padding-top:40px;background:#fff;z-index:99;}
.goodInfo p,.goodInfo div,.goodInfo button{margin-left:80px;margin-top:20px;}
.goodInfo div img{width:60px;height:60px; display:inline-block;}
.goodInfo button{width:150px;height:50px;border:1px solid #ccc; text-align: center;}
.goodInfo .goodInfop
{
  width:300px;
  word-break:break-all;
}
.goodInfo .goodInfop span{
  margin-left: -80px; display:inline-block;width:80px;
}
/*删除*/
.delectGoodCon {
  width: 400px;
  height: 280px;
  background: #fff;
  z-index: 9999;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -180px;
  background: #FFFFFF;
  border-radius: 4px;
  .agreetc_header, .refuse_header {
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
}

.agreetc_header, .refuse_header {
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
.fr{
  float: right;
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
.agreetc_footer,.refuse_footer {
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
/*.delectGoodBg{position:absolute;top:0;left:0;width:100%;height:880px;background:rgba(0,0,0,0.6);z-index:99;}*/
/*.delectGoodWrap{position:absolute;width:380px;height:280px;padding:10px;border-radius:10px;top:50%;left:50%;margin-left:-200px;background:#fff;z-index:99;}*/
/*.delectGoodWrap p{line-height:50px;}*/
.blueBtn,.defultBtn{background:rgb(96, 174, 246);width:80px;height:30px;border-radius:4px;text-align: center;color:#fff;}
.defultBtn{background:#ccc;}
/*修改/新增*/
.changeGoodInfo input,.changeGoodInfo select{width:200px;line-height:40px;color:#666;}
.zIndex2{z-index:21;}
.sz .tab-content .tab-pane .search_cell .time{top:50px;left:14px;width:450px;}
.icon{width:40px;height:40px;z-index:11;display:inline-block;}
.timeIcon{background:url(../../../assets/images/ico_calendar@2x.png) no-repeat center bottom;background-size:19px 20px;}
.searchIcon{background:url(../../../assets/images/ico_search.png) no-repeat center center;background-size:20px 20px;}
.arrowsIcon{background:url(../../../assets/images/ico_arrows_default.png) no-repeat center center;background-size:20px 20px;
float: right;margin-top:20px;margin-right:10px;}
.rightIcon{background:url(../../../assets/images/ico_arrows_packup.png) no-repeat center center;background-size:20px 20px;
float: right;margin-top:-2px;width:20px;height:20px;}
</style>
