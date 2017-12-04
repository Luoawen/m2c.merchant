<template>
  <div class="m93xq">
    <div class="content">
        <div class="info-content">
            <h4>基础信息</h4>
            <div class="base wrap">
                  <div>
                     <p><span>编号：</span><span v-text="item.fullCutNo"></span></p>
                     <p>有效期：
                       <span v-text="item.expirationTimeStart"></span>
                       <span>~</span>
                       <span v-html="item.expirationTimeEnd"></span>
                     </p>
                  </div>
                  <div>
                     <p><span>满减名称：</span><span v-text="item.fullCutName"></span></p>
                     <p><span>数量：</span><span v-text="item.totalNum == null ? '无限制' : item.totalNum == 0 ? '无限制' : item.totalNum "></span></p></div>
                  <div>
                     <p><span>生成者：</span><span v-text="item.creatorType == 1 ? '平台' : item.creatorType == 2 ? '商家' : ''"></span></p>
                     <p><span>状态：</span><span v-text="item.status == 1 ? '未生效' : item.status == 2 ? '已生效' : item.status == 3 ? '已失效' : ''"></span></p>
                  </div>
                  <div>
                     <span><span>使用情况：</span><span v-text="item.isUse"></span></span>&nbsp;&nbsp;&nbsp;&nbsp;<span>（已使用 <span v-text="item.useNum == null ? 0 : item.useNum" style="color: #0078E4;"></span> 次）</span>
                  </div>
            </div>
        </div>
         <div class="info-content">
            <h4>规则条件</h4>
                <div class="base rule">
                    <div class="intr">
                        <p><span>形式：</span><span v-text="item.fullCutType===1?'减钱':item.fullCutType===2?'打折':item.fullCutType===3?'换购':''"></span></p>
                        <!--满钱减钱-->
                        <div class="tier" v-if="item.fullCutType===1&&item.thresholdType==1">
                          <div v-for="fullCutItem in item.itemList">
                            <p>
                              层级<span v-text="fullCutItem.level"></span>
                              &nbsp;--&nbsp;门槛&nbsp;:&nbsp;满&nbsp;<span v-text="fullCutItem.threshold/100"></span>&nbsp;
                              元减&nbsp;<span v-text="fullCutItem.money/100"></span>&nbsp;元
                            </p>
                          </div>
                        </div>
                        <!--满件减钱-->
                        <div class="tier" v-if="item.fullCutType===1&&item.thresholdType==2">
                          <div v-for="fullCutItem in item.itemList">
                            <p>
                              层级<span v-text="fullCutItem.level"></span>
                              &nbsp;--&nbsp;门槛&nbsp;:&nbsp;满&nbsp;<span v-text="fullCutItem.threshold"></span>&nbsp;
                              件减&nbsp;<span v-text="fullCutItem.money/100"></span>&nbsp;元
                            </p>
                          </div>
                        </div>
                        <!--满钱打折-->
                        <div class="tier" v-if="item.fullCutType===2&&item.thresholdType==1">
                          <div v-for="fullCutItem in item.itemList">
                            <p>
                              层级<span v-text="fullCutItem.level"></span>
                              &nbsp;--&nbsp;门槛&nbsp;:&nbsp;满&nbsp;<span v-text="fullCutItem.threshold/100"></span>&nbsp;
                              元打&nbsp;<span v-text="fullCutItem.discount"></span>&nbsp;折
                            </p>
                          </div>
                        </div>
                        <!--满件打折-->
                        <div class="tier" v-if="item.fullCutType===2&&item.thresholdType==2">
                          <div v-for="fullCutItem in item.itemList">
                            <p>
                              层级<span v-text="fullCutItem.level"></span>
                              &nbsp;--&nbsp;门槛&nbsp;:&nbsp;满&nbsp;<span v-text="fullCutItem.threshold"></span>&nbsp;
                              件打&nbsp;<span v-text="fullCutItem.discount"></span>&nbsp;折
                            </p>
                          </div>
                        </div>
                        <!--满件换购-->
                        <div class="tier" v-if="item.fullCutType===3&&item.thresholdType==1">
                          <div v-for="fullCutItem in item.itemList">
                            <p>
                              满&nbsp;<span v-text="fullCutItem.threshold/100"></span>
                              &nbsp;元加上&nbsp;<span v-text="fullCutItem.buyingPrice/100"></span>&nbsp;
                              元换购商品
                            </p>
                            <p><span v-for="goods in exchangeGoodsList">&nbsp;{{goods.goodsName}}&nbsp;</span></p>
                          </div>
                        </div>
                        <!--满件换购-->
                        <div class="tier" v-if="item.fullCutType===3&&item.thresholdType==2">
                          <div v-for="fullCutItem in item.itemList">
                            <p>
                              满&nbsp;<span v-text="fullCutItem.threshold"></span>
                              &nbsp;件加上&nbsp;<span v-text="fullCutItem.buyingPrice/100"></span>&nbsp;
                              元换购商品
                            </p>
                            <p><span v-for="goods in exchangeGoodsList">&nbsp;{{goods.goodsName}}&nbsp;</span></p>
                          </div>
                        </div>
                        <div class="sale">
                            <span>发放方式：<span v-text="item.receiveType===0?'自动领取':'手动领取'"></span></span>
                            <span>每人优惠<b v-text="item.numPerOne"></b>次，每天仅可优惠<b v-text="item.numPerDay"></b>次</span>
                        </div>
                    </div>
                    <div class="range">
                        <p>作用范围：<span v-text="item.rangeType===0?'全店':item.rangeType===1?'商家':item.rangeType===2?'商品':item.rangeType===3?'品类':''"></span></p>
                        <div class="goods" v-if="item.rangeType===2" >
                          <p>已选<span>{{item.suitableRangeList.length}}</span>件商品</p>
                          <ul>
                            <li v-for="range in item.suitableRangeList">
                              <div>{{range.name}}</div>
                            </li>
                          </ul>
                          <div class="more" v-show="item.suitableRangeList.length > 8">
                            <a>查看全部商品</a>
                          </div>
                        </div>
                        <div class="goods" v-if="item.rangeType===0" >
                          <p>已排除<span>{{item.removeRangeList.length}}</span>商品</p>
                          <ul>
                            <li v-for="range in item.removeRangeList">
                              <div>{{range.name}}</div>
                            </li>
                          </ul>
                        </div>
                    </div>
            </div>
         </div>
        <div class="info-content">
            <h4>备注</h4>
            <p>{{item.remark == '' ? '暂无' : item.remark}}</p>
        </div>
        <p class="back" >
            <el-button  type="primary" size="medium"   @click="itemback" > 返回 </el-button> 
        </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        item: '',
        goodsIds: '',
        exchangeGoodsList: [],
        rangeClassifyList: []
      }
    },
    methods: {
      goto (path) {},
      itemback () { window.history.go(-1) }
    },
    mounted () {
      let that = this
      that.$.ajax({
//        url: 'http://localhost:8080/m2c.market/fullcut/detail/' + sessionStorage.getItem('full_cut_id'),
        url: that.base + 'm2c.market/fullcut/detail/' + sessionStorage.getItem('full_cut_id'),
        data: {
          token: sessionStorage.getItem('access_token'), 
          isEncry: false
        },
        success: function (result) {
          console.log('满减详情:', result.content)
          that.item = result.content
          if (that.item.rangeType === 3) {
            for (var i = 0; i < that.item.suitableRangeList.length; i++) {
              if (that.item.suitableRangeList[i].isChoosed === 1) {
                that.rangeClassifyList.push(that.item.suitableRangeList[i])
              }
            }
            console.log('rangeClassifyList:', JSON.stringify(that.rangeClassifyList))
          }
          if (that.item.fullCutType === 3) {
            that.goodsIds = that.item.itemList[0].goodsIds
            that.$.ajax({
              url: that.base + 'm2c.scm/goods/detail/multiple',
              data: {
                goodsIds: that.goodsIds
              },
              success: function (result) {
                console.log('换购商品:', JSON.stringify(result.content))
                that.exchangeGoodsList = result.content
              }
            })
          }
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
.content{
    margin-left:20px;
    margin-top:10px;
    .info-content{
        padding:10px 0 30px 30px ;
        background: #fff;
        margin-bottom:10px;
        font-size: 12px;
        a{
            color: #0086FF;
        }
        h4{
            line-height: 32px;
            font-size: 12px;
            font-weight: bold;
            color:#333;
            margin-bottom:10px;
        }
        textarea{
            width:480px;
            height: 140px;
            outline: none;
            resize : none;
        }
        .tier{
            background:rgba( 0,134,255,.1);
            padding:0 10px;
            width:433px;
            color:#0C6DFF;
            p{
                margin: 0;
                line-height:30px;
                flex:1;
                span{
                  color: blueviolet;
                }
            }
        }
        .sale{
            line-height: 30px;
            padding: 10px 0;
            span{
                margin-right: 30px;
            }
        }
        .base{
            width: 550px;
            display: flex;
            div.intr{
                width:480px;
            }
            .range {
              flex: 1;
              line-height: 24px;
              .range_of_action {
                width: 160px;
                height: 24px;
                border-radius: 2px;
                margin-right: 20px;
                padding: 0px
              }
              .goods, .shop ,.classify,.all{
                border: 1px solid #e5e5e5;
                overflow: hidden;
                width: 530px;
                min-height: 210px;
                padding: 20px 20px;
                background: rgba(245, 245, 245, 1);
                margin-top: 20px;
                position: relative;
                /*z-index: 99;*/
                ul {
                  list-style: none;
                  /*display: flex;*/
                  margin: 0;
                  padding: 0;
                  /*justify-content:space-between;*/
                  // flex-direction: row-reverse ;
                  // color:red;

                  li {
                    width: 160px;
                    background: #fff;
                    border-radius: 5px;
                    margin-right: 10px;
                    border: 1px solid #E5E5E5;
                    display: inline-block;
                    position: relative;
                    div {
                      width: 160px;
                      padding-left: 5px;
                      padding-right: 5px;
                      height: 30px;
                      line-height: 30px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 1;
                      font-size: 12px;
                      padding-bottom: 0px;
                    }
                    .icon_dele {
                      width: 13px;
                      height: 13px;
                      display: inline-block;
                      position: absolute;
                      right: -5px;
                      top: -5px;
                      background: url(../../../assets/images/icon-delet.png) no-repeat center;
                    }
                  }
                }
                .control {
                  width: 22px;
                  height: 22px;
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  border-radius: 50%;
                  background-color: #BFC1CB;
                  color: #fff;
                  // font-size:
                  text-align: center;
                  line-height: 22px;
                }
                .more {
                  text-align: right;
                }
                .left {
                  left: 12px;
                }
                .right {
                  right: 12px;
                }
              }
            }
        }
        .wrap{
            flex-wrap: wrap;
            div{
                flex: 50%;
            }
        }
        .rule{
            width:100%;
        }
    }
    .back{
        text-align: left;
        text-indent: 20px;
        padding-top: 27px;
        padding-bottom: 27px;
    }
}
</style>
