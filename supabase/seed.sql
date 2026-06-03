-- ============================================================
-- Feorm — Seed Data (Namibian Demo Listings)
-- Run this in the Supabase SQL Editor manually.
-- DO NOT run automatically — paste and execute as needed.
-- ============================================================

-- ─── Seed host profiles ──────────────────────────────────────
-- These must exist before listings because host_id references profiles(id)
-- NOTE: These UUIDs are placeholders. Replace with real auth.users IDs
--       after running the app and creating accounts via magic link.
--       For development only — the FK constraint to auth.users may need
--       to be relaxed or these profiles inserted via the app API.

INSERT INTO profiles (id, name, surname, phone, region, role, verified)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Aisha', 'Mwangi', '+264 81 234 5678', 'Oshikoto', 'provider_stay', true),
  ('a0000000-0000-0000-0000-000000000002', 'Johan', 'Pretorius', '+264 81 345 6789', 'Khomas', 'provider_stay', true),
  ('a0000000-0000-0000-0000-000000000003', 'Tangeni', 'Nambinga', '+264 81 901 2345', 'Oshana', 'provider_equipment', true),
  ('a0000000-0000-0000-0000-000000000004', 'Maria', 'Goreses', '+264 81 456 7801', 'Erongo', 'provider_equipment', true),
  ('a0000000-0000-0000-0000-000000000005', 'Hafeni', 'Tshivhuli', '+264 81 567 8902', 'Kavango East', 'provider_stay', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 1. Khomas (Windhoek area)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Otjiseva Farm Stay',
  'A peaceful farm stay nestled in the Khomas Hochland with panoramic views of the Auas Mountains. Perfect for weekend getaways from Windhoek. Enjoy guided farm walks, stargazing under pristine skies, and traditional Namibian braai under the camelthorn trees.',
  'stay',
  'Khomas',
  120000,
  '+264 81 234 5678',
  '{}',
  ARRAY['Solar power', 'Borehole water', 'Braai area', 'Hot water', 'Bush view', 'Stargazing deck', 'Guided farm walks'],
  -22.5747,
  17.0832,
  true
);

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Windhoek Tractor Hire',
  'John Deere 5075E utility tractor available for hire with operator. Suitable for ploughing, planting, and transport on farms in the greater Windhoek area. Well-maintained machine with low hours, reliable for seasonal work.',
  'equipment',
  'Khomas',
  280000,
  '+264 81 345 6789',
  '{}',
  ARRAY['Operator included', 'Delivery available', 'Tractor access road', '85HP diesel engine', '4WD', 'Air conditioning'],
  -22.5609,
  17.0645,
  true
);

-- ============================================================
-- 2. Erongo (Swakopmund, Walvis Bay)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'Swakopmund Agro Stay',
  'Coastal farm stay just outside Swakopmund where the desert meets the sea. Experience unique desert farming with fog-harvesting technology and visit the nearby Walvis Bay wetlands. Self-catering kitchen with local produce available.',
  'stay',
  'Erongo',
  180000,
  '+264 81 456 7890',
  '{}',
  ARRAY['WiFi (limited)', 'Self-catering kitchen', 'Hot water', 'Camping allowed', 'Stargazing deck', 'Guided farm walks', 'Solar power'],
  -22.6788,
  14.5256,
  true
);

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'Walvis Bay Water Pump Set',
  'Industrial borehole pump and filtration system available for rent. Ideal for new borehole installations or emergency water supply. Comes with technician for setup and testing.',
  'equipment',
  'Erongo',
  350000,
  '+264 81 567 8901',
  '{}',
  ARRAY['Operator included', 'Delivery available', 'Borehole water', 'Solar power', 'Filtration system included'],
  -22.9574,
  14.5057,
  true
);

-- ============================================================
-- 3. Kunene (Epupa, Opuwo)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Epupa Falls Riverside Lodge',
  'Remote farm stay on the Kunene River with spectacular views of Epupa Falls. Wake to the sound of cascading water and explore Himba village tours. This is one of Namibia''s most dramatic settings — a true bucket-list destination.',
  'stay',
  'Kunene',
  220000,
  '+264 81 678 9012',
  '{}',
  ARRAY['Hot water', 'Bush view', 'Game farm', 'Guided farm walks', 'Horse riding', 'Camping allowed', 'Stargazing deck'],
  -17.0063,
  13.2454,
  true
);

