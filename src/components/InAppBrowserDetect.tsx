import { useEffect } from 'react';

/**
 * Silently forces the site open in the device's default external browser when it
 * detects it's running inside an in-app webview (Facebook, Instagram, Messenger,
 * WhatsApp, Line, Snapchat, or the Google app's in-app browser).
 *
 * No UI is shown — this just redirects automatically:
 * - Android: launches Chrome directly via an `intent://` URL, which escapes the
 *   webview without any user interaction.
 * - iOS: in-app webviews on iOS don't allow a page to programmatically open
 *   Safari, so as a best-effort fallback we attempt `x-safari-https://`, which
 *   Safari understands and some in-app browsers will route to Safari.
 *
 * This component renders nothing.
 */
export default function InAppBrowserDetect() {
  useEffect(() => {
    const ua = navigator.userAgent || '';
    const isInApp = /FBAN|FBAV|Instagram|Messenger|WhatsApp|Line\/|Snapchat|GSA\//i.test(ua);
    if (!isInApp) return;

    // Avoid redirect loops if the external browser handoff itself gets re-detected.
    if (sessionStorage.getItem('bq_external_redirect_attempted') === '1') return;
    sessionStorage.setItem('bq_external_redirect_attempted', '1');

    const currentUrl = window.location.href;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    if (isAndroid) {
      // Escapes the in-app webview straight into Chrome with no prompt.
      const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = intentUrl;
    } else if (isIOS) {
      // Best-effort: ask Safari to take over. iOS webviews don't expose a
      // reliable programmatic "open in Safari" API, so this may not work in
      // every in-app browser, but it's the closest available mechanism.
      window.location.href = currentUrl.replace(/^https?:\/\//, 'x-safari-https://');
    }
  }, []);

  return null;
}
