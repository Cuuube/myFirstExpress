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
                if (200 === data.code) {
                    console.log('success');
                    console.log(data);
                    //$('.main-show').append('<img src="' + data.msg.url + '">');
                    // $('.main-show').append('<div class="img"><img src="' + data.msg.url + '"></div>');
                    // addHander();
                } else {
                    console.log(false);
                    console.log(data);

                }
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
    $('form input').on('change', function() {
        let name = $('form input').val();
        $('.fileName').val(name.substring(name.lastIndexOf('\\'), name.length));
    });
    // $('.submit').click(function() {
    //     $('form button').trigger('click');
    //     //console.log($('form input').val());
    // });
    // $('.close').on('click', function() {
    //     $(this).parent().hide(500);
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