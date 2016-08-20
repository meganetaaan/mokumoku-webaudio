navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

var peer = new Peer({ key: KEY.apiKey})
var yourID;
peer.on('open', function(id){
  yourID = id;
  document.getElementById('yourID').appendChild(document.createTextNode(id));
  navigator.getUserMedia(
    {audio : true},
    function(mediaStream){
      document.getElementById('callForm')
        .addEventListener('submit', function(e){
          var remoteID = document.getElementById('remoteID').value;
          var call = peer.call(remoteID, mediaStream);
          addEventListener2MC(call);
          e.preventDefault();
        }, false);
      peer.on('call', function(call){
        call.answer(mediaStream);
        addEventListener2MC(call);
      });
    }, function(){
      alert('failed to get mic')
    }
  )
});

function addEventListener2MC(mediaConnection){
  var userId;
  var wrapper = document.getElementById('remoteUsers');
  mediaConnection.on('stream', function(mediaStream){
    var audio = document.createElement('audio');
    audio.src = window.URL.createObjectURL(mediaStream);
    audio.play();
    userId = document.createElement('div')
    userId.appendChild(document.createTextNode(mediaConnection.peer));
    wrapper.appendChild(userId);
  });
  mediaConnection.on('close', function() {
    wrapper.removeChild(userId);
  });
}
