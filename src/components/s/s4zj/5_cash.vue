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
		<template v-if="passWord">
			<div class="cash_cen">
				<div class="cash_input clear">
					<div class="col-sm-2 lab">
					<span style="color: red;">*</span>
					<span>提现金额</span>
					</div>
					<el-input v-model="tradableA" class="col-sm-4" style="padding-left:0px;" :placeholder="'最多可提现'+tradableAmount" :disabled="isdisable" @blur="checkTradab"></el-input>
          <span class="fl mt8 mr20">元</span>
          <a class="mt8 fl" @click="tradabAll" v-show="availableCount > 0">全部提现</a>
          <i class="red redTip" v-show="isEmpty">提现金额必须大于0</i>
          <i class="red redTip" v-show="checkShow">提现金额不能大于可提现金额</i>
				</div>
				<div class="tit">
					本月还可提现 {{availableCount}} 次
				</div>
				<div class="cash_input clear">
					<div class="col-sm-2 lab">
					<span>备注</span>
					</div>
					<div>
						<textarea placeholder="请填写" class="el-input__inner text col-sm-6 mr5" v-model="applyComment" maxlength="200">
						</textarea>
					</div>
				</div>
			</div>
			<div class="mt40 pl150">
				<button class="btnp xyb mr20" @click="passWordShow">下一步</button>
				<router-link :to="{name:'survey'}"><button class="btnp qx">取消</button></router-link>
			</div>
		</template>
		<template v-if="!passWord">
			<div class="cash_cen">
				<div class="cash_input clear">
					<div class="col-sm-2 lab">
					<span style="color: red;">*</span>
					<span>交易密码</span>
					</div>
					<el-input type="password" v-model="payPassword" class="col-sm-4" style="padding-left:0px;" placeholder="6位数密码" @blur="checkEmpty" :maxlength='6' ></el-input>
					<router-link class="mt8 fl" :to="{name:'cashPass',query:{from:'cash'}}">忘记密码</router-link>
					<i class="red redTip" v-show="numberShow">剩余{{6-errorCount}}次输错提现密码机会</i>
					<i class="red redTip" v-show="isEmpty">交易密码不能为空</i>
				</div>
			</div>
			<div class="mt40 pl150">
				<button class="btnp xyb mr20" @click="save()" :disabled="errorCount>5">提交</button>
				<button class="btnp qx" @click="goBack()">取消</button>
			</div>
		</template>
  </div>
</template>
<script>
export default {
	name:'',
    data(){
      return{
				tradableAmount:'', // 获取到的可提现金额
				isdisable:false, // input框是否禁用
				tradableA:'', // 暂存提现金额
				availableCount:0, // 可提现次数
				applyComment:'', // 备注
				checkShow: false,
				isEmpty:false,
				passWord:true,
				payPassword:'',
				numberShow:false, // 剩余次数
				withdrawalId:'', // 提现单id
				errorCount:0 // 密码错误次数
			}
		},
		methods: {
			// 提交申请
			save () {
				let that = this
				if (that.payPassword == '') {
					that.isEmpty = true
				} else {
					that.isEmpty = false
					that.withdrawals()
				}
			},
			// 校验交易密码是否为空
			checkEmpty () {
				let that = this
				if (that.payPassword == '') {
					that.isEmpty = true
				} else {
					that.isEmpty = false
				}
			},
			// 下一步
			passWordShow () {
				let that = this
				if (that.tradableA == '') {
					that.isEmpty = true
				} else {
					that.isEmpty = false
					if(that.tradableA > that.tradableAmount){
						that.checkShow = true
					}else{
						that.passWord = false
					}
				}
			},

      //点击取消
      goBack(){
			  let that = this;
			  that.passWord = false
        that.$router.push({name : 'survey',query: {}})
      },
			// 全部提现
			tradabAll(){
				let that = this
				that.tradableA = that.tradableAmount
				that.isEmpty = false
			},
			// 校验是否超过可提现金额
			checkTradab () {
				let that = this
				if (that.tradableA == '') {
					that.isEmpty = true
				} else {
					that.isEmpty = false
					if(that.tradableA > that.tradableAmount){
						that.checkShow = true
					}
					if(that.tradableA <= 0){
            that.isEmpty = true
          }
				}
			},
			// 请求提现剩余次数 及可提现金额 申请单Id
			cashMoney(){
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
							that.tradableAmount = result.content.tradableAmount/100
							if(that.tradableAmount==0){
								that.isdisable = true
							}
            }
          }
				})
				that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.trading/web/withdrawal/availableCount',
          data: {
            token: sessionStorage.getItem('mToken'),
						correlationId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
						correlationType:2
          },
          success: function (result) {
            if (result.status === 200){
							that.availableCount = result.content.availableCount
							if(that.availableCount==0){
								that.isdisable = true
							}
            }
          }
				})
				that.$.ajax({
          type: 'get',
          url: this.base + 'm2c.scm/unit/suibian',
          data: {
            token: sessionStorage.getItem('mToken'),
          },
          success: function (result) {
            if (result.status === 200){
							that.withdrawalId = result.content
							console.log(that.withdrawalId)
            }
          }
				})

			},
			withdrawals(){
				let that = this;
				that.$.ajax({
          type: 'post',
          url: that.base + 'm2c.trading/web/withdrawal/dealer/apply',
          data: {
						token: sessionStorage.getItem('mToken'),
						createdUserId:JSON.parse(sessionStorage.getItem('mUser')).userId,
						createdUserName:JSON.parse(sessionStorage.getItem('mUser')).username,
						amount:(that.tradableA*100).toFixed(),
						withdrawalId:that.withdrawalId,
						correlationId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
						correlationType:2,
						payPassword:that.md5(that.payPassword).toLowerCase(),
						applyComment: that.applyComment
          },
          success: function (result) {
            if (result.status === 200){
              that.$router.push({name : 'survey',query: {}})
              console.log(result)
            }else{
							that.show_tip(result.errorMessage)
							that.numberShow = true
							that.$.ajax({
								type: 'get',
								url: that.base + 'm2c.trading/web/withdrawal/dealer/payPasswordErrorCount',
								data: {
									token: sessionStorage.getItem('mToken'),
									correlationId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
									correlationType:2
								},
								success: function (result) {
									if (result.status === 200){
										that.errorCount = result.content.errorCount
									}
								}
							})
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
