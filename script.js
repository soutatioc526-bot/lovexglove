const header = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll(".top-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const scrollToRequestedSection = () => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("section");
  const selector = requested ? `#${requested}` : window.location.hash;
  if (!selector) return;
  const target = document.querySelector(selector);
  if (target) {
    window.setTimeout(() => target.scrollIntoView({ block: "start" }), 120);
  }
};

window.addEventListener("load", scrollToRequestedSection);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => {
      item.classList.toggle("is-active", item === link);
    });

    window.setTimeout(() => link.blur(), 80);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: [0.1, 0.25, 0.5],
  }
);

sections.forEach((section) => navObserver.observe(section));

const hero = document.querySelector(".hero");
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const heroDots = Array.from(document.querySelectorAll(".hero-dot"));
let heroIndex = 0;
let heroTimer = null;

const setHeroSlide = (index) => {
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === heroIndex);
  });
  heroDots.forEach((dot, dotIndex) => {
    const active = dotIndex === heroIndex;
    dot.classList.toggle("is-active", active);
    dot.toggleAttribute("aria-current", active);
  });
};

const startHeroTimer = () => {
  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(() => setHeroSlide(heroIndex + 1), 5200);
};

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setHeroSlide(Number(dot.dataset.slide));
    startHeroTimer();
  });
});

let heroStartX = 0;
let heroTracking = false;

hero.addEventListener(
  "pointerdown",
  (event) => {
    heroTracking = true;
    heroStartX = event.clientX;
  },
  { passive: true }
);

hero.addEventListener(
  "pointerup",
  (event) => {
    if (!heroTracking) return;
    const distance = event.clientX - heroStartX;
    heroTracking = false;
    if (Math.abs(distance) < 48) return;
    setHeroSlide(distance < 0 ? heroIndex + 1 : heroIndex - 1);
    startHeroTimer();
  },
  { passive: true }
);

startHeroTimer();

const dayTrack = document.querySelector(".day-track");
const dayTabs = Array.from(document.querySelectorAll(".day-tab"));
const dayPages = Array.from(document.querySelectorAll(".day-page"));

const setActiveDay = (index) => {
  dayTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  dayPages.forEach((page, pageIndex) => {
    const active = pageIndex === index;
    page.classList.toggle("is-active", active);
    page.hidden = !active;
  });
};

dayTabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveDay(Number(tab.dataset.day)));
});

if (dayTrack && dayTabs.length && dayPages.length) {
  setActiveDay(0);
}

const contentTabs = Array.from(document.querySelectorAll(".content-tab"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));

contentTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    contentTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    tabPanels.forEach((panel) => {
      const active = panel.dataset.panel === target;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  });
});

const stayTabs = Array.from(document.querySelectorAll(".stay-tab"));
const stayPanels = Array.from(document.querySelectorAll(".hotel-panel"));

stayTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.stay;

    stayTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    stayPanels.forEach((panel) => {
      const active = panel.dataset.stayPanel === target;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  });
});