-- ============================================================
-- 4. Otjozondjupa (Okahandja, Grootfontein)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Okahandja Guest Farm',
  'Classic Namibian guest farm set among acacia woodlands near Okahandja. The heart of cattle country with warm hospitality, hearty farm meals, and sundowner drives. Children and pets welcome.',
  'stay',
  'Otjozondjupa',
  95000,
  '+264 81 789 0123',
  '{}',
  ARRAY['Borehole water', 'Braai area', 'Hot water', 'Swimming pool', 'Game farm', 'Camping allowed', 'Self-catering kitchen'],
  -21.9823,
  16.9187,
  true
);

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Grootfontein Combine Harvester',
  'New Holland CR7.90 combine harvester available for seasonal grain harvesting. High-capacity machine with GPS guidance. Book early for the harvest season — demand is high in the Maize Triangle.',
  'equipment',
  'Otjozondjupa',
  450000,
  '+264 81 890 1234',
  '{}',
  ARRAY['Operator included', 'Delivery available', 'GPS guidance', 'High capacity', 'Tractor access road'],
  -19.5666,
  18.1178,
  true
);

-- ============================================================
-- 5. Oshana (Oshakati)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Oshakati Mahangu Farm',
  'Traditional mahangu (pearl millet) farm stay in the heart of Owambo country. Learn about subsistence farming methods passed down through generations. Experience the real northern Namibian way of life with home-cooked oshifima and omboga.',
  'stay',
  'Oshana',
  65000,
  '+264 81 901 2345',
  '{}',
  ARRAY['Borehole water', 'Self-catering kitchen', 'Guided farm walks', 'Camping allowed', 'Hot water'],
  -17.7833,
  15.6833,
  true
);

-- ============================================================
-- 6. Omusati (Outapi)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Outapi Irrigation Pump',
  'Portable diesel irrigation pump suitable for smallholder plots. Can draw from the canal system or boreholes. Essential for dry-season vegetable production in the Cuvelai floodplain.',
  'equipment',
  'Omusati',
  80000,
  '+264 81 012 3456',
  '{}',
  ARRAY['Delivery available', 'Diesel powered', 'Tractor access road', 'Borehole water', 'Canal compatible'],
  -17.5167,
  15.0167,
  true
);

-- ============================================================
-- 7. Ohangwena (Eenhana)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Eenhana Homestead Stay',
  'Authentic Owambo homestead experience near Eenhana. Stay in a traditional palatial homestead and participate in daily farming activities including cattle herding and mahangu pounding. A deeply cultural experience.',
  'stay',
  'Ohangwena',
  45000,
  '+264 81 123 4567',
  '{}',
  ARRAY['Borehole water', 'Guided farm walks', 'Self-catering kitchen', 'Camping allowed', 'Hot water'],
  -17.5697,
  16.3352,
  true
);

-- ============================================================
-- 8. Oshikoto (Tsumeb)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Tsumeb Copper Country Lodge',
  'Farm stay on the edge of the Etosha pan with game viewing and mining history tours. Watch wildlife at the waterhole from your private deck. Close proximity to the Hoba Meteorite — the largest known meteorite on Earth.',
  'stay',
  'Oshikoto',
  150000,
  '+264 81 234 5670',
  '{}',
  ARRAY['Swimming pool', 'Game farm', 'Hot water', 'WiFi (limited)', 'Bush view', 'Stargazing deck', 'Guided farm walks'],
  -19.2433,
  17.7308,
  true
);

-- ============================================================
-- 9. Kavango East (Rundu)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000005',
  'Rundu Riverfront Farm',
  'Lush Kavango riverfront farm stay with tropical gardens and bird-watching paradise. Fish for tigerfish in the Okavango River and explore the nearby Popa Falls. The green belt of Namibia awaits.',
  'stay',
  'Kavango East',
  135000,
  '+264 81 345 6780',
  '{}',
  ARRAY['Borehole water', 'Hot water', 'Bush view', 'Horse riding', 'Swimming pool', 'Self-catering kitchen', 'Guided farm walks'],
  -17.9313,
  19.7654,
  true
);

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'Rundu Irrigation System',
  'Complete drip irrigation kit with pump and 500m of drip line. Perfect for vegetable plots along the Okavango riverbank. Includes setup and training session for first-time users.',
  'equipment',
  'Kavango East',
  180000,
  '+264 81 456 7801',
  '{}',
  ARRAY['Delivery available', 'Operator included', 'Solar power', 'Borehole water', 'Tractor access road'],
  -17.9200,
  19.7500,
  true
);

