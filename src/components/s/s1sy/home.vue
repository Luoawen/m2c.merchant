<template>
  <div class="clear">
    <el-row :gutter="10" class="dataTotal">
      <el-col :span="6">
        <h5>商品在售<span>当前累计</span></h5>
        <p>0<span>个</span></p>
        <router-link :to="{name:'goodList'}">查看明细</router-link>
      </el-col>
      <el-col :span="6">
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
      </el-col>
      <el-col :span="6">
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
      </el-col>
      <el-col :span="6">
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
      </el-col>
    </el-row>
    <el-row :gutter="10" class="dataInfo">
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
              </el-col>
              <el-col :span="8">
                <p>退货订单数
                  <div class="icon">
                    <div class="tips">
                      <p>已付款的金额统计</p>
                    </div>
                  </div>
                </p>
                <h4>0</h4>
              </el-col>
              <el-col :span="8">
                <p>商品新增数
                  <div class="icon">
                    <div class="tips">
                      <p>已付款的金额统计</p>
                    </div>
                  </div>
                </p>
                <h4>0</h4>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <p>销售金额
                  <div class="icon">
                    <div class="tips">
                      <p>已付款的金额统计</p>
                    </div>
                  </div>
                </p>
                <h4>0</h4>
              </el-col>
              <el-col :span="8">
                <p>退款金额
                  <div class="icon">
                    <div class="tips">
                      <p>已付款的金额统计</p>
                    </div>
                  </div>
                </p>
                <h4>0</h4>
              </el-col>
              <el-col :span="8">
                <p>评论新增数
                  <div class="icon">
                    <div class="tips">
                      <p>已付款的金额统计</p>
                    </div>
                  </div>
                </p>
                <h4>0</h4>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="昨日数据" name="second">配置管理</el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="12">
        <h5>商品销售榜
          <span class="timeChoose">
            <el-date-picker
              v-model="time"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </span>
        </h5>
        <el-table
          :data="dataList"
          style="width: 100%">
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
      </el-col>
    </el-row>
    <el-row :gutter="10" class="echart">
      <el-col :span="12">
        <h5>销售金额统计<span>近7日数据</span></h5>
        <div id="chartLine" style="width:100%; height:400px;"></div>
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
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  mounted () {
    var echarts = require('echarts');
    this.chartLine = echarts.init(document.getElementById('chartLine'))
    // 引入 ECharts 主模块
    this.chartLine.setOption({
      tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
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
    // var echarts = require('echarts');
    // // 基于准备好的dom，初始化echarts实例
    // var myChart = echarts.init(document.getElementById('main'));
    // // 绘制图表
    // myChart.setOption({
    //     title: {
    //     text: '堆叠区域图'
    //     },
    //     tooltip : {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'cross',
    //             label: {
    //                 backgroundColor: '#6a7985'
    //             }
    //         }
    //     },
    //     legend: {
    //         data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
    //     },
    //     toolbox: {
    //         feature: {
    //             saveAsImage: {}
    //         }
    //     },
    //     grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //     },
    //     xAxis : [
    //         {
    //             type : 'category',
    //             boundaryGap : false,
    //             data : ['周一','周二','周三','周四','周五','周六','周日']
    //         }
    //     ],
    //     yAxis : [
    //         {
    //             type : 'value'
    //         }
    //     ],
    //     series : [
    //         {
    //             name:'邮件营销',
    //             type:'line',
    //             stack: '总量',
    //             areaStyle: {normal: {}},
    //             data:[120, 132, 101, 134, 90, 230, 210]
    //         },
    //         {
    //             name:'联盟广告',
    //             type:'line',
    //             stack: '总量',
    //             areaStyle: {normal: {}},
    //             data:[220, 182, 191, 234, 290, 330, 310]
    //         },
    //         {
    //             name:'视频广告',
    //             type:'line',
    //             stack: '总量',
    //             areaStyle: {normal: {}},
    //             data:[150, 232, 201, 154, 190, 330, 410]
    //         },
    //         {
    //             name:'直接访问',
    //             type:'line',
    //             stack: '总量',
    //             areaStyle: {normal: {}},
    //             data:[320, 332, 301, 334, 390, 330, 320]
    //         },
    //         {
    //             name:'搜索引擎',
    //             type:'line',
    //             stack: '总量',
    //             label: {
    //                 normal: {
    //                     show: true,
    //                     position: 'top'
    //                 }
    //             },
    //             areaStyle: {normal: {}},
    //             data:[820, 932, 901, 934, 1290, 1330, 1320]
    //         }
    //     ]
    // });
  }
}
</script>

<style>
.building{
  font-size:20px;color:#666;
  padding:240px 0;
  line-height:40px;
  margin-top:100px;
  text-align: center;
  background:url(../../../assets/images/image_upgrade.png) no-repeat center top;
}
</style>