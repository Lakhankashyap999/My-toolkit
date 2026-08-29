// @ts-nocheck
export type ControllerBrand = "FANUC" | "SIEMENS" | "MITSUBISHI" | "HAAS";

export type AlarmEntry = {
  id: string;
  brand: ControllerBrand;
  code: string;
  title: string;
  category: "Servo" | "Spindle" | "PMC/PLC" | "Coolant/Lube" | "Overtravel" | "ATC" | "System" | "Pneumatic/Hydraulic";
  description: string;
  causes: string[];
  electricalChecks: string[];
  mechanicalChecks: string[];
  solutionSteps: string[];
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
};

export type FluidSystemTree = {
  id: string;
  name: string;
  icon: string;
  typicalAlarm: string;
  workingPressure: string;
  symptoms: string[];
  faultCauses: string[];
  electricalPoints: string[];
  mechanicalPoints: string[];
  quickFix: string[];
};

export type PartDefectEntry = {
  id: string;
  defectName: string;
  icon: string;
  visualSymptom: string;
  rootCauses: { area: string; cause: string }[];
  actionSteps: string[];
  formula?: string;
};

export const CNC_ALARMS: AlarmEntry[] = [
  {
    id: "fanuc-401",
    brand: "FANUC",
    code: "401",
    title: "SERVO ALARM: _-AXIS VRDY OFF (V-Ready Signal Disconnected)",
    category: "Servo",
    description: "Servo amplifier ready signal (VRDY) dropped LOW while the CNC was expecting the drive to be energized. The main magnetic contactor (MCC) dropped or did not engage.",
    causes: [
      "Emergency Stop (E-Stop) loop is open or tripped",
      "Power Supply Module (PSM) alarm active (Check PSM 7-segment display)",
      "24V DC auxiliary power supply voltage dropped below 21.6V",
      "CX4 / CX3 contactor control cable disconnected or damaged",
      "Servo Amplifier Module (SVM) internal fault or IPM failure",
      "Door safety switch open or external interlocking tripped"
    ],
    electricalChecks: [
      "Check 24V DC on terminals CXA2A/CXA2B on Power Supply Module",
      "Measure 3-phase 200V-220V AC input at R, S, T terminals of PSM",
      "Check continuity of E-Stop series circuit across terminal ESP (TB1)",
      "Inspect MCC (Magnetic Contactor) coil resistance (approx 50-80 ohms) and 24V coil drive signal"
    ],
    mechanicalChecks: [
      "Verify all physical Emergency Stop mushroom push-buttons are released",
      "Check if any machine axis is pressed against physical hard limit switch",
      "Ensure enclosure door CE safety interlock switch is fully engaged"
    ],
    solutionSteps: [
      "Step 1: Check 7-segment LED display on PSM & SVM in the electrical cabinet.",
      "Step 2: If PSM shows '--' and SVM shows '--', check E-stop string & MCC 24V signal.",
      "Step 3: If PSM shows error code (e.g. 01, 02, 04), refer to PSM Alarm table.",
      "Step 4: Press RESET on CNC panel after releasing E-stop. Cycle CNC main power if needed."
    ],
    severity: "CRITICAL",
  },
  {
    id: "fanuc-414",
    brand: "FANUC",
    code: "414",
    title: "SERVO ALARM: _-AXIS DIGITAL SERVO SYSTEM FAULT (IPM / HC / HCL)",
    category: "Servo",
    description: "Digital servo software detected abnormal current, IPM power module short circuit, or DC link overvoltage on the specified axis.",
    causes: [
      "Servo motor U, V, W power phase wire shorted to ground (Megger test needed)",
      "IPM (Intelligent Power Module) internal IGBT breakdown inside SVM amplifier",
      "Motor electromagnetic holding brake not releasing (Brake coil 24V missing)",
      "Axis mechanical jam / Ball screw locked / Guideway seized due to lack of lubrication",
      "Current detection sensor / feedback circuit damaged on SVM control PCB"
    ],
    electricalChecks: [
      "Disconnect motor UVW plug. Measure resistance between U-V, V-W, W-U (Must be balanced, 0.5 - 3.0 ohms).",
      "Test insulation resistance from each phase (U, V, W) to Earth Ground with a 500V Megger (Must be > 50 Megohms).",
      "Check 24V DC at holding brake terminal (BK+ and BK-) during servo ON.",
      "Measure SVM internal DC link bus voltage (Approx 300V - 325V DC)."
    ],
    mechanicalChecks: [
      "With power OFF and brake manually released, turn the axis ball screw by hand to check for mechanical stiffness or jamming.",
      "Inspect way-lube oil film on linear guide rails or turcite box guideways."
    ],
    solutionSteps: [
      "Step 1: Open Diagnostic screen (DGN 0200, 0201, 0204) to identify exact bit (e.g., OVC, HCL, IPM, HC).",
      "Step 2: If HCL / IPM bit is 1, disconnect UVW cable from drive and turn ON power. If 414 persists, SVM drive is blown.",
      "Step 3: If 414 clears with cable removed, inspect motor winding insulation and cable damage.",
      "Step 4: Verify motor brake opens cleanly before axis moves."
    ],
    severity: "CRITICAL",
  },
  {
    id: "fanuc-1001",
    brand: "FANUC",
    code: "1001",
    title: "PMC ALARM: LUBRICATION PRESSURE LOW / WAY-LUBE OIL FAULT",
    category: "Coolant/Lube",
    description: "Centralized slide rail lubrication pump pressure switch did not reach set pressure (12-15 Bar) within the preset timer (typically 15-30 seconds).",
    causes: [
      "Lube oil reservoir level empty or float sensor dry",
      "Lube pump motor burned out, disconnected, or capacitor failed",
      "Oil pipe cracked, punctured, or fitting leaking heavily on machine axis",
      "Progressive distributor metering cartridge jammed with old sludge",
      "Pressure switch (normally 12-15 bar) defective or out of calibration"
    ],
    electricalChecks: [
      "Check 230V AC or 24V DC supply at lube pump motor terminals during cycle.",
      "Inspect Diagnostic signal (X address for Lube Pressure Switch, e.g., X4.2) when pressure builds.",
      "Check float level switch continuity (Open = Low oil, Closed = OK)."
    ],
    mechanicalChecks: [
      "Check oil level in transparent tank. Use ISO VG 68 slide way oil.",
      "Inspect pressure gauge on pump unit during manual prime button press (Must rise to 15-20 Bar and hold).",
      "Trace plastic nylon lines along X, Y, Z axes for oil leaks or severed tubes."
    ],
    solutionSteps: [
      "Step 1: Top up tank with clean ISO VG 68 Guideway Lube Oil (Servo Way 68).",
      "Step 2: Press manual feed / prime button on lube pump and watch pressure gauge rise.",
      "Step 3: If pressure does not rise: clean suction filter inside oil reservoir.",
      "Step 4: If pressure rises on gauge but alarm remains: replace lube pressure switch.",
      "Step 5: Press CANCEL + RESET on CNC panel to clear alarm."
    ],
    severity: "HIGH",
  },
  {
    id: "fanuc-1002",
    brand: "FANUC",
    code: "1002",
    title: "PMC ALARM: COOLANT LEVEL LOW / COOLANT PUMP OVERLOAD TRIP",
    category: "Coolant/Lube",
    description: "Coolant pump motor thermal overload relay tripped or coolant tank level float sensor is dry.",
    causes: [
      "Coolant tank fluid level too low (Float switch activated)",
      "Pump suction filter mesh choked with aluminum / steel chips and sludge",
      "Coolant pump impeller jammed with tangled swarf",
      "Thermal overload relay (OLR) or MCB in electrical panel tripped due to overcurrent",
      "Coolant delivery pipe valve shut while pump running against closed head"
    ],
    electricalChecks: [
      "Inspect Thermal Overload Relay (OLR) in cabinet; check if blue reset pin popped out.",
      "Measure pump motor current with clamp meter across 3 phases (Must match nameplate amps, ~1.5A to 3.5A).",
      "Test float switch continuity (Open circuit when float drops to bottom)."
    ],
    mechanicalChecks: [
      "Pull out pump from tank and spin impeller by hand. Check for chip entanglement.",
      "Clean coolant suction basket filter and chip tray."
    ],
    solutionSteps: [
      "Step 1: Refill coolant tank with 1:20 soluble cutting oil emulsion.",
      "Step 2: Open electrical cabinet and push blue RESET button on Coolant Motor Overload Relay.",
      "Step 3: Remove chips blocking pump inlet strainer.",
      "Step 4: Issue M08 in MDI mode to verify clean pump restart."
    ],
    severity: "MEDIUM",
  },
  {
    id: "fanuc-2048",
    brand: "FANUC",
    code: "2048",
    title: "PMC ALARM: AIR PRESSURE LOW (MAIN PNEUMATIC SUPPLY < 5.0 BAR)",
    category: "Pneumatic/Hydraulic",
    description: "Main incoming compressed air pressure dropped below the safe threshold (typically 5.0 - 5.5 Bar) required for tool clamping and spindle purge.",
    causes: [
      "Factory main air compressor off, tripped, or pressure dropped",
      "FRL (Filter-Regulator-Lubricator) bowl filled with water or regulator loose",
      "Main air hose kinked, leaking, or quick-release coupler disengaged",
      "Digital air pressure switch (SMC / Festo) threshold set incorrectly or sensor failed"
    ],
    electricalChecks: [
      "Check LED indicator on digital pressure switch (e.g. SMC ISE30A).",
      "Inspect PLC input bit (e.g., X8.1) for Air Pressure OK signal."
    ],
    mechanicalChecks: [
      "Inspect analog pressure gauge at machine air preparation inlet (Must read 5.5 - 6.5 Bar).",
      "Push auto-drain pin on FRL bowl to purge water/condensation."
    ],
    solutionSteps: [
      "Step 1: Ensure main shop air line provides at least 6.5 Bar clean, dry air.",
      "Step 2: Pull up regulator knob on FRL unit and rotate clockwise to adjust to 6.0 Bar.",
      "Step 3: Drain water from air filter bowl.",
      "Step 4: Press RESET to clear alarm once gauge reads >5.5 Bar."
    ],
    severity: "HIGH",
  },
  {
    id: "siemens-f07900",
    brand: "SIEMENS",
    code: "F07900",
    title: "SINAMICS S120 FAULT: DRIVE MOTOR BLOCKED / STALLED",
    category: "Servo",
    description: "The motor was operating at its torque limit for longer than the stall time set in p2177, and speed fell below the threshold set in p2175.",
    causes: [
      "Mechanical axis jam, guideway seizure, or heavy tool collision",
      "Holding brake failed to open (Brake control sequence p1215/p1216 error)",
      "Motor power cable phase reversed (U and V swapped)",
      "Torque limit parameter p1520/p1521 set too low"
    ],
    electricalChecks: [
      "Measure brake release voltage at drive terminal X12/X13 (Must be 24V DC).",
      "Verify motor phase sequence (U-V-W) matches drive output terminals."
    ],
    mechanicalChecks: [
      "Check if mechanical axis is wedged or tool crashed into chuck/table.",
      "Check ball screw free rotation with power isolated."
    ],
    solutionSteps: [
      "Step 1: Check if machine is jammed mechanically. Jog axis in reverse in JOG mode.",
      "Step 2: Verify brake clicks open when drive enables.",
      "Step 3: Acknowledge fault via RESET button on MCP panel."
    ],
    severity: "CRITICAL",
  },
  {
    id: "mitsu-z70",
    brand: "MITSUBISHI",
    code: "Z70",
    title: "MITSUBISHI M70/M80: ABSOLUTE POSITION DATA LOST (AXIS ZERO LOST)",
    category: "Servo",
    description: "The absolute position detector battery voltage dropped below 2.5V, or the encoder cable was disconnected, causing loss of axis zero reference.",
    causes: [
      "Lithium backup battery (3.6V ER6V / MR-BAT) depleted",
      "Encoder cable disconnected while CNC power was OFF",
      "Servo motor or drive module replaced without re-homing"
    ],
    electricalChecks: [
      "Measure battery voltage with DMM (Normal = 3.6V, Replace if < 3.0V).",
      "Check battery connector plug on MDS-D/MDS-E drive."
    ],
    mechanicalChecks: [
      "Identify machine mechanical zero marks / reference alignment lines on axis casting."
    ],
    solutionSteps: [
      "Step 1: Replace 3.6V Lithium Battery with machine power ON.",
      "Step 2: Set Parameter #2049 or enter Absolute Position Setup Screen.",
      "Step 3: Move axis in JOG mode to align physical zero reference notch/mark.",
      "Step 4: Press origin set button on screen and cycle CNC power."
    ],
    severity: "HIGH",
  }
];

