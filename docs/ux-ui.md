# UX/UI Tome 2

This document captures the implemented UX direction for Creator AI Studio.

## Product feeling

The app should feel like a premium creative studio, not a technical factory. The user sees brands, ideas, videos, scores, decisions, and publication readiness. Provider details, job logs, and API complexity stay secondary.

## Navigation

Desktop uses a left sidebar:

- Dashboard
- Marques
- Calendrier
- Idées
- Studio
- Bibliothèque vidéo
- Bibliothèque musique
- Publications
- Analytics
- Apprentissages IA
- Coûts
- Connexions sociales
- Réglages

Mobile uses a bottom bar:

- Dashboard
- Marques
- Studio
- Publications
- Plus

The top bar always exposes workspace, active brand, budget status, create actions, AI assistant, notifications, and profile access.

## MVP screens implemented

- Onboarding with the Paris House preset
- Dashboard with today tasks, performance, AI recommendation, budget, and weekly calendar
- Brands with creation fields and detail tabs
- Brand identity with positioning, tone, approved wording, forbidden wording, and visual style
- Editorial calendar with weekly strip, list view, and AI slot recommendation
- Ideas with filters, cards, scoring, selection, and comparison
- Creation Studio with seven steps: idea, script, storyboard, assets, edit, score, publication
- Video library with filters and reusable content cards
- Music library with license status and upload fields
- Publications with clear error messages
- Analytics with simple charts, table, and AI interpretation
- AI learnings with actions
- Costs with provider detail and budget guardrails
- Social connections with OAuth status and permission explanation
- Settings with masked API keys and automation defaults

## Studio behavior

The studio keeps the central workflow visible:

```txt
Idée -> Script -> Storyboard -> Assets -> Montage -> Score -> Publication
```

The right assistant panel gives the next action, cost estimate, and automation controls. The MVP keeps human validation mandatory and uses export-only or validated scheduling by default.

## Status system

Official content states:

- Idée
- Script généré
- Storyboard prêt
- Assets en cours
- Assets prêts
- Montage en cours
- Montage prêt
- Score calculé
- À valider
- Validé
- Programmé
- Publié
- Erreur
- Archivé

Each status has a label, visual treatment, and implied next action in the interface.

## Validation checklist

Before publication, the UI tracks:

- correct 9:16 format
- readable video
- audio present
- approved music rights
- score above threshold
- caption ready
- clean hashtags
- connected account
- no blocking factual claim
- user approval

Blocking items disable or discourage publication-oriented actions.

## Paris House preset

Default tone:

- premium
- mysterious
- short
- bilingual French/English

Default visuals:

- Paris by night
- rooftops
- Seine
- rain
- neons
- silhouettes
- clubs
- golden light

Default music:

- deep house
- afro house
- melodic house
- chill house
- light tech house

Default hooks:

- Paris sounds different after midnight.
- Tonight feels like this.
- House music under city lights.
- Somewhere above Paris.
- The night starts here.

## MVP UX priorities

The current prototype prioritizes:

- understanding content state in under five seconds
- creating or selecting an idea quickly
- validating a video from the studio
- seeing estimated cost before generation
- refusing without losing work
- regenerating only part of the workflow
- tracking music rights
- explaining AI recommendations clearly
