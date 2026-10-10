import type {
  CategoryId,
  Condition,
  DeliveryMode,
  Product,
  ProductRegion,
  Seller,
} from "../types";

/**
 * Demo listings used when Supabase credentials are not configured.
 * Seller phone numbers use the reserved-looking 256 700 000 xxx range and are fictional.
 */

const SELLERS = {
  mukisa: { id: "s-mukisa", name: "Mukisa Electronics", tier: "top-rated", rating: 4.9, reviewCount: 312, phone: "256700000101" },
  nakato: { id: "s-nakato", name: "Nakato Fashion House", tier: "verified", rating: 4.7, reviewCount: 148, phone: "256700000102" },
  okello: { id: "s-okello", name: "Okello Motors", tier: "top-rated", rating: 4.8, reviewCount: 96, phone: "256700000103" },
  atuhaire: { id: "s-atuhaire", name: "Atuhaire Homes", tier: "verified", rating: 4.5, reviewCount: 64, phone: "256700000104" },
  wasswa: { id: "s-wasswa", name: "Wasswa James", tier: "standard", rating: null, reviewCount: 0, phone: "256700000105" },
  namutebi: { id: "s-namutebi", name: "Namutebi Agro Supplies", tier: "verified", rating: 4.6, reviewCount: 81, phone: "256700000106" },
  opio: { id: "s-opio", name: "Opio Gadgets Gulu", tier: "standard", rating: 4.2, reviewCount: 17, phone: "256700000107" },
  kiiza: { id: "s-kiiza", name: "Kiiza Furniture Mart", tier: "top-rated", rating: 4.9, reviewCount: 203, phone: "256700000108" },
} as const satisfies Record<string, Seller>;

type SellerKey = keyof typeof SELLERS;

const photo = (id: string): string => `https://images.unsplash.com/photo-${id}?w=800&q=70&auto=format&fit=crop`;

const HOUR_MS = 3_600_000;
const NOW = Date.now();

interface Seed {
  id: string;
  title: string;
  description: string;
  priceUgx: number;
  negotiable?: boolean;
  category: CategoryId;
  condition: Condition;
  region: Exclude<ProductRegion, "other">;
  area: string;
  imageId: string | null;
  delivery: DeliveryMode;
  seller: SellerKey;
  hoursAgo: number;
  trendingScore: number;
}

const REGION_LABELS: Record<Seed["region"], string> = {
  kampala: "Kampala, Central",
  wakiso: "Wakiso, Central",
  mukono: "Mukono, Central",
  jinja: "Jinja, Eastern",
  mbale: "Mbale, Eastern",
  mbarara: "Mbarara, Western",
  gulu: "Gulu, Northern",
};

