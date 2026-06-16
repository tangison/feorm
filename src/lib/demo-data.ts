/**
 * Feorm Demo Data — Simulated Backend
 *
 * All data is hardcoded for the demo. No Supabase, no auth.
 * Each listing has multiple images for a realistic gallery experience.
 */

// ─── Types ────────────────────────────────────────────────────
export interface DemoListing {
  id: string;
  title: string;
  region: string;
  price: number;
  type: string;
  category: string;
  description: string;
  images: string[];
  features: string[];
  hostId: string;
  hostName: string;
  hostPhone: string;
  available: boolean;
  lat: number | null;
  lng: number | null;
  rating: number;
  reviewCount: number;
}

export interface DemoBooking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  guestName: string;
  startDate: string;
  endDate: string;
  totalCents: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  reference: string;
}

export interface DemoUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  region: string;
  role: "guest" | "voyager" | "provider_stay" | "admin";
  verified: boolean;
  avatarUrl: string;
}

// ─── Mock Users ───────────────────────────────────────────────
export const DEMO_FARMER: DemoUser = {
  id: "demo-farmer-001",
  name: "Amara",
  surname: "Hoeses",
  email: "amara@feorm.demo",
  phone: "+264 81 234 5678",
  region: "Khomas",
  role: "provider_stay",
  verified: true,
  avatarUrl: "/avatars/amara.svg",
};

export const DEMO_GUEST: DemoUser = {
  id: "demo-guest-001",
  name: "Tandi",
  surname: "Nujoma",
  email: "tandi@feorm.demo",
  phone: "+264 85 678 9012",
  region: "Windhoek",
  role: "voyager",
  verified: true,
  avatarUrl: "/avatars/tandi.svg",
};

