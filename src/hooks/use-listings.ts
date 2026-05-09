"use client";

import { useState, useEffect, useRef } from "react";

// ─── Static Demo Data (Ultimate Fallback) ──────────────────────────
// All 14 Namibian regions represented with authentic cultural context.
// Prices in Namibian cents (N$ 850 = 85000 cents).

const DEMO_STAYS = [
  {
    _id: "demo-stay-1",
    title: "Zambezi Floodplain Lodge",
    type: "stay",
    region: "Zambezi Region",
    price: 110000,
    description:
      "Stilted timber cabins above the Caprivi floodplains. The Lozi and Mafwe communities have cultivated these seasonal wetlands for generations, and the lodge operates in coordination with their flood-cycle calendar. Guided mokoro excursions through the delta channels and seasonal fishing with local handlers. Reed-and-timber construction elevated above peak flood line.",
    image: "/images/stay-wetlands-lodge.png",
    features: ["River Delta", "Mokoro Excursions", "Seasonal Fishing"],
    category: "Eco Lodge",
    hostName: "Muyunda Likoro",
    hostPhone: "+26481234001",
    available: true,
  },
  {
    _id: "demo-stay-2",
    title: "Kavango River Mahangu Station",
    type: "stay",
    region: "Kavango East",
    price: 62000,
    description:
      "Riverside mahangu station along the Okavango. The Mbunza have practiced flood-retreat cultivation along this stretch for centuries, planting as the river recedes. Participate in the traditional planting and harvesting cycles. Timber platform with woven reed walls, positioned above the high-water mark.",
    image: "/images/stay-kavango.png",
    features: ["River Access", "Mahangu Cultivation", "Reed Architecture"],
    category: "Working Farm",
    hostName: "Mukuve Munika",
    hostPhone: "+26481234002",
    available: true,
  },
  {
    _id: "demo-stay-3",
    title: "Kavango West Flood-Retreat Plot",
    type: "stay",
    region: "Kavango West",
    price: 58000,
    description:
      "Working flood-retreat farm on the western Okavango bank. The Sambyu and Gciriku communities maintain intercropping systems unique to this river corridor, combining mahangu with groundnuts and pumpkins in a single field. Clay-walled compound with thatched roofing and direct river access for seasonal irrigation channels.",
    image: "/images/stay-kavango-west.png",
    features: ["Flood-Retreat Farming", "Intercropping", "River Access"],
    category: "Working Farm",
    hostName: "Rukoro Mbambo",
    hostPhone: "+26481234003",
    available: true,
  },
  {
    _id: "demo-stay-4",
    title: "Ohangwena Mahangu Homestead",
    type: "stay",
    region: "Ohangwena Region",
    price: 48000,
    description:
      "Traditional Kwambi homestead set among mahangu fields and cuca shop trading posts. The Ohangwena corridor sustains dense rural settlement where mahangu remains the staple grain and communal labor organizes the harvest. Clay-brick compound with a central courtyard used for threshing and winnowing during the May season.",
    image: "/images/stay-ohangwena.png",
    features: ["Mahangu Harvest", "Cuca Shop Route", "Threshing Court"],
    category: "Working Farm",
    hostName: "Amadhila Nanyeni",
    hostPhone: "+26481234004",
    available: true,
  },
  {
    _id: "demo-stay-5",
    title: "Oshana Floodplain Homestead",
    type: "stay",
    region: "Oshana Region",
    price: 45000,
    description:
      "Traditional Kwanyama homestead on the edge of the oshana basin. The shallow seasonal floodplains define agriculture here: mahangu on raised beds, fishing in the channels, and livestock grazing on receding waterlines. Clay-walled compound with thatched roofing and a palisade of mopane posts.",
    image: "/images/stay-oshana.png",
    features: ["Mahangu Harvesting", "Oshana Fishing", "Traditional Compound"],
    category: "Working Farm",
    hostName: "Nangolo Sheelongo",
    hostPhone: "+26481234005",
    available: true,
  },
  {
    _id: "demo-stay-6",
    title: "Omusati Palmland Homestead",
    type: "stay",
    region: "Omusati Region",
    price: 42000,
    description:
      "Kwanyama and Ndonga homestead among the makalani palm groves of northern Omusati. The palm provides wine, basket fiber, and structural timber, integral to the domestic economy of this densely settled region. Traditional compound with a stock enclosure and grain store, built from anthill clay and palm thatch.",
    image: "/images/stay-omusati.png",
    features: ["Palm Wine Season", "Basket Weaving", "Makalani Grove"],
    category: "Working Farm",
    hostName: "Iilonga Nashilongo",
    hostPhone: "+26481234006",
    available: true,
  },
  {
    _id: "demo-stay-7",
    title: "Oshikoto Lakeside Compound",
    type: "stay",
    region: "Oshikoto Region",
    price: 55000,
    description:
      "Ndonga community compound near the shores of Lake Oshikoto, one of Namibia's few natural lakes. The surrounding area supports mahangu cultivation and cattle grazing alongside copper mining operations that employ much of the local population. Fired-brick compound with a shaded veranda facing the lake basin.",
    image: "/images/stay-oshikoto.png",
    features: ["Lake Access", "Mahangu Fields", "Copper Belt"],
    category: "Guest House",
    hostName: "Ndapanda Hamunyela",
    hostPhone: "+26481234007",
    available: true,
  },
  {
    _id: "demo-stay-8",
    title: "Kunene Desert Pasture Camp",
    type: "stay",
    region: "Kunene Region",
    price: 95000,
    description:
      "Desert pasture camp in the rugged northwest. Himba pastoralists maintain goat and cattle herds across this arid landscape, moving between seasonal grazing grounds using knowledge passed through generations. The camp operates with their coordination, offering direct observation of desert pastoralism and seasonal goat management. Canvas pavilions on raised timber decks with canyon views.",
    image: "/images/stay-kunene-desert.png",
    features: ["Desert Pastoralism", "Goat Herding", "Canyon Views"],
    category: "Tent Camp",
    hostName: "Tjipuka Tjivikua",
    hostPhone: "+26481234008",
    available: true,
  },
  {
    _id: "demo-stay-9",
    title: "Erongo Granite Lodge",
    type: "stay",
    region: "Erongo Region",
    price: 120000,
    description:
      "Structural stone architecture integrated into the raw Erongo mountainside. The Damara and Nama communities of this region carry deep ties to the granite massif, its mineral deposits, and the coastal desert that defines the western boundary. Off-grid solar provision and extreme isolation for intensive retreats. Mine-track hiking routes accessible from the property.",
    image: "/images/stay-granite-lodge.png",
    features: ["Off-grid Solar", "Hiking Trails", "High Altitude"],
    category: "Guest House",
    hostName: "Anna //Khaoes",
    hostPhone: "+26481234009",
    available: true,
  },
  {
    _id: "demo-stay-10",
    title: "Otjozondjupa Bushveld Station",
    type: "stay",
    region: "Otjozondjupa Region",
    price: 85000,
    description:
      "Cattle station in the bushveld east of the Waterberg. Herero pastoralists have run cattle across this ground since the 19th century, maintaining herding practices shaped by the plateau ecology. The station supports seasonal cattle work, veld management, and bush clearing. Stone-and-timber lodge with a wide stoop facing the drainage line.",
    image: "/images/stay-cattle-farm.png",
    features: ["Cattle Operations", "Waterberg Proximity", "Veld Management"],
    category: "Working Farm",
    hostName: "Tjitendero Kavari",
    hostPhone: "+26481234010",
    available: true,
  },
  {
    _id: "demo-stay-11",
    title: "Khomas Highland Camp",
    type: "stay",
    region: "Khomas Region",
    price: 65000,
    description:
      "Utilitarian canvas structures elevated on timber platforms in the Windhoek highlands. The Khomas Region supports a mix of commercial agriculture and commuter pastoralism, where smallstock owners from the city maintain weekend operations. Focus on ecological observation and minimal-impact habitation. Guided walks through the highland savanna available.",
    image: "/images/stay-bush-walk.png",
    features: ["Guided Walks", "Firepit", "Composting Toilet"],
    category: "Tent Camp",
    hostName: "Pieter Gaseb",
    hostPhone: "+26481234011",
    available: true,
  },
  {
    _id: "demo-stay-12",
    title: "Hardap Kalahari Goat Station",
    type: "stay",
    region: "Hardap Region",
    price: 55000,
    description:
      "Working goat station on the Kalahari fringe. The Nama and Afrikaner communities of Hardap have bred Boer goats across this semi-arid transition zone for over a century, developing hardy stock adapted to the red sands and sparse graze. Date palms line the irrigation channels from the Hardap Dam. Stone kraal accommodations with traditional braai facilities.",
    image: "/images/stay-goat-station.png",
    features: ["Goat Herding", "Red Dunes", "Traditional Braai"],
    category: "Working Farm",
    hostName: "Frikkie Boois",
    hostPhone: "+26481234012",
    available: true,
  },
  {
    _id: "demo-stay-13",
    title: "Karas Canyon Sheep Station",
    type: "stay",
    region: "Karas Region",
    price: 72000,
    description:
      "Karakul sheep station in the arid south near the Fish River Canyon. The Nama and Afrikaner farming families of Karas have raised peltsheep in this desert scrubland since the early 20th century, developing drought-resistant flock management methods. The station operates on minimal water infrastructure with extensive veld grazing. Stone farmhouse with thick walls and a covered working yard.",
    image: "/images/stay-karas.png",
    features: ["Karakul Sheep", "Canyon Proximity", "Desert Veld"],
    category: "Working Farm",
    hostName: "Kooper ||Khauxa",
    hostPhone: "+26481234013",
    available: true,
  },
  {
    _id: "demo-stay-14",
    title: "Omaheke Sandveld Cattle Post",
    type: "stay",
    region: "Omaheke Region",
    price: 68000,
    description:
      "Deep Kalahari cattle post in the Omaheke sandveld. Herero and Tswana pastoralists maintain seasonal cattle movements across this sandy grassland, while San communities hold tracking and veld-knowledge traditions critical to navigating the terrain. The post supports seasonal cattle work, borehole maintenance, and veld monitoring. Timber-frame shelter with canvas walls and a kraal of camelthorn posts.",
    image: "/images/stay-omaheke.png",
    features: ["Cattle Posts", "Kalahari Tracking", "Borehole Access"],
    category: "Working Farm",
    hostName: "Kahumba Rukero",
    hostPhone: "+26481234014",
    available: true,
  },
];

