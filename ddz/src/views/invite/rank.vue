<style scope>
	.rank{
		padding: 1em 2%;
	}
    .ivu-page{
        padding-top: 1em;
    }
</style>
<template>
    <div class="rank">
    	<Form :label-width="80">
    		<Row type="flex" justify="center" align="middle">
    			<Col span="6">
	                <Form-item label="游戏">
		    			<Select v-model="area_id" placeholder="请选择游戏" @on-change="areaChange">
			                <Option v-for="(item,i) in area" :value="item.id">{{item.describe}}</Option>
			            </Select>
		    		</Form-item>
	            </Col>
	            <!-- <Col span="6">
	                <Form-item label="年月">
		    			<Date-picker type="month" placeholder="选择年月"></Date-picker>
		    		</Form-item>
	            </Col> -->
	            <Col span="6">
	                <Form-item label="排行榜">
		    			<Select v-model="rid" placeholder="请选择排行榜" @on-change="rankChange">
			                <Option v-for="(item,i) in list" :key="item.area_id + '_' + item.id" :value="item.id">{{item.name}}</Option>
			            </Select>
		    		</Form-item>
	            </Col>
                <Col span="6">
                    <Form-item label="用户ID">
                        <Input v-model="uid" @on-change="search" number></Input>
                    </Form-item>
                </Col>
	        </Row>
    	</Form>
    	<Table highlight-row :columns="columns" :data="items" :height="height()"></Table>
        <Page :total="total" :current="page" v-show="total>0" @on-change="pageChange"></Page>
    </div>
</template>
<script>
	import config from '../../config/config';
	import url from '../../libs/url';
	import jsonp from 'jsonp';
    import axios from 'axios';
    export default {
    	data(){
    		return {
    			rid: 0,
    			list: [],
    			columns: [
                    //{type: 'index', width: 60, align: 'center'},
                    {title: '排名', key: 'place', width: 60, align: 'center'},
                    {title: '用户', key: 'nickname'},
                    {title: '用户ID', key: 'uid'},
                    {title: '渠道号', key: 'channel_id'},
                    {title: '积分', key: 'point'},
                ],
                items: [],
                area: [],
                area_id: 0,
                month: new Date(),
                uid: '',
                page: 1,
                pagesize: 10,
                total: 0,
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
                axios.post('/rank/area',{
                    
                })
                .then(function(response){
                   if(response.data){
                        self.area = response.data;
                        self.area_id = 1;
                        //self.rank_list();
                    }
                })
                .catch(function(error){
                    console.log(error);
                })
        		
        	},
        	areaChange(value){
        		this.$Loading.start();
        		this.area_id = value;
        		this.rank_list();
        	},
        	rank_list(){
        		var self = this;
                axios.post('/rank/rank_list',{
                     aid: self.area_id
                })
                .then(function(response){
                    var data = response.data;
                    var item = {
                        name: '请选择',
                        id: 0
                    };
                    self.list = data;
                    self.list.splice(0, 0, item);
                    self.rid = 0;
                    self.top();
                })
                .catch(function(error){
                    console.log(error);
                })
        	},
        	rankChange(value){
        		this.$Loading.start();
                self.page = 1;
        		this.top();
        	},
            search(){
                var self = this;
                self.top();
            },
        	top(){
        		var self = this;
                var rank = null;
                for(var i = 0; i < self.list.length; i++){
                    if(self.rid == self.list[i].id){
                        rank = self.list[i];
                    }
                }

                axios.post('/rank',{
                    id: rank?rank.id:0,
                    p: self.page,
                    key: self.uid
                })
                .then(function(response){
                    var data = response.data;
                    if(data){
                        self.items = data.list;
                        self.total = data.total;
                    }
                    self.$Loading.finish();
                })
                .catch(function(error){
                    console.log(error);
                })
        	},
            pageChange(page){
                this.page = page;
                this.top();
            }
        }
    }
</script>