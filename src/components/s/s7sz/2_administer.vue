<template>
  <div class="bs-example bs-example-tabs sz" data-example-id="togglable-tabs">
    <ul id="myTabs" class="nav nav-tabs" role="tablist">
      <li role="presentation" class="active" @click="brandQuery()"><a href="#home" id="home-tab" role="tab" data-toggle="tab" aria-controls="home" aria-expanded="true">品牌库</a></li>
      <li role="presentation" @click="brandApproveQuery()"><a href="#profile" role="tab" id="profile-tab" data-toggle="tab" aria-controls="profile" >品牌审核</a></li>
      <button type="button" class="btn btn-info pull-right btn-lg" @click="addGood()">新增</button>
    </ul>
    <div id="myTabContent" class="tab-content">
      <div role="tabpanel" class="tab-pane fade in active" id="home" aria-labelledby="home-tab">
        <div class="search_cell">
          <span class="zIndex2" @click="is_Success=!is_Success">申请时间<i class="icon timeIcon"></i></span>
          <div class="time" v-if="is_Success">
            <el-date-picker v-model="search_params.startTime"   type="date"  placeholder="选择日期"   format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker v-model="search_params.endTime" type="date"  placeholder="选择日期"  format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </div>
        <div class="search">
          <input type="text" class="inp" placeholder="输入品牌名称" v-model="search_params.condition"><i class="icon searchIcon" @click="get_comment_info"></i>
        </div>

        <div class="comment_info">
          <table id="table" style="table-layout:fixed"></table>
        </div>
      </div>
      <div role="tabpanel" class="tab-pane fade" id="profile" aria-labelledby="profile-tab">
        <div class="dropdown">
          <div id="dLabel1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="sort">{{brandStatusName}}
            <span class="icon arrowsIcon"></span>
          </div>
          <ul class="dropdown-menu" aria-labelledby="dLabel1">
            <li @click="get_comment_info1(0)">全部<i class="icon rightIcon"></i></li>
            <li @click="get_comment_info1(1)">申请中<i class="icon rightIcon"></i></li>
            <li @click="get_comment_info1(2)">审核不通过<i class="icon rightIcon"></i></li>
          </ul>
        </div>
        <div class="search_cell">
          <span class="zIndex2" @click="is_Success2=!is_Success2">申请时间<i class="icon timeIcon"></i></span>
          <div class="time" v-if="is_Success2">
            <el-date-picker v-model="search_approve.startTime"   type="date"  placeholder="选择日期"   format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker v-model="search_approve.endTime" type="date"  placeholder="选择日期"  format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </div>
        <div class="search">
          <input type="text" class="inp" placeholder="输入品牌名称"  v-model="search_params.condition"><i class="icon searchIcon" @click="get_comment_info1(search_approve.approveStatus)"></i>
        </div>
        <div class="comment_info">
          <table id="table1" style="table-layout:fixed"></table>
        </div>
      </div>
      <!--详情-->
      <div class="goodInfo" v-if="goodInfoShow">
        <p><span>品牌名称：</span>{{goodInfo.brandName==''?'--':goodInfo.brandName}}</p>
        <p><span>英文名称：</span>{{goodInfo.brandNameEn==''?'--':goodInfo.brandNameEn}}</p>
        <p><span>品牌区域：</span>{{goodInfo.firstAreaName==''?'':goodInfo.firstAreaName}}
          {{goodInfo.twoAreaName=='' ? '': ','+ goodInfo.twoAreaName}}
          {{goodInfo.threeAreaName==''? '': ',' + goodInfo.threeAreaName}}</p>
        <div><span>品牌LOGO：</span>
          <img :src="goodInfo.brandLogo"/>
        </div>
        <div v-show="isBrandApprove">
          <p class="goodInfop" v-show="goodInfo.rejectReason!==''"><span>拒绝原因：</span>{{goodInfo.rejectReason}}</p>
        </div>
        <button @click="goodInfoShow=!goodInfoShow">返回</button>
      </div>
      <!--删除-->
      <div class="delectGoodBg" v-if="delectGoodBg"></div>
      <div class="delectGoodWrap" v-if="delectGoodBg">
      <div class="delectGoodCon" v-if="delectGood">
          <p>是否删除品牌</p>
          <button class="blueBtn" @click="delete_confirm()">确定</button>
          <button class="defultBtn" @click="delectGoodHide()">取消</button>
          <a class="colseDelectBox" @click="delectGoodHide()"></a>
        </div>
        <div class="delectGoodCon" v-if="delectApprove">
          <p>是否删除品牌审核</p>
          <button class="blueBtn" @click="deleteApprove_confirm()">确定</button>
          <button class="defultBtn" @click="delectApproveHide()">取消</button>
          <a class="colseDelectBox" @click="delectApproveHide()"></a>
        </div>
      </div>
      <!--修改/新增-->
      <div class="goodInfo changeGoodInfo" v-if="changeGoodShow">
        <p>品牌名称：<input type="text" v-model="add_modify_params.brandName" /></p>
        <p>英文名称：<input type="text" v-model="add_modify_params.brandNameEn" /></p>
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

  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        is_Success: false,
        is_Success2: false,
        btnShow: true,
        goodInfoShow: false, // 详情盒子
        delectGoodBg: false, // 弹层背景
        delectGood: false, // 删除盒子
        delectApprove: false, // 删除品牌审核
        changeGoodShow: false,
        // 搜索参数
        search_params: {condition: '', startTime: '', endTime: ''},
        search_approve: {condition: '', startTime: '', endTime: '', approveStatus: ''},
        goodInfo: [],
        delete_params: {brandId: ''},
        deleteApprove_params: {approveId: ''},
        change_params: {brandId: ''},
        pinpais: [
          {name: '品牌一', value: '1'},
          {name: '品牌一', value: '2'}
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
        brandStatusName: '品牌状态'
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
      brandQuery () {
        let that = this
        that.changeGoodShow = false
        that.goodInfoShow = false
        that.modifyLocal = 1
        that.get_comment_info()
        that.isBrandApprove = false
        that.search_params = []
      },
      brandApproveQuery () {
        let that = this
        that.changeGoodShow = false
        that.goodInfoShow = false
        that.modifyLocal = 2
        that.get_comment_info1()
        that.isBrandApprove = true
        that.search_params = []
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
  // 表格上点击修改
      modify_td_click (row) {
        let that = this
        new Promise(function (resolve, reject) {
          resolve()
        }).then(function () {
          let arr = {}
          for (let [key, value] of Object.entries(row)) {
            arr[key] = value
          }
          that.add_modify_params = arr
          that.handle_toggle = 'modify_status'
          that.imgshow = true
          that.touxiang_change = false
          // that.get_comment_info()
          // that.get_comment_info1()
          that.area()
        })
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
            type: that.handle_toggle === 'add' ? 'post' : (that.modifyLocal === 1 ? 'post' : 'put'),
            url: that.handle_toggle === 'add' ? (that.localbase + 'm2c.scm/brand/approve') : (that.modifyLocal === 1 ? (that.localbase + 'm2c.scm/brand/approve/' + that.add_modify_params.brandId) : that.localbase + 'm2c.scm/brand/approve/' + that.add_modify_params.approveId),
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
          url: that.localbase + 'm2c.scm/brand/approve/' + that.deleteApprove_params.approveId,
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.delectApproveHide()
            that.get_comment_info1()
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
            that.delectGoodHide()
            that.get_comment_info()
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
      // 表格上的按钮点击
      td_click (toggle, row, index) {
        let that = this
        // 品牌库上操作
        if (toggle === 'btnshow') {
          // console.warn(row)
          // let index = that.$('a.btnImg').index()
          that.$('.btnBox').eq(index).toggle()
          // console.log($(that).index().toggle())
        } else if (toggle === 'modify') { // 表格上点击详情
          that.$('.btnBox').hide()
          that.goodInfoShow = true
          that.$.ajax({
            url: that.localbase + 'm2c.scm/brand/' + row.brandId,
            success: function (result) {
              that.goodInfo = result.content
            }
          })
        } else if (toggle === 'delete') { // 表格上点击删除
          that.$('.btnBox').hide()
          that.delete_params = row
          that.delectGoodShow()
        } else if (toggle === 'modify_status') { // 表格上点击修改
          that.$('.btnBox').hide()
          that.changeGoodShow = true
          // let row = this.$('#table').bootstrapTable('getSelections')[0]
          that.$.ajax({
            url: that.localbase + 'm2c.scm/brand/' + row.brandId,
            success: function (result) {
              that.add_modify_params = result.content
              /* 初始化图片 */
              document.querySelector('#m11yhgl_img').src = result.content.brandLogo ? result.content.brandLogo : ''
            }
          })
          that.modify_td_click(that.add_modify_params)
        } else if (toggle === 'btnshow1') { // 品牌审核上的操作
          // console.warn(row)
          // let index = that.$('a.btnImg').index()
          that.$('.btnBox1').eq(index).toggle()
          // console.log($(that).index().toggle())
        } else if (toggle === 'handleInfo') { // 表格上点击详情
          that.$('.btnBox1').hide()
          that.goodInfoShow = true
          that.$.ajax({
            url: that.localbase + 'm2c.scm/brand/approve/' + row.approveId,
            success: function (result) {
              that.goodInfo = result.content
              console.warn(that.goodInfo)
            }
          })
        } else if (toggle === 'deleteApprove') { // 表格上点击删除
          that.$('.btnBox1').hide()
          that.deleteApprove_params = row
          console.warn(that.deleteApprove_params)
          that.deleteApprove()
        } else if (toggle === 'modifyApprove') { // 表格上点击修改
          that.$('.btnBox1').hide()
          that.changeGoodShow = true
          // let row = this.$('#table').bootstrapTable('getSelections')[0]
          that.$.ajax({
            url: that.localbase + 'm2c.scm/brand/approve/' + row.approveId,
            success: function (result) {
              that.add_modify_params = result.content
              /* 初始化图片 */
              document.querySelector('#m11yhgl_img').src = result.content.brandLogo ? result.content.brandLogo : ''
            }
          })
          that.modify_td_click(that.add_modify_params)
        }
      },
      // 获取商品库列表
      get_comment_info () {
        let that = this
        that.is_Success = false
        this.$("[data-toggle='popover']").popover('hide')
        that.$('#table').bootstrapTable('destroy').bootstrapTable({
          cache: false,
          url: that.localbase + 'm2c.scm/brand',
          queryParams: function (params) {
            return Object.assign({}, {
              token: sessionStorage.getItem('mToken'),
              dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId, // 商户ID
              rows: params.limit,                          // 每页多少条数据
              pageNum: params.offset / params.limit + 1    // 请求第几页
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
            field: 'brandName',
            title: '品牌名称',
            align: 'center',
            valign: 'middle'
          }, {
            field: 'createTime',
            title: '申请时间',
            align: 'center',
            valign: 'middle'
          }, {
            title: '操作',
            align: 'center',
            valign: 'middle',
            events: 'handle',
            formatter: function (x, y) {
              return `
              <div class="btnWrap">
                <a class="btnImg" btnshow=true handle=true></a>
                <div class="btnBox">
                  <a class="color_default" modify=true handle=true>详情</a><a class="color_green" modify_status=true handle=true>编辑</a><a class="color_red" delete=true handle=true>删除</a>
                </div>
              </div>
              `
            }
          }]
        })
      },
      // 获取审核列表
      get_comment_info1 (n) {
        let that = this
        that.is_Success2 = false
        if (n === '' || n === undefined) {
          that.brandStatusName = '品牌状态'
        } else if (n === 0) {
          that.brandStatusName = '全部'
        } else if (n === 1) {
          that.brandStatusName = '申请中'
        } else {
          that.brandStatusName = '审批不通过'
        }
        that.search_approve.approveStatus = n === 0 ? '' : n
        this.$("[data-toggle='popover']").popover('hide')
        that.$('#table1').bootstrapTable('destroy').bootstrapTable({
          cache: false,
          url: that.localbase + 'm2c.scm/brand/approve',
          queryParams: function (params) {
            return Object.assign({}, {
              token: sessionStorage.getItem('mToken'),
              dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId, // 商户ID
              rows: params.limit,                          // 每页多少条数据
              pageNum: params.offset / params.limit + 1    // 请求第几页
            }, that.search_approve)
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
            field: 'brandName',
            title: '品牌名称',
            align: 'center',
            valign: 'middle'
          }, {
            field: 'createTime',
            title: '申请时间',
            align: 'center',
            valign: 'middle'
          }, {
            title: '品牌状态',
            align: 'center',
            valign: 'middle',
            formatter: function (x, y) {
              return y.approveStatus === 1 ? '审批中' : `
              <div class="color_default">审批不通过
                <i class="ico_msg">
                <div class="ico-tit">` + y.rejectReason + `</div>
              </i>

              </div>
              `
            }
          }, {
            title: '操作',
            align: 'center',
            valign: 'middle',
            events: 'handle',
            formatter: function (x, y) {
              return `
              <div class="btnWrap">
                <a class="btnImg" btnshow1=true handle=true></a>
                <div class="btnBox1">
                  <a class="color_default" handleInfo=true handle=true>详情</a><a class="color_green" modifyApprove=true handle=true>编辑</a><a class="color_red" deleteApprove=true handle=true>删除</a>
                </div>
              </div>
              `
            }
          }]
        })
      },
      timeBox () {
        this.is_Success = true
      }
    },
    mounted () {
      let that = this
      window.handle = {
        'click [handle]': function (event, value, row, index) {
          let target = event.target
          let toggle = target.getAttribute('btnshow') ? 'btnshow' : target.getAttribute('modify') ? 'modify' : target.getAttribute('delete') ? 'delete' : target.getAttribute('modify_status') ? 'modify_status' : target.getAttribute('btnshow1') ? 'btnshow1' : target.getAttribute('handleInfo') ? 'handleInfo' : target.getAttribute('deleteApprove') ? 'deleteApprove' : target.getAttribute('modifyApprove') ? 'modifyApprove' : ''
          that.td_click(toggle, row, index)
        }
      }
      that.get_comment_info()
      that.modifyLocal = 1
      that.province_show = false
      that.city_show = false
      that.isBrandApprove = false
      that.rejectShow = false
      that.brandStatusName = '品牌状态'
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
.ico_msg{
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(../../../assets/images/ico_msg.png);
}
/*详情*/
#myTabContent{position:relative;}
.goodInfo{position:absolute;top:0;left:0;width:100%;height:840px;padding-top:40px;background:#fff;z-index:99;}
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
.delectGoodBg{position:absolute;top:0;left:0;width:100%;height:880px;background:rgba(0,0,0,0.6);z-index:99;}
.delectGoodWrap{position:absolute;width:380px;height:280px;padding:10px;border-radius:10px;top:50%;left:50%;margin-left:-200px;background:#fff;z-index:99;}
.delectGoodWrap p{line-height:50px;}
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
