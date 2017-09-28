<style scope>
	.batch{
		padding: 1em 2%;
	}
	.ivu-select-item{
		text-align: left;
	}
	.ivu-form-item-content{
		text-align: left;
	}

	.modal-prize .ivu-modal-body{
		padding: 16px 100px;
		height: 300px;
		overflow-y:auto;
	}
	
	
</style>
<template>
	<div class="batch">
		<Row type="flex" justify="center" align="middle">

			<Col span="16">

				<Form :label-width="100">
					<Form-item label="活动名称">
						<Input v-model="activity.act_detail" placeholder="请输入活动名称" type="text"></Input>
					</Form-item>
					<Form-item label="活动说明">
						<Input v-model="activity.gift_detail" placeholder="请输入活动说明" type="text"></Input>
					</Form-item>
					<Form-item label="兑换渠道">
						<Select v-model="activity.qudao_hao" multiple>
							<OptionGroup v-for="group in channel_list" :label="group.describe">
					          <Option v-for="channel in group.channels" :value="channel.channel_id" >{{ channel.name}}</Option>
					        </OptionGroup>
    					</Select>
					</Form-item>
					<Form-item label="活动备注">
						<Input v-model="activity.remark" placeholder="请输入备注" type="text"></Input>
					</Form-item>
					<Form-item label="兑换次数">
						<InputNumber :max="999" :min="1" v-model="activity.per_num" style="width:50%"></InputNumber>
					</Form-item>
					<Form-item label="兑换码数量">
						<InputNumber :max="999" :min="1"  v-model="activity.exchange_nums" style="width:50%"></InputNumber>
					</Form-item>
					<Form-item label="有效时长">
						<InputNumber  :min="1" v-model="activity.valid_time" style="width:50%"></InputNumber>
					</Form-item>
					
					
					<Form-item label="活动截止期">
						<DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择活动截止日期和时间" style="width: 260px" v-model='activity.expire_time'></DatePicker>
					</Form-item>
					<Form-item label="奖品列表">
						<Row>
					       <Col span="12" >
						       <Card >
					                <Tag v-if="show" v-for="item in gift_list" closable @on-close="handleClose(item)">{{ item.simple_detail }}</Tag>
					        	</Card>
            				</Col>
            				<Col span="6" style="margin-left: 2em;">
					            <Button type="success" shape="circle" @click="giftDetail_modal = true">添加奖品</Button>
					        </Col>
        				</Row>
					</Form-item>
					<FormItem>
			            <Button type="primary" @click="submit">创建</Button>
			            <Button type="ghost" style="margin-left: 10em;" @click="reset()">重置</Button>
        			</FormItem>
				</Form>
				
				<!-- 添加奖品模态框 -->
				<Modal title="奖品详情" v-model="giftDetail_modal" class="modal-prize" :styles="{top: '150px'}" >
					
					<Form :label-width="80">
						<Form-item label="奖品名称">
							<Input  placeholder="请输入奖品名称" v-model='gift.simple_detail' type="text"></Input>

						</Form-item>
						<Form-item label="奖品类型">
							<Select v-model="gift.type" >
	        					<Option v-for="item in type_list" :disabled="check_use(item.value)" :value="item.value" :key="item.value" >{{ item.label }}</Option>
	    					</Select>
						</Form-item>
						<Form-item label="奖品数量"> 
							<InputNumber  :min="0" v-model="gift.quantity" placeholder="请输入奖品数量" style="width: 220px"></InputNumber>
						</Form-item>
						
						<Form-item label="领取详情">
							<Input v-model="gift.getting_detail" type="textarea" placeholder="请输入领取详情"></Input>
						</Form-item>
						
			        </Form>

			        <div slot="footer">
					    <Button type="ghost" @click="cancel">取消</Button>
					    <Button type="primary" style="margin-left: 1em;" @click="sure">确认</Button>
					</div>
			    </Modal>
			    <!-- 添加奖品模态框结束 -->
			    
			</Col>
		</Row>

	</div>
