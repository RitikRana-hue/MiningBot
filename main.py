"""
Smart Mining Chatbot with Intelligent Fallback
1. Analyzes question
2. Tries local NLP first
3. Falls back to Gemini AI if needed
"""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import List, Dict, Optional, Tuple
import numpy as np

# Load API key from .env
try:
    with open('.env', 'r') as f:
        for line in f:
            if line.startswith('GEMINI_API_KEY='):
                api_key = line.split('=', 1)[1].strip()
                os.environ['GEMINI_API_KEY'] = api_key
except FileNotFoundError:
    pass

# NLP and ML imports
try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
    from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
    import torch
    NLP_AVAILABLE = True
except ImportError:
    NLP_AVAILABLE = False

# Gemini AI import
try:
    import google.genai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    try:
        import google.generativeai as genai
        GEMINI_AVAILABLE = True
    except ImportError:
        GEMINI_AVAILABLE = False

# Web search imports
try:
    from duckduckgo_search import DDGS
    WEB_SEARCH_AVAILABLE = True
except ImportError:
    WEB_SEARCH_AVAILABLE = False


class QuestionAnalyzer:
    """Analyzes questions to determine complexity and best source."""
    
    def __init__(self):
        self.simple_patterns = [
            'what is', 'what are', 'define', 'explain', 'describe',
            'how does', 'how do', 'types of', 'list', 'name'
        ]
        self.complex_patterns = [
            'compare', 'analyze', 'evaluate', 'why', 'latest',
            'recent', 'current', 'trend', 'future', 'predict',
            'best practice', 'recommend', 'should i', 'which is better'
        ]
    
    def analyze(self, question: str) -> Dict:
        """Analyze question complexity and type."""
        question_lower = question.lower()
        
        # Check if simple or complex
        is_simple = any(pattern in question_lower for pattern in self.simple_patterns)
        is_complex = any(pattern in question_lower for pattern in self.complex_patterns)
        
        # Check if asking for latest/current info
        needs_current = any(word in question_lower for word in ['latest', 'recent', 'current', 'new', '2024', '2025', 'today'])
        
        # Determine complexity score
        complexity = 'simple' if is_simple and not is_complex else 'complex' if is_complex else 'medium'
        
        return {
            'complexity': complexity,
            'needs_current_info': needs_current,
            'is_simple': is_simple,
            'is_complex': is_complex,
            'recommended_source': 'local' if is_simple and not needs_current else 'ai' if is_complex or needs_current else 'local'
        }


class GeminiAI:
    """Gemini AI integration for complex queries."""
    
    def __init__(self):
        self.model = None
        if GEMINI_AVAILABLE:
            api_key = os.getenv('GEMINI_API_KEY')
            if api_key:
                try:
                    genai.configure(api_key=api_key)
                    model_names = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
                    
                    for model_name in model_names:
                        try:
                            self.model = genai.GenerativeModel(model_name)
                            test_response = self.model.generate_content("Hi")
                            print(f"✓ Gemini AI connected: {model_name}")
                            break
                        except Exception as e:
                            continue
                except Exception as e:
                    print(f"✗ Gemini AI error: {e}")
    
    def is_available(self) -> bool:
        """Check if Gemini is available."""
        return self.model is not None
    
    def get_response(self, question: str, context: str = "") -> str:
        """Get response from Gemini AI."""
        if not self.model:
            return None
        
        try:
            system_prompt = """You are a specialized AI assistant for the mining industry.
            Provide accurate, detailed answers about mining operations, equipment, safety, 
            geology, mineral processing, and all types of mining (gold, copper, iron, 
            diamond, lithium, coal, etc.).
            
            Keep responses clear, professional, and focused on mining topics."""
            
            if context:
                prompt = f"{system_prompt}\n\nContext: {context}\n\nQuestion: {question}\n\nAnswer:"
            else:
                prompt = f"{system_prompt}\n\nQuestion: {question}\n\nAnswer:"
            
            response = self.model.generate_content(prompt)
            
            if hasattr(response, 'text'):
                return response.text
            elif hasattr(response, 'parts'):
                return ''.join(part.text for part in response.parts)
            else:
                return str(response)
        except Exception as e:
            print(f"Gemini error: {e}")
            return None


