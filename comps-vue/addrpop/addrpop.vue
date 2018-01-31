<template>
	<section class="addr">
		<div class="addr_main" :class="{addr_show: addrpop.isshow}">
			<div class="addr_form" v-show="addrform">
				<div class="add_part_t">恭喜你获得{{addrpop.giftname}}</div>		            
				<div class="content">请填写您的联系方式，我们会在七个工作日内将奖品寄出</div>		            
				<div class="addform">		                
					<div class="add_tr">
						<div class="add_key">姓名：</div>
						<input type="text" class="input_style" v-model="username">
					</div>		                
					<div class="add_tr">
						<div class="add_key">手机号：</div>
						<input type="text" class="input_style" maxlength="11" v-model="mobile">
					</div>		                
					<div class="add_tr">		                	
						<div class="add_key">地址：</div>		                	
						<div class="city_choose">		                		
							<select class="prov" v-model="defaultpro">
								<option v-for="item in province" :value="item.key" v-text="item.value">
								</option>
							</select>
							<select class="city" v-model="defaultcity">
								<option v-for="item in city" :value="item.key" v-text="item.value"></option>
							</select>
						</div>		                	
						<textarea class="address" v-model="addrinfo"></textarea>		                
					</div>		                	            
				</div>		            
				<a href="javascript:;" class="add_btn" @click="sendForm">确定</a>
				<div class="tips" :class="{tipsshow: tipsshow}" v-text="tips"></div>
				<div class="close" @click="close"></div>
			</div>
			<div class="result_ok" v-show="result">		            
				<div class="add_part_t" v-text="result_status"></div>		            
				<div class="content" v-text="result_msg"></div>		            
				<a href="javascript:;" class="add_btn" @click="ok">确定</a>
			</div>
		</div>		            	        		        
		<div class="addrpop_mask"></div>
	</section>
