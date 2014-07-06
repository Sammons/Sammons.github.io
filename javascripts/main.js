$(document).ready(function() {
		if (/mobile/.test(window.location.href))
		{
			$('#header').css('font-size','18px')
			$('#main-strip').width('350px');
			$('.subject').css('padding','0px').css('width','350px')
		}

		function mumbleBenPresent() {
			$('#mumble-status')
			.removeClass('red')
			.addClass('green')
			.html('Online, Join me <span>@206.217.198.148:6132</span>')
		}

		function mumbleBenNotPresent() {
			$('#mumble-status')
			.removeClass('green')
			.addClass('red')
			.text('Offline');
		}

		function refreshMumbleStuff() {
			try {
				$.get('/onmumble',function(data) {
					var mumbleusers = JSON.parse(data)['root']['users'];
					mumbleBenNotPresent();
					for (user in mumbleusers) {
						if (mumbleusers[user].name == 'Sammons')
							mumbleBenPresent();
					}
				})
			} catch (e) {
				console.log(e);// who cares, right?
			}
		}

		$('#mumble-status').text('Refreshing...')
		refreshMumbleStuff();
		setInterval(refreshMumbleStuff,5000);


		function send_command(val, spark) {
			$.post('/spark/'+spark+'/'+val)
		}
		function widget(append_to,i, name) {
			var wid = $('<div  class = "spark found" id="spark-' + i + '">' +
							'<span class = "name">' + name + '</span><button>Go</button>' +
							'<span class = "statement"></span>' +
							'<br/><input class="r" type=range min="0" max="255">R<br/>' +
							'<input class="g" type=range min="0" max="255">G<br/>' +
							'<input class="b" type=range min="0" max="255">B' +
							'</div>');
			append_to.append(wid).find('#spark-'+i+' button').click(function(){
					var val = $('#spark-'+i+' .r').val()+','+$('#spark-'+i+' .g').val()+','+$('#spark-'+i+' .b').val();
					send_command(val, i)
				})
		}
		function refreshSparkMessages() {
			$.get('/spark',function(data) {
				console.log(data);
				var sparkArry = [];
				var sparks = JSON.parse(data);
				for (var i in sparks) {
					$('#spark-'+i).addClass('found');
					if (!$('#spark-'+i).length > 0) {
						(function(){widget($('#spark-ui'),i, sparks[i].name)})()
					}
				}
				$('.spark').each(function(i,e) {
					if (!$(e).hasClass('found')) $(e).remove();
				});
				$('.found').removeClass('found');
			})
		}

		setInterval(refreshSparkMessages,400);

		function command(com) {
			$.get('/'+com);
		}

		$('#blue').click(function(){ command('blue') })
		$('#green').click(function(){ command('green') })
		$('#red').click(function(){ command('red') })
					// Show loading notice
		var canvas = document.getElementById('videoCanvas');
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#444';
		ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);

		// Setup the WebSocket connection and start the player
		var client = new WebSocket( 'ws://devrecord.com:8084/' );
		var player = new jsmpeg(client, {canvas:canvas});
		setInterval(function() {
			player = new jsmpeg(client, {canvas: canvas});
		},30*60*1000);
})