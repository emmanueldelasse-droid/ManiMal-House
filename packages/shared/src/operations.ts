import type { ContentStatus, SocialPlatform } from "./domain";
import type { AppErrorCategory, ProviderName } from "./integrations";

export type ProductionContentStatus =
  | "idea"
  | "scripted"
  | "storyboard_ready"
  | "assets_pending"
  | "assets_generated"
  | "editing"
  | "preview_ready"
  | "quality_checked"
  | "needs_review"
  | "approved"
  | "scheduled"
  | "published"
  | "failed"
  | "archived";

export type WorkflowId =
  | "brand_creation"
  | "idea_generation"
  | "content_production"
  | "ffmpeg_editing"
  | "human_validation"
  | "publication"
  | "analytics"
  | "learning";

export interface OperationalWorkflow {
  id: WorkflowId;
  title: string;
  objective: string;
  trigger: string;
  owner: "user" | "system" | "editor" | "worker";
  steps: string[];
  outputs: string[];
  blockers: string[];
  successCriterion: string;
}

export interface ReadinessBlocker {
  code: string;
  category: AppErrorCategory;
  userMessage: string;
  severity: "warning" | "blocking";
}

export interface PublicationReadinessInput {
  status: ProductionContentStatus | ContentStatus | string;
  globalScore?: number;
  minimumScore?: number;
  humanApproved: boolean;
  musicApproved: boolean;
  captionReady: boolean;
  hashtagsReady: boolean;
  videoFormatValid: boolean;
  socialAccountConnected: boolean;
  tokenValid: boolean;
  permissionsValid: boolean;
  budgetAvailable: boolean;
  copyrightRiskBlocking: boolean;
  factualRiskBlocking: boolean;
}

export interface PublicationReadinessResult {
  ok: boolean;
  minimumScore: number;
  blockers: ReadinessBlocker[];
  nextAction: "publish_or_schedule" | "manual_export_only" | "fix_blockers";
}

export interface FfmpegQualityCheck {
  id: string;
  label: string;
  required: boolean;
  failureCategory: AppErrorCategory;
}

export type TestLayer =
  | "unit"
  | "ai"
  | "integration"
  | "e2e"
  | "security"
  | "ux";

export interface TestSuiteDefinition {
  id: string;
  layer: TestLayer;
  title: string;
  requiredCases: string[];
  passCriterion: string;
}

export type DeploymentEnvironmentName = "local" | "staging" | "production";

export interface DeploymentEnvironmentDefinition {
  id: DeploymentEnvironmentName;
  purpose: string;
  providers: string[];
  storage: string;
  publicationMode: "disabled" | "draft_only" | "manual_first" | "real_after_approval";
  monitoring: string[];
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  goal: string;
  deliverables: string[];
  successCriterion: string;
}

export interface PricingPlan {
  id: "starter" | "creator" | "pro" | "agency";
  name: string;
  target: string;
  includes: string[];
}

export interface LaunchStep {
  id: string;
  title: string;
  objective: string;
  automationRule: string;
}

export interface RiskRegisterItem {
  id: string;
  risk: string;
  mitigation: string[];
}

export interface DevelopmentSprint {
  sprint: number;
  title: string;
  deliverables: string[];
}

export const minimumPublicationScore = 75;

export const productionContentStatuses: ProductionContentStatus[] = [
  "idea",
  "scripted",
  "storyboard_ready",
  "assets_pending",
  "assets_generated",
  "editing",
  "preview_ready",
  "quality_checked",
  "needs_review",
  "approved",
  "scheduled",
  "published",
  "failed",
  "archived"
];

