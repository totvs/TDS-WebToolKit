// import { onLCP, onINP, onCLS, onFID, onTTFB, onFCP } from 'web-vitals/attribution';

// // Core Web Vitals

// //     Cumulative Layout Shift(CLS)
// //     Interaction to Next Paint(INP)
// //     Largest Contentful Paint(LCP)

// // Other metrics

// //     First Contentful Paint(FCP)
// //     Time to First Byte(TTFB)
// //     First Input Delay(FID)

// function showProfile(title: string, metric: any) {
//     // // Replace with whatever serialization method you prefer.
//     // // Note: JSON.stringify will likely include more data than you need.
//     // const body = JSON.stringify(metric);

//     // // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
//     // (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
//     //     fetch('/analytics', { body, method: 'POST', keepalive: true });

//     console.groupCollapsed(`WebVitals: ${title}`);
//     console.log(metric);
//     console.groupEnd();
// }

// const reportWebVitals = (title: string) => {
//     onCLS((event) => showProfile(`FCP: ${title}`, event));
//     onINP((event) => showProfile(`FCP: ${title}`, event));
//     onLCP((event) => showProfile(`FCP: ${title}`, event));
//     onFCP((event) => showProfile(`FCP: ${title}`, event));
//     onTTFB((event) => showProfile(`FCP: ${title}`, event));
//     //  onFID((event) => showProfile(`FCP: ${title}`, event));
// };

// export default reportWebVitals;