export const ATC_RECOVERY_STEPS = [
  {
    step: 1,
    title: "SAFETY FIRST: E-Stop & Switch to Manual MDI Mode",
    instruction: "Machine ke Emergency Stop button ko press karein. Electrical cabinet me check karein ki Spindle completely zero RPM par hai aur tool unclamp cylinder pressurized nahi hai.",
    caution: "Tool girne se bachane ke liye tool ke neeche wooden block ya soft cloth rakhein.",
  },
  {
    step: 2,
    title: "Manual Tool Release via Spindle Push Button",
    instruction: "Spindle head ke side me lage 'Manual Tool Unclamp' green button ko hold karein. Hath se tool holder (BT40/BT50) ko pakad kar neeche pull karein.",
    action: "Agar tool release nahi hota, air pressure 6.5 Bar check karein aur pneumatic cylinder solenoid valve ko manually screwdriver pin se press karein.",
  },
  {
    step: 3,
    title: "ATC Arm Manual Crank / Rotation to Home Origin",
    instruction: "ATC Twin-Arm agar spindle aur magazine ke beech 90° ya 180° par atka hai: ATC gearbox motor ke top par lagaye gaye 12mm/14mm hexagonal bolt ko socket wrench se clockwise rotate karein jab tak arm spindle se door 0° origin position par na pahunch jaye.",
    action: "Arm Origin proximity sensor (SQ3 / LS-Arm Home) ka LED light ON hona zaroori hai.",
  },
  {
    step: 4,
    title: "Tool Magazine Pot Up / Down Interlock Reset",
    instruction: "Agar Tool Pot neeche horizontal position par atka hai: MDI mode me M70 / M71 code run karein, ya magazine manual solenoid valve press karke pot ko wapas vertical (UP) position me lock karein.",
    action: "Pot-UP proximity switch LED light verify karein.",
  },
  {
    step: 5,
    title: "Fanuc Keep Relay & PMC Counter Realignment",
    instruction: "Fanuc System me: OFFSET/SETTING ➔ PMC ➔ PMCPRM ➔ KEEPRL (Keep Relays) me jayein. K05.0 ya K05.4 (ATC Manual Recovery bit) ko 1 set karein. ATC cycle reset hone ke baad wapas 0 karein.",
    action: "Run M06 T01 in MDI mode at 25% dry run speed to verify smooth tool change.",
  },
];

