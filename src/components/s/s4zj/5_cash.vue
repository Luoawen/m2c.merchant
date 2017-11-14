<template>
  <div class="cash col-sm-11">
    <div class="cash_tip">
    	<div><b>温馨提示</b></div>
    	<div class="tit">
    		① 提现收款账号为合同签约的银行账号；若有改动，请及时知会商家对应的平台负责人；因您提供的账号所产生的损失，平台概不负责；
			</div>
			<div class="tit">
				② 每月最多可提现3次，每次不限制提现金额；
			</div>
			<div class="tit">
			③ 只有可用金额才可提现，申请提现后，款项从可用金额冻结为提现中金额；平台财务确认打款后提现中金额清零；申请被拒绝，款项从提现中金额变为可用金额，可再次提现；
			</div>
			<div class="tit">
			④ 当商家有一笔金额在申请提现，提现记录中可查看提现的处理进度；
			</div>
			<div class="tit">
			⑤ 申请提现后，平台在1-10个工作日审核并处理。
    	</div>
    </div>
    <div class="cash_cen">
    	<div class="cash_input clear">
    		<div class="col-sm-2 lab">
    		<span style="color: red;">*</span>
    		<span>提现金额</span>
    		</div>
    		<input class="el-input__inner col-sm-4 mr5" placeholder="最多可提现8888.88" />
    		<span class="fl mt8 mr20">元</span>
    		<a class="mt8 fl">全部提现</a>
    	</div>
    	<div class="tit">
    		本月还可提现 2 次
    	</div>
    	<div class="cash_input clear">
    		<div class="col-sm-2 lab">
    		<span>备注</span>
    		</div>
    		<div>
    			<textarea placeholder="请填写" class="el-input__inner text col-sm-6 mr5">
    			</textarea>
    		</div>
    	</div>
    </div>
    <div class="mt40 pl150">
    	<button class="btnp xyb mr20">下一步</button>
    	<button class="btnp qx">取消</button>
    </div>
  </div>
</template>
<<script>
export default {
	name:'',
    data(){
      return{
			}
		},
		methods: {
			// 请求提现剩余次数 及可提现金额
			cashMoney(){
				
			},
			//提现申请
			withdrawals(){
				let that = this;
				that.$.ajax({
          type: 'post',
          url: that.base + 'm2c.users/user/dealer/updatePassWord',
          data: {
            token: sessionStorage.getItem('mToken'),
						verifyCode:that.verifyCode,
						mobile:mobile,
						newPass:newPass,
						codeType: 5
          },
          success: function (result) {
            if (result.status === 200){
              that.content = result.content
              console.log(that.content)
            }
          }
        })
			},
		},
    mounted(){
      let that = this;
      that.cashMoney()
    }
}
</script>

<style lang="scss" scoped>
.cash{
		margin: auto;
    background: #FFFFFF;
    margin-left: 30px;
    margin-top: 20px;
    padding: 10px;
    min-height: 800px;
    .cash_tip{
    	width: 100%;
    	height: auto;
    	background: #EDF0F7;
    	padding: 20px;
    	b{
    		font-size: 16px;
				color: #333333;
    	}
    	.tit{
    		font-size: 14px;
				color: #333333;
				line-height: 25px;
    		margin-top: 5px;
    	}
    }
    .cash_cen{
    	padding-left: 50px;
    	margin-top: 40px;
    	.lab{
    		width: 100px;
    		margin-top: 8px;
    		display: inline-block;
    		text-align: right;
    	}
    	.tit{
    		font-size: 12px;
				color: #666666;
				padding-left: 100px;
    		margin-top: 10px;
    		margin-bottom: 20px;
    	}
    	.text{
    		height: 100px;
    		padding-top: 10px;
    	}
    }
    .btnp{
			border-radius: 2px;
			width: 80px;
			text-align: center;
			line-height: 30px;
			border: none;
    }
    .xyb{
    	color: #fff;
    	background: #0086FF;
    }
    .qx{
    	color: #444;
    	background: #fFF;
    	border: 1px solid #CCCCCC;
    }
}
	/*公用样式*/
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
  .mr20{
    margin-right: 20px;
  }
  .mr5{
  	margin-right: 5px;
  }
  .mt8{
  	margin-top: 8px;
  }
  .mt30{
  	margin-top: 30px;
  }
  .mt40{
  	margin-top: 40px;
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
  .pl150{
  	padding-left: 150px;
  }
</style>