/**
 * Feorm Demo Data — Hardcoded data for demo mode
 *
 * Replaces all Supabase tables with in-memory data.
 * Matches the exact shape the UI and API routes expect.
 */

// ─── Types ────────────────────────────────────────────────────────

export interface DemoProfile {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  surname?: string;
  region?: string;
  role: "guest" | "voyager" | "provider_stay" | "admin";
  verified: boolean;
  avatarUrl?: string;
  trustScore?: number;
  createdAt?: string;
}

export interface DemoListing {
  id: string;
  title: string;
  region: string;
  price: number; // cents
  type: string;
  category: string;
  description: string;
  imageUrl: string;
  features: string; // comma-separated
  hostId: string;
  hostName: string;
  hostPhone: string;
  available: boolean;
  lat: number | null;
  lng: number | null;
  createdAt?: string;
}

export interface DemoBooking {
  id: string;
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number; // cents
  escrowAmount: number; // cents
  serviceFee: number; // cents
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled" | "disputed";
  referenceNumber: string;
  listing?: {
    id: string;
    title: string;
    type: string;
    category: string;
    region: string;
    imageUrl: string;
  };
  createdAt?: string;
}

// ─── Demo Profiles ────────────────────────────────────────────────

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    phone: "+264 81 234 5678",
    name: "Aisha",
    surname: "Mwangi",
    region: "Oshikoto",
    role: "provider_stay",
    verified: true,
    avatarUrl: "/avatars/amara.svg",
    trustScore: 92,
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    phone: "+264 81 345 6789",
    name: "Johan",
    surname: "Pretorius",
    region: "Khomas",
    role: "provider_stay",
    verified: true,
    avatarUrl: "/avatars/kazo.svg",
    trustScore: 88,
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "a0000000-0000-0000-0000-000000000005",
    phone: "+264 81 567 8902",
    name: "Hafeni",
    surname: "Tshivhuli",
    region: "Kavango East",
    role: "provider_stay",
    verified: true,
    avatarUrl: "/avatars/nale.svg",
    trustScore: 95,
    createdAt: "2026-02-01T12:00:00Z",
  },
  {
    id: "d0000000-0000-0000-0000-000000000001",
    email: "demo@feorm.na",
    phone: "+264 81 100 2000",
    name: "Demo",
    surname: "Traveler",
    region: "Khomas",
    role: "voyager",
    verified: true,
    avatarUrl: "/avatars/shona.svg",
    trustScore: 78,
    createdAt: "2026-02-10T14:00:00Z",
  },
  {
    id: "d0000000-0000-0000-0000-000000000002",
    email: "admin@feorm.na",
    phone: "+264 81 200 3000",
    name: "Admin",
    surname: "Feorm",
    region: "Khomas",
    role: "admin",
    verified: true,
    avatarUrl: "/avatars/tandi.svg",
    trustScore: 100,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// ─── Demo Listings (17 farm stays) ───────────────────────────────

export const DEMO_LISTINGS: DemoListing[] = [
  {
    id: "b0000001-0000-0000-0000-000000000001",
    title: "Otjiseva Farm Stay",
    region: "Khomas",
    price: 120000,
    type: "stay",
    category: "stay",
    description:
      "A peaceful farm stay nestled in the Khomas Hochland with panoramic views of the Auas Mountains. Perfect for weekend getaways from Windhoek. Enjoy guided farm walks, stargazing under pristine skies, and traditional Namibian braai under the camelthorn trees.",
    imageUrl: "/images/listings/stays/stay-listing-01.jpg",
    features: "Solar power,Borehole water,Braai area,Hot water,Bush view,Stargazing deck,Guided farm walks",
    hostId: "a0000000-0000-0000-0000-000000000002",
    hostName: "Johan",
    hostPhone: "+264 81 234 5678",
    available: true,
    lat: -22.5747,
    lng: 17.0832,
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "b0000002-0000-0000-0000-000000000001",
    title: "Swakopmund Agro Stay",
    region: "Erongo",
    price: 180000,
    type: "stay",
    category: "stay",
    description:
      "Coastal farm stay just outside Swakopmund where the desert meets the sea. Experience unique desert farming with fog-harvesting technology and visit the nearby Walvis Bay wetlands. Self-catering kitchen with local produce available.",
    imageUrl: "/images/listings/stays/stay-listing-02.jpg",
    features: "WiFi (limited),Self-catering kitchen,Hot water,Camping allowed,Stargazing deck,Guided farm walks,Solar power",
    hostId: "a0000000-0000-0000-0000-000000000002",
    hostName: "Johan",
    hostPhone: "+264 81 456 7890",
    available: true,
    lat: -22.6788,
    lng: 14.5256,
    createdAt: "2026-02-02T10:00:00Z",
  },
  {
    id: "b0000003-0000-0000-0000-000000000001",
    title: "Epupa Falls Riverside Lodge",
    region: "Kunene",
    price: 220000,
    type: "stay",
    category: "stay",
    description:
      "Remote farm stay on the Kunene River with spectacular views of Epupa Falls. Wake to the sound of cascading water and explore Himba village tours. This is one of Namibia's most dramatic settings — a true bucket-list destination.",
    imageUrl: "/images/listings/stays/stay-listing-03.jpg",
    features: "Hot water,Bush view,Game farm,Guided farm walks,Horse riding,Camping allowed,Stargazing deck",
    hostId: "a0000000-0000-0000-0000-000000000001",
    hostName: "Aisha",
    hostPhone: "+264 81 678 9012",
    available: true,
    lat: -17.0063,
    lng: 13.2454,
    createdAt: "2026-02-03T10:00:00Z",
  },
  {
    id: "b0000004-0000-0000-0000-000000000001",
    title: "Okahandja Guest Farm",
    region: "Otjozondjupa",
    price: 95000,
    type: "stay",
    category: "stay",
    description:
      "Classic Namibian guest farm set among acacia woodlands near Okahandja. The heart of cattle country with warm hospitality, hearty farm meals, and sundowner drives. Children and pets welcome.",
    imageUrl: "/images/listings/stays/stay-listing-04.jpg",
    features: "Borehole water,Braai area,Hot water,Swimming pool,Game farm,Camping allowed,Self-catering kitchen",
    hostId: "a0000000-0000-0000-0000-000000000002",
    hostName: "Johan",
    hostPhone: "+264 81 789 0123",
    available: true,
    lat: -21.9823,
    lng: 16.9187,
    createdAt: "2026-02-04T10:00:00Z",
  },
  {
    id: "b0000005-0000-0000-0000-000000000001",
    title: "Oshakati Mahangu Farm",
    region: "Oshana",
    price: 65000,
    type: "stay",
    category: "stay",
    description:
      "Traditional mahangu (pearl millet) farm stay in the heart of Owambo country. Learn about subsistence farming methods passed down through generations. Experience the real northern Namibian way of life with home-cooked oshifima and omboga.",
    imageUrl: "/images/listings/stays/stay-listing-05.jpg",
    features: "Borehole water,Self-catering kitchen,Guided farm walks,Camping allowed,Hot water",
    hostId: "a0000000-0000-0000-0000-000000000001",
    hostName: "Aisha",
    hostPhone: "+264 81 901 2345",
    available: true,
    lat: -17.7833,
    lng: 15.6833,
    createdAt: "2026-02-05T10:00:00Z",
  },
  {
    id: "b0000006-0000-0000-0000-000000000001",
    title: "Eenhana Homestead Stay",
    region: "Ohangwena",
    price: 45000,
    type: "stay",
    category: "stay",
    description:
      "Authentic Owambo homestead experience near Eenhana. Stay in a traditional palatial homestead and participate in daily farming activities including cattle herding and mahangu pounding. A deeply cultural experience.",
    imageUrl: "/images/listings/stays/stay-listing-06.jpg",
    features: "Borehole water,Guided farm walks,Self-catering kitchen,Camping allowed,Hot water",
    hostId: "a0000000-0000-0000-0000-000000000001",
    hostName: "Aisha",
    hostPhone: "+264 81 123 4567",
    available: true,
    lat: -17.5697,
    lng: 16.3352,
    createdAt: "2026-02-06T10:00:00Z",
  },
  {
    id: "b0000007-0000-0000-0000-000000000001",
    title: "Tsumeb Copper Country Lodge",
    region: "Oshikoto",
    price: 150000,
    type: "stay",
    category: "stay",
    description:
      "Watch wildlife from your private deck — a waterhole attracts zebra, giraffe, and antelope from the Etosha pan just beyond the fence. After dark, the sky fills with stars undimmed by city lights. The Hoba Meteorite, the largest on Earth, is a short drive away.",
    imageUrl: "/images/listings/stays/stay-listing-07.jpg",
    features: "Swimming pool,Game farm,Hot water,WiFi (limited),Bush view,Stargazing deck,Guided farm walks",
    hostId: "a0000000-0000-0000-0000-000000000001",
    hostName: "Aisha",
    hostPhone: "+264 81 234 5670",
    available: true,
    lat: -19.2433,
    lng: 17.7308,
    createdAt: "2026-02-07T10:00:00Z",
  },
  {
    id: "b0000008-0000-0000-0000-000000000001",
    title: "Rundu Riverfront Farm",
    region: "Kavango East",
    price: 135000,
    type: "stay",
    category: "stay",
    description:
      "Lush Kavango riverfront farm stay with tropical gardens and bird-watching paradise. Fish for tigerfish in the Okavango River and explore the nearby Popa Falls. The green belt of Namibia awaits.",
    imageUrl: "/images/listings/stays/stay-listing-08.jpg",
    features: "Borehole water,Hot water,Bush view,Horse riding,Swimming pool,Self-catering kitchen,Guided farm walks",
    hostId: "a0000000-0000-0000-0000-000000000005",
    hostName: "Hafeni",
    hostPhone: "+264 81 345 6780",
    available: true,
    lat: -17.9313,
    lng: 19.7654,
    createdAt: "2026-02-08T10:00:00Z",
  },
  {
    id: "b0000009-0000-0000-0000-000000000001",
    title: "Nkurenkuru Cattle Post",
    region: "Kavango West",
    price: 75000,
    type: "stay",
    category: "stay",
    description:
      "Traditional Kavango cattle post stay on the western banks of the Okavango River. Participate in daily cattle management and learn about the indigenous Kavango farming traditions that have sustained communities for centuries.",
    imageUrl: "/images/listings/stays/stay-listing-09.jpg",
    features: "Borehole water,Bush view,Camping allowed,Hot water,Guided farm walks,Self-catering kitchen",
    hostId: "a0000000-0000-0000-0000-000000000005",
    hostName: "Hafeni",
    hostPhone: "+264 81 567 8902",
    available: true,
    lat: -17.9854,
    lng: 19.1978,
    createdAt: "2026-02-09T10:00:00Z",
  },
  {
    id: "b0000010-0000-0000-0000-000000000001",
    title: "Katima Mulilo Floodplain Stay",
    region: "Zambezi",
    price: 165000,
    type: "stay",
    category: "stay",
    description:
      "Riverside farm stay in the Zambezi Region (Caprivi Strip) where four countries meet. Explore the wetlands by mokoro, spot hippos and crocodiles, and fish the Zambezi for bream and barbel. A truly wild African experience.",
    imageUrl: "/images/listings/stays/stay-listing-10.jpg",
    features: "Hot water,Bush view,Game farm,Camping allowed,Horse riding,Guided farm walks,Swimming pool",
    hostId: "a0000000-0000-0000-0000-000000000005",
    hostName: "Hafeni",
    hostPhone: "+264 81 678 9013",
    available: true,
    lat: -17.4938,
    lng: 24.2639,
    createdAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "b0000011-0000-0000-0000-000000000001",
    title: "Gobabis Cattle Ranch",
    region: "Omaheke",
    price: 110000,
    type: "stay",
    category: "stay",
    description:
      "Working cattle ranch in the Omaheke — Namibia's cattle country. Experience daily ranch life, assist with cattle drives, and enjoy the vast golden grasslands stretching to the Botswana border. Authentic cowboy culture meets African wilderness.",
    imageUrl: "/images/listings/stays/stay-listing-11.jpg",
    features: "Borehole water,Braai area,Hot water,Horse riding,Game farm,Guided farm walks,Bush view",
    hostId: "a0000000-0000-0000-0000-000000000002",
    hostName: "Johan",
    hostPhone: "+264 81 890 1235",
    available: true,
    lat: -22.4494,
    lng: 18.9681,
    createdAt: "2026-02-11T10:00:00Z",
  },
  {
    id: "b0000012-0000-0000-0000-000000000001",
    title: "Mariental Kalahari Retreat",
    region: "Hardap",
    price: 98000,
    type: "stay",
    category: "stay",
    description:
      "Kalahari desert farm stay with red dune views and abundant wildlife. Home to gemsbok, springbok, and meerkat colonies. Watch the sunset paint the dunes while enjoying a cold Windhoek Lager at the braai area.",
    imageUrl: "/images/listings/stays/stay-listing-12.jpg",
    features: "Solar power,Borehole water,Braai area,Hot water,Game farm,Stargazing deck,Camping allowed",
    hostId: "a0000000-0000-0000-0000-000000000002",
    hostName: "Johan",
    hostPhone: "+264 81 012 3457",
    available: true,
    lat: -24.6333,
    lng: 17.95,
    createdAt: "2026-02-12T10:00:00Z",
  },
  {
    id: "b0000013-0000-0000-0000-000000000001",
    title: "Keetmanshoop Karas Mountain Lodge",
    region: "//Karas",
    price: 190000,
    type: "stay",
    category: "stay",
    description:
      "Dramatic mountain lodge in the //Karas region with ancient quiver tree forests and rock formations. Explore the Fish River Canyon — the second largest canyon in the world. Cool desert nights with spectacular stargazing.",
    imageUrl: "/images/listings/stays/stay-listing-01.jpg",
    features: "Solar power,Hot water,Bush view,Stargazing deck,WiFi (limited),Game farm,Guided farm walks",
    hostId: "a0000000-0000-0000-0000-000000000002",
    hostName: "Johan",
    hostPhone: "+264 81 234 5679",
    available: true,
    lat: -26.5818,
    lng: 18.1284,
    createdAt: "2026-02-13T10:00:00Z",
  },
  {
    id: "b0000014-0000-0000-0000-000000000001",
    title: "Khomas Hochland Luxury Camp",
    region: "Khomas",
    price: 220000,
    type: "stay",
    category: "stay",
    description:
      "Exclusive glamping experience in the Khomas Hochland mountains. Luxury safari tents with en-suite bathrooms and private decks. Gourmet farm-to-table dining under the stars. Only 30 minutes from Windhoek but a world away.",
    imageUrl: "/images/listings/stays/stay-listing-02.jpg",
    features: "Swimming pool,Hot water,WiFi (limited),Stargazing deck,Braai area,Guided farm walks,Bush view",
    hostId: "a0000000-0000-0000-0000-000000000002",
    hostName: "Johan",
    hostPhone: "+264 81 456 7803",
    available: true,
    lat: -22.75,
    lng: 16.85,
    createdAt: "2026-02-14T10:00:00Z",
  },
  {
    id: "b0000015-0000-0000-0000-000000000001",
    title: "Waterberg Plateau Farmhouse",
    region: "Otjozondjupa",
    price: 175000,
    type: "stay",
    category: "stay",
    description:
      "Charming farmhouse at the base of the Waterberg Plateau. Hike the red sandstone cliffs, spot rare sable and roan antelope, and cool off in the natural rock pools. The farm kitchen serves legendary potjiekos.",
    imageUrl: "/images/listings/stays/stay-listing-03.jpg",
    features: "Hot water,Swimming pool,Game farm,Guided farm walks,Horse riding,Self-catering kitchen,Bush view",
    hostId: "a0000000-0000-0000-0000-000000000002",
    hostName: "Johan",
    hostPhone: "+264 81 789 0126",
    available: true,
    lat: -20.5054,
    lng: 17.22,
    createdAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "b0000016-0000-0000-0000-000000000001",
    title: "Hardap Dam Fisherman's Cottage",
    region: "Hardap",
    price: 85000,
    type: "stay",
    category: "stay",
    description:
      "Cosy cottage on the shores of Hardap Dam — Namibia's largest dam. Perfect for fishing enthusiasts and bird watchers. Catch yellowfish and barbel from the bank, or hire our small boat. Stunning sunsets over the water guaranteed.",
    imageUrl: "/images/listings/stays/stay-listing-04.jpg",
    features: "Borehole water,Braai area,Hot water,Camping allowed,Self-catering kitchen,Bush view",
    hostId: "a0000000-0000-0000-0000-000000000002",
    hostName: "Johan",
    hostPhone: "+264 81 890 1237",
    available: true,
    lat: -24.5,
    lng: 17.87,
    createdAt: "2026-02-16T10:00:00Z",
  },
  {
    id: "b0000017-0000-0000-0000-000000000001",
    title: "Karasburg Sheep Station",
    region: "//Karas",
    price: 70000,
    type: "stay",
    category: "stay",
    description:
      "Working Karakul sheep station in the deep south. Experience the vast open plains where Namibia meets South Africa. Learn about the historic Karakul farming industry and the resilient people of the //Karas region.",
    imageUrl: "/images/listings/stays/stay-listing-05.jpg",
    features: "Solar power,Borehole water,Hot water,Camping allowed,Guided farm walks,Self-catering kitchen",
    hostId: "a0000000-0000-0000-0000-000000000002",
    hostName: "Johan",
    hostPhone: "+264 81 901 2348",
    available: true,
    lat: -28.05,
    lng: 19.15,
    createdAt: "2026-02-17T10:00:00Z",
  },
];

// ─── Demo Bookings ────────────────────────────────────────────────

export const DEMO_BOOKINGS: DemoBooking[] = [
  {
    id: "c0000001-0000-0000-0000-000000000001",
    userId: "d0000000-0000-0000-0000-000000000001",
    listingId: "b0000001-0000-0000-0000-000000000001",
    startDate: "2026-03-15",
    endDate: "2026-03-18",
    totalPrice: 360000,
    escrowAmount: 50000,
    serviceFee: 36000,
    status: "confirmed",
    referenceNumber: "FEA-M8XK2P",
    listing: {
      id: "b0000001-0000-0000-0000-000000000001",
      title: "Otjiseva Farm Stay",
      type: "stay",
      category: "stay",
      region: "Khomas",
      imageUrl: "/images/listings/stays/stay-listing-01.jpg",
    },
    createdAt: "2026-03-01T14:00:00Z",
  },
  {
    id: "c0000002-0000-0000-0000-000000000001",
    userId: "d0000000-0000-0000-0000-000000000001",
    listingId: "b0000003-0000-0000-0000-000000000001",
    startDate: "2026-04-01",
    endDate: "2026-04-05",
    totalPrice: 880000,
    escrowAmount: 88000,
    serviceFee: 88000,
    status: "active",
    referenceNumber: "FEA-N3QR7T",
    listing: {
      id: "b0000003-0000-0000-0000-000000000001",
      title: "Epupa Falls Riverside Lodge",
      type: "stay",
      category: "stay",
      region: "Kunene",
      imageUrl: "/images/listings/stays/stay-listing-03.jpg",
    },
    createdAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "c0000003-0000-0000-0000-000000000001",
    userId: "d0000000-0000-0000-0000-000000000001",
    listingId: "b0000005-0000-0000-0000-000000000001",
    startDate: "2026-02-10",
    endDate: "2026-02-12",
    totalPrice: 130000,
    escrowAmount: 50000,
    serviceFee: 13000,
    status: "completed",
    referenceNumber: "FEA-L5WX9B",
    listing: {
      id: "b0000005-0000-0000-0000-000000000001",
      title: "Oshakati Mahangu Farm",
      type: "stay",
      category: "stay",
      region: "Oshana",
      imageUrl: "/images/listings/stays/stay-listing-05.jpg",
    },
    createdAt: "2026-02-01T11:00:00Z",
  },
  {
    id: "c0000004-0000-0000-0000-000000000001",
    userId: "d0000000-0000-0000-0000-000000000001",
    listingId: "b0000012-0000-0000-0000-000000000001",
    startDate: "2026-05-20",
    endDate: "2026-05-23",
    totalPrice: 294000,
    escrowAmount: 50000,
    serviceFee: 29400,
    status: "pending",
    referenceNumber: "FEA-P1YJ4V",
    listing: {
      id: "b0000012-0000-0000-0000-000000000001",
      title: "Mariental Kalahari Retreat",
      type: "stay",
      category: "stay",
      region: "Hardap",
      imageUrl: "/images/listings/stays/stay-listing-12.jpg",
    },
    createdAt: "2026-04-10T16:00:00Z",
  },
];

// ─── Default Demo User (signed-in state) ──────────────────────────

export const DEMO_USER: DemoProfile = {
  id: "d0000000-0000-0000-0000-000000000001",
  email: "demo@feorm.na",
  phone: "+264 81 100 2000",
  name: "Demo",
  surname: "Traveler",
  region: "Khomas",
  role: "voyager",
  verified: true,
  avatarUrl: "/avatars/shona.svg",
  trustScore: 78,
  createdAt: "2026-02-10T14:00:00Z",
};

// ─── Helper Functions ─────────────────────────────────────────────

export function getListingById(id: string): DemoListing | undefined {
  return DEMO_LISTINGS.find((l) => l.id === id);
}

export function getListingsByType(type?: string): DemoListing[] {
  if (!type) return DEMO_LISTINGS;
  return DEMO_LISTINGS.filter((l) => l.category === type && l.available);
}

export function getBookingsByUserId(userId: string): DemoBooking[] {
  return DEMO_BOOKINGS.filter((b) => b.userId === userId);
}

export function getBookingByReference(reference: string): DemoBooking | undefined {
  return DEMO_BOOKINGS.find((b) => b.referenceNumber === reference);
}

export function getProfileById(id: string): DemoProfile | undefined {
  return DEMO_PROFILES.find((p) => p.id === id);
}
