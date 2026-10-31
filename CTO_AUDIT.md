# CapitalSense website — CTO audit

## Executive assessment

The website now has a credible institutional direction: concise positioning, a clear research narrative, restrained colour, and strong disclosure coverage. The interface follows the useful patterns seen on firms such as Thoma Bravo and Blume Ventures: confident editorial type, generous spacing, direct navigation, and motion that supports hierarchy instead of competing with it.

The production build, scrolling system, navigation state, mobile menu, responsive layouts, animation variety, keyboard focus, and reduced-motion behavior have been patched in this branch.

## Findings addressed

- **Build reliability:** removed the Google Fonts build-time request that prevented deterministic production exports.
- **Scroll behavior:** made reading progress update through `requestAnimationFrame`, recalculate after layout and viewport changes, and reinitialize after client-side navigation.
- **Motion direction:** replaced repeated upward reveals with headline masks, directional editorial reveals, staged section entrances, data-line drawing, one-time orbit entrances, restrained hero parallax, and staggered article/card timing.
- **Motion safety:** preserved readable content when JavaScript or observers fail, and retained a reduced-motion path.
- **Navigation:** added active-page states, semantic navigation labels, Escape-to-close behavior, automatic close after route changes, and mobile scroll locking.
- **Responsive design:** removed narrow-screen overflow risks, increased touch targets, simplified mobile research cards, and improved footer and hero behavior at small widths.
- **Accessibility:** improved focus treatment, control labels, current-page announcements, touch sizing, and animation preferences.
- **Performance:** removed a remote font dependency and limited continuous animation to the intentional ticker and scroll cue.

## Launch risks that require business input

1. Publish verified founder identity, ARN/EUIN, distributor details, relevant empanelments, and the legal business name wherever required.
2. Replace LinkedIn-only lead capture with a secure, owned enquiry flow when operationally ready; define retention, consent, and response ownership before collecting data.
3. Complete legal and regulatory review of every service claim and disclosure before promoting distribution services.
4. Establish analytics, uptime monitoring, error reporting, and a content approval owner before public launch.
5. Confirm the production domain. The current canonical metadata, sitemap, and robots file point to the GitHub Pages project URL.

## Validation

- `npm run build` completes successfully.
- All 30 static routes export, including 12 insight articles.
- Type checking and Next.js production compilation pass.
