// |reftest| skip -- regexp-unicode-property-escapes is not supported
// Copyright 2020 Mathias Bynens. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
author: Mathias Bynens
description: >
  Unicode property escapes for `Script=Javanese`
info: |
  Generated by https://github.com/mathiasbynens/unicode-property-escapes-tests
  Unicode v13.0.0
esid: sec-static-semantics-unicodematchproperty-p
features: [regexp-unicode-property-escapes]
includes: [regExpUtils.js]
---*/

const matchSymbols = buildString({
  loneCodePoints: [],
  ranges: [
    [0x00A980, 0x00A9CD],
    [0x00A9D0, 0x00A9D9],
    [0x00A9DE, 0x00A9DF]
  ]
});
testPropertyEscapes(
  /^\p{Script=Javanese}+$/u,
  matchSymbols,
  "\\p{Script=Javanese}"
);
testPropertyEscapes(
  /^\p{Script=Java}+$/u,
  matchSymbols,
  "\\p{Script=Java}"
);
testPropertyEscapes(
  /^\p{sc=Javanese}+$/u,
  matchSymbols,
  "\\p{sc=Javanese}"
);
testPropertyEscapes(
  /^\p{sc=Java}+$/u,
  matchSymbols,
  "\\p{sc=Java}"
);

const nonMatchSymbols = buildString({
  loneCodePoints: [],
  ranges: [
    [0x00DC00, 0x00DFFF],
    [0x000000, 0x00A97F],
    [0x00A9CE, 0x00A9CF],
    [0x00A9DA, 0x00A9DD],
    [0x00A9E0, 0x00DBFF],
    [0x00E000, 0x10FFFF]
  ]
});
testPropertyEscapes(
  /^\P{Script=Javanese}+$/u,
  nonMatchSymbols,
  "\\P{Script=Javanese}"
);
testPropertyEscapes(
  /^\P{Script=Java}+$/u,
  nonMatchSymbols,
  "\\P{Script=Java}"
);
testPropertyEscapes(
  /^\P{sc=Javanese}+$/u,
  nonMatchSymbols,
  "\\P{sc=Javanese}"
);
testPropertyEscapes(
  /^\P{sc=Java}+$/u,
  nonMatchSymbols,
  "\\P{sc=Java}"
);

reportCompare(0, 0);
