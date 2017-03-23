Vue.component('photos', {

    template: '<li>\
                    <div class="box">\
                        <div class="picture-box">\
                            <img :src="imgData.imgURL" :alt="imgData.imgTitle" :title="imgData.imgTitle"  @click.stop="check">\
                            <div class="picture-content" @click.stop="check">\
                                <h4 class="picture-title">{{imgData.imgTitle}}</h4>\
                                <p class="picture-introduction">{{imgData.intro}}</p>\
                                <span class="picture-uploadTime">{{imgData.uploadTime}}</span>\
                            </div>\
                        </div>\
                        <ul class="extra">\
                            <li><span class="views">{{imgData.showTimes}}</span></li>\
                            <li><span class="cmnt">{{imgData.cmnt}}</span></li>\
                            <li><span class="fav" @click.stop="liked">{{imgData.likes}}</span></li>\
                        </ul>\
                    </div>\
                    <div class="picture-header">\
                        <img :src="imgData.uploaderHeadshot" alt="uploader">\
                        <a href="#" class="picture-author">{{imgData.uploader}}</a>\
                    </div>\
                </li>',
    props: ['imgData'],
    data: function() {
        return {
            addPicture: '',
            url: '',
        }
    },
    methods: {
        check: function(e) {
            //app.showImgURL = e.target.src;
            this.url = $(e.target).parents('.picture-box').find('img')[0].src;
            console.log('点击的目标！', this.url);
            this.$emit('check', this.url);

            //耦合
            //app.showImgURL = src;
            // 触发ajax
            this.addtimes();
        },
        addtimes: function() {
            // 此处加入后台ajax，阅读数增1的行为
            let filename = this.filename;
            let url = '/photos/images/action?' + 'filename=' + filename,
                This = this;

            $.get(url, function(data, status) {
                // console.log('success');
                // console.log(data);
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
                console.log('输送数据更新！');
                This.$emit('addtimes', data);
            });
        },
        liked: function(e) {
            $(e.target).addClass('liked');
            this.url = $(e.target).parents('.box').find('img')[0].src;
            let filename = this.filename;
            let url = '/photos/images/action?' + 'filename=' + filename,
                This = this;

            $.get(url, function(data, status) {
                // console.log('success');
                // console.log(data);
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
                console.log('输送数据更新！');
                This.$emit('addtimes', data);
            });
        }

    },
    computed: {
        filename: function() {
            let filename = this.url;
            return filename.substring(filename.lastIndexOf('/') + 1, filename.length);
        }
    },
});

