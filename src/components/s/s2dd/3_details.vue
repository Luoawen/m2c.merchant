<template>
  <div class="detail">
    <div class="nav">
      <span :class="{active:showactive}" @click="customerdetail"><a>售后单详情</a></span>
      <span :class="{active:showactive02}" @click="customerfreight"><a>售后物流</a></span>
      <span :class="{active:showactive03}" @click="customerecord"><a>操作记录</a></span>
    </div>
    <!-- 售后单详情 -->
    <div v-show="showactive" class="customerdetail_container">
      <!-- 拒绝结果，做法根据后台返回数据判断v-show -->
      <div class="detail_tit">已拒绝顾客售后sheng'qin</div>
      <div class=""></div>
    </div>
    <!-- 售后物流 -->
    <div v-show="showactive02">

    </div>
    <!-- 操作记录 -->
    <div v-show="showactive03">
      333
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        amout: '',
        number: '',
        is_Success: false,
        showactive: true,
        showactive02: false,
        showactive03: false,
        // 搜索参数
        search_params: { orderNo: '', keywordType: '', statusFlag: sessionStorage.getItem('statusFlag'), payWay: '', startTime: sessionStorage.getItem('startTime'), endTime: sessionStorage.getItem('endTime'), keyword: '' }
      }
    },
    methods: {
      // 获取全部订单信息
      customerdetail () {
        var that = this
        that.showactive = true;
        that.showactive02 = false;
        that.showactive03 = false;
      },
      customerfreight () {
        var that = this
        that.showactive02 = true;
        that.showactive = false;
        that.showactive03 = false;
      },
      customerecord () {
        var that = this
        that.showactive03 = true;
        that.showactive02 = false;
        that.showactive = false;
      }

    },
    mounted () {
      // this.get_good_info()
    }
  }
</script>
<style lang="scss" scoped>
.detail{
    width: 1583px;
    min-height: 84px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .nav{
      .active{
        border-bottom:1px solid #0086FF;
      }
      height: 40px;
      line-height: 40px;
      border-bottom:1px solid #e7e7e7 ;
      span{
        display: inline-block;
        padding-left: 30px;
        padding-right: 30px;
        line-height: 40px;
      }
    }
    .customerdetail_container{
      width: 1583px;
      min-height: 670px;
    }
}
</style>
