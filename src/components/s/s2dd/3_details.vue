<template>
  <div class="detail">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="售后单详情" name="first">
        <div class="customerdetail_container">
          <div class="detail_tit" v-show="orderDetail.status==3">已拒绝顾客售后申请</div>
          <div class="detail_tit02" v-show="orderDetail.status==0||orderDetail.status==1||orderDetail.status==2">顾客发起售后申请，请处理</div>
          <div class="detail_tit03" v-show="orderDetail.status==4">待顾客寄回商品</div>
          <div class="detail_tit03" v-show="orderDetail.status==5">顾客寄回商品中，查看物流信息</div>
          <div class="detail_top mt20 clear">
            <div class="col-sm-4 detail_cen">
              <div>
                <span class="tit01">售后状态:</span>
                <span style="color: red;font-size: 15px" class="ml20">{{orderDetail.status==0?'申请退货':orderDetail.status==1?'申请换货':orderDetail.status==2?'申请退款':orderDetail.status==3?'拒绝':orderDetail.status==4?'已同意申请':orderDetail.status==5?'客户已寄出':orderDetail.status==6?'商家已收到':orderDetail.status==7?'商家已寄出':orderDetail.status==8?'客户已收到':orderDetail.status==9?'已同意退款':orderDetail.status==10?'已退款':orderDetail.status==11?'售后完成':orderDetail.status==11?'售后关闭':orderDetail.status==-1?'已取消':'-'}}</span>
              </div>
              <div>
                <span class="tit01">售后单号:</span>
                <span class="ml20">{{orderDetail.afterSelldealerOrderId}}</span>
              </div>
              <div>
                <span class="tit01">申请原因:</span>
                <span class="ml20">{{orderDetail.reason}}</span>
              </div>
              <div>
                <span class="tit01">关联订货号:</span>
                <span class="ml20">{{orderDetail.orderId}}</span>
              </div>
              <div>
                <span class="tit01">订单总额:</span>
                <span class="ml20">{{(orderDetail.orderTotalMoney/100).toFixed(2)}}元（含运费<span>{{(orderDetail.orderFreight/100).toFixed(2)}}</span>元）</span>
              </div>
            </div>
            <div class="col-sm-4 detail_cen">
              <div>
                <span class="tit01">售后期望:</span>
                <span class="ml20">{{orderDetail.orderType==0?'换货':orderDetail.orderType==1?'退货退款':orderDetail.orderType==2?'仅退款':'-'}}</span>
              </div>
              <div>
                <span class="tit01">售后金额:</span>
                <span class="ml20 redcolor">{{orderDetail.orderType==0?'--':((orderDetail.backMoney + orderDetail.backFreight)/100).toFixed(2)}}元（含运费{{orderDetail.orderType==0?'0':(orderDetail.backFreight/100).toFixed(2)}}元）</span>
              </div>
              <div>
                <span class="tit01">申请时间:</span>
                <span class="ml20">{{orderDetail.createdDate}}</span>
              </div>
              <div>
                <span class="tit01" v-show="orderDetail.rejectReason!=''">拒绝原因:</span>
                <span class="ml20">{{orderDetail.rejectReason}}</span>
              </div>
            </div>
          </div>
          <table class="mt20 detail_table">
            <thead>
            <tr>
              <td class="a1">商品信息</td>
              <td class="a2">广告位信息</td>
              <td class="a3">单价</td>
              <td class="a4">数量</td>
              <td class="a5">商品金额/元</td>
              <td class="a5">售后金额/元</td>
              <td class="a6">操作</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td class="a1 clear">
                <div class="a1tab fl mr20"><img :src="JSON.parse(orderDetail.goodsInfo.goodsImage == ''? '[]': orderDetail.goodsInfo.goodsImage)[0]"/></div>
                <div class="a1tit fl">
                  <div class="wobse top">
                    {{orderDetail.goodsInfo.goodsName}}
                  </div>
                  <div class="btm">
                    规格： {{orderDetail.goodsInfo.skuName}}
                  </div>
                </div>
              </td>
              <td class="a2">{{orderDetail.goodsInfo.mediaResId != ''?(typeof(mediaResInfos[orderDetail.goodsInfo.mediaResId])!='undefined'?mediaResInfos[orderDetail.goodsInfo.mediaResId].name : ''):''}}
                <br>{{orderDetail.goodsInfo.mediaResId != ''?(typeof(mediaResInfos[orderDetail.goodsInfo.mediaResId])!='undefined'?mediaResInfos[orderDetail.goodsInfo.mediaResId].cateName:''):''}}</td>
              <td class="a3">{{(orderDetail.goodsInfo.price/100).toFixed(2)}}</td>
              <td class="a4">{{orderDetail.goodsInfo.sellNum}}</td>
              <td class="a5">{{(orderDetail.goodsInfo.totalPrice/100).toFixed(2)}}</td>
              <td class="a5">{{(orderDetail.backMoney/100).toFixed(2)}}</td>
              <td class="a6">
                <!--状态，0申请退货,1申请换货,2申请退款,3拒绝,4同意(退换货),5客户寄出,6商家收到,7商家寄出,8客户收到,9同意退款, 10确认退款,11交易关闭
                 {{orderDetail.orderType==0?'换货':orderDetail.orderType==1?'退货':orderDetail.orderType==2?'仅退款':'-'}}-->

                <div class="oprs" v-show="orderDetail.status==0 || orderDetail.status==1||orderDetail.status==2">
                  <el-button size="mini" @click="handleAgree()">同意申请</el-button>
                </div>


                <!-- 用户期望退款--> <!-- 1.商户同意售后 2.商户同意退款 3.商户确认退款 -->
                <div class="oprs" v-show="orderDetail.status==4 && orderDetail.orderType==2"><!-- 商户同意退款 -->
                  <el-button size="mini" @click="agreedRefund()">同意退款</el-button>
                </div>
                <!--<div class="oprs" v-show="orderDetail.status==9 && orderDetail.orderType==2">
                  <el-button size="mini" round @click="confirmRefund()">确认退款</el-button>
                </div>-->


                <!-- 用户期望退货--> <!-- 1.商户同意售后 2.用户返回货物 3.商家确认收货 4.商户同意退款 5.商户确认退款 -->
                <div class="oprs" v-show="orderDetail.status==5 && orderDetail.orderType==0">
                  <el-button size="mini" @click="confirmReceipt()">确认收货</el-button>
                </div>

                <div class="btm" v-show="orderDetail.status==6 && orderDetail.orderType==1">
                  <el-button size="mini" @click="agreedRefund()">同意退款</el-button>
                </div>

                <div class="btm" v-show="orderDetail.status==9 && orderDetail.orderType==0">
                  <el-button size="mini" @click="confirmRefund()">确认退款</el-button>
                </div>

                <!-- 用户期望换货--> <!-- 1.商户同意售后 2.用户返回货物 3.商家确认收货 4.商户填写物流信息 5.商户确认发货 -->
                <div class="oprs" v-show="orderDetail.status==5 && orderDetail.orderType==1">
                  <el-button size="mini" @click="confirmReceipt()">确认收货</el-button>
                </div>

                <div class="oprs" v-show="orderDetail.status==6 && orderDetail.orderType==0">
                  <el-button size="mini" @click="shipment()">发货</el-button>
                </div>

                <div class="oprs" v-show="orderDetail.status==0 || orderDetail.status==1||orderDetail.status==2">
                  <el-button size="mini" @click="handleRejected()">拒绝申请</el-button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </el-tab-pane>
      <el-tab-pane label="售后物流" name="second">
        <div class="logistics" >

          <div class="col-sm-4 detail_cen" style="line-height: 40px;">
            <div >
              <span class="tit01">售后状态:</span>
              <span class="ml20">{{logistics.status==0?'申请退货':logistics.status==1?'申请换货':logistics.status==2?'申请退款':logistics.status==3?'拒绝申请':logistics.status==4?'同意申请':logistics.status==5?'客户寄出':logistics.status==6?'商家收到':logistics.status==7?'商家寄出':logistics.status==8?'客户收到':logistics.status==9?'同意退款':logistics.status==10?'已退款':logistics.status==11?'售后完成':logistics.status==12?'售后关闭':logistics.status==-1?'已取消':'-'}}</span>
            </div>
            <div>
              <span class="tit01">售后单号:</span>
              <span class="ml20">{{logistics.afterSellOrderId}}</span>
            </div>
            <div>
              <span class="tit01">物流公司:</span>
              <span class="ml20">{{logistics.expressName}}</span>
            </div>
            <div>
              <span class="tit01">物流单号:</span>
              <span class="ml20">{{logistics.expressNo}}</span>
            </div>

          </div>

        </div>

      </el-tab-pane>
      <el-tab-pane label="操作记录" name="third">
         <div class="ops_red">
           <div class="ops_tabs">

             <el-table
               :data="operatingRecords"
               style="width: 100%">
               <el-table-column
                 prop="optTime"
                 label="操作时间">
                 <template slot-scope="scope">{{date_format(new Date(scope.row.optTime), 'yyyy-MM-dd hh:mm:ss')  }}</template>
               </el-table-column>
               <el-table-column
                 prop="optContent"
                 label="操作内容">
               </el-table-column>
               <el-table-column
                 prop="optUserStr"
                 label="操作人">
               </el-table-column>
             </el-table>
           </div>

         <div class="page_pus" style="margin-top: 20px;float: right;margin-right: 30px;height: 60px;">
           <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="currentPage"
             :page-sizes="[5, 10, 20, 30]"
             :page-size="pageRows"
             layout="total, sizes, prev, pager, next, jumper"
             :total="totalCount">
           </el-pagination>
         </div>

         </div>


      </el-tab-pane>
    </el-tabs>
