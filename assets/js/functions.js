(function($){

	/* trigger when page is ready */
	$(document).ready(function (){
		
		// attempt to identify internal links so we can skip them
		// credit: http://css-tricks.com/snippets/jquery/target-only-external-links/
		$('a').filter(function() {
			return this.hostname && this.hostname !== location.hostname;
		}).addClass('external');
		
		// run a scan on links that are external, and haven't already been checked
		// ideally this owuld be limited to portions of the page that we know 
		// might contain old and broken links
		$('html').on('mouseover', 'a.external[data-checkedhttpstatus!="true"]', function(e) {
			
			thisLink = $(this);
			
			checkURL = thisLink.attr('href');
			
			the404checker(thisLink, checkURL);
			
		});
	
	});
	
	// for demo purposes
	function fakeConsole(text) {
		
		$('#fake-console').append(text + '\n');
		console.log(text);
		
	};
	
	function the404checker(whichLink, whichURL) {
		
		$.ajax({ url: 'http-check.php',
			data: {url: whichURL},
			type: 'post',
			success: function(output) {
				
				fakeConsole('link is ' + output);
							
				whichLink.attr('data-checkedhttpstatus', 'true');
				
				if (output == '404') {
					
					var waybackAPI = 'https://archive.org/wayback/available?';
					
					// look to see if the page has a pubdate. if yes, 
					// use it to ask Wayback for a snapshot from that time
					if (($('#pubdate').length != 0) && ($('#pubdate').attr('data-waybackpubdate'))) {
						
						var pubdate = $('#pubdate').attr('data-waybackpubdate');
						waybackCall = waybackAPI + 'url=' + checkURL + '&timestamp=' + pubdate;
						
					} else {

						// otherwise just ask Wayback for the most recent snapshot
						waybackCall = waybackAPI + '?url=' + checkURL;
						
					}
					
					// call the wayback API to see if there's a snapshot
					$.ajax({
					    url: waybackCall,
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
								fakeConsole('no Wayback snapshot\n------------');
								
							} else {
						    
								// got a result from wayback
								fakeConsole('Wayback has a snapshot: ' + data.archived_snapshots.closest.url + '\n------------');
					        
								whichLink.attr('data-waybackurl', data.archived_snapshots.closest.url);
								
							}
							
					    }
					});
					
				} else {
					
					fakeConsole('continue normally\n------------');
					
				}
				
			}
		});	
		
	};

})(window.jQuery);