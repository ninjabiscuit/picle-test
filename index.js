// Create the loader and queue our 3 images. Images will not 
// begin downloading until we tell the loader to start. 

if (!PICLE) {
	var PICLE = {};
}

(function(window, document, $){

	var Player = function() {};

	Player.fn = Player.prototype = {
		
		init : function(resources) {
			
			if(!resources) { return; }
			
			this.img = document.createElement("img");
			this.rollHolder = document.getElementById("rollHolder");
			
			var container = $("#player").prepend(this.img);
			
			var list = this.list = container.find("ul")[0];
			
			this.listWidth = 0;
			this.itemWidth = 50;
			
			this.resounceCount = resources.length;
			this.tempCount = 0;
			this.previousItem = null;
			this.position = 0;
			this.resources = resources;
			
			this.page = 0;
			
			this.gesturing = false;

		},
		
		handleEvent : function(e) {
			this[e.type](e);
		},
		
		playSounds : function() {
			
		  if (this.tempCount >= this.resounceCount) { console.log("all sounds finished"); return; }
			
			var previousItem = this.previousItem,
					resource = this.previousItem = this.resources[this.tempCount++];

			if (previousItem) {
				previousItem.listItem.removeClass("active");
				//this.move( this.list, this.position -= this.itemWidth );
			} else {
				this.scroller = new iScroll(this.rollHolder, { vScroll : false, snap: 'li', momentum: false });
			}
			
		  soundManager.play(resource.name, { onfinish : $.proxy( this.playSounds, this ) });
		  
			this.img.src = resource.img.src;

			resource.listItem.addClass("active");
			
		},
		
		smReadyCallback : function() {
			
			var loader = this.loader = new PxLoader();
			
			loader.addCompletionListener($.proxy(this.playSounds, this));
			//loader.addProgressListener($.proxy(this.loaderProgressListener, this));

			$.map(this.resources, $.proxy(function(resource){
				
		    resource.sound = loader.addSound(resource.name, resource.sound + this.audioFileType);
		    resource.img = loader.addImage(resource.img);
				
				resource.listItem = $("<li>").append(resource.img).stop().appendTo(this.list);

		  }, this));
		
			this.list.style.width = this.listWidth = (this.itemWidth * this.resources.length) + 'px';
			//this.rollHolder.width = 
			
			// begin downloading images and sounds
		  loader.start();
		
		},
		
		loaderProgressListener : function(e) {}
		
	};
	
	if (Modernizr.audio) {

	  Player.fn.audioFileType =   Modernizr.audio.ogg ? '.ogg' :
	                        			Modernizr.audio.mp3 ? '.mp3' :
	                                              			'.m4a';

	} else {
	  alert("your browser isn't capable of playing HTML5 audio"); 
	}
	
	// if ( Modernizr.csstransforms ) {
	// 
	// 		if (Modernizr.csstransforms3d) { 
	// 
	// 	    Player.fn.move = function ( el, position ) {
	// 	      el.style[this.prefixTransform] = 'translate3d(' + position + 'px, 0, 0) ';
	// 	    };
	// 
	// 		} else if (Modernizr.csstransforms3d) { 
	// 
	// 	    Player.fn.move = function ( el, position ) {
	// 	      el.style[this.prefixTransform] = 'translate(' + position + 'px, 0) ';
	// 	    };
	// 
	// 		}
	// 
	// 	} else {
	// 
	// 		Player.fn.move = function ( el, position ) {
	// 	    el.style.left = position + 'px';
	// 	  };
	// 
	// 	}
	
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

player.init(resources);
 
soundManager.flashVersion = 9; // optional: shiny features (default = 8)
soundManager.useHTML5Audio = true;
soundManager.debugMode = false;

soundManager.onready($.proxy(player.smReadyCallback, player));
