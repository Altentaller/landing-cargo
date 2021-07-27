AOS.init({
  once: true
});

$(document).ready(function(){
    $('.slider__inner').slick({          
        infinite: true,
        speed: 1200,
        slidesToShow: 1,
        prevArrow: '<button type="button" class="slick-prev"><img src="img/icon/btn-left.png"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="img/icon/btn-right.png"></button>',
        responsive: [
            {
              breakpoint: 992,
              settings: {
                dots: true,
                dotsClass: "slider-dots",
                arrows: false
              }
            }
        ]
    });

    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
      $(this)
        .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
        .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
    });

 
    function toggleSlide(item){ 
      $(item).each(function(i) { 
        $(this).on('click', function(e){
          e.preventDefault();
          $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
          $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');        
        })
      });
    };

    toggleSlide('.catalog-item__link');
    toggleSlide('.catalog-item__back');


  
    $('.modal__close').on('click', function(){
      $('.overlay, #consult, #order, #thanks').fadeOut('slow');
    });

    $('[data-modal=consult]').on('click', function(){
      $('.overlay, #consult').fadeIn('slow');
    });

    
    $('.button_small').each(function(i){  
      $(this).on('click', function(){
        $('#order .modal__desc').text($('.catalog-item__subtitle').eq(i).text());
        $('.overlay, #order').fadeIn('slow');
      })
    });

    
    function validateForm(form){
      $(form).validate({
        rules: {
          name: "required",
          tel: "required",
          email: {
            required: true,
            email: true
          }
        },
        messages: {
          name: "Пожалуйста, укажите Ваше имя",
          tel: "Пожалуйста, укажите Ваш телефон",
          email: {
            required: "Пожалуйста, укажите Ваш email",
            email: "Неправильно введен адрес почты"
          }
        }
      });      
    };

    validateForm('#main-form form');
    validateForm('#consult form');
    validateForm('#order form');

    $('input[name=tel]').mask("+7 (999) 999-99-99");
 

    $('form').submit(function(e){
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: "mailer/smart.php",
        data: $(this).serialize()
      }).done(function(){
            $(this).find("input").val("");
            $('#consult, #order').fadeOut();
            $('.overlay, #thanks').fadeIn('slow');

            $('form').trigger('reset');
      });
      return false
    });


    $(window).scroll(function() {
      if ($(this).scrollTop() > 700) {
          $('.pageup').fadeIn();
      } else {
          $('.pageup').fadeOut();
      }
  });


  $("a[href=#up]").click(function(){
      const _href = $(this).attr("href");
      $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
      return false;
  });

  new WOW().init();

  });

 