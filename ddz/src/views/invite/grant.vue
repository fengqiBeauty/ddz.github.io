<style scope>
	.grant{
		padding: 1em 2%;
	}
	.grant-footer{
		margin-top: 1em;
	}
</style>
<template>
	<div class="grant">
		<!-- <Row type="flex" justify="center" align="middle">
            <Col span="6">
                <Upload :action="action" name="excel">
			        <Button type="ghost" icon="document">上传Excel</Button>
			    </Upload>
            </Col>
        </Row> -->
        <Form :label-width="80">
    		<Row type="flex" justify="center" align="middle">
    			<Col span="6">
	                <Form-item label="Excel文件">
		    			<Select v-model="index" placeholder="请选择文件" @on-change="fileChange">
			                <Option v-for="(item,i) in files" :value="i">{{item.file}}</Option>
			            </Select>
		    		</Form-item>
	            </Col>
	        </Row>
	    </Form>

	    <Table highlight-row :columns="columns" :data="items" :height="height()" @on-selection-change="selectChange"></Table>
		
		<Row type="flex" justify="center" align="middle" class="grant-footer">
            <Col span="6">
			    <Button type="primary" @click="grant" :disabled="uids.length==0">确认发放</Button>
            </Col>
        </Row>

	</div>
</template>
<script>
	import config from '../../config/config';
	import url from '../../libs/url';
	import cookie from '../../libs/cookie';
	import jsonp from 'jsonp';
    import axios from 'axios'
	export default {
		data(){
			return {
				//action: config.host + '/grant/excel',
				files: [],
				index: 0,
				items: [],
				columns: [
                    //{type: 'index', width: 60, align: 'center'},
                    {type: 'selection',width: 60,align: 'center'},
                    {title: '排名', key: 'place', width: 60, align: 'center'},
                    {title: '用户', key: 'nickname'},
                    {title: '用户ID', key: 'uid'},
                    {title: '钻石', key: 'diamond'},
                    {title: '房卡', key: 'room_card'},
                    //{title: '渠道号', key: 'channel_id'},
                    //{title: '积分', key: 'point'},
                ],
                uids: [],
                height(){
                    return window.screen.availHeight - 360
                },
			}
		},
    	mounted() {
            axios.defaults.baseURL = config['host'];   //配置接口地址
    		this.load();
        },
        methods: {
        	load(){
        		this.$Loading.start();
        		var self = this;
                axios.post('/grant',{

                })
                .then(function(response){
                    var data = response.data;
                    if(data){
                        self.files = data;
                        self.loadData();
                    }
                })
                .catch(function(error){
                    console.log(error);
                })


        	},
        	loadData(){
        		var self = this;
                axios.post('/grant/getData',{
                     index: self.index
                })
                .then(function(response){
                   self.$Loading.finish();
                   var data = response.data;
                    if(data){
                        self.items = data;
                        self.files = data;
                        self.area_id = 1;
                        self.loadData();
                    }
                })
                .catch(function(error){
                    console.log(error);
                })
        	},
        	fileChange(value){
        		this.index = value;
        		this.$Loading.start();
        		this.loadData();
        	},
        	selectChange(list){
        		var self = this;
        		self.uids = [];
        		for(var i = 0; i < list.length; i++){
        			self.uids.push(list[i].uid);
        		}
        	},
        	grant(){
        		var self = this;
                axios.post('/grant/grant',{
                    index: self.index,
                    uids: self.uids,
                    token: cookie('token')
                })
                .then(function(response){
                    var data = response.data;
                   if(data.status == 1){
                        self.$Message.success(data.message);
                    }else if(data.status == 0){
                        self.$Message.error(data.message);
                    }else{}
                })
                .catch(function(error){
                    self.$Message.error('连接服务器失败');
                })

        	}
        }
    }
</script>