class EnhancedMiningKnowledgeBase:
    """Comprehensive knowledge base for ALL mining types."""
    
    def __init__(self):
        self.qa_pairs = {
            # Surface Mining
            "What is surface mining?": "Surface mining is a method of extracting minerals from the earth by removing the overlying soil and rock (overburden). It includes open-pit mining, strip mining, and mountaintop removal. This method is used when mineral deposits are located near the surface, typically within 100-200 meters depth. Advantages include lower cost, higher production rates, and better safety compared to underground mining.",
            
            "What is open-pit mining?": "Open-pit mining is a surface mining technique where minerals are extracted from an open pit or borrow. It's used for mining minerals found near the surface where the overburden is relatively thin. The pit is created by removing material in benches or layers. Common for copper, gold, iron, and coal extraction.",
            
            "What is strip mining?": "Strip mining removes long strips of overburden to expose mineral seams, commonly used for coal and phosphate. The overburden is placed in previously mined strips. Types include area strip mining (flat terrain) and contour strip mining (hilly terrain). Highly productive but requires land reclamation.",
            
            # Underground Mining
            "What is underground mining?": "Underground mining extracts minerals from deep deposits using tunnels and shafts. Methods include: Room and pillar (leaves pillars for support), Longwall mining (mechanized coal extraction), Cut and fill (backfills mined areas), Block caving (induces ore collapse), and Sublevel stoping (ore removed in slices). Used when deposits are too deep for surface mining (>200m depth).",
            
            "What is room and pillar mining?": "Room and pillar mining creates a checkerboard pattern of rooms and pillars. Pillars support the roof while rooms are excavated. Used for flat-lying deposits like coal, salt, limestone. Advantages: flexible, lower capital cost. Recovery rate: 40-60%. Pillars can be extracted later (retreat mining) for 75-90% recovery.",
            
            # Gold Mining
            "What is gold mining?": "Gold mining extracts gold from ore deposits. Methods include: Placer mining (alluvial deposits), Hard rock mining (underground/open-pit), Heap leaching (low-grade ore), and Dredging (underwater deposits). Major producers: China, Australia, Russia, USA, Canada. Gold occurs as native metal, often with quartz. Processing uses gravity separation, flotation, and cyanide leaching. Average grade: 1-5 g/t.",
            
            "How is gold extracted?": "Gold extraction methods: 1) Crushing and grinding ore, 2) Gravity concentration (for coarse gold), 3) Flotation (sulfide ores), 4) Cyanide leaching (dissolves gold), 5) Carbon adsorption (captures gold from solution), 6) Electrowinning or smelting (recovers pure gold). Modern operations achieve 85-95% recovery.",
            
            "What is placer gold mining?": "Placer mining extracts gold from alluvial deposits (rivers, streams, beaches). Gold settles in sediments due to high density. Methods: Panning (manual), Sluicing (water channels), Dredging (underwater), Hydraulic mining (water jets). Requires minimal processing. Famous: California Gold Rush, Klondike. Lower environmental impact than hard rock mining.",
            
            # Copper Mining
            "What is copper mining?": "Copper mining extracts copper from sulfide and oxide ores. Major methods: Open-pit (90% of production), Underground (high-grade deposits), and In-situ leaching (oxide ores). Top producers: Chile, Peru, China, USA, Congo. Copper occurs as chalcopyrite, bornite, chalcocite. Average grade: 0.5-2% Cu. Used in electrical wiring, construction, electronics.",
            
            "What is porphyry copper?": "Porphyry copper deposits are large, low-grade disseminated ore bodies formed by hydrothermal fluids from cooling magma. Characteristics: Large tonnage (billions of tons), Low grade (0.3-1% Cu), Often contain gold, silver, molybdenum. Mined by open-pit. Examples: Escondida (Chile), Grasberg (Indonesia), Morenci (USA). Account for 60% of world copper production.",
            
            "How is copper processed?": "Copper processing: 1) Crushing and grinding, 2) Flotation (concentrates sulfides to 20-30% Cu), 3) Smelting (removes sulfur, produces matte), 4) Converting (oxidizes iron, produces blister copper 98% Cu), 5) Refining (electrolytic or fire refining to 99.99% Cu). Oxide ores use heap leaching and solvent extraction-electrowinning (SX-EW).",
            
            # Iron Ore Mining
            "What is iron ore mining?": "Iron ore mining extracts iron-rich minerals for steel production. Main ores: Hematite (Fe2O3, 70% Fe), Magnetite (Fe3O4, 72% Fe), Goethite, and Limonite. Methods: Open-pit (most common), Underground (high-grade). Top producers: Australia, Brazil, China, India. Typical grade: 60-70% Fe. World's most mined metal by tonnage.",
            
            "What is hematite?": "Hematite (Fe2O3) is the most important iron ore, containing 70% iron. Characteristics: Red to black color, non-magnetic, high grade. Found in banded iron formations (BIF) and sedimentary deposits. Major deposits: Pilbara (Australia), Carajás (Brazil), Labrador (Canada). Processed by crushing, screening, and direct shipping or beneficiation.",
            
            "What is magnetite?": "Magnetite (Fe3O4) is a magnetic iron ore containing 72% iron. Characteristics: Black color, strongly magnetic, often lower grade than hematite. Requires beneficiation (magnetic separation, flotation). Advantages: higher iron content, better for blast furnaces. Major deposits: Kiruna (Sweden), Kursk (Russia), Chile.",
            
            "How is iron ore processed?": "Iron ore processing: 1) Crushing and screening, 2) Beneficiation (gravity, magnetic separation, flotation), 3) Pelletizing or sintering (agglomeration), 4) Direct shipping (high-grade) or concentration (low-grade). Produces lump ore, fines, or pellets for blast furnaces. Target: >62% Fe, low impurities (silica, alumina, phosphorus).",
            
            # Coal Mining
            "What is coal mining?": "Coal mining extracts coal from underground or surface deposits. Surface methods: Strip mining, Open-pit mining, Mountaintop removal. Underground methods: Longwall mining, Room and pillar, Continuous mining. Coal types: Anthracite (highest grade), Bituminous, Sub-bituminous, Lignite (lowest grade). Used for electricity generation, steel production.",
            
            "What is longwall mining?": "Longwall mining is an underground coal mining method where a long wall of coal is mined in a single slice, typically 1-3 meters thick. A shearer moves back and forth across the coal face, cutting and loading coal onto a conveyor. Hydraulic roof supports advance with the shearer. Highly productive (90% recovery) but requires significant capital investment. Causes surface subsidence.",
            
            "What is continuous mining?": "Continuous mining uses a continuous miner machine with rotating steel drum and tungsten carbide teeth to cut coal. Coal is loaded onto shuttle cars or conveyors. Used in room and pillar mining. Advantages: high productivity, flexible, lower capital than longwall. Typical production: 5-10 tons/minute. Requires good roof conditions.",
            
            "What are coal types?": "Coal types by rank (carbon content): 1) Lignite (25-35% carbon, lowest energy, brown coal), 2) Sub-bituminous (35-45% carbon, low sulfur), 3) Bituminous (45-86% carbon, most common, used for steel and power), 4) Anthracite (86-97% carbon, highest energy, rare). Rank increases with depth, temperature, and pressure (coalification).",
            
            # Diamond Mining
            "What is diamond mining?": "Diamond mining extracts diamonds from kimberlite pipes, alluvial deposits, and marine deposits. Methods: Open-pit (kimberlite pipes), Underground (deep pipes), Alluvial mining (rivers, beaches), and Marine mining (offshore). Top producers: Russia, Botswana, Canada, Australia, Congo. Diamonds form at 150-200km depth, brought up by volcanic eruptions.",
            
            "What is kimberlite?": "Kimberlite is a volcanic rock that brings diamonds from Earth's mantle to surface. Forms carrot-shaped pipes 50-500m diameter. Contains diamonds, olivine, garnet, pyroxene. Only 1% of kimberlites are diamond-bearing. Grade: 0.5-2 carats per ton. Famous pipes: Kimberley (South Africa), Mir (Russia), Diavik (Canada).",
            
            "How are diamonds processed?": "Diamond processing: 1) Crushing (carefully to avoid breaking diamonds), 2) Dense media separation (diamonds float in heavy liquid), 3) X-ray fluorescence sorting (diamonds glow under X-rays), 4) Grease tables (diamonds stick to grease), 5) Hand sorting and grading. Recovery rate: 95-98%. Sorted by size, quality, color.",
            
            # Lithium Mining
            "What is lithium mining?": "Lithium mining extracts lithium for batteries (EVs, electronics). Sources: Hard rock (spodumene pegmatites), Brine deposits (salt lakes), and Clay deposits. Methods: Open-pit mining (hard rock), Brine extraction (pumping, evaporation), and Clay leaching. Top producers: Australia, Chile, China, Argentina. Demand growing rapidly for electric vehicles.",
            
            "How is lithium extracted from brine?": "Lithium brine extraction: 1) Pump brine from underground aquifer, 2) Evaporate in large ponds (12-18 months), 3) Concentrate lithium (from 0.02% to 6%), 4) Remove impurities (boron, magnesium), 5) Precipitate lithium carbonate, 6) Purify and dry. Used in Chile, Argentina, Bolivia salt flats. Lower cost than hard rock but slower.",
            
            "What is spodumene?": "Spodumene is a lithium-bearing mineral (LiAlSi2O6) containing 8% Li2O. Found in pegmatites. Processing: 1) Mining (open-pit), 2) Crushing and dense media separation, 3) Flotation (concentrate to 6% Li2O), 4) Roasting (converts to beta-spodumene), 5) Acid leaching, 6) Precipitation to lithium carbonate or hydroxide. Australia is largest producer.",
            
            # Nickel Mining
            "What is nickel mining?": "Nickel mining extracts nickel for stainless steel (70% use), batteries, and alloys. Sources: Sulfide ores (pentlandite, 0.5-3% Ni) and Laterite ores (1-2% Ni from tropical weathering). Methods: Underground (sulfides), Open-pit (laterites). Top producers: Indonesia, Philippines, Russia, New Caledonia, Australia. Growing demand for EV batteries (nickel-cobalt-manganese).",
            
            "What is laterite nickel?": "Laterite nickel forms from tropical weathering of ultramafic rocks. Layers: Limonite (top, iron-rich, 1-1.5% Ni), Saprolite (bottom, magnesium-rich, 1.5-2.5% Ni). Processing: HPAL (High Pressure Acid Leaching), Rotary kiln-electric furnace (RKEF), or Caron process. Lower grade than sulfides but 70% of world nickel resources. Indonesia, Philippines, New Caledonia.",
            
            "What is pentlandite?": "Pentlandite (Fe,Ni)9S8 is the main nickel sulfide ore, containing 22% nickel. Found with pyrrhotite, chalcopyrite in magmatic deposits. Processing: 1) Mining (underground), 2) Crushing and grinding, 3) Flotation (concentrate to 10-20% Ni), 4) Smelting (produces matte), 5) Converting and refining (99.9% Ni). Major deposits: Sudbury (Canada), Norilsk (Russia), Kambalda (Australia).",
            
            # Uranium Mining
            "What is uranium mining?": "Uranium mining extracts uranium for nuclear fuel. Methods: Open-pit, Underground, and In-situ leaching (ISL - 50% of production). Top producers: Kazakhstan, Canada, Australia, Namibia, Russia. Uranium occurs as uraninite (pitchblende), coffinite. Average grade: 0.1-2% U3O8. Requires radiation safety measures.",
            
            "What is in-situ leaching?": "In-situ leaching (ISL) extracts uranium without mining. Process: 1) Drill injection and recovery wells, 2) Inject leaching solution (acid or alkaline), 3) Dissolve uranium underground, 4) Pump pregnant solution, 5) Extract uranium by ion exchange or solvent extraction. Advantages: low cost, minimal surface disturbance. Used in Kazakhstan, USA. Requires permeable sandstone deposits.",
            
            # Bauxite Mining
            "What is bauxite mining?": "Bauxite mining extracts aluminum ore for aluminum production. Bauxite is mixture of aluminum hydroxides (gibbsite, boehmite, diaspore). Methods: Open-pit (strip mining), typically 4-6 meters deep. Top producers: Australia, China, Guinea, Brazil, India. Grade: 40-60% Al2O3. Processed by Bayer process to alumina, then Hall-Héroult process to aluminum.",
            
            "What is the Bayer process?": "Bayer process converts bauxite to alumina (Al2O3): 1) Crushing and grinding bauxite, 2) Digestion in hot caustic soda (dissolves aluminum hydroxides), 3) Clarification (removes impurities as red mud), 4) Precipitation (seeds crystallize aluminum hydroxide), 5) Calcination (heating to 1000°C produces alumina). Produces 2 tons alumina per ton aluminum. Red mud is waste product.",
            
            # Zinc and Lead Mining
            "What is zinc mining?": "Zinc mining extracts zinc for galvanizing (50%), alloys (brass, bronze), and die-casting. Main ore: Sphalerite (ZnS, 67% Zn). Often found with lead (galena). Methods: Underground (most common), Open-pit. Top producers: China, Peru, Australia, USA, India. Grade: 5-15% Zn. Processing: flotation, roasting, leaching, electrowinning.",
            
            "What is lead mining?": "Lead mining extracts lead for batteries (85%), ammunition, radiation shielding. Main ore: Galena (PbS, 86.6% Pb). Often found with zinc, silver. Methods: Underground, Open-pit. Top producers: China, Australia, USA, Peru, Mexico. Grade: 3-10% Pb. Processing: flotation, smelting, refining. Environmental concerns: lead toxicity.",
            
            # Silver and Platinum
            "What is silver mining?": "Silver mining extracts silver for jewelry, electronics, solar panels, and photography. Sources: Primary silver mines (30%), Lead-zinc mines (35%), Copper mines (20%), Gold mines (15%). Main ores: Argentite (Ag2S), Native silver. Top producers: Mexico, Peru, China, Russia, Chile. Grade: 50-500 g/t. Processing: flotation, smelting, electrolytic refining.",
            
            "What is platinum mining?": "Platinum mining extracts platinum group metals (PGMs): platinum, palladium, rhodium, ruthenium, iridium, osmium. Used in catalytic converters (40%), jewelry (30%), electronics, fuel cells. Main deposits: Bushveld Complex (South Africa, 80% of reserves), Norilsk (Russia), Stillwater (USA). Found in layered mafic intrusions. Grade: 3-10 g/t. Processing: flotation, smelting, refining.",
            
            # Rare Earth and Other Metals
            "What is rare earth mining?": "Rare earth mining extracts 17 rare earth elements (REEs) for magnets, batteries, electronics, catalysts. Light REEs: lanthanum, cerium, praseodymium, neodymium. Heavy REEs: dysprosium, terbium, yttrium. Main ores: Bastnäsite, Monazite, Xenotime. Top producer: China (60%). Processing: crushing, flotation, acid leaching, solvent extraction, separation.",
            
            "What is phosphate mining?": "Phosphate mining extracts phosphate rock for fertilizers (90%), animal feed, detergents. Main mineral: Apatite (Ca5(PO4)3(F,Cl,OH)). Methods: Open-pit (strip mining), Underground, Dredging (marine deposits). Top producers: China, Morocco, USA, Russia, Jordan. Grade: 25-35% P2O5. Processed to phosphoric acid and fertilizers (DAP, MAP, TSP).",
            
            "What is potash mining?": "Potash mining extracts potassium salts for fertilizers (95%). Main minerals: Sylvite (KCl), Carnallite. Methods: Underground (room and pillar, solution mining), Evaporation (brine). Top producers: Canada, Russia, Belarus, China, Germany. Depth: 500-1500m. Grade: 20-40% K2O. Processing: flotation, crystallization, compaction.",
            
            "What is salt mining?": "Salt mining extracts sodium chloride (NaCl) for chemicals (chlorine, caustic soda), de-icing, food. Methods: Underground (room and pillar), Solution mining (inject water, pump brine), Solar evaporation (seawater, salt lakes). Top producers: China, USA, India, Germany, Canada. Deposits: evaporites, salt domes. Purity: 95-99% NaCl.",
            
            "What is tin mining?": "Tin mining extracts tin for solder (50%), tinplate, alloys (bronze, pewter). Main ore: Cassiterite (SnO2, 79% Sn). Found in pegmatites, greisen, alluvial deposits. Methods: Open-pit, Underground, Dredging. Top producers: China, Indonesia, Myanmar, Peru, Bolivia. Grade: 0.5-2% Sn. Processing: gravity separation, flotation, smelting.",
            
            "What is manganese mining?": "Manganese mining extracts manganese for steel production (90%, deoxidizer and alloying), batteries (alkaline, lithium-ion). Main ores: Pyrolusite (MnO2), Rhodochrosite (MnCO3). Methods: Open-pit, Underground. Top producers: South Africa, Australia, China, Gabon, Brazil. Grade: 25-50% Mn. Processing: crushing, screening, beneficiation, smelting to ferromanganese.",
            
            "What is chromium mining?": "Chromium mining extracts chromium for stainless steel (85%), alloys, chemicals, refractories. Main ore: Chromite (FeCr2O4, 46% Cr2O3). Found in layered mafic intrusions, ophiolites. Methods: Open-pit, Underground. Top producers: South Africa, Kazakhstan, Turkey, India, Finland. Grade: 40-50% Cr2O3. Processing: crushing, gravity separation, smelting to ferrochrome.",
            
            "What is molybdenum mining?": "Molybdenum mining extracts molybdenum for steel alloys (80%, high-strength, corrosion-resistant), catalysts, lubricants. Main ore: Molybdenite (MoS2, 60% Mo). Found in porphyry copper deposits, standalone deposits. Methods: Open-pit, Underground. Top producers: China, Chile, USA, Peru, Mexico. Grade: 0.01-0.2% Mo. Processing: flotation, roasting to MoO3.",
            
            "What is tungsten mining?": "Tungsten mining extracts tungsten for cutting tools (60%), alloys, electronics, lighting. Main ores: Wolframite ((Fe,Mn)WO4), Scheelite (CaWO4). Found in greisen, skarns, veins. Methods: Underground, Open-pit. Top producers: China (80%), Vietnam, Russia, Rwanda, Bolivia. Grade: 0.5-2% WO3. Processing: gravity separation, flotation, chemical processing.",
            
            "What is cobalt mining?": "Cobalt mining extracts cobalt for batteries (50%, lithium-ion), superalloys (20%), catalysts. Main ores: Cobaltite (CoAsS), Carrolite (CuCo2S4). Often byproduct of copper and nickel mining. Methods: Underground, Open-pit. Top producers: Congo (70%), Russia, Australia, Philippines, Canada. Grade: 0.1-0.5% Co. Processing: flotation, leaching, solvent extraction, electrowinning.",
            
            "What is graphite mining?": "Graphite mining extracts graphite for batteries (30%, lithium-ion anodes), refractories, lubricants, pencils. Types: Flake graphite (metamorphic), Amorphous graphite (coal-like), Vein graphite (hydrothermal, highest quality). Methods: Open-pit, Underground. Top producers: China, Mozambique, Brazil, Madagascar, Canada. Grade: 5-25% C. Processing: crushing, flotation, purification.",
            
            # Mining Equipment
            "What mining equipment is used?": "Mining equipment includes: Surface: Haul trucks (100-400 tons), Excavators, Draglines, Dozers, Drills, Shovels. Underground: Continuous miners, Longwall shearers, Shuttle cars, Roof bolters, Loaders (LHD), Trucks. Processing: Crushers, Mills, Flotation cells, Thickeners, Filters. Support: Ventilation fans, Pumps, Conveyors, Hoists.",
            
            "What is a haul truck?": "Haul trucks transport ore and waste in open-pit mines. Sizes: 100-400 ton capacity. Features: diesel or electric drive, autonomous capability, GPS tracking. Major models: Caterpillar 797F (400t), Komatsu 980E (360t), Liebherr T284 (400t). Advantages: flexible, high productivity. Costs: $5-7 million. Tire costs: $50,000 each.",
            
            "What is a dragline?": "Dragline is a large excavator using a bucket suspended by cables. Used for overburden removal in coal and phosphate mining. Bucket capacity: 30-220 cubic meters. Boom length: 90-140 meters. Weight: 2000-13,000 tons. Advantages: long reach, low operating cost. Examples: Big Muskie (13,500 tons, retired), Bagger 293 (world's largest).",
            
            "What is an excavator?": "Excavators are tracked machines with boom, stick, and bucket for digging. Types: Hydraulic excavators (most common), Cable excavators (large-scale). Sizes: 20-800 tons. Used for loading haul trucks, digging, material handling. Major brands: Caterpillar, Komatsu, Hitachi, Liebherr. Bucket capacity: 1-50 cubic meters.",
            
            # Mining Safety
            "What is mining safety?": "Mining safety includes: Ventilation (fresh air, gas control), Ground control (roof support, rock bolting), Fire prevention (fire-resistant materials, suppression systems), Emergency response (escape routes, refuges, communication), Personal protective equipment (helmets, boots, respirators, gas detectors), Training (hazard awareness, emergency procedures), Monitoring (gas detection, seismic monitoring).",
            
            "What is mine ventilation?": "Mine ventilation provides fresh air and removes hazardous gases (methane, CO, CO2, NOx). Components: Main fans (surface), Auxiliary fans (underground), Ventilation shafts, Doors, Stoppings, Regulators. Air velocity: 0.5-5 m/s. Air quantity: 3-6 m³/min per person. Monitoring: gas detectors, airflow sensors. Critical for underground safety.",
            
            "What is ground control?": "Ground control prevents roof falls and wall failures in underground mines. Methods: Rock bolting (anchors roof), Mesh and shotcrete (surface support), Steel sets (arches), Cable bolts (long-term support), Pillars (natural support). Monitoring: extensometers, stress cells, seismic systems. Critical for worker safety. Accounts for 25% of underground mining fatalities.",
            
            # Mineral Processing
            "What is mineral processing?": "Mineral processing (beneficiation) separates valuable minerals from gangue. Steps: 1) Comminution (crushing, grinding), 2) Sizing (screening, classification), 3) Concentration (gravity, magnetic, flotation, leaching), 4) Dewatering (thickening, filtering, drying). Goal: increase grade, reduce smelting costs. Recovery: 70-95% depending on ore type.",
            
            "What is flotation?": "Flotation separates minerals based on surface properties. Process: 1) Grind ore to fine particles, 2) Mix with water (slurry), 3) Add collectors (make valuable minerals hydrophobic), 4) Add frothers (create bubbles), 5) Air bubbles attach to valuable minerals, 6) Float to surface as froth, 7) Collect concentrate. Used for copper, lead, zinc, nickel, gold. Recovery: 80-95%.",
            
            "What is heap leaching?": "Heap leaching extracts metals from low-grade ore. Process: 1) Crush ore, 2) Stack on lined pad, 3) Irrigate with leaching solution (cyanide for gold, sulfuric acid for copper), 4) Collect pregnant solution, 5) Extract metal (carbon adsorption, SX-EW). Advantages: low cost, treats low-grade ore. Disadvantages: slow (months), lower recovery (60-80%). Used for gold, copper, uranium.",
            
            "What is crushing?": "Crushing reduces ore size for processing. Stages: Primary (jaw, gyratory crushers, 1000mm to 150mm), Secondary (cone crushers, 150mm to 50mm), Tertiary (cone, impact crushers, 50mm to 10mm). Capacity: 100-10,000 tons/hour. Energy intensive (50% of processing energy). Followed by grinding for finer sizes.",
            
            "What is grinding?": "Grinding reduces ore to fine particles (10-100 microns) for liberation. Equipment: Ball mills (steel balls), SAG mills (semi-autogenous, ore + balls), Rod mills (steel rods), Vertical mills. Wet grinding (with water) most common. Energy intensive. Liberation size depends on ore mineralogy. Critical for flotation efficiency.",
            
            # Mine Development
            "What is mine development?": "Mine development creates access to ore body. Surface: Haul roads, Waste dumps, Processing plant, Infrastructure. Underground: Shafts (vertical access), Declines (spiral ramps), Drifts (horizontal tunnels), Raises (vertical connections), Ventilation system. Timeline: 2-5 years. Cost: $100M-$1B+ depending on size and depth.",
            
            "What is a mine shaft?": "Mine shaft is vertical or inclined opening for access, ventilation, and ore transport. Types: Production shaft (ore hoisting), Service shaft (personnel, materials), Ventilation shaft (air circulation). Depth: 500-4000m. Diameter: 4-10m. Sinking rate: 5-15m/week. Equipment: headframe, hoist, skip, cage. Deepest: Mponeng (South Africa, 4km).",
            
            # Environmental and Reclamation
            "What is mine reclamation?": "Mine reclamation restores mined land. Steps: 1) Backfilling (replace overburden), 2) Regrading (restore topography), 3) Soil replacement (topsoil), 4) Revegetation (native plants), 5) Water management (drainage, treatment). Goals: stable landform, vegetation cover, water quality. Required by law. Cost: $10,000-$100,000 per hectare. Timeline: 5-20 years.",
            
            "What is acid mine drainage?": "Acid mine drainage (AMD) occurs when sulfide minerals oxidize, producing sulfuric acid. Causes: exposure of pyrite (FeS2) to air and water. Effects: low pH (2-4), dissolved metals (iron, copper, zinc), orange precipitates. Prevention: water covers, dry covers, alkaline amendments. Treatment: lime neutralization, wetlands, reverse osmosis. Major environmental concern for coal and metal mines.",
            
            "What are tailings?": "Tailings are waste material from mineral processing. Composition: ground rock, water, residual chemicals. Storage: tailings dams, paste backfill, dry stacking. Volume: 90-99% of mined material. Concerns: dam failures, water pollution, dust. Management: proper design, monitoring, closure. Examples: Brumadinho (Brazil, 2019 failure), Mount Polley (Canada, 2014 failure).",
        }
        
        # Initialize embeddings
        if NLP_AVAILABLE:
            print("Loading sentence transformer model...")
            self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
            self.questions = list(self.qa_pairs.keys())
            self.answers = list(self.qa_pairs.values())
            print("Creating embeddings for knowledge base...")
            self.question_embeddings = self.embedder.encode(self.questions, show_progress_bar=True)
            print(f"✓ Knowledge base ready with {len(self.questions)} Q&A pairs")
    
    def find_best_answer(self, query: str, threshold: float = 0.3) -> Tuple[Optional[str], float]:
        """Find the best matching answer using semantic similarity."""
        if not NLP_AVAILABLE:
            return None, 0.0
        
        query_embedding = self.embedder.encode([query])
        similarities = cosine_similarity(query_embedding, self.question_embeddings)[0]
        max_idx = np.argmax(similarities)
        max_similarity = similarities[max_idx]
        
        if max_similarity > threshold:
            return self.answers[max_idx], max_similarity
        return None, max_similarity


