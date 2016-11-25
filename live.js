if (window.location.protocol === 'file:') {
	var script = document.createElement('script');
	script.src = 'http://localhost:35729/livereload.js';
	document.head.appendChild(script);
}