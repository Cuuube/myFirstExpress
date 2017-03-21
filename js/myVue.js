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
Vue.component('btn', {
    template: '<button @click="add">{{times}}</button>',
    methods: {
        add: function() {
            this.times += 1;
            this.$emit('add', this.times);
        }
    },
    data: function() {
        return {
            times: 0,
        }
    }
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
        times: 0,
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
        },
        addTimes: function(data) {
            this.times += 1;
            console.log('该子组件的值为:' + data);
        }
    }
});