
// A "palette" is a set of colors that have not been assigned roles yet.

//================================================================================
// TYPES

export type ColorRGB = {
    // range: 0 to 1
    r: number,
    g: number,
    b: number,
}

export type ColorHexString = string;  // '#ff9900' or can also be the string 'none'

export interface BasicPalette {
    gr6: ColorHexString,  // background (white, in light mode)
    gr0: ColorHexString,  // text (black, in light mode)
    ac3: ColorHexString,  // accent color
}

export interface FullPalette {
    gr6: ColorHexString,  // background (white, in light mode)
    gr5: ColorHexString,
    gr4: ColorHexString,
    gr3: ColorHexString,  // middle gray
    gr2: ColorHexString,
    gr1: ColorHexString,
    gr0: ColorHexString,  // text (black, in light mode)

    ac4: ColorHexString,  // accent color lighter
    ac3: ColorHexString,  // accent color
    ac2: ColorHexString,  // accent color darker
}

//================================================================================
// CONVERT BETWEEN COLORS AND HEX STRINGS

export let cToHexString = (c: ColorRGB): string => {
    let rh = Math.round(c.r * 255).toString(16).padStart(2, '0');
    let gh = Math.round(c.g * 255).toString(16).padStart(2, '0');
    let bh = Math.round(c.b * 255).toString(16).padStart(2, '0');
    return '#' + rh + gh + bh;
}

export let cFromHexString = (s: ColorHexString): ColorRGB | null => {
    if (s === 'none' || !s.startsWith('#') || s.length !== 7) { return null; }
    return {
        r: parseInt(s.slice(1, 3), 16) / 255,
        g: parseInt(s.slice(3, 5), 16) / 255,
        b: parseInt(s.slice(5, 7), 16) / 255,
    };
}

export let colorMapToHexMap = (co: Record<string, ColorRGB>): Record<string, string> => {
    let result: Record<string, string> = {};
    for (let [k, v] of Object.entries(co)) {
        result[k] = v === null ? 'none' : cToHexString(v);
    }
    return result;
}

//================================================================================
// COLOR MATH

let lerp = (a: number, b: number, t: number): number =>
    a + (b-a) * t;

export let cLerp = (c1: ColorRGB, c2: ColorRGB, t: number): ColorRGB =>
    ({
        r: lerp(c1.r, c2.r, t),
        g: lerp(c1.g, c2.g, t),
        b: lerp(c1.b, c2.b, t),
    })

export let cLerpStr = (c1s: ColorHexString, c2s: ColorHexString, t: number): ColorHexString => {
    let c1 = cFromHexString(c1s);
    let c2 = cFromHexString(c2s);
    if (c1 && c2) {
        return cToHexString(cLerp(c1, c2, t));
    } else {
        return 'none';
    }
}

export let luminance = (c: ColorRGB): number => {
    // perceptual luminance
    // https://www.w3.org/TR/WCAG/#dfn-relative-luminance
    let r = c.r < 0.03928 ? c.r/12.92 : Math.pow((c.r + 0.055)/1.055, 2.4);
    let g = c.g < 0.03928 ? c.g/12.92 : Math.pow((c.g + 0.055)/1.055, 2.4);
    let b = c.b < 0.03928 ? c.b/12.92 : Math.pow((c.b + 0.055)/1.055, 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export let contrastRatio = (c1: ColorRGB, c2: ColorRGB): number => {
    // https://www.w3.org/TR/WCAG/#dfn-contrast-ratio
    let l1 = luminance(c1);
    let l2 = luminance(c2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

//================================================================================
// PALETTE GENERATION

export let makeFullPalette = (p: BasicPalette): FullPalette => ({
    gr6: p.gr6,
    gr5: cLerpStr(p.gr0, p.gr6, 0.79),  // these numbers were adjusted to create
    gr4: cLerpStr(p.gr0, p.gr6, 0.60),  // a perceptually uniform gradient
    gr3: cLerpStr(p.gr0, p.gr6, 0.44),
    gr2: cLerpStr(p.gr0, p.gr6, 0.30),
    gr1: cLerpStr(p.gr0, p.gr6, 0.16),
    gr0: p.gr0,

    ac4: cLerpStr(p.ac3, p.gr6, 0.31),
    ac3: p.ac3,
    ac2: cLerpStr(p.ac3, p.gr0, 0.31),
});

//================================================================================
// LIGHT AND DARK MODE

export let invertBasicPalette = (p: BasicPalette): BasicPalette => ({
    gr0: p.gr6,
    gr6: p.gr0,
    ac3: p.ac3,
});

export let invertFullPalette = (p: FullPalette): FullPalette =>
    // regenerate the palette to use the proper perceptual brightness gradient
    makeFullPalette(invertBasicPalette(p));

export let paletteIsLight = (p : BasicPalette | FullPalette) => {
    let c0 = cFromHexString(p.gr0);
    let c6 = cFromHexString(p.gr6);
    if (c0 === null || c6 === null) { return true; }
    return luminance(c6) > luminance(c0);
}

export let forceBasicPaletteToLightMode = (p: BasicPalette): BasicPalette =>
    paletteIsLight(p) ? p : invertBasicPalette(p);

export let forceBasicPaletteToDarkMode = (p: BasicPalette): BasicPalette =>
    !paletteIsLight(p) ? p : invertBasicPalette(p);

export let forceFullPaletteToLightMode = (p: FullPalette): FullPalette =>
    !paletteIsLight(p) ? p : invertFullPalette(p);

export let forceFullPaletteToDarkMode = (p: FullPalette): FullPalette =>
    !paletteIsLight(p) ? p : invertFullPalette(p);
