import t = require('tap');
//t.runOnly = true;

import {
    ColorRGB,
    ColorHexString,
    cToHexString,
    cFromHexString,
    cLerp,
    luminance,
    contrastRatio,
    paletteIsLight
} from '../palette';

t.test('hex string conversion back and forth to ColorRGB', (t: any) => {
    let pairs: [ColorHexString, ColorRGB | null][] = [
        ['#ffff00', {r: 1, g: 1, b: 0}],
        ['#000100', {r: 0, g: 1/255, b: 0}],
        ['#000200', {r: 0, g: 2/255, b: 0}],
        ['#000300', {r: 0, g: 3/255, b: 0}],
        ['#008000', {r: 0, g: 128/255, b: 0}],
        ['#00fe00', {r: 0, g: 254/255, b: 0}],
        ['#00ff00', {r: 0, g: 255/255, b: 0}],
        ['', null],
        ['#f90', null],
        ['#12345', null],
        ['#1234567', null],
        [':123456', null],
        ['red', null],
    ]
    for (let [str, col] of pairs) {
        t.same(cFromHexString(str), col, `${str} --> ${JSON.stringify(col)}`);
        if (col !== null) {
            t.same(cToHexString(col), str, `${str} <-- ${JSON.stringify(col)}`);
            t.same(cToHexString(cFromHexString(str) as ColorRGB), str, `${str}: roundtrip str --> col --> str`);
            t.same(cFromHexString(cToHexString(col)), col, `${JSON.stringify(col)}: roundtrip col --> str --> col`);
        }
    }
    t.same(cToHexString({r: 2.2, g: 0, b: -1.1}), '#ff0000', 'cToHexString clamps when out of bounds')
    t.done();
});

t.test('cLerp', (t: any) => {
    let c1: ColorRGB = {r: 0, g: 0.5, b: 0};
    let c2: ColorRGB = {r: 1, g: 0, b: 0.2};
    t.same(cLerp(c1, c2, 0), c1)
    t.same(cLerp(c1, c2, 1), c2)
    t.same(cLerp(c1, c2, 0.5), {r: 0.5, g: 0.25, b: 0.1});
    t.same(cLerp(c1, c2, 0.25), {r: 0.25, g: 0.375, b: 0.05});

    t.same(cLerp(c1, c2, 2), {r: 2, g: -0.5, b: 0.4}, 'lerping past 1.0 is not clamped');

    t.done();
});

t.test('luminance', (t: any) => {
    t.same(luminance(cFromHexString('#000000') as ColorRGB), 0, 'black has luminance 0');
    t.same(luminance(cFromHexString('#ffffff') as ColorRGB), 1, 'white has luminance 1');
    t.done();
});

t.test('contrastRatio', (t: any) => {
    t.same(contrastRatio(
        cFromHexString('#ff9900') as ColorRGB,
        cFromHexString('#ff9900') as ColorRGB
    ), 1, 'same color has contrast ratio 1');
    t.same(contrastRatio(
        cFromHexString('#ffffff') as ColorRGB,
        cFromHexString('#000000') as ColorRGB
    ), 21, 'white and black have contrast ratio 21');
    t.same(contrastRatio(
        cFromHexString('#ffffff') as ColorRGB,
        cFromHexString('#000000') as ColorRGB
    ), 21, 'black and white have contrast ratio 21');
    t.done();
});

t.test('paletteIsLight', (t: any) => {
    t.same(paletteIsLight({
        gr0: '#000000',
        gr6: '#ffffff',
        ac3: '#ff0000',
    }), true);
    t.same(paletteIsLight({
        gr0: '#ffffff',
        gr6: '#000000',
        ac3: '#ff0000',
    }), false);
    t.done();
});
