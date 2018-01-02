$(".title-loader").css({"margin-left":"-"+$(".title-loader").width()/2+"px"});
var t1 = Date.now();
var duration =1.5;
$(document).ready(function(){
	var t2 = Date.now();
	var time = t2-t1;
	var times = time/2500;
	var timesI = parseInt(times)+1;
	$('head').append(
		"<style>"+
			".cube-folding.stop span::before{"+
	 			"-moz-animation: folding 1.5s linear "+timesI+" both;"+
				"-webkit-animation: folding 1.5s linear "+timesI+" both;"+
				"animation: folding 1.5s linear "+timesI+" both;"+
			"}"+
			".cube-folding .leaf2::before {"+
			"-moz-animation-delay: 0.18s !important;"+
  		"-webkit-animation-delay: 0.18s !important;"+
  		"animation-delay: 0.18s !important;"+
  		"}"+
  		".cube-folding .leaf3::before {"+
			"-moz-animation-delay: 0.54s !important;"+
  		"-webkit-animation-delay: 0.54s !important;"+
  		"animation-delay: 0.54s !important;"+
  		"}"+
  		".cube-folding .leaf4::before {"+
			"-moz-animation-delay: 0.36s !important;"+
  		"-webkit-animation-delay: 0.36s !important;"+
  		"animation-delay: 0.36s !important;"+
  		"}"+
  "</style>");
	$(".cube-folding").addClass("stop");
	$(".cube-wrapper").delay((1500)*timesI-time).fadeOut(500, function(){
		$(".loader").fadeOut(500);
		$("body").css({"overflow-y":"auto"});
		//$("main").fadeIn(500);
		//$("footer").fadeIn(500);
		console.log(t1);
		console.log(t2);
		console.log(time);
		console.log(times);
		console.log(timesI);
	});
})