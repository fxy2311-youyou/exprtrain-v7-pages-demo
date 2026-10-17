// Runtime settings are kept in a tiny file so the same web build can run in a
// browser, Capacitor's Android WebView, or a hosted domain. The Android build
// script replaces this value with EXPR_API_BASE_URL when one is supplied.
window.EXPR_RUNTIME_CONFIG = Object.freeze({
  apiBaseUrl: ''
});
