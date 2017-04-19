var ArrayBufferHelper = {};

ArrayBufferHelper.concatTypedArrays = function(a, b) { // a, b TypedArray of same type

    var tmp = new Uint8Array(a.byteLength + b.byteLength);
    tmp.set(new Uint8Array(a), 0);
    tmp.set(new Uint8Array(b), a.byteLength);
    return tmp.buffer;
};

ArrayBufferHelper.concatTypedArraysFloat32 = function(a, b) { // a, b TypedArray of same type


    var tmp = new Float32Array(a.length + b.length);
    tmp.set(new Float32Array(a), 0);
    tmp.set(new Float32Array(b), a.length);
    return tmp;
};
