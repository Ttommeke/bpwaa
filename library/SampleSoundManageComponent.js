Vue.component('sample-sound-comp', {
    "template": `
        <div>
            <h3>{{soundobject.name}}</h3><button @click="deleteMe">delete</button>
            <p>
                Volume (currently: <input type="number" v-model="gain" />) <input class="inputSlider" type="range" min="0" max="2" v-model="gain" step="0.01" /><br />
                Detune (currently: <input type="number" v-model="detune" />) <input class="inputSlider" type="range" min="-5000" max="5000" v-model="detune" step="1" />
                LoopStart (currently: <input type="number" v-model="loopStart" />) <input class="inputSlider" type="range" min="0" v-bind:max="this.soundobject.source.buffer.duration" v-model="loopStart" step="0.01" />
                LoopEnd (currently: <input type="number" v-model="loopEnd" />) <input class="inputSlider" type="range" min="0" v-bind:max="this.soundobject.source.buffer.duration" v-model="loopEnd" step="0.01" />
                PlaybackRate (currently: <input type="number" v-model="playbackRate" />) <input class="inputSlider" type="range" min="0" max="10" v-model="playbackRate" step="0.01" />
            </p>
        </div>
    `,
    "props": ["soundobject"],
    "data" : function() {
        return {
            gainValue : this.soundobject.gainnode.gain.value,
            detuneValue : this.soundobject.source.detune.value,
            loopStartValue : this.soundobject.source.loopStart,
            loopEndValue : this.soundobject.source.buffer.duration,
            playbackRateValue : this.soundobject.source.playbackRate
        };
    },
    "methods": {
        "deleteMe": function() {
            this.$emit("deleteme", this.soundobject);
        }
    },
    computed: {
        "gain": {
            get: function () {
                return this.gainValue;
            },
            set: function (newValue) {
                this.soundobject.gainnode.gain.value = newValue;
                this.gainValue = newValue;
            }
        },
        "detune": {
            get: function () {
                return this.detuneValue;
            },
            set: function (newValue) {
                this.soundobject.source.detune.value = newValue;
                this.detuneValue = newValue;
            }
        },
        "loopStart": {
            get: function () {
                return this.loopStartValue;
            },
            set: function (newValue) {
                this.soundobject.source.loopEnd = this.loopEndValue;
                this.soundobject.source.loopStart = newValue;
                this.loopStartValue = newValue;
            }
        },
        "loopEnd": {
            get: function () {
                return this.loopEndValue;
            },
            set: function (newValue) {
                this.soundobject.source.loopEnd = newValue;
                this.loopEndValue = newValue;
            }
        },
        "playbackRate": {
            get: function () {
                return this.playbackRateValue;
            },
            set: function (newValue) {
                this.soundobject.source.playbackRate.value = newValue;
                this.playbackRateValue = newValue;
            }
        },
    }
});
