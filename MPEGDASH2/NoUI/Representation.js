var Representation = function(representation) {
    console.log(representation);
    this.id = representation.id;
    this.bandwidth = representation.bandwidth;

    this.url = representation.mediaUrl.getDomain() + representation.mediaUrl.getPath();
};
