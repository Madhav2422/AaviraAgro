export type Cargo = {
  name: string;
  // The short name painted on the side of the container.
  mark: string;
  // The colour of the container, then of the lettering on it.
  paint: string;
  letters: string;
  // One line shown while the container is being loaded.
  line: string;
  // The two columns in the cargo manifest.
  form: string;
  use: string;
};

// Everything the company handles. Add, remove or reorder the cargo here.
export const cargoList: Cargo[] = [
  {
    name: "Sulphur",
    mark: "SULPHUR",
    paint: "#e6bd3a",
    letters: "#14261b",
    line: "Bright yellow and always in demand, for fertilizer plants and chemical makers.",
    form: "Granular, lump",
    use: "Fertilizers, sulphuric acid, chemicals",
  },
  {
    name: "Urea",
    mark: "UREA",
    paint: "#efe6d2",
    letters: "#14261b",
    line: "The most widely used nitrogen fertilizer in the world.",
    form: "Prilled, granular",
    use: "Nitrogen fertilizer, resins, industry",
  },
  {
    name: "DAP",
    mark: "DAP",
    paint: "#2f6a53",
    letters: "#f5ecd8",
    line: "Di-ammonium phosphate, a key source of phosphorus for crops.",
    form: "Granular",
    use: "Phosphate fertilizer",
  },
  {
    name: "MOP",
    mark: "MOP",
    paint: "#b4532a",
    letters: "#f5ecd8",
    line: "Muriate of potash, which gives crops the potassium they need.",
    form: "Granular, powder",
    use: "Potash fertilizer",
  },
  {
    name: "NPK Blends",
    mark: "NPK",
    paint: "#2f5a73",
    letters: "#f5ecd8",
    line: "Nitrogen, phosphorus and potassium, mixed to the grade you need.",
    form: "Granular",
    use: "Complete crop nutrition",
  },
  {
    name: "Ammonium Sulphate",
    mark: "AMM. SULPHATE",
    paint: "#c98a3c",
    letters: "#14261b",
    line: "Nitrogen and sulphur together, in one crystal.",
    form: "Crystal, granular",
    use: "Nitrogen and sulphur fertilizer",
  },
  {
    name: "Rock Phosphate",
    mark: "ROCK PHOSPHATE",
    paint: "#7d6a58",
    letters: "#f5ecd8",
    line: "The raw material behind most phosphate fertilizers.",
    form: "Lump, powder",
    use: "Fertilizer manufacturing",
  },
  {
    name: "Gypsum",
    mark: "GYPSUM",
    paint: "#d8cdb8",
    letters: "#14261b",
    line: "Conditions the soil and supplies calcium and sulphur.",
    form: "Lump, powder",
    use: "Soil conditioner, cement",
  },
];

// How many of the list above the ship carries in the animation, from the top.
export const cargoOnShip = cargoList.slice(0, 6);
