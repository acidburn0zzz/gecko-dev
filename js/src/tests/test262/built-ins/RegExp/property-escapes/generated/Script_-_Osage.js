// |reftest| skip -- regexp-unicode-property-escapes is not supported
// Copyright 2020 Mathias Bynens. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
author: Mathias Bynens
description: >
  Unicode property escapes for `Script=Osage`
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
    [0x0104B0, 0x0104D3],
    [0x0104D8, 0x0104FB]
  ]
});
testPropertyEscapes(
  /^\p{Script=Osage}+$/u,
  matchSymbols,
  "\\p{Script=Osage}"
);
testPropertyEscapes(
  /^\p{Script=Osge}+$/u,
  matchSymbols,
  "\\p{Script=Osge}"
);
testPropertyEscapes(
  /^\p{sc=Osage}+$/u,
  matchSymbols,
  "\\p{sc=Osage}"
);
testPropertyEscapes(
  /^\p{sc=Osge}+$/u,
  matchSymbols,
  "\\p{sc=Osge}"
);

const nonMatchSymbols = buildString({
  loneCodePoints: [],
  ranges: [
    [0x00DC00, 0x00DFFF],
    [0x000000, 0x00DBFF],
    [0x00E000, 0x0104AF],
    [0x0104D4, 0x0104D7],
    [0x0104FC, 0x10FFFF]
  ]
});
testPropertyEscapes(
  /^\P{Script=Osage}+$/u,
  nonMatchSymbols,
  "\\P{Script=Osage}"
);
testPropertyEscapes(
  /^\P{Script=Osge}+$/u,
  nonMatchSymbols,
  "\\P{Script=Osge}"
);
testPropertyEscapes(
  /^\P{sc=Osage}+$/u,
  nonMatchSymbols,
  "\\P{sc=Osage}"
);
testPropertyEscapes(
  /^\P{sc=Osge}+$/u,
  nonMatchSymbols,
  "\\P{sc=Osge}"
);

reportCompare(0, 0);