export const operationalWorkflows: OperationalWorkflow[] = [
  {
    id: "brand_creation",
    title: "Creation marque",
    objective: "Creer une marque media exploitable en moins de cinq minutes.",
    trigger: "Utilisateur lance l'onboarding ou ajoute une marque.",
    owner: "user",
    steps: [
      "Creer workspace",
      "Creer marque",
      "Choisir niche et ville",
      "Definir langue, plateforme, ton, style visuel, frequence et budget",
      "Generer charte IA",
      "Valider ou modifier la charte"
    ],
    outputs: [
      "Positionnement",
      "Promesse",
      "Audience cible",
      "Ton",
      "Style visuel",
      "Regles editoriales",
      "Hooks et captions exemples"
    ],
    blockers: ["donnees marque incomplètes", "budget absent", "plateforme prioritaire absente"],
    successCriterion: "La marque est utilisable pour generer des idees sans reconfiguration."
  },
  {
    id: "idea_generation",
    title: "Generation d'idees",
    objective: "Produire chaque jour 5 a 10 idees classees et pre-scorees.",
    trigger: "Manuel, routine du matin, performance notable ou evenement verifie.",
    owner: "system",
    steps: [
      "Charger marque et memoire",
      "Charger performances et regles editoriales",
      "Charger contexte du jour",
      "Verifier budget",
      "Generer idees differenciees",
      "Pre-scorer et classer",
      "Sauvegarder les meilleures"
    ],
    outputs: ["idees premium", "idees courtes", "idees emotionnelles", "idees evergreen", "idees experimentales"],
    blockers: ["budget depasse", "contexte evenementiel non verifie", "JSON IA invalide"],
    successCriterion: "L'utilisateur voit plusieurs idees utiles et comprend pourquoi elles sont classees."
  },
  {
    id: "content_production",
    title: "Production contenu",
    objective: "Transformer une idee validee en video finale exploitable.",
    trigger: "Editeur selectionne une idee.",
    owner: "editor",
    steps: [
      "Generer hooks",
      "Generer script",
      "Generer storyboard",
      "Generer prompts video",
      "Choisir provider",
      "Verifier cout et risques",
      "Generer ou uploader assets",
      "Choisir musique",
      "Monter preview",
      "Scorer qualite",
      "Exporter final",
      "Valider humainement"
    ],
    outputs: ["script", "storyboard", "prompts", "caption", "hashtags", "preview", "MP4 final"],
    blockers: [
      "idee non validee",
      "script non valide",
      "budget depasse",
      "musique non validee",
      "score trop faible",
      "provider indisponible"
    ],
    successCriterion: "Une video verticale propre peut etre publiee manuellement sans retouche."
  },
  {
    id: "ffmpeg_editing",
    title: "Montage FFmpeg",
    objective: "Assembler automatiquement un MP4 vertical propre.",
    trigger: "Assets video et musique approuvee disponibles.",
    owner: "worker",
    steps: [
      "Telecharger assets",
      "Normaliser formats, resolution et FPS",
      "Couper et assembler clips",
      "Mixer musique et voix",
      "Ajouter textes et sous-titres",
      "Exporter preview",
      "Verifier fichier",
      "Exporter final"
    ],
    outputs: ["preview MP4", "final MP4", "rapport controles techniques"],
    blockers: ["asset manquant", "format invalide", "audio absent", "ratio incorrect", "fichier corrompu"],
    successCriterion: "Le fichier final respecte le 9:16, le son, la duree et le hook avant 2 secondes."
  },
  {
    id: "human_validation",
    title: "Validation humaine",
    objective: "Bloquer les publications faibles ou risquees.",
    trigger: "Preview et score disponibles.",
    owner: "editor",
    steps: [
      "Verifier video",
      "Verifier format",
      "Verifier son",
      "Verifier musique",
      "Verifier caption et hashtags",
      "Verifier score et risques",
      "Approuver, modifier, regenerer, exporter, programmer ou archiver"
    ],
    outputs: ["decision editoriale", "raison de refus si rejet", "historique apprentissage"],
    blockers: ["score insuffisant", "risque copyright", "risque factuel", "musique non validee"],
    successCriterion: "Aucun contenu refuse n'est supprime automatiquement."
  },
  {
    id: "publication",
    title: "Publication",
    objective: "Publier ou programmer uniquement un contenu valide.",
    trigger: "Editeur demande la publication ou la programmation.",
    owner: "system",
    steps: [
      "Verifier validation humaine",
      "Verifier score minimum",
      "Verifier musique",
      "Verifier compte social, token et permissions",
      "Verifier format video",
      "Generer caption et hashtags finaux",
      "Creer job publication",
      "Envoyer au provider",
      "Sauvegarder ID plateforme",
      "Programmer analytics"
    ],
    outputs: ["publication", "schedule", "ID plateforme", "jobs analytics"],
    blockers: ["compte non connecte", "token expire", "permission manquante", "media inaccessible", "quota depasse"],
    successCriterion: "Le MVP garde l'export manuel prioritaire tant que la qualite n'est pas prouvee."
  },
  {
    id: "analytics",
    title: "Analytics",
    objective: "Recuperer les performances apres publication sans confondre null et zero.",
    trigger: "Publication reussie.",
    owner: "system",
    steps: [
      "Planifier snapshots 1h, 6h, 24h, 72h, 7j",
      "Lire metriques disponibles",
      "Stocker null pour metrique indisponible",
      "Comparer au benchmark de marque"
    ],
    outputs: ["vues", "likes", "commentaires", "partages", "saves", "watch time", "completion rate"],
    blockers: ["analytics indisponibles", "token expire", "permissions insuffisantes"],
    successCriterion: "Les donnees alimentent l'apprentissage sans conclusions prematurees."
  },
  {
    id: "learning",
    title: "Apprentissage",
    objective: "Transformer les resultats en recommandations prudentes.",
    trigger: "Nouvelles metriques ou refus humain.",
    owner: "system",
    steps: [
      "Comparer contenus",
      "Identifier hook, duree, style, musique, heure, plateforme et CTA",
      "Chercher correlations",
      "Calculer confiance",
      "Creer insight",
      "Mettre a jour memoire de marque"
    ],
    outputs: ["hypothese", "correlation", "conclusion", "recommandation"],
    blockers: ["moins de donnees comparables", "metriques manquantes", "risque de sur-interpretation"],
    successCriterion: "L'IA distingue hypothese, correlation et conclusion."
  }
];

