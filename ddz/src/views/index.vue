<style>
    .index {
        width: 100%;
        min-width: 800px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
    }
    .index .flex-header{
        height: 60px;
    }
    .index .flex-body {
        height: calc(100% - 60px);
        padding: 1em 2% 1em 2%;
        /*overflow-y: auto;*/
        background-color: #eee;
    }
    .container{
        background-color: #fff;
        border-radius: 0.6em;
        overflow-y: auto;
        border-width: 1.2em 0 1.2em 0;
        border-style: solid;
        border-color: #fff;
    }

    ::-webkit-scrollbar {
        width: 14px;
        height: 14px;
    }

    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-thumb {
        border-radius: 999px;
        border: 5px solid transparent;
    }

    ::-webkit-scrollbar-track {
        box-shadow: 1px 1px 5px rgba(0,0,0,.2) inset;
    }

    ::-webkit-scrollbar-thumb {
        min-height: 20px;
        background-clip: content-box;
        box-shadow: 0 0 0 5px rgba(0,0,0,.2) inset;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle" class="flex-header">
            <Col span="24">
                <navbar :current="current" @change="navbar"></navbar>
            </Col>
        </Row>
        <Row type="flex" justify="center" class="flex-body">
            <Col span="24" class="container">
                <component :is="current" keep-alive></component>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                current: this.$route.params['current'] || 'rank',
            };
        },
        mounted() {
            
        },
        beforeDestroy() {

        },
        methods: {
            navbar(name){
                console.log(name)
                this.current = name;
            }
        },
        components: {
            'navbar': require('./layout/navbar.vue'),
            //邀请活动
            'rank': require('./invite/rank.vue'),
            'user': require('./invite/user.vue'),
            'grant': require('./invite/grant.vue'),
            //兑换活动
            'history': require('./exchange/history.vue'),
            'batch': require('./exchange/batch.vue'),
            'list': require('./exchange/list.vue'),
            'exchange': require('./exchange/exchange.vue')
        }
    };
</script>