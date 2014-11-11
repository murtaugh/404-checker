<?php

if(isset($_POST['url']) && !empty($_POST['url'])) {
	
	$file = $_POST['url'];
	
	$file_headers = @get_headers($file);
	
	if($file_headers[0] == 'HTTP/1.1 404 Not Found') {
		
		$exists = '404';

	} else if($file_headers[0] == '') {
	
		$exists = '404';
		
	} else {
		
		$exists = 'not 404';

	}
	
	echo $exists;

}

?>