export const ffmpegQualityChecks: FfmpegQualityCheck[] = [
  { id: "file_readable", label: "Fichier non corrompu", required: true, failureCategory: "format" },
  { id: "duration_ok", label: "Duree correcte", required: true, failureCategory: "validation" },
  { id: "ratio_9_16", label: "Ratio 9:16", required: true, failureCategory: "format" },
  { id: "resolution_1080_1920", label: "Resolution 1080x1920", required: true, failureCategory: "format" },
  { id: "audio_readable", label: "Audio lisible", required: true, failureCategory: "format" },
  { id: "volume_ok", label: "Volume correct", required: true, failureCategory: "validation" },
  { id: "no_black_start", label: "Pas de noir au debut", required: true, failureCategory: "validation" },
  { id: "text_visible", label: "Texte visible", required: true, failureCategory: "validation" },
  { id: "size_ok", label: "Taille fichier acceptable", required: true, failureCategory: "format" },
  { id: "hook_before_two_seconds", label: "Hook avant 2 secondes", required: true, failureCategory: "validation" }
];

export const humanValidationChecklist = [
  "video lisible",
  "format correct",
  "son present",
  "musique validee",
  "caption prete",
  "hashtags prets",
  "score suffisant",
  "aucun risque factuel bloquant",
  "aucun risque copyright bloquant",
  "budget respecte",
  "validation humaine"
];

export const analyticsSyncScheduleHours = [1, 6, 24, 72, 168] as const;