const SEEDS: readonly Seed[] = [
  {
    id: "p-001", title: "iPhone 13 128GB, Midnight", description: "Excellent condition, 90% battery health, original box and charger included.",
    priceUgx: 1_850_000, negotiable: true, category: "phones", condition: "used", region: "kampala", area: "Kisaasi",
    imageId: "1511707171634-5f897ff02aa9", delivery: "both", seller: "mukisa", hoursAgo: 3, trendingScore: 980,
  },
  {
    id: "p-002", title: "Samsung Galaxy A15 (Sealed)", description: "Brand new in box with 1 year warranty. 128GB, 6GB RAM.",
    priceUgx: 620_000, category: "phones", condition: "new", region: "kampala", area: "Nakasero",
    imageId: "1610945265064-0e34e5519bbf", delivery: "both", seller: "mukisa", hoursAgo: 8, trendingScore: 870,
  },
  {
    id: "p-003", title: "Tecno Spark 20 Pro", description: "Brand new, dual SIM, fast charging. Free screen protector.",
    priceUgx: 480_000, category: "phones", condition: "new", region: "wakiso", area: "Entebbe Road",
    imageId: "1598327105666-5b89351aff97", delivery: "delivery", seller: "opio", hoursAgo: 20, trendingScore: 410,
  },
  {
    id: "p-004", title: "MacBook Air M1 13-inch", description: "Refurbished, new battery installed, 8GB RAM, 256GB SSD. 6 months shop warranty.",
    priceUgx: 3_200_000, negotiable: true, category: "electronics", condition: "refurbished", region: "kampala", area: "Kikuubo",
    imageId: "1517336714731-489689fd1ca8", delivery: "both", seller: "mukisa", hoursAgo: 12, trendingScore: 760,
  },
  {
    id: "p-005", title: "LG 43-inch Smart TV", description: "Brand new 4K UHD, wall bracket included. Free delivery within Kampala.",
    priceUgx: 1_450_000, category: "electronics", condition: "new", region: "kampala", area: "Ntinda",
    imageId: "1593359677879-a4bb92f829d1", delivery: "delivery", seller: "mukisa", hoursAgo: 30, trendingScore: 640,
  },
  {
    id: "p-006", title: "PlayStation 5 Disc Edition", description: "Used for 6 months, comes with two controllers and FIFA 24.",
    priceUgx: 2_300_000, negotiable: true, category: "electronics", condition: "used", region: "mukono", area: "Seeta",
    imageId: "1606813907291-d86efa9b94db", delivery: "pickup", seller: "wasswa", hoursAgo: 5, trendingScore: 890,
  },
  {
    id: "p-007", title: "HP EliteBook 840 G5", description: "Refurbished corporate laptop, Core i5 8th gen, 16GB RAM, 512GB SSD.",
    priceUgx: 1_650_000, category: "electronics", condition: "refurbished", region: "mbarara", area: "Mbarara City",
    imageId: "1496181133206-80ce9b88a853", delivery: "both", seller: "atuhaire", hoursAgo: 52, trendingScore: 310,
  },
  {
    id: "p-008", title: "Toyota RAV4 2012, Silver", description: "Clean import, low mileage, automatic, well maintained. Logbook ready.",
    priceUgx: 38_500_000, negotiable: true, category: "vehicles", condition: "used", region: "kampala", area: "Bugolobi",
    imageId: "1494976388531-d1058494cdd8", delivery: "pickup", seller: "okello", hoursAgo: 26, trendingScore: 720,
  },
  {
    id: "p-009", title: "Bajaj Boxer 150 Boda Boda", description: "Brand new motorcycle, free registration support and first service.",
    priceUgx: 5_900_000, category: "vehicles", condition: "new", region: "gulu", area: "Pece",
    imageId: "1558981806-ec527fa84c39", delivery: "delivery", seller: "okello", hoursAgo: 70, trendingScore: 530,
  },
  {
    id: "p-010", title: "Subaru Forester 2010", description: "Used, 4WD, leather seats, sunroof. Recently serviced.",
    priceUgx: 24_000_000, negotiable: true, category: "vehicles", condition: "used", region: "jinja", area: "Walukuba",
    imageId: "1533473359331-0135ef1b58bf", delivery: "pickup", seller: "okello", hoursAgo: 110, trendingScore: 280,
  },
  {
    id: "p-011", title: "Kitenge Maxi Dress Collection", description: "Brand new handmade kitenge dresses, sizes S to XXL. Custom orders welcome.",
    priceUgx: 85_000, category: "fashion", condition: "new", region: "kampala", area: "Owino Market",
    imageId: "1594633312681-425c7b97ccd1", delivery: "delivery", seller: "nakato", hoursAgo: 6, trendingScore: 600,
  },
  {
    id: "p-012", title: "Nike Air Force 1 (UK 9)", description: "Used twice, excellent condition, original box included.",
    priceUgx: 220_000, negotiable: true, category: "fashion", condition: "used", region: "wakiso", area: "Kira",
    imageId: "1542291026-7eec264c27ff", delivery: "both", seller: "nakato", hoursAgo: 40, trendingScore: 355,
  },
  {
    id: "p-013", title: "Men's Slim-Fit Suit, Navy", description: "Brand new two-piece suit, tailored cut. Alterations available in-store.",
    priceUgx: 280_000, category: "fashion", condition: "new", region: "mbale", area: "Mbale Town",
    imageId: "1507679799987-c73779587ccf", delivery: "both", seller: "nakato", hoursAgo: 90, trendingScore: 190,
  },
  {
    id: "p-014", title: "Plot of Land, 50x100ft with Title", description: "Residential plot in a fast-growing neighbourhood, ready mailo title, near tarmac.",
    priceUgx: 65_000_000, negotiable: true, category: "real-estate", condition: "new", region: "wakiso", area: "Namugongo",
    imageId: "1500382017468-9049fed747ef", delivery: "pickup", seller: "atuhaire", hoursAgo: 15, trendingScore: 450,
  },
  {
    id: "p-015", title: "2 Bedroom Apartment for Rent", description: "Self-contained, secure compound, water and parking. Monthly rent.",
    priceUgx: 1_200_000, category: "real-estate", condition: "used", region: "kampala", area: "Muyenga",
    imageId: "1522708323590-d24dbb6b0267", delivery: "pickup", seller: "atuhaire", hoursAgo: 48, trendingScore: 520,
  },
  {
    id: "p-016", title: "3-Seater Fabric Sofa Set", description: "Brand new, solid hardwood frame, available in grey and brown.",
    priceUgx: 1_350_000, negotiable: true, category: "furniture", condition: "new", region: "kampala", area: "Ntinda",
    imageId: "1555041469-a586c61ea9bc", delivery: "delivery", seller: "kiiza", hoursAgo: 9, trendingScore: 580,
  },
  {
    id: "p-017", title: "Queen Size Orthopaedic Mattress", description: "Brand new 6x6 high-density mattress, 5-year warranty.",
    priceUgx: 690_000, category: "furniture", condition: "new", region: "mukono", area: "Mukono Town",
    imageId: "1631049307264-da0ec9d70304", delivery: "delivery", seller: "kiiza", hoursAgo: 33, trendingScore: 335,
  },
  {
    id: "p-018", title: "Used Dining Table with 6 Chairs", description: "Mahogany dining table, minor wear, very sturdy.",
    priceUgx: 750_000, negotiable: true, category: "furniture", condition: "used", region: "jinja", area: "Jinja Central",
    imageId: "1617806118233-18e1de247200", delivery: "pickup", seller: "wasswa", hoursAgo: 120, trendingScore: 140,
  },
  {
    id: "p-019", title: "Hybrid Maize Seed, 25kg Bag", description: "Certified high-yield hybrid seed, drought tolerant. Bulk discounts available.",
    priceUgx: 135_000, category: "agriculture", condition: "new", region: "gulu", area: "Layibi",
    imageId: "1574943320219-553eb213f72d", delivery: "delivery", seller: "namutebi", hoursAgo: 18, trendingScore: 270,
  },
  {
    id: "p-020", title: "Boer Goats, Breeding Pair", description: "Healthy vaccinated Boer goats, good for breeding. Farm visits welcome.",
    priceUgx: 900_000, negotiable: true, category: "agriculture", condition: "new", region: "mbarara", area: "Kakoba",
    imageId: "1524024973431-2ad916746881", delivery: "both", seller: "namutebi", hoursAgo: 60, trendingScore: 365,
  },
  {
    id: "p-021", title: "Professional Photography & Video", description: "Weddings, events and product shoots. Edited photos within 3 days.",
    priceUgx: 450_000, negotiable: true, category: "services", condition: "new", region: "kampala", area: "Kololo",
    imageId: "1492691527719-9d1e07e534b4", delivery: "delivery", seller: "opio", hoursAgo: 22, trendingScore: 240,
  },
  {
    id: "p-022", title: "Solar Home Lighting Kit", description: "New 100W panel, 4 bulbs, phone charging ports. Installation available.",
    priceUgx: 780_000, category: "electronics", condition: "new", region: "gulu", area: "Gulu City",
    imageId: "1509391366360-2e959784a276", delivery: "both", seller: "opio", hoursAgo: 14, trendingScore: 640,
  },
];

export const MOCK_PRODUCTS: readonly Product[] = SEEDS.map((seed): Product => ({
  id: seed.id,
  title: seed.title,
  description: seed.description,
  priceUgx: seed.priceUgx,
  negotiable: seed.negotiable ?? false,
  category: seed.category,
  condition: seed.condition,
  region: seed.region,
  area: seed.area,
  locationLabel: REGION_LABELS[seed.region],
  imageUrl: seed.imageId ? photo(seed.imageId) : null,
  delivery: seed.delivery,
  seller: { ...SELLERS[seed.seller] },
  createdAt: new Date(NOW - seed.hoursAgo * HOUR_MS).toISOString(),
  trendingScore: seed.trendingScore,
}));