<div>

  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
     width="700"
    :modal-append-to-body="false" >

    <table style="margin: auto;border: 1px solid #e7e7e7;width: 100%;">
      <thead style="background: #DFE9F6; line-height: 40px; height: 40px;">
          <tr>
            <td class="a1">商品信息</td>
            <td class="a3">单价</td>
            <td class="a4">数量</td>
            <td class="a5">商品金额/元</td>
            <td class="a5">售后金额/元</td>
          </tr>
      </thead>
      <tbody>
      <tr>
        <td class="a1 clear">
          <div class="a1tab fl mr20"><img :src="JSON.parse(orderDetail.goodsInfo.goodsImage == ''? '[]': orderDetail.goodsInfo.goodsImage)[0]" style="width: 60px ;height: 60px"/></div>
          <div class="a1tit fl">
            <div class="wobse top">
              {{orderDetail.goodsInfo.goodsName}}
            </div>
            <div class="btm">
              规格： {{orderDetail.goodsInfo.skuName}}
            </div>
          </div>
        </td>
        <td class="a3">{{(orderDetail.goodsInfo.price).toFixed(2)}}</td>
        <td class="a4">{{orderDetail.goodsInfo.sellNum}}</td>
        <td class="a5">{{(orderDetail.goodsInfo.totalPrice).toFixed(2)}}</td>
        <td class="a5">{{(orderDetail.backMoney).toFixed(2)}}</td>
      </tr>
      </tbody>
    </table>

    <div class="col-sm-4 detail_cen" style="width:100%;height:350px;">
      <div style="padding-left: 46px;font-size: 15px; font-weight: 800; line-height: 46px;">
        <span class="tit01" style="margin-right: 10px;">配送方式:</span>
        <el-radio v-model="shipmentForm.expressWay" label="0">物流发货</el-radio>
        <el-radio v-model="shipmentForm.expressWay" label="1" >自有物流</el-radio>
      </div>
      <el-form :model="shipmentForm" v-show="shipmentForm.expressWay==0">
        <el-form-item label="物流公司:" :label-width="formLabelWidth">
          <el-select v-model="shipmentForm.expressCode" filterable placeholder="请选择物流公司" @change="selectShipment(shipmentForm.expressCode)">
            <el-option
              v-for="item in shipments"
              :key="item.expressCode"
              :label="item.expressName"
              :value="item.expressCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号:" :label-width="formLabelWidth">
          <el-input v-model="shipmentForm.expressNo" auto-complete="off" width="200" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth">
          <el-input v-model="shipmentForm.noted" auto-complete="off" width="200" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="shipmentForm" v-show="shipmentForm.expressWay==1">
        <el-form-item label="配送员姓名:" :label-width="formLabelWidth">
          <el-input v-model="shipmentForm.expressPerson" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配送员手机号:" :label-width="formLabelWidth">
          <el-input v-model="shipmentForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="运单号:" :label-width="formLabelWidth">
          <el-input v-model="shipmentForm.expressNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth">
          <el-input v-model="shipmentForm.noted" auto-complete="off" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
    </div>



    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleShipment()">确 定</el-button>
    </span>
  </el-dialog>
  </div>

    <div class="clsMask" v-show="showMask===true"  style="">
    </div>
    <div class="pop_content"  v-show="showRt===true">
      <div class="hptczp_header">
        <span>同意申请</span>
        <span class="fr" @click="showMask=false;showRt=false">X</span>
      </div>
      <div class="hptczp_body">
        <div class="linh40">
          <span class=" wid80">
            <span style="color: red;">*</span>
            运费退款
          </span>
          <span> <el-input-number v-model="pRtFreight" :controls="false" :min="0" :max="orderDetail.orderFreight/100" ></el-input-number></span>
          <span>元</span>
        </div>
        <div class="linh40 pl10">
          <span class="wid80">售后金额</span>
          <span>{{(orderDetail.backMoney/100).toFixed(2)}}元</span>
        </div>
        <div class="linh40 pl10">
          <span class=" wid80">售后总额</span>
          <span>{{(orderDetail.backMoney/100 + pRtFreight).toFixed(2)}}元</span>
        </div>
      </div>
      <div class="hptczp_footer">
        <button type="button" class="btn save" @click="agreeRtMoneyApply" >确认</button>
        <button type="button" class="btn cancel" @click="showMask=false;showRt=false" >取消</button>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        pageRows:5,
        currentPage: 1,
        totalCount:0,
        activeName: 'first',
        orderDetail:{
          afterSelldealerOrderId:'',
          backMoney: 0,
          createdDate: '',
          dealerdealerOrderId: '',
          goodsInfo:{},
          orderTotalMoney:0,
          orderType:0,
          reason:'',
          status:0,
          orderFreight:0,
          backFreight:0
          ,dealerId:''
          ,doStatus: -2
        },
        operatingRecords:[],
        logistics:{
          afterSellOrderId:'',
          expressName:'',
          expressNo:'',
          goodsInfo:'',
          status:0
        },
        dialogVisible: false,
        // 搜索参数
        search_params: { orderNo: '', keywordType: '', statusFlag: sessionStorage.getItem('statusFlag'), payWay: '', startTime: sessionStorage.getItem('startTime'), endTime: sessionStorage.getItem('endTime'), keyword: '' },
        dialogVisible: false,
        shipmentForm: {
          expressNo: '',
          expressName: '',
          expressCode: '',
          noted:'',
          expressPerson: '',
          phone: '',
          expressWay:'0',
        },
        formLabelWidth: '120px',
        shipments:[],
        _map: {}
        ,pRtFreight:0
        ,showMask: false
        ,showRt: false,
        goodses: [],
        expressNum:0,
        totalData:'',
        mediaResInfos:{}
      }
    },
    methods: {
      // 获取全部订单信息
      handleClick(tab, event) {
        if (tab.paneName==='first'){
          let that = this
          that.loadOrderDetail()

        } else if (tab.paneName==='third'){
          let that = this
          that.operatingRecord()
        }
        else if (tab.paneName==='second'){
          let that = this
          that.afterselllogistics()
        }
      }
      ,loadOrderDetail () {
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/dealerorderafter/dealerorderafterselldetail',
          //url: 'http://localhost:8080/m2c.scm/dealerorderafter/dealerorderafterselldetail',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            afterSellOrderId:sessionStorage.getItem('afterSale:afterSellOrderId')
            ,userId: JSON.parse(sessionStorage.getItem('mUser')).userId
          },
          success: function (result) {
            if (result.status === 200){
              // 获取商品详情
              let _content = result.content
              console.log(_content);
              that.orderDetail.afterSelldealerOrderId = _content.afterSellDealerOrderId
              that.orderDetail.backMoney = _content.backMoney
              that.orderDetail.createdDate = that.date_format(new Date(_content.createdDate), 'yyyy-MM-dd hh:mm:ss')
              that.orderDetail.orderId = _content.orderId
              that.orderDetail.goodsInfo=_content.goodsInfo
              that.mediaId = that.orderDetail.goodsInfo.mediaResId
              that.orderDetail.orderTotalMoney=_content.orderTotalMoney
              that.orderDetail.orderFreight=_content.orderFreight
              that.orderDetail.backFreight=_content.backFreight
              that.orderDetail.orderType=_content.orderType
              that.orderDetail.reason=_content.reason
              that.orderDetail.status=_content.status
              that.orderDetail.rejectReason=_content.rejectReason
              that.orderDetail.dealerId = _content.dealerId;
              that.orderDetail.doStatus = _content.doStatus;
              that.setReturnData(result.content)
            }
          }
        })
       },
      setReturnData:function(data){
        let that = this
        that.setGoodsTable(data.goodsInfo, data)
      },
      setGoodsTable:function(goodses,totalData){
        let that = this
        that.totalData = totalData;
        that.expressNum = 0;
        that.goodses = goodses
        var resIds = '';
        /*that.goodses.forEach(function(val, index) {
          val.freight = val.freight/100;
          //val.mediaResId='18AD16F1F35C569E4C1785DF22FA47652789';
          if(typeof(val.mediaResId)=='undefined' || val.mediaResId==null ||  val.mediaResId=='')
            ;//val.mediaResId = '-'
          else {
            if (index > 0)
              resIds += ',';
            resIds += '"'+val.mediaResId+'"';
          }
          that.expressNum += val.sellNum;
        });*/
          that.goodses.freight = that.goodses/100;
          if(typeof(that.goodses.mediaResId)=='undefined' || that.goodses.mediaResId==null ||  that.goodses.mediaResId=='')
            ;//val.mediaResId = '-'
          else {
            resIds += '"' + that.goodses.mediaResId + '"';
          }
          that.expressNum += that.goodses.sellNum;
        that.getMediaResInfo(resIds);
      }
      ,operatingRecord() {
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/order/logs/res',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            orderId:that.orderDetail.afterSelldealerOrderId,
            rows: that.pageRows,                     // 每页多少条数据
            pageNum: that.currentPage,    // 请求第几页*/
          },
          success: function (result) {
            //console.log('fanjc===' + result)
            if (result.status === 200){
              if (typeof(result.content) == 'string')
                return;
              that.operatingRecords = result.content;
              var uIds = '';
              //that._map = {};
              var ct = 0;
              for (var i=0; i< that.operatingRecords.length; i++) {
                var usId = that.operatingRecords[i].optUser;
                  that.operatingRecords[i].optUserStr = '--';
                  if (uIds.indexOf(usId) == -1) {
                    if (ct>0)
                      uIds +=',';
                    ct ++;
                    uIds += usId;
                  }
              }
              that.totalCount = result.totalCount;
              console.log('fanjc======' + uIds)
              that.getUserByIds(uIds);
            }
          }
        })
      }
      ,handleSizeChange(val) {
        let that = this
        that.pageRows=val
        that.operatingRecord();
      }
      ,handleCurrentChange(val) {
        let that = this
        that.currentPage=val
        that.operatingRecord();
      }
      ,afterselllogistics() {
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/aftersellorder/manager/aftreselllogistics',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            afterSellOrderId: that.orderDetail.afterSelldealerOrderId
          },
          success: function (result) {
            if (result.status === 200){
              //售后物流信息
              let _content = result.content
              that.logistics.afterSellOrderId=_content.afterSellOrderId;
              that.logistics.expressName=_content.expressName;
              that.logistics.expressNo=_content.expressNo;
              that.logistics.goodsInfo=_content.goodsInfo;
              that.logistics.status=_content.status;
            }
          }
        })
      }
      ,handleAgree(){
        let that = this
        if (that.orderDetail.orderType == 2 && that.orderDetail.doStatus == 1) {
            that.showMask = true;
            that.showRt = true;
            return ;
        }
        let title= that.orderDetail.orderType==0?'是否同意换货申请?':that.orderDetail.orderType==1?'是否同意退货申请?':that.orderDetail.orderType==2?'是否同意退款申请?':'-'
        let titleAisle= that.orderDetail.orderType==0?'同意申请换货':that.orderDetail.orderType==1?'同意申请退货':that.orderDetail.orderType==2?'申请退款':'-'
          that.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            let that = this
            that.$.ajax({
              type: 'PUT',
              url: this.base + 'm2c.scm/order/dealer/agree-apply-sale',
              //url: 'http://localhost:8080/m2c.scm/order/dealer/agree-apply-sale',
              data: {
                token: sessionStorage.getItem('mToken'),
                isEncry: false,
                saleAfterNo:that.orderDetail.afterSelldealerOrderId,
                userId:JSON.parse(sessionStorage.getItem('mUser')).userId,
                dealerId:that.orderDetail.dealerId
              },
              success: function (result) {
                if (result.status === 200){
                  // 获取订单操作列表
                  that.loadOrderDetail()
                }
              }
            })
          }).catch(() => {
            that.$message({
            type: 'info',
            message: titleAisle+'已取消'
          });
        });
      }//商户同意售后
      , agreeRtMoneyApply () {
       // 同意退款申请，未来发货时需要输入的金额
        let that = this
        that.$.ajax({
          type: 'PUT',
          url: this.base + 'm2c.scm/order/dealer/agree-apply-sale',
          //url: 'http://localhost:8080/m2c.scm/order/dealer/agree-apply-sale',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            saleAfterNo:that.orderDetail.afterSelldealerOrderId,
            userId:JSON.parse(sessionStorage.getItem('mUser')).userId,
            dealerId:that.orderDetail.dealerId,
            rtFreight:that.pRtFreight
          },
          success: function (result) {
            if (result.status === 200){
              // 获取订单操作列表
              that.loadOrderDetail()
            }
            that.showMask = false;
            that.showRt = false;
          }
        });
      }
      ,handleRejected(){
        let that = this
        let title= that.orderDetail.orderType==0?'是否拒绝换货申请?':that.orderDetail.orderType==1?'是否拒绝退货申请?':that.orderDetail.orderType==2?'是否拒绝退款申请?':'-';
        let titleAisle = that.orderDetail.orderType==0?'拒绝申请换货':that.orderDetail.orderType==1?'拒绝申请退货':that.orderDetail.orderType==2?'拒绝申请退款':'-';
        that.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           that.$prompt('请输入'+titleAisle+'理由', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputType:'textarea',
           }).then(({ value }) => {

             if (value.length > 200) {
               that.show_tip("原因输入太长，不能大于200字!");
               return;
             }
             that.$.ajax({
               type: 'PUT',
               url: this.base + 'm2c.scm/order/dealer/reject-apply-sale',
               //url: 'http://localhost:8080/m2c.scm/order/dealer/reject-apply-sale',
               data: {
                 token: sessionStorage.getItem('mToken'),
                 isEncry: false,
                 saleAfterNo:that.orderDetail.afterSelldealerOrderId,
                 rejectReason: value,                     // 拒绝原因，中文
                 rejectReasonCode: 99,    // 拒绝原因编码
                 userId:JSON.parse(sessionStorage.getItem('mUser')).userId,
                 dealerId:that.orderDetail.dealerId
               },
               success: function (result) {
                 if (result.status === 200){
                   // 获取订单操作列表
                   that.loadOrderDetail()
                 }
               }
             })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: titleAisle+'已取消'
            });
          });

        }).catch(() => {
          that.$message({
            type: 'info',
            message: titleAisle+'已取消'
          });
        });
      }//商户拒绝售后
      ,agreedRefund(){
        let that = this
        that.$.ajax({
          type: 'PUT',
          url: this.base + 'm2c.scm/order/aftersale/dealer/agree-rt-money',
          //url: 'http://localhost:8080/m2c.scm/order/aftersale/dealer/agree-rt-money',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            saleAfterNo:that.orderDetail.afterSelldealerOrderId,
            userId:JSON.parse(sessionStorage.getItem('mUser')).userId,
            skuId:that.orderDetail.goodsInfo.skuId
          },
          success: function (result) {
            if (result.status === 200){
              // 获取订单操作列表
              that.loadOrderDetail()
            }
          }
        })
      }//商户同意退款
      ,confirmRefund(){
        let that = this
        that.$.ajax({
          type: 'PUT',
          url: this.base + 'm2c.scm/order/aftersale/dealer/confirm-rt-money',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            saleAfterNo:that.orderDetail.afterSelldealerOrderId,
            userId:JSON.parse(sessionStorage.getItem('mUser')).userId,
            skuId:that.orderDetail.goodsInfo.skuId
          },
          success: function (result) {
            if (result.status === 200){
              // 获取订单操作列表
              that.loadOrderDetail()
            }
          }
        })
      }//商户确认退款
      ,confirmReceipt(){
        let that = this
        that.$.ajax({
          type: 'PUT',
          url: this.base + 'm2c.scm/order/aftersale/dealer-rev',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            saleAfterNo:that.orderDetail.afterSelldealerOrderId,
            userId:JSON.parse(sessionStorage.getItem('mUser')).userId,
            skuId:that.orderDetail.goodsInfo.skuId
          },
          success: function (result) {
            if (result.status === 200){
              // 获取订单操作列表
              that.loadOrderDetail()
            }
          }
        })
      }//商户确认收货
      ,shipment(){
        let that = this
        that.dialogVisible = true
        that.$.ajax({
          type: 'GET',
          url: this.base + 'm2c.scm/order/dealer/express',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
          },
          success: function (result) {
            if (result.status === 200){
              // 物流列表
              that.shipments= result.content
            }
          }
        })
      }//商户发货
      ,selectShipment(value){
        let that = this
        let choosenItem = this.shipments.filter(item => item.expressCode === value)[0];
        that.shipmentForm.expressName=choosenItem.expressName
      }
      ,handleShipment(){

        //shipmentForm.expressWay==0
        if(that.shipmentForm.expressWay==0){
            if(that.shipmentForm.expressCode == '' || that.shipmentForm.expressCode == undefined){
              that.show_tip("请选择物流公司")
            }
            if(that.shipmentForm.expressNo == '' || that.shipmentForm.expressNo == undefined){
              that.show_tip("请输入物流单号")
            }
        }
        if(that.shipmentForm.expressWay==1){
          if(that.shipmentForm.expressPerson == '' || that.shipmentForm.expressPerson == undefined){
            that.show_tip("请输入配送员姓名")
          }
          if(that.shipmentForm.phone == '' || that.shipmentForm.phone == undefined){
            that.show_tip("请输入配送员电话")
          }
          if(shipmentForm.expressNo == '' || shipmentForm.expressNo == undefined){
            that.show_tip("请输入运单号")
          }
        }

        let that = this
        that.$.ajax({
          type: 'PUT',
          url: this.base + 'm2c.scm/order/aftersale/dealer/ship',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            saleAfterNo:that.orderDetail.afterSelldealerOrderId,
            userId:JSON.parse(sessionStorage.getItem('mUser')).userId,
            skuId:that.orderDetail.goodsInfo.skuId,
            expressNo:that.shipmentForm.expressNo,
            expressName:that.shipmentForm.expressName,
            expressCode:that.shipmentForm.expressCode,
            expressPerson:that.shipmentForm.expressPerson,
            expressWay:that.shipmentForm.expressWay,
            phone:that.shipmentForm.phone,
          },
          success: function (result) {
            if (result.status === 200){
              // 物流列表
              that.dialogVisible = false;
              that.loadOrderDetail();
            }
          }
        })
        //dialogVisible = false
      }
      ,getUserByIds(ids) {
        console.log('fanjc======getUserByIds')
        let that = this;
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.users/user/getUserInfoByIds',
          data: {
            token: sessionStorage.getItem('mToken'),
            userIds: ids
          },
          success: function (result) {
            //console.log('fanjc======')
            console.log(result);
            if (result.status === 200){
              that._map = {};
              var sz = result.content.length;
              for(var i=0; i<sz; i++) {
                var obj = result.content[i];
                that._map[obj.userId] = obj.mobile + '[' + obj.userName + ']';
              }
              for (var i=0; i< that.operatingRecords.length> 0; i++) {
                if (typeof(that._map[that.operatingRecords[i].optUser]) != 'undefined')
                  that.operatingRecords[i].optUserStr = that._map[that.operatingRecords[i].optUser];
                else
                  that.operatingRecords[i].optUserStr = that.operatingRecords[i].optUser;
              }
            }
          }
        });
      }
      ,getMediaResInfo(resIds) {
        if (resIds == '') {
          return;
        }
        let that = this;
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.media/mres/byIdList/mu',
          data: {
            token: sessionStorage.getItem('mToken'),
            mresIdList: '[' + resIds + ']'
          },
          success: function (result) {
            console.log(result);
            if (result.status == 200) {
              result.content;
              that.mediaResInfos = {};

              for (var i=0; i<result.content.length; i++) {
                var a = {};
                a.name = result.content[i].mresName;
                a.cateName = result.content[i].cateName;
                that.mediaResInfos[result.content[i].mresId] = a;
              }
              console.log("mediaResInfos:");
              //console.log(that.mediaResInfos);
            }
          }
        });
      }
    },
    mounted () {
      let that = this
      that.loadOrderDetail()
    },
    watch: {
      'shipmentForm.expressWay': {
        handler(code, oldCode) {
            let that = this
            that.shipmentForm.expressPerson=''
            that.shipmentForm.phone=''
            that.shipmentForm.expressNo=''
            that.shipmentForm.expressName=''
            that.shipmentForm.expressCode=''
            that.shipmentForm.noted=''
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss" scoped>
.mt20{
  margin-top: 20px;
}
.redcolor{
  color: red;
}
.mr20{
  margin-right: 20px;
}
.ml20{
  margin-left: 20px;
}
.mt10{
  margin-top: 10px;
}
.mt20{
  margin-top: 20px;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clear{
  clear: both;
  overflow: hidden;
}
.wobse{
overflow:hidden;
text-overflow:ellipsis;
display:-webkit-box;
-webkit-box-orient:vertical;
-webkit-line-clamp:2;
}
.detail{
    /*width: 1583px;*/
    min-height: 84px;
    margin-left: 0px;
  padding-left: 30px;
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
      .detail_table{
        margin: auto;
        border: 1px solid #e7e7e7;
        width: 99%;
        td{
          padding-left: 10px;
        }
        .a1{
          width: 22%;
          padding-top: 20px;
          padding-bottom: 20px;
          .a1tab{
            width: 50px;
            height: 50px;
            img{
              width: 50px;
              height: 50px;
            }
          }
          .a1tit{
            .top{
              width:85%;
              height: 40px;
              line-height: 20px;
              font-size: 14px;
              color: #333333;
            }
            .btm{
              font-size: 12px;
              color: #999999;
            }
          }
        }
        .a2{
          width:11%;
        }
        .a3{
          width:7%;
        }
        .a4{
          width:7%;
        }
        .a5{
          width:8%;
        }
        .a6{
          width:10%;
          .btm{
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            border-radius: 2px;
            width: 60px;
            height: 24px;
            line-height: 24px;
            font-size: 12px;
            color: #333;
            text-align: center;
            cursor: pointer;
          }
        }
        .a7{
          width:7%;
        }
        thead{
          background: #DFE9F6;
          line-height: 40px;
          height: 40px;
        }
      }
      /*width: 1583px;*/
      min-height: 670px;
      .detail_tit{
        height: 60px;
        width: 99%;
        line-height: 60px;
        margin-left: 10px;
        padding-left: 20px;
        background: #FFF9EE;
        font-size: 18px;
        color: #F5A623;
      }
      .detail_tit02{
        height: 60px;
        width: 99%;
        line-height: 60px;
        margin-left: 0px;
        padding-left: 20px;
        background: #FBF5EF;
        font-size: 18px;
        color: #FD3242;
      }
      .detail_top,.logistics{
        .detail_cen{
          .tit01{
            display: inline-block;
            width: 90px;
            height: 40px;
            line-height:40px;
            text-align: right;
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
    .agreetc_content,.refuse_content{
      width: 400px;
      height: 280px;
      background: #fff;
      z-index: 9999;
      position: absolute;
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
}
.clsMask{
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
.pop_content{
  width: 400px;
  height: 280px;
  background: #fff;
  z-index: 9999;
  position: absolute;
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
