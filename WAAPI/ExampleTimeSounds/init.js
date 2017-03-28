var context;
var bufferLoader;

function InitSounds(loadingDoneCallback) {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    bufferLoader = new BufferLoader(
        context,
        [
            { href: '../sounds/gun9mm.wav', name: 'gun9mm' },
            { href: '../sounds/dragon.wav', name: 'dragon' },
            { href: '../sounds/doghowling.wav', name: 'doghowling' },
            { href: '../sounds/gun40smith.wav', name: 'gun40smith' },
            { href: '../sounds/movieprojector.wav', name: 'movieprojector' },
            { href: '../sounds/sms.wav', name: 'sms' }
        ],
        loadingDoneCallback
    );

    bufferLoader.load();
}

function finishedLoading(sounds) {    
    var currentTime = context.currentTime;
    var tempo = 0.2;

    for (var i = 0; i < 5; i++ ) {
        playSound(sounds.gun9mm, currentTime + i * tempo);
    }
    for (var i = 0; i < 2; i++ ) {
        playSound(sounds.gun40smith, currentTime + (6 + i) * tempo);
    }
    for (var i = 0; i < 2; i++ ) {
        playSound(sounds.gun40smith, currentTime + (9 + i) * tempo);
    }
}

function playSound(sourceFactory, time) {
    var sound = sourceFactory.createBufferSource();
    sound.connect(context.destination);
    sound.start(time);
}
