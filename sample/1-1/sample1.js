navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

// 1. generate AudioContext Instance
var context = new AudioContext();

// 2. access microphone
navigator.getUserMedia(
  { audio: true },
  // success callback
  function(localMediaStream) {
    // 3. generate MediaStreamAudioSourceNode from input stream
    var source = context.createMediaStreamSource(localMediaStream);
    // 4. Connect MediaStreamAudioSourceNode to AudioDestinationNode
    source.connect(context.destination);
  },
  function() {
    alert('failed to get input');
  }
)