export const FLUID_SYSTEMS: FluidSystemTree[] = [
  {
    id: "coolant",
    name: "Flood & Shower Coolant System",
    icon: "💧",
    typicalAlarm: "Alarm 1002 Coolant Flow Low",
    workingPressure: "2.0 - 4.5 Bar (Flood) | 150 - 300 LPM",
    symptoms: [
      "M08 execute hone par bhi nozzle se paani nahi aa raha",
      "Coolant pump achanak 10 second chal kar band ho jata hai",
      "Cutting area me cutting oil ka dhuwan (smoke) nikal raha hai"
    ],
    faultCauses: [
      "Coolant tank ka level kam hai (Float sensor down hai)",
      "Pump motor ka thermal overload relay (OLR) trip ho gaya hai",
      "Suction filter basket aluminum / cast iron chips se choke hai"
    ],
    electricalPoints: [
      "Check 24V signal to Coolant Relay from PLC Output Y address",
      "Inspect Thermal Overload Relay blue reset button in electrical cabinet"
    ],
    mechanicalPoints: [
      "Clean chip conveyor filter screen and pump bottom strainer mesh",
      "Check coolant concentration with optical refractometer (Target: 6% - 8% Brix)"
    ],
    quickFix: [
      "1. Refill tank with soluble cutting oil mixed 1:20 with clean water.",
      "2. Open electrical panel and push blue RESET button on Coolant OLR.",
      "3. Pull out pump and clear curled chips from bottom impeller.",
      "4. Execute M08 in MDI mode to test."
    ]
  },
  {
    id: "way-lube",
    name: "Centralized Slide Way Lubrication",
    icon: "🛢️",
    typicalAlarm: "Alarm 1001 Lube Pressure Low / Tank Empty",
    workingPressure: "12.0 - 18.0 Bar (Discharge Pulse)",
    symptoms: [
      "Lube pressure alarm reset nahi ho raha",
      "Guideway dry ho rahi hai, ball screw par oil film nahi hai",
      "Axis JOG karte waqt chattering ya heavy squeaking noise aa rahi hai"
    ],
    faultCauses: [
      "Oil tank empty (Float switch low level active)",
      "Lube pump pressure switch (15 Bar) defective or disconnected",
      "Nylon transparent oil tube along axis cracked or severed"
    ],
    electricalChecks: [
      "Check 230V AC power to small lube pump motor during timer cycle",
      "Inspect Pressure Switch contact closure on PLC Diagnostics (e.g. X4.2)"
    ],
    mechanicalChecks: [
      "Check analog pressure gauge on pump unit while pressing manual push button",
      "Use strictly ISO VG 68 Slide Way Lubricant (Servo Way 68 / Shell Tonna S2 M 68)"
    ],
    quickFix: [
      "1. Top up reservoir with ISO VG 68 Way Lube Oil.",
      "2. Press manual prime lever/button on pump 5 times until gauge reads >15 Bar.",
      "3. Press CANCEL + RESET to clear CNC alarm."
    ]
  }
];

