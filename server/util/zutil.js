var sortBy = function(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == 'DESC') {
        rev = -1;
    } else {
        rev = 1;
    }
    return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}

// var test = [{num: 1}, {num: 3}, {num: 2}, {num: 8}, {num: 6}, {num: 3}];
// test.sort(sortBy('num'));
//console.log(JSON.stringify(test));

module.exports = { sortBy }