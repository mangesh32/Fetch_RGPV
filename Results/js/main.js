$(document).ready(function(){
  $("#resultsTab").click(function(){
    $("#attainmentTab").removeClass("active");
    $(this).addClass("active");
    $("#AttainmentTable").hide();
    $("#FINAL-ATTAINMENT").hide();
    $("#exportbtn2").hide();
    $("#exportbtn3").hide();
    $("#myTable2").fadeIn();
    $("#exportbtn").fadeIn();
    $("#gradesbtn").fadeIn();
  });
   $("#attainmentTab").click(function(){
    $("#resultsTab").removeClass("active");
    $(this).addClass("active");
    $("#myTable2").hide();
    $("#exportbtn").hide();
    $("#gradesbtn").hide();
    $("#exportbtn2").fadeIn();
    $("#exportbtn3").fadeIn();
    $("#AttainmentTable").fadeIn();
    $("#FINAL-ATTAINMENT").fadeIn();    
  });
   
   $("#exportbtn").click(function(){
    
    $("th,td").css("border","1px solid black");
    $("th,td").css("color","black");
    $("th,td").css("background-color","white");
     $("#myTable2").table2excel({
        // exclude CSS class
        exclude: ".noExl",
        name: "Results",
        filename: "RgpvResults" //do not include extension
      }); 
    $("th,td").attr("style",null);
    $(".th-cls").attr("style","color:#fff;font-family: Montserrat-Medium;");
   });
  
 //------------myTable2 Header-------------------------------------------------
 str='  <thead><tr class="row100 head"><th class="column100 column1" onclick="sortTable(0)" data-column="column1">Enrollment <a href="#"><span class="glyphicon glyphicon-sort"></span></a></th><th class="column100 column2" onclick="sortTable(1)" data-column="column2">Student Name<a href="#"><span class="glyphicon glyphicon-sort"></span></a></th><th class="column100 column3" onclick="sortTable(2)" data-column="column3">SGPA<a href="#"><span class="glyphicon glyphicon-sort"></span></a></th><th class="column100 column4" onclick="sortTable(3)" data-column="column4">CGPA<a href="#"><span class="glyphicon glyphicon-sort"></span></a></th>';
for(i in SUBJECTS){
  str+='<th class="column100 showGR column'+(5+Number(i))+'" onclick="sortTable('+(4+Number(i))+')" data-column="column'+(5+Number(i))+'">'+SUBJECTS[i]+'<a href="#"></a></th>';
}
str+='<th class="column100 column'+(6+SUBJECTS.length)+'" onclick="sortTable('+(5+SUBJECTS.length)+')" data-column="column'+(6+SUBJECTS.length)+'">Status<a href="#"><span class="glyphicon glyphicon-sort"></span></a></th></tr></thead><tbody id="TableToFeed"></tbody>';
$("#myTable2").append(str);
//------------------------------------------------------------------------------
	
	$.each(data,function(index,value){
		var ID=value.ID;
		var NAME=value.NAME;
		var SGPA=value.SGPA;
		var CGPA=value.CGPA;
		var STATUS=value.STATUS;

		var style="";
		console.log(STATUS);
		if (STATUS=="PASS" || STATUS=="PASS WITH GRACE") 
			style=" pass";
		else if (STATUS=="NOT-FOUND") 
			style=" not-found";
		else 
		{style=" fail";}
	var str='<tr class="row100 selected-row'+style+'">'
	str+='<td class="column100 column1" title="Click to open result." data-column="column1">'+ID.toUpperCase()+'</td>'
	str+='<td class="column100 column2" data-column="column2">'+NAME+'</td>'
	str+='<td class="column100 column3" data-column="column3">'+SGPA+'</td>'
	str+='<td class="column100 column4" data-column="column4">'+CGPA+'</td>'
	
  if(value.GRADES){
  for(i in SUBJECTS){
      str+='<td class="column100 showGR column'+5+Number(i)+'" data-column="column'+5+Number(i)+'">'+value.GRADES[i]+'</td>'
    }
  }else{
    for(i in SUBJECTS){
      str+='<td class="column100 showGR column'+5+Number(i)+'" data-column="column'+5+Number(i)+'">--</td>'
    }
  }
  str+='<td class="column100 column'+6+SUBJECTS.length+'" data-column="column'+6+SUBJECTS.length+'">'+STATUS+'</td>'
	str+='</tr>'

	$('#TableToFeed').append(str);

	});
//AttainmentTable:--
  //TOP HEADING-
    str='<tr class="row100 head"><th class="column100 column1"><button class="btn btn-info" id="exportbtn2">Export</button></th>'
    for(i in SUBJECTS){
      str+='<th class="column100 column'+(i+2)+'">'+SUBJECTS[i]+'</th>';
    }
    str+="</tr>";
    $('#AttainmentTable').append(str);
  //DATA-
  function append_grade(G){
    str='<tr class="row100">';
    str+='<td class="column100 th-cls" style="color:#fff;font-family: Montserrat-Medium;">'+G+'</td>';
    for (i in SUBJECTS){
      val=ATTAINMENT[SUBJECTS[i]][G];
      if(val){
        str+='<td class="column100 sub'+i+'" grade="'+G+'">'+val+'</td>';
      }
      else{
        str+='<td class="column100 sub'+i+'" grade="'+G+'">0</td>';
      }
      
    }
    str+="</tr>";
    $('#AttainmentTable').append(str);
  }

    append_grade("A+");
    append_grade("A");
    append_grade("B+");
    append_grade("B");
    append_grade("C+");
    append_grade("C");
    append_grade("D");

    //-------------------TOTAL ROW-------------------------------------

      tstr='<tr class="row100" style="background-color: #d0e1e2;">';
      tstr+='<td class="column100 th-cls" style="color:#fff;font-family: Montserrat-Medium;">Total</td>';
      for(i in SUBJECTS){
        sum=0;
        sub=".sub"+i;
        $(sub).each(function(index,element){
          sum+=Number($(element).text());
        });
        tstr+='<td class="column100 Total_sub'+i+'">'+sum+'</td>';
      }
      tstr+='</tr>';
      $("#AttainmentTable").append(tstr);
    //------------------------------------------------------------------
    //-------------------ABOVE C+---------------------------------------
    cstr='<tr class="row100" style="background-color: #d0e1e2;">';
      cstr+='<td class="column100 th-cls" style="color:#fff;font-family: Montserrat-Medium;">ABOVE C+</td>';
      for(i in SUBJECTS){
        sum=0;
        // sub=".sub"+i+"[grade='A+']";
        sum+=Number($(".sub"+i+"[grade='A+']").text());
        sum+=Number($(".sub"+i+"[grade='A']").text());
        sum+=Number($(".sub"+i+"[grade='B+']").text());
        sum+=Number($(".sub"+i+"[grade='B']").text());

        cstr+='<td class="column100 AboveCp_sub'+i+'">'+sum+'</td>';
      }
      cstr+='</tr>';
      $("#AttainmentTable").append(cstr);
    //------------------------------------------------------------------
    //----------------Percentage----------------------------------------
    cstr='<tr class="row100" style="background-color: #d0e1e2;">';
      cstr+='<td class="column100 th-cls" style="color:#fff;font-family: Montserrat-Medium;">%</td>';
      for(i in SUBJECTS){
        
        // sub=".sub"+i+"[grade='A+']";
        total=Number($(".Total_sub"+i).text());
        above=Number($(".AboveCp_sub"+i).text());
        res=above/total*100;

        cstr+='<td class="column100 Per_sub'+i+'">'+res.toFixed(2)+'</td>';
      }
      cstr+='</tr>';
      $("#AttainmentTable").append(cstr);
    //------------------------------------------------------------------
    //------------------------individual-attainment---------------------
    cstr='<tr class="row100" style="background-color: #d0e1e2;">';
      cstr+='<td class="column100 th-cls" style="color:#fff;font-family: Montserrat-Medium;">individual-attainment</td>';
      for(i in SUBJECTS){
        
        // sub=".sub"+i+"[grade='A+']";
        per=Number($(".Per_sub"+i).text());
        if(per>=80)
          res=3;
        else if(per>=70)
          res=2;
        else
          res=1;

        cstr+='<td class="column100 att_sub'+i+'" subject="'+SUBJECTS[i]+'">'+res+'</td>';
      }
      cstr+='</tr>';
      $("#AttainmentTable").append(cstr);
     //------------------------------------------------------------------
    //------------------------FINAL-ATTAINMENT---------------------------
      SUBJECTS.sort();
      //HEADER----------------------------------------------------
          cstr='<tr class="row100 head">';
      cstr+='<th class="column100 "><button class="btn btn-info" id="exportbtn3">Export</button></th>';
      len=SUBJECTS.length;
      for(var i=0;i<len;i++){

        if(i!=(len-1)){
            x=SUBJECTS[i].search(/\[P\]/)
          if(x!=-1){
              if(SUBJECTS[i+1].substring(0,x)==SUBJECTS[i].substring(0,x)){
                cstr+='<th class="column100 " >'+SUBJECTS[i]+" & "+SUBJECTS[i+1]+'</th>';
                i+=1;
              }
              else{
                // res=Number($(".att_sub"+i).text());
                cstr+='<th class="column100 " >'+SUBJECTS[i]+'</th>';
              }       
          }
        else{
                // res=Number($(".att_sub"+i).text());
                cstr+='<th class="column100 " >'+SUBJECTS[i]+'</th>';
              } 
        }
        else{
                // res=Number($(".att_sub"+i).text());
                cstr+='<th class="column100 " >'+SUBJECTS[i]+'</th>';
              } 
      }
      cstr+='</tr>';
      $("#FINAL-ATTAINMENT").append(cstr);
      //HEADER----------------------------------------------------
    cstr='<tr class="row100"  style="background-color: #e5eaba;">';
      cstr+='<td class="column100 th-cls" style="color:#fff;font-family: Montserrat-Medium;">ATTAINMENT</td>';
      len=SUBJECTS.length;
      for(var i=0;i<len;i++){

        if(i!=(len-1)){
            x=SUBJECTS[i].search(/\[P\]/)
          if(x!=-1){
              if(SUBJECTS[i+1].substring(0,x)==SUBJECTS[i].substring(0,x)){
                p=Number($("[subject='"+SUBJECTS[i]+"']").text());
                t=Number($("[subject='"+SUBJECTS[i+1]+"']").text());
                res=(0.8*t)+(0.2*p);
                cstr+='<td class="column100 " >'+res.toFixed(2)+'</td>';
                i+=1;
              }
              else{
                res=Number($("[subject='"+SUBJECTS[i]+"']").text());
                cstr+='<td class="column100 " >'+res+'</td>';
              }       
          }
        else{
                res=Number($("[subject='"+SUBJECTS[i]+"']").text());
                cstr+='<td class="column100 " >'+res+'</td>';
              } 
        }
        else{
                res=Number($("[subject='"+SUBJECTS[i]+"']").text());
                cstr+='<td class="column100 " >'+res+'</td>';
              } 
      }
      cstr+='</tr>';
      $("#FINAL-ATTAINMENT").append(cstr);
      //------------------------------------------------------------------






	$('.selected-row').click(function(){
	var id=$(this).children(0).html();
  loc='data/CLG-'+id.substr(0,4)+'/Batch-20'+String(Number(id.substr(6,2))+4)+'/'+id.substr(4,2)+'/Sem-'+sem+'/'+id+'.html';
	window.open(loc);
	});

    // $('#myTable2').DataTable( {
    //     dom: 'Bfrtip',
    //     buttons: [
    //         'copyHtml5',
    //         'excelHtml5',
    //         'csvHtml5',
    //         'pdfHtml5'
    //     ]
    // } );
   
    
     $("#exportbtn2").click(function(){
    $("th,td").css("border","1px solid black");
    $("th,td").css("color","black");
    $("th,td").css("background-color","white");
    $("#AttainmentTable").table2excel({
        // exclude CSS class
        exclude: ".noExl",
        name: "ATTAINMENT",
        filename: "AttainmentTable-1" //do not include extension
      }); 
    $("th,td").attr("style",null);
    $(".th-cls").attr("style","color:#fff;font-family: Montserrat-Medium;");
   });

     $("#exportbtn3").click(function(){
    $("th,td").css("border","1px solid black");
    $("th,td").css("color","black");
    $("th,td").css("background-color","white");
    $("#FINAL-ATTAINMENT").table2excel({
        // exclude CSS class
        exclude: ".noExl",
        name: "ATTAINMENT",
        filename: "AttainmentTable-2" //do not include extension
      }); 
    $("th,td").attr("style",null);
    $(".th-cls").attr("style","color:#fff;font-family: Montserrat-Medium;");
   });
    $("#gradesbtn").click(function(){
      $(".showGR").toggle();

    });



});

  


function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable2");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}


(function ($) {
	"use strict";
	$('.column100').on('mouseover',function(){
		var table1 = $(this).parent().parent().parent();
		var table2 = $(this).parent().parent();
		var verTable = $(table1).data('vertable')+"";
		var column = $(this).data('column') + ""; 

		$(table2).find("."+column).addClass('hov-column-'+ verTable);
		$(table1).find(".row100.head ."+column).addClass('hov-column-head-'+ verTable);
	});

	$('.column100').on('mouseout',function(){
		var table1 = $(this).parent().parent().parent();
		var table2 = $(this).parent().parent();
		var verTable = $(table1).data('vertable')+"";
		var column = $(this).data('column') + ""; 

		$(table2).find("."+column).removeClass('hov-column-'+ verTable);
		$(table1).find(".row100.head ."+column).removeClass('hov-column-head-'+ verTable);
	});
    

})(jQuery);