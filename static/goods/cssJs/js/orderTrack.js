/**
 * Created by Administrator on 2016/12/27.
 * @desc  订单物流
 */
var vm = new Vue({
  el:'#orderTrack',
  data:{
    logistics:[],
    state:0,
    isLoader:0
  },
  computed: {
    //权限按钮
  },
  mounted:function(){

    this.loadLogisticsInfo();

  },
  methods: {
    //获取物流信息
    loadLogisticsInfo : function () {
      let that=this;
      $.ajax({
        url: that.getApiUrl() + 'm2c.scm/order/app/getExpressInfo',
        data: {
          com: that.GetQueryString('com'),
          nu:that.GetQueryString('nu')
        },
        type: 'get',
        success: function (data) {
          if(data.status =200){
            console.log(JSON.parse(data.content));
            if(JSON.parse(data.content).status=="200"){
              that.logistics=JSON.parse(data.content).data;
              console.log(that.logistics.length)
              that.state=JSON.parse(data.content).state;
              that.isLoader=1;
            }else{
              that.isLoader=2;
            }
          }else{
            that.isLoader=2;
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          that.isLoader=2;
        },
      });
    },
    getApiUrl :function  () {
      var apiUrl = ''
      var href = window.location.href
      if (href.includes('m2c2017dev')) { // 开发环境
        apiUrl = 'http://api.m2c2017dev.com:80/'
      } else if (href.includes('m2c2017test')) { // 测试环境
        apiUrl = 'http://api.m2c2017test.com:80/'
      } else if (href.includes('m2c2017local')) { // 本地环境
        apiUrl = 'http://api.m2c2017local.com:80/'
      } else if (href.includes('localhost')) { // 本地环境
        apiUrl = 'http://api.m2c2017test.com:80/'
      } else { // 演示环境
        apiUrl = 'http://api.m2c2017.com:80/'
      }
      return apiUrl
    },
    GetQueryString: function (name){
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if(r!=null)return  unescape(r[2]); return null;
    }
  }
});

