<template>
  <div class="sz">
    <router-link :to="{ name:'formworkadd', query: {addModify: 'true'} }" class="btn btn-info pull-right add btn-lg">新增</router-link>
    <template v-for="(formwork,index) in formworks">
      <table class="table table-bordered">
        <thead>
          <tr class="active">
            <th>模板名称</th>
            <th>{{formwork.modelName}}</th>
            <th class="some">已有{{formwork.goodsUserNum}}个商品使用 <router-link v-if="formwork.goodsUserNum!=0">&gt;</router-link></th>
            <th class="act"><router-link :to="{ name:'formworkadd', query: {addModify: false, modelId: formwork.modelId} }">编辑</router-link></th>
            <th><a @click="delectModel(formwork.modelId)" v-if="formwork.goodsUserNum==0">删除</a></th>
          </tr>
        </thead>
        <tbody>
          <tr class="active">
            <th scope="row">可配送至</th>
            <td>{{formwork.chargeType==1?'首件/个':'首重/kg'}}</td>
            <td>运费/元</td>
            <td>{{formwork.chargeType==1?'续件/个':'续重/kg'}}</td>
            <td>续费/元</td>
          </tr>
          <tr v-for="(postageModelRule,index) in formwork.postageModelRules">
            <th scope="row">{{postageModelRule.defaultFlag==0 ?'全国（默认运费）':postageModelRule.address}}</th>
            <td>{{formwork.chargeType==1?postageModelRule.firstPiece:postageModelRule.firstWeight}}</td>
            <td>{{postageModelRule.firstPostage}}</td>
            <td>{{formwork.chargeType==1?postageModelRule.continuedPiece:postageModelRule.continuedWeight}}</td>
            <td>{{postageModelRule.continuedPostage}}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      formworks: [],
      dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
    }
  },
  created () {
    this.getTemplate()
  },
  methods: {
    delectModel (n) {
      // alert((sessionStorage.getItem('mUser')).dealerId)
      let that = this
      that.$.ajax({
        method: 'delete',
        url: this.localbase + 'm2c.scm/postage?dealerId=' + that.dealerId +'&modelId=' + n,
        data: {
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          if (result.status==200){
            that.show_tip("删除成功")
            that.getTemplate()
          } else {
            that.show_tip(result.errorMessage)
          }

        }
      })
    },
    getTemplate () {
      const that = this
      that.$.ajax({
        method: 'get',
        url: this.localbase + 'm2c.scm/postage',
        data: {
          token: sessionStorage.getItem('mToken'),
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
        },
        success: function (result) {
          that.formworks = result.content
        }
      })
    },
    goto (event) {
      let that = this
      that.$goRoute({path: 'formworkadd'})
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.sz{
    width: 1620px;
    height: 800px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .add{
      margin: 31px 44px 5px 0;
    }
    .table{
      width: 1538px;
      margin-left: 38px;
      thead{
        tr{
          th{
            border: 0px solid transparent;
          }
          th.act{
            color: blue !important;
            cursor: pointer;
          }
          th.some{
            cursor: pointer;
          }
        }
      }
    }
}
</style>
