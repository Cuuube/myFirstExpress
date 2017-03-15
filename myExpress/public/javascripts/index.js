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
    $('button').on('click', function() {
        //let files = $('#upload')[0];
        //console.log(files);
        let data = new FormData($('#upload')[0]);
        console.log(data);
        $.ajax({
            url: '/images',
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
                    $('body').append('<img src="' + data.msg.url + '">');
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
}
init();