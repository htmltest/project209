$(document).ready(function() {

    $('.welcome-discount-link a').click(function(e) {
        var promoTop = $('.promo').offset().top;
        var promoHeight = $('.promo').outerHeight();
        var windowHeight = $(window).height();
        var newTop = promoTop;
        if (windowHeight > promoHeight) {
            newTop = promoTop - (windowHeight - promoHeight) / 2;
        }
        $('html, body').animate({'scrollTop': newTop});
        e.preventDefault();
    });

    $.validator.addMethod('imei',
        function(curValue, element) {
            return this.optional(element) || curValue.match(/^\d{15}$/);
        },
        'IMEI должен состоять из 15 цифр'
    );

    $('body').on('focus', '.form-input input', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('blur', '.form-input input', function() {
        $(this).parent().removeClass('focus');
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        } else {
            $(this).parent().removeClass('full');
        }
    });

	$('body').on('keyup', '.form-input input', function() {
		if ($(this).val() != '') {
			$(this).parent().addClass('full');
		} else {
			$(this).parent().removeClass('full');
		}
	});

    $('form').each(function() {
        initForm($(this));
    });

	$('input.imei').attr('autocomplete', 'off');
    
    $('.form-input-hint').click(function() {
        $('.form-input-hint').toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.form-input-hint').length == 0 && !$(e.target).hasClass('form-input-hint')) {
            $('.form-input-hint').removeClass('open');
        }
    });

    $('body').on('click', '.result-btn a', function(e) {
        var curLink = $(this);
        $('.result').addClass('loading');
        $.ajax({
            type: 'POST',
            url: curLink.attr('href'),
            dataType: 'html',
            cache: false
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert('Сервис временно недоступен, попробуйте позже.');
            curForm.removeClass('loading');
        }).done(function(html) {
            $('.promo-form-content').html(html);
        });
        e.preventDefault();
    });

    $('body').on('click', '.prefs-video-link', function(e) {
        var curLink = $(this);
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);

        $('.window').html('<div class="window-container"><div class="window-video"><div class="window-video-inner"><div class="window-video-iframe"><iframe width="560" height="315" src="' + curLink.attr('href') + '?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></div><a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');

        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        fade: true,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 1000,
        pauseOnFocus: false,
        pauseOnHover: false,
        pauseOnDotsHover: false
    });

});

function initForm(curForm) {
    curForm.find('input.imei').mask('000000000000000');

	curForm.find('.form-input input').each(function() {
		if ($(this).val() != '') {
			$(this).parent().addClass('full');
		} else {
			$(this).parent().removeClass('full');
		}
	});

    curForm.find('.form-input input:focus').each(function() {
        $(this).trigger('focus');
    });

    curForm.find('.form-input input').blur(function(e) {
        $(this).val($(this).val()).change();
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            curForm.addClass('loading');
            var curData = curForm.serialize();
            $.ajax({
                type: 'POST',
                url: curForm.attr('action'),
                dataType: 'html',
                data: curData,
                cache: false
            }).fail(function(jqXHR, textStatus, errorThrown) {
                alert('Сервис временно недоступен, попробуйте позже.');
                curForm.removeClass('loading');
            }).done(function(html) {
                $('.promo-form-content').html(html);
            });
        }
    });
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
    }
}