</template>
<script type="text/javascript">
	import './style.scss';
	import 'mint-ui/lib/style.css';
	import utils from 'pubs/utils/utils';
	import {Picker} from 'mint-ui';

	export default{
		data: function(){
			return{
				data: {},
				province: [],	      // 省份列表
				city: [],		      // 当前省份下的城市列表
				defaultpro: '',		  // 默认省份
				defaultcity: '',	  // 默认城市
				username: '',		  // 姓名
				mobile: '',			  // 电话
				realpro: '',		  // 最终选择的省份
				realcity: '',		  // 最终选择的城市
				addrinfo: '',		  // 详细地址
				addrform: true,		  // 控制表单显示
				result: false,		  // 控制表单提交结果弹层
				result_status: '',	  // 表单提交结果反馈
				result_msg: '',		  // 表单提交失败信息提示
				tips: '',			  // 提示内容
				tipsshow: false		  // 控制错误提示气泡
			}
		},
		/*
		 *组件调用只需要传一个addrpop对象（:addrpop="object对象"）
		 *addrpop:{
				isshow: true/false	控制用户地址弹层显示隐藏（必选）
				giftname: 获得的奖品名称
				statusPost: 获取用户默认的地址信息接口API
				actionPost: 地址提交接口API
				cb: function(){}  登录或者注册成功之后的回执函数（默认刷新页面，可选）
			}
		*/
		props:{
			// 接收父级传来的值
			addrpop: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		watch:{
			// 监控省份、城市值变化
			defaultpro(newVal, oldVal){
				this.city = this.cityGet(this.data.data[newVal].list);
				this.realpro = this.getValue(newVal, this.province);
				this.defaultcity = this.city[0].key;
				this.realcity = this.city[0].value;
			},
			defaultcity(newVal, oldVal){
				this.realcity = this.getValue(newVal, this.city);
			}
		},
		methods:{

			// 获取地址信息
			loadArea: function(){
				this.$http.jsonp('http://game.g.pptv.com/api/ajax/addr_info.php?act=getAddr', { params:{}, jsonp:'cb'}).then(resp=>{
					this.data = JSON.parse(resp.body);
					if( this.data.status == 1 ){
						for(let i in this.data.data){
							this.province.push({ key: i, value: this.data.data[i].name });
						}
						this.city = this.cityGet(this.data.data[10].list);
						this.defaultpro = this.province[0].key;
						this.defaultcity = this.city[0].key;
						this.userAddrinfo();
					}
				});
			},

			// 获取用户的地址信息
			userAddrinfo: function(){
				this.$http.jsonp(this.addrpop.statusPost, { params:{}, jsonp:'cb'}).then(resp=>{
					let mydata = JSON.parse(resp.body);
					if( mydata.status == 1 ){
						this.username = mydata.data.realname;
						this.mobile = mydata.data.phone;
						if( mydata.data.address.length > 0 ){
							let myaddr = mydata.data.address.split(',');
							this.defaultpro = this.getKey(myaddr[0], this.province);
							this.city = this.cityGet(this.data.data[this.defaultpro].list);
							var _this = this;
							setTimeout(function(){
								_this.defaultcity = _this.getKey(myaddr[1], _this.city);
							},100);
							this.addrinfo = myaddr[2];
							this.realpro = myaddr[0];
							this.realcity = myaddr[1];
						}
					}
				});
			},

			// 提交表单
			sendForm: function(){

				if( this.username.length == 0 ){
					this.updata('姓名不能为空');
					return;
				};

				if( this.mobile.length < 6 ){
					this.updata('请输入正确的手机号');
					return;
				};

				if( this.addrinfo.length == 0 ){
					this.updata('请输入详细收货地址');
					return;
				};

   				this.$http.jsonp(this.addrpop.actionPost,{ params:{
                        realname: this.username,
                        phone: this.mobile,
                        city: this.realcity,
                        province: this.realpro,
                        addr: this.addrinfo
   				}, jsonp:'cb'}).then(resp => {
   					let backdata = JSON.parse(resp.body);
					this.result = true;
					this.addrform = false;
   					if( backdata.status && backdata.status == 1 ){
   						this.result_status = '信息提交成功';
   						this.result_msg = '请耐心等待，我们将会在七个工作日内将奖品寄出';
   					}else{
   						this.result_status = '信息提交失败';
   						this.result_msg = backdata.message;
   					}
   				});

			},

			// 获取当前省份下的城市列表
		    cityGet: function(citydata){
		    	let mycity = [];
		    	for(let i in citydata){
					mycity.push({key:i, value: citydata[i]});
				}
				return mycity;
		    },

		    // 通过key值获取对应的value
		    getValue: function(key, values){
		    	let value = '';
		    	for( let i = 0, len = values.length; i < len; i++ ){
		    		if( values[i].key == key ){
		    			value = values[i].value;
		    		}
		    	};
		    	return value;
		    },

		    // 通过value值获取对应的key
		    getKey: function(value, values){
		    	let key = '';
		    	for( let i = 0, len = values.length; i < len; i++ ){
		    		if( values[i].value == value ){
		    			key = values[i].key;
		    		}
		    	};
		    	return key;
		    },

		    // 关闭弹层
		    close: function(){
		    	this.addrpop.isshow = false;
		    },

		    // 确定
		    ok: function(){
		    	this.addrpop.isshow = false;
		    	// 回执函数
				if(this.addrpop.cb && typeof this.addrpop.cb == 'function'){
					this.addrpop.cb.apply(null, arguments);
					return;
				};
				window.location.reload();
		    },

		    // 报错
			updata: function(tips){
				let _this = this;
				this.tipsshow = true;
				this.tips = tips;
				setTimeout(function(){
					_this.tipsshow = false;
					// 异步操作数据——手动跟新数据
		      		_this.$nextTick(function () {
		      		});
				},1500);
			}

		},
		mounted: function(){
			this.$nextTick(function(){
				this.loadArea();
			});
		}
	}
</script>