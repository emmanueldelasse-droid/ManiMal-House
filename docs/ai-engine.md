# AI Engine Tome 3

Creator AI Studio treats the AI layer as a creative team, not as one large prompt.

Every content cycle follows:

```txt
Brand -> Context -> Trend -> Idea -> Hook -> Script -> Storyboard -> Assets -> Edit -> Score -> Validation -> Publication -> Performance -> Learning
```

Each content output must keep:

- intention
- hypothesis
- target audience
- angle
- score
- justification
- traceability

## Agent architecture

The engine defines 18 specialized agents in `packages/shared/src/ai-engine.ts`:

- Brand Strategist Agent
- Trend Research Agent
- Idea Generation Agent
- Hook Agent
- Script Agent
- Storyboard Agent
- Prompt Engineering Agent
- Music Matching Agent
- Voice Agent
- Editing Recommendation Agent
- Quality Scoring Agent
- Copyright Risk Agent
- Factual Verification Agent
- Platform Adaptation Agent
- Publishing Recommendation Agent
- Analytics Agent
- Learning Agent
- Cost Control Agent

No agent should do everything. Each agent has explicit inputs, outputs, phase, publication blocking power, and structured-output requirement.

## MVP phases

Phase 1 ships:

- Brand Strategist
- Idea Generation
- Hook
- Script
- Storyboard
- Quality Scoring
- Cost Control

Phase 2 adds:

- Prompt Engineering
- Music Matching
- Voice
- Editing Recommendation
- Copyright Risk

Phase 3 adds:

- Trend Research
- Factual Verification
- Platform Adaptation
- Publishing Recommendation

Phase 4 adds:

- Analytics
- Learning
- advanced Brand Memory

## Structured outputs

System-dependent AI outputs must be JSON, not free text. The shared package includes schemas for:

- brand brief
- trends
- ideas
- hooks
- script
- storyboard
- prompt engineering
- music match
- voice recommendation
- editing plan
- quality score
- risk check
- factual verification
- platform adaptation
- publishing recommendation
- analytics summary
- learning
- cost check

The API exposes `validateStructuredOutput` as a lightweight first guard for required top-level fields. A production implementation should replace that with full JSON Schema validation.

## Orchestrator

`apps/api/src/modules/ai-orchestrator.ts` creates an MVP generation plan, applies runtime gates, and returns:

- generation plan
- called agents
- decisions
- AI logs

The orchestrator blocks expensive video generation unless:

- idea is validated
- script is validated
- budget is available
- provider is available
- quality and risk are acceptable

## Human control

Human validation is mandatory for:

- first publication of a brand
- content below score 85
- medium or higher risk
- costly provider fallback
- real publication
- newly added music
- real event mentions
- autopilot activation

The MVP keeps autopilot disabled.

## Paris House memory

The shared package stores initial Paris House memory:

- winning patterns
- losing patterns
- active rules
- refused content reasons
- validated learnings

Learning agents must distinguish correlation, hypothesis, and conclusion. A weak signal must stay a hypothesis.

## Anti-hallucination rules

The engine must not invent:

- events
- lineups
- DJs
- prices
- dates
- venues
- weather
- rankings
- statistics
- quotes

If a fact is not verified, the agent should mark it as unverified or rewrite it as a neutral mood-based line.

## Tests

The shared package includes AI regression cases covering:

- good Paris House content
- copyright risk
- factual hallucination
- generic content

Recommended test layers:

- prompt unit tests for JSON shape and required fields
- quality tests with good and bad content examples
- non-regression tests when prompts change
- hallucination checks for event, date, venue, DJ, and pricing claims
- cost-control tests before video generation

## Logs

Each AI call should record:

- agent
- model
- input summary
- output summary
- schema
- estimated cost
- duration
- status
- error
- content project
- user
- timestamp
