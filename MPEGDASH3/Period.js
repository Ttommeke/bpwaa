
/*
Period-class
------------

This class represents a period in the mpd file. it will organize the streams.
for example it will suspend a stream that is far ahead of the other streams.
*/

var OUT_OF_CONTROL_THRESHOLD = 30; //30 seconden

/*
CONSTRUCTOR
-----------

input:
    shakaPeriod - period object parsed by the shaka mpd parser.
    onReadyCallBack - function that will be called upon when all streams are read to start streaming the data.
output:
    Period object
*/
var Period = function(shakaPeriod, onReadyCallBack) {
    this.streams = [];
    this.videoStreams = [];
    this.metaDataStreams = [];
    this.duration = shakaPeriod.duration;

    var totalStreamsToParse = shakaPeriod.streamSetInfos.length;
    var totalStreamsParsed = 0;

    //create the streams described in the period.
    for (var i = 0; i < totalStreamsToParse; i++) {
        if (shakaPeriod.streamSetInfos[i].contentType == "text") {
            //create metadatastream and add it to the list of metadatastreams.
            this.addMetaDataStreamFromAdaptionSet(shakaPeriod.streamSetInfos[i]).then(function() {
                totalStreamsParsed++;

                if (totalStreamsParsed >= totalStreamsToParse) {
                    onReadyCallBack();
                }
            });
        } else if (shakaPeriod.streamSetInfos[i].contentType == "audio") {
            //create audiodatastream and add it to the list of audio streams
            this.addStreamFromAdaptionSet(shakaPeriod.streamSetInfos[i]).then(function() {
                totalStreamsParsed++;

                if (totalStreamsParsed >= totalStreamsToParse) {
                    onReadyCallBack();
                }
            });
        } else if (shakaPeriod.streamSetInfos[i].contentType == "video") {
            //create videodatastream and add it to the list of video streams
            this.addVideoStreamFromAdaptionSet(shakaPeriod.streamSetInfos[i]).then(function() {
                totalStreamsParsed++;

                if (totalStreamsParsed >= totalStreamsToParse) {
                    onReadyCallBack();
                }
            });
        }
    }
};

/*
startBufferProccess
-------------------

By calling this method, the period will start buffering all the streams from there current position.
*/
Period.prototype.startBufferProccess = function() {

    var that = this;

    //callbackfunction that will recursively fetch the next segment of audio from the givin stream until all segments are fetched.
    var nextSegmentForAudio = function(stream) {
        //this check controls if an audio stream is not to fast loading compared to the others.
        if (!that.isStreamRunningOutOfControl(stream)) {
            stream.getNextSegment().then(function() {
                nextSegmentForAudio(stream);
            }).catch(function() {
                console.log(stream.name + " done with " + stream.getTimeBuffered() + " seconds in buffer.");
            });
        } else {
            //when the stream is running out of control it is put to sleep for 100 ms.
            //after that the process will start again by checking if the other streams have already caught up.
            setTimeout(function(){ nextSegmentForAudio(stream); }, 100);
        }
    };

    //callbackfunction that will recursively fetch the next segment of the metadata from the givin stream until all segments are fetched.
    var nextSegmentForMetaData = function(stream) {
        stream.getNextSegment().then(function() {
            nextSegmentForMetaData(stream);
        }).catch(function() {
            console.log("MetaDataStream done");
        });
    };

    //start all audio streams
    for (var i = 0; i < this.streams.length; i++) {
        nextSegmentForAudio(this.streams[i]);
    }

    //start all metadata streams
    for (var i = 0; i < this.metaDataStreams.length; i++) {
        nextSegmentForMetaData(this.metaDataStreams[i]);
    }
};

/*
isStreamRunningOutOfControl
---------------------------

Compares all the other streams to this stream. when the stream that has the least amount of data loaded is behind by the OUT_OF_CONTROL_THRESHOLD, the function will return true.
*/
Period.prototype.isStreamRunningOutOfControl = function(stream) {
    var that = this;

    var streamThatIsBehind = that.streams[0];

    //find stream that is farrest behind
    for (var i = 1; i < that.streams.length; i++) {

        //console.log(that.streams[i].getTimeBuffered(), that.streams[i].getDuration() );
        if (that.streams[i].getTimeBuffered() < that.streams[i].getDuration() && that.streams[i].getTimeBuffered() < streamThatIsBehind.getTimeBuffered()) {
            streamThatIsBehind = that.streams[i];
        }
    }

    //check if stream is to far behind.
    if (stream.getTimeBuffered() > streamThatIsBehind.getTimeBuffered() + OUT_OF_CONTROL_THRESHOLD) {
        return true;
    } else {
        return false;
    }
}


Period.prototype.getDuration = function() {
    return this.duration;
};

Period.prototype.addStreamFromAdaptionSet = function(shakaAdaptionSet) {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.streams.push(new Streamer(shakaAdaptionSet, function() {
            resolve();
        }));
    });

};

Period.prototype.addVideoStreamFromAdaptionSet = function(shakaAdaptionSet) {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.videoStreams.push(new VideoStreamer(shakaAdaptionSet, function() {
            resolve();
        }));
    });

};

Period.prototype.addMetaDataStreamFromAdaptionSet = function(shakaAdaptionSet) {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.metaDataStreams.push(new MetaDataStreamer(shakaAdaptionSet, function() {
            resolve();
        }));
    });

};