export const requiredTestSuites: TestSuiteDefinition[] = [
  {
    id: "unit_business_rules",
    layer: "unit",
    title: "Regles metier",
    requiredCases: [
      "creation marque",
      "validation donnees",
      "calcul score",
      "calcul budget",
      "selection fournisseur",
      "verification musique",
      "transitions statut contenu",
      "blocages publication"
    ],
    passCriterion: "Les decisions critiques sont deterministes et testables sans provider externe."
  },
  {
    id: "ai_regression",
    layer: "ai",
    title: "Regression IA",
    requiredCases: [
      "JSON valide",
      "schema respecte",
      "idee Paris House forte",
      "idee trop generique rejetee",
      "musique non validee bloquee",
      "evenement invente signale",
      "script trop long corrige",
      "caption trop commerciale corrigee",
      "contenu publiable explique"
    ],
    passCriterion: "Les agents signalent les risques et expliquent leurs scores."
  },
  {
    id: "provider_integrations",
    layer: "integration",
    title: "Providers",
    requiredCases: [
      "OpenAI success",
      "JSON invalide",
      "timeout",
      "quota depasse",
      "video job cree",
      "fallback provider",
      "storage upload",
      "signed URL",
      "FFmpeg export",
      "publication token expire"
    ],
    passCriterion: "Chaque provider retourne une erreur normalisee et un cout quand applicable."
  },
  {
    id: "e2e_manual_export",
    layer: "e2e",
    title: "MVP export manuel",
    requiredCases: [
      "creer workspace",
      "creer Paris House",
      "generer idees",
      "selectionner idee",
      "generer script",
      "generer storyboard",
      "uploader video",
      "uploader musique validee",
      "creer montage",
      "exporter MP4",
      "scorer",
      "valider",
      "telecharger video"
    ],
    passCriterion: "Un utilisateur sort un MP4 vertical publiable manuellement."
  },
  {
    id: "security_baseline",
    layer: "security",
    title: "Securite",
    requiredCases: [
      "aucun secret frontend",
      "tokens chiffres",
      "workspace isolation",
      "fichiers prives",
      "URLs signees expirables",
      "logs sans secrets",
      "validation serveur",
      "rate limiting",
      "audit logs"
    ],
    passCriterion: "Aucune action sensible ne contourne le serveur ni l'audit."
  }
];

export const deploymentEnvironments: DeploymentEnvironmentDefinition[] = [
  {
    id: "local",
    purpose: "Developpement rapide avec cout nul.",
    providers: ["mock", "ffmpeg local"],
    storage: "local ou Supabase dev",
    publicationMode: "disabled",
    monitoring: ["logs console", "typecheck", "build"]
  },
  {
    id: "staging",
    purpose: "Validation interne avec vrais providers limites.",
    providers: ["openai", "ffmpeg", "r2", "providers video optionnels"],
    storage: "Cloudflare R2 ou Supabase Storage staging",
    publicationMode: "draft_only",
    monitoring: ["logs complets", "jobs echoues", "couts", "webhooks"]
  },
  {
    id: "production",
    purpose: "Usage reel avec validation humaine obligatoire.",
    providers: ["openai", "ffmpeg", "r2", "social providers approuves"],
    storage: "stockage cloud prive avec URLs signees",
    publicationMode: "real_after_approval",
    monitoring: ["Sentry", "alertes queues", "budget", "backups", "tokens expires"]
  }
];

export const monitoringSignals = [
  "erreurs backend",
  "jobs echoues",
  "jobs bloques",
  "temps moyen generation",
  "cout par provider",
  "taux de succes provider",
  "echecs publication",
  "tokens expires",
  "budget depasse",
  "stockage utilise",
  "exports FFmpeg echoues",
  "erreurs IA JSON"
];

export const backupRetentionRules = [
  { target: "base de donnees", rule: "backup quotidien, restauration testee, retention minimale 30 jours" },
  { target: "fichiers temporaires", rule: "suppression rapide apres traitement" },
  { target: "previews refusees", rule: "suppression possible apres delai" },
  { target: "exports finaux", rule: "conserver tant que le workspace existe" },
  { target: "musiques", rule: "conserver tant que la licence est active" },
  { target: "logs sensibles", rule: "retention courte et sans secrets" }
];

