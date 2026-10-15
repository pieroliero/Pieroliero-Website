# PieroLiero — The Professor’s Office

Personality-first homepage prototype with an interactive classroom desk and a separate PieroLiero joke store.

## Run locally

Requires Python 3; no build step or package installation is needed.

```sh
python3 serve.py
```

Open http://127.0.0.1:8767/ . The server binds to localhost by default.

## Navigation

- Header: The music, The syllabus, Meet your professor.
- Record: Music / Spotify. Spotify is marked coming soon as PieroLiero.
- Globe: Travel / Vlogs, with 29 saved YouTube vlog entries.
- Books: Lessons / Field Research, with 12 saved Instagram main-grid posts, including the three Instagram-pinned reels first.
- Peach: Events / Bad Decisions. The destination website has not launched; the panel shows coming soon.
- Lamp: Live / Kick, linking to https://kick.com/pieroliero and checking public replay listings when the panel opens.
- Desk bow tie beside the books: PieroLiero Store.

The report card has hand-drawn grades, classroom doodles and the instructor signature Pierre Real.

## Store

`store.html` contains 14 products copied from https://www.passportpro.co/pieroliero-store with the original banner, images, names, prices and descriptions. Product previews run locally. Shopping links continue to the original Squarespace product pages for cart and checkout; payment processing and inventory have not been migrated. Original Passport Pro navigation, promotions and newsletter are omitted.

## Content and hosting

YouTube and Instagram galleries are saved snapshots, not automatic account syncs. Update `vlogs.js` and `instagram-grid.js` with new content. `lectures.js` retains the earlier YouTube playlist snapshot, which is no longer linked from the books.

`serve.py` also provides `/api/kick-replays` by reading public Kick markup. Kick currently has no saved broadcasts. The parser can need maintenance if Kick changes its public page. On static-only hosting, the frontend still works and falls back to Kick channel/archive links when this endpoint is unavailable.

The store uses Google Fonts for its original-style typography. Other image assets are local. No credentials, account tokens, reference reel, autoplay video or background audio are included.

This repository upload does not configure hosting, DNS, a production backend or a custom domain.
