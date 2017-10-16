<template>
  <div class="addMess">
    <form class="form-horizontal" id="temMess">
      <div class="form-group">
        <label class="col-sm-2 control-label">*运费模板名称：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="inputEmail3" placeholder="1-20字符" >
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">*计费方式：</label>
        <div class="col-sm-3">
          <form action="" method="get">
            <label><input name="tem" type="radio" value="" checked/>按重量</label>
            <label><input name="tem" type="radio" value="" />按件数</label>
          </form>
        </div>
      </div>
      <div class="form-group" v-show="type==='add'">
        <label class="col-sm-2 control-label">*运费计算规则：</label>
        <div class="col-sm-8">
              <table class="table table-bordered">
      <thead>
        <tr class="active">
          <th>可配送至</th>
          <th>首重/kg</th>
          <th>首运费/元</th>
          <th>续重/kg</th>
          <th>续费/元</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td scope="row">全国（默认运费）</td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td></td>
        </tr>
        <tr>
          <td scope="row">未添加地区<span>编辑</span></td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td>删除</td>
        </tr>
      </tbody>
    </table>
        </div>
      </div>
      <div class="form-group" v-show="type==='normal'">
        <label class="col-sm-2 control-label">*运费计算规则：</label>
        <div class="col-sm-8">
              <table class="table table-bordered">
      <thead>
        <tr class="active">
          <th>可配送至</th>
          <th>首重/kg</th>
          <th>首运费/元</th>
          <th>续重/kg</th>
          <th>续费/元</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td scope="row">全国（除指定地区外，其余地区都默认全国的模板）</td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
          <td>
            <input type="text" style="width：79px;height:30px;">
          </td>
        </tr>
      </tbody>
    </table>
        </div>
      </div>
      <p style="padding-left:290px;color:blue;cursor:pointer;" @click="clickchange ('add')">为制定地区设置运费</p>
      <div class="form-group">
        <label class="col-sm-2 control-label">模板说明：</label>
        <div class="col-sm-6">
          <textarea class="form-control" cols="80" rows="7" placeholder="1-200字符" style="resize:none;"></textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <button type="submit" class="btn btn-info btn-lg save" @click="goto()">保存</button>
          <button type="submit" class="btn btn-default btn-lg">取消</button>
        </div>
      </div>
    </form>
  </div>
</template>
   
<style scoped>
  .addMess{
    margin-top: 168px;
  }
</style>
   
<script>
export default {
  data () {
    return {
      type: 'normal'
    }
  },
  created () {
  },
  methods: {
    clickchange (type) {
      this.type = type
    },
    addTemplate () {
      const that = this
      that.$.ajax({
        type: 'post',
        url: this.mobanbase + 'm2c.scm/postage',
        data: {
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
        },
        // dataType: 'jsonp',
        success: function (data) {
          console.log(data)
        }
      })
    },
    goto () {
      let that = this
      that.$goRoute({path: 'formwork'})
      that.$.ajax({
        type: 'get',
        url: this.mobanbase + 'm2c.scm/postage/id',
        // dataType: 'jsonp',
        success: function (data) {
          console.log(data)
        }
      })
    }
  },
  mounted () {
    console.log(1111)
    console.log(sessionStorage.getItem('mUser'))
    console.log(JSON.parse(sessionStorage.getItem('mUser')).dealerId)
    console.log(sessionStorage.getItem('mToken'))
  }
}
</script>
