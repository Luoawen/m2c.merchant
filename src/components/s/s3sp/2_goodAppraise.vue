<template>
  <div class="content clear">
    <div class="searcWrap">
      <el-select v-model="search_params.replyStatus" placeholder="回复状态">
        <el-option
          v-for="reply in replyStatuses"
          :key="reply.value"
          :label="reply.label"
          :value="reply.value">
        </el-option>
      </el-select>
      <el-select v-model="search_params.starLevel" placeholder="星级评价">
        <el-option
          v-for="level in leveles"
          :key="level.value"
          :label="level.label"
          :value="level.value">
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
      <el-input v-model="search_params.condition" placeholder="输入商品名称/订单号/顾客姓名/顾客手机号" title="输入商品名称/订单号/顾客姓名/顾客手机号"></el-input>
      <el-button type="primary" size="medium" @click="get_comment_info()" class="btn-search">搜索</el-button>
      <span class="ml10 gjsort" @click="advancedSearch">高级搜索</span>
    </div>
    <div class="soloSearchBox" v-if="advancedShow">
      <h4>高级搜索<a class="close" @click="advancedShow=!advancedShow"></a></h4>
      <div class="searcWrap mess">
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">关键词</el-col>
          <el-col :span="9">
            <el-input v-model="search_params.condition" placeholder="输入商品名称/订单号/顾客姓名/顾客手机号" title="输入商品名称/订单号/顾客姓名/顾客手机号"></el-input>
          </el-col>
          <el-col :span="3" class="alginRight">评价时间</el-col>
          <el-col :span="9" style="margin-top:7px;">
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
          <el-col :span="3" class="alginRight">回复状态</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.replyStatus" placeholder="回复状态">
              <el-option
                v-for="replyStatu in replyStatuses"
                :key="replyStatu.value"
                :label="replyStatu.label"
                :value="replyStatu.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" class="alginRight">评价星级</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.starLevel" placeholder="评价星级">
              <el-option
                v-for="starLevel in leveles"
                :key="starLevel.value"
                :label="starLevel.label"
                :value="starLevel.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">图片情况</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.imageStatus" placeholder="图片情况">
              <el-option
                v-for="imageStatu in imageStatuses"
                :key="imageStatu.value"
                :label="imageStatu.label"
                :value="imageStatu.value">
              </el-option>
            </el-select>
          </el-col>
           <el-col :span="3" class="alginRight">评价级别</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.commentLevel" placeholder="评价级别">
              <el-option
                v-for="commentLevel in commentLeveles"
                :key="commentLevel.value"
                :label="commentLevel.label"
                :value="commentLevel.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt20">
          <el-col :span="20" :offset="3">
            <el-button type="primary" size="medium" @click="get_comment_info()">搜索</el-button>
            <el-button size="medium" @click="clearAll()">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="comment_info  clear" style="margin-top:20px;">
      <table class="comment_table col-sm-12" id="table" style="table-layout:fixed">
        <thead>
          <tr>
            <td width="120px">操作</td>
            <td width="320px;">评论内容</td>
            <td>评价星级</td>
            <td>评价级别</td>
            <td>商品信息</td>
            <td>订单号</td>
            <td>顾客信息</td>
            <td>评价时间</td>
          </tr>
        </thead>
        <tbody v-if="goodsCommentTotalCount==0">
          <tr style="height: 50px;text-align:center">
            <td colspan="7">暂无数据</td>
          </tr>
        </tbody>
        <tbody v-for="(comment,index) in datacomment">
          <tr>
            <td>
              <div v-if='!comment.replyCommentContent ' @click="showtchp(comment.commentId)">
                <i class="icon_hp"></i>
                <span>回评</span>
              </div>
            </td>
            <td>
              <a class="ellipsis3" :title="comment.commentContent">{{comment.commentContent}}</a><br/><br/>
              <div class="mt10" v-for="(img,index2) in comment.commentImages">
                <div class="conimg" @click="imgWrapShow(index,index2)">
                  <img class="conimg mr10 fl" :src="img" />
                  <div><i class="el-icon-zoom-in"></i></div>
                </div>
              </div>
              <!-- 图片弹层 -->
              <div class="hptczp" v-show="imgWrap"></div>
              <div class="imgWrap" v-show="imgWrap">
                <template v-for="comment in datacomment">
                  <div class="imgUl">
                    <ul>
                      <li>
                        <img :src="datacomment[rowIndex].commentImages[imgIndex]" />
                      </li>
                    </ul>
                  </div>
                  <div class="ctrl">
                    <a @click="prev" class="prev" v-if="imgIndex > 0"></a>
                    <a @click="next" class="next" v-if="imgIndex < comment.commentImages.length-1"></a>
                  </div>
                  <a class="close" @click="imgWrap=!imgWrap"></a>
                </template>
              </div>
            </td>
            <td>
              <span>{{comment.starLevel}}</span>星
            </td>
            <td>
              <span v-if="comment.commentLevel ==1 " > 好评</span>
              <span v-else-if="comment.commentLevel ==3" > 差评</span>
              <span v-else > 中评</span>
            </td>
            <td>
              <a class="ellipsis2" :title="comment.goodsName">{{comment.goodsName}}</a><br/><br/>
              <div class="tdcolor mt10" v-if="comment.skuName != ''">规格：{{comment.skuName}}</div>
            </td>
            <td>
              <span class="ellipsis" :title="comment.orderId">{{comment.orderId}}</span>
            </td>
            <td>
              <div>{{comment.buyerName}}</div>
              <div>{{comment.buyerPhoneNumber}}</div>
            </td>
            <td>
              <div>{{comment.commentTime}}</div>
            </td>
          </tr>
          <tr v-if='comment.replyCommentContent '>
            <td>
            </td>
            <td colspan="7">
              <div class="tdhf">
                <div class="nr">
                  回复内容:
                </div>
                <div class="tit">{{comment.replyCommentContent}}</div>
                <div class="time">{{comment.replyTime}}回复</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="block fr" style="margin: 20px;">
        <el-pagination
          @size-change="goodsCommentHandleSizeChange"
          @current-change="goodsCommentHandleCurrentChange"
          :current-page="goodsCommentCurrentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="goodsCommentPageRows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="goodsCommentTotalCount">
        </el-pagination>
      </div>
    </div>

      <!-- 回评弹出框 hptc-->
    <div class="hptczp" v-show="showhptc===true"  style="">

    </div>
    <div class="hptczp_content hptczp_contentTextarea" v-show="showhptc===true">
        <div class="hptczp_header">
          <span>回评内容</span>
          <span class="iconfont fr" @click="cancel()">&#xe661;</span>
        </div>
        <div class="hptczp_body">
            <textarea placeholder="请填写100字符以内内容" v-model="reply_params.replyContent" maxlength="100"></textarea>
        </div>
        <div class="hptczp_footer">
          <el-button size="medium" class="cancel" @click="cancel()">取消</el-button>
          <el-button type="primary" size="medium" class="save" @click="reply()" :disabled="reply_params.replyContent==''">确认</el-button>
          <!-- <button type="button" class="btn save" @click="reply()" :disabled="reply_params.replyContent==''">确认</button>
          <button type="button" class="btn cancel" @click="cancel()" >取消</button> -->
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        is_Success: false,
        // 搜索参数
        search_params: {condition: '', replyStatus: '', starLevel: '', startTime: '',commentLevel:'', endTime: '', imageStatus: ''},
        reply_params: {commentId: '', replyContent: ''},
        replyStatuses: [{value: '', label: '回复状态'}, {value: '1', label: '未回复'}, {value: '2', label: '已回复'}], // 回复状态
        leveles: [{value: '', label: '评价星级'}, {value: '1', label: '1星'}, {value: '2', label: '2星'}, {value: '3', label: '3星'}, {value: '4', label: '4星'}, {value: '5', label: '5星'}], // 评价星级
        commentLeveles: [{value: '', label: '全部'}, {value: '1', label: '好评'}, {value: '2', label: '中评'}, {value: '3', label: '差评'}], // 评价级别
        imageStatuses:[{value: '', label: '图片情况'}, {value: '1', label: '无图'}, {value: '2', label: '有图'}], // 图片情况
        datacomment: '',
        showhptc: false,
        commentId: '',
        goodsCommentCurrentPage: 1,
        goodsCommentPageRows: 10,
        goodsCommentTotalCount: 0,
        replyStatusName: '回复状态',
        levelName: '评价星级',
        advancedShow: false,
        time: '',
        imgWrap:false, //图片盒子显示隐藏
        rowIndex:0,
        imgIndex:0,
        isChangePage:false,
      }
    },
    methods: {
      // 图片放大
      imgWrapShow(index,index2){
        let that = this
        that.imgWrap = true
        that.rowIndex = index
        that.imgIndex = index2
      },
      prev(){
        let that = this
        if(that.imgIndex > 0){
          that.imgIndex--
        }
      },
      next(){
        let that = this
        if(that.imgIndex < that.datacomment[that.rowIndex].commentImages.length-1){
          that.imgIndex++
        }
      },
      // 时间赋值
      timeCheck () {
        let that = this
        if (that.time != null) {
          that.search_params.startTime = that.time[0]
          that.search_params.endTime = that.time[1]
        } else {
          that.search_params.startTime = ''
          that.search_params.endTime = ''
        }
      },
      clearAll () {
        let that = this
        that.search_params.condition = ''
        that.search_params.replyStatus = ''
        that.search_params.starLevel = ''
        that.search_params.endTime = ''
        that.search_params.startTime = ''
        that.search_params.imageStatus = ''
        that.time = ''
      },
      advancedSearch () {
        let that = this
        that.advancedShow = true
      },
      goodsCommentHandleSizeChange (val) {
        let that = this
        that.goodsCommentPageRows = val
        that.get_comment_info()
      },
      goodsCommentHandleCurrentChange (val) {
        let that = this
        that.goodsCommentCurrentPage = val
        that.isChangePage = true
        that.get_comment_info()
      },
      cancel () {
        let that = this
        that.showhptc = false
        that.reply_params.replyContent = ''
      },
      reply () {
        let that = this
        that.$.ajax({
          url: that.base + 'm2c.scm/web/goods/comment/reply',
          type: 'put',
          cache: false,
          pagination: true,
          data: {
            token: sessionStorage.getItem('mToken'),
            commentId: that.commentId,
            replyContent: that.reply_params.replyContent
          },
          success: function (result) {
            if (result.status === 200) {
              console.log(result)
              that.get_comment_info()
              that.showhptc = false
            }
          }
        })
      },
      // 获取结算单列表
      get_comment_info () {
        let that = this
         if(!that.isChangePage){
          that.currentPage = 1
        }
        that.advancedShow = false
        if (that.search_params.startTime > that.search_params.endTime) {
          that.show_tip('开始时间不能大于结束时间')
          return
        }
        that.is_Success = false
        that.$.ajax({
          url: that.base + 'm2c.scm/web/goods/comment',
          cache: false,
          pagination: true,
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser'))?JSON.parse(sessionStorage.getItem('mUser')).dealerId:'', // 商户ID
            replyStatus: that.search_params.replyStatus,
            starLevel: that.search_params.starLevel,
            commentLevel: that.search_params.commentLevel,
            startTime: that.search_params.startTime,
            endTime: that.search_params.endTime,
            condition: that.search_params.condition.replace(/\s+/g,""),
            imageStatus: that.search_params.imageStatus,
            rows: that.goodsCommentPageRows,                          // 每页多少条数据
            pageNum: that.goodsCommentCurrentPage     // 请求第几页
          },
          success: function (result) {
            if (result.status === 200) {
              console.log(result)
              if(result.content.length ==0){
              }
              that.datacomment = result.content
              that.goodsCommentTotalCount = result.totalCount
            }
          }
        })
        that.isChangePage = false
      },
      showtchp (n) {
        var that = this
          // that.$('#hptc').modal('show')
        that.showhptc = true
        that.commentId = n
      },
      timeBox () {
        this.is_Success = true
      }
    },
    mounted () {
      let that = this
      window.handle = {
        'click [handle]': function (event, value, row, index) {
          let target = event.target
          let toggle = target.getAttribute('replyComment') ? 'replyComment' : ''
          that.td_click(toggle, row, index)
        }
      }
      this.get_comment_info()
    }
  }
