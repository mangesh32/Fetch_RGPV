<?php
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
function is_connected()
{
    $connected = @fsockopen("www.example.com", 80); 
                                        //website, port  (try 80 or 443)
    if ($connected){
        $is_conn = true; //action when connected
        fclose($connected);
    }else{
        $is_conn = false; //action in connection failure
    }
    return $is_conn;

}
function resultOnRGPV($from,$upto,$sem)
{
  $command="cmd /C python onRGPV.py ".substr($from,0,9)."001 ".substr($upto,0,9)."005 ".$sem;
  
  // exec ($startcommand);
  exec ( $command,$output );
  $out_str=implode("\n", $output) ;
  if(preg_match("/(Not-Found on RGPV\n*){5}/", $out_str, $match)){
  	 		return false;
  	 	}
  else{
  	return true;
  }

}

try{
	set_time_limit(60);
$from = $upto= $sem ="";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $wanted_file="";
  if(substr($from,6,2)<17){
  	$wanted_file="MAIN";
  }
  else if(substr($from,6,2)>=17){
  	$wanted_file="BTech";
  }

  $from = test_input($_POST["from"]);
  $upto = test_input($_POST["upto"]);
  $sem = test_input($_POST["sem"]);
  $command="cmd /C python ShowRES_step1.py ".$from." ".$upto." ".$sem;
  
  // exec ($startcommand);
  exec ( $command,$output );
  $out_str=implode(",", $output) ;
  // echo $out_str;
  if($out_str=="RecordAvailable"){
  	$startcommand="cmd /C python ShowRES_step2.py ".$from." ".$upto." ".$sem;

  	exec ( $startcommand,$output );
  	 	$wholeData=implode("\n", $output);
  	 	$SUBJECTS='';
  	 	$ATTAINMENT='';

  	 	if(preg_match("/DATA:(.*)/", $wholeData, $match)){
  	 		$jsonData=$match[1];
  	 	}
  	 	else
   			$jsonData='{"ID":"--","NAME":"--","SGPA":"--","CGPA":"--","STATUS":"--"}';

   		if(preg_match("/SUBJECTS:(.*)/", $wholeData, $match)){
  	 		$SUBJECTS=$match[1];
  	 	}
  	 	if(preg_match("/ATTAINMENT:(.*)/", $wholeData, $match)){
  	 		$ATTAINMENT=$match[1];
  	 	}
  	 	
   		
 	}
  else if($out_str=="RecordUnavailable"){
  		
  		if(is_connected()==false){
  			header("Location:../index.html");
			exit;
  		}
  		else{
  		if(resultOnRGPV($from,$upto,$sem)==false){
  			header("Location:ResultNotFound.html");
			exit;
  		}else{

  		ignore_user_abort(true);
		set_time_limit(0);

		ob_start();
		// do initial processing here
		echo $response; // send the response
		header('Connection: close');
		header('Content-Length: '.ob_get_length());
		header("Location:ServerBusy.html");
		ob_end_flush();
		ob_flush();
		flush();

		$f_status=fopen("Status.txt","r");
  		$status_server=fgets($f_status);
  		fclose($f_status);

  		if($status_server=="Busy"){
  		$queueCMD="cmd /C echo python ".$wanted_file.".py ".substr($from,0,9)."001 ".substr($upto,0,9)."180 ".$sem." >>Queue.txt";
  		exec($queueCMD) ;
  		}
  		else{
  			$f1=fopen("Status.txt","w+");
			fwrite($f1,"Busy");
			fclose($f1);

  			$ex_cmd="cmd /C python ".$wanted_file.".py ".substr($from,0,9)."001 ".substr($upto,0,9)."180 ".$sem;
  			exec($ex_cmd);
  			exec("cmd /C python niptao.py");
  			// exec("cmd /K notepad");

  			$f2=fopen("Status.txt","w+");
			fwrite($f2,"Idle");
			fclose($f2);
  		}
  		
  		
  		exit;
  		}
  	  }		
    }
    else
	{
	header("Location:../index.html");
	exit;
	}

  }
  // $jsonData='{"ID":"--","NAME":"--","SGPA":"--","CGPA":"--","STATUS":"--"}';
  
else
{
	header("Location:../index.html");
	exit;
}
}
catch(Exception $e){
	// echo 'Message: ' .$e->getMessage();
	header("Location:../index.html");
	exit;
}



?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Results</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="icon" type="image/png" href="images/icons/mg.png"/>

<!-- 	<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">
 -->
	<link rel="stylesheet" type="text/css" href="fonts/font-awesome-4.7.0/css/font-awesome.min.css">

	<!-- <link rel="stylesheet" type="text/css" href="vendor/animate/animate.css">

	<link rel="stylesheet" type="text/css" href="vendor/select2/select2.min.css">

	<link rel="stylesheet" type="text/css" href="vendor/perfect-scrollbar/perfect-scrollbar.css"> -->

	<!-- <link rel="stylesheet" type="text/css" href="css/util.css"> -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<link rel="stylesheet" type="text/css" href="css/tableexport.css">

</head>
<body>
	<script>	
	var data=JSON.parse('<?php echo $jsonData; ?>');
	var SUBJECTS=<?php echo $SUBJECTS; ?>;
	var ATTAINMENT=JSON.parse('<?php echo $ATTAINMENT; ?>');

	var sem=<?php echo $sem; ?> </script>
	<div class="limiter">
		
		

		<div class="container-table100">
		<ul class="nav nav-pills nav-justified">
		  <li class="active" id="resultsTab"><a href="#">Results</a></li>
		  <li id="attainmentTab"><a href="#">Attainment</a></li>
		</ul>
			<div class="wrap-table100">
				<div class="table100 ver1 m-b-110">
					<div class="scrollable-table">
					<table id="AttainmentTable">
					
			
					</table>
					</div>
					<br>
					<div class="scrollable-table">
					<table id="FINAL-ATTAINMENT">

						
					</table>
					</div>
					<div class="btn-group pull-right">
					  <button type="button" class="btn btn-primary" id="gradesbtn" >Show/Hide Grades</button>
					  <button type="button" class="btn btn-primary" id="exportbtn" >Export</button>
					</div>

					<div class="scrollable-table">
						<table data-vertable="ver1" id="myTable2">
								
						</table>
					</div>
					
				</div>
				<div id="sign"></div>
			</div>

		</div>

	</div>


	

	
	<!-- <script src="vendor/jquery/jquery-3.2.1.min.js"></script> -->
<!-- 
	<script src="vendor/bootstrap/js/popper.js"></script> -->
	<!-- <script src="vendor/bootstrap/js/bootstrap.min.js"></script> -->

	<!-- <script src="vendor/select2/select2.min.js"></script> -->

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

	<script src="js/main.js"></script>
	<script src="js/jquery.table2excel.js"></script>

	<!-- <script src="js/xlsx.core.js"></script>
	<script src="js/FileSaver.js"></script>
	<script src="js/tableexport.js"></script> -->
	

</body>
</html>