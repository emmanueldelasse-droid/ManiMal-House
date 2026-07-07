"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  BarChart3,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  Clapperboard,
  Clock3,
  Download,
  Gauge,
  LayoutDashboard,
  Library,
  Lightbulb,
  LockKeyhole,
  Music2,
  Pause,
  Play,
  PlugZap,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Tags,
  Upload,
  WalletCards,
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
  brand,
  costs,
  ideas,
  initialQualityInput,
  learnings,
  musicTracks,
  previewImage,
  project,
  socialAccounts,
  workflow
} from "@/data/studio-data";

type ReviewState = "waiting" | "approved" | "rejected";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Brands", icon: Tags },
  { label: "Calendar", icon: CalendarDays },
  { label: "Ideas", icon: Lightbulb },
  { label: "Creation Studio", icon: Clapperboard },
  { label: "Video Library", icon: Library },
  { label: "Music", icon: Music2 },
  { label: "Publications", icon: Send },
  { label: "Analytics", icon: BarChart3 },
  { label: "AI Learnings", icon: Brain },
  { label: "Costs", icon: WalletCards },
  { label: "Settings", icon: Settings },
  { label: "Social", icon: PlugZap }
];

const scoreControls: Array<{
  key: keyof QualityScoreInput;
  label: string;
  tone: string;
  risk?: boolean;
}> = [
  { key: "hook", label: "Hook", tone: "#35d0ba" },
  { key: "visual", label: "Visual", tone: "#c7a45a" },
  { key: "rhythm", label: "Rhythm", tone: "#ed4d6e" },
  { key: "brandFit", label: "Brand fit", tone: "#f5f0e6" },
  { key: "originality", label: "Originality", tone: "#8fd3ff" },
  { key: "retention", label: "Retention", tone: "#35d0ba" },
  { key: "share", label: "Share", tone: "#c7a45a" },
  { key: "save", label: "Save", tone: "#ed4d6e" },
  { key: "copyrightRisk", label: "Copyright risk", tone: "#ff9f43", risk: true },
  { key: "factualRisk", label: "Factual risk", tone: "#ff6b6b", risk: true }
];

const automationLevels: AutomationLevel[] = [0, 1, 2, 3, 4];

function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(cents / 100);
}

function selectedIdeaOrFirst(selectedIdeaId: string): ContentIdea {
  return ideas.find((idea) => idea.id === selectedIdeaId) ?? ideas[0]!;
}