</script>
<style lang="scss" scoped>
/*公用样式*/
.clear{
  clear: both;
  overflow: hidden;
}
.mt5{
  margin-top: 5px;
}
.wid50{
  width: 50px;
  display: inline-block;
}
.mt10{
  margin-top: 10px;
}
.mr10{
  margin-right: 10px;
}
.mr{margin-right: 20px;}
.fl{
  float: left;
}
.fr{
  float: right;
}

  .imgWrap{
    //禁用选中
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		-khtml-user-select: none;
		user-select: none;
    width:670px;
    height:685px;
    // background: #ffffff;
    // border-radius:10px;
    position: fixed;
    top:50%;left:50%;
    margin-top:-343px;
    margin-left:-335px;
    z-index: 999;
    a.close{
      display:inline-block;width:30px;height:30px;
      position: absolute;top:-60px;right:-200px; background:url(../../../assets/images/ico_close_close.png) no-repeat 0 0;
    }
    div.imgUl{
      width:600px;
      height:600px;
      position: absolute;
      top:0px;left:35px;
      vertical-align: middle;
      display: table;
      ul{
        width:600px;
        height:600px;white-space:nowrap; float: left;list-style-type:none;
        li{
          line-height:600px;text-align:center;
          width:600px;
          height:600px;
          img{max-width:600px;max-height:600px;}
        }
      }
    }
    div.ctrl{
      position: absolute;
      top:260px;
      left:-130px;
      width:920px;
      a{
        width:50px;height:50px;display:inline-block;position:absolute;
      }
      a.prev{top:0;left:0px;background:url(../../../assets/images/ico_leftarrows_pressed.png) no-repeat 0 0;opacity:0.4}
      a.next{top:0;right:0px;background:url(../../../assets/images/ico_rightarrows_pressed.png) no-repeat 0 0;opacity:0.4}
      a.prev:hover{transition: all 0.2s ease;opacity:1}
      a.next:hover{transition: all 0.2s ease;opacity:1}
    }
  }


