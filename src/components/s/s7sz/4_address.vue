<template>
  <div class="sz">
    <form class="form-horizontal" action="" method="post" v-on:submit.prevent>
      <div class="form-group search_cell">
        <label class="col-sm-2 control-label">售后地址：</label>
        <div class="col-sm-3">
        <select class="form-control area_select col-sm-1" v-model="search_params.province" id="search_params_province_select" style="margin-bottom:5px;">
          <option value=""></option>
            <option v-for="(cell,index) in province_all_search" :key="index" :value="cell.code">
              {{cell.name}}
            </option>
        </select>
        <select class="form-control area_select col-sm-1" v-model="search_params.city" id="search_params_city_select" style="margin-bottom:5px;">
          <option value=""></option>
          <option v-for="(cell,index) in city_all_search" :key="index" :value="cell.code">
            {{cell.name}}
          </option>
        </select>
        <select class="form-control area_select col-sm-1" v-model="search_params.regionCode" id="search_params_regionCode_select">
          <option value=""></option>
          <option v-for="(cell,index) in area_all_search" :key="index" :value="cell.code">
            {{cell.name}}
          </option>
        </select>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">详细地址：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="input1" placeholder="1-50字符" v-model="search_params.detail">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">联系人姓名：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="input2" placeholder="1-10字符" v-model="search_params.person">
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
          <button type="submit" class="btn btn-info btn-lg save" @click="addressId == ''?add_address():modify_address()">保存</button>
          <button type="submit" class="btn btn-default btn-lg">取消</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      // 搜索参数
      search_params: {accNo: '', mediaName: '', province: '', proName: '', city: '', cityName: '', regionCode: '', areaName: '', parCate: '', cate: '', cooperWay: '', staff: '', addr: '', regisDateStart: '', regisDateEnd: '', detail: '', person: '', tel: ''},
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
      dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
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
          that.search_params.city = ''
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
              // that.search_params.city = that.city_all_search[0].code
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
          that.search_params.regionCode = ''
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
              // that.search_params.regionCode = that.area_all_search[0].code
            }
          })
        }
      },
      deep: true
    },
    // 新增修改删除时监控用户省份
    'add_modify_params_user.provinceCode': {
      handler (code, oldCode) {
        if (code === '' || code === undefined) return
        let that = this
        if (code !== oldCode) {
          // // console.log('(增删改:用户)省份选择变化,新的省份code:' + code + ',旧的省份code:' + oldCode)
          that.$.ajax({
            url: that.base + 'm2c.support/regn/cits',
            data: {
              token: sessionStorage.getItem('mToken'),
              province: code
            },
            success: function (result) {
              // // console.log('(用户)获得的市信息列表: ', result)
              that.city_all_add_modify_1 = result.content
              that.add_modify_params_user.districtCode = that.city_all_add_modify_1[0].code
            }
          })
        }
      },
      deep: true
    },
    // 新增修改删除时监控媒体省份
    'add_modify_params.province2': {
      handler (code, oldCode) {
        if (code === '' || code === undefined) return
        let that = this
        if (code !== oldCode) {
          // // console.log('(增删改:媒体)省份选择变化,新的省份code:' + code + ',旧的省份code:' + oldCode)
          that.$.ajax({
            url: that.base + 'm2c.support/regn/cits',
            data: {
              token: sessionStorage.getItem('mToken'),
              province: code
            },
            success: function (result) {
              // // console.log('(增删改:媒体)获得的市信息列表: ', result)
              that.city_all_add_modify_2 = result.content
              that.add_modify_params.city2 = that.city_all_add_modify_2[0].code
            }
          })
        }
      },
      deep: true
    },
    // 新增修改删除时监控媒体城市
    'add_modify_params.city2': {
      handler (code, oldCode) {
        if (code === '' || code === undefined) return
        let that = this
        if (code !== oldCode) {
          // // console.log('(增删改:媒体)城市选择变化,新的城市code:' + code + ',旧的城市code:' + oldCode)
          that.$.ajax({
            url: that.base + 'm2c.support/regn/areas',
            data: {
              token: sessionStorage.getItem('mToken'),
              city: code
            },
            success: function (result) {
              // // console.log('(增删改:媒体)获得的区信息列表: ', result)
              that.area_all_add_modify_2 = result.content
              that.add_modify_params.regionCode2 = that.area_all_add_modify_2[0].code
            }
          })
        }
      },
      deep: true
    },
    // 新增修改删除时监控一级媒体分类
    'add_modify_params.parCate': {
      handler (code, oldCode) {
        let that = this
        if (code === '' || code === undefined) return
        if (code !== oldCode) {
          // // console.log('(增删改)一级媒体分类选择变化,新的一级媒体分类code:' + code + ',旧的一级媒体分类code:' + oldCode)
          that.$.ajax({
            url: that.base + 'm2c.media/cate/chd',
            data: {
              token: sessionStorage.getItem('mToken'),
              parentCateCode: code
            },
            success: function (result) {
              // // console.log('(增删改)获得的二级媒体分类列表: ', result)
              that.cate_all_add_modify = result.content
              that.add_modify_params.cate = that.cate_all_add_modify[0].cateCode
            }
          })
        }
      },
      deep: true
    },
    // 搜索时监控一级媒体分类
    'search_params.parCate': {
      handler (code, oldCode) {
        let that = this
        if (code === '' || code === undefined) {
          that.search_params.cate = ''
          return
        }
        if (code !== oldCode) {
          // // console.log('(增删改)一级媒体分类选择变化,新的一级媒体分类code:' + code + ',旧的一级媒体分类code:' + oldCode)
          that.$.ajax({
            url: that.base + 'm2c.media/cate/chd',
            data: {
              token: sessionStorage.getItem('mToken'),
              parentCateCode: code
            },
            success: function (result) {
              // // console.log('(增删改)获得的二级媒体分类列表: ', result)
              that.cate_all_search = result.content
              that.search_params.cate = that.cate_all_search[0].cateCode
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取id
    get_id () {
      const that = this
      that.$.ajax({
        type: 'get',
        url: this.mobanbase + 'm2c.scm/after/sale/address/id',
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
        url: this.mobanbase + 'm2c.scm/after/sale/address',
        data: {
          dealerId: that.dealerId
        },
        success: function (res) {
          if (!res.content.addressId) {
            that.get_id()
            that.add_address()
          } else {
            console.log(res)
            that.dealerId = res.content.dealerId
            that.addressId = res.content.addressId
            that.search_params.province = res.content.proCode
            that.search_params.city = res.content.cityCode
            that.search_params.regionCode = res.content.areaCode
            that.search_params.detail = res.content.address
            that.search_params.person = res.content.contactName
            that.search_params.tel = res.content.contactNumber
          }
        }
      })
    },
    // 添加地址
    add_address () {
      const that = this
      if (!that.search_params.province) {
        that.show_tip('不能为空')
        return
      }
      if (!that.search_params.city) {
        that.show_tip('不能为空')
        return
      }
      if (!that.search_params.regionCode) {
        that.show_tip('不能为空')
        return
      }
      if (that.search_params.detail > 50) {
        that.show_tip('长度在1-50字符以内')
        return
      }
      if (that.search_params.person > 10) {
        that.show_tip('长度在1-10字符以内')
        return
      }
      if (!that.search_params.tel) {
        that.show_tip('联系电话不能为空')
      }
      // 根据省份的code获取省份名字
      {
        let select = document.querySelector('#search_params_province_select')
        let options = select.options
        let index = select.selectedIndex
        if (index === -1) {
          that.search_params.proName = ''
        } else {
          // console.log('所选省份名称: ', options[index].text)
          that.search_params.proName = options[index].text
        }
      }
      // 根据城市code获取城市名字
      {
        let select = document.querySelector('#search_params_city_select')
        let options = select.options
        let index = select.selectedIndex
        if (index === -1) {
          that.search_params.cityName = ''
        } else {
          // console.log('所选城市名称: ', options[index].text)
          that.search_params.cityName = options[index].text
        }
      }
      // 根据区域code获取区域名字
      {
        let select = document.querySelector('#search_params_regionCode_select')
        let options = select.options
        let index = select.selectedIndex
        if (index === -1) {
          that.search_params.areaName = ''
        } else {
          console.log('所选区域名称: ', options[index].text)
          that.search_params.areaName = options[index].text
        }
      }
      that.$.ajax({
        type: 'post',
        url: this.mobanbase + 'm2c.scm/after/sale/address',
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
      console.log('修改拿到的', that.search_params.province)
      that.$.ajax({
        type: 'get',
        url: this.mobanbase + 'm2c.scm/after/sale/address',
        data: {
          dealerId: that.dealerId
        },
        success: function (res) {
          that.addressId = res.content.addressId
        }
      })
      that.$.ajax({
        type: 'put',
        url: this.mobanbase + 'm2c.scm/after/sale/address',
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
    this.find_address()
    // console.log(JSON.parse(sessionStorage.getItem('mUser')).dealerId)
    let that = this
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
.sz{
    width: 1620px;
    height: 800px;
    margin-left: 48px;
    margin-top: 130px;
    padding-top: 50px;
    background-color: #fff;
    .form-group{
      margin-bottom: 30px;
      button{
          width: 136px;
          height: 41px;
          margin-top: 80px;
      }
      button,.save{
        margin-right: 60px;
      }
    }
}
</style>
