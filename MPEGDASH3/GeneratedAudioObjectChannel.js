/*
GeneratedAudioObjectChannel-class
-----------------

Represents an generated audio channel used by the AudioObject.
*/


/*
CONSTRUCTOR
-----------

input:
    channelInfo - info of the channel that has to be generated
    audioContext - audioContext that is used.
output: an GeneratedAudioObjectChannel-object.

*/

var GeneratedAudioObjectChannel = function(channelInfo, audioContext) {
    this.maxVolume = channelInfo.volume;
    this.oscilatorNode = audioContext.createOscillator();
    this.gainNode = audioContext.createGain();

    //creating an oscilatorNode to generate the sound
    this.oscilatorNode.type = channelInfo.waveType;
    this.oscilatorNode.frequency.value = channelInfo.frequency;
    this.oscilatorNode.connect(this.gainNode);
    this.oscilatorNode.start();
};

GeneratedAudioObjectChannel.prototype.getEndNode = function() {
    return this.gainNode;
};


/*
pause
---------------------------------------

output: volume of the generated audio is reduced to zero

*/
GeneratedAudioObjectChannel.prototype.pause = function() {
    this.gainNode.gain.value = 0;
};

/*
play
---------------------------------------

output: volume of the generated audio is increased tot the maxVolume

*/
GeneratedAudioObjectChannel.prototype.play = function() {
    this.gainNode.gain.value = this.maxVolume;
};
