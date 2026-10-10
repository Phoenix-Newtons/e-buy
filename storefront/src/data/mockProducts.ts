import type {
  CategoryId,
  Condition,
  DeliveryMode,
  Product,
  RegionId,
  Seller,
} from "../types";
import { SUPPORT_PHONE_E164 } from "./contact";

/**
 * Demo listings used when Supabase credentials are not configured.
 *
 * Prices run from UGX 180,000 (Leather Sneakers, Jinja) to UGX 42,000,000 (Land Cruiser Prado, Mbarara).
 * Every demo seller uses the E-Buy domestic line 0774 803 543 so that the "Call Seller" and
 * "Chat via WhatsApp" buttons can be tested end to end. Live listings use each seller's own number.
 */

const phone = SUPPORT_PHONE_E164;

const SELLERS = {
  mukisa: { id: "s-mukisa", name: "Mukisa Electronics", tier: "top-rated", rating: 4.9, reviewCount: 312, phone },
  nakato: { id: "s-nakato", name: "Nakato Fashion House", tier: "verified", rating: 4.7, reviewCount: 148, phone },
  okello: { id: "s-okello", name: "Okello Motors", tier: "top-rated", rating: 4.8, reviewCount: 96, phone },
  atuhaire: { id: "s-atuhaire", name: "Atuhaire Tech Hub", tier: "verified", rating: 4.5, reviewCount: 64, phone },
  wasswa: { id: "s-wasswa", name: "Wasswa James", tier: "standard", rating: null, reviewCount: 0, phone },
  opio: { id: "s-opio", name: "Opio Gadgets Gulu", tier: "standard", rating: 4.2, reviewCount: 17, phone },
  babirye: { id: "s-babirye", name: "Babirye Shoes & Bags", tier: "verified", rating: 4.6, reviewCount: 82, phone },
  tumusiime: { id: "s-tumusiime", name: "Tumusiime Auto Yard", tier: "verified", rating: 4.4, reviewCount: 41, phone },
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
  region: RegionId;
  area: string;
  imageId: string | null;
  delivery: DeliveryMode;
  seller: SellerKey;
  hoursAgo: number;
  trendingScore: number;
}

const REGION_LABELS: Record<RegionId, string> = {
  kampala: "Kampala, Central",
  entebbe: "Entebbe, Central",
  jinja: "Jinja, Eastern",
  mbarara: "Mbarara, Western",
  gulu: "Gulu, Northern",
};

