navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

var context = new AudioContext();
navigator.getUserMedia(
  {audio : true},
  function(mediaStream) {
    var source = context.createMediaStreamSource(mediaStream);
    var biquadFilterNode = context.createBiquadFIlter();
    var gainNode = context.createGain();

    biquadFilterNode.Q.value = 10;
    biquadFilterNode.type = 'bandpass';
    biquadFilterNode.connect(gainNode);
    gainNode.connect(context.destination);

    // change gain
    var gainRange = document.getElementById('gain');
    var setGain = function() {
      gainNode.gain.value = gainRange.value;
    };
    gainRange.addEventListener('change', setGain, false);
    setGain();

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
  },
  function() {
    alert('faled to get mic');
  }
);
