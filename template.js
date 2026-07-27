// DaidaGuard GTM Tag — Sandboxed JS (Greenfield Version)
// Constraints: ES5 only — no const/let, no arrow functions, no template literals.
var injectScript = require("injectScript");
var setInWindow = require("setInWindow");
var copyFromWindow = require("copyFromWindow");
var logToConsole = require("logToConsole");

var debug = data.debugMode === true;
function log(msg) {
  if (debug) logToConsole("[DaidaGuard] " + msg);
}

var dataLayerName = data.dataLayerName || "dataLayer";

// 1. Initialize or retrieve the unified global registry object defensively
var guardRegistry = copyFromWindow("__DAIDA_GUARD__") || {};
guardRegistry.instanceActive = guardRegistry.instanceActive || false;
guardRegistry.interceptors = guardRegistry.interceptors || {};
guardRegistry.pendingConfigs = guardRegistry.pendingConfigs || [];
guardRegistry.debugHistory = guardRegistry.debugHistory || [];

// 2. Safely stage this specific configuration into the pending configuration stack
//    so the asynchronously loading SDK knows what parameters to match on parse.
guardRegistry.pendingConfigs.push({
  orgId: data.orgId,
  accountId: data.accountId,
  dataLayerName: dataLayerName
});

setInWindow("__DAIDA_GUARD__", guardRegistry);

// 3. Set global debug flag if enabled
if (debug) {
  setInWindow("_dlvDebugMode", true);
}

// 4. Force GTM to execute the script IIFE separately for each tag instance via cache-busting
var sdkUrl = "https://cdn.daidalytics.com/sdk/latest/dlv-sdk.min.js";
var separator = sdkUrl.indexOf("?") >= 0 ? "&" : "?";
var uniqueSdkUrl = sdkUrl + separator + "org=" + data.orgId + "&dl=" + dataLayerName;

log("Loading SDK instance for dataLayer: " + dataLayerName);

injectScript(
  uniqueSdkUrl,
  function () {
    log("SDK loaded successfully for " + dataLayerName);
    data.gtmOnSuccess();
  },
  function () {
    log("SDK failed to load for " + dataLayerName);
    data.gtmOnFailure();
  }
);
