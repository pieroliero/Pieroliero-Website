PieroLiero.com — The Professor’s Office

A local, editable homepage prototype built around PieroLiero’s established Professor comedy, travel, street research, and music chapters. It has not been published to PieroLiero.com.

Open index.html directly, or run:
python3 serve.py
Then visit http://127.0.0.1:8767 . The supplied server is required for Kick replay refresh. No build or dependency installation is needed.

The desk
- Lamp: Live / Kick. Opens the real Kick channel and replay archive. Only the glass flickers on hover.
- Globe: Travel / Vlogs. Shows 29 verified public YouTube videos with local thumbnails and their individual watch links. Map detail turns beneath fixed color and lighting.
- Center record: Music / Spotify. Opens the music chapter. The user confirmed music is not on Spotify yet; the panel says “Spotify — coming soon as PieroLiero.” No destination has been invented.
- Books: Lectures / Shorts. Opens Professor comedy, including the real YouTube Shorts channel link. Only the isolated diagonal top book tilts and settles.
- Right-hand peach: Field Research / Reels. Shows the first twelve posts displayed in the main Instagram profile grid, with the three pinned videos first, with real thumbnails and individual links. The peach alone wiggles.

Object labels appear on desktop hover or keyboard focus and stay visible on phones. They have no numbered captions, hover glows, or colored hit-box outlines. Reduced-motion preferences suppress animations while preserving the scene. The page contains no embedded autoplay, background audio, or reference-reel player.

The report card
Music leads the curriculum. Its five grades are D, F, E, G, and Z, drawn as uneven red-pen SVG handwriting. The margin doodles echo the Venn diagram, pyramid, people/dollar symbols, and classroom scribbles in blue, green, and pencil-colored strokes. The grades are explicitly self-assessed jokes.

Social content
The Instagram gallery is a profile snapshot captured October 14, 2026, including the profile’s displayed ordering. It is not sorted by views and does not claim automatic sync. This follows the user’s choice to use a manual snapshot while Instagram analytics is disconnected in Metricool. The YouTube catalog contains 29 public uploads verified from @pieroliero1’s Videos tab; one visibly members-only video was excluded.

Kick refresh
The lamp checks the public Kick Videos page when opened; Refresh checks it again. At verification, @pieroliero had no saved broadcasts. The read-only Python endpoint extracts replay links, thumbnails, and titles from public video cards when available. It needs no account credentials. Kick may change its public markup or block server requests; the panel falls back to real channel/archive links if refreshing fails. A production deployment must carry over this server endpoint. Parsing was checked with a representative new-replay fixture; there are no real archived broadcasts yet to test new-replay rendering end to end.

Launch items
Spotify artist URL once the music is published, music release destinations, booking email, deployment, and an authenticated Instagram integration if automatic feed updates are wanted. The existing profile links remain usable.

Validation
Browser checks covered the Instagram grid’s twelve links and thumbnails, the YouTube catalog’s individual links, Kick’s empty archive response, object animation states, no hover glow/hit-box outlines, report-card layout, and responsive widths. JavaScript syntax and local asset references were checked.

Artwork
The chalkboard uses a chalk interpretation of supplied Logo2 with its single bow tie, the original Venn letters LH/JH/MH, all five pyramid labels, and the women/dollar-sign doodles. The unrelated reference reel supplied only the design principle: express the artist’s own interests and lore. Its gaming aesthetic is not used.

Office scenes were generated through Higgsfield from supplied references. Requests specified nano_banana_pro at 4K; Higgsfield completion metadata identified the returned jobs as nano_banana_2. The original final image resolution was 5504 x 3072; the website uses optimized WebP images. Original detail artwork is preserved in office-details.webp. A separately generated clean plate removes the peach and diagonal book, allowing the originals to move as clipped layers without shifting the background.

Final clean-plate prompt
Precise clean-plate inpainting for animating this existing photograph. Remove ONLY TWO OBJECTS: (1) the peach and its green leaf on far right of desk, and (2) the single diagonal top book resting diagonally on the front-left edge of the book stack near x58% y76%. Restore the chalkboard/wall, wooden desktop and underlying book stack naturally behind those two removed objects. Keep ALL OTHER pixels and objects as unchanged as possible: exact central vinyl turntable, lamp, globe, loose white papers on desk, stacked horizontal books, leaning upright books on right, bowtie on desk, shadows of remaining objects, exact chalk logo and every diagram letter and pyramid word. Do NOT move or rescale anything, same composition and camera, same lighting and color, same 16:9 frame. Remove the peach shadow too; preserve wood grain under it. Do not remove loose papers or other books. This is a background plate for original separate peach and top-book animation layers; no replacement objects and no new text. 4K highest quality.

Lectures / Shorts: eight videos from the supplied HOFESSOR LESSONS playlist, in playlist order. Local thumbnails and direct video links retain playlist context. This is a saved playlist snapshot; update lectures.js when adding lessons.

Latest navigation: The music, The syllabus, Meet your professor are centered. Books now open Lessons / Field Research using the saved 12-post Instagram main-grid snapshot; peach is Coming soon for a future website. The desk bow tie by the books opens store.html.
Store: copied 14 original product names, prices, descriptions, banner and 28 original images from the public Passport Pro store. Catalog/product previews run locally; shop links hand off to the original Squarespace product pages for cart and checkout. No payment processor or inventory migration has been performed. Original Passport Pro navigation, promotional popups and newsletter have been omitted from the PieroLiero copy.
