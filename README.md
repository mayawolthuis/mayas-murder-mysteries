# Maya's Murder Mysteries — Website starter

A responsive, custom-designed website for **Maya's Murder Mysteries**. Designed for physical mystery kits, with checkout links to Etsy and a no-code content editor through Pages CMS once connected to GitHub.

## What's included

- `index.html` — homepage, mysteries, how it works, About Maya, gallery, reviews, FAQs
- `mystery.html` — automatically populated detail page for each mystery, e.g. `mystery.html?slug=one-last-toast`
- `styles.css` and `app.js` — responsive styling and interactive features
- `content/site.json` — homepage and About Maya copy, Etsy shop URL
- `content/mysteries.json` — all mystery listings and Etsy links
- `content/reviews.json` — customer reviews (currently empty)
- `content/gallery.json` — customer / product photos (currently empty)
- `content/faqs.json` — FAQs
- `.pages.yml` — Pages CMS editor configuration
- `assets/` — crest, original illustrative cover concepts, and Maya's supplied portrait (cropped)

## Preview locally

Open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser. (Opening `index.html` directly with `file://` will not load the JSON content because browsers block local fetches.)

## Publish for free and enable editing without code

1. Create a **GitHub** account if you don't have one.
2. Create a new repository, for example `mayas-murder-mysteries-website`. Upload the **contents of this folder** to the root of the repository, including the hidden `.pages.yml` file. The site can be public, but don't commit any secrets or private files.
3. Create a free **Cloudflare** account. In Cloudflare Pages, create a project connected to that GitHub repository.
4. Choose **no framework / static site**, leave the build command blank, and use `.` as the build output directory (the website files are already at the root). Deploy.
5. Your site will have a free `*.pages.dev` address. To add a custom domain later, follow Cloudflare's custom-domain instructions; domain registration costs extra.
6. Open https://app.pagescms.org, sign in with GitHub, authorize the GitHub app for your repository, and select it. The `.pages.yml` file tells the CMS which content you can edit.
7. Edit **Website text & About Maya**, **Murder mystery collection**, **Customer reviews**, **Gallery photos**, or **Frequently asked questions** in Pages CMS. Saving commits the changes to GitHub and triggers a Cloudflare Pages redeploy.

Pages CMS and Cloudflare Pages are separate services. This ZIP does **not** automatically publish the site or connect your accounts. Free-tier terms and setup interfaces may change.

## Adding a new mystery

In Pages CMS → **Murder mystery collection**, add an item with a unique `slug` such as `midnight-at-the-manor`, a title, teaser, image, player count, status, and (when ready) its individual Etsy listing URL. The site automatically displays the new card and creates its detail view at `mystery.html?slug=midnight-at-the-manor`.

The two starter game images are **illustrative artwork**, not photographs of physical kits. Replace them with actual product photography as you create your boxes.

## Important launch checklist

- **One Last Toast is marked as a first release, not available for immediate purchase.** Its individual Etsy listing URL is intentionally blank. When the listing goes live, paste the URL into its `etsy_url` field. Until then, its button opens the Etsy shop homepage.
- The Christmas mystery is a **working-title teaser** and is not presented as a finished product.
- Verify the final player count, game length, what's included, processing time, and shipping policies before selling. The current One Last Toast listing says **10 players including the host**.
- Add only **genuine reviews** and photographs you have permission to publish. `approved` must be `true` for an item to appear publicly.
- Confirm Etsy product descriptions and site details agree.
- Replace illustrative covers with real kit photographs, especially for the featured game.
- Review mobile and desktop layouts before publishing.
- If you decide to add an email newsletter, contact form, analytics, or on-site checkout later, those require additional services and privacy considerations; they are **not** included here.

## Photo and art

`assets/maya-portrait.jpg` is a crop of the photo Maya provided for the About section. The original uploaded photo is not modified. The crest and two game covers are custom typographic SVG concepts created for this prototype.

## Notes for future updates

The site's content is loaded directly from JSON files so no build tool or package installation is required. The Pages CMS `.pages.yml` is provided as a ready-to-connect configuration; live GitHub/Cloudflare/Pages CMS integration has not yet been tested with your accounts.
