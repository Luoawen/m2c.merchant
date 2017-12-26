<template>
  <div class="m91gj">
    <h4 class="gj_bt">你可以选择需要的功能，丰富运营能力及体验</h4>
    <div class="tool_box">
      <!--
      <div class="tools" @click="toFullCut()">
        <div class="tools_left">
        </div>
        <div class="tools_body">
          <div class="tools_body_left">
            <div class="tools_heading">满减功能</div>
            <p path="/m/m92mj">针对全平台所有满减进行管理，包括新增、删除</p>
          </div>
          <div class="tools_in">></div>
        </div>
      </div>
      <div class="tools" @click="toCoupon()">
        <div class="tools_left">
        </div>
        <div class="tools_body">
          <div class="tools_body_left">
            <div class="tools_heading">优惠券</div>
            <p path="/m/couponList">针对全平台所有优惠券进行管理，包括新增、删除</p>
          </div>
          <div class="tools_in">></div>
        </div>
      </div>
      -->
      <div class="tools" @click="toFullCut()">
        <div class="tools_top tools_bg01">
        </div>
        <div class="tools_body">
          <div class="tools_body_left">
            <div class="tools_heading">满减功能</div>
            <p>我是满减功能的简单介绍<i class="tools_in ml10"></i></p>
          </div>
        </div>
      </div>
      <div class="tools" @click="toCoupon()">
        <div class="tools_top tools_bg02">
        </div>
        <div class="tools_body">
          <div class="tools_body_left" >
            <div class="tools_heading">优惠券</div>
            <p>管理平台和商家创建的优惠 和新增平台优惠券<i class="tools_in ml10"></i></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      toFullCut () {
        let _this = this
        _this.$goRoute({path: 'marketing'})
      },
      toCoupon () {
        let _this = this
        _this.$goRoute({path: 'coupon_list'})
      }
    }
  }
</script>

<style lang="scss" scoped>
.ml10{
	margin-left: 10px;
}
  .m91gj {
    min-width: 1434px;
    padding-left: 32px;
    color:#000;
    max-width: 1200px;
    min-height: 700px;
    margin-left: 226px;
    margin-top: 10px;
    .gj_bt{
			font-size:14px;
			font-family:PingFangSC-Regular;
			color:rgba(153,153,153,1);
			line-height:25px;
    }
    .tool_box{
      width:1120px;
      display: flex;
      .tools{
        cursor: pointer;
        width: 240px;
        height: 260px;
        background: #fff;
        margin-bottom: 20px;
        border: 1px solid #E6E8F2;
        overflow: hidden;
        margin-right: 20px;
        .tools_top {
          width:100%;
          height:150px;
        }
        .tools_bg01{
        	 background:url(../../../assets/images/icon_sale.png) no-repeat center;
        }
        .tools_bg02{
        	 background:url(../../../assets/images/icon_voucher.png) no-repeat center;
        }
        .tools_body{
        	width: 100%;
        	height: 110px;
          padding-left:19px;
          position: relative;
          text-align: center;
          background:rgba(199,225,255,0.15);
          border-top:1px dotted #E6E8F2;
          /*padding-top: 10px;*/
          .tools_heading{
            line-height: 40px;
            font-size: 16px;
            font-weight: bold;
            padding-top:7px;
          }
          p{
            font-size: 14px;
						color:rgba(153,153,153,1);
						padding-right: 10px;
    				line-height: 20px;
          }

          .tools_in{
            width:8px;
            height: 14px;
   					display: inline-block;
            background: url(../../../assets/images/icon_into.png);
          }
        }
      }
    }

  }
</style>
