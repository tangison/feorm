import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Check if data already exists
    const existing = await db.listing.count();
    if (existing > 0) {
      return NextResponse.json({ message: "Database already seeded", count: existing });
    }

    // Create demo users
    const johan = await db.user.create({
      data: {
        phone: "+264810000000",
        name: "Johan",
        surname: "Deetlefs",
        region: "Khomas",
        role: "lister",
        verified: true,
      },
    });

    const anna = await db.user.create({
      data: {
        phone: "+264810000002",
        name: "Anna",
        surname: "//Khaoes",
        region: "Erongo",
        role: "lister",
        verified: true,
      },
    });

    // Seed listings — 6 stays + 6 equipment
    const listings = await Promise.all([
      // Farm Stays
      db.listing.create({
        data: {
          title: "Otjozondjupa Cattle Farm",
          region: "Central Region",
          price: 85000,
          type: "stay",
          category: "Working Farm",
          description: "Participate in the seasonal cattle harvest. Minimalist accommodations providing direct exposure to authentic pastoral operations. Meals sourced directly from the land.",
          imageUrl: "/images/stay-cattle-farm.png",
          features: "Communal Dining,Livestock Tracking,Borehole Water",
          hostId: johan.id,
          hostName: "Johan Deetlefs",
          hostPhone: "+264810000001",
        },
      }),
      db.listing.create({
        data: {
          title: "Erongo Granite Lodge",
          region: "Coastal Inland",
          price: 120000,
          type: "stay",
          category: "Guest House",
          description: "Structural stone architecture integrated into the raw Erongo mountainside. Off-grid solar provision and extreme isolation for intensive operational retreats.",
          imageUrl: "/images/stay-granite-lodge.png",
          features: "Off-grid Solar,Hiking Trails,High Altitude",
          hostId: anna.id,
          hostName: "Anna //Khaoes",
          hostPhone: "+264810000002",
        },
      }),
      db.listing.create({
        data: {
          title: "Khomas Bush Walk",
          region: "Highlands",
          price: 65000,
          type: "stay",
          category: "Tent Camp",
          description: "Utilitarian canvas structures elevated on timber platforms. Focus on ecological observation and minimal impact habitation.",
          imageUrl: "/images/stay-bush-walk.png",
          features: "Guided Walks,Firepit,Composting Toilet",
          hostId: johan.id,
          hostName: "Pieter Gaseb",
          hostPhone: "+264810000003",
        },
      }),
      db.listing.create({
        data: {
          title: "Kunene River Camp",
          region: "Northwest",
          price: 95000,
          type: "stay",
          category: "Tent Camp",
          description: "Desert oasis encampment perched above the Kunene River gorge. Canvas pavilions on raised timber decks with panoramic canyon views. Guided river crossings and Himba cultural exchange available.",
          imageUrl: "/images/stay-river-camp.png",
          features: "Canyon Views,River Access,Cultural Exchange",
          hostId: johan.id,
          hostName: "Tjipuka Tjivikua",
          hostPhone: "+264810000006",
        },
      }),
      db.listing.create({
        data: {
          title: "Kalahari Goat Station",
          region: "Southern",
          price: 55000,
          type: "stay",
          category: "Working Farm",
          description: "Working goat station on the edge of the Kalahari. Participate in seasonal herding across red dune landscapes. Stone kraal accommodations with traditional braai facilities.",
          imageUrl: "/images/stay-goat-station.png",
          features: "Goat Herding,Red Dunes,Traditional Braai",
          hostId: johan.id,
          hostName: "Frikkie Boois",
          hostPhone: "+264810000004",
        },
      }),
      db.listing.create({
        data: {
          title: "Caprivi Wetlands Lodge",
          region: "Zambezi",
          price: 110000,
          type: "stay",
          category: "Eco Lodge",
          description: "Stilted timber cabins above the Caprivi floodplains. Unparalleled access to river delta ecosystems. Guided mokoro excursions and birding treks included in seasonal packages.",
          imageUrl: "/images/stay-wetlands-lodge.png",
          features: "River Delta,Mokoro Excursions,Bird Watching",
          hostId: anna.id,
          hostName: "Muyunda Likoro",
          hostPhone: "+264810000007",
        },
      }),
      // Equipment
      db.listing.create({
        data: {
          title: "John Deere 5075E",
          region: "Khomas Region",
          price: 150000,
          type: "equipment",
          category: "Machinery",
          description: "75HP utility tractor. Clean service record. Optimized for dry-season plowing. Escrow protection and condition reporting mandatory prior to ignition.",
          imageUrl: "/images/equip-tractor.png",
          features: "75 Horsepower,Diesel,Operator Optional",
          hostId: johan.id,
          hostName: "Johan Deetlefs",
          hostPhone: "+264810000001",
        },
      }),
      db.listing.create({
        data: {
          title: "Industrial Water Pump",
          region: "Hardap Region",
          price: 40000,
          type: "equipment",
          category: "Irrigation",
          description: "High-pressure diesel pump unit designed for seasonal deep-well extraction. Includes 10 meters of industrial-grade layflat piping.",
          imageUrl: "/images/equip-pump.png",
          features: "High Pressure,10m Piping,Portable",
          hostId: johan.id,
          hostName: "Frikkie Boois",
          hostPhone: "+264810000004",
        },
      }),
      db.listing.create({
        data: {
          title: "Disc Harrow Implement",
          region: "Omaheke",
          price: 35000,
          type: "equipment",
          category: "Attachment",
          description: "Heavy-duty steel disc harrow for soil preparation. Standard three-point hitch compatible.",
          imageUrl: "/images/equip-harrow.png",
          features: "3-Point Hitch,Heavy Steel,No Power Required",
          hostId: johan.id,
          hostName: "Kaita Tjirare",
          hostPhone: "+264810000005",
        },
      }),
      db.listing.create({
        data: {
          title: "Borehole Drilling Rig",
          region: "Kunene Region",
          price: 280000,
          type: "equipment",
          category: "Heavy Machinery",
          description: "Truck-mounted rotary drilling rig capable of 200m borehole depth. Includes mud pump and casing equipment. Operator with 12 years experience available at additional cost.",
          imageUrl: "/images/equip-drilling-rig.png",
          features: "200m Depth,Mud Pump Included,Operator Available",
          hostId: johan.id,
          hostName: "Hannes van Wyk",
          hostPhone: "+264810000008",
        },
      }),
      db.listing.create({
        data: {
          title: "5kW Solar Panel Array",
          region: "Erongo Region",
          price: 65000,
          type: "equipment",
          category: "Energy",
          description: "Complete off-grid photovoltaic system. 16 mono-crystalline panels, inverter, and battery bank. Portable mounting frames for seasonal relocation.",
          imageUrl: "/images/equip-solar-array.png",
          features: "5kW Output,Battery Bank,Portable Frames",
          hostId: anna.id,
          hostName: "Anna //Khaoes",
          hostPhone: "+264810000002",
        },
      }),
      db.listing.create({
        data: {
          title: "Crop Harvesting Unit",
          region: "Otjozondjupa",
          price: 200000,
          type: "equipment",
          category: "Machinery",
          description: "Full-size agricultural harvesting unit suitable for wheat, maize, and sunflower crops. GPS-guided auto-steer with yield mapping. Requires 150HP minimum tractor for transport.",
          imageUrl: "/images/equip-combine.png",
          features: "GPS Auto-Steer,Yield Mapping,Multi-Crop",
          hostId: johan.id,
          hostName: "Johan Deetlefs",
          hostPhone: "+264810000001",
        },
      }),
    ]);

    return NextResponse.json({
      message: "Database seeded successfully",
      users: 2,
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
