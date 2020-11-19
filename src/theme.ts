import {
    BasicPalette,
    ColorHexString,
    FullPalette,
    invertFullPalette,
    makeFullPalette,
} from './palette';

// A "theme" is a set of colors that have been assigned specific jobs on the page
// such as text, page background, button border, etc.

//================================================================================
// THEMES


export interface Theme extends FullPalette {

    // the raw palette colors are here too, inherited from FullPalette

    // gr6: ColorHexString,  // background (white, in light mode)
    // gr5: ColorHexString,
    // gr4: ColorHexString,
    // gr3: ColorHexString,  // middle gray
    // gr2: ColorHexString,
    // gr1: ColorHexString,
    // gr0: ColorHexString,  // text (black, in light mode)

    // ac4: ColorHexString,  // accent color lighter
    // ac3: ColorHexString,  // accent color
    // ac2: ColorHexString,  // accent color darker

    // brightest (in light mode)
    card: ColorHexString,
    page: ColorHexString,
    link: ColorHexString,
    faintText: ColorHexString,
    text: ColorHexString,
    // darkest

    quietButtonBg: ColorHexString,
    quietButtonBorder: ColorHexString,
    quietButtonText: ColorHexString,

    loudButtonBg: ColorHexString,
    loudButtonBorder: ColorHexString,  // or 'none'
    loudButtonText: ColorHexString,

    textInputBg: ColorHexString,
    textInputText: ColorHexString,
    textInputBorder: ColorHexString,  // or 'none'
}

export let makeTheme = (p: FullPalette): Theme => ({
    // include the raw colors too
    ...p,

    //              dark     light
    //                 0123456
    card:                    p.gr6,
    page:                   p.gr5,
    link:                 p.ac3,
    faintText:            p.gr3,
    text:              p.gr0,
    //                 -------
    quietButtonBg:        p.gr3,
    quietButtonBorder: 'none',
    quietButtonText:         p.gr6,
    //                 -------
    loudButtonBg:        p.ac2,
    loudButtonBorder:  'none',
    loudButtonText:          p.gr6,
    //                 -------
    textInputBg:       'none',
    textInputBorder:       p.gr4,
    textInputText:     p.gr0,
    //                 0123456
});

export let makeLightAndDarkThemes = (p: BasicPalette | FullPalette) => {
    // expand basic palette into full palette if needed
    let fp : FullPalette;
    if ('gr1' in p) { fp = p as FullPalette; }
    else { fp = makeFullPalette(p); }

    return {
        lightTheme: makeTheme(fp),
        darkTheme: makeTheme(invertFullPalette(fp)),
    }
};
