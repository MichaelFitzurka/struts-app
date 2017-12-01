/* Version: 100417  */
$(document).ready(function() {
    $('.view-toggle .btn').click(function(){

        if ($(this).hasClass('view-list')) {
            $(this).addClass('hidden');
            $(this).parents('.view-toggle').children('.view-grid').removeClass('hidden');
            $(this).parents('.tab-pane').children('.list-view').removeClass('hidden');
            $(this).parents('.tab-pane').children('.grid-view').addClass('hidden');
        }
        else if($(this).hasClass('view-grid')) {
            $(this).addClass('hidden');
            $(this).parents('.view-toggle').children('.view-list').removeClass('hidden');
            $(this).parents('.tab-pane').children('.grid-view').removeClass('hidden');
            $(this).parents('.tab-pane').children('.list-view').addClass('hidden');
        }


    });

    $('.nav-item-search .fa-times-circle').click(function(){
        $(this).prev().val('');
    });


	if($(window).width() <= 768){
		$('.nav .dropdown-toggle').removeClass('disabled');
		$(".horizontal-resources-promo-wrapper:eq(0)").addClass("in");
		$(".contact-landing h2:eq(0)").addClass("active");
		$(".contact-landing p:eq(3)").hide();


		$('.contact-landing h2').click( function() {
			$('.contact-landing h2').toggleClass("active");
		} );

	}

	if($(window).width() >= 769){
		$('.contact-landing h2').removeAttr('data-target');
		$('.horizontal-resources-promo-wrapper').removeClass('collapse');
	}



});

$(function() {

  $(document.body).on("click", "a[rel=lightbox]", function(evt) {
	evt.preventDefault();
	   var modal = $('#lightbox').modal();
		  modal.find('.modal-body').load($(this).attr('href'), function(responseText, textStatus) {
			if (textStatus === 'success' || textStatus === 'notmodified') {
			  modal.show();
			}
		  });
  });

  $(document.body).on("click", "#lightbox .close", function(evt) {
	evt.preventDefault();
	$(".modal-body").html("");
	$('.modal-backdrop').hide();
  });
});

/*-- Search - Start --*/
function searchFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("newsroomSearch");
    filter = input.value.toUpperCase();
    ul = document.getElementById("newsroomList");
    li = ul.getElementsByTagName("li");
    for (i = 1; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}
/*-- Search - End --*/

/*-- No Search Results - Start --*/
$(document).ready(function(){
  $('input[name=newsroomSearch]').attr('autocomplete','off');
  $("#newsroomSearch").keyup(function(){
   $('.input-group-btn .fa-search').hide();
   $('.reset-search').show();
   $('#search-content').show();
   var filter = $(this).val(), count = 0;

    if(filter.length == 0){
         $('.no-results-found').show();
    }
   $(".item li").each(function(){
    if ($(this).text().search(new RegExp(filter, "i")) < 0 || filter == '') {
     $(this).hide();
    } else {
     $(this).show();
        $('.no-results-found').hide();
     count++;
    }

   });
      if($('.item li:visible').length == 0){
         $('.no-results-found').show();
    }
  });
});

$(document).ready(function(){
  $(".reset-search").click(function() {
      $(':input').val('');
      $('.no-results-found').hide();
      $('.reset-search').hide();
      $('ul#newsroomList li').show();
      $('.input-group-btn .fa-search').show();
  });
});
/*-- No Search Results - End --*/
/*resource landing document with no text, function to wrap into columns 4 every two fields --start-- */
$(document).ready(function(){
	var elems = $(".webcoe-wrapper .landing-page-viewer .doc-noText .elq-form .form-group");
	var wrapper = $('<div class="col-md-4" />');
	var pArrLen = elems.length;
	for (var i = 0;i < pArrLen;i+=2){
		elems.filter(':eq('+i+'),:eq('+(i+1)+')').wrapAll(wrapper);
	};
});
/*resource landing document with no text  --end--*/