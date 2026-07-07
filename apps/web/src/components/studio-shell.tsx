"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpenCheck,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clapperboard,
  Clock3,
  Copy,
  CreditCard,
  Download,
  Eye,
  FileVideo,
  Gauge,
  Home,
  KeyRound,
  LayoutDashboard,
  Library,
  Lightbulb,
  LockKeyhole,
  MessageSquareText,
  Mic2,
  MoreHorizontal,
  Music2,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Tags,
  Trash2,
  Upload,
  UserRound,
  WalletCards,
  Wand2,
  X
} from "lucide-react";
import {
  calculateQualityScore,
  formatRecommendation,
  type AutomationLevel,
  type ContentIdea,
  type QualityScoreInput
} from "@creator-ai-studio/shared";
import {
  aiAgents,
  aiDecisions,
  aiLogs,
  aiPlanSteps,
  aiPrompts,
  aiSchemas,
  analyticsRows,
  apiKeys,
  brand,
  brandMemory,
  calendarItems,
  costs,
  dashboardTasks,
  ideas,
  initialQualityInput,
  learnings,
  musicTracks,
  onboardingSteps,
  performanceStats,
  previewImage,
  project,
  publicationItems,
  regressionCases,
  socialAccounts,
  studioAssets,
  topStats,
  validationChecklist,
  videoLibrary,
  workflow,
  type ContentLifecycleStatus,
  type StudioPage,
  type StudioStep
} from "@/data/studio-data";

type ReviewState = "waiting" | "approved" | "rejected";

const desktopNavigation: Array<{ page: StudioPage; label: string; icon: React.ElementType }> = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "brands", label: "Marques", icon: Tags },
  { page: "calendar", label: "Calendrier", icon: CalendarDays },
  { page: "ideas", label: "Idées", icon: Lightbulb },
  { page: "studio", label: "Studio", icon: Clapperboard },
  { page: "videos", label: "Bibliothèque vidéo", icon: Library },
  { page: "music", label: "Bibliothèque musique", icon: Music2 },
  { page: "publications", label: "Publications", icon: Send },
  { page: "analytics", label: "Analytics", icon: BarChart3 },
  { page: "ai-engine", label: "Moteur IA", icon: Brain },
  { page: "learnings", label: "Apprentissages IA", icon: Brain },
  { page: "costs", label: "Coûts", icon: WalletCards },
  { page: "social", label: "Connexions sociales", icon: ShieldCheck },
  { page: "settings", label: "Réglages", icon: Settings }
];

const mobileNavigation: Array<{ page: StudioPage; label: string; icon: React.ElementType }> = [
  { page: "dashboard", label: "Dashboard", icon: Home },
  { page: "brands", label: "Marques", icon: Tags },
  { page: "studio", label: "Studio", icon: Clapperboard },
  { page: "publications", label: "Publier", icon: Send },
  { page: "settings", label: "Plus", icon: MoreHorizontal }
];

const studioSteps: Array<{ step: StudioStep; label: string; icon: React.ElementType }> = [
  { step: "idea", label: "Idée", icon: Lightbulb },
  { step: "script", label: "Script", icon: MessageSquareText },
  { step: "storyboard", label: "Storyboard", icon: BookOpenCheck },
  { step: "assets", label: "Assets", icon: Upload },
  { step: "edit", label: "Montage", icon: Clapperboard },
  { step: "score", label: "Score", icon: Gauge },
  { step: "publication", label: "Publication", icon: Send }
];

const scoreControls: Array<{
  key: keyof QualityScoreInput;
  label: string;
  tone: string;
  risk?: boolean;
}> = [
  { key: "hook", label: "Hook", tone: "#35d0ba" },
  { key: "visual", label: "Visuel", tone: "#c7a45a" },
  { key: "rhythm", label: "Rythme", tone: "#ed4d6e" },
  { key: "brandFit", label: "Branding", tone: "#f5f0e6" },
  { key: "originality", label: "Originalité", tone: "#8fd3ff" },
  { key: "retention", label: "Rétention", tone: "#35d0ba" },
  { key: "share", label: "Partage", tone: "#c7a45a" },
  { key: "save", label: "Sauvegarde", tone: "#ed4d6e" },
  { key: "copyrightRisk", label: "Risque copyright", tone: "#ff9f43", risk: true },
  { key: "factualRisk", label: "Risque factuel", tone: "#ff6b6b", risk: true }
];

const automationLevels: AutomationLevel[] = [0, 1, 2, 3, 4];

const statusLabels: Record<ContentLifecycleStatus, string> = {
  idea: "Idée",
  scripted: "Script généré",
  storyboard_ready: "Storyboard prêt",
  assets_running: "Assets en cours",
  assets_ready: "Assets prêts",
  editing: "Montage en cours",
  edit_ready: "Montage prêt",
  scored: "Score calculé",
  needs_review: "À valider",
  approved: "Validé",
  scheduled: "Programmé",
  published: "Publié",
  error: "Erreur",
  archived: "Archivé"
};

const statusStyles: Record<ContentLifecycleStatus, string> = {
  idea: "border-line bg-line/60 text-smoke",
  scripted: "border-[#5aa7ff]/40 bg-[#5aa7ff]/12 text-[#8fc4ff]",
  storyboard_ready: "border-[#9b7cff]/40 bg-[#9b7cff]/12 text-[#b8a5ff]",
  assets_running: "border-[#9b7cff]/40 bg-[#9b7cff]/12 text-[#b8a5ff]",
  assets_ready: "border-gold/40 bg-gold/12 text-gold",
  editing: "border-gold/40 bg-gold/12 text-gold",
  edit_ready: "border-gold/40 bg-gold/12 text-gold",
  scored: "border-mint/40 bg-mint/12 text-mint",
  needs_review: "border-gold/40 bg-gold/12 text-gold",
  approved: "border-mint/40 bg-mint/12 text-mint",
  scheduled: "border-mint/40 bg-mint/12 text-mint",
  published: "border-line bg-night text-champagne",
  error: "border-rose/40 bg-rose/12 text-rose",
  archived: "border-line bg-line/40 text-smoke"
};

function selectedIdeaOrFirst(selectedIdeaId: string): ContentIdea {
  return ideas.find((idea) => idea.id === selectedIdeaId) ?? ideas[0]!;
}

function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(cents / 100);
}

function totalCost() {
  return costs.reduce((total, cost) => total + cost.estimatedCostCents, 0);
}