const DEMO_EQUIPMENT = [
  {
    _id: "demo-equip-1",
    title: "John Deere 5075E",
    type: "equipment",
    region: "Khomas Region",
    price: 150000,
    description:
      "75HP utility tractor. Clean service record. Optimized for dry-season plowing on the Khomas highland soils. Escrow protection and condition reporting mandatory prior to ignition.",
    image: "/images/equip-tractor.png",
    features: ["75 Horsepower", "Diesel", "Operator Optional"],
    category: "Machinery",
    hostName: "Johan Deetlefs",
    hostPhone: "+26481234015",
    available: true,
  },
  {
    _id: "demo-equip-2",
    title: "Industrial Water Pump",
    type: "equipment",
    region: "Hardap Region",
    price: 40000,
    description:
      "High-pressure diesel pump unit designed for seasonal deep-well extraction. Includes 10 meters of industrial-grade layflat piping. Suited for the Hardap irrigation channels and borehole systems.",
    image: "/images/equip-pump.png",
    features: ["High Pressure", "10m Piping", "Portable"],
    category: "Irrigation",
    hostName: "Frikkie Boois",
    hostPhone: "+26481234016",
    available: true,
  },
  {
    _id: "demo-equip-3",
    title: "Disc Harrow Implement",
    type: "equipment",
    region: "Omaheke Region",
    price: 35000,
    description:
      "Heavy-duty steel disc harrow for soil preparation in the Omaheke sandveld. Standard three-point hitch compatible. Designed for breaking compacted Kalahari sand after seasonal rain.",
    image: "/images/equip-harrow.png",
    features: ["3-Point Hitch", "Heavy Steel", "No Power Required"],
    category: "Attachment",
    hostName: "Kaita Tjirare",
    hostPhone: "+26481234017",
    available: true,
  },
  {
    _id: "demo-equip-4",
    title: "Borehole Drilling Rig",
    type: "equipment",
    region: "Kunene Region",
    price: 280000,
    description:
      "Truck-mounted rotary drilling rig capable of 200m borehole depth. Essential infrastructure for the arid northwest where groundwater access determines pastoral viability. Includes mud pump and casing equipment. Operator with 12 years experience available at additional cost. Minimum 3-day rental period.",
    image: "/images/equip-drilling-rig.png",
    features: ["200m Depth", "Mud Pump Included", "Operator Available"],
    category: "Heavy Machinery",
    hostName: "Hannes van Wyk",
    hostPhone: "+26481234018",
    available: true,
  },
  {
    _id: "demo-equip-5",
    title: "5kW Solar Panel Array",
    type: "equipment",
    region: "Erongo Region",
    price: 65000,
    description:
      "Complete off-grid photovoltaic system. 16 mono-crystalline panels, inverter, and battery bank. Portable mounting frames for seasonal relocation. Designed for remote Erongo operations beyond the grid reach.",
    image: "/images/equip-solar-array.png",
    features: ["5kW Output", "Battery Bank", "Portable Frames"],
    category: "Energy",
    hostName: "Anna //Khaoes",
    hostPhone: "+26481234019",
    available: true,
  },
  {
    _id: "demo-equip-6",
    title: "Crop Harvesting Unit",
    type: "equipment",
    region: "Otjozondjupa Region",
    price: 200000,
    description:
      "Full-size agricultural harvesting unit suitable for wheat, maize, and sunflower crops. GPS-guided auto-steer with yield mapping. Requires 150HP minimum tractor for transport. Seasonal availability only. Suited to the Otjozondjupa bushveld commercial operations.",
    image: "/images/equip-combine.png",
    features: ["GPS Auto-Steer", "Yield Mapping", "Multi-Crop"],
    category: "Machinery",
    hostName: "Johan Deetlefs",
    hostPhone: "+26481234020",
    available: true,
  },
  {
    _id: "demo-equip-7",
    title: "Mahangu Thresher",
    type: "equipment",
    region: "Ohangwena Region",
    price: 45000,
    description:
      "Compact diesel-powered thresher designed for pearl millet, the staple grain of northern Namibia. Processes mahangu heads at rate suitable for smallholder operations in the Ohangwena corridor. Trailer-mounted for transport between homesteads. Operated by community cooperatives during the May-July harvest window.",
    image: "/images/equip-thresher.png",
    features: ["Diesel Powered", "Trailer Mounted", "Smallholder Scale"],
    category: "Machinery",
    hostName: "Hilja Amukana",
    hostPhone: "+26481234021",
    available: true,
  },
  {
    _id: "demo-equip-8",
    title: "Irrigation Pipeline System",
    type: "equipment",
    region: "Kavango East",
    price: 85000,
    description:
      "Modular aluminum irrigation pipeline with gated outlets, designed for flood-retreat cultivation along the Okavango. The Mbunza and Rumango farming systems depend on controlled water distribution from the river channel to the recession fields. 200 meters of mainline with adjustable gate valves. Requires pump unit, sold separately.",
    image: "/images/equip-irrigation.png",
    features: ["200m Mainline", "Gated Outlets", "Modular Design"],
    category: "Irrigation",
    hostName: "Thikusho Murangi",
    hostPhone: "+26481234022",
    available: true,
  },
  {
    _id: "demo-equip-9",
    title: "Seasonal Flood Pump Station",
    type: "equipment",
    region: "Oshana Region",
    price: 60000,
    description:
      "Diesel-driven axial-flow pump for managing oshana floodwater onto raised mahangu beds. The Kwanyama agricultural system in the central-north depends on controlled seasonal inundation. This unit moves water from the shallow channels into the cultivation basins during the rainy season. Frame-mounted for seasonal setup and removal.",
    image: "/images/equip-flood-pump.png",
    features: ["Axial Flow", "Diesel Driven", "Seasonal Deploy"],
    category: "Irrigation",
    hostName: "Shikongo yaNangolo",
    hostPhone: "+26481234023",
    available: true,
  },
  {
    _id: "demo-equip-10",
    title: "Portable Stock Scale Unit",
    type: "equipment",
    region: "Karas Region",
    price: 55000,
    description:
      "Transportable livestock weighing system with digital load cells and corral panels. Designed for karakul and Boer goat operations common to the Karas sheep stations. Breaks down for bakkie transport between remote camps. Critical for managing breeding stock condition in the arid south where feed fluctuates sharply by season.",
    image: "/images/equip-stock-scale.png",
    features: ["Digital Load Cells", "Corral Panels", "Portable"],
    category: "Livestock Equipment",
    hostName: "Elias Kooper",
    hostPhone: "+26481234024",
    available: true,
  },
];