export const productRoadmap: RoadmapPhase[] = [
  {
    phase: 0,
    title: "Cadrage",
    goal: "Preparer le projet.",
    deliverables: ["cahier des charges", "architecture", "modeles", "workflows", "design system", "priorites MVP"],
    successCriterion: "Le socle produit est clair avant de brancher les providers couteux."
  },
  {
    phase: 1,
    title: "MVP export manuel",
    goal: "Creer une premiere video exploitable.",
    deliverables: ["auth", "workspace", "marque", "idees", "script", "storyboard", "upload", "FFmpeg", "export MP4", "score", "bibliotheque video"],
    successCriterion: "L'utilisateur produit une video verticale propre et la poste manuellement."
  },
  {
    phase: 2,
    title: "Generation IA avancee",
    goal: "Automatiser davantage la production.",
    deliverables: ["Runway ou Kling", "provider image", "ElevenLabs", "variantes", "previews", "couts", "fallback simple"],
    successCriterion: "Une video complete peut etre generee sans quitter l'application."
  },
  {
    phase: 3,
    title: "Publication Instagram",
    goal: "Fermer la boucle production-publication.",
    deliverables: ["connexion Meta", "permissions", "publication ou programmation", "historique", "erreurs lisibles", "premiers analytics"],
    successCriterion: "Une video validee peut etre publiee ou programmee depuis l'application."
  },
  {
    phase: 4,
    title: "Analytics et apprentissage",
    goal: "Faire apprendre le systeme.",
    deliverables: ["metriques", "dashboard", "analyse IA", "recommandations", "memoire marque", "regles automatiques"],
    successCriterion: "L'application recommande les prochains contenus a partir des resultats reels."
  },
  {
    phase: 5,
    title: "Multi-plateforme",
    goal: "Etendre la diffusion.",
    deliverables: ["TikTok", "YouTube Shorts", "adaptation captions", "exports specifiques", "analytics multi-plateforme"],
    successCriterion: "Un contenu est decline proprement sur plusieurs plateformes."
  },
  {
    phase: 6,
    title: "Multi-marques avance",
    goal: "Gerer plusieurs marques medias.",
    deliverables: ["comparaison marques", "budget par marque", "calendrier global", "duplication", "presets niche"],
    successCriterion: "L'utilisateur pilote 5 a 10 marques depuis un seul espace."
  },
  {
    phase: 7,
    title: "SaaS commercial",
    goal: "Vendre le produit.",
    deliverables: ["plans", "facturation", "limites", "equipes", "roles", "onboarding public", "support", "monitoring avance"],
    successCriterion: "Un utilisateur externe produit son premier contenu sans aide."
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    target: "Createur solo",
    includes: ["1 workspace", "1 a 2 marques", "idees", "scripts", "storyboard", "export manuel", "limite basse"]
  },
  {
    id: "creator",
    name: "Creator",
    target: "Utilisateur serieux",
    includes: ["plusieurs marques", "generation video", "bibliotheque musique", "montage automatique", "exports multi-formats", "analytics simples"]
  },
  {
    id: "pro",
    name: "Pro",
    target: "Createurs avances",
    includes: ["publication Instagram", "TikTok et YouTube", "apprentissage IA", "budget avance", "multi-marques", "automatisation avancee"]
  },
  {
    id: "agency",
    name: "Agency",
    target: "Agences",
    includes: ["multi-clients", "equipes", "roles", "reporting", "marque blanche possible", "limites elevees"]
  }
];

export const launchStrategy: LaunchStep[] = [
  {
    id: "paris_house_only",
    title: "Paris House uniquement",
    objective: "Prouver que le moteur produit du contenu beau et regulier.",
    automationRule: "Automatiser idees, scripts, captions, montage et exports seulement."
  },
  {
    id: "manual_30_days",
    title: "30 jours de publication manuelle",
    objective: "Comprendre ce qui marche sans complexite API sociale.",
    automationRule: "Ne pas automatiser les decisions creatives finales."
  },
  {
    id: "measure",
    title: "Mesurer les resultats",
    objective: "Suivre vues, abonnes, saves, partages, commentaires et retention si disponible.",
    automationRule: "Ne conclure qu'avec assez de contenus comparables."
  },
  {
    id: "second_brand",
    title: "Deuxieme marque",
    objective: "Verifier que le systeme est replicable.",
    automationRule: "Dupliquer seulement quand Paris House est stable."
  }
];

