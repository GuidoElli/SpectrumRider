var times = [];
var coord = [];

var audioshape_vert = [];
var audioshape_ind = [];
var audioshape_norm = [];

$.get('audioshape_vert.txt', function(data) {
    times = data.split("+");
    $.each(times, function(n, elem) {
        audioshape_vert.push(parseFloat(elem));
    });
    audioshape_vert.pop();
});
$.get('audioshape_ind.txt', function(data) {
    times = data.split("+");
    $.each(times, function(n, elem) {
        audioshape_ind.push(parseFloat(elem));
    });
    audioshape_ind.pop();//////////////////////////// ?
});
$.get('audioshape_norm.txt', function(data) {
    times = data.split("+");
    $.each(times, function(n, elem) {
        audioshape_norm.push(parseFloat(elem));
    });
    audioshape_norm.pop();//////////////////////////// ?
});
