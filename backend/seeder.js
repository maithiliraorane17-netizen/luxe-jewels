
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Collection from "./models/Collection.js";

dotenv.config();

const img = (id) => `https://images.unsplash.com/photo-${id}?w=900&q=80&fm=jpg&fit=crop`;

const PH = {
  // Rings
  roseGoldRing: "1622398925373-3f91b1e275f5",
  goldRingWhite1: "1598560917807-1bae44bd2be8",
  threeRingsBox: "1631982690223-8aa4be0a2497",
  ringBlackSurface: "1713950920412-97799efdf870",
  goldDiamondRing: "1611955167811-4711904bb9f8",
  purpleGemRing: "1603561596973-8166e9e089d1",
  diamondRingWhite: "1631982686092-e6561a853187",
  ringCloseup: "1705326455036-0fab8ecba04d",
  threeStuddedRings: "1543294001-f7cd5d7fb516",
  weddingBandSilverGold1: "1628926379972-9843ad139a8c",
  goldSilverRingsTextile: "1608508644127-ba99d7732fee",
  goldRingWhiteTextile: "1617038260897-41a1f14a8ca0",
  coupleRingsTable: "1723802205505-2f88b2227718",
  silverGoldWeddingBands2: "1615655114865-4cc1bda5901e",
  goldRingOnTable: "1689367436629-1d288f1e23b6",
  goldRingWhiteSurface2: "1655707063513-a08dad26440e",
  goldRingCloseupTable2: "1689367436442-76c859315008",

  // Necklaces
  goldChainNecklace: "1611107683227-e9060eccd846",
  crownPendant: "1685970731194-e27b477e87ba",
  ringsAndNecklace: "1633934542430-0905ccb5f050",
  womanGoldNecklace: "1620656798579-1984d9e87df7",
  silverDiamondPendant: "1598560917505-59a3ad559071",
  silverEmeraldNecklace: "1583937443351-f2f669fbe2cf",
  goldPurpleBeadedNecklace: "1601121141461-9d6647bca1ed",
  goldHeartCharm: "1623321673989-830eff0fd59f",
  goldNecklacePearlsRedBg: "1721103418312-b0057a8c31c2",
  goldWhiteBeadedNecklaceBox: "1599475211349-f4c81b3216bc",
  threeJewelryBlackSurface: "1641290748359-1d944fc8359a",
  personWearingGoldSilverNecklace: "1601121141461-920cb1993441",

  // Earrings
  goldEarringsCloth: "1704445010872-2faefdd733aa",
  diamondHoopEarrings: "1619203451989-53f6d2ca0e57",
  silverEarringsBlueGem: "1535632066927-ab7c9ab60908",
  earringsBlackCloth: "1693212793204-bcea856c75fe",
  womanSilverDiamondStud: "1621939745912-aad97fd3a34d",
  goldTwistedHoopStones: "1617038220319-276d3cfab638",
  redWhiteEarringsWoodTable: "1671642883395-0ab89c3ac890",
  personWearingEarrings: "1671644730555-916aa8d8157f",

  // Bracelets
  goldChainBracelet: "1602173574767-37ac01994b2a",
  personWearingBracelet: "1633810543462-77c4a3b13f07",
  braceletEvilEye: "1721206624492-3d05631471ea",
  coupleBraceletsTable: "1679156271456-d6068c543ee7",
  diamondBraceletRose: "1689397136362-dce64e557fcc",
  braceletCloseup: "1655255114527-d0a834d9a774",
  silverBrownBeadedBracelet: "1629224316810-9d8805b95e76",
};

