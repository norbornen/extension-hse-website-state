KangoAPI.onReady(function() {
	displayDetails();
	window.setInterval(displayDetails, 2500);
});

function displayDetails(){
	kango.invokeAsync('ajaxServerStatus', function(promise) {
		promise.then(
			function(serverData){
				var p1 = document.getElementById('perl1-status'),
					n1 = document.getElementById('nginx-status');

				p1.innerHTML = '<dl class="horizontal">' + Object.keys(serverData.perl).map(function(k){ return '<dt>' + k + '</dt>' + '<dd>' + serverData.perl[k] + '</dd>' }).join('') + '</dl>';
				n1.innerHTML = '<dl class="horizontal">' + Object.keys(serverData.nginx).map(function(k){ return '<dt>' + k + '</dt>' + '<dd>' + serverData.nginx[k] + '</dd>' }).join('') + '</dl>';
			},
			function(message) {
				document.write(message);
			}
		);
	});
}
