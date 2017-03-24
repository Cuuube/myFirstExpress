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
        },
        hideloading: function() {
            this.$emit('hideloading');
        },

    },
    computed: {
        filename: function() {
            let filename = this.url;
            return filename.substring(filename.lastIndexOf('/') + 1, filename.length);
        }
    },
    // beforeCreate: function() {
    //     console.log('图片列表创建了');
    // },
    mounted: function() {
        console.log('图片已经准备好了');
        this.hideloading();
        //app.hideLoading();
    },
    // beforeUpdate: function() {
    //     console.log('图片更新前');
    // },
    // updated: function() {
    //     console.log('图片更新后');
    // },
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
                            <td><input type="text" name="imgTitle" v-model="uploadNames"></td>\
                        </tr>\
                        <tr>\
                            <td><label>图片介绍：</label></td>\
                            <td><input type="text" name="intro" v-model="uploadIntros"></td>\
                        </tr>\
                        <tr>\
                            <td><label>选择图片：</label></td>\
                            <td><input type="file" multiple="multiple" name="files" class="uploadinput" @change="startSetData"></td>\
                        </tr>\
                        <tr>\
                            <td><button type="submit" @click.prevent="subm">{{submitText}}</button></td>\
                        </tr>\
                        <div class="picturePre">\
                            <img src="" alt="">\
                        </div>\
                    </table>\
                </div>\
            </form>\
            <progress id="uploadprogress" min="0" max="100" :value="progressValue"></progress>\
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
            uploadNames: '',
            uploadIntros: '',
            //用计算属性代替
            //uploadData: null,
            leftPictureNum: 0,
            formData: {},
            progressValue: 0,

        };
    },
    methods: {
        // 判断是下一步还是真上传
        subm: function(e) {
            if (this.submitText === '提交') {
                // this.uploadNames.push($('input[name=imgTitle]').val());
                // this.uploadIntros.push($('input[name=intro]').val());
                this.formData.append('imgTitle', this.uploadNames || 'No name');
                this.formData.append('intro', this.uploadIntros || 'nothing');
                this.leftPictureNum--;
                this.submit();
            } else {
                // this.uploadNames.push($('input[name=imgTitle]').val());
                // this.uploadIntros.push($('input[name=intro]').val());
                this.formData.append('imgTitle', this.uploadNames || 'No name');
                this.formData.append('intro', this.uploadIntros || 'nothing');
                this.leftPictureNum--;
                this.picturePre($('input[type=file]')[0].files.length - this.leftPictureNum);
                this.uploadNames = null;
                this.uploadIntros = null;
                //闪烁，有耦合(但是还没决定要不要留这个效果)
                app.blink();
                $('input[name=imgTitle]').focus();
                console.log(this.uploadNames, this.uploadIntros, this.leftPictureNum);
            }
        },
        // 文件选择变更后触发，初始化窗口内容
        startSetData: function() {
            this.reset();
            this.leftPictureNum = $('input[type=file]')[0].files.length;
            this.formData = new FormData($('#upload')[0]);
            this.picturePre(0);
        },
        // 真正发送表单
        submit: function() {

            var This = this;

            if (!$('.uploadinput').val()) {
                alert('图片格式错误或没有内容！');
                return;
            }

            $.ajax({
                url: '/photos/images',
                type: 'POST',
                data: this.formData,
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                // 关联文件上传进度条，用到一个插件jquery.ajax-progress.js
                progress: function(e) {
                    if (e.lengthComputable) {
                        //calculate the percentage loaded
                        This.progressValue = (e.loaded / e.total) * 100;
                        //console.log(e.loaded / e.total);
                        //log percentage loaded
                    }
                    //this usually happens when Content-Length isn't set
                    else {
                        console.warn('进度条长度出错!');
                    }
                },
                success: function(data) {
                    //if (200 === data.code) {
                    console.log('success');
                    console.log(data);
                    //(耦合)
                    //app.ajaxData = data;
                    This.senddata(data);
                    This.reset();
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
        // 预展示图片，用到FileReader
        picturePre: function(i) {
            $('.picturePre').empty();
            // 检查是否支持FileReader对象，不支持什么都不操作
            if (typeof FileReader != 'undefined') {
                var acceptedTypes = {
                    'image/png': true,
                    'image/jpeg': true,
                    'image/gif': true,
                };
                if (acceptedTypes[$('input[type=file]')[0].files[i].type] === true) {
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        var image = new Image();
                        image.src = event.target.result;
                        $('.picturePre').append(image);
                    };
                    reader.readAsDataURL($('input[type=file]')[0].files[i]);
                }
            }
        },
        // 将ajax返回数据内容送给父元素
        senddata: function(value) {
            console.log('发送传回数据！');
            this.$emit('senddata', value);
        },
        // 发送给父元素，隐藏自己
        hideme: function() {
            this.$emit('hideme');
        },
        reset: function(boolean) {
            this.uploadNames = null;
            this.uploadIntros = null;
            this.progressValue = 0;
            if (boolean === true) {
                this.leftPictureNum = 0;
                this.formData = null;
                // $('input[type=file]')[0].select();
                // document.execCommand("delete");
            }
        },

    },
    watch: {
        // 耦合(已解决，但是这个好像并没有什么用)
        //app.inputName = newValue;
        filename: function(newValue) {
            this.sendInputName(this.realFilename);
        },
    },
    computed: {
        // ？？？好像没用到
        realFilename: function() {
            let realFilename = this.filename.substring(this.filename.lastIndexOf('\\') + 1, this.filename.length);
            return realFilename;
        },
        // 观察剩余图片个数来决定按钮显示的内容
        submitText: function() {
            if (this.leftPictureNum <= 1) {
                return '提交';
            } else {
                return '下一步';
            }
        },
        // uploadData: function() {
        //     let data = new FormData($('#upload')[0]);
        //     for (let i = 0; i < $('input[type=file')[0].files.length; i++) {
        //         //data.append('upload', $('input[type=file')[0].files[i]);
        //         data.append('imgTitle', this.uploadNames[i]);
        //         data.append('intro', this.uploadIntros[i]);
        //     }
        //     return data;
        //     //data.append('upload', $('input[type=file')[0].files)

        // }
    }

});
var app = new Vue({
    el: '#photoApp',
    data: {
        //title: 'tips',
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

        loadingScreen: true,
        boom: false,

    },
    watch: {
        // 显示的URL有变的话，马上显示图片展示框
        // 并将该URL在数据库中的全套数据传给图片展示框
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
        // ajaxData: function() {
        //     //刷新列表
        //     console.log('图片列表更新了！');
        // },
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
        // 接收子元素受到点击时的图片元素
        getViewURL: function(data) {
            //通过传回url返回该文件在数据库中的全信息
            this.showImgURL = data;
            console.log(data);
        },
        // 更新数据列表，用于接收子元素的ajax返回的数据库
        updatePictures: function(data) {
            console.log('收到数据更新！');
            this.ajaxData = data;
        },
        // 显示图片上传框
        showShowDiv: function() {
            this.isSeen = true;
            console.log('打开展示框,url和data:')
            console.log(this.showImgData, this.showImgURL);
        },
        // 隐藏图片观看框
        hideShowDiv: function() {
            //this.showImgData = '';
            this.showImgURL = '';
            console.log('关闭展示框,并归零url和data:')
            console.log(this.showImgData, this.showImgURL);
            setTimeout(() => { this.isSeen = false, this.showImgData = {}; }, 50);
        },
        // 显示上传框
        showUpload: function() {
            this.isVisible = true;
        },
        // 隐藏上传框
        hideUpload: function() {
            this.isVisible = false;
        },
        // 闪烁输入框，多文件上传时加个特效用到
        blink: function() {
            this.isVisible = false;
            setTimeout(() => this.isVisible = true, 150);
        },
        showLoading: function() {
            this.loadingScreen = true;
        },
        hideLoading: function() {
            this.loadingScreen = false;
        },
        // 改变输入名称，暂时没用到
        changeInputName: function(data) {
            this.inputName = data;
            console.log('inputName:' + this.inputName);
        },
        // 按欢迎程度排序
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
        // 随机获得姓名
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
        //对中文进行encode编码函数，不对非中文编码
        //没有用上
        encodeChinese: function(str) {
            function isChinese(temp) {
                var re = /[^\u4e00-\u9fa5]/;
                if (re.test(temp)) return false;
                return true;
            }
            if (isChinese(str) === true) {
                return encodeURI(str);
            } else {
                return str;
            }
        }
    },
    /**
     * 优化逻辑，不在通过ajax内部解析结果
     * 而是直接将ajax取得的生数据给主ajaxData
     * 然后通过计算数据计算渲染列表结果
     * 渲染时直接取计算数据中的结果
     */
    computed: {
        // 格式化后的数据列表。图片显示依赖于它
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
        // 计算ajaxData中所有被观看图片的次数
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
        //this.showLoading();
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

            // 随机做一个延迟，给loading屏幕显示时间（!!测试用）
            let ranDelay = Math.floor(500 + 1000 * Math.random());
            setTimeout(() => This.ajaxData = data, ranDelay);


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