</template>
<script>
	import config from '../../config/config';
	//import url from '../../libs/url';
	import date from '../../libs/date';
    import cookie from '../../libs/cookie';
	//import jsonp from 'jsonp';
	import axios from 'axios';
	export default {
		data(){
			var self = this;
			return {
				activity: {
					act_detail: '',
					gift_detail: '',
					qudao_hao:[],
					remark:'',
					per_num: 1,
					exchange_nums: 0,
					valid_time:1440,
					expire_time:''
				},
				gift: {
					simple_detail: '',
					type: '',//类型
					quantity: 0,//奖品数量
					getting_detail:''//奖品描述
				},
				mock_data: [],
				targetKeys: [],
				titles: ['奖品列表','活动奖品'],
				giftDetail_modal: false,
	            show: true,
	            netType_show: false,
	            channel_list: [],
	            gift_list:[], /*礼品列表*/
	            type_list:[
	            	{
	            		value:'10',
	            		label:'金币'
	            	},
	            	{
	            		value:'11',
	            		label:'钻石'
	            	},
	            	{
	            		value:'12',
	            		label:'房卡'
	            	}
	            ]
			}
		},
		mounted() {
    		axios.defaults.baseURL = config['host_exchange'];   //配置接口地址
    		
    		this.loadChannel();
        },
        methods: {
        	/*重置*/
            reset(){
            	this.activity = {
					act_detail: '',
					gift_detail: '',
					qudao_hao:[],
					remark:'',
					per_num: 1,
					exchange_nums: 0,
					valid_time:1440,
					expire_time:''
				};
				this.gift = {
					simple_detail: '',
					type: '',//类型
					quantity: 0,//奖品数量
					getting_detail:''//奖品描述
					
				};
				this.gift_list = {}
            },
            /*删除礼品列表中礼品*/
            handleClose (item) {
                this.gift_list.pop(item);
                console.log(this.gift_list);
            },
            sure(){
            	if(this.gift.simple_detail == ''){
            		this.$Message.error('奖品名称不能为空！');
            		return;
            	}
            	else if(this.gift.value == ''){
            		this.$Message.error('奖品类型不能为空！');
            		return;
            	}
            	else if(this.gift.quantity == 0){
            		this.$Message.error('奖品数量不能为0！');
            		return;
            	}
            	else{
            		let obj = this.gift;
            		this.gift_list.push(obj);
            		this.gift_list.forEach(function(item){
            			
            		});
            		this.giftDetail_modal = false;
            		this.gift = {
						simple_detail: '',
						type: '',//类型
						quantity: 0,//奖品数量
						getting_detail:''//奖品描述
						
					};
            	}
            },
            cancel(){
            	this.giftDetail_modal = false;
            },
            check_use(value){
            	for(var i = 0, len = this.gift_list.length; i < len; i++){
            		if(value == this.gift_list[i].type){
            			return true;
            		}
            	}
            	return false;
            },
            loadChannel(){
            	var self = this;
            	axios.get('/channel')
				.then(function (response) {
					self.channel_list = response.data;
				})
				.catch(function (error) {
					console.log(error);
				});
            },
            submit(){
            	var self = this;
            	var activity = this.activity;
            	var gift_list = this.gift_list;
            	activity['gift_list'] = gift_list;
            	activity['token'] = cookie('token');
            	activity.expire_time = typeof(activity.expire_time) == 'string' ? activity.expire_time : date.format(activity.expire_time);
            	//console.log(activity);
            	axios.post('/create',activity)
            	.then(function (response) {
            		if(response.data.status == 1){
            			self.$Message.success('创建成功！');
            			self.reset();	
            		}else if(response.data.status == 0){
            			self.$Message.error(response.data.message);
            		}else {

            		}
            	})
            	.catch(function (error) {
					self.$Message.error('网络连接失败！');
				});
            	
            }
        }
	}
</script>