class SmartMiningChatbot:
    """Smart chatbot with intelligent source selection."""
    
    def __init__(self):
        # Initialize knowledge base directly
        self.knowledge_base = EnhancedMiningKnowledgeBase()
        
        # Initialize components
        self.analyzer = QuestionAnalyzer()
        self.gemini = GeminiAI()
        self.conversation_history = []
        
        # Initialize local text generation
        if NLP_AVAILABLE:
            print("Loading local NLP model...")
            try:
                model_name = "google/flan-t5-base"
                self.tokenizer = AutoTokenizer.from_pretrained(model_name)
                self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
                self.generator = pipeline(
                    "text2text-generation",
                    model=self.model,
                    tokenizer=self.tokenizer,
                    max_length=512,
                    device=0 if torch.cuda.is_available() else -1
                )
                print(f"✓ Local NLP model loaded")
            except Exception as e:
                print(f"Could not load local model: {e}")
                self.generator = None
        else:
            self.generator = None
    
    def is_mining_related(self, question: str) -> bool:
        """Check if question is mining-related."""
        mining_keywords = [
            'mining', 'mine', 'mineral', 'ore', 'excavation', 'extraction',
            'coal', 'gold', 'copper', 'iron', 'diamond', 'lithium', 'uranium',
            'bauxite', 'nickel', 'zinc', 'lead', 'silver', 'platinum', 'tin',
            'phosphate', 'potash', 'salt', 'manganese', 'chromium', 'molybdenum',
            'tungsten', 'cobalt', 'graphite', 'rare earth', 'underground', 'surface',
            'quarry', 'drilling', 'blast', 'safety', 'equipment', 'ventilation',
            'crusher', 'conveyor', 'haul', 'truck', 'excavator', 'processing',
            'flotation', 'smelting', 'refining', 'tailings', 'exploration'
        ]
        question_lower = question.lower()
        return any(keyword in question_lower for keyword in mining_keywords)
    
    def get_local_response(self, question: str, context: str = "") -> Optional[str]:
        """Get response from local NLP model."""
        if not self.generator:
            return None
        
        try:
            prompt = f"Answer this mining industry question: {question}"
            if context:
                prompt = f"Context: {context[:300]}\n\nQuestion: {question}\n\nAnswer:"
            
            response = self.generator(prompt, max_length=300, num_return_sequences=1)
            return response[0]['generated_text']
        except Exception as e:
            print(f"Local model error: {e}")
            return None
    
    def get_response(self, question: str) -> dict:
        """
        Smart response system:
        1. Analyze question
        2. Try local knowledge base
        3. If confidence low, try Gemini AI
        4. Return best response with source info
        """
        
        # Step 1: Check if mining-related
        if not self.is_mining_related(question):
            return {
                "response": "I'm specialized in mining industry topics only. I can help with questions about gold, copper, iron, diamond, lithium, coal, and all other types of mining, equipment, safety, and processing.",
                "confidence": 1.0,
                "source": "filter",
                "analysis": {"complexity": "n/a"},
                "success": False
            }
        
        # Step 2: Analyze question
        analysis = self.analyzer.analyze(question)
        print(f"Question analysis: {analysis}")
        
        # Step 3: Try local knowledge base first
        kb_answer, kb_confidence = self.knowledge_base.find_best_answer(question)
        print(f"Knowledge base confidence: {kb_confidence:.2f}")
        
        # Step 4: Decide on response strategy
        
        # High confidence in knowledge base - use it
        if kb_answer and kb_confidence > 0.7:
            return {
                "response": kb_answer,
                "confidence": float(kb_confidence),
                "source": "local_knowledge_base",
                "analysis": analysis,
                "success": True,
                "fallback_used": False
            }
        
        # Medium confidence - enhance with local NLP
        if kb_answer and kb_confidence > 0.5:
            local_enhanced = self.get_local_response(question, kb_answer)
            if local_enhanced and len(local_enhanced) > 50:
                return {
                    "response": local_enhanced,
                    "confidence": float(kb_confidence),
                    "source": "local_nlp_enhanced",
                    "analysis": analysis,
                    "success": True,
                    "fallback_used": False
                }
            else:
                # Local NLP failed, use knowledge base
                return {
                    "response": kb_answer,
                    "confidence": float(kb_confidence),
                    "source": "local_knowledge_base",
                    "analysis": analysis,
                    "success": True,
                    "fallback_used": False
                }
        
        # Low confidence or complex question - try Gemini AI
        if self.gemini.is_available():
            print("Using Gemini AI fallback...")
            gemini_response = self.gemini.get_response(question, kb_answer if kb_answer else "")
            
            if gemini_response:
                return {
                    "response": gemini_response,
                    "confidence": 0.9,
                    "source": "gemini_ai",
                    "analysis": analysis,
                    "success": True,
                    "fallback_used": True,
                    "local_confidence": float(kb_confidence) if kb_answer else 0.0
                }
        
        # Fallback to local NLP if Gemini not available
        if kb_answer:
            local_response = self.get_local_response(question, kb_answer)
            if local_response:
                return {
                    "response": local_response,
                    "confidence": float(kb_confidence),
                    "source": "local_nlp",
                    "analysis": analysis,
                    "success": True,
                    "fallback_used": False
                }
            else:
                return {
                    "response": kb_answer,
                    "confidence": float(kb_confidence),
                    "source": "local_knowledge_base",
                    "analysis": analysis,
                    "success": True,
                    "fallback_used": False
                }
        
        # No good answer found
        return {
            "response": "I don't have specific information about that. Try asking about specific mining types (gold, copper, iron, etc.), equipment, safety, or processing methods.",
            "confidence": 0.2,
            "source": "none",
            "analysis": analysis,
            "success": False,
            "fallback_used": False
        }
    
    def add_to_history(self, question: str, response: dict):
        """Add interaction to conversation history."""
        self.conversation_history.append({
            "question": question,
            "response": response['response'],
            "source": response['source'],
            "confidence": response['confidence']
        })
        if len(self.conversation_history) > 10:
            self.conversation_history.pop(0)