export const mediaBrandMonetizationIdeas = [
  "promotion de soirees",
  "partenariats clubs",
  "partenariats rooftops",
  "DJs et labels",
  "playlists Spotify",
  "affiliation billetterie",
  "contenu sponsorise",
  "collaborations mode",
  "evenements prives",
  "presets et templates"
];

export const riskRegister: RiskRegisterItem[] = [
  {
    id: "quality",
    risk: "Contenu beau mais vide",
    mitigation: ["scoring severe", "identite forte", "validation humaine", "refus des contenus generiques"]
  },
  {
    id: "copyright",
    risk: "Musique sans droits",
    mitigation: ["bibliotheque validee", "preuve licence", "blocage publication", "aucune musique commerciale non autorisee"]
  },
  {
    id: "platform",
    risk: "APIs sociales changeantes",
    mitigation: ["adapters", "export manuel toujours possible", "publication auto non prioritaire"]
  },
  {
    id: "cost",
    risk: "Video IA trop couteuse",
    mitigation: ["budget", "pre-score", "limites", "generation video apres validation seulement"]
  },
  {
    id: "hallucination",
    risk: "Evenements inventes",
    mitigation: ["verification", "sources", "reformulation evergreen", "blocage factuel non verifie"]
  },
  {
    id: "scope",
    risk: "Produit trop gros trop tot",
    mitigation: ["MVP strict", "Paris House d'abord", "export manuel d'abord", "pas de SaaS public premature"]
  }
];

export const developmentSprints: DevelopmentSprint[] = [
  { sprint: 1, title: "Fondation", deliverables: ["repo", "Next.js", "TypeScript", "Tailwind", "schema workspace/brand/content", "layout", "auth"] },
  { sprint: 2, title: "Marque", deliverables: ["creation marque", "preset Paris House", "identite", "regles editoriales", "stockage base"] },
  { sprint: 3, title: "IA texte", deliverables: ["OpenAIProvider", "agents", "schemas JSON", "logs IA"] },
  { sprint: 4, title: "Studio", deliverables: ["etapes idee/script/storyboard/assets/montage/score", "statuts", "progression"] },
  { sprint: 5, title: "Assets", deliverables: ["upload video", "upload musique", "licence", "stockage", "preview"] },
  { sprint: 6, title: "FFmpeg", deliverables: ["worker", "export 9:16", "musique", "texte", "MP4", "controles techniques"] },
  { sprint: 7, title: "Scoring", deliverables: ["quality agent", "score detaille", "recommandations", "blocages"] },
  { sprint: 8, title: "Bibliotheque", deliverables: ["liste videos", "detail projet", "telechargement", "duplication", "archivage"] },
  { sprint: 9, title: "Couts et logs", deliverables: ["couts", "logs jobs", "logs IA", "erreurs lisibles"] },
  { sprint: 10, title: "Stabilisation", deliverables: ["tests", "README", "staging", "corrections", "premiere video complete"] }
];