const ALL_DEMO = [...DEMO_STAYS, ...DEMO_EQUIPMENT];

// ─── Hooks ─────────────────────────────────────────────────────────

export function useListings(type: "stay" | "equipment") {
  const [data, setData] = useState<any[] | null>(null);
  const currentTypeRef = useRef(type);

  useEffect(() => {
    currentTypeRef.current = type;
    let cancelled = false;

    async function fetchListings() {
      try {
        const res = await fetch(`/api/listings?type=${type}`);
        if (res.ok && !cancelled) {
          const raw = await res.json();
          const mapped = raw.map((item: any) => ({
            _id: item.id,
            title: item.title,
            type: item.type,
            region: item.region,
            price: item.price,
            description: item.description,
            image: item.imageUrl,
            features: item.features ? item.features.split(",") : [],
            category: item.category,
            hostName: item.hostName,
            hostPhone: item.hostPhone,
            available: item.available,
          }));
          if (!cancelled) setData(mapped);
          return;
        }
      } catch {
        // REST failed, use demo data
      }
      // Fallback to static demo data
      if (!cancelled) {
        setData(type === "stay" ? DEMO_STAYS : DEMO_EQUIPMENT);
      }
    }

    fetchListings();

    return () => {
      cancelled = true;
    };
  }, [type]);

  return { data, isLoading: data === null, source: "rest" };
}

export function useListing(id: string) {
  const [data, setData] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings?id=${encodeURIComponent(id)}`);
        if (res.ok && !cancelled) {
          const found = await res.json();
          if (found && !found.error) {
            setData({
              _id: found.id,
              title: found.title,
              type: found.type,
              region: found.region,
              price: found.price,
              description: found.description,
              image: found.imageUrl,
              features: found.features ? found.features.split(",") : [],
              category: found.category,
              hostName: found.hostName,
              hostPhone: found.hostPhone,
              available: found.available,
            });
            return;
          }
        }
      } catch {
        // REST failed
      }
      // Fallback to static demo data
      if (!cancelled) {
        const demoItem = ALL_DEMO.find((item) => item._id === id);
        if (demoItem) {
          setData(demoItem);
        } else {
          setNotFound(true);
        }
      }
    }

    fetchListing();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, isLoading: data === null && !notFound, notFound };
}
