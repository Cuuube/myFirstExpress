Vue.component('photos', {
    template: '<div class="img">\
    <img :src="src" :alt="imgName" :title="imgName" @click="check($event)">\
    </div>',
    props: ['src', 'imgName'],
    data: function() {
        return {
            addPicture: ''
        }
    },
    methods: {
        check: function(e) {
            app.showImgURL = e.target.src;
            // 此处加入后台ajax，阅读数增1的行为
            let filename = app.showImgURL;
            filename = filename.substring(filename.lastIndexOf('/') + 1, filename.length);
            let url = '/photos/images/action?' + 'filename=' + filename;
            console.log(url);
            $.get(url, function(data, status) {
                console.log('success');
                console.log(data);
            });
        },
        updatePictures: function() {
            //主图片列表刷新
            this.addPicture = app.showImgURL;
            app.pictures.push({
                url: this.addPicture,
                filename: 'cat'
            });
            console.log(app.pictures);
        }
    }
});
Vue.component('show-img', {
    template: '<div class="show-img" v-if="seen">\
        <button class="close" @click="hide">&times;</button>\
        <img :src="src">\
    </div>',
    props: ['src', 'seen'],
    methods: {
        hide: function() {
            app.showImgURL = '';
            setTimeout(function() { app.isSeen = false; }, 10);
        }
    }

});
Vue.component('uploadContent', {
    template: '<div>\
            <button class="upload-button" @click="toggle">U</button>\
            <div class="upload-content" v-if="isVisible">\
                <button class="selectFile" @click="selectFile">选择文件</button>\
                <input type="text" readonly class="fileName" value="">\
                <button class="submit" @click.prevent="submit">确定</button>\
            </div>\
        </div>',
    props: ['src', 'seen'],
    data: function() {
        return {
            isVisible: false
        };
    },
    methods: {
        selectFile: function() {
            $('form input').trigger('click');
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

    }

});
var app = new Vue({
    el: '#photoApp',
    data: {
        title: 'tips',
        isSeen: false,
        pictures: [
            { url: './images/8-health-benefits-of-having-a-cat-74280bfe4befb734b8ba3d73c991883d.jpg', filename: '猫' },
            { url: './images/cat-300572_960_720.jpg', filename: '猫' },
            { url: './images/cat.jpeg', filename: '猫' },
            { url: './images/01-cat-wants-to-tell-you-laptop.jpg', filename: '猫' },
        ],
        showImgURL: '',

    },
    watch: {

        showImgURL: function() {
            this.isSeen = true;
        },
        pictures: function() {
            //刷新列表
            console.log('图片列表更新了！')
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
        updatePictures: function() {

        }
    }
});