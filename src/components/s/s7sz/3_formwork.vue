<template>
  <div class="sz">
    <button type="button" class="btn btn-info pull-right add btn-lg" @click="goto()">新增</button>
    <table class="table table-bordered">
      <thead>
        <tr class="active">
          <th>模板名称</th>
          <th>按重计费</th>
          <th class="some">已有30个商品使用></th>
          <th class="act">编辑</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr class="active">
          <th scope="row">可配送至</th>
          <td>首重/kg</td>
          <td>运费/元</td>
          <td>续重/kg</td>
          <td>续重/元</td>
        </tr>
        <tr>
          <th scope="row">全国（默认运费）</th>
          <td>1</td>
          <td>12</td>
          <td>2</td>
          <td>5</td>
        </tr>
        <tr>
          <th scope="row">辽宁，吉林，黑龙江，广东（深圳、广州、珠海）</th>
          <td>1</td>
          <td>20</td>
          <td>2</td>
          <td>20</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-bordered">
      <thead>
        <tr class="active">
          <th>模板名称</th>
          <th>按件计费</th>
          <th class="some">已有0个商品使用</th>
          <th class="act">编辑</th>
          <th class="act">删除</th>
        </tr>
      </thead>
      <tbody>
        <tr class="active">
          <th scope="row">可配送至</th>
          <td>首件/kg</td>
          <td>运费/元</td>
          <td>续件/kg</td>
          <td>续费/元</td>
        </tr>
        <tr>
          <th scope="row">全国（默认运费）</th>
          <td>1</td>
          <td>12</td>
          <td>2</td>
          <td>5</td>
        </tr>
        <tr>
          <th scope="row">辽宁，吉林，黑龙江，广东（深圳、广州、珠海）</th>
          <td>1</td>
          <td>20</td>
          <td>2</td>
          <td>20</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {

    }
  },
  created () {
    this.getTemplate()
  },
  methods: {
    getTemplate () {
      const that = this
      that.$.ajax({
        method: 'get',
        url: this.mobanbase + 'm2c.scm/postage',
        success: function (data) {
          console.log('返回值', data)
        }
      })
    },
    goto (event) {
      let that = this
      that.$.ajax({
        method: 'get',
        url: this.mobanbase + 'm2c.scm/postage/id',
        success: function (data) {
          console.log(data.content)
        }
      })
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
