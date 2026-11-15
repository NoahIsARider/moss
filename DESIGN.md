# moss design contract

The user's approved November 15, 2026 redesign supersedes the previous 600px/pixel-art contract.

## Visual system
Warm ivory #f7f6f0, white surfaces, charcoal #27332c, forest green #38634d, gray-green dividers #d9dfd6. Self-hosted DM Sans. No rainbow decoration, pixel art, promotional feature grids, glass effects or animated marquees.
Home: wide original riverside neighborhood illustration, concise welcome note, real recent activity and service links. Desktop shell about 1200px, responsive down to 360px.
Social: left navigation, one central feed and quiet community sidebar. Show only working controls. Local posts, commons and RSS must reflect real sources. No invented engagement, users, counts or activity.
Code: compact navigation, real repository search/language filter/sort, genuine repository metadata. No huge mascot hero or selling points.
Docs, auth, account, discussion and chat share the community shell. Preserve accessible labels, keyboard access, visible focus and live region for chat.

## Assets
AI-generated original canal/library/workshop scene, thirty-two hand-drawn default portrait variants, a simple moss-and-sprout raster mark. Assets must be self-hosted; paths use lib/assets.ts for Pages compatibility. Sprite sheet avatars use four sheets of eight fixed cells. Default assignment is deterministic; signed-in users can persist their choice.

## Data separation
Production app/lib/components must not import demo fixtures or conditionally seed data. A fresh instance starts empty regardless of MOSS_DEMO. Existing data must never be deleted automatically.
demo/ contains the isolated public GitHub Pages showcase. It reuses presentation components, labels its examples clearly, and never reads .env, .data, production auth or integration credentials. Local interactions are explicitly browser-only. Public pages must contain no real user records.
Verify production build, isolated Pages build, mobile/desktop views, search/filter, navigation, authentication, post creation, discussions/replies, avatar persistence, and demo isolation.
