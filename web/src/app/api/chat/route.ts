import { NextRequest, NextResponse } from "next/server";

interface KnowledgeBase {
  [key: string]: string;
}

const knowledgeBase: KnowledgeBase = {
  // Coal Types
  anthracite:
    "Anthracite is the highest grade of coal with 86-97% carbon content. It burns cleanly with little smoke, has the highest energy density, and is primarily used for residential and commercial heating.",
  bituminous:
    "Bituminous coal contains 45-86% carbon and is the most abundant type. It's used for electricity generation, steel production (coking coal), and industrial processes. Major deposits exist in the US, China, and Australia.",
  lignite:
    "Lignite (brown coal) has 25-35% carbon content and high moisture. It's the lowest grade coal, used primarily in power plants near mining sites due to high transport costs. Germany and Australia are major producers.",
  subbituminous:
    "Sub-bituminous coal has 35-45% carbon content. It's cleaner burning than lignite with lower sulfur content, commonly used in power generation. Wyoming's Powder River Basin has large deposits.",

  // Mining Methods
  "surface mining":
    "Surface mining (open-pit/strip mining) removes overburden to access coal seams near the surface. It's cost-effective for shallow deposits (<200 feet). Methods include strip mining, open-pit, and mountaintop removal.",
  "underground mining":
    "Underground mining accesses deep coal seams through shafts or tunnels. Methods include room-and-pillar (leaving coal pillars for support) and longwall mining (using hydraulic supports). Deeper but accesses more coal.",
  longwall:
    "Longwall mining uses a shearer to cut coal from a long wall face (1000+ feet). Hydraulic roof supports advance as mining progresses, allowing controlled roof collapse behind. Highly productive method for thick, uniform seams.",
  "room and pillar":
    "Room-and-pillar mining cuts a network of rooms with coal pillars left for roof support. About 50-60% of coal is extracted initially, with more recovered during retreat mining. Common in the eastern US.",

  // Safety & Equipment
  safety:
    "Coal mine safety involves: ventilation (controlling methane/dust), ground control (roof bolting), personal protective equipment, gas monitoring, emergency response plans, and regular inspections. MSHA regulates US mines.",
  ventilation:
    "Mine ventilation provides fresh air, dilutes methane gas, and removes dust. Main fans create airflow through intake and return airways. Proper ventilation prevents explosions and respiratory diseases.",
  methane:
    "Methane (CH4) is released from coal seams during mining. It's explosive at 5-15% concentration in air. Continuous monitoring, proper ventilation, and degasification systems are essential for safety.",
  dust:
    "Coal dust is both an explosion hazard and causes black lung disease (pneumoconiosis). Control methods include water sprays, ventilation, dust collectors, and respiratory protection. Rock dusting neutralizes coal dust.",

  // Production & Analysis
  production:
    "Coal production is measured in tonnes. Key metrics include: run-of-mine (ROM) output, clean coal yield, recovery rate, stripping ratio (overburden to coal), and productivity (tonnes per man-hour).",
  quality:
    "Coal quality parameters include: calorific value (BTU/lb), moisture content, ash content, volatile matter, sulfur content, and Hardgrove Grindability Index (HGI). These affect pricing and usability.",
  reserves:
    "Coal reserves are classified as proven, probable, or possible based on geological confidence. The US has ~250 billion tonnes of recoverable reserves. Key factors: seam thickness, depth, and quality.",

  // Environmental
  environmental:
    "Environmental concerns include: land disturbance, water pollution (acid mine drainage), air emissions, methane release, and reclamation requirements. Modern mines implement extensive mitigation measures.",
  reclamation:
    "Mine reclamation restores land after mining. It includes: regrading to original contours, replacing topsoil, revegetation, controlling erosion, and monitoring water quality. Required by SMCRA in the US.",

  // Economics
  economics:
    "Coal economics depend on: mining costs, transportation (rail/barge), coal quality premiums, market prices, and regulations. Thermal coal for power and metallurgical coal for steel have different markets.",
  transportation:
    "Coal transport methods: rail (most common, ~70%), barge/ship, truck, and conveyor. Transport can be 30-50% of delivered cost. Proximity to markets significantly affects mine viability.",
};

const greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "howdy"];
const farewells = ["bye", "goodbye", "see you", "farewell", "quit", "exit"];

function getResponse(userInput: string): string {
  const input = userInput.toLowerCase().trim();

  // Check for greetings
  if (greetings.some((g) => input.includes(g))) {
    return "Hello! I'm your Mining Bot. I can help you with:\n\n• **Coal Types**: Anthracite, Bituminous, Lignite, Sub-bituminous\n• **Mining Methods**: Surface mining, Underground, Longwall, Room & Pillar\n• **Safety**: Ventilation, Methane control, Dust management\n• **Production**: Quality analysis, Reserves, Metrics\n• **Environment**: Reclamation, Environmental impact\n\nYou can also upload files and photos for analysis. What would you like to know?";
  }

  // Check for farewells
  if (farewells.some((f) => input.includes(f))) {
    return "Goodbye! Stay safe in the mines! Feel free to come back if you have more questions. ⛏️";
  }

  // Search knowledge base
  for (const [keyword, info] of Object.entries(knowledgeBase)) {
    if (input.includes(keyword)) {
      return info;
    }
  }

  // Check for coal-specific questions
  if (input.includes("coal") || input.includes("seam")) {
    return "Coal is a combustible sedimentary rock formed from ancient plant matter. The four main types by rank (carbon content) are:\n\n1. **Lignite** (25-35% carbon) - Lowest grade\n2. **Sub-bituminous** (35-45% carbon)\n3. **Bituminous** (45-86% carbon) - Most common\n4. **Anthracite** (86-97% carbon) - Highest grade\n\nWould you like details on any specific type or mining method?";
  }

  if (input.includes("mining") || input.includes("mine") || input.includes("miner")) {
    return "Coal mining extracts coal from the earth using two main methods:\n\n**Surface Mining** (for shallow deposits):\n• Strip mining\n• Open-pit mining\n• Mountaintop removal\n\n**Underground Mining** (for deep deposits):\n• Longwall mining\n• Room-and-pillar mining\n• Continuous mining\n\nWhich method would you like to learn more about?";
  }

  if (input.includes("analyse") || input.includes("analyze") || input.includes("data") || input.includes("report")) {
    return "I can help analyze your mining data! You can:\n\n📊 **Upload Data Files**: CSV, Excel, or JSON with production data\n📷 **Share Photos**: Site images, equipment, or geological samples\n📈 **Get Insights**: Production trends, quality metrics, safety analysis\n\nUse the upload button to share your files, and I'll help analyze them!";
  }

  if (input.includes("equipment") || input.includes("machinery")) {
    return "Key coal mining equipment includes:\n\n**Surface Mining**:\n• Draglines, Excavators, Haul trucks\n• Bulldozers, Scrapers, Conveyors\n\n**Underground Mining**:\n• Continuous miners, Longwall shearers\n• Shuttle cars, Roof bolters\n• Ventilation fans, Conveyor systems\n\nWhat specific equipment interests you?";
  }

  // Default response
  return "I specialize in mining topics. Try asking about:\n\n• **Coal types**: Anthracite, Bituminous, Lignite\n• **Mining methods**: Surface, Underground, Longwall\n• **Safety**: Ventilation, Methane, Dust control\n• **Analysis**: Upload files or photos for data analysis\n• **Production**: Quality, Reserves, Economics\n\nHow can I help you with mining?";
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = getResponse(message);

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
