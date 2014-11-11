// Browser detection for when you get desparate. A measure of last resort.
// http://rog.ie/post/9089341529/html5boilerplatejs
// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }
//
// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);


// remap jQuery to $
(function($){

	/* trigger when page is ready */
	$(document).ready(function (){
		
		$('html').on('mouseover', 'a[data-checkedhttpstatus!="true"]', function(e) {
			
			thisLink = $(this);
			
			// see if we have already successfully found a Wayback URL
			//var attr = thisLink.attr('data-waybackurl');
			
			checkURL = $(this).attr('href');
			
			$.ajax({ url: 'http-check.php',
				data: {url: checkURL},
				type: 'post',
				success: function(output) {
					console.log('link is ' + output);
					
					if (output == '404') {
						
						console.log('check to see if wayback has a version');
						
						$.ajax({
						    url: 'https://archive.org/wayback/available?url='+checkURL,
						    jsonp: "callback",
						    dataType: "jsonp",
						 
						    // work with the response
						    success: function(data) {
							    // get the closest snaopshot from wayback JSON
						        console.log(data.archived_snapshots.closest.url);
						        thisLink.attr('data-waybackurl', data.archived_snapshots.closest.url);
						        thisLink.attr('data-checkedhttpstatus', 'true');
						    }
						});
						
					} else {
						
						console.log('continue normally');
						
						thisLink.attr('data-checkedhttpstatus', 'true');
						
					}
					
				}
			});
			
		});
	
	});
	
	
	/* optional triggers
	
	$(window).load(function() {
		
	});
	
	$(window).resize(function() {
		
	});
	
	*/

})(window.jQuery);