-- ============================================================
-- 10. Kavango West (Nkurenkuru)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000005',
  'Nkurenkuru Cattle Post',
  'Traditional Kavango cattle post stay on the western banks of the Okavango River. Participate in daily cattle management and learn about the indigenous Kavango farming traditions that have sustained communities for centuries.',
  'stay',
  'Kavango West',
  75000,
  '+264 81 567 8902',
  '{}',
  ARRAY['Borehole water', 'Bush view', 'Camping allowed', 'Hot water', 'Guided farm walks', 'Self-catering kitchen'],
  -17.9854,
  19.1978,
  true
);

-- ============================================================
-- 11. Zambezi (Katima Mulilo)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000005',
  'Katima Mulilo Floodplain Stay',
  'Riverside farm stay in the Zambezi Region (Caprivi Strip) where four countries meet. Explore the wetlands by mokoro, spot hippos and crocodiles, and fish the Zambezi for bream and barbel. A truly wild African experience.',
  'stay',
  'Zambezi',
  165000,
  '+264 81 678 9013',
  '{}',
  ARRAY['Hot water', 'Bush view', 'Game farm', 'Camping allowed', 'Horse riding', 'Guided farm walks', 'Swimming pool'],
  -17.4938,
  24.2639,
  true
);

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Katima Mulilo Ploughing Unit',
  'Massey Ferguson 4708 tractor with 4-furrow plough and disc harrow. Available with experienced operator for land preparation in the fertile Zambezi floodplains. Minimum 2-day hire.',
  'equipment',
  'Zambezi',
  320000,
  '+264 81 789 0124',
  '{}',
  ARRAY['Operator included', 'Delivery available', 'Tractor access road', '85HP diesel', '4WD', 'Air conditioning'],
  -17.5000,
  24.2500,
  true
);

-- ============================================================
-- 12. Omaheke (Gobabis)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Gobabis Cattle Ranch',
  'Working cattle ranch in the Omaheke — Namibia''s cattle country. Experience daily ranch life, assist with cattle drives, and enjoy the vast golden grasslands stretching to the Botswana border. Authentic cowboy culture meets African wilderness.',
  'stay',
  'Omaheke',
  110000,
  '+264 81 890 1235',
  '{}',
  ARRAY['Borehole water', 'Braai area', 'Hot water', 'Horse riding', 'Game farm', 'Guided farm walks', 'Bush view'],
  -22.4494,
  18.9681,
  true
);

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Gobabis Livestock Trailer',
  'Heavy-duty 16-ton livestock trailer for cattle and small stock transport. Roadworthy with all permits up to date. Can be paired with our truck and driver for complete transport solution.',
  'equipment',
  'Omaheke',
  150000,
  '+264 81 901 2346',
  '{}',
  ARRAY['Operator included', 'Delivery available', 'Tractor access road', '16-ton capacity', 'Roadworthy certified'],
  -22.4500,
  18.9700,
  true
);

-- ============================================================
-- 13. Hardap (Mariental)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Mariental Kalahari Retreat',
  'Kalahari desert farm stay with red dune views and abundant wildlife. Home to gemsbok, springbok, and meerkat colonies. Watch the sunset paint the dunes while enjoying a cold Windhoek Lager at the braai area.',
  'stay',
  'Hardap',
  98000,
  '+264 81 012 3457',
  '{}',
  ARRAY['Solar power', 'Borehole water', 'Braai area', 'Hot water', 'Game farm', 'Stargazing deck', 'Camping allowed'],
  -24.6333,
  17.9500,
  true
);

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'Mariental Borehole Drilling Rig',
  'Portable borehole drilling rig capable of drilling to 200m depth. Includes compressor, drill rods, and casing. Experienced drilling crew available. Essential for new farm water supply in the Hardap region.',
  'equipment',
  'Hardap',
  450000,
  '+264 81 123 4568',
  '{}',
  ARRAY['Operator included', 'Delivery available', 'Tractor access road', '200m depth capacity', 'Borehole water'],
  -24.6400,
  17.9600,
  true
);

-- ============================================================
-- 14. //Karas (Keetmanshoop, Lüderitz)
-- ============================================================

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Keetmanshoop Karas Mountain Lodge',
  'Dramatic mountain lodge in the //Karas region with ancient quiver tree forests and rock formations. Explore the Fish River Canyon — the second largest canyon in the world. Cool desert nights with spectacular stargazing.',
  'stay',
  '//Karas',
  190000,
  '+264 81 234 5679',
  '{}',
  ARRAY['Solar power', 'Hot water', 'Bush view', 'Stargazing deck', 'WiFi (limited)', 'Game farm', 'Guided farm walks'],
  -26.5818,
  18.1284,
  true
);

INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'Lüderitz Solar Generator',
  'Mobile solar generator unit (10kVA) suitable for off-grid farm operations. Silent operation with battery storage for nighttime use. Perfect for remote Karas farms needing reliable power without diesel costs.',
  'equipment',
  '//Karas',
  220000,
  '+264 81 345 6782',
  '{}',
  ARRAY['Delivery available', 'Solar power', '10kVA output', 'Battery storage', 'Silent operation'],
  -26.6453,
  15.1550,
  true
);

-- ============================================================
-- Additional listings to round out the dataset
-- ============================================================

-- Extra Khomas: luxury stay
INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Khomas Hochland Luxury Camp',
  'Exclusive glamping experience in the Khomas Hochland mountains. Luxury safari tents with en-suite bathrooms and private decks. Gourmet farm-to-table dining under the stars. Only 30 minutes from Windhoek but a world away.',
  'stay',
  'Khomas',
  220000,
  '+264 81 456 7803',
  '{}',
  ARRAY['Swimming pool', 'Hot water', 'WiFi (limited)', 'Stargazing deck', 'Braai area', 'Guided farm walks', 'Bush view'],
  -22.7500,
  16.8500,
  true
);

-- Extra Erongo: equipment
INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'Usakos Front-End Loader',
  'CAT 950GC front-end loader for earthmoving, loading, and material handling. Ideal for farm road construction, dam building, and general earthworks. Available with certified operator.',
  'equipment',
  'Erongo',
  380000,
  '+264 81 567 8904',
  '{}',
  ARRAY['Operator included', 'Delivery available', 'Tractor access road', '2.5m bucket', 'Air conditioning'],
  -22.0167,
  15.6000,
  true
);

-- Extra Kunene: equipment
INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Opuwo Water Tanker',
  '10,000-litre water tanker truck for livestock and domestic water delivery. Serves farms in the arid Kunene region where boreholes run dry. Reliable weekly or on-demand delivery schedules available.',
  'equipment',
  'Kunene',
  120000,
  '+264 81 678 9015',
  '{}',
  ARRAY['Delivery available', 'Operator included', '10,000L capacity', 'Tractor access road'],
  -18.0667,
  13.8167,
  true
);

-- Extra Otjozondjupa: stay
INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Waterberg Plateau Farmhouse',
  'Charming farmhouse at the base of the Waterberg Plateau. Hike the red sandstone cliffs, spot rare sable and roan antelope, and cool off in the natural rock pools. The farm kitchen serves legendary potjiekos.',
  'stay',
  'Otjozondjupa',
  175000,
  '+264 81 789 0126',
  '{}',
  ARRAY['Hot water', 'Swimming pool', 'Game farm', 'Guided farm walks', 'Horse riding', 'Self-catering kitchen', 'Bush view'],
  -20.5054,
  17.2200,
  true
);

-- Extra Hardap: stay
INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Hardap Dam Fisherman''s Cottage',
  'Cosy cottage on the shores of Hardap Dam — Namibia''s largest dam. Perfect for fishing enthusiasts and bird watchers. Catch yellowfish and barbel from the bank, or hire our small boat. Stunning sunsets over the water guaranteed.',
  'stay',
  'Hardap',
  85000,
  '+264 81 890 1237',
  '{}',
  ARRAY['Borehole water', 'Braai area', 'Hot water', 'Camping allowed', 'Self-catering kitchen', 'Bush view'],
  -24.5000,
  17.8700,
  true
);

-- Extra //Karas: stay
INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Karasburg Sheep Station',
  'Working Karakul sheep station in the deep south. Experience the vast open plains where Namibia meets South Africa. Learn about the historic Karakul farming industry and the resilient people of the //Karas region.',
  'stay',
  '//Karas',
  70000,
  '+264 81 901 2348',
  '{}',
  ARRAY['Solar power', 'Borehole water', 'Hot water', 'Camping allowed', 'Guided farm walks', 'Self-catering kitchen'],
  -28.0500,
  19.1500,
  true
);

-- Extra Omaheke: equipment
INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Gobabis Balers and Hay Equipment',
  'Complete hay baling setup: round baler, bale wrapper, and bale transporter. Available for seasonal contract work. Turn your veld grass into valuable winter feed. Experienced operator included.',
  'equipment',
  'Omaheke',
  250000,
  '+264 81 012 3459',
  '{}',
  ARRAY['Operator included', 'Delivery available', 'Tractor access road', 'Round baler + wrapper', 'Bale transport included'],
  -22.3000,
  19.1000,
  true
);
