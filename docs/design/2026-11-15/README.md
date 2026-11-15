# moss redesign proposals — 2026-11-15

These are AI-generated visual proposals for review, not implemented pages. Existing application code and DESIGN.md have not been changed.

## Deliverables
- 01-home.png — wide illustrated neighborhood home.
- 02-code.png — repository-first code hosting interface.
- 03-social.png — three-column social timeline proposal.
- prompts.json — complete generation prompts; built-in image_gen was used.

## Direction
Replace the fixed 600px table composition with a responsive desktop shell around 1180–1240px wide. Warm ivory (#F7F6F0), white surfaces, charcoal (#27332C), muted forest green (#38634D), fine gray-green dividers. Remove rainbow decoration. Use existing self-hosted DM Sans for implementation. A smooth moss mound and one sprout is the proposed simple brand symbol; final asset must be generated and standardized separately. Generated marks differ slightly across these exploration images.

The home uses an ink-outlined everyday urban park illustration inspired by the user's reference: people chatting, cycling and spending time outdoors. Illustration is concentrated on home/entry surfaces, not behind dense application content.

Code puts search, repository names, descriptions, language, activity and filters ahead of promotional material. Remove the large hero, three selling points and maintainers promo from the current Code page. Retain genuine Forgejo data, external repository links and accurate configured/empty states.

Social follows familiar Bluesky/Mastodon information hierarchy: persistent navigation, readable central feed, restrained discovery sidebar, avatars and consistent action positions. Commons can share this shell while keeping discussion threads. Chat should retain room navigation and a dedicated message pane.

## Research and limits
- Bluesky live web app: https://bsky.app/ — inspected via browser; familiar timeline-focused navigation and feeds are useful references.
- Mastodon interface preferences: https://docs.joinmastodon.org/user/preferences/ — documents simple and advanced layouts. A three-region page with one primary feed is the recommendation here; do not confuse it with multiple independent timeline columns.
- Mastodon network features: https://docs.joinmastodon.org/user/network/ — local/public/list timelines.
- Codeberg first steps: https://docs.codeberg.org/getting-started/first-steps/ — repository-oriented account workflow.
- Codeberg repository workflow: https://docs.codeberg.org/getting-started/first-repository/
- https://codeberg.org/explore/repos and https://git.gay/explore/repos were requested reference targets, but web fetching was blocked by robots restrictions. No claim is made to have verified their current exact styling. Code exploration uses the established Forgejo layout direction and the existing moss repository fields.

## Existing capabilities versus proposed features
The current /timeline aggregates RSS and Atom; it is not a full social posting backend. Following, likes, reposts, notifications, bookmarks, profile discovery, composer and social search in 03-social.png are product proposals, not shipped functionality.
Code currently reads repository data from Forgejo. Search/filter UI can be built against that data; creation, organizations and broader forge management must link to supported Forgejo destinations or be added explicitly.
Names, posts, counts, timestamps, repository metadata, people and notifications in the images are illustrative mock data. Never present these as real production activity. Do not copy accidental generated typography, unsupported pagination or inconsistent avatar/mark details literally.

## Implementation handoff
The user asked to see AI design proposals first. Review these before converting the chosen direction into application code. The user's latest brief supersedes the older DESIGN.md rules requiring 600px tables, pixel icons, rainbow decoration and prohibiting generated illustration. During implementation update DESIGN.md accordingly, keep fonts and selected generated assets local, preserve working authentication/forms/chat/repository integrations, and verify home, code, timeline, chat, commons and docs at desktop and mobile sizes with keyboard access.
