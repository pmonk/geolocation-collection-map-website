// Initialize map centered at a default location (modify as needed)
const map = L.map("map").setView([30.2672, -97.7431], 11);

// Add OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const markersById = new Map();
let allArtworks = [];

// Filter DOM references
const yearSelect = document.getElementById("filter-year");
const tagInput = document.getElementById("filter-tag");

// Tour globals
let tourIndex = -1;
let tourActive = false;

const tourStartBtn = document.getElementById("tour-start");
const tourPrevBtn = document.getElementById("tour-prev");
const tourNextBtn = document.getElementById("tour-next");

// ===== CONFIGURATION =====
// Replace 'data.json' with your data file name
const DATA_FILE = "data.json";

// Fetch and initialize
fetch(DATA_FILE)
  .then((response) => response.json())
  .then((artworks) => {
    allArtworks = artworks;
    createMarkers(artworks);
    populateYearFilter(artworks);
    renderList(artworks);
    attachFilterListeners();
  })
  .catch((err) => {
    console.error(`Error loading ${DATA_FILE}`, err);
  });

// ===== MARKER CREATION =====
// Creates a marker for each item with a popup showing image and details
function createMarkers(artworks) {
  artworks.forEach((art) => {
    const marker = L.marker([art.location.lat, art.location.lng]).addTo(map);

    const popupHtml = `
      <div class="popup">
        <strong>${art.title}</strong><br/>
        <span>${art.location.address}</span><br/>
        ${
          art.image && art.image.thumbnail
            ? `<img src="${art.image.thumbnail}" alt="${art.title}" style="width: 160px; margin-top: 0.5rem;" />`
            : ""
        }
        ${
          art.year
            ? `<div style="margin-top:0.25rem; font-size:0.8rem; opacity:0.8;">${art.year} · ${art.medium || ""}</div>`
            : ""
        }
      </div>
    `;

    marker.bindPopup(popupHtml);
    markersById.set(art.id, marker);
  });
}

// ===== FILTER INITIALIZATION =====
// Populates year dropdown with unique years from data
function populateYearFilter(artworks) {
  const years = Array.from(
    new Set(artworks.map((a) => a.year).filter(Boolean))
  ).sort();

  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = year;
    yearSelect.appendChild(option);
  });
}

// Attach listeners to filter controls and tour buttons
function attachFilterListeners() {
  yearSelect.addEventListener("change", applyFilters);
  tagInput.addEventListener("input", applyFilters);

  tourStartBtn.addEventListener("click", startTour);
  tourPrevBtn.addEventListener("click", () => stepTour(-1));
  tourNextBtn.addEventListener("click", () => stepTour(1));
}

// ===== FILTERING =====
// Apply year and tag filters to both markers and list
function applyFilters() {
  const yearValue = yearSelect.value;
  const tagValue = tagInput.value.toLowerCase().trim();

  const filtered = allArtworks.filter((art) => {
    let matchesYear =
      yearValue === "all" || String(art.year) === String(yearValue);

    let matchesTag = true;
    if (tagValue) {
      const tags = (art.tags || []).join(" ").toLowerCase();
      matchesTag = tags.includes(tagValue);
    }

    return matchesYear && matchesTag;
  });

  updateMarkersVisibility(filtered);
  renderList(filtered);
}

// Update which markers are shown/hidden on the map
function updateMarkersVisibility(visibleArtworks) {
  const visibleIds = new Set(visibleArtworks.map((a) => a.id));

  allArtworks.forEach((art) => {
    const marker = markersById.get(art.id);
    if (!marker) return;

    if (visibleIds.has(art.id)) {
      if (!map.hasLayer(marker)) {
        marker.addTo(map);
      }
    } else {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    }
  });
}

// ===== LIST RENDERING =====
// Render sidebar list with artwork details
function renderList(artworks) {
  const list = document.getElementById("artwork-list");
  list.innerHTML = "";

  artworks.forEach((art) => {
    const li = document.createElement("li");
    li.dataset.id = art.id;

    const tagsString = (art.tags || []).join(", ");

    li.innerHTML = `
      <div class="artwork-title">${art.title}</div>
      ${
        art.location && art.location.address
          ? `<div class="artwork-meta">${art.location.address}</div>`
          : ""
      }
      ${
        art.year
          ? `<div class="artwork-meta">${art.year}${
              art.medium ? " · " + art.medium : ""
            }</div>`
          : ""
      }
      ${
        tagsString
          ? `<div class="artwork-tags">${tagsString}</div>`
          : ""
      }
    `;

    const openArtwork = () => {
      const marker = markersById.get(art.id);
      if (marker) {
        map.flyTo(marker.getLatLng(), 14, { duration: 0.6 });
        marker.openPopup();
      }
    };

    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.addEventListener("click", openArtwork);
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openArtwork();
      }
    });

    list.appendChild(li);
  });
}

// ===== TOUR FUNCTIONALITY =====
// Get sorted sequence of all artworks for tour
function getTourSequence() {
  const base = [...allArtworks];

  base.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.title.localeCompare(b.title);
  });

  return base;
}

// Start the tour from the beginning
function startTour() {
  if (!allArtworks.length) return;

  tourActive = true;
  tourIndex = 0;
  const sequence = getTourSequence();
  focusOnArtwork(sequence[tourIndex]);
  updateTourButtons(sequence.length);
}

// Step through tour in either direction
function stepTour(direction) {
  if (!tourActive) return;

  const sequence = getTourSequence();
  const lastIndex = sequence.length - 1;

  tourIndex = Math.min(Math.max(tourIndex + direction, 0), lastIndex);
  focusOnArtwork(sequence[tourIndex]);
  updateTourButtons(sequence.length);
}

// Focus on a specific artwork and update tour status
function focusOnArtwork(art) {
  const marker = markersById.get(art.id);
  if (marker) {
    if (!map.hasLayer(marker)) {
      marker.addTo(map);
    }
    map.flyTo(marker.getLatLng(), 14, { duration: 0.8 });
    marker.openPopup();
  }

  const listItem = document.querySelector(
    `#artwork-list li[data-id="${art.id}"]`
  );
  if (listItem) {
    listItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  
  // Announce tour change to screen readers
  const tourStatus = document.getElementById('tour-status');
  if (tourStatus) {
    const sequence = getTourSequence();
    const currentIndex = sequence.findIndex(a => a.id === art.id);
    tourStatus.textContent = `Showing ${currentIndex + 1} of ${sequence.length}: ${art.title}`;
  }
}

// Update tour button states based on position
function updateTourButtons(length) {
  tourPrevBtn.disabled = tourIndex <= 0;
  tourNextBtn.disabled = tourIndex >= length - 1;
  tourStartBtn.textContent = tourActive ? "Restart Tour" : "Start Tour";
}
