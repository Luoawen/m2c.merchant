<template>
  <div class="content clear">
    <div class="searcWrap">
      <el-select v-model="searchParams.orderStatus" placeholder="订单状态">
        <el-option
          v-for="orderStatu in orderStatuses"
          :key="orderStatu.value"
          :label="orderStatu.label"
          :value="orderStatu.value">
        </el-option>
      </el-select>
      <el-select v-model="searchParams.afterSellStatus" placeholder="售后状态">
        <el-option
          v-for="afterSellStatu in afterSellStatuses"
          :key="afterSellStatu.value"
          :label="afterSellStatu.label"
          :value="afterSellStatu.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" value-format="yyyy-MM-dd"
        @change="timeCheck">
      </el-date-picker>
      <el-input v-model="searchParams.condition" placeholder="输入商品名称/订单号/支付单号/收货人号码" title="输入商品名称/订单号/支付单号/收货人号码"></el-input>
      <el-button type="primary" size="medium" @click="search()"   class="btn-search">搜索</el-button>
      <el-button type="primary" size="medium" icon="el-icon-download" @click.native="exportSearch()" class="fr">导出</el-button>
      <span class="ml10 gjsort" @click="Advancedsearch">高级搜索</span>
      <!-- 高级搜索 -->
      <div class="soloSearchBox" v-if="Advancedshow">
        <h4>高级搜索<a class="close" @click="Advancedshow=!Advancedshow"></a></h4>
        <div class="searcWrap mess">
          <el-row :gutter="20">
            <el-col :span="3" class="alginRight">关键词：</el-col>
            <el-col :span="9">
              <el-input v-model="searchParams.condition" placeholder="输入商品名称/订货号/支付单号/收货人号码/商家名称/商家ID" title="输入商品名称/订货号/支付单号/收货人号码/商家名称/商家ID"></el-input>
            </el-col>
            <el-col :span="3" class="alginRight">下单时间</el-col>
            <el-col :span="9">
              <el-date-picker style="padding-bottom:1px;"
                v-model="time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="yyyy-MM-dd"
                @change="timeCheck">
              </el-date-picker><!--时间-->
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3" class="alginRight">订单状态：</el-col>
            <el-col :span="9">
              <el-select v-model="searchParams.orderStatus" placeholder="订单状态">
                <el-option
                  v-for="orderStatu in orderStatuses"
                  :key="orderStatu.value"
                  :label="orderStatu.label"
                  :value="orderStatu.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3" class="alginRight">评论状态：</el-col>
            <el-col :span="9">
              <el-select v-model="searchParams.commentStatus" placeholder="评论状态">
                <el-option
                  v-for="commentStatu in commentStatus"
                  :key="commentStatu.value"
                  :label="commentStatu.label"
                  :value="commentStatu.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3" class="alginRight">售后状态：</el-col>
            <el-col :span="9">
              <el-select v-model="searchParams.afterSellStatus" placeholder="售后状态">
                <el-option
                  v-for="afterSellStatu in afterSellStatuses"
                  :key="afterSellStatu.value"
                  :label="afterSellStatu.label"
                  :value="afterSellStatu.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3" class="alginRight">支付方式：</el-col>
            <el-col :span="9">
              <el-select v-model="searchParams.payWay" placeholder="支付方式">
                <el-option
                  v-for="isPayDeposit in isPayDeposits"
                  :key="isPayDeposit.value"
                  :label="isPayDeposit.label"
                  :value="isPayDeposit.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3" class="alginRight">开发票：</el-col>
            <el-col :span="9">
              <el-select v-model="searchParams.invoiceType" placeholder="开发票">
                <el-option
                  v-for="invoiceType in invoiceTypes"
                  :key="invoiceType.value"
                  :label="invoiceType.label"
                  :value="invoiceType.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3" class="alginRight">广告位：</el-col>
            <el-col :span="9">
              <el-select v-model="searchParams.mediaInfo" placeholder="广告位">
                <el-option
                  v-for="mediaInfo in mediaInfos"
                  :key="mediaInfo.value"
                  :label="mediaInfo.label"
                  :value="mediaInfo.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mt20">
            <el-col :span="20" :offset="3">
              <el-button type="primary" size="medium" @click="search()" class="btn-search">搜索</el-button>
              <el-button size="medium" @click="clearAll()">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="good_info ">
      <table id="table" class="notetable">
        <thead>
          <tr class="clear">
            <td class="a1">商品信息</td>
            <td class="a2">单价/元</td>
            <td class="a3">数量</td>
            <td class="a4">售后状态</td>
            <td class="a5">订单总额/元</td>
            <td class="a6">下单时间</td>
            <td class="a7">收货人</td>
            <td class="a8">订货单状态</td>
          </tr>
        </thead>
        <!-- 在tbody上v-for循环 -->
        <tbody v-if="totalCount==0">
          <tr style="height: 50px;text-align: center;">
            <td colspan="8">暂无数据</td>
          </tr>
        </tbody>
        <tbody v-for="(item,index) in resultdata" v-if="totalCount>0">
          <tr>
            <td colspan="8" class="bt clear">
              <span class="ml10">订货号：{{item.dealerOrderId}}</span>  <span style="color: #ccc">&nbsp;|</span></span> <span class="ml10" v-show="item.payNo != '' ? true : false">支付单号：{{item.payNo}}</span>
              <div class="detail" @click="gotoDetail(item.dealerOrderId, item.orderId)">查看详情</div>
            </td>
          </tr>
          <tr class="content clear" >
            <td colspan="8" class="clear">
              <div class="cont col-sm-8 " style="width:59%;">
                <div class="fl border_r" style="width:100%;min-height:100px" v-for="goodsItem in item.goodsList">
                <div class="a1 fl" id="a1" style="width:50%;">
                  <div class="a1_img mr10 fl"><img :src="JSON.parse(goodsItem.goodsImage == ''? '[]': goodsItem.goodsImage)[0]"/></div>
                  <div class="fl">
                    <div class="wose wid"><i v-if="goodsItem.isChange==1" class="changeGood"></i>{{goodsItem.goodsName}}</div>
                    <div class="blue" v-if="goodsItem.skuName != ''">规格：{{goodsItem.skuName}}</div>
                  </div>
                </div>
                <div class="a2 fl mt20" id="a2" style="width: 14%;">
                  <template v-if="goodsItem.isSpecial==1">特惠价 {{(goodsItem.specialPrice/100).toFixed(2)}}</template>
                  <p :class="{'lineThrough':goodsItem.isSpecial==1}">{{(goodsItem.discountPrice/100).toFixed(2)}}</p>
                </div>
                <div class="a3 fl mt20" id="a3" style="width: 18%;text-align: center;padding-right: 40px;">
                  {{goodsItem.sellNum}}
                </div>
                <div class="a4 fl mt10" style="width:14%;text-align:center;">
                  <!-- 有几种情况的不同表现方 -->
                  <div style="">
                    <div class="">
                      {{goodsItem.afOrderType==0?(goodsItem.afStatus==-1?'售后已取消':goodsItem.afStatus==3?'商家已拒绝':goodsItem.afStatus==1?'待商家同意':goodsItem.afStatus==4?'待顾客寄回商品':(goodsItem.afStatus==5||goodsItem.afStatus==6)?'待商家发货':goodsItem.afStatus==7?'待顾客收货':goodsItem.afStatus>=8?'售后已完成':'--'):goodsItem.afOrderType==1?(goodsItem.afStatus==-1?'售后已取消':goodsItem.afStatus==3?'商家已拒绝':goodsItem.afStatus==0?'待商家同意':goodsItem.afStatus==4?'待顾客寄回商品':(goodsItem.afStatus==5||goodsItem.afStatus==6)?'待商家确认退款':goodsItem.afStatus>=9?'售后已完成':'--'):goodsItem.afOrderType==2?(goodsItem.afStatus==-1?'售后已取消':goodsItem.afStatus==3?'商家已拒绝':goodsItem.afStatus==2?'待商家同意':goodsItem.afStatus==4?'待商家确认退款':goodsItem.afStatus>=9?'售后已完成':'--'):'--'}}
                      </div>
                    <div class="mt5"><button class="a4_btn" @click="agreeShow(goodsItem.saleAfterNo, goodsItem.afStatus, item.orderStatus, goodsItem.afOrderType, goodsItem.backMoney, item.orderFreight, item.dealerOrderId, goodsItem.skuId)" v-show="goodsItem.afStatus<=2 && goodsItem.afStatus>-1">同意</button></div>
                    <div class="mt5"><button class="a4_btn" @click="refuseShow(goodsItem.saleAfterNo)" v-show="goodsItem.afStatus>=0 && goodsItem.afStatus<=2">拒绝</button></div>
                  </div>
                  <div v-show="goodsItem.afStatus==3">
                    <img src="../../../assets/images/ico_explain.png" :title="goodsItem.rejectReason" width="16px"></img>
                  </div>
                </div>
              </div>
              </div>
              <div class="cont col-sm-4" style="width:40%;">
                <div class="a5" style="width:25%;">
                  {{((item.goodsMoney + item.orderFreight - item.dealerDiscount - item.plateDiscount)/100).toFixed(2)}}
                </div>
                <div class="a6 mt10" style="width:28%;">
                  {{date_format(new Date(item.createdDate), 'yyyy-MM-dd hh:mm:ss')}}
                </div>
                <div class="a7 mt10" style="width:28%">
                  <div>{{item.revPerson}}</div>
                  <div>{{item.revPhone}}</div>
                </div>
                <div class="a8" style="width:10%">
                  <span>{{item.orderStatus==0?'待付款': item.orderStatus==1? '待发货' : item.orderStatus==2?'待收货' : item.orderStatus==3 ? '已完成' : item.orderStatus==4 ? '交易完成' : item.orderStatus==5?'交易关闭':item.orderStatus==-1?'已取消': '--'}}</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="block" style="margin: 20px;float:left;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!-- &lt;!&ndash; 是否同意 或者拒绝浮层弹框 &ndash;&gt; -->
    <div class="agreetc"  style="" v-show="Agreeshow===true||Refuseshow===true||TowAgreeshow===true">

    </div>
    <!-- &lt;!&ndash; 是否同意弹框 &ndash;&gt; -->
    <div class="agreetc_content" v-show="agreeApplyShow===true" >
      <div class="agreetc_header">
        <span>提示</span>
        <span class="fr" @click="agreeApplyShow=false;Agreeshow=false;">X</span>
      </div>
      <div class="agreetc_body">确认同意{{afStatus==0?'退货':afStatus==1?'换货':afStatus==2?'退款' : '--'}}申请？</div>
      <div class="agreetc_footer">
        <button type="button" class="btn save" @click="agreeApply()">确认</button>
        <button type="button" class="btn cancel" @click="agreeApplyShow=false;Agreeshow=false;">取消</button>
      </div>
    </div>
    <!-- &lt;!&ndash; 拒绝原因 &ndash;&gt; -->
    <div class="refuse_content" v-show="Refuseshow===true">
      <div class="refuse_header">
        <span>拒绝理由</span>
        <span class="fr" @click="Refuseshow=false">X</span>
      </div>
      <div class="refuse_body">
        <textarea id="refuse_txt" maxlength="100" minlength="1" placeholder="请输入1-100个字符" ></textarea>
      </div>
      <div class="refuse_footer">
        <button type="button" class="btn save"  @click="handleReject">拒绝</button>
        <button type="button" class="btn cancel" @click="Refuseshow=false">取消</button>
      </div>
    </div>
    <!-- v-show="TowAgreeshow===true" -->
    <div class="TowAgreeshow_content" v-show="TowAgreeshow===true" >
      <div class="agreetc_header">
        <span>提示</span>
        <span class="fr" @click="TowAgreeshow=false">X</span>
      </div>
      <div class="TowAgreeshow_body">
        <input type="number" placeholder="填入要退的运费" id="rt_freight"></input>
        <div class="tit01">是否确认{{afStatus==0?'退货':afStatus==1?'换货':afStatus==2?'退款':''}}？</div>
        <div class="tit02">{{afStatus==0?'款项将原路退回给顾客':afStatus==2?'款项将原路退回给顾客':''}}</div>
      </div>
      <div class="agreetc_footer">
        <button type="button" class="btn save" >确认</button>
        <button type="button" class="btn cancel" @click="TowAgreeshow=false">取消</button>
      </div>
    </div>

    <div class="pop_content"  v-show="showRt===true">
      <div class="hptczp_header">
        <span>同意申请</span>
        <span class="fr" @click="Agreeshow=false;showRt=false">X</span>
      </div>
      <div class="hptczp_body">
        <div class="linh40">
          <!-- <span class=" wid80">
            <span style="color: red;">*</span>
            运费退款
          </span>
          <span> <el-input-number v-model="pRtFreight" :controls="false" :min="-1" :max="orderFreight" ></el-input-number></span>
          <span>元</span> -->
          <span class=" wid80">
            <span style="color: red;">*</span>
            运费退款
          </span>
          <span> <el-input v-model="pRtFreight" type="number" :controls="false" :min="-1" :max="(orderFreight - hasRtFreight/100)" :placeholder="'最多可退'+(orderFreight - hasRtFreight/100) +'元'" @change="pRtFreightChange"></el-input></span>
          <span>元</span>
          <P class="pl10">运费退款不能大于订单实际剩余运费</P>
        </div>
        <div class="linh40 pl10">
          <span class="wid80">售后金额</span>
          <span>{{(backMoney/100).toFixed(2)}}元</span>
        </div>
        <div class="linh40 pl10">
          <span class=" wid80">售后总额</span>
          <span>{{(backMoney/100 + rtFreight).toFixed(2)}}元</span>
        </div>
      </div>
      <div class="hptczp_footer">
        <button type="button" class="btn save" @click="agreeRtMoneyApply" >确认</button>
        <button type="button" class="btn cancel" @click="Agreeshow=false;showRt=false" >取消</button>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent,no-trailing-spaces,semi-spacing,no-unused-vars,space-infix-ops,no-multi-spaces,quotes,no-undef,space-before-blocks,semi,no-eval */

  export default {
    name: '',
    data () {
      return {
        isIndeterminate: true,
        amout: '',
        number: '',
        is_Success: false,
        Advancedshow: false,
        Agreeshow: false,
        Refuseshow: false,
        TowAgreeshow: false,
        resultdata: [],
        selDealerOrder:[],
        pageSize: 10,
        pageIndex: 1,
        totalCount: 0,
        dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,//'JXS42ACB6D352E9417FBBCF03908219AAF1',
        // 搜索参数
        searchParams: { orderStatus: '', afterSellStatus: '', startTime: '', endTime: '', condition: '',orderClassify:'', payWay:'', hasMedia:'', invoiceType: '',commentStatus:''},
        afStatus : -2,
        saleAfterNo : '',
        orderStatuses:[{value:'',label:'订单状态'},{value:'0',label:'待付款'},{value:'1',label:'待发货'},{value:'2',label:'待收货'},{value:'3',label:'已完成'},{value:'4',label:'交易完成'},{value:'5',label:'交易关闭'},{value:'-1',label:'已取消'}],
        afterSellStatuses:[{value:'',label:'售后状态'},{value:'20',label:'待商家同意'},{value:'21',label:'待顾客寄回商品'},{value:'22',label:'待商家确认退款'},{value:'23',label:'待商家发货'},{value:'24',label:'待顾客收货'},{value:'25',label:'售后已完成'},{value:'26',label:'售后已取消'},{value:'27',label:'商家已拒绝'}],
        commentStatus:[{value:'',label:'评论状态'},{value:'0',label:'待评论'},{value:'1',label:'已评论'}],
        isPayDeposits:[{value:'',label:'支付方式'},{value:'1',label:'支付宝'},{value:'2',label:'微信'}],// 支付方式
        invoiceTypes:[{value:'',label:'开发票'},{value:'0',label:'个人'},{value:'1',label:'公司'}], // 发票
        mediaInfos:[{value:'',label:'广告位'},{value:'0',label:'无'},{value:'1',label:'有'}], // 广告位
        time:''
        ,pRtFreight:null
        ,rtFreight:0
        ,hasRtFreight:0
        ,showRt: false
        ,agreeApplyShow: false
        ,backMoney:0
        ,orderFreight:0
        ,isChangePage:false //搜索时是否是页码切换请求 以判断是否要重置页码
      }
    },
    methods: {
      //
      pRtFreightChange(){
        let that = this
        var re = /^[0-9]+\.?[0-9]*$/
        if (!re.test(that.pRtFreight)) {
          that.pRtFreight = 0
          console.log("a")
          console.log(that.pRtFreight)
        }else{
          let hasRtFreight = (that.orderFreight - that.hasRtFreight)/100
          if(parseFloat(that.pRtFreight) > hasRtFreight){
            that.pRtFreight = hasRtFreight
            that.show_tip("不能大于实际剩余运费")
            that.$nextTick(function () {
            that.rtFreight = parseFloat(that.pRtFreight)
          })
            return
          }
          if(parseFloat(that.pRtFreight) < 0){
            console.log("fushu")
            that.show_tip("不能为负数")
            return
          }
          that.$nextTick(function () {
            that.rtFreight = parseFloat(that.pRtFreight)
          })
        }
        console.log(that.pRtFreight)
      },
      //时间赋值
      timeCheck () {
        let that = this
        if(that.time != null){
          that.searchParams.startTime = that.time[0]
          that.searchParams.endTime = that.time[1]
        }else{
          that.searchParams.startTime = ''
          that.searchParams.endTime = ''
        }
      },
    // 获取全部订单信息
      agreeShow (afterNo, _st, _orderStatus, afType, backMoney, ordFreight, dOrderId, skuID) {
      var that = this;
      that.afStatus=_st;
      that.saleAfterNo = afterNo;
      that.Agreeshow = true;
      that.backMoney = backMoney;
      that.orderFreight = ordFreight / 100;
      console.log(afType + ":===orderStatus ==" + _orderStatus);
      if (afType == 2 && _orderStatus == 1 && that.orderFreight>0) {
        that.getHasReturnFreight(dOrderId, skuID);
        that.showRt = true;
        return ;
      }
      that.agreeApplyShow = true;
    },
    getHasReturnFreight(dOrderId, skuId){
      let that = this
      that.$.ajax({
        type: 'GET',
        url: this.base + 'm2c.scm/dealerorderafter/cost/freight',
        data: {
          token: sessionStorage.getItem('mToken'),
          isEncry: false,
          dealerOrderId: dOrderId,
          userId: JSON.parse(sessionStorage.getItem('mUser')).userId,
          skuId: skuId
        },
        success: function (result) {
          if (result.status === 200){
            that.hasRtFreight = result.content.costFt;
          }
        }
      })
    },
    getDealerOrders () {
      let that = this
      if(!that.isChangePage){
        that.currentPage = 1
      }
      that.is_Success = false
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/dealerorder/dealerorderlist',
        //url: 'http://localhost:8080/m2c.scm/dealerorder/dealerorderlist',
        data: {
          dealerId: that.dealerId
          ,orderStatus: that.searchParams.orderStatus
          ,afterSellStatus: that.searchParams.afterSellStatus
          ,startTime: that.searchParams.startTime
          ,endTime: that.searchParams.endTime
          ,condition: that.searchParams.condition.replace(/\s+/g,"")
          ,payWay: that.searchParams.payWay
          ,invoice: that.searchParams.invoiceType
          ,commentStatus: that.searchParams.commentStatus,
          hasMedia:that.searchParams.hasMedia
          ,pageNum: that.pageIndex
          ,rows: that.pageSize
        },
        success: function (res) {
          var resultData = res.content;
          if(res.content.length == 0){
           // that.show_tip("没有匹配的记录")
          }
          that.totalCount = res.totalCount;
          that.resultdata= resultData;
          console.log(res);
        }
      })
       that.isChangePage = false
    },
    exportSearch (){
      let that = this
      if (that.searchParams.startTime > that.searchParams.endTime) {
        that.show_tip('开始时间不能大于结束时间')
        return
      }
      let url=that.localbase + 'm2c.scm/order/export/dealerorderlist?dealerId='+JSON.parse(sessionStorage.getItem('mUser')).dealerId+
        '&orderStatus='+that.searchParams.orderStatus+
        '&afterSellStatus='+that.searchParams.afterSellStatus+
        '&condition='+that.searchParams.condition+
        '&startTime='+that.searchParams.startTime+
        '&endTime='+that.searchParams.endTime+
        '&payWay='+that.searchParams.payWay+
        '&invoice='+that.searchParams.invoiceType+
        '&commentStatus='+that.searchParams.commentStatus;
      window.location.href=url
    },
    /*exportSearch (){
      let that = this
      if (that.searchParams.startTime > that.searchParams.endTime) {
        that.show_tip('开始时间不能大于结束时间')
        return
      }
      //searchParams: { orderStatus: '', afterSellStatus: '', startTime: '', endTime: '', condition: '',orderClassify:'', payWay:'', hasMedia:'', invoice: '',commentStatus:''},
      let url=that.localbase + 'm2c.scm/order/export/dealerorderlist?dealerId='+JSON.parse(sessionStorage.getItem('mUser')).dealerId+
        '&orderStatus='+that.searchParams.orderStatus+
        '&afterSellStatus='+that.searchParams.afterSellStatus+
        '&startTime='+that.searchParams.startTime+
        '&endTime='+that.searchParams.endTime+
        '&condition='+that.searchParams.condition+
        '&payWay='+that.searchParams.goodsClassifyId+
        '&commentStatus='+that.searchParams.commentStatus+
        '&hasMedia='+that.searchParams.hasMedia+
        '&orderClassify='+that.searchParams.orderClassify+'&invoice='+that.searchParams.invoice;
      window.location.href=url
    },*/
    refuseShow (afterNo) {
      var that = this
      that.Refuseshow = true
      that.saleAfterNo = afterNo;
    },
    towAgreeshow () {
      var that = this
      that.TowAgreeshow = true
    },

    timeBox () {
      this.is_Success = true
    },
    search () {
        let that=this;
      that.pageIndex = 1;
      this.getDealerOrders()
      that.Advancedshow = false

    },
    Advancedsearch () {
      var that = this;
      that.Advancedshow = true
    }
    ,handleSizeChange (sz) {
        let that = this;
        that.pageSize = sz;
        that.getDealerOrders();
      }
      ,handlePageChange (sz) {
        let that = this;
        that.pageIndex = sz;
        that.isChangePage = true
        that.getDealerOrders();
      }
      ,gotoDetail(dealerOrId, orderId) {
        let that = this
        var path='dealerOrDtl';
        //sessionStorage.setItem('dealerOrderId', dealerOrId);
        that.$router.push({name : path,query: {dealerOrderId: dealerOrId, orderId:orderId}})
        //that.$goRoute({name:'dealerOrDtl',});
      }
      ,clearAll() {
        let that = this;
        that.searchParams.orderStatus= '';
        that.searchParams.afterSellStatus='';
        that.searchParams.startTime= '';
        that.searchParams.endTime= '';
        that.searchParams.condition= '';
        that.searchParams.orderClassify='';
        that.searchParams.payWay='';
        that.searchParams.hasMedia='';
        that.searchParams.invoiceType='';
        that.searchParams.commentStatus='';
        that.searchParams.orderStatus1='';
        that.searchParams.afterSellStatus='';
        that.searchParams.condition1= '';
        that.searchParams.startTime1= '';
        that.searchParams.endTime1= '';
        that.time = ''
      }
      ,agreeApply() {
        let that = this;
        that.$.ajax({
          type: 'put',
          url: that.localbase + 'm2c.scm/order/dealer/agree-apply-sale',
          //url: 'http://localhost:8080/m2c.scm/dealerorder/dealerorderlist',
          data: {
            dealerId: that.dealerId
            ,saleAfterNo: that.saleAfterNo,
            userId: JSON.parse(sessionStorage.getItem('mUser')).userId
          },
          success: function (res) {
            //var resultData = res.content;
            if (res.status == 200) {
              that.getDealerOrders();
            }
            else if(res.status === 103) {
              that.show_tip('已不符合售后申请同意无效！')
            }
            that.agreeApplyShow = false;
            that.Agreeshow = false;
          }
        });
      }
      ,checkClick(index) {
        let that = this;
        var dId = that.resultdata[index].dealerOrderId;
        if(that.$("input[name='ck" + index + "']").prop("checked")) {
          that.selDealerOrder.push(dId);
        }
        else {
          var ct = -1;
          for(var i=0; i<that.selDealerOrder.length; i++){
            if (dId == that.selDealerOrder[i])
              ct = i;
          }
          if (ct != -1)
          that.selDealerOrder.splice(ct);
        }
        //console.log(that.selDealerOrder);
      }
      ,checkAll(val) {
        let that = this;
        var len = that.resultdata.length;
        for (var i = 0; i < len; i++) {
          //console.log(typeof(that.$("input[name='ck" + i + "']").prop("checked")));
          if(that.$("input[name='ck" + i + "']").prop("checked") != val)
            that.$("input[name='ck" + i + "']").click();
        }
      }
      ,handleReject() {
        let that = this;
        var reasonVal = that.$("#refuse_txt").val();
        if (reasonVal.length > 200) {
          that.show_tip("原因输入太长，不能大于200字!");
          return;
        }
        that.$.ajax({
          type: 'PUT',
          url: that.base + 'm2c.scm/order/dealer/reject-apply-sale',
          //url: 'http://localhost:8080/m2c.scm/order/dealer/reject-apply-sale',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            saleAfterNo: that.saleAfterNo,
            rejectReason: reasonVal,                     // 拒绝原因，中文
            rejectReasonCode: 99,    // 拒绝原因编码
            userId: JSON.parse(sessionStorage.getItem('mUser')).userId,
            dealerId: that.dealerId
          },
          success: function (result) {
            if (result.status === 200){
              // 获取订单操作列表
              that.getDealerOrders();
            }
            that.Refuseshow = false;
          }
        })
      }
      ,agreeRtMoneyApply () {
        // 同意退款申请，未来发货时需要输入的金额
        let that = this
        console.log(that.pRtFreight)
        if ( that.pRtFreight === '') {
          that.show_tip('退款运费不能为空！');
          return;
        }
        if(that.pRtFreight < 0 ){
          that.pRtFreight = 0
        }
        that.$.ajax({
          type: 'PUT',
          url: this.base + 'm2c.scm/order/dealer/agree-apply-sale',
          //url: 'http://localhost:8080/m2c.scm/order/dealer/agree-apply-sale',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            saleAfterNo:that.saleAfterNo,
            userId:JSON.parse(sessionStorage.getItem('mUser')).userId,
            dealerId:that.dealerId,
            rtFreight:that.pRtFreight
          },
          success: function (result) {
            if (result.status === 200){
              // 获取订单操作列表
              that.getDealerOrders();
            }
            that.Agreeshow = false;
            that.showRt = false;
          }
        });
      }
  },
  mounted () {
    this.getDealerOrders()
  }
  }

