(function(){
  
  var roll = $(".roll")
      list = roll.find("li"),
      len = list.length,
      margin = 3,
      width = 80,
      playerWidth = 450;
      
  list.width(Math.round(playerWidth / len) - 3);
  $(".player-bar").addClass("ready");
  
  $(".playPause").click(function(e){
    e.preventDefault();
    list.width(width);
    roll.width((width + 3) * len);
    $(".player-bar").addClass("active");
    
    
  })
  
  
})()