export const PART_DEFECTS: PartDefectEntry[] = [
  {
    id: "chatter-vibration",
    defectName: "Surface Chattering & Heavy Vibration Marks",
    icon: "〰️",
    visualSymptom: "Wavy patterns, high-frequency ripple lines, loud squealing noise during cut, poor Ra finish.",
    rootCauses: [
      { area: "Tooling", cause: "Tool overhang too long causing bending deflection." },
      { area: "Parameters", cause: "Spindle RPM at harmonic resonance; feed per tooth fz too low (rubbing)." },
      { area: "Insert", cause: "Nose radius too large (R0.8 instead of R0.4), excessive contact width." }
    ],
    actionSteps: [
      "1. Reduce tool overhang: Push tool shank as deep as possible into holder.",
      "2. Adjust RPM: Increase or decrease spindle speed by 15% - 20% to break resonance.",
      "3. Increase Feed: Ensure insert is shearing chip (fz >= 0.10 mm/tooth).",
      "4. Switch to positive rake insert with smaller nose radius (R0.4)."
    ]
  },
  {
    id: "dimension-undersize-oversize",
    defectName: "Dimensional Inaccuracy (Oversize / Undersize)",
    icon: "📏",
    visualSymptom: "Part diameter/thickness drifts by 0.02 - 0.08mm over a shift.",
    rootCauses: [
      { area: "Thermal", cause: "Ball screw & spindle thermal expansion as machine warms up." },
      { area: "Wear", cause: "Insert flank wear increasing tool cutting pressure." },
      { area: "Backlash", cause: "Axis ball screw mechanical play." }
    ],
    actionSteps: [
      "1. Compensate thermal drift in Tool Wear Offset register.",
      "2. Measure Backlash with dial test indicator and update Fanuc Parameter #1851.",
      "3. Always cool workpiece to ambient 20°C temperature before final micrometer measurement."
    ]
  }
];

