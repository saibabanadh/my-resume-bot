var blur=false,
iteration=1,
patience=true,
itr2Class={
	1:'a',2:'b',3:'c',4:'d',5:'e'
},
alerter,
change,
revert,
title,
isIphone=/(iPhone)/i.test(navigator.userAgent),
isSafari=!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

function isElementInViewport(el){
	if(typeof jQuery==="function"&&el instanceof jQuery){
		el=el[0];
	}
	var rect=el.getBoundingClientRect();
	return(rect.top>=0&&rect.left>=0&&rect.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&rect.right<=(window.innerWidth||document.documentElement.clientWidth));
}

function setAlerter(){
	if(blur){
		alerter=setTimeout(function(){
			title=document.title;
			change=setInterval(function(){
				document.title='Resume Bot';
				revert=setTimeout(function(){
					document.title=title;
				},2500);
			},5000);
		},10000);
	}
}

window.onblur=function(){
	blur=true;
};
window.onfocus=function(){
	blur=false;
	clearTimeout(alerter);
	clearInterval(change);
	clearTimeout(revert);
	if(title)document.title=title;
};

function showItem($el){
	var $p=$el.find('p'),$ell=isIphone||isSafari?$p:$el,w=$ell.width(),h=$ell.height()+'px';
	w=(w+5)+'px';
	var delay=parseInt($el.data('delay')||900)+100;
	if(patience&&!$el.hasClass('btn')){
		$el.css('visibility','visible');
		$el.addClass('wait jump');
		$p.addClass('hide');
		setTimeout(function(){
			$el.removeClass('jump').animate({height:h,width:w},100,function(){
				setTimeout(function(){
					$el.removeClass('wait');
					$p.toggleClass('hide show');
				},500);
				if(!isElementInViewport($el)){
					$('html, body').animate({
						scrollTop:$el.offset().top-100
					},2000);
				}
			});
		},
		delay);
	} else {
		setTimeout(function(){
			$el.css('visibility','visible');
			if($el.hasClass('btn')){
				$el.find('button:eq(1)').addClass('move');
				setAlerter();
			}
		},1000);
	}
}

function runInteration(){
	var $items=$('.item.'+itr2Class[iteration]);
	$items.each(function(i){
		var $el=$(this);
		setTimeout(function(){
			showItem($el);
		},(patience?parseInt($el.data('delay')||1700):500)*i);
	});
}

$(function(){var $items=$('.item'),$outerW=$('.outer').width();
	$items.css('visibility','hidden');
	runInteration();
	$('.item.goon > button').on('click',function(){
		var c=$(this).hasClass('yes')?'yes':'no',d=$(this).data('show');
		var $item=$(this).closest('.item');
		var $p=$item.find('p').html(d);
		$item.toggleClass('btn other');
		$item.css('margin-left',($outerW-$p.width()-40)+'px');
		patience=(c=='yes');
		iteration=2;
		showItem($('.item.goon.'+c).show());
		setTimeout(runInteration,patience?1700:1000);
	});
	$('.item.contact > button').on('click',function(){
		var c=$(this).hasClass('yes')?'yes':'no',d=$(this).data('show');
		var $item=$(this).closest('.item');
		var $p=$item.find('p').html(d);
		$item.toggleClass('btn other');
		$item.css('margin-left',($outerW-$p.width()-40)+'px');
		showItem($('.item.contact.'+c).show());
		iteration=3;
		setTimeout(runInteration,patience?1700:1000);
	});
});