# Flask API
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

print("Initializing smart mining chatbot...")
chatbot = SmartMiningChatbot()
print("✓ Chatbot ready!")

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Smart Mining Chatbot API",
        "strategy": "Local NLP first, Gemini AI fallback",
        "features": ["Question analysis", "Intelligent source selection", "All mining types"],
        "knowledge_base_size": len(chatbot.knowledge_base.questions),
        "gemini_available": chatbot.gemini.is_available(),
        "local_nlp_available": NLP_AVAILABLE
    })

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.json
        question = data.get('question', '')
        
        if not question:
            return jsonify({"error": "No question provided"}), 400
        
        result = chatbot.get_response(question)
        chatbot.add_to_history(question, result)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "error": str(e),
            "success": False,
            "response": "An error occurred."
        }), 500

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({
        "mode": "smart_hybrid",
        "local_nlp_available": NLP_AVAILABLE,
        "gemini_available": chatbot.gemini.is_available(),
        "knowledge_base_size": len(chatbot.knowledge_base.questions),
        "strategy": "Local first, AI fallback",
        "mining_types": ["coal", "gold", "copper", "iron", "diamond", "lithium", 
                        "uranium", "bauxite", "nickel", "zinc", "lead", "silver",
                        "platinum", "tin", "phosphate", "potash", "rare earth", "and more"]
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "mode": "smart_hybrid",
        "port": 5000
    })