export function StudioShell() {
  const [activePage, setActivePage] = useState<StudioPage>("dashboard");
  const [activeStep, setActiveStep] = useState<StudioStep>("idea");
  const [selectedIdeaId, setSelectedIdeaId] = useState(ideas[0]!.id);
  const [qualityInput, setQualityInput] = useState<QualityScoreInput>(initialQualityInput);
  const [automationLevel, setAutomationLevel] = useState<AutomationLevel>(brand.automationLevel);
  const [approvalLocked, setApprovalLocked] = useState(true);
  const [reviewState, setReviewState] = useState<ReviewState>("waiting");
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const selectedIdea = selectedIdeaOrFirst(selectedIdeaId);
  const quality = useMemo(() => calculateQualityScore(qualityInput), [qualityInput]);
  const approvedTrackCount = musicTracks.filter((track) => track.approvedForUse).length;

  function updateScore(key: keyof QualityScoreInput, value: number) {
    setQualityInput((current) => ({ ...current, [key]: value }));
  }

  function go(page: StudioPage) {
    setActivePage(page);
    setCreateMenuOpen(false);
  }

  return (
    <main className="min-h-screen overflow-hidden text-champagne">
      <div className="flex min-h-screen">
        <SideNav activePage={activePage} onNavigate={go} />
        <section className="flex min-w-0 flex-1 flex-col">
          <TopBar
            activePage={activePage}
            createMenuOpen={createMenuOpen}
            onAskAi={() => setAssistantOpen(true)}
            onCreate={() => setCreateMenuOpen((open) => !open)}
            onNavigate={go}
          />
          <div className="studio-scrollbar flex-1 overflow-y-auto px-4 pb-24 pt-4 md:px-6 lg:pb-6">
            {activePage === "onboarding" && <OnboardingScreen onNavigate={go} />}
            {activePage === "dashboard" && <DashboardScreen onNavigate={go} />}
            {activePage === "brands" && <BrandsScreen onNavigate={go} />}
            {activePage === "identity" && <IdentityScreen />}
            {activePage === "calendar" && <CalendarScreen onNavigate={go} />}
            {activePage === "ideas" && (
              <IdeasScreen
                onNavigate={go}
                onSelectIdea={(ideaId) => {
                  setSelectedIdeaId(ideaId);
                  setActiveStep("idea");
                  go("studio");
                }}
                selectedIdeaId={selectedIdeaId}
              />
            )}
            {activePage === "studio" && (
              <StudioScreen
                activeStep={activeStep}
                approvalLocked={approvalLocked}
                automationLevel={automationLevel}
                quality={quality}
                qualityInput={qualityInput}
                reviewState={reviewState}
                selectedIdea={selectedIdea}
                setActiveStep={setActiveStep}
                setApprovalLocked={setApprovalLocked}
                setAutomationLevel={setAutomationLevel}
                setReviewState={setReviewState}
                updateScore={updateScore}
              />
            )}
            {activePage === "videos" && <VideosScreen onNavigate={go} />}
            {activePage === "music" && <MusicScreen />}
            {activePage === "publications" && <PublicationsScreen onNavigate={go} />}
            {activePage === "analytics" && <AnalyticsScreen />}
            {activePage === "ai-engine" && <AiEngineScreen />}
            {activePage === "learnings" && <LearningsScreen />}
            {activePage === "costs" && <CostsScreen />}
            {activePage === "social" && <SocialScreen />}
            {activePage === "settings" && (
              <SettingsScreen
                approvalLocked={approvalLocked}
                automationLevel={automationLevel}
                setApprovalLocked={setApprovalLocked}
                setAutomationLevel={setAutomationLevel}
              />
            )}
          </div>
        </section>
      </div>

      <AssistantPanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />
      <MobileNav activePage={activePage} onNavigate={go} />
    </main>
  );
}

function SideNav({
  activePage,
  onNavigate
}: {
  activePage: StudioPage;
  onNavigate: (page: StudioPage) => void;
}) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-line bg-night/94 p-4 lg:flex lg:flex-col">
      <button className="text-left" onClick={() => onNavigate("dashboard")} type="button">
        <div className="flex items-center gap-2 text-sm text-gold">
          <Sparkles size={16} />
          <span>Creator AI Studio</span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold leading-tight">Paris House</h1>
      </button>

      <nav className="studio-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
        {desktopNavigation.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.page;

          return (
            <button
              key={item.page}
              className={clsx(
                "mb-1 flex h-10 w-full items-center gap-3 rounded-lg border px-3 text-sm transition",
                active
                  ? "border-gold/60 bg-gold/15 text-champagne"
                  : "border-transparent text-smoke hover:border-line hover:bg-ink hover:text-champagne"
              )}
              onClick={() => onNavigate(item.page)}
              type="button"
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-line pt-4">
        <div className="flex items-center justify-between rounded-lg border border-line bg-ink p-3">
          <div>
            <p className="text-xs text-smoke">Workspace</p>
            <p className="text-sm font-semibold">Creator Studio Paris</p>
          </div>
          <ChevronDown size={16} className="text-smoke" />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <IconButton icon={UserRound} label="Profil" />
          <IconButton icon={CircleHelp} label="Aide" />
          <IconButton icon={ShieldCheck} label="Statut système" success />
        </div>
      </div>
    </aside>
  );
}

