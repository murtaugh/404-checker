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
		
		// try to identify internal links and skip them
		// credit: http://css-tricks.com/snippets/jquery/target-only-external-links/
		$('a').filter(function() {
			return this.hostname && this.hostname !== location.hostname;
		}).addClass('external');
		
		// test links that are external, and haven't already been checked
		$('html').on('mouseover', 'a.external[data-checkedhttpstatus!="true"]', function(e) {
			
			thisLink = $(this);
			
			checkURL = $(this).attr('href');
			
			$.ajax({ url: 'http-check.php',
				data: {url: checkURL},
				type: 'post',
				success: function(output) {
					console.log('link is ' + output);
					
					if (output == '404') {
						
						// check to see if wayback has a version
						$.ajax({
						    url: 'https://archive.org/wayback/available?url='+checkURL,
						    jsonp: "callback",
						    dataType: "jsonp",
						 
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