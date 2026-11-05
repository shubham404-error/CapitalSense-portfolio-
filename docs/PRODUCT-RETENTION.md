# Mobile product and retention study - Stride

## Evidence status

This is an initial comparative product analysis, not a completed empirical case study. Official sources below were requested on 2 November 2026 but every request was denied by the environment's network proxy (HTTP 403). Their current contents, dates and links could not be verified. No claims about their current algorithms, retention rates, business outcomes or causal effects are made here. General interface patterns are distinguished from hypotheses to test in Stride. Relevant domain additions were saved in the environment configuration draft; saving does not apply runtime access.

## Comparative patterns and product hypotheses

| Reference | Familiar product pattern | Hypothesis about why it helps | Appropriate Stride application |
| --- | --- | --- | --- |
| Strava | Activity records, personal progress, lightweight social encouragement | A completed activity becomes visible progress and a reason for friends to respond | Confirmed monthly contributions become optional milestones. Encourage consistency without comparing amounts or performance. Confirmation must come from the investment provider. |
| Instagram | Visual creation, a recognisable creation affordance, simple reactions | Lower creation effort and personally meaningful images make sharing easier | A camera action opens a photo journal, with camera/library choices and a caption. Keep financial data out of the image. Preview before external sharing. |
| Tinder | One card at a time, a small set of actions and immediate feedback | Smaller choices can feel more approachable than a long form | Up to 20 scenario cards with button alternatives, skip, editable recap and early stopping. Swipes express preferences; they do not establish affordability, risk capacity or a psychological diagnosis. |
| YouTube | Discovery, search, saved content and personalised relevance | Showing useful content reduces effort to find something worth returning for | Start with a small, curated learning library linked to the user's stated goal. Later offer explicit topic preferences and save/resume controls. Do not claim a recommendation system exists yet. |

These patterns are not evidence that Stride will retain users or that one feature explains another company's success. Product design, content supply, networks, brand, distribution and many other factors differ.

## Implemented in this revision

- Camera icon replaces the text creation button. Mobile navigation puts the camera at the centre of five thumb-reachable destinations.
- Composer offers separate camera and photo-library controls. Camera capture is a browser/OS hint, not a guarantee. Permission remains under user control. Preview, replace and remove are available before posting.
- Sticky mobile header, larger feed text, larger touch targets, compact intro, bottom-sheet dialogs, safe-area spacing and 16px form controls for mobile input.
- A finite feed ends with a visible stopping point and a route back to personal progress.
- Existing onboarding has swipe/button parity, skipping, early stopping and an editable recap.
- Real account/private onboarding support is implemented with Supabase; project provisioning and real email delivery remain prerequisites for live signup.

## The intended habit loop

1. Trigger: a user-chosen reminder around a scheduled contribution, rather than arbitrary daily pressure.
2. Action: check the contribution's actual status and optionally record a memory.
3. Feedback: accurate personal progress and optional encouragement from a chosen circle.
4. Return: a meaningful monthly review, updated goal or useful learning item.

Future contributions must not be labelled successful on a button tap or photo upload. Pauses and failed payments need honest states and recovery options. Notification schedules, audience and sharing should be editable. Photo posts and circles in the current app remain session-only demonstrations.

## Experiments before claiming success

| Experiment | Main outcome | Guardrails |
| --- | --- | --- |
| Icon versus labelled camera creation | Successful first journal post; discovery of creation control | Track mis-taps, accessibility and abandonment; keep accessible labels |
| Swipe intro versus short form | Completion and answer corrections, not just swipes | Assess comprehension and suitability-data quality; retain skip/back controls |
| Personal milestone versus generic reminder | Voluntary return around the next monthly review | Opt-outs, annoyance and unwanted pressure |
| Goal-linked learning versus generic library | Whether users can explain the relevant concept afterward | Avoid optimising only watch time or clicks |
| Circle encouragement | Repeat meaningful participation across monthly cycles | Privacy reports, comparison anxiety, fake milestones and unwanted contact |

Track cohort onboarding completion, saved-plan retrieval and voluntary monthly return. Once transactions are integrated, assess provider-confirmed contribution continuity alongside affordability and pause rates. Do not optimise for larger amounts, excessive transactions or daily screen time as substitutes for financial wellbeing. No A/B experiment or retention measurement has been run yet.

## Official reading list - access pending

- Strava Support, Kudos: https://support.strava.com/hc/en-us/articles/115001183630-Kudos
- Instagram, Instagram Ranking Explained: https://about.instagram.com/blog/announcements/instagram-ranking-explained
- YouTube, On YouTube's recommendation system: https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/
- Tinder Help, Powering Tinder / matching: https://www.help.tinder.com/hc/en-us/articles/7606685697037-Powering-Tinder-The-method-behind-our-matching

Revisit and verify these sources when network access is applied, add independent research and user interviews, then update the hypotheses. Do not cite this reading list as sources already reviewed.
