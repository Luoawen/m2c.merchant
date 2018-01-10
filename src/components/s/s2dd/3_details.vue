<template>
  <div class="detail content">
    <div class="line"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="售后单详情" name="first">
        <div class="customerdetail_container">
          <div class="detail_tit" v-show="orderDetail.status==3">已拒绝顾客售后申请</div>
          <div class="detail_tit02" v-show="orderDetail.status==0||orderDetail.status==1||orderDetail.status==2">顾客发起售后申请，请处理</div>
          <div class="detail_tit03" v-show="orderDetail.status==4 && orderDetail.orderType!=2">待顾客寄回商品</div>
          <div class="detail_tit03" v-show="orderDetail.status==4 && orderDetail.orderType==2">请及时退款给顾客</div>
          <div class="detail_tit03" v-show="orderDetail.status==5 && orderDetail.orderType==1">顾客已寄回商品，收到寄回商品请及时退款给顾客</div>
          <div class="detail_tit03" v-show="orderDetail.status==5 && orderDetail.orderType==0">顾客已寄回商品，收到寄回商品请及时发货</div>
          <div class="detail_top mt20 clear">
            <div class="col-sm-4 detail_cen">
              <div>
                <span class="tit01">售后状态:</span>
                <span style="color: red;font-size: 15px" class="ml20">
                  <!-- {{orderDetail.status==0?'申请退货退款':orderDetail.status==1?'申请换货':orderDetail.status==2?'申请退款':orderDetail.status==3?'拒绝':orderDetail.status==4?'已同意申请':orderDetail.status==5?'客户已寄出':orderDetail.status==6?'商家已收到':orderDetail.status==7?'商家已寄出':orderDetail.status==8?'客户已收到':orderDetail.status==9?'已同意退款':orderDetail.status==10?'已退款':orderDetail.status==11?'售后完成':orderDetail.status==11?'售后关闭':orderDetail.status==-1?'已取消':'-'}} -->
                  {{orderDetail.orderType==0?(orderDetail.status==-1?'售后已取消':orderDetail.status==3?'商家已拒绝':orderDetail.status==1?'待商家同意':orderDetail.status==4?'待顾客寄回商品':(orderDetail.status==5||orderDetail.status==6)?'待商家发货':orderDetail.status==7?'待顾客收货':orderDetail.status>=8?'售后已完成':'--'):orderDetail.orderType==1?(orderDetail.status==-1?'售后已取消':orderDetail.status==3?'商家已拒绝':orderDetail.status==0?'待商家同意':orderDetail.status==4?'待顾客寄回商品':(orderDetail.status==5||orderDetail.status==6)?'待商家确认退款':orderDetail.status>=9?'售后已完成':'--'):orderDetail.orderType==2?(orderDetail.status==-1?'售后已取消':orderDetail.status==3?'商家已拒绝':orderDetail.status==2?'待商家同意':orderDetail.status==4?'待商家确认退款':orderDetail.status>=9?'售后已完成':'--'):'--'}}
                </span>
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
                <router-link :to="{name:'dealerOrDtl',query:{dealerOrderId: orderDetail.dealerOrderId,orderId: orderDetail.orderId}}" target="_blank"><span class="ml20">{{orderDetail.dealerOrderId}}</span></router-link>
              </div>
              <div>
                <span class="tit01">订单总额:</span>
                <span class="ml20">{{(orderDetail.orderTotalMoney)}}元（含运费<span>{{(orderDetail.orderFreight)}}</span>元）</span>
              </div>
            </div>
            <div class="col-sm-4 detail_cen">
              <div>
                <span class="tit01">售后期望:</span>
                <span class="ml20">{{orderDetail.orderType==0?'换货':orderDetail.orderType==1?'退货退款':orderDetail.orderType==2?'仅退款':'-'}}</span>
              </div>
              <div>
                <span class="tit01">售后总额:</span>
                <span class="ml20 redcolor">{{orderDetail.orderType==0?'--':((parseFloat(orderDetail.backMoney) + parseFloat(orderDetail.backFreight))).toFixed(2)}}元
                  <span v-if="(orderDetail.orderType !=0) && orderDetail.status >= 4">（含运费{{orderDetail.orderType==0?'0':(orderDetail.backFreight)}}元） </span> <span v-if="orderDetail.orderType ==2&& orderDetail.doStatus == 1 && orderDetail.status < 4">（运费待商家确认） </span></span>
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
              <td class="a4">数量</td>
              <td class="a4">单位</td>
              <td class="a3">单价/元</td>
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
                    <i v-if="orderDetail.goodsInfo.isChange==1" class="changeGood"></i>
                    {{orderDetail.goodsInfo.goodsName}}
                  </div>
                  <div class="btm" v-if="orderDetail.goodsInfo.skuName != ''">
                    规格： {{orderDetail.goodsInfo.skuName}}
                  </div>
                </div>
              </td>
              <td class="a2">
                {{orderDetail.goodsInfo.mediaResId != ''?(typeof(mediaResInfos[orderDetail.goodsInfo.mediaResId])!='undefined'?mediaResInfos[orderDetail.goodsInfo.mediaResId].name : '--'):'--'}}
                <br>
                {{orderDetail.goodsInfo.mediaResId != ''?(typeof(mediaResInfos[orderDetail.goodsInfo.mediaResId])!='undefined'?mediaResInfos[orderDetail.goodsInfo.mediaResId].cateName:'--'):'--'}}</td>
              <td class="a4">{{orderDetail.goodsInfo.sellNum}}</td>
               <td class="a4">{{orderDetail.goodsInfo.unitName}}</td>
              <td class="a3" v-if ="orderDetail.goodsInfo.isSpecial==1">
                <p v-if="orderDetail.goodsInfo.isSpecial==1">特惠价 {{(orderDetail.goodsInfo.strSpecialPrice)}}</p>
                <p :class="{'lineThrough':orderDetail.goodsInfo.isSpecial==1}">{{(orderDetail.goodsInfo.strPrice)}}</p>
                <!-- <span >特惠价 {{(orderDetail.goodsInfo.specialPrice)}}</span>
                 <br>
                <p class="lineThrough">{{(orderDetail.goodsInfo.price)}}</p> -->
              </td>
               <td class="a3" v-if ="orderDetail.goodsInfo.isSpecial==0"  >
                <span >{{(orderDetail.goodsInfo.strPrice)}}</span>
              </td>
              <td class="a5">{{(orderDetail.goodsInfo.strTotalPrice)}}</td>
              <td class="a5">{{orderDetail.orderType!=0?(parseFloat(orderDetail.backMoney) + parseFloat(orderDetail.backFreight)).toFixed(2) : '--'}}</td>
              <td class="a6" >
                <!--状态，0申请退货,1申请换货,2申请退款,3拒绝,4同意(退换货),5客户寄出,6商家收到,7商家寄出,8客户收到,9同意退款, 10确认退款,11交易关闭
                 {{orderDetail.orderType==0?'换货':orderDetail.orderType==1?'退货':orderDetail.orderType==2?'仅退款':'-'}}-->
                <div class="oprs" v-show="orderDetail.status==0 || orderDetail.status==1||orderDetail.status==2">
                  <el-button size="mini" @click="handleAgree()">同意申请</el-button>
                </div>
                <!-- 用户期望退款--> <!-- 1.商户同意售后 2.商户同意退款 3.商户确认退款 -->
                <div class="oprs" v-show="orderDetail.status==4 && orderDetail.orderType==2"><!-- 商户同意退款 -->
                  <el-button size="mini" style="margin:-1px 0 0 -1px;" @click="agreedRefund()">确认退款</el-button>
                </div>

                <div class="oprs" v-show="orderDetail.status==5 && orderDetail.orderType==1">
                  <el-button size="mini" @click="agreedRefund()">确认退款</el-button>
                </div>

                <div class="oprs" v-show="orderDetail.status==5 && orderDetail.orderType==0">
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
        <div class="logistics" style="padding-bottom:20px"  >
          <!--没有物流的情况 -->
          <h3  class="building" v-if="orderDetail.status <=4">暂无物流信息<br />
            <el-button type="primary" @click="addLogistics" i-if="logistics.status==4">添加物流信息</el-button>
          </h3>
          <el-row v-if ="orderDetail.status>=5">
           <el-col :span='8'>
              <span class="tit01">售后状态:</span>
              <span class="ml20" >
                {{orderDetail.orderType==0?(logistics.status==-1?'售后已取消':logistics.status==3?'商家已拒绝':logistics.status==1?'待商家同意':logistics.status==4?'待顾客寄回商品':(logistics.status==5||logistics.status==6)?'待商家发货':logistics.status==7?'待顾客收货':logistics.status>=8?'售后已完成':'--'):orderDetail.orderType==1?(logistics.status==-1?'售后已取消':logistics.status==3?'商家已拒绝':logistics.status==0?'待商家同意':logistics.status==4?'待顾客寄回商品':(logistics.status==5||logistics.status==6)?'待商家确认退款':logistics.status>=9?'售后已完成':'--'):orderDetail.orderType==2?(logistics.status==-1?'售后已取消':logistics.status==3?'商家已拒绝':logistics.status==2?'待商家同意':logistics.status==4?'待商家确认退款':logistics.status>=9?'售后已完成':'--'):'--'}}
              </span>
           </el-col>
            <el-col :span='4'>
                <span class="tit01">售后单号:</span><span class="ml20">{{logistics.afterSellOrderId}}</span>
            </el-col>
          </el-row>
          <div class=" detail_cen" style="line-height: 40px;"  v-if ="orderDetail.status>=5">
            <div>
              <table class="mt20 " style="width:80%;border:1px solid rgb(215, 215, 215); ">
                <thead style="background:rgb(223, 233, 246)">
                <tr style="margin-left:40px" >
                  <td class=""><span style="margin-left:20px;width:50%">商品信息</span> </td>
                  <td ><span>换货数</span></td>
                </tr>
                </thead>
                <tbody style="border:1px solid rgb(215, 215, 215);" >
                  <tr>
                    <td class=" clear">
                      <div class="a1tab fl mr20" ><img :src="JSON.parse(orderDetail.goodsInfo.goodsImage == ''? '[]': orderDetail.goodsInfo.goodsImage)[0]"  style="width:80px;height:80px;margin:10px"/></div>
                      <div class="a1tit fl">
                        <div class="wobse top">
                          <i v-if="orderDetail.goodsInfo.isChange==1" class="changeGood"></i>
                          {{orderDetail.goodsInfo.goodsName}}
                        </div>
                        <div class="btm" v-if="orderDetail.goodsInfo.skuName != ''">
                          规格： {{orderDetail.goodsInfo.skuName}}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span> {{orderDetail.goodsInfo.sellNum}}</span>
                    </td>
                  </tr>
                  <tr style="border:1px solid rgb(215, 215, 215);" v-if ="orderDetail.orderType==0 && logistics.status==7" >
                    <td colspan="2">
                      <h3 style="color:rgb(0, 102, 204);padding-left:12px;font-size:16px;" >商家重新发货</h3>
                      <!--退换货（增加寄出的）的情况-->
                      <div class="col-sm-8 detail_cen">
                        <span class="tit01">物流公司:</span> <span class="ml20">{{logistics.status < 5 ? '--' :logistics.status >= 7? logistics.expressName : logistics.backExpressName}}</span>
                      </div>
                      <div class="col-sm-8 detail_cen" >
                        <span class="tit01">物流单号:</span>
                        <span class="ml20" v-if="logistics.status < 5">--</span>
                        <span class="ml20" v-if="logistics.status >= 5 && logistics.status<7">{{logistics.expressNo}}<a class="ml20" @click="getQueryExpress(logistics.expressNo)">查看物流跟踪信息</a></span>
                        <span class="ml20" v-if="logistics.status >= 7">{{logistics.backExpressNo}}<a class="ml20" @click="getQueryExpress(logistics.backExpressNo)">查看物流跟踪信息</a></span>
                      </div>
                    </td>
                  </tr>
                <!--只退货的情况-->
                  <tr style="border:1px solid rgb(215, 215, 215);" >
                    <td colspan="2">
                      <h3 style="color:rgb(0, 102, 204);padding-left:12px;font-size:16px;" >顾客寄回商品</h3>
                      <div class="col-sm-8 detail_cen" style="line-height: 40px;">
                        <div>
                          <span class="tit01">物流公司:</span>
                          <span class="ml20">{{logistics.status < 5 ||logistics.backExpressName == ''? '--' :logistics.backExpressName}}</span>
                        </div>
                        <div>
                          <span class="tit01">物流单号:</span>
                          <span class="ml20" v-if="logistics.status < 5||logistics.backExpressName == ''">--</span>
                          <span class="ml20" v-if="logistics.status >= 5">{{logistics.backExpressNo}}<a class="ml20" @click="getQueryExpress(logistics.backExpressNo)">查看物流跟踪信息</a></span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
        title="商家发货"
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
                  <i v-if="orderDetail.goodsInfo.isChange==1" class="changeGood"></i>
                  {{orderDetail.goodsInfo.goodsName}}
                </div>
                <div class="btm" v-if="orderDetail.goodsInfo.skuName != ''" >
                  规格： {{orderDetail.goodsInfo.skuName}}
                </div>
              </div>
            </td>
            <td class="a3">
              <p  style='margin:0'  v-if="orderDetail.goodsInfo.isSpecial==1">特惠价 {{(orderDetail.goodsInfo.strSpecialPrice)}}</p>
              <p  style='margin:0'   :class="{'lineThrough':orderDetail.goodsInfo.isSpecial==1}">{{(orderDetail.goodsInfo.strPrice)}}</p> 
              <!-- {{(orderDetail.goodsInfo.price)}} -->
            </td>
            <td class="a4">{{orderDetail.goodsInfo.sellNum}}</td>
            <td class="a5">{{(orderDetail.goodsInfo.strTotalPrice)}}</td>
            <td class="a5">{{orderDetail.orderType !=0 ? (orderDetail.backMoney) : '--'}}</td>
          </tr>
          </tbody>
        </table>

        <div class="col-sm-4 detail_cen" style="width:100%;height:350px;">
          <div style="padding-left: 46px;font-size: 15px; font-weight: 800; line-height: 46px;">
            <span class="redcolor">*</span>
            <span class="tit01" style="margin-right: 10px;">配送方式:</span>
            <el-radio v-model="shipmentForm.expressWay" label="0">物流发货</el-radio>
            <el-radio v-model="shipmentForm.expressWay" label="1" >自有物流</el-radio>
          </div>
          <el-form :model="shipmentForm" v-show="shipmentForm.expressWay==0">
            <el-form-item label="物流公司:" :label-width="formLabelWidth" required>
              <el-select v-model="shipmentForm.expressCode" filterable placeholder="请选择物流公司" @change="selectShipment(shipmentForm.expressCode)">
                <el-option
                  v-for="item in shipments"
                  :key="item.expressCode"
                  :label="item.expressName"
                  :value="item.expressCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流单号:" :label-width="formLabelWidth" required>
              <el-input v-model="shipmentForm.expressNo" auto-complete="off" width="200" :maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth">
              <el-input v-model="shipmentForm.noted" auto-complete="off" width="200" :maxlength="200"></el-input>
            </el-form-item>
          </el-form>
          <el-form :model="shipmentForm" v-show="shipmentForm.expressWay==1">
            <el-form-item label="配送员姓名:" :label-width="formLabelWidth" required>
              <el-input v-model="shipmentForm.expressPerson" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="配送员手机号:" :label-width="formLabelWidth" required>
              <el-input v-model="shipmentForm.phone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="运单号:" :label-width="formLabelWidth">
              <el-input v-model="shipmentForm.expressNo" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth">
              <el-input v-model="shipmentForm.noted" auto-complete="off" :maxlength="200"></el-input>
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
          <span> <el-input v-model="pRtFreight" type="number" :controls="false" :min="-1" :max="(parseFloat(orderDetail.orderFreight) - hasRtFreight)" :placeholder="'最多可退'+((parseFloat(orderDetail.orderFreight) - hasRtFreight).toFixed(2)) +'元'" @change="pRtFreightChange"></el-input></span>
          <span>元</span>
            <P class="pl10">运费退款不能大于订单实际剩余运费</P>
        </div>
        <div class="linh40 pl10">
          <span class="wid80">售后金额</span>
          <span>{{(orderDetail.backMoney)}}元</span>
        </div>
        <div class="linh40 pl10">
          <span class=" wid80">售后总额</span>
          <span>{{(parseFloat(orderDetail.backMoney) + rtFreight).toFixed(2)}}元</span>
        </div>
      </div>
      <div class="hptczp_footer">
        <button type="button" class="btn save" @click="agreeRtMoneyApply" >确认</button>
        <button type="button" class="btn cancel" @click="showMask=false;showRt=false" >取消</button>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div class="v-modal" tabindex="0" v-if="textAreaShow" style="z-index:2000;"></div>
      <!--提示 拒绝申请退款理由 输入框-->
    <div class="el-message-box" style="position:fixed;top:50%;left:40%;z-index:2003;"  v-if="textAreaShow" >
      <div class="el-message-box__header">
        <div class="el-message-box__title">
          <span>提示</span>
        </div>
        <button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="textAreaShow=false"><i class="el-message-box__close el-icon-close"></i></button>
      </div>
      <div class="el-message-box__content">
        <div class="el-message-box__message"><p>请输入拒绝理由</p></div>
        <div class="el-message-box__input" style="">
          <div class="el-textarea">
            <textarea  v-model='textarea'   placeholder="请输入1-100 字符" type="textarea" rows="2" autocomplete="off" :maxlength="100"   validateevent="true" class="el-textarea__inner" style="min-height: 33px;"></textarea>
          </div>
          <div class="el-message-box__errormsg" style="visibility: hidden;"></div>
        </div>
      </div>
      <div class="el-message-box__btns">
        <!-- <button type="button" class="el-button el-button--default el-button--small" @click="textAreaShow=false" ><span>取消</span></button> -->
        <button type="button" class="el-button el-button--default el-button--small el-button--primary" @click="rejectReasonConfirm"><span>确定</span></button>
      </div>
    </div>
    <!--添加物流信息-->
    <div class="addLogisticsBox" v-if="addLogisticsShow">
      <h4>添加物流信息<a class="close" @click="close"></a></h4>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"><i class="red">*</i>物流公司</el-col>
          <el-col :span="9">
            <el-select v-model="addExpressCode" filterable placeholder="请选择" @change="checkExpressCode(addExpressCode)">
              <el-option
                v-for="item in shipments"
                :key="item.expressCode"
                :label="item.expressName"
                :value="item.expressCode">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <i class="red redTips" style="line-height:50px;" v-show="checkExpShow">请选择物流公司</i>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"><i class="red">*</i>物流单号</el-col>
          <el-col :span="9">
            <el-input v-model="addLogisticsCode" placeholder="请填写" :maxlength="30" @blur="checkLogisticsCode(addLogisticsCode)"></el-input>
          </el-col>
          <el-col :span="6">
            <i class="red redTips" style="line-height:50px;" v-show="checkLogiShow">请输入物流单号</i>
            <i class="red redTips" style="line-height:50px;" v-show="checkLogiShow1">物流单号输入不合法</i>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt20">
          <el-col :span="20" :offset="3">
            <el-button type="primary" size="medium" @click="submiteAdd()">确定添加</el-button>
            <el-button size="medium" @click="close()">取消</el-button>
            <i class="red ml20">请仔细填写物流信息，一旦确定，不可修改！</i>
          </el-col>
        </el-row>
    </div>
    <!--查看物流跟踪信息-->
    <div class="hptczp" v-if="logisticShow"></div>
    <div class="infoBox" v-if="logisticShow">
      <h4>物流跟踪信息<a class="close bg-ico_close02" @click="logisticShow=!logisticShow"></a></h4>
      <ul>
        <li v-for="(item,index) in logisticInfo">
          <p>{{item.context}}</p>
          <h5>
            <span>{{item.time[1]}}</span>
            <span class="fontSamll">{{item.time[0]}}</span>
          </h5>
        </li>
      </ul>
      <h6>如快递有问题，请先拨打快递公司电话咨询<el-button size="medium" @click="logisticShow=!logisticShow" class="fr mr20" style="margin-top:8px;">关闭查询结果</el-button></h6>
    </div>
    <!--
      重构商家管理平台营销模块80%，补充1.1.1版本迭代bug修改内容
      完成商家管理平台营销模块重构，商家管理平台1.1.2新需求 物流查看 商家平台天机物流信息功能
    -->
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        textarea:'',
        textAreaShow:false,
        pageRows:5,
        currentPage: 1,
        totalCount:0,
        activeName: 'first',
        orderDetail:{
          afterSelldealerOrderId:'',
          backMoney: 0,
          createdDate: '',
          dealerOrderId: '',
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
          ,backExpressName:''
          ,backExpressNo:''
          ,orderType : -1
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
        ,pRtFreight:''
        ,rtFreight:0
        ,showMask: false
        ,showRt: false,
        goodses: [],
        expressNum:0,
        totalData:'',
        mediaResInfos:{}
        ,isGetUserRuning : false
        , hasRtFreight : 0
        ,isChangePage:false,
        shopName:'',
        addLogisticsShow:false, // 添加物流信息弹层
        addExpressCode:'', // 添加物流信息物流公司编码
        addLogisticsCode:'', // 添加物流信息物流单号
        checkExpShow: false, // 物流公司不能为空
        checkLogiShow:false, // 物流单号不能为空
        checkLogiShow1:false, // 物流单号校验规则
        logisticShow:false, // 物流单弹层
        logisticInfo:[], // 物流信息
      }
    },
    // watch: {
    //   'pRtFreight': {
    //     handler: function (val, oldVal) {
    //       alert(0)
    //       let that = this
    //       if (val != oldVal) {
    //         alert(0)
    //         that.$nextTick(function () {
    //           that.rtFreight = val
    //         })
    //       } else {
    //         return false
    //       }
    //     },
    //     deep: true
    //   },
    // },
    methods: {
      //物流单详情
      getQueryExpress(nu){
        let that = this
        that.logisticShow = true
        console.log(nu)
        // that.logisticInfo = [{"time":"2017-12-22 11:18:20","ftime":"2017-12-22 11:18:20","context":"[深圳市] 快件离开 [深圳中心]已发往[深圳西乡]"},{"time":"2017-12-22 10:57:24","ftime":"2017-12-22 10:57:24","context":"[深圳市] 快件到达 [深圳中心]"},{"time":"2017-12-22 05:47:17","ftime":"2017-12-22 05:47:17","context":"[东莞市] 快件离开 [东莞中心]已发往[深圳中心]"},{"time":"2017-12-22 05:40:53","ftime":"2017-12-22 05:40:53","context":"[东莞市] 快件到达 [东莞中心]"},{"time":"2017-12-21 23:14:18","ftime":"2017-12-21 23:14:18","context":"[东莞市] 快件离开 [东莞虎门]已发往[深圳中心]"},{"time":"2017-12-21 23:08:03","ftime":"2017-12-21 23:08:03","context":"[东莞市] [东莞虎门]的虎门六部已收件 电话:18033454661"}]
        // let obj = {'context':'添加售后物流信息','time':that.tool.date.format(new Date(1515029924000), 'yyyy-MM-dd hh:mm:ss')}
        //     that.logisticInfo.push(obj)
        // if(that.logisticInfo!==''){
        //   for(let i = 0;i<that.logisticInfo.length;i++){
        //     that.logisticInfo[i].time = that.logisticInfo[i].time.split(" ")
        //   }
        // }
        // console.log(that.logisticInfo)
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/order/web/expressInfo',
          data: {
            com:that.logistics.backExpressCode,
            nu:nu
          },
          success: function (result) {
            if (result.status === 200){
              if(result.content.resData === '' || result.content === ''){
                that.logisticInfo = []
              }else{
                that.logisticInfo = JSON.parse(result.content.resData).data
              }
              let obj = {'context':'添加售后物流信息','time':that.date_format(new Date(result.content.shipGoodsTime), 'yyyy-MM-dd hh:mm:ss')
              }
              that.logisticInfo.push(obj)
              for(let i = 0;i<that.logisticInfo.length;i++){
                that.logisticInfo[i].time = that.logisticInfo[i].time.split(" ")
              }
              console.log(that.logisticInfo)
            }
            else{
              that.$message({
                type:'warning',
                message:result.errorMessage
              })
            }
          }
        });
      },
      //添加物流信息校验物流公司
      checkExpressCode(val){
        if(val!=''){
          this.checkExpShow = false
          return
        }else{
          this.checkExpShow = true
          return
        }
      },
      //添加物流信息校验物流单号
      checkLogisticsCode(val){
        let re = /^[a-zA-Z0-9]{1,30}$/
        if(val!=''){
          this.checkLogiShow = false
          if (!re.test(val)) {
            this.checkLogiShow1 = true
          } else {
            this.checkLogiShow1 = false
          }
        }else{
          this.checkLogiShow = true
        }
        
      },
      //添加物流信息
      addLogistics(){
        this.addLogisticsShow = true
      },
      //关闭添加物流信息弹层
      close(){
        this.addLogisticsShow = false
        this.addExpressCode = ''
        this.addLogisticsCode = ''
      },
      //提交添加物流信息
      submiteAdd(){
        let that = this
        if(that.addExpressCode===''){
          that.checkExpShow = true
          return false
        }else if(that.addLogisticsCode===''){
          that.checkLogiShow = true
          return false
        }else{
          let expressName
          for(let i=0;i<that.shipments.length;i++){
            if(that.addExpressCode===that.shipments[i].expressCode){
              expressName = that.shipments[i].expressName
            }
          }
          that.$.ajax({
            type: 'POST',
            url: this.base + 'm2c.scm/order/web/rigisterExpress',
            data: {
              com: that.addExpressCode,
              nu: that.addLogisticsCode,
              shipType:1,
              expressName:expressName,
              saleAfterNo: that.orderDetail.afterSelldealerOrderId,
              userId: JSON.parse(sessionStorage.getItem('mUser')).userId,
              skuId: that.orderDetail.goodsInfo.skuId
            },
            success: function (result) {
              if (result.status === 200){
                that.loadOrderDetail()
                that.afterselllogistics()
                that.addLogisticsShow = false
              }
              else{
                that.$message({
                  type:'warning',
                  message:result.errorMessage
                })
              }
              that.showMask = false;
              that.showRt = false;
            }
          });
        }
      },
      pRtFreightChange(){
        let that = this
        var re = /^[0-9]+\.?[0-9]*$/
        if (!re.test(that.pRtFreight)) {
          that.pRtFreight = 0
        }else{
          let hasRtFreight = (parseFloat(that.orderDetail.orderFreight) - that.hasRtFreight)
          if(parseFloat(that.pRtFreight) > hasRtFreight){
            that.pRtFreight = hasRtFreight
            // 重新赋值 去掉提示语
            // that.show_tip("不能大于实际剩余运费")
            that.$nextTick(function () {
            that.rtFreight = parseFloat(that.pRtFreight)
          })
            return
          }
          if(parseFloat(that.pRtFreight) < 0){
            // that.show_tip("不能为负数")
            return
          }
          that.$nextTick(function () {
            that.rtFreight = parseFloat(that.pRtFreight)
          })
        }

      },
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
          url: this.base + 'm2c.scm/dealerorderafter/web/dealerorderafterselldetail',
          //url: 'http://localhost:8080/m2c.scm/dealerorderafter/dealerorderafterselldetail',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            afterSellOrderId: sessionStorage.getItem('afterSale:afterSellOrderId'),
            userId: JSON.parse(sessionStorage.getItem('mUser')).userId
          },
          success: function (result) {
            if (result.status === 200){
              // 获取商品详情
              let _content = result.content
              that.orderDetail.afterSelldealerOrderId = _content.afterSellDealerOrderId
              that.orderDetail.backMoney = _content.strBackMoney
              that.orderDetail.createdDate = that.date_format(new Date(_content.createdDate), 'yyyy-MM-dd hh:mm:ss')
              that.orderDetail.orderId = _content.orderId
              that.orderDetail.dealerOrderId = _content.dealerOrderId
              that.orderDetail.goodsInfo=_content.goodsInfo
              that.mediaId = that.orderDetail.goodsInfo.mediaResId
              that.orderDetail.orderTotalMoney=_content.strOrderTotalMoney
              that.orderDetail.orderFreight=_content.strOrderFreight
              that.orderDetail.backFreight=_content.strBackFreight
              that.orderDetail.orderType=_content.orderType
              that.orderDetail.reason=_content.reason
              that.orderDetail.status=_content.status
              that.orderDetail.rejectReason=_content.rejectReason
              that.orderDetail.dealerId = _content.dealerId;
              that.orderDetail.doStatus = _content.doStatus;//dealer order status
              that.setReturnData(result.content)
              console.log('that.orderDetail.status',that.orderDetail.status)
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
          val.freight = val.freight;
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
          that.goodses.freight = that.goodses;
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
        if(!that.isChangePage){
            that.currentPage = 1
        }
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/order/web/logs/res',
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
        that.isChangePage = false
      }
      ,handleSizeChange(val) {
        let that = this
        that.pageRows=val
        that.operatingRecord();
      }
      ,handleCurrentChange(val) {
        let that = this
        that.currentPage=val
        that.isChangePage = true
        that.operatingRecord();
      }
      ,afterselllogistics() {
        let that = this
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/aftersellorder/web/manager/aftreselllogistics',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            afterSellOrderId: that.orderDetail.afterSelldealerOrderId
          },
          success: function (result) {
            if (result.status === 200){
              //售后物流信息
              let _content = result.content
              that.logistics = _content
              // that.logistics.afterSellOrderId=_content.afterSellOrderId;
              // that.logistics.expressName=_content.expressName;
              // that.logistics.expressNo=_content.expressNo;
              // that.logistics.backExpressName=_content.backExpressName;
              // that.logistics.backExpressNo=_content.backExpressNo;
              // that.logistics.orderType=_content.orderType;
              // that.logistics.goodsInfo=_content.goodsInfo;
              // that.logistics.status=_content.status;
            }
          }
        })
      }
      ,handleAgree(){
        let that = this
        if (that.orderDetail.orderType == 2 && that.orderDetail.doStatus == 1 && parseFloat(that.orderDetail.orderFreight)!=0) {
            that.getHasReturnFreight();
            that.showMask = true;
            that.showRt = true;
            return ;
        }
        let title= '是否同意售后申请?'
        let titleAisle= that.orderDetail.orderType==0?'同意申请换货':that.orderDetail.orderType==1?'同意申请退货':that.orderDetail.orderType==2?'申请退款':'-'
          that.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            let that = this
            that.$.ajax({
              type: 'PUT',
              url: this.base + 'm2c.scm/order/web/dealer/agree-apply-sale',
              //url: 'http://localhost:8080/m2c.scm/order/web/dealer/agree-apply-sale',
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
                else if(result.status === 103) {
                  that.show_tip('已不符合售后申请同意无效！')
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
        let that = this;
        if (that.pRtFreight < 0 || that.pRtFreight === '') {
          that.show_tip('请正确输入退款运费！');
          return;
        }
        that.$.ajax({
          type: 'PUT',
          url: this.base + 'm2c.scm/order/web/dealer/agree-apply-sale',
          //url: 'http://localhost:8080/m2c.scm/order/web/dealer/agree-apply-sale',
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
            else if(result.status === 103) {
              that.show_tip('已不符合售后申请同意无效！')
            }
            that.showMask = false;
            that.showRt = false;
          }
        });
      }
      ,handleRejected(){
        //  弹出弹框  输入拒绝理由
        let that = this
        that.textAreaShow = true;
        // let that = this
        // let title= that.orderDetail.orderType==0?'是否拒绝换货申请?':that.orderDetail.orderType==1?'是否拒绝退货申请?':that.orderDetail.orderType==2?'是否拒绝退款申请?':'-';
        // let titleAisle = that.orderDetail.orderType==0?'拒绝申请换货':that.orderDetail.orderType==1?'拒绝申请退货':that.orderDetail.orderType==2?'拒绝申请退款':'-';
        // that.$confirm(title, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then((value) => {
        //   //  弹出弹框  输入拒绝理由
        //    that.$prompt('请输入'+titleAisle+'理由', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     inputType:'textarea',
        //     inputPlaceholder:"输入1-100 字符",
        //     inputMaxlength:100,
        //    }).then(({ value }) => {
        //      if (value.length<=0 || value ==null ) {
        //        that.show_tip("请输入拒绝理由");
        //       return;
        //     }
        //      that.$.ajax({
        //        type: 'PUT',
        //        url: this.base + 'm2c.scm/order/dealer/reject-apply-sale',
        //        //url: 'http://localhost:8080/m2c.scm/order/dealer/reject-apply-sale',
        //        data: {
        //          token: sessionStorage.getItem('mToken'),
        //          isEncry: false,
        //          saleAfterNo:that.orderDetail.afterSelldealerOrderId,
        //          rejectReason: value,                     // 拒绝原因，中文
        //          rejectReasonCode: 99,    // 拒绝原因编码
        //          userId:JSON.parse(sessionStorage.getItem('mUser')).userId,
        //          dealerId:that.orderDetail.dealerId
        //        },
        //        success: function (result) {
        //          if (result.status === 200){
        //            // 获取订单操作列表
        //            that.loadOrderDetail()
        //          }
        //        }
        //      })
        //   }).catch(() => {
        //     this.$message({
        //       type: 'info',
        //       message: titleAisle+'已取消'
        //     });
        //   });

        // }).catch(() => {
        //   that.$message({
        //     type: 'info',
        //     message: titleAisle+'已取消'
        //   });
        // });
      } ,//商户拒绝售后
     rejectReasonConfirm () {
       let that = this
      //  请输入拒绝理由
       if (that.textarea.length<=0 || that.textarea ==null ) {
          that.show_tip("请输入拒绝理由");
          return;
        }
        that.$.ajax({
            type: 'PUT',
            url: this.base + 'm2c.scm/order/web/dealer/reject-apply-sale',
            //url: 'http://localhost:8080/m2c.scm/order/dealer/reject-apply-sale',
            data: {
              token: sessionStorage.getItem('mToken'),
              isEncry: false,
              saleAfterNo:that.orderDetail.afterSelldealerOrderId,
              rejectReason: that.textarea,                     // 拒绝原因，中文
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
      that.textAreaShow=false
      },
      agreedRefund(){
        let that = this;
        that.$confirm('是否确认退款？\n款项将按原路退回给顾客', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this
          that.$.ajax({
            type: 'PUT',
            url: this.base + 'm2c.scm/order/web/aftersale/dealer/agree-rt-money',
            //url: 'http://localhost:8080/m2c.scm/order/aftersale/dealer/agree-rt-money',
            data: {
              token: sessionStorage.getItem('mToken'),
              isEncry: false,
              saleAfterNo: that.orderDetail.afterSelldealerOrderId,
              userId: JSON.parse(sessionStorage.getItem('mUser')).userId,
              skuId: that.orderDetail.goodsInfo.skuId
            },
            success: function (result) {
              if (result.status === 200) {
                // 获取订单操作列表
                that.loadOrderDetail()
              }
            }
          })
        }).catch(() => {});
      }//获取售后运费
      ,getHasReturnFreight(){
        let that = this
        that.$.ajax({
          type: 'GET',
          url: this.base + 'm2c.scm/dealerorderafter/web/cost/freight',
          data: {
            token: sessionStorage.getItem('mToken'),
            isEncry: false,
            dealerOrderId: that.orderDetail.dealerOrderId,
            userId: JSON.parse(sessionStorage.getItem('mUser')).userId,
            skuId: that.orderDetail.goodsInfo.skuId
          },
          success: function (result) {
            if (result.status === 200){
              that.hasRtFreight = parseFloat(result.content.strCostFt);
            }
          }
        })
        return false
      }//商户确认退款
      ,confirmReceipt(){
        let that = this
        that.$.ajax({
          type: 'PUT',
          url: this.base + 'm2c.scm/order/web/aftersale/dealer-rev',
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
      },
      // 获取快递公司
      getshipInfo(){
        let that = this
        that.$.ajax({
          type: 'GET',
          url: this.base + 'm2c.scm/order/web/dealer/express',
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
      }
      //商户发货
      ,selectShipment(value){
        let that = this
        let choosenItem = this.shipments.filter(item => item.expressCode === value)[0];
        that.shipmentForm.expressName=choosenItem.expressName
      }
      ,handleShipment(){
        let that = this
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
            return;
          }
          if(that.shipmentForm.phone == '' || that.shipmentForm.phone == undefined){
            that.show_tip("请输入配送员电话")
            return;
          }
          /*if(that.shipmentForm.expressNo == '' || that.shipmentForm.expressNo == undefined){
            that.show_tip("请输入运单号")
            return;
          }*/
        }
        that.$.ajax({
          type: 'PUT',
          url: this.base + 'm2c.scm/order/web/aftersale/dealer/ship',
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
            orderId: that.orderDetail.orderId,
            shopName: that.shopName
          },
          success: function (result) {
            if (result.status === 200){
              // 物流列表
              that.dialogVisible = false;
              that.loadOrderDetail();
            }
          }
        })
      }
      ,getUserByIds(ids) {
        let that = this;
        if (that.isGetUserRuning)
          return;
        that.isGetUserRuning = true;
        that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.users/user/getUserInfoByIds',
          data: {
            token: sessionStorage.getItem('mToken'),
            userIds: ids
          },
          success: function (result) {
            //console.log('fanjc======')
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
            that.isGetUserRuning = false;
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
            }
          }
        });
      },
      // 查找经销商信息
      getDealerMess () {
        const that = this
        that.$.ajax({
          type: 'get',
          url: this.localbase + 'm2c.scm/shop/sys/shopInfo',
          data: {
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
          },
          success: function (res) {
            console.log(res)
            that.shopName = res.content.shopName
          }
        })
      }
    },
    mounted () {
      let that = this
      if(that.$route.query.from === 'details'){
      sessionStorage.setItem('afterSale:afterSellOrderId',that.$route.query.afterSellOrderId)
      }
      that.loadOrderDetail()
      that.getDealerMess()
      that.getshipInfo()
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
.building{
  font-size:20px;color:#666;
  padding:240px 0;
  line-height:40px;
  margin-top:100px;
  text-align: center;
  background:url(../../../assets/images/image_repair.png) no-repeat center top;
}
td{
  padding-left:6px
}
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
.addLogisticsBox{position:absolute;top:0;left:0;height:auto;padding:20px;width:100%;background:#fff;z-index:2;
  h4 a.close{
    opacity:1;display:inline-block;width:24px;height:24px;float:right; mergin-right:20px;background:url(../../../assets/images/ico_close.png) no-repeat center center;
  }
  .alginRight{text-align: right; line-height:50px;color:#666;}
}
.hptczp {
    width: 100%;
    height: 100%;
    display: block;
    position: fixed;
    left: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0.5;
}
.infoBox{width:780px;height:800px;position:fixed;top:50%;left:50%;margin-top:-400px;margin-left:-390px;background:#fff;border-radius:5px;    z-index: 999;overflow: hidden;
  h4{background:#DFE9F6;width:100%;height:50px;line-height: 50px;text-indent: 1.5em;color:#666;font-size:16px;margin:0;}
  a.close{display:inline-block;width:50px; height:50px;position:absolute;top:0; right:0;background:url(../../../assets/images/ico_close.png) no-repeat center center;opacity:1;}
  h6{height:50px;line-height: 50px;text-indent:20px;color:#999;font-size:12px;width:100%;background: #F5F5F5;margin:0;position:absolute;bottom:0px;}
  ul{width:800px;height:670px;padding:20px 55px 10px;overflow-y:auto;overflow-x:hidden;
    li{float:left;height:75px;width:670px;position: relative;
      p{border-left:1px solid #efefef;padding-left:67px;width:640px;padding-top:20px;line-height:55px;margin-left:50px;color:#999; letter-spacing: 1px;}
      h5{width:100px;height:55px;background:#fff;position:absolute;top:20px;left:0;text-align:center;line-height:22px;padding:5px 0;            span{color:#999;}
        span.fontSamll{font-size:12px;display: block;}
      }
    }
    li:nth-child(1){
      h5 span,p{color:#0086FF;}
      p{border-left:none;}
    }
  }
}
.detail{
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
    table td p.lineThrough{text-decoration:line-through;font-size:12px;color:#999;}
    .customerdetail_container{

      .detail_table{
        margin: auto;
        border: 1px solid #e7e7e7;
        width: 99%;
        td{
          padding-left: 10px;
          p.lineThrough{text-decoration:line-through;font-size:12px;color:#999;}
        }
        .a1{
          width: 22%;
          padding-top: 20px;
          padding-left: 20px;
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
            width:180px;
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
          .oprs{
            margin:4px 0;
          }
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
      .detail_tit03{
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
        span.fr{
          cursor: pointer;
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
  background:rgba(0,0,0,0.5);
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
<style>
.addLogisticsBox .el-input,.addLogisticsBox .el-select{width:100%;}
label.el-form-item__label{
      line-height: 50px !important;}
</style>

