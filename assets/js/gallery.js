let galleryImages = [];

const perPage = 4;
let currentPage = 0;
let currentImage = 0;

const grid = document.getElementById("galleryGrid");
const pagination = document.getElementById("galleryPagination");
const lightbox = document.getElementById("galleryLightbox");
const lightboxImage = document.getElementById("galleryLightboxImage");
const counter = document.getElementById("galleryCounter");


/* ==============================
   GALERIE AUS JSON LADEN
================================ */

fetch("data/gallery.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("gallery.json konnte nicht geladen werden.");
        }

        return response.json();
    })
    .then(data => {

        galleryImages = data.gallery;

        renderGallery();
    })
    .catch(error => {

        console.error("Fehler beim Laden der Galerie:", error);

        grid.innerHTML = `
            <p class="col-span-full text-center text-red-600">
                Die Galerie konnte nicht geladen werden.
            </p>
        `;
    });


/* ==============================
   GALERIE
================================ */

function renderGallery() {

    const start = currentPage * perPage;

    const images = galleryImages.slice(
        start,
        start + perPage
    );

    grid.innerHTML = images.map((item, i) => `

        <button
            type="button"
            class="group relative h-64 sm:h-80 overflow-hidden rounded-3xl border-2 border-sand-200 bg-white shadow-sm hover:shadow-xl transition"
            onclick="openLightbox(${start + i})">

            <img
                src="${item.image}"
                alt="${item.title}"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">

            <span
                class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition">

                <span
                    class="opacity-0 group-hover:opacity-100 w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-2xl shadow-lg">

                    ⛶

                </span>

            </span>

        </button>

    `).join("");

    renderPagination();
}


/* ==============================
   PAGINATION
================================ */

function renderPagination() {

    const pages = Math.ceil(
        galleryImages.length / perPage
    );

    if (pages <= 1) {

        pagination.innerHTML = "";

        return;
    }

    pagination.innerHTML = `

        <button
            type="button"
            onclick="previousPage()"
            ${currentPage === 0 ? "disabled" : ""}
            class="px-5 py-2.5 rounded-full border border-sand-300 bg-white disabled:opacity-40">

            ← Zurück

        </button>

        <span class="px-4 text-sm">
            Seite ${currentPage + 1} von ${pages}
        </span>

        <button
            type="button"
            onclick="nextPage()"
            ${currentPage === pages - 1 ? "disabled" : ""}
            class="px-5 py-2.5 rounded-full border border-sand-300 bg-white disabled:opacity-40">

            Weiter →

        </button>
    `;
}


function nextPage() {

    const pages = Math.ceil(
        galleryImages.length / perPage
    );

    if (currentPage < pages - 1) {

        currentPage++;

        renderGallery();
    }
}


function previousPage() {

    if (currentPage > 0) {

        currentPage--;

        renderGallery();
    }
}


/* ==============================
   LIGHTBOX
================================ */

function openLightbox(index) {

    currentImage = index;

    updateLightbox();

    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");

    document.body.classList.add("overflow-hidden");
}


function closeLightbox() {

    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");

    document.body.classList.remove("overflow-hidden");
}


function updateLightbox() {

    const item = galleryImages[currentImage];

    lightboxImage.src = item.image;

    lightboxImage.alt = item.title;

    counter.textContent =
        `${currentImage + 1} / ${galleryImages.length}`;
}


function nextImage() {

    currentImage =
        (currentImage + 1) %
        galleryImages.length;

    updateLightbox();
}


function previousImage() {

    currentImage =
        (currentImage - 1 +
        galleryImages.length) %
        galleryImages.length;

    updateLightbox();
}


/* ==============================
   BUTTONS
================================ */

document.getElementById("galleryClose")
    .onclick = closeLightbox;

document.getElementById("galleryNext")
    .onclick = nextImage;

document.getElementById("galleryPrev")
    .onclick = previousImage;


/* ==============================
   LIGHTBOX AUSSERHALB KLICKEN
================================ */

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {

        closeLightbox();

    }

});


/* ==============================
   TASTATUR
================================ */

document.addEventListener("keydown", (event) => {

    if (lightbox.classList.contains("hidden")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        nextImage();
    }

    if (event.key === "ArrowLeft") {
        previousImage();
    }

});