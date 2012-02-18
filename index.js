// Create the loader and queue our 3 images. Images will not 
// begin downloading until we tell the loader to start. 

if (!PICLE) {
	var PICLE = {};
}

(function(window, document, $){

	var Player = function() {};

	Player.fn = Player.prototype = {
		
		init : function(playerElem, resources) {
			
			if(!resources) { return; }
			
			this.img = document.createElement("img");
			this.rollHolder = document.getElementById("rollHolder");
			
			playerElem.prepend(this.img);
			
			var list = this.list = playerElem.find("ul")[0];
			
			this.createUI(playerElem);
			
			this.listWidth = 0;
			this.itemWidth = 50;
			
			this.resourceCount = resources.length;
			this.tempCount = 0;
			this.previousItem = null;
			this.position = 0;
			this.resources = resources;
			this.isPaused = false;
			
			this.page = 0;
			
			this.gesturing = false;			
			
			this.spinner = new Spinner({
			  lines: 12, // The number of lines to draw
			  length: 7, // The length of each line
			  width: 4, // The line thickness
			  radius: 10, // The radius of the inner circle
			  color: '#000', // #rgb or #rrggbb
			  speed: 1, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false // Whether to use hardware acceleration
			}).spin(playerElem[0]);
			
			if (soundManager.readyState === 3) {
				this.playerReadyCallback();
			} else {
				soundManager.onready($.proxy(this.playerReadyCallback, this));
			}
			
			playerElem = null;
		},
		
		destroy : function() {
			soundManager.stopAll();
			soundManager.reboot();
			this.scroller.destroy();
			this.pauseBtn.off("click").remove();
			$(document).off("keydown");
		},
		
		createUI : function(container) {
			
			this.pauseBtn = $("<a>", {
				text : "pause",
				"class" : "playPause"	
			}).on("click", $.proxy(function(e){
				if (this.isPaused) {
					this.play();
				} else {
					this.pause();
				}
				e.preventDefault();
			}, this)).prependTo(container);

			container = null;
		},
		
		pause : function() {
			if (this.isPaused) { return; }
			this.isPaused = true;
			this.pauseBtn.addClass("paused");
			this.pauseBtn.text("play");
			soundManager.stopAll();
		},
		
		play : function(i) {
			if (!this.isPaused) { return; }
			this.isPaused = false;
			this.pauseBtn.removeClass("paused");
			this.pauseBtn.text("pause");
			this.playSounds((i === undefined) ? this.scrollPageIndex : i);
		},
		
		/*
		handleEvent : function(e) {
			console.log(e);
			this[e.type](e);
		},
		*/
		
		startScroller : function(i) {
			// instantiate scroller
			this.scroller = new iScroll(this.rollHolder, { 
				vScroll : false, 
				snap: 'li', 
				momentum: false, 
				onScrollMove : $.proxy(function(){
					this.pause();
				}, this), 
				onScrollEnd : $.proxy(function(i) {
					this.isPaused && this.play(i);
				}, this)
			});
			
			i && this.scroller.scrollToPage(i, 0);
			
			// enable keyboard interactions with the left and right keys
			$(document).on("keydown", $.proxy(function(e){
				if (e.keyCode == 37) { 
					this.scrollMove(this.scrollPageIndex -= 1);
					e.preventDefault();
				} else if (e.keyCode == 39) { 
					this.scrollMove(this.scrollPageIndex += 1);
					e.preventDefault();
				}
			}, this));
		},
		
		scrollMove : function(i) {
			this.pause();
			this.scroller.scrollToPage(i, 0);
		},
		
		playSounds : function(i) {
			
			// continue in sequence or start from the index provided
			this.tempCount = (i === undefined) ? this.tempCount : i;
			
			// if less than 0, play from zero
			this.tempCount = (this.tempCount < 0) ? 0 : this.tempCount;
			
			// There are no more sounds to play
		  if (this.tempCount >= this.resourceCount) { console.log("all sounds finished"); return; }
			
			// if no scroller, set it up for the first time, else if we're not already there, scroll to the correct page
			if (!this.scroller) {
				this.startScroller(this.tempCount);
			} else if (this.scrollPageIndex !== this.tempCount) {
				this.scroller.scrollToPage(this.tempCount, 0);
			}
			
			// set scroll index so we know where to scroll to an from
			this.scrollPageIndex = this.tempCount;
			
			var resource = this.resources[this.tempCount++];
			soundManager.setPosition(resource.name,0);
		  soundManager.play(resource.name, { onfinish : $.proxy( this.playSounds, this ) });
			this.img.src = resource.img.src;
			
		},
		
		playerReadyCallback : function() {
			
			var loader = this.loader = new PxLoader();
			
			loader.addCompletionListener($.proxy(function(){
				
				this.spinner.stop();
				this.playSounds();
				
			}, this));

			$.map(this.resources, $.proxy(function(resource){
				
		    resource.sound = loader.addSound(resource.name, resource.sound + this.audioFileType);
		    resource.img = loader.addImage(resource.img);
				
				resource.listItem = $("<li>").append(resource.img).stop().appendTo(this.list);

		  }, this));
		
			this.list.style.width = this.listWidth = (this.itemWidth * this.resources.length) + 'px';
			//this.rollHolder.width = 
			
			// begin downloading images and sounds
		  loader.start();
		
		}
		
	};
	
	if (Modernizr.audio) {
		
		Player.fn.audioFileType = '.mp3';
		
		for (var audioFileType in Modernizr.audio) {
			if (Modernizr.audio[audioFileType] === "probably" && audioFileType !== "wav") {
				Player.fn.audioFileType = "." + audioFileType;
				soundManager.useHTML5Audio = true;
			}
		};
		/*
	  Player.fn.audioFileType = Modernizr.audio.ogg ? '.ogg' :
	                        		Modernizr.audio.mp3 ? '.mp3' :
	                                              		'.m4a';
		*/
	} else {
	  alert("your browser isn't capable of playing HTML5 audio"); 
	}
	
	PICLE.Player = Player;
	
})(window, document, window.jQuery);

var resources = [
  {name:"Pluck",      sound:"media/Andy/01", img:"media/Andy/01.jpg" },
  {name:"Lightning",  sound:"media/Andy/02", img:"media/Andy/02.jpg" },
  {name:"Cabin",      sound:"media/Andy/03", img:"media/Andy/03.jpg" },
  {name:"Tone",       sound:"media/Andy/04", img:"media/Andy/04.jpg" },
  {name:"Rats",       sound:"media/Andy/05", img:"media/Andy/05.jpg" },
  {name:"Gulls",      sound:"media/Andy/06", img:"media/Andy/06.jpg" },
  {name:"Music",      sound:"media/Andy/07", img:"media/Andy/07.jpg" },
  {name:"blah1",      sound:"media/Andy/08", img:"media/Andy/08.jpg" },
  {name:"blah2",      sound:"media/Andy/09", img:"media/Andy/09.jpg" },
  {name:"blah3",      sound:"media/Andy/10", img:"media/Andy/10.jpg" }
];

var player = new PICLE.Player();

player.init($("#player"), resources);
 
soundManager.flashVersion = 9; // optional: shiny features (default = 8)
soundManager.useHTML5Audio = true;
soundManager.debugMode = false;
