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
      <el-button type="primary" size="medium" @click="get_comment_info()">搜索</el-button>
      <span class="ml10 gjsort" @click="advancedSearch">高级搜索</span>
    </div>

    <div class="poi2 Advanced_s" v-show="advancedShow">
      <div class="">
        <div class="titbt">高级搜索<i @click="advancedShow=!advancedShow" class="close"></i></div>
        <div class="clear">
          <div class="col-sm-6 left">
            <div class="clear mt10 mb20">
              <span class="bt fl ">关键词</span>
              <input class="form-control fl " placeholder="输入商品名称 / 订单号 / 顾客姓名/ 顾客手机号" v-model="search_params.condition"/>
            </div>
            <div class="clear mt10 mb20">
              <span class="bt fl ">回复状态</span>
              <select class="form-control fl " v-model="search_params.replyStatus">
                <option value="" selected>全部</option>
                <option value="2">已回复</option>
                <option value="1">未回复</option>
              </select>
            </div>
            <div class="clear mt10 mb20">
              <span class="bt fl ">图片情况</span>
              <select class="form-control fl " v-model="search_params.imageStatus">
                <option value="" selected>全部</option>
                <option value="2">有图</option>
                <option value="1">无图</option>
              </select>
            </div>
          </div>
          <div class="col-sm-6 right">
            <div class="clear mt10 mb20">
              <span class="bt fl ">评价时间</span>
              <span class="clear">
                  <span class="fl"><input class="form-control time" type="date" v-model="search_params.startTime"/></span>
                  <span class="fl mr10" style="display:inline-block;line-height:40px;">~</span>
                  <span class="fl"><input class="form-control time" type="date" v-model="search_params.endTime"/></span>
                </span>
            </div>
            <div class="clear mt10 mb20">
              <span class="bt fl ">评价星级</span>
              <select class="form-control fl " v-model="search_params.starLevel">
                <option value="" selected>全部</option>
                <option value="1">1星</option>
                <option value="2">2星</option>
                <option value="3">3星</option>
                <option value="4">4星</option>
                <option value="5">5星</option>
              </select>
            </div>
          </div>
        </div>
        <div class="footer clear">
          <el-button type="primary" size="medium" @click="get_comment_info()">搜索</el-button>
          <el-button size="medium" @click="clearAll()">重置</el-button>
        </div>
      </div>
    </div>
    <div class="comment_info  clear" style="margin-top:20px;">
      <table class="comment_table col-sm-12" id="table" style="table-layout:fixed">
        <thead>
          <tr>
            <td width="120px">操作</td>
            <td width="320px;">评论内容</td>
            <td>评价星级</td>
            <td>商品信息</td>
            <td>订单号</td>
            <td>顾客信息</td>
            <td>评价时间</td>
          </tr>
        </thead>
        <tbody v-if="goodsCommentTotalCount==0">
        <tr style="height: 50px;text-align">
          <td colspan="7">没有匹配的记录</td>
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
              <a class="ellipsis2" :title="comment.goodsName">{{comment.goodsName}}</a><br/><br/>
              <div class="tdcolor mt10">规格：{{comment.skuName}}</div>
            </td>
            <td>
              {{comment.orderId}}
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
            <td colspan="6">
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
      <div class="block" style="margin: 20px;float: left">
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
    <div class="hptczp_content"  v-show="showhptc===true">
        <div class="hptczp_header">
          <span>回评内容</span>
          <span class="fr" @click="cancel()">X</span>
        </div>
        <div class="hptczp_body">
            <textarea placeholder="请填写100字符以内内容" maxlength="" v-model="reply_params.replyContent" maxlength="100"></textarea>
        </div>
        <div class="hptczp_footer">
          <button type="button" class="btn save" @click="reply()" :disabled="reply_params.replyContent==''">确认</button>
          <button type="button" class="btn cancel" @click="cancel()" >取消</button>
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
        search_params: {condition: '', replyStatus: '', starLevel: '', startTime: '', endTime: '', imageStatus: ''},
        reply_params: {commentId: '', replyContent: ''},
        replyStatuses: [{value: '', label: '回复状态'}, {value: '1', label: '未回复'}, {value: '2', label: '已回复'}], // 回复状态
        leveles: [{value: '', label: '评价星级'}, {value: '1', label: '1星'}, {value: '2', label: '2星'}, {value: '3', label: '3星'}, {value: '4', label: '4星'}, {value: '5', label: '5星'}], // 评价星级
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
        imgIndex:0
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
          url: that.base + 'm2c.scm/goods/comment/reply',
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
        that.advancedShow = false
        if (that.search_params.startTime > that.search_params.endTime) {
          that.show_tip('开始时间不能大于结束时间')
          return
        }
        that.is_Success = false
        that.$.ajax({
          url: that.base + 'm2c.scm/goods/comment',
          cache: false,
          pagination: true,
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId, // 商户ID
            replyStatus: that.search_params.replyStatus,
            starLevel: that.search_params.starLevel,
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
.hptczp{
  width: 100%;
  height: 100%;
  display: block;
  position: fixed;
  left: 0px;
  top: 0px;
  background: #000;
  z-index: 999;
  opacity: 0.3;
}
  .imgWrap{
    width:660px;
    height:660px;
    // background: #ffffff;
    // border-radius:10px;
    position: fixed;
    top:50%;left:50%;
    margin-top:-330px;
    margin-left:-330px;
    z-index: 999;
    a.close{
      display:inline-block;width:30px;height:30px;
      position: absolute;top:-60px;right:-200px; background:url(../../../assets/images/ico_close_close.png) no-repeat 0 0;
    }
    div.imgUl{
      width:660px;
      height:660px;
      position: absolute;
      top:0px;left:0px;
      vertical-align: middle;
      display: table;
      ul{
        width:660px;
        height:660px;
        li{
          line-height:660px;
          width:660px;
          height:660px;
          img{width:660px;height:auto;}
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

.hptczp_content{
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
}
.comment_table{
  /*width: 1160px;*/
  border: 1px solid #DFE9F6;
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
      border-bottom:1px solid #DFE9F6;
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
          display: inline-block;float:left;margin-right:10px;
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
    width:180px;
    height: 40px;
    line-height:20px;
    color:#5a5e66;
    // margin-left:10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    position: relative;
    float:left;
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
.page{
  margin-top: 20px;
  margin-bottom: 20px;
  line-height: 40px;
  margin-right: 20px;
  .tdpade{
    width: 31px;
    height: 31px;
    display: inline-block;
    background: url(../../../assets/images/ico_latter_disabled.png) no-repeat center;
  }
  .bg1{
      background: url(../../../assets/images/ico_latter_disabled.png) no-repeat center;
  }
  .bg2{
      background: url(../../../assets/images/ico_headmost_disabled.png) no-repeat center;
  }
  .bg3{
      background: url(../../../assets/images/ico_front_default.png) no-repeat center;
  }
  .bg4{
      background: url(../../../assets/images/ico_finally_hover.png) no-repeat center;
  }

}
.sp{
    /*width: 1583px;*/
    height: 84px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .dropdown{
      display: inline-block;
      font-size: 16px;
      line-height: 84px;
      .sort{
        display: inline;
        margin: 0 20px 0 30px;
      }
      .state{
        display: inline;
        margin-right: 20px;
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
        top: 50px;
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
        width: 500px;
        height: 39px;
        color: #444;
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
        padding: 10px;
        position: relative;
        .bootstrap-table {
          margin: 0;
        }
        [tableexport-id] {
          width: 120px;
          height: 25px;
          color: #fff;
          line-height: 25px;
          border-radius: 2px;
          border: none;
          margin-bottom: 12px;
          position: absolute;
          top: 10px;
          left: 134px;
          background: #F56C6C;
        }
        .public_button {
          width: 120px;
          height: 25px;
          color: #fff;
          border-radius: 2px;
          border: none;
        }
        .print_order {
          background: #18DCF6;
        }
        /*//表格样式*/
        table {
          td {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
    }
}
.modal-open{
  #add_modify,#modify_status,#bind_img,#delete{display:flex}
  #add_modify.in,#modify_status.in,#bind_img.in,#hptc.in{z-index:2000}
}
.zIndex2{z-index:21;}
.icon{width:40px;height:40px;z-index:11;display:inline-block;}
.timeIcon{background:url(../../../assets/images/ico_calendar@2x.png) no-repeat center bottom;background-size:19px 20px;}
.searchIcon{background:url(../../../assets/images/ico_search.png) no-repeat center center;background-size:20px 20px;}
.Advanced_s{
  width: 100%;
  min-height: 430px;
  background: #fff;
  z-index: 99;
  top: 0px;
  left: 10px;
  padding:20px;
  i.close{
    opacity:1;display:inline-block;width:24px;height:24px;float:right; mergin-right:20px;background:url(../../../assets/images/ico_close.png) no-repeat center center;
  }
  .left,.right{
    .bt{
      display: inline-block;
      width: 80px;
      line-height: 40px;
      text-align: right;
      padding-right: 10px;
    }
    input,select{
      width: 75%;
      height: 40px;
      line-height: 40px;
    }
    .time{
      width: 165px;
      margin-right: 10px;

    }
  }
  .titbt{
    font-size: 18px;
    color: #333333;
  }
  .footer{
    padding-left: 30px;
    .footerbtn{
      border: 1px solid #CCCCCC;
      border-radius: 2px;
      width: 80px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #333333;
      text-align: center;
    }
    .sort{
      background: #0086FF;
      border-radius: 2px;
      color: #FFFFFF;
    }
    .czt{
      background: #fff;
    }
  }
}
.poi2{
  position: absolute;
}
.mb20{
  margin-bottom: 20px;
}
</style>
