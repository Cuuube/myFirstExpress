var app = new Vue({
    el: '#app',
    data: {
        hello: 'Hello Vue!',
    }
});

Vue.component('lista', {
    template: '<li>{{value}}</li>',
    props: ['value'],
});
Vue.component('my-ul', {
    template: '<ul>\
    <lista v-for="item in items" :value="item.appName"></lista>\
    </ul>',
    props: ['items'],

})
var app2 = new Vue({
    el: '#app2',
    data: {
        title: 'tips',
        isSeen: true,
        app: [
            { appName: '微信' },
            { appName: '网易云' }
        ],
    },
    watch: {
        isSeen: function() {
            console.log(this.isSeen);
        }
    },
    methods: {
        toggle: function() {
            if (this.isSeen) {
                this.isSeen = false;
            } else {
                this.isSeen = true;
            }
        }
    }
});