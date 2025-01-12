/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

/* import-globals-from storage-helpers.js */

"use strict";

Services.scriptloader.loadSubScript(
  "chrome://mochitests/content/browser/devtools/server/tests/browser/storage-helpers.js",
  this
);

add_task(async function() {
  await pushPref("devtools.chrome.enabled", true);
  await pushPref("devtools.debugger.remote-enabled", true);
  const { target, front } = await openTabAndSetupStorage(
    MAIN_DOMAIN + "storage-updates.html"
  );
  await createIndexedDB();

  await testInternalDBs(front);
  await clearStorage();

  // Forcing GC/CC to get rid of docshells and windows created by this test.
  forceCollections();
  await target.destroy();
  forceCollections();
  DevToolsServer.destroy();
  forceCollections();
});

async function createIndexedDB() {
  const request = indexedDB.open("MyDatabase", 1);

  request.onupgradeneeded = function() {
    const db = request.result;
    const store = db.createObjectStore("MyObjectStore", { keyPath: "id" });
    store.createIndex("NameIndex", ["name.last", "name.first"]);
  };

  await undefined;
}

async function testInternalDBs(front) {
  const data = await front.listStores();
  const hosts = data.indexedDB.hosts;

  // According to bug 1594810 "persistent" storage is deprecated and we plan
  // to remove support completely in dom/indexedDB. To make this possible
  // we need to skip "persistent" storage entries to prevent the toolbox
  // from breaking when support is removed.
  ok(!hosts.chrome, `indexedDB hosts doesn't contain "chrome"`);
}
