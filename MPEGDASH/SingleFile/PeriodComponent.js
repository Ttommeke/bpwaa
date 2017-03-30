Vue.component('period-comp', {
    "template": `
        <div>
            <h2>Period {{name}}</h2>
            <h3>Streams</h3>
            <streamset-comp v-for="(streamset, key) in period.streamSetInfos" v-bind:name="key" v-bind:key="key" v-bind:streamset="streamset"></streamset-comp>
        </div>
    `,
    "props": ["period", "name"],
    "data" : function() {
        return {
        };
    }
});
