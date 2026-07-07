import type { Brand, ContentIdea, ContentProject, WorkflowStage } from "./domain";
import { calculateQualityScore } from "./scoring";

export const parisHouseBrand: Brand = {
  id: "brand_paris_house",
  workspaceId: "workspace_creator_studio",
  name: "Paris House",
  slug: "paris-house",
  niche: "House music, Paris nightlife, rooftops, fashion, and premium city energy",
  language: "en",
  country: "France",
  city: "Paris",
  tone: ["mysterious", "minimal", "cinematic", "premium"],
  visualIdentity: {
    palette: ["#08090d", "#f5f0e6", "#c7a45a", "#35d0ba", "#ed4d6e"],
    typography: "Condensed editorial headings with clean UI text",
    motif: "Rooftop silhouettes, Seine reflections, warm club light",
    imageStyle: "Cinematic vertical night footage with realistic Paris details",
    overlayStyle: "Minimal white text, small gold accents, no crowded captions"
  },
  editorialRules: [
    "Keep hooks short and atmospheric.",
    "No invented real-world events, venues, or DJ appearances.",
    "Every final export needs a quality score and human approval.",
    "Music must have a clear usage right before final export."
  ],
  forbiddenTopics: [
    "fake events",
    "unverified celebrity claims",
    "copyrighted music without rights",
    "explicit nightlife content"
  ],
  postingFrequency: "1 short-form video per day",
  automationLevel: 2,
  status: "active",
  createdAt: "2026-07-07T00:00:00.000Z",
  updatedAt: "2026-07-07T00:00:00.000Z"
};

export const sampleIdeas: ContentIdea[] = [
  {
    id: "idea_rooftop_blue_hour",
    brandId: parisHouseBrand.id,
    title: "Blue hour rooftop pulse",
    concept: "A 22-second vertical reel moving from quiet skyline to warm rooftop energy.",
    hook: "Paris sounds different after midnight.",
    angle: "Belonging to a hidden city rhythm",
    platformTarget: "instagram",
    estimatedDurationSeconds: 22,
    visualStyle: "Blue hour rooftop, subtle lens glow, elegant crowd silhouettes",
    musicStyle: "Afro house, 122 BPM, warm percussion",
    potentialScore: 88,
    riskScore: 12,
    selected: true,
    justification: "Strong brand fit, short hook, clear visual world, low factual risk.",
    createdAt: "2026-07-07T08:15:00.000Z"
  },
  {
    id: "idea_seine_afterwork",
    brandId: parisHouseBrand.id,
    title: "Seine afterwork drift",
    concept: "Golden reflections, quick cuts, and a calm-to-club transition.",
    hook: "Tonight feels like this.",
    angle: "A day ending as music begins",
    platformTarget: "tiktok",
    estimatedDurationSeconds: 18,
    visualStyle: "Seine reflections, fashion details, handheld cinematic motion",
    musicStyle: "Deep house, 120 BPM, soft vocal chop",
    potentialScore: 81,
    riskScore: 18,
    selected: false,
    justification: "Very reusable format, but the hook is less distinctive.",
    createdAt: "2026-07-07T08:16:00.000Z"
  },
  {
    id: "idea_midnight_doors",
    brandId: parisHouseBrand.id,
    title: "Doors after midnight",
    concept: "Close-ups of hands, lights, and doors opening into a premium club mood.",
    hook: "No address. Just the feeling.",
    angle: "Mystery and exclusivity without naming a real venue",
    platformTarget: "instagram",
    estimatedDurationSeconds: 20,
    visualStyle: "Low light, gold highlights, abstract venue details",
    musicStyle: "Minimal house, 124 BPM, tight groove",
    potentialScore: 84,
    riskScore: 22,
    selected: false,
    justification: "Good intrigue, but needs careful avoidance of protected venue branding.",
    createdAt: "2026-07-07T08:17:00.000Z"
  }
];

export const sampleProject: ContentProject = {
  id: "project_blue_hour_rooftop",
  brandId: parisHouseBrand.id,
  ideaId: sampleIdeas[0]!.id,
  status: "needs_review",
  title: "Blue hour rooftop pulse",
  script:
    "Cold open on the skyline. Let the bass arrive with the first warm light. Keep the words minimal: Paris sounds different after midnight.",
  storyboard: [
    {
      id: "scene_1",
      order: 1,
      durationSeconds: 4,
      visualPrompt: "Vertical cinematic view of Paris rooftops at blue hour, realistic city lights, premium nightlife tone.",
      onScreenText: "Paris sounds different",
      cameraDirection: "Slow push toward skyline",
      audioDirection: "Filtered kick starts under city ambience"
    },
    {
      id: "scene_2",
      order: 2,
      durationSeconds: 8,
      visualPrompt: "Elegant rooftop crowd silhouettes, warm lamps, no visible logos, realistic motion.",
      onScreenText: "after midnight",
      cameraDirection: "Cut on beat between hands, lights, and skyline",
      audioDirection: "Afro house percussion opens"
    },
    {
      id: "scene_3",
      order: 3,
      durationSeconds: 10,
      visualPrompt: "Paris skyline from rooftop, subtle dancing silhouettes, cinematic premium finish.",
      onScreenText: "House music. City lights.",
      cameraDirection: "Final wide shot with gentle handheld motion",
      audioDirection: "Bass lands, end before the loop feels complete"
    }
  ],
  caption: "House music, city lights, no explanation.",
  hashtags: ["#ParisHouse", "#HouseMusic", "#ParisNightlife", "#RooftopVibes", "#AfterMidnight"],
  cta: "Follow for the Paris after-midnight frequency.",
  globalScore: calculateQualityScore({
    hook: 92,
    visual: 88,
    rhythm: 84,
    brandFit: 94,
    originality: 78,
    retention: 86,
    share: 76,
    save: 82,
    copyrightRisk: 12,
    factualRisk: 8
  }).global,
  createdAt: "2026-07-07T09:00:00.000Z",
  updatedAt: "2026-07-07T11:30:00.000Z"
};

export const dailyWorkflow: WorkflowStage[] = [
  {
    id: "trend_research",
    label: "Trend research",
    status: "complete",
    scheduledAt: "08:00",
    owner: "system"
  },
  {
    id: "idea_generation",
    label: "Idea generation",
    status: "complete",
    scheduledAt: "08:15",
    owner: "system"
  },
  {
    id: "storyboard",
    label: "Storyboard",
    status: "complete",
    scheduledAt: "09:00",
    owner: "system"
  },
  {
    id: "editing",
    label: "Edit assembly",
    status: "running",
    scheduledAt: "10:30",
    owner: "system"
  },
  {
    id: "quality",
    label: "Quality scoring",
    status: "needs_review",
    scheduledAt: "11:00",
    owner: "editor"
  },
  {
    id: "publication",
    label: "Publication approval",
    status: "queued",
    scheduledAt: "18:30",
    owner: "editor"
  }
];