export function collectPublicationBlockers(input: PublicationReadinessInput): ReadinessBlocker[] {
  const minimumScore = input.minimumScore ?? minimumPublicationScore;
  const blockers: ReadinessBlocker[] = [];

  if (!input.humanApproved) {
    blockers.push({
      code: "human_approval_required",
      category: "validation",
      userMessage: "Validation humaine obligatoire avant publication.",
      severity: "blocking"
    });
  }

  if (typeof input.globalScore !== "number" || input.globalScore < minimumScore) {
    blockers.push({
      code: "score_below_threshold",
      category: "validation",
      userMessage: `Score minimum requis: ${minimumScore}.`,
      severity: "blocking"
    });
  }

  if (!input.musicApproved) {
    blockers.push({
      code: "music_license_missing",
      category: "copyright",
      userMessage: "La musique doit etre validee avant publication.",
      severity: "blocking"
    });
  }

  if (!input.captionReady || !input.hashtagsReady) {
    blockers.push({
      code: "publication_copy_missing",
      category: "validation",
      userMessage: "Caption et hashtags finaux doivent etre prets.",
      severity: "blocking"
    });
  }

  if (!input.videoFormatValid) {
    blockers.push({
      code: "video_format_invalid",
      category: "format",
      userMessage: "Le fichier video doit respecter les contraintes de la plateforme.",
      severity: "blocking"
    });
  }

  if (!input.socialAccountConnected) {
    blockers.push({
      code: "social_account_not_connected",
      category: "auth",
      userMessage: "Compte social non connecte. Export manuel uniquement pour le MVP.",
      severity: "blocking"
    });
  }

  if (!input.tokenValid) {
    blockers.push({
      code: "token_invalid",
      category: "auth",
      userMessage: "Le token social doit etre reconnecte.",
      severity: "blocking"
    });
  }

  if (!input.permissionsValid) {
    blockers.push({
      code: "permissions_missing",
      category: "permissions",
      userMessage: "Permissions de publication manquantes.",
      severity: "blocking"
    });
  }

  if (!input.budgetAvailable) {
    blockers.push({
      code: "budget_exceeded",
      category: "budget",
      userMessage: "Budget mensuel depasse.",
      severity: "blocking"
    });
  }

  if (input.copyrightRiskBlocking) {
    blockers.push({
      code: "copyright_risk_blocking",
      category: "copyright",
      userMessage: "Risque copyright bloquant.",
      severity: "blocking"
    });
  }

  if (input.factualRiskBlocking) {
    blockers.push({
      code: "factual_risk_blocking",
      category: "factual",
      userMessage: "Risque factuel bloquant.",
      severity: "blocking"
    });
  }

  if (input.status !== "approved" && input.status !== "scheduled") {
    blockers.push({
      code: "status_not_approved",
      category: "validation",
      userMessage: "Le contenu doit etre approuve avant publication.",
      severity: "blocking"
    });
  }

  return blockers;
}

export function evaluatePublicationReadiness(
  input: PublicationReadinessInput
): PublicationReadinessResult {
  const minimumScore = input.minimumScore ?? minimumPublicationScore;
  const blockers = collectPublicationBlockers({ ...input, minimumScore });
  const onlySocialBlocked = blockers.every((blocker) =>
    ["social_account_not_connected", "token_invalid", "permissions_missing"].includes(blocker.code)
  );

  return {
    ok: blockers.length === 0,
    minimumScore,
    blockers,
    nextAction:
      blockers.length === 0
        ? "publish_or_schedule"
        : onlySocialBlocked
          ? "manual_export_only"
          : "fix_blockers"
  };
}

export function getLearningConfidence(comparableContentCount: number): "low" | "medium" | "high" {
  if (comparableContentCount < 5) {
    return "low";
  }

  if (comparableContentCount <= 15) {
    return "medium";
  }

  return "high";
}

export function buildAnalyticsCollectionPlan(
  publicationId: string,
  platform: SocialPlatform,
  publishedAt: string
) {
  const baseTime = new Date(publishedAt).getTime();

  return analyticsSyncScheduleHours.map((hoursAfterPublication) => ({
    publicationId,
    platform,
    hoursAfterPublication,
    scheduledAt: new Date(baseTime + hoursAfterPublication * 60 * 60 * 1000).toISOString()
  }));
}

export function shouldRequireHumanApprovalForProviderFallback(
  currentProvider: ProviderName,
  fallbackProvider: ProviderName,
  costIncreaseCents: number,
  qualityDropEstimate: number
): boolean {
  return currentProvider !== fallbackProvider && (costIncreaseCents > 0 || qualityDropEstimate > 0);
}
