## Cation Identification Expert System

This is a small rule‑based web app that helps identify likely cations from simple qualitative analysis tests (solution color, flame test, NaOH / NH₃ precipitates, etc.).

### How it works

- **Input**: The technician selects observed results from common tests:
  - Color of the solution
  - Flame test color
  - Precipitate with NaOH (few drops) and behavior in excess
  - Precipitate with aqueous NH₃ (few drops) and behavior in excess
  - Sulfide (H₂S) test, and a few other simple checks
- **Engine**: A rule‑based matcher in `app.js` compares the pattern of observations to stored qualitative patterns for each cation and assigns a match score.
- **Output**: The UI shows:
  - The most likely cation
  - Up to two alternative candidates
  - An approximate match percentage and short reasoning notes

Currently modelled cations include: Na⁺, K⁺, Ca²⁺, Ba²⁺, Cu²⁺, Fe²⁺, Fe³⁺, Zn²⁺, Al³⁺, and NH₄⁺.

> **Important**: This tool is for educational support only. Always confirm results using your full qualitative analysis scheme and institutional protocols.

### Running locally

This is a static site (no backend). You can run it in two ways:

**Option 1 – Open directly**

1. Download or clone the repo.
2. Open `index.html` in your browser.

**Option 2 – Simple local server (recommended for development)**

```bash
cd Chemsense
python -m http.server 8000
```

Then open `http://localhost:8000/index.html` in your browser.

### Deploying with GitHub Pages

1. Push `main` to GitHub.
2. In the repo on GitHub, go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Select **Branch**: `main`, **Folder**: `/ (root)`, then **Save**.
5. After a short build, your site will be live at  
   `https://<your-username>.github.io/<repository-name>/`.

