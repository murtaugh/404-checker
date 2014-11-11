<?php


	
	$file = 'http://alistapweefrt.com';
	
	$file_headers = @get_headers($file);
	
	
	echo $file_headers[0];


?>