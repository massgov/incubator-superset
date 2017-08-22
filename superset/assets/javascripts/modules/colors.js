import $ from 'jquery';
import d3 from 'd3';
import {
    colorbrewer
} from './colorbrewer';
//need d3 v4 for this stuff to work
//import d3Color from 'd3-color';
//import d3Interpolate from 'd3-interpolate';
//import { schemeRdYlBu, interpolateRdYlBu} from 'd3-scale-chromatic';

// Color related utility functions go in this object
export const bnbColors = [
    '#9e0142',
    '#d53e4f',
    '#f46d43',
    '#fdae61',
    '#fee08b',
    '#ffffbf',
    '#e6f598',
    '#abdda4',
    '#66c2a5',
    '#3288bd',
    '#5e4fa2',
    '#8e0152',
    '#c51b7d',
    '#de77ae',
    '#f1b6da',
    '#fde0ef',
    '#f7f7f7',
    '#e6f5d0',
    '#b8e186',
    '#7fbc41',
    '#4d9221',
    '#276419',
];

/*const spectrums = {
    blue_white_yellow: [
        '#00d1c1',
        'white',
        '#ffb400',
    ],
    fire: [
        'white',
        'yellow',
        'red',
        'black',
    ],
    white_black: [
        'white',
        'black',
    ],
    black_white: [
        'black',
        'white',
    ],
    YlGnBu: [
        '#ffffd9',
        '#edf8b1',
        '#c7e9b4',
        '#7fcdbb',
        '#41b6c4',
        '#1d91c0',
        '#225ea8',
        '#253494',
        '#081d58',
    ],
};*/

export const category21 = (function() {
    // Color factory
    const seen = {};
    return function(s) {
        if (!s) {
            return;
        }
        let stringifyS = String(s);
        // next line is for superset series that should have the same color
        stringifyS = stringifyS.replace('---', '');
        if (seen[stringifyS] === undefined) {
            seen[stringifyS] = Object.keys(seen).length;
        }
        /* eslint consistent-return: 0 */
        return bnbColors[seen[stringifyS] % bnbColors.length];
    };
}());

export const colorScalerFactory = function(colors, data, accessor, scale, category) {

    const color_scheme = colors;
    const full_color_scheme = colorbrewer[colors]
    const max_color_categories = Object.keys(full_color_scheme)[Object.keys(full_color_scheme).length - 1]
    const min_color_categories = Object.keys(full_color_scheme)[0]

    colors = colorbrewer[colors][category];

    let ext = [0, 1];
    if (data !== undefined) {
        ext = d3.extent(data, accessor);
    }

    if (category > Number(max_color_categories) || category < Number(min_color_categories)) {
        d3.selectAll("div.alert-warning.color-warning").remove();
        const x = d3.select("div.chart-container div.panel-body");
        x.append('div').attr('class', 'alert-warning color-warning').attr('role', 'alert').text('You have selected a number of categories (' + category + ') outside of the bounds of the the color scheme - ' + color_scheme + '. Please select a different color scheme or a different number of categories.');
    } else {
        d3.selectAll("div.alert-warning.color-warning").remove();
    }

    const points = [];
    const chunkSize = (ext[1] - ext[0]) / category;

    for (var i = 1; i < colors.length; i++) {
        points.push(ext[0] + (i * chunkSize));
    }

    if (scale == 'quantile') {
        return d3.scale.quantile().domain(data.map(accessor)).range(colors);
    } else if (scale == 'quantize') {
        return d3.scale.quantize().domain(data.map(accessor)).range(colors);
    } else {
        return d3.scale.threshold().domain(points).range(colors);
    }

};