const run = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Collection.deleteMany();

    await User.create({
      name: "Admin",
      email: "admin@luxejewels.com",
      password: "admin123",
      role: "admin",
    });

    const categories = await Category.insertMany([
      {
        name: "Rings",
        slug: "rings",
        description: "Elegant rings for every occasion",
      },
      {
        name: "Necklaces",
        slug: "necklaces",
        description: "Statement necklaces",
      },
      {
        name: "Earrings",
        slug: "earrings",
        description: "Timeless earrings",
      },
      {
        name: "Bracelets",
        slug: "bracelets",
        description: "Delicate bracelets",
      },
    ]);

    const [rings, necklaces, earrings, bracelets] = categories;

    const eternalBloom = await Collection.create({
      name: "Eternal Bloom",
      slug: "eternal-bloom",
      description:
        "A floral-inspired luxury collection celebrating romance and refinement.",
      designer: "Isabella Rossi",
      isFeatured: true,
    });

    const moonlitGrace = await Collection.create({
      name: "Moonlit Grace",
      slug: "moonlit-grace",
      description:
        "Minimalist silhouettes inspired by moonlight on still water.",
      designer: "Elena Marchetti",
      isFeatured: true,
    });

    const heritageLine = await Collection.create({
      name: "Heritage Line",
      slug: "heritage-line",
      description:
        "Classic archive-inspired pieces built to be heirlooms.",
      designer: "Marcus Bellweather",
      isFeatured: true,
    });

    const products = await Product.insertMany([
      // ================= RINGS =================
      {
        name: "Rose Gold Solitaire Ring",
        slug: "rose-gold-solitaire-ring",
        description:
          "A timeless solitaire ring crafted in 18k rose gold with a brilliant cut diamond, hand-set by our master jewelers for maximum sparkle and durability.",
        shortDescription: "18k rose gold solitaire ring",
        price: 45000,
        images: [img(PH.roseGoldRing), img(PH.goldRingWhite1)],
        category: rings._id,
        collections: [eternalBloom._id],
        designer: "Isabella Rossi",
        metalType: "Rose Gold",
        gemstone: "Diamond",
        style: "Classic",
        stock: 12,
        isFeatured: true,
        isNewArrival: true,
      },
      {
        name: "Sapphire Halo Ring",
        slug: "sapphire-halo-ring",
        description:
          "A vivid blue sapphire encircled by a halo of pave diamonds, set in polished white gold for a striking contrast.",
        shortDescription: "White gold sapphire halo ring",
        price: 58000,
        images: [img(PH.goldDiamondRing), img(PH.diamondRingWhite)],
        category: rings._id,
        collections: [moonlitGrace._id],
        designer: "Elena Marchetti",
        metalType: "White Gold",
        gemstone: "Sapphire",
        style: "Statement",
        stock: 9,
        isFeatured: true,
      },
      {
        name: "Trio Stacking Band Set",
        slug: "trio-stacking-band-set",
        description:
          "Three slim bands in mixed metals designed to be worn together or separately — an everyday-luxury staple.",
        shortDescription: "Set of 3 mixed-metal stacking bands",
        price: 32000,
        images: [img(PH.threeRingsBox), img(PH.threeStuddedRings)],
        category: rings._id,
        collections: [heritageLine._id],
        metalType: "Gold",
        gemstone: "None",
        style: "Minimalist",
        stock: 25,
        isNewArrival: true,
      },
      {
        name: "Amethyst Vintage Ring",
        slug: "amethyst-vintage-ring",
        description:
          "An art-deco inspired ring featuring a deep purple amethyst framed in an ornate gold setting.",
        shortDescription: "Gold vintage amethyst ring",
        price: 38500,
        images: [img(PH.purpleGemRing), img(PH.ringCloseup)],
        category: rings._id,
        designer: "Marcus Bellweather",
        metalType: "Gold",
        gemstone: "Amethyst",
        style: "Vintage",
        stock: 7,
      },
      {
        name: "Onyx Signet Ring",
        slug: "onyx-signet-ring",
        description:
          "A bold black onyx signet ring in brushed gold — a modern take on a heritage classic.",
        shortDescription: "Brushed gold onyx signet ring",
        price: 29500,
        images: [img(PH.ringBlackSurface), img(PH.weddingBandSilverGold1)],
        category: rings._id,
        collections: [heritageLine._id],
        designer: "Marcus Bellweather",
        metalType: "Gold",
        gemstone: "Onyx",
        style: "Statement",
        stock: 14,
      },
      {
        name: "Silver Statement Ring",
        slug: "silver-statement-ring",
        description:
          "A bold sculptural ring in solid sterling silver with a brushed matte finish — modern minimalism at its finest.",
        shortDescription: "Sterling silver statement ring",
        price: 21000,
        images: [img(PH.silverGoldWeddingBands2), img(PH.goldSilverRingsTextile)],
        category: rings._id,
        collections: [moonlitGrace._id],
        metalType: "Silver",
        gemstone: "None",
        style: "Minimalist",
        stock: 30,
        isNewArrival: true,
      },
      {
        name: "Platinum Eternity Band",
        slug: "platinum-eternity-band",
        description:
          "A continuous band of round brilliant diamonds set in platinum, symbolizing unending love.",
        shortDescription: "Platinum diamond eternity band",
        price: 78000,
        images: [img(PH.goldRingCloseupTable2), img(PH.coupleRingsTable)],
        category: rings._id,
        collections: [eternalBloom._id],
        designer: "Isabella Rossi",
        metalType: "Platinum",
        gemstone: "Diamond",
        style: "Classic",
        stock: 6,
        isFeatured: true,
      },

      // ================= NECKLACES =================
      {
        name: "Pearl Drop Necklace",
        slug: "pearl-drop-necklace",
        description:
          "Freshwater pearl pendant on a delicate gold chain — an elegant everyday piece that transitions effortlessly from day to evening.",
        shortDescription: "Freshwater pearl pendant necklace",
        price: 28000,
        images: [img(PH.goldChainNecklace), img(PH.ringsAndNecklace)],
        category: necklaces._id,
        collections: [eternalBloom._id],
        metalType: "Gold",
        gemstone: "Pearl",
        style: "Minimalist",
        stock: 20,
        isFeatured: true,
      },
      {
        name: "Layered Chain Necklace Set",
        slug: "layered-chain-necklace-set",
        description:
          "Three chains of varying lengths, designed to layer perfectly for an effortlessly curated look.",
        shortDescription: "Set of 3 layered gold chains",
        price: 34000,
        images: [img(PH.womanGoldNecklace), img(PH.personWearingGoldSilverNecklace)],
        category: necklaces._id,
        collections: [moonlitGrace._id],
        metalType: "Gold",
        gemstone: "None",
        style: "Minimalist",
        stock: 18,
        isNewArrival: true,
      },
      {
        name: "Royal Crown Pendant",
        slug: "royal-crown-pendant",
        description:
          "A regal crown-shaped pendant in polished gold, finished with a delicate cable chain.",
        shortDescription: "Gold crown pendant necklace",
        price: 41000,
        images: [img(PH.crownPendant), img(PH.goldHeartCharm)],
        category: necklaces._id,
        collections: [heritageLine._id],
        designer: "Marcus Bellweather",
        metalType: "Gold",
        gemstone: "None",
        style: "Statement",
        stock: 10,
        isFeatured: true,
      },
      {
        name: "Silver Diamond Heart Pendant",
        slug: "silver-diamond-heart-pendant",
        description:
          "A delicate heart pendant in sterling silver, framed with a halo of brilliant-cut diamonds.",
        shortDescription: "Sterling silver diamond heart pendant",
        price: 26500,
        images: [img(PH.silverDiamondPendant), img(PH.goldPurpleBeadedNecklace)],
        category: necklaces._id,
        collections: [moonlitGrace._id],
        metalType: "Silver",
        gemstone: "Diamond",
        style: "Minimalist",
        stock: 22,
        isNewArrival: true,
      },
      {
        name: "Emerald Statement Necklace",
        slug: "emerald-statement-necklace",
        description:
          "A dramatic collar necklace featuring emerald-cut green stones set in rhodium-plated silver.",
        shortDescription: "Silver emerald statement necklace",
        price: 52000,
        images: [img(PH.silverEmeraldNecklace), img(PH.threeJewelryBlackSurface)],
        category: necklaces._id,
        collections: [eternalBloom._id],
        designer: "Isabella Rossi",
        metalType: "Silver",
        gemstone: "Emerald",
        style: "Statement",
        stock: 8,
        isFeatured: true,
      },
      {
        name: "Platinum Diamond Tennis Necklace",
        slug: "platinum-diamond-tennis-necklace",
        description:
          "A continuous line of matched diamonds set in platinum for maximum brilliance — a true showstopper.",
        shortDescription: "Platinum diamond tennis necklace",
        price: 128000,
        images: [img(PH.goldNecklacePearlsRedBg), img(PH.goldWhiteBeadedNecklaceBox)],
        category: necklaces._id,
        collections: [heritageLine._id],
        metalType: "Platinum",
        gemstone: "Diamond",
        style: "Statement",
        stock: 4,
      },

      // ================= EARRINGS =================
      {
        name: "Diamond Stud Earrings",
        slug: "diamond-stud-earrings",
        description:
          "Classic round-cut diamond studs set in platinum — a lifetime staple for any jewelry collection.",
        shortDescription: "Platinum diamond studs",
        price: 62000,
        images: [img(PH.goldEarringsCloth), img(PH.diamondHoopEarrings)],
        category: earrings._id,
        collections: [eternalBloom._id],
        designer: "Isabella Rossi",
        metalType: "Platinum",
        gemstone: "Diamond",
        style: "Classic",
        stock: 8,
        isNewArrival: true,
        isFeatured: true,
      },
      {
        name: "Gold Diamond Hoop Earrings",
        slug: "gold-diamond-hoop-earrings",
        description:
          "Medium-sized hoops in 18k gold, lined with a row of brilliant-cut diamonds for everyday sparkle.",
        shortDescription: "18k gold diamond hoops",
        price: 47500,
        images: [img(PH.goldTwistedHoopStones), img(PH.personWearingEarrings)],
        category: earrings._id,
        collections: [moonlitGrace._id],
        designer: "Elena Marchetti",
        metalType: "Gold",
        gemstone: "Diamond",
        style: "Statement",
        stock: 11,
      },
      {
        name: "Silver Pearl Drop Earrings",
        slug: "silver-pearl-drop-earrings",
        description:
          "Freshwater pearls suspended from sterling silver hooks — a soft, romantic everyday piece.",
        shortDescription: "Sterling silver pearl drops",
        price: 19500,
        images: [img(PH.silverEarringsBlueGem), img(PH.womanSilverDiamondStud)],
        category: earrings._id,
        collections: [moonlitGrace._id],
        metalType: "Silver",
        gemstone: "Pearl",
        style: "Minimalist",
        stock: 24,
        isNewArrival: true,
      },
      {
        name: "Rose Gold Huggie Earrings",
        slug: "rose-gold-huggie-earrings",
        description:
          "Snug-fitting huggie hoops in warm rose gold — a comfortable, everyday essential.",
        shortDescription: "Rose gold huggie hoops",
        price: 22000,
        images: [img(PH.earringsBlackCloth), img(PH.redWhiteEarringsWoodTable)],
        category: earrings._id,
        collections: [eternalBloom._id],
        metalType: "Rose Gold",
        gemstone: "None",
        style: "Minimalist",
        stock: 19,
      },

      // ================= BRACELETS =================
      {
        name: "Emerald Tennis Bracelet",
        slug: "emerald-tennis-bracelet",
        description:
          "A striking tennis bracelet featuring emerald-cut stones set in white gold, secured with a hidden safety clasp.",
        shortDescription: "White gold emerald bracelet",
        price: 95000,
        images: [img(PH.goldChainBracelet), img(PH.diamondBraceletRose)],
        category: bracelets._id,
        collections: [eternalBloom._id],
        metalType: "White Gold",
        gemstone: "Emerald",
        style: "Statement",
        stock: 5,
        isFeatured: true,
      },
      {
        name: "Gold Chain Bracelet",
        slug: "gold-chain-bracelet",
        description:
          "A substantial curb-link chain bracelet in solid gold — bold, versatile, and built to last generations.",
        shortDescription: "Solid gold curb-link bracelet",
        price: 36500,
        images: [img(PH.coupleBraceletsTable), img(PH.personWearingBracelet)],
        category: bracelets._id,
        collections: [heritageLine._id],
        designer: "Marcus Bellweather",
        metalType: "Gold",
        gemstone: "None",
        style: "Classic",
        stock: 16,
        isNewArrival: true,
      },
      {
        name: "Silver Charm Bracelet",
        slug: "silver-charm-bracelet",
        description:
          "A playful sterling silver chain designed to hold treasured charms, sold with three starter charms included.",
        shortDescription: "Sterling silver charm bracelet",
        price: 17500,
        images: [img(PH.silverBrownBeadedBracelet), img(PH.braceletEvilEye)],
        category: bracelets._id,
        collections: [moonlitGrace._id],
        metalType: "Silver",
        gemstone: "None",
        style: "Minimalist",
        stock: 28,
      },
      {
        name: "Platinum Diamond Bangle",
        slug: "platinum-diamond-bangle",
        description:
          "A rigid bangle in solid platinum, channel-set with a continuous row of diamonds for understated luxury.",
        shortDescription: "Platinum diamond channel-set bangle",
        price: 112000,
        images: [img(PH.braceletCloseup)],
        category: bracelets._id,
        collections: [heritageLine._id],
        metalType: "Platinum",
        gemstone: "Diamond",
        style: "Classic",
        stock: 3,
        isFeatured: true,
      },
    ]);

    const byCollection = (id) =>
      products
        .filter((p) =>
          p.collections?.some((c) => c.toString() === id.toString())
        )
        .map((p) => p._id);

    eternalBloom.products = byCollection(eternalBloom._id);
    moonlitGrace.products = byCollection(moonlitGrace._id);
    heritageLine.products = byCollection(heritageLine._id);

    await eternalBloom.save();
    await moonlitGrace.save();
    await heritageLine.save();

    console.log(
      `Data Imported! ${products.length} products across ${categories.length} categories, 3 collections.`
    );
    console.log(
      "Metal types covered: Gold, Silver, Platinum, Rose Gold, White Gold — every image is unique, no repeats."
    );
    console.log("Admin login: admin@luxejewels.com / admin123");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();

