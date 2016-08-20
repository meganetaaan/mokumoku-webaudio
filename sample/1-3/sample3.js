navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

var canvasHeight = 100;
var canvasWidth = 512;
var canvas = document.getElementById('visualizer');
canvas.height = canvasHeight;
canvas.width = canvasWidth;
var canvasContext = canvas.getContext('2d');


var context = new AudioContext();
navigator.getUserMedia(
  {audio : true},
  function(mediaStream) {
    var source = context.createMediaStreamSource(mediaStream);
    var biquadFilterNode = context.createBiquadFilter();
    var gainNode = context.createGain();
    var analyserNode = context.createAnalyser();

    biquadFilterNode.Q.value = 10;
    biquadFilterNode.type = 'bandpass';

    biquadFilterNode.connect(gainNode);
    gainNode.connect(analyserNode);
    analyserNode.connect(context.destination);

    // change gain
    var gainRange = document.getElementById('gain');
    var setGain = function() {
      gainNode.gain.value = gainRange.value;
    };
    gainRange.addEventListener('change', setGain, false);
    setGain();

    // toggle sound output
    var outputSwitch = document.getElementById('outputSwitch');
    var toggleOutput = function() {
      analyserNode.disconnect();
      if(outputSwitch.checked){
        analyserNode.connect(context.destination);
      }
    }
    toggleOutput();

    // toggle filter
    var filterSwitch = document.getElementById('filterSwitch');
    var toggleFilter = function() {
      source.disconnect();
      source.connect(filterSwitch.checked ? biquadFilterNode : gainNode);
    };
    filterSwitch.addEventListener('change', toggleFilter, false);
    toggleFilter();

    // change basefreq
    var filterFreq = document.getElementById('filterFreq');
    var setFilterFreq = function() {
      biquadFilterNode.frequency.value = filterFreq.value;
    };
    filterSwitch.addEventListener('change', setFilterFreq, false);
    setFilterFreq();

    
    // visualize frequency;
    var freqArray = new Uint8Array(analyserNode.frequencyBinCount);
    var draw = function() {
      analyserNode.getByteFrequencyData(freqArray);
      // clear path
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      canvasContext.beginPath();
      for (var i = 0; i < canvasWidth; i++) {
        canvasContext.lineTo(i, (255 - freqArray[i]) / 255 * canvasHeight);
      }
      canvasContext.stroke();
      requestAnimationFrame(draw);
    };
    draw();
  },
  function() {
    alert('faled to get mic');
  }
);
