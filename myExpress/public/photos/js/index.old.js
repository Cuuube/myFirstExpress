function init() {
    var $form = $('form');
    // $form.on('submit', function(e) {
    //     e.preventDefault();
    //     let files = $('#upload')[0];
    //     console.log(files);
    //     let data = new FormData(files);
    //     $.post('./images', data, function() {
    //         console.log('ok');
    //     })
    //     console.log(data);
    // });
    $('form button').on('click', function() {
        //let files = $('#upload')[0];
        //console.log(files);
        if (!$('.upload-content .fileName').val()) {
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
    });
    // $('.upload-button').on('click', function() {
    //     $(this).next('.upload-content').toggle();
    // });
    // $('.selectFile').on('click', function() {

    //     $('form input').trigger('click');

    // });
    $('.uploadinput').on('change', function() {
        let name = $('.uploadinput').val();
        console.log(name);
        $('.fileName').val(name.substring(name.lastIndexOf('\\'), name.length));
    });
    // $('.page-menu ul li').on('click', function(e) {
    //     // console.log($(this).find('a'));
    //     // $(this).find('a').click();
    //     // e.stopPropagation();
    // });
    // $('.submit').click(function() {
    //     $('form button').trigger('click');
    //     //console.log($('form input').val());
    // });
    // $('.close').on('click', function() {
    //     $(this).parent().parent().hide(500);
    // });
    //$('.hidden').hide();


    // function addHander() {
    //     // important ,to server and basedata
    //     $('.img').on('click', function() {
    //         let src = $(this).children('img').attr('src');
    //         console.log(src);
    //         let $showImg = $('.show-img');
    //         $showImg.children('img').attr('src', src);
    //         $showImg.show(500);
    //     });
    // };
    // addHander();


}
init();