.comment_table{
  /*width: 1160px;*/
  border: 1px solid #E5E5E5;
  .a1{
    /*width: 344px; */
      width: 25%;
  }
  .a2{
    /*width: 155px;*/
    width: 18%;
  }
  .a3{
    /*width: 205px;*/
    width: 20%;
  }
  .a4{
    /*width: 145px;*/
      width: 15%;
  }
  .a5{
    /*width: 145px;*/
      width: 15%;
  }
  .a6{
    /*width: 145px;*/
      width: 15%;
  }
  .a7{
    /*width: 145px;*/
      width: 15%;
  }
  thead{
    tr{
      min-height: 40px;
      line-height: 40px;
      background: #DFE9F6;
      td{
        padding-left: 20px;
      }
    }
  }
    tbody{
      background: #fff;
      border-bottom:1px solid #E5E5E5;
      tr{
        td{
          padding-left: 20px;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-right: 20px;
          background: #fff;
          min-height: 80px;
          overflow: hidden;
          text-overflow:ellipsis;
          // white-space: nowrap;
        }
        .td_img{
          width: 50px;
          height: 50px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .conimg{
          width: 50px;
          height: 50px;
          position: relative;
          display: inline-block;float:left;margin-right:10px;margin-bottom:10px;
          div{
            position: absolute;
            width:50px;height:50px;
            top: 0;
            left: 0;
            background:rgba(255,255,255,0.5);
            display: none;
            i{width:16px;height:16px;position:absolute;top:15px;left:19px;}
          }
        }
        .conimg:hover div{
          display: block;
        }
        .tdcolor{
          color: #999999;
        }
        a.ellipsis2{
    // width:180px;
    // height: 40px;
    // line-height:20px;
    // color:#5a5e66;
    // // margin-left:10px;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
    // overflow: hidden;
    // position: relative;
    // float:left;
  }
  a.ellipsis2:hover{ text-decoration:none;}
  a.ellipsis3{
          width:90%;
          height: 60px;
          line-height:20px;
          color:#5a5e66;
          // margin-left:10px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          position: relative;
          float:left;
        }
 a.ellipsis3:hover{ text-decoration:none;}
        .tdhf{
          /*width: 1120px;*/
          min-height: 100px;
          background: #F4F5FA;
          border-radius: 4px;
          padding-left: 20px;
          padding-right: 20px;
          line-height: 30px;
          .nr{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #0086FF;
          }
          .tit{
            ont-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
          }
          .time{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #999999;
          }

        }
        .icon_hp{
          width: 16px;
          height: 17px;
          display: inline-block;
          margin-right: 10px;
          background: url(../../../assets/images/ico_compile_thick.png) no-repeat center;
        }
      }
    }
}
.zIndex2{z-index:21;}

.mb20{
  margin-bottom: 20px;
}
</style>
