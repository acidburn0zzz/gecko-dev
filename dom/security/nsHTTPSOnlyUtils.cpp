/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=8 sts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mozilla/StaticPrefs_dom.h"
#include "nsContentUtils.h"
#include "nsHTTPSOnlyUtils.h"
#include "nsIConsoleService.h"
#include "nsIScriptError.h"

/* static */
bool nsHTTPSOnlyUtils::ShouldUpgradeRequest(nsIURI* aURI,
                                            nsILoadInfo* aLoadInfo) {
  // 1. Check if HTTPS-Only mode is enabled
  if (!mozilla::StaticPrefs::dom_security_https_only_mode()) {
    return false;
  }
  // 2. Check if NoUpgrade-flag is set in LoadInfo
  if (aLoadInfo->GetHttpsOnlyNoUpgrade()) {
    // Let's log to the console, that we didn't upgrade this request
    uint32_t innerWindowId = aLoadInfo->GetInnerWindowID();
    AutoTArray<nsString, 2> params = {
        NS_ConvertUTF8toUTF16(aURI->GetSpecOrDefault())};
    nsHTTPSOnlyUtils::LogLocalizedString(
        "HTTPSOnlyNoUpgrade", params, nsIScriptError::infoFlag, innerWindowId,
        !!aLoadInfo->GetOriginAttributes().mPrivateBrowsingId, aURI);
    return false;
  }

  // 3. Upgrade the request

  // Let's log it to the console
  // Append the additional 's' just for the logging
  nsAutoCString scheme;
  aURI->GetScheme(scheme);
  scheme.AppendLiteral("s");
  NS_ConvertUTF8toUTF16 reportSpec(aURI->GetSpecOrDefault());
  NS_ConvertUTF8toUTF16 reportScheme(scheme);

  uint32_t innerWindowId = aLoadInfo->GetInnerWindowID();
  AutoTArray<nsString, 2> params = {reportSpec, reportScheme};
  nsHTTPSOnlyUtils::LogLocalizedString(
      "HTTPSOnlyUpgradeRequest", params, nsIScriptError::warningFlag,
      innerWindowId, !!aLoadInfo->GetOriginAttributes().mPrivateBrowsingId,
      aURI);

  return true;
}

/** Logging **/

/* static */
void nsHTTPSOnlyUtils::LogLocalizedString(
    const char* aName, const nsTArray<nsString>& aParams, uint32_t aFlags,
    uint64_t aInnerWindowID, bool aFromPrivateWindow, nsIURI* aURI) {
  nsAutoString logMsg;
  nsContentUtils::FormatLocalizedString(nsContentUtils::eSECURITY_PROPERTIES,
                                        aName, aParams, logMsg);
  LogMessage(logMsg, aFlags, aInnerWindowID, aFromPrivateWindow, aURI);
}

/* static */
void nsHTTPSOnlyUtils::LogMessage(const nsAString& aMessage, uint32_t aFlags,
                                  uint64_t aInnerWindowID,
                                  bool aFromPrivateWindow, nsIURI* aURI) {
  // Prepending HTTPS-Only to the outgoing console message
  nsString message;
  message.AppendLiteral(u"HTTPS-Only Mode: ");
  message.Append(aMessage);

  // Allow for easy distinction in devtools code.
  nsCString category("HTTPSOnly");

  if (aInnerWindowID > 0) {
    // Send to content console
    nsContentUtils::ReportToConsoleByWindowID(message, aFlags, category,
                                              aInnerWindowID, aURI);
  } else {
    // Send to browser console
    LogSimpleConsoleError(message, category.get(), aFromPrivateWindow,
                          true /* from chrome context */, aFlags);
  }
}

/* static */
void nsHTTPSOnlyUtils::LogSimpleConsoleError(const nsAString& aErrorText,
                                             const char* aCategory,
                                             bool aFromPrivateWindow,
                                             bool aFromChromeContext,
                                             uint32_t aErrorFlags) {
  nsCOMPtr<nsIScriptError> scriptError =
      do_CreateInstance(NS_SCRIPTERROR_CONTRACTID);
  if (!scriptError) {
    return;
  }
  nsCOMPtr<nsIConsoleService> console =
      do_GetService(NS_CONSOLESERVICE_CONTRACTID);
  if (!console) {
    return;
  }
  nsresult rv = scriptError->Init(aErrorText, EmptyString(), EmptyString(), 0,
                                  0, aErrorFlags, aCategory, aFromPrivateWindow,
                                  aFromChromeContext);
  if (NS_FAILED(rv)) {
    return;
  }
  console->LogMessage(scriptError);
}
