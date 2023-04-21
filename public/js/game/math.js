function lerpFloat(src, dst, a) {
    return src + a * (dst - src);
}

function lengthSq(x1, y1, x2, y2) {
    var x3 = x2 - x1;
    var y3 = y2 - y1;
    return x3*x3 + y3*y3
}