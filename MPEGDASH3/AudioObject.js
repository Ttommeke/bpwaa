
/*
AudioObject-class
-----------------

Represents an audio source and is responsible for applying audio transitions to it like, the position of the audio, the volume of seperate channels and delay on some nodes.
*/


/*
CONSTRUCTOR
-----------

input:
    streamerPlayerrs - list of all the streamerplayers that it might need,
    metaDataInit - initial meta data of the audio source that this AudioObject represents,
    audioContext - audioContext that is used.
    destination - audio node to connect to
output: an AudioObject-object.

*/
var AudioObject = function(streamerPlayers, metaDataInit, audioContext, destination) {
    this.audioContext = audioContext;
    this.metaDataInit = metaDataInit;

    this.generatedNodes = [];

    //create a channel merger to use multiple channells from multiple StreamerPlayers
    this.channelMerger = this.audioContext.createChannelMerger(metaDataInit.channels.length);
    this.connectStreamerPlayerChannels(streamerPlayers, metaDataInit);

    //setting up the pannerNode to adjust the position of the audio
    this.pannerNode = this.audioContext.createPanner();
    this.pannerNode.panningModel = 'HRTF';
    this.pannerNode.distanceModel = 'inverse';
    this.pannerNode.refDistance = 1;
    this.pannerNode.maxDistance = 10000;
    this.pannerNode.rolloffFactor = 1;
    this.pannerNode.coneInnerAngle = 360;
    this.pannerNode.coneOuterAngle = 0;
    this.pannerNode.coneOuterGain = 0;
    this.pannerNode.setPosition(2,0,0);

    //setting up the master volume of the audio
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 1;

    //connecting all nodes together
    this.channelMerger.connect(this.pannerNode);
    this.pannerNode.connect(this.gainNode);
    this.gainNode.connect(destination);
};


/*
connectStreamerPlayerChannels
---------------------------------------

input:
    streamerPlayerrs - list of all the streamerplayers that it might need,
    metaDataInit - initial meta data of the audio source that this AudioObject represents,
output: connect all the channels to the channel merger of this AudioObject. also creates generates audioNodes if nesecary.

*/
AudioObject.prototype.connectStreamerPlayerChannels = function (streamerPlayers, metaDataInit) {
    var that = this;

    //itterate over all channels
    metaDataInit.channels.forEach(function (channel) {
        //if type is stream connect it and apply all the nessecary nodes to it.
        if (channel.type == "STREAM") {
            //find the streamerplayer
            var streamerPlayer = that.findStreamerPlayerWithId(streamerPlayers, channel.id);
            //apply the volupme node to the channel.
            var gainNode = that.audioContext.createGain();
            gainNode.gain.value = channel.volume;

            //connect the channel to the gain node
            streamerPlayer.getSource().connect(gainNode, channel.outputChannelIndex, 0);

            //if there is delay on the channel, add it.
            if (channel.delay != undefined && channel.delay != 0){
                var delayNode = that.audioContext.createDelay(channel.delay);
                delayNode.delayTime.value = channel.delay;

                gainNode.connect(delayNode);
                delayNode.connect(that.channelMerger, 0, channel.inputChannelIndex);
            } else {
                gainNode.connect(that.channelMerger, 0, channel.inputChannelIndex);
            }

        //if type is generated, create the sound and connect it to the channel.
        } else if (channel.type == "GENERATED") {
            var generattedNode = new GeneratedAudioObjectChannel(channel, that.audioContext);
            generattedNode.getEndNode().connect(that.channelMerger, 0, channel.inputChannelIndex);
            that.generatedNodes.push(generattedNode);
        }
    });
};

/*
play
---------------------------------------

output: restarts all generated nodes.

*/
AudioObject.prototype.play = function() {
    this.generatedNodes.forEach(function(generatedNode) {
        generatedNode.play();
    });
};


/*
pause
---------------------------------------

output: pause all generated nodes.

*/
AudioObject.prototype.pause = function() {
    this.generatedNodes.forEach(function(generatedNode) {
        generatedNode.pause();
    });
};


/*
play
---------------------------------------

input:
    streamerPlayers - list of streamerPlayers
    id - of one of the streamerPlayers
output: returns the correct streamerPlayer in the list with the id.

*/
AudioObject.prototype.findStreamerPlayerWithId = function(streamerPlayers, id) {
    for (var i = 0; i < streamerPlayers.length; i++) {
        if (streamerPlayers[i].stream.name == id) {
            return streamerPlayers[i];
        }
    }

    console.log("no StreamerPlayer founded for " + id);
    return undefined;
};

AudioObject.prototype.getPannerNode = function() {
    return this.pannerNode;
};

AudioObject.prototype.setVolume = function(volume) {
    this.gainNode.gain.value = volume;
};

AudioObject.prototype.getVolume = function() {
    return this.gainNode.gain.value;
};
