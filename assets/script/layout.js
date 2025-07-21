
var isMobile = false;
var ui = {}
ui = { 
    init: function(){        
		this.gnb.init();	
        //this.navigation.init();	
        this.lnb.init();	
        this.searchOpen.init();		
        console.log("ui init");        				
    }, 
    gnb : {
        init:function(){		
            var $gnb = $('#gnb > .gnb-menu > li > a');  
            var $headerWrap = $('.header');
            var $header = $('.header-body');
           
            if($(window).width() > 1279){
                $gnb.on('mouseenter focusin',function(){   
                    var $activeDepth01 = $(this).parent('li');
                    $activeDepth01.addClass('active').siblings().removeClass('active'); 
                    //$('.btn-gnb-menuall').addClass('active');   
                    /*
                    var heightArr = [];                  
                    $activeDepth01.find('.gnb-depth02-wrap > ul > li').each(function(){
                        heightArr.push($(this).height()); 
                    });  
                    var max = Math.max.apply(null, heightArr);
                    $activeDepth01.find('.gnb-depth02-wrap > ul').css({'height':max});
                    */      
                    var max = $activeDepth01.find('.gnb-depth02-wrap').height();  
                    console.log("max :"+max);
                    $header.addClass('active');
                    $headerWrap.addClass('active');
                    $header.css({'height':max + 64});
                    $activeDepth01.find('.gnb-depth02-wrap').css({'height':max});
                    $('.layer-mask').show();  
                    //mobile menu
                });
                $header.on('mouseleave',function(){          
                    $header.removeClass('active');
                    $headerWrap.removeClass('active'); 
                    $header.css({'height':''});
                    //$('.is-desktop #gnb .gnb-depth02-wrap').css({'height':''});
                    $('.is-desktop #gnb .gnb-depth02-wrap > ul > li').css({'height':''});
                    $gnb.parent().removeClass('active');             
                    $('.btn-gnb-menuall').removeClass('active'); 
                    $('.layer-mask').hide();
                });
        
                //키보드 접근성
                /*
                $('.gnb-menu li:last-child ul li:last-child a').on('focusout',function(){      
                    //$gnb.parent().removeClass('active'); 
                    $header.css({'height':''});
                    $headerWrap.removeClass('active');     
                    $('.is-desktop #gnb .gnb-depth02-wrap > ul').css({'height':''});  
                    $('.btn-gnb-menuall').removeClass('active');       
                    $('.layer-mask').hide();          
                });
                */
                $('.btn-gnb-menuall').on('click',function(){ 
                    /*if($(this).hasClass('active')){                                   
                        $(this).removeClass('active');  
                        $header.removeClass('active');  
                        $headerWrap.removeClass('active'); 
                        //$gnb.parent().removeClass('active');                        
                        $header.css({'height':''});
                        $('.layer-mask').hide();
                    } else {                    
                        $(this).addClass('active');                    
                        $headerWrap.addClass('active');
                        $header.addClass('active');
                        $('#gnb > .gnb-menu > li:first-child > a').trigger('focusin');
                        $('.layer-mask').show();
                    }  
                    */
                    return true;   //pc에서는 사이트맵으로 이동
                });  
            } else {
                //mobile
                $('#gnb > .gnb-menu > li a').on('click',function(){
                    $(this).parent().toggleClass('active').siblings('li').removeClass('active');            
                    if($(this).parent().find('ul').length > 0){                
                        return false;
                    } else {
                        return true;
                    }; 
                });  
                $('.btn-gnb-menuall').on('click',function(){ 
                    if($(this).hasClass('active')){                                   
                        $(this).removeClass('active');    
                        $('html').removeClass('active');
                        $header.removeClass('active');  
                        $headerWrap.removeClass('active'); 
                        $('.layer-mask').hide();
                    } else {                    
                        $(this).addClass('active');      
                        $('html').addClass('active');              
                        $headerWrap.addClass('active');
                        $header.addClass('active');
                        $('.layer-mask').show();
                    }  
                    return false;   
                });  
            }  
        }       
    },
    lnb : {
        init:function(){
            var $this = $('.lnb-menu li a');      
            $this.on('click',function(){
                if($(this).parent().find('ul').length > 0){
                    if($(this).parent().hasClass('active')){
                        $(this).parent().removeClass('active')
                        $(this).attr('title','하위메뉴 열림');                   
                    } else {
                        $(this).parent().addClass('active').siblings('li').removeClass('active');
                        $(this).attr('title','하위메뉴 닫힘');
                    }
                    return false;
                } else {
                    return true;
                }
            }) 
        }        
    },  
    searchOpen : {
        init:function(){
            $('.mobile-search-btn a').on('click',function(){                
                if($(this).parent().hasClass('active')){
                    $(this).parent().removeClass('active');
                    $('.search-wrap').removeClass('active'); 
                    $('.layer-mask').removeClass('active');
                    $('html').css({'overflow':'visible'});
                } else {
                    $(this).parent().addClass('active');
                    $('.search-wrap').addClass('active');
                    $('.layer-mask').addClass('active');
                    $('html').css({'overflow':'hidden'});
                }
                return false;
            })
        }
    },
    breadcrumbs : {
        init:function(){
            $('.nav-list > li > ul > li:last a').focusout(function(){
                $(this).parent().parent().parent().removeClass('is-active');
                $(this).parent().parent().parent().find('.btn-view').removeClass('is-active');
                $(this).parent().parent().parent().find('.btn-view').find('span').text('메뉴열기');
            }); 
            
            $('.nav-list > li > ul > li > a').click(function(){    
                var selectedPath = $(this).text();
                console.log(selectedPath);
                $(this).parent().addClass('is-active').siblings().removeClass('is-active'); 
                $(this).parent().parent().parent().toggleClass('is-active').siblings().removeClass('is-active');  
                $(this).parent().parent().parent().find('>a>span').text(selectedPath);
                //return false;      
            });
        
            $('.nav-list > li > button').click(function(){      
                if($(this).hasClass('is-active')){
                    $(this).removeClass('is-active');
                    $(this).parent('li').siblings().find('.btn-view').removeClass('is-active');             
                    $(this).parent('li').removeClass('is-active');
                    $(this).find('span').text('메뉴열기');
                }else{
                    $(this).addClass('is-active');
                    $(this).parent('li').addClass('is-active').siblings().removeClass('is-active'); 
                    $(this).parent('li').siblings().find('.btn-view').removeClass('is-active'); 
                    $(this).find('span').text('메뉴닫기');
                }                 
                return false;       
            });
        }
    }
}

//$(window).load(function(){   //publish mode only
$(document).ready(function(){     
    ui.init();    
});

$(window).bind('resize load',function(){
    var dw = $(window).width();
    if(dw > 1280){
        $('html').removeClass('is-mobile');
        $('html').addClass('is-desktop');
        $(".header-link-wrap").insertAfter(".header-search-wrap");       
    } else {
        $('html').removeClass('is-desktop');
        $('html').addClass('is-mobile');
        $(".header-link-wrap").insertBefore(".header-search-wrap");        
    }    
});

$(function(){   
    //skipnav
    $('#skipnav a').click(function() {
        var skipTo="#"+this.href.split('#')[1];
        $(skipTo).attr('tabindex', -1).on('blur focusout', function() {
            $(this).removeAttr('tabindex');
        }).focus();
        return false;
    });
    
    $('.location > ul > li').hover(function(){
        $(this).children('a').siblings('ul').toggle();
    });  
    
});
