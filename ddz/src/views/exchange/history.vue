<style scope>
	.history{
		padding: 1em 2%;
	}
	.ivu-select-item{
		text-align: left;
	}
</style>
<template>
	<div class="history">
		<!-- 搜索栏 -->
		<Form :label-width="80">
			<Row type="flex" justify="center" align="middle">
				<Col span="4">
	                <Form-item label="活动">
		    			<Select v-model="batch" placeholder="请选择活动" @on-change="activityChange">
		    				<Option value="0">全部</Option>
			                <Option v-for="item in batchs" :value="item.id">{{item.id}}. {{item.act_detail}}</Option>
			            </Select>
		    		</Form-item>
	            </Col>
	            <Col span="4">
	                <Form-item label="开始时间">
		    			<DatePicker v-model="start_time" type="datetime" format="yyyy-MM-dd 00:00:00" placeholder="选择开始时间" @on-ok="search" @on-clear="search"></DatePicker>
		    		</Form-item>
	            </Col>
	            <Col span="4">
	                <Form-item label="结束时间">
		    			<DatePicker v-model="end_time" type="datetime" format="yyyy-MM-dd 23:59:59" placeholder="选择结束时间" @on-ok="search" @on-clear="search"></DatePicker>
		    		</Form-item>
	            </Col>
	            <Col span="4">
                    <Form-item label="用户ID">
                        <Input v-model="uid" placeholder="输入用户ID" @on-change="search"></Input>
                    </Form-item>
                </Col>
                <Col span="4">
                    <Form-item label="兑换码">
                        <Input v-model="code" placeholder="输入兑换码" @on-change="search"></Input>
                    </Form-item>
                </Col>
			</Row>
		</Form>
		<!-- 表格 -->
		<Table highlight-row :columns="columns" :data="items" :height="height()"></Table>
        <Page :total="total" :current="page" v-show="total>0" @on-change="pageChange"></Page>
	</div>
</template>
<script>
	import config from '../../config/config';
	import url from '../../libs/url';
	import date from '../../libs/date';
    import cookie from '../../libs/cookie';
	import jsonp from 'jsonp';
	export default {
		data(){
			var self = this;
			return {
				batch: '0',
				batchs: [],
				uid: '',
				code: '',
				page: 1,
				items: [],
				start_time: '',
				end_time: '',
				height(){
                    return window.screen.availHeight - 360
                },
                columns: [
                	{title: '批次', key: 'batch',align: 'center', width: 60},
                	{title: '用户ID', key: 'gamer_id',align: 'center'},
                	{title: '兑换码', key: 'exchange_code',align: 'center'},
                	{title: '兑换时间', key: 'exchange_time',align: 'center'},
                	{title: '礼品', render: (h, params) => {
                        var history = self.items[params.index];
                        //return h('span', history.gift_type == 1 ? '上网卡' : '游戏道具')
                        var color = history.gift_type == 1 ? 'blue' :  'green';
                        var text = history.detail;

                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }},
                    //{title: '礼品', key: 'detail'},
                ],
                total: 0,
			}
		},
		mounted() {
    		this.$Loading.start();
    		this.loadBatch();
        },
		methods: {
			activityChange(value){
				var self = this;
				self.batch = value;
				self.search();
			},
			loadBatch(){
				var self = this;
        		jsonp(config.host + '/batch', null, function(error, data){
                    if(data){
                    	self.batchs = data;
                    	self.loadHistory();
                    }
                })
			},
			loadHistory(){
				var self = this;
				jsonp(config.host + '/history', {
        			param: url.serialize({
                        b: self.batch,
                        p: self.page,
                        st: date.format(self.start_time),
                        et: date.format(self.end_time),
                        uid: self.uid,
                        c: self.code,
                    }, true),
        		}, function(error, data){
                    if(data){
                    	self.total = data.total;
                    	self.items = data.history;
                        self.$Loading.finish();
                    }
                })
			},
			search(){
				this.page = 1;
				this.$Loading.start();
				this.loadHistory();
			},
			pageChange(page){
                this.page = page;
                this.$Loading.start();
                this.loadHistory();
            },
		},
	}
</script>