
if(!greenworks) {
    console.log('Greenworks not support for ' + os.platform() + ' platform');
}else{ 
    if(!greenworks.init()) {
      console.log('Error on initializing steam API.');
    }else {
      console.log('Steam API initialized successfully.');  
    }
}

var fullscreen = false;
var elem = document.documentElement;
var dragMe = document.querySelector('.dragMe')
var menuBar = document.querySelector('.menuBar')

/* View in fullscreen */
var openFullscreen = () => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }  

  dragMe.classList.remove("drag")
  dragMe.classList.add("no-drag")
  
  menuBar.classList.add("hide")
  menuBar.classList.remove("show")
}

/* Close fullscreen */
var closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }

  dragMe.classList.remove("no-drag")
  dragMe.classList.add("drag")

  menuBar.classList.remove("hide")
  menuBar.classList.add("show")
}

var click_icon_fullscreen = () => {
  
  if(fullscreen){
    closeFullscreen()
  }else{
    openFullscreen()
  }  
  
  fullscreen = !fullscreen
}

var click_icon_x = () => {
  
  if( window.confirm("Do you really want to leave?") ) {

    setTimeout(function(){  
      // finalize app functions here 
      process.kill( require('process').pid )
      nw.App.quit()
    },1000)  

  }
}

var win = nw.Window.get()

win.on('close', function(){

  setTimeout(function(){  
    // finalize app functions here 
    process.kill( require('process').pid )
    nw.App.quit()
  },1000) 

});
