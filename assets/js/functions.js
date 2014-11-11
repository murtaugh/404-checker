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
			
			checkHTTPcode(thisLink, checkURL);
			
		});
	
	});
	
	function checkHTTPcode(whichLink, whichURL) {
		
		$.ajax({ url: 'http-check.php',
			data: {url: whichURL},
			type: 'post',
			success: function(output) {
				
				console.log('link is ' + output);
							
				whichLink.attr('data-checkedhttpstatus', 'true');
				
				if (output == '404') {
					
					// call the wayback API to see if there's a snapshot
					$.ajax({
					    url: 'https://archive.org/wayback/available?url='+checkURL,
					    jsonp: "callback",
					    dataType: "jsonp",
					 
					    success: function(data) {
						    
						    // check the size of wayback's array
						    Object.size = function(obj) {
							    var size = 0, key;
							    for (key in obj) {
							        if (obj.hasOwnProperty(key)) size++;
							    }
							    return size;
							};
						    
						    var waybackSuccess = Object.size(data.archived_snapshots);
						    
						    // check if Wayback returned no snapshot values
						    if (waybackSuccess == 0) {
								
								// no result
								console.log('no snapshot');
								
							} else {
						    
						    	// got a result from wayback
					        	console.log(data.archived_snapshots.closest.url);
					        
								whichLink.attr('data-waybackurl', data.archived_snapshots.closest.url);
								
							}
							
					    }
					});
					
				} else {
					
					console.log('continue normally');
					
				}
				
			}
		});	
		
	};

})(window.jQuery);