if __name__ == '__main__':
    # Get port from environment (for cloud platforms)
    port = int(os.environ.get('PORT', 5000))
    
    # Check if running in production
    debug_mode = os.environ.get('FLASK_ENV', 'production') == 'development'
    
    print("\n" + "=" * 70)
    print("Smart Mining Industry Chatbot API")
    print("=" * 70)
    print(f"Local NLP: {'✓ Available' if NLP_AVAILABLE else '✗ Not Available'}")
    print(f"Gemini AI: {'✓ Available' if chatbot.gemini.is_available() else '✗ Not Available'}")
    print(f"Knowledge Base: {len(chatbot.knowledge_base.questions)} Q&A pairs")
    print(f"Mining Types: 24+ types covered")
    print("\n" + "=" * 70)
    print("Smart Strategy:")
    print("  1. Analyze question complexity")
    print("  2. Try local knowledge base first")
    print("  3. If confidence < 70%, use Gemini AI")
    print("  4. Return best response with source info")
    print("=" * 70)
    print(f"\nServer starting on http://0.0.0.0:{port}")
    print(f"Environment: {'Development' if debug_mode else 'Production'}")
    print("=" * 70 + "\n")
    
    try:
        app.run(
            debug=debug_mode,
            host='0.0.0.0',
            port=port,
            use_reloader=False
        )
    except Exception as e:
        print(f"\nError starting server: {e}")