export function StudioShell() {
  const [selectedIdeaId, setSelectedIdeaId] = useState(ideas[0]!.id);
  const [qualityInput, setQualityInput] = useState<QualityScoreInput>(initialQualityInput);
  const [automationLevel, setAutomationLevel] = useState<AutomationLevel>(brand.automationLevel);
  const [approvalLocked, setApprovalLocked] = useState(true);
  const [reviewState, setReviewState] = useState<ReviewState>("waiting");

  const selectedIdea = selectedIdeaOrFirst(selectedIdeaId);
  const quality = useMemo(() => calculateQualityScore(qualityInput), [qualityInput]);
  const totalEstimatedCost = costs.reduce((total, cost) => total + cost.estimatedCostCents, 0);
  const approvedTrackCount = musicTracks.filter((track) => track.approvedForUse).length;

  function updateScore(key: keyof QualityScoreInput, value: number) {
    setQualityInput((current) => ({
      ...current,
      [key]: value
    }));
  }

  return (
    <main className="min-h-screen overflow-hidden text-champagne">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-line bg-night/92 p-4 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div>
              <div className="flex items-center gap-2 text-sm text-gold">
                <Sparkles size={16} />
                <span>Creator AI Studio</span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold leading-tight">Paris House</h1>
            </div>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-ink text-champagne lg:hidden"
              title="Open workspace menu"
              type="button"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          <nav className="studio-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1 lg:block lg:overflow-visible lg:pb-0">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.label === "Creation Studio";

              return (
                <button
                  key={item.label}
                  className={clsx(
                    "mb-0 inline-flex h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-sm transition lg:mb-1 lg:flex lg:w-full",
                    active
                      ? "border border-gold/60 bg-gold/15 text-champagne"
                      : "border border-transparent text-smoke hover:border-line hover:bg-ink hover:text-champagne"
                  )}
                  type="button"
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 hidden rounded-lg border border-line bg-ink p-4 lg:block">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-smoke">Automation</p>
                <p className="mt-1 text-sm font-medium">Level {automationLevel}</p>
              </div>
              <ShieldCheck className="text-mint" size={20} />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-1">
              {automationLevels.map((level) => (
                <button
                  key={level}
                  className={clsx(
                    "h-9 rounded-md border text-sm",
                    automationLevel === level
                      ? "border-mint bg-mint text-night"
                      : "border-line bg-night text-smoke hover:text-champagne"
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
              <span>Human approval lock</span>
            </label>
          </div>
        </aside>

        <section className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-20 border-b border-line bg-night/88 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-smoke">
                  <span>{brand.city}</span>
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  <span>{brand.niche}</span>
                </div>
                <h2 className="mt-1 text-xl font-semibold">Daily content review</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-ink px-3 text-sm text-champagne hover:border-gold"
                  title="Generate fresh ideas"
                  type="button"
                >
                  <RefreshCw size={16} />
                  <span>Generate</span>
                </button>
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-ink px-3 text-sm text-champagne hover:border-gold"
                  title="Upload a source asset"
                  type="button"
                >
                  <Upload size={16} />
                  <span>Upload</span>
                </button>
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-gold px-3 text-sm font-semibold text-night hover:bg-champagne"
                  title="Export final vertical MP4"
                  type="button"
                >
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </header>

          <div className="grid gap-4 p-4 md:p-6 xl:grid-cols-[minmax(16rem,0.75fr)_minmax(22rem,1.05fr)_minmax(18rem,0.85fr)]">
            <section className="space-y-4">
              <div className="rounded-lg border border-line bg-ink/88 p-4 shadow-panel">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-smoke">Brand system</p>
                    <h3 className="mt-1 text-lg font-semibold">{brand.name}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold text-night">
                    <Music2 size={20} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <Metric label="Frequency" value="1/day" />
                  <Metric label="Language" value={brand.language.toUpperCase()} />
                  <Metric label="Ideas" value={`${ideas.length}`} />
                  <Metric label="Music rights" value={`${approvedTrackCount}/${musicTracks.length}`} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {brand.tone.map((tone) => (
                    <span
                      key={tone}
                      className="rounded-md border border-line bg-night px-2 py-1 text-xs text-smoke"
                    >
                      {tone}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-line bg-ink/88 p-4 shadow-panel">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-smoke">Idea queue</p>
                    <h3 className="mt-1 text-lg font-semibold">5 concept target</h3>
                  </div>
                  <Lightbulb className="text-gold" size={20} />
                </div>

                <div className="space-y-2">
                  {ideas.map((idea) => (
                    <button
                      key={idea.id}
                      className={clsx(
                        "w-full rounded-lg border p-3 text-left transition",
                        selectedIdea.id === idea.id
                          ? "border-mint bg-mint/10"
                          : "border-line bg-night/72 hover:border-gold"
                      )}
                      onClick={() => setSelectedIdeaId(idea.id)}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{idea.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-smoke">{idea.hook}</p>
                        </div>
                        <span
                          className={clsx(
                            "rounded-md px-2 py-1 text-xs font-semibold",
                            idea.potentialScore >= 85 ? "bg-mint text-night" : "bg-gold/18 text-gold"
                          )}
                        >
                          {idea.potentialScore}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-line bg-ink/88 p-4 shadow-panel">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-smoke">Workflow</p>
                    <h3 className="mt-1 text-lg font-semibold">Today</h3>
                  </div>
                  <Clock3 className="text-mint" size={20} />
                </div>
                <div className="mt-4 space-y-3">
                  {workflow.map((stage) => (
                    <div key={stage.id} className="grid grid-cols-[4rem_1fr_auto] items-center gap-3">
                      <span className="text-xs text-smoke">{stage.scheduledAt}</span>
                      <span className="text-sm">{stage.label}</span>
                      <StageBadge status={stage.status} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="rounded-lg border border-line bg-ink/88 p-4 shadow-panel">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-smoke">Selected hypothesis</p>
                    <h3 className="mt-1 text-2xl font-semibold leading-tight">{selectedIdea.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-smoke">{selectedIdea.concept}</p>
                  </div>
                  <div className="rounded-lg border border-line bg-night px-3 py-2 text-right">
                    <p className="text-xs text-smoke">Duration</p>
                    <p className="text-lg font-semibold">{selectedIdea.estimatedDurationSeconds}s</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(16rem,0.88fr)_1fr]">
                  <div className="relative mx-auto aspect-[9/16] w-full max-w-[23rem] overflow-hidden rounded-lg border border-line bg-night">
                    <img
                      alt="Paris skyline at blue hour"
                      className="h-full w-full object-cover"
                      src={previewImage}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night via-night/18 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                      <span className="rounded-md bg-night/78 px-2 py-1 text-xs text-champagne">
                        9:16 Reel
                      </span>
                      <span className="rounded-md bg-mint px-2 py-1 text-xs font-semibold text-night">
                        {quality.global}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="max-w-[14rem] text-3xl font-semibold leading-tight">
                        {selectedIdea.hook}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-champagne text-night"
                          title="Play preview"
                          type="button"
                        >
                          <Play size={18} />
                        </button>
                        <button
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-champagne/40 bg-night/62 text-champagne"
                          title="Pause preview"
                          type="button"
                        >
                          <Pause size={18} />
                        </button>
                        <div className="h-1 flex-1 rounded-full bg-champagne/25">
                          <div className="h-full w-2/3 rounded-full bg-gold" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <InfoBlock label="Angle" value={selectedIdea.angle} />
                    <InfoBlock label="Visual style" value={selectedIdea.visualStyle} />
                    <InfoBlock label="Music style" value={selectedIdea.musicStyle} />
                    <InfoBlock label="Why selected" value={selectedIdea.justification} />

                    <div className="rounded-lg border border-line bg-night p-3">
                      <p className="text-xs uppercase text-smoke">Caption</p>
                      <p className="mt-2 text-sm">{project.caption}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.hashtags.map((hashtag) => (
                          <span key={hashtag} className="text-xs text-mint">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-line bg-ink/88 p-4 shadow-panel">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-smoke">Storyboard</p>
                    <h3 className="mt-1 text-lg font-semibold">3 scenes</h3>
                  </div>
                  <Clapperboard className="text-rose" size={20} />
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {project.storyboard.map((scene) => (
                    <article key={scene.id} className="rounded-lg border border-line bg-night p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-smoke">Scene {scene.order}</span>
                        <span className="text-xs text-gold">{scene.durationSeconds}s</span>
                      </div>
                      <p className="mt-3 text-sm font-medium">{scene.onScreenText}</p>
                      <p className="mt-2 line-clamp-4 text-xs leading-5 text-smoke">{scene.visualPrompt}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="rounded-lg border border-line bg-ink/88 p-4 shadow-panel">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-smoke">Quality gate</p>
                    <h3 className="mt-1 text-lg font-semibold">{formatRecommendation(quality.recommendation)}</h3>
                  </div>
                  <Gauge className="text-mint" size={22} />
                </div>

                <div className="mt-4 rounded-lg border border-line bg-night p-4 text-center">
                  <p className="text-5xl font-semibold">{quality.global}</p>
                  <p className="mt-1 text-xs uppercase text-smoke">Global score</p>
                </div>

                <div className="mt-4 space-y-3">
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

                {quality.blockers.length > 0 ? (
                  <div className="mt-4 rounded-lg border border-rose/40 bg-rose/10 p-3">
                    {quality.blockers.map((blocker) => (
                      <p key={blocker} className="text-xs leading-5 text-rose">
                        {blocker}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg border border-mint/40 bg-mint/10 p-3 text-xs text-mint">
                    No blocking risk detected.
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    className={clsx(
                      "inline-flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-semibold",
                      reviewState === "rejected"
                        ? "border-rose bg-rose text-night"
                        : "border-line bg-night text-rose hover:border-rose"
                    )}
                    onClick={() => setReviewState("rejected")}
                    type="button"
                  >
                    <X size={16} />
                    <span>Refuse</span>
                  </button>
                  <button
                    className={clsx(
                      "inline-flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold",
                      reviewState === "approved"
                        ? "bg-mint text-night"
                        : "bg-gold text-night hover:bg-champagne"
                    )}
                    disabled={approvalLocked && quality.blockers.length > 0}
                    onClick={() => setReviewState("approved")}
                    type="button"
                  >
                    <Check size={16} />
                    <span>Approve</span>
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-smoke">
                  <LockKeyhole size={14} />
                  <span>
                    {approvalLocked
                      ? `Review status: ${reviewState}`
                      : "Approval lock disabled for local testing"}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-line bg-ink/88 p-4 shadow-panel">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-smoke">Costs</p>
                    <h3 className="mt-1 text-lg font-semibold">{money(totalEstimatedCost)}</h3>
                  </div>
                  <WalletCards className="text-gold" size={20} />
                </div>
                <div className="mt-4 space-y-2">
                  {costs.map((cost) => (
                    <div key={cost.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-smoke">{cost.operationType}</span>
                      <span>{money(cost.estimatedCostCents)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-line bg-ink/88 p-4 shadow-panel">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-smoke">Connections</p>
                    <h3 className="mt-1 text-lg font-semibold">Social accounts</h3>
                  </div>
                  <PlugZap className="text-mint" size={20} />
                </div>
                <div className="mt-4 space-y-2">
                  {socialAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-night p-3">
                      <div>
                        <p className="text-sm font-medium capitalize">{account.platform}</p>
                        <p className="text-xs text-smoke">{account.accountName}</p>
                      </div>
                      <span
                        className={clsx(
                          "rounded-md px-2 py-1 text-xs",
                          account.status === "connected"
                            ? "bg-mint text-night"
                            : account.status === "needs_reauth"
                              ? "bg-gold/18 text-gold"
                              : "bg-line text-smoke"
                        )}
                      >
                        {account.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-line bg-ink/88 p-4 shadow-panel">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-smoke">Learnings</p>
                    <h3 className="mt-1 text-lg font-semibold">Actionable memory</h3>
                  </div>
                  <Brain className="text-rose" size={20} />
                </div>
                <div className="mt-4 space-y-3">
                  {learnings.map((learning) => (
                    <div key={learning.id} className="rounded-lg border border-line bg-night p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{learning.insightType}</p>
                        <span className="text-xs text-gold">{learning.confidenceScore}%</span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-smoke">{learning.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-night p-3">
      <p className="text-xs text-smoke">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
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

function StageBadge({ status }: { status: (typeof workflow)[number]["status"] }) {
  const label = status.replace("_", " ");
  return (
    <span
      className={clsx(
        "rounded-md px-2 py-1 text-xs capitalize",
        status === "complete" && "bg-mint text-night",
        status === "running" && "bg-gold/18 text-gold",
        status === "needs_review" && "bg-rose/18 text-rose",
        status === "queued" && "bg-line text-smoke",
        status === "blocked" && "bg-rose text-night"
      )}
    >
      {label}
    </span>
  );
}