const SEEDS: readonly Seed[] = [
  /* ----------------------------- Phones ----------------------------- */
  {
    id: "p-001", title: "iPhone 13 Pro 256GB, Sierra Blue", description: "Excellent condition, 91% battery health, original box and charger included. No scratches.",
    priceUgx: 2_450_000, negotiable: true, category: "phones", condition: "used", region: "kampala", area: "Kisaasi",
    imageId: "1632661674596-df8be070a5c5", delivery: "both", seller: "mukisa", hoursAgo: 3, trendingScore: 990,
  },
  {
    id: "p-002", title: "Samsung Galaxy S23 Ultra 256GB", description: "Refurbished and tested, new battery fitted. Includes S Pen and 6 months shop warranty.",
    priceUgx: 2_900_000, category: "phones", condition: "refurbished", region: "kampala", area: "Nakasero",
    imageId: "1610945265064-0e34e5519bbf", delivery: "both", seller: "mukisa", hoursAgo: 8, trendingScore: 870,
  },
  {
    id: "p-003", title: "Tecno Spark 20 Pro (Sealed)", description: "Brand new, dual SIM, fast charging. Free screen protector and cover.",
    priceUgx: 520_000, category: "phones", condition: "new", region: "gulu", area: "Pece",
    imageId: "1598327105666-5b89351aff97", delivery: "delivery", seller: "opio", hoursAgo: 20, trendingScore: 410,
  },
  {
    id: "p-004", title: "iPhone 11 64GB, Black", description: "Refurbished, Face ID working, 87% battery. Comes with a cable and a 3 month warranty.",
    priceUgx: 1_150_000, negotiable: true, category: "phones", condition: "refurbished", region: "mbarara", area: "Kakoba",
    imageId: "1592750475338-74b7b21085ab", delivery: "both", seller: "atuhaire", hoursAgo: 30, trendingScore: 540,
  },
  {
    id: "p-005", title: "Infinix Hot 40i, 128GB", description: "Brand new in box with 1 year warranty. 8GB RAM, large battery for all-day use.",
    priceUgx: 450_000, category: "phones", condition: "new", region: "jinja", area: "Jinja Central",
    imageId: "1511707171634-5f897ff02aa9", delivery: "delivery", seller: "wasswa", hoursAgo: 26, trendingScore: 300,
  },
  {
    id: "p-006", title: "Redmi Note 12, 6GB/128GB", description: "Brand new, AMOLED display, 33W fast charger in the box.",
    priceUgx: 690_000, category: "phones", condition: "new", region: "entebbe", area: "Entebbe Town",
    imageId: "1580910051074-3eb694886505", delivery: "both", seller: "atuhaire", hoursAgo: 44, trendingScore: 360,
  },

  /* --------------------------- Electronics -------------------------- */
  {
    id: "p-007", title: "MacBook Air M2 13-inch, 8GB/256GB", description: "Used for one year, 96% battery health, charger and sleeve included. Perfect for study and work.",
    priceUgx: 4_500_000, negotiable: true, category: "electronics", condition: "used", region: "entebbe", area: "Kitoro",
    imageId: "1517336714731-489689fd1ca8", delivery: "both", seller: "mukisa", hoursAgo: 12, trendingScore: 960,
  },
  {
    id: "p-008", title: "HP EliteBook 840 G5 Laptop", description: "Refurbished corporate laptop, Core i5 8th gen, 16GB RAM, 512GB SSD.",
    priceUgx: 1_650_000, category: "electronics", condition: "refurbished", region: "mbarara", area: "Mbarara City",
    imageId: "1496181133206-80ce9b88a853", delivery: "both", seller: "atuhaire", hoursAgo: 52, trendingScore: 310,
  },
  {
    id: "p-009", title: "LG 43-inch 4K Smart TV", description: "Brand new, wall bracket included. Free delivery within Kampala.",
    priceUgx: 1_450_000, category: "electronics", condition: "new", region: "kampala", area: "Ntinda",
    imageId: "1593359677879-a4bb92f829d1", delivery: "delivery", seller: "mukisa", hoursAgo: 30, trendingScore: 640,
  },
  {
    id: "p-010", title: "PlayStation 5 Disc Edition", description: "Used for 6 months, includes two controllers and FIFA 24.",
    priceUgx: 2_300_000, negotiable: true, category: "electronics", condition: "used", region: "entebbe", area: "Abayita Ababiri",
    imageId: "1606813907291-d86efa9b94db", delivery: "pickup", seller: "wasswa", hoursAgo: 5, trendingScore: 890,
  },
  {
    id: "p-011", title: "Solar Home Lighting Kit, 100W", description: "Brand new 100W panel, 4 bulbs and phone charging ports. Installation available.",
    priceUgx: 780_000, category: "electronics", condition: "new", region: "gulu", area: "Gulu City",
    imageId: "1509391366360-2e959784a276", delivery: "both", seller: "opio", hoursAgo: 14, trendingScore: 640,
  },
  {
    id: "p-012", title: "Canon EOS 200D DSLR with 18-55mm Lens", description: "Used, 12k shutter count, two batteries and a camera bag. Great for events.",
    priceUgx: 1_900_000, negotiable: true, category: "electronics", condition: "used", region: "kampala", area: "Kololo",
    imageId: "1516035069371-29a1b244cc32", delivery: "both", seller: "mukisa", hoursAgo: 66, trendingScore: 420,
  },

  /* ----------------------------- Fashion ---------------------------- */
  {
    id: "p-013", title: "Leather Sneakers, Tan (UK 9)", description: "Genuine leather, hand stitched, lightly worn twice. Original box included.",
    priceUgx: 180_000, negotiable: true, category: "fashion", condition: "used", region: "jinja", area: "Walukuba",
    imageId: "1549298916-b41d501d3772", delivery: "both", seller: "babirye", hoursAgo: 6, trendingScore: 610,
  },
  {
    id: "p-014", title: "Kitenge Maxi Dress Set (3 pieces)", description: "Brand new handmade kitenge dresses, sizes S to XXL. Custom orders welcome.",
    priceUgx: 240_000, category: "fashion", condition: "new", region: "kampala", area: "Owino Market",
    imageId: "1594633312681-425c7b97ccd1", delivery: "delivery", seller: "nakato", hoursAgo: 9, trendingScore: 600,
  },
  {
    id: "p-015", title: "Nike Air Force 1 (UK 8)", description: "Used, excellent condition, comes with the original box.",
    priceUgx: 260_000, negotiable: true, category: "fashion", condition: "used", region: "gulu", area: "Layibi",
    imageId: "1542291026-7eec264c27ff", delivery: "both", seller: "opio", hoursAgo: 40, trendingScore: 355,
  },
  {
    id: "p-016", title: "Women's Gomesi, Silk Blend", description: "Brand new gomesi for weddings and introductions, with matching sash.",
    priceUgx: 320_000, category: "fashion", condition: "new", region: "jinja", area: "Jinja Central",
    imageId: "1594938298603-c8148c4dae35", delivery: "delivery", seller: "nakato", hoursAgo: 58, trendingScore: 280,
  },
  {
    id: "p-017", title: "Men's Slim-Fit Suit, Navy", description: "Brand new two-piece suit, tailored cut. Alterations available in-store.",
    priceUgx: 380_000, category: "fashion", condition: "new", region: "mbarara", area: "Mbarara City",
    imageId: "1507679799987-c73779587ccf", delivery: "both", seller: "nakato", hoursAgo: 90, trendingScore: 190,
  },
  {
    id: "p-018", title: "Designer Leather Handbag", description: "Brand new genuine leather handbag with dust cover and detachable strap.",
    priceUgx: 450_000, category: "fashion", condition: "new", region: "entebbe", area: "Entebbe Town",
    imageId: "1584917865442-de89df76afd3", delivery: "both", seller: "babirye", hoursAgo: 28, trendingScore: 330,
  },

  /* ----------------------------- Vehicles --------------------------- */
  {
    id: "p-019", title: "Toyota RAV4 2012, Silver", description: "Clean import, low mileage, automatic, well maintained. Logbook ready.",
    priceUgx: 38_500_000, negotiable: true, category: "vehicles", condition: "used", region: "kampala", area: "Bugolobi",
    imageId: "1494976388531-d1058494cdd8", delivery: "pickup", seller: "okello", hoursAgo: 26, trendingScore: 720,
  },
  {
    id: "p-020", title: "Toyota Noah 2010, 8 Seater", description: "Family van, fuel efficient, new tyres and a fresh service. Duty paid.",
    priceUgx: 21_000_000, negotiable: true, category: "vehicles", condition: "used", region: "kampala", area: "Kansanga",
    imageId: "1533473359331-0135ef1b58bf", delivery: "pickup", seller: "tumusiime", hoursAgo: 72, trendingScore: 480,
  },
  {
    id: "p-021", title: "Toyota Land Cruiser Prado TX 2014", description: "Diesel, leather interior, sunroof, full service history. Logbook in hand.",
    priceUgx: 42_000_000, negotiable: true, category: "vehicles", condition: "used", region: "mbarara", area: "Nyamitanga",
    imageId: "1519641471654-76ce0107ad1b", delivery: "pickup", seller: "tumusiime", hoursAgo: 36, trendingScore: 650,
  },
  {
    id: "p-022", title: "Bajaj Boxer 150 Boda Boda", description: "Brand new motorcycle, free registration support and first service.",
    priceUgx: 5_900_000, category: "vehicles", condition: "new", region: "gulu", area: "Pece",
    imageId: "1558981806-ec527fa84c39", delivery: "delivery", seller: "okello", hoursAgo: 70, trendingScore: 530,
  },
  {
    id: "p-023", title: "Subaru Forester 2010, 4WD", description: "Used, leather seats, sunroof, recently serviced. Test drives welcome.",
    priceUgx: 24_000_000, negotiable: true, category: "vehicles", condition: "used", region: "jinja", area: "Njeru",
    imageId: "1503376780353-7e6692767b70", delivery: "pickup", seller: "okello", hoursAgo: 110, trendingScore: 280,
  },
  {
    id: "p-024", title: "Toyota Premio 2008, Pearl White", description: "Refurbished interior, new battery and tyres, very clean. Duty paid.",
    priceUgx: 17_500_000, negotiable: true, category: "vehicles", condition: "refurbished", region: "entebbe", area: "Katabi",
    imageId: "1550355291-bbee04a92027", delivery: "pickup", seller: "tumusiime", hoursAgo: 84, trendingScore: 340,
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
