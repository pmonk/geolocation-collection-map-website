# Geolocation Collection Map - Template Guide

This folder contains genericized template files for creating an interactive, geolocation-based collection map for artworks, projects, or any location-tagged items.

## What's Included

- **index.html** - Main HTML template with modals and interactive interface
- **main.js** - JavaScript logic for map interactions, filtering, and tours
- **styles.css** - Complete styling (dark theme, responsive design)
- **alt-styles.css** - Alternate light‑theme stylesheet
- **data.json** - Data structure template with examples
- **README.md** - This file

## Quick Start

1. **Customize HTML** - Open `index.html` and replace placeholders:
   - `[YOUR_TITLE]` - Page title (e.g., "Infrastructure Project")
   - `[YOUR_COLLECTION_NAME]` - Collection display name
   - `[YOUR_NAME]` - Your name or artist name
   - `[YOUR_PORTFOLIO_URL]` - Link to your portfolio
   - `[YOUR_ARTIST_STATEMENT_HERE]` - Your artist/project statement

2. **Prepare Data** - Create or replace `data.json` with your items:
   - Follow the structure in the template
   - Each item needs: `id`, `title`, `location` (lat/lng/address), `year`, `medium`, `description`, `tags`
   - Image paths should point to your `images/` directory

3. **Add Images** - Create folder structure:
   ```
   images/
   ├── full/
   │   ├── item_001.jpg
   │   └── item_002.jpg
   └── thumbnails/
       ├── item_001.jpg
       └── item_002.jpg
   ```

4. **Customize Styling** (optional):
   - Edit color values in `styles.css` (marked with `===== CUSTOMIZE =====`).
   - To use the light theme instead, swap the stylesheet reference in `index.html`:
     ```html
     <link rel="stylesheet" href="styles.css">
     <!-- change to -->
     <link rel="stylesheet" href="alt-styles.css">
     ```
   - Main colors to customize in the dark theme:
     - `#0b0c10` - Background
     - `#f5f5f5` - Text
     - `#5B9FFF` - Link color
     - `#ffd166` - Accent color
     - `#ff3333` - Close button color
   - Light-theme primary colors (used in `alt-styles.css`):
     - `#f8f9fa` - Background
     - `#212529` - Text
     - `#0056b3` - Link color
     - `#ffaa00` - Accent color
     - `#dc3545` - Close button color

## Data Structure Details

```json
{
  "id": "unique_id",              // Unique identifier for the item
  "title": "Item Title",          // Display title
  "location": {
    "lat": 30.2672,              // Latitude coordinate
    "lng": -97.7431,             // Longitude coordinate
    "address": "City, State"      // Human-readable address
  },
  "image": {
    "thumbnail": "path/to/thumb.jpg",  // Small preview image
    "full": "path/to/full.jpg"         // Full-size image for modal
  },
  "year": 2024,                   // Year of creation
  "medium": "Oil on Canvas",      // Medium/technique
  "dimensions": "12 × 16 in",     // Size (optional)
  "description": "Description...", // Detailed description
  "tags": ["tag1", "tag2"]        // Searchable tags
}
```

## Features

### Map Integration
- **Leaflet.js** - OpenStreetMap based interactive mapping
- Markers show items by location
- Click markers or list items to focus on that location

### Filtering
- Filter by **year** using dropdown (auto-populated from data)
- Filter by **tags** using text input (case-insensitive)
- Filters apply to both map and sidebar list

### Tour Mode
- **Start Tour** - Begin chronological tour of works (sorted by year, then title)
- **Prev/Next** - Navigate through tour
- Updates map and reveals item in sidebar
- Announces changes to screen readers

### Modals
- **Image Modal** - Click any image in popup to view fullscreen
- **Statement Modal** - Click "Statement" link in header
- Includes focus management and keyboard controls (ESC to close)

### Accessibility
- WCAG compliant colors
- Skip link for keyboard navigation
- Focus management in modals
- ARIA labels and live regions for screen readers
- Keyboard navigation: Tab through items, Enter/Space to open

### Responsive Design
- Desktop: 2-column layout (map + sidebar)
- Mobile: Single column, horizontal filter buttons
- Touch-friendly interface

## Customization Tips

### Change Map Center & Zoom
Edit these lines in `main.js`:
```javascript
const map = L.map("map").setView([30.2672, -97.7431], 11);
//                           ↑ latitude ↑ longitude  ↑ zoom level
```

### Change Data File Name
In `main.js`, update:
```javascript
const DATA_FILE = "data.json";  // Change to your filename
```

### Customize Filter Labels
In `index.html`, change placeholder text in filter groups:
```html
<input id="filter-tag" placeholder="e.g. bridge, substation, rail" />
```

### Add More Metadata
Edit `renderList()` in `main.js` to display additional fields from your data

### Disable Tour Feature
Remove or comment out the tour button section in `index.html`:
```html
<!-- <div id="tour-controls"> ... </div> -->
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Mobile browsers supported

## Dependencies

- **Leaflet.js** (v1.9.4) - Loaded from CDN
- **OpenStreetMap** - Map tiles (attribution included)

No build step required—serve files directly or use with any static host.

## File Sizes & Performance

- Lightweight: ~15KB total (HTML + CSS + JS)
- Images are largest component - optimize for web
- Lazy loading not included; consider adding for large datasets (100+ items)

## Troubleshooting

### Map not showing
- Check browser console (F12) for errors
- Verify Leaflet CDN is accessible
- Ensure `data.json` is in same directory or correct path

### Images not loading
- Check image paths in `data.json`
- Verify `images/` folder structure
- Use relative paths (e.g., `images/full/item_001.jpg`)

### Filtering not working
- Ensure year values are numbers in JSON
- Tags must be lowercase in filter input
- Check browser console for JSON parse errors

### Modal not closing
- Press ESC key
- Click outside the modal
- Check for JavaScript errors in console

## License & Attribution

- Leaflet: BSD 2-Clause License
- OpenStreetMap: ODbL 1.0

## Next Steps

1. Copy files to your project directory
2. Update `data.json` with your items
3. Organize images in folder structure
4. Customize HTML placeholders
5. Test locally with `python -m http.server` or similar
6. Deploy to web host

---

For questions or improvements, refer to Leaflet documentation:
https://leafletjs.com/
