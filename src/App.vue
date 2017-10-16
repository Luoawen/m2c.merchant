<template>
  <div>
    <router-view></router-view>
		<!-- 提示框 -->
    <div id="show_tip" style="display:none">
      <div class="show_tip_cover">
        <div class="show_tip_frame">
          <div class="show_tip_frame_logo"></div>
          <div class="show_tip_frame_content"></div>
          <div class="text-center show_tip_frame_close">
            <button type="button" class="btn btn-default btn_table" style="background-color:rgb(96,174,246);padding:0 20px">
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="loading_layer">
      <div class="loading_div_outer">
        <div class="loading_div_inner"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    beforeCreate () {
      let href = window.location.href
      if (href.match(/b\.m2c/) && !href.match(/#\/\w+/)) {
        this.$router.push({path: '/slogin'})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .s,#show_tip{
  .btn_table{width:auto;padding:0 15px;color:white;border-radius:14px;margin-right:10px;border:none;height:30px;line-height:30px;text-align:center;}
  #toolbar{margin-left:30px;margin-top:15px;}
  .bootstrap-table{
    margin-left:30px;margin-top:10px;
    thead{
      tr{
        background-color:#EBEBEB;
        th{border-bottom:none}
      }
    }
    td,th{border:1px solid #D3D3D3 !important}
    .color_default{color:#60AEF6}
    .color_display{color: #8A8A8A;}
    .color_red{color:#FF6969}
    .pagination{margin:0}
    a{cursor:pointer}
    .bs-checkbox{
      text-align:center;vertical-align:middle;
      input[type=checkbox]{display:inline-block;vertical-align:middle;margin-top:0}
    }
  }
}
[tableexport-id]{width:auto;padding:0 15px;color:white;border-radius:14px;margin-right:10px;border:none;height:30px;line-height:30px;text-align:center;}
.xlsx{background-color:rgb(96,174,246)}
.xls{background-color:rgb(255,105,105)}
.csv{background-color:rgb(48,235,149)}
.txt{background-color:rgb(141,182,205)}
</style>
