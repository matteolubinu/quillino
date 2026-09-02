// Google Analytics 4 con Consent Mode v2. File esterno (non inline) per la CSP.
// gtag.js viene caricato in <head> con <script async src="...googletagmanager...">.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
try {
  if (localStorage.getItem('quillino-analytics-consent') === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
} catch (e) {}
gtag('config', 'G-9974W2YSF0');
