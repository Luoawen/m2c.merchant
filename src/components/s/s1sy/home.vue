<template>
  <div class="home clear">
    <p class="setUp">
      开店时间：{{createdDate}}（已开店{{dayTimes}}天）
    </p>
    <el-row :gutter="10" class="dataTotal">
      <el-col :span="6">
        <div class="box">
          <h5>商品在售<span>当前累计</span></h5>
          <p>{{}}<span>个</span></p>
          <router-link :to="{name:'goodList'}">查看明细</router-link>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <h5>销售金额
            <div class="icon">
              <div class="tips">
                <p>已付款的金额统计</p>
              </div>
            </div>
            <span>本月累计</span>
          </h5>
          <p>0<span>元</span></p>
          <router-link :to="{name:'goodList'}">查看明细</router-link>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <h5>待结算金额
            <div class="icon">
              <div class="tips">
                <p>顾客付款后，待系统结算的金额</p>
              </div>
            </div>
            <span>当前累计</span>
          </h5>
          <p>0<span>元</span></p>
          <router-link :to="{name:'goodList'}">查看结算</router-link>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <h5>可用金额
            <div class="icon">
              <div class="tips">
                <p>已结算的金额，可用金额可提现</p>
              </div>
            </div>
            <span>当前剩余</span>
          </h5>
          <p>0<span>元</span></p>
          <router-link :to="{name:'goodList'}">提现</router-link>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="dataInfo">
      <el-col :span="12">
        <div class="box">
          <h5>数据概要</h5>
          <el-tabs v-model="activeData" @tab-click="handleClick" style="margin-top:-50px;">
            <el-tab-pane label="今日数据" name="first">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>订单数
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
                <el-col :span="8">
                  <div>退货订单数
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
                <el-col :span="8">
                  <div>商品新增数
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>销售金额
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
                <el-col :span="8">
                  <div>退款金额
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
                <el-col :span="8">
                  <div>评论新增数
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="昨日数据" name="second"><el-row :gutter="20">
                <el-col :span="8">
                  <div>订单数
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
                <el-col :span="8">
                  <div>退货订单数
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
                <el-col :span="8">
                  <div>商品新增数
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>销售金额
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
                <el-col :span="8">
                  <div>退款金额
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
                <el-col :span="8">
                  <div>评论新增数
                    <div class="icon">
                      <div class="tips">
                        <p>已付款的金额统计</p>
                      </div>
                    </div>
                  </div>
                  <h4>0</h4>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="box">
          <h5>商品销售榜
            <span class="timeChoose">
              <el-date-picker
                v-model="time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </span>
          </h5>
          <div class="height300">
            <el-table
              :data="dataList"
              style="width:96%;margin:10px auto;">
              <el-table-column
                type='index'
                label="排行">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.index }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="商品名称"
                width="260">
              </el-table-column>
              <el-table-column
                prop="address"
                label="销量">
              </el-table-column>
            </el-table>
            <router-link v-if="dataList.length!=0" class="more" :to="{name:'goodList'}">查看更多></router-link>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="echart">
      <el-col :span="12">
        <div class="box">
          <h5>销售金额统计
            <div class="icon">
              <div class="tips">
                <p>已付款的金额统计</p>
              </div>
            </div>
            <span>近7日数据</span></h5>
          <div id="chartLine" style="width:100%; height:400px;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 引入折线图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
export default {
  name: '',
  data () {
    return {
      activeData:'first',
      time:'',
      dataList:[],
      chartLine: null,
      createdDate:'',
      dayTimes:''
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 获取开店时间及日期
    getShopTime(){
      let that = this
      that.$.ajax({
        method: 'get',
        url: that.base + 'm2c.scm/shop/sys/shopcreatedtime',
        data: {
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        },
        success: function (result) {
          if(result.status === 200){
            that.createdDate = that.date_format(new Date(result.content.createdDate), 'yyyy-MM-dd').replace(/(.+?)\-(.+?)\-(.+)/,"$1年$2月$3日")
            that.dayTimes = result.content.dayTimes
          }else{
            that.$message({
              type: 'info',
              message: titleAisle+'已取消'
            })
          }
        }
      })
    }
  },
  mounted () {
    this.getShopTime()
    var echarts = require('echarts');
    this.chartLine = echarts.init(document.getElementById('chartLine'))
    // 引入 ECharts 主模块
    this.chartLine.setOption({
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#0086FF'
          }
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : ['周一','周二','周三','周四','周五','周六','周日']
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name:'邮件营销',
          type:'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data:[120, 132, 101, 134, 90, 230, 210]
        }
      ]
    })
  }
}
</script>
<style lang="scss" scoped>
  a:hover{ text-decoration: none;}
  .home{padding:20px;}
  .el-row{margin-bottom:10px;}
  p.setUp{color: #667991;}
  .dataTotal .box,.dataInfo .box,.echart .box{background:#fff;height:auto;border-radius:5px;text-align: center;padding-bottom:20px;}
  .dataTotal h5{text-align:left;background: #E6E8F2;font-size:16px;color: #667991;line-height:50px;padding:0 20px;
    div.icon{top:2px;}
    span{font-size:12px;background:#B7C9E1;color:#fff;float:right;line-height:20px;padding:0 4px;margin-top:15px;}
  }
  .dataTotal p{text-align: center;font-size:30px;color:#333;line-height:42px;padding:0 20px;
    span{font-size:14px;color:#151515;margin-left:6px;}
  }
  .dataTotal a{width:80px;height:25px;border: 1px solid #CCCCCC;border-radius: 3px;display:inline-block;line-height:24px;font-size:13px;color: #333333;}
  .dataInfo .box,.echart .box{border-radius:0;text-align:center;padding-bottom:0px;}
  .dataInfo h5,.echart h5{font-size:16px;color:#333;text-align:left;line-height:50px;padding:0 20px;margin:0;border-bottom:1px solid #dfe4ed;}
  .echart h5 span{font-size:12px;color:#666;float:right;}
  .dataInfo .box .el-col{padding:10px 0 ;}
  .height300{height:290px;}
  .el-tabs__header .el-tabs__active-bar,.el-tabs__header .el-tabs__item{padding:0 20px;}
  .el-tabs__content{width:100%;}
  .box div.icon{text-align: left;top:2px;}
  .box div.icon div.tips p{text-align: left;padding:0;}
  .echart{top:-105px;}
  a.more{color:#667991;font-size:12px; text-decoration:underline;}
  /*<el-row :gutter="10" class="dataInfo">
      <el-col :span="12">
        <h5>数据概要</h5>
        <el-tabs v-model="activeData" @tab-click="handleClick">
          <el-tab-pane label="今日数据" name="first">
            <el-row :gutter="10">
              <el-col :span="8">
                <p>订单数
                  <div class="icon">
                    <div class="tips">
                      <p>已付款的金额统计</p>
                    </div>
                  </div>
                </p>
                <h4>0</h4>
              </el-col>*/
</style>
<style>
.dataInfo .el-tabs__nav{float:right !important;}
.dataInfo .el-tabs__item{height:50px;line-height:50px;}
.dataInfo .el-input{margin:0;float:right;}
.dataInfo .el-tabs__nav-wrap::after{height:1px;}
/* .dataInfo #tab-first,.dataInfo #tab-second,.dataInfo .el-tabs__active-bar{width:96px;text-align:center;padding:0;} */
.building{
  font-size:20px;color:#666;
  padding:240px 0;
  line-height:40px;
  margin-top:100px;
  text-align: center;
  background:url(../../../assets/images/image_upgrade.png) no-repeat center top;
}
</style>