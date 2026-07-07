# API Notes

The MVP currently ships an API skeleton rather than a running HTTP server. Add REST, tRPC, or NestJS routes around the services in `apps/api/src` when persistence and real provider calls are introduced.

## Suggested routes

```txt
GET    /health
GET    /workspaces/:workspaceId/brands
POST   /workspaces/:workspaceId/brands
GET    /brands/:brandId/ideas
POST   /brands/:brandId/ideas/generate
POST   /content-projects/:projectId/storyboard
POST   /content-projects/:projectId/assets/upload
POST   /content-projects/:projectId/edit
POST   /content-projects/:projectId/score
POST   /content-projects/:projectId/approve
POST   /content-projects/:projectId/reject
GET    /content-projects/:projectId/costs
GET    /content-projects/:projectId/audit-log
```

## Job names

```txt
trend_research_job
idea_generation_job
storyboard_generation_job
video_generation_job
voice_generation_job
music_matching_job
editing_job
quality_scoring_job
publishing_job
analytics_sync_job
learning_job
```

## Human review rule

The first implementation should only produce drafts and exports. Publication requires explicit editor approval.
