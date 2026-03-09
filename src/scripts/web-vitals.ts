/**
 * Envía Core Web Vitals a Google Analytics (gtag).
 * Ver: https://web.dev/vitals/
 */
type WebVitalsMetric = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
};

function sendToAnalytics(metric: WebVitalsMetric) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.rating,
    non_interaction: true,
  });
}

export function reportWebVitals() {
  import('web-vitals').then(({ onCLS, onINP, onLCP }) => {
    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);
    onCLS(sendToAnalytics);
  });
}