export const MATERIAL_GRADES: Record<string, any> = {
  mild_steel: {
    name: "Mild Steel (MS / EN8 / EN9)",
    category: "ISO P",
    roughingVc: 180,
    finishingVc: 240,
    roughingFeed: 0.25,
    finishingFeed: 0.10,
    specificCuttingForceKc: 1800,
  },
  alloy_steel: {
    name: "Alloy Steel (EN24 / EN31 / 4140)",
    category: "ISO P",
    roughingVc: 130,
    finishingVc: 180,
    roughingFeed: 0.18,
    finishingFeed: 0.08,
    specificCuttingForceKc: 2200,
  },
  stainless_304: {
    name: "Stainless Steel (SS304 / SS316)",
    category: "ISO M",
    roughingVc: 110,
    finishingVc: 160,
    roughingFeed: 0.14,
    finishingFeed: 0.06,
    specificCuttingForceKc: 2400,
  },
  aluminum_6061: {
    name: "Aluminum Alloy (6061-T6 / 7075)",
    category: "ISO N",
    roughingVc: 450,
    finishingVc: 800,
    roughingFeed: 0.30,
    finishingFeed: 0.12,
    specificCuttingForceKc: 700,
  },
};

export function computeMachiningParameters(params: {
  materialKey: string;
  toolDiameterMm: number;
  numberOfFlutes: number;
  depthOfCutApMm: number;
  widthOfCutAeMm: number;
  mode: "roughing" | "finishing";
}) {
  const mat = MATERIAL_GRADES[params.materialKey] || MATERIAL_GRADES.mild_steel;
  const Vc = params.mode === "roughing" ? mat.roughingVc : mat.finishingVc;
  const fz = params.mode === "roughing" ? mat.roughingFeed : mat.finishingFeed;

  const rpm = Math.round((1000 * Vc) / (Math.PI * params.toolDiameterMm));
  const feedPerMin = Math.round(fz * params.numberOfFlutes * rpm);
  const mrr = Math.round(((params.depthOfCutApMm * params.widthOfCutAeMm * feedPerMin) / 1000) * 10) / 10;
  const powerKw = Math.round(((params.depthOfCutApMm * params.widthOfCutAeMm * feedPerMin * mat.specificCuttingForceKc) / (60 * 1000000 * 0.85)) * 10) / 10;

  return {
    rpm,
    feedPerMin,
    feedPerTooth: fz,
    cuttingSpeedVc: Vc,
    materialRemovalRateMrr: mrr,
    powerRequiredKw: powerKw,
  };
}

