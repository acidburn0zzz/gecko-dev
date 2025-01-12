// |reftest| skip -- regexp-unicode-property-escapes is not supported
// Copyright 2020 Mathias Bynens. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
author: Mathias Bynens
description: >
  Unicode property escapes for `Script=Braille`
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
    [0x002800, 0x0028FF]
  ]
});
testPropertyEscapes(
  /^\p{Script=Braille}+$/u,
  matchSymbols,
  "\\p{Script=Braille}"
);
testPropertyEscapes(
  /^\p{Script=Brai}+$/u,
  matchSymbols,
  "\\p{Script=Brai}"
);
testPropertyEscapes(
  /^\p{sc=Braille}+$/u,
  matchSymbols,
  "\\p{sc=Braille}"
);
testPropertyEscapes(
  /^\p{sc=Brai}+$/u,
  matchSymbols,
  "\\p{sc=Brai}"
);

const nonMatchSymbols = buildString({
  loneCodePoints: [],
  ranges: [
    [0x00DC00, 0x00DFFF],
    [0x000000, 0x0027FF],
    [0x002900, 0x00DBFF],
    [0x00E000, 0x10FFFF]
  ]
});
testPropertyEscapes(
  /^\P{Script=Braille}+$/u,
  nonMatchSymbols,
  "\\P{Script=Braille}"
);
testPropertyEscapes(
  /^\P{Script=Brai}+$/u,
  nonMatchSymbols,
  "\\P{Script=Brai}"
);
testPropertyEscapes(
  /^\P{sc=Braille}+$/u,
  nonMatchSymbols,
  "\\P{sc=Braille}"
);
testPropertyEscapes(
  /^\P{sc=Brai}+$/u,
  nonMatchSymbols,
  "\\P{sc=Brai}"
);

reportCompare(0, 0);
