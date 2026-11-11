const { generateJSON } = require('./gemini.service');
const { validateInvestigationData } = require('./consistencyValidator.service');

/**
 * Fallback generator providing high quality fictional investigation
 * if Gemini API key is missing or offline
 */
const generateMockInvestigation = (scenario, category, difficulty, suspectCount) => {
  const count = parseInt(suspectCount) || 4;
  
  const suspectsPool = [
    {
      suspectId: "S001",
      name: "Marcus Vance",
      age: 42,
      occupation: "Head of Operations",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      description: "Ambitious and calculated. Manages facility security keys and access logs.",
      relationship: "Directly in charge of the floor where the incident took place.",
      alibi: "Claims he was reviewing quarterly expenditure logs in his third-floor office with headphones on.",
      publicInfo: ["Has worked at the company for 11 years", "Keycard access logged him in at 6:45 PM"],
      secretInfo: "Facing imminent financial ruin from unauthorized offshore trading losses.",
      suspicionLevel: "High"
    },
    {
      suspectId: "S002",
      name: "Elena Rostova",
      age: 31,
      occupation: "Senior Archivist & Curator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      description: "Meticulous expert with encyclopedic knowledge of the vault contents.",
      relationship: "Had personal authorization to open the inner chamber display.",
      alibi: "Claims she left the building at 7:50 PM to meet her sibling for dinner across town.",
      publicInfo: ["Was scheduled to present the showcase items tomorrow morning", "Owns private archive gloves"],
      secretInfo: "Discovered an internal memo disclosing she was about to be laid off at the end of the week.",
      suspicionLevel: "Moderate"
    },
    {
      suspectId: "S003",
      name: "Julian Thorne",
      age: 28,
      occupation: "Lead Security Technician",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      description: "Quiet and technically gifted. In charge of camera calibrations and server maintenance.",
      relationship: "Responsible for the CCTV maintenance schedule and blind spot mapping.",
      alibi: "Claims he was in the basement server room resetting router switches during the network dip.",
      publicInfo: ["Reported the server glitch at 8:30 PM", "Possesses duplicate master override codes"],
      secretInfo: "Was offered a substantial black market payout through encrypted messenger handles.",
      suspicionLevel: "Critical"
    },
    {
      suspectId: "S004",
      name: "Clara Bennett",
      age: 39,
      occupation: "Private Collector & VIP Guest",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      description: "Wealthy investor with a deep obsession with rare acquisitions.",
      relationship: "Was given a private after-hours walkthrough just before the incident.",
      alibi: "Claims her chauffeur picked her up at the north pavilion gate promptly at 8:15 PM.",
      publicInfo: ["Offered to purchase the exhibit privately earlier this year", "Donated \$50,000 to the gallery"],
      secretInfo: "Brought an exact synthetic replica in her monogrammed briefcase.",
      suspicionLevel: "High"
    },
    {
      suspectId: "S005",
      name: "Arthur Pendelton",
      age: 58,
      occupation: "Night Supervisor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
      description: "Veteran night watchman counting down the months until retirement.",
      relationship: "Had the physical master key chain clipped to his utility belt.",
      alibi: "Claims he was conducting the external perimeter patrol through the rainy courtyard.",
      publicInfo: ["Never missed a shift in 22 years", "His radio had static between 8:20 and 8:40 PM"],
      secretInfo: "Received an anonymous envelope containing cash and instructions to ignore the west wing buzzer.",
      suspicionLevel: "Moderate"
    }
  ];

  const selectedSuspects = suspectsPool.slice(0, count);
  // Predetermined culprit: S003 Julian Thorne
  const culprit = selectedSuspects.find(s => s.suspectId === "S003") || selectedSuspects[0];

  const timeline = [
    { time: "07:15 PM", event: "All evening staff and VIP guests checked in at reception.", location: "Main Gate", verified: true },
    { time: "07:50 PM", event: "Elena Rostova logs out at front desk turnstile.", location: "Lobby", verified: true },
    { time: "08:15 PM", event: "VIP guest Clara Bennett departs via North Pavilion gate.", location: "North Pavilion", verified: true },
    { time: "08:24 PM", event: "Julian Thorne initiates server reset in the basement.", location: "Server Room", verified: true },
    { time: "08:30 PM", event: "Corridor C3 and Vault security camera feed flickers black for 14 minutes.", location: "Vault Corridor", verified: false },
    { time: "08:44 PM", event: "CCTV feed re-establishes; vault alarm flashes silent trigger.", location: "Central Hub", verified: true },
    { time: "09:02 PM", event: "Incident officially confirmed; premises placed on immediate lockdown.", location: "Main Chamber", verified: true }
  ];

  const evidence = [
    {
      evidenceId: "E001",
      type: "chat",
      title: "Encrypted Messaging Log - Signal Recreation",
      description: "Chat history extracted from an unlinked temporary device recovered near the service elevator.",
      timestamp: "2026-11-01T20:21:00Z",
      location: "Service Elevator Landing",
      relatedSuspectIds: ["S003"],
      isKeyEvidence: true,
      isRedHerring: false,
      content: {
        platform: "Signal",
        participants: ["Ghost_09", "J_Technician"],
        messages: [
          { sender: "Ghost_09", text: "Is the loop ready for Cam 03?", time: "08:19 PM" },
          { sender: "J_Technician", text: "Ready. Taking the primary switch offline at 8:28 sharp. You have 12 minutes before the bypass relay triggers watchdog alerts.", time: "08:21 PM" },
          { sender: "Ghost_09", text: "The locker in B2 is open. Leave the drive inside.", time: "08:23 PM" },
          { sender: "J_Technician", text: "Understood. Wiping cache now.", time: "08:24 PM" }
        ]
      }
    },
    {
      evidenceId: "E002",
      type: "cctv",
      title: "Security Cam 04: West Sub-Basement Corridor",
      description: "Surveillance footage recorded immediately before the video feed blackout.",
      timestamp: "2026-11-01T20:29:40Z",
      location: "West Sub-Basement",
      assetUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80",
      relatedSuspectIds: ["S003", "S001"],
      isKeyEvidence: true,
      isRedHerring: false,
      content: {
        cameraTag: "CAM-04-BASEMENT",
        recordedTime: "20:29:40 PM",
        visualDetails: "Figure in dark technician jumpsuit carrying a yellow maintenance toolkit with serial tag 'TECH-07'. The figure uses an RFID badge with lanyard ending in blue clip (issued to IT & Systems personnel).",
        discrepancy: "Technician log stated Julian was at Terminal 1A on floor 1, but CAM-04 places this tool kit in Sub-Basement 2."
      }
    },
    {
      evidenceId: "E003",
      type: "document",
      title: "Electronic Lock Access Manifest #418",
      description: "Automated badge reader records from the inner vault secure vestibule door.",
      timestamp: "2026-11-01T20:34:12Z",
      location: "Vault Vestibule Door 2",
      assetUrl: "",
      relatedSuspectIds: ["S001", "S003"],
      isKeyEvidence: false,
      isRedHerring: true,
      content: {
        documentType: "Audit Log",
        header: "SECUR-TECH 9000 ACCESS LOGS",
        entries: [
          { time: "18:45:10", badgeId: "BADGE-019 (Marcus Vance)", status: "GRANTED" },
          { time: "19:48:33", badgeId: "BADGE-042 (Elena Rostova)", status: "GRANTED" },
          { time: "20:34:12", badgeId: "OVERRIDE-SYSTEM-KEY", status: "MASTER_BYPASS_ENGAGED" },
          { time: "20:41:05", badgeId: "OVERRIDE-SYSTEM-KEY", status: "DOOR_UNLATCHED" }
        ],
        notes: "Master bypass codes are restricted to Marcus Vance and the Chief Systems Administrator (Julian Thorne)."
      }
    },
    {
      evidenceId: "E004",
      type: "image",
      title: "Crime Scene Photo: Disassembled Wall Panel",
      description: "High-resolution forensic capture of the junction box behind Display Pedestal 4.",
      timestamp: "2026-11-01T21:15:00Z",
      location: "Display Pedestal 4",
      assetUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      relatedSuspectIds: ["S003"],
      isKeyEvidence: true,
      isRedHerring: false,
      content: {
        forensicNotes: "Precision Torx T-10 screws removed cleanly with no scratching on the faceplate. A custom spliced jumper cable with blue heat-shrink tubing was used to suppress the vibration sensor.",
        clue: "Julian Thorne's work bench contains matching blue heat-shrink tubing and Torx T-10 drivers."
      }
    },
    {
      evidenceId: "E005",
      type: "witness_statement",
      title: "Sworn Interview: Night Supervisor Arthur",
      description: "Interview conducted on scene 45 minutes following incident discovery.",
      timestamp: "2026-11-01T21:40:00Z",
      location: "Security Office",
      relatedSuspectIds: ["S001", "S003"],
      isKeyEvidence: false,
      isRedHerring: false,
      content: {
        interviewee: "Arthur Pendelton",
        interviewer: "Lead Detective",
        transcript: [
          { speaker: "Detective", text: "Did you observe anyone near the secondary elevators around 8:30 PM?" },
          { speaker: "Arthur", text: "I saw someone slip into the technician service hatch. Thought it was Julian doing the routine camera test because he waved his pass. But looking back, he wasn't carrying the standard clipboard—just that heavy yellow Pelican case." },
          { speaker: "Detective", text: "And Mr. Vance?" },
          { speaker: "Arthur", text: "Mr. Vance came down around 9:05 PM looking frantic after the sirens sounded. He hadn't left his office before then." }
        ],
        credibilityRating: "High (Corroborated by hallway badge sensors)"
      }
    },
    {
      evidenceId: "E006",
      type: "chat",
      title: "Internal Slack Message Thread",
      description: "Archived conversation from the 'Facility-Maintenance' private channel.",
      timestamp: "2026-11-01T17:15:00Z",
      location: "Cloud Servers",
      relatedSuspectIds: ["S001", "S002"],
      isKeyEvidence: false,
      isRedHerring: true,
      content: {
        platform: "Slack",
        participants: ["Marcus Vance", "Elena Rostova"],
        messages: [
          { sender: "Elena Rostova", text: "Marcus, why is the budget audit looking into the restoration fund?", time: "05:12 PM" },
          { sender: "Marcus Vance", text: "Routine inquiries Elena. Don't worry yourself about ledger discrepancies tonight.", time: "05:15 PM" },
          { sender: "Elena Rostova", text: "If this affects tomorrow's exhibition, I am notifying the board.", time: "05:18 PM" }
        ],
        investigatorNote: "Creates suspicion around Marcus's financial motives, but does not provide physical proof of the theft."
      }
    },
    {
      evidenceId: "E007",
      type: "document",
      title: "Discarded Hardware Store Receipt",
      description: "Wrinkled receipt found in the technician's locker room waste basket.",
      timestamp: "2026-10-31T14:22:00Z",
      location: "Basement Locker Room",
      relatedSuspectIds: ["S003"],
      isKeyEvidence: true,
      isRedHerring: false,
      content: {
        documentType: "Store Receipt",
        storeName: "Apex Electronics & Precision Tools",
        date: "2026-10-31 14:22",
        items: [
          "1x Torx Precision Driver Set (T5-T15) - \$24.99",
          "1x 12V DC Relay Jumper Kit - \$18.50",
          "1x Blue Heat-Shrink Wire Insulator 20-Pack - \$7.25",
          "1x Master Lock Storage Box - \$32.00"
        ],
        paymentMethod: "Cash"
      }
    },
    {
      evidenceId: "E008",
      type: "witness_statement",
      title: "Interview: Front Gate Guard Jenkins",
      description: "Log verification for Clara Bennett and Elena Rostova departures.",
      timestamp: "2026-11-01T21:55:00Z",
      location: "North Gate Post",
      relatedSuspectIds: ["S002", "S004"],
      isKeyEvidence: false,
      isRedHerring: true,
      content: {
        interviewee: "Officer Jenkins",
        interviewer: "Lead Detective",
        transcript: [
          { speaker: "Jenkins", text: "Ms. Bennett's limousine passed through the North barrier at 8:16 PM on the dot. I inspected the boot as standard protocol; only empty luggage." },
          { speaker: "Jenkins", text: "Ms. Rostova walked out at 7:52 PM towards the metro station carrying only an umbrella and small handbag." }
        ],
        credibilityRating: "Verified by barrier camera clock"
      }
    }
  ];

  const solution = {
    culpritId: culprit.suspectId,
    culpritName: culprit.name,
    motive: "Julian Thorne leveraged his technical access to intentionally take down the CCTV relay at 8:30 PM, bypass the vault sensor using custom-bought relay jumpers, and extract the high-value item for an encrypted black-market payout.",
    explanation: "While Marcus Vance had financial distress (a classic red herring) and Clara Bennett desired the exhibit, neither possessed the electronic knowledge or presence inside the sub-basement during the 14-minute blackout. Julian Thorne's encrypted messages (E001), forensic tool matches (E004, E007), and CCTV confirmation of his specialized equipment (E002) irrefutably link him to the execution of the crime.",
    methodOfInvolvement: "Planned deliberate server shutdown, spliced security panel with specialized jumper cables, removed target item during blackout, and stashed evidence in basement locker.",
    actualTimeline: [
      { time: "08:19 PM", event: "Julian coordinates blackout timing with outside handler.", culpritAction: "Sent encrypted Signal messages" },
      { time: "08:28 PM", event: "Julian cuts power loop to corridor CCTV.", culpritAction: "Engaged manual breaker toggle" },
      { time: "08:34 PM", event: "Julian bypasses display sensor using custom jumper wires.", culpritAction: "Used Torx T-10 tools to open pedestal panel" },
      { time: "08:41 PM", event: "Item secured into yellow Pelican toolkit; technician returns to station.", culpritAction: "Stashed item in B2 locker locker unit" }
    ],
    revealingEvidenceIds: ["E001", "E002", "E004", "E007"],
    redHerringExplanations: [
      { evidenceId: "E003", explanation: "Marcus Vance's badge was tested earlier in the day for legitimate access, misleading investigators into thinking he swiped in at night." },
      { evidenceId: "E006", explanation: "The tense argument between Elena and Marcus created suspicion regarding embezzlement, but neither was present during the physical theft." }
    ]
  };

  return {
    caseTitle: `Case of the ${category}: ${scenario.slice(0, 40).trim()}...`,
    caseDescription: scenario,
    category,
    difficulty,
    location: "Blackwood Archive & Commercial Facility",
    incident: {
      type: category,
      date: "2026-11-01",
      time: "20:30"
    },
    suspects: selectedSuspects,
    publicTimeline: timeline,
    evidence,
    solution
  };
};

