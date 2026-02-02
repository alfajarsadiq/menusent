export const restaurants = {
  grilltown: {
    title: "Grill Town",
    logo: "/images/grilltown.png",
    whatsapp: "971566368870",
    // These strings must match the filenames in public/textures/grilltown/
    cover: "front", 
    back: "back",
    pages: ["page1", "page2", "page3"], 
    width: 1.28, // Standard width
  },
  seabrill: {
    title: "Seabrill",
    logo: "/images/seabrilllogo.png", 
    whatsapp: "971501111111",
    cover: "front",
    back: "back",
    pages: ["page1", "page2", "page3"],
    width: 1.28, // Standard width
  },
  spiceroutes: {
    title: "The Spice Routes",
    logo: "/images/spicerouteslogo.png", // Matches your file structure
    whatsapp: "7050534343", // Number from the menu image
    // These match the files in public/textures/spiceroutes/
    cover: "front", 
    back: "back",
    pages: ["page1", "page2", "page3", "page4"], 
    width: 0.765, // Calculated width for Tall Menu (917x2048)
  },
};