</script>
<style lang="scss" scoped>
  .content{
    .soloSearchBox{position:absolute;top:0;left:0;height:auto;padding:20px;width:100%;background:#fff;z-index:2;
      h4 a.close{
        opacity:1;display:inline-block;width:24px;height:24px;float:right;background:url(../../../assets/images/ico_close.png) no-repeat center center;
      }
      .searcWrap{width:100%;height:auto;position:relative;}
      .mess{
        margin-top: 30px;padding:0px 40px;padding-bottom:30px;background:#fff;
        h4{
          line-height:50px;
          margin-bottom:10px;
          font-size:16px;
          color:#333;
        }
        .inline{display:inline-block;line-height:50px;}
        .modify{margin-left:10px;line-height:50px;width:16px;height:16px;background:url(../../../assets/images/ico_compile.png) no-repeat center center;}
      }
      .alginRight{text-align: right; line-height:50px;color:#666;}
      .formControl{display:inline-block;width:100%;height:36px;padding:6px 12px; line-height:50px;font-size:14px;background:#fff;border:1px solid #ccc;border-radius:4px;}
    }
    .dropdown{
      display: inline-block;
      font-size: 16px;
      line-height: 84px;
      .sort{
        display: inline;
        margin: 0 20px 0 30px;
        font-size: 14px;
        color: #333333;
        line-height: 30px;
      }
      .state{
        display: inline;
        margin-right: 20px;
        font-size: 14px;
        color: #333333;
      }
      .gjsort{
        font-size: 14px;
        color: #667991;
      }
      .dropdown-menu {
        li{
          line-height: 30px;
          padding-left: 25px;
          position: relative;
          i{
            font-size: 10px;
            color: gray;
            padding-left: 15px;
            position: absolute;
            top: 8px;
            right: 19px;
          }
        }
      }
    }
    .search_cell{
      display: inline-block;
      position: relative;
      font-size: 14px;
      color: #333333;
      span{
        font-size: 16px;
        margin-right: 25px;
        i{
          font-size: 20px;
          padding-left: 10px;
        }
      }
      .time{
        width: 600px;
        height: 61px;
        position: absolute;
        left: 0px;
        top: 55px;
        z-index: 10;
        .form-control{
          width: 139px;
          height: 31px;
          position: absolute;
          top: 12px;
        }
        .start{
          left: 20px;
        }
        .separator{
          position: absolute;
          left: 162px;
          top: 12px;
        }
        .end{
          right: 20px;
        }
      }
    }
    .search{
      display: inline-block;
      position: relative;
      .inp{
        width: 380px;
        height: 39px;
        color: #333333;
        padding-left: 10px;
      }
      i{
        width: 50px;
        height: 39px;
        line-height: 39px;
        text-align: center;
        border: 1px solid #ccc;
        background-color: rgba(242, 242, 242, 1);
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    span{
      cursor: pointer;
    }
    .add{
      margin-top: 31px;
      margin-right: 15px;
    }
    .operation{
      margin-top: 31px;
      margin-right: 15px;
    }
    .good_info {
      background: #fff;
      margin-top: 10px;
      .notetable{
        min-width:1000px;
        width:100%;
        min-height: 40px;
        border: 1px solid #e5e5e5;
        .a1{
          width:29%;
          display: inline-block;
          box-sizing: border-box;
          padding-left:10px;
        }
        .a2{
          width: 10%;
          display: inline-block;
        }
        .a3{
          width: 9%;
          display: inline-block;
        }
        .a4{
          width:10% ;
          display: inline-block;

        }
        .a4_btn{
            border: 1px solid #CCCCCC;
            border-radius: 2px;
            padding-left: 20px;
            padding-right: 20px;
            line-height: 24px;
            height: 24px;
            font-size: 12px;
            color: #333333;
            background: initial;
          }
          .ico_explain{
            width: 16px;
            height: 16px;
            background: url(../../../assets/images/ico_explain.png) no-repeat center;
            display: inline-block;
          }
        .a5{
          width: 10%;
          display: inline-block;
        }
        .a6{
          width:10% ;
          display: inline-block;
        }
        .a7{
          width:10% ;
          display: inline-block;
        }
        .a8{
          width:8% ;
          display: inline-block;
        }
        thead td.a1{padding-left:40px;}
        thead td.a3{padding-left:47px;}
        thead td.a4{padding-left:37px;}
        thead td.a5{padding-left:40px;}
        thead td.a7{padding-left:36px;}
        thead td.a8{padding-left:40px;}
        .b1{
        	width: 40%;
        	 display: inline-block;
        }
        .b2{
        	width: 400px;
        	display: table-cell;
        	text-align: center;
        }
        .b3{
        	width: 300px;
        	display: table-cell;
        	text-align: center;
        }
        .b4{
        	width: 400px;
        	display: table-cell;
        	text-align: center;
        }
        thead{
          background: #DFE9F6;
          tr{
            height: 40px;
            line-height: 40px;
          }
        }
        .red_fh{
          color: red;
        }
        tbody{
          height: 40px;
          .content{
            background: rgba(244,245,250,0.00);
            box-shadow: 0 -1px 0 0 #E5E5E5;
            padding-top: 20px;
            padding-bottom: 20px;
            .cont{

            }
            td{
              /*padding-bottom: 10px;*/
            }
          }
          .a1_img{
            padding-left: 25px;
            img{
              width: 50px;
              height: 50px;
              margin-top: 20px;
              margin-bottom: 20px;
            }
          }
          .wid{
            width: 180px;
            height: 40px;
            font-size: 14px;
            color: #333333;
            line-height: 20px;
            margin-top: 16px;
            margin-bottom: 5px;
          }
          .blue{
            font-size: 12px;
            color: #999999;
          }
          .bt{
            background: #F4F5FA;
            height: 40px;
            line-height: 40px;
            padding-right: 30px;
            .detail{
              font-size: 13px;
              color: #667991;
              cursor: pointer;
              display:inline-block;
              margin-left:10px;
            }
          }
          p.lineThrough{text-decoration:line-through;font-size:12px;color:#999;}
        }
        td{
          padding-left: 30px;
        }
        tr{

        }
      }
    }
  }
  .agreetc{
    width: 100%;
    height: 100%;
    display: block;
    position: fixed;
    left: 0px;
    top: 0px;
    background: #000;
    z-index: 999;
    opacity: 0.5;

  }
  .agreetc_content,.refuse_content,.TowAgreeshow_content{
    width: 400px;
    height: 280px;
    background: #fff;
    z-index: 9999;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -180px;
    background: #FFFFFF;
    border-radius: 4px;
    .agreetc_header,.refuse_header{
      width:100%;
      height: 50px;
      background: #DFE9F6;
      padding-left: 20px;
      padding-right: 20px;
      font-size: 16px;
      span{
        display: inline-block;
        line-height: 50px;
      }
    }
    .TowAgreeshow_body{
      text-align: center;
      margin-top: 50px;
      margin-bottom: 20px;

      .tit01{
        font-size: 20px;
        color: #333333;
      }
      .tit02{
        margin-top: 10px;
        font-size: 14px;
        color: #333333;
      }
    }
    .agreetc_body{
      padding-left: 20px;
      padding-right: 20px;
      background: #FFFFFF;
      margin-top: 10px;
      text-align: center;
      font-size: 20px;
      color: #333333;
      line-height: 150px;
    }
    .refuse_body{
      padding-left: 20px;
      padding-right: 20px;
      background: #FFFFFF;
      margin-top: 10px;
      textarea{
        width: 100%;
        height: 100%;
        border: 1px solid #E5E5E5;
        width: 360px;
        height: 140px;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }
    .agreetc_footer,.refuse_footer{
      height: 80px;
      padding-top: 10px;
      padding-left: 50%;
      .btn {
        width: 80px;
        height: 30px;
        border: none;
        border-radius: 2px;
        color: #fff;
      }
      .save {
        margin-left: -110px;
        background: #0086FF;
      }
      .cancel {
        margin-left: 40px;
        background: #FFF;
        border: 1px solid #CCCCCC;
        color: #444;
      }

    }
  }
  /*公用样式*/
  .mt5{
    margin-top: 5px;
  }
  .mt10{
    margin-top: 10px;
  }
  .mt20{
    margin-top: 20px;
  }
  .ml10{
    margin-left: 10px;
  }
  .ml20{
    margin-left: 20px;
  }
  .mr20{
    margin-right: 20px;
  }
  .mr10{
    margin-right: 10px;
  }
  .mb10{
    margin-bottom: 10px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .ml30{
    margin-left: 30px;
  }
  .poi1{
    position: relative;
  }
  .poi2{
    position: absolute;
  }
  .poi3{
    position: fixed;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .wose{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .clear{
    clear: both;
    overflow: hidden;
  }
  .border_r{
    border-right: 1px solid #e5e5e5;
  }
  .border_b{
    border-bottom: 1px solid #e5e5e5;
  }
  .input_check {
    position: absolute;
    width: 20px;
    height: 20px;
    visibility: hidden;
  }
  .input_check + label {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 2px;
    background:url(../../../assets/images/ico_default01.png) no-repeat center;
  }
  .input_check:checked + label {
    display: inline-block;
    width: 15px;
    height: 15px;
    background:url(../../../assets/images/ico_select.png) no-repeat center;
  }
  .zIndex2{z-index:21;}
  .icon{width:40px;height:40px;z-index:11;display:inline-block;}
  .timeIcon{background:url(../../../assets/images/ico_calendar@2x.png) no-repeat center bottom;background-size:19px 20px;}
  .searchIcon{background:url(../../../assets/images/ico_search.png) no-repeat center center;background-size:20px 20px;}

  .pop_content{
    width: 400px;
    height: 280px;
    background: #fff;
    z-index: 9999;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -140px;
    background: #FFFFFF;
    border-radius: 4px;
    .hptczp_header{
      width:100%;
      height: 50px;
      background: #DFE9F6;
      padding-left: 20px;
      padding-right: 20px;
      span{
        display: inline-block;
        line-height: 50px;
      }
    }
    .hptczp_body{
      padding-left: 20px;
      padding-right: 20px;
      background: #FFFFFF;
      margin-top: 10px;
      textarea{
        width: 100%;
        height: 100%;
        border: 1px solid #E5E5E5;
        width: 360px;
        height: 140px;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
      }
      p{
        margin-left:78px;
        color:rgb(107,107,107);
        font-size: 12px;
        line-height: 18px;
      }
    }
    .hptczp_footer{
      height: 80px;
      padding-top: 10px;
      padding-left: 50%;
      .btn {
        width: 80px;
        height: 30px;
        border: none;
        border-radius: 2px;
        color: #fff;
      }
      .save {
        margin-left: -110px;
        background: #0086FF;
      }
      .cancel {
        margin-left: 40px;
        background: #FFF;
        border: 1px solid #CCCCCC;
        color: #444;
      }

    }
    .linh40{
      line-height: 40px;
    }
    .wid80{
      width: 80px;
      display: inline-block;
    }
    .pl10{
      padding-left: 10px;
    }
  }
</style>