function TopBar({
  activePage,
  createMenuOpen,
  onAskAi,
  onCreate,
  onNavigate
}: {
  activePage: StudioPage;
  createMenuOpen: boolean;
  onAskAi: () => void;
  onCreate: () => void;
  onNavigate: (page: StudioPage) => void;
}) {
  const title = desktopNavigation.find((item) => item.page === activePage)?.label ?? "Onboarding";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-night/88 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-smoke">
            <span>Creator Studio Paris</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>{brand.name}</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>Budget: $42 / $150</span>
          </div>
          <h2 className="mt-1 truncate text-xl font-semibold">{title}</h2>
        </div>

        <div className="relative flex flex-wrap gap-2">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-ink px-3 text-sm text-champagne hover:border-mint"
            onClick={onAskAi}
            title="Demander à l'IA"
            type="button"
          >
            <Wand2 size={16} />
            <span>Demander à l'IA</span>
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-gold px-3 text-sm font-semibold text-night hover:bg-champagne"
            onClick={onCreate}
            title="Créer"
            type="button"
          >
            <Plus size={16} />
            <span>Créer</span>
          </button>
          <IconButton icon={Bell} label="Notifications" />
          <IconButton icon={UserRound} label="Profil" />
          {createMenuOpen && (
            <div className="absolute right-0 top-12 z-40 w-64 rounded-lg border border-line bg-ink p-2 shadow-panel">
              {[
                ["Nouvelle idée", "ideas"],
                ["Nouveau contenu", "studio"],
                ["Nouvelle marque", "brands"],
                ["Importer vidéo", "videos"],
                ["Ajouter musique", "music"],
                ["Connecter compte", "social"]
              ].map(([label, page]) => (
                <button
                  key={label}
                  className="flex h-10 w-full items-center rounded-lg px-3 text-left text-sm text-smoke hover:bg-night hover:text-champagne"
                  onClick={() => onNavigate(page as StudioPage)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileNav({
  activePage,
  onNavigate
}: {
  activePage: StudioPage;
  onNavigate: (page: StudioPage) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-line bg-night/96 px-2 py-2 lg:hidden">
      {mobileNavigation.map((item) => {
        const Icon = item.icon;
        const active = activePage === item.page;
        return (
          <button
            key={item.page}
            className={clsx(
              "flex h-12 flex-col items-center justify-center gap-1 rounded-lg text-[0.68rem]",
              active ? "bg-gold/15 text-gold" : "text-smoke"
            )}
            onClick={() => onNavigate(item.page)}
            type="button"
          >
            <Icon size={17} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function OnboardingScreen({ onNavigate }: { onNavigate: (page: StudioPage) => void }) {
  return (
    <ScreenFrame
      action={
        <button className="btn-primary" onClick={() => onNavigate("ideas")} type="button">
          Générer mes idées
        </button>
      }
      eyebrow="Premier lancement"
      title="Créer un studio prêt à produire"
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <Panel>
          <div className="grid gap-3 md:grid-cols-2">
            {onboardingSteps.map((step, index) => (
              <div key={step.label} className="rounded-lg border border-line bg-night p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase text-smoke">{step.label}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold text-sm font-semibold text-night">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-smoke">{step.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Preset Paris House" eyebrow="Marque recommandée">
          <div className="space-y-4">
            <InfoLine label="Nom" value="Paris House" />
            <InfoLine label="Niche" value="House Music / Nightlife" />
            <InfoLine label="Ville" value="Paris" />
            <InfoLine label="Plateforme" value="Instagram Reels" />
            <InfoLine label="Fréquence" value="1 contenu par jour" />
            <div className="flex flex-wrap gap-2">
              {["luxe", "cinématique", "nightlife", "mystérieux", "urbain"].map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1" onClick={() => onNavigate("ideas")} type="button">
                Créer mon studio
              </button>
              <button className="btn-secondary" onClick={() => onNavigate("dashboard")} type="button">
                J'ai déjà un compte
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function DashboardScreen({ onNavigate }: { onNavigate: (page: StudioPage) => void }) {
  return (
    <ScreenFrame
      action={
        <button className="btn-primary" onClick={() => onNavigate("studio")} type="button">
          Ouvrir le Studio
        </button>
      }
      eyebrow="État du studio"
      title="Paris House"
    >
      <MetricGrid stats={topStats} />
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel title="À faire aujourd'hui" eyebrow="Décisions">
          <div className="space-y-3">
            {dashboardTasks.map((task) => (
              <ActionRow
                key={task.id}
                action={task.action}
                detail={task.detail}
                onClick={() => onNavigate(task.status === "music_unverified" ? "music" : task.status === "token_expiring" ? "social" : "studio")}
                status={task.status}
                title={task.title}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Performance récente" eyebrow="7 jours">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5 xl:grid-cols-2">
            {performanceStats.map((stat) => (
              <MetricCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </Panel>

        <Panel title="Recommandation IA" eyebrow="Prochaine hypothèse">
          <p className="text-sm leading-6 text-smoke">
            Les vidéos de 18 à 24 secondes avec ambiance rooftop sont la meilleure hypothèse actuelle. Prochaine suggestion: Paris sunset rooftop + afro house, hook en anglais court.
          </p>
          <button className="btn-secondary mt-4" onClick={() => onNavigate("studio")} type="button">
            Créer à partir de cette recommandation
          </button>
        </Panel>

        <Panel title="Budget" eyebrow="Contrôle">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Coût jour" value={money(totalCost())} />
            <MetricCard label="Coût mois" value="$42.00" />
            <MetricCard label="Moyenne contenu" value="$0.64" />
            <MetricCard label="Fournisseur coûteux" value="OpenAI" />
          </div>
        </Panel>

        <Panel className="xl:col-span-2" title="Calendrier rapide" eyebrow="7 prochains jours">
          <CalendarStrip onNavigate={onNavigate} />
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function BrandsScreen({ onNavigate }: { onNavigate: (page: StudioPage) => void }) {
  return (
    <ScreenFrame
      action={<button className="btn-primary" type="button">Créer une marque</button>}
      eyebrow="Gestion multi-marques"
      title="Marques médias"
    >
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Paris House" eyebrow="Active">
          <p className="text-sm leading-6 text-smoke">
            House Music / Paris Nightlife. Instagram + TikTok. 1 contenu par jour, score moyen 84, +1 240 abonnés sur 30 jours.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricCard label="Score moyen" value="84" />
            <MetricCard label="Contenus publiés" value="18" />
            <MetricCard label="Croissance 30j" value="+1.2k" />
            <MetricCard label="Budget" value="$150" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => onNavigate("dashboard")} type="button">Ouvrir</button>
            <button className="btn-secondary" onClick={() => onNavigate("identity")} type="button">Modifier</button>
            <IconTextButton icon={Copy} label="Dupliquer" />
            <IconTextButton icon={Trash2} label="Désactiver" tone="danger" />
          </div>
        </Panel>

        <Panel title="Créer une marque" eyebrow="Champs MVP">
          <div className="grid gap-3 md:grid-cols-2">
            {([
              ["Nom", "Ibiza House"],
              ["Niche", "House music / sunset"],
              ["Pays", "Spain"],
              ["Ville", "Ibiza"],
              ["Langue", "English"],
              ["Audience", "Nightlife travelers"],
              ["Plateformes", "Instagram, TikTok"],
              ["Fréquence", "1 contenu / jour"],
              ["Budget mensuel", "$150"],
              ["Automatisation", "Production assistée"]
            ] satisfies Array<[string, string]>).map(([label, value]) => (
              <InfoLine key={label} label={label} value={value} />
            ))}
          </div>
        </Panel>

        <Panel className="xl:col-span-2" title="Détail marque" eyebrow="Onglets">
          <div className="flex flex-wrap gap-2">
            {["Résumé", "Identité", "Règles éditoriales", "Plateformes", "Musique", "Performance", "Apprentissage", "Budget", "Paramètres"].map((tab) => (
              <button
                key={tab}
                className="rounded-lg border border-line bg-night px-3 py-2 text-sm text-smoke hover:border-gold hover:text-champagne"
                onClick={() => tab === "Identité" && onNavigate("identity")}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function IdentityScreen() {
  return (
    <ScreenFrame eyebrow="Identité de marque" title="Paris House">
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Positionnement" eyebrow="Promesse">
          <p className="text-sm leading-6 text-smoke">
            Paris House capture l'énergie nocturne de Paris à travers la house music, les lumières, les rooftops et l'élégance urbaine.
          </p>
        </Panel>
        <Panel title="Ton éditorial" eyebrow="Voix">
          <div className="flex flex-wrap gap-2">
            {["premium", "mystérieux", "court", "élégant", "direct"].map((tone) => (
              <Tag key={tone}>{tone}</Tag>
            ))}
          </div>
        </Panel>
        <Panel title="Expressions autorisées" eyebrow="Lexique">
          <TokenList tokens={["after midnight", "city lights", "rooftop", "bassline", "Paris night", "house mood", "sunset session"]} />
        </Panel>
        <Panel title="Mots interdits" eyebrow="Garde-fous">
          <TokenList danger tokens={["buzz garanti", "venez nombreux", "deviens riche", "soirée de folie", "trop cheap"]} />
        </Panel>
        <Panel className="xl:col-span-2" title="Style visuel" eyebrow="Direction artistique">
          <p className="text-sm leading-6 text-smoke">
            Ambiance sombre, dorée, cinématique, urbaine. Plans de nuit, rooftops, rues éclairées, Seine, clubs, silhouettes élégantes. Éviter les rendus cartoon, les foules déformées, les visages trop proches.
          </p>
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function CalendarScreen({ onNavigate }: { onNavigate: (page: StudioPage) => void }) {
  return (
    <ScreenFrame
      action={<button className="btn-primary" onClick={() => onNavigate("studio")} type="button">Créer contenu</button>}
      eyebrow="Planification"
      title="Calendrier éditorial"
    >
      <Panel title="Vue semaine" eyebrow="Lundi à dimanche">
        <CalendarStrip onNavigate={onNavigate} />
      </Panel>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Panel title="Vue liste" eyebrow="Actions">
          <DataTable
            columns={["Date", "Titre", "Plateforme", "Statut", "Score", "Action"]}
            rows={calendarItems.map((item) => [
              `${item.day} ${item.date}`,
              item.title,
              item.platform,
              <StatusBadge key="status" status={item.status} />,
              item.score,
              <button key="action" className="btn-row" onClick={() => onNavigate("studio")} type="button">Ouvrir</button>
            ])}
          />
        </Panel>
        <Panel title="Recommandation IA" eyebrow="Créneaux estimés">
          <p className="text-sm leading-6 text-smoke">
            Jeudi 19:00 - 21:00, vendredi 18:30 - 22:00, dimanche 20:00 - 21:30. Données encore limitées: il faut 10 à 20 publications comparables pour conclure.
          </p>
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function IdeasScreen({
  onNavigate,
  onSelectIdea,
  selectedIdeaId
}: {
  onNavigate: (page: StudioPage) => void;
  onSelectIdea: (ideaId: string) => void;
  selectedIdeaId: string;
}) {
  return (
    <ScreenFrame
      action={<button className="btn-primary" type="button">Générer des idées</button>}
      eyebrow="Content Brain"
      title="Idées"
    >
      <Panel title="Filtres" eyebrow="Recherche">
        <div className="grid gap-3 md:grid-cols-[1fr_repeat(4,auto)]">
          <div className="flex h-10 items-center gap-2 rounded-lg border border-line bg-night px-3 text-sm text-smoke">
            <Search size={16} />
            <span>Paris House, rooftop, short hook</span>
          </div>
          {["Statut", "Score", "Plateforme", "Evergreen"].map((filter) => (
            <button key={filter} className="btn-secondary" type="button">{filter}</button>
          ))}
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.72fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {ideas.map((idea) => (
            <button
              key={idea.id}
              className={clsx(
                "rounded-lg border bg-ink p-4 text-left shadow-panel transition",
                selectedIdeaId === idea.id ? "border-mint" : "border-line hover:border-gold"
              )}
              onClick={() => onSelectIdea(idea.id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{idea.title}</p>
                  <p className="mt-2 text-sm leading-6 text-smoke">{idea.hook}</p>
                </div>
                <span className="rounded-md bg-mint px-2 py-1 text-xs font-semibold text-night">{idea.potentialScore}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-smoke">{idea.concept}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag>{idea.platformTarget}</Tag>
                <Tag>{idea.estimatedDurationSeconds}s</Tag>
                <Tag>Risk {idea.riskScore}</Tag>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <IconTextButton icon={Check} label="Sélectionner" />
                <IconTextButton icon={Pencil} label="Modifier" />
                <IconTextButton icon={X} label="Rejeter" tone="danger" />
              </div>
            </button>
          ))}
        </div>

        <Panel title="Comparer 2 à 5 idées" eyebrow="IA">
          <ScoreComparison />
          <p className="mt-4 text-sm leading-6 text-smoke">
            Gagnante recommandée: Blue hour rooftop pulse. Meilleur équilibre entre rétention, faisabilité, cohérence marque et faible risque factuel.
          </p>
          <button className="btn-primary mt-4" onClick={() => onNavigate("studio")} type="button">
            Générer storyboard
          </button>
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function StudioScreen({
  activeStep,
  approvalLocked,
  automationLevel,
  quality,
  qualityInput,
  reviewState,
  selectedIdea,
  setActiveStep,
  setApprovalLocked,
  setAutomationLevel,
  setReviewState,
  updateScore
}: {
  activeStep: StudioStep;
  approvalLocked: boolean;
  automationLevel: AutomationLevel;
  quality: ReturnType<typeof calculateQualityScore>;
  qualityInput: QualityScoreInput;
  reviewState: ReviewState;
  selectedIdea: ContentIdea;
  setActiveStep: (step: StudioStep) => void;
  setApprovalLocked: (locked: boolean) => void;
  setAutomationLevel: (level: AutomationLevel) => void;
  setReviewState: (state: ReviewState) => void;
  updateScore: (key: keyof QualityScoreInput, value: number) => void;
}) {
  return (
    <ScreenFrame
      action={<button className="btn-primary" onClick={() => setActiveStep("publication")} type="button">Exporter seulement</button>}
      eyebrow="Création"
      title={selectedIdea.title}
    >
      <div className="grid gap-4 xl:grid-cols-[15rem_minmax(0,1fr)_19rem]">
        <Panel title="Étapes" eyebrow="Production">
          <div className="space-y-2">
            {studioSteps.map((item) => {
              const Icon = item.icon;
              const active = item.step === activeStep;
              return (
                <button
                  key={item.step}
                  className={clsx(
                    "flex h-11 w-full items-center gap-3 rounded-lg border px-3 text-sm",
                    active ? "border-gold bg-gold/15 text-champagne" : "border-line bg-night text-smoke hover:text-champagne"
                  )}
                  onClick={() => setActiveStep(item.step)}
                  type="button"
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </Panel>

        <section className="min-w-0">
          {activeStep === "idea" && <StudioIdeaStep selectedIdea={selectedIdea} setActiveStep={setActiveStep} />}
          {activeStep === "script" && <StudioScriptStep setActiveStep={setActiveStep} />}
          {activeStep === "storyboard" && <StudioStoryboardStep setActiveStep={setActiveStep} />}
          {activeStep === "assets" && <StudioAssetsStep setActiveStep={setActiveStep} />}
          {activeStep === "edit" && <StudioEditStep setActiveStep={setActiveStep} />}
          {activeStep === "score" && (
            <StudioScoreStep
              approvalLocked={approvalLocked}
              quality={quality}
              qualityInput={qualityInput}
              reviewState={reviewState}
              setActiveStep={setActiveStep}
              setReviewState={setReviewState}
              updateScore={updateScore}
            />
          )}
          {activeStep === "publication" && <StudioPublicationStep quality={quality} />}
        </section>

        <Panel title="Assistant IA" eyebrow="Recommandations">
          <div className="space-y-4">
            <div className="rounded-lg border border-line bg-night p-3">
              <p className="text-sm font-semibold">Prochaine action</p>
              <p className="mt-2 text-sm leading-6 text-smoke">
                Raccourcir la scène 2 de 3 secondes améliorerait le rythme sans perdre le hook.
              </p>
            </div>
            <div className="rounded-lg border border-line bg-night p-3">
              <p className="text-sm font-semibold">Coût estimé</p>
              <p className="mt-2 text-sm text-smoke">{money(totalCost())} pour ce cycle MVP.</p>
            </div>
            <div className="rounded-lg border border-line bg-night p-3">
              <p className="text-sm font-semibold">Automatisation</p>
              <div className="mt-3 grid grid-cols-5 gap-1">
                {automationLevels.map((level) => (
                  <button
                    key={level}
                    className={clsx(
                      "h-9 rounded-md border text-sm",
                      automationLevel === level
                        ? "border-mint bg-mint text-night"
                        : "border-line bg-ink text-smoke hover:text-champagne"
                    )}
                    onClick={() => setAutomationLevel(level)}
                    type="button"
                  >
                    {level}
                  </button>
                ))}
              </div>
              <label className="mt-4 flex items-center gap-3 text-sm text-smoke">
                <input
                  checked={approvalLocked}
                  className="h-4 w-4 accent-mint"
                  onChange={(event) => setApprovalLocked(event.target.checked)}
                  type="checkbox"
                />
                Validation humaine obligatoire
              </label>
            </div>
          </div>
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function StudioIdeaStep({
  selectedIdea,
  setActiveStep
}: {
  selectedIdea: ContentIdea;
  setActiveStep: (step: StudioStep) => void;
}) {
  return (
    <Panel title="Étape 1: Idée" eyebrow="Hypothèse">
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-3">
          <InfoBlock label="Concept" value={selectedIdea.concept} />
          <InfoBlock label="Hook" value={selectedIdea.hook} />
          <InfoBlock label="Objectif" value="Faire ressentir une ambiance Paris House sans inventer d'événement réel." />
          <InfoBlock label="Audience" value="Jeunes adultes sensibles à la house music, au luxe discret et à Paris by night." />
          <InfoBlock label="Style" value={`${selectedIdea.visualStyle}. ${selectedIdea.musicStyle}.`} />
        </div>
        <div className="space-y-3">
          <MetricCard label="Durée" value={`${selectedIdea.estimatedDurationSeconds}s`} />
          <MetricCard label="Plateforme" value={selectedIdea.platformTarget} />
          <MetricCard label="Score potentiel" value={`${selectedIdea.potentialScore}`} />
          <MetricCard label="Risque" value={`${selectedIdea.riskScore}`} />
        </div>
      </div>
      <StepActions primary="Valider l'idée" onPrimary={() => setActiveStep("script")} />
    </Panel>
  );
}

function StudioScriptStep({ setActiveStep }: { setActiveStep: (step: StudioStep) => void }) {
  const segments = [
    ["0-2 sec", "Texte écran: Paris sounds different.", "Visuel: skyline bleu, lumières qui s'allument.", "Son: kick filtré."],
    ["3-8 sec", "Texte écran: after midnight.", "Visuel: rooftop, silhouettes, city lights.", "Son: percussion afro house."],
    ["9-22 sec", "Texte écran: House music. City lights.", "Visuel: plan large, mouvement léger, fin en boucle.", "Son: basse complète."]
  ];

  return (
    <Panel title="Étape 2: Script" eyebrow="Découpage secondes">
      <div className="space-y-3">
        {segments.map(([time, text, visual, sound]) => (
          <div key={time} className="rounded-lg border border-line bg-night p-4">
            <p className="text-sm font-semibold text-gold">{time}</p>
            <p className="mt-2 text-sm">{text}</p>
            <p className="mt-1 text-sm text-smoke">{visual}</p>
            <p className="mt-1 text-sm text-smoke">{sound}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        {([
          ["Hook", "92"],
          ["Clarté", "88"],
          ["Rythme", "84"],
          ["Marque", "94"],
          ["Longueur", "Low risk"]
        ] satisfies Array<[string, string]>).map(([label, value]) => (
          <MetricCard key={label} label={label} value={value} />
        ))}
      </div>
      <StepActions primary="Valider le script" onPrimary={() => setActiveStep("storyboard")} />
    </Panel>
  );
}

function StudioStoryboardStep({ setActiveStep }: { setActiveStep: (step: StudioStep) => void }) {
  return (
    <Panel title="Étape 3: Storyboard" eyebrow="Scènes">
      <div className="grid gap-3 md:grid-cols-3">
        {project.storyboard.map((scene) => (
          <div key={scene.id} className="rounded-lg border border-line bg-night p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Scène {scene.order}</span>
              <span className="text-xs text-gold">{scene.durationSeconds}s</span>
            </div>
            <p className="mt-3 text-sm">{scene.onScreenText}</p>
            <p className="mt-2 text-sm leading-6 text-smoke">{scene.visualPrompt}</p>
            <p className="mt-3 text-xs text-rose">Negative: cartoon, distorted faces, unreadable text, low quality.</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <IconTextButton icon={Plus} label="Ajouter scène" />
        <IconTextButton icon={Pencil} label="Modifier prompt" />
        <IconTextButton icon={Wand2} label="Plus réaliste" />
      </div>
      <StepActions primary="Valider storyboard" onPrimary={() => setActiveStep("assets")} />
    </Panel>
  );
}

function StudioAssetsStep({ setActiveStep }: { setActiveStep: (step: StudioStep) => void }) {
  return (
    <Panel title="Étape 4: Assets" eyebrow="Sources">
      <div className="grid gap-3 md:grid-cols-3">
        {studioAssets.map((asset) => (
          <div key={asset.id} className="rounded-lg border border-line bg-night p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{asset.type}</p>
                <p className="mt-1 text-xs text-smoke">{asset.provider}</p>
              </div>
              <span className="rounded-md border border-mint/40 bg-mint/10 px-2 py-1 text-xs text-mint">{asset.status}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <InfoLine label="Coût" value={asset.cost} />
              <InfoLine label="Durée" value={asset.duration} />
              <InfoLine label="Qualité" value={`${asset.quality}`} />
              <InfoLine label="Licence" value={asset.license} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-gold/40 bg-gold/10 p-3 text-sm text-gold">
        Midnight Line n'est pas validé pour publication et ne peut pas être utilisé dans un export final.
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <IconTextButton icon={FileVideo} label="Générer vidéo" />
        <IconTextButton icon={Upload} label="Ajouter un fichier" />
        <IconTextButton icon={Music2} label="Choisir musique" />
      </div>
      <StepActions primary="Valider assets" onPrimary={() => setActiveStep("edit")} />
    </Panel>
  );
}

function StudioEditStep({ setActiveStep }: { setActiveStep: (step: StudioStep) => void }) {
  return (
    <Panel title="Étape 5: Montage" eyebrow="Preview">
      <div className="grid gap-4 xl:grid-cols-[minmax(16rem,22rem)_1fr]">
        <VideoPreview qualityGlobal={84} />
        <div className="space-y-3">
          <TimelineRow label="Scène 1" width="23%" color="bg-mint" />
          <TimelineRow label="Scène 2" width="37%" color="bg-gold" />
          <TimelineRow label="Scène 3" width="40%" color="bg-rose" />
          <TimelineRow label="Musique" width="100%" color="bg-[#8fd3ff]" />
          <TimelineRow label="Texte" width="72%" color="bg-champagne" />
          <div className="grid grid-cols-2 gap-3">
            {["Instagram Reels 9:16", "TikTok 9:16", "YouTube Shorts 9:16", "Story 9:16"].map((format) => (
              <Tag key={format}>{format}</Tag>
            ))}
          </div>
          <ValidationGrid />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <IconTextButton icon={Wand2} label="Montage automatique" />
        <IconTextButton icon={Pencil} label="Modifier texte" />
        <IconTextButton icon={Music2} label="Changer musique" />
        <IconTextButton icon={Download} label="Exporter preview" />
      </div>
      <StepActions primary="Calculer le score" onPrimary={() => setActiveStep("score")} />
    </Panel>
  );
}

function StudioScoreStep({
  approvalLocked,
  quality,
  qualityInput,
  reviewState,
  setActiveStep,
  setReviewState,
  updateScore
}: {
  approvalLocked: boolean;
  quality: ReturnType<typeof calculateQualityScore>;
  qualityInput: QualityScoreInput;
  reviewState: ReviewState;
  setActiveStep: (step: StudioStep) => void;
  setReviewState: (state: ReviewState) => void;
  updateScore: (key: keyof QualityScoreInput, value: number) => void;
}) {
  return (
    <Panel title="Étape 6: Score qualité" eyebrow={formatRecommendation(quality.recommendation)}>
      <div className="grid gap-4 xl:grid-cols-[15rem_1fr]">
        <div className="rounded-lg border border-line bg-night p-4 text-center">
          <p className="text-6xl font-semibold">{quality.global}</p>
          <p className="mt-2 text-xs uppercase text-smoke">Score global</p>
          <p className="mt-4 text-sm leading-6 text-smoke">
            Le hook et le branding sont forts. Le rythme peut gagner en tension entre 8 et 14 secondes.
          </p>
        </div>
        <div className="space-y-3">
          {scoreControls.map((control) => (
            <label key={control.key} className="block">
              <span className="mb-1 flex items-center justify-between text-xs">
                <span className={control.risk ? "text-rose" : "text-smoke"}>{control.label}</span>
                <span>{qualityInput[control.key]}</span>
              </span>
              <input
                className="h-2 w-full accent-mint"
                max={100}
                min={0}
                onChange={(event) => updateScore(control.key, Number(event.target.value))}
                style={{ accentColor: control.tone }}
                type="range"
                value={qualityInput[control.key]}
              />
            </label>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-line bg-night p-4">
        <p className="text-sm font-semibold">Diagnostic IA</p>
        <p className="mt-2 text-sm leading-6 text-smoke">
          Le contenu est cohérent avec Paris House. Recommandation: raccourcir la scène 2 de 3 secondes avant export final. La régénération complète n'est pas nécessaire.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          className={clsx("btn-secondary", reviewState === "rejected" && "border-rose bg-rose/15 text-rose")}
          onClick={() => setReviewState("rejected")}
          type="button"
        >
          Refuser
        </button>
        <button
          className="btn-primary disabled:opacity-50"
          disabled={approvalLocked && quality.global < 60}
          onClick={() => setReviewState("approved")}
          type="button"
        >
          Valider
        </button>
      </div>
      <StepActions primary="Préparer publication" onPrimary={() => setActiveStep("publication")} />
    </Panel>
  );
}

function StudioPublicationStep({ quality }: { quality: ReturnType<typeof calculateQualityScore> }) {
  return (
    <Panel title="Étape 7: Publication" eyebrow="MVP: export ou programmation validée">
      <div className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <div className="space-y-3">
          {["Instagram Reels", "TikTok", "YouTube Shorts", "Facebook Reels"].map((platform, index) => (
            <div key={platform} className="rounded-lg border border-line bg-night p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{platform}</p>
                <span className="rounded-md border border-line px-2 py-1 text-xs text-smoke">
                  {index === 0 ? "Ready" : "Draft"}
                </span>
              </div>
              <p className="mt-2 text-sm text-smoke">
                Caption, hashtags, miniature, heure, compte et contraintes plateforme.
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <MetricCard label="Score" value={`${quality.global}`} />
          <ValidationGrid />
          <div className="rounded-lg border border-line bg-night p-4">
            <p className="text-sm font-semibold">Actions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <IconTextButton icon={CalendarDays} label="Programmer" />
              <IconTextButton icon={Download} label="Exporter seulement" />
              <IconTextButton icon={Save} label="Brouillon" />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function VideosScreen({ onNavigate }: { onNavigate: (page: StudioPage) => void }) {
  return (
    <ScreenFrame
      action={<button className="btn-primary" onClick={() => onNavigate("studio")} type="button">Créer un contenu</button>}
      eyebrow="Bibliothèque"
      title="Vidéos"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {["Marque", "Statut", "Score", "Date", "Plateforme", "Fournisseur", "Publié"].map((filter) => (
          <button key={filter} className="btn-secondary" type="button">{filter}</button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {videoLibrary.map((video) => (
          <Panel key={video.id} title={video.title} eyebrow={video.provider}>
            <div className="aspect-[9/16] max-h-72 overflow-hidden rounded-lg border border-line bg-night">
              <img alt="" className="h-full w-full object-cover" src={previewImage} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MetricCard label="Score" value={`${video.score}`} />
              <MetricCard label="Vues" value={video.views} />
              <MetricCard label="Durée" value={video.duration} />
              <MetricCard label="Plateforme" value={video.platform} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <IconTextButton icon={Eye} label="Ouvrir" />
              <IconTextButton icon={Copy} label="Dupliquer" />
              <IconTextButton icon={Download} label="Télécharger" />
            </div>
          </Panel>
        ))}
      </div>
    </ScreenFrame>
  );
}

function MusicScreen() {
  return (
    <ScreenFrame
      action={<button className="btn-primary" type="button">Ajouter musique</button>}
      eyebrow="Droits musicaux"
      title="Bibliothèque musique"
    >
      <Panel title="Musiques" eyebrow={`${musicTracks.length} pistes`}>
        <DataTable
          columns={["Titre", "Artiste", "BPM", "Ambiance", "Licence", "Statut", "Actions"]}
          rows={musicTracks.map((track) => [
            track.title,
            track.artist,
            track.bpm,
            track.mood,
            track.licenseType,
            track.approvedForUse ? "validé" : "à vérifier",
            <div key="actions" className="flex gap-2">
              <IconButton icon={Play} label="Écouter" />
              <IconButton icon={Pencil} label="Modifier" />
            </div>
          ])}
        />
      </Panel>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Panel title="Upload musique" eyebrow="Licence obligatoire">
          <div className="grid gap-3 md:grid-cols-2">
            {["Fichier", "Titre", "Artiste", "Source", "Type de licence", "Preuve", "Plateformes", "Durée autorisée", "Notes"].map((field) => (
              <InfoLine key={field} label={field} value="À renseigner" />
            ))}
          </div>
        </Panel>
        <Panel title="Blocage publication" eyebrow="Sécurité">
          <p className="text-sm leading-6 text-gold">
            Sans statut validé, une musique ne peut pas être utilisée pour publication.
          </p>
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function PublicationsScreen({ onNavigate }: { onNavigate: (page: StudioPage) => void }) {
  return (
    <ScreenFrame
      action={<button className="btn-primary" onClick={() => onNavigate("studio")} type="button">Préparer publication</button>}
      eyebrow="Suivi"
      title="Publications"
    >
      <Panel title="Liste" eyebrow="Brouillons, programmées, erreurs">
        <DataTable
          columns={["Date", "Marque", "Contenu", "Plateforme", "Statut", "Score", "Heure", "Action"]}
          rows={publicationItems.map((item) => [
            item.date,
            item.brandName,
            item.contentTitle,
            item.platform,
            item.status,
            item.score,
            item.time,
            <button key="action" className="btn-row" onClick={() => onNavigate("studio")} type="button">Ouvrir</button>
          ])}
        />
      </Panel>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {publicationItems.filter((item) => item.error).map((item) => (
          <Panel key={item.id} title="Erreur claire" eyebrow={item.platform}>
            <p className="text-sm leading-6 text-rose">{item.error}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <IconTextButton icon={RefreshCw} label="Réessayer" />
              <IconTextButton icon={Music2} label="Changer musique" />
              <IconTextButton icon={CircleHelp} label="Support" />
            </div>
          </Panel>
        ))}
      </div>
    </ScreenFrame>
  );
}

function AnalyticsScreen() {
  return (
    <ScreenFrame eyebrow="Mesure" title="Analytics">
      <MetricGrid
        stats={[
          { label: "Vues totales", value: "18.4k", detail: "7 jours" },
          { label: "Vues moyennes", value: "5.1k", detail: "par contenu" },
          { label: "Engagement", value: "8.2%", detail: "+1.1" },
          { label: "Meilleur", value: "Rain", detail: "7.8k vues" },
          { label: "Sauvegardes", value: "341", detail: "7 jours" }
        ]}
      />
      <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1fr]">
        <Panel title="Graphiques simples" eyebrow="Lecture rapide">
          <BarRows rows={[["Vues", 88], ["Abonnés", 64], ["Score vs perf", 76], ["Durée vs rétention", 82], ["Heure vs perf", 58], ["Style musical", 72]]} />
        </Panel>
        <Panel title="Lecture IA" eyebrow="Confiance limitée">
          <p className="text-sm leading-6 text-smoke">
            Les données sont encore limitées. Les contenus rooftop entre 18 et 24 secondes semblent mieux performer que les vidéos plus lentes, mais il faut plus de publications comparables.
          </p>
        </Panel>
        <Panel className="xl:col-span-2" title="Tableau contenus" eyebrow="Performance finale">
          <DataTable
            columns={["Contenu", "Plateforme", "Date", "Vues", "Likes", "Partages", "Saves", "Abonnés", "Score", "Performance"]}
            rows={analyticsRows.map((row) => [
              row.content,
              row.platform,
              row.date,
              row.views,
              row.likes,
              row.shares,
              row.saves,
              row.followers,
              row.score,
              row.performance
            ])}
          />
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function AiEngineScreen() {
  const schemaKeys = Object.keys(aiSchemas);
  const totalEstimatedAiCost = aiLogs.reduce((total, log) => total + log.estimatedCostCents, 0);

  return (
    <ScreenFrame
      action={<button className="btn-primary" type="button">Lancer un cycle mock</button>}
      eyebrow="Agents, prompts, JSON et garde-fous"
      title="Moteur IA"
    >
      <MetricGrid
        stats={[
          { label: "Agents", value: `${aiAgents.length}`, detail: "18 rôles spécialisés" },
          { label: "Phase MVP", value: "1", detail: "7 agents actifs" },
          { label: "Schemas", value: `${schemaKeys.length}`, detail: "JSON structurés" },
          { label: "Coût logs", value: money(totalEstimatedAiCost), detail: "cycle courant" },
          { label: "Autopilot", value: "Off", detail: "validation humaine" }
        ]}
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Orchestrateur" eyebrow="Plan de génération">
          <div className="space-y-3">
            {aiPlanSteps.map((step) => (
              <div key={step.id} className="rounded-lg border border-line bg-night p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="mt-1 text-xs text-smoke">{step.agentId}</p>
                  </div>
                  <AgentStatusBadge status={step.status} />
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <InfoLine label="Dépend de" value={step.dependsOn.length ? step.dependsOn.join(", ") : "départ"} />
                  <InfoLine label="Coût estimé" value={money(step.estimatedCostCents)} />
                  <InfoLine label="Validation" value={step.humanValidationRequired ? "humaine" : "auto"} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Décisions" eyebrow="Ce qui bloque ou autorise">
          <div className="space-y-3">
            {aiDecisions.map((decision) => (
              <div key={decision.id} className="rounded-lg border border-line bg-night p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{decision.decision}</p>
                  <DecisionBadge status={decision.status} />
                </div>
                <p className="mt-2 text-xs text-gold">{decision.agentId}</p>
                <p className="mt-2 text-sm leading-6 text-smoke">{decision.reason}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Panel title="Agents par phase" eyebrow="Pas de prompt unique géant">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((phase) => (
              <div key={phase} className="rounded-lg border border-line bg-night p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Phase {phase}</p>
                  <span className="text-xs text-smoke">
                    {aiAgents.filter((agent) => agent.phase === phase).length} agents
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {aiAgents
                    .filter((agent) => agent.phase === phase)
                    .map((agent) => (
                      <div key={agent.id} className="rounded-lg border border-line bg-ink p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{agent.name}</p>
                            <p className="mt-1 text-xs text-smoke">{agent.id}</p>
                          </div>
                          {agent.canBlockPublication && (
                            <span className="rounded-md border border-rose/40 bg-rose/10 px-2 py-1 text-xs text-rose">
                              gate
                            </span>
                          )}
                        </div>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-smoke">{agent.role}</p>
                        <p className="mt-2 text-xs text-mint">
                          JSON: {agent.structuredOutputRequired ? "required" : "optional"}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Prompts et schemas" eyebrow="Structured outputs">
          <div className="space-y-3">
            {aiPrompts.map((prompt) => (
              <div key={prompt.agentId} className="rounded-lg border border-line bg-night p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{prompt.agentId}</p>
                  <span className="rounded-md border border-mint/40 bg-mint/10 px-2 py-1 text-xs text-mint">
                    {prompt.outputSchemaKey}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-smoke">{prompt.systemPrompt}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {prompt.safetyNotes.map((note) => (
                    <Tag key={note}>{note}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <Panel title="Mémoire Paris House" eyebrow="Ce que l'IA doit retenir">
          <div className="grid gap-4 md:grid-cols-2">
            <MemoryList title="Winning patterns" items={brandMemory.winningPatterns} />
            <MemoryList title="Losing patterns" items={brandMemory.losingPatterns} danger />
            <MemoryList title="Règles actives" items={brandMemory.activeRules} />
            <MemoryList title="Raisons de refus" items={brandMemory.refusedContentReasons} danger />
          </div>
        </Panel>

        <Panel title="Tests IA" eyebrow="Non-régression prompts">
          <div className="space-y-3">
            {regressionCases.map((testCase) => (
              <div key={testCase.id} className="rounded-lg border border-line bg-night p-3">
                <p className="text-sm font-semibold">{testCase.title}</p>
                <p className="mt-2 text-xs leading-5 text-smoke">{testCase.contentSummary}</p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase text-mint">Attendu</p>
                    <TokenList tokens={testCase.expectedSignals} />
                  </div>
                  <div>
                    <p className="text-xs uppercase text-rose">Interdit</p>
                    <TokenList danger tokens={testCase.forbiddenSignals} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-4" title="Logs IA" eyebrow="Traçabilité">
        <DataTable
          columns={["Agent", "Modèle", "Statut", "Entrée", "Sortie", "Schema", "Coût", "Durée"]}
          rows={aiLogs.map((log) => [
            log.agentId,
            log.model,
            <AgentStatusBadge key="status" status={log.status} />,
            log.inputSummary,
            log.outputSummary,
            log.schemaKey,
            money(log.estimatedCostCents),
            `${log.durationMs} ms`
          ])}
        />
      </Panel>
    </ScreenFrame>
  );
}

function LearningsScreen() {
  return (
    <ScreenFrame eyebrow="Mémoire IA" title="Apprentissages">
      <div className="grid gap-4 md:grid-cols-2">
        {learnings.map((learning) => (
          <Panel key={learning.id} title={learning.insightType} eyebrow={`${learning.confidenceScore}% confiance`}>
            <p className="text-sm leading-6 text-smoke">{learning.insight}</p>
            <p className="mt-3 text-sm leading-6 text-champagne">{learning.recommendation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <IconTextButton icon={Check} label="Appliquer" />
              <IconTextButton icon={X} label="Ignorer" />
              <IconTextButton icon={RefreshCw} label="Tester encore" />
              <IconTextButton icon={Save} label="Transformer en règle" />
            </div>
          </Panel>
        ))}
      </div>
    </ScreenFrame>
  );
}

function CostsScreen() {
  return (
    <ScreenFrame eyebrow="Budget" title="Coûts">
      <MetricGrid
        stats={[
          { label: "Aujourd'hui", value: money(totalCost()), detail: "cycle actuel" },
          { label: "Semaine", value: "$11.20", detail: "estimé" },
          { label: "Mois", value: "$42.00", detail: "sur $150" },
          { label: "Restant", value: "$108.00", detail: "72%" },
          { label: "Moyenne", value: "$0.64", detail: "contenu" }
        ]}
      />
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Panel title="Détail fournisseur" eyebrow="Appels">
          <DataTable
            columns={["Fournisseur", "Opération", "Coût estimé", "Coût réel", "Date"]}
            rows={costs.map((cost) => [
              cost.provider,
              cost.operationType,
              money(cost.estimatedCostCents),
              cost.actualCostCents ? money(cost.actualCostCents) : "-",
              cost.createdAt.slice(0, 10)
            ])}
          />
        </Panel>
        <Panel title="Paramètres budget" eyebrow="Garde-fous">
          <div className="space-y-3">
            <InfoLine label="Workspace mensuel" value="$150" />
            <InfoLine label="Alerte 50%" value="active" />
            <InfoLine label="Alerte 80%" value="active" />
            <InfoLine label="Blocage 100%" value="active" />
            <InfoLine label="Fallback coûteux" value="non" />
          </div>
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function SocialScreen() {
  return (
    <ScreenFrame eyebrow="OAuth" title="Connexions sociales">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {socialAccounts.map((account) => (
          <Panel key={account.id} title={account.platform} eyebrow={account.status}>
            <div className="space-y-3">
              <InfoLine label="Compte" value={account.accountName} />
              <InfoLine label="Permissions" value={account.permissions.length ? account.permissions.join(", ") : "Aucune"} />
              <InfoLine label="Expiration" value={account.tokenExpiresAt ?? "Non connecté"} />
              <InfoLine label="Dernière erreur" value={account.status === "needs_reauth" ? "Reconnexion Meta nécessaire" : "-"} />
              <div className="flex flex-wrap gap-2">
                <IconTextButton icon={ShieldCheck} label={account.status === "not_connected" ? "Connecter" : "Reconnecter"} />
                <IconTextButton icon={Check} label="Vérifier permissions" />
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <Panel className="mt-4" title="Permissions" eyebrow="Explication">
        <p className="text-sm leading-6 text-smoke">
          Instagram nécessite une connexion Meta compatible pour publier des Reels depuis l'application. Les tokens seront chiffrés côté serveur.
        </p>
      </Panel>
    </ScreenFrame>
  );
}

function SettingsScreen({
  approvalLocked,
  automationLevel,
  setApprovalLocked,
  setAutomationLevel
}: {
  approvalLocked: boolean;
  automationLevel: AutomationLevel;
  setApprovalLocked: (locked: boolean) => void;
  setAutomationLevel: (level: AutomationLevel) => void;
}) {
  return (
    <ScreenFrame eyebrow="Configuration" title="Réglages">
      <div className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <Panel title="API keys" eyebrow="Serveur uniquement">
          <DataTable
            columns={["Provider", "Clé", "Statut", "Dernier test", "Actions"]}
            rows={apiKeys.map((key) => [
              key.provider,
              key.maskedKey,
              key.status,
              key.lastChecked,
              <div key="actions" className="flex gap-2">
                <IconButton icon={KeyRound} label="Tester" />
                <IconButton icon={Trash2} label="Supprimer" />
              </div>
            ])}
          />
        </Panel>
        <Panel title="Automatisation" eyebrow="Par défaut MVP">
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-1">
              {automationLevels.map((level) => (
                <button
                  key={level}
                  className={clsx(
                    "h-10 rounded-md border text-sm",
                    automationLevel === level ? "border-mint bg-mint text-night" : "border-line bg-night text-smoke"
                  )}
                  onClick={() => setAutomationLevel(level)}
                  type="button"
                >
                  {level}
                </button>
              ))}
            </div>
            <Toggle label="Génération automatique" checked />
            <Toggle label="Publication automatique" checked={false} />
            <label className="flex items-center justify-between rounded-lg border border-line bg-night p-3 text-sm">
              <span>Validation humaine</span>
              <input
                checked={approvalLocked}
                className="h-4 w-4 accent-mint"
                onChange={(event) => setApprovalLocked(event.target.checked)}
                type="checkbox"
              />
            </label>
            <InfoLine label="Seuil score minimum" value="75" />
            <InfoLine label="Budget maximum contenu" value="$3.00" />
          </div>
        </Panel>
        <Panel className="xl:col-span-2" title="Sections" eyebrow="Workspace">
          <div className="grid gap-3 md:grid-cols-4">
            {["Workspace", "Utilisateurs", "Rôles", "Facturation future", "Sécurité", "Stockage", "Notifications", "Suppression données"].map((section) => (
              <button key={section} className="rounded-lg border border-line bg-night p-3 text-left text-sm text-smoke hover:border-gold hover:text-champagne" type="button">
                {section}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </ScreenFrame>
  );
}

function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={clsx(
        "fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-line bg-ink p-4 shadow-panel transition-transform",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-smoke">Assistant IA</p>
          <h3 className="mt-1 text-lg font-semibold">Actions rapides</h3>
        </div>
        <button className="icon-btn" onClick={onClose} title="Fermer" type="button">
          <X size={17} />
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {[
          "Trouve une idée pour demain",
          "Améliore ce hook",
          "Explique pourquoi cette vidéo est faible",
          "Propose 5 variantes",
          "Adapte pour TikTok",
          "Réduis à 20 secondes"
        ].map((prompt) => (
          <button key={prompt} className="w-full rounded-lg border border-line bg-night p-3 text-left text-sm text-smoke hover:border-mint hover:text-champagne" type="button">
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScreenFrame({
  action,
  children,
  eyebrow,
  title
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase text-smoke">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal md:text-3xl">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Panel({
  children,
  className,
  eyebrow,
  title
}: {
  children: React.ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
}) {
  return (
    <section className={clsx("rounded-lg border border-line bg-ink/88 p-4 shadow-panel", className)}>
      {(title || eyebrow) && (
        <div className="mb-4">
          {eyebrow && <p className="text-xs uppercase text-smoke">{eyebrow}</p>}
          {title && <h3 className="mt-1 text-lg font-semibold">{title}</h3>}
        </div>
      )}
      {children}
    </section>
  );
}

function MetricGrid({ stats }: { stats: Array<{ label: string; value: string; detail: string }> }) {
  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <MetricCard key={stat.label} detail={stat.detail} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}

function MetricCard({ detail, label, value }: { detail?: string; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-night p-3">
      <p className="text-xs text-smoke">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
      {detail && <p className="mt-1 text-xs text-smoke">{detail}</p>}
    </div>
  );
}

function ActionRow({
  action,
  detail,
  onClick,
  status,
  title
}: {
  action: string;
  detail: string;
  onClick: () => void;
  status: DashboardTaskStatus;
  title: string;
}) {
  return (
    <div className="grid gap-3 rounded-lg border border-line bg-night p-3 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold">{title}</p>
          <TaskBadge status={status} />
        </div>
        <p className="mt-1 text-sm leading-6 text-smoke">{detail}</p>
      </div>
      <button className="btn-row" onClick={onClick} type="button">
        {action}
      </button>
    </div>
  );
}

type DashboardTaskStatus = ContentLifecycleStatus | "music_unverified" | "token_expiring";

function TaskBadge({ status }: { status: DashboardTaskStatus }) {
  if (status === "music_unverified") {
    return <span className="badge border-gold/40 bg-gold/12 text-gold">musique</span>;
  }
  if (status === "token_expiring") {
    return <span className="badge border-rose/40 bg-rose/12 text-rose">token</span>;
  }
  return <StatusBadge status={status} />;
}

function StatusBadge({ status }: { status: ContentLifecycleStatus }) {
  return <span className={clsx("badge", statusStyles[status])}>{statusLabels[status]}</span>;
}

function AgentStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "badge capitalize",
        status === "complete" && "border-mint/40 bg-mint/12 text-mint",
        status === "running" && "border-gold/40 bg-gold/12 text-gold",
        status === "queued" && "border-line bg-line/50 text-smoke",
        status === "needs_human_validation" && "border-gold/40 bg-gold/12 text-gold",
        status === "blocked" && "border-rose/40 bg-rose/12 text-rose",
        status === "failed" && "border-rose/40 bg-rose/12 text-rose",
        status === "skipped" && "border-line bg-night text-smoke"
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function DecisionBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "badge",
        status === "accepted" && "border-mint/40 bg-mint/12 text-mint",
        status === "needs_human_validation" && "border-gold/40 bg-gold/12 text-gold",
        status === "blocked" && "border-rose/40 bg-rose/12 text-rose",
        status === "retry" && "border-[#8fd3ff]/40 bg-[#8fd3ff]/12 text-[#8fd3ff]"
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function MemoryList({
  danger,
  items,
  title
}: {
  danger?: boolean;
  items: string[];
  title: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-night p-3">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Tag key={item} danger={danger ?? false}>
            {item}
          </Tag>
        ))}
      </div>
    </div>
  );
}

function CalendarStrip({ onNavigate }: { onNavigate: (page: StudioPage) => void }) {
  return (
    <div className="studio-scrollbar grid auto-cols-[13rem] grid-flow-col gap-3 overflow-x-auto pb-1">
      {calendarItems.map((item) => (
        <button
          key={item.id}
          className="rounded-lg border border-line bg-night p-3 text-left hover:border-gold"
          onClick={() => onNavigate("studio")}
          type="button"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{item.day}</p>
              <p className="text-xs text-smoke">{item.date}</p>
            </div>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-3 line-clamp-2 text-sm">{item.title}</p>
          <p className="mt-2 text-xs text-smoke">{item.platform} · {item.time} · score {item.score}</p>
        </button>
      ))}
    </div>
  );
}

function VideoPreview({ qualityGlobal }: { qualityGlobal: number }) {
  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[23rem] overflow-hidden rounded-lg border border-line bg-night">
      <img alt="Paris skyline at blue hour" className="h-full w-full object-cover" src={previewImage} />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/18 to-transparent" />
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
        <span className="rounded-md bg-night/78 px-2 py-1 text-xs text-champagne">9:16 Reel</span>
        <span className="rounded-md bg-mint px-2 py-1 text-xs font-semibold text-night">{qualityGlobal}</span>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <p className="max-w-[14rem] text-3xl font-semibold leading-tight">Paris sounds different after midnight.</p>
        <div className="mt-4 flex items-center gap-2">
          <button className="icon-btn bg-champagne text-night" title="Play preview" type="button">
            <Play size={18} />
          </button>
          <div className="h-1 flex-1 rounded-full bg-champagne/25">
            <div className="h-full w-2/3 rounded-full bg-gold" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ color, label, width }: { color: string; label: string; width: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-smoke">
        <span>{label}</span>
        <span>{width}</span>
      </div>
      <div className="h-3 rounded-full bg-night">
        <div className={clsx("h-full rounded-full", color)} style={{ width }} />
      </div>
    </div>
  );
}

function ValidationGrid() {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {validationChecklist.map((item) => (
        <div key={item.label} className="flex items-center gap-2 rounded-lg border border-line bg-night p-2 text-xs">
          {item.complete ? <Check className="text-mint" size={14} /> : <AlertTriangle className="text-gold" size={14} />}
          <span className={item.complete ? "text-smoke" : "text-gold"}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function ScoreComparison() {
  return (
    <div className="space-y-3">
      {[
        ["Viral", 82],
        ["Production", 76],
        ["Brand fit", 94],
        ["Originalité", 78],
        ["Copyright", 88],
        ["Factuel", 92]
      ].map(([label, value]) => (
        <BarRow key={label as string} label={label as string} value={value as number} />
      ))}
    </div>
  );
}

function BarRows({ rows }: { rows: Array<[string, number]> }) {
  return (
    <div className="space-y-3">
      {rows.map(([label, value]) => (
        <BarRow key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function BarRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-smoke">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-night">
        <div className="h-full rounded-full bg-mint" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DataTable({
  columns,
  rows
}: {
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <div className="studio-scrollbar overflow-x-auto">
      <table className="w-full min-w-[48rem] border-separate border-spacing-y-2 text-left text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-3 py-2 text-xs font-medium uppercase text-smoke">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-night">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border-y border-line px-3 py-3 first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-night p-3">
      <p className="text-xs uppercase text-smoke">{label}</p>
      <p className="mt-2 text-sm leading-6">{value}</p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-night p-3">
      <p className="text-xs text-smoke">{label}</p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  );
}

function TokenList({ danger, tokens }: { danger?: boolean; tokens: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token) => (
        <Tag key={token} danger={danger ?? false}>{token}</Tag>
      ))}
    </div>
  );
}

function Tag({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <span className={clsx("rounded-md border px-2 py-1 text-xs", danger ? "border-rose/40 bg-rose/10 text-rose" : "border-line bg-night text-smoke")}>
      {children}
    </span>
  );
}

function IconButton({
  icon: Icon,
  label,
  success
}: {
  icon: React.ElementType;
  label: string;
  success?: boolean;
}) {
  return (
    <button
      className={clsx("icon-btn", success && "text-mint")}
      title={label}
      type="button"
    >
      <Icon size={17} />
    </button>
  );
}

function IconTextButton({
  icon: Icon,
  label,
  tone
}: {
  icon: React.ElementType;
  label: string;
  tone?: "danger";
}) {
  return (
    <button
      className={clsx("btn-secondary", tone === "danger" && "border-rose/40 text-rose hover:border-rose")}
      type="button"
    >
      <Icon size={15} />
      <span>{label}</span>
    </button>
  );
}

function StepActions({ onPrimary, primary }: { onPrimary: () => void; primary: string }) {
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <IconTextButton icon={Pencil} label="Modifier" />
      <IconTextButton icon={RefreshCw} label="Régénérer" />
      <button className="btn-primary" onClick={onPrimary} type="button">
        {primary}
      </button>
    </div>
  );
}

function Toggle({ checked, label }: { checked: boolean; label: string }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-line bg-night p-3 text-sm">
      <span>{label}</span>
      <input checked={checked} className="h-4 w-4 accent-mint" readOnly type="checkbox" />
    </label>
  );
}
