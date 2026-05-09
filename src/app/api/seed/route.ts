import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Check if data already exists
    const existing = await db.listing.count();
    if (existing > 0) {
      return NextResponse.json({ message: "Database already seeded", count: existing });
    }

    // Create demo users representing diverse Namibian regions and communities
    const users = await Promise.all([
      db.user.create({
        data: {
          phone: "+26481234001",
          name: "Muyunda",
          surname: "Likoro",
          region: "Zambezi",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234002",
          name: "Mukuve",
          surname: "Munika",
          region: "Kavango East",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234003",
          name: "Rukoro",
          surname: "Mbambo",
          region: "Kavango West",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234004",
          name: "Amadhila",
          surname: "Nanyeni",
          region: "Ohangwena",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234005",
          name: "Nangolo",
          surname: "Sheelongo",
          region: "Oshana",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234006",
          name: "Iilonga",
          surname: "Nashilongo",
          region: "Omusati",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234007",
          name: "Ndapanda",
          surname: "Hamunyela",
          region: "Oshikoto",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234008",
          name: "Tjipuka",
          surname: "Tjivikua",
          region: "Kunene",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234009",
          name: "Anna",
          surname: "//Khaoes",
          region: "Erongo",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234010",
          name: "Tjitendero",
          surname: "Kavari",
          region: "Otjozondjupa",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234011",
          name: "Pieter",
          surname: "Gaseb",
          region: "Khomas",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234012",
          name: "Frikkie",
          surname: "Boois",
          region: "Hardap",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234013",
          name: "Kooper",
          surname: "||Khauxa",
          region: "Karas",
          role: "lister",
          verified: true,
        },
      }),
      db.user.create({
        data: {
          phone: "+26481234014",
          name: "Kahumba",
          surname: "Rukero",
          region: "Omaheke",
          role: "lister",
          verified: true,
        },
      }),
    ]);

    // Map users by index for easy reference
    const [
      zambezi, kavangoEast, kavangoWest, ohangwena, oshana,
      omusati, oshikoto, kunene, erongo, otjozondjupa,
      khomas, hardap, karas, omaheke,
    ] = users;

    // Seed listings — 14 stays (all regions) + 10 equipment
    const listings = await Promise.all([
      // ─── Farm Stays (one per region) ────────────────────────
      db.listing.create({
        data: {
          title: "Zambezi Floodplain Lodge",
          region: "Zambezi Region",
          price: 110000,
          type: "stay",
          category: "Eco Lodge",
          description: "Stilted timber cabins above the Caprivi floodplains. The Lozi and Mafwe communities have cultivated these seasonal wetlands for generations, and the lodge operates in coordination with their flood-cycle calendar. Guided mokoro excursions through the delta channels and seasonal fishing with local handlers. Reed-and-timber construction elevated above peak flood line.",
          imageUrl: "/images/stay-wetlands-lodge.png",
          features: "River Delta,Mokoro Excursions,Seasonal Fishing",
          hostId: zambezi.id,
          hostName: "Muyunda Likoro",
          hostPhone: "+26481234001",
        },
      }),
      db.listing.create({
        data: {
          title: "Kavango River Mahangu Station",
          region: "Kavango East",
          price: 62000,
          type: "stay",
          category: "Working Farm",
          description: "Riverside mahangu station along the Okavango. The Mbunza have practiced flood-retreat cultivation along this stretch for centuries, planting as the river recedes. Participate in the traditional planting and harvesting cycles. Timber platform with woven reed walls, positioned above the high-water mark.",
          imageUrl: "/images/stay-kavango-east.png",
          features: "River Access,Mahangu Cultivation,Reed Architecture",
          hostId: kavangoEast.id,
          hostName: "Mukuve Munika",
          hostPhone: "+26481234002",
        },
      }),
      db.listing.create({
        data: {
          title: "Kavango West Flood-Retreat Plot",
          region: "Kavango West",
          price: 58000,
          type: "stay",
          category: "Working Farm",
          description: "Working flood-retreat farm on the western Okavango bank. The Sambyu and Gciriku communities maintain intercropping systems unique to this river corridor, combining mahangu with groundnuts and pumpkins in a single field. Clay-walled compound with thatched roofing and direct river access for seasonal irrigation channels.",
          imageUrl: "/images/stay-kavango-west.png",
          features: "Flood-Retreat Farming,Intercropping,River Access",
          hostId: kavangoWest.id,
          hostName: "Rukoro Mbambo",
          hostPhone: "+26481234003",
        },
      }),
      db.listing.create({
        data: {
          title: "Ohangwena Mahangu Homestead",
          region: "Ohangwena Region",
          price: 48000,
          type: "stay",
          category: "Working Farm",
          description: "Traditional Kwambi homestead set among mahangu fields and cuca shop trading posts. The Ohangwena corridor sustains dense rural settlement where mahangu remains the staple grain and communal labor organizes the harvest. Clay-brick compound with a central courtyard used for threshing and winnowing during the May season.",
          imageUrl: "/images/stay-ohangwena.png",
          features: "Mahangu Harvest,Cuca Shop Route,Threshing Court",
          hostId: ohangwena.id,
          hostName: "Amadhila Nanyeni",
          hostPhone: "+26481234004",
        },
      }),
      db.listing.create({
        data: {
          title: "Oshana Floodplain Homestead",
          region: "Oshana Region",
          price: 45000,
          type: "stay",
          category: "Working Farm",
          description: "Traditional Kwanyama homestead on the edge of the oshana basin. The shallow seasonal floodplains define agriculture here: mahangu on raised beds, fishing in the channels, and livestock grazing on receding waterlines. Clay-walled compound with thatched roofing and a palisade of mopane posts.",
          imageUrl: "/images/stay-oshana.png",
          features: "Mahangu Harvesting,Oshana Fishing,Traditional Compound",
          hostId: oshana.id,
          hostName: "Nangolo Sheelongo",
          hostPhone: "+26481234005",
        },
      }),
      db.listing.create({
        data: {
          title: "Omusati Palmland Homestead",
          region: "Omusati Region",
          price: 42000,
          type: "stay",
          category: "Working Farm",
          description: "Kwanyama and Ndonga homestead among the makalani palm groves of northern Omusati. The palm provides wine, basket fiber, and structural timber, integral to the domestic economy of this densely settled region. Traditional compound with a stock enclosure and grain store, built from anthill clay and palm thatch.",
          imageUrl: "/images/stay-omusati.png",
          features: "Palm Wine Season,Basket Weaving,Makalani Grove",
          hostId: omusati.id,
          hostName: "Iilonga Nashilongo",
          hostPhone: "+26481234006",
        },
      }),
      db.listing.create({
        data: {
          title: "Oshikoto Lakeside Compound",
          region: "Oshikoto Region",
          price: 55000,
          type: "stay",
          category: "Guest House",
          description: "Ndonga community compound near the shores of Lake Oshikoto, one of Namibia's few natural lakes. The surrounding area supports mahangu cultivation and cattle grazing alongside copper mining operations that employ much of the local population. Fired-brick compound with a shaded veranda facing the lake basin.",
          imageUrl: "/images/stay-oshikoto.png",
          features: "Lake Access,Mahangu Fields,Copper Belt",
          hostId: oshikoto.id,
          hostName: "Ndapanda Hamunyela",
          hostPhone: "+26481234007",
        },
      }),
      db.listing.create({
        data: {
          title: "Kunene Desert Pasture Camp",
          region: "Kunene Region",
          price: 95000,
          type: "stay",
          category: "Tent Camp",
          description: "Desert pasture camp in the rugged northwest. Himba pastoralists maintain goat and cattle herds across this arid landscape, moving between seasonal grazing grounds using knowledge passed through generations. The camp operates with their coordination, offering direct observation of desert pastoralism and seasonal goat management. Canvas pavilions on raised timber decks with canyon views.",
          imageUrl: "/images/stay-river-camp.png",
          features: "Desert Pastoralism,Goat Herding,Canyon Views",
          hostId: kunene.id,
          hostName: "Tjipuka Tjivikua",
          hostPhone: "+26481234008",
        },
      }),
      db.listing.create({
        data: {
          title: "Erongo Granite Lodge",
          region: "Erongo Region",
          price: 120000,
          type: "stay",
          category: "Guest House",
          description: "Structural stone architecture integrated into the raw Erongo mountainside. The Damara and Nama communities of this region carry deep ties to the granite massif, its mineral deposits, and the coastal desert that defines the western boundary. Off-grid solar provision and extreme isolation for intensive retreats. Mine-track hiking routes accessible from the property.",
          imageUrl: "/images/stay-granite-lodge.png",
          features: "Off-grid Solar,Hiking Trails,High Altitude",
          hostId: erongo.id,
          hostName: "Anna //Khaoes",
          hostPhone: "+26481234009",
        },
      }),
      db.listing.create({
        data: {
          title: "Otjozondjupa Bushveld Station",
          region: "Otjozondjupa Region",
          price: 85000,
          type: "stay",
          category: "Working Farm",
          description: "Cattle station in the bushveld east of the Waterberg. Herero pastoralists have run cattle across this ground since the 19th century, maintaining herding practices shaped by the plateau ecology. The station supports seasonal cattle work, veld management, and bush clearing. Stone-and-timber lodge with a wide stoop facing the drainage line.",
          imageUrl: "/images/stay-cattle-farm.png",
          features: "Cattle Operations,Waterberg Proximity,Veld Management",
          hostId: otjozondjupa.id,
          hostName: "Tjitendero Kavari",
          hostPhone: "+26481234010",
        },
      }),
      db.listing.create({
        data: {
          title: "Khomas Highland Camp",
          region: "Khomas Region",
          price: 65000,
          type: "stay",
          category: "Tent Camp",
          description: "Utilitarian canvas structures elevated on timber platforms in the Windhoek highlands. The Khomas Region supports a mix of commercial agriculture and commuter pastoralism, where smallstock owners from the city maintain weekend operations. Focus on ecological observation and minimal-impact habitation. Guided walks through the highland savanna available.",
          imageUrl: "/images/stay-bush-walk.png",
          features: "Guided Walks,Firepit,Composting Toilet",
          hostId: khomas.id,
          hostName: "Pieter Gaseb",
          hostPhone: "+26481234011",
        },
      }),
      db.listing.create({
        data: {
          title: "Hardap Kalahari Goat Station",
          region: "Hardap Region",
          price: 55000,
          type: "stay",
          category: "Working Farm",
          description: "Working goat station on the Kalahari fringe. The Nama and Afrikaner communities of Hardap have bred Boer goats across this semi-arid transition zone for over a century, developing hardy stock adapted to the red sands and sparse graze. Date palms line the irrigation channels from the Hardap Dam. Stone kraal accommodations with traditional braai facilities.",
          imageUrl: "/images/stay-goat-station.png",
          features: "Goat Herding,Red Dunes,Traditional Braai",
          hostId: hardap.id,
          hostName: "Frikkie Boois",
          hostPhone: "+26481234012",
        },
      }),
      db.listing.create({
        data: {
          title: "Karas Canyon Sheep Station",
          region: "Karas Region",
          price: 72000,
          type: "stay",
          category: "Working Farm",
          description: "Karakul sheep station in the arid south near the Fish River Canyon. The Nama and Afrikaner farming families of Karas have raised peltsheep in this desert scrubland since the early 20th century, developing drought-resistant flock management methods. The station operates on minimal water infrastructure with extensive veld grazing. Stone farmhouse with thick walls and a covered working yard.",
          imageUrl: "/images/stay-karas.png",
          features: "Karakul Sheep,Canyon Proximity,Desert Veld",
          hostId: karas.id,
          hostName: "Kooper ||Khauxa",
          hostPhone: "+26481234013",
        },
      }),
      db.listing.create({
        data: {
          title: "Omaheke Sandveld Cattle Post",
          region: "Omaheke Region",
          price: 68000,
          type: "stay",
          category: "Working Farm",
          description: "Deep Kalahari cattle post in the Omaheke sandveld. Herero and Tswana pastoralists maintain seasonal cattle movements across this sandy grassland, while San communities hold tracking and veld-knowledge traditions critical to navigating the terrain. The post supports seasonal cattle work, borehole maintenance, and veld monitoring. Timber-frame shelter with canvas walls and a kraal of camelthorn posts.",
          imageUrl: "/images/stay-omaheke.png",
          features: "Cattle Posts,Kalahari Tracking,Borehole Access",
          hostId: omaheke.id,
          hostName: "Kahumba Rukero",
          hostPhone: "+26481234014",
        },
      }),
      // ─── Equipment (10 listings) ────────────────────────────
      db.listing.create({
        data: {
          title: "John Deere 5075E",
          region: "Khomas Region",
          price: 150000,
          type: "equipment",
          category: "Machinery",
          description: "75HP utility tractor. Clean service record. Optimized for dry-season plowing on the Khomas highland soils. Escrow protection and condition reporting mandatory prior to ignition.",
          imageUrl: "/images/equip-tractor.png",
          features: "75 Horsepower,Diesel,Operator Optional",
          hostId: khomas.id,
          hostName: "Johan Deetlefs",
          hostPhone: "+26481234015",
        },
      }),
      db.listing.create({
        data: {
          title: "Industrial Water Pump",
          region: "Hardap Region",
          price: 40000,
          type: "equipment",
          category: "Irrigation",
          description: "High-pressure diesel pump unit designed for seasonal deep-well extraction. Includes 10 meters of industrial-grade layflat piping. Suited for the Hardap irrigation channels and borehole systems.",
          imageUrl: "/images/equip-pump.png",
          features: "High Pressure,10m Piping,Portable",
          hostId: hardap.id,
          hostName: "Frikkie Boois",
          hostPhone: "+26481234016",
        },
      }),
      db.listing.create({
        data: {
          title: "Disc Harrow Implement",
          region: "Omaheke Region",
          price: 35000,
          type: "equipment",
          category: "Attachment",
          description: "Heavy-duty steel disc harrow for soil preparation in the Omaheke sandveld. Standard three-point hitch compatible. Designed for breaking compacted Kalahari sand after seasonal rain.",
          imageUrl: "/images/equip-harrow.png",
          features: "3-Point Hitch,Heavy Steel,No Power Required",
          hostId: omaheke.id,
          hostName: "Kaita Tjirare",
          hostPhone: "+26481234017",
        },
      }),
      db.listing.create({
        data: {
          title: "Borehole Drilling Rig",
          region: "Kunene Region",
          price: 280000,
          type: "equipment",
          category: "Heavy Machinery",
          description: "Truck-mounted rotary drilling rig capable of 200m borehole depth. Essential infrastructure for the arid northwest where groundwater access determines pastoral viability. Includes mud pump and casing equipment. Operator with 12 years experience available at additional cost. Minimum 3-day rental period.",
          imageUrl: "/images/equip-drilling-rig.png",
          features: "200m Depth,Mud Pump Included,Operator Available",
          hostId: kunene.id,
          hostName: "Hannes van Wyk",
          hostPhone: "+26481234018",
        },
      }),
      db.listing.create({
        data: {
          title: "5kW Solar Panel Array",
          region: "Erongo Region",
          price: 65000,
          type: "equipment",
          category: "Energy",
          description: "Complete off-grid photovoltaic system. 16 mono-crystalline panels, inverter, and battery bank. Portable mounting frames for seasonal relocation. Designed for remote Erongo operations beyond the grid reach.",
          imageUrl: "/images/equip-solar-array.png",
          features: "5kW Output,Battery Bank,Portable Frames",
          hostId: erongo.id,
          hostName: "Anna //Khaoes",
          hostPhone: "+26481234019",
        },
      }),
      db.listing.create({
        data: {
          title: "Crop Harvesting Unit",
          region: "Otjozondjupa Region",
          price: 200000,
          type: "equipment",
          category: "Machinery",
          description: "Full-size agricultural harvesting unit suitable for wheat, maize, and sunflower crops. GPS-guided auto-steer with yield mapping. Requires 150HP minimum tractor for transport. Seasonal availability only. Suited to the Otjozondjupa bushveld commercial operations.",
          imageUrl: "/images/equip-combine.png",
          features: "GPS Auto-Steer,Yield Mapping,Multi-Crop",
          hostId: otjozondjupa.id,
          hostName: "Johan Deetlefs",
          hostPhone: "+26481234020",
        },
      }),
      db.listing.create({
        data: {
          title: "Mahangu Thresher",
          region: "Ohangwena Region",
          price: 45000,
          type: "equipment",
          category: "Machinery",
          description: "Compact diesel-powered thresher designed for pearl millet, the staple grain of northern Namibia. Processes mahangu heads at rate suitable for smallholder operations in the Ohangwena corridor. Trailer-mounted for transport between homesteads. Operated by community cooperatives during the May-July harvest window.",
          imageUrl: "/images/equip-thresher.png",
          features: "Diesel Powered,Trailer Mounted,Smallholder Scale",
          hostId: ohangwena.id,
          hostName: "Hilja Amukana",
          hostPhone: "+26481234021",
        },
      }),
      db.listing.create({
        data: {
          title: "Irrigation Pipeline System",
          region: "Kavango East",
          price: 85000,
          type: "equipment",
          category: "Irrigation",
          description: "Modular aluminum irrigation pipeline with gated outlets, designed for flood-retreat cultivation along the Okavango. The Mbunza and Rumango farming systems depend on controlled water distribution from the river channel to the recession fields. 200 meters of mainline with adjustable gate valves. Requires pump unit, sold separately.",
          imageUrl: "/images/equip-irrigation.png",
          features: "200m Mainline,Gated Outlets,Modular Design",
          hostId: kavangoEast.id,
          hostName: "Thikusho Murangi",
          hostPhone: "+26481234022",
        },
      }),
      db.listing.create({
        data: {
          title: "Seasonal Flood Pump Station",
          region: "Oshana Region",
          price: 60000,
          type: "equipment",
          category: "Irrigation",
          description: "Diesel-driven axial-flow pump for managing oshana floodwater onto raised mahangu beds. The Kwanyama agricultural system in the central-north depends on controlled seasonal inundation. This unit moves water from the shallow channels into the cultivation basins during the rainy season. Frame-mounted for seasonal setup and removal.",
          imageUrl: "/images/equip-flood-pump.png",
          features: "Axial Flow,Diesel Driven,Seasonal Deploy",
          hostId: oshana.id,
          hostName: "Shikongo yaNangolo",
          hostPhone: "+26481234023",
        },
      }),
      db.listing.create({
        data: {
          title: "Portable Stock Scale Unit",
          region: "Karas Region",
          price: 55000,
          type: "equipment",
          category: "Livestock Equipment",
          description: "Transportable livestock weighing system with digital load cells and corral panels. Designed for karakul and Boer goat operations common to the Karas sheep stations. Breaks down for bakkie transport between remote camps. Critical for managing breeding stock condition in the arid south where feed fluctuates sharply by season.",
          imageUrl: "/images/equip-stock-scale.png",
          features: "Digital Load Cells,Corral Panels,Portable",
          hostId: karas.id,
          hostName: "Elias Kooper",
          hostPhone: "+26481234024",
        },
      }),
    ]);

    return NextResponse.json({
      message: "Database seeded successfully",
      users: users.length,
      listings: listings.length,
    });
  } catch (e) {
    console.error("Seed error:", e);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
