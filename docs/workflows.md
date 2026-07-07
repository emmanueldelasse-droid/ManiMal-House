# Workflows

## MVP daily cycle

```txt
08:00 trend research
08:15 idea generation
08:30 idea scoring
09:00 storyboard generation
09:30 optional asset generation or manual upload
10:30 edit assembly
11:00 quality scoring
11:30 human review
18:30 manual publication or scheduled draft
```

All times are workspace configurable.

## Draft lifecycle

```txt
idea -> scripted -> assets_pending -> assets_generated -> edited -> quality_checked -> needs_review -> approved
```

The MVP can stop at `approved` and provide a manual export. Direct publication comes later.

## Quality gate

The initial global score uses:

- 20 percent Hook
- 15 percent Visual
- 15 percent Rhythm
- 15 percent Brand Fit
- 10 percent Originality
- 10 percent Retention
- 5 percent Share
- 5 percent Save
- minus 5 percent Copyright Risk
- minus 5 percent Factual Risk

Thresholds:

- 85 to 100: publication recommended
- 75 to 84: human review required
- 60 to 74: improvement recommended
- below 60: do not publish

## Music rights

No music track can be used in a final export unless `approvedForUse` is true and the source/license note is stored.
