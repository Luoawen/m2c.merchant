<template>
  <div class="sz content clear">
    <form class="form-horizontal" action="" method="post" v-on:submit.prevent>
      <div class="form-group search_cell">
        <label class="col-sm-2 control-label"><span style="color: red">*</span>售后地址：</label>
        <div class="col-sm-3">
          <select class="form-control area_select col-sm-1" v-model="search_params.province"
                  id="search_params_province_select" style="margin-bottom:5px;">
           <!-- <option value=""></option>-->
            <option v-for="(cell,index) in province_all_search" :key="index" :value="cell.code">
              {{cell.name}}
            </option>
          </select>
          <select class="form-control area_select col-sm-1" v-model="search_params.city" id="search_params_city_select"
                  style="margin-bottom:5px;" v-if="city_show">
            <option v-for="(cell,index) in city_all_search" :key="index" :value="cell.code">
              {{cell.name}}
            </option>
          </select>
          <select class="form-control area_select col-sm-1" v-model="search_params.regionCode"
                  id="search_params_regionCode_select" v-if="area_show">
            <option v-for="(cell,index) in area_all_search" :key="index" :value="cell.code">
              {{cell.name}}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">详细地址：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="input1" placeholder="1-50字符" v-model="search_params.detail" maxlength="50">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">联系人姓名：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="input2" placeholder="1-10字符" v-model="search_params.person"maxlength="10">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">联系电话：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="input3" placeholder="请填写" v-model="search_params.tel">
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <el-button type="primary" size="medium" @click="isAdd == true?add_address():modify_address()">保存
          </el-button>
         <!-- <button type="submit" class="btn btn-default btn-lg" @click="cancel()">取消</button>-->
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  import validatorUtils from '../../../commonutils/validatorUtils'
  export default {
    data () {
      return {
        name: '',
        // 搜索参数
        search_params: {
          accNo: '',
          mediaName: '',
          province: '',
          proName: '',
          city: '',
          cityName: '',
          regionCode: '',
          areaName: '',
          parCate: '',
          cate: '',
          cooperWay: '',
          staff: '',
          addr: '',
          regisDateStart: '',
          regisDateEnd: '',
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
        // 所有的省份(供新增搜索删除(上)使用)
        province_all_add_modify_1: [],
        // 所有的城市(供新增搜索删除(上)使用)
        city_all_add_modify_1: [],
        // 所有的省份(供新增搜索删除(下)使用)
        province_all_add_modify_2: [],
        // 所有的城市(供新增搜索删除(下)使用)
        city_all_add_modify_2: [],
        // 所有的区域(供新增搜索删除(下)使用)
        area_all_add_modify_2: [],
        // 售后id
        addressId: '',
        dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
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
          url: this.localbase + 'm2c.scm/after/sale/address/id',
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
          url: this.localbase + 'm2c.scm/after/sale/address',
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
          url: this.localbase + 'm2c.scm/after/sale/address',
          data: {
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
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
        const that = this
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
          url: this.localbase + 'm2c.scm/after/sale/address',
          data: {
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
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
          that.province_all_add_modify_1 = result.content
          that.province_all_add_modify_2 = result.content
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  .sz {
    .control-label{font-weight:normal;}
    .form-group {
      margin-bottom: 30px;
      button {
        width: 136px;
        height: 41px;
        margin-top: 80px;
      }
      button, .save {
        margin-right: 60px;
      }
    }
  }
</style>