const splitGalleries = Array.from(document.querySelectorAll(".split-gallery"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

splitGalleries.forEach((gallery) => {
  const images = Array.from(gallery.querySelectorAll("img"));
  if (images.length < 2) return;

  let galleryIndex = 0;
  images.forEach((image, imageIndex) => {
    image.classList.toggle("is-active", imageIndex === galleryIndex);
  });

  if (reduceMotion) return;

  window.setInterval(() => {
    galleryIndex = (galleryIndex + 1) % images.length;
    images.forEach((image, imageIndex) => {
      image.classList.toggle("is-active", imageIndex === galleryIndex);
    });
  }, 4200);
});

const xgAlbumMount = document.querySelector("[data-xg-albums]");
const xgAlbums = [
  {
    name: "THE CORE - 核",
    release: "2026.01.23",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d2/40/bc/d240bc00-1056-57c1-3ec8-cd57f957bcaf/4571694810689.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/the-core-%E6%A0%B8/1861009513",
    tracks: ["XIGNAL (The Intro)", "GALA", "ROCK THE BOAT", "TAKE MY BREATH", "NO GOOD", "HYPNOTIZE", "UP NOW", "O.R.B (Obviously Reads Bro)", "4 SEASONS", "PS118"],
  },
  {
    name: "GALA - Single",
    release: "2025.09.19",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e3/be/23/e3be237a-6ed1-ff76-6a65-cc3b34bc2bdc/4571694821449.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/gala-single/1869772966",
    tracks: ["GALA", "GALA (Instrumental)"],
  },
  {
    name: "XG 1st WORLD TOUR “The first HOWL\" Live",
    release: "2025.08.08",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/91/6f/ea/916fea5a-9d96-ed2b-0c1c-afffe39d823b/ANTCD-A0000017661.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/xg-1st-world-tour-the-first-howl-live/1831297909",
    tracks: ["X-GENE (HESONOO) [Live]", "HOWLING & GRL GVNG [Live]", "UNDEFEATED [Live]", "TGIF & IYKYK [Live]", "Tippy Toes & SOMETHING AIN'T RIGHT & IN THE RAIN [Live]", "SHOOTING STAR [Live]", "WOKE UP [Live]", "PUPPET SHOW [Live]", "IS THIS LOVE [Live]", "NEW DANCE [Live]", "MILLION PLACES [Live]", "WINTER WITHOUT YOU & MASCARA [Live]", "LEFT RIGHT [Live]"],
  },
  {
    name: "MILLION PLACES - Single",
    release: "2025.05.14",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/29/47/6329477b-eab4-be29-564f-d03eb337fe72/ANTCD-A0000016665.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/million-places-single/1811554707",
    tracks: ["MILLION PLACES", "LEFT RIGHT (Y2K Ver.)", "PUPPET SHOW (City Pop Ver.) [Live]", "MILLION PLACES (Instrumental)"],
  },
  {
    name: "IN THE RAIN - Single",
    release: "2025.04.11",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/76/48/d0/7648d0c1-de88-1bf4-4b47-70e2e755ce99/ANTCD-A0000016489.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/in-the-rain-single/1804320421",
    tracks: ["IN THE RAIN", "IN THE RAIN x XDM", "IN THE RAIN (Instrumental)"],
  },
  {
    name: "IS THIS LOVE - EP",
    release: "2025.03.07",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5f/80/3d/5f803d42-1e4f-e996-55a5-dd85f931cbc4/ANTCD-A0000016206.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/is-this-love-ep/1799016410",
    tracks: ["IS THIS LOVE", "IS THIS LOVE (Piano Ver.)", "IS THIS LOVE (Instrumental)", "IS THIS LOVE (Piano Ver.) [Instrumental]"],
  },
  {
    name: "XDM Unidentified Waves",
    release: "2025.01.31",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/9e/ae/e3/9eaee399-85cc-a48e-b306-c9f60393d028/ANTCD-A0000015809.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/xdm-unidentified-waves/1791750109",
    tracks: ["HESONOO + X-GENE x XDM", "GRL GVNG x XDM", "WOKE UP x XDM", "SOMETHING AIN'T RIGHT x XDM", "TGIF x XDM", "PUPPET SHOW x XDM", "TIPPY TOES x XDM", "NEW DANCE x XDM"],
  },
  {
    name: "WINTER WITHOUT YOU -Orchestra ver.- - Single",
    release: "2024.12.13",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/40/82/39/40823973-309b-4235-0a80-8e811feba667/ANTCD-A0000015464.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/winter-without-you-orchestra-ver-single/1784859957",
    tracks: ["WINTER WITHOUT YOU -Orchestra ver.-", "WINTER WITHOUT YOU -Orchestra ver.- (Instrumental)"],
  },
  {
    name: "AWE",
    release: "2024.11.08",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ae/69/ce/ae69ce7b-6007-c83a-f692-93ebfca55449/ANTCD-A0000014930.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/awe/1775445626",
    tracks: ["HOWL", "HOWLING", "SPACE MEETING Skit", "IYKYK", "SOMETHING AIN'T RIGHT", "IN THE RAIN", "WOKE UP REMIXX", "IS THIS LOVE"],
  },
  {
    name: "IYKYK - Single",
    release: "2024.10.11",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/08/9a/32/089a323b-89e4-abca-a17a-fb0e69c3cefc/ANTCD-A0000014794.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/iykyk-single/1770737895",
    tracks: ["IYKYK"],
  },
  {
    name: "WOKE UP REMIXX (PROD BY JAKOPS) - EP",
    release: "2024.09.20",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a8/6b/d3/a86bd3d1-a6d5-7ec5-7f92-7fa0834f7b72/ANTCD-A0000014652.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/woke-up-remixx-prod-by-jakops-ep/1768000816",
    tracks: ["INTRO", "WOKE UP REMIXX", "WOKE UP REMIXX (Acapella)", "WOKE UP REMIXX (Instrumental)"],
  },
  {
    name: "SOMETHING AIN'T RIGHT - Single",
    release: "2024.07.26",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/75/82/ea/7582eab4-bc79-a418-3909-457d34779d91/ANTCD-A0000014081.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/something-aint-right-single/1757581943",
    tracks: ["SOMETHING AIN'T RIGHT"],
  },
  {
    name: "WOKE UP - Single",
    release: "2024.05.21",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6b/54/bc/6b54bc75-1878-ae18-3269-e896d64cc08b/ANTCD-A0000013306.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/woke-up-single/1742262122",
    tracks: ["WOKE UP"],
  },
  {
    name: "UNDEFEATED - Single",
    release: "2024.04.12",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/86/92/fc/8692fc7b-d845-be35-3466-d5e8fb5f87bb/ANTCD-A0000012895.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/undefeated-single/1737281141",
    tracks: ["UNDEFEATED"],
  },
  {
    name: "WINTER WITHOUT YOU - Single",
    release: "2023.12.08",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/85/95/e4/8595e4d3-4510-7066-ad85-040fc03232e1/ANTCD-A0000012046.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/winter-without-you-single/1717738434",
    tracks: ["WINTER WITHOUT YOU"],
  },
  {
    name: "NEW DNA (Apple Music Edition) - EP",
    release: "2023.09.27",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/9e/a5/4f/9ea54f4c-3d87-eae0-bee8-f9d1d7ef51e5/ANTCD-A0000011283.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/new-dna-apple-music-edition-ep/1703356590",
    tracks: ["HESONOO", "X-GENE", "GRL GVNG", "TGIF", "NEW DANCE", "PUPPET SHOW", "Up Next: XG (Exclusive)"],
  },
  {
    name: "TGIF - Single",
    release: "2023.08.04",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b0/9d/87/b09d87ca-a8b3-34b2-f05f-e33e8911097d/ANTCD-A0000011166.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/tgif-single/1700176159",
    tracks: ["TGIF"],
  },
  {
    name: "GRL GVNG - Single",
    release: "2023.06.30",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/2a/df/2e/2adf2e56-a30a-d7a8-6a3a-d72e3c47e8e7/ANTCD-A0000010570.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/grl-gvng-single/1692289010",
    tracks: ["GRL GVNG"],
  },
  {
    name: "LEFT RIGHT REMIXX - Single",
    release: "2023.05.05",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/27/b4/95/27b495de-2103-94b2-2297-c251bcde1a2c/ANTCD-A0000010191.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/left-right-remixx-feat-ciara-jackson-wang-prod-by-jakops/1684959222",
    tracks: ["LEFT RIGHT REMIXX (FEAT. CIARA & JACKSON WANG)"],
  },
  {
    name: "SHOOTING STAR REMIXX - Single",
    release: "2023.04.07",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2d/9e/6d/2d9e6d27-b309-089c-9172-cc54f04530ce/ANTCD-A0000009958.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/shooting-star-remixx-prod-by-jakops-single/1680869071",
    tracks: ["SHOOTING STAR (BARS REMIXX FEAT. RICO NASTY)", "SHOOTING STAR (CHILL REMIXX)"],
  },
  {
    name: "SHOOTING STAR - Single",
    release: "2023.01.25",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/f8/4c/0a/f84c0abd-7bab-12ae-d7f0-0e8a9ad8079a/ANTCD-A0000009111.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/shooting-star-single/1660487903",
    tracks: ["SHOOTING STAR", "LEFT RIGHT"],
  },
  {
    name: "MASCARA - Single",
    release: "2022.06.29",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b3/83/c1/b383c1eb-a2aa-0bb1-c77f-b9fef0d19e68/ANTCD-A0000007238.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/mascara-single/1624618716",
    tracks: ["MASCARA"],
  },
  {
    name: "Tippy Toes - Single",
    release: "2022.03.18",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b8/5a/f6/b85af686-80fa-6dc5-9cfd-cb2681c43f67/ANTCD-A0000005398.jpg/600x600bb.jpg",
    url: "https://music.apple.com/us/album/tippy-toes-single/1609402380",
    tracks: ["Tippy Toes"],
  },
];

const makeText = (tag, text, className) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
};

if (xgAlbumMount) {
  xgAlbums.forEach((album) => {
    const card = document.createElement("article");
    card.className = "album-card";

    const cover = document.createElement("img");
    const coverSize = window.matchMedia("(max-width: 680px)").matches ? "240x240bb" : "480x480bb";
    cover.src = album.cover.replace(/\/600x600bb\.jpg$/, `/${coverSize}.jpg`);
    cover.alt = `${album.name} cover`;
    cover.loading = "lazy";
    cover.decoding = "async";
    cover.width = 112;
    cover.height = 112;

    const body = document.createElement("div");
    body.className = "album-body";
    body.append(makeText("p", album.release, "album-date"));
    body.append(makeText("h4", album.name));

    const listen = document.createElement("a");
    listen.className = "album-link";
    listen.href = album.url;
    listen.target = "_blank";
    listen.rel = "noopener";
    listen.textContent = "Apple Music";
    body.append(listen);

    const trackList = document.createElement("div");
    trackList.className = "track-list";
    album.tracks.forEach((track, index) => {
      trackList.append(makeText("p", `${String(index + 1).padStart(2, "0")} ${track}`, "track-row"));
    });

    body.append(trackList);
    card.append(cover, body);
    xgAlbumMount.append(card);
  });
}

const concertSlides = Array.from(document.querySelectorAll(".concert-slide"));
const concertDots = Array.from(document.querySelectorAll(".concert-dot"));
let concertIndex = 0;
let concertTimer = null;

const setConcertSlide = (index) => {
  if (!concertSlides.length) return;
  concertIndex = (index + concertSlides.length) % concertSlides.length;
  concertSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === concertIndex);
  });
  concertDots.forEach((dot, dotIndex) => {
    const active = dotIndex === concertIndex;
    dot.classList.toggle("is-active", active);
    dot.toggleAttribute("aria-current", active);
  });
};

const startConcertTimer = () => {
  if (!concertSlides.length) return;
  window.clearInterval(concertTimer);
  concertTimer = window.setInterval(() => setConcertSlide(concertIndex + 1), 5600);
};

concertDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setConcertSlide(Number(dot.dataset.concertSlide));
    startConcertTimer();
  });
});

startConcertTimer();