/**
 * Generate full investigation using Gemini or smart fallback
 */
const generateInvestigation = async ({ scenario, category, difficulty, suspectCount }) => {
  const count = parseInt(suspectCount) || 4;
  const sysPrompt = `You are a master mystery author and forensic puzzle designer.
Create a rich, logically consistent detective case based on the user's prompt.
Strict requirements:
1. Generate ${count} suspects with believable occupations, alibis, public info, and 1 secret info.
2. Choose EXACTLY ONE culprit before anything else.
3. Generate a chronological timeline of events.
4. Generate at least 8 evidence items spanning at least 3 formats: 'chat', 'cctv', 'document', 'image', 'witness_statement'.
5. Include at least 3 pieces of key evidence that logically expose the culprit, and 2-3 plausible red herrings.
6. Return ONLY valid JSON in this schema:
{
  "caseTitle": string,
  "caseDescription": string,
  "category": string,
  "difficulty": string,
  "location": string,
  "incident": { "type": string, "date": string, "time": string },
  "suspects": [
    { "suspectId": "S001", "name": string, "age": number, "occupation": string, "avatar": string, "description": string, "relationship": string, "alibi": string, "publicInfo": [string], "secretInfo": string, "suspicionLevel": "Low"|"Moderate"|"High"|"Critical" }
  ],
  "publicTimeline": [
    { "time": string, "event": string, "location": string, "verified": boolean }
  ],
  "evidence": [
    { "evidenceId": "E001", "type": "chat"|"cctv"|"document"|"image"|"witness_statement", "title": string, "description": string, "timestamp": string, "location": string, "assetUrl": string, "relatedSuspectIds": [string], "isKeyEvidence": boolean, "isRedHerring": boolean, "content": object }
  ],
  "solution": {
    "culpritId": string,
    "culpritName": string,
    "motive": string,
    "explanation": string,
    "methodOfInvolvement": string,
    "actualTimeline": [{ "time": string, "event": string, "culpritAction": string }],
    "revealingEvidenceIds": [string],
    "redHerringExplanations": [{ "evidenceId": string, "explanation": string }]
  }
}`;

  const userPrompt = `Mystery Scenario: "${scenario}"
Category: ${category}
Difficulty: ${difficulty}
Number of Suspects: ${count}
Ensure high narrative suspense and watertight logical deductions.`;

  try {
    const rawData = await generateJSON(sysPrompt, userPrompt);
    const validation = validateInvestigationData(rawData);
    if (!validation.isValid) {
      console.warn('[Validation Notice] AI output had minor consistency discrepancies:', validation.errors);
      // Fallback if AI output failed strict validation
      return generateMockInvestigation(scenario, category, difficulty, count);
    }
    return rawData;
  } catch (error) {
    console.warn(`[Gemini Engine] Using high-fidelity procedural generation fallback: ${error.message}`);
    return generateMockInvestigation(scenario, category, difficulty, count);
  }
};

module.exports = {
  generateInvestigation
};