export const CNC_CODE_LIBRARY = [
  {
    code: "G71",
    type: "G-Code (Turning)",
    name: "Stock Removal / Rough Turning Cycle",
    syntax: "G71 U(depth_of_cut) R(retract);\nG71 P(start) Q(end) U(X_allowance) W(Z_allowance) F(feed);",
    description: "Automatically roughs out profile between block numbers P and Q in multiple passes.",
    example: "G71 U2.0 R0.5;\nG71 P100 Q200 U0.4 W0.1 F0.25;"
  },
  {
    code: "G76",
    type: "G-Code (Turning)",
    name: "Multiple Threading Cycle",
    syntax: "G76 P(m)(r)(a) Q(min_cut) R(finish_allowance);\nG76 X(minor_dia) Z(length) P(height) Q(first_cut) F(pitch);",
    description: "Generates multi-pass helical threads with automatic flanking infeed angle.",
    example: "G76 P020060 Q50 R0.05;\nG76 X18.376 Z-25.0 P812 Q200 F1.5;"
  },
  {
    code: "G83",
    type: "G-Code (Milling)",
    name: "Deep Hole Peck Drilling",
    syntax: "G83 X(pos) Y(pos) Z(depth) R(plane) Q(peck) F(feed);",
    description: "Performs full retract peck drilling to clear chips from deep holes.",
    example: "G83 X50.0 Y50.0 Z-40.0 R2.0 Q4.0 F120;"
  },
  {
    code: "M08 / M09",
    type: "M-Code (General)",
    name: "Coolant ON / Coolant OFF",
    syntax: "M08; (Coolant ON)\nM09; (Coolant OFF)",
    description: "Turns cutting fluid pump ON or OFF.",
    example: "G00 X50.0 Z2.0 M08;\n...\nG00 Z100.0 M09;"
  }
];

export const DAILY_MAINTENANCE_CHECKLIST = [
  { id: "chk-1", category: "Fluid Levels", item: "Slide Rail Lubrication Oil tank level check (ISO VG 68)", standard: "Tank > 50% full" },
  { id: "chk-2", category: "Fluid Levels", item: "Coolant Tank Level & Refractometer Concentration test", standard: "6% - 8% Brix" },
  { id: "chk-3", category: "Pneumatics", item: "Air FRL Unit pressure gauge check", standard: "5.5 - 6.5 Bar pressure" },
  { id: "chk-4", category: "Hydraulics", item: "Hydraulic Power Pack oil level & pressure", standard: "25 - 35 Bar" },
  { id: "chk-5", category: "Spindle", item: "Spindle taper bore internal cleaning", standard: "Free of chips & rust" },
  { id: "chk-6", category: "Cleanliness", item: "Chip Conveyor & Swarf bin emptying", standard: "Conveyor running smooth" },
];