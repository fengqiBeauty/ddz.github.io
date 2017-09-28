const routers = [{
    path: '/',
    component: (resolve) => require(['./views/index.vue'], resolve)
},{
    path: '/:current',
    component: (resolve) => require(['./views/index.vue'], resolve)
}];
export default routers;