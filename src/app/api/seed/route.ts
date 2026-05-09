import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Check if data already exists
    const existing = await db.listing.count();
    if (existing > 0) {
      return NextResponse.json({ message: "Database already seeded", count: existing });
    }

    // Create demo user
    const user = await db.user.create({
      data: {
        phone: "+264810000000",
        name: "Johan",
        surname: "Deetlefs",
        region: "Khomas",
        role: "lister",
        verified: true,
      },
    });

    // Seed listings
    const listings = await Promise.all([
      db.listing.create({
        data: {
          title: "Otjozondjupa Cattle Farm",
          region: "Central Region",
          price: 85000,
          type: "stay",
          category: "Working Farm",
          description: "Participate in the seasonal cattle harvest. Minimalist accommodations providing direct exposure to authentic pastoral operations. Meals sourced directly from the land.",
          imageUrl: "/images/stay-cattle-farm.jpg",
          features: "Communal Dining,Livestock Tracking,Borehole Water",
          hostId: user.id,
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
          imageUrl: "/images/stay-granite-lodge.jpg",
          features: "Off-grid Solar,Hiking Trails,High Altitude",
          hostId: user.id,
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
          imageUrl: "/images/stay-bush-walk.jpg",
          features: "Guided Walks,Firepit,Composting Toilet",
          hostId: user.id,
          hostName: "Pieter Gaseb",
          hostPhone: "+264810000003",
        },
      }),
      db.listing.create({
        data: {
          title: "John Deere 5075E",
          region: "Khomas Region",
          price: 150000,
          type: "equipment",
          category: "Machinery",
          description: "75HP utility tractor. Clean service record. Optimized for dry-season plowing. Escrow protection and condition reporting mandatory prior to ignition.",
          imageUrl: "/images/equip-tractor.jpg",
          features: "75 Horsepower,Diesel,Operator Optional",
          hostId: user.id,
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
          imageUrl: "/images/equip-pump.jpg",
          features: "High Pressure,10m Piping,Portable",
          hostId: user.id,
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
          imageUrl: "/images/equip-harrow.jpg",
          features: "3-Point Hitch,Heavy Steel,No Power Required",
          hostId: user.id,
          hostName: "Kaita Tjirare",
          hostPhone: "+264810000005",
        },
      }),
    ]);

    return NextResponse.json({
      message: "Database seeded successfully",
      user: user.id,
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
