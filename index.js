// Create the loader and queue our 3 images. Images will not 
// begin downloading until we tell the loader to start. 

if (Modernizr.audio) {
  
  var audioFileType =   Modernizr.audio.ogg ? '.ogg' :
                        Modernizr.audio.mp3 ? '.mp3' :
                                              '.m4a';
  
} else {
  alert("your browser isn't capable of playing HTML5 audio"); 
}

    
var resources = [
  {name:"Pluck",      src:"media/Andy/01"   + audioFileType, img:"media/Andy/01.jpg" },
  {name:"Lightning",  src:"media/Andy/02"   + audioFileType, img:"media/Andy/02.jpg" },
  {name:"Cabin",      src:"media/Andy/03"   + audioFileType, img:"media/Andy/03.jpg" },
  {name:"Tone",       src:"media/Andy/04"   + audioFileType, img:"media/Andy/04.jpg" },
  {name:"Rats",       src:"media/Andy/05"   + audioFileType, img:"media/Andy/05.jpg" },
  {name:"Gulls",      src:"media/Andy/06"   + audioFileType, img:"media/Andy/06.jpg" },
  {name:"Music",      src:"media/Andy/07"   + audioFileType, img:"media/Andy/07.jpg" },
  {name:"blah1",      src:"media/Andy/08"   + audioFileType, img:"media/Andy/08.jpg" },
  {name:"blah2",      src:"media/Andy/09"   + audioFileType, img:"media/Andy/09.jpg" },
  {name:"blah3",      src:"media/Andy/10"   + audioFileType, img:"media/Andy/10.jpg" }
];

var player = document.createElement("img");
document.body.appendChild(player);
var resounceCount = resources.length;
var tempCount = 0;

var playSounds = function() {
  if (tempCount >= resounceCount) { console.log("all sounds finished"); return; }
  var n = tempCount++;
  soundManager.play(resources[n].name,{onfinish:playSounds});
  player.src = resources[n].img.src;
};
 
soundManager.flashVersion = 9; // optional: shiny features (default = 8)
soundManager.useHTML5Audio = true;
/*
 * read up on HTML5 audio support, if you're feeling adventurous.
 * iPad/iPhone and devices without flash installed will always attempt to use it.
*/
soundManager.onready(function() {
  
  var loader = new PxLoader(); 
  
  resources.map(function(resource){
    resource.src = loader.addSound(resource.name, resource.src);
    resource.img = loader.addImage(resource.img);
  });
  
  console.log(resources)

  loader.addProgressListener(function(e) { 

  });

  // callback that will be run once images are ready 
  loader.addCompletionListener(function(e) { 
    
    playSounds()
    
  });
  
  // begin downloading images 
  loader.start();
  // Ready to use; soundManager.createSound() etc. can now be called.
});
 