// ─── Listings with Multiple Images ────────────────────────────
export const DEMO_LISTINGS: DemoListing[] = [
  {
    id: "listing-001",
    title: "Erongo Granite Lodge",
    region: "Erongo",
    price: 85000,
    type: "stay",
    category: "stay",
    description: "Wake up to granite boulders glowing pink at dawn. This lodge sits among ancient rock formations where the desert meets the mountains — a place that makes you forget your phone exists. Three private stone chalets, each with an outdoor shower and a view that stretches to the coast on clear days. The host, a third-generation farmer, knows every trail by heart and leads sunrise walks to a lookout point most guests never find on their own.",
    images: [
      "/images/listings/stays/stay-listing-01.jpg",
      "/images/listings/stays/stay-listing-13.jpg",
      "/images/listings/stays/stay-listing-07.jpg",
      "/images/listings/stays/stay-listing-11.jpg",
    ],
    features: ["Outdoor Shower", "Mountain View", "Guided Hikes", "Stone Chalet", "Breakfast Included"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -22.5609,
    lng: 15.0869,
    rating: 4.9,
    reviewCount: 47,
  },
  {
    id: "listing-002",
    title: "Kunene Desert Pasture Camp",
    region: "Kunene",
    price: 72000,
    type: "stay",
    category: "stay",
    description: "Sleep under the clearest sky you have ever seen. This camp sits on the edge of the Kunene River basin, where the land shifts from red dune to green riverbank in a single glance. Four canvas tents on raised wooden platforms, each with a private deck facing the river valley. The host runs a working goat farm — guests are welcome to join the morning herd walk through the dunes.",
    images: [
      "/images/listings/stays/stay-listing-02.jpg",
      "/images/listings/stays/stay-listing-03.jpg",
      "/images/listings/stays/stay-listing-09.jpg",
    ],
    features: ["Canvas Tent", "River Valley View", "Goat Herd Walk", "Star Gazing", "Fire Pit"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -18.0754,
    lng: 13.8432,
    rating: 4.8,
    reviewCount: 31,
  },
  {
    id: "listing-003",
    title: "Otjozondjupa Bushveld Station",
    region: "Otjozondjupa",
    price: 68000,
    type: "stay",
    category: "stay",
    description: "Where the bushveld opens wide and the horizon runs flat for a hundred kilometres. This cattle station offers two self-catering rondavels with thatched roofs, a braai area under an ancient leadwood tree, and a swimming dam that catches the afternoon light. The host family has ranched this land since the 1950s and the walls of the main house tell the story in black-and-white photographs.",
    images: [
      "/images/listings/stays/stay-listing-03.jpg",
      "/images/listings/stays/stay-listing-05.jpg",
      "/images/listings/stays/stay-listing-09.jpg",
      "/images/listings/stays/stay-listing-13.jpg",
      "/images/listings/stays/stay-listing-07.jpg",
    ],
    features: ["Self-Catering", "Rondavel", "Braai Area", "Swimming Dam", "Cattle Ranch"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -20.4554,
    lng: 17.5348,
    rating: 4.7,
    reviewCount: 22,
  },
  {
    id: "listing-004",
    title: "Hardap Kalahari Goat Station",
    region: "Hardap",
    price: 54000,
    type: "stay",
    category: "stay",
    description: "Red sand, blue sky, and the gentle sound of goats at dusk. This working goat station in the Kalahari fringe offers a simple stone cottage with a shaded patio and a fire pit for evening stories. The host serves fresh chevre with homemade bread each morning. Hike the red dunes at sunrise or spend the afternoon watching the farm dogs herd goats across the pan.",
    images: [
      "/images/listings/stays/stay-listing-04.jpg",
      "/images/listings/stays/stay-listing-05.jpg",
      "/images/listings/stays/stay-listing-11.jpg",
    ],
    features: ["Stone Cottage", "Farm Chevre", "Red Dunes", "Fire Pit", "Goat Herding"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -24.2582,
    lng: 17.6341,
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: "listing-005",
    title: "Oshikoto Cattle Post Retreat",
    region: "Oshikoto",
    price: 47000,
    type: "stay",
    category: "stay",
    description: "A traditional Oshiwambo homestead reimagined for guests who want to experience real northern Namibian farm life. The rondavel guesthouse sits among mahangu fields and marula trees, with a host family that welcomes you into their daily routine — from milking cows at dawn to brewing traditional omalodu beer in the afternoon. No WiFi. No schedule. Just the rhythm of the land.",
    images: [
      "/images/listings/stays/stay-listing-05.jpg",
      "/images/listings/stays/stay-listing-13.jpg",
      "/images/listings/stays/stay-listing-07.jpg",
      "/images/listings/stays/stay-listing-09.jpg",
    ],
    features: ["Traditional Homestead", "Mahangu Fields", "Cultural Experience", "No WiFi", "Marula Trees"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -18.4073,
    lng: 16.0247,
    rating: 4.9,
    reviewCount: 56,
  },
  {
    id: "listing-006",
    title: "Zambezi Riverbank Lodge",
    region: "Zambezi",
    price: 95000,
    type: "stay",
    category: "stay",
    description: "The only Feorm listing where you can hear hippos from your bed. This riverbank lodge in the Caprivi Strip offers elevated wooden chalets with mosquito-netted four-poster beds and private decks over the river. Morning mists rise off the water while fish eagles call from the reeds. The host operates a small mokoro (dugout canoe) for sunset river drifts.",
    images: [
      "/images/listings/stays/stay-listing-06.jpg",
      "/images/listings/stays/stay-listing-03.jpg",
      "/images/listings/stays/stay-listing-07.jpg",
    ],
    features: ["River Deck", "Mokoro Trips", "Hippos", "Four-Poster Bed", "Fish Eagles"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -17.7833,
    lng: 24.1833,
    rating: 5.0,
    reviewCount: 34,
  },
  {
    id: "listing-007",
    title: "Karas Canyon Sheep Farm",
    region: "Karas",
    price: 42000,
    type: "stay",
    category: "stay",
    description: "Where the Fish River carved its canyon and the sheep outnumber people a thousand to one. This Karoo-style farmhouse offers two guest rooms with wool-stuffed mattresses, handwoven karosses, and windows that frame the canyon rim. The host shears his own sheep and spins the wool into rugs you can buy before you leave. Dinner is lamb slow-roasted over coals.",
    images: [
      "/images/listings/stays/stay-listing-07.jpg",
      "/images/listings/stays/stay-listing-05.jpg",
      "/images/listings/stays/stay-listing-11.jpg",
      "/images/listings/stays/stay-listing-13.jpg",
    ],
    features: ["Canyon View", "Sheep Farm", "Handwoven Rugs", "Lamb Dinner", "Karoo Style"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -27.7954,
    lng: 18.8432,
    rating: 4.5,
    reviewCount: 14,
  },
  {
    id: "listing-008",
    title: "Khomas Highland Equestrian Farm",
    region: "Khomas",
    price: 110000,
    type: "stay",
    category: "stay",
    description: "Saddle up and ride into the Khomas Hochland at dawn. This equestrian farm sits at 1,800 metres above sea level where the air is thin, the light is golden, and the trails wind through mountain scrub and dry riverbeds. Stay in the farmhouse guest suite with its cast-iron bath and wraparound stoep. The host breeds desert-adapted horses and matches each rider to the right mount.",
    images: [
      "/images/listings/stays/stay-listing-08.jpg",
      "/images/listings/stays/stay-listing-09.jpg",
      "/images/listings/stays/stay-listing-13.jpg",
    ],
    features: ["Horse Riding", "Mountain Trails", "Cast-Iron Bath", "Desert Horses", "Highland Views"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -22.5597,
    lng: 17.0834,
    rating: 4.8,
    reviewCount: 29,
  },
  {
    id: "listing-009",
    title: "Omaheke Sandveld Tented Camp",
    region: "Omaheke",
    price: 58000,
    type: "stay",
    category: "stay",
    description: "Where the Kalahari sand meets cattle country, this tented camp offers three Meru-style tents with proper beds, solar lighting, and bucket showers filled with hot water each evening. The host is a San tracker who leads walks through the bush, reading the sand like a newspaper — tracks of leopard, honey badger, and springbok all tell their story. Evenings end around the fire with roosterkoek and stargazing.",
    images: [
      "/images/listings/stays/stay-listing-09.jpg",
      "/images/listings/stays/stay-listing-03.jpg",
      "/images/listings/stays/stay-listing-05.jpg",
      "/images/listings/stays/stay-listing-07.jpg",
    ],
    features: ["San Tracking", "Tented Camp", "Solar Lighting", "Bucket Shower", "Star Gazing"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -22.0500,
    lng: 19.5000,
    rating: 4.7,
    reviewCount: 21,
  },
  {
    id: "listing-010",
    title: "Ohangwena Millet Farm Stay",
    region: "Ohangwena",
    price: 38000,
    type: "stay",
    category: "stay",
    description: "A working pearl millet farm in the lush north where the rain falls generously and the fields glow green. Guests stay in a renovated traditional compound with painted walls and a thatched lapa for outdoor dining. Join the harvest in March, learn to pound mahangu with a wooden pestle, and eat the best oshifima you will ever taste. The host teaches traditional basket weaving on request.",
    images: [
      "/images/listings/stays/stay-listing-10.jpg",
      "/images/listings/stays/stay-listing-07.jpg",
      "/images/listings/stays/stay-listing-09.jpg",
    ],
    features: ["Millet Farm", "Traditional Compound", "Basket Weaving", "Oshifima", "Green Fields"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -17.5667,
    lng: 16.0333,
    rating: 4.6,
    reviewCount: 16,
  },
  {
    id: "listing-011",
    title: "Omusati Palm Forest Lodge",
    region: "Omusati",
    price: 44000,
    type: "stay",
    category: "stay",
    description: "Built among a stand of wild makalani palms that have stood for centuries, this lodge celebrates the symbiosis of farming and nature. The guesthouse is an open-plan thatch-and-stone building with a central fireplace and wide doors that open to the palm grove. The host presses palm wine in season and serves it chilled with grilled tilapia from the farm dam.",
    images: [
      "/images/listings/stays/stay-listing-11.jpg",
      "/images/listings/stays/stay-listing-13.jpg",
      "/images/listings/stays/stay-listing-09.jpg",
    ],
    features: ["Makalani Palms", "Palm Wine", "Tilapia Dam", "Thatch Lodge", "Open Fireplace"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -18.4000,
    lng: 15.2667,
    rating: 4.8,
    reviewCount: 23,
  },
  {
    id: "listing-012",
    title: "Tsumeb Etosha Edge Lodge",
    region: "Oshikoto",
    price: 125000,
    type: "stay",
    category: "stay",
    description: "Perched on the southern rim of the Etosha pan where the salt glows white under the moon and the springbok migrate in their thousands each dry season. This premium lodge offers four luxury suites with private plunge pools, an infinity-edge main pool overlooking the pan, and guided game drives that leave before first light. The host is a former park ranger with two decades of Etosha knowledge.",
    images: [
      "/images/listings/stays/stay-listing-12.jpg",
      "/images/listings/stays/stay-listing-03.jpg",
      "/images/listings/stays/stay-listing-07.jpg",
      "/images/listings/stays/stay-listing-11.jpg",
      "/images/listings/stays/stay-listing-13.jpg",
    ],
    features: ["Etosha Pan View", "Plunge Pool", "Game Drives", "Infinity Pool", "Ranger Guide"],
    hostId: "demo-farmer-001",
    hostName: "Amara Hoeses",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -19.2415,
    lng: 17.7142,
    rating: 5.0,
    reviewCount: 68,
  },
];

// ─── Mock Bookings ────────────────────────────────────────────
export const DEMO_BOOKINGS: DemoBooking[] = [
  {
    id: "booking-001",
    listingId: "listing-001",
    listingTitle: "Erongo Granite Lodge",
    listingImage: "/images/listings/stays/stay-listing-01.jpg",
    guestName: "Pieter Gaseb",
    startDate: "2026-07-10",
    endDate: "2026-07-15",
    totalCents: 425000,
    status: "confirmed",
    reference: "FEA-A3K7M9",
  },
  {
    id: "booking-002",
    listingId: "listing-002",
    listingTitle: "Kunene Desert Pasture Camp",
    listingImage: "/images/listings/stays/stay-listing-02.jpg",
    guestName: "Hannes van Wyk",
    startDate: "2026-07-18",
    endDate: "2026-07-22",
    totalCents: 380000,
    status: "pending",
    reference: "FEA-B5N2P4",
  },
  {
    id: "booking-003",
    listingId: "listing-006",
    listingTitle: "Zambezi Riverbank Lodge",
    listingImage: "/images/listings/stays/stay-listing-06.jpg",
    guestName: "Linea Iyambo",
    startDate: "2026-06-20",
    endDate: "2026-06-23",
    totalCents: 285000,
    status: "completed",
    reference: "FEA-C8Q1R7",
  },
];

// ─── Accessor Functions ───────────────────────────────────────
export function getDemoListings(region?: string): DemoListing[] {
  let listings = DEMO_LISTINGS;
  if (region && region !== "All Regions") {
    listings = listings.filter((l) =>
      l.region.toLowerCase().includes(region.toLowerCase())
    );
  }
  return listings;
}

export function getDemoListingById(id: string): DemoListing | null {
  return DEMO_LISTINGS.find((l) => l.id === id) ?? null;
}

export function getDemoBookings(): DemoBooking[] {
  return DEMO_BOOKINGS;
}

export function getDemoUser(persona: "farmer" | "guest"): DemoUser {
  return persona === "farmer" ? DEMO_FARMER : DEMO_GUEST;
}
