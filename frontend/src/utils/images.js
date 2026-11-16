export const u = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fm=jpg&fit=crop`;

export const IMG = {
  roseGoldRing: "1622398925373-3f91b1e275f5",
  goldDiamondRing: "1611955167811-4711904bb9f8",
  crownPendant: "1685970731194-e27b477e87ba",
  goldChain: "1611107683227-e9060eccd846",
  hoops: "1619203451989-53f6d2ca0e57",
  bracelet: "1602173574767-37ac01994b2a",
  purpleRing: "1603561596973-8166e9e089d1",
  silverPendant: "1598560917505-59a3ad559071",
  emeraldNecklace: "1583937443351-f2f669fbe2cf",
  goldEarrings: "1704445010872-2faefdd733aa",
  diamondBracelet: "1689397136362-dce64e557fcc",
  womanNecklace: "1620656798579-1984d9e87df7",
  threeRings: "1631982690223-8aa4be0a2497",
  diamondRing: "1631982686092-e6561a853187",
  ringsNecklace: "1633934542430-0905ccb5f050",
  purpleBeads: "1601121141461-9d6647bca1ed",
  pearlsRed: "1721103418312-b0057a8c31c2",
  threePieces: "1641290748359-1d944fc8359a",
  earringsBlack: "1693212793204-bcea856c75fe",
  coupleRings: "1723802205505-2f88b2227718",
};

export const HERO_SLIDES = [
  { img: IMG.roseGoldRing, tag: "Rose Gold Solitaire", price: "₹45,000" },
  { img: IMG.womanNecklace, tag: "Layered Gold Chains", price: "₹34,000" },
  { img: IMG.hoops, tag: "Diamond Hoops", price: "₹47,500" },
];
export const CATEGORY_IMAGES = { rings: IMG.goldDiamondRing, necklaces: IMG.crownPendant, earrings: IMG.hoops, bracelets: IMG.diamondBracelet };
export const COLLECTION_IMAGES = [IMG.purpleRing, IMG.emeraldNecklace, IMG.threeRings, IMG.pearlsRed];
export const GALLERY = [IMG.ringsNecklace, IMG.purpleBeads, IMG.pearlsRed, IMG.threePieces, IMG.earringsBlack, IMG.coupleRings];
