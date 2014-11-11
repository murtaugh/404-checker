<h1>404 Checker</h1>

<p>So, I had an idea (<a href="https://twitter.com/murtaugh/status/532003907913121792">https://twitter.com/murtaugh/status/532003907913121792</a>), and I had a moment to work on it, so here it is!</p>

<p>This tool sniffs out the HTTP status of links on your site, and if the page returns 404 (or if it returns no headers at all) it queries the Wayback Machine's API to see if a snapshot is available. If one is, we can then redirect users to the Wayback snapshot instead of a 404 page.</p>

<h2>Best approach?</h2>

<p>At the moment, the script goes through two steps:</p>

<ol>
	<li>On `document.ready`, the links are scanned and external links are flagged.</li>
	<li>On hovering over a link, we use PHP and AJAX to reach out and grab the headers for the URL in question.</li>
</ol>

<p>A few things:</p>

<ol>
	<li>It would be better if the initial link scan is limited to areas of the page known to contain possibly questionable links. There's no sense in scanning links in areas of the page we know to contain good links.</li>
	<li>In theory we <em>could</em> preemptively scan all the links, instead of on hover. This is certainly easier from a programming standpoint, but possibly not so good from a UX and resources standpoint, as we'll be making a bunch of (possibly unneeded) HTTP requests.</li>
	<li>Right now the script only checks for 404s and pages that don't resolve at all. There a lot of other HTTP statuses we could be checking for.</li>
</ol>

<p>If we go with the on-demand approach, we need to decide what to do.</p>

<ol>
	<li>Do we try to replace the URL before the user clicks? Depending on how fast the HTTP check comes in, the user may click before we get a response.</li>
	<li>It's possible we've been able to flag the link as 404, but don't have a result from the Wayback API yet yet. So do we capture the click, make a note of it, then push the user to the snapshot URL when it comes in, assuming it will come in a timely manner? If not, what?</li>
</ol>

<p>Please note: I have not, but intend to, see how things work on touch devices. We'll likely need a different approach to the link events.</p>