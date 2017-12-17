$(document).ready(function(){
	$(".pace").change(function(){
		console.log("change");
		if($(".pace").attr("class")==="pace pace-inactive"){
			$("#load_fondo").hide();
			$(".circle").hide();
			$(".circle1").hide();
			console.log("ocultar");
		}
	});
	
});