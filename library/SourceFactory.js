function SourceFactory(buffer, name, context) {
    this.buffer = buffer;
    this.name = name;
    this.context = context;
}

SourceFactory.prototype.createBufferSource = function() {
    var source = context.createBufferSource();
    source.buffer = this.buffer;

    return source;
}
