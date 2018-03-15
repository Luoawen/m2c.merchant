<template>
  <div class="sz content clear">
    <div class="line"></div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="售后地址" name="first">
          <el-row :gutter="20" >
            <el-col  :span="2" :offset="1"> <label style="color: red">*</label>售后地址</el-col>
            <el-col  :span="6" >  
              <select class="formControl area_select col-sm-1" v-model="search_params.province"
                          id="search_params_province_select" style="margin-bottom:5px;">
                  <option v-for="(cell,index) in province_all_search" :key="index" :value="cell.code">
                    {{cell.name}}
                  </option>
              </select>
              <select class="formControl area_select col-sm-1" v-model="search_params.city" id="search_params_city_select"
                          style="margin-bottom:5px;" v-if="city_show">
                  <option v-for="(cell,index) in city_all_search" :key="index" :value="cell.code">
                    {{cell.name}}
                  </option>
              </select>
              <select class="formControl area_select col-sm-1" v-model="search_params.regionCode"
                          id="search_params_regionCode_select" v-if="area_show">
                  <option v-for="(cell,index) in area_all_search" :key="index" :value="cell.code">
                    {{cell.name}}
                  </option>
              </select>
            </el-col>
          </el-row>
          <div class="clear"></div>
          <el-row :gutter="20" style='margin-top:15px'>
            <el-col  :span="2" :offset="1">详细地址</el-col>
            <el-col  :span="6" >  
              <input type="text" class="formControl" id="input1" placeholder="1-50字符" v-model="search_params.detail" :maxlength="50">
            </el-col>
        </el-row>
        <div class="clear"></div>
          <el-row :gutter="20">
            <el-col  :span="2" :offset="1">联系人姓名</el-col>
            <el-col  :span="6" >  
              <input type="text" class="formControl" id="input2" placeholder="1-10字符" v-model="search_params.person" :maxlength="10">
            </el-col>
        </el-row>
        <div class="clear"></div>
        <el-row :gutter="20">
            <el-col  :span="2" :offset="1">联系电话</el-col>
            <el-col  :span="6" >  
                <input type="text" class="formControl" maxlength="11" id="input3" placeholder="请填写" v-model="search_params.tel">
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col  :span="1" :offset="3" style='margin-top:30px'>  
                <el-button type="primary" size="medium" @click="isAdd == true?add_address():modify_address()">保存
                    </el-button>
            </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="商品保障" name="second">
        <el-button type="primary" size="medium" @click="add()" v-if="dataList.length<10">新增</el-button>
        <el-table
          :data="dataList"
          style="margin:10px auto;">
          <el-table-column
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-col :span="12">
                <el-button v-if="scope.row.isDefault===0"
                  @click.native.prevent="handleCommand(scope.$index, scope.row,'_edit')"
                  type="text"
                  size="small">
                  编辑
                </el-button>
                <el-button v-if="scope.row.isDefault===0"
                  @click.native.prevent="handleCommand(scope.$index, scope.row,'_delete')"
                  type="text"
                  size="small">
                  删除
                </el-button>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column
            prop="guaranteeName"
            label="标题"
            width="260">
          </el-table-column>
          <el-table-column
            label="内容">
            <template slot-scope="scope">
              <a class="ellipsis" :title="scope.row.guaranteeDesc">{{ scope.row.guaranteeDesc}}</a>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--新增商品保障-->
    <div class="topBox" v-if="topBoxShow">
      <h4>新增商品保障<a class="close" @click="topBoxShow=!topBoxShow"></a></h4>
      <el-row :gutter="20">
        <el-col :span="3" class="alginRight"><i class="red">*</i>标题</el-col>
        <el-col :span="9">
          <el-input v-model="guarantee.guaranteeName" placeholder="输入标题" :maxlength="10"></el-input>
          <i class="red redTip" v-if="error1" style="padding-top:0;margin-top:-4px;position:absolute;">请输入标题</i>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" class="alginRight">内容</el-col>
        <el-col :span="9">
          <el-input
            type="textarea"
            placeholder="请输入内容" :maxlength="50"
            v-model="guarantee.guaranteeDesc">
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt20">
        <el-col :span="20" :offset="3">
          <el-button type="primary" size="medium" @click="save()">确定</el-button>
          <el-button size="medium" @click="clear()">取消</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 删除弹框 -->
    <div class="delectGoodBg" v-if="delectGoodBg"></div>
    <div class="delectGoodCon" v-if="delectGood">
      <div class="agreetc_header">
        <span>提示</span>
        <span class="fr" @click="delectGoodHide()">X</span>
      </div>
      <div class="agreetc_body">是否删除商品保障？</div>
      <div class="agreetc_footer">
        <button type="button" class="btn save" @click = "deleteConfirmFn()">确认</button>
        <button type="button" class="btn cancel" @click="delectGoodHide()">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
  import validatorUtils from '../../../commonutils/validatorUtils'
  export default {
    data () {
      return {
        dataList: [],//商品保障列表数据
        guarantee:{},//新增商品保障
        topBoxShow:false, //新增弹层
        handle_toggle: 'add', // 区别新增还是修改
        delectGood:false,
        delectGoodBg:false,
        error1:false, // 保存时未填写保障名 提示
        activeName:'first',
        guaranteeId:'', // 删除的id
        // 上送参数
        search_params: {
          province: '',
          proName: '',
          city: '',
          cityName: '',
          regionCode: '',
          areaName: '',
          addr: '',
          detail: '',
          person: '',
          tel: ''
        },
        // 所有的省份(供搜索使用)
        province_all_search: [],
        // 可选的城市(供搜索使用)
        city_all_search: [],
        // 所有的区(供搜索使用)
        area_all_search: [],
        // 售后id
        addressId: '',
        dealerId: JSON.parse(sessionStorage.getItem('mUser'))?JSON.parse(sessionStorage.getItem('mUser')).dealerId:'',
        city_show: false,
        area_show: false,
        isAdd: false,
        isModify: false
      }
    },
    created () {
    },
    watch: {
      // 查询时监控省份
      'search_params.province': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.city_show = false
            that.area_show = false
            return
          }
          if (code !== oldCode) {
            // // console.log('(查询)省份选择变化,新的省份code:' + code + ',旧的省份code:' + oldCode)
            that.$.ajax({
              url: that.base + 'm2c.support/regn/cits',
              data: {
                token: sessionStorage.getItem('mToken'),
                province: code
              },
              success: function (result) {
                // console.log('(查询)获得的市信息列表: ', result)
                that.city_all_search = result.content
                that.city_show = true
                that.area_show = false
                if (that.isModify === true) {
                  that.area_show = true
                  that.isModify = false
                }
              }
            })
          }
        },
        deep: true
      },
      // 查询时监控城市
      'search_params.city': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.area_show = false
            return
          }
          if (code !== oldCode) {
            // // console.log('(查询)城市选择变化,新的城市code:' + code + ',旧的城市code:' + oldCode)
            that.$.ajax({
              url: that.base + 'm2c.support/regn/areas',
              data: {
                token: sessionStorage.getItem('mToken'),
                city: code
              },
              success: function (result) {
                // console.log('(查询)获得的区域信息列表: ', result)
                that.area_all_search = result.content
                that.area_show = true
              }
            })
          }
        },
        deep: true
      }
    },
    methods: {
      //删除确认
      deleteConfirmFn (){
        let that =this
        that.$.ajax({
          type: 'DELETE',
          url: this.localbase + 'm2c.scm/web/goods/guarantee/del/'+that.guaranteeId,
          success: function (res) {
            if(res.status === 200){
              that.delectGoodHide()
              that.getGuarantee()
            }else{
              that.$message({
                type: 'warning',
                message: res.errorMessage
              })
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
      // 点击取消
      clear(){
        let that = this
        if(that.$route.query.goodsId!=undefined && that.$route.query.goodsId!=''){
          that.$router.push({name:'goodAddModify',query:{goodsId:that.$route.query.goodsId,fromPath:'guarantee',handle_toggle:that.$route.query.handle_toggle}})
        }else{
          that.guarantee = {}
          that.topBoxShow = false
          that.error1 = false
          that.$route.query.goodsId = ''
        }
      },
      // 点击保存
      save(){
        let that = this
        if(that.guarantee.guaranteeName==''||that.guarantee.guaranteeName==undefined){
          that.error1 = true
          return false
        }
        that.$.ajax({
          type: that.handle_toggle==='add'?'post':'put',
          url: that.handle_toggle==='add'? that.localbase + 'm2c.scm/web/goods/guarantee':that.localbase + 'm2c.scm/web/goods/guarantee/'+that.guarantee.guaranteeId,
          data:Object.assign({
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
          },that.guarantee),
          success: function (res) {
            if(res.status === 200){
              that.$message({
                type: 'success',
                message: '保存成功'
              })
              if(that.$route.query.goodsId!=undefined && that.$route.query.goodsId!=''){
                that.$router.push({name:'goodAddModify',query:{goodsId:that.$route.query.goodsId,fromPath:'guarantee',handle_toggle:that.$route.query.handle_toggle}})
              }else{
                that.getGuarantee()
                that.topBoxShow = false
                that.guarantee = {}
              }
            }else{
              that.$message({
                type: 'warning',
                message: res.errorMessage
              })
            }
          }
        })
      },
      // 新增保障
      add(){
        let that = this
        that.handle_toggle = 'add'
        that.topBoxShow = true
        that.$.ajax({
          type: 'get',
          url: this.localbase + 'm2c.scm/web/goods/guarantee/id',
          success: function (res) {
            that.guarantee.guaranteeId = res.content
            console.log(that.guarantee.guaranteeId)
          }
        })
      },//SPBZ7F4C2D096DF24854957508C1545B46A4
        //SPBZ7F4C2D096DF24854957508C1545B46A4
      // 保障列表按钮点击
      handleCommand (index,row,action) {
        let that = this
        if (action === '_edit') {
          that.topBoxShow = true
          that.guarantee.guaranteeId = row.guaranteeId
          that.guarantee.guaranteeName = row.guaranteeName
          that.guarantee.guaranteeDesc = row.guaranteeDesc
          that.handle_toggle = 'edit'
        }else if(action === '_delete'){
          that.guaranteeId = row.guaranteeId
          that.delectGoodShow()
        }
      },
      //tab切换
      handleTabClick (tab, event) {
        let that = this
        if(that.activeName=='second'){
          that.getGuarantee()
        }
      },
      // 获取商品保障列表
      getGuarantee(){
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.localbase + 'm2c.scm/web/goods/guarantee/list',
          data:{
            dealerId: JSON.parse(sessionStorage.getItem('mUser'))?JSON.parse(sessionStorage.getItem('mUser')).dealerId:'',
          },
          success: function (res) {
            that.dataList = res.content
          }
        })
      },
      // 重置
      reset_add_modify_params_bind () {
        let that = this
        that.search_params.province = ''
        that.search_params.city = ''
        that.search_params.regionCode = ''
        that.search_params.detail = ''
        that.search_params.person = ''
        that.search_params.tel = ''
        that.search_params.proName = ''
        that.search_params.cityName = ''
        that.search_params.areaName = ''
        that.city_show = false
        that.area_show = false
      },
      cancel () {
        let that = this
        if (that.isAdd === true) {
          that.reset_add_modify_params_bind()
        } else {
          that.find_address()
        }
      },
      // 获取id
      get_id () {
        const that = this
        that.$.ajax({
          type: 'get',
          url: this.localbase + 'm2c.scm/web/after/sale/address/id',
          success: function (res) {
            console.log('获取的id', res)
            that.addressId = res.content
          }
        })
      },
      // 查询地址
      find_address () {
        const that = this
        that.$.ajax({
          type: 'get',
          url: this.localbase + 'm2c.scm/web/after/sale/address',
          data: {
            dealerId: that.dealerId
          },
          success: function (res) {
            if (!res.content.addressId) {
              that.isAdd = true
              that.get_id()
            } else {
              that.dealerId = res.content.dealerId
              that.addressId = res.content.addressId
              that.search_params.province = res.content.proCode
              that.search_params.city = res.content.cityCode
              that.search_params.regionCode = res.content.areaCode
              that.search_params.detail = res.content.address
              that.search_params.person = res.content.contactName
              that.search_params.tel = res.content.contactNumber
              that.search_params.proName = res.content.proName
              that.search_params.cityName = res.content.cityName
              that.search_params.areaName = res.content.areaName
              that.city_show = true
              that.area_show = true
              that.isModify = true
            }
          }
        })
      },
      // 添加地址
      add_address () {
        const that = this
        that.city_show = false
        that.area_show = false
        // 根据省份的code获取省份名字
        {
          let select = document.querySelector('#search_params_province_select')
          if (select !== null) {
            let options = select.options
            let index = select.selectedIndex
            if (index === -1) {
              that.search_params.proName = ''
            } else {
              that.search_params.proName = options[index].text
            }
          }
        }
        // 根据城市code获取城市名字
        {
          let select = document.querySelector('#search_params_city_select')
          if (select !== null) {
            let options = select.options
            let index = select.selectedIndex
            if (index === -1) {
              that.search_params.cityName = ''
            } else {
              that.search_params.cityName = options[index].text
            }
          }
        }
        // 根据区域code获取区域名字
        {
          let select = document.querySelector('#search_params_regionCode_select')
          if (select !== null) {
            let options = select.options
            let index = select.selectedIndex
            if (index === -1) {
              that.search_params.areaName = ''
            } else {
              that.search_params.areaName = options[index].text
            }
          }
        }
        if (!that.search_params.province) {
          that.show_tip('售后地址省市区不能为空')
          return
        }
        if (!that.search_params.city) {
          that.city_show = true
          that.show_tip('售后地址省市区不能为空')
          return
        }
        if (!that.search_params.regionCode) {
          that.city_show = true
          that.area_show = true
          that.show_tip('售后地址省市区不能为空')
          return
        }
        that.city_show = true
        that.area_show = true
        if (that.search_params.detail.trim().length > 50) {
          that.show_tip('详细地址长度在1-50字符以内')
          return
        }
        if (that.search_params.person.trim().length > 10) {
          that.show_tip('联系人姓名长度在1-10字符以内')
          return
        }
        if (that.search_params.tel.trim() != '') {
          if (!validatorUtils.isMobile(that.search_params.tel.trim()) && !validatorUtils.isTel(that.search_params.tel.trim())) {
            that.show_tip('请输入正确的联系电话')
            return
          }
        }
        that.$.ajax({
          type: 'post',
          url: this.localbase + 'm2c.scm/web/after/sale/address',
          data: {
            dealerId: JSON.parse(sessionStorage.getItem('mUser'))?JSON.parse(sessionStorage.getItem('mUser')).dealerId:'',
            addressId: that.addressId,
            proCode: that.search_params.province,
            proName: that.search_params.proName,
            cityCode: that.search_params.city,
            cityName: that.search_params.cityName,
            areaCode: that.search_params.regionCode,
            areaName: that.search_params.areaName,
            address: that.search_params.detail,
            contactName: that.search_params.person,
            contactNumber: that.search_params.tel
          },
          success: function (data) {
            that.show_tip('添加成功')
            that.find_address()
          }
        })
      },
      // 修改地址
      modify_address () {
        let that = this
        that.isModify = false
        that.city_show = true
        that.area_show = true
        // 根据省份的code获取省份名字
        {
          let select = document.querySelector('#search_params_province_select')
          if (select !== null) {
            let options = select.options
            let index = select.selectedIndex
            if (index === -1) {
              that.search_params.proName = ''
            } else {
              // console.log('所选省份名称: ', options[index].text)
              that.search_params.proName = options[index].text
            }
          }
        }
        // 根据城市code获取城市名字
        {
          let select = document.querySelector('#search_params_city_select')
          if (select !== null) {
            let options = select.options
            let index = select.selectedIndex
            if (index === -1) {
              that.search_params.cityName = ''
            } else {
              // console.log('所选城市名称: ', options[index].text)
              that.search_params.cityName = options[index].text
            }
          }
        }
        // 根据区域code获取区域名字
        {
          let select = document.querySelector('#search_params_regionCode_select')
          if (select !== null) {
            let options = select.options
            let index = select.selectedIndex
            if (index === -1) {
              that.search_params.areaName = ''
            } else {
              console.log('所选区域名称: ', options[index].text)
              that.search_params.areaName = options[index].text
            }
          }
        }
        if (!that.search_params.proName) {
          that.city_show = false
          that.area_show = false
          that.show_tip('售后地址省市区不能为空')
          return
        }
        if (!that.search_params.cityName) {
          that.area_show = false
          that.show_tip('售后地址省市区不能为空')
          return
        }
        if (!that.search_params.areaName) {
          that.show_tip('售后地址省市区不能为空')
          return
        }
        that.city_show = true
        that.area_show = true
        if (that.search_params.detail.trim().length > 50) {
          that.show_tip('详细地址长度在1-50字符以内')
          return
        }
        if (that.search_params.person.trim().length > 10) {
          that.show_tip('联系人姓名长度在1-10字符以内')
          return
        }
        if (that.search_params.tel.trim() != '') {
          if (!validatorUtils.isMobile(that.search_params.tel.trim()) && !validatorUtils.isTel(that.search_params.tel.trim())) {
            that.show_tip('请输入正确的联系电话')
            return
          }
        }
        that.$.ajax({
          type: 'put',
          url: this.localbase + 'm2c.scm/web/after/sale/address',
          data: {
            dealerId: JSON.parse(sessionStorage.getItem('mUser'))?JSON.parse(sessionStorage.getItem('mUser')).dealerId:'',
            addressId: that.addressId,
            proCode: that.search_params.province,
            proName: that.search_params.proName,
            cityCode: that.search_params.city,
            cityName: that.search_params.cityName,
            areaCode: that.search_params.regionCode,
            areaName: that.search_params.areaName,
            address: that.search_params.detail,
            contactName: that.search_params.person,
            contactNumber: that.search_params.tel
          },
          success: function (data) {
            that.show_tip('修改成功')
            that.find_address()
          }
        })
      }
    },
    mounted () {
      // console.log(JSON.parse(sessionStorage.getItem('mUser')).dealerId)
      let that = this
      that.find_address()
      that.city_show = false
      that.area_show = false
      that.isAdd = false
      // 获取省市区列表
      that.$.ajax({
        url: that.base + 'm2c.support/regn/provs',
        data: {
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          // // console.log('获得的省份信息列表: ', result)
          that.province_all_search = result.content
          // that.province_all_add_modify_1 = result.content
          // that.province_all_add_modify_2 = result.content
        }
      })
      if(that.$route.query.goodsId !=undefined){
        that.activeName = 'second'
        that.add()
        that.getGuarantee()
        that.topBoxShow = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-button--small{padding:0;}
  .sz {
    .form-horizontal{padding-top:20px;padding-left:0;}
    .control-label{font-weight:normal;}
    .el-row {
      margin:0;
      line-height:40px;
      height:40px;
      text-align: right;
      margin-bottom: 15px;

    }
  }
  .topBox{position:absolute;top:0;left:0;height:auto;padding:0 20px;padding-bottom:20px;width:100%;background:#fff;z-index:2;
    .el-row{margin-bottom:15px;}
    .el-input{width:100%;}
    h4{
      line-height:50px;
      margin-bottom:10px;
      font-size:18px;
      color:#333;
      a{
        opacity:1;display:inline-block;width:24px;height:24px;float:right; margin-top:10px;background:url(../../../assets/images/ico_close.png) no-repeat center center;
      }
    }
    .alginRight{text-align: right; line-height:50px;color:#666;}
  }
  a.ellipsis{text-decoration:none;color:#666;}
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
      span.fr{
        cursor: pointer;
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
</style>
