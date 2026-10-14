# Public page audit: Travel.pk Karachi → Dubai

**Page:** [travel.pk/air/flights/karachi-to-dubai/](https://travel.pk/air/flights/karachi-to-dubai/)  
**Audit date:** 14 October 2026 (PKT)  
**Scope:** one public route page, report only. No production site changes were made.  
**Tools:** [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/report#/https://travel.pk/air/flights/karachi-to-dubai/) and [PageSpeed Insights mobile report](https://pagespeed.web.dev/analysis/https-travel-pk-air-flights-karachi-to-dubai/519ifujw5p?form_factor=mobile).

## Findings

1. **[P1 · speed] Mobile Core Web Vitals fail on LCP.** PageSpeed Insights field data (28-day mobile sample, many devices and network conditions) reported **LCP 3.6 s**, **FCP 2.8 s**, and **TTFB 1.7 s**; its Core Web Vitals assessment was **Failed**. Its separate Lighthouse 13.5.0 mobile run used a Moto G Power and Slow 4G and scored performance **91**, with lab LCP **3.5 s**, TBT **60 ms**, and CLS **0**. The field and lab readings differ because they describe different samples. **Who it hurts:** travellers on slower connections and lower-end phones, who wait longer to see the page's main content. **Fix:** lower origin response time and prioritize the above-fold heading/search content and its critical styles.

2. **[P2 · speed] Render-blocking requests delay the first render.** Lighthouse's mobile Insights panel estimated **560 ms** savings from render-blocking requests. This is an opportunity estimate, not a guaranteed improvement. **Who it hurts:** visitors on slow mobile networks. **Fix:** inline only the small critical styles and defer non-critical styles/scripts.

3. **[P2 · accessibility] Four text/background contrast errors.** WAVE counted **4 contrast errors**; its flagged controls include the trip-type choices and the date control. Lighthouse also lists the insufficient-contrast audit under Accessibility (score **96**). **Who it hurts:** people with low vision or reading in bright light, especially when choosing trip type/date. **Fix:** adjust the foreground/background pairs and verify them against WCAG contrast thresholds.

4. **[P1 · accessibility] Form labels are missing or detached.** WAVE reported **2 “Select missing label” alerts** and **1 “Orphaned form label”**. The search form's visible **TRAVELERS** label is not programmatically attached to its passenger control. **Who it hurts:** screen-reader and speech-input users who need to identify a control before changing it. **Fix:** associate each visible label with its control (`label`/`for` or `aria-labelledby`) and remove the detached label.

5. **[P2 · accessibility] Nine text elements are flagged as very small.** WAVE reported **9 “Very small text” alerts**, including compact utility/navigation and secondary labels. **Who it hurts:** people with low vision and anyone reading on a small phone at default zoom. **Fix:** increase the smallest text to a readable size and confirm it remains legible at 200% zoom.

## Measurement notes

WAVE's summary was **0 Errors, 4 Contrast Errors, 12 Alerts, 8 Features, 49 Structure items, 188 ARIA items** (AIM score **8.9/10**). Alerts are prompts for review, not all confirmed WCAG failures. The report is an automated snapshot; it cannot establish complete WCAG conformance or replace keyboard and screen-reader testing. PageSpeed's 28-day field metrics are from real Chrome users, while its Lighthouse score is one emulated lab run. Scores and measurements can change on a rerun.
