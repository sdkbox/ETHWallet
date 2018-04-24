
"use strict";

(function() {
    if ('undefined' == typeof window.crypto) {
        window.crypto = {};
        window.crypto.getRandomValues = function(arr) {
            for (var i = 0; i < arr.length; i++) {
                /*
                 * TODO: use a beeter random, maybe can set custom seed or something.
                 *
                 */                     
                arr[i] = Math.round(cc.random0To1() * 255);
            }
            return arr;
        }
    }
})();

