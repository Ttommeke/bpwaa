Vue.component('period-comp', {
    "template": `
        <div>
            <h2>Period {{name}} status: {{period.status}}</h2>
            <input type="range" v-model="timePast" v-bind:max="period.duration" v-bind:min="0" step="0.1"></input> {{timePast}}s / {{period.duration}}s
            <button @click="start" v-if="period.status == Status.STOPPED || period.status == Status.PAUSED">play</button>
            <button @click="start" v-if="period.status == Status.PLAYING">pause</button>
            <button @click="stop" v-if="period.status !== Status.STOPPED">stop</button>
            <h3>Streams</h3>
            <streamset-comp v-for="(streamset, key) in period.streamsets" v-bind:name="key" v-bind:key="key" v-bind:streamset="streamset"></streamset-comp>
        </div>
    `,
    "props": ["period", "name"],
    "data" : function() {
        return {
            Status: Status
        };
    },
    "computed": {
        timePast: {
            set: function(value) {
                this.period.setTime(value);
            },
            get: function() {
                return Math.round(this.period.timePast);
            }
        }
    },
    "methods" : {
        start : function() {
            var that = this;

            that.period.playOrPause();
        },
        stop : function() {
            var that = this;

            that.period.stop();
        }
    }
});
