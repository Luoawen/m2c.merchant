<template>
  <div class="home clear">
    <p class="setUp">
      开店时间：{{createdDate}}（已开店{{dayTimes}}天）
    </p>
    <el-row :gutter="10" class="dataTotal">
      <el-col :span="6">
        <div class="box">
          <h5>商品在售<span>当前累计</span></h5>
          <p>{{goodNum == undefined || '' ? '--' : goodNum}}<span>个</span></p>
          <router-link :to="{name:'goodList',query:{goodsStatus:2}}">查看明细</router-link>
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
          <p>{{sellMoney == undefined || '' ? '--' : sellMoney}}<span>元</span></p>
          <router-link :to="{name:'bug'}">查看明细</router-link>
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
          <p>{{money.settleAmount == undefined || '' ? '--' :(money.settleAmount)}}<span>元</span></p>
          <router-link :to="{name:'countQuery',query:{SettleStatus:'1'}}">查看结算</router-link>
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
          <p>{{money.tradableAmount == undefined  ? '--' : (money.tradableAmount)}}<span>元</span></p>
          <el-button v-if="money.tradableAmount==undefined||money.tradableAmount<=0" disabled>提现</el-button>
          <router-link v-if="money.tradableAmount>0" :to="{name:'survey'}" >提现</router-link>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="dataInfo">
      <el-col :span="12">
        <div class="box" style="height:245px;">
          <h5>数据概要</h5>
          <el-tabs v-model="activeData" @tab-click="handleClick" style="margin-top:-50px;">
            <el-tab-pane label="今日数据" name="first">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>订单数
                    <div class="icon">
                      <div class="tips">
                        <p>当天已付款订单数</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.orderNum == undefined  ? '--' :reportData.orderNum}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>退款订单数
                    <div class="icon">
                      <div class="tips" style="width:160px;">
                        <p>顾客申请退款、退货退款，且当天商家已同意的售后单数</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.orderRefundNum == undefined  ? '--' :reportData.orderRefundNum}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>商品新增数
                    <div class="icon">
                      <div class="tips">
                        <p>当天审核已通过的商品数目</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.goodsAddNum == undefined  ? '--' :reportData.goodsAddNum}}</h4>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>销售金额
                    <div class="icon">
                      <div class="tips">
                        <p>当天已付款订单金额</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.sellMoney == undefined  ? '--' :reportData.sellMoney}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>退款金额
                    <div class="icon">
                      <div class="tips" style="width:160px;">
                        <p>申请退款、退货退款，且当天商家已同意的售后金额</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.refundMoney == undefined  ? '--' :reportData.refundMoney}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>评论新增数</div>
                  <h4>{{reportData.goodsCommentNum == undefined  ? '--' :reportData.goodsCommentNum}}</h4>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="昨日数据" name="second">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>订单数
                    <div class="icon">
                      <div class="tips">
                        <p>当天已付款订单数</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.orderNum == undefined  ? '--' :reportData.orderNum}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>退款订单数
                    <div class="icon">
                      <div class="tips" style="width:160px;">
                        <p>顾客申请退款、退货退款，且当天商家已同意的售后单数</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.orderRefundNum == undefined  ? '--' :reportData.orderRefundNum}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>商品新增数
                    <div class="icon">
                      <div class="tips">
                        <p>当天审核已通过的商品数目</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.goodsAddNum == undefined  ? '--' :reportData.goodsAddNum}}</h4>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>销售金额
                    <div class="icon">
                      <div class="tips">
                        <p>当天已付款订单金额</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.sellMoney == undefined  ? '--' :reportData.sellMoney}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>退款金额
                    <div class="icon">
                      <div class="tips" style="width:160px;">
                        <p>申请退款、退货退款，且当天商家已同意的售后金额</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.refundMoney == undefined  ? '--' :reportData.refundMoney}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>评论新增数</div>
                  <h4>{{reportData.goodsCommentNum == undefined  ? '--' :reportData.goodsCommentNum}}</h4>
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
                v-model="month"
                type="month" value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </span>
          </h5>
          <div class="height300">
            <el-table
              :data="dataList"
              style="width:96%;margin:10px auto;">
              <el-table-column
                type='index'
                label="排行"
                width="120">
                <template slot-scope="scope" class="pl26">
                  <span :class="{'red':scope.row.index===1||scope.row.index===2||scope.row.index===3}">
                    <i class="no1" v-if="scope.row.index===1"></i>
                    <i class="no2" v-if="scope.row.index===2"></i>
                    <i class="no3" v-if="scope.row.index===3"></i>
                    {{ scope.row.index }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="商品名称"
                width="260">
                <template slot-scope="scope">
                  <a class="ellipsis">{{ scope.row.goodsName }}</a>
                </template>
              </el-table-column>
              <el-table-column
                prop="goodsSaleNum"
                label="销量">
              </el-table-column>
            </el-table>
            <p><router-link v-if="dataList.length!=0" class="more" :to="{name:'goodList'}">查看更多></router-link></p>
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
            <span>近7日数据</span>
          </h5>
          <p>单位/元</p><p class="x">单位/日</p>
          <div id="chartLine" style="width:90%; height:350px;"></div>
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
      activeData:'first', // 今日/昨日数据
      time:'', // 时间
      dataList:[],
      chartLine: null, // 初始化折线图
      createdDate:'', // 开店日期
      dayTimes:'', // 开店天数
      goodNum:null, // 在售商品数量
      sellMoney:null, // 累计销售金额
      reportData:{}, // 7日销售数据
      xAxis:[], // 7日销售X轴
      reportDataList:[], // 7日销售数值
      reportRatioList:[], // 7日销售环比
      month:'', // 搜索排行榜月份
      money:{}, // 待结算金额，可用金额
      datas:[]
    }
  },
  computed: {
    // 计算属性的 getter
    // month: function () {
    //   let date=new Date
    //   let year=date.getFullYear()
    //   let month=date.getMonth()+1
    //   month =(month<10 ? "0"+month:month);
    //   let mydate = (year.toString()+'-'+month.toString())
    //   return mydate
    // }
  },
  watch: {
    'month': {
      handler: function (val, oldVal) {
        let that = this
        if (val != oldVal) {
          that.$nextTick(function () {
            // let month = val.slice(0,4).toString() + val.slice(5,7).toString()
            // console.log(val,month)
            //that.month = month
            that.getDataList()
          })
        } else {
          return false
        }
      },
      deep: true
    }
  },
  methods: {
    handleClick(tab, event) {
      this.getReportData()
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
              message: result.errorMessage
            })
          }
        }
      })
    },
    // 获取商品数量
    getGoodNum(){
      let that = this
      that.$.ajax({
        method: 'get',
        url: that.base + 'm2c.scm/web/goods/for/sale/num',
        data: {
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        },
        success: function (result) {
          if(result.status === 200){
            that.goodNum = result.content
          }else{
            that.$message({
              type: 'info',
              message: result.errorMessage
            })
          }
        }
      })
    },
    // 获取累计销售金额
    getSellMoney(){
      let that = this
      that.$.ajax({
        method: 'get',
        url: that.base + 'm2c.scm/web/dealer/report/this/month/sell/money',
        data: {
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        },
        success: function (result) {
          if(result.status === 200){
            that.sellMoney = result.content
          }else{
            that.$message({
              type: 'info',
              message: result.errorMessage
            })
          }
        }
      })
    },
    // 获取待结算金额和可用金额
    amount () {
      let that = this
      that.$.ajax({
        type: 'get',
        url: this.base + 'm2c.trading/web/account/dealer/amount.web',
        data: {
          token: sessionStorage.getItem('mToken'),
          correlationId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        },
        success: function (result) {
          if (result.status === 200){
            that.money = result.content
            console.log(that.content)
          }
        }
      })
    },
    // 获取今日或昨日数据
    getReportData(){
      let that = this
      that.$.ajax({
        method: 'get',
        url: that.base + 'm2c.scm/web/dealer/report/day',
        data: {
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
          timeType: that.activeData == 'first' ? '1':'2'
        },
        success: function (result) {
          if(result.status === 200){
            that.reportData = result.content
          }else{
            that.$message({
              type: 'info',
              message: result.errorMessage
            })
          }
        }
      })
    },
    // 获取7日数据折线图
    getReportDataList(){
      let that = this
      that.$.ajax({
        method: 'get',
        url: that.base + 'm2c.scm/web/dealer/report/7/days/sell/money',
        data: {
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
        },
        success: function (result) {
          if(result.status === 200){
            //that.reportDataList = result.content
            that.datas = result.content
            for(let i=0;i<that.datas.length;i++){
              that.xAxis.push(that.datas[i].time)
              that.reportDataList.push(that.datas[i].sellMoney)
              that.reportRatioList.push(that.datas[i].ratioFlag==0?'--':that.datas[i].ratio)
            }
            // that.setEchart(result.content)
            that.setEchart()
          }else{
            that.$message({
              type: 'info',
              message: result.errorMessage
            })
          }
        }
      })
    },
    analysis(data){
      var end_obj = []
      for(let i in data){
        var obj = {name:'', datas:[]}
        obj.name = data[i].time
        obj.value = data[i]['sellMoney']
        obj.datas[0] = data[i]['ratio']
        obj.datas[1] = data[i]['ratioFlag']
        end_obj.push(obj);
      }
      return end_obj
    },
    setEchart(data){
      // 引入 ECharts 主模块
      let that = this
      let echarts = require('echarts');
      this.chartLine = echarts.init(document.getElementById('chartLine'))
      let option ={
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              //backgroundColor: '#0086FF'
            }
          },
          formatter: function(a){
            return ('<p>'+a[0].name
              +'</br><i class="blueRadius"> </i>销售金额: '+a[0].data.value
              +'<br><i class="yellowRadius"> </i>环比: '+ (a[0].data.datas[1]==0 ? '--': a[0].data.datas[0]+'%')
              +'</p>'
            );
            
            //return (JSON.stringify(a)[0].name);
          }, 
        },
        itemStyle:{
            normal:{
                color: "#0086FF"
            }
        },
        lineStyle:{
            normal:{
                width:10,  //连线粗细
                color: "#0086FF"  //连线颜色
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
            data : that.xAxis
          }
        ],
        yAxis : [
          {
            type : 'value',
            boundaryGap : false,
            min: 0,
            data : that.reportDataList
          }
        ],
        series : [
          {
            //name:'销售金额',
            type:'line',
            symbol:'circle',//拐点样式 circle|rectangle|triangle|diamond|emptyCircle|emptyRectangle|emptyTriangle|emptyDiamond|image://+图片
            symbolSize: 8,//拐点大小
            //stack: '金额',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            areaStyle: {normal: {
              color:'#0086FF'
            }},
            data:[],
          },
        ]
      }
      let datas = that.datas;
      var name = [];
      for(let i in datas){
        name.push(datas[i].time);
      }
      option.series[0].data = that.analysis(that.datas);
      //option.tooltip.formatter = that.analysis(that.datas)
      option.xAxis.data = name;
      console.log(option.series[0].data)
      this.chartLine.setOption(option)
    },
    // 获取销售排行
    getDataList(){
      let that = this
      // let date=new Date
      // let year=date.getFullYear()
      // let month=date.getMonth()+1
      // month =(month<10 ? "0"+month:month);
      // let mydate = (year.toString()+month.toString())
      //that.month = mydate
      that.$.ajax({
        method: 'get',
        url: that.base + 'm2c.scm/web/goods/sales/list/top5',
        data: {
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
          month:(that.month).slice(0,4).toString()+(that.month).slice(5,7).toString()
          //val.slice(0,4).toString() + val.slice(5,7).toString()
        },
        success: function (result) {
          if(result.status === 200){
            that.dataList = result.content
            for(let i=0;i<result.content.length;i++){
              that.dataList[i].index = i+1
            }
            console.log(that.dataList)
          }else{
            that.$message({
              type: 'info',
              message: result.errorMessage
            })
          }
        }
      })
    },
  },
  mounted () {
    this.getShopTime()
    this.getGoodNum()
    this.getSellMoney()
    this.getReportData()
    this.getReportDataList()
    this.getDataList()
    this.amount()
    let that = this
    let date=new Date
    let year=date.getFullYear()
    let month=date.getMonth()+1
    month =(month<10 ? "0"+month:month);
    let mydate = (year.toString()+'-'+month.toString())
    this.month = mydate
    // this.$nextTick(()=>{
    //   this.setEchart()
    // })
    console.log(this.month)
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
  .echart .box{padding-bottom:20px;text-align: left;position:relative;}
  .echart .box p{position:absolute;margin-left:20px;margin-top:15px;color:#666;}
  .echart .box p.x{margin-top:315px;right:20px;}
  .dataInfo .box .el-col{padding:10px 0 ;}
  .height300{height:290px; text-align:left;
    p{text-align: center;}
  .pl26{padding-left:26px;}
    i.no1,i.no2,i.no3{float: left;margin-left:-26px;display:inline-block;width:16px;height:16px;line-height:40px;background:url(../../../assets/images/no.1.png) no-repeat;margin-top:2px;}
    i.no2{background:url(../../../assets/images/no.2.png) no-repeat;}
    i.no3{background:url(../../../assets/images/no.3.png) no-repeat;}
    span{display: inline-block;font-size: 14px;color:#999;float:left;margin-left:26px;}
    span.red{color:#FD3242;}
  }
  .el-tabs__header .el-tabs__active-bar,.el-tabs__header .el-tabs__item{padding:0 20px;}
  .box div.icon{text-align: left;top:2px;}
  .box div.icon div.tips p{text-align: left;padding:0;}
  .echart{top:-105px;}
  a.more{color:#667991;font-size:12px; text-decoration:underline;position:absolute;z-index:2;}
  div.icon div.tips{padding:0 6px;}
  .echart .box div.icon div.tips p{position:static;}
  div.icon div.tips p{margin:0;}
</style>
<style>
.dataInfo .el-tabs__nav{float:right !important;}
.dataInfo .el-tabs__item{height:50px;line-height:50px;}
.dataInfo .el-input{margin:0;float:right;}
.dataInfo .el-tabs__nav-wrap::after{height:1px;}
.dataInfo .el-tabs__content{width:100%; overflow:visible;}
/* .dataInfo #tab-first,.dataInfo #tab-second,.dataInfo .el-tabs__active-bar{width:96px;text-align:center;padding:0;} */
.building{
  font-size:20px;color:#666;
  padding:240px 0;
  line-height:40px;
  margin-top:100px;
  text-align: center;
  background:url(../../../assets/images/image_upgrade.png) no-repeat center top;
}
.height300 .el-table td,.height300 .el-table th{padding:8px 0;padding-left:20px;}
.height300 .el-table td{background:#fff;}
.height300 .el-table{border-left:1px solid #E6E8F2;border-right:1px solid #E6E8F2;}
.box .is-disabled{width:80px;height:25px;border: 1px solid #CCCCCC;border-radius: 3px;display:inline-block;line-height:24px;font-size:13px;padding:0;}
#chartLine i{display:inline-block;width:10px;height:10px;background:#F5BD23;border-radius:5px;margin-right:4px;}
#chartLine i.blueRadius{background:#0086FF;}
#chartLine p{padding:0px 10px;padding-top:5px; line-height:24px;}
</style>
