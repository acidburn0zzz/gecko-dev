#include "gdb-tests.h"
#include "jsapi.h"
#include "js/CompilationAndEvaluation.h"
#include "js/CompileOptions.h"
#include "js/SourceText.h"
#include "vm/JSFunction.h"
#include "vm/JSScript.h"
#include "mozilla/ArrayUtils.h"
#include "mozilla/Utf8.h"

FRAGMENT(jsbytecode, simple) {
  constexpr unsigned line0 = __LINE__;
  static const char chars[] = R"(
    debugger;
  )";

  JS::CompileOptions opts(cx);
  opts.setFileAndLine(__FILE__, line0 + 1);

  JS::SourceText<mozilla::Utf8Unit> srcBuf;
  JS::Rooted<JS::Value> rval(cx);

  bool ok = srcBuf.init(cx, chars, mozilla::ArrayLength(chars) - 1,
                        JS::SourceOwnership::Borrowed);

  JSScript* script = JS::CompileDontInflate(cx, opts, srcBuf);
  jsbytecode* code = script->code();

  breakpoint();

  use(ok);
  use(code);
}
