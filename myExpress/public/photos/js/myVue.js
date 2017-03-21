Vue.component('photos', {
    template: '<div class="img">\
     <img :src = "src" :alt="imgName" title="猫" @click = "check($event)"> \
    </div>',
    props: ['src', 'imgName'],
    data: function() {
        return {
            addPicture: '',
            url: '',

        }
    },
    methods: {
        check: function(e) {
            //app.showImgURL = e.target.src;
            this.$emit('check', e.target.src);
            // 触发ajax
            this.addReadTimes();
        },
        addReadTimes: function() {
            // 此处加入后台ajax，阅读数增1的行为
            let filename = app.showImgURL;
            filename = filename.substring(filename.lastIndexOf('/') + 1, filename.length);
            let url = '/photos/images/action?' + 'filename=' + filename,
                This = this;
            console.log(url);
            $.get(url, function(data, status) {
                console.log('success');
                console.log(data);
                //把返回资料整理，覆盖传给父元素的pictures
                // let newPicturesList = [];
                // for (let i = 0; i < data.length; i++) {
                //     let obj = {};
                //     obj.url = './images/' + data[i].filename;
                //     obj.filename = data[i].filename;
                //     // 短评？
                //     newPicturesList.push(obj);
                // }
                // 耦合(已解决)
                //app.pictures = newPicturesList;
                This.$emit('addReadTimes', data);
            });
        }

    }
});
Vue.component('show-img', {
    template: '<div class="show-img" v-if="seen">\
        <button class="close" @click="hideme">&times;</button>\
        <div>\
        <img :src="src">\
        </div>\
    </div>',
    props: ['src', 'seen'],
    methods: {
        hideme: function() {
            // 耦合(已解决)
            // app.showImgURL = '';
            // setTimeout(function() { app.isSeen = false; }, 10);
            this.$emit('hideme', null);

        }
    }

});
Vue.component('uploadContent', {
    template: '<div>\
            <button class="upload-button" @click="toggle">U</button>\
            <div class="upload-content" v-if="isVisible">\
                <button class="selectFile" @click="selectFile">选择文件</button>\
                <input type="text" readonly class="fileName">\
                <button class="submit" @click.prevent="submit">确定</button>\
            </div>\
        </div>',
    props: ['src', 'seen'],
    data: function() {
        return {
            isVisible: false,
            fileName: ''
        };
    },
    methods: {
        selectFile: function() {
            $('.uploadinput').trigger('click');
        },
        submit: function() {
            $('form button').trigger('click');
            this.isVisible = false;
        },
        toggle: function() {
            if (this.isVisible) {
                this.isVisible = false;
            } else {
                this.isVisible = true;
            }
        },
        sendInputName: function(value) {
            this.$emit('sendInputName', value);
        }

    },
    watch: {
        // 耦合(已解决，但是这个好像并没有什么用)
        //app.inputName = newValue;
        fileName: function(newValue) {
            this.sendInputName(newValue);
        }
    }

});
var app = new Vue({
    el: '#photoApp',
    data: {
        title: 'tips',
        isSeen: false,
        inputName: '',
        filename: '',
        //pictures: [],
        // 上面那个属性不要了，换成下面这个：存放ajax返回的数据库数据
        ajaxData: [],
        // pictures: [
        //     { url: './images/8-health-benefits-of-having-a-cat-74280bfe4befb734b8ba3d73c991883d.jpg', filename: '猫' },
        //     { url: './images/cat-300572_960_720.jpg', filename: '猫' },
        //     { url: './images/cat.jpeg', filename: '猫' },
        //     { url: './images/01-cat-wants-to-tell-you-laptop.jpg', filename: '猫' },
        // ],
        showImgURL: '',

    },
    watch: {

        showImgURL: function() {
            this.isSeen = true;
        },
        ajaxData: function() {
            //刷新列表
            console.log('图片列表更新了！');
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
        click: function(e) {
            console.log(e.target);
        },
        getViewURL: function(data) {
            this.showImgURL = data;
        },
        updatePictures: function(data) {
            this.ajaxData = data;
        },
        hideShowDiv: function() {
            this.showImgURL = '';
            setTimeout(() => this.isSeen = false, 50);
        },
        changeInputName: function(data) {
            this.inputName = data;
            console.log('inputName:' + this.inputName);
        },
    },
    /**
     * 优化逻辑，不在通过ajax内部解析结果
     * 而是直接将ajax取得的生数据给主ajaxData
     * 然后通过计算数据计算渲染列表结果
     * 渲染时直接取计算数据中的结果
     */
    computed: {
        pictureList: function() {
            let picturesList = [],
                data = this.ajaxData;
            for (let i = 0; i < data.length; i++) {
                let obj = {};
                obj.url = './images/' + data[i].filename;
                obj.filename = data[i].filename;
                // 短评？
                picturesList.push(obj);
            }
            return picturesList;
        },
    },
    // created，实例创建后，节点挂载前触发一次
    created: function() {
        let url = '/photos/images/getImgData?',
            This = this;
        console.log('ready!');
        $.get(url, function(data, status) {
            console.log('success');
            console.log(data);
            //把返回资料整理，覆盖app.pictures
            // let newPicturesList = [];
            // for (let i = 0; i < data.length; i++) {
            //     let obj = {};
            //     obj.url = './images/' + data[i].filename;
            //     obj.filename = data[i].filename;
            //     // 短评？
            //     newPicturesList.push(obj);
            // }
            This.ajaxData = data;
        });
    },
});

// 改成Vue形式
// (function getImgData() {
//     let url = '/photos/images/getImgData?';
//     $.get(url, function(data, status) {
//         console.log('success');
//         console.log(data);
//         //把返回资料整理，覆盖app.pictures
//         let newPicturesList = [];
//         for (let i = 0; i < data.length; i++) {
//             let obj = {};
//             obj.url = './images/' + data[i].filename;
//             obj.filename = data[i].filename;
//             // 短评？
//             newPicturesList.push(obj);
//         }
//         app.pictures = newPicturesList;
//     });
// })();