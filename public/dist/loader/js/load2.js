document.onreadystatechange = function(e)
{
  if(document.readyState=="interactive")
  {
    var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) 
    {
      set_ele(all[i]);
    }
  }
}

function check_element(ele)
{
  var all = document.getElementsByTagName("*");
  var total=all.length;
  var per_inc=100/total;

  if($(ele).on()){
    var prog_width=per_inc+Number($("#progress_width").val());
    $("#progress_width").val(prog_width);
    $("#bar1").animate({width:prog_width+"%"},100,function(){
      if($("#progress_width").css("width")>="100%"){
        $(".progress").fadeOut("slow");
      }			
    });
  }

  else	
  {
    set_ele(ele);
  }
}

function set_ele(set_element)
{
  check_element(set_element);
}