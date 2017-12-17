$(document).ready( function() {
	 /*var t1 = */$('#tabla1').DataTable({
    	responsive: true,
    	/*"columns": [
    		{ "class": "nosel", 
 
    			 "orderable": true
    		},
            { "class": "sel1" },
            { "class": "sel1" },
            { "class": "sel1" },
            { "class": "sel1" },
            { "class": "sel1" },
            { "class": "nosel" }],*/
    	"info" : true,
    	"paging":true
    	//"order": [[ 1, "desc" ]]
    });

    /*$('td.sel1').on('click', function () {
       if(!$("#tabla1").hasClass("collapsed")){
    	   var tr = $(this).closest('tr');
	       var row = t1.row( tr );
	
	       if ( row.child.isShown() ) {
	           // This row is already open - close it
	           row.child.hide();
	           tr.removeClass('shown');
	       }
	       else {
	    	   var idx = tr.attr("id");
	           // Open this row
	    	   console.log("CLICK"+idx);
	           row.child( $("#panel"+idx).html() ).show();
	           row.child().addClass("hijo");
	           row.child().addClass("container");
	           tr.addClass('shown'); 
	        }
        }
    });*/

    /*var t2 = */$('#tabla2').DataTable({
        responsive: true,
        /*"columns": [
            { "class": "nosel", 
 
                 "orderable": true
            },
            { "class": "sel3" },
            { "class": "sel3" },
            { "class": "sel3" },
            { "class": "sel3" },
            { "class": "sel3" },
            { "class": "nosel" }],*/
       // "info" : true,
        //"paging":true
        //"order": [[ 1, "desc" ]]
    });
    
    /*$('td.sel3').on('click', function () {
        if(!$("#tabla3").hasClass("collapsed")){
           var tr = $(this).closest('tr');
           var row = t2.row(tr);
    
           if ( row.child.isShown() ) {
               // This row is already open - close it
               row.child.hide();
               tr.removeClass('shown');
           }
           else {
               var idx = tr.attr("id");
               // Open this row
               row.child( $("#panel"+idx).html() ).show();
               row.child().addClass("hijo");
              row.child().addClass("container");
               tr.addClass('shown');
               
           }
        }
    });*/

});