Vue.component('show-img', {
    template: '<div class="show-picture-screen">\
        <div class="show-picture-container">\
            <button class="close" @click="hideme">&times;</button>\
            <div class="show-picture-center">\
                <div class="picture-info">\
                    <div class="uploader-head"><img :src="imgData.uploaderHeadshot" :alt="imgData.imgTitle"></div>\
                    <h3>{{imgData.imgTitle}}</h3>\
                    <p>by <span class="uploader">{{imgData.uploader}}</span> on <span class="uploadDate">{{imgData.uploadTime}}</span></p>\
                </div>\
                <div class="picture-watch">\
                    <img :src="imgData.imgURL" :alt="imgData.imgTitle">\
                </div>\
            </div>\
        </div>\
     </div>',
    // template: '<div class="show-img" v-if="seen">\
    //     <button class="close" @click="hideme">&times;</button>\
    //     <div>\
    //     <img :src="src">\
    //     </div>\
    // </div>',
    props: ['imgData'],
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
    template: '<div class="upload-container">\
            <div class="upload-header">\
                <h1>Upload</h1>\
                <button class="close" @click="hideme">&times;</button>\
            </div>\
            <form action="javascript:;" enctype="multipart/form-data" id="upload" method="post" class="hidden">\
                <div class="upload-body">\
                    <table>\
                        <tr>\
                            <td><label>图片名：</label></td>\
                            <td><input type="text" name="imgTitle"></td>\
                        </tr>\
                        <tr>\
                            <td><label>图片介绍：</label></td>\
                            <td><input type="text" name="intro"></td>\
                        </tr>\
                        <tr>\
                            <td><label>选择图片：</label></td>\
                            <td><input type="file" name="files" class="uploadinput" @change="getFilename"></td>\
                        </tr>\
                        <tr>\
                            <td><button type="submit" @click.prevent="submit">提交</button></td>\
                        </tr>\
                    </table>\
                </div>\
            </form>\
        </div>',
    // template: '<div>\
    //         <button class="upload-button" @click="toggle">U</button>\
    //         <div class="upload-content" v-if="isVisible">\
    //             <button class="selectFile" @click="selectFile">选择文件</button>\
    //             <input type="text" readonly class="fileName">\
    //             <button class="submit" @click.prevent="submit">确定</button>\
    //         </div>\
    //     </div>',
    //props: ['seen'],
    data: function() {
        return {
            filename: '',
        };
    },
    methods: {
        submit: function() {
            //$('form button').trigger('click');
            console.log($('.uploadinput').val())
            if (!$('.uploadinput').val()) {
                alert('图片格式错误！');
                return;
            }
            let data = new FormData($('#upload')[0]);
            console.log(data);
            $.ajax({
                url: '/photos/images',
                type: 'POST',
                data: data,
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                success: function(data) {
                    //if (200 === data.code) {
                    console.log('success');
                    console.log(data);
                    //(耦合)
                    app.ajaxData = data;
                    // let newPicturesList = [];
                    // for (let i = 0; i < data.length; i++) {
                    //     let obj = {};
                    //     obj.url = './images/' + data[i].filename;
                    //     obj.filename = data[i].filename;
                    //     // 短评？
                    //     newPicturesList.push(obj);
                    // }
                    // app.pictures = newPicturesList;
                    //$('.main-show').append('<img src="' + data.msg.url + '">');
                    // $('.main-show').append('<div class="img"><img src="' + data.msg.url + '"></div>');
                    // addHander();
                    // } else {
                    //    console.log(false);
                    //  console.log(data);

                    //}
                },
                error: function() {
                    console.log('error');
                }
            });
            this.hideme();
        },
        sendInputName: function(value) {
            this.$emit('sendInputName', value);
        },
        getFilename: function() {

            this.filename = $('.uploadinput').val();
            console.log(this.filename);
            console.log(this.realFilename);
        },
        hideme: function() {
            this.$emit('hideme');
        }

    },
    watch: {
        // 耦合(已解决，但是这个好像并没有什么用)
        //app.inputName = newValue;
        filename: function(newValue) {
            this.sendInputName(this.realFilename);
        },
    },
    computed: {
        realFilename: function() {
            let realFilename = this.filename.substring(this.filename.lastIndexOf('\\') + 1, this.filename.length);
            return realFilename;
        }
    }

});
var app = new Vue({
    el: '#photoApp',
    data: {
        title: 'tips',
        isSeen: false,
        isVisible: false,
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
        showImgData: {},

        boom: false,

    },
    watch: {

        showImgURL: function() {
            let This = this;
            let filename = this.showImgURL;
            filename = filename.substring(filename.lastIndexOf('/') + 1, filename.length);
            this.ajaxData.forEach(function(val, index) {
                if (val.filename == filename) {
                    console.log('值', val)
                    This.showImgData = val;
                    This.showShowDiv();
                }
            });
        },
        ajaxData: function() {
            //刷新列表
            console.log('图片列表更新了！');
        },
        // showImgData: function(val) {
        //     this.isSeen = true;

        // }
    },
    methods: {
        // toggle: function() {
        //     if (this.isSeen) {
        //         this.isSeen = false;
        //     } else {
        //         this.isSeen = true;
        //     }
        // },
        click: function(e) {
            console.log(e.target);
        },
        getViewURL: function(data) {
            //通过传回url返回该文件在数据库中的全信息
            this.showImgURL = data;
            console.log(data);
        },
        updatePictures: function(data) {
            this.ajaxData = data;
            console.log('收到数据更新！');
        },
        showShowDiv: function() {
            this.isSeen = true;
            console.log('打开展示框,url和data:')
            console.log(this.showImgData, this.showImgURL);
        },
        hideShowDiv: function() {
            //this.showImgData = '';
            this.showImgURL = '';
            this.showImgData = {};
            console.log('关闭展示框,并归零url和data:')
            console.log(this.showImgData, this.showImgURL);
            setTimeout(() => this.isSeen = false, 50);
        },
        showUpload: function() {
            this.isVisible = true;
        },
        hideUpload: function() {
            this.isVisible = false;
        },
        changeInputName: function(data) {
            this.inputName = data;
            console.log('inputName:' + this.inputName);
        },
        sortByPopular: function(which) {
            // let arr = this.ajaxData;
            // console.log(arr);
            // for (let x = 0; x < arr.length - 1; x++) {
            //     for (let y = this.ajaxData.length - 1; y > x + 1; y--) {
            //         console.log(y, this.ajaxData[y].showTimes);
            //         if (this.ajaxData[y].showTimes < this.ajaxData[y - 1].showTimes) {
            //             let temp = this.ajaxData[y - 1];
            //             app.ajaxData[y - 1] = this.ajaxData[y];
            //             //arr[y - 1] = arr[y];
            //             //arr[y] = temp;
            //             app.ajaxData[y] = temp;
            //         }
            //     }
            // }
            this.ajaxData.sort(function(a, b) {
                if (which === 'up') {
                    return a.showTimes - b.showTimes;
                } else {
                    return b.showTimes - a.showTimes;
                }

            })

        },
        randomPerson: function() {
            let personNames = {
                '0': 'Joan Joule',
                '1': 'Andy Partridge',
                '2': 'Bill Wilson',
                '3': 'Nelly Ferguson',
                '4': 'Maria Hubbard',
                '5': 'Truman Jackson',
                '6': 'Evan Ezekiel',
                '7': 'Primo Walton',
                '8': 'Chloe Tommy',
                '9': 'Winston Camp'
            }
            let personHeadshot = '../../images/heads/' + Math.floor(10 * Math.random()) + '.png';
            let obj = {
                name: personNames[Math.floor(10 * Math.random())],
                headshot: personHeadshot,
            };
            return obj;
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
                obj.imgURL = data[i].imgURL;
                // filename 还要不要？
                obj.filename = data[i].filename;
                obj.imgTitle = data[i].imgTitle;
                obj.intro = data[i].intro;
                obj.uploader = data[i].uploader;
                obj.uploaderHeadshot = data[i].uploaderHeadshot;
                obj.uploadTime = data[i].uploadTime;
                //obj.showTimes = data[i].showTimes;
                obj.showTimes = data[i].showTimes;
                obj.likes = data[i].likes;
                obj.cmnt = data[i].cmnt;
                //
                picturesList.push(obj);

            }
            console.log('图片列表：', picturesList);
            return picturesList;
        },
        totleWatchedTimes: function() {
            let times = 0;
            this.ajaxData.forEach(function(val, index) {
                if (val.showTimes) {
                    times += val.showTimes;
                }
            });
            return times;
        }
    },
    //created，实例创建后，节点挂载前触发一次
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