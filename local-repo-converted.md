Selected Files Directory Structure:

└── ./
    └── SIH-2026
        ├── backend-ml
        │   ├── helpers
        │   │   └── help.py
        │   ├── main.py
        │   └── requirements.txt
        ├── backend
        │   ├── api
        │   │   └── [...path].ts
        │   ├── server
        │   │   ├── data
        │   │   │   └── historicalDisasters.ts
        │   │   ├── lib
        │   │   │   ├── dateFormat.ts
        │   │   │   ├── evidenceUtils.ts
        │   │   │   ├── moderation.ts
        │   │   │   ├── relevanceEngine.ts
        │   │   │   └── translate.ts
        │   │   ├── types
        │   │   │   ├── disaster.ts
        │   │   │   └── language.ts
        │   │   ├── aiGateway.ts
        │   │   ├── app.ts
        │   │   ├── googleNews.ts
        │   │   ├── routes.ts
        │   │   └── sachet.ts
        │   ├── tests
        │   │   ├── archiveEraDiscovery.test.ts
        │   │   ├── citationValidation.test.ts
        │   │   ├── eventSourceRelevance.test.ts
        │   │   ├── historicalResearchPipeline.test.ts
        │   │   ├── localization.test.ts
        │   │   ├── moderation.test.ts
        │   │   ├── newsRelevanceFilter.test.ts
        │   │   ├── numericReconciliation.test.ts
        │   │   ├── relevanceEngine.test.ts
        │   │   └── temporalGate.test.ts
        │   ├── package-lock.json
        │   ├── package.json
        │   ├── server.ts
        │   └── tsconfig.json
        ├── frontend
        │   ├── src
        │   │   ├── components
        │   │   │   ├── common
        │   │   │   │   ├── AudioRecorderButton.tsx
        │   │   │   │   └── Skeletons.tsx
        │   │   │   ├── future
        │   │   │   │   ├── FuturePage.tsx
        │   │   │   │   └── FuturePredictionDrawer.tsx
        │   │   │   ├── past
        │   │   │   │   ├── AIAssistantDrawer.tsx
        │   │   │   │   ├── CompareModal.tsx
        │   │   │   │   ├── EventDetailView.tsx
        │   │   │   │   └── PastWorkspace.tsx
        │   │   │   ├── present
        │   │   │   │   ├── AlertDetailDrawer.tsx
        │   │   │   │   ├── IndiaLiveMap.tsx
        │   │   │   │   ├── LocationIntelligencePanel.tsx
        │   │   │   │   ├── PresentWorkspace.tsx
        │   │   │   │   ├── RealtimeWarningToast.tsx
        │   │   │   │   ├── ShareModal.tsx
        │   │   │   │   └── UserLocationMap.tsx
        │   │   │   ├── HeroPage.tsx
        │   │   │   ├── IndiaMapHero.tsx
        │   │   │   ├── Navbar.tsx
        │   │   │   └── TeamPage.tsx
        │   │   ├── data
        │   │   │   └── historicalDisasters.ts
        │   │   ├── hooks
        │   │   │   ├── useAutoTranslatePage.ts
        │   │   │   ├── useTranslateBatch.ts
        │   │   │   └── useTranslateContent.ts
        │   │   ├── lib
        │   │   │   ├── api.ts
        │   │   │   ├── chatRuntime.ts
        │   │   │   ├── dateFormat.ts
        │   │   │   ├── evidenceUtils.ts
        │   │   │   ├── googleTranslate.ts
        │   │   │   ├── localizedPresentation.ts
        │   │   │   ├── lruCache.ts
        │   │   │   ├── mlApi.ts
        │   │   │   ├── pastCache.ts
        │   │   │   └── relevanceEngine.ts
        │   │   ├── types
        │   │   │   ├── disaster.ts
        │   │   │   └── language.ts
        │   │   ├── App.tsx
        │   │   ├── index.css
        │   │   ├── main.tsx
        │   │   └── vite-env.d.ts
        │   ├── index.html
        │   ├── metadata.json
        │   ├── package-lock.json
        │   ├── package.json
        │   ├── tsconfig.json
        │   ├── vercel.json
        │   └── vite.config.ts
        ├── .gitignore
        ├── LICENSE
        └── README.md



--- SIH-2026/.gitignore ---

node_modules/
**/node_modules/

.env
.env.*
!.env.example
!.env.template

dist/
**/dist/
build/
**/build/

.next/
.nuxt/
.vite/
.parcel-cache/
.turbo/
.cache/

coverage/
.nyc_output/
.pytest_cache/
.mypy_cache/
.ruff_cache/
.hypothesis/
.tox/
.nox/
htmlcov/

**pycache**/
**/**pycache**/
*.py[cod]
*.pyo
*.pyd

.venv/
venv/
env/
ENV/
virtualenv/
.conda/

*.log
logs/
log/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
bun-debug.log*

.tmp/
tmp/
temp/
.local/
.local-data/
.local-storage/

uploads/
upload/
storage/
generated/
output/

*.pid
*.pid.lock
*.seed

*.sqlite
*.sqlite3
*.db
*.db-journal
*.sqlite3-journal
dump.rdb

.vscode/
.idea/
*.iml
*.swp
*.swo
*~

.DS_Store
.AppleDouble
.LSOverride
.Spotlight-V100
.Trashes
.fseventsd
Thumbs.db
ehthumbs.db
*.stackdump
*.lnk

.ipynb_checkpoints/

playwright-report/
blob-report/
test-results/
cypress/videos/
cypress/screenshots/
cypress/downloads/

.vercel/
.netlify/
.serverless/
.aws-sam/
.firebase/

Dockerfile.local
docker-compose.override.yml
docker-compose.local.yml
.docker/
docker-data/
docker-volumes/

*.pem
*.key
*.csr
*.crt
*.cer
*.der
*.p12
*.pfx
*.jks
*.keystore

credentials.json
service-account*.json
*-service-account.json
google-credentials.json
tokens.json
token.json
auth.json
session.json
sessions.json
cookies.json
cookies.txt

*.bak
*.backup
*.old
*.orig
*.save

*.tsbuildinfo
.eslintcache
.stylelintcache

.pnpm-store/
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
.pnp.*

.terraform/
*.tfstate
*.tfstate.*
.pulumi/

poetry.lock
Pipfile.lock

*.pt
*.pth
*.ckpt
*.onnx
*.safetensors
*.bin

*.parquet
*.feather
*.h5
*.hdf5

*.mp4
*.mov
*.avi
*.mkv
*.webm

out/
release/
releases/

.history/
.serverless/

*.local
*.local.json
*.local.yaml
*.local.yml

!*.example
!*.template
!*.example.*
!*.template.*


--- SIH-2026/LICENSE ---

MIT License

Copyright (c) 2026 Soham Lodh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


--- SIH-2026/README.md ---

# Disaster Intelligence Platform — India

> A decision-support workspace that brings official disaster alerts, map context, and evidence-grounded historical research into one multilingual interface.

![React](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-61dafb?logo=react&logoColor=white) ![Node](https://img.shields.io/badge/backend-Express%20%2B%20TypeScript-339933?logo=node.js&logoColor=white) ![License](https://img.shields.io/badge/license-MIT-blue)

## The problem

During an emergency, citizens and responders often need to reconcile a live official alert, its geographic relevance, protective guidance, and fragmented news coverage. Information may be difficult to interpret quickly and harder still to use in a preferred Indian language .

## The solution

The platform combines active CAP/SACHET-style alerts with an interactive India map and location-relevance engine. Its Past workspace retrieves recent Google News evidence, enforces citation and temporal checks, and produces an evidence bundle for comparison or AI-assisted research. The UI has a global locale layer so navigation, controls, status, map chrome, drawers, and accessibility text can change without changing disaster-data identifiers or official source records.

## Why it matters

- Accessibility: a language choice should transform a workflow, not just a header.
- Trust: official wording, alert IDs, URLs, geometry, timestamps, and citations remain traceable.
- Situational awareness: live map and proximity context help users interpret an alert’s relevance.
- Evidence: historical research stays linked to retrieved sources and stable `[S#]` citations.

## Key features

### Present — live situation

- Active official alert retrieval with ETag support and expiry filtering.
- Leaflet India map, stable alert geometry, category filters, and marker/legend UI.
- Browser location and custom location lookup, with polygon/circle/centroid relevance assessment.
- Alert detail drawer with official instructions, CAP metadata, protective measures, helplines, sharing, and official links.

### Past — historical research

- Google News-backed evidence retrieval with temporal gating and source de-duplication.
- Historical cards, filters, sorting, event details, report download, and 2–4 event comparison.
- Citation-backed AI research assistant plus browser/Groq-assisted speech flows when configured.

### Multilingual UI

- App-owned copy uses semantic keys with English fallback and interpolation.
- Hindi and Bengali have complete coverage for the core UI key set; other selectable locales safely fall back to English where dedicated copy has not yet been authored.
- Hazard category IDs remain canonical (`Flood`, `Cyclone`, etc.) while display labels are localized.
- Official CAP/SACHET text remains canonical source wording rather than being presented as an altered official translation.

## Architecture

```text
SACHET / CAP / telemetry ─┐
                           ├─> Express API ─> Alert parsing + relevance metadata
Google News ───────────────┤          │
                           │          ├─> Evidence / citation / temporal gate
Groq (optional) ───────────┘          └─> AI, transcription and TTS endpoints
                                                   │
                                                   v
                                         React + Leaflet frontend
                                                   │
                                     Global locale / semantic UI keys
                              ┌────────────┼─────────────┐
                              v            v             v
                           Present        Past        Assistant
```

## Project structure

```text
backend/
  server.ts                 HTTP server entry point
  server/app.ts             Express/CORS/static application
  server/routes.ts          API routes
  server/sachet.ts          CAP/SACHET and telemetry parsing
  server/googleNews.ts      Google News retrieval
  server/aiGateway.ts       Evidence, comparison, AI, STT and TTS
  server/lib/               translation, relevance and evidence helpers
  tests/                    relevance, temporal, citations and locale tests
frontend/
  src/App.tsx               application state and locale persistence
  src/types/language.ts     language metadata, UI copy and locale helpers
  src/components/present/   live map, location, alert and sharing workflow
  src/components/past/      archive, detail, comparison and assistant workflow
  src/lib/                  API, relevance and evidence helpers
```

## Data sources and trust model

| Source / output | Role | Trust treatment |
| --- | --- | --- |
| SACHET/CAP and telemetry | live alerts | authoritative fields and original wording are preserved |
| OpenStreetMap Nominatim | location lookup | resolves a user-entered place; it is not an alert authority |
| Google News RSS/search | research evidence | deduplicated and temporally gated before use |
| AI synthesis | research assistance | derived content, with citations retained where available |

This is a situational-awareness tool, not a replacement for emergency authorities. Follow official instructions and local emergency services during an active incident.

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/alerts` | active alerts with ETag support |
| GET | `/api/alerts/:id/news` | recent, temporally gated news for an alert |
| GET | `/api/geocode?q=` | Indian location lookup |
| POST | `/api/past/search` | build a historical evidence bundle |
| GET | `/api/past/archive` | recent evidence-backed archive |
| POST | `/api/past/compare` | compare 2–4 bundles |
| POST | `/api/past/chat` | research assistant |
| POST | `/api/transcribe` | speech transcription |
| POST | `/api/tts` | text-to-speech |
| GET | `/api/health` | service diagnostics |

## Setup

Requirements: Node.js 20+ and npm.

```bash
git clone <repository-url>
cd soham-lodh-sih-2026

cd backend
copy .env.example .env
npm install
npm run dev
```

In another terminal:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

The frontend defaults to `http://localhost:5173`; configure `VITE_API_BASE_URL` to point to the backend when they are served separately.

## Environment variables

See [`backend/.env.example`](backend/.env.example). The backend reads `PORT`, `APP_URL`, `CORS_ORIGINS`, `FRONTEND_URL`, and optional Groq keys/model settings (`GROQ_API_KEY`, scoped `GROQ_API_KEY_*`, `GROQ_MODEL`, `GROQ_STT_MODEL`, `GROQ_TTS_MODEL`, `GROQ_TTS_VOICE`). The frontend uses `VITE_API_BASE_URL`.

Never commit real keys.

## Localization design

`App.tsx` owns the selected locale, persists it in `localStorage`, and updates the document language. `translate(locale, key, values)` resolves semantic application keys, interpolates structured values, and falls back to English. Map filter values and API parameters stay canonical; only their labels are translated. A locale switch does not re-fetch live alerts or reconstruct the Leaflet map.

External/official content is deliberately different: canonical alert and evidence fields are kept as supplied. The UI identifies these as source wording rather than suggesting that a machine-generated rendering is an official translation.

## Testing

```bash
cd frontend && npm run lint && npm run build
cd ../backend && npm run lint && npm test && npm run build
```

Backend tests cover citation validation, temporal gating, geospatial relevance, alert expiry, locale fallback/interpolation, and stable hazard identifiers. Frontend type-checking and production builds validate component integration.

## Demo flow

1. Open **Present** and allow location access (or search a location).
2. Select an alert on the India map and inspect the official source, CAP fields, guidance, and helplines.
3. Switch from English to Hindi or Bengali while the drawer is open.
4. Show that filters, legend, navigation, and drawer controls update without losing map state.
5. Open **Past**, search for an event, inspect sources, then add two events to Compare.
6. Open the AI assistant and ask an evidence question; inspect the source badges.

## Limitations and roadmap

**Current:** live source integration, map/relevance workflow, evidence-grounded research, and core locale infrastructure.

**In progress:** completion of authored UI dictionaries for every selectable Indian language and broader component-level localization coverage.

**Planned:** official multilingual feed preference when sources provide it, stronger end-to-end UI tests, and language-specific speech capability reporting.

## Team

Contributor details have not been specified in this repository. Add the SIH team roster and roles here.

## License

Licensed under the [MIT License](LICENSE).


--- SIH-2026/frontend/index.html ---

<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aapada Drishti — Disaster Intelligence Platform</title>
  <meta name="description"
    content="Evidence-grounded disaster intelligence and situational awareness platform for India." />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
    rel="stylesheet">
</head>

<body class="bg-[#ECF8F8] text-[#0F1B29] antialiased selection:bg-[#747F8D] selection:text-white">
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

</html>

--- SIH-2026/frontend/metadata.json ---

{
  "name": "Disaster Intelligence Platform",
  "description": "Unified disaster intelligence platform for India featuring official SACHET alerts, 5-case geospatial relevance engine, historical research synthesis with Google News citations, and multilingual Indian language voice assistant.",
  "requestFramePermissions": ["geolocation", "microphone"],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}


--- SIH-2026/frontend/package-lock.json ---

{
  "name": "disaster-intelligence-frontend",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "disaster-intelligence-frontend",
      "version": "0.0.0",
      "dependencies": {
        "@assistant-ui/react": "^0.15.16",
        "@assistant-ui/react-markdown": "^0.14.12",
        "@tailwindcss/vite": "^4.1.14",
        "@types/leaflet": "^1.9.22",
        "@vitejs/plugin-react": "^5.0.4",
        "ai": "^7.0.77",
        "leaflet": "^1.9.4",
        "lucide-react": "^0.546.0",
        "motion": "^12.23.24",
        "react": "^19.0.1",
        "react-dom": "^19.0.1",
        "react-markdown": "^10.1.0",
        "remark-gfm": "^4.0.1"
      },
      "devDependencies": {
        "@types/node": "^22.14.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        "autoprefixer": "^10.4.21",
        "tailwindcss": "^4.1.14",
        "typescript": "~5.8.2",
        "vite": "^6.2.3"
      }
    },
    "node_modules/@ai-sdk/gateway": {
      "version": "4.0.62",
      "resolved": "https://registry.npmjs.org/@ai-sdk/gateway/-/gateway-4.0.62.tgz",
      "integrity": "sha512-zR3pustGWhw5eUZHG+fJZx/V/PBe+LxdDpc5hDFWxozG/3MB/+eY62jn+YiR+9uOH+Hx63e5zJoeKLfZfPktWQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@ai-sdk/provider": "4.0.7",
        "@ai-sdk/provider-utils": "5.0.29",
        "@vercel/oidc": "3.2.0"
      },
      "engines": {
        "node": ">=22"
      },
      "peerDependencies": {
        "zod": "^3.25.76 || ^4.1.8"
      }
    },
    "node_modules/@ai-sdk/provider": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/@ai-sdk/provider/-/provider-4.0.7.tgz",
      "integrity": "sha512-6or44XprPzKbr8zkmzosowSE0pxkvJcoojBL+mCZvPUt3kvXp3XSNqeVun9golb1acEfSo6yaEBRT18h2VU+1Q==",
      "license": "Apache-2.0",
      "dependencies": {
        "json-schema": "^0.4.0"
      },
      "engines": {
        "node": ">=22"
      }
    },
    "node_modules/@ai-sdk/provider-utils": {
      "version": "5.0.29",
      "resolved": "https://registry.npmjs.org/@ai-sdk/provider-utils/-/provider-utils-5.0.29.tgz",
      "integrity": "sha512-7EIbwXiXKGa7EFk6tDZpuZBs6lxhEJpOuHeqrDb3Vd85uYdjwkdRuHnZDVDIIb2+QTSRmyph2NrXcbvuO/KAjQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@ai-sdk/provider": "4.0.7",
        "@standard-schema/spec": "^1.1.0",
        "@workflow/serde": "4.1.0",
        "eventsource-parser": "^3.0.8",
        "undici": "^7.28.0"
      },
      "engines": {
        "node": ">=22"
      },
      "peerDependencies": {
        "zod": "^3.25.76 || ^4.1.8"
      }
    },
    "node_modules/@assistant-ui/core": {
      "version": "0.3.15",
      "resolved": "https://registry.npmjs.org/@assistant-ui/core/-/core-0.3.15.tgz",
      "integrity": "sha512-pCeVhMmzK4xFbahtRtvjlGXDxycsvl1plgiD0M5ZyABm+QxINGnBO5GEz1hqDHQVjKlCIJDNj15PlFSkuFnidA==",
      "license": "MIT",
      "dependencies": {
        "assistant-stream": "^0.3.39",
        "nanoid": "^6.0.1"
      },
      "peerDependencies": {
        "@assistant-ui/store": "^0.3.0",
        "@assistant-ui/tap": "^0.9.0",
        "@types/react": "*",
        "assistant-cloud": "^0.1.31",
        "react": "^18 || ^19",
        "zustand": "^5.0.11"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "assistant-cloud": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "zustand": {
          "optional": true
        }
      }
    },
    "node_modules/@assistant-ui/core/node_modules/nanoid": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-6.0.1.tgz",
      "integrity": "sha512-3wVS3i51pE2pi1k5FFL/95BGfVS0kSsvDVuGXHOtxox/TywUmtgq+3qiTOTbs9J7KfHaXPiN171k/A6dBnaXFw==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.js"
      },
      "engines": {
        "node": "^22 || ^24 || >=26"
      }
    },
    "node_modules/@assistant-ui/react": {
      "version": "0.15.16",
      "resolved": "https://registry.npmjs.org/@assistant-ui/react/-/react-0.15.16.tgz",
      "integrity": "sha512-+2BO6npVEXdViNWTyH3XddVXHo7SOcXliM8btrXGzH6PHuTtn3CYL7DCQ5ZXVRHB9kYPBbbMPURVu93jg9qIwg==",
      "license": "MIT",
      "dependencies": {
        "@assistant-ui/core": "^0.3.15",
        "@assistant-ui/store": "^0.3.10",
        "@assistant-ui/tap": "^0.9.14",
        "@radix-ui/primitive": "^1.1.7",
        "@radix-ui/react-collection": "^1.1.15",
        "@radix-ui/react-compose-refs": "^1.1.5",
        "@radix-ui/react-context": "^1.2.2",
        "@radix-ui/react-primitive": "^2.1.10",
        "@radix-ui/react-use-callback-ref": "^1.1.4",
        "@radix-ui/react-use-controllable-state": "^1.2.6",
        "@radix-ui/react-use-escape-keydown": "^1.1.5",
        "assistant-cloud": "^0.1.41",
        "assistant-stream": "^0.3.39",
        "radix-ui": "^1.6.7",
        "react-textarea-autosize": "^8.5.9",
        "safe-content-frame": "^0.0.27",
        "zod": "^4.4.3",
        "zustand": "^5.0.15"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^18 || ^19",
        "react-dom": "^18 || ^19"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@assistant-ui/react-markdown": {
      "version": "0.14.12",
      "resolved": "https://registry.npmjs.org/@assistant-ui/react-markdown/-/react-markdown-0.14.12.tgz",
      "integrity": "sha512-g8uRpTpwk43qYzknPh7k1U0FysdJ4gySY88NiBLbCRWEGy/aHPy5B+6kaRttND3Rij3rQpGkP5NZOo/z+kMEEQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "^2.1.10",
        "@radix-ui/react-use-callback-ref": "^1.1.4",
        "classnames": "^2.5.1",
        "react-markdown": "^10.1.0"
      },
      "peerDependencies": {
        "@assistant-ui/react": "^0.15.0",
        "@types/react": "*",
        "react": "^18 || ^19"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@assistant-ui/store": {
      "version": "0.3.10",
      "resolved": "https://registry.npmjs.org/@assistant-ui/store/-/store-0.3.10.tgz",
      "integrity": "sha512-QSFgodFt/daEjyaY09WdahNewsGPtAeY+DkSb2LM2rPN6634h13R1vJQvCtyWK5YsI5WXgzgbsctzgpIQLU0qw==",
      "license": "MIT",
      "peerDependencies": {
        "@assistant-ui/tap": "^0.9.12",
        "@types/react": "*",
        "react": "^18 || ^19"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "react": {
          "optional": true
        }
      }
    },
    "node_modules/@assistant-ui/tap": {
      "version": "0.9.14",
      "resolved": "https://registry.npmjs.org/@assistant-ui/tap/-/tap-0.9.14.tgz",
      "integrity": "sha512-L/ZyXLQb51/d+/5xlXaP1197PF94EO/Ji+/CBWTjuEbsU1+8dzXCHVNO9GCFQvyG02OiOVitfbRksipMVzdrnA==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^18 || ^19"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "react": {
          "optional": true
        }
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.7.tgz",
      "integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.29.7",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.7.tgz",
      "integrity": "sha512-locTkQyKvwIEgBzVrn8693ebc97F2U8ZHjbXwDXJ5Fn2TCpNwTlKcaKLkdHop5c/icOFE7qt7Q9JC5hnKNa6Gg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.7.tgz",
      "integrity": "sha512-RgHBCvtjbOK2gXSNBNIkNoEc9qoVEtau3hj8gEqKQuL3HZAibKarWFEI3Lfm6EYKkLalOh8eSrj9b+ch9H/VBA==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.7",
        "@babel/helper-compilation-targets": "^7.29.7",
        "@babel/helper-module-transforms": "^7.29.7",
        "@babel/helpers": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/template": "^7.29.7",
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.8.tgz",
      "integrity": "sha512-gZbepsdh3WDtgZKWL+vTPh71LSBrm/Y4/QDZBVCcYfmeTEEuoOYwlSy+G1StfJg+/Zy550u/3TATbm7qDbbMtg==",
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.8",
        "@babel/types": "^7.29.8",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.29.7.tgz",
      "integrity": "sha512-wem6WaBj4NaVYVdNhLPPVacES6ZJ+KBBfSkTMD3YZxbP3rm3Di85tJU5ljaUNhaOynt+Aj0xruhYuzQBt8n71g==",
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.29.7",
        "@babel/helper-validator-option": "^7.29.7",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.29.7.tgz",
      "integrity": "sha512-3nQVUAtvkKH9zahfWgw96Jc/uFOmjACE1kQz82E2lqWmHBgjzbNlsC22nuQTfahmWeQtTq5nQ/4Nnd2A1wj4zA==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.29.7.tgz",
      "integrity": "sha512-ejHwrQQYcm9xnTivShn2IDOlIzInN34AXskvq9QicvCtEzq1Vzclu/tKF8Jq1Cg8JG2GL6/EmjgsCT7lXepE3g==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.29.7.tgz",
      "integrity": "sha512-UPUVSyXbOh627KiCIGQSgwWzGeBKLkaJ9PJEdrngIwMSzxLR4jS4+f1f1jb7VzBbg8nFLaYotvVPFCTqdrmTAg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-plugin-utils": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.29.7.tgz",
      "integrity": "sha512-G7sHYigPY17oO5SYWnfD/0MTBwVR781S/JI643e/JhUYgVgWE/61SoW3NH9KWUKyKq5LVh3npif99Wkt6j86Jw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.29.7.tgz",
      "integrity": "sha512-Pb5ijPrZ89GDH8223L4UP8i6QApWxs04RbPQJTeWDV0/keR2E36MeKnyr6LYmUUvqRRI+Iv87SuF1W6ErINzYw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
      "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.29.7.tgz",
      "integrity": "sha512-N9ZErrD+yW5geCDtBqnOoxmR8+tNKiGuxKlDpuJxfsqpa2dFcexaziGAE/qoHLiDDreVNMupxGmSoNlyvsA3gw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.7.tgz",
      "integrity": "sha512-1k2lAGRMfHTcwuNYcCNUmaUffmQv8KWMfh2iJUUeRlwlwH4FdNG7mfPI10NPfLHJFThE4Tyr4mv7kTNZOiPuBg==",
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.8.tgz",
      "integrity": "sha512-E8lTAYNB1KW+FH+VGJuZM1ioAx2E6oVlvQFRrf5P8ZZmsiJXYAD9vTFV7yyEURNzgh1dFqMZuO6tUwcARbqFCA==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.8"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/plugin-transform-react-jsx-self": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.29.7.tgz",
      "integrity": "sha512-TL0hMc9xzy86VD31nUiwzd5otRAcyEPcsegCxolO0PvcXuH1v0kECe/UIznYFihpkvU5wg/jk4v0TTEFfm53fw==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-react-jsx-source": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-source/-/plugin-transform-react-jsx-source-7.29.7.tgz",
      "integrity": "sha512-06IyK09H3wi4cGbhDBwp5gUGo0IKtnYa8tyTiephirPCK6fbobVGiXMMI5zLQ4aKEYP3wZ3ArU44o+8KMrSG/Q==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.29.7.tgz",
      "integrity": "sha512-Nq8OhGWiZIZGV6hLHoyAKLLcJihP/xFeBMGJoUrxTX2psI8dCifzLhZISFb+VWS3wFMRDmCGw5R+dOySCqPLhw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.29.7.tgz",
      "integrity": "sha512-puq+Gf35oI24FeN11LkoUQFqv9uwNeWpxXZi/Ji3rRIoKAzKnxRaZ+Gkj0vKS9ZCiTESfng1N9LyOyXvo+m+Gg==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.8.tgz",
      "integrity": "sha512-I5z7H3bf/41ktsNVLtpN0wAa336HkqIHQ5BuPLEhTkt1jVSyZpeNKIzTgEWmlxjdg81R0IgUCcaE+Ok3NvrfZg==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.8",
        "@babel/helper-globals": "^7.29.7",
        "@babel/parser": "^7.29.8",
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.8",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.8.tgz",
      "integrity": "sha512-Vj1jF3cPfxg7OAfoI7QnVKLoILlm2JF9pnVHrX8qx7AHMiYWT+NDAA7jChlNgRS4WTLc/fD1lXLmPixluj+3Gg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.25.12.tgz",
      "integrity": "sha512-Hhmwd6CInZ3dwpuGTF8fJG6yoWmsToE+vYgD4nytZVxcu1ulHpUQRAB1UJ8+N1Am3Mz4+xOByoQoSZf4D+CpkA==",
      "cpu": [
        "ppc64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.25.12.tgz",
      "integrity": "sha512-VJ+sKvNA/GE7Ccacc9Cha7bpS8nyzVv0jdVgwNDaR4gDMC/2TTRc33Ip8qrNYUcpkOHUT5OZ0bUcNNVZQ9RLlg==",
      "cpu": [
        "arm"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.25.12.tgz",
      "integrity": "sha512-6AAmLG7zwD1Z159jCKPvAxZd4y/VTO0VkprYy+3N2FtJ8+BQWFXU+OxARIwA46c5tdD9SsKGZ/1ocqBS/gAKHg==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.25.12.tgz",
      "integrity": "sha512-5jbb+2hhDHx5phYR2By8GTWEzn6I9UqR11Kwf22iKbNpYrsmRB18aX/9ivc5cabcUiAT/wM+YIZ6SG9QO6a8kg==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.25.12.tgz",
      "integrity": "sha512-N3zl+lxHCifgIlcMUP5016ESkeQjLj/959RxxNYIthIg+CQHInujFuXeWbWMgnTo4cp5XVHqFPmpyu9J65C1Yg==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.25.12.tgz",
      "integrity": "sha512-HQ9ka4Kx21qHXwtlTUVbKJOAnmG1ipXhdWTmNXiPzPfWKpXqASVcWdnf2bnL73wgjNrFXAa3yYvBSd9pzfEIpA==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.25.12.tgz",
      "integrity": "sha512-gA0Bx759+7Jve03K1S0vkOu5Lg/85dou3EseOGUes8flVOGxbhDDh/iZaoek11Y8mtyKPGF3vP8XhnkDEAmzeg==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.25.12.tgz",
      "integrity": "sha512-TGbO26Yw2xsHzxtbVFGEXBFH0FRAP7gtcPE7P5yP7wGy7cXK2oO7RyOhL5NLiqTlBh47XhmIUXuGciXEqYFfBQ==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.25.12.tgz",
      "integrity": "sha512-lPDGyC1JPDou8kGcywY0YILzWlhhnRjdof3UlcoqYmS9El818LLfJJc3PXXgZHrHCAKs/Z2SeZtDJr5MrkxtOw==",
      "cpu": [
        "arm"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.25.12.tgz",
      "integrity": "sha512-8bwX7a8FghIgrupcxb4aUmYDLp8pX06rGh5HqDT7bB+8Rdells6mHvrFHHW2JAOPZUbnjUpKTLg6ECyzvas2AQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.25.12.tgz",
      "integrity": "sha512-0y9KrdVnbMM2/vG8KfU0byhUN+EFCny9+8g202gYqSSVMonbsCfLjUO+rCci7pM0WBEtz+oK/PIwHkzxkyharA==",
      "cpu": [
        "ia32"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.25.12.tgz",
      "integrity": "sha512-h///Lr5a9rib/v1GGqXVGzjL4TMvVTv+s1DPoxQdz7l/AYv6LDSxdIwzxkrPW438oUXiDtwM10o9PmwS/6Z0Ng==",
      "cpu": [
        "loong64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.25.12.tgz",
      "integrity": "sha512-iyRrM1Pzy9GFMDLsXn1iHUm18nhKnNMWscjmp4+hpafcZjrr2WbT//d20xaGljXDBYHqRcl8HnxbX6uaA/eGVw==",
      "cpu": [
        "mips64el"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.25.12.tgz",
      "integrity": "sha512-9meM/lRXxMi5PSUqEXRCtVjEZBGwB7P/D4yT8UG/mwIdze2aV4Vo6U5gD3+RsoHXKkHCfSxZKzmDssVlRj1QQA==",
      "cpu": [
        "ppc64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.25.12.tgz",
      "integrity": "sha512-Zr7KR4hgKUpWAwb1f3o5ygT04MzqVrGEGXGLnj15YQDJErYu/BGg+wmFlIDOdJp0PmB0lLvxFIOXZgFRrdjR0w==",
      "cpu": [
        "riscv64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.25.12.tgz",
      "integrity": "sha512-MsKncOcgTNvdtiISc/jZs/Zf8d0cl/t3gYWX8J9ubBnVOwlk65UIEEvgBORTiljloIWnBzLs4qhzPkJcitIzIg==",
      "cpu": [
        "s390x"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.25.12.tgz",
      "integrity": "sha512-uqZMTLr/zR/ed4jIGnwSLkaHmPjOjJvnm6TVVitAa08SLS9Z0VM8wIRx7gWbJB5/J54YuIMInDquWyYvQLZkgw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.25.12.tgz",
      "integrity": "sha512-xXwcTq4GhRM7J9A8Gv5boanHhRa/Q9KLVmcyXHCTaM4wKfIpWkdXiMog/KsnxzJ0A1+nD+zoecuzqPmCRyBGjg==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.25.12.tgz",
      "integrity": "sha512-Ld5pTlzPy3YwGec4OuHh1aCVCRvOXdH8DgRjfDy/oumVovmuSzWfnSJg+VtakB9Cm0gxNO9BzWkj6mtO1FMXkQ==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.25.12.tgz",
      "integrity": "sha512-fF96T6KsBo/pkQI950FARU9apGNTSlZGsv1jZBAlcLL1MLjLNIWPBkj5NlSz8aAzYKg+eNqknrUJ24QBybeR5A==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.25.12.tgz",
      "integrity": "sha512-MZyXUkZHjQxUvzK7rN8DJ3SRmrVrke8ZyRusHlP+kuwqTcfWLyqMOE3sScPPyeIXN/mDJIfGXvcMqCgYKekoQw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.25.12.tgz",
      "integrity": "sha512-rm0YWsqUSRrjncSXGA7Zv78Nbnw4XL6/dzr20cyrQf7ZmRcsovpcRBdhD43Nuk3y7XIoW2OxMVvwuRvk9XdASg==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.25.12.tgz",
      "integrity": "sha512-3wGSCDyuTHQUzt0nV7bocDy72r2lI33QL3gkDNGkod22EsYl04sMf0qLb8luNKTOmgF/eDEDP5BFNwoBKH441w==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.25.12.tgz",
      "integrity": "sha512-rMmLrur64A7+DKlnSuwqUdRKyd3UE7oPJZmnljqEptesKM8wx9J8gx5u0+9Pq0fQQW8vqeKebwNXdfOyP+8Bsg==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.25.12.tgz",
      "integrity": "sha512-HkqnmmBoCbCwxUKKNPBixiWDGCpQGVsrQfJoVGYLPT41XWF8lHuE5N6WhVia2n4o5QK5M4tYr21827fNhi4byQ==",
      "cpu": [
        "ia32"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.25.12.tgz",
      "integrity": "sha512-alJC0uCZpTFrSL0CCDjcgleBXPnCrEAhTBILpeAp7M/OFgoqtAetfBzX0xM00MUsVVPpVjlPuMbREqnZCXaTnA==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@floating-ui/core": {
      "version": "1.8.0",
      "resolved": "https://registry.npmjs.org/@floating-ui/core/-/core-1.8.0.tgz",
      "integrity": "sha512-0CIZ5itps/8x7BG8dEIhs53BvCUH2PCoogtakwRTut+Arm58sJooJ0AuZhLw2HJYIR5cMLNPBSS728sPho2khQ==",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/utils": "^0.2.12"
      }
    },
    "node_modules/@floating-ui/dom": {
      "version": "1.8.0",
      "resolved": "https://registry.npmjs.org/@floating-ui/dom/-/dom-1.8.0.tgz",
      "integrity": "sha512-yXSrzeHZBTZadLOlfyhCkJHNeLJnHRnRInwdZ40L7ZiaAtrBwoYlsDrX3v5zB1Utk7CLfzcOVnVVWoXEky7Ceg==",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/core": "^1.8.0",
        "@floating-ui/utils": "^0.2.12"
      }
    },
    "node_modules/@floating-ui/react-dom": {
      "version": "2.1.9",
      "resolved": "https://registry.npmjs.org/@floating-ui/react-dom/-/react-dom-2.1.9.tgz",
      "integrity": "sha512-JDjEFGCpImxDCA7JJKviA0M9+RtmJdj0m/NVU5IMgBK+AmZouAQQ7/+2GLH0GXXY0YMw9oXPB8hKdbPYg5QLYg==",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/dom": "^1.8.0"
      },
      "peerDependencies": {
        "react": ">=16.8.0",
        "react-dom": ">=16.8.0"
      }
    },
    "node_modules/@floating-ui/utils": {
      "version": "0.2.12",
      "resolved": "https://registry.npmjs.org/@floating-ui/utils/-/utils-0.2.12.tgz",
      "integrity": "sha512-HpCo8tmWzLVad5s2d19EhAz5zqrrQ6s69qd6moPMQvkOuSwDT1YgRfWSVuc4ennqrgv3OHppiOGMQ7oC13yIww==",
      "license": "MIT"
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@napi-rs/lzma-linux-x64-gnu": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/lzma-linux-x64-gnu/-/lzma-linux-x64-gnu-1.5.1.tgz",
      "integrity": "sha512-oTXEIha4SsuXdTA4Iyskj0kpdx2yVXdhd75c2v3xGrHFfVMsbhTPZU/nMPL4sWKo4pBHm3aucLaqGlF696dTyQ==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^22.20 || ^24.12 || >=25"
      }
    },
    "node_modules/@radix-ui/number": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/@radix-ui/number/-/number-1.1.3.tgz",
      "integrity": "sha512-Road2bidD0uu/1BGDOWNdPI06g0lIRy6IF9GZcIrDK2KGItfor8IQwQa+yM2ERgHM1MmHxaxpTzk0/Jp42lNfA==",
      "license": "MIT"
    },
    "node_modules/@radix-ui/primitive": {
      "version": "1.1.7",
      "resolved": "https://registry.npmjs.org/@radix-ui/primitive/-/primitive-1.1.7.tgz",
      "integrity": "sha512-rqWnm76nYT8HoNNqEjpgJ7Pw/DrBj5iBTrmEPo6HTX5+VJyBNOqTdv4g89G63HuR5g0AaENoAcH7Is5fF2kZ8Q==",
      "license": "MIT"
    },
    "node_modules/@radix-ui/react-accessible-icon": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-accessible-icon/-/react-accessible-icon-1.1.15.tgz",
      "integrity": "sha512-WTQwcAvQf5sOcuUyi90lKPbhwcvQ+j55cjrSmeaN+L2vKU3DooOvlKw2MDeiJ5IkV5N905KW0/fGojKOBhD11A==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-visually-hidden": "1.2.11"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-accordion": {
      "version": "1.2.20",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-accordion/-/react-accordion-1.2.20.tgz",
      "integrity": "sha512-jDhG9FvAEnlhnjrsINbNXcUa4G+L1KqSkJSunkbKEzFRcAb52jvM0PjPxPRvhe1HNc5F5yc0yzzWeeqlH4yBIg==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-collapsible": "1.1.20",
        "@radix-ui/react-collection": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-controllable-state": "1.2.6"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-alert-dialog": {
      "version": "1.1.23",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-alert-dialog/-/react-alert-dialog-1.1.23.tgz",
      "integrity": "sha512-VAYOiQRqj3GPpYJE0I9J+X8Ip05cyVlNdKOFeiGS2Ou1HHGfpl0BxOyZm6nmVDyU+W+NF3/XLzmjHmVGydhwgA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-dialog": "1.1.23",
        "@radix-ui/react-primitive": "2.1.10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-arrow": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-arrow/-/react-arrow-1.1.15.tgz",
      "integrity": "sha512-v4zggRcjadnI+ClKDuijlQEW4tw3NoaeHc/PwpKnLoLLKNUG4InLegkstooLcRIUWCs+8L22dGURCVuFfOKfnA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.1.10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-aspect-ratio": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-aspect-ratio/-/react-aspect-ratio-1.1.15.tgz",
      "integrity": "sha512-fy+dyVR+90nelK8rqIznFlxzx7uPcGbhxH8Nfr2bHb4UfSe+e3hklOC0luK0hDwVwnRX7xTRySpsrQVeW+/oNQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.1.10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-avatar": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-avatar/-/react-avatar-1.2.6.tgz",
      "integrity": "sha512-4ULOTJ/mqy2hT9GlWa/MFHxHSvH3nJzHnZM1waNsc5Bonv7i70aNenghXmD97S6OJ81ekXONGGt4nT1r0PfEdA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-callback-ref": "1.1.4",
        "@radix-ui/react-use-is-hydrated": "0.1.3",
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-checkbox": {
      "version": "1.3.11",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-checkbox/-/react-checkbox-1.3.11.tgz",
      "integrity": "sha512-Gnptr9pDDQxD3hgq2dtPbtrp/c2qH1mBwIzw3X/ivrMb2e1t0jMTi606fVEqFPaQR1ggXIVQWKj3P2WW9v7zGQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-size": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-collapsible": {
      "version": "1.1.20",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-collapsible/-/react-collapsible-1.1.20.tgz",
      "integrity": "sha512-mcGesGplBnzN2sbvJETzpCNfSMyPnb29q1GRLU+Ib7bJrpIG2ywmRoh2V5VbA2uNvKikKUlVbAPks7JDjz4A8Q==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-collection": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-collection/-/react-collection-1.1.15.tgz",
      "integrity": "sha512-9W+B9NPF0NaaPh/1NJd3+KqsnlLqU9H7T2rvww+fp+T/evVXdNAyYcnfRQZFOjkR1ajQp3yORlqnI8soawLvNA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-slot": "1.3.3"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-compose-refs": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-compose-refs/-/react-compose-refs-1.1.5.tgz",
      "integrity": "sha512-+48PbAAbq3didjJxa+OaWY2ZwgAKsNiRGyeHKszblZMQ+kcpd9pAaT11cMkGEie0vsOi3QdeTE6d5Fe3Gn61kA==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-context": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.2.2.tgz",
      "integrity": "sha512-RHCUGwKHDr0hDGg4X7ma4JG4/+12qxw8rkh5QKdDldlCvtja6nUx1Ef/8HVrJze81lEsgLQlqjzjGNHantgnQA==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-context-menu": {
      "version": "2.3.7",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-context-menu/-/react-context-menu-2.3.7.tgz",
      "integrity": "sha512-CtXP35dxaB5T3zXSd+E3uHe/QpXcpYnZmxp6OaIbfthtfW4wyb77M23BG+bwIJDtsMwEP/YssdsmNyZu7jhWew==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-menu": "2.1.24",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-controllable-state": "1.2.6"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-dialog": {
      "version": "1.1.23",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-dialog/-/react-dialog-1.1.23.tgz",
      "integrity": "sha512-Ksw4WeROkO4rC9k/onilX/Ao2Cr1ku1unMNH+XSCcP4jSXYu7HDsg9n4ojMjVb22XpYjAQ9qfrFlVbru1vXDUA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-dismissable-layer": "1.1.19",
        "@radix-ui/react-focus-guards": "1.1.6",
        "@radix-ui/react-focus-scope": "1.1.16",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-portal": "1.1.17",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-slot": "1.3.3",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-layout-effect": "1.1.4",
        "aria-hidden": "^1.2.4",
        "react-remove-scroll": "^2.7.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-direction": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-direction/-/react-direction-1.1.4.tgz",
      "integrity": "sha512-5pzg4FGQNpExhnhT2zlrP1wZFaYCd1K0nYWoFAdcYoYK868IEigqMX3B3f8yIoRlAhAeDWciLI6ZdCKHF9P4Vg==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-dismissable-layer": {
      "version": "1.1.19",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-dismissable-layer/-/react-dismissable-layer-1.1.19.tgz",
      "integrity": "sha512-8g4pfOL9HoKKLWGiypT+dphVqjFfmcXO5GBnhsG6zI+lxAx/8feQpr+1LSN8Re3hiZ+XkLNS4O9ztK11/LzQ6w==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-callback-ref": "1.1.4",
        "@radix-ui/react-use-effect-event": "0.0.5"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-dropdown-menu": {
      "version": "2.1.24",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-dropdown-menu/-/react-dropdown-menu-2.1.24.tgz",
      "integrity": "sha512-geq8l2rJkxvkXsT9RMgtUE3P8pITFpTsvYpbySi1IH4fZEABD/Gp85myayFgxk0ktljGMJnCbeFkyTusvSvv7g==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-menu": "2.1.24",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-controllable-state": "1.2.6"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-focus-guards": {
      "version": "1.1.6",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-focus-guards/-/react-focus-guards-1.1.6.tgz",
      "integrity": "sha512-RNOJjfZMTyBM6xYmV3IVGXkPjIhcBAuv48POevAXwrGJhkWZ9p1rFoIS1JFooPuT193AZmRsCPhpoVJxx6OPoQ==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-focus-scope": {
      "version": "1.1.16",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-focus-scope/-/react-focus-scope-1.1.16.tgz",
      "integrity": "sha512-wmRZ2WWLvmt6KHy2rNPOdPUjwq5xOHY02+m+udwJTn0aNIox/rkskAvJTyTLGhPK6KgrUjlJUJpgmx/+wFiFIQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-callback-ref": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-form": {
      "version": "0.1.16",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-form/-/react-form-0.1.16.tgz",
      "integrity": "sha512-Q4TLEn2A7TAypxwmd6R9EwrlXDvkfYSDMrq9/887AXAGh+G1rH+kYJKSTv+Si9Y0JPKTwKYv6PviAJosysNimA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-label": "2.1.15",
        "@radix-ui/react-primitive": "2.1.10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-hover-card": {
      "version": "1.1.23",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-hover-card/-/react-hover-card-1.1.23.tgz",
      "integrity": "sha512-H8qONfZd3ltrU3+jHCIgITbWo6e1iTKvP9DHdrvYbX48ooRM5FjEDTn16AMwdfuOGkWdZEhpl3PLL/Wk/AnHDQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-dismissable-layer": "1.1.19",
        "@radix-ui/react-popper": "1.3.7",
        "@radix-ui/react-portal": "1.1.17",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-controllable-state": "1.2.6"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-id": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-id/-/react-id-1.1.4.tgz",
      "integrity": "sha512-TMQp2llA+RYn7JcjnrMnz7wN4pcVttPZnRZo52PLQsoLVKzNlVwUeHmfePgTgRluXFvlD3GD5g5MOVVTJCO0qA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-label": {
      "version": "2.1.15",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-label/-/react-label-2.1.15.tgz",
      "integrity": "sha512-o/rdYEwZTTo5tjknnPeyQFU45kUC4i/XyeDPP+HGyi6XqpOP6Zf5Ya5vh/Yfe9Id5JiuWnnAx2XqIeD3UYZt0g==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.1.10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-menu": {
      "version": "2.1.24",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-menu/-/react-menu-2.1.24.tgz",
      "integrity": "sha512-uW7RVuU6Lp/ZtfeY4b3kL32zccgEWvPv1+cf17ubYzHa9cL8AHokmk36cG/XEiH/smbQvumnieXX9j/e9RqJWA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-collection": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-dismissable-layer": "1.1.19",
        "@radix-ui/react-focus-guards": "1.1.6",
        "@radix-ui/react-focus-scope": "1.1.16",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-popper": "1.3.7",
        "@radix-ui/react-portal": "1.1.17",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-roving-focus": "1.1.19",
        "@radix-ui/react-slot": "1.3.3",
        "@radix-ui/react-use-callback-ref": "1.1.4",
        "aria-hidden": "^1.2.4",
        "react-remove-scroll": "^2.7.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-menubar": {
      "version": "1.1.24",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-menubar/-/react-menubar-1.1.24.tgz",
      "integrity": "sha512-eeVs0vf7cuqXaM0qLQCPcufImiJNVBXdJDLu7ZGYl2732UH23Qat/foNGrr6vYV3/DdTsBqASoggUFgH14OcZA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-collection": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-menu": "2.1.24",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-roving-focus": "1.1.19",
        "@radix-ui/react-use-controllable-state": "1.2.6"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-navigation-menu": {
      "version": "1.2.22",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-navigation-menu/-/react-navigation-menu-1.2.22.tgz",
      "integrity": "sha512-ou7iLEJ+yrhQndkkA4U21XIdS/CS45F4iXIkTZcb6/Ne9EMsOuDudVmCwmDnfFZZ+y1FZqXRNSIgBy+YMvZVZg==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-collection": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-dismissable-layer": "1.1.19",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-callback-ref": "1.1.4",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-layout-effect": "1.1.4",
        "@radix-ui/react-use-previous": "1.1.4",
        "@radix-ui/react-visually-hidden": "1.2.11"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-one-time-password-field": {
      "version": "0.1.16",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-one-time-password-field/-/react-one-time-password-field-0.1.16.tgz",
      "integrity": "sha512-Tj9P6ntAJEw52oq/F0AGknXR4XncxEt7XU47O3xJQOiWfLzEy3d9gtgKfvjSzGxzHkfL+VzvxGu2KTFsloJqXw==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/number": "1.1.3",
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-collection": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-roving-focus": "1.1.19",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-effect-event": "0.0.5",
        "@radix-ui/react-use-is-hydrated": "0.1.3",
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-password-toggle-field": {
      "version": "0.1.11",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-password-toggle-field/-/react-password-toggle-field-0.1.11.tgz",
      "integrity": "sha512-4gvFnmDXu3dgj21CqsufzIameRvlRd4SBqaWhcrlrNhRo0Y5i/49AmRJYe1fdAM3G2VNBbmin4b0D6cdQocwgw==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-effect-event": "0.0.5",
        "@radix-ui/react-use-is-hydrated": "0.1.3"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-popover": {
      "version": "1.1.23",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-popover/-/react-popover-1.1.23.tgz",
      "integrity": "sha512-mw58MrBlyHWFisTOYignD0vf/3gdcgAR+9of1s9G/38CbFiUwH1nCDkc0AUM9IrXFgN5Ue8n45j9WCgyM1sbiQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-dismissable-layer": "1.1.19",
        "@radix-ui/react-focus-guards": "1.1.6",
        "@radix-ui/react-focus-scope": "1.1.16",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-popper": "1.3.7",
        "@radix-ui/react-portal": "1.1.17",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-slot": "1.3.3",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "aria-hidden": "^1.2.4",
        "react-remove-scroll": "^2.7.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-popper": {
      "version": "1.3.7",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-popper/-/react-popper-1.3.7.tgz",
      "integrity": "sha512-UsJrrd7w4wuKKTdvd/DNERVlwSlUcyXzjhyDwBk+3aPOsCjOY6ZSbxuw8E6lZTjjfP8Cpd0J8VVkrYUWyGYXyg==",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/react-dom": "^2.0.0",
        "@radix-ui/react-arrow": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-callback-ref": "1.1.4",
        "@radix-ui/react-use-layout-effect": "1.1.4",
        "@radix-ui/react-use-rect": "1.1.4",
        "@radix-ui/react-use-size": "1.1.4",
        "@radix-ui/rect": "1.1.3"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-portal": {
      "version": "1.1.17",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-portal/-/react-portal-1.1.17.tgz",
      "integrity": "sha512-vKQLcWypUnwZVvfV7UkGahH2g6ySe8M8R+zYBwPrv5byZ9QAW6cQVvNKo7GgmD+p8aYb6D9JBuvy8/WhOno2wQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-presence": {
      "version": "1.1.10",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-presence/-/react-presence-1.1.10.tgz",
      "integrity": "sha512-3wyzCQ6+ubRA+D4uv9m95JYLXxmOHp05qjrkjeA7uKHHtjpPggQzc6DAb0URl7j67oR0K2foO4ip27TiX037Bw==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-primitive": {
      "version": "2.1.10",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-primitive/-/react-primitive-2.1.10.tgz",
      "integrity": "sha512-MucOnzh6hR5mid6VpkbglRAMYMjKLqRnGBbjXkzjK52fuQDd1qbkx78a5P40mkcnVXJdEVxm26E9OPAiUq7nBg==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-slot": "1.3.3"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-progress": {
      "version": "1.1.16",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-progress/-/react-progress-1.1.16.tgz",
      "integrity": "sha512-5XnomAsoZZCY+KNTxbIghpGqPruZvKFNlvcAljVAOdDRDsH4/OZQxhtwo5wdtoDM5R6MhJBb2sPnDuRFep3lzg==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-primitive": "2.1.10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-radio-group": {
      "version": "1.4.7",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-radio-group/-/react-radio-group-1.4.7.tgz",
      "integrity": "sha512-cgYFEkntCxppHZgtSZ+7vh0wbZQ+IC7PPMw8DSnRG27B6kDd32/Zw0OJt7dGDigCoprMuWHjg2PvUn3PYvPFoQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-roving-focus": "1.1.19",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-size": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-roving-focus": {
      "version": "1.1.19",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-roving-focus/-/react-roving-focus-1.1.19.tgz",
      "integrity": "sha512-V9jI6hDjT7l3jsCQD9bLNvDLM3tH/gdbOTp7Tefp3hbbgCGQoK7tUvrWiRlcoBHIZ809ElXwNQwVo0B98LuTXQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-collection": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-callback-ref": "1.1.4",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-is-hydrated": "0.1.3",
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-scroll-area": {
      "version": "1.2.18",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-scroll-area/-/react-scroll-area-1.2.18.tgz",
      "integrity": "sha512-Zn5Cd171wxsO3Dfg8HaW6RifTb9CYTKQJHs/G4+LN1GfmJpaQMZQyQxMprVPHpaz7QY4l9BxK2JwQuzHsXC8nA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/number": "1.1.3",
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-callback-ref": "1.1.4",
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-select": {
      "version": "2.3.7",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-select/-/react-select-2.3.7.tgz",
      "integrity": "sha512-WFGImkmbzcfxeIwq/+4HvRN0pizBwbwQUED4I13ezQsDdfl38ZntN6TmR8XaSzPBqoCToe8rF75j6NPNDSzhbg==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/number": "1.1.3",
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-collection": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-dismissable-layer": "1.1.19",
        "@radix-ui/react-focus-guards": "1.1.6",
        "@radix-ui/react-focus-scope": "1.1.16",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-popper": "1.3.7",
        "@radix-ui/react-portal": "1.1.17",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-slot": "1.3.3",
        "@radix-ui/react-use-callback-ref": "1.1.4",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-layout-effect": "1.1.4",
        "@radix-ui/react-use-previous": "1.1.4",
        "@radix-ui/react-visually-hidden": "1.2.11",
        "aria-hidden": "^1.2.4",
        "react-remove-scroll": "^2.7.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-separator": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-separator/-/react-separator-1.1.15.tgz",
      "integrity": "sha512-jOLO4lssEzWpoDu7G+Ze4VjwMRUBt291pnZD0gmalREZipnTX3wadQo7Fy48GCTfe14/YRN6rw/rOJqrE85Wxw==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.1.10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-slider": {
      "version": "1.4.7",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-slider/-/react-slider-1.4.7.tgz",
      "integrity": "sha512-mTSLf1GC/C0moWjTbvCM6Qn/gBjvlFt1azuWF2v7MN5C3Zq2U2J2lN3ZEYkpujuOU5Ro7A28wkviSxaKnG0BYg==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/number": "1.1.3",
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-collection": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-layout-effect": "1.1.4",
        "@radix-ui/react-use-previous": "1.1.4",
        "@radix-ui/react-use-size": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-slot": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.3.3.tgz",
      "integrity": "sha512-qx7oqnYbxnK9kYI9m317qmFmEgo6ywqWvbTogdj7cL9p3/yx4M48p7Rnw5z3H890cL/ow/EeWJsuTykeZVXP5Q==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-compose-refs": "1.1.5"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-switch": {
      "version": "1.3.7",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-switch/-/react-switch-1.3.7.tgz",
      "integrity": "sha512-48tB/4dn2UVLBCYhTu9AuR63IHl73l/qLbLgxd86noTUor4/K4LFDAcYjK+isP5313qxaFpjPVogE7+Y0/V3Kw==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-size": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-tabs": {
      "version": "1.1.21",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-tabs/-/react-tabs-1.1.21.tgz",
      "integrity": "sha512-UKxJlZid7FVtsk/WTxj4i4uSEgj2Au+KBbS7SQyTlzMhhn+86Cz3tISZdTa87bfEfcuvZezf2ZsxD4xuEKtkog==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-roving-focus": "1.1.19",
        "@radix-ui/react-use-controllable-state": "1.2.6"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-toast": {
      "version": "1.2.23",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-toast/-/react-toast-1.2.23.tgz",
      "integrity": "sha512-ofhyAsYaocRGOs/n0XWdUOSVzEAG6BfrMVM8z0c0kLEWY38w/0WuMFPTJP/HVaZPYkMvHZoKIIhNcjbTCBILPg==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-collection": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-dismissable-layer": "1.1.19",
        "@radix-ui/react-portal": "1.1.17",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-callback-ref": "1.1.4",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-layout-effect": "1.1.4",
        "@radix-ui/react-visually-hidden": "1.2.11"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-toggle": {
      "version": "1.1.18",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-toggle/-/react-toggle-1.1.18.tgz",
      "integrity": "sha512-7lonPlKfSacd20GlOBx2ltuVKz9oqWYZz+oMQyOltw6t1y2nyftj2ZmwwUHYn49kqfDWcp8dNZm5NgV+5Z+mug==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-use-controllable-state": "1.2.6"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-toggle-group": {
      "version": "1.1.19",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-toggle-group/-/react-toggle-group-1.1.19.tgz",
      "integrity": "sha512-OtnwuSVjd1Ofi+AdnvhsjQdyuhCDwYs1w9RyB5BN/OavXOVQo42SYqQjwUnbPnaiPFBpQ9aX70dWeee+v2oBLA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-roving-focus": "1.1.19",
        "@radix-ui/react-toggle": "1.1.18",
        "@radix-ui/react-use-controllable-state": "1.2.6"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-toolbar": {
      "version": "1.1.19",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-toolbar/-/react-toolbar-1.1.19.tgz",
      "integrity": "sha512-Ph0IvtYw4VB12ZnZg+YtrGs8yJQsnizwo/zu0R4Y/nWugtJzA7Pg1eWeuDR9+LSqn+xjamss+UOSOJJJ4gx8jw==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-roving-focus": "1.1.19",
        "@radix-ui/react-separator": "1.1.15",
        "@radix-ui/react-toggle-group": "1.1.19"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-tooltip": {
      "version": "1.2.16",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-tooltip/-/react-tooltip-1.2.16.tgz",
      "integrity": "sha512-6EamKFRRnlpdadndbZ6LMwycfwkwPte1B42hs6QA0gYhjaOKqW4PZ4pjaW9UrlDX5eVt/OjncE7BFTPL5nmZhg==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-dismissable-layer": "1.1.19",
        "@radix-ui/react-id": "1.1.4",
        "@radix-ui/react-popper": "1.3.7",
        "@radix-ui/react-portal": "1.1.17",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-slot": "1.3.3",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-layout-effect": "1.1.4",
        "@radix-ui/react-visually-hidden": "1.2.11"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-callback-ref": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-callback-ref/-/react-use-callback-ref-1.1.4.tgz",
      "integrity": "sha512-R6OUY2e2fA6Yn6s+VSx5KBV6Nx8LQEhu+cz7LCej18rQ1HLyg9PSC9jP/ZNx0o6FAIK9c0F1kHylzSxKsdlkrQ==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-controllable-state": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-controllable-state/-/react-use-controllable-state-1.2.6.tgz",
      "integrity": "sha512-uEQJGT97ZA/TgP/Hydw47lHu+/vQj6z/0jA+WeTbK1o9Rx45GImjpD0tc3W5ad3D6XTSR6e1yEO0FvGq6WQfVQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-use-effect-event": "0.0.5",
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-effect-event": {
      "version": "0.0.5",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-effect-event/-/react-use-effect-event-0.0.5.tgz",
      "integrity": "sha512-7cshFL8HGS/7HEiHH+9kL9HBwp2sa9yX18Knwek6KYWmXwM7pegMgta2AXMQKI+rq3JnfSj9x8wYqFMTdG1Jgg==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-escape-keydown": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-escape-keydown/-/react-use-escape-keydown-1.1.5.tgz",
      "integrity": "sha512-ge3ipobwSXTj4JyVtswQ7qZj0ZHdtbGuOno/LrgAAeSxtsJ6Vs4Gz5IkPH2bmqpjcLUFoqGhA/mueuIf63UXlA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-use-callback-ref": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-is-hydrated": {
      "version": "0.1.3",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-is-hydrated/-/react-use-is-hydrated-0.1.3.tgz",
      "integrity": "sha512-umO/aJ+82CpOnhDZUTbILCQf7kU/g0iv+oGs/Q8jw7IkhWBzaEP4sA268PhFAJTFetbwp3ICc6ktpI4TqtxcIw==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-layout-effect": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-layout-effect/-/react-use-layout-effect-1.1.4.tgz",
      "integrity": "sha512-K20DkRkUwDnxEYMBPcg3Y6voLkEy5p5QQmszZgLngKKiC7dzBR/aEuK3w1qlx2JWDUNH6FluahYdgR3BP+QbYw==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-previous": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-previous/-/react-use-previous-1.1.4.tgz",
      "integrity": "sha512-XoSLhbRbqxFtgJoi2fNHA3C6pDlY34x508vUpUGoFZfvePfHXHbE1lC4FYFMnJWgiCRroSTw6fOsXQoVS9RwZg==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-rect": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-rect/-/react-use-rect-1.1.4.tgz",
      "integrity": "sha512-cSOCh6JlkmfjLyNcLiu2nB4v+nm+dkZ+Q5KHWk/soo4U7ZLiEQFKHK9/YmtBHjfCEaU43IBKQOc4/uJmCaiCTQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/rect": "1.1.3"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-size": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-size/-/react-use-size-1.1.4.tgz",
      "integrity": "sha512-D3anSY15EJoxrihpsXI6SMrmmonnQtR2ni7arO+Lfdg3O95b9hNXxONk8jA5C8ANdF/h5HMAxejgs8PWJ6rlhw==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-use-layout-effect": "1.1.4"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-visually-hidden": {
      "version": "1.2.11",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-visually-hidden/-/react-visually-hidden-1.2.11.tgz",
      "integrity": "sha512-NFS86RYYZb4/exihaESBGOpMJFz8MGLAfu3mOBSGByVnVPC9JPASfYubxd/8KbkQK0sYAv8lVQDEQukDX/qXvQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.1.10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/rect": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/@radix-ui/rect/-/rect-1.1.3.tgz",
      "integrity": "sha512-JtyZR+mqgBibTo8xea3B6ZRmzZiM/YeVBtUkas6zMuXjAlfIFIW2FgqeM9eLyvEaYX66vr6DJMK+4U6LV0KhNw==",
      "license": "MIT"
    },
    "node_modules/@rolldown/pluginutils": {
      "version": "1.0.0-rc.3",
      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.0-rc.3.tgz",
      "integrity": "sha512-eybk3TjzzzV97Dlj5c+XrBFW57eTNhzod66y9HrBlzJ6NsCrWCp/2kaPS3K9wJmurBC0Tdw4yPjXKZqlznim3Q==",
      "license": "MIT"
    },
    "node_modules/@rollup/rollup-android-arm-eabi": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.62.4.tgz",
      "integrity": "sha512-RrPokAb7dmbxFoeO3TloqHyOjgye8RkBhSqmp4aJMIex4c9r46ZstPnleDQOq1t46VOVjwIuwNogIqbodV1Vvg==",
      "cpu": [
        "arm"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-arm64": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.62.4.tgz",
      "integrity": "sha512-JKuJc+pnpks2pjy7L/N3v/cAkZxYlnmuZoD840ldbMI5KDbC4iO9NKwPKYdjYFCMAIIlBzYSFHxIJVYzRo2/8A==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-darwin-arm64": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.62.4.tgz",
      "integrity": "sha512-krw5uS2STmvJ02x0uTXHbqQNuz+9eZ1iw+qXk9dmW2gvV4jV7O2hEoOnuhFrpOPiel1mBFtqbxYZZtC46hXLOw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-darwin-x64": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.62.4.tgz",
      "integrity": "sha512-wsTxtgApb4PrOsNJIm0FZ1h3WvCC+k9uxLJ4ad75hgoS4NiRes2SoJFlDAyMwiUY8IssDqGcHbXuN0sx1tfF1A==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-arm64": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.62.4.tgz",
      "integrity": "sha512-GUOnQlyZe3yAXhWOtOMsn5Qkrv5E5mZXa0thbARWi5Ei2szlVXJFQhddZ4HbAzh8q92w5twp+CQvs/eFanz9YQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-x64": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.62.4.tgz",
      "integrity": "sha512-/Y7f3QuxjzPKsjA/rfEDa3+0vXqyjmJ50Ln8dPpCmWkKTrUoWHG1cWhTqaAMLob2m2nESWuC7yGrREz019Ztqg==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.62.4.tgz",
      "integrity": "sha512-81wiiX3v7aqy+T+bT61TJ78yJjRquqFFTTbAPt08imfQQzkPIW8t6aJbkTagtCCrXMNc9D66+geqlK7ydLPNqA==",
      "cpu": [
        "arm"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.62.4.tgz",
      "integrity": "sha512-9kmDIvNZqdoHOBZgNtpTBeLWYO/LVipM3H/j62P8848/l/VPEQL6N3uxU9pvP1oZAsXyC2MEnFP3ovRjo7WYNQ==",
      "cpu": [
        "arm"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-gnu": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.62.4.tgz",
      "integrity": "sha512-CcnXHWnXg69g+DX5VWL3FHts3qMRN2uVEHX+BZvGLdd07/gXkn3ePjYtO1LDJvxkGKVHMclKBRa1QUTH+6toYQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-musl": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.62.4.tgz",
      "integrity": "sha512-iFOibiHnTRuhrWLlRsOQFdZJJIa7S8OwkneJr4ocALP16u5yk6lWLINFwhHaEqBFMsKDUZofLkGos7+CPzGB3g==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-gnu": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.62.4.tgz",
      "integrity": "sha512-XnWYMI7euHlb5a871xPja+Gm7DRCFU+FGRrtS2sMq9N8FvqtpagUy6gD4YOemC5MRk9xbh8+jYMEJbigFQwsgA==",
      "cpu": [
        "loong64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-musl": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.62.4.tgz",
      "integrity": "sha512-qGDAlO0U8xedCcsdRm9oaoQY8DAx/QT7uIxJWhCdx0ceIWX783UC9QSYkdpzAe29wNiVfp24+bZdQmn49o45SQ==",
      "cpu": [
        "loong64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.62.4.tgz",
      "integrity": "sha512-ru4H6ezD7ysA5EiEK6qkkaEb4modH8CTej6kUy/gQi20u3kB3G7Zn8snXXkeJSCOFKG/rbPPtM/+9Wgas1961w==",
      "cpu": [
        "ppc64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-musl": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.62.4.tgz",
      "integrity": "sha512-2W4MO5WQVJnbJaZdvDb9rhBDuFU1nKIepPFpJUBsTh2k1YY2g+ODViaWuyOAjQ5cOP7NvrvLzt3wvHOoiAvc7w==",
      "cpu": [
        "ppc64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.62.4.tgz",
      "integrity": "sha512-+fxjfuoAmVMCYV5QyjoIpu0cp5DOiOTeqYFk1AVaxGr+/ravWLX89XfQmptsoWcaVy/TGf2hexzbUOrCQIL1CQ==",
      "cpu": [
        "riscv64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-musl": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.62.4.tgz",
      "integrity": "sha512-jTn8JfHGL4djjFxPuM06LmNUJDsst2jeVlsd9OmIH6zc5sC9K6rIuO4YajXatLUpBmBKl6b35ro1QZocLi+tcA==",
      "cpu": [
        "riscv64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-s390x-gnu": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.62.4.tgz",
      "integrity": "sha512-oCJCJL4pXsoDcP2QZ+JVlPTIRc6266zsIaeJJsWImmF7HO0W8nb6HuSgZlMWxJwaPf8ehbSw8yo0EUw925hKsA==",
      "cpu": [
        "s390x"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-gnu": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.62.4.tgz",
      "integrity": "sha512-W69hukhZ3KKNRCaMIEzKvcFye42hh0FE1+YoYaf5+Ikacuftoco6yO/xouz0hc5d5W/s3yBro5jRiuEE/Q5vUw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-musl": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.62.4.tgz",
      "integrity": "sha512-qiXbGG2jkjXhzXpsFZSR2Xpb8DN/UaxYsbb/STbuR/6fpaDgRmmaq1B/LmtF2wQFOFOSsK2jdE0RZ3a0zHn4QA==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-openbsd-x64": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.62.4.tgz",
      "integrity": "sha512-nWeM//hxv8mIo6jD7Hu4o48DVmV9pbV6gsKaWU+4NFyqHoPKwrkRiZGLKUhOBk8qNmDmpwFtPKg80Bo/Tn4xiQ==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ]
    },
    "node_modules/@rollup/rollup-openharmony-arm64": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.62.4.tgz",
      "integrity": "sha512-s62SQ/vgsRSvMwDkOEfTqfgASF0f26ZNaQuTA6Aok5lrikf89yI2W0gFHvZb2Jpgc6N8JnOKZgCK2iciO3CsxQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@rollup/rollup-win32-arm64-msvc": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.62.4.tgz",
      "integrity": "sha512-J6wGf8TVGbXJq+HH+ttTvrcfNKPbuZecV6KT1B8I18BC5IURUh5kl4Yl5OEP5eFIUoI5BWxCsyYMhFsDx8kekw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-ia32-msvc": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.62.4.tgz",
      "integrity": "sha512-zmfrQd/0wu6oJs8Vq8KwY/YtsKSsLtKe/HwAP4Wqy8LhWjeT55fHRAkOhYQ12wI3ayS4Tt12d5CDRD7N96SAYQ==",
      "cpu": [
        "ia32"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-gnu": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.62.4.tgz",
      "integrity": "sha512-qPzHqdj9rfUD+w79dtE07zi/kFwKyCJqplp5K5ygeLTp7jLpAoc16OAH39HSmRC9UpozaecsleI8uAdEj6v2yw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-msvc": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.62.4.tgz",
      "integrity": "sha512-zD6NdeWEByGE9QF9vCrlJ5YQB4oq9q91kPZS37Jwj5hOkvR1lTBSpsKhKDw4IJtbQ35LsTS1HD9DZYGKIshU1Q==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@standard-schema/spec": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@standard-schema/spec/-/spec-1.1.0.tgz",
      "integrity": "sha512-l2aFy5jALhniG5HgqrD6jXLi/rUWrKvqN/qJx6yoJsgKhblVd+iqqU4RCXavm/jPityDo5TCvKMnpjKnOriy0w==",
      "license": "MIT"
    },
    "node_modules/@tailwindcss/node": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/node/-/node-4.3.3.tgz",
      "integrity": "sha512-/T8IKEsf9VTU6tLjgC7+sv2mOPtQxzE2jMw7u4Tt40Tx+QSZxpzh95/H6cMKoja9XuW7iMdLJYBB0o9G1CaAgg==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/remapping": "^2.3.5",
        "enhanced-resolve": "^5.24.1",
        "jiti": "^2.7.0",
        "lightningcss": "1.32.0",
        "magic-string": "^0.30.21",
        "source-map-js": "^1.2.1",
        "tailwindcss": "4.3.3"
      }
    },
    "node_modules/@tailwindcss/oxide": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide/-/oxide-4.3.3.tgz",
      "integrity": "sha512-krXjAikiaFSPaK/FkAQT5UTx3VormQaiZ5hBFlJZ9UFQGB/rwg1MZIhHAG9smMQRTdyJxP6Qt5MwMtdyU5FWrA==",
      "license": "MIT",
      "engines": {
        "node": ">= 20"
      },
      "optionalDependencies": {
        "@tailwindcss/oxide-android-arm64": "4.3.3",
        "@tailwindcss/oxide-darwin-arm64": "4.3.3",
        "@tailwindcss/oxide-darwin-x64": "4.3.3",
        "@tailwindcss/oxide-freebsd-x64": "4.3.3",
        "@tailwindcss/oxide-linux-arm-gnueabihf": "4.3.3",
        "@tailwindcss/oxide-linux-arm64-gnu": "4.3.3",
        "@tailwindcss/oxide-linux-arm64-musl": "4.3.3",
        "@tailwindcss/oxide-linux-x64-gnu": "4.3.3",
        "@tailwindcss/oxide-linux-x64-musl": "4.3.3",
        "@tailwindcss/oxide-wasm32-wasi": "4.3.3",
        "@tailwindcss/oxide-win32-arm64-msvc": "4.3.3",
        "@tailwindcss/oxide-win32-x64-msvc": "4.3.3"
      }
    },
    "node_modules/@tailwindcss/oxide-android-arm64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-android-arm64/-/oxide-android-arm64-4.3.3.tgz",
      "integrity": "sha512-Y85A2gmPSkl5Ve5qR86GL4HT509cFqQh1aes9p3sSkyTPwt0Pppf3GkwGe4JPACcRYjgJIEhQgM6dBClnr0NYw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-darwin-arm64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-arm64/-/oxide-darwin-arm64-4.3.3.tgz",
      "integrity": "sha512-BiaWatpBcERQFDlOjRDpIVXuFK5PJez5SA4JMg6VYZdBYU+qKfV/vqjcIs+IYmtitf1xYQZTwXvU/8y4lfZUGw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-darwin-x64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-x64/-/oxide-darwin-x64-4.3.3.tgz",
      "integrity": "sha512-fAeUqfV5ndhxRwai8cXGzdLvul9utWOmeTkv69unv4ZXixjn61Z+p9lCWdwOwA3TYboG3BwdVuN/RDjhBRl0mw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-freebsd-x64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-freebsd-x64/-/oxide-freebsd-x64-4.3.3.tgz",
      "integrity": "sha512-iyf5bV6+wnAlflVeEy7R25dupxTNECZN5QMI0qNT6eT+EgaGdZcKhGkr5SdoaWiLJ3spLqIY9VCeSGrwmtg4kw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm-gnueabihf": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm-gnueabihf/-/oxide-linux-arm-gnueabihf-4.3.3.tgz",
      "integrity": "sha512-aAYUprJAJQWWbRrPvtjdroZ56Md+JM8pMiopS6xGEwDfLhqj+2ver2p4nU4Mb3CRqcMmNBjo8KkUgcxhkzVQGQ==",
      "cpu": [
        "arm"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm64-gnu": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-gnu/-/oxide-linux-arm64-gnu-4.3.3.tgz",
      "integrity": "sha512-nDxldcEENOxZRzC2uu9jrutZdAAQtb+8WWDCSnWL1zvBk1+FN+x6MtDViPB5AJMfttVCUhehGWus3XBPgatM/w==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm64-musl": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-musl/-/oxide-linux-arm64-musl-4.3.3.tgz",
      "integrity": "sha512-Md44bD6veX/PC5iyF8cDVnw4HBIANZepRZZ7a8DQOvkfo5WUBwcp6iAuCUz23u+4SUkhJlD3eL7hNdW8ezd/kA==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-x64-gnu": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-gnu/-/oxide-linux-x64-gnu-4.3.3.tgz",
      "integrity": "sha512-tx7us1muwOKAKWao2v/GaafFeQboE6aj88vC6ziN2NCGcRm8gWUhwjzg+YdVB1e4boAtdtma4L43onunI6NS4w==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-x64-musl": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-musl/-/oxide-linux-x64-musl-4.3.3.tgz",
      "integrity": "sha512-SJxX60smvHgasZoBy11dX6YRjXJFovwWBoedhbQPOBzgFWBHGB+TVPWB9BxzR7TTxU8FQZAI2AyiNCMzFm8Img==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-wasm32-wasi": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-wasm32-wasi/-/oxide-wasm32-wasi-4.3.3.tgz",
      "integrity": "sha512-jx1+rPhY/5Ympkktd656HBWEBLxP7dH06losBLjjf5vgCODXvi9KhtftWcMIwTFIDqBr7cRnQkdLnAG+IOlGvQ==",
      "bundleDependencies": [
        "@napi-rs/wasm-runtime",
        "@emnapi/core",
        "@emnapi/runtime",
        "@tybys/wasm-util",
        "@emnapi/wasi-threads",
        "tslib"
      ],
      "cpu": [
        "wasm32"
      ],
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "^1.11.1",
        "@emnapi/runtime": "^1.11.1",
        "@emnapi/wasi-threads": "^1.2.2",
        "@napi-rs/wasm-runtime": "^1.1.4",
        "@tybys/wasm-util": "^0.10.2",
        "tslib": "^2.8.1"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@tailwindcss/oxide-win32-arm64-msvc": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-arm64-msvc/-/oxide-win32-arm64-msvc-4.3.3.tgz",
      "integrity": "sha512-3rc292Ca2ceK6Ulcc/bAVnTs/3nDtoPhyEKlgPv+yQJQi/JS/AMJlqzxvlDacL1nekbrcf6bTqp/jV4qgnPxNQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-win32-x64-msvc": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-x64-msvc/-/oxide-win32-x64-msvc-4.3.3.tgz",
      "integrity": "sha512-yJ0pwIVc/nYeGoV02WtsN8KYyLQv7kyI2wDnkezyJlGGjkd4QLwDGAwl47YpPJeuI0M0ObaXGSPjvWDPeTPggw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/vite": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/vite/-/vite-4.3.3.tgz",
      "integrity": "sha512-yYU8cogLeSh/ms2jh8Fj7jaba/EWa7Ja6GoUqYZaraEuCI5YS6ms6ObZgjjedm+jm6XZjdNRWBpPP6Z86oOxcw==",
      "license": "MIT",
      "dependencies": {
        "@tailwindcss/node": "4.3.3",
        "@tailwindcss/oxide": "4.3.3",
        "tailwindcss": "4.3.3"
      },
      "peerDependencies": {
        "vite": "^5.2.0 || ^6 || ^7 || ^8"
      }
    },
    "node_modules/@types/babel__core": {
      "version": "7.20.5",
      "resolved": "https://registry.npmjs.org/@types/babel__core/-/babel__core-7.20.5.tgz",
      "integrity": "sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==",
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.20.7",
        "@babel/types": "^7.20.7",
        "@types/babel__generator": "*",
        "@types/babel__template": "*",
        "@types/babel__traverse": "*"
      }
    },
    "node_modules/@types/babel__generator": {
      "version": "7.27.0",
      "resolved": "https://registry.npmjs.org/@types/babel__generator/-/babel__generator-7.27.0.tgz",
      "integrity": "sha512-ufFd2Xi92OAVPYsy+P4n7/U7e68fex0+Ee8gSG9KX7eo084CWiQ4sdxktvdl0bOPupXtVJPY19zk6EwWqUQ8lg==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.0.0"
      }
    },
    "node_modules/@types/babel__template": {
      "version": "7.4.4",
      "resolved": "https://registry.npmjs.org/@types/babel__template/-/babel__template-7.4.4.tgz",
      "integrity": "sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==",
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.1.0",
        "@babel/types": "^7.0.0"
      }
    },
    "node_modules/@types/babel__traverse": {
      "version": "7.28.0",
      "resolved": "https://registry.npmjs.org/@types/babel__traverse/-/babel__traverse-7.28.0.tgz",
      "integrity": "sha512-8PvcXf70gTDZBgt9ptxJ8elBeBjcLOAcOtoO/mPJjtji1+CdGbHgm77om1GrsPxsiE+uXIpNSK64UYaIwQXd4Q==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.28.2"
      }
    },
    "node_modules/@types/debug": {
      "version": "4.1.13",
      "resolved": "https://registry.npmjs.org/@types/debug/-/debug-4.1.13.tgz",
      "integrity": "sha512-KSVgmQmzMwPlmtljOomayoR89W4FynCAi3E8PPs7vmDVPe84hT+vGPKkJfThkmXs0x0jAaa9U8uW8bbfyS2fWw==",
      "license": "MIT",
      "dependencies": {
        "@types/ms": "*"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
      "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
      "license": "MIT"
    },
    "node_modules/@types/estree-jsx": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/@types/estree-jsx/-/estree-jsx-1.0.5.tgz",
      "integrity": "sha512-52CcUVNFyfb1A2ALocQw/Dd1BQFNmSdkuC3BkZ6iqhdMfQz7JWOFRuJFloOzjk+6WijU56m9oKXFAXc7o3Towg==",
      "license": "MIT",
      "dependencies": {
        "@types/estree": "*"
      }
    },
    "node_modules/@types/geojson": {
      "version": "7946.0.16",
      "resolved": "https://registry.npmjs.org/@types/geojson/-/geojson-7946.0.16.tgz",
      "integrity": "sha512-6C8nqWur3j98U6+lXDfTUWIfgvZU+EumvpHKcYjujKH7woYyLj2sUmff0tRhrqM7BohUw7Pz3ZB1jj2gW9Fvmg==",
      "license": "MIT"
    },
    "node_modules/@types/hast": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/@types/hast/-/hast-3.0.5.tgz",
      "integrity": "sha512-rp/ezSWaD1m44dPKICGhiskI13nVr7qTloFwDa/IYkhhf5nzwP+zIQcIJh3WIFSBOy/H1PzB40jPjMDksN4F+g==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "*"
      }
    },
    "node_modules/@types/leaflet": {
      "version": "1.9.22",
      "resolved": "https://registry.npmjs.org/@types/leaflet/-/leaflet-1.9.22.tgz",
      "integrity": "sha512-h3lhECYEKDasG7LFHu+GiHqAvsgLuQvlJvVZzJDGONo3sEL+wUOqSFLnwkZlK0qVxnxbuGFW8iBlJNYs5wgndA==",
      "license": "MIT",
      "dependencies": {
        "@types/geojson": "*"
      }
    },
    "node_modules/@types/mdast": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/@types/mdast/-/mdast-4.0.4.tgz",
      "integrity": "sha512-kGaNbPh1k7AFzgpud/gMdvIm5xuECykRR+JnWKQno9TAXVa6WIVCGTPvYGekIDL4uwCZQSYbUxNBSb1aUo79oA==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "*"
      }
    },
    "node_modules/@types/ms": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@types/ms/-/ms-2.1.0.tgz",
      "integrity": "sha512-GsCCIZDE/p3i96vtEqx+7dBUGXrc7zeSK3wwPHIaRThS+9OhWIXRqzs4d6k1SVU8g91DrNRWxWUGhp5KXQb2VA==",
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "22.20.1",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.20.1.tgz",
      "integrity": "sha512-EANqOCF9QFyra+4pfxUcX9STKJpCLjMbObVzljIJomAWSnuSIEAvyzEU53GaajbXJEgdh0iEcPL+DGvpUd4k1Q==",
      "devOptional": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/react": {
      "version": "19.2.18",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.2.18.tgz",
      "integrity": "sha512-AnzbBERsrLKtk2XSfTbYRLjQPdy116Sty4q+T+Bp3IC4l6jNBvreVPAHmpq9qhXQM7CXZPjLVmGMw9sy+hxQ3w==",
      "license": "MIT",
      "dependencies": {
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "19.2.4",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.2.4.tgz",
      "integrity": "sha512-Bsc+QHgp+P/F02XDzNCY9jnZNCUuLki36KT7VKrTXXLdHf+vHMNZnW1rVu5DNW/rCK+fya3DATySbLM4yhtKUw==",
      "devOptional": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^19.2.0"
      }
    },
    "node_modules/@types/unist": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/@types/unist/-/unist-3.0.3.tgz",
      "integrity": "sha512-ko/gIFJRv177XgZsZcBwnqJN5x/Gien8qNOn0D5bQU/zAzVf9Zt3BlcUiLqhV9y4ARk0GbT3tnUiPNgnTXzc/Q==",
      "license": "MIT"
    },
    "node_modules/@ungap/structured-clone": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@ungap/structured-clone/-/structured-clone-1.3.3.tgz",
      "integrity": "sha512-60YRaenCQcVjYEKOcG824+DRGGIQ3VKErcBoAEDJZz5bKIs2ZG+X/H9Nk+Q6EVkwJk5QNApxbrc5QtBSwtrXAg==",
      "license": "ISC"
    },
    "node_modules/@vercel/oidc": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/@vercel/oidc/-/oidc-3.2.0.tgz",
      "integrity": "sha512-UycprH3T6n3jH0k44NHMa7pnFHGu/N05MjojYr+Mc6I7obkoLIJujSWwin1pCvdy/eOxrI/l3uDLQsmcrOb4ug==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@vitejs/plugin-react": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-5.2.0.tgz",
      "integrity": "sha512-YmKkfhOAi3wsB1PhJq5Scj3GXMn3WvtQ/JC0xoopuHoXSdmtdStOpFrYaT1kie2YgFBcIe64ROzMYRjCrYOdYw==",
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.29.0",
        "@babel/plugin-transform-react-jsx-self": "^7.27.1",
        "@babel/plugin-transform-react-jsx-source": "^7.27.1",
        "@rolldown/pluginutils": "1.0.0-rc.3",
        "@types/babel__core": "^7.20.5",
        "react-refresh": "^0.18.0"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "peerDependencies": {
        "vite": "^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0"
      }
    },
    "node_modules/@workflow/serde": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/@workflow/serde/-/serde-4.1.0.tgz",
      "integrity": "sha512-pav4F2BoirECWR7Nf1TKt+2eETcBj7jj4cBefQ8VXQCA6NPkaKeLfj/zMgi+3zYV5ZIBT4GuUiphsj0/b9hPQQ==",
      "license": "Apache-2.0"
    },
    "node_modules/ai": {
      "version": "7.0.77",
      "resolved": "https://registry.npmjs.org/ai/-/ai-7.0.77.tgz",
      "integrity": "sha512-muLtBSTAUCreR77L16w4AFBiX2gK/RNt84EKp8m03SN9+MfNlC5EGqYYttRjYKV3xe0a33yj1Zawj1EnjejIWw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@ai-sdk/gateway": "4.0.62",
        "@ai-sdk/provider": "4.0.7",
        "@ai-sdk/provider-utils": "5.0.29"
      },
      "engines": {
        "node": ">=22"
      },
      "peerDependencies": {
        "zod": "^3.25.76 || ^4.1.8"
      }
    },
    "node_modules/aria-hidden": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/aria-hidden/-/aria-hidden-1.2.6.tgz",
      "integrity": "sha512-ik3ZgC9dY/lYVVM++OISsaYDeg1tb0VtP5uL3ouh1koGOaUMDPpbFIei4JkFimWUFPn90sbMNMXQAIVOlnYKJA==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/assistant-cloud": {
      "version": "0.1.41",
      "resolved": "https://registry.npmjs.org/assistant-cloud/-/assistant-cloud-0.1.41.tgz",
      "integrity": "sha512-lrH9USOoNaAWAAbujeHa/PEiWoqNQHjIPIAeeA3y3GUXOdlmTjIyR/7GbEZBKbHhm1Lyt7aAYKvdxHFkhuEbJw==",
      "license": "MIT",
      "dependencies": {
        "assistant-stream": "^0.3.38"
      }
    },
    "node_modules/assistant-stream": {
      "version": "0.3.39",
      "resolved": "https://registry.npmjs.org/assistant-stream/-/assistant-stream-0.3.39.tgz",
      "integrity": "sha512-Ad28saCwQxqaB69w4WNaS3uW5OW5BgTYnzTfbgFnz1CPXZjcWFsMrHhcJUpR4+lfYPTNal0oHEb47VUZH4Zz1g==",
      "license": "MIT",
      "dependencies": {
        "@standard-schema/spec": "^1.1.0",
        "nanoid": "^6.0.1",
        "secure-json-parse": "^4.1.0"
      },
      "peerDependencies": {
        "ioredis": "^5.10.1 || ^6.0.0",
        "redis": "^5.12.1"
      },
      "peerDependenciesMeta": {
        "ioredis": {
          "optional": true
        },
        "redis": {
          "optional": true
        }
      }
    },
    "node_modules/assistant-stream/node_modules/nanoid": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-6.0.1.tgz",
      "integrity": "sha512-3wVS3i51pE2pi1k5FFL/95BGfVS0kSsvDVuGXHOtxox/TywUmtgq+3qiTOTbs9J7KfHaXPiN171k/A6dBnaXFw==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.js"
      },
      "engines": {
        "node": "^22 || ^24 || >=26"
      }
    },
    "node_modules/autoprefixer": {
      "version": "10.5.4",
      "resolved": "https://registry.npmjs.org/autoprefixer/-/autoprefixer-10.5.4.tgz",
      "integrity": "sha512-MaU0U/za7N3r6brxD4YB/l4NSrFzLPlANv6wEuQVaIPlD3L4W9rFcQPbL/EilY9BHhHvhfcz3gInDLrEtWT4EA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/autoprefixer"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "browserslist": "^4.28.6",
        "caniuse-lite": "^1.0.30001806",
        "fraction.js": "^5.3.4",
        "picocolors": "^1.1.1",
        "postcss-value-parser": "^4.2.0"
      },
      "bin": {
        "autoprefixer": "bin/autoprefixer"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      },
      "peerDependencies": {
        "postcss": "^8.1.0"
      }
    },
    "node_modules/bail": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/bail/-/bail-2.0.2.tgz",
      "integrity": "sha512-0xO6mYd7JB2YesxDKplafRpsiOzPt9V02ddPCLbY1xYGPOX24NTyN50qnUxgCPcSoYMhKpAuBTjQoRZCAkUDRw==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.11.16",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.11.16.tgz",
      "integrity": "sha512-H/bNPUFHewJHyCTdjn1n3Pit5+2GmWT6mmeHImPX+8MA9NA6b67jO4gYmi4jTbCJb2otq34KMZnovndDPqJwhQ==",
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.8",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.8.tgz",
      "integrity": "sha512-V2NpofLblG64mfOtSgDhOJESZEGogzDMBv/q+W6oc4LXWP/q75eOXoOaaOu1EOadB9U4Bwx/e0yzbvwKH8zalA==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "baseline-browser-mapping": "^2.11.12",
        "caniuse-lite": "^1.0.30001809",
        "electron-to-chromium": "^1.5.402",
        "node-releases": "^2.0.53",
        "update-browserslist-db": "^1.3.0"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001809",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001809.tgz",
      "integrity": "sha512-xxWVywk6a6Arlk+hymeycyn/VgqEfLDxupvhH/xiY5SJ/18kmi9o6MiO320DCUzypORHLtvh0I4i04tUhCNHNQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/ccount": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/ccount/-/ccount-2.0.1.tgz",
      "integrity": "sha512-eyrF0jiFpY+3drT6383f1qhkbGsLSifNAjA61IUjZjmLCWjItY6LB9ft9YhoDgwfmclB2zhu51Lc7+95b8NRAg==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/character-entities": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/character-entities/-/character-entities-2.0.2.tgz",
      "integrity": "sha512-shx7oQ0Awen/BRIdkjkvz54PnEEI/EjwXDSIZp86/KKdbafHh1Df/RYGBhn4hbe2+uKC9FnT5UCEdyPz3ai9hQ==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/character-entities-html4": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/character-entities-html4/-/character-entities-html4-2.1.0.tgz",
      "integrity": "sha512-1v7fgQRj6hnSwFpq1Eu0ynr/CDEw0rXo2B61qXrLNdHZmPKgb7fqS1a2JwF0rISo9q77jDI8VMEHoApn8qDoZA==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/character-entities-legacy": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/character-entities-legacy/-/character-entities-legacy-3.0.0.tgz",
      "integrity": "sha512-RpPp0asT/6ufRm//AJVwpViZbGM/MkjQFxJccQRHmISF/22NBtsHqAWmL+/pmkPWoIUJdWyeVleTl1wydHATVQ==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/character-reference-invalid": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/character-reference-invalid/-/character-reference-invalid-2.0.1.tgz",
      "integrity": "sha512-iBZ4F4wRbyORVsu0jPV7gXkOsGYjGHPmAyv+HiHG8gi5PtC9KI2j1+v8/tlibRvjoWX027ypmG/n0HtO5t7unw==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/classnames": {
      "version": "2.5.1",
      "resolved": "https://registry.npmjs.org/classnames/-/classnames-2.5.1.tgz",
      "integrity": "sha512-saHYOzhIQs6wy2sVxTM6bUDsQO4F50V9RQ22qBpEdCW+I+/Wmke2HOl6lS6dTpdxVhb88/I6+Hs+438c3lfUow==",
      "license": "MIT"
    },
    "node_modules/comma-separated-tokens": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/comma-separated-tokens/-/comma-separated-tokens-2.0.3.tgz",
      "integrity": "sha512-Fu4hJdvzeylCfQPp9SGWidpzrMs7tTrlu6Vb8XGaRGck8QSNZJJp538Wrb60Lax4fPwR64ViY468OIUTbRlGZg==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "license": "MIT"
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "license": "MIT"
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decode-named-character-reference": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/decode-named-character-reference/-/decode-named-character-reference-1.3.0.tgz",
      "integrity": "sha512-GtpQYB283KrPp6nRw50q3U9/VfOutZOe103qlN7BPP6Ad27xYnOIWv4lPzo8HCAL+mMZofJ9KEy30fq6MfaK6Q==",
      "license": "MIT",
      "dependencies": {
        "character-entities": "^2.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/dequal": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/dequal/-/dequal-2.0.3.tgz",
      "integrity": "sha512-0je+qPKHEMohvfRTCEo3CrPG6cAzAYgmzKyxRiYSSDkS6eGJdyVJm7WaYA5ECaAD9wLB2T4EEeymA5aFVcYXCA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/detect-node-es": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/detect-node-es/-/detect-node-es-1.1.0.tgz",
      "integrity": "sha512-ypdmJU/TbBby2Dxibuv7ZLW3Bs1QEmM7nHjEANfohJLvE0XVujisn1qPJcZxg+qDucsr+bP6fLD1rPS3AhJ7EQ==",
      "license": "MIT"
    },
    "node_modules/devlop": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/devlop/-/devlop-1.1.0.tgz",
      "integrity": "sha512-RWmIqhcFf1lRYBvNmr7qTNuyCt/7/ns2jbpp1+PalgE/rDQcBT0fioSMUpJ93irlUhC5hrg4cYqe6U+0ImW0rA==",
      "license": "MIT",
      "dependencies": {
        "dequal": "^2.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.411",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.411.tgz",
      "integrity": "sha512-gglkxzokjHfawpGxq75XdBV2/l3BAPzrsMs70qgaZdTW5rpV1tC4MdgJVP9fN126bODA4ZJQkn1wryEzJyQXIg==",
      "license": "ISC"
    },
    "node_modules/enhanced-resolve": {
      "version": "5.24.5",
      "resolved": "https://registry.npmjs.org/enhanced-resolve/-/enhanced-resolve-5.24.5.tgz",
      "integrity": "sha512-L1l8TNvomm6UVW5B253AGxQagSQr+vGwhMlrrfRS2qmhx46AMpMVJKQYLvWYbysTMY8VoicOvzHzoHMbyzB+4A==",
      "license": "MIT",
      "dependencies": {
        "graceful-fs": "^4.2.4",
        "tapable": "^2.3.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/esbuild": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.25.12.tgz",
      "integrity": "sha512-bbPBYYrtZbkt6Os6FiTLCTFxvq4tt3JKall1vRwshA3fdVztsLAatFaZobhkBC8/BrPetoa0oksYoKXoG4ryJg==",
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.25.12",
        "@esbuild/android-arm": "0.25.12",
        "@esbuild/android-arm64": "0.25.12",
        "@esbuild/android-x64": "0.25.12",
        "@esbuild/darwin-arm64": "0.25.12",
        "@esbuild/darwin-x64": "0.25.12",
        "@esbuild/freebsd-arm64": "0.25.12",
        "@esbuild/freebsd-x64": "0.25.12",
        "@esbuild/linux-arm": "0.25.12",
        "@esbuild/linux-arm64": "0.25.12",
        "@esbuild/linux-ia32": "0.25.12",
        "@esbuild/linux-loong64": "0.25.12",
        "@esbuild/linux-mips64el": "0.25.12",
        "@esbuild/linux-ppc64": "0.25.12",
        "@esbuild/linux-riscv64": "0.25.12",
        "@esbuild/linux-s390x": "0.25.12",
        "@esbuild/linux-x64": "0.25.12",
        "@esbuild/netbsd-arm64": "0.25.12",
        "@esbuild/netbsd-x64": "0.25.12",
        "@esbuild/openbsd-arm64": "0.25.12",
        "@esbuild/openbsd-x64": "0.25.12",
        "@esbuild/openharmony-arm64": "0.25.12",
        "@esbuild/sunos-x64": "0.25.12",
        "@esbuild/win32-arm64": "0.25.12",
        "@esbuild/win32-ia32": "0.25.12",
        "@esbuild/win32-x64": "0.25.12"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-string-regexp": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-5.0.0.tgz",
      "integrity": "sha512-/veY75JbMK4j1yjvuUxuVsiS/hr/4iHs9FTT6cgTexxdE0Ly/glccBAkloH/DofkjRbZU3bnoj38mOmhkZ0lHw==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/estree-util-is-identifier-name": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/estree-util-is-identifier-name/-/estree-util-is-identifier-name-3.0.0.tgz",
      "integrity": "sha512-hFtqIDZTIUZ9BXLb8y4pYGyk6+wekIivNVTcmvk8NoOh+VeRn5y6cEHzbURrWbfp1fIqdVipilzj+lfaadNZmg==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/eventsource-parser": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/eventsource-parser/-/eventsource-parser-3.1.1.tgz",
      "integrity": "sha512-EKN1vKAMcZ8MlYMpaNuxN6R9yakzH6uajHcHVTqWJzvu5pWw9DyhbP35HH8MVBQ+dZjAfDxk+A8NiR9KWaXiyQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/extend": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend/-/extend-3.0.2.tgz",
      "integrity": "sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g==",
      "license": "MIT"
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/fraction.js": {
      "version": "5.3.4",
      "resolved": "https://registry.npmjs.org/fraction.js/-/fraction.js-5.3.4.tgz",
      "integrity": "sha512-1X1NTtiJphryn/uLQz3whtY6jK3fTqoE3ohKs0tT+Ujr1W59oopxmoEh7Lu5p6vBaPbgoM0bzveAW4Qi5RyWDQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "*"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/rawify"
      }
    },
    "node_modules/framer-motion": {
      "version": "12.43.0",
      "resolved": "https://registry.npmjs.org/framer-motion/-/framer-motion-12.43.0.tgz",
      "integrity": "sha512-1eaL3RvR/kAlbG7UYcpMptEyzPoENO0c6w7ZnB3/hh2vSAz/6uGAFn6fdoqTBguNstf3MsFhJHsD/0DHiclG+g==",
      "license": "MIT",
      "dependencies": {
        "motion-dom": "^12.43.0",
        "motion-utils": "^12.39.0",
        "tslib": "^2.4.0"
      },
      "peerDependencies": {
        "@emotion/is-prop-valid": "*",
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@emotion/is-prop-valid": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-nonce": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-nonce/-/get-nonce-1.0.1.tgz",
      "integrity": "sha512-FJhYRoDaiatfEkUK8HKlicmu/3SGFD51q3itKDGoSTysQJBnfOcxU5GxnhE1E6soB76MbT0MBtnKJuXyAx+96Q==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "license": "ISC"
    },
    "node_modules/hast-util-to-jsx-runtime": {
      "version": "2.3.6",
      "resolved": "https://registry.npmjs.org/hast-util-to-jsx-runtime/-/hast-util-to-jsx-runtime-2.3.6.tgz",
      "integrity": "sha512-zl6s8LwNyo1P9uw+XJGvZtdFF1GdAkOg8ujOw+4Pyb76874fLps4ueHXDhXWdk6YHQ6OgUtinliG7RsYvCbbBg==",
      "license": "MIT",
      "dependencies": {
        "@types/estree": "^1.0.0",
        "@types/hast": "^3.0.0",
        "@types/unist": "^3.0.0",
        "comma-separated-tokens": "^2.0.0",
        "devlop": "^1.0.0",
        "estree-util-is-identifier-name": "^3.0.0",
        "hast-util-whitespace": "^3.0.0",
        "mdast-util-mdx-expression": "^2.0.0",
        "mdast-util-mdx-jsx": "^3.0.0",
        "mdast-util-mdxjs-esm": "^2.0.0",
        "property-information": "^7.0.0",
        "space-separated-tokens": "^2.0.0",
        "style-to-js": "^1.0.0",
        "unist-util-position": "^5.0.0",
        "vfile-message": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/hast-util-whitespace": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/hast-util-whitespace/-/hast-util-whitespace-3.0.0.tgz",
      "integrity": "sha512-88JUN06ipLwsnv+dVn+OIYOvAuvBMy/Qoi6O7mQHxdPXpjy+Cd6xRkWwux7DKO+4sYILtLBRIKgsdpS2gQc7qw==",
      "license": "MIT",
      "dependencies": {
        "@types/hast": "^3.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/html-url-attributes": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/html-url-attributes/-/html-url-attributes-3.0.1.tgz",
      "integrity": "sha512-ol6UPyBWqsrO6EJySPz2O7ZSr856WDrEzM5zMqp+FJJLGMW35cLYmmZnl0vztAZxRUoNZJFTCohfjuIJ8I4QBQ==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/inline-style-parser": {
      "version": "0.2.7",
      "resolved": "https://registry.npmjs.org/inline-style-parser/-/inline-style-parser-0.2.7.tgz",
      "integrity": "sha512-Nb2ctOyNR8DqQoR0OwRG95uNWIC0C1lCgf5Naz5H6Ji72KZ8OcFZLz2P5sNgwlyoJ8Yif11oMuYs5pBQa86csA==",
      "license": "MIT"
    },
    "node_modules/is-alphabetical": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-alphabetical/-/is-alphabetical-2.0.1.tgz",
      "integrity": "sha512-FWyyY60MeTNyeSRpkM2Iry0G9hpr7/9kD40mD/cGQEuilcZYS4okz8SN2Q6rLCJ8gbCt6fN+rC+6tMGS99LaxQ==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/is-alphanumerical": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-alphanumerical/-/is-alphanumerical-2.0.1.tgz",
      "integrity": "sha512-hmbYhX/9MUMF5uh7tOXyK/n0ZvWpad5caBA17GsC6vyuCqaWliRG5K1qS9inmUhEMaOBIW7/whAnSwveW/LtZw==",
      "license": "MIT",
      "dependencies": {
        "is-alphabetical": "^2.0.0",
        "is-decimal": "^2.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/is-decimal": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-decimal/-/is-decimal-2.0.1.tgz",
      "integrity": "sha512-AAB9hiomQs5DXWcRB1rqsxGUstbRroFOPPVAomNk/3XHR5JyEZChOyTWe2oayKnsSsr/kcGqF+z6yuH6HHpN0A==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/is-hexadecimal": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-hexadecimal/-/is-hexadecimal-2.0.1.tgz",
      "integrity": "sha512-DgZQp241c8oO6cA1SbTEWiXeoxV42vlcJxgH+B3hi1AiqqKruZR3ZGF8In3fj4+/y/7rHvlOZLZtgJ/4ttYGZg==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/is-plain-obj": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/is-plain-obj/-/is-plain-obj-4.1.0.tgz",
      "integrity": "sha512-+Pgi+vMuUNkJyExiMBt5IlFoMyKnr5zhJ4Uspz58WOhBF5QoIZkFyNHIbBAtHwzVAgk5RtndVNsDRN61/mmDqg==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/jiti": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-2.7.0.tgz",
      "integrity": "sha512-AC/7JofJvZGrrneWNaEnJeOLUx+JlGt7tNa0wZiRPT4MY1wmfKjt2+6O2p2uz2+skll8OZZmJMNqeke7kKbNgQ==",
      "license": "MIT",
      "bin": {
        "jiti": "lib/jiti-cli.mjs"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "license": "MIT"
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-schema": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/json-schema/-/json-schema-0.4.0.tgz",
      "integrity": "sha512-es94M3nTIfsEPisRafak+HDLfHXnKBhV3vU5eqPcS3flIWqcxJWgXHXiey3YrpaNsanY5ei1VoYEbOzijuq9BA==",
      "license": "(AFL-2.1 OR BSD-3-Clause)"
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/leaflet": {
      "version": "1.9.4",
      "resolved": "https://registry.npmjs.org/leaflet/-/leaflet-1.9.4.tgz",
      "integrity": "sha512-nxS1ynzJOmOlHp+iL3FyWqK89GtNL8U8rvlMOsQdTTssxZwCXh8N2NB3GDQOL+YR3XnWyZAxwQixURb+FA74PA==",
      "license": "BSD-2-Clause"
    },
    "node_modules/lightningcss": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.32.0.tgz",
      "integrity": "sha512-NXYBzinNrblfraPGyrbPoD19C1h9lfI/1mzgWYvXUTe414Gz/X1FD2XBZSZM7rRTrMA8JL3OtAaGifrIKhQ5yQ==",
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.32.0",
        "lightningcss-darwin-arm64": "1.32.0",
        "lightningcss-darwin-x64": "1.32.0",
        "lightningcss-freebsd-x64": "1.32.0",
        "lightningcss-linux-arm-gnueabihf": "1.32.0",
        "lightningcss-linux-arm64-gnu": "1.32.0",
        "lightningcss-linux-arm64-musl": "1.32.0",
        "lightningcss-linux-x64-gnu": "1.32.0",
        "lightningcss-linux-x64-musl": "1.32.0",
        "lightningcss-win32-arm64-msvc": "1.32.0",
        "lightningcss-win32-x64-msvc": "1.32.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.32.0.tgz",
      "integrity": "sha512-YK7/ClTt4kAK0vo6w3X+Pnm0D2cf2vPHbhOXdoNti1Ga0al1P4TBZhwjATvjNwLEBCnKvjJc2jQgHXH0NEwlAg==",
      "cpu": [
        "arm64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.32.0.tgz",
      "integrity": "sha512-RzeG9Ju5bag2Bv1/lwlVJvBE3q6TtXskdZLLCyfg5pt+HLz9BqlICO7LZM7VHNTTn/5PRhHFBSjk5lc4cmscPQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.32.0.tgz",
      "integrity": "sha512-U+QsBp2m/s2wqpUYT/6wnlagdZbtZdndSmut/NJqlCcMLTWp5muCrID+K5UJ6jqD2BFshejCYXniPDbNh73V8w==",
      "cpu": [
        "x64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.32.0.tgz",
      "integrity": "sha512-JCTigedEksZk3tHTTthnMdVfGf61Fky8Ji2E4YjUTEQX14xiy/lTzXnu1vwiZe3bYe0q+SpsSH/CTeDXK6WHig==",
      "cpu": [
        "x64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.32.0.tgz",
      "integrity": "sha512-x6rnnpRa2GL0zQOkt6rts3YDPzduLpWvwAF6EMhXFVZXD4tPrBkEFqzGowzCsIWsPjqSK+tyNEODUBXeeVHSkw==",
      "cpu": [
        "arm"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.32.0.tgz",
      "integrity": "sha512-0nnMyoyOLRJXfbMOilaSRcLH3Jw5z9HDNGfT/gwCPgaDjnx0i8w7vBzFLFR1f6CMLKF8gVbebmkUN3fa/kQJpQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.32.0.tgz",
      "integrity": "sha512-UpQkoenr4UJEzgVIYpI80lDFvRmPVg6oqboNHfoH4CQIfNA+HOrZ7Mo7KZP02dC6LjghPQJeBsvXhJod/wnIBg==",
      "cpu": [
        "arm64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.32.0.tgz",
      "integrity": "sha512-V7Qr52IhZmdKPVr+Vtw8o+WLsQJYCTd8loIfpDaMRWGUZfBOYEJeyJIkqGIDMZPwPx24pUMfwSxxI8phr/MbOA==",
      "cpu": [
        "x64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.32.0.tgz",
      "integrity": "sha512-bYcLp+Vb0awsiXg/80uCRezCYHNg1/l3mt0gzHnWV9XP1W5sKa5/TCdGWaR/zBM2PeF/HbsQv/j2URNOiVuxWg==",
      "cpu": [
        "x64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.32.0.tgz",
      "integrity": "sha512-8SbC8BR40pS6baCM8sbtYDSwEVQd4JlFTOlaD3gWGHfThTcABnNDBda6eTZeqbofalIJhFx0qKzgHJmcPTnGdw==",
      "cpu": [
        "arm64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.32.0.tgz",
      "integrity": "sha512-Amq9B/SoZYdDi1kFrojnoqPLxYhQ4Wo5XiL8EVJrVsB8ARoC1PWW6VGtT0WKCemjy8aC+louJnjS7U18x3b06Q==",
      "cpu": [
        "x64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/longest-streak": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/longest-streak/-/longest-streak-3.1.0.tgz",
      "integrity": "sha512-9Ri+o0JYgehTaVBBDoMqIl8GXtbWg711O3srftcHhZ0dqnETqLaoIK0x17fUw9rFSlK/0NlsKe0Ahhyl5pXE2g==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/lucide-react": {
      "version": "0.546.0",
      "resolved": "https://registry.npmjs.org/lucide-react/-/lucide-react-0.546.0.tgz",
      "integrity": "sha512-Z94u6fKT43lKeYHiVyvyR8fT7pwCzDu7RyMPpTvh054+xahSgj4HFQ+NmflvzdXsoAjYGdCguGaFKYuvq0ThCQ==",
      "license": "ISC",
      "peerDependencies": {
        "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/magic-string": {
      "version": "0.30.21",
      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
      "integrity": "sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.5"
      }
    },
    "node_modules/markdown-table": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/markdown-table/-/markdown-table-3.0.4.tgz",
      "integrity": "sha512-wiYz4+JrLyb/DqW2hkFJxP7Vd7JuTDm77fvbM8VfEQdmSMqcImWeeRbHwZjBjIFki/VaMK2BhFi7oUUZeM5bqw==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/mdast-util-find-and-replace": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/mdast-util-find-and-replace/-/mdast-util-find-and-replace-3.0.2.tgz",
      "integrity": "sha512-Tmd1Vg/m3Xz43afeNxDIhWRtFZgM2VLyaf4vSTYwudTyeuTneoL3qtWMA5jeLyz/O1vDJmmV4QuScFCA2tBPwg==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "escape-string-regexp": "^5.0.0",
        "unist-util-is": "^6.0.0",
        "unist-util-visit-parents": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-from-markdown": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/mdast-util-from-markdown/-/mdast-util-from-markdown-2.0.3.tgz",
      "integrity": "sha512-W4mAWTvSlKvf8L6J+VN9yLSqQ9AOAAvHuoDAmPkz4dHf553m5gVj2ejadHJhoJmcmxEnOv6Pa8XJhpxE93kb8Q==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "@types/unist": "^3.0.0",
        "decode-named-character-reference": "^1.0.0",
        "devlop": "^1.0.0",
        "mdast-util-to-string": "^4.0.0",
        "micromark": "^4.0.0",
        "micromark-util-decode-numeric-character-reference": "^2.0.0",
        "micromark-util-decode-string": "^2.0.0",
        "micromark-util-normalize-identifier": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0",
        "unist-util-stringify-position": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm/-/mdast-util-gfm-3.1.0.tgz",
      "integrity": "sha512-0ulfdQOM3ysHhCJ1p06l0b0VKlhU0wuQs3thxZQagjcjPrlFRqY215uZGHHJan9GEAXd9MbfPjFJz+qMkVR6zQ==",
      "license": "MIT",
      "dependencies": {
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-gfm-autolink-literal": "^2.0.0",
        "mdast-util-gfm-footnote": "^2.0.0",
        "mdast-util-gfm-strikethrough": "^2.0.0",
        "mdast-util-gfm-table": "^2.0.0",
        "mdast-util-gfm-task-list-item": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm-autolink-literal": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm-autolink-literal/-/mdast-util-gfm-autolink-literal-2.0.1.tgz",
      "integrity": "sha512-5HVP2MKaP6L+G6YaxPNjuL0BPrq9orG3TsrZ9YXbA3vDw/ACI4MEsnoDpn6ZNm7GnZgtAcONJyPhOP8tNJQavQ==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "ccount": "^2.0.0",
        "devlop": "^1.0.0",
        "mdast-util-find-and-replace": "^3.0.0",
        "micromark-util-character": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm-footnote": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm-footnote/-/mdast-util-gfm-footnote-2.1.0.tgz",
      "integrity": "sha512-sqpDWlsHn7Ac9GNZQMeUzPQSMzR6Wv0WKRNvQRg0KqHh02fpTz69Qc1QSseNX29bhz1ROIyNyxExfawVKTm1GQ==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "devlop": "^1.1.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0",
        "micromark-util-normalize-identifier": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm-strikethrough": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm-strikethrough/-/mdast-util-gfm-strikethrough-2.0.0.tgz",
      "integrity": "sha512-mKKb915TF+OC5ptj5bJ7WFRPdYtuHv0yTRxK2tJvi+BDqbkiG7h7u/9SI89nRAYcmap2xHQL9D+QG/6wSrTtXg==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm-table": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm-table/-/mdast-util-gfm-table-2.0.0.tgz",
      "integrity": "sha512-78UEvebzz/rJIxLvE7ZtDd/vIQ0RHv+3Mh5DR96p7cS7HsBhYIICDBCu8csTNWNO6tBWfqXPWekRuj2FNOGOZg==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "markdown-table": "^3.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm-task-list-item": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm-task-list-item/-/mdast-util-gfm-task-list-item-2.0.0.tgz",
      "integrity": "sha512-IrtvNvjxC1o06taBAVJznEnkiHxLFTzgonUdy8hzFVeDun0uTjxxrRGVaNFqkU1wJR3RBPEfsxmU6jDWPofrTQ==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-mdx-expression": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/mdast-util-mdx-expression/-/mdast-util-mdx-expression-2.0.1.tgz",
      "integrity": "sha512-J6f+9hUp+ldTZqKRSg7Vw5V6MqjATc+3E4gf3CFNcuZNWD8XdyI6zQ8GqH7f8169MM6P7hMBRDVGnn7oHB9kXQ==",
      "license": "MIT",
      "dependencies": {
        "@types/estree-jsx": "^1.0.0",
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-mdx-jsx": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/mdast-util-mdx-jsx/-/mdast-util-mdx-jsx-3.2.0.tgz",
      "integrity": "sha512-lj/z8v0r6ZtsN/cGNNtemmmfoLAFZnjMbNyLzBafjzikOM+glrjNHPlf6lQDOTccj9n5b0PPihEBbhneMyGs1Q==",
      "license": "MIT",
      "dependencies": {
        "@types/estree-jsx": "^1.0.0",
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "@types/unist": "^3.0.0",
        "ccount": "^2.0.0",
        "devlop": "^1.1.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0",
        "parse-entities": "^4.0.0",
        "stringify-entities": "^4.0.0",
        "unist-util-stringify-position": "^4.0.0",
        "vfile-message": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-mdxjs-esm": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/mdast-util-mdxjs-esm/-/mdast-util-mdxjs-esm-2.0.1.tgz",
      "integrity": "sha512-EcmOpxsZ96CvlP03NghtH1EsLtr0n9Tm4lPUJUBccV9RwUOneqSycg19n5HGzCf+10LozMRSObtVr3ee1WoHtg==",
      "license": "MIT",
      "dependencies": {
        "@types/estree-jsx": "^1.0.0",
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-phrasing": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/mdast-util-phrasing/-/mdast-util-phrasing-4.1.0.tgz",
      "integrity": "sha512-TqICwyvJJpBwvGAMZjj4J2n0X8QWp21b9l0o7eXyVJ25YNWYbJDVIyD1bZXE6WtV6RmKJVYmQAKWa0zWOABz2w==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "unist-util-is": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-to-hast": {
      "version": "13.2.1",
      "resolved": "https://registry.npmjs.org/mdast-util-to-hast/-/mdast-util-to-hast-13.2.1.tgz",
      "integrity": "sha512-cctsq2wp5vTsLIcaymblUriiTcZd0CwWtCbLvrOzYCDZoWyMNV8sZ7krj09FSnsiJi3WVsHLM4k6Dq/yaPyCXA==",
      "license": "MIT",
      "dependencies": {
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "@ungap/structured-clone": "^1.0.0",
        "devlop": "^1.0.0",
        "micromark-util-sanitize-uri": "^2.0.0",
        "trim-lines": "^3.0.0",
        "unist-util-position": "^5.0.0",
        "unist-util-visit": "^5.0.0",
        "vfile": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-to-markdown": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/mdast-util-to-markdown/-/mdast-util-to-markdown-2.1.2.tgz",
      "integrity": "sha512-xj68wMTvGXVOKonmog6LwyJKrYXZPvlwabaryTjLh9LuvovB/KAH+kvi8Gjj+7rJjsFi23nkUxRQv1KqSroMqA==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "@types/unist": "^3.0.0",
        "longest-streak": "^3.0.0",
        "mdast-util-phrasing": "^4.0.0",
        "mdast-util-to-string": "^4.0.0",
        "micromark-util-classify-character": "^2.0.0",
        "micromark-util-decode-string": "^2.0.0",
        "unist-util-visit": "^5.0.0",
        "zwitch": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-to-string": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/mdast-util-to-string/-/mdast-util-to-string-4.0.0.tgz",
      "integrity": "sha512-0H44vDimn51F0YwvxSJSm0eCDOJTRlmN0R1yBh4HLj9wiV1Dn0QoXGbvFAWj2hSItVTlCmBF1hqKlIyUBVFLPg==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/micromark/-/micromark-4.0.2.tgz",
      "integrity": "sha512-zpe98Q6kvavpCr1NPVSCMebCKfD7CA2NqZ+rykeNhONIJBpc1tFKt9hucLGwha3jNTNI8lHpctWJWoimVF4PfA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "@types/debug": "^4.0.0",
        "debug": "^4.0.0",
        "decode-named-character-reference": "^1.0.0",
        "devlop": "^1.0.0",
        "micromark-core-commonmark": "^2.0.0",
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-chunked": "^2.0.0",
        "micromark-util-combine-extensions": "^2.0.0",
        "micromark-util-decode-numeric-character-reference": "^2.0.0",
        "micromark-util-encode": "^2.0.0",
        "micromark-util-normalize-identifier": "^2.0.0",
        "micromark-util-resolve-all": "^2.0.0",
        "micromark-util-sanitize-uri": "^2.0.0",
        "micromark-util-subtokenize": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-core-commonmark": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/micromark-core-commonmark/-/micromark-core-commonmark-2.0.3.tgz",
      "integrity": "sha512-RDBrHEMSxVFLg6xvnXmb1Ayr2WzLAWjeSATAoxwKYJV94TeNavgoIdA0a9ytzDSVzBy2YKFK+emCPOEibLeCrg==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "decode-named-character-reference": "^1.0.0",
        "devlop": "^1.0.0",
        "micromark-factory-destination": "^2.0.0",
        "micromark-factory-label": "^2.0.0",
        "micromark-factory-space": "^2.0.0",
        "micromark-factory-title": "^2.0.0",
        "micromark-factory-whitespace": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-chunked": "^2.0.0",
        "micromark-util-classify-character": "^2.0.0",
        "micromark-util-html-tag-name": "^2.0.0",
        "micromark-util-normalize-identifier": "^2.0.0",
        "micromark-util-resolve-all": "^2.0.0",
        "micromark-util-subtokenize": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-extension-gfm": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm/-/micromark-extension-gfm-3.0.0.tgz",
      "integrity": "sha512-vsKArQsicm7t0z2GugkCKtZehqUm31oeGBV/KVSorWSy8ZlNAv7ytjFhvaryUiCUJYqs+NoE6AFhpQvBTM6Q4w==",
      "license": "MIT",
      "dependencies": {
        "micromark-extension-gfm-autolink-literal": "^2.0.0",
        "micromark-extension-gfm-footnote": "^2.0.0",
        "micromark-extension-gfm-strikethrough": "^2.0.0",
        "micromark-extension-gfm-table": "^2.0.0",
        "micromark-extension-gfm-tagfilter": "^2.0.0",
        "micromark-extension-gfm-task-list-item": "^2.0.0",
        "micromark-util-combine-extensions": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-autolink-literal": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-autolink-literal/-/micromark-extension-gfm-autolink-literal-2.1.0.tgz",
      "integrity": "sha512-oOg7knzhicgQ3t4QCjCWgTmfNhvQbDDnJeVu9v81r7NltNCVmhPy1fJRX27pISafdjL+SVc4d3l48Gb6pbRypw==",
      "license": "MIT",
      "dependencies": {
        "micromark-util-character": "^2.0.0",
        "micromark-util-sanitize-uri": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-footnote": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-footnote/-/micromark-extension-gfm-footnote-2.1.0.tgz",
      "integrity": "sha512-/yPhxI1ntnDNsiHtzLKYnE3vf9JZ6cAisqVDauhp4CEHxlb4uoOTxOCJ+9s51bIB8U1N1FJ1RXOKTIlD5B/gqw==",
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-core-commonmark": "^2.0.0",
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-normalize-identifier": "^2.0.0",
        "micromark-util-sanitize-uri": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-strikethrough": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-strikethrough/-/micromark-extension-gfm-strikethrough-2.1.0.tgz",
      "integrity": "sha512-ADVjpOOkjz1hhkZLlBiYA9cR2Anf8F4HqZUO6e5eDcPQd0Txw5fxLzzxnEkSkfnD0wziSGiv7sYhk/ktvbf1uw==",
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-util-chunked": "^2.0.0",
        "micromark-util-classify-character": "^2.0.0",
        "micromark-util-resolve-all": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-table": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-table/-/micromark-extension-gfm-table-2.1.1.tgz",
      "integrity": "sha512-t2OU/dXXioARrC6yWfJ4hqB7rct14e8f7m0cbI5hUmDyyIlwv5vEtooptH8INkbLzOatzKuVbQmAYcbWoyz6Dg==",
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-tagfilter": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-tagfilter/-/micromark-extension-gfm-tagfilter-2.0.0.tgz",
      "integrity": "sha512-xHlTOmuCSotIA8TW1mDIM6X2O1SiX5P9IuDtqGonFhEK0qgRI4yeC6vMxEV2dgyr2TiD+2PQ10o+cOhdVAcwfg==",
      "license": "MIT",
      "dependencies": {
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-task-list-item": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-task-list-item/-/micromark-extension-gfm-task-list-item-2.1.0.tgz",
      "integrity": "sha512-qIBZhqxqI6fjLDYFTBIa4eivDMnP+OZqsNwmQ3xNLE4Cxwc+zfQEfbs6tzAo2Hjq+bh6q5F+Z8/cksrLFYWQQw==",
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-factory-destination": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-factory-destination/-/micromark-factory-destination-2.0.1.tgz",
      "integrity": "sha512-Xe6rDdJlkmbFRExpTOmRj9N3MaWmbAgdpSrBQvCFqhezUn4AHqJHbaEnfbVYYiexVSs//tqOdY/DxhjdCiJnIA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-factory-label": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-factory-label/-/micromark-factory-label-2.0.1.tgz",
      "integrity": "sha512-VFMekyQExqIW7xIChcXn4ok29YE3rnuyveW3wZQWWqF4Nv9Wk5rgJ99KzPvHjkmPXF93FXIbBp6YdW3t71/7Vg==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-factory-space": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-factory-space/-/micromark-factory-space-2.0.1.tgz",
      "integrity": "sha512-zRkxjtBxxLd2Sc0d+fbnEunsTj46SWXgXciZmHq0kDYGnck/ZSGj9/wULTV95uoeYiK5hRXP2mJ98Uo4cq/LQg==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-character": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-factory-title": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-factory-title/-/micromark-factory-title-2.0.1.tgz",
      "integrity": "sha512-5bZ+3CjhAd9eChYTHsjy6TGxpOFSKgKKJPJxr293jTbfry2KDoWkhBb6TcPVB4NmzaPhMs1Frm9AZH7OD4Cjzw==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-factory-whitespace": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-factory-whitespace/-/micromark-factory-whitespace-2.0.1.tgz",
      "integrity": "sha512-Ob0nuZ3PKt/n0hORHyvoD9uZhr+Za8sFoP+OnMcnWK5lngSzALgQYKMr9RJVOWLqQYuyn6ulqGWSXdwf6F80lQ==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-character": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/micromark-util-character/-/micromark-util-character-2.1.1.tgz",
      "integrity": "sha512-wv8tdUTJ3thSFFFJKtpYKOYiGP2+v96Hvk4Tu8KpCAsTMs6yi+nVmGh1syvSCsaxz45J6Jbw+9DD6g97+NV67Q==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-chunked": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-chunked/-/micromark-util-chunked-2.0.1.tgz",
      "integrity": "sha512-QUNFEOPELfmvv+4xiNg2sRYeS/P84pTW0TCgP5zc9FpXetHY0ab7SxKyAQCNCc1eK0459uoLI1y5oO5Vc1dbhA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-symbol": "^2.0.0"
      }
    },
    "node_modules/micromark-util-classify-character": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-classify-character/-/micromark-util-classify-character-2.0.1.tgz",
      "integrity": "sha512-K0kHzM6afW/MbeWYWLjoHQv1sgg2Q9EccHEDzSkxiP/EaagNzCm7T/WMKZ3rjMbvIpvBiZgwR3dKMygtA4mG1Q==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-combine-extensions": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-combine-extensions/-/micromark-util-combine-extensions-2.0.1.tgz",
      "integrity": "sha512-OnAnH8Ujmy59JcyZw8JSbK9cGpdVY44NKgSM7E9Eh7DiLS2E9RNQf0dONaGDzEG9yjEl5hcqeIsj4hfRkLH/Bg==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-chunked": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-decode-numeric-character-reference": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/micromark-util-decode-numeric-character-reference/-/micromark-util-decode-numeric-character-reference-2.0.2.tgz",
      "integrity": "sha512-ccUbYk6CwVdkmCQMyr64dXz42EfHGkPQlBj5p7YVGzq8I7CtjXZJrubAYezf7Rp+bjPseiROqe7G6foFd+lEuw==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-symbol": "^2.0.0"
      }
    },
    "node_modules/micromark-util-decode-string": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-decode-string/-/micromark-util-decode-string-2.0.1.tgz",
      "integrity": "sha512-nDV/77Fj6eH1ynwscYTOsbK7rR//Uj0bZXBwJZRfaLEJ1iGBR6kIfNmlNqaqJf649EP0F3NWNdeJi03elllNUQ==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "decode-named-character-reference": "^1.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-decode-numeric-character-reference": "^2.0.0",
        "micromark-util-symbol": "^2.0.0"
      }
    },
    "node_modules/micromark-util-encode": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-encode/-/micromark-util-encode-2.0.1.tgz",
      "integrity": "sha512-c3cVx2y4KqUnwopcO9b/SCdo2O67LwJJ/UyqGfbigahfegL9myoEFoDYZgkT7f36T0bLrM9hZTAaAyH+PCAXjw==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT"
    },
    "node_modules/micromark-util-html-tag-name": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-html-tag-name/-/micromark-util-html-tag-name-2.0.1.tgz",
      "integrity": "sha512-2cNEiYDhCWKI+Gs9T0Tiysk136SnR13hhO8yW6BGNyhOC4qYFnwF1nKfD3HFAIXA5c45RrIG1ub11GiXeYd1xA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT"
    },
    "node_modules/micromark-util-normalize-identifier": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-normalize-identifier/-/micromark-util-normalize-identifier-2.0.1.tgz",
      "integrity": "sha512-sxPqmo70LyARJs0w2UclACPUUEqltCkJ6PhKdMIDuJ3gSf/Q+/GIe3WKl0Ijb/GyH9lOpUkRAO2wp0GVkLvS9Q==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-symbol": "^2.0.0"
      }
    },
    "node_modules/micromark-util-resolve-all": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-resolve-all/-/micromark-util-resolve-all-2.0.1.tgz",
      "integrity": "sha512-VdQyxFWFT2/FGJgwQnJYbe1jjQoNTS4RjglmSjTUlpUMa95Htx9NHeYW4rGDJzbjvCsl9eLjMQwGeElsqmzcHg==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-sanitize-uri": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-sanitize-uri/-/micromark-util-sanitize-uri-2.0.1.tgz",
      "integrity": "sha512-9N9IomZ/YuGGZZmQec1MbgxtlgougxTodVwDzzEouPKo3qFWvymFHWcnDi2vzV1ff6kas9ucW+o3yzJK9YB1AQ==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-character": "^2.0.0",
        "micromark-util-encode": "^2.0.0",
        "micromark-util-symbol": "^2.0.0"
      }
    },
    "node_modules/micromark-util-subtokenize": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/micromark-util-subtokenize/-/micromark-util-subtokenize-2.1.0.tgz",
      "integrity": "sha512-XQLu552iSctvnEcgXw6+Sx75GflAPNED1qx7eBJ+wydBb2KCbRZe+NwvIEEMM83uml1+2WSXpBAcp9IUCgCYWA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-util-chunked": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-symbol": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-symbol/-/micromark-util-symbol-2.0.1.tgz",
      "integrity": "sha512-vs5t8Apaud9N28kgCrRUdEed4UJ+wWNvicHLPxCa9ENlYuAY31M0ETy5y1vA33YoNPDFTghEbnh6efaE8h4x0Q==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT"
    },
    "node_modules/micromark-util-types": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/micromark-util-types/-/micromark-util-types-2.0.2.tgz",
      "integrity": "sha512-Yw0ECSpJoViF1qTU4DC6NwtC4aWGt1EkzaQB8KPPyCRR8z9TWeV0HbEFGTO+ZY1wB22zmxnJqhPyTpOVCpeHTA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT"
    },
    "node_modules/motion": {
      "version": "12.43.0",
      "resolved": "https://registry.npmjs.org/motion/-/motion-12.43.0.tgz",
      "integrity": "sha512-BQgQbSa9Hn3/mtbib0MK53y6JSANa+YKUKlaYnWzAVDH424RYQ5LVpV3pNiWH00BA2z4ojsSdMzqT7g2FQwjuQ==",
      "license": "MIT",
      "dependencies": {
        "framer-motion": "^12.43.0",
        "tslib": "^2.4.0"
      },
      "peerDependencies": {
        "@emotion/is-prop-valid": "*",
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@emotion/is-prop-valid": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/motion-dom": {
      "version": "12.43.0",
      "resolved": "https://registry.npmjs.org/motion-dom/-/motion-dom-12.43.0.tgz",
      "integrity": "sha512-azKON4d9S65PEoFUiQTMTgPheEmzf2QngdRc50AKfJp9Q9mmcBVw22c8eMq9k8kxOFHdL7+WZY7N/5F/lwiDag==",
      "license": "MIT",
      "dependencies": {
        "motion-utils": "^12.39.0"
      }
    },
    "node_modules/motion-utils": {
      "version": "12.39.0",
      "resolved": "https://registry.npmjs.org/motion-utils/-/motion-utils-12.39.0.tgz",
      "integrity": "sha512-8nadJAJjTtqRkmRF36FoJTrywK9nnFmnPwnSMyxaOCU7GDjN9RTMJIxx9De8ErM+vpPhMccr/6fo5WciyQLnMQ==",
      "license": "MIT"
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.18",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.18.tgz",
      "integrity": "sha512-DTg4MJbGMWkfi6VZFdNt2/caMbQy4Ou+Op/hJQvGEWcnVfoA1QA+xzRKAzw9jD6+GVOOeYr/mIcuDSdug6F6+w==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.53",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.53.tgz",
      "integrity": "sha512-D9UOmYG3UH1V+ENW56t5QXBwJw1YEY18ruVeus89Rw+SyIgjPkCO84bRzO3uNIYosJbNwiabWVn48o3uJLjxFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/parse-entities": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/parse-entities/-/parse-entities-4.0.2.tgz",
      "integrity": "sha512-GG2AQYWoLgL877gQIKeRPGO1xF9+eG1ujIb5soS5gPvLQ1y2o8FL90w2QWNdf9I361Mpp7726c+lj3U0qK1uGw==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^2.0.0",
        "character-entities-legacy": "^3.0.0",
        "character-reference-invalid": "^2.0.0",
        "decode-named-character-reference": "^1.0.0",
        "is-alphanumerical": "^2.0.0",
        "is-decimal": "^2.0.0",
        "is-hexadecimal": "^2.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/parse-entities/node_modules/@types/unist": {
      "version": "2.0.11",
      "resolved": "https://registry.npmjs.org/@types/unist/-/unist-2.0.11.tgz",
      "integrity": "sha512-CmBKiL6NNo/OqgmMn95Fk9Whlp2mtvIv+KNpQKN2F4SjvrEesubTRWGYSg+BnWZOnlCaSTU1sMpsBOzgbYhnsA==",
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.5",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.5.tgz",
      "integrity": "sha512-RvwwcruNjI1ncT5xRakeyS9Lf8lcItv34KD+aif+VH9kduAyfYBipGh12274xtenIPZ119/R9BdTBa8gAwSh0A==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.26",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.26.tgz",
      "integrity": "sha512-u82N74LFzG8ca+dD8puPnplTXoGH4fTPpVGuIbt36G3qvNlkvfD0lEAZSxaly3KX8TS/L1A1gsCEmvKmBcVbkQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.17",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-value-parser": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz",
      "integrity": "sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/property-information": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/property-information/-/property-information-7.2.0.tgz",
      "integrity": "sha512-IAtzIB6sUiWaJYrX9smp3V46pBGbBeLFRGdh25kg1334VcBlD8HzhPeNIWQH9zhGmo2itIe25EHt9dQP7G5hmg==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/radix-ui": {
      "version": "1.6.7",
      "resolved": "https://registry.npmjs.org/radix-ui/-/radix-ui-1.6.7.tgz",
      "integrity": "sha512-QBdhh1arIEUvPC0dQ5+nwWAxt7+N+oP/9jPwjJkGFoSk/sqxg32gJtSXGtFh8frAIcS6oC9cx2Q+7KYCQLOAeA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.7",
        "@radix-ui/react-accessible-icon": "1.1.15",
        "@radix-ui/react-accordion": "1.2.20",
        "@radix-ui/react-alert-dialog": "1.1.23",
        "@radix-ui/react-arrow": "1.1.15",
        "@radix-ui/react-aspect-ratio": "1.1.15",
        "@radix-ui/react-avatar": "1.2.6",
        "@radix-ui/react-checkbox": "1.3.11",
        "@radix-ui/react-collapsible": "1.1.20",
        "@radix-ui/react-collection": "1.1.15",
        "@radix-ui/react-compose-refs": "1.1.5",
        "@radix-ui/react-context": "1.2.2",
        "@radix-ui/react-context-menu": "2.3.7",
        "@radix-ui/react-dialog": "1.1.23",
        "@radix-ui/react-direction": "1.1.4",
        "@radix-ui/react-dismissable-layer": "1.1.19",
        "@radix-ui/react-dropdown-menu": "2.1.24",
        "@radix-ui/react-focus-guards": "1.1.6",
        "@radix-ui/react-focus-scope": "1.1.16",
        "@radix-ui/react-form": "0.1.16",
        "@radix-ui/react-hover-card": "1.1.23",
        "@radix-ui/react-label": "2.1.15",
        "@radix-ui/react-menu": "2.1.24",
        "@radix-ui/react-menubar": "1.1.24",
        "@radix-ui/react-navigation-menu": "1.2.22",
        "@radix-ui/react-one-time-password-field": "0.1.16",
        "@radix-ui/react-password-toggle-field": "0.1.11",
        "@radix-ui/react-popover": "1.1.23",
        "@radix-ui/react-popper": "1.3.7",
        "@radix-ui/react-portal": "1.1.17",
        "@radix-ui/react-presence": "1.1.10",
        "@radix-ui/react-primitive": "2.1.10",
        "@radix-ui/react-progress": "1.1.16",
        "@radix-ui/react-radio-group": "1.4.7",
        "@radix-ui/react-roving-focus": "1.1.19",
        "@radix-ui/react-scroll-area": "1.2.18",
        "@radix-ui/react-select": "2.3.7",
        "@radix-ui/react-separator": "1.1.15",
        "@radix-ui/react-slider": "1.4.7",
        "@radix-ui/react-slot": "1.3.3",
        "@radix-ui/react-switch": "1.3.7",
        "@radix-ui/react-tabs": "1.1.21",
        "@radix-ui/react-toast": "1.2.23",
        "@radix-ui/react-toggle": "1.1.18",
        "@radix-ui/react-toggle-group": "1.1.19",
        "@radix-ui/react-toolbar": "1.1.19",
        "@radix-ui/react-tooltip": "1.2.16",
        "@radix-ui/react-use-callback-ref": "1.1.4",
        "@radix-ui/react-use-controllable-state": "1.2.6",
        "@radix-ui/react-use-effect-event": "0.0.5",
        "@radix-ui/react-use-escape-keydown": "1.1.5",
        "@radix-ui/react-use-is-hydrated": "0.1.3",
        "@radix-ui/react-use-layout-effect": "1.1.4",
        "@radix-ui/react-use-size": "1.1.4",
        "@radix-ui/react-visually-hidden": "1.2.11"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/react": {
      "version": "19.2.8",
      "resolved": "https://registry.npmjs.org/react/-/react-19.2.8.tgz",
      "integrity": "sha512-PWaYA1L/q9u2u7xYQi+Y3L3Yfnie7XyLeaJICV1MGD6LprsBxcAqGjYyr0eY3p+QdsA+x/Irkt4Qif8D63+Sbw==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.2.8",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.8.tgz",
      "integrity": "sha512-rVprimfGBG3DR+Tq0IQG2DT5PxKth1WIGDmj5yPmlzr4YBe7uyE+Du4oVqTDXZSHGGGXRtTJEGSSePyQCMBglQ==",
      "license": "MIT",
      "dependencies": {
        "scheduler": "^0.27.0"
      },
      "peerDependencies": {
        "react": "^19.2.8"
      }
    },
    "node_modules/react-markdown": {
      "version": "10.1.0",
      "resolved": "https://registry.npmjs.org/react-markdown/-/react-markdown-10.1.0.tgz",
      "integrity": "sha512-qKxVopLT/TyA6BX3Ue5NwabOsAzm0Q7kAPwq6L+wWDwisYs7R8vZ0nRXqq6rkueboxpkjvLGU9fWifiX/ZZFxQ==",
      "license": "MIT",
      "dependencies": {
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "hast-util-to-jsx-runtime": "^2.0.0",
        "html-url-attributes": "^3.0.0",
        "mdast-util-to-hast": "^13.0.0",
        "remark-parse": "^11.0.0",
        "remark-rehype": "^11.0.0",
        "unified": "^11.0.0",
        "unist-util-visit": "^5.0.0",
        "vfile": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      },
      "peerDependencies": {
        "@types/react": ">=18",
        "react": ">=18"
      }
    },
    "node_modules/react-refresh": {
      "version": "0.18.0",
      "resolved": "https://registry.npmjs.org/react-refresh/-/react-refresh-0.18.0.tgz",
      "integrity": "sha512-QgT5//D3jfjJb6Gsjxv0Slpj23ip+HtOpnNgnb2S5zU3CB26G/IDPGoy4RJB42wzFE46DRsstbW6tKHoKbhAxw==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-remove-scroll": {
      "version": "2.7.2",
      "resolved": "https://registry.npmjs.org/react-remove-scroll/-/react-remove-scroll-2.7.2.tgz",
      "integrity": "sha512-Iqb9NjCCTt6Hf+vOdNIZGdTiH1QSqr27H/Ek9sv/a97gfueI/5h1s3yRi1nngzMUaOOToin5dI1dXKdXiF+u0Q==",
      "license": "MIT",
      "dependencies": {
        "react-remove-scroll-bar": "^2.3.7",
        "react-style-singleton": "^2.2.3",
        "tslib": "^2.1.0",
        "use-callback-ref": "^1.3.3",
        "use-sidecar": "^1.1.3"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/react-remove-scroll-bar": {
      "version": "2.3.8",
      "resolved": "https://registry.npmjs.org/react-remove-scroll-bar/-/react-remove-scroll-bar-2.3.8.tgz",
      "integrity": "sha512-9r+yi9+mgU33AKcj6IbT9oRCO78WriSj6t/cF8DWBZJ9aOGPOTEDvdUDz1FwKim7QXWwmHqtdHnRJfhAxEG46Q==",
      "license": "MIT",
      "dependencies": {
        "react-style-singleton": "^2.2.2",
        "tslib": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/react-style-singleton": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/react-style-singleton/-/react-style-singleton-2.2.3.tgz",
      "integrity": "sha512-b6jSvxvVnyptAiLjbkWLE/lOnR4lfTtDAl+eUC7RZy+QQWc6wRzIV2CE6xBuMmDxc2qIihtDCZD5NPOFl7fRBQ==",
      "license": "MIT",
      "dependencies": {
        "get-nonce": "^1.0.0",
        "tslib": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/react-textarea-autosize": {
      "version": "8.5.9",
      "resolved": "https://registry.npmjs.org/react-textarea-autosize/-/react-textarea-autosize-8.5.9.tgz",
      "integrity": "sha512-U1DGlIQN5AwgjTyOEnI1oCcMuEr1pv1qOtklB2l4nyMGbHzWrI0eFsYK0zos2YWqAolJyG0IWJaqWmWj5ETh0A==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.20.13",
        "use-composed-ref": "^1.3.0",
        "use-latest": "^1.2.1"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/remark-gfm": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/remark-gfm/-/remark-gfm-4.0.1.tgz",
      "integrity": "sha512-1quofZ2RQ9EWdeN34S79+KExV1764+wCUGop5CPL1WGdD0ocPpu91lzPGbwWMECpEpd42kJGQwzRfyov9j4yNg==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "mdast-util-gfm": "^3.0.0",
        "micromark-extension-gfm": "^3.0.0",
        "remark-parse": "^11.0.0",
        "remark-stringify": "^11.0.0",
        "unified": "^11.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/remark-parse": {
      "version": "11.0.0",
      "resolved": "https://registry.npmjs.org/remark-parse/-/remark-parse-11.0.0.tgz",
      "integrity": "sha512-FCxlKLNGknS5ba/1lmpYijMUzX2esxW5xQqjWxw2eHFfS2MSdaHVINFmhjo+qN1WhZhNimq0dZATN9pH0IDrpA==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "micromark-util-types": "^2.0.0",
        "unified": "^11.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/remark-rehype": {
      "version": "11.1.2",
      "resolved": "https://registry.npmjs.org/remark-rehype/-/remark-rehype-11.1.2.tgz",
      "integrity": "sha512-Dh7l57ianaEoIpzbp0PC9UKAdCSVklD8E5Rpw7ETfbTl3FqcOOgq5q2LVDhgGCkaBv7p24JXikPdvhhmHvKMsw==",
      "license": "MIT",
      "dependencies": {
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "mdast-util-to-hast": "^13.0.0",
        "unified": "^11.0.0",
        "vfile": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/remark-stringify": {
      "version": "11.0.0",
      "resolved": "https://registry.npmjs.org/remark-stringify/-/remark-stringify-11.0.0.tgz",
      "integrity": "sha512-1OSmLd3awB/t8qdoEOMazZkNsfVTeY4fTsgzcQFdXNq8ToTN4ZGwrMnlda4K6smTFKD+GRV6O48i6Z4iKgPPpw==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "mdast-util-to-markdown": "^2.0.0",
        "unified": "^11.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/rollup": {
      "version": "4.62.4",
      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.62.4.tgz",
      "integrity": "sha512-RXOqwaPsBGjMNMa4sQjDjHieHEZDFoj/Rdr46l2MU5DfEs16wHJPC2RPTPHWhNl+M3aI472LLqFkFKut4SblOg==",
      "license": "MIT",
      "dependencies": {
        "@types/estree": "1.0.9"
      },
      "bin": {
        "rollup": "dist/bin/rollup"
      },
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      },
      "optionalDependencies": {
        "@napi-rs/lzma-linux-x64-gnu": "1.5.1",
        "@rollup/rollup-android-arm-eabi": "4.62.4",
        "@rollup/rollup-android-arm64": "4.62.4",
        "@rollup/rollup-darwin-arm64": "4.62.4",
        "@rollup/rollup-darwin-x64": "4.62.4",
        "@rollup/rollup-freebsd-arm64": "4.62.4",
        "@rollup/rollup-freebsd-x64": "4.62.4",
        "@rollup/rollup-linux-arm-gnueabihf": "4.62.4",
        "@rollup/rollup-linux-arm-musleabihf": "4.62.4",
        "@rollup/rollup-linux-arm64-gnu": "4.62.4",
        "@rollup/rollup-linux-arm64-musl": "4.62.4",
        "@rollup/rollup-linux-loong64-gnu": "4.62.4",
        "@rollup/rollup-linux-loong64-musl": "4.62.4",
        "@rollup/rollup-linux-ppc64-gnu": "4.62.4",
        "@rollup/rollup-linux-ppc64-musl": "4.62.4",
        "@rollup/rollup-linux-riscv64-gnu": "4.62.4",
        "@rollup/rollup-linux-riscv64-musl": "4.62.4",
        "@rollup/rollup-linux-s390x-gnu": "4.62.4",
        "@rollup/rollup-linux-x64-gnu": "4.62.4",
        "@rollup/rollup-linux-x64-musl": "4.62.4",
        "@rollup/rollup-openbsd-x64": "4.62.4",
        "@rollup/rollup-openharmony-arm64": "4.62.4",
        "@rollup/rollup-win32-arm64-msvc": "4.62.4",
        "@rollup/rollup-win32-ia32-msvc": "4.62.4",
        "@rollup/rollup-win32-x64-gnu": "4.62.4",
        "@rollup/rollup-win32-x64-msvc": "4.62.4",
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/safe-content-frame": {
      "version": "0.0.27",
      "resolved": "https://registry.npmjs.org/safe-content-frame/-/safe-content-frame-0.0.27.tgz",
      "integrity": "sha512-IFUSMjElIp8q46wUU5HViHNEqoDWRlCzqqThQmhOLimuXPe/QC6Jr/AQ+BKxSYziQdNXUpapBq4Ir/t6dS0Ldg==",
      "license": "MIT"
    },
    "node_modules/scheduler": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
      "license": "MIT"
    },
    "node_modules/secure-json-parse": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/secure-json-parse/-/secure-json-parse-4.1.0.tgz",
      "integrity": "sha512-l4KnYfEyqYJxDwlNVyRfO2E4NTHfMKAWdUuA8J0yve2Dz/E/PdBepY03RvyJpssIpRFwJoCD55wA+mEDs6ByWA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fastify"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fastify"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/space-separated-tokens": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/space-separated-tokens/-/space-separated-tokens-2.0.2.tgz",
      "integrity": "sha512-PEGlAwrG8yXGXRjW32fGbg66JAlOAwbObuqVoJpv/mRgoWDQfgH1wDPvtzWyUSNAXBGSk8h755YDbbcEy3SH2Q==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/stringify-entities": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/stringify-entities/-/stringify-entities-4.0.4.tgz",
      "integrity": "sha512-IwfBptatlO+QCJUo19AqvrPNqlVMpW9YEL2LIVY+Rpv2qsjCGxaDLNRgeGsQWJhfItebuJhsGSLjaBbNSQ+ieg==",
      "license": "MIT",
      "dependencies": {
        "character-entities-html4": "^2.0.0",
        "character-entities-legacy": "^3.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/style-to-js": {
      "version": "1.1.21",
      "resolved": "https://registry.npmjs.org/style-to-js/-/style-to-js-1.1.21.tgz",
      "integrity": "sha512-RjQetxJrrUJLQPHbLku6U/ocGtzyjbJMP9lCNK7Ag0CNh690nSH8woqWH9u16nMjYBAok+i7JO1NP2pOy8IsPQ==",
      "license": "MIT",
      "dependencies": {
        "style-to-object": "1.0.14"
      }
    },
    "node_modules/style-to-object": {
      "version": "1.0.14",
      "resolved": "https://registry.npmjs.org/style-to-object/-/style-to-object-1.0.14.tgz",
      "integrity": "sha512-LIN7rULI0jBscWQYaSswptyderlarFkjQ+t79nzty8tcIAceVomEVlLzH5VP4Cmsv6MtKhs7qaAiwlcp+Mgaxw==",
      "license": "MIT",
      "dependencies": {
        "inline-style-parser": "0.2.7"
      }
    },
    "node_modules/tailwindcss": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-4.3.3.tgz",
      "integrity": "sha512-gOhV3P7ufE62QDGg1zVaTgCR+EtPv92k2nIhVcVKcLmxT1sUBsQGhnZj175j+MqRt4zLF7ic+sCYjfhxMxj7YQ==",
      "license": "MIT"
    },
    "node_modules/tapable": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/tapable/-/tapable-2.3.3.tgz",
      "integrity": "sha512-uxc/zpqFg6x7C8vOE7lh6Lbda8eEL9zmVm/PLeTPBRhh1xCgdWaQ+J1CUieGpIfm2HdtsUpRv+HshiasBMcc6A==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/trim-lines": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/trim-lines/-/trim-lines-3.0.1.tgz",
      "integrity": "sha512-kRj8B+YHZCc9kQYdWfJB2/oUl9rA99qbowYYBtr4ui4mZyAQ2JpvVBd/6U2YloATfqBhBTSMhTpgBHtU0Mf3Rg==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/trough": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/trough/-/trough-2.2.0.tgz",
      "integrity": "sha512-tmMpK00BjZiUyVyvrBK7knerNgmgvcV/KLVyuma/SC+TQN167GrMRciANTz09+k3zW8L8t60jWO1GpfkZdjTaw==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/typescript": {
      "version": "5.8.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.8.3.tgz",
      "integrity": "sha512-p1diW6TqL9L07nNxvRMM7hMMw4c5XOo/1ibL4aAIGmSAt9slTE1Xgw5KWuof2uTOvCg9BY7ZRi+GaF+7sfgPeQ==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/undici": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/undici/-/undici-7.29.0.tgz",
      "integrity": "sha512-IDxfleLmmbSskfWSUATiN1nfn2rDuvnMOqb5CWR92iIfojA0Ud+ulOAAEQ57LPr9rWmsreUyf5lwyao+7GNNVw==",
      "license": "MIT",
      "engines": {
        "node": ">=20.18.1"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "devOptional": true,
      "license": "MIT"
    },
    "node_modules/unified": {
      "version": "11.0.5",
      "resolved": "https://registry.npmjs.org/unified/-/unified-11.0.5.tgz",
      "integrity": "sha512-xKvGhPWw3k84Qjh8bI3ZeJjqnyadK+GEFtazSfZv/rKeTkTjOJho6mFqh2SM96iIcZokxiOpg78GazTSg8+KHA==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0",
        "bail": "^2.0.0",
        "devlop": "^1.0.0",
        "extend": "^3.0.0",
        "is-plain-obj": "^4.0.0",
        "trough": "^2.0.0",
        "vfile": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/unist-util-is": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/unist-util-is/-/unist-util-is-6.0.1.tgz",
      "integrity": "sha512-LsiILbtBETkDz8I9p1dQ0uyRUWuaQzd/cuEeS1hoRSyW5E5XGmTzlwY1OrNzzakGowI9Dr/I8HVaw4hTtnxy8g==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/unist-util-position": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/unist-util-position/-/unist-util-position-5.0.0.tgz",
      "integrity": "sha512-fucsC7HjXvkB5R3kTCO7kUjRdrS0BJt3M/FPxmHMBOm8JQi2BsHAHFsy27E0EolP8rp0NzXsJ+jNPyDWvOJZPA==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/unist-util-stringify-position": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/unist-util-stringify-position/-/unist-util-stringify-position-4.0.0.tgz",
      "integrity": "sha512-0ASV06AAoKCDkS2+xw5RXJywruurpbC4JZSm7nr7MOt1ojAzvyyaO+UxZf18j8FCF6kmzCZKcAgN/yu2gm2XgQ==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/unist-util-visit": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/unist-util-visit/-/unist-util-visit-5.1.0.tgz",
      "integrity": "sha512-m+vIdyeCOpdr/QeQCu2EzxX/ohgS8KbnPDgFni4dQsfSCtpz8UqDyY5GjRru8PDKuYn7Fq19j1CQ+nJSsGKOzg==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0",
        "unist-util-is": "^6.0.0",
        "unist-util-visit-parents": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/unist-util-visit-parents": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/unist-util-visit-parents/-/unist-util-visit-parents-6.0.2.tgz",
      "integrity": "sha512-goh1s1TBrqSqukSc8wrjwWhL0hiJxgA8m4kFxGlQ+8FYQ3C/m11FcTs4YYem7V664AhHVvgoQLk890Ssdsr2IQ==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0",
        "unist-util-is": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.3.1.tgz",
      "integrity": "sha512-ZZ61DsRsOnakl74HAmp3oSN4aXUmEWXf+i/yv0h7tIBfICc3VdrFErQKUUKPgu3AMsTUMbcongALEN4l6GSUrQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/use-callback-ref": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/use-callback-ref/-/use-callback-ref-1.3.3.tgz",
      "integrity": "sha512-jQL3lRnocaFtu3V00JToYz/4QkNWswxijDaCVNZRiRTO3HQDLsdu1ZtmIUvV4yPp+rvWm5j0y0TG/S61cuijTg==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/use-composed-ref": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/use-composed-ref/-/use-composed-ref-1.4.0.tgz",
      "integrity": "sha512-djviaxuOOh7wkj0paeO1Q/4wMZ8Zrnag5H6yBvzN7AKKe8beOaED9SF5/ByLqsku8NP4zQqsvM2u3ew/tJK8/w==",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/use-isomorphic-layout-effect": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/use-isomorphic-layout-effect/-/use-isomorphic-layout-effect-1.2.1.tgz",
      "integrity": "sha512-tpZZ+EX0gaghDAiFR37hj5MgY6ZN55kLiPkJsKxBMZ6GZdOSPJXiOzPM984oPYZ5AnehYx5WQp1+ME8I/P/pRA==",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/use-latest": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/use-latest/-/use-latest-1.3.0.tgz",
      "integrity": "sha512-mhg3xdm9NaM8q+gLT8KryJPnRFOz1/5XPBhmDEVZK1webPzDjrPk7f/mbpeLqTgB9msytYWANxgALOCJKnLvcQ==",
      "license": "MIT",
      "dependencies": {
        "use-isomorphic-layout-effect": "^1.1.1"
      },
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/use-sidecar": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/use-sidecar/-/use-sidecar-1.1.3.tgz",
      "integrity": "sha512-Fedw0aZvkhynoPYlA5WXrMCAMm+nSWdZt6lzJQ7Ok8S6Q+VsHmHpRWndVRJ8Be0ZbkfPc5LRYH+5XrzXcEeLRQ==",
      "license": "MIT",
      "dependencies": {
        "detect-node-es": "^1.1.0",
        "tslib": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/vfile": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/vfile/-/vfile-6.0.3.tgz",
      "integrity": "sha512-KzIbH/9tXat2u30jf+smMwFCsno4wHVdNmzFyL+T/L3UGqqk6JKfVqOFOZEpZSHADH1k40ab6NUIXZq422ov3Q==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0",
        "vfile-message": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/vfile-message": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/vfile-message/-/vfile-message-4.0.3.tgz",
      "integrity": "sha512-QTHzsGd1EhbZs4AsQ20JX1rC3cOlt/IWJruk893DfLRr57lcnOeMaWG4K0JrRta4mIJZKth2Au3mM3u03/JWKw==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0",
        "unist-util-stringify-position": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/vite": {
      "version": "6.4.3",
      "resolved": "https://registry.npmjs.org/vite/-/vite-6.4.3.tgz",
      "integrity": "sha512-NTKlcQjlAK7MlQoyb6LgaqHc8sso/pVyUJYWMws3jg21uTJw/LddqIFPcPqP6PzpgbIcZyKI85sFE4HBrQDA8A==",
      "license": "MIT",
      "dependencies": {
        "esbuild": "^0.25.0",
        "fdir": "^6.4.4",
        "picomatch": "^4.0.2",
        "postcss": "^8.5.3",
        "rollup": "^4.34.9",
        "tinyglobby": "^0.2.13"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^18.0.0 || ^20.0.0 || >=22.0.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^18.0.0 || ^20.0.0 || >=22.0.0",
        "jiti": ">=1.21.0",
        "less": "*",
        "lightningcss": "^1.21.0",
        "sass": "*",
        "sass-embedded": "*",
        "stylus": "*",
        "sugarss": "*",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "lightningcss": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "license": "ISC"
    },
    "node_modules/zod": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/zod/-/zod-4.4.3.tgz",
      "integrity": "sha512-ytENFjIJFl2UwYglde2jchW2Hwm4GJFLDiSXWdTrJQBIN9Fcyp7n4DhxJEiWNAJMV1/BqWfW/kkg71UDcHJyTQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/zustand": {
      "version": "5.0.15",
      "resolved": "https://registry.npmjs.org/zustand/-/zustand-5.0.15.tgz",
      "integrity": "sha512-MpSEjRiBkA9crSYeOUH32rJC7SVqAbm0Fqcqge/bUi2PPoLcBWKOsG+C8mevmpr8TwXHBVkChbbJiyvkE+i/3A==",
      "license": "MIT",
      "engines": {
        "node": ">=12.20.0"
      },
      "peerDependencies": {
        "@types/react": ">=18.0.0",
        "immer": ">=9.0.6",
        "react": ">=18.0.0",
        "use-sync-external-store": ">=1.2.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "immer": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "use-sync-external-store": {
          "optional": true
        }
      }
    },
    "node_modules/zwitch": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/zwitch/-/zwitch-2.0.4.tgz",
      "integrity": "sha512-bXE4cR/kVZhKZX/RjPEflHaKVhUVl85noU3v6b8apfQEc1x4A+zBxjZ4lN8LqGd6WZ3dl98pY4o717VFmoPp+A==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    }
  }
}


--- SIH-2026/frontend/package.json ---

{
  "name": "disaster-intelligence-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --config vite.config.ts",
    "build": "vite build --config vite.config.ts",
    "preview": "vite preview --config vite.config.ts",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@assistant-ui/react": "^0.15.16",
    "@assistant-ui/react-markdown": "^0.14.12",
    "@tailwindcss/vite": "^4.1.14",
    "@types/leaflet": "^1.9.22",
    "@vitejs/plugin-react": "^5.0.4",
    "ai": "^7.0.77",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}


--- SIH-2026/frontend/tsconfig.json ---

{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}


--- SIH-2026/frontend/vercel.json ---

{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}


--- SIH-2026/frontend/vite.config.ts ---

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      fs: {
        allow: [path.resolve(__dirname, '..')],
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
  };
});


--- SIH-2026/frontend/src/App.tsx ---

import React, { useEffect, useState } from 'react';
import { getLocale, translate } from './types/language';
import { Navbar } from './components/Navbar';
import { PresentWorkspace } from './components/present/PresentWorkspace';
import { PastWorkspace } from './components/past/PastWorkspace';
import { FuturePage } from './components/future/FuturePage';
import { TeamPage } from './components/TeamPage';
import { HeroPage } from './components/HeroPage';
import { AIAssistantDrawer } from './components/past/AIAssistantDrawer';
import { useAutoTranslatePage } from './hooks/useAutoTranslatePage';
import { prefetchPastArchive } from './lib/pastCache';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  );
  const [currentLanguage, setCurrentLanguage] = useState<string>(() =>
    typeof window === 'undefined' ? 'en' : window.localStorage.getItem('disaster-intelligence.language') || 'en'
  );
  const [feedStatus, setFeedStatus] = useState<'LIVE_FETCH' | 'ETAG_CACHED' | 'FALLBACK_SNAPSHOT' | 'ERROR'>('LIVE_FETCH');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);

  useAutoTranslatePage(currentLanguage);

  // Prefetch past disaster archives on app mount to prime local cache
  useEffect(() => {
    prefetchPastArchive();
  }, []);

  useEffect(() => {
    window.localStorage.setItem('disaster-intelligence.language', currentLanguage);
    document.documentElement.lang = getLocale(currentLanguage);
  }, [currentLanguage]);

  // Synchronize browser history and navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleRouteChange = (route: string) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
  };

  const isKnownRoute = ['/', '/present', '/past', '/future', '/team'].includes(currentRoute);

  if (!isKnownRoute) {
    return (
      <div className="min-h-screen bg-[#ECF8F8] text-[#0F1B29] flex flex-col justify-center items-center px-4 font-sans select-none">
        <div className="max-w-md w-full bg-white border border-[#DDDDDD] rounded-3xl shadow-sm p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#DDDDDD]/50 border border-[#DDDDDD] flex items-center justify-center text-[#0F1B29] font-bold text-xl">
            404
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#0F1B29]">{translate(currentLanguage, 'error.notFoundTitle')}</h1>
            <p className="text-xs text-[#747F8D]">
              {translate(currentLanguage, 'error.notFoundBody')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleRouteChange('/')}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
          >
            {translate(currentLanguage, 'error.returnDashboard')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#ECF8F8] text-[#0F1B29] flex flex-col selection:bg-[#747F8D] selection:text-white font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        feedStatus={feedStatus}
        lastUpdated={lastUpdated}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
      />

      {/* Main Workspace based on selected Route */}
      <main className="flex-1 min-h-0 bg-[#ECF8F8] pt-16 overflow-y-auto">
        {currentRoute === '/' && (
          <HeroPage
            currentLanguage={currentLanguage}
            onExplore={() => handleRouteChange('/past')}
          />
        )}

        {currentRoute === '/present' && (
          <PresentWorkspace
            language={currentLanguage}
            onFeedStatusChange={(status, time) => {
              setFeedStatus(status);
              setLastUpdated(time);
            }}
          />
        )}

        {currentRoute === '/past' && (
          <PastWorkspace
            language={currentLanguage}
            isVoiceAssistantOpen={isVoiceAssistantOpen}
            onCloseVoiceAssistant={() => setIsVoiceAssistantOpen(false)}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            onLanguageChange={setCurrentLanguage}
          />
        )}

        {currentRoute === '/future' && (
          <FuturePage currentLanguage={currentLanguage} />
        )}

        {currentRoute === '/team' && (
          <TeamPage />
        )}
      </main>

      {/* Floating Global Chatbot Drawer (accessible from navbar bot button) */}
      <AIAssistantDrawer
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        language={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

    </div>
  );
}

export default App;


--- SIH-2026/frontend/src/index.css ---

@import "tailwindcss";

@theme {
  /* ========================================
     AAPADA DRISHTI — FINAL FIGMA PALETTE
     ======================================== */

  /* Core colors */
  --color-map: #747F8D;
  --color-white: #FFFFFF;
  --color-text: #0F1B29;
  --color-icons: #0F1B29;
  --color-cta: #DDDDDD;
  --color-icon-holder: #DDDDDD;

  /* Primary brand colors */
  --color-primary-dark: #0F1B29;
  --color-primary-medium: #747F8D;
  --color-primary-light: #DDDDDD;
  --color-accent-light: #F3F4F5;

  /* Page background */
  --color-background: #FFFFFF;
  --color-background-mint: #FFFFFF;

  /* ========================================
     INDIGO → MAP TO BLUE-GRAY SYSTEM
     ======================================== */

  --color-indigo-50: #F5F6F7;
  --color-indigo-100: #EEF0F2;
  --color-indigo-200: #DDDDDD;
  --color-indigo-300: #B8BEC5;
  --color-indigo-400: #9AA2AC;
  --color-indigo-500: #747F8D;
  --color-indigo-600: #5F6975;
  --color-indigo-700: #46515E;
  --color-indigo-800: #2D3946;
  --color-indigo-900: #0F1B29;
  --color-indigo-950: #08111B;

  /* ========================================
     SLATE → NEUTRAL FIGMA SYSTEM
     ======================================== */

  --color-slate-50: #FFFFFF;
  --color-slate-100: #FAFAFA;
  --color-slate-200: #F3F3F3;
  --color-slate-300: #DDDDDD;
  --color-slate-400: #BFC4C9;
  --color-slate-500: #747F8D;
  --color-slate-600: #5E6874;
  --color-slate-700: #46515E;
  --color-slate-800: #263340;
  --color-slate-900: #0F1B29;
  --color-slate-950: #08111B;

  --font-sans: "Bricolage Grotesque", sans-serif;
}

@keyframes shimmer-slide {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
  animation: shimmer-slide 1.5s infinite;
}

/* Professional Polish Leaflet styling */
.leaflet-container {
  background-color: #ECF8F8 !important;
  font-family: inherit;
}

/* Force hide all Leaflet attribution badges globally */
.leaflet-control-attribution {
  display: none !important;
}

/* Make Lakshadweep islands visible by removing white borders that cover small paths */
path[id="INLD"] {
  stroke: none !important;
}

.leaflet-disaster-tooltip {
  background-color: rgba(255, 255, 255, 0.96) !important;
  color: #0F1B29 !important;
  border: 1px solid #DDDDDD !important;
  border-radius: 10px !important;
  box-shadow: 0 10px 25px -5px rgba(15, 27, 41, 0.1) !important;
  padding: 8px 12px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
}

.leaflet-disaster-tooltip:before {
  border-top-color: #DDDDDD !important;
}

.custom-disaster-marker {
  background: transparent !important;
  border: none !important;
}

.custom-user-marker {
  background: transparent !important;
  border: none !important;
}

/* Scrollbar customization */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #ECF8F8;
}

::-webkit-scrollbar-thumb {
  background: #DDDDDD;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #747F8D;
}

--- SIH-2026/frontend/src/main.tsx ---

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


--- SIH-2026/frontend/src/vite-env.d.ts ---

/// <reference types="vite/client" />


--- SIH-2026/frontend/src/types/disaster.ts ---

export type DisasterCategory =
  | 'Cyclone'
  | 'Flood'
  | 'Earthquake'
  | 'Landslide'
  | 'Heat Wave'
  | 'Cold Wave'
  | 'Lightning'
  | 'Thunderstorm'
  | 'Heavy Rain'
  | 'Storm'
  | 'Tsunami'
  | 'Avalanche'
  | 'Forest Fire'
  | 'Drought'
  | 'Urban Flood'
  | 'Air Pollution'
  | 'General Alert';

export type AlertSeverity = 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
export type AlertUrgency = 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown';
export type AlertCertainty = 'Observed' | 'Likely' | 'Possible' | 'Unlikely' | 'Unknown';

export interface AlertPolygon {
  type: 'Polygon';
  coordinates: [number, number][]; // [lat, lng] array
}

export interface AlertCircle {
  center: [number, number]; // [lat, lng]
  radiusKm: number;
}

export interface SachetAlert {
  id: string;
  identifier: string;
  sender: string;
  sent: string;
  status: string;
  msgType: string;
  source: string;
  scope: string;
  category: DisasterCategory;
  rawCategory: string;
  event: string;
  urgency: AlertUrgency;
  severity: AlertSeverity;
  certainty: AlertCertainty;
  headline: string;
  description: string;
  instruction: string; // Verbatim official instruction
  areaDesc: string;
  polygon?: AlertPolygon;
  circle?: AlertCircle;
  centroid?: [number, number]; // [lat, lng]
  state?: string;
  district?: string;
  effective: string;
  expires: string;
  isExpired: boolean;
  webUrl?: string;
  sourceAgency?: string;
  helpline?: string;
  bulletinNo?: string;
  officialPortalUrl?: string;
  liveNewsQuery?: string;
  disasterYear?: number;
  feedOrigin?: 'NDMA_SACHET_LIVE' | 'IMD_CAP_LIVE' | 'SDMA_TELEMETRY' | 'VERIFIED_SNAPSHOT';
}

export type RelevanceStatus =
  | 'NOT_RELEVANT'
  | 'AWARENESS_ONLY'
  | 'NEARBY'
  | 'WARNING'
  | 'HIGH_PRIORITY'
  | 'CRITICAL';

export type RelevanceConfidence =
  | 'exact_polygon' // Case 1: Point inside official polygon (highest confidence)
  | 'polygon_distance' // Case 2: Point within category buffer of polygon
  | 'circle' // Case 3: Point inside/near official circle
  | 'approximate_centroid' // Case 4: Centroid only - "approximate — precise boundary unavailable"
  | 'regional_match' // Case 5: Admin region / State match only
  | 'unverified';

export interface EmergencyContact {
  label: string;
  number: string;
  category: 'National' | 'State' | 'District' | 'Police' | 'Medical' | 'Disaster Force';
  description: string;
}

export interface EvacuationGuidance {
  hazardOriginName: string;
  bearingDegrees: number;
  bearingCardinal: string; // e.g. 'South', 'South-East'
  approachDescription: string; // e.g. 'Approaching from South (Puri) towards North (Bhubaneswar)'
  recommendedDirection: string; // e.g. 'North-West (Inland towards higher elevation)'
  safeDistanceKm: number; // e.g. 35
  urgencyLevel: 'IMMEDIATE_EVACUATION' | 'PREPARE_TO_MOVE' | 'SHELTER_IN_PLACE' | 'STANDBY_AWARE';
  actionableMeasures: string[];
  dos: string[];
  donts: string[];
  emergencyContacts: EmergencyContact[];
}

export interface RelevanceResult {
  status: RelevanceStatus;
  distanceKm: number;
  confidence: RelevanceConfidence;
  confidenceLabel: string;
  isInsideBoundary: boolean;
  reason: string;
  plainSummary: string; // Deterministic plain-language summary (Section 50)
  alert: SachetAlert;
  evacuationGuidance?: EvacuationGuidance;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  timestamp: number;
  cityName?: string;
  district?: string;
  state?: string;
  isCustomLookup?: boolean; // For "Check another location" (Section 49A)
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  publisher: string;
  publishedAt: string;
  relativeTime: string;
  recencyVerified: boolean;
  isWithinTemporalGate: boolean;
  matchedEventOrAlertId?: string;
  query?: string;
}

export interface CitedSource {
  id: string; // e.g. 'S1', 'S2' (stable across bundle)
  title: string;
  publisher: string;
  publishedAt: string;
  url: string;
  summary: string;
  qualityScore?: number;
  keyFacts?: string[];
}

export interface TimelineEvent {
  date: string;
  event: string;
  description: string;
  citations: string[]; // e.g. ['S1', 'S2']
}

export interface ConflictingReport {
  topic: string;
  details: string;
  sources: string[];
}

export interface NumericRange {
  min: number;
  max: number;
  outliers?: number[];
  outlierSources?: { value: number; sourceIds: string[] }[];
}

export interface EvidenceBundle {
  id: string;
  eventName: string;
  disasterType: DisasterCategory;
  location: string;
  state: string;
  country: string;
  eventDate?: string;
  dateRange: string;
  numericCasualtiesRange?: NumericRange;
  reportedCasualties: string;
  reportedDamage: string;
  sources: CitedSource[];
  timeline: TimelineEvent[];
  whatHappened: string;
  affectedAreas: string;
  humanImpact: string;
  infrastructureDamage: string;
  economicImpact: string;
  governmentResponse: string;
  rescueRelief: string;
  recovery: string;
  sourceAssessment: string;
  conflictingReports: ConflictingReport[];
  synthesizedAt: string;
  evidenceStatus: 'High Confidence' | 'Moderate Evidence' | 'Limited Coverage' | 'Model-Sourced / Limited External Citation';
  retrievalMetadata: {
    queriesExecuted: string[];
    rawSourcesCount: number;
    dedupedSourcesCount: number;
  };
}

export interface ComparisonMatrix {
  events: EvidenceBundle[];
  comparisonPoints: {
    category: string;
    label: string;
    values: { eventId: string; value: string; citations: string[] }[];
  }[];
  aiSynthesis: {
    broaderImpact: string;
    responseDifferences: string;
    crossEventLessons: string;
    citations: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: CitedSource[];
  stage?: 'understanding' | 'searching' | 'reviewing' | 'reconciling' | 'ready';
  language?: string;
  audioBase64?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  associatedEventId?: string;
}


--- SIH-2026/frontend/src/types/language.ts ---

export interface Language {
  code: string; // ISO code (e.g., 'bn', 'hi', 'en')
  name: string; // English name (e.g., 'Bengali')
  nativeName: string; // Native script name (e.g., 'বাংলা')
  speechLocale: string; // BCP-47 locale (e.g., 'bn-IN')
  script: string;
}

export const INDIAN_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechLocale: 'en-IN', script: 'Latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechLocale: 'hi-IN', script: 'Devanagari' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechLocale: 'bn-IN', script: 'Bengali' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN', script: 'Telugu' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechLocale: 'mr-IN', script: 'Devanagari' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN', script: 'Tamil' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', speechLocale: 'ur-IN', script: 'Arabic' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechLocale: 'gu-IN', script: 'Gujarati' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechLocale: 'kn-IN', script: 'Kannada' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechLocale: 'or-IN', script: 'Odia' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechLocale: 'ml-IN', script: 'Malayalam' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechLocale: 'pa-IN', script: 'Gurmukhi' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speechLocale: 'as-IN', script: 'Bengali-Assamese' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', speechLocale: 'hi-IN', script: 'Devanagari' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ / संथाली', speechLocale: 'hi-IN', script: 'Ol Chiki' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / کٲشُر', speechLocale: 'ur-IN', script: 'Perso-Arabic' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', speechLocale: 'ne-NP', script: 'Devanagari' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', speechLocale: 'mr-IN', script: 'Devanagari' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', speechLocale: 'ur-IN', script: 'Arabic' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', speechLocale: 'hi-IN', script: 'Devanagari' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্', speechLocale: 'bn-IN', script: 'Meetei Mayek' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', speechLocale: 'hi-IN', script: 'Devanagari' },
];

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  presentTab: string;
  pastTab: string;
  liveStatus: string;
  staleStatus: string;
  activeAlerts: string;
  alertTypes: string;
  useMyLocation: string;
  checkAnotherLocation: string;
  searchLocationPlaceholder: string;
  nearMeMode: string;
  indiaMode: string;
  officialInstructionTitle: string;
  plainSummaryTitle: string;
  viewDetails: string;
  dismiss: string;
  share: string;
  copySummary: string;
  searchDisastersPlaceholder: string;
  historicalResearchTitle: string;
  compareEvents: string;
  aiAssistant: string;
  originalReports: string;
  timelineTitle: string;
  whatHappenedTitle: string;
  impactTitle: string;
  responseTitle: string;
  sourceAssessmentTitle: string;
  conflictingReportsTitle: string;
  noAlertsNearby: string;
  noActiveAlerts: string;
  currentNewsTitle: string;
  voiceAssistantTitle: string;
  voiceListening: string;
  voiceSpeakPrompt: string;
  searchLanguagePlaceholder: string;
  indiaMapTitle?: string;
  askAIAssistant?: string;
  pastDisastersTitle?: string;
  searchDisasterPlaceholder?: string;
  compareNow?: string;
}

export const TRANSLATIONS: Record<string, TranslationDictionary> = {
  en: {
    appTitle: "Disaster Intelligence Platform",
    appSubtitle: "Official Alerts • Geospatial Context • Grounded Research",
    presentTab: "PRESENT (Live Situation)",
    pastTab: "PAST (Historical Research)",
    liveStatus: "OFFICIAL FEED LIVE",
    staleStatus: "CACHED SNAPSHOT",
    activeAlerts: "Active Official Alerts",
    alertTypes: "Alert Categories",
    useMyLocation: "Use My Location",
    checkAnotherLocation: "Check Another Location",
    searchLocationPlaceholder: "Search Indian city, district or village...",
    nearMeMode: "NEAR ME",
    indiaMode: "ALL INDIA",
    officialInstructionTitle: "Official Instructions",
    plainSummaryTitle: "Situation Summary",
    viewDetails: "View Details",
    dismiss: "Dismiss",
    share: "Share Warning",
    copySummary: "Copy Summary",
    searchDisastersPlaceholder: "Search historical disasters, events or locations (e.g., Cyclone Fani, Kerala Floods)...",
    historicalResearchTitle: "Historical Disaster Research",
    compareEvents: "Compare Events",
    aiAssistant: "AI Research Assistant",
    originalReports: "Original Reports & Media",
    timelineTitle: "Chronological Timeline",
    whatHappenedTitle: "What Happened",
    impactTitle: "Human & Infrastructure Impact",
    responseTitle: "Government & Rescue Response",
    sourceAssessmentTitle: "Source Assessment",
    conflictingReportsTitle: "Conflicting Reports",
    noAlertsNearby: "No active alerts detected near your location.",
    noActiveAlerts: "No active official alerts currently in feed.",
    currentNewsTitle: "Verified Current News (72h Gate)",
    voiceAssistantTitle: "Multilingual Voice Assistant",
    voiceListening: "Listening in your language...",
    voiceSpeakPrompt: "Speak or ask anything in any Indian language",
    searchLanguagePlaceholder: "Search language (English or script)...",
    indiaMapTitle: "All India Disaster Live Map",
  },
  hi: {
    appTitle: "आपदा सूचना एवं अनुसंधान मंच",
    appSubtitle: "आधिकारिक अलर्ट • भू-स्थानिक संदर्भ • प्रामाणिक शोध",
    presentTab: "वर्तमान (सक्रिय आपदाएं)",
    pastTab: "अतीत (ऐतिहासिक शोध)",
    liveStatus: "लाइव आधिकारिक अलर्ट",
    staleStatus: "कैश डेटा (सत्यापित)",
    activeAlerts: "सक्रिय आधिकारिक अलर्ट",
    alertTypes: "आपदा श्रेणियां",
    useMyLocation: "मेरा स्थान उपयोग करें",
    checkAnotherLocation: "अन्य स्थान की जांच करें",
    searchLocationPlaceholder: "शहर, जिला या गांव खोजें...",
    nearMeMode: "मेरे निकट",
    indiaMode: "अखिल भारतीय",
    officialInstructionTitle: "आधिकारिक निर्देश",
    plainSummaryTitle: "स्थिति सारांश",
    viewDetails: "विवरण देखें",
    dismiss: "हटाएं",
    share: "चेतावनी साझा करें",
    copySummary: "सारांश कॉपी करें",
    searchDisastersPlaceholder: "ऐतिहासिक आपदाएं या घटनाएं खोजें (उदा. फानी चक्रवात, केरल बाढ़)...",
    historicalResearchTitle: "ऐतिहासिक आपदा अनुसंधान",
    compareEvents: "घटनाओं की तुलना करें",
    aiAssistant: "एआई शोध सहायक",
    originalReports: "मूल समाचार और रिपोर्ट",
    timelineTitle: "घटनाक्रम (टाइमलाइन)",
    whatHappenedTitle: "क्या हुआ था",
    impactTitle: "मानवीय एवं ढांचागत प्रभाव",
    responseTitle: "सरकारी एवं राहत प्रतिक्रिया",
    sourceAssessmentTitle: "स्रोत विश्वसनीयता",
    conflictingReportsTitle: "विरोधाभासी रिपोर्टें",
    noAlertsNearby: "आपके स्थान के पास कोई सक्रिय अलर्ट नहीं है।",
    noActiveAlerts: "वर्तमान में कोई सक्रिय चेतावनी नहीं है।",
    currentNewsTitle: "सत्यापित हालिया समाचार (72 घंटे)",
    voiceAssistantTitle: "बहुभाषी वॉइस सहायक",
    voiceListening: "आपकी भाषा में सुन रहे हैं...",
    voiceSpeakPrompt: "किसी भी भारतीय भाषा में बोलें या पूछें",
    searchLanguagePlaceholder: "भाषा खोजें (अंग्रेजी या लिपि)...",
  },
  bn: {
    appTitle: "দুর্যোগ তথ্য ও গবেষণা প্ল্যাটফর্ম",
    appSubtitle: "সরকারি সতর্কতা • ভূ-স্থানিক বুদ্ধিমত্তা • তথ্যভিত্তিক গবেষণা",
    presentTab: "বর্তমান (লাইভ পরিস্থিতি)",
    pastTab: "অতীত (ঐতিহাসিক গবেষণা)",
    liveStatus: "লাইভ সরকারি তথ্য",
    staleStatus: "ক্যাশ ডেটা",
    activeAlerts: "সক্রিয় সরকারি সতর্কতা",
    alertTypes: "দুর্যোগের ধরন",
    useMyLocation: "আমার অবস্থান ব্যবহার করুন",
    checkAnotherLocation: "অন্য স্থান পরীক্ষা করুন",
    searchLocationPlaceholder: "শহর, জেলা বা স্থান অনুসন্ধান করুন...",
    nearMeMode: "আমার কাছে",
    indiaMode: "সমগ্র ভারত",
    officialInstructionTitle: "সরকারি নির্দেশাবলী",
    plainSummaryTitle: "পরিস্থিতি সারসংক্ষেপ",
    viewDetails: "বিস্তারিত দেখুন",
    dismiss: "বাতিল করুন",
    share: "সতর্কতা শেয়ার করুন",
    copySummary: "সারসংক্ষেপ কপি করুন",
    searchDisastersPlaceholder: "ঐতিহাসিক দুর্যোগ খুঁজুন (যেমন: ঘূর্ণিঝড় ফণী, কেরালা বন্যা)...",
    historicalResearchTitle: "ঐতিহাসিক দুর্যোগ গবেষণা",
    compareEvents: "ঘটনা তুলনা করুন",
    aiAssistant: "এআই গবেষণা সহকারী",
    originalReports: "মূল প্রতিবেদন ও সংবাদ",
    timelineTitle: "ঘটনাপঞ্জি (টাইমলাইন)",
    whatHappenedTitle: "কী ঘটেছিল",
    impactTitle: "মানবিক ও অবকাঠামোগত ক্ষয়ক্ষতি",
    responseTitle: "সরকারি ত্রাণ ও উদ্ধার কাজ",
    sourceAssessmentTitle: "উৎস নির্ভরযোগ্যতা",
    conflictingReportsTitle: "পরস্পরবিরোধী রিপোর্ট",
    noAlertsNearby: "আপনার এলাকার কাছে কোনো সক্রিয় সতর্কতা নেই।",
    noActiveAlerts: "বর্তমানে কোনো সক্রিয় সতর্কতা নেই।",
    currentNewsTitle: "যাচাইকৃত সাম্প্রতিক সংবাদ (৭২ ঘণ্টা)",
    voiceAssistantTitle: "বহুভাষিক ভয়েস সহকারী",
    voiceListening: "আপনার ভাষায় শুনছি...",
    voiceSpeakPrompt: "যেকোনো ভারতীয় ভাষায় কথা বলুন বা জিজ্ঞাসা করুন",
    searchLanguagePlaceholder: "ভাষা খুঁজুন (ইংরেজি বা বাংলা লিপিতে)...",
  },
  ta: {
    appTitle: "பேரிடர் தகவல் தளம்",
    appSubtitle: "அதிகாரப்பூர்வ எச்சரிக்கைகள் • புவிசார் சூழல் • ஆதார அடிப்படையிலான ஆய்வு",
    presentTab: "தற்போதைய நிலை (நேரலை)",
    pastTab: "கடந்த கால ஆய்வு (வரலாறு)",
    liveStatus: "நேரலை எச்சரிக்கை",
    staleStatus: "சேமிக்கப்பட்ட தகவல்",
    activeAlerts: "செயலில் உள்ள எச்சரிக்கைகள்",
    alertTypes: "பேரிடர் வகைகள்",
    useMyLocation: "எனது இருப்பிடத்தைப் பயன்படுத்து",
    checkAnotherLocation: "வேறு இடத்தை சரிபார்க்கவும்",
    searchLocationPlaceholder: "நகரம், மாவட்டம் அல்லது கிராமத்தை தேடுங்கள்...",
    nearMeMode: "என் அருகில்",
    indiaMode: "இந்தியா முழுவதும்",
    officialInstructionTitle: "அதிகாரப்பூர்வ வழிகாட்டுதல்கள்",
    plainSummaryTitle: "நிலைமை சுருக்கம்",
    viewDetails: "விவரங்களைக் காண்க",
    dismiss: "விலக்கு",
    share: "பகிரவும்",
    copySummary: "சுருக்கத்தை நகலெடு",
    searchDisastersPlaceholder: "வரலாற்றுப் பேரிடர்களைத் தேடுங்கள் (எ.கா. ஃபானி புயல்)...",
    historicalResearchTitle: "வரலாற்றுப் பேரிடர் ஆராய்ச்சி",
    compareEvents: "ஒப்பிடுக",
    aiAssistant: "AI ஆராய்ச்சி உதவியாளர்",
    originalReports: "அசல் அறிக்கைகள்",
    timelineTitle: "காலவரிசை",
    whatHappenedTitle: "என்ன நடந்தது",
    impactTitle: "பாதிப்புகள்",
    responseTitle: "அரசு நிவாரணப் பணிகள்",
    sourceAssessmentTitle: "ஆதார மதிப்பீடு",
    conflictingReportsTitle: "முரண்பட்ட அறிக்கைகள்",
    noAlertsNearby: "உங்கள் பகுதிக்கு அருகில் எச்சரிக்கைகள் இல்லை.",
    noActiveAlerts: "செயலில் உள்ள எச்சரிக்கைகள் எதுவும் இல்லை.",
    currentNewsTitle: "சரிபார்க்கப்பட்ட சமீபத்திய செய்திகள்",
    voiceAssistantTitle: "குரல் உதவியாளர்",
    voiceListening: "கேட்கிறது...",
    voiceSpeakPrompt: "எந்த இந்திய மொழியிலும் பேசுங்கள்",
    searchLanguagePlaceholder: "மொழியைத் தேடுங்கள்...",
  },
  te: {
    appTitle: "విపత్తు సమాచార వేదిక",
    appSubtitle: "అధికారిక హెచ్చరికలు • భౌగోళిక సమాచారం • పరిశోధన",
    presentTab: "ప్రస్తుత స్థితి (లైవ్)",
    pastTab: "గత చరిత్ర (పరిశోధన)",
    liveStatus: "ప్రత్యక్ష సమాచారం",
    staleStatus: "కాష్ సమాచారం",
    activeAlerts: "యాక్టివ్ హెచ్చరికలు",
    alertTypes: "విపత్తు రకాలు",
    useMyLocation: "నా లొకేషన్ ఉపయోగించండి",
    checkAnotherLocation: "మరో ప్రాంతాన్ని తనిఖీ చేయండి",
    searchLocationPlaceholder: "నగరం లేదా జిల్లాను శోధించండి...",
    nearMeMode: "నా దగ్గర",
    indiaMode: "భారతదేశం అంతటా",
    officialInstructionTitle: "అధికారిక సూచనలు",
    plainSummaryTitle: "పరిస్థితి సారాంశం",
    viewDetails: "వివరాలు చూడండి",
    dismiss: "రద్దు చేయి",
    share: "హెచ్చరికను పంచుకోండి",
    copySummary: "సారాంశాన్ని కాపీ చేయండి",
    searchDisastersPlaceholder: "చారిత్రక విపత్తులను శోధించండి...",
    historicalResearchTitle: "చారిత్రక విపత్తు పరిశోధన",
    compareEvents: "ఈవెంట్లను సరిపోల్చండి",
    aiAssistant: "AI సహాయకుడు",
    originalReports: "అసలు నివేదికలు",
    timelineTitle: "టైమ్‌లైన్",
    whatHappenedTitle: "ఏమి జరిగింది",
    impactTitle: "ప్రభావం మరియు నష్టం",
    responseTitle: "ప్రభుత్వ ప్రతిస్పందన",
    sourceAssessmentTitle: "మూలాల ధృవీకరణ",
    conflictingReportsTitle: "విరుద్ధ నివేదికలు",
    noAlertsNearby: "మీ ప్రాంతంలో హెచ్చరికలు లేవు.",
    noActiveAlerts: "యాక్టివ్ హెచ్చరికలు ఏవీ లేవు.",
    currentNewsTitle: "తాజా వార్తలు",
    voiceAssistantTitle: "వాయిస్ అసిస్టెంట్",
    voiceListening: "వింటోంది...",
    voiceSpeakPrompt: "భారతీయ భాషలో మాట్లాడండి",
    searchLanguagePlaceholder: "భాషను శోధించండి...",
  },
  mr: {
    appTitle: "आपत्ती माहिती व संशोधन व्यासपीठ",
    appSubtitle: "अधिकृत इशारे • भौगोलिक संदर्भ • पुरावा-आधारित संशोधन",
    presentTab: "सध्याची स्थिती (लाईव्ह)",
    pastTab: "भूतकाळ (ऐतिहासिक संशोधन)",
    liveStatus: "लाईव्ह अधिकृत डेटा",
    staleStatus: "कॅश डेटा",
    activeAlerts: "सक्रिय अधिकृत इशारे",
    alertTypes: "आपत्ती प्रकार",
    useMyLocation: "माझे स्थान वापरा",
    checkAnotherLocation: "इतर स्थान तपासा",
    searchLocationPlaceholder: "शहर, जिल्हा किंवा गाव शोधा...",
    nearMeMode: "माझ्या जवळ",
    indiaMode: "संपूर्ण भारत",
    officialInstructionTitle: "अधिकृत सूचना",
    plainSummaryTitle: "परिस्थितीचा सारांश",
    viewDetails: "तपशील पहा",
    dismiss: "बंद करा",
    share: "इशारा शेअर करा",
    copySummary: "सारांश कॉपी करा",
    searchDisastersPlaceholder: "ऐतिहासिक आपत्ती शोधा...",
    historicalResearchTitle: "ऐतिहासिक आपत्ती संशोधन",
    compareEvents: "तुलना करा",
    aiAssistant: "एआय संशोधन सहाय्यक",
    originalReports: "मूळ बातम्या व अहवाल",
    timelineTitle: "घटनाक्रम (टाइमलाइन)",
    whatHappenedTitle: "काय घडले होते",
    impactTitle: "मानवी व पायाभूत नुकसान",
    responseTitle: "शासकीय मदत व बचाव कार्य",
    sourceAssessmentTitle: "स्रोत विश्वसनीयता",
    conflictingReportsTitle: "परस्परविरोधी अहवाल",
    noAlertsNearby: "तुमच्या परिसरात कोणताही इशारा नाही.",
    noActiveAlerts: "सध्या कोणताही सक्रिय इशारा नाही.",
    currentNewsTitle: "सत्यापित ताज्या बातम्या",
    voiceAssistantTitle: "व्हॉइस सहाय्यक",
    voiceListening: "ऐकत आहे...",
    voiceSpeakPrompt: "कोणत्याही भारतीय भाषेत बोला",
    searchLanguagePlaceholder: "भाषा शोधा...",
  },
  or: {
    appTitle: "ବିପର୍ଯ୍ୟୟ ସୂଚନା ଓ ଅନୁସନ୍ଧାନ ମଞ୍ଚ",
    appSubtitle: "ସରକାରୀ ସତର୍କତା • ଭୌଗୋଳିକ ସୂଚନା • ତଥ୍ୟଭିତ୍ତିକ ଗବେଷଣା",
    presentTab: "ବର୍ତ୍ତମାନ (ଲାଇଭ ସ୍ଥିତି)",
    pastTab: "ଅତୀତ (ଐତିହାସିକ ଗବେଷଣା)",
    liveStatus: "ଲାଇଭ ସରକାରୀ ସୂଚନା",
    staleStatus: "କ୍ୟାସ୍ ତଥ୍ୟ",
    activeAlerts: "ସକ୍ରିୟ ସରକାରୀ ସତର୍କତା",
    alertTypes: "ବିପର୍ଯ୍ୟୟ ବର୍ଗ",
    useMyLocation: "ମୋର ସ୍ଥାନ ବ୍ୟବହାର କରନ୍ତୁ",
    checkAnotherLocation: "ଅନ୍ୟ ସ୍ଥାନ ଯାଞ୍ଚ କରନ୍ତୁ",
    searchLocationPlaceholder: "ସହର, ଜିଲ୍ଲା ବା ଗ୍ରାମ ଖୋଜନ୍ତୁ...",
    nearMeMode: "ମୋ ନିକଟରେ",
    indiaMode: "ସମଗ୍ର ଭାରତ",
    officialInstructionTitle: "ସରକାରୀ ନିର୍ଦ୍ଦେଶାବଳୀ",
    plainSummaryTitle: "ସ୍ଥିତି ସାରାଂଶ",
    viewDetails: "ବିବରଣୀ ଦେଖନ୍ତୁ",
    dismiss: "ଅଣଦେଖା କରନ୍ତୁ",
    share: "ସତର୍କତା ସେୟାର କରନ୍ତୁ",
    copySummary: "ସାରାଂଶ କପି କରନ୍ତୁ",
    searchDisastersPlaceholder: "ଐତିହାସିକ ବିପର୍ଯ୍ୟୟ ଖୋଜନ୍ତୁ (ଯଥା: ଫନି ବାତ୍ୟା)...",
    historicalResearchTitle: "ଐତିହାସିକ ବିପର୍ଯ୍ୟୟ ଗବେଷଣା",
    compareEvents: "ତୁଳନା କରନ୍ତୁ",
    aiAssistant: "AI ଗବେଷଣା ସହାୟକ",
    originalReports: "ମୂଳ ଖବର ଓ ରିପୋର୍ଟ",
    timelineTitle: "ଘଟଣାକ୍ରମ (ଟାଇମଲାଇନ୍)",
    whatHappenedTitle: "କଣ ଘଟିଥିଲା",
    impactTitle: "ମାନବୀୟ ଓ ଭିତ୍ତିଭୂମି କ୍ଷୟକ୍ଷତି",
    responseTitle: "ସରକାରୀ ଓ ରିଲିଫ ପ୍ରତିକ୍ରିୟା",
    sourceAssessmentTitle: "ଉତ୍ସ ବିଶ୍ୱସନୀୟତା",
    conflictingReportsTitle: "ପରସ୍ପର ବିରୋଧୀ ରିପୋର୍ଟ",
    noAlertsNearby: "ଆପଣଙ୍କ ଅଞ୍ଚଳ ନିକଟରେ କୌଣସି ସକ୍ରିୟ ସତର୍କତା ନାହିଁ।",
    noActiveAlerts: "ବର୍ତ୍ତମାନ କୌଣସି ସକ୍ରିୟ ସତର୍କତା ନାହିଁ।",
    currentNewsTitle: "ସତ୍ୟାପିତ ସାମ୍ପ୍ରତିକ ଖବର (୭୨ ଘଣ୍ଟା)",
    voiceAssistantTitle: "ବହୁଭାଷୀ ଭଏସ୍ ସହାୟକ",
    voiceListening: "ଶୁଣୁଛି...",
    voiceSpeakPrompt: "ଓଡ଼ିଆ କିମ୍ବା ଅନ୍ୟ ଭାରତୀୟ ଭାଷାରେ କୁହନ୍ତୁ",
    searchLanguagePlaceholder: "ଭାଷା ଖୋଜନ୍ତୁ...",
  },
};

export function getTranslation(langCode: string): TranslationDictionary {
  const base = TRANSLATIONS[langCode] || TRANSLATIONS.en;
  return {
    ...TRANSLATIONS.en,
    ...base,
    indiaMapTitle: base.indiaMapTitle || 'All India Disaster Live Map',
    askAIAssistant: base.askAIAssistant || base.aiAssistant || 'Ask AI Assistant',
    pastDisastersTitle: base.pastDisastersTitle || base.historicalResearchTitle || 'Historical Disaster Research',
    searchDisasterPlaceholder: base.searchDisasterPlaceholder || base.searchDisastersPlaceholder || 'Search historical disasters, events or locations (e.g., Cyclone Fani, Kerala Floods)...',
    compareNow: base.compareNow || base.compareEvents || 'Compare Events Now',
  };
}

/**
 * Application-owned copy only. Alert/evidence data keeps its source wording and
 * must never be used as a translation key.
 */
const UI_COPY = {
  en: {
    'HOME': 'Home',
    'FUTURE': 'Future',
    'PRESENT': 'Present',
    'PAST': 'Past',
    'TEAM': 'Team',
    'present.mapTitle': 'All India disaster live map',
    'nav.liveMap': 'Live Map & Alerts', 'nav.historical': 'Historical Research', 'nav.changeLanguage': 'Change application language', 'nav.openAssistant': 'Open multilingual assistant', 'nav.refresh': 'Refresh official alerts', 'nav.noLanguage': 'No matching language found',
    'common.close': 'Close', 'common.cancel': 'Cancel', 'common.retry': 'Retry', 'common.loading': 'Loading…', 'common.error': 'Something went wrong.', 'common.sources': 'Sources', 'common.copy': 'Copy', 'common.copied': 'Copied!', 'common.share': 'Share', 'common.listen': 'Listen', 'common.stop': 'Stop',
    'present.activeHazards': '{count} active hazard{plural}', 'present.allHazards': 'All hazards ({count})', 'present.nearMe': 'Near my location ({count})', 'present.locationOptional': 'Location access is optional. Browse the India map and alert details without GPS; proximity guidance activates after you share a location.', 'present.legend': 'Active alert legend', 'present.highPriority': 'High-priority hazard marker', 'present.moderatePriority': 'Moderate hazard marker', 'present.boundary': 'Official hazard boundary', 'present.yourLocation': 'Your location', 'present.mapOffline': 'Map tiles are offline — text alert fallback is active', 'present.retryMap': 'Retry map layer', 'present.centerLocation': 'Center on my location', 'present.liveGps': 'Live GPS point', 'present.monitoredLocation': 'Monitored location', 'present.indiaOverview': 'India overview with {count} hazards',
    'alerts.shareAlert': 'Share alert', 'alerts.closeDrawer': 'Close alert details', 'alerts.overview': 'Overview & CAP info', 'alerts.protectiveMeasures': 'Protective measures', 'alerts.helplines': 'Helplines', 'alerts.liveAdvisory': 'Live advisory feed', 'alerts.issuingAuthority': 'Issuing authority', 'alerts.bulletinReference': 'Bulletin reference', 'alerts.copyAdvisory': 'Copy advisory', 'alerts.severityUrgency': 'Severity / urgency', 'alerts.certainty': 'Certainty', 'alerts.affectedArea': 'Affected area', 'alerts.effectiveTime': 'Effective time', 'alerts.expiryTime': 'Expiry time', 'alerts.coordinates': '{count} vector coordinates defined', 'alerts.evacuationProtocol': 'Standard evacuation protocol', 'alerts.protectiveActions': 'Actionable protective measures', 'alerts.dos': 'Do’s', 'alerts.donts': 'Don’ts', 'alerts.noGeometry': 'This alert has no precise center or polygon. Showing verified official instructions and supporting coverage only.', 'alerts.controlRooms': 'Emergency control rooms & helplines', 'alerts.tapToCall': 'Tap to call', 'alerts.officialPortal': 'Official portal', 'alerts.portalUnavailable': 'Official portal unavailable', 'alerts.forward': 'Forward alert', 'alerts.translationNotice': 'Official source wording',
    'history.searchPlaceholder': 'Search a disaster event, district, or state to build a live dossier…', 'history.search': 'Search evidence', 'history.download': 'Download report', 'history.allStates': 'All states', 'history.sourcesCount': '{count} source{plural}', 'history.casualties': 'Reported casualties', 'history.damage': 'Estimated damage / loss', 'history.addCompare': 'Add to compare', 'history.inCompare': 'In compare', 'history.askAi': 'Ask AI', 'history.liveDossier': 'Live dossier', 'history.copySummary': 'Copy evidence summary', 'history.noResults': 'No matching sources were found. Try a broader disaster name, district, or state.', 'history.maxCompare': 'You can compare a maximum of 4 disaster events.',
    'assistant.grounded': 'Grounded AI with multilingual speech recognition', 'assistant.listening': 'Listening in {language}… Speak now!', 'assistant.placeholder': 'Ask in {language} or English…', 'assistant.record': 'Record and transcribe speech', 'assistant.pipeline': 'Grounded intelligence synthesis in progress…', 'assistant.unavailable': 'Information unavailable in the retrieved sources.', 'assistant.error': 'Unable to complete the AI query. Please check your connection.',
    'voice.record': 'Click to record and transcribe speech', 'voice.stop': 'Stop ({seconds}s)', 'voice.transcribing': 'Transcribing…', 'voice.microphoneDenied': 'Microphone access denied or unavailable.', 'voice.noSpeech': 'No speech detected. Please speak clearly.', 'voice.transcriptionError': 'Transcription error. Please try again.', 'voice.processingError': 'Failed to process audio.',
    'footer.status': 'Feed status: {status} • Multilingual support enabled', 'error.notFoundTitle': 'Page not found', 'error.notFoundBody': 'The page you asked for does not exist in this workspace.', 'error.returnDashboard': 'Return to dashboard',
    'future.timelineTitle': 'Forecast Timeline',
    'future.timelineSubtitle': 'Select a forecast month to generate predicted flood locations.',
    'future.generating': 'Generating predictions...',
    'future.unavailable': 'Prediction unavailable',
    'future.drawerTitle': 'Predicted Flood Location',
    'future.rankTitle': 'Rank #{rank} Forecast',
    'future.tabOverview': 'Overview & Geography',
    'future.tabAnalysis': 'Severity Analysis',
    'future.probability': 'Flood Probability',
    'future.probabilityDesc': 'Model-estimated probability that this location belongs to the flood-observed class for the selected month.',
    'future.coordinates': 'Coordinates',
    'future.latitude': 'Latitude',
    'future.longitude': 'Longitude',
    'future.severityTitle': 'Predicted Severity Levels',
    'future.peakLevel': 'Peak Flood Level',
    'future.warningLevel': 'Warning Level',
    'future.dangerLevel': 'Danger Level',
    'future.historicalTitle': 'Historical Evidence',
    'future.historicalDesc': 'Historical flood observations recorded at this candidate location.',
    'future.modelTitle': 'Model Interpretation',
    'future.modelDesc': "The probability is the XGBoost model's estimated probability for the flood-observed class. It is a model score and should not be interpreted as a guaranteed real-world probability without probability calibration.",
    'future.riskLevel': 'Risk Level',
    'future.highRisk': 'High Risk',
    'future.mediumRisk': 'Medium Risk',
    'future.lowRisk': 'Low Risk',
    'future.aboveDanger': 'Above Danger Level',
    'future.aboveWarning': 'Above Warning Level',
    'future.belowWarning': 'Normal Flow',
  },
  hi: {
    'HOME': 'होम',
    'FUTURE': 'भविष्य',
    'PRESENT': 'वर्तमान',
    'PAST': 'अतीत',
    'TEAM': 'टीम',
    'present.mapTitle': 'अखिल भारतीय आपदा लाइव मानचित्र',
    'nav.liveMap': 'लाइव मानचित्र और अलर्ट', 'nav.historical': 'ऐतिहासिक अनुसंधान', 'nav.changeLanguage': 'ऐप की भाषा बदलें', 'nav.openAssistant': 'बहुभाषी सहायक खोलें', 'nav.refresh': 'आधिकारिक अलर्ट रीफ़्रेश करें', 'nav.noLanguage': 'कोई मिलती भाषा नहीं मिली',
    'common.close': 'बंद करें', 'common.cancel': 'रद्द करें', 'common.retry': 'पुनः प्रयास करें', 'common.loading': 'लोड हो रहा है…', 'common.error': 'कुछ गलत हुआ।', 'common.sources': 'स्रोत', 'common.copy': 'कॉपी करें', 'common.copied': 'कॉपी हो गया!', 'common.share': 'साझा करें', 'common.listen': 'सुनें', 'common.stop': 'रोकें',
    'present.activeHazards': '{count} सक्रिय खतरे', 'present.allHazards': 'सभी खतरे ({count})', 'present.nearMe': 'मेरे स्थान के पास ({count})', 'present.locationOptional': 'स्थान की अनुमति वैकल्पिक है। GPS के बिना भारत का मानचित्र और अलर्ट विवरण देखें; स्थान साझा करने पर निकटता मार्गदर्शन सक्रिय होगा।', 'present.legend': 'सक्रिय अलर्ट संकेतक', 'present.highPriority': 'उच्च प्राथमिकता खतरा चिह्न', 'present.moderatePriority': 'मध्यम प्राथमिकता खतरा चिह्न', 'present.boundary': 'आधिकारिक खतरा सीमा', 'present.yourLocation': 'आपका स्थान', 'present.mapOffline': 'मानचित्र टाइलें ऑफ़लाइन हैं — पाठ अलर्ट विकल्प सक्रिय है', 'present.retryMap': 'मानचित्र परत पुनः आज़माएँ', 'present.centerLocation': 'मेरे स्थान पर केंद्रित करें', 'present.liveGps': 'लाइव GPS बिंदु', 'present.monitoredLocation': 'निगरानी स्थान', 'present.indiaOverview': '{count} खतरों के साथ भारत अवलोकन',
    'alerts.shareAlert': 'अलर्ट साझा करें', 'alerts.closeDrawer': 'अलर्ट विवरण बंद करें', 'alerts.overview': 'अवलोकन और CAP जानकारी', 'alerts.protectiveMeasures': 'सुरक्षात्मक उपाय', 'alerts.helplines': 'हेल्पलाइन', 'alerts.liveAdvisory': 'लाइव परामर्श फ़ीड', 'alerts.issuingAuthority': 'जारी करने वाली संस्था', 'alerts.bulletinReference': 'बुलेटिन संदर्भ', 'alerts.copyAdvisory': 'परामर्श कॉपी करें', 'alerts.severityUrgency': 'गंभीरता / तात्कालिकता', 'alerts.certainty': 'निश्चितता', 'alerts.affectedArea': 'प्रभावित क्षेत्र', 'alerts.effectiveTime': 'प्रभावी समय', 'alerts.expiryTime': 'समाप्ति समय', 'alerts.coordinates': '{count} वेक्टर निर्देशांक निर्धारित', 'alerts.evacuationProtocol': 'मानक निकासी प्रोटोकॉल', 'alerts.protectiveActions': 'कार्रवाई योग्य सुरक्षात्मक उपाय', 'alerts.dos': 'क्या करें', 'alerts.donts': 'क्या न करें', 'alerts.noGeometry': 'इस अलर्ट में सटीक केंद्र या बहुभुज नहीं है। केवल सत्यापित आधिकारिक निर्देश और सहायक कवरेज दिखाया जा रहा है।', 'alerts.controlRooms': 'आपात नियंत्रण कक्ष और हेल्पलाइन', 'alerts.tapToCall': 'कॉल करने के लिए टैप करें', 'alerts.officialPortal': 'आधिकारिक पोर्टल', 'alerts.portalUnavailable': 'आधिकारिक पोर्टल उपलब्ध नहीं', 'alerts.forward': 'अलर्ट अग्रेषित करें', 'alerts.translationNotice': 'आधिकारिक स्रोत का मूल पाठ',
    'history.searchPlaceholder': 'लाइव डोज़ियर बनाने के लिए आपदा, ज़िला या राज्य खोजें…', 'history.search': 'साक्ष्य खोजें', 'history.download': 'रिपोर्ट डाउनलोड करें', 'history.allStates': 'सभी राज्य', 'history.sourcesCount': '{count} स्रोत', 'history.casualties': 'रिपोर्ट की गई हताहत', 'history.damage': 'अनुमानित क्षति / हानि', 'history.addCompare': 'तुलना में जोड़ें', 'history.inCompare': 'तुलना में है', 'history.askAi': 'AI से पूछें', 'history.liveDossier': 'लाइव डोज़ियर', 'history.copySummary': 'साक्ष्य सारांश कॉपी करें', 'history.noResults': 'कोई मिलते स्रोत नहीं मिले। व्यापक आपदा नाम, ज़िला या राज्य आज़माएँ।', 'history.maxCompare': 'एक साथ अधिकतम 4 आपदाओं की तुलना कर सकते हैं।',
    'assistant.grounded': 'बहुभाषी वाक् पहचान के साथ साक्ष्य-आधारित AI', 'assistant.listening': '{language} में सुन रहे हैं… अब बोलें!', 'assistant.placeholder': '{language} या अंग्रेज़ी में पूछें…', 'assistant.record': 'भाषण रिकॉर्ड और ट्रांसक्राइब करें', 'assistant.pipeline': 'साक्ष्य-आधारित विश्लेषण जारी है…', 'assistant.unavailable': 'प्राप्त स्रोतों में जानकारी उपलब्ध नहीं है।', 'assistant.error': 'AI प्रश्न पूरा नहीं हो सका। अपना कनेक्शन जाँचें।',
    'voice.record': 'रिकॉर्ड करने और भाषण लिखने के लिए क्लिक करें', 'voice.stop': 'रोकें ({seconds}से)', 'voice.transcribing': 'लिप्यंतरण हो रहा है…', 'voice.microphoneDenied': 'माइक्रोफ़ोन अनुमति अस्वीकृत या अनुपलब्ध है।', 'voice.noSpeech': 'कोई भाषण नहीं मिला। कृपया स्पष्ट बोलें।', 'voice.transcriptionError': 'लिप्यंतरण त्रुटि। पुनः प्रयास करें।', 'voice.processingError': 'ऑडियो संसाधित नहीं हो सका।',
    'footer.status': 'फ़ीड स्थिति: {status} • बहुभाषी सहायता सक्षम', 'error.notFoundTitle': 'पृष्ठ नहीं मिला', 'error.notFoundBody': 'आपके द्वारा माँगा गया पृष्ठ इस कार्यक्षेत्र में नहीं है।', 'error.returnDashboard': 'डैशबोर्ड पर लौटें',
    'future.timelineTitle': 'पूर्वानुमान समयरेखा',
    'future.timelineSubtitle': 'पूर्वानुमानित बाढ़ स्थानों को उत्पन्न करने के लिए एक पूर्वानुमान महीना चुनें।',
    'future.generating': 'पूर्वानुमान उत्पन्न किए जा रहे हैं...',
    'future.unavailable': 'पूर्वानुमान अनुपलब्ध',
    'future.drawerTitle': 'पूर्वानुमानित बाढ़ स्थान',
    'future.rankTitle': 'रैंक #{rank} पूर्वानुमान',
    'future.tabOverview': 'अवलोकन और भूगोल',
    'future.tabAnalysis': 'गंभीरता विश्लेषण',
    'future.probability': 'बाढ़ की संभावना',
    'future.probabilityDesc': 'मॉडल-अनुमानित संभावना कि यह स्थान चयनित महीने के लिए बाढ़-प्रेक्षित वर्ग से संबंधित है।',
    'future.coordinates': 'निर्देशांक',
    'future.latitude': 'अक्षांश',
    'future.longitude': 'देशांतर',
    'future.severityTitle': 'पूर्वानुमानित गंभीरता स्तर',
    'future.peakLevel': 'उच्चतम बाढ़ स्तर',
    'future.warningLevel': 'चेतावनी स्तर',
    'future.dangerLevel': 'खतरे का स्तर',
    'future.historicalTitle': 'ऐतिहासिक साक्ष्य',
    'future.historicalDesc': 'इस उम्मीदवार स्थान पर दर्ज किए गए ऐतिहासिक बाढ़ प्रेक्षण।',
    'future.modelTitle': 'मॉडल व्याख्या',
    'future.modelDesc': 'संभावना बाढ़-प्रेक्षित वर्ग के लिए XGBoost मॉडल की अनुमानित संभावना है। यह एक मॉडल स्कोर है और इसे बिना संभावना अंशांकन के वास्तविक दुनिया की गारंटीकृत संभावना के रूप में नहीं लिया जाना चाहिए।',
    'future.riskLevel': 'जोखिम का स्तर',
    'future.highRisk': 'उच्च जोखिम',
    'future.mediumRisk': 'मध्यम जोखिम',
    'future.lowRisk': 'कम जोखिम',
    'future.aboveDanger': 'खतरे के स्तर से ऊपर',
    'future.aboveWarning': 'चेतावनी के स्तर से ऊपर',
    'future.belowWarning': 'सामान्य बहाव',
  },
  bn: {
    'HOME': 'হোম',
    'FUTURE': 'ভবিষ্যৎ',
    'PRESENT': 'বর্তমান',
    'PAST': 'অতীত',
    'TEAM': 'টিম',
    'present.mapTitle': 'সর্বভারতীয় দুর্যোগ লাইভ মানচিত্র',
    'nav.liveMap': 'লাইভ মানচিত্র ও সতর্কতা', 'nav.historical': 'ঐতিহাসিক গবেষণা', 'nav.changeLanguage': 'অ্যাপের ভাষা বদলান', 'nav.openAssistant': 'বহুভাষী সহায়ক খুলুন', 'nav.refresh': 'সরকারি সতর্কতা রিফ্রেশ করুন', 'nav.noLanguage': 'মিলে এমন ভাষা পাওয়া যায়নি',
    'common.close': 'বন্ধ করুন', 'common.cancel': 'বাতিল', 'common.retry': 'আবার চেষ্টা করুন', 'common.loading': 'লোড হচ্ছে…', 'common.error': 'কিছু ভুল হয়েছে।', 'common.sources': 'উৎস', 'common.copy': 'কপি করুন', 'common.copied': 'কপি হয়েছে!', 'common.share': 'শেয়ার করুন', 'common.listen': 'শুনুন', 'common.stop': 'থামান',
    'present.activeHazards': '{count} সক্রিয় বিপদ', 'present.allHazards': 'সব বিপদ ({count})', 'present.nearMe': 'আমার অবস্থানের কাছে ({count})', 'present.locationOptional': 'অবস্থানের অনুমতি ঐচ্ছিক। GPS ছাড়াই ভারতের মানচিত্র ও সতর্কতার বিবরণ দেখুন; অবস্থান শেয়ার করলে নৈকট্য নির্দেশনা সক্রিয় হবে।', 'present.legend': 'সক্রিয় সতর্কতা কিংবদন্তি', 'present.highPriority': 'উচ্চ অগ্রাধিকারের বিপদ চিহ্ন', 'present.moderatePriority': 'মাঝারি অগ্রাধিকারের বিপদ চিহ্ন', 'present.boundary': 'সরকারি বিপদসীমা', 'present.yourLocation': 'আপনার অবস্থান', 'present.mapOffline': 'মানচিত্র টাইল অফলাইন — পাঠ্য সতর্কতা বিকল্প সক্রিয়', 'present.retryMap': 'মানচিত্র স্তর পুনরায় চেষ্টা করুন', 'present.centerLocation': 'আমার অবস্থানে কেন্দ্রীভূত করুন', 'present.liveGps': 'লাইভ GPS বিন্দু', 'present.monitoredLocation': 'নিরীক্ষিত অবস্থান', 'present.indiaOverview': '{count} বিপদসহ ভারত পর্যালোচনা',
    'alerts.shareAlert': 'সতর্কতা শেয়ার করুন', 'alerts.closeDrawer': 'সতর্কতার বিবরণ বন্ধ করুন', 'alerts.overview': 'সারসংক্ষেপ ও CAP তথ্য', 'alerts.protectiveMeasures': 'সুরক্ষামূলক ব্যবস্থা', 'alerts.helplines': 'হেল্পলাইন', 'alerts.liveAdvisory': 'লাইভ পরামর্শ ফিড', 'alerts.issuingAuthority': 'প্রদানকারী সংস্থা', 'alerts.bulletinReference': 'বুলেটিন রেফারেন্স', 'alerts.copyAdvisory': 'পরামর্শ কপি করুন', 'alerts.severityUrgency': 'তীব্রতা / জরুরি অবস্থা', 'alerts.certainty': 'নিশ্চয়তা', 'alerts.affectedArea': 'প্রভাবিত এলাকা', 'alerts.effectiveTime': 'কার্যকর সময়', 'alerts.expiryTime': 'মেয়াদ শেষের সময়', 'alerts.coordinates': '{count} ভেক্টর কোঅর্ডিনেট নির্ধারিত', 'alerts.evacuationProtocol': 'মানক সরিয়ে নেওয়ার প্রোটোকল', 'alerts.protectiveActions': 'করণীয় সুরক্ষামূলক ব্যবস্থা', 'alerts.dos': 'করণীয়', 'alerts.donts': 'বর্জনীয়', 'alerts.noGeometry': 'এই সতর্কতায় নির্দিষ্ট কেন্দ্র বা বহুভুজ নেই। শুধুমাত্র যাচাইকৃত সরকারি নির্দেশনা ও সহায়ক তথ্য দেখানো হচ্ছে।', 'alerts.controlRooms': 'জরুরি নিয়ন্ত্রণকক্ষ ও হেল্পলাইন', 'alerts.tapToCall': 'কল করতে ট্যাপ করুন', 'alerts.officialPortal': 'সরকারি পোর্টাল', 'alerts.portalUnavailable': 'সরকারি পোর্টাল অনুপলব্ধ', 'alerts.forward': 'সতর্কতা ফরওয়ার্ড করুন', 'alerts.translationNotice': 'সরকারি উৎসের মূল ভাষ্য',
    'history.searchPlaceholder': 'লাইভ ডসিয়ার তৈরির জন্য দুর্যোগ, জেলা বা রাজ্য খুঁজুন…', 'history.search': 'প্রমাণ খুঁজুন', 'history.download': 'রিপোর্ট ডাউনলোড করুন', 'history.allStates': 'সব রাজ্য', 'history.sourcesCount': '{count} উৎস', 'history.casualties': 'প্রতিবেদিত হতাহত', 'history.damage': 'আনুমানিক ক্ষতি / লোকসান', 'history.addCompare': 'তুলনায় যোগ করুন', 'history.inCompare': 'তুলনায় আছে', 'history.askAi': 'AI-কে জিজ্ঞাসা করুন', 'history.liveDossier': 'লাইভ ডসিয়ার', 'history.copySummary': 'প্রমাণের সারাংশ কপি করুন', 'history.noResults': 'মিলে এমন উৎস পাওয়া যায়নি। আরও বিস্তৃত দুর্যোগের নাম, জেলা বা রাজ্য চেষ্টা করুন।', 'history.maxCompare': 'একসঙ্গে সর্বোচ্চ ৪টি দুর্যোগের তুলনা করা যায়।',
    'assistant.grounded': 'বহুভাষী বক্তৃতা শনাক্তকরণসহ প্রমাণভিত্তিক AI', 'assistant.listening': '{language} ভাষায় শুনছি… এখন বলুন!', 'assistant.placeholder': '{language} বা ইংরেজিতে জিজ্ঞাসা করুন…', 'assistant.record': 'বক্তৃতা রেকর্ড ও প্রতিলিপি করুন', 'assistant.pipeline': 'প্রমাণভিত্তিক বিশ্লেষণ চলছে…', 'assistant.unavailable': 'পাওয়া উৎসে তথ্য উপলব্ধ নেই।', 'assistant.error': 'AI প্রশ্নটি সম্পন্ন করা যায়নি। সংযোগ পরীক্ষা করুন।',
    'voice.record': 'রেকর্ড ও বক্তৃতা প্রতিলিপির জন্য ক্লিক করুন', 'voice.stop': 'থামান ({seconds}সে)', 'voice.transcribing': 'প্রতিলিপি হচ্ছে…', 'voice.microphoneDenied': 'মাইক্রোফোন অনুমতি অস্বীকৃত বা অনুপলব্ধ।', 'voice.noSpeech': 'কোনো বক্তৃতা পাওয়া যায়নি। স্পষ্ট করে বলুন।', 'voice.transcriptionError': 'প্রতিলিপি ত্রুটি। আবার চেষ্টা করুন।', 'voice.processingError': 'অডিও প্রক্রিয়া করা যায়নি।',
    'footer.status': 'ফিড অবস্থা: {status} • বহুভাষী সহায়তা সক্রিয়', 'error.notFoundTitle': 'পৃষ্ঠা পাওয়া যায়নি', 'error.notFoundBody': 'আপনি যে পৃষ্ঠাটি চেয়েছেন তা এই কর্মক্ষেত্রে নেই।', 'error.returnDashboard': 'ড্যাশবোর্ডে ফিরুন',
    'future.timelineTitle': 'পূর্বাভাস সময়রেখা',
    'future.timelineSubtitle': 'পূর্বাভাসিত বন্যার অবস্থান তৈরি করতে একটি পূর্বাভাস মাস নির্বাচন করুন।',
    'future.generating': 'পূর্বাভাস তৈরি করা হচ্ছে...',
    'future.unavailable': 'পূর্বাভাস অনুপলব্ধ',
    'future.drawerTitle': 'পূর্বাভাসিত বন্যার অবস্থান',
    'future.rankTitle': 'র‌্যাঙ্ক #{rank} পূর্বাভাস',
    'future.tabOverview': 'সারসংক্ষেপ ও ভূগোল',
    'future.tabAnalysis': 'তীব্রতা বিশ্লেষণ',
    'future.probability': 'বন্যার সম্ভাবনা',
    'future.probabilityDesc': 'মডেল-ানুমানিক সম্ভাবনা যে এই অবস্থানটি নির্বাচিত মাসের জন্য বন্যা-পর্যবেক্ষিত শ্রেণীর অন্তর্গত।',
    'future.coordinates': 'স্থানাঙ্ক',
    'future.latitude': 'অক্ষাংশ',
    'future.longitude': 'দ্রাঘিমাংশ',
    'future.severityTitle': 'পূর্বাভাসিত তীব্রতার মাত্রা',
    'future.peakLevel': 'সর্বোচ্চ বন্যার স্তর',
    'future.warningLevel': 'সতর্কতার স্তর',
    'future.dangerLevel': 'বিপদের স্তর',
    'future.historicalTitle': 'ঐতিহাসিক প্রমাণ',
    'future.historicalDesc': 'এই প্রার্থী অবস্থানে রেকর্ড করা ঐতিহাসিক বন্যার পর্যবেক্ষণ।',
    'future.modelTitle': 'মডেল ব্যাখ্যা',
    'future.modelDesc': 'সম্ভাবনাটি হলো বন্যা-পর্যবেক্ষিত শ্রেণীর জন্য XGBoost মডেলের আনুমানিক সম্ভাবনা। এটি একটি মডেল স্কোর এবং সম্ভাবনা ক্রমাঙ্কন ছাড়া একটি নিশ্চিত বাস্তব-জগতের সম্ভাবনা হিসাবে ব্যাখ্যা করা উচিত নয়।',
    'future.riskLevel': 'ঝুঁকির মাত্রা',
    'future.highRisk': 'উচ্চ ঝুঁকি',
    'future.mediumRisk': 'মাঝারি ঝুঁকি',
    'future.lowRisk': 'কম ঝুঁকি',
    'future.aboveDanger': 'বিপদ সীমার উপরে',
    'future.aboveWarning': 'সতর্কতা সীমার উপরে',
    'future.belowWarning': 'স্বাভাবিক প্রবাহ',
  },
} as const;

export type TranslationKey = keyof typeof UI_COPY.en;
export function translate(language: string, key: TranslationKey, values: Record<string, string | number> = {}): string {
  const dictionary = UI_COPY[language as keyof typeof UI_COPY] || UI_COPY.en;
  let value = (dictionary as Record<string, string>)[key] || UI_COPY.en[key] || key;
  const count = Number(values.count);
  value = value.replace('{plural}', count === 1 ? '' : 's');
  return value.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}

export function getLocale(language: string): string {
  return (INDIAN_LANGUAGES.find((item) => item.code === language) || INDIAN_LANGUAGES[0]).speechLocale;
}

const HAZARD_LABELS: Record<string, Record<string, string>> = {
  en: {},
  hi: { Cyclone: 'चक्रवात', Flood: 'बाढ़', Earthquake: 'भूकंप', Landslide: 'भूस्खलन', 'Heat Wave': 'लू', Lightning: 'आकाशीय बिजली', Thunderstorm: 'आंधी-तूफ़ान', 'Heavy Rain': 'भारी वर्षा', Storm: 'तूफ़ान', Tsunami: 'सुनामी', Avalanche: 'हिमस्खलन', 'Forest Fire': 'वनाग्नि', Drought: 'सूखा', 'Urban Flood': 'शहरी बाढ़', 'General Alert': 'सामान्य चेतावनी' },
  bn: { Cyclone: 'ঘূর্ণিঝড়', Flood: 'বন্যা', Earthquake: 'ভূমিকম্প', Landslide: 'ভূমিধস', 'Heat Wave': 'তাপপ্রবাহ', Lightning: 'বজ্রপাত', Thunderstorm: 'বজ্রঝড়', 'Heavy Rain': 'ভারী বৃষ্টি', Storm: 'ঝড়', Tsunami: 'সুনামি', Avalanche: 'তুষারধস', 'Forest Fire': 'বন আগুন', Drought: 'খরা', 'Urban Flood': 'শহুরে বন্যা', 'General Alert': 'সাধারণ সতর্কতা' },
};

export function hazardLabel(language: string, category: string): string {
  return HAZARD_LABELS[language]?.[category] || category;
}

const ALERT_ENUM_LABELS: Record<string, Record<string, string>> = {
  en: {},
  hi: { Extreme: 'अत्यंत', Severe: 'गंभीर', Moderate: 'मध्यम', Minor: 'न्यून', Unknown: 'अज्ञात', Immediate: 'तत्काल', Expected: 'अपेक्षित', Future: 'भविष्य', Past: 'पूर्व', Observed: 'देखा गया', Likely: 'संभावित', Possible: 'संभव', Unlikely: 'असंभावित' },
  bn: { Extreme: 'চরম', Severe: 'তীব্র', Moderate: 'মধ্যম', Minor: 'সামান্য', Unknown: 'অজানা', Immediate: 'তাৎক্ষণিক', Expected: 'প্রত্যাশিত', Future: 'ভবিষ্যৎ', Past: 'অতীত', Observed: 'পর্যবেক্ষিত', Likely: 'সম্ভাব্য', Possible: 'সম্ভব', Unlikely: 'অসম্ভাব্য' },
};

export function alertEnumLabel(language: string, value: string): string {
  return ALERT_ENUM_LABELS[language]?.[value] || value;
}


--- SIH-2026/frontend/src/lib/api.ts ---

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();
function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizePath(pathname: string): string {
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function apiUrl(pathname: string): string {
  const path = normalizePath(pathname);
  if (!API_BASE_URL) return path;
  return `${stripTrailingSlashes(API_BASE_URL)}${path}`;
}


--- SIH-2026/frontend/src/lib/chatRuntime.ts ---

import type { ExternalStoreAdapter, AppendMessage, ThreadMessageLike } from '@assistant-ui/react';
import type { EvidenceBundle, CitedSource } from '../types/disaster';
import { translatePreservingCitations, translateText } from './googleTranslate';
import { apiUrl } from './api';

export interface ChatRuntimeOptions {
  messages?: ThreadMessageLike[];
  historyRef?: { current: Array<{ role: 'user' | 'assistant'; content: string }> };
  onMessagesChange?: (messages: ThreadMessageLike[]) => void;
  onRunningChange?: (isRunning: boolean) => void;
  inputLanguage?: string;
}

function messageText(message: AppendMessage): string {
  return message.content
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .trim();
}

function sourceMetadata(sources: CitedSource[]) {
  return { custom: { sources, speechText: '' } };
}

export function createChatRuntime(
  language: string,
  associatedBundle: EvidenceBundle | null | undefined,
  options: ChatRuntimeOptions = {},
): ExternalStoreAdapter<ThreadMessageLike> {
  let messages = [...(options.messages || [])];
  const englishHistoryRef = options.historyRef || { current: [] };
  let isRunning = false;

  const subscribers = new Set<() => void>();
  const notify = () => subscribers.forEach((cb) => cb());

  const publish = () => {
    options.onMessagesChange?.([...messages]);
    notify();
  };
  const setRunning = (value: boolean) => {
    isRunning = value;
    options.onRunningChange?.(value);
    notify();
  };

  const adapter: ExternalStoreAdapter<ThreadMessageLike> = {
    get messages() {
      return messages;
    },
    get isRunning() {
      return isRunning;
    },
    // @ts-expect-error subscribe is not defined in ExternalStoreAdapter
    subscribe: (callback) => {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
    convertMessage: (message) => message,
    onNew: async (appendMessage) => {
      const userText = messageText(appendMessage);
      if (!userText) return;

      const userMessage: ThreadMessageLike = {
        role: 'user',
        id: `user-${Date.now()}`,
        createdAt: new Date(),
        content: userText,
      };
      messages = [...messages, userMessage];
      setRunning(true);
      publish();

      try {
        const inputLanguage = options.inputLanguage || language;
        const responseLanguage = options.inputLanguage || language;
        const englishMessage = inputLanguage === 'en' ? userText : await translateText(userText, 'en', inputLanguage);
        const response = await fetch(apiUrl('/api/past/chat'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: englishMessage,
            history: englishHistoryRef.current,
            targetLanguage: responseLanguage,
            associatedBundle,
          }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.details || data?.error || 'AI Assistant query failed');

        const englishReply = String(data?.reply || 'The assistant could not find a grounded answer.');
        englishHistoryRef.current = [...englishHistoryRef.current, { role: 'user', content: englishMessage }, { role: 'assistant', content: englishReply }];
        const reply = language === 'en' ? englishReply : await translatePreservingCitations(englishReply, language);
        const sources = Array.isArray(data?.sources) ? data.sources as CitedSource[] : [];
        messages = [...messages, {
          role: 'assistant',
          id: `assistant-${Date.now()}`,
          createdAt: new Date(),
          content: reply,
          status: { type: 'complete', reason: 'stop' },
          metadata: sourceMetadata(sources),
        }];
      } catch (error) {
        const reply = error instanceof Error ? error.message : 'The assistant could not complete that request.';
        englishHistoryRef.current = [...englishHistoryRef.current, { role: 'user', content: userText }, { role: 'assistant', content: reply }];
        messages = [...messages, {
          role: 'assistant',
          id: `assistant-error-${Date.now()}`,
          createdAt: new Date(),
          content: reply,
          status: { type: 'incomplete', reason: 'error' },
          metadata: sourceMetadata([]),
        }];
      } finally {
        setRunning(false);
        publish();
      }
    },
  };

  return adapter;
}


--- SIH-2026/frontend/src/lib/dateFormat.ts ---

export function formatDisasterDate(iso?: string): string {
  if (!iso) return 'Not available';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


--- SIH-2026/frontend/src/lib/evidenceUtils.ts ---

import { CitedSource, NewsArticle } from '../types/disaster';

/**
 * Validates and sanitizes citation references in text.
 * If text contains [S7] or [S99] but only [S1, S2, S3] exist in the evidence bundle,
 * invalid citations are removed or cleaned so fake source references never reach the user (Section 23 / Section 94).
 */
export function validateAndCleanCitations(text: string, validSources: CitedSource[]): string {
  if (!text) return '';
  const validIds = new Set(validSources.map((s) => s.id.toUpperCase().trim()));

  // Replace citation markers like [S1], [S2][S4], [S7]
  return text.replace(/\[(S\d+)\]/gi, (match, citationId) => {
    const upperId = citationId.toUpperCase().trim();
    if (validIds.has(upperId)) {
      return `[${upperId}]`;
    }
    // Invalid citation -> strip it cleanly
    return '';
  });
}

/**
 * Deduplicates news articles based on normalized URL, title similarity, and publisher.
 */
export function deduplicateNewsArticles(articles: NewsArticle[]): NewsArticle[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const results: NewsArticle[] = [];

  for (const article of articles) {
    if (!article.url || !article.title) continue;

    // Normalize URL: remove query params and protocol trailing slashes
    const normUrl = article.url
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/[\?#].*$/, '')
      .replace(/\/+$/, '');

    // Normalize title: remove punctuation and lowercase
    const normTitle = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (seenUrls.has(normUrl) || seenTitles.has(normTitle)) {
      continue;
    }

    seenUrls.add(normUrl);
    seenTitles.add(normTitle);
    results.push(article);
  }

  return results;
}

/**
 * Validates whether an article satisfies the Present Current-News Temporal Gate (default 72 hours).
 * Rejects articles from previous years (e.g. 2025 in 2026), future dates, or unparseable timestamps.
 */
export function evaluateTemporalGate(
  publishedAtStr: string,
  now: Date = new Date(),
  windowHours: number = 72
): { isEligible: boolean; recencyVerified: boolean; relativeTime: string; reason?: string } {
  if (!publishedAtStr) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: 'recency unverified',
      reason: 'Missing published timestamp',
    };
  }

  const pubDate = new Date(publishedAtStr);
  const pubTime = pubDate.getTime();
  const nowTime = now.getTime();

  if (isNaN(pubTime)) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: 'recency unverified',
      reason: 'Unparseable date format',
    };
  }

  // Reject future dates (more than 15 minutes ahead)
  if (pubTime > nowTime + 15 * 60 * 1000) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: 'recency unverified',
      reason: 'Timestamp is in the future',
    };
  }

  const diffHours = (nowTime - pubTime) / (1000 * 60 * 60);

  // Compute clean relative time
  let relativeTime: string;
  if (diffHours < 1) {
    const mins = Math.max(1, Math.round(diffHours * 60));
    relativeTime = `Published ${mins}m ago`;
  } else if (diffHours < 24) {
    const hrs = Math.round(diffHours);
    relativeTime = `Published ${hrs}h ago`;
  } else {
    const days = Math.round(diffHours / 24);
    relativeTime = `Published ${days}d ago`;
  }

  if (diffHours <= windowHours) {
    return {
      isEligible: true,
      recencyVerified: true,
      relativeTime,
    };
  } else {
    return {
      isEligible: false,
      recencyVerified: true,
      relativeTime,
      reason: `Article is older than ${windowHours} hours (${Math.round(diffHours)}h old)`,
    };
  }
}


--- SIH-2026/frontend/src/lib/googleTranslate.ts ---

import type {
  AlertSeverity,
  AlertUrgency,
  CitedSource,
  ComparisonMatrix,
  ConflictingReport,
  EvidenceBundle,
  SachetAlert,
  TimelineEvent,
} from '../types/disaster';

// MyMemory is a public, keyless translation service. Keep this URL configurable
// so deployments can move to another compatible free provider without a build change.
const TRANSLATE_ENDPOINT = String(import.meta.env.VITE_TRANSLATION_API_URL || 'https://api.mymemory.translated.net/get').trim();
const MAX_CACHE_ENTRIES = 500;
const MAX_BATCH_SIZE = 12;
const cache = new Map<string, string>();

function remember(key: string, value: string): string {
  cache.delete(key);
  cache.set(key, value);
  while (cache.size > MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (!oldest) break;
    cache.delete(oldest);
  }
  return value;
}

const MAX_QUERY_BYTES = 480;

function splitForProvider(text: string): string[] {
  if (new TextEncoder().encode(text).length <= MAX_QUERY_BYTES) return [text];
  const chunks: string[] = [];
  let current = '';
  for (const word of text.split(/(\s+)/)) {
    const candidate = current + word;
    if (current && new TextEncoder().encode(candidate).length > MAX_QUERY_BYTES) {
      chunks.push(current);
      current = word.trimStart();
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks.length ? chunks : [text];
}

async function requestSingleTranslation(text: string, targetLang: string, sourceLang: string): Promise<string> {
  const params = new URLSearchParams({
    q: text,
    langpair: `${sourceLang || 'en'}|${targetLang}`,
    mt: '1',
  });
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
    const response = await fetch(`${TRANSLATE_ENDPOINT}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (response.status === 429 && attempt < 2) {
      await new Promise((resolve) => window.setTimeout(resolve, 700 * (attempt + 1)));
      continue;
    }
    if (!response.ok) return text;
    const payload = (await response.json()) as {
      responseStatus?: number;
      responseData?: { translatedText?: unknown };
    };
    const translated = payload.responseData?.translatedText;
    return payload.responseStatus === 200 && typeof translated === 'string' && translated.trim()
      ? translated
      : text;
    } catch {
      if (attempt === 2) return text;
    }
  }
  return text;
}

async function requestTranslations(texts: string[], targetLang: string, sourceLang = 'en'): Promise<string[]> {
  if (texts.length === 0 || targetLang === sourceLang) return texts;
  const output: string[] = [];
  for (let index = 0; index < texts.length; index += 2) {
    const pair = texts.slice(index, index + 2);
    const translatedPair = await Promise.all(pair.map(async (text) => {
      const parts = splitForProvider(text);
      const translated = await Promise.all(parts.map((part) => requestSingleTranslation(part, targetLang, sourceLang)));
      return translated.join('');
    }));
    output.push(...translatedPair);
  }
  return output;
}

const PROTECTED_BRANDS = [
  'AapdaDrishti',
  'Aapda Drishti',
  'AAPDA DRISHTI',
  'Aapada Drishti',
  'AapadaDrishti',
  'AAPDADRISHTI',
];

function protectBrandNames(text: string): { protectedText: string; tokens: Map<string, string> } {
  let result = text;
  const tokens = new Map<string, string>();
  PROTECTED_BRANDS.forEach((brand, idx) => {
    if (result.includes(brand)) {
      const token = `__BRAND_TOKEN_${idx}__`;
      tokens.set(token, brand);
      result = result.replaceAll(brand, token);
    }
  });
  return { protectedText: result, tokens };
}

function restoreBrandNames(text: string, tokens: Map<string, string>): string {
  let result = text;
  tokens.forEach((brand, token) => {
    result = result.replaceAll(token, brand);
  });
  return result;
}

export async function translateText(text: string, targetLang: string, sourceLang = 'en'): Promise<string> {
  if (!text || targetLang === sourceLang) return text;
  const { protectedText, tokens } = protectBrandNames(text);
  const cacheKey = `${sourceLang}:${targetLang}:${protectedText}`;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) {
    cache.delete(cacheKey);
    cache.set(cacheKey, cached);
    return restoreBrandNames(cached, tokens);
  }

  const [translated] = await requestTranslations([protectedText], targetLang, sourceLang);
  const finalResult = restoreBrandNames(translated || protectedText, tokens);
  return remember(cacheKey, finalResult);
}

export async function translateBatch(texts: string[], targetLang: string, sourceLang = 'en'): Promise<string[]> {
  if (texts.length === 0 || targetLang === sourceLang) return texts;

  const protectedEntries = texts.map((t) => protectBrandNames(t));
  const output = new Array<string>(texts.length);
  const missing: Array<{ index: number; text: string; key: string }> = [];

  protectedEntries.forEach(({ protectedText }, index) => {
    if (!protectedText) {
      output[index] = protectedText;
      return;
    }
    const key = `${sourceLang}:${targetLang}:${protectedText}`;
    const cached = cache.get(key);
    if (cached !== undefined) {
      output[index] = cached;
      cache.delete(key);
      cache.set(key, cached);
    } else {
      missing.push({ index, text: protectedText, key });
    }
  });

  for (let start = 0; start < missing.length; start += MAX_BATCH_SIZE) {
    const chunk = missing.slice(start, start + MAX_BATCH_SIZE);
    const translated = await requestTranslations(chunk.map((item) => item.text), targetLang, sourceLang);
    chunk.forEach((item, offset) => {
      output[item.index] = remember(item.key, translated[offset] || item.text);
    });
  }

  return output.map((res, index) => {
    const textRes = res ?? protectedEntries[index].protectedText;
    return restoreBrandNames(textRes, protectedEntries[index].tokens);
  });
}

export async function translatePreservingCitations(text: string, targetLang: string, sourceLang = 'en'): Promise<string> {
  if (!text || targetLang === sourceLang) return text;
  const citations = Array.from(new Set(text.match(/\[S\d+\]/gi) || []));
  if (citations.length === 0) return translateText(text, targetLang, sourceLang);

  const placeholders = citations.map((citation, index) => ({
    citation,
    token: `__CITE_${index}__`,
  }));
  let protectedText = text;
  placeholders.forEach(({ citation, token }) => {
    protectedText = protectedText.replace(
      new RegExp(citation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
      token,
    );
  });
  let translated = await translateText(protectedText, targetLang, sourceLang);
  placeholders.forEach(({ citation, token }) => {
    translated = translated.replace(new RegExp(token, 'g'), citation.toUpperCase());
  });
  return translated;
}

async function translateSource(source: CitedSource, language: string): Promise<CitedSource> {
  const [title, summary] = await Promise.all([
    translateText(source.title, language),
    translatePreservingCitations(source.summary, language),
  ]);
  return { ...source, title, summary };
}

async function translateTimelineItem(item: TimelineEvent, language: string): Promise<TimelineEvent> {
  const [event, description] = await Promise.all([
    translateText(item.event, language),
    translatePreservingCitations(item.description, language),
  ]);
  return { ...item, event, description };
}

async function translateConflict(item: ConflictingReport, language: string): Promise<ConflictingReport> {
  return {
    ...item,
    topic: await translateText(item.topic, language),
    details: await translatePreservingCitations(item.details, language),
  };
}

export async function translateEvidenceBundle(bundle: EvidenceBundle, language: string): Promise<EvidenceBundle> {
  if (language === 'en') return bundle;
  const fields = [
    bundle.eventName,
    bundle.location,
    bundle.state,
    bundle.whatHappened,
    bundle.affectedAreas,
    bundle.humanImpact,
    bundle.infrastructureDamage,
    bundle.economicImpact,
    bundle.governmentResponse,
    bundle.rescueRelief,
    bundle.recovery,
    bundle.sourceAssessment,
    bundle.reportedCasualties,
    bundle.reportedDamage,
  ];
  const translatedFields = await Promise.all(fields.map((field) => translatePreservingCitations(field, language)));
  const [eventName, location, state, whatHappened, affectedAreas, humanImpact, infrastructureDamage,
    economicImpact, governmentResponse, rescueRelief, recovery, sourceAssessment, reportedCasualties, reportedDamage] = translatedFields;

  return {
    ...bundle,
    eventName,
    location,
    state,
    whatHappened,
    affectedAreas,
    humanImpact,
    infrastructureDamage,
    economicImpact,
    governmentResponse,
    rescueRelief,
    recovery,
    sourceAssessment,
    reportedCasualties,
    reportedDamage,
    sources: await Promise.all(bundle.sources.map((source) => translateSource(source, language))),
    timeline: await Promise.all(bundle.timeline.map((item) => translateTimelineItem(item, language))),
    conflictingReports: await Promise.all(bundle.conflictingReports.map((item) => translateConflict(item, language))),
  };
}

export async function translateAlert(alert: SachetAlert, language: string): Promise<SachetAlert> {
  if (language === 'en') return alert;
  const [event, headline, description, instruction, areaDesc] = await Promise.all([
    translateText(alert.event, language),
    translateText(alert.headline, language),
    translateText(alert.description, language),
    translateText(alert.instruction, language),
    translateText(alert.areaDesc, language),
  ]);
  return { ...alert, event, headline, description, instruction, areaDesc };
}

export async function translateComparison(comparison: ComparisonMatrix, language: string): Promise<ComparisonMatrix> {
  if (language === 'en') return comparison;
  const comparisonPoints = await Promise.all(comparison.comparisonPoints.map(async (point) => ({
    ...point,
    label: await translateText(point.label, language),
    values: await Promise.all(point.values.map(async (value) => ({
      ...value,
      value: await translatePreservingCitations(value.value, language),
    }))),
  })));
  return {
    ...comparison,
    comparisonPoints,
    aiSynthesis: {
      ...comparison.aiSynthesis,
      broaderImpact: await translatePreservingCitations(comparison.aiSynthesis.broaderImpact, language),
      responseDifferences: await translatePreservingCitations(comparison.aiSynthesis.responseDifferences, language),
      crossEventLessons: await translatePreservingCitations(comparison.aiSynthesis.crossEventLessons, language),
    },
  };
}

export function translateAlertEnums<T extends AlertSeverity | AlertUrgency>(value: T): T {
  return value;
}


--- SIH-2026/frontend/src/lib/localizedPresentation.ts ---

import { useEffect, useMemo, useState } from 'react';
import { translateBatch } from './googleTranslate';

export interface PresentationEntry { id: string; text: string | null | undefined }
type CachedPresentation = { original: string; text: string; translated: boolean };

const cache = new Map<string, CachedPresentation>();

function cacheKey(language: string, entry: PresentationEntry) {
  return `${language}|${entry.id}|${entry.text || ''}`;
}

/**
 * A non-mutating display layer for API, source, and derived content. Canonical
 * objects remain in React state; only resolved strings are returned for render.
 */
export function useLocalizedPresentation(language: string, entries: PresentationEntry[]) {
  const signature = useMemo(() => entries.map((entry) => `${entry.id}:${entry.text || ''}`).join('\u001f'), [entries]);
  const [resolved, setResolved] = useState<Record<string, CachedPresentation>>({});

  useEffect(() => {
    const valid = entries.filter((entry) => Boolean(entry.text?.trim()));
    if (language === 'en' || valid.length === 0) {
      setResolved(Object.fromEntries(valid.map((entry) => [entry.id, { original: entry.text!.trim(), text: entry.text!.trim(), translated: false }])));
      return;
    }

    const missing = valid.filter((entry) => !cache.has(cacheKey(language, entry)));
    const cached = Object.fromEntries(valid.flatMap((entry) => {
      const item = cache.get(cacheKey(language, entry));
      return item ? [[entry.id, item]] : [];
    }));
    setResolved(cached);
    if (missing.length === 0) return;

    let cancelled = false;
    void translateBatch(missing.map((entry) => entry.text!.trim()), language)
      .then((values) => {
        if (cancelled) return;
        const incoming: Record<string, CachedPresentation> = {};
        missing.forEach((entry, index) => {
          const text = values[index] || entry.text || '';
          const value = { original: entry.text || '', text, translated: text !== entry.text };
          cache.set(cacheKey(language, entry), value);
          incoming[entry.id] = value;
        });
        setResolved((current) => ({ ...current, ...incoming }));
      })
      .catch(() => { /* Canonical source text remains visible on a translation failure. */ });
    return () => { cancelled = true; };
  }, [language, signature]);

  return (id: string, fallback: string | null | undefined) => resolved[id]?.text || fallback || '';
}


--- SIH-2026/frontend/src/lib/lruCache.ts ---

export class LRUCache<K, V> {
  private capacity: number;
  private ttlMs: number;
  private cache: Map<K, { value: V; expiry: number }>;

  constructor(capacity: number, ttlMs: number) {
    this.capacity = capacity;
    this.ttlMs = ttlMs;
    this.cache = new Map();
  }

  get(key: K): V | null {
    if (!this.cache.has(key)) return null;

    const entry = this.cache.get(key)!;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttlMs,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}


--- SIH-2026/frontend/src/lib/mlApi.ts ---

const ML_API_BASE_URL = (import.meta.env.VITE_ML_API_BASE_URL || '').trim();

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizePath(pathname: string): string {
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function mlApiUrl(pathname: string): string {
  const path = normalizePath(pathname);
  if (!ML_API_BASE_URL) return path;
  return `${stripTrailingSlashes(ML_API_BASE_URL)}${path}`;
}

/**
 * Placeholder forecast request interface for future ML predictions integration.
 */
export async function fetchForecastProjectedGrid(month: string, year: number): Promise<any> {
  const url = mlApiUrl(`/api/forecast?month=${month}&year=${year}`);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`ML forecast API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Future ML prediction integration is offline. Url: ${url}`);
    return {
      month,
      year,
      predictions: [],
      error: (error as Error).message,
    };
  }
}


--- SIH-2026/frontend/src/lib/pastCache.ts ---

import { LRUCache } from './lruCache';
import { apiUrl } from './api';

// Cache for past archive data: capacity of 5 queries, TTL of 5 minutes (300,000 ms)
export const pastArchiveCache = new LRUCache<string, any>(5, 5 * 60 * 1000);

let prefetchPromise: Promise<any> | null = null;

/**
 * Triggers a background prefetch of the past archive list if not already cached.
 */
export function prefetchPastArchive(): void {
  if (pastArchiveCache.get('archive_data')) return;
  if (prefetchPromise) return;

  prefetchPromise = fetch(apiUrl('/api/past/archive'))
    .then((res) => {
      if (!res.ok) throw new Error('Past archive prefetch request failed');
      return res.json();
    })
    .then((data) => {
      pastArchiveCache.put('archive_data', data);
      prefetchPromise = null;
      return data;
    })
    .catch((err) => {
      console.warn('Past archive prefetch warning:', err);
      prefetchPromise = null;
    });
}

/**
 * Retrieves the past archive data, utilizing the prefetch promise or cache if available.
 */
export async function getPastArchive(): Promise<any> {
  const cached = pastArchiveCache.get('archive_data');
  if (cached) {
    return cached;
  }

  if (prefetchPromise) {
    try {
      const data = await prefetchPromise;
      if (data) return data;
    } catch (e) {
      // Fall through to direct fetch on error
    }
  }

  const res = await fetch(apiUrl('/api/past/archive'));
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.details || data?.error || 'Failed to load recent archive');
  }

  pastArchiveCache.put('archive_data', data);
  return data;
}


--- SIH-2026/frontend/src/lib/relevanceEngine.ts ---

import {
  DisasterCategory,
  SachetAlert,
  RelevanceResult,
  RelevanceStatus,
  RelevanceConfidence,
  UserLocation,
  EvacuationGuidance,
  EmergencyContact,
} from '../types/disaster';
import { formatDisasterDate } from './dateFormat';

// Category-specific geographic relevance buffer thresholds in Kilometers
export const CATEGORY_DISTANCE_THRESHOLDS: Record<DisasterCategory | string, number> = {
  Cyclone: 150, // Cyclones have broad gale & surge radius
  Flood: 35, // Inundation / river basin impact radius
  'Urban Flood': 25,
  Earthquake: 250, // Tremors & seismic impact zone
  Landslide: 20, // Localized slope failure zone
  'Heat Wave': 75, // Regional thermal anomaly
  'Cold Wave': 75,
  Lightning: 25, // Convective thunderstorm cell
  Thunderstorm: 35,
  'Heavy Rain': 45,
  Storm: 60,
  Tsunami: 120, // Coastal surge perimeter
  Avalanche: 30,
  'Forest Fire': 30,
  Drought: 100,
  'Air Pollution': 80,
  'General Alert': 40,
};

/**
 * Haversine formula to compute great-circle distance between two coordinates in kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal precision
}

/**
 * Calculates initial compass bearing from point 1 to point 2 in degrees [0, 360).
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export function degreesToCardinal(deg: number): string {
  const cardinals = [
    'North',
    'North-East',
    'East',
    'South-East',
    'South',
    'South-West',
    'West',
    'North-West',
  ];
  const index = Math.round(deg / 45) % 8;
  return cardinals[index];
}

export function getOppositeCardinal(cardinal: string): string {
  const opposites: Record<string, string> = {
    North: 'South (Inland)',
    'North-East': 'South-West (Inland)',
    East: 'West (Inland / Higher Ground)',
    'South-East': 'North-West (Inland)',
    South: 'North (Inland)',
    'South-West': 'North-East (Inland)',
    West: 'East (Safe Elevation)',
    'North-West': 'South-East (Safe Zone)',
  };
  return opposites[cardinal] || 'Inland towards Higher Elevation';
}

/**
 * Generates verified emergency helplines for India / state / district.
 */
export function getEmergencyContactsForState(state?: string, helplineField?: string): EmergencyContact[] {
  const contacts: EmergencyContact[] = [
    {
      label: 'National Emergency Helpline (SOS)',
      number: '112',
      category: 'National',
      description: 'Single all-India emergency response for Police, Fire & Ambulance',
    },
    {
      label: 'NDRF Disaster Response Force',
      number: '1078',
      category: 'Disaster Force',
      description: 'National Disaster Response Force Headquarters 24x7 control room',
    },
    {
      label: 'State Emergency Operations Center (SEOC)',
      number: '1070',
      category: 'State',
      description: 'Toll-free state disaster management command control room',
    },
    {
      label: 'District Emergency Operations Center (DEOC)',
      number: '1077',
      category: 'District',
      description: 'District Collectorate emergency operations & shelter coordination',
    },
    {
      label: 'Police Control Room',
      number: '100',
      category: 'Police',
      description: 'Local law enforcement and rapid evacuation escorts',
    },
    {
      label: 'Ambulance & Medical Emergency',
      number: '108',
      category: 'Medical',
      description: 'National Health Mission 24x7 emergency medical transport',
    },
  ];

  if (helplineField && helplineField.trim()) {
    contacts.unshift({
      label: 'Official Issuer Helpline (From CAP Alert)',
      number: helplineField.replace(/[^0-9| ]/g, '').trim() || helplineField,
      category: 'State',
      description: helplineField,
    });
  }

  return contacts;
}

/**
 * Generates structured evacuation vector, safety measures, Do's & Don'ts tailored to hazard.
 */
export function generateEvacuationGuidance(
  userLoc: UserLocation,
  alert: SachetAlert,
  distanceKm: number,
  isInsideBoundary: boolean
): EvacuationGuidance {
  const originLat =
    alert.centroid?.[0] ??
    (alert.polygon?.coordinates?.[0]?.[0] ?? (alert.circle?.center[0] ?? userLoc.lat));
  const originLng =
    alert.centroid?.[1] ??
    (alert.polygon?.coordinates?.[0]?.[1] ?? (alert.circle?.center[1] ?? userLoc.lng));

  const bearingFromDisaster = calculateBearing(originLat, originLng, userLoc.lat, userLoc.lng);
  const disasterRelativeBearing = calculateBearing(userLoc.lat, userLoc.lng, originLat, originLng);

  const disasterDirFromUser = degreesToCardinal(disasterRelativeBearing);
  const safeEvacDir = getOppositeCardinal(disasterDirFromUser);

  const hazardOriginName = alert.areaDesc || alert.district || alert.state || 'Epicenter';
  const userCity = userLoc.cityName || 'your current area';

  let approachDescription = '';
  if (distanceKm === 0 || isInsideBoundary) {
    approachDescription = `Direct Impact Zone: Active hazard is currently centered over ${hazardOriginName} and encompasses ${userCity}.`;
  } else {
    approachDescription = `Hazard vector positioned ${distanceKm} km ${disasterDirFromUser} of ${userCity} (near ${hazardOriginName}).`;
  }

  // Recommended safe buffer distance to move
  let safeDistanceKm = 30;
  if (alert.category === 'Cyclone') safeDistanceKm = Math.max(35, Math.round(distanceKm * 0.7));
  else if (alert.category === 'Flood' || alert.category === 'Urban Flood') safeDistanceKm = 15;
  else if (alert.category === 'Landslide') safeDistanceKm = 10;
  else if (alert.category === 'Earthquake') safeDistanceKm = 20;

  // Tailored Actionable Measures & Do's / Don'ts
  let actionableMeasures: string[] = [];
  let dos: string[] = [];
  let donts: string[] = [];
  let urgencyLevel: EvacuationGuidance['urgencyLevel'] = 'STANDBY_AWARE';

  if (isInsideBoundary || distanceKm <= 20) {
    urgencyLevel = 'IMMEDIATE_EVACUATION';
  } else if (distanceKm <= 60) {
    urgencyLevel = 'PREPARE_TO_MOVE';
  } else if (distanceKm <= 120) {
    urgencyLevel = 'SHELTER_IN_PLACE';
  }

  const catLower = (alert.category || '').toLowerCase();

  if (catLower.includes('cyclon') || catLower.includes('storm')) {
    actionableMeasures = [
      `1. Immediate Evacuation Vector: Move at least ${safeDistanceKm} km towards the ${safeEvacDir} into designated Multi-Purpose Cyclone Shelters (MPCS) or sturdy reinforced concrete buildings.`,
      '2. Power & Gas Shutoff: Switch off main electrical circuit breakers and LPG gas regulators before leaving to prevent post-surge electrocution and fires.',
      '3. Emergency Survival Kit: Carry drinking water (3L/person), non-perishable food, power banks, battery torch, first-aid kit, and essential ID documents in waterproof bags.',
      '4. Structural Safety: Fasten loose rooftop tin sheets, secure windows, and move vehicles away from trees and hoardings.',
    ];
    dos = [
      'Relocate immediately to official cyclone shelters if residing in kutcha/low-lying structures.',
      'Keep mobile phones fully charged and stay tuned to official district disaster updates.',
      'Assist children, elderly persons, and pregnant women first during evacuation convoys.',
      'Store emergency drinking water in sealed, clean containers.',
    ];
    donts = [
      'DO NOT venture outdoors during the calm "eye of the cyclone" — gale winds will reverse abruptly with violent force.',
      'DO NOT touch fallen electric poles, dangling wires, or water in contact with submerged lines.',
      'DO NOT spread unverified social media rumours or ignore siren warning broadcasts.',
      'DO NOT attempt to cross coastal causeways or storm-surge inundated roads.',
    ];
  } else if (catLower.includes('flood') || catLower.includes('inundat')) {
    actionableMeasures = [
      `1. Immediate Flood Evacuation: Relocate ${safeDistanceKm} km towards ${safeEvacDir} to higher ground away from river embankments and low-lying drainage depressions.`,
      '2. Elevated Storage: Move valuable electronics, documents, and livestock to upper floors or earthen highlands.',
      '3. Water Safety: Boil drinking water or use chlorine purification tablets to prevent water-borne epidemics.',
      '4. Dial 1077 or 1070 for National Disaster Response Force (NDRF) rescue boat assistance.',
    ];
    dos = [
      'Disconnect main electrical supply to avoid short circuits in inundated ground floors.',
      'Keep a floating life jacket, inflated tube, or strong rope handy.',
      'Follow marked evacuation routes established by district administration.',
    ];
    donts = [
      'DO NOT walk or drive through flowing water — 15 cm of moving water can knock you down, and 30 cm can float vehicles.',
      'DO NOT consume flood water or food exposed to flood currents.',
      'DO NOT wade through flood water near electrical substations or transformer posts.',
    ];
  } else if (catLower.includes('landslide')) {
    actionableMeasures = [
      `1. Slope Evacuation: Evacuate immediately ${safeDistanceKm} km ${safeEvacDir} away from steep cut slopes, mountain streams, and debris paths.`,
      '2. Stay Alert for Warning Signs: Listen for unusual sounds like trees cracking, boulders knocking together, or muddy stream discharge.',
      '3. Highway Clearance: Halt mountain vehicular travel on affected corridors until State PWD and BRO confirm clearance.',
    ];
    dos = [
      'Move quickly out of the path of a landslide or debris flow towards solid bedrock ridge lines.',
      'Curl into a tight ball and protect your head if escape is not possible.',
      'Notify local authorities immediately about cracks appearing in road pavements or hillside retaining walls.',
    ];
    donts = [
      'DO NOT stay near stream channels, ravines, or cliff bottoms during prolonged heavy downpours.',
      'DO NOT cross active rockfall zones or newly formed debris piles.',
    ];
  } else if (catLower.includes('earthquake')) {
    actionableMeasures = [
      '1. Drop, Cover, and Hold On: Take cover under a sturdy desk or interior wall away from glass windows and heavy fixtures.',
      '2. Post-Tremor Evacuation: Once shaking stops, evacuate using stairwells (never use elevators) to open grounds.',
      '3. Gas & Electrical Safety: Shut off gas cylinders and main power breakers to avert aftershock fires.',
    ];
    dos = [
      'Stay inside if you are in a modern seismic-resistant building; protect head and neck.',
      'Move to open areas clear of power lines, high-rises, and brick parapets if outdoors.',
      'Expect aftershocks and keep emergency shoes and torches near your bed.',
    ];
    donts = [
      'DO NOT run outside during active ground tremors — falling debris causes most injuries.',
      'DO NOT use elevators or light matches/lighters until gas line integrity is verified.',
    ];
  } else {
    actionableMeasures = [
      `1. Precautionary Action: Follow official advisories and maintain readiness to move towards ${safeEvacDir} if conditions worsen.`,
      '2. Communication: Keep emergency helpline numbers handy (112 / 1070 / 1077).',
      '3. Stay Informed: Monitor official SACHET / NDMA / IMD bulletins.',
    ];
    dos = [
      'Follow instructions from local disaster management personnel.',
      'Check on vulnerable neighbors, elderly individuals, and pets.',
    ];
    donts = [
      'DO NOT venture into warning perimeters unnecessarily.',
      'DO NOT believe or propagate rumors.',
    ];
  }

  const emergencyContacts = getEmergencyContactsForState(alert.state, alert.helpline);

  return {
    hazardOriginName,
    bearingDegrees: Math.round(bearingFromDisaster),
    bearingCardinal: disasterDirFromUser,
    approachDescription,
    recommendedDirection: safeEvacDir,
    safeDistanceKm,
    urgencyLevel,
    actionableMeasures,
    dos,
    donts,
    emergencyContacts,
  };
}

/**
 * Ray-casting algorithm to test if a point (lat, lng) is strictly inside a polygon of [lat, lng] vertices.
 */
export function isPointInPolygon(
  point: [number, number],
  polygonCoords: [number, number][]
): boolean {
  if (!polygonCoords || polygonCoords.length < 3) return false;

  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygonCoords.length - 1; i < polygonCoords.length; j = i++) {
    const [xi, yi] = polygonCoords[i];
    const [xj, yj] = polygonCoords[j];

    const intersect =
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Computes minimum distance from a point to polygon perimeter (in km).
 */
export function minDistanceToPolygon(
  point: [number, number],
  polygonCoords: [number, number][]
): number {
  if (!polygonCoords || polygonCoords.length === 0) return Infinity;

  let minDistance = Infinity;
  for (let i = 0; i < polygonCoords.length; i++) {
    const vertex = polygonCoords[i];
    const d = calculateHaversineDistance(point[0], point[1], vertex[0], vertex[1]);
    if (d < minDistance) {
      minDistance = d;
    }
  }
  return minDistance;
}

/**
 * Checks if an alert is expired based on current wall-clock time (Section 77A).
 */
export function isAlertExpired(alert: SachetAlert, now: Date = new Date()): boolean {
  if (!alert.expires) return false;
  const expiryTime = new Date(alert.expires).getTime();
  return !isNaN(expiryTime) && expiryTime <= now.getTime();
}

/**
 * Generates a deterministic plain-language summary string from official structured fields (Section 50).
 * The LLM is NEVER used to invent or rephrase core alert facts.
 */
export function generatePlainLanguageSummary(alert: SachetAlert): string {
  const event = alert.event || alert.category || 'Disaster Alert';
  const area = alert.areaDesc || 'specified region';
  const severity = alert.severity || 'Active';

  let timeStr = 'further notice';
  if (alert.expires) {
    try {
      const exp = new Date(alert.expires);
      if (!isNaN(exp.getTime())) {
        timeStr =
          exp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) +
          ' on ' +
          formatDisasterDate(alert.expires);
      }
    } catch {
      timeStr = alert.expires;
    }
  }

  return `Official ${severity} ${event} is active for ${area}, valid until ${timeStr}.`;
}

/**
 * Evaluates the strict 5-case Location Relevance Engine for a user against an alert.
 */
export function evaluateLocationRelevance(
  userLoc: UserLocation,
  alert: SachetAlert
): RelevanceResult {
  const plainSummary = generatePlainLanguageSummary(alert);
  const threshold =
    CATEGORY_DISTANCE_THRESHOLDS[alert.category] || CATEGORY_DISTANCE_THRESHOLDS['General Alert'];

  // Case 1 & Case 2: Alert has an official polygon
  if (alert.polygon && alert.polygon.coordinates && alert.polygon.coordinates.length >= 3) {
    const inside = isPointInPolygon([userLoc.lat, userLoc.lng], alert.polygon.coordinates);

    if (inside) {
      // Case 1: Point strictly inside official polygon (highest confidence)
      const status: RelevanceStatus =
        alert.severity === 'Extreme' || alert.urgency === 'Immediate'
          ? 'CRITICAL'
          : alert.severity === 'Severe'
          ? 'HIGH_PRIORITY'
          : 'WARNING';

      const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, 0, true);

      return {
        status,
        distanceKm: 0,
        confidence: 'exact_polygon',
        confidenceLabel: 'Authoritative Official Boundary Match',
        isInsideBoundary: true,
        reason: `Your coordinates are directly inside the official ${alert.event} warning boundary for ${alert.areaDesc}.`,
        plainSummary,
        alert,
        evacuationGuidance,
      };
    } else {
      // Case 2: Point outside polygon -> compute distance
      const distance = minDistanceToPolygon([userLoc.lat, userLoc.lng], alert.polygon.coordinates);
      const roundedDist = Math.round(distance * 10) / 10;

      if (distance <= threshold) {
        const status: RelevanceStatus = distance <= threshold * 0.35 ? 'WARNING' : 'NEARBY';
        const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, roundedDist, false);

        return {
          status,
          distanceKm: roundedDist,
          confidence: 'polygon_distance',
          confidenceLabel: `Near Warning Boundary (${Math.round(distance)} km away)`,
          isInsideBoundary: false,
          reason: `Your location is approximately ${Math.round(distance)} km from the active ${alert.event} boundary (Buffer: ${threshold} km).`,
          plainSummary,
          alert,
          evacuationGuidance,
        };
      } else {
        return {
          status: 'NOT_RELEVANT',
          distanceKm: roundedDist,
          confidence: 'polygon_distance',
          confidenceLabel: 'Outside Category Relevance Buffer',
          isInsideBoundary: false,
          reason: `Distance (${Math.round(distance)} km) exceeds relevance threshold for ${alert.category} (${threshold} km).`,
          plainSummary,
          alert,
        };
      }
    }
  }

  // Case 3: Alert has an official circle
  if (alert.circle && alert.circle.center) {
    const distToCenter = calculateHaversineDistance(
      userLoc.lat,
      userLoc.lng,
      alert.circle.center[0],
      alert.circle.center[1]
    );
    const radius = alert.circle.radiusKm || 20;

    if (distToCenter <= radius) {
      const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, 0, true);
      return {
        status: alert.severity === 'Extreme' ? 'CRITICAL' : 'WARNING',
        distanceKm: 0,
        confidence: 'circle',
        confidenceLabel: 'Inside Official Warning Circle',
        isInsideBoundary: true,
        reason: `Your coordinates fall within the ${radius} km radius warning zone.`,
        plainSummary,
        alert,
        evacuationGuidance,
      };
    } else if (distToCenter <= radius + threshold) {
      const edgeDist = Math.max(0, distToCenter - radius);
      const roundedDist = Math.round(edgeDist * 10) / 10;
      const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, roundedDist, false);
      return {
        status: 'NEARBY',
        distanceKm: roundedDist,
        confidence: 'circle',
        confidenceLabel: `Near Warning Circle (${Math.round(edgeDist)} km away)`,
        isInsideBoundary: false,
        reason: `Your location is approximately ${Math.round(edgeDist)} km from the warning perimeter.`,
        plainSummary,
        alert,
        evacuationGuidance,
      };
    } else {
      return {
        status: 'NOT_RELEVANT',
        distanceKm: Math.round(distToCenter * 10) / 10,
        confidence: 'circle',
        confidenceLabel: 'Outside Circle Perimeter',
        isInsideBoundary: false,
        reason: `Distance (${Math.round(distToCenter)} km) is outside warning perimeter.`,
        plainSummary,
        alert,
      };
    }
  }

  // Case 4: Alert has centroid only (no polygon or circle geometry)
  if (alert.centroid) {
    const distToCentroid = calculateHaversineDistance(
      userLoc.lat,
      userLoc.lng,
      alert.centroid[0],
      alert.centroid[1]
    );
    const roundedDist = Math.round(distToCentroid * 10) / 10;

    if (distToCentroid <= threshold) {
      const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, roundedDist, false);
      return {
        status: 'NEARBY',
        distanceKm: roundedDist,
        confidence: 'approximate_centroid',
        confidenceLabel: 'approximate — precise boundary unavailable',
        isInsideBoundary: false,
        reason: `Located ~${Math.round(distToCentroid)} km from alert epicenter. Official precise polygon boundary was not supplied in feed.`,
        plainSummary,
        alert,
        evacuationGuidance,
      };
    } else {
      return {
        status: 'NOT_RELEVANT',
        distanceKm: roundedDist,
        confidence: 'approximate_centroid',
        confidenceLabel: 'approximate — outside radius',
        isInsideBoundary: false,
        reason: `Centroid distance (${Math.round(distToCentroid)} km) exceeds category threshold.`,
        plainSummary,
        alert,
      };
    }
  }

  // Case 5: Named administrative region match only (state/district match)
  if (alert.state && userLoc.state) {
    const normAlertState = alert.state.toLowerCase().trim();
    const normUserState = userLoc.state.toLowerCase().trim();

    if (
      normAlertState === normUserState ||
      normAlertState.includes(normUserState) ||
      normUserState.includes(normAlertState)
    ) {
      const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, 0, false);
      return {
        status: 'AWARENESS_ONLY',
        distanceKm: 0,
        confidence: 'regional_match',
        confidenceLabel: 'State/District Administrative Match Only',
        isInsideBoundary: false,
        reason: `Regional match for ${alert.state}. Precise coordinates/polygon were not available from issuer.`,
        plainSummary,
        alert,
        evacuationGuidance,
      };
    }
  }

  // Default: Cannot establish geographical relevance
  return {
    status: 'NOT_RELEVANT',
    distanceKm: Infinity,
    confidence: 'unverified',
    confidenceLabel: 'No Geographic Relevance',
    isInsideBoundary: false,
    reason: 'Alert does not have proximity or overlap with current coordinates.',
    plainSummary,
    alert,
  };
}

/**
 * Evaluates relevance for all alerts against a user location and sorts them by priority and distance.
 */
export function evaluateAllAlertsRelevance(
  alerts: SachetAlert[],
  userLoc: UserLocation
): RelevanceResult[] {
  const priorityOrder: Record<RelevanceStatus, number> = {
    CRITICAL: 1,
    HIGH_PRIORITY: 2,
    WARNING: 3,
    NEARBY: 4,
    AWARENESS_ONLY: 5,
    NOT_RELEVANT: 6,
  };

  const results = alerts.map((alert) => evaluateLocationRelevance(userLoc, alert));

  return results.sort((a, b) => {
    const pDiff = (priorityOrder[a.status] || 99) - (priorityOrder[b.status] || 99);
    if (pDiff !== 0) return pDiff;
    return (a.distanceKm || 0) - (b.distanceKm || 0);
  });
}




--- SIH-2026/frontend/src/hooks/useAutoTranslatePage.ts ---

import { useEffect } from 'react';
import { translateBatch } from '../lib/googleTranslate';
import { INDIAN_LANGUAGES } from '../types/language';

type TranslatedNode = { source: string; translated: string };

const LANGUAGE_NAMES_SET = new Set(
  INDIAN_LANGUAGES.flatMap((l) => [
    l.name.toLowerCase(),
    l.nativeName.toLowerCase(),
    l.code.toLowerCase(),
  ])
);

const PROTECTED_BRAND_WORDS = ['aapdadrishti', 'aapda drishti', 'aapda', 'drishti'];

function isNotTranslate(element: HTMLElement | null): boolean {
  if (!element) return false;
  return Boolean(
    element.closest('.notranslate') ||
    element.closest('[translate="no"]') ||
    element.closest('[data-no-translate="true"]')
  );
}

function isProtectedText(value: string): boolean {
  const lower = value.trim().toLowerCase();
  if (LANGUAGE_NAMES_SET.has(lower)) return true;
  if (PROTECTED_BRAND_WORDS.some((word) => lower.includes(word))) return true;
  return false;
}

function isEnglishSource(value: string): boolean {
  const letters = value.match(/\p{L}/gu) || [];
  const latinLetters = value.match(/[A-Za-z]/g) || [];
  return value.trim().length >= 3 && latinLetters.length >= 2 && latinLetters.length / Math.max(letters.length, 1) > 0.75;
}

/**
 * Covers hardcoded labels and third-party/API text that is not rendered through
 * one of the typed presentation components. Canonical React state is unchanged.
 */
export function useAutoTranslatePage(language: string): void {
  useEffect(() => {
    const translatedNodes = new Map<Text, TranslatedNode>();
    let timer: number | null = null;
    let cancelled = false;

    const restoreEnglish = () => {
      translatedNodes.forEach((item, node) => {
        if (node.nodeValue === item.translated) node.nodeValue = item.source;
      });
      translatedNodes.clear();
    };

    if (language === 'en') {
      restoreEnglish();
      return undefined;
    }

    const collect = () => {
      const candidates: Text[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode() as Text | null;
      while (node) {
        const parent = node.parentElement;
        const current = node.nodeValue?.replace(/\s+/g, ' ').trim() || '';
        const previous = translatedNodes.get(node);
        if (previous && current === previous.translated) {
          node = walker.nextNode() as Text | null;
          continue;
        }
        if (
          parent &&
          !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(parent.tagName) &&
          !isNotTranslate(parent) &&
          isEnglishSource(current) &&
          !isProtectedText(current)
        ) {
          translatedNodes.set(node, { source: current, translated: current });
          candidates.push(node);
        }
        node = walker.nextNode() as Text | null;
      }
      return candidates.slice(0, 20);
    };

    const translateVisibleText = () => {
      timer = null;
      const nodes = collect();
      if (!nodes.length || cancelled) return;
      void translateBatch(nodes.map((node) => translatedNodes.get(node)?.source || node.nodeValue || ''), language)
        .then((values) => {
          if (cancelled) return;
          nodes.forEach((node, index) => {
            const source = translatedNodes.get(node)?.source || node.nodeValue || '';
            const translated = values[index] || source;
            translatedNodes.set(node, { source, translated });
            if (node.nodeValue?.replace(/\s+/g, ' ').trim() === source) node.nodeValue = translated;
          });
          schedule();
        });
    };

    const schedule = () => {
      if (timer === null && !cancelled) timer = window.setTimeout(translateVisibleText, 500);
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    schedule();
    return () => {
      cancelled = true;
      if (timer !== null) window.clearTimeout(timer);
      observer.disconnect();
      restoreEnglish();
    };
  }, [language]);
}


--- SIH-2026/frontend/src/hooks/useTranslateBatch.ts ---

import { useEffect, useState } from 'react';
import { translateBatch } from '../lib/googleTranslate';

export function useTranslateBatch<T extends Record<string, string>>(fields: T | null, language: string) {
  const [result, setResult] = useState<T | null>(fields);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!fields || language === 'en') {
      setResult(fields);
      setIsTranslating(false);
      return;
    }

    let cancelled = false;
    const keys = Object.keys(fields) as Array<keyof T>;
    setResult(null);
    setIsTranslating(true);
    void translateBatch(keys.map((key) => fields[key]), language).then((values) => {
      if (cancelled) return;
      setResult(Object.fromEntries(keys.map((key, index) => [key, values[index]])) as T);
      setIsTranslating(false);
    });
    return () => { cancelled = true; };
  }, [fields, language]);

  return { result, isTranslating };
}


--- SIH-2026/frontend/src/hooks/useTranslateContent.ts ---

import { useEffect, useState } from 'react';
import { translateText } from '../lib/googleTranslate';

export function useTranslateContent(source: string | null | undefined, language: string) {
  const original = source || '';
  const [translated, setTranslated] = useState(original);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!original || language === 'en') {
      setTranslated(original);
      setIsTranslating(false);
      return;
    }

    let cancelled = false;
    setTranslated(original);
    setIsTranslating(true);
    void translateText(original, language).then((value) => {
      if (cancelled) return;
      setTranslated(value);
      setIsTranslating(false);
    });
    return () => { cancelled = true; };
  }, [original, language]);

  return { translated, isTranslating };
}


--- SIH-2026/frontend/src/data/historicalDisasters.ts ---

import { EvidenceBundle } from '../types/disaster';

export interface HistoricalDisasterItem extends EvidenceBundle {
  year: number;
  numericCasualties: number;
  decade: '1990s' | '2000s' | '2010s' | '2020s';
  economicLossInrCr?: number;
}

/**
 * Historical archive data is loaded live from the API.
 * The client keeps this module only for shared types.
 */
export const HISTORICAL_DISASTERS_CATALOG: HistoricalDisasterItem[] = [];


--- SIH-2026/frontend/src/components/HeroPage.tsx ---

import React, { useEffect } from 'react';
import { Sparkles, Radio, Brain, ShieldAlert } from 'lucide-react';
import { IndiaMapHero } from './IndiaMapHero';
import { apiUrl } from '../lib/api';
import { mlApiUrl } from '../lib/mlApi';
interface HeroPageProps {
  currentLanguage: string;
  onExplore: () => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({ currentLanguage, onExplore }) => {

  // Proactive non-blocking backend warm-up
  useEffect(() => {
    // 1. Existing Backend
    const backendUrl = apiUrl('/api/health');
    fetch(backendUrl, { mode: 'no-cors' }).catch(() => {
      // Quiet fail - error tolerant
    });

    // 2. ML Backend
    const mlBaseUrl = mlApiUrl('/health');
    if (mlBaseUrl) {
      fetch(mlBaseUrl, { mode: 'no-cors' }).catch(() => {
        // Quiet fail - error tolerant
      });
    }
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] md:min-h-0 md:max-h-[calc(100vh-64px)] bg-[#ECF8F8] text-[#0F1B29] flex flex-col justify-center font-sans px-4 sm:px-6 lg:px-8 py-2 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-0">
        
        {/* Left Column: Text Content and Animated Feature Cards directly below */}
        <div className="md:col-span-6 space-y-4 flex flex-col justify-center animate-in fade-in slide-in-from-left-4 duration-500 min-h-0">
          
          {/* Sparkle Badge with three dots */}
          <div className="space-y-1.5 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex gap-1 pl-3">
              <span className="w-1 h-1 rounded-full bg-[#0F1B29]/40 animate-pulse" />
              <span className="w-1 h-1 rounded-full bg-[#0F1B29]/40 animate-pulse delay-75" />
              <span className="w-1 h-1 rounded-full bg-[#0F1B29]/40 animate-pulse delay-150" />
            </div>
            <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#DDDDDD]/60 border border-[#DDDDDD] text-[#0F1B29] text-[10px] font-bold uppercase tracking-wider w-fit">
              <span>AI-POWERED DISASTER RESPONSE</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-normal leading-[1.1] text-[#0F1B29] tracking-tight">
            Predict the risk.<br />
            Respond <span className="font-bold">before</span> impact.
          </h1>

          {/* Horizontal Divider Line */}
          <div className="w-20 h-[3px] bg-[#0F1B29]" />

          {/* Subtitle */}
          <p className="text-[#747F8D] text-xs sm:text-sm leading-relaxed max-w-lg">
            An intelligent platform that uses real-time data and AI to predict disasters, assess risks, and help authorities take faster, smarter decisions.
          </p>

          {/* Action Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-[#DDDDDD] hover:bg-[#0F1B29] hover:text-white border border-[#DDDDDD] hover:border-[#0F1B29] text-[#0F1B29] font-bold text-xs transition-all duration-300 shadow-xs cursor-pointer"
            >
              Explore Platform &rarr;
            </button>
          </div>

          {/* Feature Cards: Animated cards with entrance delays and hover micro-lifts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            
            {/* Card 1: Real-time Monitoring */}
            <div 
              onClick={onExplore}
              className="bg-white border border-[#DDDDDD] rounded-xl p-3.5 flex flex-col justify-between gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:border-[#747F8D]/50 hover:bg-[#ECF8F8]/20 group cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75"
            >
              <div className="w-8 h-8 rounded-lg bg-[#DDDDDD] text-[#0F1B29] flex items-center justify-center shrink-0 group-hover:bg-[#0F1B29] group-hover:text-white transition-colors duration-300">
                <Radio className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-[11px] text-[#0F1B29]">Real-time Monitoring</h3>
                <p className="text-[10px] text-[#747F8D] leading-relaxed">
                  Track active alerts and meteorological telemetry as they unfold.
                </p>
              </div>
            </div>

            {/* Card 2: AI Driven Predictions */}
            <div 
              onClick={onExplore}
              className="bg-white border border-[#DDDDDD] rounded-xl p-3.5 flex flex-col justify-between gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:border-[#747F8D]/50 hover:bg-[#ECF8F8]/20 group cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150"
            >
              <div className="w-8 h-8 rounded-lg bg-[#DDDDDD] text-[#0F1B29] flex items-center justify-center shrink-0 group-hover:bg-[#0F1B29] group-hover:text-white transition-colors duration-300">
                <Brain className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-[11px] text-[#0F1B29]">AI Driven Predictions</h3>
                <p className="text-[10px] text-[#747F8D] leading-relaxed">
                  Synthesize forecast grids and simulate risk models in advance.
                </p>
              </div>
            </div>

            {/* Card 3: Faster Response */}
            <div 
              onClick={onExplore}
              className="bg-white border border-[#DDDDDD] rounded-xl p-3.5 flex flex-col justify-between gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:border-[#747F8D]/50 hover:bg-[#ECF8F8]/20 group cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300"
            >
              <div className="w-8 h-8 rounded-lg bg-[#DDDDDD] text-[#0F1B29] flex items-center justify-center shrink-0 group-hover:bg-[#0F1B29] group-hover:text-white transition-colors duration-300">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-[11px] text-[#0F1B29]">Faster Response</h3>
                <p className="text-[10px] text-[#747F8D] leading-relaxed">
                  Access evacuation bearing guidance and local emergency helplines.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: India Map Illustration (Increased map width ratio) */}
        <div className="md:col-span-6 flex items-center justify-center animate-in fade-in slide-in-from-right-4 duration-500 min-h-0 overflow-hidden">
          <IndiaMapHero />
        </div>

      </div>
    </div>
  );
};

export default HeroPage;


--- SIH-2026/frontend/src/components/IndiaMapHero.tsx ---

import React from 'react';

export const IndiaMapHero: React.FC = () => {
  // Floating markers data - Srinagar J&K brought further inward (away from Nepal/China border)
  const markers = [
    { name: 'Northern Region', top: '25%', left: '38%', delay: '0s' },
    { name: 'Western Region', top: '49%', left: '21%', delay: '1s' },
    { name: 'Southern Region', top: '73%', left: '35%', delay: '2s' },
  ];

  return (
    <div className="relative w-full max-w-[470px] lg:max-w-[510px] mx-auto select-none font-sans py-2">
      
      {/* Flat Map with Contour Elevation Drop Shadow */}
      <div className="relative w-full">
        {/* SVG base map with professional dual drop shadow to create visual depth */}
        <img
          src="/india-map.svg"
          className="w-full h-auto object-contain pointer-events-none filter drop-shadow-[0_12px_16px_rgba(15,27,41,0.22)] drop-shadow-[0_4px_6px_rgba(15,27,41,0.12)]"
          alt="India Border Map"
        />

        {/* Floating location markers relative to map container */}
        {markers.map((marker, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: marker.top,
              left: marker.left,
              animationDelay: marker.delay,
            }}
            className="animate-float flex flex-col items-center group cursor-pointer pointer-events-auto"
          >
            {/* Soft pink/purple glow halo behind pin matching the Figma reference */}
            <div className="absolute -top-1 w-8 h-8 rounded-full bg-pink-500/10 border border-pink-400/20 blur-sm pointer-events-none animate-pulse" />

            {/* Figma-faithful teardrop pin pointer with dark navy fill, white border, and white inner circle */}
            <svg viewBox="0 0 32 38" className="w-7 h-9 drop-shadow-md z-10 transition-transform duration-300 group-hover:scale-110">
              <path
                d="M16 0C7.16 0 0 7.16 0 16c0 11.25 14.25 21.37 14.87 21.8a1.69 1.69 0 0 0 2.26 0C17.75 37.37 32 27.25 32 16 32 7.16 24.84 0 16 0z"
                fill="#0F1B29"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <circle cx="16" cy="16" r="4.5" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* Micro tooltip */}
            <div className="absolute top-9 whitespace-nowrap bg-[#0F1B29] text-white text-[9px] font-bold px-2 py-1 rounded-md shadow opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-1 group-hover:translate-y-0 z-20">
              {marker.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndiaMapHero;


--- SIH-2026/frontend/src/components/Navbar.tsx ---

import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Search,
  Check,
  ChevronDown,
  RefreshCw,
  Bot,
  Menu,
  X
} from 'lucide-react';
import { INDIAN_LANGUAGES, getTranslation, translate } from '../types/language';

interface NavbarProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  currentLanguage: string;
  onLanguageChange: (langCode: string) => void;
  feedStatus: 'LIVE_FETCH' | 'ETAG_CACHED' | 'FALLBACK_SNAPSHOT' | 'ERROR';
  lastUpdated?: string;
  onRefreshFeed?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onRouteChange,
  currentLanguage,
  onLanguageChange,
  feedStatus,
  lastUpdated,
  onRefreshFeed,
  onOpenVoiceAssistant,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const t = getTranslation(currentLanguage);
  const activeLang = INDIAN_LANGUAGES.find((l) => l.code === currentLanguage) || INDIAN_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when language dropdown opens
  useEffect(() => {
    if (isLangOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isLangOpen]);

  // Filter languages by English name, native script, or code
  const filteredLanguages = INDIAN_LANGUAGES.filter((lang) => {
    const q = langSearch.toLowerCase().trim();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const navItems = [
    { label: translate(currentLanguage, 'HOME') || 'Home', path: '/' },
    { label: translate(currentLanguage, 'FUTURE') || 'Future', path: '/future' },
    { label: translate(currentLanguage, 'PRESENT') || 'Present', path: '/present' },
    { label: translate(currentLanguage, 'PAST') || 'Past', path: '/past' },
    { label: translate(currentLanguage, 'TEAM') || 'Team', path: '/team' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ECF8F8]/70 backdrop-blur-md border-b border-[#DDDDDD]/60 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo and Application Name */}
        <div className="flex items-center gap-2 cursor-pointer select-none notranslate" translate="no" onClick={() => onRouteChange('/')}>
          <img src="/favicon.svg" className="w-8 h-8 rounded-lg border border-[#DDDDDD]/40" alt="Logo" />
          <span className="font-bold text-sm text-[#0F1B29] tracking-wider leading-none flex flex-col uppercase font-sans notranslate" translate="no">
            <span>Aapda</span>
            <span>Drishti</span>
          </span>
        </div>

        {/* Center Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentRoute === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  onRouteChange(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'text-[#0F1B29] bg-[#DDDDDD]/60 font-bold'
                    : 'text-[#747F8D] hover:text-[#0F1B29] hover:bg-[#DDDDDD]/40'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="relative notranslate" translate="no" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#ECF8F8] border border-[#DDDDDD] text-xs sm:text-sm text-[#0F1B29] transition-all duration-200 shadow-sm cursor-pointer"
              title={translate(currentLanguage, 'nav.changeLanguage')}
            >
              <Globe className="w-4 h-4 text-[#747F8D] shrink-0" />
              <span className="font-semibold">{activeLang.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#747F8D] shrink-0" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#DDDDDD] shadow-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-[#DDDDDD]/40 bg-[#ECF8F8]/40">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#747F8D] absolute left-2.5 top-2.5" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder={t.searchLanguagePlaceholder}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white border border-[#DDDDDD] text-[#0F1B29] placeholder-[#747F8D]/60 focus:outline-none focus:border-[#747F8D]"
                    />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto p-2 space-y-0.5">
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangOpen(false);
                          setLangSearch('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs sm:text-sm transition-colors ${currentLanguage === lang.code
                            ? 'bg-[#DDDDDD]/60 text-[#0F1B29] font-semibold'
                            : 'text-[#747F8D] hover:bg-[#ECF8F8]/90 hover:text-[#0F1B29]'
                          }`}
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium">{lang.name}</span>
                          <span className="text-[#747F8D] text-xs font-normal">({lang.nativeName})</span>
                        </div>
                        {currentLanguage === lang.code && (
                          <Check className="w-4 h-4 text-[#0F1B29] shrink-0" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-[#747F8D]">
                      {translate(currentLanguage, 'nav.noLanguage')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI Chatbot button */}
          {onOpenVoiceAssistant && (
            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer"
              title="Open AI Chatbot"
            >
              <Bot className="w-4 h-4 shrink-0" />
              <span>AI Chatbot</span>
            </button>
          )}

          {/* Refresh Feed */}
          {onRefreshFeed && currentRoute === '/present' && (
            <button
              type="button"
              onClick={onRefreshFeed}
              className="p-2 rounded-xl bg-white hover:bg-[#ECF8F8] border border-[#DDDDDD] text-[#747F8D] hover:text-[#0F1B29] transition-colors shadow-sm cursor-pointer"
              title={translate(currentLanguage, 'nav.refresh')}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* AI Chatbot button on Mobile */}
          {onOpenVoiceAssistant && (
            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="p-2 rounded-lg bg-[#0F1B29] text-white hover:bg-[#0f1b29]/90 shadow-sm transition-all duration-200 cursor-pointer"
              title="Open AI Chatbot"
            >
              <Bot className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg border border-[#DDDDDD] text-[#0F1B29] hover:bg-[#DDDDDD]/40 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer/Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#ECF8F8] border-b border-[#DDDDDD] px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = currentRoute === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    onRouteChange(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive
                      ? 'text-[#0F1B29] bg-[#DDDDDD] font-bold'
                      : 'text-[#747F8D] hover:text-[#0F1B29] hover:bg-[#DDDDDD]/40'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-[#DDDDDD]/60 flex items-center justify-between">
            {/* Mobile Language Selector */}
            <div className="relative notranslate" translate="no">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#DDDDDD] text-xs text-[#0F1B29]"
              >
                <Globe className="w-3.5 h-3.5 text-[#747F8D]" />
                <span>{activeLang.name}</span>
                <ChevronDown className="w-3 h-3 text-[#747F8D]" />
              </button>

              {isLangOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-[#DDDDDD] shadow-lg z-50 overflow-hidden">
                  <div className="p-2 border-b border-[#DDDDDD]/20 bg-[#ECF8F8]/40">
                    <input
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder={t.searchLanguagePlaceholder}
                      className="w-full px-2.5 py-1 text-xs rounded border border-[#DDDDDD] focus:outline-none focus:border-[#747F8D]"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto p-1">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangOpen(false);
                          setLangSearch('');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded text-xs ${currentLanguage === lang.code ? 'bg-[#DDDDDD] text-[#0F1B29]' : 'text-[#747F8D]'
                          }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Refresh */}
            {onRefreshFeed && currentRoute === '/present' && (
              <button
                type="button"
                onClick={onRefreshFeed}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#DDDDDD] text-xs text-[#747F8D]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;


--- SIH-2026/frontend/src/components/TeamPage.tsx ---

import React from 'react';
import { Users, Code2 } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  photo: string;
  location: string;
  bio: string;
  isLead: boolean;
}

export const TeamPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: 'Soham Lodh',
      role: 'Machine Learning & Full Stack Developer',
      photo: 'https://res.cloudinary.com/lugbjbva/image/upload/v1787859541/suited.png',
      location: 'Kolkata, West Bengal',
      bio: 'Specializes in predictive hazard simulation models, USGS earthquake ingestions, and multi-language profanity moderations.',
      isLead: true,
    },
    {
      name: 'Dhrupad Paitandy',
      role: 'Machine Learning & Full Stack Developer',
      photo: 'https://res.cloudinary.com/ub4y3cag/image/upload/v1787943777/WhatsApp_Image_2026-08-28_at_10.05.31_PM.jpg',
      location: 'Bolpur, West Bengal',
      bio: 'Specializes in predictive hazard simulation models, USGS earthquake ingestions, and multi-language profanity moderations.',
      isLead: false,
    },
    {
      name: 'Aditya Arpit',
      role: 'Full-Stack Developer',
      photo: 'https://res.cloudinary.com/lugbjbva/image/upload/v1787859397/photo.png',
      location: 'Durgapur, West Bengal',
      bio: 'Directs platform architecture, geospatial relevance engines, translation systems, and multi-workspace integrations.',
      isLead: false,
    },
    {
      name: 'Aprajita Kumari',
      role: 'UI/UX & Frontend Engineer',
      photo: 'https://res.cloudinary.com/ub4y3cag/image/upload/v1787889486/f4a9f840-4375-4a51-bdb9-8abdce717627.jpg ',
      location: 'Bhagalpur, Bihar',
      bio: 'Hi! I’m curious, slightly competitive, and always up for trying something new…even if I have no idea what I’m doing at first.',
      isLead: false,
    },
    {
      name: 'Garima Kriti',
      role: 'Machine Learning Engineer',
      photo: 'https://res.cloudinary.com/ub4y3cag/image/upload/v1787888706/3b628aaf-4303-4568-8b7a-eb281efa5692.jpg',
      location: 'Kolkata, West Bengal',
      bio: 'Hi! I’m curious, slightly competitive, and always up for trying something new…even if I have no idea what I’m doing at first.',
      isLead: false,
    },
    {
      name: 'Aaryav Sharma',
      role: 'Machine Learning Engineer',
      photo: 'https://res.cloudinary.com/lugbjbva/image/upload/v1787931004/WhatsApp_Image_2026-08-28_at_8.57.47_PM.jpg',
      location: 'Kolkata, West Bengal',
      bio: 'Hey everyone, I’m into music, playing guitar, and chess, and always up for learning something new!',
      isLead: false,
    },
  ];

  const techStack = [
    { category: 'Core Frontend', items: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Motion'] },
    { category: 'Geospatial', items: ['Leaflet Map Engine', 'GeoJSON Geometry', 'Haversine Relevance'] },
    { category: 'Server Backend', items: ['Node.js', 'Express.js', 'fast-xml-parser', 'multer'] },
    { category: 'Intelligence', items: ['Groq Llama LLM', 'Groq Whisper Speech-to-Text', 'Groq Text-to-Speech'] },
    { category: 'Localization', items: ['MyMemory translation API', '22 Constitutional Indian Languages'] },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#ECF8F8] text-[#0F1B29] font-sans px-4 sm:px-6 lg:px-8 py-8 select-none">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#DDDDDD]/60 border border-[#DDDDDD] text-[#0F1B29] text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Development Team</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F1B29] tracking-tight">
            Meet the Builders of <span className="notranslate" translate="no">AapdaDrishti</span>
          </h1>
          <p className="text-sm text-[#747F8D] max-w-lg mx-auto">
            Combining machine learning, geospatial analysis, and localized web access into India's premier disaster intelligence platform.
          </p>
        </div>

        {/* Dual Column Layout: Members Card List & Tech Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Columns - Team Members Cards */}
          <div className="lg:col-span-2 space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className={`bg-white rounded-2xl border border-[#DDDDDD] p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#747F8D]/50 ${
                  member.isLead ? 'ring-2 ring-[#0F1B29] ring-offset-2 ring-offset-[#ECF8F8]' : ''
                }`}
              >
                {/* Photo */}
                <div className="relative shrink-0">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#DDDDDD]"
                  />
                  {member.isLead && (
                    <span className="absolute -bottom-2 -right-2 bg-[#0F1B29] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-white">
                      Lead
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F1B29] flex items-center justify-center sm:justify-start gap-2">
                      <span>{member.name}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#ECF8F8] border border-[#DDDDDD] text-[#747F8D]">
                        {member.location}
                      </span>
                    </h3>
                    <p className="text-xs font-bold text-[#747F8D] uppercase tracking-wide mt-0.5">{member.role}</p>
                  </div>
                  <p className="text-xs text-[#747F8D] leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Tech Stack */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Tech Stack Card */}
            <div className="bg-white border border-[#DDDDDD] rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#0F1B29] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#DDDDDD]/40 pb-2">
                <Code2 className="w-4 h-4 text-[#747F8D]" />
                <span>Technology Stack</span>
              </h3>
              <div className="space-y-3">
                {techStack.map((stack) => (
                  <div key={stack.category} className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#747F8D] tracking-wider">{stack.category}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {stack.items.map((item) => (
                        <span key={item} className="text-[10px] px-2 py-1 rounded bg-[#ECF8F8] border border-[#DDDDDD]/60 text-[#0F1B29] font-semibold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TeamPage;


--- SIH-2026/frontend/src/components/present/AlertDetailDrawer.tsx ---

import React, { useMemo, useState } from 'react';
import { SachetAlert } from '../../types/disaster';
import {
  X,
  ShieldAlert,
  AlertOctagon,
  Clock,
  MapPin,
  ExternalLink,
  Share2,
  Calendar,
  Building,
  PhoneCall,
  ShieldCheck,
  FileCheck2,
  Copy,
  Info,
  Navigation,
  CheckCircle2,
  XCircle,
  LifeBuoy,
  Check,
} from 'lucide-react';
import { alertEnumLabel, getLocale, getTranslation, translate } from '../../types/language';
import { generateEvacuationGuidance } from '../../lib/relevanceEngine';
import { useLocalizedPresentation } from '../../lib/localizedPresentation';
import { formatDisasterDate } from '../../lib/dateFormat';

interface AlertDetailDrawerProps {
  alert: SachetAlert | null;
  onClose: () => void;
  onShare: (alert: SachetAlert) => void;
  language: string;
}

export const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({
  alert,
  onClose,
  onShare,
  language,
}) => {
  const [hasCopiedInstruction, setHasCopiedInstruction] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'measures' | 'helplines'>('info');
  const t = getTranslation(language);

  const handleCopyInstruction = async () => {
    if (!alert) return;
    const text = `OFFICIAL DISASTER ADVISORY\nEvent: ${alert.event}\nArea: ${alert.areaDesc}\nSeverity: ${alert.severity}\n\nOFFICIAL INSTRUCTIONS:\n${alert.instruction}\n\nEmergency Helpline: ${alert.helpline || '1070 / 1077 / 112'}\nPortal: ${alert.webUrl || ''}`;
    try {
      await navigator.clipboard.writeText(text);
      setHasCopiedInstruction(true);
      setTimeout(() => setHasCopiedInstruction(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (!alert) return null;

  const hazardCenter =
    alert.centroid ||
    alert.circle?.center ||
    alert.polygon?.coordinates?.[0] ||
    null;

  const guidance = hazardCenter
    ? generateEvacuationGuidance(
        {
          lat: hazardCenter[0],
          lng: hazardCenter[1],
          timestamp: Date.now(),
        },
        alert,
        0,
        true
    )
    : null;
  const portalUrl = alert.officialPortalUrl || alert.webUrl || null;
  const presentationEntries = useMemo(() => [
    { id: 'event', text: alert.event }, { id: 'headline', text: alert.headline },
    { id: 'description', text: alert.description }, { id: 'instruction', text: alert.instruction },
    { id: 'area', text: alert.areaDesc }, { id: 'guidance.recommendation', text: guidance ? `Recommendation: Move at least ${guidance.safeDistanceKm} km towards ${guidance.recommendedDirection} to reach safe designated relief shelters and high elevation.` : '' },
    ...(guidance?.actionableMeasures || []).map((text, index) => ({ id: `measure.${index}`, text })),
    ...(guidance?.dos || []).map((text, index) => ({ id: `dos.${index}`, text })),
    ...(guidance?.donts || []).map((text, index) => ({ id: `donts.${index}`, text })),
    ...(guidance?.emergencyContacts || []).flatMap((contact, index) => [{ id: `contact.${index}.label`, text: contact.label }, { id: `contact.${index}.description`, text: contact.description }]),
  ], [alert, guidance]);
  const localized = useLocalizedPresentation(language, presentationEntries);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
              {localized('event', alert.event)}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onShare(alert)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-xs"
            title={translate(language, 'alerts.shareAlert')}
          >
            <Share2 className="w-4 h-4 text-indigo-600" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-xs"
            title={translate(language, 'alerts.closeDrawer')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 pt-3 pb-1 border-b border-slate-200 bg-white flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'info'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {translate(language, 'alerts.overview')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('measures')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'measures'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {translate(language, 'alerts.protectiveMeasures')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('helplines')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
            activeTab === 'helplines'
              ? 'bg-rose-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PhoneCall className="w-3 h-3" />
          <span>{translate(language, 'alerts.helplines')}</span>
        </button>
      </div>

      {/* Drawer Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Tab 1: Overview & CAP Info */}
        {activeTab === 'info' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Telemetry Header */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>{translate(language, 'alerts.liveAdvisory')}</span>
                </span>
              </div>

              <div className="text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 block">{translate(language, 'alerts.issuingAuthority')}:</span>
                  <span className="font-semibold text-slate-800">{alert.sourceAgency || alert.sender}</span>
                </div>
              </div>
            </div>

            {/* Headline & Overview */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm sm:text-base text-slate-900">{localized('headline', alert.headline)}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{localized('description', alert.description)}</p>
            </div>

            {/* Official CAP Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold">{translate(language, 'alerts.severityUrgency')}</span>
                <div className="font-semibold text-slate-900 mt-0.5">{alertEnumLabel(language, alert.severity)} / {alertEnumLabel(language, alert.urgency)}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold">{translate(language, 'alerts.certainty')}</span>
                <div className="font-semibold text-slate-900 mt-0.5">{alertEnumLabel(language, alert.certainty)}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold">{translate(language, 'alerts.effectiveTime')}</span>
                <div className="text-slate-700 font-mono text-[11px] mt-0.5">
                  {new Date(alert.effective).toLocaleTimeString(getLocale(language), { hour: '2-digit', minute: '2-digit' })},{' '}
                  {formatDisasterDate(alert.effective)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold">{translate(language, 'alerts.expiryTime')}</span>
                <div className="text-slate-700 font-mono text-[11px] mt-0.5">
                  {new Date(alert.expires).toLocaleTimeString(getLocale(language), { hour: '2-digit', minute: '2-digit' })},{' '}
                  {formatDisasterDate(alert.expires)}
                </div>
              </div>
              {alert.polygon && alert.polygon.coordinates && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">{translate(language, 'alerts.coordinates', { count: alert.polygon.coordinates.length })}</span>
                  <div className="font-mono text-xs text-slate-800 mt-0.5">
                    {alert.polygon.coordinates.length}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Measures & Evacuation Guidelines */}
        {activeTab === 'measures' && (
          <div className="space-y-4 animate-in fade-in">
            {guidance ? (
              <>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <Navigation className="w-4 h-4 text-amber-600" />
                    <span>{translate(language, 'alerts.evacuationProtocol')}</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {localized('guidance.recommendation', `Recommendation: Move at least ${guidance.safeDistanceKm} km towards ${guidance.recommendedDirection} to reach safe designated relief shelters and high elevation.`)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    {translate(language, 'alerts.protectiveActions')}
                  </div>
                  <div className="space-y-2">
                    {guidance.actionableMeasures.map((measure, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed flex items-start gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1 shrink-0" />
                        <span>{localized(`measure.${idx}`, measure)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{translate(language, 'alerts.dos')}</span>
                    </div>
                    {guidance.dos.map((d, idx) => (
                      <div key={idx} className="text-[11px] text-slate-700 leading-snug flex items-start gap-1">
                        <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{localized(`dos.${idx}`, d)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                    <div className="text-xs font-bold text-rose-900 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{translate(language, 'alerts.donts')}</span>
                    </div>
                    {guidance.donts.map((d, idx) => (
                      <div key={idx} className="text-[11px] text-slate-700 leading-snug flex items-start gap-1">
                        <XCircle className="w-3 h-3 text-rose-600 mt-0.5 shrink-0" />
                        <span>{localized(`donts.${idx}`, d)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {translate(language, 'alerts.noGeometry')}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Helplines */}
        {activeTab === 'helplines' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <LifeBuoy className="w-4 h-4 text-rose-600" />
                <span>{translate(language, 'alerts.controlRooms')}</span>
              </span>
              <span className="text-[10px] text-slate-500">{translate(language, 'alerts.tapToCall')}</span>
            </div>

            <div className="space-y-2">
              {guidance.emergencyContacts.map((c, idx) => (
                <a
                  key={idx}
                  href={`tel:${c.number.replace(/[^0-9]/g, '')}`}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-300 hover:bg-white transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{localized(`contact.${idx}.label`, c.label)}</div>
                    <div className="text-[11px] text-slate-500">{localized(`contact.${idx}.description`, c.description)}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-rose-50 group-hover:bg-rose-600 text-rose-700 group-hover:text-white font-mono font-bold text-xs shrink-0 transition-colors flex items-center gap-1.5">
                    <PhoneCall className="w-3 h-3" />
                    <span>{c.number}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2.5">
        {portalUrl ? (
          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
            <span>{translate(language, 'alerts.officialPortal')}</span>
          </a>
        ) : (
          <div className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{translate(language, 'alerts.portalUnavailable')}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onShare(alert)}
          className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs shadow-rose-200 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{translate(language, 'alerts.forward')}</span>
        </button>
      </div>
    </div>
  );
};



--- SIH-2026/frontend/src/components/present/IndiaLiveMap.tsx ---

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  SachetAlert,
  DisasterCategory,
} from '../../types/disaster';
import {
  AlertTriangle,
  Wind,
  Droplets,
  Activity,
  Mountain,
  SunMedium,
  CloudLightning,
  CloudRain,
  Flame,
  Snowflake,
  Waves,
  Layers,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { hazardLabel, translate } from '../../types/language';

interface IndiaLiveMapProps {
  alerts: SachetAlert[];
  selectedAlertId: string | null;
  onSelectAlert: (alert: SachetAlert) => void;
  userCoordinates?: [number, number] | null;
  language: string;
}

const INDIA_BOUNDS = {
  minLat: 6.0,
  maxLat: 38.8,
  minLng: 67.5,
  maxLng: 98.8,
};

const STATE_CENTROIDS: Record<string, [number, number]> = {
  'andaman and nicobar islands': [11.7401, 92.6586],
  'andhra pradesh': [15.9129, 79.74],
  'arunachal pradesh': [28.218, 94.7278],
  assam: [26.2006, 92.9376],
  bihar: [25.0961, 85.3131],
  chhattisgarh: [21.2787, 81.8661],
  goa: [15.2993, 74.124],
  gujarat: [22.2587, 71.1924],
  haryana: [29.0588, 76.0856],
  'himachal pradesh': [31.1048, 77.1734],
  jharkhand: [23.6102, 85.2799],
  karnataka: [15.3173, 75.7139],
  kerala: [10.8505, 76.2711],
  ladakh: [34.1526, 77.577],
  'madhya pradesh': [22.9734, 78.6569],
  maharashtra: [19.7515, 75.7139],
  manipur: [24.6637, 93.9063],
  meghalaya: [25.467, 91.3662],
  mizoram: [23.1645, 92.9376],
  nagaland: [26.1584, 94.5624],
  odisha: [20.9517, 85.0985],
  punjab: [31.1471, 75.3412],
  rajasthan: [27.0238, 74.2179],
  sikkim: [27.533, 88.5122],
  'tamil nadu': [11.1271, 78.6569],
  telangana: [18.1124, 79.0193],
  tripura: [23.9408, 91.9882],
  uttarakhand: [30.0668, 79.0193],
  'uttar pradesh': [26.8467, 80.9462],
  'west bengal': [22.9868, 87.855],
  delhi: [28.6139, 77.209],
  'jammu and kashmir': [33.7782, 76.5762],
  'dadra and nagar haveli and daman and diu': [20.3974, 72.8328],
  puducherry: [11.9416, 79.8083],
};

function clampToIndiaBounds([lat, lng]: [number, number]): [number, number] {
  return [
    Math.min(Math.max(lat, INDIA_BOUNDS.minLat), INDIA_BOUNDS.maxLat),
    Math.min(Math.max(lng, INDIA_BOUNDS.minLng), INDIA_BOUNDS.maxLng),
  ];
}

function isWithinIndiaBounds([lat, lng]: [number, number]): boolean {
  return (
    lat >= INDIA_BOUNDS.minLat &&
    lat <= INDIA_BOUNDS.maxLat &&
    lng >= INDIA_BOUNDS.minLng &&
    lng <= INDIA_BOUNDS.maxLng
  );
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function applyStableJitter(base: [number, number], seed: string, spread = 0.68): [number, number] {
  const hash = hashString(seed || 'alert');
  const angle = (hash % 360) * (Math.PI / 180);
  const radius = ((hash % 1000) / 1000) * spread;
  return clampToIndiaBounds([
    base[0] + Math.sin(angle) * radius,
    base[1] + Math.cos(angle) * radius,
  ]);
}

function hashFallbackPoint(seed: string): [number, number] {
  const hash = hashString(seed || 'alert');
  const latRange = INDIA_BOUNDS.maxLat - INDIA_BOUNDS.minLat;
  const lngRange = INDIA_BOUNDS.maxLng - INDIA_BOUNDS.minLng;
  const lat = INDIA_BOUNDS.minLat + ((hash % 10000) / 10000) * latRange;
  const lng = INDIA_BOUNDS.minLng + (((Math.floor(hash / 10000) % 10000)) / 10000) * lngRange;
  return clampToIndiaBounds([lat, lng]);
}

function deriveFallbackAlertPoint(alert: SachetAlert): [number, number] | null {
  const text = [
    alert.state,
    alert.district,
    alert.areaDesc,
    alert.event,
    alert.headline,
    alert.description,
    alert.category,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const [needle, centroid] of Object.entries(STATE_CENTROIDS)) {
    if (text.includes(needle)) return centroid;
  }

  if (text.includes('bhubaneswar') || text.includes('puri') || text.includes('cuttack')) return STATE_CENTROIDS.odisha;
  if (text.includes('guwahati') || text.includes('kamrup') || text.includes('dibrugarh')) return STATE_CENTROIDS.assam;
  if (text.includes('shimla') || text.includes('kullu') || text.includes('manali')) return STATE_CENTROIDS['himachal pradesh'];
  if (text.includes('srinagar') || text.includes('jammu')) return STATE_CENTROIDS['jammu and kashmir'];
  if (text.includes('mumbai') || text.includes('raigad') || text.includes('konkan')) return STATE_CENTROIDS.maharashtra;
  if (text.includes('kozhikode') || text.includes('wayanad') || text.includes('thiruvananthapuram')) return STATE_CENTROIDS.kerala;
  if (text.includes('ahmedabad') || text.includes('surat') || text.includes('kutch')) return STATE_CENTROIDS.gujarat;
  if (text.includes('kolkata') || text.includes('sundarbans')) return STATE_CENTROIDS['west bengal'];
  if (text.includes('chennai') || text.includes('madurai') || text.includes('tirunelveli')) return STATE_CENTROIDS['tamil nadu'];
  if (text.includes('jaipur') || text.includes('bikaner') || text.includes('jaisalmer')) return STATE_CENTROIDS.rajasthan;
  if (text.includes('delhi') || text.includes('ncr') || text.includes('gurugram')) return STATE_CENTROIDS.delhi;

  const districtHints: Array<[string, [number, number]]> = [
    ['arvalli', STATE_CENTROIDS.gujarat],
    ['chhotaudepur', STATE_CENTROIDS.gujarat],
    ['chhota udaipur', STATE_CENTROIDS.gujarat],
    ['dahod', STATE_CENTROIDS.gujarat],
    ['mahisagar', STATE_CENTROIDS.gujarat],
    ['narmada', STATE_CENTROIDS.gujarat],
    ['panch mahals', STATE_CENTROIDS.gujarat],
    ['panchmahal', STATE_CENTROIDS.gujarat],
    ['sabarkantha', STATE_CENTROIDS.gujarat],
    ['sabar kantha', STATE_CENTROIDS.gujarat],
    ['banaskantha', STATE_CENTROIDS.gujarat],
    ['balrampur', STATE_CENTROIDS['chhattisgarh']],
    ['bastar', STATE_CENTROIDS['chhattisgarh']],
    ['bijapur', STATE_CENTROIDS['chhattisgarh']],
    ['dantewada', STATE_CENTROIDS['chhattisgarh']],
    ['koriya', STATE_CENTROIDS['chhattisgarh']],
    ['manendragarh', STATE_CENTROIDS['chhattisgarh']],
    ['sukma', STATE_CENTROIDS['chhattisgarh']],
    ['surajpur', STATE_CENTROIDS['chhattisgarh']],
    ['chengalpattu', STATE_CENTROIDS['tamil nadu']],
    ['cuddalore', STATE_CENTROIDS['tamil nadu']],
    ['kallakurichi', STATE_CENTROIDS['tamil nadu']],
    ['kancheepuram', STATE_CENTROIDS['tamil nadu']],
    ['pudukkottai', STATE_CENTROIDS['tamil nadu']],
    ['sivaganga', STATE_CENTROIDS['tamil nadu']],
    ['thanjavur', STATE_CENTROIDS['tamil nadu']],
    ['thiruvarur', STATE_CENTROIDS['tamil nadu']],
    ['viluppuram', STATE_CENTROIDS['tamil nadu']],
    ['ariyalur', STATE_CENTROIDS['tamil nadu']],
    ['karur', STATE_CENTROIDS['tamil nadu']],
    ['alipurduar', STATE_CENTROIDS['west bengal']],
    ['jalpaiguri', STATE_CENTROIDS['west bengal']],
    ['north dinajpur', STATE_CENTROIDS['west bengal']],
    ['south dinajpur', STATE_CENTROIDS['west bengal']],
    ['uttar dinajpur', STATE_CENTROIDS['west bengal']],
    ['dakshin dinajpur', STATE_CENTROIDS['west bengal']],
    ['dehradun', STATE_CENTROIDS.uttarakhand],
    ['tehri', STATE_CENTROIDS.uttarakhand],
    ['uttarkashi', STATE_CENTROIDS.uttarakhand],
    ['chamoli', STATE_CENTROIDS.uttarakhand],
    ['rudraprayag', STATE_CENTROIDS.uttarakhand],
    ['pithoragarh', STATE_CENTROIDS.uttarakhand],
    ['east garo hills', STATE_CENTROIDS.meghalaya],
    ['west garo hills', STATE_CENTROIDS.meghalaya],
    ['east khasi hills', STATE_CENTROIDS.meghalaya],
    ['west khasi hills', STATE_CENTROIDS.meghalaya],
    ['west jaintia hills', STATE_CENTROIDS.meghalaya],
    ['south west khasi hills', STATE_CENTROIDS.meghalaya],
    ['ri bhoi', STATE_CENTROIDS.meghalaya],
    ['bahraich', STATE_CENTROIDS['uttar pradesh']],
    ['shravasti', STATE_CENTROIDS['uttar pradesh']],
    ['saharanpur', STATE_CENTROIDS['uttar pradesh']],
    ['sonbhadra', STATE_CENTROIDS['uttar pradesh']],
    ['assam', STATE_CENTROIDS.assam],
    ['kamrup', STATE_CENTROIDS.assam],
    ['sonitpur', STATE_CENTROIDS.assam],
    ['dibrugarh', STATE_CENTROIDS.assam],
    ['goalpara', STATE_CENTROIDS.assam],
    ['barpeta', STATE_CENTROIDS.assam],
    ['maharashtra', STATE_CENTROIDS.maharashtra],
    ['raigad', STATE_CENTROIDS.maharashtra],
    ['ratnagiri', STATE_CENTROIDS.maharashtra],
    ['sindhudurg', STATE_CENTROIDS.maharashtra],
    ['kerala', STATE_CENTROIDS.kerala],
    ['wayanad', STATE_CENTROIDS.kerala],
    ['idukki', STATE_CENTROIDS.kerala],
    ['palakkad', STATE_CENTROIDS.kerala],
    ['odisha', STATE_CENTROIDS.odisha],
    ['bhadrak', STATE_CENTROIDS.odisha],
    ['balasore', STATE_CENTROIDS.odisha],
    ['khordha', STATE_CENTROIDS.odisha],
    ['kalahandi', STATE_CENTROIDS.odisha],
    ['koraput', STATE_CENTROIDS.odisha],
    ['jagatsinghpur', STATE_CENTROIDS.odisha],
    ['kendrapara', STATE_CENTROIDS.odisha],
    ['bihar', STATE_CENTROIDS.bihar],
    ['muzaffarpur', STATE_CENTROIDS.bihar],
    ['sitamarhi', STATE_CENTROIDS.bihar],
    ['madhubani', STATE_CENTROIDS.bihar],
    ['patna', STATE_CENTROIDS.bihar],
    ['maharashtra', STATE_CENTROIDS.maharashtra],
  ];

  for (const [needle, centroid] of districtHints) {
    if (text.includes(needle)) return centroid;
  }

  return null;
}

export function resolveAlertMapPoint(alert: SachetAlert, index = 0): [number, number] | null {
  const candidates = [
    alert.centroid,
    alert.polygon && alert.polygon.coordinates.length > 0 ? alert.polygon.coordinates[0] : null,
    alert.circle ? alert.circle.center : null,
    deriveFallbackAlertPoint(alert),
  ].filter(Boolean) as [number, number][];

  for (const candidate of candidates) {
    if (isWithinIndiaBounds(candidate)) {
      return applyStableJitter(candidate, `${alert.id}:${index}:${alert.state || ''}:${alert.district || ''}`);
    }
  }

  return null;
}

// Icon mappings for categories
export function getCategoryIconSvg(category: string, severity?: string): string {
  const color = '#0F1B29'; // Unified dark slate theme color for all icons

  let iconInner = '';
  const catLower = (category || '').toLowerCase();

  if (catLower.includes('cyclon') || catLower.includes('storm')) {
    iconInner = `
      <path d="M12.8 19.6A2 2 0 1 0 14 16H2" />
      <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
      <path d="M9.8 4.4A2 2 0 1 1 11 8H2" />
    `;
  } else if (catLower.includes('flood') || catLower.includes('inundat')) {
    iconInner = `
      <path d="M18.4 12A6 6 0 1 0 7.2 9H6a7 7 0 0 0-1 13.9" fill="${color}" fill-opacity="0.1" />
      <path d="M18.4 12A6 6 0 1 0 7.2 9H6a7 7 0 0 0-1 13.9M12 17l-2 3M16 17l-2 3M8 17l-2 3" stroke-width="2" />
    `;
  } else if (catLower.includes('earthquake') || catLower.includes('seismic')) {
    iconInner = `
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    `;
  } else if (catLower.includes('landslide')) {
    iconInner = `
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    `;
  } else if (catLower.includes('heat')) {
    iconInner = `
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    `;
  } else if (catLower.includes('lightning')) {
    iconInner = `
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    `;
  } else if (catLower.includes('rain')) {
    iconInner = `
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M16 14v6" />
      <path d="M8 14v6" />
      <path d="M12 16v6" />
    `;
  } else {
    iconInner = `
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="filter drop-shadow-sm">
      ${iconInner}
    </svg>
  `;
}

export const IndiaLiveMap: React.FC<IndiaLiveMapProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  userCoordinates,
  language,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const onSelectAlertRef = useRef(onSelectAlert);
  const hasUserInteractedRef = useRef(false);
  const hasInitializedViewRef = useRef(false);
  const activeFilterRef = useRef<string | null>(null);
  const [mapError, setMapError] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // Active categories present in alerts
  const activeCategories = Array.from(new Set(alerts.map((a) => a.category)));

  useEffect(() => {
    onSelectAlertRef.current = onSelectAlert;
  }, [onSelectAlert]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (!mapInstanceRef.current) {
        // Center of India (20.5937 N, 78.9629 E)
        const map = L.map(mapContainerRef.current, {
          center: [21.5, 82.0],
          zoom: 5,
          minZoom: 4,
          maxZoom: 14,
          zoomControl: false,
        });

        // Satellite imagery avoids disputed-label rendering while keeping every
        // application marker and user interaction in Leaflet.
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            attribution: 'Tiles &copy; Esri',
            maxZoom: 19,
          }
        ).addTo(map);

        L.control.zoom({ position: 'topright' }).addTo(map);

        const layerGroup = L.layerGroup().addTo(map);
        layerGroupRef.current = layerGroup;
        mapInstanceRef.current = map;

        map.on('movestart zoomstart dragstart', () => {
          hasUserInteractedRef.current = true;
        });

        window.setTimeout(() => {
          map.invalidateSize();
        }, 0);
      }

      if (mapContainerRef.current && !resizeObserverRef.current) {
        resizeObserverRef.current = new ResizeObserver(() => {
          window.requestAnimationFrame(() => {
            mapInstanceRef.current?.invalidateSize();
          });
        });
        resizeObserverRef.current.observe(mapContainerRef.current);
      }
    } catch (e) {
      console.error('Leaflet initialization error:', e);
      setMapError(true);
    }

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Alert Layers, Polygons, and Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const filteredAlerts = activeCategoryFilter
      ? alerts.filter((a) => a.category === activeCategoryFilter)
      : alerts;

    filteredAlerts.forEach((alert) => {
      const isSelected = alert.id === selectedAlertId;
      const isExtreme = alert.severity === 'Extreme';
      const isSevere = alert.severity === 'Severe';

      // Unified slate color system to match black/dark gray icons
      const strokeColor = isSelected ? '#4f46e5' : '#0F1B29';
      const fillColor = isSelected ? '#e0e7ff' : '#EEF0F2';

      // 1. Draw Vector Polygon if present
      if (alert.polygon && alert.polygon.coordinates && alert.polygon.coordinates.length >= 3) {
        const latLngs: L.LatLngExpression[] = alert.polygon.coordinates.map((c) => [c[0], c[1]]);

        const polygon = L.polygon(latLngs, {
          color: strokeColor,
          weight: isSelected ? 3.5 : 2,
          opacity: 0.9,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.35 : 0.2,
          smoothFactor: 1.2,
          lineJoin: 'round',
          lineCap: 'round',
        });

        polygon.on('click', () => {
          onSelectAlertRef.current(alert);
        });

        polygon.bindTooltip(
          `<strong>${alert.event}</strong><br/>${alert.areaDesc}<br/><span style="color:#e11d48;font-weight:bold;">${alert.severity}</span>`,
          { sticky: true, className: 'leaflet-disaster-tooltip' }
        );

        polygon.addTo(layerGroup);
      }

      // 2. Draw Circle if present
      if (alert.circle && alert.circle.center) {
        const circle = L.circle([alert.circle.center[0], alert.circle.center[1]], {
          radius: (alert.circle.radiusKm || 30) * 1000,
          color: strokeColor,
          weight: isSelected ? 3 : 2,
          fillColor: fillColor,
          fillOpacity: 0.2,
        });
        circle.on('click', () => onSelectAlertRef.current(alert));
        circle.addTo(layerGroup);
      }

      // 3. Place Hazard Marker using centroid, geometry, or a stable regional fallback.
      const markerPos = resolveAlertMapPoint(alert, filteredAlerts.indexOf(alert));

      if (markerPos) {
        const ringClass = isSelected
          ? 'ring-4 ring-indigo-300 ring-offset-2'
          : 'ring-2 ring-slate-200';

        const iconHtml = `
          <div class="relative group cursor-pointer flex flex-col items-center">
            <div class="w-8 h-8 rounded-2xl bg-white shadow-md flex items-center justify-center ${ringClass} transition-transform hover:scale-110" style="border: 2px solid ${strokeColor};">
              ${getCategoryIconSvg(alert.category, alert.severity)}
            </div>
            <div class="mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-tight whitespace-nowrap shadow-sm" style="background-color: ${fillColor}; border: 1.5px solid ${strokeColor}; color: ${strokeColor};">
              ${hazardLabel(language, alert.category)}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-disaster-marker',
          iconSize: [34, 42],
          iconAnchor: [17, 21],
        });

        const marker = L.marker(markerPos, { icon: customIcon });
        marker.on('click', () => {
          onSelectAlertRef.current(alert);
        });

        marker.addTo(layerGroup);
      }
    });

    // 4. User Location Marker if available
    if (userCoordinates) {
      const userIconHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-200 shadow-lg animate-pulse"></div>
          <div class="absolute -top-6 px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[9px] shadow whitespace-nowrap">
            ${translate(language, 'present.yourLocation')}
          </div>
        </div>
      `;
      const userIcon = L.divIcon({
        html: userIconHtml,
        className: 'custom-user-marker',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker(userCoordinates, { icon: userIcon, zIndexOffset: 1000 }).addTo(layerGroup);
    }

    const fitPositions = filteredAlerts
      .map((alert, index) => resolveAlertMapPoint(alert, index))
      .filter(Boolean) as [number, number][];

    if (userCoordinates) {
      fitPositions.push(userCoordinates);
    }

    const selectedAlert = selectedAlertId ? filteredAlerts.find((item) => item.id === selectedAlertId) : null;
    const selectedPosition = selectedAlert ? resolveAlertMapPoint(selectedAlert, filteredAlerts.indexOf(selectedAlert)) : null;
    const filterChanged = activeFilterRef.current !== activeCategoryFilter;
    activeFilterRef.current = activeCategoryFilter;

    if (selectedPosition) {
      map.setView(selectedPosition, Math.min(Math.max(map.getZoom(), 7), 9), { animate: false });
      hasInitializedViewRef.current = true;
    } else if (fitPositions.length > 0 && (!hasInitializedViewRef.current || filterChanged || !hasUserInteractedRef.current)) {
      const bounds = L.latLngBounds(fitPositions.map((pos) => L.latLng(pos[0], pos[1])));
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.12), { padding: [28, 28], maxZoom: 9, animate: false });
        hasInitializedViewRef.current = true;
      }
    }
  }, [alerts, selectedAlertId, activeCategoryFilter, userCoordinates, language]);

  if (mapError) {
    return (
      <div className="w-full h-[420px] rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>{translate(language, 'present.mapOffline')}</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {alerts.map((a) => (
              <div
                key={a.id}
                onClick={() => onSelectAlertRef.current(a)}
                className="py-2.5 cursor-pointer hover:bg-slate-50 px-2 rounded-xl flex justify-between items-center"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{a.event}</h4>
                  <p className="text-xs text-slate-500">{a.areaDesc} • {a.category}</p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                  {a.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMapError(false)}
          className="self-start px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{translate(language, 'present.retryMap')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Active Categories Filter Bar */}
      <div className="absolute top-3 left-3 right-14 z-10 flex items-center gap-1.5 overflow-x-auto py-1 px-1.5 scrollbar-none pointer-events-auto">
        <button
          type="button"
          onClick={() => setActiveCategoryFilter(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-sm shrink-0 flex items-center gap-1.5 ${activeCategoryFilter === null
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white/95 text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>{translate(language, 'present.allHazards', { count: alerts.length })}</span>
        </button>

        {activeCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategoryFilter(activeCategoryFilter === cat ? null : cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-sm shrink-0 flex items-center gap-1.5 ${activeCategoryFilter === cat
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white/95 text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <span>{hazardLabel(language, cat)}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeCategoryFilter === cat ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
              {alerts.filter((a) => a.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom Floating Map Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-lg max-w-xs hidden sm:block pointer-events-auto text-xs space-y-1.5">
        <div className="font-bold text-[11px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-indigo-600" />
          <span>{translate(language, 'present.legend')}</span>
        </div>
        <div className="grid grid-cols-1 gap-y-1.5 text-[11px] text-slate-700">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>{translate(language, 'present.highPriority')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-3.5 h-3.5 text-amber-500" />
            <span>{translate(language, 'present.moderatePriority')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-rose-500" />
            <span>{translate(language, 'present.boundary')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>{translate(language, 'present.yourLocation')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};



--- SIH-2026/frontend/src/components/present/LocationIntelligencePanel.tsx ---

import React, { useState } from 'react';
import {
  RelevanceResult,
  UserLocation,
  SachetAlert,
} from '../../types/disaster';
import {
  ShieldAlert,
  MapPin,
  Clock,
  Compass,
  Share2,
  Search,
  AlertOctagon,
  CheckCircle2,
  PhoneCall,
  Navigation,
  ArrowRight,
  AlertTriangle,
  LifeBuoy,
  XCircle,
  Check,
  Building,
  Volume2,
} from 'lucide-react';
import { getTranslation } from '../../types/language';
import { apiUrl } from '../../lib/api';

interface LocationIntelligencePanelProps {
  userLocation: UserLocation | null;
  relevanceResults: RelevanceResult[];
  selectedAlert: SachetAlert | null;
  onSelectAlert: (alert: SachetAlert) => void;
  onCheckCustomLocation: (location: UserLocation) => void;
  onResetToGPS: () => void;
  onOpenShareModal: (alert: SachetAlert, result: RelevanceResult) => void;
  language: string;
}

export const LocationIntelligencePanel: React.FC<LocationIntelligencePanelProps> = ({
  userLocation,
  relevanceResults,
  selectedAlert,
  onSelectAlert,
  onCheckCustomLocation,
  onResetToGPS,
  onOpenShareModal,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [resolvedPlaces, setResolvedPlaces] = useState<Array<{ name: string; lat: number; lng: number; state?: string; district?: string; country?: string }>>([]);
  const [activeTab, setActiveTab] = useState<'measures' | 'helplines' | 'dos_donts'>('measures');
  const t = getTranslation(language);

  // Highest priority relevant alert
  const topResult = relevanceResults.find(
    (r) =>
      r.status === 'CRITICAL' ||
      r.status === 'HIGH_PRIORITY' ||
      r.status === 'WARNING' ||
      r.status === 'NEARBY' ||
      r.status === 'AWARENESS_ONLY'
  );

  const activeAlert = selectedAlert || (topResult ? topResult.alert : null);
  const activeRelevance = activeAlert
    ? relevanceResults.find((r) => r.alert.id === activeAlert.id) || topResult
    : null;

  const guidance = activeRelevance?.evacuationGuidance;

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setIsResolvingLocation(true);
    setLookupError(null);
    setResolvedPlaces([]);

    try {
      const res = await fetch(apiUrl(`/api/geocode?q=${encodeURIComponent(q)}`));
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Unable to resolve location');
      }

      const places = Array.isArray(data.places) ? data.places : [];
      if (!places.length) {
        setLookupError('No live location match found.');
        return;
      }

      setResolvedPlaces(places.slice(0, 5));
      const [best] = places;
      onCheckCustomLocation({
        lat: best.lat,
        lng: best.lng,
        cityName: best.name,
        state: best.state || best.district || best.country,
        district: best.district,
        timestamp: Date.now(),
        isCustomLookup: true,
      });
    } catch (error) {
      setLookupError((error as Error).message || 'Location lookup failed');
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const handleSelectResolvedPlace = (place: { name: string; lat: number; lng: number; state?: string; district?: string; country?: string }) => {
    onCheckCustomLocation({
      lat: place.lat,
      lng: place.lng,
      cityName: place.name,
      state: place.state || place.district || place.country,
      district: place.district,
      timestamp: Date.now(),
      isCustomLookup: true,
    });
    setSearchQuery(place.name);
    setResolvedPlaces([]);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header & Location Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span>{userLocation?.isCustomLookup ? 'Queried Location' : userLocation ? 'Your Current Location' : 'No Location Selected'}</span>
                {userLocation?.isCustomLookup && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold border border-indigo-100">
                    Custom Pin
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {userLocation
                  ? userLocation.cityName
                    ? `${userLocation.cityName}, ${userLocation.state || 'India'}`
                    : `${userLocation.lat.toFixed(4)}° N, ${userLocation.lng.toFixed(4)}° E`
                  : 'Search a city, district, or village to start live geospatial monitoring.'}
              </p>
            </div>
          </div>

          {userLocation?.isCustomLookup && (
            <button
              type="button"
              onClick={onResetToGPS}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline transition-colors"
            >
              Reset to GPS
            </button>
          )}
        </div>

        {/* Check Another Location Search Bar */}
        <div className="relative">
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, district, village, or landmark..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isResolvingLocation}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-xs font-semibold text-white transition-colors"
            >
              {isResolvingLocation ? 'Locating...' : 'Query'}
            </button>
          </form>

          {lookupError && (
            <div className="mt-2 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {lookupError}
            </div>
          )}

          {resolvedPlaces.length > 1 && (
            <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Select a live geocoded match
              </div>
              {resolvedPlaces.map((place) => (
                <button
                  key={`${place.name}-${place.lat}-${place.lng}`}
                  type="button"
                  onClick={() => handleSelectResolvedPlace(place)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white border border-transparent hover:border-slate-200 flex justify-between gap-3 transition-colors"
                >
                  <span className="font-semibold text-slate-800">{place.name}</span>
                  <span className="text-[11px] text-slate-500">{place.state || place.country || 'India'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Intelligence Block */}
      {userLocation && activeAlert && activeRelevance && activeRelevance.status !== 'NOT_RELEVANT' ? (
        <div className="space-y-4">
          {/* SOS Real-time Threat & Evacuation Banner */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              activeRelevance.status === 'CRITICAL' || activeRelevance.status === 'HIGH_PRIORITY'
                ? 'bg-rose-50/80 border-rose-200 text-rose-950 shadow-sm'
                : activeRelevance.status === 'WARNING' || activeRelevance.status === 'NEARBY'
                ? 'bg-amber-50/80 border-amber-200 text-amber-950 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert
                  className={`w-5 h-5 ${
                    activeRelevance.status === 'CRITICAL'
                      ? 'text-rose-600 animate-pulse'
                      : 'text-amber-600'
                  }`}
                />
                <span className="font-bold text-xs uppercase tracking-wider">
                  {activeAlert.severity} Hazard: {activeAlert.event}
                </span>
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  activeRelevance.status === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {activeRelevance.distanceKm === 0
                  ? 'Inside Danger Zone'
                  : `~${activeRelevance.distanceKm} km away`}
              </span>
            </div>

            {/* Approach Description & Vector */}
            {guidance && (
              <div className="p-3 rounded-xl bg-white/90 border border-rose-200/70 text-slate-900 space-y-2 mb-3 shadow-xs">
                <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {guidance.approachDescription}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Hazard Origin: <span className="font-semibold text-slate-800">{guidance.hazardOriginName}</span> • Bearing: <span className="font-semibold text-slate-800">{guidance.bearingCardinal} ({guidance.bearingDegrees}°)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Recommended Evacuation:
                  </span>
                  <span className="font-bold text-slate-900">
                    Move ~{guidance.safeDistanceKm} km towards {guidance.recommendedDirection}
                  </span>
                </div>
              </div>
            )}

            {/* Plain Summary */}
            <p className="text-xs sm:text-sm font-semibold leading-snug">
              {activeRelevance.plainSummary}
            </p>

            <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{activeRelevance.confidenceLabel}</span>
            </div>
          </div>

          {/* Verbatim Official Instructions Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              <span>{t.officialInstructionTitle}</span>
            </div>
            <p className="text-xs text-slate-800 font-medium whitespace-pre-line leading-relaxed">
              {activeAlert.instruction}
            </p>
          </div>

          {/* Dynamic Tabs: Measures | Helplines & SOS | Do's & Don'ts */}
          <div className="space-y-2.5">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('measures')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'measures'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Protective Measures
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('helplines')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'helplines'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PhoneCall className="w-3 h-3" />
                <span>Emergency Helplines</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dos_donts')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'dos_donts'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Do&apos;s &amp; Don&apos;ts
              </button>
            </div>

            {/* Tab 1: Measures Content */}
            {activeTab === 'measures' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Actionable Safety Protocol</span>
                  <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-mono">
                    Category: {activeAlert.category}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {guidance?.actionableMeasures.map((measure, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200/70 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <span>{measure}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Emergency Helplines & SOS Quick-Dial */}
            {activeTab === 'helplines' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <LifeBuoy className="w-4 h-4 text-rose-600" />
                    <span>24x7 Verified Disaster Helplines</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Tap to Call Directly</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {guidance?.emergencyContacts.map((contact, idx) => (
                    <a
                      key={idx}
                      href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-xs transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-[11px] font-bold text-slate-900 truncate">
                          {contact.label}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {contact.description}
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-rose-50 group-hover:bg-rose-600 text-rose-700 group-hover:text-white font-mono font-bold text-xs shrink-0 transition-colors flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" />
                        <span>{contact.number}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Do's and Don'ts */}
            {activeTab === 'dos_donts' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                {/* Do's */}
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Essential Do&apos;s</span>
                  </div>
                  <div className="space-y-1.5">
                    {guidance?.dos.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-slate-800 leading-snug flex items-start gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Don'ts */}
                <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                  <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Critical Don&apos;ts</span>
                  </div>
                  <div className="space-y-1.5">
                    {guidance?.donts.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-slate-800 leading-snug flex items-start gap-1.5"
                      >
                        <XCircle className="w-3 h-3 text-rose-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Row: Share, View Full Alert Details */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onOpenShareModal(activeAlert, activeRelevance)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.share}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectAlert(activeAlert)}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-rose-200"
            >
              <span>{t.viewDetails}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Safe Status State */
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              {userLocation ? t.noAlertsNearby : 'Select a location to evaluate nearby threats'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              {userLocation
                ? `No active extreme hazard warnings directly intersect your selected coordinates (${userLocation.cityName || 'Current Point'}).`
                : 'Use GPS or a live geocoded search to activate the evacuation guidance and nearby hazard check.'}
            </p>
          </div>

          {/* Always provide quick helpline reference */}
          <div className="pt-3 border-t border-slate-200 text-left">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              National Emergency Helplines
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <a
                href="tel:112"
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50"
              >
                112 (SOS)
              </a>
              <a
                href="tel:1070"
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50"
              >
                1070 (SEOC)
              </a>
              <a
                href="tel:1078"
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50"
              >
                1078 (NDRF)
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



--- SIH-2026/frontend/src/components/present/PresentWorkspace.tsx ---

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  SachetAlert,
  UserLocation,
  RelevanceResult,
} from '../../types/disaster';
import { evaluateAllAlertsRelevance } from '../../lib/relevanceEngine';
import { IndiaLiveMap } from './IndiaLiveMap';
import { resolveAlertMapPoint } from './IndiaLiveMap';
import { UserLocationMap } from './UserLocationMap';
import { LocationIntelligencePanel } from './LocationIntelligencePanel';
import { AlertDetailDrawer } from './AlertDetailDrawer';
import { RealtimeWarningToast } from './RealtimeWarningToast';
import { ShareModal } from './ShareModal';
import { IndiaMapSkeleton, UserMapSkeleton, LocationSkeleton } from '../common/Skeletons';
import { Radio, Layers, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { translate } from '../../types/language';
import { apiUrl } from '../../lib/api';

interface PresentWorkspaceProps {
  language: string;
  onFeedStatusChange?: (status: 'LIVE_FETCH' | 'ETAG_CACHED' | 'FALLBACK_SNAPSHOT' | 'ERROR', lastUpdated: string) => void;
}

export const PresentWorkspace: React.FC<PresentWorkspaceProps> = ({
  language,
  onFeedStatusChange,
}) => {
  const [alerts, setAlerts] = useState<SachetAlert[]>([]);
  const [etag, setEtag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAlert, setSelectedAlert] = useState<SachetAlert | null>(null);
  const [mobileTab, setMobileTab] = useState<'india' | 'nearme'>('india');

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const [relevanceResults, setRelevanceResults] = useState<RelevanceResult[]>([]);
  const [shareAlert, setShareAlert] = useState<SachetAlert | null>(null);
  const [shareRelevance, setShareRelevance] = useState<RelevanceResult | null>(null);
  const etagRef = useRef<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyMeters: pos.coords.accuracy,
          cityName: 'Current GPS Point',
          timestamp: Date.now(),
          isCustomLookup: false,
        });
      },
      (err) => {
        console.log('Geolocation unavailable or denied:', err.message);
      },
      { timeout: 5000 }
    );
  }, []);

  // Fetch SACHET alerts
  const fetchAlerts = async () => {
    try {
      const headers: Record<string, string> = {};
      if (etagRef.current) {
        headers['If-None-Match'] = etagRef.current;
      }

      // Locale changes presentation only; canonical official alert data is never refetched for translation.
      const res = await fetch(apiUrl('/api/alerts'), { headers });

      if (res.status === 304) {
        // Not modified, ETag cached
        if (onFeedStatusChange) onFeedStatusChange('ETAG_CACHED', new Date().toISOString());
        setIsLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
        if (data.etag) {
          etagRef.current = data.etag;
          setEtag(data.etag);
        }
        if (onFeedStatusChange) {
          onFeedStatusChange(
            data.cacheStatus === 'FALLBACK_SNAPSHOT' ? 'FALLBACK_SNAPSHOT' : 'LIVE_FETCH',
            data.lastUpdated || new Date().toISOString()
          );
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      console.error('Failed to fetch SACHET alerts:', err);
      if (onFeedStatusChange) onFeedStatusChange('ERROR', new Date().toISOString());
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and 30-sec polling
  useEffect(() => {
    void fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void fetchAlerts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Run 5-Case Geospatial Relevance Engine whenever alerts or user location updates
  useEffect(() => {
    if (alerts.length > 0 && userLocation) {
      const results = evaluateAllAlertsRelevance(alerts, userLocation);
      setRelevanceResults(results);
    } else {
      setRelevanceResults([]);
    }
  }, [alerts, userLocation]);

  const displayAlerts = useMemo(
    () => alerts.filter((alert, index) => Boolean(resolveAlertMapPoint(alert, index))),
    [alerts]
  );

  // Nearby alerts for user location map
  const nearbyAlerts = relevanceResults
    .filter((r) => r.status !== 'NOT_RELEVANT')
    .map((r) => r.alert);

  const topRelevance =
    relevanceResults.find((r) => r.isInsideBoundary && r.status !== 'NOT_RELEVANT') || null;

  const handleSelectAlert = (alert: SachetAlert) => {
    setSelectedAlert(alert);
  };

  const handleCheckCustomLocation = (loc: UserLocation) => {
    setUserLocation(loc);
  };

  const handleResetToGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracyMeters: pos.coords.accuracy,
            cityName: 'Current GPS Point',
            timestamp: Date.now(),
            isCustomLookup: false,
          });
        },
        () => {
          setUserLocation(null);
        }
      );
    }
  };

  const handleOpenShare = (alert: SachetAlert, rel?: RelevanceResult) => {
    setShareAlert(alert);
    setShareRelevance(rel || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Mobile Tab Switcher */}
      <div className="flex sm:hidden bg-white p-1 rounded-xl border border-[#DDDDDD]">
        <button
          type="button"
          onClick={() => setMobileTab('india')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'india' ? 'bg-[#0F1B29] text-white shadow-sm' : 'text-[#747F8D]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{translate(language, 'present.allHazards', { count: displayAlerts.length })}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('nearme')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'nearme' ? 'bg-[#0F1B29] text-white shadow-sm' : 'text-[#747F8D]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{translate(language, 'present.nearMe', { count: nearbyAlerts.length })}</span>
        </button>
      </div>

      {/* Top Map: India Live Disaster Map */}
      <div className={`${mobileTab === 'india' ? 'block' : 'hidden sm:block'} space-y-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#0F1B29] animate-pulse" />
            <h2 className="font-bold text-sm sm:text-base text-[#0F1B29]">
              {translate(language, 'present.mapTitle')}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECF8F8] text-[#0F1B29] font-mono font-medium border border-[#DDDDDD]">
              {translate(language, 'present.activeHazards', { count: displayAlerts.length })}
            </span>
          </div>
        </div>

        {isLoading ? (
          <IndiaMapSkeleton />
        ) : (
          <div className="space-y-3">
            <IndiaLiveMap
              alerts={displayAlerts}
              selectedAlertId={selectedAlert?.id || null}
              onSelectAlert={handleSelectAlert}
              userCoordinates={userLocation ? [userLocation.lat, userLocation.lng] : undefined}
              language={language}
            />

            {!userLocation && (
              <div className="rounded-2xl bg-white border border-dashed border-[#DDDDDD] px-4 py-3 shadow-sm flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#0F1B29] shrink-0" />
                <p className="text-xs text-[#747F8D] leading-relaxed">
                  {translate(language, 'present.locationOptional')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Dual-Panel Layout: Location Intelligence + User Location Map */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${mobileTab === 'nearme' ? 'block' : 'hidden sm:grid'}`}>
        {/* Bottom Left: Location Intelligence Panel */}
        <div className="lg:col-span-6 space-y-4">
          {isLoading ? (
            <LocationSkeleton />
          ) : (
            <LocationIntelligencePanel
              userLocation={userLocation}
              relevanceResults={relevanceResults}
              selectedAlert={selectedAlert}
              onSelectAlert={handleSelectAlert}
              onCheckCustomLocation={handleCheckCustomLocation}
              onResetToGPS={handleResetToGPS}
              onOpenShareModal={(a, r) => handleOpenShare(a, r)}
              language={language}
            />
          )}
        </div>

        {/* Bottom Right: User Proximity Map */}
        <div className="lg:col-span-6 space-y-4">
          {isLoading ? (
            <UserMapSkeleton />
          ) : (
            <UserLocationMap
              alerts={displayAlerts}
              nearbyAlerts={nearbyAlerts}
              userLocation={userLocation}
              selectedAlertId={selectedAlert?.id || null}
              onSelectAlert={handleSelectAlert}
              language={language}
            />
          )}
        </div>
      </div>

      {/* Non-blocking Realtime Warning Toast */}
      <RealtimeWarningToast
        topRelevance={topRelevance}
        onViewDetails={handleSelectAlert}
        onShare={(a, r) => handleOpenShare(a, r)}
        language={language}
      />

      {/* Slide-over Alert Details Drawer */}
      {selectedAlert && (
        <AlertDetailDrawer
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onShare={(a) => handleOpenShare(a)}
          language={language}
        />
      )}

      {/* Share Modal */}
      {shareAlert && (
        <ShareModal
          alert={shareAlert}
          relevanceResult={shareRelevance}
          onClose={() => {
            setShareAlert(null);
            setShareRelevance(null);
          }}
          language={language}
        />
      )}
    </div>
  );
};



--- SIH-2026/frontend/src/components/present/RealtimeWarningToast.tsx ---

import React, { useEffect, useState } from 'react';
import { RelevanceResult, SachetAlert } from '../../types/disaster';
import { ShieldAlert, X, Share2, ArrowRight, BellRing } from 'lucide-react';
import { getTranslation } from '../../types/language';

interface RealtimeWarningToastProps {
  topRelevance: RelevanceResult | null;
  onViewDetails: (alert: SachetAlert) => void;
  onShare: (alert: SachetAlert, rel: RelevanceResult) => void;
  language: string;
}

export const RealtimeWarningToast: React.FC<RealtimeWarningToastProps> = ({
  topRelevance,
  onViewDetails,
  onShare,
  language,
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const t = getTranslation(language);

  // Re-open if a new critical alert appears
  useEffect(() => {
    if (topRelevance && topRelevance.alert.id !== dismissedId) {
      setIsDismissed(false);
    }
  }, [topRelevance?.alert.id, dismissedId]);

  if (!topRelevance || isDismissed) return null;
  if (!topRelevance.isInsideBoundary) return null;
  if (topRelevance.status !== 'CRITICAL' && topRelevance.status !== 'HIGH_PRIORITY') return null;

  const alert = topRelevance.alert;

  const handleDismiss = () => {
    setIsDismissed(true);
    setDismissedId(alert.id);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-md w-[calc(100vw-40px)] sm:w-96 rounded-2xl bg-white border border-rose-200 shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-300 ring-1 ring-rose-100">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block font-mono">
              OFFICIAL EMERGENCY WARNING
            </span>
            <h4 className="font-bold text-sm text-slate-900 leading-tight truncate max-w-[200px]">
              {alert.event}
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Dismiss Toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Proximity & Why it matters */}
      <div className="my-2.5 space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-800">{alert.areaDesc}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            {topRelevance.distanceKm === 0 ? 'Inside Polygon' : `${topRelevance.distanceKm} km away`}
          </span>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {topRelevance.plainSummary}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onViewDetails(alert)}
          className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <span>{t.viewDetails}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onShare(alert, topRelevance)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          title="Share Warning"
        >
          <Share2 className="w-4 h-4 text-indigo-600" />
        </button>
      </div>
    </div>
  );
};



--- SIH-2026/frontend/src/components/present/ShareModal.tsx ---

import React, { useState } from 'react';
import { SachetAlert, RelevanceResult } from '../../types/disaster';
import { X, Check, Copy, Share2, MessageCircle, AlertTriangle } from 'lucide-react';
import { getTranslation } from '../../types/language';

interface ShareModalProps {
  alert: SachetAlert | null;
  relevanceResult?: RelevanceResult | null;
  onClose: () => void;
  language: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  alert,
  relevanceResult,
  onClose,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const t = getTranslation(language);

  if (!alert) return null;

  const shareText = `OFFICIAL DISASTER ALERT (${alert.severity.toUpperCase()})
Event: ${alert.event}
Area: ${alert.areaDesc}
${relevanceResult && relevanceResult.distanceKm !== undefined ? `Proximity: ${relevanceResult.distanceKm === 0 ? 'INSIDE ZONE' : `${relevanceResult.distanceKm} km away`}\n` : ''}
OFFICIAL INSTRUCTIONS:
${alert.instruction}

Valid Until: ${new Date(alert.expires).toLocaleString()}
Issued by: ${alert.sender}
Verified via Disaster Intelligence Platform India`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ALERT: ${alert.event}`,
          text: shareText,
        });
      } catch (err) {
        // Share cancelled or unavailable
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">{t.share} Official Alert</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Body Preview */}
        <div className="p-5 space-y-4">
          <div className="text-xs text-slate-500">
            Share this official verification with family, community groups, or emergency contacts:
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-line max-h-56 overflow-y-auto leading-relaxed select-all">
            {shareText}
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Native Share</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text to Clipboard'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};



--- SIH-2026/frontend/src/components/present/UserLocationMap.tsx ---

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { SachetAlert, UserLocation } from '../../types/disaster';
import { getCategoryIconSvg, resolveAlertMapPoint } from './IndiaLiveMap';
import { Locate } from 'lucide-react';
import { translate } from '../../types/language';

interface UserLocationMapProps {
  alerts: SachetAlert[];
  nearbyAlerts: SachetAlert[];
  userLocation: UserLocation | null;
  selectedAlertId: string | null;
  onSelectAlert: (alert: SachetAlert) => void;
  language: string;
}

export const UserLocationMap: React.FC<UserLocationMapProps> = ({
  alerts,
  nearbyAlerts,
  userLocation,
  selectedAlertId,
  onSelectAlert,
  language,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const onSelectAlertRef = useRef(onSelectAlert);
  const hasUserInteractedRef = useRef(false);
  const hasInitializedViewRef = useRef(false);
  const activeSelectionRef = useRef<string | null>(null);

  useEffect(() => {
    onSelectAlertRef.current = onSelectAlert;
  }, [onSelectAlert]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: userLocation ? [userLocation.lat, userLocation.lng] : [21.5, 82.0],
        zoom: userLocation ? 11 : 5,
        zoomControl: false,
      });

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 19,
        }
      ).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      map.on('movestart zoomstart dragstart', () => {
        hasUserInteractedRef.current = true;
      });

      window.setTimeout(() => {
        map.invalidateSize();
        if (userLocation) {
          map.setView([userLocation.lat, userLocation.lng], 11, { animate: false });
        }
      }, 0);
    } else {
      if (userLocation) {
        mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 11, { animate: false });
        hasInitializedViewRef.current = true;
      }
    }

    if (mapContainerRef.current && !resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        window.requestAnimationFrame(() => {
          mapInstanceRef.current?.invalidateSize();
        });
      });
      resizeObserverRef.current.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const allAlerts = alerts.length > 0 ? alerts : nearbyAlerts;
    const fitPoints: [number, number][] = [];
    const selectedAlert = selectedAlertId ? allAlerts.find((alert) => alert.id === selectedAlertId) : null;

    if (userLocation) {
      const userIconHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-7 h-7 rounded-full bg-indigo-500/20 animate-ping"></div>
          <div class="w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-200 shadow-xl"></div>
        </div>
      `;
      const userIcon = L.divIcon({
        html: userIconHtml,
        className: 'user-pin-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 2000 })
        .bindPopup(`<strong>${translate(language, 'present.yourLocation')}</strong><br/>${userLocation.cityName || 'Coordinates'}<br/>${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`)
        .addTo(layerGroup);
      fitPoints.push([userLocation.lat, userLocation.lng]);
    }

    // 2. Nearby alert polygons and markers
    allAlerts.forEach((alert, index) => {
      const isSelected = alert.id === selectedAlertId;
      const isNearby = nearbyAlerts.some((item) => item.id === alert.id);
      const strokeColor = isSelected ? '#4f46e5' : isNearby ? '#e11d48' : '#f59e0b';

      if (alert.polygon && alert.polygon.coordinates && alert.polygon.coordinates.length >= 3) {
        const polygon = L.polygon(alert.polygon.coordinates, {
          color: strokeColor,
          weight: 3,
          fillColor: '#f43f5e',
          fillOpacity: 0.25,
          smoothFactor: 1,
        });
        polygon.on('click', () => onSelectAlertRef.current(alert));
        polygon.addTo(layerGroup);
      }

      if (alert.circle && alert.circle.center) {
        L.circle(alert.circle.center, {
          radius: (alert.circle.radiusKm || 25) * 1000,
          color: strokeColor,
          fillColor: '#f43f5e',
          fillOpacity: 0.2,
        }).addTo(layerGroup);
      }

      const markerPos = resolveAlertMapPoint(alert, index);

      if (markerPos) {
        fitPoints.push(markerPos);
        const iconHtml = `
          <div class="cursor-pointer flex flex-col items-center">
            <div class="w-7 h-7 rounded-2xl bg-white border border-slate-200 ring-2 ${isNearby ? 'ring-rose-200' : 'ring-amber-200'} flex items-center justify-center shadow-md">
              ${getCategoryIconSvg(alert.category, alert.severity)}
            </div>
          </div>
        `;
        const marker = L.marker(markerPos, {
          icon: L.divIcon({ html: iconHtml, className: 'near-disaster-marker', iconSize: [30, 30], iconAnchor: [15, 15] }),
        });
        marker.on('click', () => onSelectAlertRef.current(alert));
        marker.addTo(layerGroup);

        if (userLocation && isNearby) {
          // Draw dotted proximity line to user for nearby hazards only
          L.polyline([[userLocation.lat, userLocation.lng], markerPos], {
            color: '#6366f1',
            weight: 2,
            dashArray: '5, 8',
            opacity: 0.8,
          }).addTo(layerGroup);
        }
      }
    });

    const selectedPoint = selectedAlert ? resolveAlertMapPoint(selectedAlert, allAlerts.indexOf(selectedAlert)) : null;
    const selectionChanged = activeSelectionRef.current !== selectedAlertId;
    activeSelectionRef.current = selectedAlertId;

    if (userLocation && (!hasInitializedViewRef.current || selectionChanged)) {
      map.setView([userLocation.lat, userLocation.lng], 11, { animate: false });
      hasInitializedViewRef.current = true;
    } else if (selectedPoint && !hasUserInteractedRef.current) {
      map.setView(selectedPoint, 10, { animate: false });
      hasInitializedViewRef.current = true;
    } else if (fitPoints.length > 0 && (!hasInitializedViewRef.current || selectionChanged) && !hasUserInteractedRef.current) {
      const bounds = L.latLngBounds(fitPoints.map((pos) => L.latLng(pos[0], pos[1])));
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.12), { padding: [28, 28], maxZoom: 10, animate: false });
        hasInitializedViewRef.current = true;
      }
    }
  }, [alerts, nearbyAlerts, userLocation, selectedAlertId, language]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 10, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Actions */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleRecenter}
          disabled={!userLocation}
          className="p-2 rounded-xl bg-white/95 text-indigo-600 hover:text-indigo-800 border border-slate-200 shadow-md backdrop-blur-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title={translate(language, 'present.centerLocation')}
        >
          <Locate className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200 text-[11px] text-slate-700 backdrop-blur-md flex items-center gap-2 shadow-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-indigo-200"></span>
        <span className="font-medium">
          {userLocation
            ? `${translate(language, userLocation.isCustomLookup ? 'present.monitoredLocation' : 'present.liveGps')} (${userLocation.cityName || `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}`})`
            : translate(language, 'present.indiaOverview', { count: alerts.length || nearbyAlerts.length })}
        </span>
      </div>
    </div>
  );
};



--- SIH-2026/frontend/src/components/past/AIAssistantDrawer.tsx ---

import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
  Send,
  Activity,
  AlertCircle,
} from 'lucide-react';
import type { CitedSource, EvidenceBundle } from '../../types/disaster';
import { INDIAN_LANGUAGES, getTranslation, translate } from '../../types/language';
import { AudioRecorderButton } from '../common/AudioRecorderButton';
import { ChatSkeleton } from '../common/Skeletons';
import { apiUrl } from '../../lib/api';
import { translateText, translatePreservingCitations } from '../../lib/googleTranslate';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  associatedBundle?: EvidenceBundle | null;
  language: string;
  onLanguageChange?: (lang: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  metadata?: {
    custom?: {
      sources?: CitedSource[];
      speechText?: string;
    };
  };
}

type EnglishHistory = Array<{ role: 'user' | 'assistant'; content: string }>;

function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[S\d+\]/gi, ' ')
    .replace(/[*_`>#-]+/g, ' ')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  associatedBundle,
  language,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputLanguage, setInputLanguage] = useState(language);
  const [isAssistantRunning, setIsAssistantRunning] = useState(false);
  const [runningStageIndex, setRunningStageIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackTokenRef = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatViewportRef = useRef<HTMLDivElement | null>(null);
  const englishHistoryRef = useRef<EnglishHistory>([]);

  const t = getTranslation(language);
  const activeLangObj = INDIAN_LANGUAGES.find((item) => item.code === language) || INDIAN_LANGUAGES[0];

  const welcomeMessage = useMemo<ChatMessage>(() => ({
    role: 'assistant',
    id: 'm-welcome',
    createdAt: new Date(),
    content: associatedBundle
      ? `Hello! I am your Multilingual Disaster Intelligence Assistant. I am grounded in evidence for **${associatedBundle.eventName}**. You can type or speak in **${activeLangObj.name} (${activeLangObj.nativeName})** or English.`
      : `Hello! I am your Multilingual Disaster Intelligence Research Assistant. Ask me about Indian historical cyclones, floods, earthquakes, evacuation logistics, or casualty statistics. You can speak in **${activeLangObj.name} (${activeLangObj.nativeName})** or English.`,
    metadata: { custom: { sources: [], speechText: '' } },
  }), [associatedBundle, activeLangObj.name, activeLangObj.nativeName]);

  // Set welcome message on initialization
  useEffect(() => {
    setMessages((current) => current.length === 0 || current.every((message) => message.id === 'm-welcome') ? [welcomeMessage] : current);
  }, [messages.length, welcomeMessage]);

  // Auto-scroll chat history viewport to the bottom on new message or when generating status is running
  useEffect(() => {
    if (chatViewportRef.current) {
      chatViewportRef.current.scrollTop = chatViewportRef.current.scrollHeight;
    }
  }, [messages, isAssistantRunning]);

  const runningStages = ['Understanding question...', 'Searching evidence...', 'Reconciling sources...', 'Generating answer...'];

  // Rotate pipeline stages
  useEffect(() => {
    if (!isAssistantRunning) {
      setRunningStageIndex(0);
      return;
    }
    const interval = window.setInterval(() => {
      setRunningStageIndex((idx) => Math.min(idx + 1, runningStages.length - 1));
    }, 1400);
    return () => window.clearInterval(interval);
  }, [isAssistantRunning, runningStages.length]);

  const stopAudioPlayback = () => {
    playbackTokenRef.current += 1;
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  const playTTS = async (text: string) => {
    const cleanText = stripMarkdownForSpeech(text);
    if (!cleanText) return;
    if (isPlayingAudio) {
      stopAudioPlayback();
      return;
    }
    const token = ++playbackTokenRef.current;
    setIsPlayingAudio(true);
    try {
      const response = await fetch(apiUrl('/api/tts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voiceName: 'Kore' }),
      });
      const data = await response.json().catch(() => null);
      if (token !== playbackTokenRef.current) return;
      if (data?.audioBase64) {
        const audio = audioRef.current || new Audio();
        audioRef.current = audio;
        audio.src = `data:audio/mp3;base64,${data.audioBase64}`;
        audio.onended = () => token === playbackTokenRef.current && setIsPlayingAudio(false);
        audio.onerror = () => token === playbackTokenRef.current && setIsPlayingAudio(false);
        await audio.play();
      } else if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === 'en' ? 'en-IN' : `${language}-IN`;
        utterance.onend = () => token === playbackTokenRef.current && setIsPlayingAudio(false);
        utterance.onerror = () => token === playbackTokenRef.current && setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    } catch {
      if (token === playbackTokenRef.current) setIsPlayingAudio(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isAssistantRunning) return;

    const userMessage: ChatMessage = {
      role: 'user',
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setTranscript('');
    setIsAssistantRunning(true);
    setRunningStageIndex(0);

    try {
      const activeInputLang = inputLanguage || language;
      const englishMessage = activeInputLang === 'en' ? text : await translateText(text, 'en', activeInputLang);

      const response = await fetch(apiUrl('/api/past/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: englishMessage,
          history: englishHistoryRef.current,
          targetLanguage: activeInputLang,
          associatedBundle,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.details || data?.error || 'AI Assistant query failed');

      const englishReply = String(data?.reply || 'The assistant could not find a grounded answer.');
      englishHistoryRef.current = [...englishHistoryRef.current, { role: 'user', content: englishMessage }, { role: 'assistant', content: englishReply }];

      const reply = language === 'en' ? englishReply : await translatePreservingCitations(englishReply, language);
      const sources = Array.isArray(data?.sources) ? data.sources as CitedSource[] : [];

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          id: `assistant-${Date.now()}`,
          createdAt: new Date(),
          content: reply,
          metadata: { custom: { sources, speechText: '' } },
        },
      ]);
    } catch (error) {
      const reply = error instanceof Error ? error.message : 'The assistant could not complete that request.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          id: `assistant-error-${Date.now()}`,
          createdAt: new Date(),
          content: reply,
          metadata: { custom: { sources: [], speechText: '' } },
        },
      ]);
    } finally {
      setIsAssistantRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-white border-l border-[#DDDDDD] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      <audio ref={audioRef} className="hidden" />
      
      {/* Header Panel */}
      <div className="p-4 sm:p-5 border-b border-[#DDDDDD] flex items-center justify-between bg-[#ECF8F8]/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0F1B29] flex items-center justify-center text-white font-bold shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#0F1B29] flex items-center gap-1.5">
              <span>{t.voiceAssistantTitle}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD] font-semibold notranslate" translate="no">{activeLangObj.name}</span>
            </h3>
            <p className="text-[11px] text-[#747F8D]">{translate(language, 'assistant.grounded')}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="p-1.5 rounded-xl text-[#747F8D] hover:text-[#0F1B29] hover:bg-[#ECF8F8] transition-colors cursor-pointer" aria-label={translate(language, 'common.close')}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Log Viewport */}
      <div ref={chatViewportRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';
          const sources = Array.isArray(message.metadata?.custom?.sources) ? message.metadata.custom.sources as CitedSource[] : [];
          const messageSpeechText = message.content;
          const speechText = message.metadata?.custom?.speechText || '';

          return (
            <div key={message.id} className={`flex gap-3 items-start ${isAssistant ? '' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isAssistant ? 'bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD]' : 'bg-[#0F1B29] text-white'}`}>
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`space-y-1.5 max-w-[86%] ${isAssistant ? 'text-left' : 'text-right'}`}>
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${isAssistant ? 'bg-white border border-[#DDDDDD] rounded-tl-none text-[#0F1B29]' : 'bg-[#0F1B29] text-white rounded-tr-none shadow-sm'}`}>
                  {isAssistant ? (
                    <div className="prose prose-sm max-w-none text-slate-800 prose-headings:text-slate-900 prose-a:text-indigo-700 prose-code:text-slate-900 prose-table:text-xs prose-th:bg-slate-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-th:border prose-table:border-collapse">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{messageSpeechText}</ReactMarkdown>
                    </div>
                  ) : (
                    <div>{messageSpeechText}</div>
                  )}
                </div>
                {isAssistant && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => playTTS(speechText || messageSpeechText)}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-xl border transition-colors ${isPlayingAudio ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-[#0F1B29] bg-white border-[#DDDDDD] hover:bg-[#ECF8F8] cursor-pointer'}`}
                    >
                      {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isPlayingAudio ? translate(language, 'common.stop') : translate(language, 'common.listen')}</span>
                    </button>
                    {sources.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                        <span>{translate(language, 'common.sources')}:</span>
                        {sources.map((source) => (
                          <a key={source.id} href={source.url} target="_blank" rel="noreferrer noopener" title={source.title} className="px-1.5 py-0.5 rounded bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD] hover:bg-[#DDDDDD]/60">
                            [{source.id}]
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loader: Thinking indicator rendering dynamically while request is in flight */}
        {isAssistantRunning && (
          <div className="flex gap-3 items-start animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD] animate-pulse">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="space-y-2 max-w-[86%] text-left">
              <div className="space-y-2 rounded-2xl border border-[#DDDDDD] bg-[#ECF8F8]/60 p-3.5 w-72 sm:w-80 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F1B29] px-1 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#747F8D]" />
                  <span>{runningStages[runningStageIndex] || translate(language, 'assistant.pipeline')}</span>
                </div>
                <ChatSkeleton />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer Input Controls */}
      <div className="p-3 sm:p-4 border-t border-[#DDDDDD] bg-[#ECF8F8]/40 space-y-2">
        {transcript && <div className="text-[11px] text-[#747F8D] px-2">Transcript ready: <span className="font-medium text-[#0F1B29]">{transcript}</span></div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex items-end gap-2"
        >
          <AudioRecorderButton
            language={language}
            targetLanguage={language}
            onTranscribed={(text, metadata) => {
              setTranscript(text);
              setInputLanguage(metadata?.detectedLanguage || language);
              setInputValue(text);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            tooltip={translate(language, 'assistant.record')}
            className="p-2 shrink-0 bg-white border border-[#DDDDDD] hover:bg-[#ECF8F8] rounded-xl cursor-pointer"
          />
          <textarea
            ref={inputRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            placeholder={translate(language, 'assistant.placeholder', { language: activeLangObj.name })}
            className="min-h-10 max-h-28 flex-1 resize-none px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-[#DDDDDD] text-[#0F1B29] placeholder:text-slate-400 focus:outline-none focus:border-[#747F8D] focus:ring-2 focus:ring-[#DDDDDD]/40 shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isAssistantRunning}
            className="p-2.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 disabled:opacity-50 text-white shadow-sm cursor-pointer shrink-0"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantDrawer;


--- SIH-2026/frontend/src/components/past/CompareModal.tsx ---

import React, { useEffect, useState } from 'react';
import { ComparisonMatrix, EvidenceBundle } from '../../types/disaster';
import { X, Scale, Sparkles, Check, ExternalLink, ShieldAlert, ArrowRight } from 'lucide-react';
import { getTranslation } from '../../types/language';
import { apiUrl } from '../../lib/api';
import { translateComparison } from '../../lib/googleTranslate';
import { formatDisasterDate } from '../../lib/dateFormat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function formatMarkdownPoints(text: string | undefined | null): string {
  if (!text) return '';
  let formatted = text.trim();
  if (formatted.startsWith('•')) {
    formatted = '- ' + formatted.slice(1);
  }
  formatted = formatted.replace(/\s*[•●]\s*/g, '\n\n- ');
  formatted = formatted.replace(/\s+(\d+)\.\s+/g, '\n\n$1. ');
  return formatted;
}

const markdownComponents = {
  ul: ({ ...props }: any) => <ul className="list-disc pl-4 my-1.5 space-y-1 text-slate-700" {...props} />,
  ol: ({ ...props }: any) => <ol className="list-decimal pl-4 my-1.5 space-y-1 text-slate-700" {...props} />,
  li: ({ ...props }: any) => <li className="text-slate-700 leading-relaxed text-xs" {...props} />,
  p: ({ ...props }: any) => <p className="my-1 leading-relaxed text-xs text-slate-700" {...props} />,
};

interface CompareModalProps {
  bundles: EvidenceBundle[];
  onClose: () => void;
  language: string;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  bundles,
  onClose,
  language,
}) => {
  const [comparisonData, setComparisonData] = useState<ComparisonMatrix | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const t = getTranslation(language);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(apiUrl('/api/past/compare'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bundles, targetLanguage: 'en' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          void translateComparison(data as ComparisonMatrix, language).then((localized) => {
            if (!isMounted) return;
            setComparisonData(localized);
          });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Comparison error:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bundles, language]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl max-h-[90vh] shadow-2xl flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Comparative Analysis: {bundles.map((b) => b.eventName).join(' vs ')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500">Reconciling comparative metrics across retrieved evidence...</p>
            </div>
          ) : comparisonData ? (
            <div className="space-y-6">
              {/* AI Comparative Insights */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Comparative Intelligence Synthesis</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Citation tags like [S1] and [S2] correspond to the source references listed below each event.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900">Scale of Impact:</h5>
                    <div className="prose prose-xs text-slate-700 leading-relaxed max-w-none prose-headings:text-slate-900 prose-a:text-indigo-700 prose-code:text-slate-900">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{formatMarkdownPoints(comparisonData.aiSynthesis?.broaderImpact)}</ReactMarkdown>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900">Response Disparities:</h5>
                    <div className="prose prose-xs text-slate-700 leading-relaxed max-w-none prose-headings:text-slate-900 prose-a:text-indigo-700 prose-code:text-slate-900">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{formatMarkdownPoints(comparisonData.aiSynthesis?.responseDifferences)}</ReactMarkdown>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900">Institutional Lessons:</h5>
                    <div className="prose prose-xs text-slate-700 leading-relaxed max-w-none prose-headings:text-slate-900 prose-a:text-indigo-700 prose-code:text-slate-900">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{formatMarkdownPoints(comparisonData.aiSynthesis?.crossEventLessons)}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side-by-side Table Matrix */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3.5 font-bold text-slate-500 uppercase tracking-wider w-1/4">Comparison Dimension</th>
                      {bundles.map((bundle) => (
                        <th key={bundle.id} className="p-3.5 font-bold text-slate-900">
                          <div>{bundle.eventName}</div>
                          <span className="text-[10px] text-slate-500 font-normal">{bundle.eventDate ? formatDisasterDate(bundle.eventDate) : bundle.dateRange}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {comparisonData.comparisonPoints?.map((point, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="p-3.5 font-bold text-slate-800 bg-slate-50/50 align-top">
                          <div>{point.label}</div>
                          <span className="text-[10px] font-mono text-indigo-600 font-medium">{point.category}</span>
                        </td>
                        {point.values?.map((v, vIdx) => (
                          <td key={vIdx} className="p-3.5 text-slate-700 align-top leading-relaxed">
                            <div className="prose prose-xs max-w-none text-slate-700 leading-relaxed prose-headings:text-slate-900 prose-a:text-indigo-700">
                              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{formatMarkdownPoints(v.value)}</ReactMarkdown>
                            </div>
                            {v.citations?.length > 0 && (
                              <span className="mt-1 block text-[10px] font-mono font-bold text-indigo-600">
                                [{v.citations.join(', ')}]
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {bundles.map((bundle) => (
                  <div key={`sources-${bundle.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{bundle.eventName}</h4>
                        <p className="text-[11px] text-slate-500">{bundle.eventDate ? formatDisasterDate(bundle.eventDate) : bundle.dateRange}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold font-mono">
                        {bundle.sources.length} Sources
                      </span>
                    </div>

                    <div className="space-y-2">
                      {bundle.sources.map((source) => (
                        <a
                          key={source.id}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="block p-3 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200 shrink-0">
                                  [{source.id}]
                                </span>
                                <span className="font-semibold text-sm text-slate-900 truncate">{source.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1">
                                {source.publisher} • {formatDisasterDate(source.publishedAt)}
                              </p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              Unable to load comparison data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



--- SIH-2026/frontend/src/components/past/EventDetailView.tsx ---

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EvidenceBundle, CitedSource } from '../../types/disaster';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ShieldAlert,
  Users,
  Building,
  Coins,
  Truck,
  HeartHandshake,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Volume2,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  FileCheck,
  VolumeX,
} from 'lucide-react';
import { getTranslation } from '../../types/language';
import { useTranslateBatch } from '../../hooks/useTranslateBatch';
import { translateEvidenceBundle } from '../../lib/googleTranslate';
import { formatDisasterDate } from '../../lib/dateFormat';

interface EventDetailViewProps {
  bundle: EvidenceBundle;
  onBack: () => void;
  onOpenChatWithEvent: (bundle: EvidenceBundle) => void;
  onPlayTTS: (text: string) => void;
  language: string;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  bundle: sourceBundle,
  onBack,
  onOpenChatWithEvent,
  onPlayTTS,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const t = getTranslation(language);
  const translatableFields = useMemo(() => ({
    eventName: sourceBundle.eventName,
    location: sourceBundle.location,
    state: sourceBundle.state,
    whatHappened: sourceBundle.whatHappened,
    affectedAreas: sourceBundle.affectedAreas,
    humanImpact: sourceBundle.humanImpact,
    infrastructureDamage: sourceBundle.infrastructureDamage,
    economicImpact: sourceBundle.economicImpact,
    governmentResponse: sourceBundle.governmentResponse,
    rescueRelief: sourceBundle.rescueRelief,
    recovery: sourceBundle.recovery,
    sourceAssessment: sourceBundle.sourceAssessment,
    reportedCasualties: sourceBundle.reportedCasualties,
    reportedDamage: sourceBundle.reportedDamage,
  }), [sourceBundle]);
  const { result: translatedFields } = useTranslateBatch(translatableFields, language);
  const [translatedBundle, setTranslatedBundle] = useState<EvidenceBundle | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (language === 'en') {
      setTranslatedBundle(sourceBundle);
      return () => { cancelled = true; };
    }
    void translateEvidenceBundle(sourceBundle, language).then((value) => {
      if (!cancelled) setTranslatedBundle(value);
    });
    return () => { cancelled = true; };
  }, [sourceBundle, language]);

  const bundle: EvidenceBundle = translatedBundle
    ? { ...translatedBundle, ...(translatedFields || {}) }
    : { ...sourceBundle, ...(translatedFields || {}) };

  const isMeaningfulText = (text?: string | null) => {
    if (!text) return false;
    const normalized = text.replace(/&nbsp;/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!normalized) return false;
    const placeholders = [
      'information unavailable',
      'no information available',
      'details were not clearly quantified',
      'details were referenced',
      'were referenced in the retrieved source coverage',
      'were summarized in the retrieved source coverage',
      'no clear casualty details',
      'no casualty details',
      'no damage details',
      'no recovery details',
      'were not clearly quantified',
      'coverage indicates',
      'not available',
    ];
    if (/^\s*(?:\[(?:S\d+)\]\s*)+$/i.test(normalized)) return false;
    return !placeholders.some((phrase) => normalized.includes(phrase));
  };

  const handleCopySummary = async () => {
    const text = `${bundle.eventName} (${bundle.disasterType})\nLocation: ${bundle.location}, ${bundle.state}\nPeriod: ${bundle.dateRange}\n\nSUMMARY:\n${bundle.whatHappened}\n\nHUMAN IMPACT:\n${bundle.humanImpact}\n\nDAMAGE:\n${bundle.infrastructureDamage}\n\nGOVERNMENT RESPONSE:\n${bundle.governmentResponse}\n\nSOURCES:\n${bundle.sources.map((s) => `[${s.id}] ${s.title} (${s.publisher})`).join('\n')}\n\nSynthesized by Disaster Intelligence Platform India`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  const buildSpeechText = () =>
    [
      bundle.eventName,
      bundle.dateRange,
      isMeaningfulText(bundle.whatHappened) ? bundle.whatHappened : '',
      isMeaningfulText(bundle.affectedAreas) ? bundle.affectedAreas : '',
      isMeaningfulText(bundle.humanImpact) ? bundle.humanImpact : '',
      isMeaningfulText(bundle.infrastructureDamage) ? bundle.infrastructureDamage : '',
      isMeaningfulText(bundle.economicImpact) ? bundle.economicImpact : '',
      isMeaningfulText(bundle.governmentResponse) ? bundle.governmentResponse : '',
      isMeaningfulText(bundle.rescueRelief) ? bundle.rescueRelief : '',
      isMeaningfulText(bundle.recovery) ? bundle.recovery : '',
    ]
      .filter(Boolean)
      .join('. ')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\[(S\d+)\]/gi, ' ')
      .replace(/[*_`>#-]+/g, ' ')
      .replace(/\r?\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking || window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
        setIsSpeaking(false);
        return;
      }

      const speechText = buildSpeechText();
      if (!speechText) return;

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = language === 'en' ? 'en-IN' : `${language}-IN`;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
      return;
    }

    onPlayTTS(buildSpeechText());
  };

  const hasSourceAssessment = isMeaningfulText(bundle.sourceAssessment);
  const meaningfulTimeline = (bundle.timeline || []).filter((step) =>
    isMeaningfulText(step.description) &&
    !/published|article|source headline/i.test(`${step.event} ${step.description}`.toLowerCase()),
  );
  const keyMetrics = [
    isMeaningfulText(bundle.reportedCasualties)
      ? { label: 'Reported Casualties', value: bundle.reportedCasualties, icon: Users, color: 'text-rose-600' }
      : null,
    isMeaningfulText(bundle.reportedDamage)
      ? { label: 'Damage / Loss', value: bundle.reportedDamage, icon: Building, color: 'text-amber-600' }
      : null,
    isMeaningfulText(bundle.affectedAreas)
      ? { label: 'Areas Affected', value: bundle.affectedAreas, icon: MapPin, color: 'text-indigo-600' }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; icon: React.FC<{ className?: string }>; color: string }>;
  const meaningfulConflicts = (bundle.conflictingReports || []).filter((conflict) =>
    isMeaningfulText(conflict.topic) && isMeaningfulText(conflict.details),
  );
  const hasConflicts = meaningfulConflicts.length > 0;

  // Render text with clickable citation badges [S1], [S2]
  const renderWithCitations = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[S\d+\])/g);

    return (
      <span>
        {parts.map((part, idx) => {
          const match = part.match(/\[(S\d+)\]/);
          if (match) {
            const sourceId = match[1];
            const source = bundle.sources.find((s) => s.id === sourceId);
            return (
              <a
                key={idx}
                href={source?.url || `#source-${sourceId}`}
                target={source?.url ? '_blank' : '_self'}
                rel="noreferrer noopener"
                className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
                title={source ? `${source.title} (${source.publisher})` : `Source ${sourceId}`}
              >
                {part}
              </a>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Historical Research</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSpeech}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-xs font-semibold text-indigo-600 transition-colors"
            title={isSpeaking ? 'Stop reading' : 'Listen to synthesized speech'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? 'Stop' : 'Listen Audio'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            type="button"
          onClick={() => onOpenChatWithEvent(sourceBundle)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.askAIAssistant}</span>
          </button>
        </div>
      </div>

      {/* Hero Event Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold font-mono uppercase">
            {bundle.disasterType}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-mono font-medium">
            {bundle.evidenceStatus}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>Synthesized: {formatDisasterDate(bundle.synthesizedAt)}</span>
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {bundle.eventName}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>{bundle.location}, {bundle.state}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{bundle.eventDate ? formatDisasterDate(bundle.eventDate) : bundle.dateRange}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>{bundle.sources.length} Grounded Media Sources</span>
          </div>
        </div>
      </div>

      {/* 12 Detailed Evidence Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {keyMetrics.length > 0 && (
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {keyMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-500">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    <span>{metric.label}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">{renderWithCitations(metric.value)}</p>
                </div>
              );
            })}
          </div>
        )}

        {isMeaningfulText(bundle.whatHappened) && (
          <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <span>Event Synthesis & What Happened</span>
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {renderWithCitations(bundle.whatHappened)}
            </div>
          </div>
        )}

        {meaningfulTimeline.length > 0 && (
          <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Chronological Incident Timeline</span>
            </h3>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {meaningfulTimeline.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white"></span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">{step.date}</span>
                    <h5 className="font-bold text-xs text-slate-900">{step.event}</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {renderWithCitations(step.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isMeaningfulText(bundle.affectedAreas) && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Affected Geographic Areas</span>
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {renderWithCitations(bundle.affectedAreas)}
            </div>
          </div>
        )}

        {isMeaningfulText(bundle.humanImpact) && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-600" />
              <span>Human Impact & Casualties</span>
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {renderWithCitations(bundle.humanImpact)}
            </div>
          </div>
        )}

        {isMeaningfulText(bundle.infrastructureDamage) && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-600" />
              <span>Infrastructure Damage</span>
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {renderWithCitations(bundle.infrastructureDamage)}
            </div>
          </div>
        )}

        {isMeaningfulText(bundle.economicImpact) && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>Economic Impact</span>
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {renderWithCitations(bundle.economicImpact)}
            </div>
          </div>
        )}

        {isMeaningfulText(bundle.governmentResponse) && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Government & NDRF Response</span>
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {renderWithCitations(bundle.governmentResponse)}
            </div>
          </div>
        )}

        {isMeaningfulText(bundle.rescueRelief) && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-pink-600" />
              <span>Rescue & Relief Operations</span>
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {renderWithCitations(bundle.rescueRelief)}
            </div>
          </div>
        )}

        {isMeaningfulText(bundle.recovery) && (
          <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Rehabilitation & Long-Term Recovery</span>
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {renderWithCitations(bundle.recovery)}
            </div>
          </div>
        )}

        {(hasSourceAssessment || hasConflicts) && (
          <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>Source Assessment & Evidence Verification</span>
            </h3>
            {hasSourceAssessment && (
              <p className="text-xs text-slate-600 leading-relaxed">
                {bundle.sourceAssessment}
              </p>
            )}

            {hasConflicts && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h5 className="font-bold text-xs text-amber-800">Reconciled Conflicting Dispatches:</h5>
                {meaningfulConflicts.map((conflict, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-slate-900">{conflict.topic}</span>
                    <p className="text-slate-600">{renderWithCitations(conflict.details)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 12: Grounded Citations Reference Table */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Retrieved Sources & Attributions ({bundle.sources.length})</span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Citation markers such as [S1] and [S2] refer to the source entries below. Each entry links directly to the original article.
          </p>
          <div className="divide-y divide-slate-100">
            {bundle.sources.map((source) => (
              <div key={source.id} id={`source-${source.id}`} className="py-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-bold text-xs border border-indigo-100">
                      [{source.id}]
                    </span>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">{source.title}</h5>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 font-medium transition-colors"
                  >
                    <span>Original Article</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span className="font-semibold text-slate-700">{source.publisher}</span>
                  <span>Published: {formatDisasterDate(source.publishedAt)}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {source.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



--- SIH-2026/frontend/src/components/past/PastWorkspace.tsx ---

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EvidenceBundle, DisasterCategory } from '../../types/disaster';
import { EventDetailView } from './EventDetailView';
import { CompareModal } from './CompareModal';
import { AIAssistantDrawer } from './AIAssistantDrawer';
import { EventCardSkeleton } from '../common/Skeletons';
import { AudioRecorderButton } from '../common/AudioRecorderButton';
import { HistoricalDisasterItem } from '../../data/historicalDisasters';
import { apiUrl } from '../../lib/api';
import { formatDisasterDate } from '../../lib/dateFormat';
import { translateText } from '../../lib/googleTranslate';
import { useTranslateContent } from '../../hooks/useTranslateContent';
import {
  Search,
  Sparkles,
  Scale,
  X,
  Plus,
  Check,
  ArrowRight,
  ArrowUpDown,
  Calendar,
  Users,
  Building,
  Copy,
  MapPin,
  Layers,
  Flame,
  Waves,
  Mountain,
  Zap,
  Activity,
  History,
  ShieldCheck,
  Printer,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { getTranslation, hazardLabel, translate } from '../../types/language';

interface PastWorkspaceProps {
  language: string;
  isVoiceAssistantOpen?: boolean;
  onCloseVoiceAssistant?: () => void;
  onOpenVoiceAssistant?: () => void;
  onLanguageChange?: (lang: string) => void;
}

export type SortOption = 'oldest' | 'recent' | 'casualties' | 'sources' | 'alphabetical';
export type DecadeFilter = 'all' | '1990s' | '2000s' | '2010s' | '2020s';

const TranslatedText: React.FC<{ text: string; language: string }> = ({ text, language }) => {
  const { translated } = useTranslateContent(text, language);
  return <>{translated}</>;
};

const CATEGORIES: { label: string; value: string; icon: React.FC<{ className?: string }> }[] = [
  { label: 'All Hazards', value: 'all', icon: Layers },
  { label: 'Cyclones', value: 'Cyclone', icon: Activity },
  { label: 'Floods & Deluges', value: 'Flood', icon: Waves },
  { label: 'Earthquakes', value: 'Earthquake', icon: Zap },
  { label: 'Tsunamis', value: 'Tsunami', icon: Waves },
  { label: 'Landslides & Avalanches', value: 'Landslide', icon: Mountain },
  { label: 'Heat & Extreme Weather', value: 'Heat Wave', icon: Flame },
];

const STATES = [
  'All States',
  'Odisha',
  'Kerala',
  'Uttarakhand',
  'Gujarat',
  'West Bengal',
  'Tamil Nadu',
  'Maharashtra',
  'Himachal Pradesh',
  'Bihar',
  'Andhra Pradesh',
  'Assam',
  'Rajasthan',
  'Delhi',
  'Punjab',
];

export const PastWorkspace: React.FC<PastWorkspaceProps> = ({
  language,
  isVoiceAssistantOpen = false,
  onCloseVoiceAssistant,
  onOpenVoiceAssistant,
  onLanguageChange,
}) => {
  const [evidenceBundles, setEvidenceBundles] = useState<HistoricalDisasterItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedDecade, setSelectedDecade] = useState<DecadeFilter>('all');
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'all',
    state: 'All States',
    decade: 'all' as DecadeFilter,
  });
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [isArchiveLoading, setIsArchiveLoading] = useState(true);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<EvidenceBundle | null>(null);
  const [compareList, setCompareList] = useState<EvidenceBundle[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [localVoiceOpen, setLocalVoiceOpen] = useState(false);
  const [activeChatBundle, setActiveChatBundle] = useState<EvidenceBundle | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeLiveQueryRef = useRef('');

  const t = getTranslation(language);

  const deriveYear = (bundle: EvidenceBundle) => {
    if (bundle.eventDate) {
      const year = new Date(bundle.eventDate).getFullYear();
      if (Number.isFinite(year)) return year;
    }
    const match = bundle.dateRange?.match(/\b(19\d\d|20\d\d)\b/)?.[0];
    if (match) return parseInt(match, 10);
    return new Date(bundle.synthesizedAt).getFullYear();
  };

  const deriveCasualtyScore = (bundle: EvidenceBundle) => {
    if (bundle.numericCasualtiesRange) return bundle.numericCasualtiesRange.max;
    const match = bundle.reportedCasualties?.match(/(\d[\d,]*)/);
    if (!match) return 0;
    return parseInt(match[1].replace(/,/g, ''), 10) || 0;
  };

  const isNoLiveSourcesMessage = (message: string | null) =>
    Boolean(message && /no live .*sources/i.test(message));

  const isMeaningfulEvidenceText = (text?: string | null) => {
    if (!text) return false;
    const normalized = text.replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    if (normalized.length < 20) return false;
    return ![
      'information unavailable',
      'details were not clearly quantified',
      'details were referenced',
      'were referenced in the retrieved source coverage',
      'were summarized in the retrieved source coverage',
      'documented in source coverage',
      'documented in cited journalism',
      'not available',
    ].some((phrase) => normalized.includes(phrase));
  };

  useEffect(() => {
    let cancelled = false;

    const loadArchive = async () => {
      setIsArchiveLoading(true);
      setArchiveError(null);

      try {
        const res = await fetch(apiUrl('/api/past/archive'));
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.details || data?.error || 'Failed to load recent archive');
        }

        const items = Array.isArray(data?.items) ? data.items : [];
        if (cancelled) return;

        setEvidenceBundles(items);
      } catch (error) {
        if (!cancelled) {
          setArchiveError((error as Error).message || 'Failed to load recent archive');
        }
      } finally {
        if (!cancelled) {
          setIsArchiveLoading(false);
        }
      }
    };

    void loadArchive();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleApplyFilters = async () => {
    setIsApplyingFilter(true);
    setIsArchiveLoading(true);
    setArchiveError(null);
    setSearchError(null);
    setSelectedBundle(null);
    setSearchQuery('');
    activeLiveQueryRef.current = '';

    const nextFilters = {
      category: selectedCategory,
      state: selectedState,
      decade: selectedDecade,
    };

    try {
      const res = await fetch(apiUrl('/api/past/filter-search'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nextFilters,
          language,
          limit: 100,
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.details || data?.error || 'Failed to apply archive filters');
      }

      setEvidenceBundles(Array.isArray(data?.items) ? data.items : []);
      setAppliedFilters(nextFilters);
    } catch (error) {
      setArchiveError((error as Error).message || 'Failed to apply archive filters');
    } finally {
      setIsApplyingFilter(false);
      setIsArchiveLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setSearchQuery('');
    activeLiveQueryRef.current = '';
    setSelectedCategory('all');
    setSelectedState('All States');
    setSelectedDecade('all');
    setAppliedFilters({ category: 'all', state: 'All States', decade: 'all' });
    setSortOption('recent');
    setSelectedBundle(null);
    setArchiveError(null);
    setIsArchiveLoading(true);

    try {
      const res = await fetch(apiUrl('/api/past/archive'));
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.details || data?.error || 'Failed to reset archive filters');
      }
      setEvidenceBundles(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      setArchiveError((error as Error).message || 'Failed to reset archive filters');
    } finally {
      setIsArchiveLoading(false);
    }
  };

  const handleLiveQuerySearch = async (query: string) => {
    const q = query.trim();
    if (!q) return;

    setIsSearchingLive(true);
    setSearchError(null);
    activeLiveQueryRef.current = q;

    try {
      const englishQuery = language === 'en' ? q : await translateText(q, 'en', language);
      const res = await fetch(apiUrl('/api/past/search'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: englishQuery,
          category: appliedFilters.category === 'all' ? undefined : appliedFilters.category,
          state: appliedFilters.state === 'All States' ? undefined : appliedFilters.state,
          targetLanguage: 'en',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const message = data?.details || data?.error || 'Failed to retrieve live dossier';
        if (/no live .*sources/i.test(message)) {
          setSearchError('No matching sources were found for this query. Try a broader disaster name, district, or state.');
          return;
        }
        throw new Error(message);
      }

      if (data?.noResults || !data?.bundle) {
        setSearchError(data?.details || 'No sufficiently relevant historical evidence was retrieved. Try a broader disaster name, district, or state.');
        return;
      }

      const year = deriveYear(data.bundle);
      const decade: DecadeFilter =
        year < 2000 ? '1990s' : year < 2010 ? '2000s' : year < 2020 ? '2010s' : '2020s';

      const enriched: HistoricalDisasterItem = {
        ...data.bundle,
        year,
        numericCasualties: deriveCasualtyScore(data.bundle),
        decade,
      };

      setEvidenceBundles((prev) => {
        const filtered = prev.filter((item) => item.eventName.toLowerCase() !== enriched.eventName.toLowerCase());
        return [enriched, ...filtered];
      });
      setSelectedBundle(enriched);
    } catch (error) {
      const message = (error as Error).message || 'Search failed';
      setSearchError(
        /no live .*sources/i.test(message)
          ? 'No matching sources were found for this query. Try a broader disaster name, district, or state.'
          : message
      );
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handlePlayTTS = async (text: string) => {
    const cleanText = text
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\[(S\d+)\]/gi, ' ')
      .replace(/[*_`>#-]+/g, ' ')
      .replace(/\r?\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    try {
      const res = await fetch(apiUrl('/api/tts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voiceName: 'Kore' }),
      });

      const data = await res.json().catch(() => null);
      if (data?.audioBase64) {
        const audio = audioRef.current || new Audio();
        audioRef.current = audio;
        audio.src = `data:audio/mp3;base64,${data.audioBase64}`;
        await audio.play();
        return;
      }

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === 'en' ? 'en-IN' : `${language}-IN`;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('TTS playback failed:', error);
    }
  };

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...evidenceBundles];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((event) =>
        [
          event.eventName,
          event.state,
          event.location,
          event.disasterType,
          String(event.year),
          event.whatHappened,
          event.reportedCasualties,
          event.reportedDamage,
        ].some((value) => value.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      const aTime = a.eventDate ? new Date(a.eventDate).getTime() : NaN;
      const bTime = b.eventDate ? new Date(b.eventDate).getTime() : NaN;
      const chronological = Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime
        ? aTime - bTime
        : a.year - b.year;
      if (sortOption === 'oldest') return chronological;
      if (sortOption === 'recent') return -chronological;
      if (sortOption === 'casualties') return (b.numericCasualties || 0) - (a.numericCasualties || 0);
      if (sortOption === 'sources') return (b.sources?.length || 0) - (a.sources?.length || 0);
      if (sortOption === 'alphabetical') return a.eventName.localeCompare(b.eventName);
      return 0;
    });

    return result;
  }, [evidenceBundles, searchQuery, sortOption]);

  const toggleCompare = (bundle: EvidenceBundle) => {
    const exists = compareList.some((item) => item.id === bundle.id);
    if (exists) {
      setCompareList(compareList.filter((item) => item.id !== bundle.id));
      return;
    }

    if (compareList.length >= 4) {
      alert(translate(language, 'history.maxCompare'));
      return;
    }

    setCompareList([...compareList, bundle]);
  };

  const handleOpenChatForEvent = (bundle: EvidenceBundle) => {
    setActiveChatBundle(bundle);
    if (onOpenVoiceAssistant) {
      onOpenVoiceAssistant();
    } else {
      setLocalVoiceOpen(true);
    }
  };

  const handleCopyCardSummary = async (bundle: EvidenceBundle, e: React.MouseEvent) => {
    e.stopPropagation();
    const summary = `${bundle.eventName} (${bundle.dateRange})\nLocation: ${bundle.location}, ${bundle.state}\nCasualties: ${bundle.reportedCasualties}\nDamage: ${bundle.reportedDamage}\nOverview: ${bundle.whatHappened}\nSources: ${bundle.sources.map((s) => `[${s.id}] ${s.title} (${s.publisher})`).join(', ')}`;
    try {
      await navigator.clipboard.writeText(summary);
      alert('Disaster evidence summary copied to clipboard with source citations!');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const renderCard = (bundle: HistoricalDisasterItem) => {
    const isSelectedForCompare = compareList.some((item) => item.id === bundle.id);
    const hasCasualties = isMeaningfulEvidenceText(bundle.reportedCasualties);
    const hasDamage = isMeaningfulEvidenceText(bundle.reportedDamage);
    const hasImpactSummary = hasCasualties || hasDamage;

    return (
      <div
        key={bundle.id}
        onClick={() => setSelectedBundle(bundle)}
        className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDDDDD] hover:border-[#747F8D] hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group relative"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD] text-xs font-mono font-bold">
                {bundle.year}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono uppercase border bg-white text-[#0F1B29] border-[#DDDDDD]">
                {hazardLabel(language, bundle.disasterType)}
              </span>
              <span className="text-xs text-[#747F8D] font-medium">
                <TranslatedText text={bundle.state} language={language} />
              </span>
            </div>

            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#ECF8F8]/50 text-[#0F1B29] border border-[#DDDDDD] shrink-0">
              {translate(language, 'history.sourcesCount', { count: bundle.sources?.length || 0 })}
            </span>
          </div>

          <div>
            <h4 className="font-bold text-base sm:text-lg text-[#0F1B29] group-hover:text-[#747F8D] transition-colors leading-snug">
              <TranslatedText text={bundle.eventName} language={language} />
            </h4>
            <div className="flex items-center gap-1 text-xs text-[#747F8D] mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#747F8D] shrink-0" />
              <span>
                <TranslatedText text={`${bundle.location}, ${bundle.state}`} language={language} />
              </span>
              <span className="text-[#DDDDDD]">•</span>
              <Calendar className="w-3.5 h-3.5 text-[#747F8D] shrink-0" />
              <TranslatedText text={bundle.eventDate ? formatDisasterDate(bundle.eventDate) : bundle.dateRange} language={language} />
            </div>
          </div>
        </div>

        {hasImpactSummary ? (
          <div className={`grid grid-cols-1 ${hasCasualties && hasDamage ? 'sm:grid-cols-2' : ''} gap-2.5 text-xs`}>
            {hasCasualties && (
              <div className="p-3 rounded-xl bg-white border border-[#DDDDDD] space-y-0.5">
                <span className="text-[#0F1B29] font-bold text-[10px] uppercase flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#747F8D]" />
                  <span>{translate(language, 'history.casualties')}</span>
                </span>
                <p className="text-[#0F1B29] line-clamp-2 leading-relaxed text-xs font-medium">
                  <TranslatedText text={bundle.reportedCasualties} language={language} />
                </p>
              </div>
            )}

            {hasDamage && (
              <div className="p-3 rounded-xl bg-white border border-[#DDDDDD] space-y-0.5">
                <span className="text-[#0F1B29] font-bold text-[10px] uppercase flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#747F8D]" />
                  <span>{translate(language, 'history.damage')}</span>
                </span>
                <p className="text-[#0F1B29] line-clamp-2 leading-relaxed text-xs font-medium">
                  <TranslatedText text={bundle.reportedDamage} language={language} />
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#747F8D]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#747F8D]" />
            <span>{bundle.evidenceStatus}</span>
          </div>
        )}

        <p className="text-xs text-[#747F8D] line-clamp-2 leading-relaxed">
          <TranslatedText text={bundle.whatHappened} language={language} />
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#DDDDDD]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(bundle);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${isSelectedForCompare
                ? 'bg-[#0F1B29] border-[#0F1B29] text-white'
                : 'bg-white hover:bg-[#ECF8F8] border-[#DDDDDD] text-[#0F1B29]'
                }`}
            >
              {isSelectedForCompare ? <Check className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isSelectedForCompare ? translate(language, 'history.inCompare') : translate(language, 'history.addCompare')}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenChatForEvent(bundle);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#ECF8F8] hover:bg-[#DDDDDD]/60 border border-[#DDDDDD] text-xs font-semibold text-[#0F1B29] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#747F8D]" />
              <span>{translate(language, 'history.askAi')}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => handleCopyCardSummary(bundle, e)}
              className="p-1.5 rounded-xl bg-white hover:bg-[#ECF8F8] border border-[#DDDDDD] text-[#747F8D] hover:text-[#0F1B29] transition-colors"
              title={translate(language, 'history.copySummary')}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 text-xs font-bold text-[#0F1B29] group-hover:text-[#747F8D]">
              <span>{translate(language, 'history.liveDossier')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedBundle) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        <EventDetailView
          bundle={selectedBundle}
          onBack={() => setSelectedBundle(null)}
          onOpenChatWithEvent={handleOpenChatForEvent}
          onPlayTTS={handlePlayTTS}
          language={language}
        />

        <AIAssistantDrawer
          isOpen={isVoiceAssistantOpen || localVoiceOpen}
          onClose={() => {
            onCloseVoiceAssistant?.();
            setLocalVoiceOpen(false);
          }}
          associatedBundle={activeChatBundle || selectedBundle}
          language={language}
          onLanguageChange={onLanguageChange}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      <div className="bg-white border border-[#DDDDDD] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ECF8F8] border border-[#DDDDDD] flex items-center justify-center text-[#0F1B29]">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg sm:text-xl text-[#0F1B29] flex items-center gap-2">
                  <span>Indian Historical Disaster Intelligence Archive</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECF8F8] text-[#0F1B29] font-mono font-bold border border-[#DDDDDD]">
                    Current Evidence
                  </span>
                </h2>
                <p className="text-xs text-[#747F8D]">
                  Build a sourced dossier from current evidence and AI synthesis, then compare events or open the evidence view.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded Evidence Engine</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-[#747F8D] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  void handleLiveQuerySearch(searchQuery);
                }
              }}
              placeholder={translate(language, 'history.searchPlaceholder')}
              className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-[#DDDDDD] text-[#0F1B29] placeholder:text-[#747F8D]/60 focus:outline-none focus:border-[#747F8D] focus:ring-2 focus:ring-[#DDDDDD]/40"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="p-1 text-[#747F8D] hover:text-[#0F1B29]">
                  <X className="w-4 h-4" />
                </button>
              )}
              <AudioRecorderButton
                language={language}
                targetLanguage={language}
                onTranscribed={(transcript) => {
                  setSearchQuery(transcript);
                  void handleLiveQuerySearch(transcript);
                }}
                tooltip="Speak disaster query in your preferred language"
                className="scale-90"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={isSearchingLive || !searchQuery.trim()}
            onClick={() => void handleLiveQuerySearch(searchQuery)}
            className="px-4 py-2.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
            title="Search current evidence and synthesize a dossier"
          >
            <span>{isSearchingLive ? 'Synthesizing Archive...' : 'Search Evidence'}</span>
          </button>
        </div>

        {searchError && (
          <div
            className={`p-3 rounded-xl text-xs font-medium ${isNoLiveSourcesMessage(searchError)
              ? 'border border-amber-200 bg-amber-50 text-amber-800'
              : 'border border-rose-200 bg-rose-50 text-rose-700'
              }`}
          >
            {searchError}
          </div>
        )}

        <div className="pt-2 border-t border-[#DDDDDD] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#747F8D] flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#0F1B29]" />
              <span>Sort Order:</span>
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#DDDDDD] font-semibold text-[#0F1B29] focus:outline-none focus:border-[#747F8D] cursor-pointer text-xs"
            >
              <option value="oldest">Oldest to Recent</option>
              <option value="recent">Most Recent to Oldest</option>
              <option value="casualties">Highest Casualties / Impact</option>
              <option value="sources">Most Sources First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-[#747F8D] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0F1B29]" />
              <span>State:</span>
            </span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#DDDDDD] font-semibold text-[#0F1B29] focus:outline-none focus:border-[#747F8D] cursor-pointer text-xs"
            >
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['all', '1990s', '2000s', '2010s', '2020s'] as DecadeFilter[]).map((decade) => (
              <button
                key={decade}
                type="button"
                onClick={() => setSelectedDecade(decade)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${selectedDecade === decade
                  ? 'bg-[#0F1B29] text-white shadow-xs'
                  : 'text-[#747F8D] hover:text-[#0F1B29]'
                  }`}
              >
                {decade === 'all' ? 'All Eras' : decade}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${isSelected
                  ? 'bg-[#0F1B29] text-white border-[#0F1B29] shadow-xs'
                  : 'bg-white hover:bg-[#ECF8F8] text-[#0F1B29] border-[#DDDDDD]'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DDDDDD] pt-3">
          <div className="text-xs text-[#747F8D]">
            {selectedCategory !== appliedFilters.category ||
              selectedState !== appliedFilters.state ||
              selectedDecade !== appliedFilters.decade ? (
              <span>Filter selections are ready. Apply them to run a fresh evidence search.</span>
            ) : (
              <span>Results reflect the last applied filter set.</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => void handleApplyFilters()}
            disabled={isApplyingFilter || isArchiveLoading}
            className="px-4 py-2 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
            aria-label="Apply Filter"
          >
            <Filter className={`w-4 h-4 ${isApplyingFilter ? 'animate-pulse' : ''}`} />
            <span>{isApplyingFilter ? 'Applying Filter...' : 'Apply Filter'}</span>
          </button>
        </div>
      </div>

      {archiveError && !evidenceBundles.length && !isArchiveLoading && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Recent archive could not be loaded right now. Current evidence search still works, and the page will recover when the service is reachable.
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2 font-medium">
          <span className="font-bold text-[#0F1B29] text-sm">
            {filteredAndSortedEvents.length > 0
              ? `Showing ${filteredAndSortedEvents.length} live dossiers`
              : 'No dossiers loaded yet'}
          </span>
        </div>

        {(searchQuery || selectedCategory !== 'all' || selectedState !== 'All States' || selectedDecade !== 'all' ||
          appliedFilters.category !== 'all' || appliedFilters.state !== 'All States' || appliedFilters.decade !== 'all') && (
            <button
              type="button"
              onClick={() => void handleResetFilters()}
              className="text-[#0F1B29] hover:text-[#747F8D] font-semibold underline"
            >
              Reset All Filters
            </button>
          )}
      </div>

      {(isArchiveLoading || isSearchingLive) && <EventCardSkeleton />}

      {filteredAndSortedEvents.length === 0 && !isArchiveLoading && !isSearchingLive ? (
        <div className="rounded-2xl border border-dashed border-[#DDDDDD] bg-white p-8 text-center space-y-3 shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#ECF8F8] border border-[#DDDDDD] flex items-center justify-center text-[#0F1B29]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#0F1B29]">
            {archiveError
              ? 'Live archive is temporarily unavailable'
              : appliedFilters.category !== 'all' || appliedFilters.state !== 'All States' || appliedFilters.decade !== 'all'
                ? 'No matching live records were found'
                : 'No dossier yet'}
          </h3>
          <p className="text-xs text-[#747F8D] max-w-md mx-auto leading-relaxed">
            {archiveError
              ? 'The live source did not respond. Try Apply Filter again or use Search Evidence; no placeholder records were inserted.'
              : appliedFilters.category !== 'all' || appliedFilters.state !== 'All States' || appliedFilters.decade !== 'all'
                ? 'The live search returned no records for this combination. Broaden one filter and apply it again.'
                : 'Search any disaster event, district, or state and we will synthesize a single cited dossier and add it here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredAndSortedEvents.map(renderCard)}
        </div>
      )}

      {compareList.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-white border border-[#DDDDDD] rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#747F8D]" />
            <div className="text-xs">
              <span className="font-bold text-[#0F1B29] block">
                {compareList.length} Disaster Events Selected
              </span>
              <span className="text-[11px] text-[#747F8D]">
                {compareList.length < 2 ? 'Select 1 more event to launch comparison matrix' : 'Ready for cross-event matrix analysis'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={compareList.length < 2}
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>{t.compareNow}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setCompareList([])}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#747F8D] hover:text-[#0F1B29] transition-colors"
              title="Clear Selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isCompareModalOpen && (
        <CompareModal
          bundles={compareList}
          onClose={() => setIsCompareModalOpen(false)}
          language={language}
        />
      )}

      <AIAssistantDrawer
        isOpen={isVoiceAssistantOpen || localVoiceOpen}
        onClose={() => {
          onCloseVoiceAssistant?.();
          setLocalVoiceOpen(false);
        }}
        associatedBundle={activeChatBundle}
        language={language}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
};


--- SIH-2026/frontend/src/components/future/FuturePage.tsx ---

import React, { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  AlertCircle,
  Calendar,
  Layers,
  Mountain,
  Waves,
} from 'lucide-react';
import { translate } from '../../types/language';
import { LRUCache } from '../../lib/lruCache';
import { FuturePredictionDrawer } from './FuturePredictionDrawer';

interface FuturePageProps {
  currentLanguage: string;
}

// ============================================================
// TYPES
// ============================================================

interface BasePrediction {
  rank: number;
  month: number;
  latitude: number;
  longitude: number;
}

interface FloodPrediction extends BasePrediction {
  disaster_type: 'flood';

  flood_probability: number;
  flood_probability_percent: number;

  peak_flood_level_m: number;
  warning_level: number;
  danger_level: number;

  historical_observations?: number;
}

interface LandslidePrediction extends BasePrediction {
  disaster_type: 'landslide';

  landslide_probability: number;
  landslide_probability_percent: number;

  monthly_rainfall_mm?: number;
  rain_zscore?: number;

  prior_event_count?: number;
  prior_same_month_count?: number;

  events_last_3_years?: number;
  events_last_5_years?: number;

  years_since_last_event?: number;
}

type DisasterPrediction =
  | FloodPrediction
  | LandslidePrediction;

interface FloodPredictionResponse {
  disaster_type?: string;
  month: number;
  requested_top_n: number;
  returned_count: number;
  predictions?: unknown[];
}

interface LandslidePredictionResponse {
  disaster_type?: string;
  month: number;
  requested_top_n: number;
  returned_count: number;
  predictions?: unknown[];
}

interface CachedForecast {
  flood: FloodPrediction[];
  landslide: LandslidePrediction[];
}

// ============================================================
// MONTHS
// ============================================================

const MONTH_NUMBER: Record<string, number> = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
};

const monthsList = [
  { code: 'SEP', year: 2026, label: 'SEP 2026' },
  { code: 'OCT', year: 2026, label: 'OCT 2026' },
  { code: 'NOV', year: 2026, label: 'NOV 2026' },
  { code: 'DEC', year: 2026, label: 'DEC 2026' },
  { code: 'JAN', year: 2027, label: 'JAN 2027' },
  { code: 'FEB', year: 2027, label: 'FEB 2027' },
  { code: 'MAR', year: 2027, label: 'MAR 2027' },
  { code: 'APR', year: 2027, label: 'APR 2027' },
  { code: 'MAY', year: 2027, label: 'MAY 2027' },
  { code: 'JUN', year: 2027, label: 'JUN 2027' },
  { code: 'JUL', year: 2027, label: 'JUL 2027' },
  { code: 'AUG', year: 2027, label: 'AUG 2027' },
];

// ============================================================
// CACHE
// ============================================================

const forecastCache = new LRUCache<number, CachedForecast>(
  10,
  5 * 60 * 1000
);

// ============================================================
// MONTH LABEL
// ============================================================

function formatMonthLabel(
  language: string,
  code: string,
  year: number
): string {
  const monthNames: Record<string, Record<string, string>> = {
    en: {
      SEP: 'Sep',
      OCT: 'Oct',
      NOV: 'Nov',
      DEC: 'Dec',
      JAN: 'Jan',
      FEB: 'Feb',
      MAR: 'Mar',
      APR: 'Apr',
      MAY: 'May',
      JUN: 'Jun',
      JUL: 'Jul',
      AUG: 'Aug',
    },

    hi: {
      SEP: 'सितंबर',
      OCT: 'अक्टूबर',
      NOV: 'नवंबर',
      DEC: 'दिसंबर',
      JAN: 'जनवरी',
      FEB: 'फरवरी',
      MAR: 'मार्च',
      APR: 'अप्रैल',
      MAY: 'मई',
      JUN: 'जून',
      JUL: 'जुलाई',
      AUG: 'अगस्त',
    },

    bn: {
      SEP: 'সেপ্টেম্বর',
      OCT: 'অক্টোবর',
      NOV: 'নভেম্বর',
      DEC: 'ডিসেম্বর',
      JAN: 'জানুয়ারি',
      FEB: 'ফেব্রুয়ারি',
      MAR: 'মার্চ',
      APR: 'এপ্রিল',
      MAY: 'মে',
      JUN: 'জুন',
      JUL: 'জুলাই',
      AUG: 'আগস্ট',
    },
  };

  const name =
    monthNames[language]?.[code] ||
    monthNames.en[code] ||
    code;

  return `${name} ${year}`;
}

// ============================================================
// NUMERIC NORMALIZATION
// ============================================================

function toFiniteNumber(
  value: unknown,
  fallback = 0
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

// ============================================================
// FLOOD NORMALIZATION
// ============================================================

function normalizeFloodPrediction(
  raw: unknown
): FloodPrediction | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const item = raw as Record<string, unknown>;

  const latitude = toFiniteNumber(
    item.latitude,
    NaN
  );

  const longitude = toFiniteNumber(
    item.longitude,
    NaN
  );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  const floodProbability = toFiniteNumber(
    item.flood_probability,
    NaN
  );

  const suppliedPercent = toFiniteNumber(
    item.flood_probability_percent,
    NaN
  );

  const floodProbabilityPercent =
    Number.isFinite(suppliedPercent)
      ? suppliedPercent
      : Number.isFinite(floodProbability)
        ? floodProbability * 100
        : 0;

  return {
    rank: Math.max(
      0,
      Math.trunc(
        toFiniteNumber(item.rank)
      )
    ),

    month: Math.max(
      1,
      Math.min(
        12,
        Math.trunc(
          toFiniteNumber(item.month)
        )
      )
    ),

    latitude,
    longitude,

    disaster_type: 'flood',

    flood_probability:
      Number.isFinite(floodProbability)
        ? floodProbability
        : floodProbabilityPercent / 100,

    flood_probability_percent:
      floodProbabilityPercent,

    peak_flood_level_m:
      toFiniteNumber(
        item.peak_flood_level_m
      ),

    warning_level:
      toFiniteNumber(
        item.warning_level
      ),

    danger_level:
      toFiniteNumber(
        item.danger_level
      ),

    historical_observations:
      item.historical_observations != null
        ? toFiniteNumber(
            item.historical_observations
          )
        : undefined,
  };
}

// ============================================================
// LANDSLIDE NORMALIZATION
// ============================================================

function normalizeLandslidePrediction(
  raw: unknown
): LandslidePrediction | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const item = raw as Record<string, unknown>;

  const latitude = toFiniteNumber(
    item.latitude,
    NaN
  );

  const longitude = toFiniteNumber(
    item.longitude,
    NaN
  );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  const probability = toFiniteNumber(
    item.landslide_probability,
    NaN
  );

  const suppliedPercent = toFiniteNumber(
    item.landslide_probability_percent,
    NaN
  );

  const probabilityPercent =
    Number.isFinite(suppliedPercent)
      ? suppliedPercent
      : Number.isFinite(probability)
        ? probability * 100
        : 0;

  return {
    rank: Math.max(
      0,
      Math.trunc(
        toFiniteNumber(item.rank)
      )
    ),

    month: Math.max(
      1,
      Math.min(
        12,
        Math.trunc(
          toFiniteNumber(item.month)
        )
      )
    ),

    latitude,
    longitude,

    disaster_type: 'landslide',

    landslide_probability:
      Number.isFinite(probability)
        ? probability
        : probabilityPercent / 100,

    landslide_probability_percent:
      probabilityPercent,

    monthly_rainfall_mm:
      item.monthly_rainfall_mm != null
        ? toFiniteNumber(
            item.monthly_rainfall_mm
          )
        : undefined,

    rain_zscore:
      item.rain_zscore != null
        ? toFiniteNumber(
            item.rain_zscore
          )
        : undefined,

    prior_event_count:
      item.prior_event_count != null
        ? toFiniteNumber(
            item.prior_event_count
          )
        : undefined,

    prior_same_month_count:
      item.prior_same_month_count != null
        ? toFiniteNumber(
            item.prior_same_month_count
          )
        : undefined,

    events_last_3_years:
      item.events_last_3_years != null
        ? toFiniteNumber(
            item.events_last_3_years
          )
        : undefined,

    events_last_5_years:
      item.events_last_5_years != null
        ? toFiniteNumber(
            item.events_last_5_years
          )
        : undefined,

    years_since_last_event:
      item.years_since_last_event != null
        ? toFiniteNumber(
            item.years_since_last_event
          )
        : undefined,
  };
}

// ============================================================
// DISASTER PROBABILITY
// ============================================================

function getProbability(
  prediction: DisasterPrediction
): number {
  if (
    prediction.disaster_type ===
    'flood'
  ) {
    return toFiniteNumber(
      prediction.flood_probability_percent
    );
  }

  return toFiniteNumber(
    prediction.landslide_probability_percent
  );
}

// ============================================================
// DISASTER NAME
// ============================================================

function getDisasterName(
  prediction: DisasterPrediction
): string {
  return prediction.disaster_type ===
    'flood'
    ? 'FLOOD'
    : 'LANDSLIDE';
}

// ============================================================
// MARKER ICON
// ============================================================

function createDisasterIcon(
  type: DisasterPrediction['disaster_type']
): string {
  if (type === 'flood') {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="#0F1B29"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 12h18" />
        <path d="M5 16c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
        <path d="M5 8c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
      </svg>
    `;
  }

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="#0F1B29"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m3 20 7-9 4 5 3-4 4 8" />
      <path d="M14 11 16 8l2 3" />
    </svg>
  `;
}

// ============================================================
// COMPONENT
// ============================================================

export const FuturePage: React.FC<
  FuturePageProps
> = ({ currentLanguage }) => {
  const mapContainerRef =
    useRef<HTMLDivElement>(null);

  const mapRef =
    useRef<L.Map | null>(null);

  const markersLayerRef =
    useRef<L.LayerGroup | null>(null);

  const requestSequenceRef =
    useRef(0);

  const [selectedMonth, setSelectedMonth] =
    useState(monthsList[9]);

  const [predictions, setPredictions] =
    useState<DisasterPrediction[]>([]);

  const [
    selectedPrediction,
    setSelectedPrediction,
  ] = useState<DisasterPrediction | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [floodCount, setFloodCount] =
    useState(0);

  const [
    landslideCount,
    setLandslideCount,
  ] = useState(0);

  const mlApiUrl =
    import.meta.env.VITE_ML_API_BASE_URL ||
    'http://127.0.0.1:8000';

  // ==========================================================
  // INITIALIZE MAP
  // ==========================================================

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    const map = L.map(
      mapContainerRef.current,
      {
        center: [
          20.5937,
          78.9629,
        ],
        zoom: 5,
        zoomControl: true,
      }
    );

    mapRef.current = map;

    const satelliteLayer =
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        }
      );

    satelliteLayer.addTo(map);

    markersLayerRef.current =
      L.layerGroup().addTo(map);

    return () => {
      markersLayerRef.current?.clearLayers();
      markersLayerRef.current = null;

      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ==========================================================
  // GENERIC API REQUEST
  // ==========================================================

  const requestPredictions =
    useCallback(
      async <T,>(
        endpoint: string,
        monthNumber: number
      ): Promise<T> => {
        const response =
          await fetch(
            `${mlApiUrl}${endpoint}`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                month: monthNumber,
                top_n: 30,
              }),
            }
          );

        if (!response.ok) {
          let message =
            `${endpoint} failed (${response.status})`;

          try {
            const errorData =
              await response.json();

            if (
              errorData?.detail
            ) {
              message = String(
                errorData.detail
              );
            }
          } catch {
            // Ignore invalid response body.
          }

          throw new Error(message);
        }

        return response.json() as Promise<T>;
      },
      [mlApiUrl]
    );

  // ==========================================================
  // LOAD FORECAST
  // ==========================================================

  const handleRetrieveForecast =
    useCallback(
      async (monthCode: string) => {
        const monthNumber =
          MONTH_NUMBER[monthCode];

        if (!monthNumber) {
          setError(
            translate(
              currentLanguage,
              'future.unavailable'
            )
          );

          return;
        }

        const requestId =
          ++requestSequenceRef.current;

        setLoading(true);
        setError(null);
        setSelectedPrediction(null);

        // ----------------------------------------------------
        // CACHE
        // ----------------------------------------------------

        const cached =
          forecastCache.get(
            monthNumber
          );

        if (cached) {
          if (
            requestId !==
            requestSequenceRef.current
          ) {
            return;
          }

          setPredictions([
            ...cached.flood,
            ...cached.landslide,
          ]);

          setFloodCount(
            cached.flood.length
          );

          setLandslideCount(
            cached.landslide.length
          );

          setLoading(false);

          return;
        }

        // ----------------------------------------------------
        // START BOTH REQUESTS INDEPENDENTLY
        // ----------------------------------------------------

        const floodPromise =
          requestPredictions<FloodPredictionResponse>(
            '/predict/floods',
            monthNumber
          );

        const landslidePromise =
          requestPredictions<LandslidePredictionResponse>(
            '/predict/landslides',
            monthNumber
          );

        const [
          floodResult,
          landslideResult,
        ] = await Promise.allSettled([
          floodPromise,
          landslidePromise,
        ]);

        if (
          requestId !==
          requestSequenceRef.current
        ) {
          return;
        }

        // ----------------------------------------------------
        // NORMALIZE FLOOD
        // ----------------------------------------------------

        let floodPredictions:
          FloodPrediction[] = [];

        if (
          floodResult.status ===
          'fulfilled'
        ) {
          floodPredictions =
            (
              floodResult.value
                ?.predictions ?? []
            )
              .map(
                normalizeFloodPrediction
              )
              .filter(
                (
                  item
                ): item is FloodPrediction =>
                  item !== null
              )
              // ------------------------------------------------
              // HARD UI RULE:
              // NEVER DISPLAY FLOOD RISK < 50%.
              // ------------------------------------------------
              .filter(
                (item) =>
                  item.flood_probability_percent >=
                  50
              )
              // ------------------------------------------------
              // SORT AGAIN IN FRONTEND AS SAFETY.
              // Highest probability first.
              // ------------------------------------------------
              .sort(
                (
                  a,
                  b
                ) =>
                  b.flood_probability_percent -
                  a.flood_probability_percent
              )
              // ------------------------------------------------
              // Reassign rank after filtering.
              // ------------------------------------------------
              .map(
                (item, index) => ({
                  ...item,
                  rank:
                    index + 1,
                })
              );
        }

        // ----------------------------------------------------
        // NORMALIZE LANDSLIDE
        // ----------------------------------------------------

        let landslidePredictions:
          LandslidePrediction[] = [];

        if (
          landslideResult.status ===
          'fulfilled'
        ) {
          landslidePredictions =
            (
              landslideResult.value
                ?.predictions ?? []
            )
              .map(
                normalizeLandslidePrediction
              )
              .filter(
                (
                  item
                ): item is LandslidePrediction =>
                  item !== null
              )
              .sort(
                (
                  a,
                  b
                ) =>
                  b.landslide_probability_percent -
                  a.landslide_probability_percent
              )
              .map(
                (item, index) => ({
                  ...item,
                  rank:
                    index + 1,
                })
              );
        }

        // ----------------------------------------------------
        // ERRORS
        // ----------------------------------------------------

        const errors: string[] = [];

        if (
          floodResult.status ===
          'rejected'
        ) {
          errors.push(
            floodResult.reason instanceof
              Error
              ? `Flood: ${floodResult.reason.message}`
              : 'Flood prediction failed.'
          );
        }

        if (
          landslideResult.status ===
          'rejected'
        ) {
          errors.push(
            landslideResult.reason instanceof
              Error
              ? `Landslide: ${landslideResult.reason.message}`
              : 'Landslide prediction failed.'
          );
        }

        // ----------------------------------------------------
        // CACHE
        // ----------------------------------------------------

        const cacheValue: CachedForecast = {
          flood: floodPredictions,
          landslide:
            landslidePredictions,
        };

        forecastCache.put(
          monthNumber,
          cacheValue
        );

        // ----------------------------------------------------
        // MAP
        // ----------------------------------------------------

        setPredictions([
          ...floodPredictions,
          ...landslidePredictions,
        ]);

        setFloodCount(
          floodPredictions.length
        );

        setLandslideCount(
          landslidePredictions.length
        );

        if (errors.length > 0) {
          setError(
            errors.join(' | ')
          );
        }

        setLoading(false);
      },
      [
        currentLanguage,
        requestPredictions,
      ]
    );

  // ==========================================================
  // SELECT MONTH
  // ==========================================================

  const handleSelectMonth = (
    month: typeof monthsList[number]
  ) => {
    setSelectedMonth(month);

    void handleRetrieveForecast(
      month.code
    );
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    void handleRetrieveForecast(
      selectedMonth.code
    );

    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================================
  // DRAW MARKERS
  // ==========================================================

  useEffect(() => {
    const map = mapRef.current;

    const markersLayer =
      markersLayerRef.current;

    if (!map || !markersLayer) {
      return;
    }

    markersLayer.clearLayers();

    if (!predictions.length) {
      return;
    }

    predictions.forEach(
      (prediction) => {
        const probability =
          getProbability(
            prediction
          );

        const disasterName =
          getDisasterName(
            prediction
          );

        const isSelected =
          selectedPrediction ===
          prediction;

        const strokeColor =
          isSelected
            ? '#4f46e5'
            : '#0F1B29';

        const fillColor =
          isSelected
            ? '#e0e7ff'
            : '#EEF0F2';

        const ringClass =
          isSelected
            ? 'ring-4 ring-indigo-300 ring-offset-2'
            : 'ring-2 ring-slate-200';

        const iconHtml = `
          <div
            class="relative group cursor-pointer flex flex-col items-center"
          >
            <div
              class="w-8 h-8 rounded-2xl bg-white shadow-md flex items-center justify-center ${ringClass} transition-transform hover:scale-110"
              style="
                border: 2px solid ${strokeColor};
              "
            >
              ${createDisasterIcon(
                prediction.disaster_type
              )}
            </div>

            <div
              class="mt-1.5 px-2 py-0.5 rounded-full text-[8px] font-extrabold tracking-tight whitespace-nowrap shadow-sm"
              style="
                background-color: ${fillColor};
                border: 1.5px solid ${strokeColor};
                color: ${strokeColor};
              "
            >
              ${disasterName}
            </div>
          </div>
        `;

        const customIcon =
          L.divIcon({
            html: iconHtml,

            className:
              'custom-disaster-marker',

            iconSize: [
              70,
              52,
            ],

            iconAnchor: [
              35,
              22,
            ],
          });

        const marker =
          L.marker(
            [
              prediction.latitude,
              prediction.longitude,
            ],
            {
              icon: customIcon,
            }
          );

        marker.bindTooltip(
          `
            <div
              style="
                font-family: sans-serif;
                min-width: 120px;
                line-height: 1.5;
              "
            >
              <strong>
                ${disasterName}
              </strong>

              <br />

              Rank:
              <strong>
                #${prediction.rank}
              </strong>

              <br />

              Risk:
              <strong>
                ${probability.toFixed(2)}%
              </strong>
            </div>
          `,
          {
            direction: 'top',
            offset: [0, -12],
            className:
              'leaflet-disaster-tooltip',
          }
        );

        marker.on(
          'click',
          () => {
            setSelectedPrediction(
              prediction
            );

            map.flyTo(
              [
                prediction.latitude,
                prediction.longitude,
              ],
              Math.max(
                map.getZoom(),
                7
              ),
              {
                duration: 0.6,
              }
            );
          }
        );

        marker.addTo(
          markersLayer
        );
      }
    );
  }, [
    predictions,
    selectedPrediction,
  ]);

  // ==========================================================
  // CLOSE DRAWER
  // ==========================================================

  const closePredictionPanel = () => {
    setSelectedPrediction(
      null
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        w-full
        h-full
        bg-[#ECF8F8]
        text-[#0F1B29]
        flex
        flex-col
        md:flex-row
        font-sans
        select-none
        overflow-hidden
        animate-in
        fade-in
        duration-200
      "
    >

      {/* ======================================================
          LEFT TIMELINE
      ====================================================== */}

      <div
        className="
          w-full
          md:w-80
          bg-white
          border-b
          md:border-b-0
          md:border-r
          border-[#DDDDDD]
          flex
          flex-col
          p-4
          md:p-6
          md:overflow-hidden
          shrink-0
          h-auto
          md:h-full
          z-30
        "
      >

        <div
          className="
            flex
            flex-col
            flex-1
            gap-4
            md:gap-8
            min-h-0
            h-full
          "
        >

          <div>
            <h2
              className="
                text-[#0F1B29]
                font-bold
                text-xs
                uppercase
                tracking-wider
                flex
                items-center
                gap-1.5
              "
            >
              <Calendar
                className="
                  w-4
                  h-4
                  text-[#747F8D]
                "
              />

              <span>
                {translate(
                  currentLanguage,
                  'future.timelineTitle'
                )}
              </span>
            </h2>

            <p
              className="
                text-[10px]
                text-[#747F8D]
                mt-0.5
                font-semibold
              "
            >
              {translate(
                currentLanguage,
                'future.timelineSubtitle'
              )}
            </p>
          </div>


          <div
            className="
              relative
              border-l-0
              ml-0
              md:ml-2
              flex
              flex-row
              md:flex-col
              overflow-x-auto
              md:overflow-x-visible
              space-x-2
              md:space-x-0
              md:space-y-0
              md:flex-1
              md:justify-between
              py-1
              md:py-6
              md:pl-8
              scrollbar-none
              min-h-0
            "
          >

            <div
              className="
                hidden
                md:block
                absolute
                left-[15px]
                top-[34px]
                bottom-[34px]
                w-[2px]
                bg-[#DDDDDD]/60
                z-0
              "
            />

            {monthsList.map(
              (month) => {

                const isSelected =
                  selectedMonth.code ===
                    month.code &&
                  selectedMonth.year ===
                    month.year;

                return (
                  <button
                    key={
                      month.label
                    }
                    type="button"
                    onClick={() =>
                      handleSelectMonth(
                        month
                      )
                    }
                    className={`
                      relative
                      shrink-0
                      flex
                      items-center
                      justify-center
                      md:justify-between
                      text-center
                      md:text-left
                      px-3
                      py-1.5
                      md:px-0
                      md:py-0
                      md:w-full
                      rounded-full
                      md:rounded-none
                      transition-all
                      duration-200
                      outline-none
                      cursor-pointer
                      text-xs
                      font-bold
                      tracking-wide
                      z-10
                      ${
                        isSelected
                          ? 'bg-[#0F1B29] text-white md:bg-transparent md:text-[#0F1B29]'
                          : 'bg-white text-[#747F8D] border border-[#DDDDDD] md:bg-transparent md:border-0 hover:text-[#0F1B29]'
                      }
                    `}
                  >

                    <div
                      className="
                        hidden
                        md:flex
                        absolute
                        -left-[25px]
                        top-1/2
                        -translate-y-1/2
                        w-4
                        h-4
                        rounded-full
                        border-2
                        border-[#DDDDDD]
                        bg-white
                        items-center
                        justify-center
                        z-10
                      "
                    >

                      <div
                        className={`
                          w-2
                          h-2
                          rounded-full
                          transition-all
                          duration-300
                          ${
                            isSelected
                              ? 'bg-[#0F1B29] scale-110'
                              : 'bg-transparent'
                          }
                        `}
                      />

                    </div>


                    <span
                      className="md:ml-3"
                    >
                      {formatMonthLabel(
                        currentLanguage,
                        month.code,
                        month.year
                      )}
                    </span>


                    {isSelected && (
                      <div
                        className="
                          hidden
                          md:block
                          absolute
                          left-0
                          right-0
                          h-7
                          bg-[#ECF8F8]/60
                          border-r-2
                          border-[#0F1B29]
                          z-[-1]
                          pointer-events-none
                          rounded-l-md
                        "
                      />
                    )}

                  </button>
                );
              }
            )}

          </div>
        </div>
      </div>


      {/* ======================================================
          MAP
      ====================================================== */}

      <div
        className="
          flex-1
          relative
          bg-[#ECF8F8]
          flex
          flex-col
          min-h-0
        "
      >

        <div
          ref={mapContainerRef}
          className="
            absolute
            inset-0
            z-10
          "
        />


        {/* ==================================================
            MAP STATUS / LEGEND
        ================================================== */}

        {!loading &&
          (floodCount > 0 ||
            landslideCount > 0) && (
            <div
              className="
                absolute
                bottom-5
                right-5
                z-20
                bg-white/95
                border
                border-[#DDDDDD]
                shadow-lg
                rounded-xl
                px-3
                py-2
                flex
                items-center
                gap-3
              "
            >

              <Layers
                className="
                  w-3.5
                  h-3.5
                  text-[#747F8D]
                "
              />

              {floodCount > 0 && (
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <Waves
                    className="
                      w-3.5
                      h-3.5
                      text-[#0F1B29]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-extrabold
                      tracking-wide
                      text-[#0F1B29]
                    "
                  >
                    FLOOD
                  </span>

                  <span
                    className="
                      text-[9px]
                      text-[#747F8D]
                      font-bold
                    "
                  >
                    {floodCount}
                  </span>
                </div>
              )}

              {floodCount > 0 &&
                landslideCount > 0 && (
                  <div
                    className="
                      h-4
                      w-px
                      bg-[#DDDDDD]
                    "
                  />
                )}

              {landslideCount > 0 && (
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <Mountain
                    className="
                      w-3.5
                      h-3.5
                      text-[#0F1B29]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-extrabold
                      tracking-wide
                      text-[#0F1B29]
                    "
                  >
                    LANDSLIDE
                  </span>

                  <span
                    className="
                      text-[9px]
                      text-[#747F8D]
                      font-bold
                    "
                  >
                    {landslideCount}
                  </span>
                </div>
              )}

            </div>
          )}


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div
            className="
              absolute
              inset-0
              z-25
              pointer-events-none
              flex
              items-center
              justify-center
            "
          >

            <div
              className="
                bg-white
                px-5
                py-3
                rounded-lg
                shadow-lg
                border
                border-[#DDDDDD]
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    w-4
                    h-4
                    border-2
                    border-[#0F1B29]
                    border-t-transparent
                    rounded-full
                    animate-spin
                  "
                />

                <span
                  className="
                    text-xs
                    font-semibold
                  "
                >
                  {translate(
                    currentLanguage,
                    'future.generating'
                  )}
                </span>

              </div>

            </div>
          </div>
        )}


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && !loading && (
          <div
            className="
              absolute
              top-4
              left-1/2
              -translate-x-1/2
              z-25
              bg-white
              border
              border-red-200
              shadow-lg
              rounded-lg
              px-4
              py-3
              max-w-xl
            "
          >

            <div
              className="
                flex
                gap-2
                items-start
              "
            >

              <AlertCircle
                className="
                  w-4
                  h-4
                  text-red-600
                  shrink-0
                  mt-0.5
                "
              />

              <div>

                <p
                  className="
                    text-xs
                    font-bold
                  "
                >
                  {translate(
                    currentLanguage,
                    'future.unavailable'
                  )}
                </p>

                <p
                  className="
                    text-[10px]
                    text-[#747F8D]
                    mt-1
                  "
                >
                  {error}
                </p>

              </div>

            </div>

          </div>
        )}


        {/* ==================================================
            DRAWER
        ================================================== */}

        {selectedPrediction && (
          <FuturePredictionDrawer
            prediction={
              selectedPrediction
            }

            selectedMonthLabel={
              formatMonthLabel(
                currentLanguage,
                selectedMonth.code,
                selectedMonth.year
              )
            }

            onClose={
              closePredictionPanel
            }

            language={
              currentLanguage
            }
          />
        )}

      </div>
    </div>
  );
};

export default FuturePage;

--- SIH-2026/frontend/src/components/future/FuturePredictionDrawer.tsx ---

import React from 'react';
import {
  Activity,
  Calendar,
  CloudRain,
  Compass,
  History,
  Info,
  MapPin,
  Mountain,
  TrendingUp,
  Waves,
  X,
} from 'lucide-react';
import { translate } from '../../types/language';

// ============================================================
// TYPES
// ============================================================

interface BasePrediction {
  rank: number;
  month: number;
  latitude: number;
  longitude: number;
}

interface FloodPrediction extends BasePrediction {
  disaster_type: 'flood';

  flood_probability: number;
  flood_probability_percent: number;

  peak_flood_level_m: number;
  warning_level: number;
  danger_level: number;

  historical_observations?: number;
}

interface LandslidePrediction extends BasePrediction {
  disaster_type: 'landslide';

  landslide_probability: number;
  landslide_probability_percent: number;

  monthly_rainfall_mm?: number;
  rain_zscore?: number;

  prior_event_count?: number;
  prior_same_month_count?: number;

  events_last_3_years?: number;
  events_last_5_years?: number;

  years_since_last_event?: number;
}

type DisasterPrediction =
  | FloodPrediction
  | LandslidePrediction;

interface FuturePredictionDrawerProps {
  prediction:
    | DisasterPrediction
    | null;

  selectedMonthLabel: string;

  onClose: () => void;

  language: string;
}

// ============================================================
// SAFE NUMBER
// ============================================================

function safeNumber(
  value: unknown,
  fallback = 0
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

// ============================================================
// COMPONENT
// ============================================================

export const FuturePredictionDrawer: React.FC<
  FuturePredictionDrawerProps
> = ({
  prediction,
  selectedMonthLabel,
  onClose,
  language,
}) => {
  if (!prediction) {
    return null;
  }

  const isFlood =
    prediction.disaster_type ===
    'flood';

  const disasterName =
    isFlood
      ? 'FLOOD'
      : 'LANDSLIDE';

  const probability =
    isFlood
      ? safeNumber(
          prediction.flood_probability_percent
        )
      : safeNumber(
          prediction.landslide_probability_percent
        );

  const isHighRisk =
    probability >= 80;

  const isMediumRisk =
    probability >= 50 &&
    probability < 80;

  const riskColorClass =
    isHighRisk
      ? 'text-rose-600 bg-rose-50 border-rose-100 ring-rose-200'
      : isMediumRisk
        ? 'text-amber-700 bg-amber-50 border-amber-100 ring-amber-200'
        : 'text-emerald-700 bg-emerald-50 border-emerald-100 ring-emerald-200';

  const riskLabelKey =
    isHighRisk
      ? 'future.highRisk'
      : isMediumRisk
        ? 'future.mediumRisk'
        : 'future.lowRisk';

  const disasterIcon =
    isFlood
      ? (
        <Waves className="w-5 h-5" />
      )
      : (
        <Mountain className="w-5 h-5" />
      );

  return (
    <div
      className="
        fixed
        inset-y-0
        right-0
        z-50
        w-full
        sm:w-[480px]
        bg-white
        border-l
        border-slate-200
        shadow-2xl
        flex
        flex-col
        overflow-hidden
        animate-in
        slide-in-from-right
        duration-200
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          p-4
          sm:p-5
          border-b
          border-slate-200
          flex
          items-center
          justify-between
          bg-slate-50
        "
      >

        <div
          className="
            flex
            items-center
            gap-2.5
            min-w-0
          "
        >

          <div
            className={`
              w-9
              h-9
              rounded-xl
              border
              flex
              items-center
              justify-center
              shrink-0
              ${
                isHighRisk
                  ? 'bg-rose-50 border-rose-100 text-rose-600'
                  : 'bg-indigo-50 border-indigo-100 text-indigo-600'
              }
            `}
          >
            {disasterIcon}
          </div>


          <div
            className="
              min-w-0
            "
          >

            <h3
              className="
                font-bold
                text-sm
                sm:text-base
                text-slate-900
                truncate
              "
            >
              {disasterName}
            </h3>


            <p
              className="
                text-[10px]
                text-slate-500
                flex
                items-center
                gap-1
                mt-0.5
                font-semibold
              "
            >

              <Calendar
                className="
                  w-3
                  h-3
                  text-slate-400
                "
              />

              <span>
                {selectedMonthLabel}
              </span>

              <span
                className="
                  text-slate-300
                "
              >
                •
              </span>

              <span>
                Rank #{prediction.rank}
              </span>

            </p>

          </div>

        </div>


        <button
          type="button"
          onClick={onClose}
          className="
            p-2
            rounded-xl
            bg-white
            hover:bg-slate-100
            text-slate-700
            border
            border-slate-200
            transition-colors
            shadow-xs
            cursor-pointer
          "
          aria-label="Close prediction details"
        >
          <X className="w-4 h-4" />
        </button>

      </div>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          flex-1
          overflow-y-auto
          p-4
          sm:p-5
          space-y-5
        "
      >

        {/* ====================================================
            DISASTER TYPE
        ==================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border
            border-slate-200
            rounded-xl
            px-4
            py-3
            bg-white
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <MapPin
              className="
                w-4
                h-4
                text-slate-500
              "
            />

            <span
              className="
                text-xs
                font-bold
                text-slate-800
              "
            >
              Predicted disaster
            </span>

          </div>


          <span
            className="
              px-2.5
              py-1
              rounded-full
              bg-slate-900
              text-white
              text-[9px]
              font-extrabold
              tracking-wider
            "
          >
            {disasterName}
          </span>

        </div>


        {/* ====================================================
            RISK CARD
        ==================================================== */}

        <div
          className="
            p-4
            rounded-2xl
            bg-slate-50
            border
            border-slate-200
            space-y-3
          "
        >

          <div
            className="
              flex
              justify-between
              items-center
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Activity
                className="
                  w-4
                  h-4
                  text-slate-500
                "
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-slate-800
                "
              >
                {translate(
                  language,
                  'future.probability'
                )}
              </span>

            </div>


            <div
              className={`
                px-2.5
                py-0.5
                rounded-full
                border
                text-[10px]
                font-bold
                ring-2
                ring-offset-1
                ${riskColorClass}
              `}
            >
              {translate(
                language,
                riskLabelKey
              )}
            </div>

          </div>


          <div
            className="
              flex
              items-baseline
              gap-1
              pt-1
            "
          >

            <span
              className="
                text-3xl
                font-extrabold
                tracking-tight
                text-slate-900
              "
            >
              {probability.toFixed(2)}%
            </span>

          </div>


          <div
            className="
              h-2.5
              bg-slate-200
              rounded-full
              overflow-hidden
            "
          >

            <div
              className={`
                h-full
                rounded-full
                transition-all
                duration-500
                ${
                  isHighRisk
                    ? 'bg-rose-600'
                    : isMediumRisk
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                }
              `}
              style={{
                width: `${Math.min(
                  Math.max(
                    probability,
                    0
                  ),
                  100
                )}%`,
              }}
            />

          </div>


          <p
            className="
              text-[10px]
              leading-relaxed
              text-slate-500
            "
          >
            {translate(
              language,
              'future.probabilityDesc'
            )}
          </p>

        </div>


        {/* ====================================================
            COORDINATES
        ==================================================== */}

        <div
          className="
            space-y-2
          "
        >

          <div
            className="
              text-xs
              font-bold
              text-slate-900
              uppercase
              tracking-wider
              flex
              items-center
              gap-1
            "
          >

            <Compass
              className="
                w-3.5
                h-3.5
                text-slate-500
              "
            />

            <span>
              {translate(
                language,
                'future.coordinates'
              )}
            </span>

          </div>


          <div
            className="
              grid
              grid-cols-2
              gap-3
            "
          >

            <div
              className="
                bg-slate-50
                border
                border-slate-200
                rounded-xl
                p-3
              "
            >

              <span
                className="
                  text-[10px]
                  text-slate-500
                  uppercase
                  font-bold
                "
              >
                {translate(
                  language,
                  'future.latitude'
                )}
              </span>

              <div
                className="
                  text-sm
                  font-mono
                  font-bold
                  text-slate-900
                  mt-1
                "
              >
                {safeNumber(
                  prediction.latitude
                ).toFixed(6)}
              </div>

            </div>


            <div
              className="
                bg-slate-50
                border
                border-slate-200
                rounded-xl
                p-3
              "
            >

              <span
                className="
                  text-[10px]
                  text-slate-500
                  uppercase
                  font-bold
                "
              >
                {translate(
                  language,
                  'future.longitude'
                )}
              </span>

              <div
                className="
                  text-sm
                  font-mono
                  font-bold
                  text-slate-900
                  mt-1
                "
              >
                {safeNumber(
                  prediction.longitude
                ).toFixed(6)}
              </div>

            </div>

          </div>

        </div>


        {/* ====================================================
            FLOOD DETAILS
        ==================================================== */}

        {isFlood && (
          <div
            className="
              space-y-2
            "
          >

            <div
              className="
                text-xs
                font-bold
                text-slate-900
                uppercase
                tracking-wider
                flex
                items-center
                gap-1
              "
            >

              <TrendingUp
                className="
                  w-3.5
                  h-3.5
                  text-slate-500
                "
              />

              <span>
                {translate(
                  language,
                  'future.severityTitle'
                )}
              </span>

            </div>


            <div
              className="
                space-y-2.5
              "
            >

              {/* Peak flood level */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border
                  border-slate-200
                  rounded-xl
                  p-3.5
                  bg-slate-50
                "
              >

                <div>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-800
                    "
                  >
                    {translate(
                      language,
                      'future.peakLevel'
                    )}
                  </span>

                  <div
                    className="
                      text-[9px]
                      font-semibold
                      text-slate-500
                      mt-0.5
                    "
                  >
                    Estimated peak river water level
                  </div>

                </div>


                <span
                  className="
                    font-mono
                    font-extrabold
                    text-base
                    text-slate-900
                  "
                >
                  {safeNumber(
                    prediction.peak_flood_level_m
                  ).toFixed(2)}{' '}
                  m
                </span>

              </div>


              {/* Warning level */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border
                  border-slate-200
                  rounded-xl
                  p-3
                  bg-white
                "
              >

                <div>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    {translate(
                      language,
                      'future.warningLevel'
                    )}
                  </span>

                  <div
                    className="
                      text-[9px]
                      text-slate-400
                      mt-0.5
                    "
                  >
                    Warning threshold
                  </div>

                </div>


                <span
                  className="
                    font-mono
                    font-extrabold
                    text-sm
                    text-slate-800
                  "
                >
                  {safeNumber(
                    prediction.warning_level
                  ).toFixed(2)}{' '}
                  m
                </span>

              </div>


              {/* Danger level */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border
                  border-slate-200
                  rounded-xl
                  p-3
                  bg-white
                "
              >

                <div>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    {translate(
                      language,
                      'future.dangerLevel'
                    )}
                  </span>

                  <div
                    className="
                      text-[9px]
                      text-slate-400
                      mt-0.5
                    "
                  >
                    Critical danger threshold
                  </div>

                </div>


                <span
                  className="
                    font-mono
                    font-extrabold
                    text-sm
                    text-slate-800
                  "
                >
                  {safeNumber(
                    prediction.danger_level
                  ).toFixed(2)}{' '}
                  m
                </span>

              </div>

            </div>

          </div>
        )}


        {/* ====================================================
            LANDSLIDE DETAILS
        ==================================================== */}

        {!isFlood && (
          <>
            {/* ------------------------------------------------
                RAINFALL
            ------------------------------------------------ */}

            <div
              className="
                space-y-2
              "
            >

              <div
                className="
                  text-xs
                  font-bold
                  text-slate-900
                  uppercase
                  tracking-wider
                  flex
                  items-center
                  gap-1
                "
              >

                <CloudRain
                  className="
                    w-3.5
                    h-3.5
                    text-slate-500
                  "
                />

                <span>
                  Rainfall indicators
                </span>

              </div>


              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >

                <div
                  className="
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-xl
                    p-3
                  "
                >

                  <span
                    className="
                      text-[10px]
                      text-slate-500
                      uppercase
                      font-bold
                    "
                  >
                    Monthly rainfall
                  </span>

                  <div
                    className="
                      text-lg
                      font-mono
                      font-extrabold
                      text-slate-900
                      mt-1
                    "
                  >
                    {typeof prediction.monthly_rainfall_mm ===
                    'number'
                      ? `${prediction.monthly_rainfall_mm.toFixed(2)} mm`
                      : 'N/A'}
                  </div>

                </div>


                </div>

            </div>


            {/* ------------------------------------------------
                HISTORICAL
            ------------------------------------------------ */}

            <div
              className="
                space-y-2
              "
            >

              <div
                className="
                  text-xs
                  font-bold
                  text-slate-900
                  uppercase
                  tracking-wider
                  flex
                  items-center
                  gap-1
                "
              >

                <History
                  className="
                    w-3.5
                    h-3.5
                    text-slate-500
                  "
                />

                <span>
                  Historical indicators
                </span>

              </div>


              <div
                className="
                  space-y-2.5
                "
              >

                {/* Prior events */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border
                    border-slate-200
                    rounded-xl
                    p-3
                    bg-slate-50
                  "
                >

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    Prior events
                  </span>

                  <span
                    className="
                      font-mono
                      font-extrabold
                      text-sm
                      text-slate-900
                    "
                  >
                    {prediction.prior_event_count ??
                      'N/A'}
                  </span>

                </div>


                {/* Same month */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border
                    border-slate-200
                    rounded-xl
                    p-3
                    bg-white
                  "
                >

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    Same-month events
                  </span>

                  <span
                    className="
                      font-mono
                      font-extrabold
                      text-sm
                      text-slate-900
                    "
                  >
                    {prediction.prior_same_month_count ??
                      'N/A'}
                  </span>

                </div>


                {/* Last 3 years */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border
                    border-slate-200
                    rounded-xl
                    p-3
                    bg-white
                  "
                >

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    Events last 3 years
                  </span>

                  <span
                    className="
                      font-mono
                      font-extrabold
                      text-sm
                      text-slate-900
                    "
                  >
                    {prediction.events_last_3_years ??
                      'N/A'}
                  </span>

                </div>


                {/* Last 5 years */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border
                    border-slate-200
                    rounded-xl
                    p-3
                    bg-white
                  "
                >

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    Events last 5 years
                  </span>

                  <span
                    className="
                      font-mono
                      font-extrabold
                      text-sm
                      text-slate-900
                    "
                  >
                    {prediction.events_last_5_years ??
                      'N/A'}
                  </span>

                </div>


                {/* Years since last event */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border
                    border-slate-200
                    rounded-xl
                    p-3
                    bg-white
                  "
                >

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    Years since last event
                  </span>

                  <span
                    className="
                      font-mono
                      font-extrabold
                      text-sm
                      text-slate-900
                    "
                  >
                    {prediction.years_since_last_event ===
                    999
                      ? 'No prior record'
                      : prediction.years_since_last_event ??
                        'N/A'}
                  </span>

                </div>

              </div>

            </div>
          </>
        )}


        

      </div>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div
        className="
          p-4
          border-t
          border-slate-200
          bg-slate-50
          flex
          items-center
          justify-center
        "
      >

        <button
          type="button"
          onClick={onClose}
          className="
            w-full
            py-2.5
            rounded-xl
            bg-slate-900
            hover:bg-slate-800
            text-white
            font-bold
            text-xs
            shadow-sm
            transition-colors
            cursor-pointer
          "
        >
          {translate(
            language,
            'common.close'
          )}
        </button>

      </div>

    </div>
  );
};

export default FuturePredictionDrawer;

--- SIH-2026/frontend/src/components/common/AudioRecorderButton.tsx ---

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { apiUrl } from '../../lib/api';
import { translate } from '../../types/language';

function mimeToExt(mime: string): string {
  const base = mime.split(';')[0].trim().toLowerCase();
  const map: Record<string, string> = {
    'audio/webm': 'webm', 'audio/mp4': 'mp4', 'audio/mpeg': 'mp3',
    'audio/ogg': 'ogg', 'audio/wav': 'wav', 'audio/x-wav': 'wav',
    'audio/flac': 'flac', 'audio/m4a': 'm4a',
  };
  return map[base] || 'webm';
}

interface AudioRecorderButtonProps {
  onTranscribed: (text: string, metadata?: { detectedLanguage?: string }) => void;
  language?: string;
  targetLanguage?: string;
  className?: string;
  buttonText?: string;
  tooltip?: string;
}

export const AudioRecorderButton: React.FC<AudioRecorderButtonProps> = ({
  onTranscribed,
  language = 'en',
  targetLanguage,
  className = '',
  buttonText,
  tooltip,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<number[]>(Array.from({ length: 24 }, () => 3));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const stopWaveform = () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    analyserRef.current = null;
    setWaveform(Array.from({ length: 24 }, () => 3));
  };

  const startWaveform = (stream: MediaStream) => {
    try {
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 64;
      context.createMediaStreamSource(stream).connect(analyser);
      audioContextRef.current = context;
      analyserRef.current = analyser;
      const data = new Uint8Array(analyser.frequencyBinCount);
      const draw = () => {
        analyser.getByteFrequencyData(data);
        setWaveform(Array.from({ length: 24 }, (_, index) => Math.max(3, Math.round((data[index % data.length] / 255) * 22))));
        animationRef.current = requestAnimationFrame(draw);
      };
      draw();
    } catch {
      // Recording still works when an AudioContext is unavailable.
    }
  };

  useEffect(() => () => stopWaveform(), []);

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/wav';

      const recorder = new MediaRecorder(stream, { mimeType });
      startWaveform(stream);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
        stopWaveform();

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size < 100) {
          setIsTranscribing(false);
          return;
        }

        await handleTranscribe(audioBlob, mimeType);
      };

      recorder.start(250); // Collect slice every 250ms
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setErrorMessage(translate(language, 'voice.microphoneDenied'));
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsTranscribing(true);
      setIsRecording(false);
      mediaRecorderRef.current.stop();
    }
  };

  const handleTranscribe = async (blob: Blob, mimeType: string) => {
    try {
      const formData = new FormData();
      formData.append('file', blob, `audio.${mimeToExt(mimeType)}`);
      formData.append('mimeType', mimeType);
      formData.append('targetLanguage', targetLanguage || language);
      const res = await fetch(apiUrl('/api/transcribe'), {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.text) {
        onTranscribed(data.text, { detectedLanguage: data.detectedLanguage });
      } else {
        setErrorMessage(translate(language, 'voice.noSpeech'));
      }
    } catch (err) {
      console.error('Transcription API error:', err);
      setErrorMessage(translate(language, 'voice.transcriptionError'));
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {isRecording ? (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 shadow-sm">
          <div className="flex items-center gap-0.5 h-6" aria-label="Recording waveform">
            {waveform.map((height, index) => <span key={index} className="w-0.5 rounded-full bg-rose-500 transition-[height] duration-75" style={{ height }} />)}
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer border-none shrink-0"
            title={translate(language, 'voice.stop', { seconds: recordingDuration })}
          >
            <Square className="w-3 h-3 fill-current text-white shrink-0" />
            <span className="text-white font-bold">{translate(language, 'voice.stop', { seconds: recordingDuration })}</span>
          </button>
        </div>
      ) : isTranscribing ? (
        <button
          type="button"
          disabled
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-xs transition-all ${className}`}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{translate(language, 'voice.transcribing')}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          className={`flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 transition-all ${className}`}
          title={tooltip || translate(language, 'voice.record')}
        >
          <Mic className="w-4 h-4" />
          {buttonText && <span className="ml-1 text-xs font-semibold">{buttonText}</span>}
        </button>
      )}

      {errorMessage && (
        <div className="absolute top-full left-0 mt-1.5 z-30 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-medium whitespace-nowrap shadow-sm">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-1 text-rose-500 hover:text-rose-800 font-bold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};


--- SIH-2026/frontend/src/components/common/Skeletons.tsx ---

import React from 'react';

export const IndiaMapSkeleton: React.FC = () => (
  <div className="w-full h-[420px] rounded-2xl bg-white border border-slate-200 animate-pulse skeleton-shimmer relative overflow-hidden flex flex-col justify-between p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="h-6 w-48 bg-slate-100 rounded-lg"></div>
      <div className="h-6 w-28 bg-slate-100 rounded-full"></div>
    </div>
    <div className="space-y-3 max-w-sm">
      <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
      <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-8 w-20 bg-slate-100 rounded-lg"></div>
      <div className="h-8 w-20 bg-slate-100 rounded-lg"></div>
    </div>
  </div>
);

export const UserMapSkeleton: React.FC = () => (
  <div className="w-full h-[320px] rounded-2xl bg-white border border-slate-200 animate-pulse skeleton-shimmer p-5 flex flex-col justify-between shadow-sm">
    <div className="flex justify-between items-center">
      <div className="h-5 w-40 bg-slate-100 rounded-lg"></div>
      <div className="h-5 w-24 bg-slate-100 rounded-full"></div>
    </div>
    <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto self-center"></div>
    <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
  </div>
);

export const LocationSkeleton: React.FC = () => (
  <div className="w-full h-[320px] rounded-2xl bg-white border border-slate-200 animate-pulse skeleton-shimmer p-6 space-y-4 shadow-sm">
    <div className="h-5 w-48 bg-slate-100 rounded-lg"></div>
    <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-slate-100 rounded"></div>
      <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
      <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
    </div>
    <div className="flex gap-3 pt-2">
      <div className="h-9 w-28 bg-slate-100 rounded-xl"></div>
      <div className="h-9 w-28 bg-slate-100 rounded-xl"></div>
    </div>
  </div>
);

export const AlertSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3 animate-pulse skeleton-shimmer shadow-sm">
    <div className="flex justify-between">
      <div className="h-5 w-32 bg-slate-100 rounded-lg"></div>
      <div className="h-5 w-16 bg-slate-100 rounded-full"></div>
    </div>
    <div className="h-4 w-full bg-slate-100 rounded"></div>
    <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
  </div>
);

export const NewsSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse skeleton-shimmer">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
          <div className="h-4 w-16 bg-slate-200 rounded"></div>
        </div>
        <div className="h-4 w-full bg-slate-200 rounded"></div>
        <div className="h-3 w-4/5 bg-slate-100 rounded"></div>
      </div>
    ))}
  </div>
);

export const SearchSkeleton: React.FC = () => (
  <div className="w-full space-y-4 animate-pulse skeleton-shimmer">
    <div className="h-12 w-full bg-white rounded-2xl border border-slate-200 shadow-sm"></div>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-7 w-24 bg-slate-100 rounded-full"></div>
      ))}
    </div>
  </div>
);

export const EventCardSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 animate-pulse skeleton-shimmer shadow-sm">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-6 w-64 bg-slate-100 rounded-lg"></div>
        <div className="h-4 w-40 bg-slate-100 rounded"></div>
      </div>
      <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
    </div>
    <div className="grid grid-cols-3 gap-3">
      <div className="h-14 bg-slate-50 rounded-xl p-2"></div>
      <div className="h-14 bg-slate-50 rounded-xl p-2"></div>
      <div className="h-14 bg-slate-50 rounded-xl p-2"></div>
    </div>
    <div className="h-4 w-full bg-slate-100 rounded"></div>
    <div className="flex justify-between items-center pt-2">
      <div className="h-4 w-28 bg-slate-100 rounded"></div>
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-slate-100 rounded-xl"></div>
        <div className="h-8 w-24 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export const TimelineSkeleton: React.FC = () => (
  <div className="space-y-4 p-4 animate-pulse skeleton-shimmer">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 items-start">
        <div className="w-3 h-3 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 bg-slate-100 rounded"></div>
          <div className="h-4 w-full bg-slate-100 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export const ChatSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse skeleton-shimmer">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-indigo-100 shrink-0"></div>
      <div className="space-y-2 flex-1 max-w-sm">
        <div className="h-4 bg-slate-100 rounded w-full"></div>
        <div className="h-4 bg-slate-100 rounded w-4/5"></div>
      </div>
    </div>
    <div className="flex items-start gap-3 justify-end">
      <div className="space-y-2 flex-1 max-w-sm">
        <div className="h-4 bg-indigo-50 rounded w-3/4 ml-auto"></div>
      </div>
      <div className="w-8 h-8 rounded-xl bg-slate-100 shrink-0"></div>
    </div>
  </div>
);


--- SIH-2026/backend-ml/main.py ---

"""
Aapada Drishti Disaster Prediction API

Endpoints:

    GET  /
    GET  /health

    POST /predict/floods
    POST /predict/landslides
    POST /predict
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from helpers.help import (
    load_model_bundle,
    model_status,
    predict_floods,
    predict_landslides,
)


# ============================================================
# LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Load the ONE merged Joblib once.
    load_model_bundle()

    yield


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Aapada Drishti Disaster Prediction API",

    description=(
        "India-only flood and landslide "
        "prediction API."
    ),

    version="2.0.0",

    lifespan=lifespan,
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://sih-2026-bay.vercel.app",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class PredictionRequest(BaseModel):

    month: int | str = Field(
        ...,
        description=(
            "Month number 1-12 or "
            "month name such as August."
        ),
        examples=[8],
    )

    top_n: int = Field(
        default=20,
        ge=1,
        le=500,
        description=(
            "Number of highest-risk locations."
        ),
        examples=[20],
    )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root() -> dict[str, Any]:

    return {
        "service":
            "Aapada Drishti Disaster "
            "Prediction API",

        "status": "running",

        "models": [
            "flood",
            "landslide",
        ],

        "docs": "/docs",
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health() -> dict[str, Any]:

    try:

        return model_status()

    except Exception as exc:

        raise HTTPException(
            status_code=503,
            detail=(
                f"Model service unavailable: "
                f"{exc}"
            ),
        ) from exc


# ============================================================
# FLOOD
# ============================================================

@app.post("/predict/floods")
def predict_flood(
    request: PredictionRequest,
) -> dict[str, Any]:

    try:

        return predict_floods(
            month=request.month,
            top_n=request.top_n,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Flood prediction failed: "
                f"{exc}"
            ),
        ) from exc


# ============================================================
# LANDSLIDE
# ============================================================

@app.post("/predict/landslides")
def predict_landslide(
    request: PredictionRequest,
) -> dict[str, Any]:

    try:

        return predict_landslides(
            month=request.month,
            top_n=request.top_n,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Landslide prediction failed: "
                f"{exc}"
            ),
        ) from exc


# ============================================================
# BOTH FLOOD + LANDSLIDE
# ============================================================

@app.post("/predict")
def predict_all(
    request: PredictionRequest,
) -> dict[str, Any]:

    try:

        flood = predict_floods(
            month=request.month,
            top_n=request.top_n,
        )

        landslide = predict_landslides(
            month=request.month,
            top_n=request.top_n,
        )

        return {
            "month": flood["month"],
            "flood": flood,
            "landslide": landslide,
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Combined prediction failed: "
                f"{exc}"
            ),
        ) from exc

--- SIH-2026/backend-ml/requirements.txt ---

annotated-doc==0.0.5
annotated-types==0.8.0
anyio==4.14.2
click==8.5.0
fastapi==0.141.1
h11==0.16.0
idna==3.19
joblib==1.5.3
numpy==2.5.2
pandas==3.0.5
pydantic==2.13.4
pydantic_core==2.46.4
python-dateutil==2.9.0.post0
scipy==1.18.1
six==1.17.0
starlette==1.6.0
typing-inspection==0.4.4
typing_extensions==4.16.0
tzdata==2026.3
uvicorn==0.52.4
xgboost==3.4.1

--- SIH-2026/backend-ml/helpers/help.py ---

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd


# ============================================================
# PATH
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

BUNDLE_PATH = (
    BASE_DIR
    / "artifacts"
    / "india_disaster_prediction_bundle.joblib"
)


# ============================================================
# FLOOD FEATURES
# ============================================================

FLOOD_FEATURE_COLUMNS = [
    "Month",
    "Month_Sin",
    "Month_Cos",
    "Latitude",
    "Longitude",
    "Latitude_Squared",
    "Longitude_Squared",
    "IMD_Monthly_Rainfall_Normal_mm",
    "IMD_All_India_Rainfall_Normal_mm",
    "IMD_Annual_Region_Rainfall_Normal_mm",
    "IMD_Monsoon_Rainfall_Normal_mm",
    "IMD_Rainfall_Normal_Ratio_to_India",
    "IMD_Monthly_Rainfall_Share_of_Annual",
]


# ============================================================
# MONTH MAP
# ============================================================

MONTH_MAP = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}


# ============================================================
# LOAD MASTER BUNDLE ONCE
# ============================================================

@lru_cache(maxsize=1)
def load_model_bundle() -> dict[str, Any]:

    if not BUNDLE_PATH.exists():
        raise FileNotFoundError(
            f"Model bundle not found: {BUNDLE_PATH}"
        )

    bundle = joblib.load(BUNDLE_PATH)

    if not isinstance(bundle, dict):
        raise TypeError(
            "Model bundle must be a dictionary."
        )

    required = {
        "flood",
        "landslide",
    }

    missing = required.difference(bundle.keys())

    if missing:
        raise ValueError(
            f"Model bundle missing keys: {sorted(missing)}"
        )

    return bundle


# ============================================================
# MONTH CONVERTER
# ============================================================

def month_to_number(
    month: int | str,
) -> int:

    if isinstance(month, bool):
        raise ValueError(
            "Month must be 1-12 or a month name."
        )

    if isinstance(month, int):

        if 1 <= month <= 12:
            return month

        raise ValueError(
            "Month must be between 1 and 12."
        )

    value = str(month).strip().lower()

    if value in MONTH_MAP:
        return MONTH_MAP[value]

    try:
        number = int(value)
    except ValueError as exc:
        raise ValueError(
            "Month must be 1-12 or a month name."
        ) from exc

    if not 1 <= number <= 12:
        raise ValueError(
            "Month must be between 1 and 12."
        )

    return number


# ============================================================
# FLOOD FEATURE ENGINEERING
# ============================================================

def prepare_flood_features(
    df: pd.DataFrame,
) -> pd.DataFrame:

    x = df.copy()

    numeric_columns = [
        "Month",
        "Latitude",
        "Longitude",
        "IMD_Monthly_Rainfall_Normal_mm",
        "IMD_All_India_Rainfall_Normal_mm",
        "IMD_Annual_Region_Rainfall_Normal_mm",
        "IMD_Monsoon_Rainfall_Normal_mm",
        "IMD_Rainfall_Normal_Ratio_to_India",
        "IMD_Monthly_Rainfall_Share_of_Annual",
    ]

    for column in numeric_columns:

        if column in x.columns:

            x[column] = pd.to_numeric(
                x[column],
                errors="coerce",
            )

    x["Month_Sin"] = np.sin(
        2 * np.pi * x["Month"] / 12.0
    )

    x["Month_Cos"] = np.cos(
        2 * np.pi * x["Month"] / 12.0
    )

    x["Latitude_Squared"] = (
        x["Latitude"] ** 2
    )

    x["Longitude_Squared"] = (
        x["Longitude"] ** 2
    )

    missing = [
        column
        for column in FLOOD_FEATURE_COLUMNS
        if column not in x.columns
    ]

    if missing:
        raise ValueError(
            f"Flood features missing: {missing}"
        )

    return x[FLOOD_FEATURE_COLUMNS]


# ============================================================
# FLOOD PREDICTOR
# ============================================================

def predict_floods(
    month: int | str,
    top_n: int = 20,
) -> dict[str, Any]:

    if not isinstance(top_n, int):
        raise ValueError(
            "top_n must be an integer."
        )

    if not 1 <= top_n <= 500:
        raise ValueError(
            "top_n must be between 1 and 500."
        )

    month_number = month_to_number(month)

    bundle = load_model_bundle()

    flood = bundle["flood"]

    location_model = flood["location_model"]

    severity_models = flood["severity_models"]

    candidates: pd.DataFrame = flood["candidates"]

    # ========================================================
    # SELECT MONTH
    # ========================================================

    month_data = candidates[
        candidates["Month"] == month_number
    ].copy()

    if month_data.empty:
        raise ValueError(
            f"No candidate locations are available "
            f"for month {month_number}."
        )

    # ========================================================
    # CREATE FEATURES
    # ========================================================

    x_candidates = prepare_flood_features(
        month_data
    )

    # ========================================================
    # ORIGINAL MODEL PROBABILITY
    #
    # DO NOT ALTER THIS CALCULATION.
    # ========================================================

    raw_probability = (
        location_model
        .predict_proba(x_candidates)[:, 1]
    )

    month_data["Flood_Probability"] = (
        pd.to_numeric(
            raw_probability,
            errors="coerce",
        )
    )

    # Remove invalid predictions
    month_data = month_data[
        month_data["Flood_Probability"].notna()
    ].copy()

    # ========================================================
    # IMPORTANT:
    # REMOVE ALL FLOOD LOCATIONS BELOW 50%
    # BEFORE RANKING.
    # ========================================================

    month_data = month_data[
        month_data["Flood_Probability"] >= 0.50
    ].copy()

    if month_data.empty:

        return {
            "disaster_type": "flood",
            "month": month_number,
            "requested_top_n": top_n,
            "returned_count": 0,
            "predictions": [],
        }

    # ========================================================
    # SORT BY ACTUAL PROBABILITY
    # HIGH → LOW
    # ========================================================

    month_data = (
        month_data
        .sort_values(
            by="Flood_Probability",
            ascending=False,
            kind="mergesort",
        )
        .reset_index(drop=True)
    )

    # ========================================================
    # ASSIGN RANK AFTER FILTER + SORT
    #
    # Therefore:
    #
    # Rank 1  >= Rank 2 >= Rank 3 ...
    #
    # and every returned point is >= 50%.
    # ========================================================

    month_data["rank"] = (
        np.arange(
            1,
            len(month_data) + 1,
        )
    )

    # ========================================================
    # NOW TAKE TOP N
    # ========================================================

    month_data = (
        month_data
        .head(top_n)
        .reset_index(drop=True)
    )

    # ========================================================
    # SEVERITY PREDICTIONS
    # ========================================================

    x_selected = prepare_flood_features(
        month_data
    )

    for target, model in severity_models.items():

        prediction = model.predict(
            x_selected
        )

        month_data[target] = np.maximum(
            prediction,
            0.0,
        )

    # ========================================================
    # BUILD RESPONSE
    # ========================================================

    predictions = []

    for _, row in month_data.iterrows():

        probability = float(
            row["Flood_Probability"]
        )

        predictions.append(
            {
                "rank": int(
                    row["rank"]
                ),

                "month": month_number,

                "disaster_type":
                    "flood",

                "latitude": round(
                    float(
                        row["Latitude"]
                    ),
                    6,
                ),

                "longitude": round(
                    float(
                        row["Longitude"]
                    ),
                    6,
                ),

                "flood_probability": round(
                    probability,
                    6,
                ),

                "flood_probability_percent":
                    round(
                        probability * 100.0,
                        2,
                    ),

                "peak_flood_level_m":
                    round(
                        float(
                            row[
                                "Peak Flood Level (m)"
                            ]
                        ),
                        2,
                    ),

                "warning_level":
                    round(
                        float(
                            row[
                                "Warning Level"
                            ]
                        ),
                        2,
                    ),

                "danger_level":
                    round(
                        float(
                            row[
                                "Danger Level"
                            ]
                        ),
                        2,
                    ),
            }
        )

    return {
        "disaster_type": "flood",

        "month": month_number,

        "requested_top_n": top_n,

        "returned_count":
            len(predictions),

        "predictions":
            predictions,
    }


# ============================================================
# LANDSLIDE PREDICTOR
# ============================================================

def predict_landslides(
    month: int | str,
    top_n: int = 20,
) -> dict[str, Any]:

    month_number = month_to_number(month)

    bundle = load_model_bundle()

    landslide = bundle["landslide"]

    prediction_table = landslide["prediction_table"]

    month_data = prediction_table[
        prediction_table["month"] == month_number
    ].copy()

    if month_data.empty:
        raise ValueError(
            f"No landslide predictions for month {month_number}."
        )

    month_data["confidence_percent"] = pd.to_numeric(
        month_data["confidence_percent"],
        errors="coerce",
    ).fillna(0)

    month_data = (
        month_data
        .sort_values(
            "confidence_percent",
            ascending=False,
        )
        .head(top_n)
        .reset_index(drop=True)
    )

    predictions = []

    for rank, (_, row) in enumerate(
        month_data.iterrows(),
        start=1,
    ):

        probability_percent = float(
            row["confidence_percent"]
        )

        predictions.append(
            {
                "rank": rank,
                "month": month_number,
                "disaster_type": "landslide",

                "latitude": round(
                    float(row["latitude"]),
                    6,
                ),

                "longitude": round(
                    float(row["longitude"]),
                    6,
                ),

                "landslide_probability": round(
                    probability_percent / 100.0,
                    6,
                ),

                "landslide_probability_percent":
                    round(
                        probability_percent,
                        2,
                    ),

                "monthly_rainfall_mm":
                    float(
                        row["monthly_rainfall_mm"]
                    ),

                "rain_zscore":
                    float(
                        row["rain_zscore"]
                    ),

                "prior_event_count":
                    int(
                        row["prior_event_count"]
                    ),

                "prior_same_month_count":
                    int(
                        row["prior_same_month_count"]
                    ),

                "events_last_3_years":
                    int(
                        row["events_last_3_years"]
                    ),

                "events_last_5_years":
                    int(
                        row["events_last_5_years"]
                    ),

                "years_since_last_event":
                    int(
                        row["years_since_last_event"]
                    ),
            }
        )

    return {
        "disaster_type": "landslide",
        "month": month_number,
        "requested_top_n": top_n,
        "returned_count": len(predictions),
        "predictions": predictions,
    }


# ============================================================
# HEALTH
# ============================================================

def model_status() -> dict[str, Any]:

    bundle = load_model_bundle()

    flood = bundle["flood"]

    landslide = bundle["landslide"]

    candidates = flood[
        "candidates"
    ]

    prediction_table = landslide.get(
        "prediction_table"
    )

    return {
        "loaded": True,

        "bundle": BUNDLE_PATH.name,

        "models": {
            "flood": {
                "location_model":
                    type(
                        flood[
                            "location_model"
                        ]
                    ).__name__,

                "severity_models": {
                    target:
                        type(model).__name__
                    for target, model
                    in flood[
                        "severity_models"
                    ].items()
                },
            },

            "landslide": {
                "model":
                    type(
                        landslide[
                            "model"
                        ]
                    ).__name__,

                "prediction_table_loaded":
                    prediction_table
                    is not None,

                "saved_features":
                    landslide.get(
                        "features"
                    ),

                "confidence_threshold":
                    landslide.get(
                        "confidence_threshold"
                    ),
            },
        },

        "flood": {
            "candidate_rows":
                int(len(candidates)),
        },

        "landslide": {
            "prediction_rows":
                int(
                    len(prediction_table)
                )
                if prediction_table is not None
                else 0,

            "months":
                sorted(
                    prediction_table[
                        "month"
                    ]
                    .unique()
                    .tolist()
                )
                if prediction_table is not None
                else [],
        },
    }

--- SIH-2026/backend/package-lock.json ---

{
  "name": "disaster-intelligence-backend",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "disaster-intelligence-backend",
      "version": "0.0.0",
      "dependencies": {
        "dotenv": "^17.2.3",
        "express": "^4.21.2",
        "fast-xml-parser": "^5.11.0",
        "multer": "^2.2.0"
      },
      "devDependencies": {
        "@types/express": "^4.17.21",
        "@types/multer": "^2.2.0",
        "@types/node": "^22.14.0",
        "esbuild": "^0.25.0",
        "tsx": "^4.21.0",
        "typescript": "~5.8.2"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.25.12.tgz",
      "integrity": "sha512-Hhmwd6CInZ3dwpuGTF8fJG6yoWmsToE+vYgD4nytZVxcu1ulHpUQRAB1UJ8+N1Am3Mz4+xOByoQoSZf4D+CpkA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.25.12.tgz",
      "integrity": "sha512-VJ+sKvNA/GE7Ccacc9Cha7bpS8nyzVv0jdVgwNDaR4gDMC/2TTRc33Ip8qrNYUcpkOHUT5OZ0bUcNNVZQ9RLlg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.25.12.tgz",
      "integrity": "sha512-6AAmLG7zwD1Z159jCKPvAxZd4y/VTO0VkprYy+3N2FtJ8+BQWFXU+OxARIwA46c5tdD9SsKGZ/1ocqBS/gAKHg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.25.12.tgz",
      "integrity": "sha512-5jbb+2hhDHx5phYR2By8GTWEzn6I9UqR11Kwf22iKbNpYrsmRB18aX/9ivc5cabcUiAT/wM+YIZ6SG9QO6a8kg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.25.12.tgz",
      "integrity": "sha512-N3zl+lxHCifgIlcMUP5016ESkeQjLj/959RxxNYIthIg+CQHInujFuXeWbWMgnTo4cp5XVHqFPmpyu9J65C1Yg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.25.12.tgz",
      "integrity": "sha512-HQ9ka4Kx21qHXwtlTUVbKJOAnmG1ipXhdWTmNXiPzPfWKpXqASVcWdnf2bnL73wgjNrFXAa3yYvBSd9pzfEIpA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.25.12.tgz",
      "integrity": "sha512-gA0Bx759+7Jve03K1S0vkOu5Lg/85dou3EseOGUes8flVOGxbhDDh/iZaoek11Y8mtyKPGF3vP8XhnkDEAmzeg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.25.12.tgz",
      "integrity": "sha512-TGbO26Yw2xsHzxtbVFGEXBFH0FRAP7gtcPE7P5yP7wGy7cXK2oO7RyOhL5NLiqTlBh47XhmIUXuGciXEqYFfBQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.25.12.tgz",
      "integrity": "sha512-lPDGyC1JPDou8kGcywY0YILzWlhhnRjdof3UlcoqYmS9El818LLfJJc3PXXgZHrHCAKs/Z2SeZtDJr5MrkxtOw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.25.12.tgz",
      "integrity": "sha512-8bwX7a8FghIgrupcxb4aUmYDLp8pX06rGh5HqDT7bB+8Rdells6mHvrFHHW2JAOPZUbnjUpKTLg6ECyzvas2AQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.25.12.tgz",
      "integrity": "sha512-0y9KrdVnbMM2/vG8KfU0byhUN+EFCny9+8g202gYqSSVMonbsCfLjUO+rCci7pM0WBEtz+oK/PIwHkzxkyharA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.25.12.tgz",
      "integrity": "sha512-h///Lr5a9rib/v1GGqXVGzjL4TMvVTv+s1DPoxQdz7l/AYv6LDSxdIwzxkrPW438oUXiDtwM10o9PmwS/6Z0Ng==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.25.12.tgz",
      "integrity": "sha512-iyRrM1Pzy9GFMDLsXn1iHUm18nhKnNMWscjmp4+hpafcZjrr2WbT//d20xaGljXDBYHqRcl8HnxbX6uaA/eGVw==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.25.12.tgz",
      "integrity": "sha512-9meM/lRXxMi5PSUqEXRCtVjEZBGwB7P/D4yT8UG/mwIdze2aV4Vo6U5gD3+RsoHXKkHCfSxZKzmDssVlRj1QQA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.25.12.tgz",
      "integrity": "sha512-Zr7KR4hgKUpWAwb1f3o5ygT04MzqVrGEGXGLnj15YQDJErYu/BGg+wmFlIDOdJp0PmB0lLvxFIOXZgFRrdjR0w==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.25.12.tgz",
      "integrity": "sha512-MsKncOcgTNvdtiISc/jZs/Zf8d0cl/t3gYWX8J9ubBnVOwlk65UIEEvgBORTiljloIWnBzLs4qhzPkJcitIzIg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.25.12.tgz",
      "integrity": "sha512-uqZMTLr/zR/ed4jIGnwSLkaHmPjOjJvnm6TVVitAa08SLS9Z0VM8wIRx7gWbJB5/J54YuIMInDquWyYvQLZkgw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.25.12.tgz",
      "integrity": "sha512-xXwcTq4GhRM7J9A8Gv5boanHhRa/Q9KLVmcyXHCTaM4wKfIpWkdXiMog/KsnxzJ0A1+nD+zoecuzqPmCRyBGjg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.25.12.tgz",
      "integrity": "sha512-Ld5pTlzPy3YwGec4OuHh1aCVCRvOXdH8DgRjfDy/oumVovmuSzWfnSJg+VtakB9Cm0gxNO9BzWkj6mtO1FMXkQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.25.12.tgz",
      "integrity": "sha512-fF96T6KsBo/pkQI950FARU9apGNTSlZGsv1jZBAlcLL1MLjLNIWPBkj5NlSz8aAzYKg+eNqknrUJ24QBybeR5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.25.12.tgz",
      "integrity": "sha512-MZyXUkZHjQxUvzK7rN8DJ3SRmrVrke8ZyRusHlP+kuwqTcfWLyqMOE3sScPPyeIXN/mDJIfGXvcMqCgYKekoQw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.25.12.tgz",
      "integrity": "sha512-rm0YWsqUSRrjncSXGA7Zv78Nbnw4XL6/dzr20cyrQf7ZmRcsovpcRBdhD43Nuk3y7XIoW2OxMVvwuRvk9XdASg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.25.12.tgz",
      "integrity": "sha512-3wGSCDyuTHQUzt0nV7bocDy72r2lI33QL3gkDNGkod22EsYl04sMf0qLb8luNKTOmgF/eDEDP5BFNwoBKH441w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.25.12.tgz",
      "integrity": "sha512-rMmLrur64A7+DKlnSuwqUdRKyd3UE7oPJZmnljqEptesKM8wx9J8gx5u0+9Pq0fQQW8vqeKebwNXdfOyP+8Bsg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.25.12.tgz",
      "integrity": "sha512-HkqnmmBoCbCwxUKKNPBixiWDGCpQGVsrQfJoVGYLPT41XWF8lHuE5N6WhVia2n4o5QK5M4tYr21827fNhi4byQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.25.12.tgz",
      "integrity": "sha512-alJC0uCZpTFrSL0CCDjcgleBXPnCrEAhTBILpeAp7M/OFgoqtAetfBzX0xM00MUsVVPpVjlPuMbREqnZCXaTnA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@nodable/entities": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/@nodable/entities/-/entities-3.0.0.tgz",
      "integrity": "sha512-8L9xFeTYKhm49xfIypoe2W5wV1m/3Z58kT+7kR9A8OyFxcPduI4VmxaUMQyKYrRjUoLLSXv6EKKID5Tvj9cUVw==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/nodable"
        }
      ],
      "license": "MIT"
    },
    "node_modules/@types/body-parser": {
      "version": "1.19.6",
      "resolved": "https://registry.npmjs.org/@types/body-parser/-/body-parser-1.19.6.tgz",
      "integrity": "sha512-HLFeCYgz89uk22N5Qg3dvGvsv46B8GLvKKo1zKG4NybA8U2DiEO3w9lqGg29t/tfLRJpJ6iQxnVw4OnB7MoM9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/connect": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/connect": {
      "version": "3.4.38",
      "resolved": "https://registry.npmjs.org/@types/connect/-/connect-3.4.38.tgz",
      "integrity": "sha512-K6uROf1LD88uDQqJCktA4yzL1YYAK6NgfsI0v/mTgyPKWsX1CnJ0XPSDhViejru1GcRkLWb8RlzFYJRqGUbaug==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/express": {
      "version": "4.17.25",
      "resolved": "https://registry.npmjs.org/@types/express/-/express-4.17.25.tgz",
      "integrity": "sha512-dVd04UKsfpINUnK0yBoYHDF3xu7xVH4BuDotC/xGuycx4CgbP48X/KF/586bcObxT0HENHXEU8Nqtu6NR+eKhw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/body-parser": "*",
        "@types/express-serve-static-core": "^4.17.33",
        "@types/qs": "*",
        "@types/serve-static": "^1"
      }
    },
    "node_modules/@types/express-serve-static-core": {
      "version": "4.19.9",
      "resolved": "https://registry.npmjs.org/@types/express-serve-static-core/-/express-serve-static-core-4.19.9.tgz",
      "integrity": "sha512-QP2ESEe/ImWY0HDwNAnK9PvEffUyhLTnWkk7KXzHfyeWAnlrDe1fN77bXl6ia8KT3wPlmA7t9/VPRpnf4Ex9sg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*",
        "@types/qs": "*",
        "@types/range-parser": "*",
        "@types/send": "*"
      }
    },
    "node_modules/@types/http-errors": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@types/http-errors/-/http-errors-2.0.5.tgz",
      "integrity": "sha512-r8Tayk8HJnX0FztbZN7oVqGccWgw98T/0neJphO91KkmOzug1KkofZURD4UaD5uH8AqcFLfdPErnBod0u71/qg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/mime": {
      "version": "1.3.5",
      "resolved": "https://registry.npmjs.org/@types/mime/-/mime-1.3.5.tgz",
      "integrity": "sha512-/pyBZWSLD2n0dcHE3hq8s8ZvcETHtEuF+3E7XVt0Ig2nvsVQXdghHVcEkIWjy9A0wKfTn97a/PSDYohKIlnP/w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/multer": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/@types/multer/-/multer-2.2.0.tgz",
      "integrity": "sha512-3U1troeqGV8Ntp7Q3klwf4zr23VEoqYVocYXaswm9+8z3O9UHDYAqLxjJ/h550iRADTjKdOdhhasXw6gD6kYtg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/express": "*"
      }
    },
    "node_modules/@types/node": {
      "version": "22.20.1",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.20.1.tgz",
      "integrity": "sha512-EANqOCF9QFyra+4pfxUcX9STKJpCLjMbObVzljIJomAWSnuSIEAvyzEU53GaajbXJEgdh0iEcPL+DGvpUd4k1Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/qs": {
      "version": "6.15.1",
      "resolved": "https://registry.npmjs.org/@types/qs/-/qs-6.15.1.tgz",
      "integrity": "sha512-GZHUBZR9hckSUhrxmp1nG6NwdpM9fCunJwyThLW1X3AyHgd9IlHb6VANpQQqDr2o/qQp6McZ3y/IA2rVzKzSbw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/range-parser": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/@types/range-parser/-/range-parser-1.2.7.tgz",
      "integrity": "sha512-hKormJbkJqzQGhziax5PItDUTMAM9uE2XXQmM37dyd4hVM+5aVl7oVxMVUiVQn2oCQFN/LKCZdvSM0pFRqbSmQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/send": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@types/send/-/send-1.2.1.tgz",
      "integrity": "sha512-arsCikDvlU99zl1g69TcAB3mzZPpxgw0UQnaHeC1Nwb015xp8bknZv5rIfri9xTOcMuaVgvabfIRA7PSZVuZIQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/serve-static": {
      "version": "1.15.10",
      "resolved": "https://registry.npmjs.org/@types/serve-static/-/serve-static-1.15.10.tgz",
      "integrity": "sha512-tRs1dB+g8Itk72rlSI2ZrW6vZg0YrLI81iQSTkMmOqnqCaNr/8Ek4VwWcN5vZgCYWbg/JJSGBlUaYGAOP73qBw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/http-errors": "*",
        "@types/node": "*",
        "@types/send": "<1"
      }
    },
    "node_modules/@types/serve-static/node_modules/@types/send": {
      "version": "0.17.6",
      "resolved": "https://registry.npmjs.org/@types/send/-/send-0.17.6.tgz",
      "integrity": "sha512-Uqt8rPBE8SY0RK8JB1EzVOIZ32uqy8HwdxCnoCOsYrvnswqmFZ/k+9Ikidlk/ImhsdvBsloHbAlewb2IEBV/Og==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/mime": "^1",
        "@types/node": "*"
      }
    },
    "node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/anynum": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/anynum/-/anynum-1.0.1.tgz",
      "integrity": "sha512-N6//FLET/tXYNM/F6ABca1oH6fWB+KlTt909Le28WMDBk8oaT4vY17DCrwg2MvmuqUKt3Ni4N5dGJ/EoBgcO6A==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/NaturalIntelligence"
        }
      ],
      "license": "MIT"
    },
    "node_modules/append-field": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/append-field/-/append-field-1.0.0.tgz",
      "integrity": "sha512-klpgFSWLW1ZEs8svjfb7g4qWY0YS5imI82dTg+QahUvJ8YqAY0P10Uk8tTyh9ZGuYEZEMaeJYCF5BFuX552hsw==",
      "license": "MIT"
    },
    "node_modules/array-flatten": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/array-flatten/-/array-flatten-1.1.1.tgz",
      "integrity": "sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg==",
      "license": "MIT"
    },
    "node_modules/body-parser": {
      "version": "1.20.6",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.20.6.tgz",
      "integrity": "sha512-p5tAzS57i5MV9fZFDj9LeIiTZEufbSe2eDozP+ElheSUq1m74CRq1jI4mYNDdVs9vQztXFLuk/Gd6BWTdwRJ5g==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "content-type": "~1.0.5",
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "~1.2.0",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.4.24",
        "on-finished": "~2.4.1",
        "qs": "~6.15.1",
        "raw-body": "~2.5.3",
        "type-is": "~1.6.18",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/buffer-from": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.2.tgz",
      "integrity": "sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==",
      "license": "MIT"
    },
    "node_modules/busboy": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/busboy/-/busboy-1.6.0.tgz",
      "integrity": "sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==",
      "dependencies": {
        "streamsearch": "^1.1.0"
      },
      "engines": {
        "node": ">=10.16.0"
      }
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/concat-stream": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/concat-stream/-/concat-stream-2.0.0.tgz",
      "integrity": "sha512-MWufYdFw53ccGjCA+Ol7XJYpAlW6/prSMzuPOTRnJGcGzuhLn4Scrz7qf6o8bROZ514ltazcIFJZevcfbo0x7A==",
      "engines": [
        "node >= 6.0"
      ],
      "license": "MIT",
      "dependencies": {
        "buffer-from": "^1.0.0",
        "inherits": "^2.0.3",
        "readable-stream": "^3.0.2",
        "typedarray": "^0.0.6"
      }
    },
    "node_modules/content-disposition": {
      "version": "0.5.4",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-0.5.4.tgz",
      "integrity": "sha512-FveZTNuGw04cxlAiWbzi6zTAL/lhehaWbTtgluJh4/E95DqMwTmha3KZN1aAWA8cFIhHzMZUvLevkw5Rqk+tSQ==",
      "license": "MIT",
      "dependencies": {
        "safe-buffer": "5.2.1"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
      "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.0.7.tgz",
      "integrity": "sha512-NXdYc3dLr47pBkpUCHtKSwIOQXLVn8dZEuywboCOJY/osA0wFSLlSawr3KN8qXJEyX66FcONTH8EIlVuK0yyFA==",
      "license": "MIT"
    },
    "node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/destroy": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/destroy/-/destroy-1.2.0.tgz",
      "integrity": "sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/dotenv": {
      "version": "17.4.2",
      "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-17.4.2.tgz",
      "integrity": "sha512-nI4U3TottKAcAD9LLud4Cb7b2QztQMUEfHbvhTH09bqXTxnSie8WnjPALV/WMCrJZ6UV/qHJ6L03OqO3LcdYZw==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://dotenvx.com"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "license": "MIT"
    },
    "node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
      "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/esbuild": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.25.12.tgz",
      "integrity": "sha512-bbPBYYrtZbkt6Os6FiTLCTFxvq4tt3JKall1vRwshA3fdVztsLAatFaZobhkBC8/BrPetoa0oksYoKXoG4ryJg==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.25.12",
        "@esbuild/android-arm": "0.25.12",
        "@esbuild/android-arm64": "0.25.12",
        "@esbuild/android-x64": "0.25.12",
        "@esbuild/darwin-arm64": "0.25.12",
        "@esbuild/darwin-x64": "0.25.12",
        "@esbuild/freebsd-arm64": "0.25.12",
        "@esbuild/freebsd-x64": "0.25.12",
        "@esbuild/linux-arm": "0.25.12",
        "@esbuild/linux-arm64": "0.25.12",
        "@esbuild/linux-ia32": "0.25.12",
        "@esbuild/linux-loong64": "0.25.12",
        "@esbuild/linux-mips64el": "0.25.12",
        "@esbuild/linux-ppc64": "0.25.12",
        "@esbuild/linux-riscv64": "0.25.12",
        "@esbuild/linux-s390x": "0.25.12",
        "@esbuild/linux-x64": "0.25.12",
        "@esbuild/netbsd-arm64": "0.25.12",
        "@esbuild/netbsd-x64": "0.25.12",
        "@esbuild/openbsd-arm64": "0.25.12",
        "@esbuild/openbsd-x64": "0.25.12",
        "@esbuild/openharmony-arm64": "0.25.12",
        "@esbuild/sunos-x64": "0.25.12",
        "@esbuild/win32-arm64": "0.25.12",
        "@esbuild/win32-ia32": "0.25.12",
        "@esbuild/win32-x64": "0.25.12"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "license": "MIT"
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/express": {
      "version": "4.22.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.22.2.tgz",
      "integrity": "sha512-IuL+Elrou2ZvCFHs18/CIzy2Nzvo25nZ1/D2eIZlz7c+QUayAcYoiM2BthCjs+EBHVpjYjcuLDAiCWgeIX3X1Q==",
      "license": "MIT",
      "dependencies": {
        "accepts": "~1.3.8",
        "array-flatten": "1.1.1",
        "body-parser": "~1.20.5",
        "content-disposition": "~0.5.4",
        "content-type": "~1.0.4",
        "cookie": "~0.7.1",
        "cookie-signature": "~1.0.6",
        "debug": "2.6.9",
        "depd": "2.0.0",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "finalhandler": "~1.3.1",
        "fresh": "~0.5.2",
        "http-errors": "~2.0.0",
        "merge-descriptors": "1.0.3",
        "methods": "~1.1.2",
        "on-finished": "~2.4.1",
        "parseurl": "~1.3.3",
        "path-to-regexp": "~0.1.12",
        "proxy-addr": "~2.0.7",
        "qs": "~6.15.1",
        "range-parser": "~1.2.1",
        "safe-buffer": "5.2.1",
        "send": "~0.19.0",
        "serve-static": "~1.16.2",
        "setprototypeof": "1.2.0",
        "statuses": "~2.0.1",
        "type-is": "~1.6.18",
        "utils-merge": "1.0.1",
        "vary": "~1.1.2"
      },
      "engines": {
        "node": ">= 0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/fast-xml-builder": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/fast-xml-builder/-/fast-xml-builder-1.3.1.tgz",
      "integrity": "sha512-pIM/1n3ntFXKYrUZwW7QCK0gAW7XY+wzj1YMIV3tLDvPj/V+zTGJK5e3/4WJfwj0qWw2ElNXiTixda/R+3YSug==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/NaturalIntelligence"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "path-expression-matcher": "^1.6.2",
        "xml-naming": "^0.3.0"
      }
    },
    "node_modules/fast-xml-parser": {
      "version": "5.11.0",
      "resolved": "https://registry.npmjs.org/fast-xml-parser/-/fast-xml-parser-5.11.0.tgz",
      "integrity": "sha512-9IGxMqvqLOnqP+Egi1nqDHKv5k8aZ7r9n558enxcucmyVGEBNPAU+MOg/8jPIS7rO7sSq4gFm1/nHtiaubMruw==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/NaturalIntelligence"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "@nodable/entities": "^3.0.0",
        "fast-xml-builder": "^1.2.0",
        "is-unsafe": "^2.0.0",
        "path-expression-matcher": "^1.6.2",
        "strnum": "^2.4.2",
        "xml-naming": "^0.3.0"
      },
      "bin": {
        "fxparser": "src/cli/cli.js"
      }
    },
    "node_modules/finalhandler": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-1.3.2.tgz",
      "integrity": "sha512-aA4RyPcd3badbdABGDuTXCMTtOneUCAYH/gxoYRTZlIJdF0YPWuGqiAsIrhNnnqdXGswYk6dGujem4w80UJFhg==",
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "on-finished": "~2.4.1",
        "parseurl": "~1.3.3",
        "statuses": "~2.0.2",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fresh": {
      "version": "0.5.2",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-0.5.2.tgz",
      "integrity": "sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/http-errors": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
      "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
      "license": "MIT",
      "dependencies": {
        "depd": "~2.0.0",
        "inherits": "~2.0.4",
        "setprototypeof": "~1.2.0",
        "statuses": "~2.0.2",
        "toidentifier": "~1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.4.24",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.4.24.tgz",
      "integrity": "sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-unsafe": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/is-unsafe/-/is-unsafe-2.0.2.tgz",
      "integrity": "sha512-HgbIHPBH0KHHCcjLfGsCvhtPTVxjaAZlXjwdz7/GQC40SjSe4sfQsar8J5VFo8JOSbarkpV0OLG95bbaNd9aAQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/NaturalIntelligence"
        }
      ],
      "license": "MIT"
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/media-typer": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-0.3.0.tgz",
      "integrity": "sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-1.0.3.tgz",
      "integrity": "sha512-gaNvAS7TZ897/rVaZ0nMtAyxNyi/pdbjbAwUpFQpN70GqnVfOiXpeUUMKRBmzXaSQ8DdTX4/0ms62r2K+hE6mQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/methods": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/methods/-/methods-1.1.2.tgz",
      "integrity": "sha512-iclAHeNqNm68zFtnZ0e+1L2yUIdvzNoauKU4WBA3VvH/vPFieF7qfRlwUZU+DA9P9bPXIS90ulxoUoCH23sV2w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/mime/-/mime-1.6.0.tgz",
      "integrity": "sha512-x0Vn8spI+wuJ1O6S7gnbaQg8Pxh4NNHb7KSINmEWKiPE4RKOplvijn+NkmYmmRgP68mc70j2EbeTFRsrswaQeg==",
      "license": "MIT",
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "license": "MIT"
    },
    "node_modules/multer": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/multer/-/multer-2.2.0.tgz",
      "integrity": "sha512-6rdyFg2kLrMh9Jee7/BMPuV9lEAd7lLW2YUpF9/YxR7njyoUwwQ0ZPh3TaIY50Sw6vlyD2HW3wGOkTS4P79xrQ==",
      "license": "MIT",
      "dependencies": {
        "append-field": "^1.0.0",
        "busboy": "^1.6.0",
        "concat-stream": "^2.0.0",
        "type-is": "^1.6.18"
      },
      "engines": {
        "node": ">= 10.16.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-expression-matcher": {
      "version": "1.6.2",
      "resolved": "https://registry.npmjs.org/path-expression-matcher/-/path-expression-matcher-1.6.2.tgz",
      "integrity": "sha512-enSlaiat05iasnzmgNxRj8reFdj3puY2QpNgP1aPIaVfT6nn9ICuPoFlKHk8EN22HcwewshO+mN2DGbkCEOtqQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/NaturalIntelligence"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/path-to-regexp": {
      "version": "0.1.13",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-0.1.13.tgz",
      "integrity": "sha512-A/AGNMFN3c8bOlvV9RreMdrv7jsmF9XIfDeCd87+I8RNg6s78BhJxMu69NEMHBSJFxKidViTEdruRwEk/WIKqA==",
      "license": "MIT"
    },
    "node_modules/proxy-addr": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
      "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
      "license": "MIT",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/qs": {
      "version": "6.15.3",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.15.3.tgz",
      "integrity": "sha512-O9gl3zCl5h5blw1KGUzQKhA5oUXSl8rwUIM5o0S3nCXMliSvy5Dzx7/DJcI+SwgICv+IneSZwhBh1oSyEHA71A==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "es-define-property": "^1.0.1",
        "side-channel": "^1.1.1"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/range-parser": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
      "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/raw-body": {
      "version": "2.5.3",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-2.5.3.tgz",
      "integrity": "sha512-s4VSOf6yN0rvbRZGxs8Om5CWj6seneMwK3oDb4lWDH0UPhWcxwOWw5+qk24bxq87szX1ydrwylIOp2uG1ojUpA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.4.24",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/readable-stream": {
      "version": "3.6.2",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.2.tgz",
      "integrity": "sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==",
      "license": "MIT",
      "dependencies": {
        "inherits": "^2.0.3",
        "string_decoder": "^1.1.1",
        "util-deprecate": "^1.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/send": {
      "version": "0.19.2",
      "resolved": "https://registry.npmjs.org/send/-/send-0.19.2.tgz",
      "integrity": "sha512-VMbMxbDeehAxpOtWJXlcUS5E8iXh6QmN+BkRX1GARS3wRaXEEgzCcB10gTQazO42tpNIya8xIyNx8fll1OFPrg==",
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "1.2.0",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "fresh": "~0.5.2",
        "http-errors": "~2.0.1",
        "mime": "1.6.0",
        "ms": "2.1.3",
        "on-finished": "~2.4.1",
        "range-parser": "~1.2.1",
        "statuses": "~2.0.2"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/send/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/serve-static": {
      "version": "1.16.3",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-1.16.3.tgz",
      "integrity": "sha512-x0RTqQel6g5SY7Lg6ZreMmsOzncHFU7nhnRWkKgWuMTu5NN0DR5oruckMqRvacAN9d5w6ARnRBXl9xhDCgfMeA==",
      "license": "MIT",
      "dependencies": {
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "parseurl": "~1.3.3",
        "send": "~0.19.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "license": "ISC"
    },
    "node_modules/side-channel": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
      "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4",
        "side-channel-list": "^1.0.1",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/streamsearch": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/streamsearch/-/streamsearch-1.1.0.tgz",
      "integrity": "sha512-Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==",
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/string_decoder": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
      "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
      "license": "MIT",
      "dependencies": {
        "safe-buffer": "~5.2.0"
      }
    },
    "node_modules/strnum": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/strnum/-/strnum-2.4.2.tgz",
      "integrity": "sha512-rDG3Ah4TV0k1hWvLSzkZtMmLN9+eS+h3knq4MP6A42Y3Yh5qGNnOUs1jJkoSr8FG5dsL28c7KgkIBzSEykqtuw==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/NaturalIntelligence"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "anynum": "^1.0.1"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/tsx": {
      "version": "4.23.12",
      "resolved": "https://registry.npmjs.org/tsx/-/tsx-4.23.12.tgz",
      "integrity": "sha512-FDf4L4sYzKtzWYhU/Xm0AQFdTjdIxNo9ElTf2mxXM6k8YMHXzYUe4yODVaXP4V9uMFbVg8c0qyBccK2OOxb45Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "esbuild": "~0.28.0"
      },
      "bin": {
        "tsx": "dist/cli.mjs"
      },
      "engines": {
        "node": ">=18.0.0"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.2.tgz",
      "integrity": "sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/android-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.2.tgz",
      "integrity": "sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/android-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.2.tgz",
      "integrity": "sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/android-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.2.tgz",
      "integrity": "sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.2.tgz",
      "integrity": "sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/darwin-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.2.tgz",
      "integrity": "sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.2.tgz",
      "integrity": "sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.2.tgz",
      "integrity": "sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/linux-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.2.tgz",
      "integrity": "sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/linux-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.2.tgz",
      "integrity": "sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/linux-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.2.tgz",
      "integrity": "sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/linux-loong64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.2.tgz",
      "integrity": "sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.2.tgz",
      "integrity": "sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.2.tgz",
      "integrity": "sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.2.tgz",
      "integrity": "sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/linux-s390x": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.2.tgz",
      "integrity": "sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/linux-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.2.tgz",
      "integrity": "sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.2.tgz",
      "integrity": "sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.2.tgz",
      "integrity": "sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.2.tgz",
      "integrity": "sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/sunos-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.2.tgz",
      "integrity": "sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/win32-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.2.tgz",
      "integrity": "sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/win32-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.2.tgz",
      "integrity": "sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/@esbuild/win32-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.2.tgz",
      "integrity": "sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx/node_modules/esbuild": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz",
      "integrity": "sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.2",
        "@esbuild/android-arm": "0.28.2",
        "@esbuild/android-arm64": "0.28.2",
        "@esbuild/android-x64": "0.28.2",
        "@esbuild/darwin-arm64": "0.28.2",
        "@esbuild/darwin-x64": "0.28.2",
        "@esbuild/freebsd-arm64": "0.28.2",
        "@esbuild/freebsd-x64": "0.28.2",
        "@esbuild/linux-arm": "0.28.2",
        "@esbuild/linux-arm64": "0.28.2",
        "@esbuild/linux-ia32": "0.28.2",
        "@esbuild/linux-loong64": "0.28.2",
        "@esbuild/linux-mips64el": "0.28.2",
        "@esbuild/linux-ppc64": "0.28.2",
        "@esbuild/linux-riscv64": "0.28.2",
        "@esbuild/linux-s390x": "0.28.2",
        "@esbuild/linux-x64": "0.28.2",
        "@esbuild/netbsd-arm64": "0.28.2",
        "@esbuild/netbsd-x64": "0.28.2",
        "@esbuild/openbsd-arm64": "0.28.2",
        "@esbuild/openbsd-x64": "0.28.2",
        "@esbuild/openharmony-arm64": "0.28.2",
        "@esbuild/sunos-x64": "0.28.2",
        "@esbuild/win32-arm64": "0.28.2",
        "@esbuild/win32-ia32": "0.28.2",
        "@esbuild/win32-x64": "0.28.2"
      }
    },
    "node_modules/type-is": {
      "version": "1.6.18",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-1.6.18.tgz",
      "integrity": "sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==",
      "license": "MIT",
      "dependencies": {
        "media-typer": "0.3.0",
        "mime-types": "~2.1.24"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/typedarray": {
      "version": "0.0.6",
      "resolved": "https://registry.npmjs.org/typedarray/-/typedarray-0.0.6.tgz",
      "integrity": "sha512-/aCDEGatGvZ2BIk+HmLf4ifCJFwvKFNb9/JeZPMulfgFracn9QFcAf5GO8B/mweUjSoblS5In0cWhqpfs/5PQA==",
      "license": "MIT"
    },
    "node_modules/typescript": {
      "version": "5.8.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.8.3.tgz",
      "integrity": "sha512-p1diW6TqL9L07nNxvRMM7hMMw4c5XOo/1ibL4aAIGmSAt9slTE1Xgw5KWuof2uTOvCg9BY7ZRi+GaF+7sfgPeQ==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "license": "MIT"
    },
    "node_modules/utils-merge": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/utils-merge/-/utils-merge-1.0.1.tgz",
      "integrity": "sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4.0"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/xml-naming": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/xml-naming/-/xml-naming-0.3.0.tgz",
      "integrity": "sha512-ghig2TBE/H11aOVgmahA3MhimvkBr6JIYknH/Dhdk10nXwdbIqBJsbfMxpvFPG8bAw77gN29aQWvKpmVoPlvPQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/NaturalIntelligence"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=16.0.0"
      }
    }
  }
}


--- SIH-2026/backend/package.json ---

{
  "name": "disaster-intelligence-backend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "lint": "tsc --noEmit -p tsconfig.json",
    "test": "node --import tsx/esm --test tests/**/*.test.ts"
  },
  "dependencies": {
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "fast-xml-parser": "^5.11.0",
    "multer": "^2.2.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/multer": "^2.2.0",
    "@types/node": "^22.14.0",
    "esbuild": "^0.25.0",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2"
  }
}


--- SIH-2026/backend/server.ts ---

import { createServer } from 'http';
import { createApp } from './server/app';

async function startServer() {
  const app = createApp({ mode: 'dev', serveStatic: false });
  const port = Number(process.env.PORT || 3000);

  const server = createServer(app);

  server.listen(port, '0.0.0.0', () => {
    console.log(`Disaster Intelligence Platform API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend server:', error);
  process.exit(1);
});


--- SIH-2026/backend/tsconfig.json ---

{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": ["ES2022"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "esModuleInterop": true,
    "types": ["node"]
  },
  "include": ["server/**/*.ts", "tests/**/*.ts"]
}


--- SIH-2026/backend/tests/archiveEraDiscovery.test.ts ---

import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFilteredIndiaArchive } from '../server/aiGateway';

test('1990s archive filter returns era-discovered disasters without requiring RSS citations', async () => {
  const items = await buildFilteredIndiaArchive(3, { decadeFilter: '1990s' });

  assert.ok(items.length > 0);
  assert.ok(items.every((item) => item.decade === '1990s'));
  assert.ok(items.every((item) => item.eventDate));
});


--- SIH-2026/backend/tests/citationValidation.test.ts ---

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateAndCleanCitations } from '../server/lib/evidenceUtils.ts';
import { CitedSource } from '../server/types/disaster.ts';

describe('Citation ID Validation (Section 23 / Section 94)', () => {
  const mockSources: CitedSource[] = [
    {
      id: 'S1',
      title: 'NDRF Cyclone Fani Preparedness Briefing',
      publisher: 'The Hindu',
      publishedAt: '2019-05-02T10:00:00Z',
      url: 'https://thehindu.com/news/national/fani-preparedness',
      summary: 'Over 1.2 million people evacuated in coastal Odisha.',
    },
    {
      id: 'S2',
      title: 'IMD Landfall Bulletin No. 24',
      publisher: 'IMD',
      publishedAt: '2019-05-03T08:00:00Z',
      url: 'https://mausam.imd.gov.in/fani-landfall',
      summary: 'Storm made landfall near Puri with winds up to 175 kmph.',
    },
    {
      id: 'S3',
      title: 'Odisha Government Relief and Recovery Report',
      publisher: 'NDTV',
      publishedAt: '2019-05-06T14:00:00Z',
      url: 'https://ndtv.com/odisha-relief-fani',
      summary: 'Power infrastructure severely damaged in Puri and Khordha.',
    },
  ];

  it('preserves valid citation IDs [S1] and [S2]', () => {
    const rawText = 'Evacuation began on May 2 [S1] and landfall occurred on May 3 [S2].';
    const cleaned = validateAndCleanCitations(rawText, mockSources);
    assert.strictEqual(cleaned, 'Evacuation began on May 2 [S1] and landfall occurred on May 3 [S2].');
  });

  it('strips nonexistent citation [S7] and preserves valid [S1] (Section 94 Test)', () => {
    const rawText = 'Cyclone hit coastal belt [S1], and 400 hospitals damaged [S7].';
    const cleaned = validateAndCleanCitations(rawText, mockSources);
    // [S7] is stripped cleanly
    assert.strictEqual(cleaned, 'Cyclone hit coastal belt [S1], and 400 hospitals damaged .');
  });

  it('normalizes case sensitivity e.g. [s3] to [S3]', () => {
    const rawText = 'Relief distribution began rapidly [s3].';
    const cleaned = validateAndCleanCitations(rawText, mockSources);
    assert.strictEqual(cleaned, 'Relief distribution began rapidly [S3].');
  });
});



--- SIH-2026/backend/tests/eventSourceRelevance.test.ts ---

import test from 'node:test';
import assert from 'node:assert/strict';
import { filterSourcesForEvent } from '../server/lib/evidenceUtils';

const articles = [
  {
    title: 'Cyclone Amphan: West Bengal counts damage after 2020 landfall',
    summary: 'The cyclone hit West Bengal in May 2020, killing people and damaging homes.',
  },
  {
    title: 'South Korea heatwave warning issued',
    summary: 'Officials warned residents about high temperatures and health risks.',
  },
  {
    title: 'Kerala heat warning as temperatures rise',
    summary: 'A weather alert was issued for several Kerala districts in India.',
  },
  {
    title: 'Kathua landslide blocks highway',
    summary: 'A landslide damaged a road after heavy rain in Jammu and Kashmir.',
  },
  {
    title: 'Cyclone Nivar alert for Tamil Nadu coast',
    summary: 'Authorities prepared shelters as Cyclone Nivar approached in 2020.',
  },
];

test('event-specific source gate excludes Amphan-adjacent but off-topic articles', () => {
  const filtered = filterSourcesForEvent(articles, {
    eventName: 'Cyclone Amphan',
    disasterType: 'Cyclone',
    state: 'West Bengal',
    approxDate: '2020-05-20',
  });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].title, articles[0].title);
});


--- SIH-2026/backend/tests/historicalResearchPipeline.test.ts ---

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractCasualtyNumericClaims,
  filterIncidentEvidenceArticles,
  validateAndCleanCitations,
} from '../server/lib/evidenceUtils';
import { normalizeHistoricalEventQuery } from '../server/aiGateway';

test('normalizes common Indian disaster typos and aliases before retrieval', () => {
  assert.equal(normalizeHistoricalEventQuery('gujrat earthquake 2001').normalizedQuery, '2001 Gujarat earthquake');
  assert.equal(normalizeHistoricalEventQuery('amfan').normalizedQuery, 'Cyclone Amphan');
  assert.equal(normalizeHistoricalEventQuery('waynad landslide').normalizedQuery, '2024 Wayanad landslide');
  assert.equal(normalizeHistoricalEventQuery('bhuj earthqake').normalizedQuery, '2001 Gujarat earthquake');
  assert.equal(normalizeHistoricalEventQuery('Cyclone Amphan').normalizedQuery, 'Cyclone Amphan');
});

test('extracts headline casualty figures as structured death claims', () => {
  const claims = extractCasualtyNumericClaims([
    {
      id: 'S1',
      title: 'At least 16 killed as heavy rain triggers landslides, flash floods across north and east India',
      summary: 'Nagaland heavy rain and landslides disrupted several districts.',
    },
  ]);

  assert.equal(claims.length, 1);
  assert.equal(claims[0].value, 16);
  assert.equal(claims[0].metric, 'deaths');
  assert.equal(claims[0].qualifier, 'at least');
});

test('incident evidence filter does not pass articles on year alone', () => {
  const filtered = filterIncidentEvidenceArticles([
    {
      title: "When this astrologer was arrested for creating panic post-2001 Kutch quake",
      summary: 'The article profiles an astrologer and does not provide disaster impact facts.',
    },
    {
      title: '2001 Gujarat earthquake killed thousands and damaged homes in Kutch',
      summary: 'The quake caused casualties, housing damage and relief operations in Gujarat.',
    },
  ]);

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].title, '2001 Gujarat earthquake killed thousands and damaged homes in Kutch');
});

test('citation cleanup normalizes fullwidth source brackets and removes fake ids', () => {
  const cleaned = validateAndCleanCitations('Damage was reported 【S1】 and another claim used ［S9］.', [
    { id: 'S1', title: 'Source', publisher: 'Publisher', publishedAt: '2026-01-01', url: 'https://example.com', summary: 'Summary' },
  ]);

  assert.equal(cleaned, 'Damage was reported [S1] and another claim used .');
});


--- SIH-2026/backend/tests/localization.test.ts ---

import assert from 'node:assert/strict';
import test from 'node:test';
import { getTranslation, hazardLabel, translate } from '../../frontend/src/types/language.ts';

test('application locale copy falls back safely and interpolates counts', () => {
  assert.equal(translate('hi', 'present.activeHazards', { count: 2 }), '2 सक्रिय खतरे');
  assert.equal(translate('en', 'history.sourcesCount', { count: 1 }), '1 source');
  assert.equal(translate('en', 'history.sourcesCount', { count: 3 }), '3 sources');
  assert.equal(translate('unknown-locale', 'common.close'), 'Close');
  assert.deepEqual(getTranslation('unknown-locale'), getTranslation('en'));
});

test('hazard identifiers remain stable while only their rendered label changes', () => {
  const category = 'Flood';
  assert.equal(category, 'Flood');
  assert.equal(hazardLabel('hi', category), 'बाढ़');
  assert.equal(hazardLabel('bn', category), 'বন্যা');
  assert.equal(hazardLabel('unknown-locale', category), category);
});


--- SIH-2026/backend/tests/moderation.test.ts ---

import assert from 'node:assert/strict';
import test from 'node:test';
import { moderateChatInput } from '../server/lib/moderation.ts';

test('chat moderation permits normal disaster research', () => {
  assert.deepEqual(moderateChatInput('What flood warnings are active in Assam?'), { allowed: true });
});

test('chat moderation blocks normalized abuse and threats', () => {
  assert.equal(moderateChatInput('You are an 1d10t').allowed, false);
  assert.equal(moderateChatInput('kill yourself').allowed, false);
  assert.equal(moderateChatInput('চোদা').allowed, false);
});

test('chat moderation rejects oversized input', () => {
  assert.equal(moderateChatInput('x'.repeat(4001)).allowed, false);
});


--- SIH-2026/backend/tests/newsRelevanceFilter.test.ts ---

import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreIncidentEvidence } from '../server/lib/evidenceUtils';

test('incident evidence filter rejects disconnected prediction technology news', () => {
  const score = scoreIncidentEvidence({
    title: 'New AI model to predict floods in India',
    summary: 'Researchers unveil a system for early warning and planning.',
  });

  assert.equal(score, 0);
});

test('incident evidence filter keeps actual disaster reports', () => {
  const score = scoreIncidentEvidence({
    title: 'Wayanad landslides: 23 dead, rescue teams continue operations',
    summary: 'NDRF teams evacuated villagers after homes were damaged in the district.',
  });

  assert.ok(score > 0);
});


--- SIH-2026/backend/tests/numericReconciliation.test.ts ---

import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileNumericClaims } from '../server/lib/evidenceUtils';

test('numeric reconciliation keeps a tight casualty cluster', () => {
  const result = reconcileNumericClaims([23, 28, 32]);

  assert.equal(result.rangeMin, 23);
  assert.equal(result.rangeMax, 32);
  assert.deepEqual(result.outliers, []);
});

test('numeric reconciliation excludes one clear outlier', () => {
  const result = reconcileNumericClaims([
    { value: 23, sourceId: 'S1', text: '23 deaths reported' },
    { value: 28, sourceId: 'S2', text: '28 people killed' },
    { value: 500, sourceId: 'S3', text: '500 deaths claimed' },
  ]);

  assert.equal(result.rangeMin, 23);
  assert.equal(result.rangeMax, 28);
  assert.deepEqual(result.outliers, [500]);
  assert.equal(result.outlierClaims[0].sourceId, 'S3');
});

test('numeric reconciliation handles a no-conflict single value', () => {
  const result = reconcileNumericClaims([12]);

  assert.equal(result.rangeMin, 12);
  assert.equal(result.rangeMax, 12);
  assert.deepEqual(result.outliers, []);
});


--- SIH-2026/backend/tests/relevanceEngine.test.ts ---

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  evaluateLocationRelevance,
  isPointInPolygon,
  minDistanceToPolygon,
  calculateHaversineDistance,
  isAlertExpired,
  generatePlainLanguageSummary,
} from '../server/lib/relevanceEngine.ts';
import { SachetAlert, UserLocation } from '../server/types/disaster.ts';

describe('Location Relevance Engine - 5 Cases & Boundary Verification', () => {
  // Polygon enclosing Bhubaneswar area (~20.25 to 20.35 Lat, 85.78 to 85.88 Lng)
  const odishaCycloneAlert: SachetAlert = {
    id: 'OD-CYC-2026-01',
    identifier: 'SACHET-OD-CYC-01',
    sender: 'IMD Bhubaneswar',
    sent: new Date().toISOString(),
    status: 'Actual',
    msgType: 'Alert',
    source: 'SACHET/NDMA',
    scope: 'Public',
    category: 'Cyclone',
    rawCategory: 'Cyclone',
    event: 'Severe Cyclonic Storm Warning',
    urgency: 'Immediate',
    severity: 'Extreme',
    certainty: 'Observed',
    headline: 'Severe Cyclone Warning for Coastal Odisha (Khordha & Puri)',
    description: 'Squally winds 90-100 kmph gusting to 115 kmph expected.',
    instruction: 'Fishermen advised not to venture into sea. Evacuate low-lying areas immediately.',
    areaDesc: 'Khordha, Puri and Cuttack districts',
    polygon: {
      type: 'Polygon',
      coordinates: [
        [20.20, 85.70],
        [20.40, 85.70],
        [20.40, 85.95],
        [20.20, 85.95],
        [20.20, 85.70],
      ],
    },
    effective: new Date(Date.now() - 3600000).toISOString(),
    expires: new Date(Date.now() + 86400000).toISOString(),
    isExpired: false,
  };

  const rajasthanEarthquakeAlert: SachetAlert = {
    id: 'RJ-EQ-2026-02',
    identifier: 'SACHET-RJ-EQ-02',
    sender: 'NCS New Delhi',
    sent: new Date().toISOString(),
    status: 'Actual',
    msgType: 'Alert',
    source: 'SACHET/NDMA',
    scope: 'Public',
    category: 'Earthquake',
    rawCategory: 'Earthquake',
    event: 'Earthquake Magnitude 4.8',
    urgency: 'Immediate',
    severity: 'Moderate',
    certainty: 'Observed',
    headline: 'Earthquake in Bikaner, Rajasthan',
    description: 'Moderate tremors felt in Bikaner region.',
    instruction: 'Drop, Cover, and Hold On. Avoid damaged structures.',
    areaDesc: 'Bikaner District, Rajasthan',
    centroid: [28.02, 73.31], // Bikaner, Rajasthan
    state: 'Rajasthan',
    effective: new Date().toISOString(),
    expires: new Date(Date.now() + 7200000).toISOString(),
    isExpired: false,
  };

  it('Case 1: User strictly inside official polygon -> RELEVANT (0 km, exact_polygon, CRITICAL/HIGH_PRIORITY)', () => {
    const userInBhubaneswar: UserLocation = {
      lat: 20.2961, // Inside polygon
      lng: 85.8245,
      timestamp: Date.now(),
      state: 'Odisha',
      cityName: 'Bhubaneswar',
    };

    const res = evaluateLocationRelevance(userInBhubaneswar, odishaCycloneAlert);
    assert.strictEqual(res.status, 'CRITICAL');
    assert.strictEqual(res.distanceKm, 0);
    assert.strictEqual(res.confidence, 'exact_polygon');
    assert.strictEqual(res.isInsideBoundary, true);
    assert.ok(res.reason.includes('directly inside'));
  });

  it('Case 2 & Boundary Test: User just outside polygon edge (~12 km away) -> NEARBY (not false WARNING inside boundary)', () => {
    // Lat 20.20 to 20.40, Lng 85.70 to 85.95
    // User at 20.48, 85.82 (just north of Cuttack border, ~9 km away)
    const userJustOutside: UserLocation = {
      lat: 20.48,
      lng: 85.82,
      timestamp: Date.now(),
      state: 'Odisha',
      cityName: 'Choudwar',
    };

    const res = evaluateLocationRelevance(userJustOutside, odishaCycloneAlert);
    assert.strictEqual(res.isInsideBoundary, false);
    assert.ok(res.distanceKm > 0 && res.distanceKm < 30);
    assert.strictEqual(res.confidence, 'polygon_distance');
    // Threshold for Cyclone is 150 km, so user at ~9 km is in WARNING / NEARBY zone with clear distance indicator
    assert.ok(res.status === 'WARNING' || res.status === 'NEARBY');
  });

  it('Boundary Case: User far outside polygon (> 150 km) -> NOT_RELEVANT', () => {
    const userInKolkata: UserLocation = {
      lat: 22.5726,
      lng: 88.3639, // ~360 km away from Bhubaneswar
      timestamp: Date.now(),
      state: 'West Bengal',
      cityName: 'Kolkata',
    };

    const res = evaluateLocationRelevance(userInKolkata, odishaCycloneAlert);
    assert.strictEqual(res.status, 'NOT_RELEVANT');
    assert.strictEqual(res.isInsideBoundary, false);
    assert.ok(res.distanceKm > 150);
  });

  it('Irrelevant Alert: User in Bhubaneswar receiving Rajasthan earthquake alert -> NO WARNING (NOT_RELEVANT)', () => {
    const userInBhubaneswar: UserLocation = {
      lat: 20.2961,
      lng: 85.8245,
      timestamp: Date.now(),
      state: 'Odisha',
      cityName: 'Bhubaneswar',
    };

    const res = evaluateLocationRelevance(userInBhubaneswar, rajasthanEarthquakeAlert);
    assert.strictEqual(res.status, 'NOT_RELEVANT');
    assert.ok(res.distanceKm > 1000); // Over 1300 km away
  });

  it('Case 3: Official Circle Alert -> Inside vs Outside buffer', () => {
    const circleAlert: SachetAlert = {
      id: 'KL-FLD-01',
      identifier: 'SACHET-KL-01',
      sender: 'KSDMA',
      sent: new Date().toISOString(),
      status: 'Actual',
      msgType: 'Alert',
      source: 'SACHET/NDMA',
      scope: 'Public',
      category: 'Flood',
      rawCategory: 'Flood',
      event: 'Flash Flood Advisory',
      urgency: 'Expected',
      severity: 'Severe',
      certainty: 'Likely',
      headline: 'Flash flood alert for Idukki Dam downstream',
      description: 'Water discharge increased.',
      instruction: 'Move to elevated shelters.',
      areaDesc: 'Idukki downstream',
      circle: {
        center: [9.85, 76.97],
        radiusKm: 25,
      },
      effective: new Date().toISOString(),
      expires: new Date(Date.now() + 36000000).toISOString(),
      isExpired: false,
    };

    const userInsideCircle: UserLocation = {
      lat: 9.87,
      lng: 76.98,
      timestamp: Date.now(),
      state: 'Kerala',
    };

    const res = evaluateLocationRelevance(userInsideCircle, circleAlert);
    assert.strictEqual(res.distanceKm, 0);
    assert.strictEqual(res.isInsideBoundary, true);
    assert.strictEqual(res.confidence, 'circle');
  });

  it('Case 4: Centroid only -> approximate confidence label', () => {
    const userInBikaner: UserLocation = {
      lat: 28.05,
      lng: 73.35,
      timestamp: Date.now(),
      state: 'Rajasthan',
      cityName: 'Bikaner',
    };

    const res = evaluateLocationRelevance(userInBikaner, rajasthanEarthquakeAlert);
    assert.strictEqual(res.status, 'NEARBY');
    assert.strictEqual(res.confidence, 'approximate_centroid');
    assert.ok(res.confidenceLabel.includes('approximate — precise boundary unavailable'));
  });

  it('Case 5: Administrative State match without coordinates -> regional_match', () => {
    const adminAlert: SachetAlert = {
      id: 'AS-RAIN-01',
      identifier: 'SACHET-AS-01',
      sender: 'ASDMA',
      sent: new Date().toISOString(),
      status: 'Actual',
      msgType: 'Alert',
      source: 'SACHET/NDMA',
      scope: 'Public',
      category: 'Heavy Rain',
      rawCategory: 'Heavy Rain',
      event: 'Heavy Rainfall Warning',
      urgency: 'Expected',
      severity: 'Moderate',
      certainty: 'Likely',
      headline: 'Heavy rains in Assam',
      description: 'Heavy to very heavy rainfall expected across Assam.',
      instruction: 'Take shelter during intense showers.',
      areaDesc: 'Assam State',
      state: 'Assam',
      effective: new Date().toISOString(),
      expires: new Date(Date.now() + 86400000).toISOString(),
      isExpired: false,
    };

    const userInGuwahati: UserLocation = {
      lat: 0,
      lng: 0,
      timestamp: Date.now(),
      state: 'Assam',
      cityName: 'Guwahati',
    };

    const res = evaluateLocationRelevance(userInGuwahati, adminAlert);
    assert.strictEqual(res.status, 'AWARENESS_ONLY');
    assert.strictEqual(res.confidence, 'regional_match');
  });

  it('Deterministic Plain-Language Summary Generator', () => {
    const summary = generatePlainLanguageSummary(odishaCycloneAlert);
    assert.ok(summary.startsWith('Official Extreme Severe Cyclonic Storm Warning is active for'));
    assert.ok(summary.includes('Khordha, Puri and Cuttack districts'));
  });

  it('Alert Expiry Enforcement (Section 77A)', () => {
    const expiredAlert: SachetAlert = {
      ...odishaCycloneAlert,
      expires: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    };
    assert.strictEqual(isAlertExpired(expiredAlert), true);

    const activeAlert: SachetAlert = {
      ...odishaCycloneAlert,
      expires: new Date(Date.now() + 3600000).toISOString(), // 1 hour future
    };
    assert.strictEqual(isAlertExpired(activeAlert), false);
  });
});



--- SIH-2026/backend/tests/temporalGate.test.ts ---

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { evaluateTemporalGate, deduplicateNewsArticles } from '../server/lib/evidenceUtils.ts';
import { NewsArticle } from '../server/types/disaster.ts';

describe('News Temporal Gate & Deduplication (Sections 17, 60, 93)', () => {
  const currentTestTime = new Date('2026-08-20T12:00:00.000Z');

  it('accepts recent article from yesterday within 72h window', () => {
    const yesterdayDate = new Date('2026-08-19T10:00:00.000Z').toISOString();
    const res = evaluateTemporalGate(yesterdayDate, currentTestTime, 72);
    assert.strictEqual(res.isEligible, true);
    assert.strictEqual(res.recencyVerified, true);
    assert.ok(res.relativeTime.includes('ago'));
  });

  it('rejects old article from 2025 in 2026 (Section 93 Test)', () => {
    const old2025Date = new Date('2025-05-15T08:00:00.000Z').toISOString();
    const res = evaluateTemporalGate(old2025Date, currentTestTime, 72);
    assert.strictEqual(res.isEligible, false);
    assert.strictEqual(res.recencyVerified, true);
    assert.ok(res.reason?.includes('older than 72 hours'));
  });

  it('rejects future timestamp and marks recency unverified', () => {
    const futureDate = new Date('2026-08-25T12:00:00.000Z').toISOString();
    const res = evaluateTemporalGate(futureDate, currentTestTime, 72);
    assert.strictEqual(res.isEligible, false);
    assert.strictEqual(res.recencyVerified, false);
    assert.strictEqual(res.relativeTime, 'recency unverified');
  });

  it('handles invalid / unparseable dates gracefully without throwing', () => {
    const res = evaluateTemporalGate('invalid-date-string', currentTestTime, 72);
    assert.strictEqual(res.isEligible, false);
    assert.strictEqual(res.recencyVerified, false);
    assert.strictEqual(res.relativeTime, 'recency unverified');
  });

  it('deduplicates articles by normalized URL and title similarity', () => {
    const articles: NewsArticle[] = [
      {
        id: '1',
        title: 'Cyclone Warning Issued for Odisha Coast',
        summary: 'IMD warns of heavy rain.',
        url: 'https://timesofindia.indiatimes.com/india/cyclone-warning-odisha/?utm_source=rss',
        publisher: 'Times of India',
        publishedAt: '2026-08-20T08:00:00Z',
        relativeTime: '4h ago',
        recencyVerified: true,
        isWithinTemporalGate: true,
      },
      {
        id: '2', // Duplicate URL with different query parameters
        title: 'Cyclone Warning Issued for Odisha Coast!',
        summary: 'IMD warns of heavy rain.',
        url: 'https://timesofindia.indiatimes.com/india/cyclone-warning-odisha/#section',
        publisher: 'Times of India',
        publishedAt: '2026-08-20T08:00:00Z',
        relativeTime: '4h ago',
        recencyVerified: true,
        isWithinTemporalGate: true,
      },
      {
        id: '3',
        title: 'Relief Teams Pre-Positioned in Puri and Khordha',
        summary: 'NDRF deployed.',
        url: 'https://ndtv.com/odisha/ndrf-deployed',
        publisher: 'NDTV',
        publishedAt: '2026-08-20T09:00:00Z',
        relativeTime: '3h ago',
        recencyVerified: true,
        isWithinTemporalGate: true,
      },
    ];

    const deduped = deduplicateNewsArticles(articles);
    assert.strictEqual(deduped.length, 2);
    assert.strictEqual(deduped[0].id, '1');
    assert.strictEqual(deduped[1].id, '3');
  });
});



--- SIH-2026/backend/server/aiGateway.ts ---

import {
  EvidenceBundle,
  CitedSource,
  TimelineEvent,
  ConflictingReport,
  NewsArticle,
  DisasterCategory,
} from './types/disaster';
import type { HistoricalDisasterItem } from './data/historicalDisasters';
import {
  deduplicateNewsArticles,
  extractCasualtyNumericClaims,
  filterIncidentEvidenceArticles,
  filterSourcesForEvent,
  reconcileNumericClaims,
  scoreIncidentEvidence,
  validateAndCleanCitations,
} from './lib/evidenceUtils';
import { coerceIsoDate, formatDisasterDate } from './lib/dateFormat';
import { normalizeLang, translateArray, translateText } from './lib/translate';
import { searchGoogleNews } from './googleNews';

const evidenceBundleCache = new Map<string, { expiresAt: number; bundle: EvidenceBundle }>();
const recentArchiveCache = new Map<string, { expiresAt: number; items: HistoricalDisasterItem[] }>();
const eraDiscoveryCache = new Map<string, { expiresAt: number; events: EraDisasterSeed[] }>();
let recentArchiveWarmupStarted = false;
const EVIDENCE_BUNDLE_CACHE_TTL_MS = 10 * 60 * 1000;
const RECENT_ARCHIVE_CACHE_TTL_MS = 20 * 60 * 1000;
const ERA_DISCOVERY_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
type GroqKeyScope = 'default' | 'past' | 'pastFilters' | 'chat' | 'stt' | 'tts';
type EraDisasterSeed = {
  eventName: string;
  approxDate: string;
  eventDate?: string;
  location: string;
  state?: string;
  disasterType: DisasterCategory;
};
const RECENT_ARCHIVE_QUERIES = [
  'India flood',
  'India cyclone',
  'India earthquake',
  'India landslide',
  'India heavy rain',
  'India heat wave',
  'India thunderstorm',
  'India lightning',
  'India forest fire',
  'India drought',
  'India urban flood',
  'India avalanche',
];
const INDIAN_STATES = [
  'andaman and nicobar islands',
  'andhra pradesh',
  'arunachal pradesh',
  'assam',
  'bihar',
  'chhattisgarh',
  'goa',
  'gujarat',
  'haryana',
  'himachal pradesh',
  'jharkhand',
  'karnataka',
  'kerala',
  'ladakh',
  'madhya pradesh',
  'maharashtra',
  'manipur',
  'meghalaya',
  'mizoram',
  'nagaland',
  'odisha',
  'punjab',
  'rajasthan',
  'sikkim',
  'tamil nadu',
  'telangana',
  'tripura',
  'uttarakhand',
  'uttar pradesh',
  'west bengal',
  'delhi',
  'jammu and kashmir',
  'puducherry',
];

export type NormalizedHistoricalEvent = {
  originalQuery: string;
  normalizedQuery: string;
  aliases: string[];
  disasterType?: DisasterCategory;
  location?: string;
  state?: string;
  year?: number;
  eventDate?: string;
  confidence: number;
};

type EvidenceCoverage = {
  eventConfirmed: boolean;
  eventNameConfidence: number;
  relevantSourceCount: number;
  distinctPublisherCount: number;
  overview: boolean;
  eventDate: boolean;
  location: boolean;
  affectedAreas: boolean;
  casualtyData: boolean;
  injuryData: boolean;
  displacementData: boolean;
  infrastructureDamage: boolean;
  economicImpact: boolean;
  governmentResponse: boolean;
  rescueRelief: boolean;
  recovery: boolean;
  meaningfulTimelineEntries: number;
  sourceRelevanceScore: number;
  evidenceDepthScore: number;
  overallQualityScore: number;
  qualifies: boolean;
};

const NORMALIZATION_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bgujrat\b/gi, 'Gujarat'],
  [/\bgujarath\b/gi, 'Gujarat'],
  [/\bgujrath\b/gi, 'Gujarat'],
  [/\bearthqake\b/gi, 'earthquake'],
  [/\bearthquak\b/gi, 'earthquake'],
  [/\berthquake\b/gi, 'earthquake'],
  [/\bwaynad\b/gi, 'Wayanad'],
  [/\bwayanad landslides\b/gi, 'Wayanad landslide'],
  [/\bamfan\b/gi, 'Cyclone Amphan'],
  [/\bamphan cyclone\b/gi, 'Cyclone Amphan'],
  [/\buttrakahand\b/gi, 'Uttarakhand'],
  [/\buttrakhand\b/gi, 'Uttarakhand'],
  [/\borrisa\b/gi, 'Odisha'],
  [/\borissa\b/gi, 'Odisha'],
  [/\bkutch quake\b/gi, 'Bhuj earthquake'],
  [/\bbhuj quake\b/gi, 'Bhuj earthquake'],
];

const KNOWN_EVENT_ALIASES: Array<{
  match: RegExp;
  event: Omit<NormalizedHistoricalEvent, 'originalQuery'>;
}> = [
    {
      match: /\b(2001\s+)?(gujarat|bhuj|kutch).*(earthquake|quake)|\b(republic day earthquake)\b/i,
      event: {
        normalizedQuery: '2001 Gujarat earthquake',
        aliases: ['Bhuj earthquake', 'Kutch earthquake', 'Republic Day earthquake Gujarat 2001'],
        disasterType: 'Earthquake',
        location: 'Bhuj and Kutch',
        state: 'Gujarat',
        year: 2001,
        eventDate: '2001-01-26T00:00:00.000Z',
        confidence: 0.96,
      },
    },
    {
      match: /\b(amphan|amfan)\b/i,
      event: {
        normalizedQuery: 'Cyclone Amphan',
        aliases: ['2020 Cyclone Amphan', 'Amphan West Bengal cyclone'],
        disasterType: 'Cyclone',
        location: 'West Bengal and Odisha coast',
        state: 'West Bengal',
        year: 2020,
        eventDate: '2020-05-20T00:00:00.000Z',
        confidence: 0.95,
      },
    },
    {
      match: /\b(wayanad|waynad).*(landslide|landslides)\b/i,
      event: {
        normalizedQuery: '2024 Wayanad landslide',
        aliases: ['Wayanad landslides', 'Chooralmala Mundakkai landslide'],
        disasterType: 'Landslide',
        location: 'Wayanad',
        state: 'Kerala',
        year: 2024,
        eventDate: '2024-07-30T00:00:00.000Z',
        confidence: 0.94,
      },
    },
    {
      match: /\b(1999\s+)?(odisha|orissa).*(super cyclone|cyclone)\b/i,
      event: {
        normalizedQuery: '1999 Odisha Super Cyclone',
        aliases: ['1999 Orissa cyclone', 'Odisha super cyclone'],
        disasterType: 'Cyclone',
        location: 'Odisha coast',
        state: 'Odisha',
        year: 1999,
        eventDate: '1999-10-29T00:00:00.000Z',
        confidence: 0.94,
      },
    },
    {
      match: /\b(2018\s+)?kerala.*flood/i,
      event: {
        normalizedQuery: '2018 Kerala floods',
        aliases: ['Kerala floods 2018'],
        disasterType: 'Flood',
        location: 'Kerala',
        state: 'Kerala',
        year: 2018,
        eventDate: '2018-08-15T00:00:00.000Z',
        confidence: 0.9,
      },
    },
  ];

function getGroqBaseUrl(): string {
  return process.env.GROQ_BASE_URL?.trim() || 'https://api.groq.com/openai/v1';
}

function getGroqChatModels(): string[] {
  return (process.env.GROQ_MODEL_FALLBACKS || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean);
}

function getGroqSttModel(): string {
  return process.env.GROQ_STT_MODEL?.trim() || 'whisper-large-v3-turbo';
}

function getGroqTtsModel(): string {
  return process.env.GROQ_TTS_MODEL?.trim() || 'canopylabs/orpheus-v1-english';
}

function getGroqTtsVoice(): string {
  return process.env.GROQ_TTS_VOICE?.trim() || 'austin';
}

export function isGroqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY?.trim());
}

function getGroqKey(scope: GroqKeyScope = 'default'): string {
  const scopeEnvMap: Record<Exclude<GroqKeyScope, 'default'>, string[]> = {
    past: ['GROQ_API_KEY_PAST', 'GROQ_API_KEY_HISTORY', 'GROQ_API_KEY'],
    pastFilters: ['GROQ_API_KEY_PAST_FILTERS'],
    chat: ['GROQ_API_KEY_CHAT', 'GROQ_API_KEY_ASSISTANT', 'GROQ_API_KEY'],
    stt: ['GROQ_API_KEY_STT', 'GROQ_API_KEY_AUDIO', 'GROQ_API_KEY'],
    tts: ['GROQ_API_KEY_TTS', 'GROQ_API_KEY_AUDIO', 'GROQ_API_KEY'],
  };

  const envNames =
    scope === 'default'
      ? ['GROQ_API_KEY']
      : scopeEnvMap[scope];

  for (const envName of envNames) {
    const apiKey = process.env[envName]?.trim();
    if (apiKey) return apiKey;
  }

  const label = scope === 'default' ? 'GROQ_API_KEY' : envNames.join(' or ');
  throw new Error(`${label} is not configured.`);
}

function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
}

function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[(S\d+)\]/gi, ' ')
    .replace(/[*_`>#-]+/g, ' ')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeGeneratedReply(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

async function translatePreservingCitations(text: string, targetLanguage?: string): Promise<string> {
  const lang = normalizeLang(targetLanguage);
  if (lang === 'en') return text;

  const citations = Array.from(new Set(text.match(/\[S\d+\]/gi) || []));
  const placeholders = citations.map((citation, idx) => ({
    citation,
    token: `__CITE_${idx}__`,
  }));

  let working = text;
  for (const { citation, token } of placeholders) {
    working = working.replace(new RegExp(citation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), token);
  }

  const translated = await translateText(working, lang);

  let restored = translated;
  for (const { citation, token } of placeholders) {
    restored = restored.replace(new RegExp(token, 'g'), citation.toUpperCase());
  }

  return restored;
}

function inferDisasterType(text: string): DisasterCategory {
  const lower = text.toLowerCase();
  if (lower.includes('cyclone') || lower.includes('storm')) return 'Cyclone';
  if (lower.includes('flood') || lower.includes('inundat') || lower.includes('waterlogging')) return 'Flood';
  if (lower.includes('earthquake') || lower.includes('quake') || lower.includes('seismic') || lower.includes('tremor')) return 'Earthquake';
  if (lower.includes('landslide') || lower.includes('mudslide') || lower.includes('rockfall')) return 'Landslide';
  if (lower.includes('heat wave') || lower.includes('heatwave') || lower.includes('heat')) return 'Heat Wave';
  if (lower.includes('thunderstorm')) return 'Thunderstorm';
  if (lower.includes('lightning')) return 'Lightning';
  if (lower.includes('heavy rain') || lower.includes('rain')) return 'Heavy Rain';
  if (lower.includes('forest fire') || lower.includes('wildfire')) return 'Forest Fire';
  if (lower.includes('drought')) return 'Drought';
  if (lower.includes('avalanche')) return 'Avalanche';
  return 'General Alert';
}

function inferState(text: string): string {
  const lower = text.toLowerCase();
  for (const state of INDIAN_STATES) {
    if (lower.includes(state)) {
      return state.replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  if (lower.includes('odisha') || lower.includes('puri') || lower.includes('bhubaneswar')) return 'Odisha';
  if (lower.includes('kerala') || lower.includes('wayanad') || lower.includes('kochi')) return 'Kerala';
  if (lower.includes('assam') || lower.includes('guwahati')) return 'Assam';
  if (lower.includes('tamil nadu') || lower.includes('chennai')) return 'Tamil Nadu';
  if (lower.includes('maharashtra') || lower.includes('mumbai')) return 'Maharashtra';
  if (lower.includes('uttarakhand') || lower.includes('dehradun')) return 'Uttarakhand';
  if (lower.includes('himachal') || lower.includes('shimla')) return 'Himachal Pradesh';
  if (lower.includes('rajasthan') || lower.includes('jaipur')) return 'Rajasthan';
  if (lower.includes('gujarat') || lower.includes('ahmedabad')) return 'Gujarat';
  if (lower.includes('west bengal') || lower.includes('kolkata')) return 'West Bengal';
  if (lower.includes('delhi') || lower.includes('ncr')) return 'Delhi';

  return 'India';
}

function inferLocation(text: string, fallbackState: string): string {
  const lower = text.toLowerCase();
  const separators = [',', ' - ', ' near ', ' in '];
  for (const sep of separators) {
    const idx = lower.indexOf(sep);
    if (idx > 0) {
      const raw = text.slice(0, idx).trim();
      if (raw.length >= 3) return raw;
    }
  }

  if (fallbackState !== 'India') return fallbackState;
  return 'India';
}

function deriveYearFromBundle(bundle: EvidenceBundle): number {
  const eventDate = coerceIsoDate(bundle.eventDate);
  if (eventDate) return new Date(eventDate).getFullYear();
  const dateRangeYear = bundle.dateRange?.match(/\b(19\d\d|20\d\d)\b/)?.[0];
  if (dateRangeYear) return Number(dateRangeYear);
  return new Date(bundle.synthesizedAt).getFullYear();
}

function formatCasualtyRange(range: ReturnType<typeof reconcileNumericClaims>): string | null {
  if (!range.rangeMin && !range.rangeMax) return null;
  const base = range.rangeMin === range.rangeMax
    ? `${range.rangeMin.toLocaleString('en-IN')} reported casualties/deaths in retrieved source claims.`
    : `${range.rangeMin.toLocaleString('en-IN')}-${range.rangeMax.toLocaleString('en-IN')} reported casualties/deaths across clustered source claims.`;
  if (!range.outliers.length) return base;
  return `${base} Outlier claim(s) ${range.outliers.map((value) => value.toLocaleString('en-IN')).join(', ')} excluded from the range.`;
}

function extractCandidateFacts(sources: CitedSource[]): Record<string, string[]> {
  const patterns: Record<string, RegExp> = {
    casualties: /\b(?:\d[\d,]*\s+(?:people\s+)?(?:dead|deaths?|killed|fatalit(?:y|ies)|injured|missing)|(?:dead|deaths?|killed|injured|missing|casualties)[^.;]{0,80}\d[\d,]*)\b/gi,
    damage: /\b(?:₹|rs\.?|inr|crore|lakh|damage(?:d)?|collapsed?|washed away|destroyed|houses?|roads?|bridges?|power|infrastructure)[^.;]{0,140}/gi,
    response: /\b(?:ndrf|sdrf|evacuat(?:ed|ion)|rescued?|relief|shelter|army|navy|air force|government|administration)[^.;]{0,140}/gi,
    location: /\b(?:district|village|state|coast|city|town|taluk|block|panchayat)[^.;]{0,120}/gi,
    dates: /\b(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+(?:19|20)\d{2}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(?:19|20)\d{2}|\b(?:19|20)\d{2}\b)/gi,
  };

  return Object.fromEntries(Object.entries(patterns).map(([key, pattern]) => [
    key,
    sources.flatMap((source) => {
      const text = `${source.title}. ${source.summary}`;
      return Array.from(text.matchAll(pattern))
        .map((match) => `[${source.id}] ${match[0].replace(/\s+/g, ' ').trim()}`)
        .slice(0, 3);
    }).slice(0, 10),
  ]));
}

function sanitizeUnavailableField(value: string, facts: string[], fallback: string): string {
  if (facts.length && /information unavailable|not available|not clearly quantified|no .*details/i.test(value)) {
    return `${fallback} ${facts.slice(0, 3).join('; ')}.`;
  }
  return value;
}

function buildNumericRangeObject(range: ReturnType<typeof reconcileNumericClaims>): EvidenceBundle['numericCasualtiesRange'] | undefined {
  if (!range.rangeMin && !range.rangeMax) return undefined;
  return {
    min: range.rangeMin,
    max: range.rangeMax,
    outliers: range.outliers,
    outlierSources: range.outlierClaims.map((claim) => ({
      value: claim.value,
      sourceIds: claim.sourceId ? [claim.sourceId] : [],
    })),
  };
}

function buildNumericConflictReports(range: ReturnType<typeof reconcileNumericClaims>): ConflictingReport[] {
  return range.outlierClaims.map((claim) => ({
    topic: 'Casualty figure outlier',
    details: `${claim.value.toLocaleString('en-IN')} was excluded from the reported casualty range as a statistical outlier${claim.sourceId ? ` [${claim.sourceId}]` : ''}.`,
    sources: claim.sourceId ? [claim.sourceId] : [],
  }));
}

function normalizeSynthesizedData(raw: any, fallbackQuery: string, sources: CitedSource[]): any {
  const fallback = buildDeterministicFallbackSynthesis(fallbackQuery, sources);
  const data = raw && typeof raw === 'object' ? raw : {};
  const textField = (key: keyof typeof fallback) =>
    typeof data[key] === 'string' && hasMeaningfulText(data[key]) ? cleanEvidenceText(data[key]) : fallback[key];
  return {
    ...fallback,
    ...data,
    eventName: typeof data.eventName === 'string' && data.eventName.trim() ? data.eventName.trim() : fallback.eventName,
    disasterType: typeof data.disasterType === 'string' && data.disasterType.trim() ? data.disasterType.trim() : fallback.disasterType,
    location: typeof data.location === 'string' && data.location.trim() ? data.location.trim() : fallback.location,
    state: typeof data.state === 'string' && data.state.trim() ? data.state.trim() : fallback.state,
    country: 'India',
    dateRange: typeof data.dateRange === 'string' && data.dateRange.trim() ? data.dateRange.trim() : fallback.dateRange,
    eventDate: coerceIsoDate(data.eventDate || data.approxDate || data.dateRange),
    reportedCasualties: textField('reportedCasualties'),
    reportedDamage: textField('reportedDamage'),
    whatHappened: textField('whatHappened'),
    affectedAreas: textField('affectedAreas'),
    humanImpact: textField('humanImpact'),
    infrastructureDamage: textField('infrastructureDamage'),
    economicImpact: textField('economicImpact'),
    governmentResponse: textField('governmentResponse'),
    rescueRelief: textField('rescueRelief'),
    recovery: textField('recovery'),
    sourceAssessment: textField('sourceAssessment'),
    conflictingReports: Array.isArray(data.conflictingReports) ? data.conflictingReports : [],
    timeline: Array.isArray(data.timeline) ? data.timeline : [],
  };
}

function sortArchiveItems(items: HistoricalDisasterItem[]): HistoricalDisasterItem[] {
  return items.sort((a, b) => {
    const aTime = a.eventDate ? new Date(a.eventDate).getTime() : NaN;
    const bTime = b.eventDate ? new Date(b.eventDate).getTime() : NaN;
    if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) return bTime - aTime;
    if (Number.isFinite(aTime)) return -1;
    if (Number.isFinite(bTime)) return 1;
    return b.year - a.year;
  });
}

function toBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Buffer.from(bytes).toString('base64');
}

async function groqChatCompletion(params: {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  keyScope?: GroqKeyScope;
}): Promise<string> {
  const apiKey = getGroqKey(params.keyScope || 'default');
  const baseUrl = getGroqBaseUrl();
  let lastError: Error | null = null;

  for (const model of [params.model, ...getGroqChatModels()].filter(Boolean)) {
    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: params.messages,
          temperature: params.temperature ?? 0.2,
          ...(params.maxTokens ? { max_completion_tokens: params.maxTokens } : {}),
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Groq chat completion failed for ${model}: HTTP ${response.status} ${text}`.trim());
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: unknown } }>;
      };
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === 'string' && content.trim()) {
        return content.trim();
      }

      throw new Error(`Groq chat completion returned an empty response for ${model}.`);
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw lastError || new Error('Groq chat completion failed.');
}

function mimeToExt(mime: string): string {
  const base = mime.split(';')[0].trim().toLowerCase();
  const map: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/mp4': 'mp4',
    'audio/mpeg': 'mp3',
    'audio/ogg': 'ogg',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/flac': 'flac',
    'audio/m4a': 'm4a',
  };
  return map[base] || 'webm';
}

export async function transcribeAudio(audio: Buffer | string, mimeType: string = 'audio/webm'): Promise<{ text: string; language?: string }> {
  const apiKey = getGroqKey('stt');
  const baseUrl = getGroqBaseUrl();
  const sttModel = getGroqSttModel();
  const audioBuffer = Buffer.isBuffer(audio)
    ? audio
    : Buffer.from(audio.replace(/^data:[^;]+;base64,/, ''), 'base64');
  const form = new FormData();
  const normalizedMime = mimeType.split(';')[0] || 'audio/webm';
  form.append('file', new Blob([audioBuffer], { type: normalizedMime }), `audio.${mimeToExt(mimeType)}`);
  form.append('model', sttModel);
  // verbose_json keeps Whisper's detected language so the client can preserve
  // the language actually spoken instead of blindly using the UI selection.
  form.append('response_format', 'verbose_json');
  form.append('temperature', '0');
  form.append(
    'prompt',
    'Transcribe the spoken disaster query accurately in the same language/script as spoken. Return only the transcription text.',
  );

  const response = await fetch(`${baseUrl}/audio/transcriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Groq transcription failed: HTTP ${response.status} ${text}`.trim());
  }

  const data = (await response.json()) as { text?: unknown; language?: unknown };
  return {
    text: String(data?.text || '').trim(),
    language: typeof data?.language === 'string' ? data.language.trim() : undefined,
  };
}

export async function generateWithFallback(params: {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: string;
  keyScope?: GroqKeyScope;
}): Promise<string | null> {
  try {
    return await groqChatCompletion({
      messages: [
        ...(params.systemInstruction
          ? [{ role: 'system' as const, content: params.systemInstruction }]
          : []),
        { role: 'user', content: params.prompt },
      ],
      temperature: params.responseMimeType === 'application/json' ? 0.1 : 0.2,
      keyScope: params.keyScope,
    });
  } catch (error) {
    console.warn('Groq generation failed:', (error as Error).message);
    return null;
  }
}

async function normalizeDisasterSearchQuery(query: string): Promise<string | null> {
  const raw = await generateWithFallback({
    keyScope: 'past',
    systemInstruction: 'Correct Indian disaster event search phrases. Return only the corrected search phrase, with no commentary.',
    prompt: `The user is searching for an Indian disaster event. Correct spelling or typo errors to the most likely real event/location name. If it is already correct, return the original phrase.\n\nQuery: ${query}`,
  });

  const normalized = raw?.replace(/^["']|["']$/g, '').replace(/\s+/g, ' ').trim();
  if (!normalized || normalized.toLowerCase() === query.toLowerCase()) return null;
  return normalized;
}

function cleanEvidenceText(value?: string): string {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function applyDeterministicNormalization(query: string): string {
  return NORMALIZATION_REPLACEMENTS.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    query.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim(),
  ).replace(/\s+/g, ' ').trim();
}

export function normalizeHistoricalEventQuery(query: string): NormalizedHistoricalEvent {
  const originalQuery = query.trim();
  const corrected = applyDeterministicNormalization(originalQuery);
  for (const alias of KNOWN_EVENT_ALIASES) {
    if (alias.match.test(corrected)) {
      return { originalQuery, ...alias.event };
    }
  }

  const year = corrected.match(/\b(19\d\d|20\d\d)\b/)?.[0];
  const disasterType = inferDisasterType(corrected);
  const state = inferState(corrected);
  const normalizedQuery = corrected
    .replace(/\bfloods\b/gi, 'flood')
    .replace(/\blandslides\b/gi, 'landslide')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    originalQuery,
    normalizedQuery,
    aliases: normalizedQuery.toLowerCase() === originalQuery.toLowerCase() ? [] : [originalQuery],
    disasterType,
    location: inferLocation(normalizedQuery, state),
    state,
    year: year ? Number(year) : undefined,
    eventDate: coerceIsoDate(normalizedQuery),
    confidence: normalizedQuery === originalQuery ? 0.72 : 0.84,
  };
}

function buildHistoricalResearchQueries(event: NormalizedHistoricalEvent, categoryFilter?: string, stateFilter?: string): string[] {
  const base = event.normalizedQuery || event.originalQuery;
  const location = stateFilter || event.state || event.location || '';
  const type = categoryFilter || event.disasterType || '';
  const year = event.year ? String(event.year) : '';
  const aliases = [base, ...event.aliases].filter(Boolean);
  const dimensions = [
    '',
    'India',
    'what happened history impact',
    'casualties deaths injured missing',
    'affected districts villages towns',
    'houses damaged infrastructure roads bridges power',
    'economic loss damage estimate',
    'rescue relief evacuation government response',
    'timeline aftermath recovery reconstruction',
    'official report',
  ];

  const queries = aliases.flatMap((alias) =>
    dimensions.map((dimension) => [alias, year && !alias.includes(year) ? year : '', location, type, dimension]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()),
  );

  return Array.from(new Set(queries)).slice(0, 18);
}

function publisherKey(source: Pick<CitedSource, 'publisher'>): string {
  return source.publisher.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() || 'unknown';
}

function hasMeaningfulText(value?: string | null): boolean {
  if (!value) return false;
  const normalized = cleanEvidenceText(value).toLowerCase();
  if (normalized.length < 24) return false;
  const placeholders = [
    'information unavailable',
    'no information available',
    'details were not clearly quantified',
    'details were referenced',
    'were referenced in the retrieved source coverage',
    'were summarized in the retrieved source coverage',
    'requires external archival corroboration',
    'documented in source coverage',
    'documented in cited journalism',
    'state disaster management authority and ndrf mobilization recorded',
    'shelter operations, dry food packets, and medical deployment',
    'long-term rehabilitation and infrastructure reconstruction initiatives',
  ];
  if (placeholders.some((phrase) => normalized.includes(phrase))) return false;
  return /[a-z]/i.test(normalized.replace(/\[S\d+\]/gi, ''));
}

function extractBestFact(sources: CitedSource[], topic: keyof ReturnType<typeof extractCandidateFacts>, fallback = ''): string {
  const facts = extractCandidateFacts(sources)[topic] || [];
  return facts.length ? facts.slice(0, 3).join('; ') + '.' : fallback;
}

function hasSubstantiveImpactText(text: string): boolean {
  return /\b(killed|dead|deaths?|injured|missing|displaced|evacuat|affected|damage|destroyed|collapsed|washed away|crore|lakh|houses?|roads?|bridges?|power|relief|rescue|shelter|recovery|reconstruction)\b/i.test(text);
}

function buildEvidenceCoverage(bundle: Pick<EvidenceBundle,
  'eventName' | 'eventDate' | 'dateRange' | 'location' | 'state' | 'sources' | 'whatHappened' |
  'affectedAreas' | 'reportedCasualties' | 'humanImpact' | 'reportedDamage' | 'infrastructureDamage' |
  'economicImpact' | 'governmentResponse' | 'rescueRelief' | 'recovery' | 'timeline'
>): EvidenceCoverage {
  const sourceText = bundle.sources.map((s) => `${s.title} ${s.summary}`).join(' ');
  const distinctPublisherCount = new Set(bundle.sources.map(publisherKey)).size;
  const eventConfirmed = bundle.sources.some((source) => scoreIncidentEvidence(source) >= 2);
  const casualtyData = hasMeaningfulText(bundle.reportedCasualties) || /killed|dead|death|fatalit|injured|missing/i.test(sourceText);
  const infrastructureDamage = hasMeaningfulText(bundle.infrastructureDamage) || /damage|destroyed|collapsed|washed away|houses?|roads?|bridges?|power|infrastructure/i.test(sourceText);
  const economicImpact = hasMeaningfulText(bundle.economicImpact) || /(?:rs\.?|inr|crore|lakh|economic|loss|crop|agriculture)/i.test(sourceText);
  const governmentResponse = hasMeaningfulText(bundle.governmentResponse) || /\bgovernment|ndrf|sdrf|army|navy|administration|evacuat/i.test(sourceText);
  const rescueRelief = hasMeaningfulText(bundle.rescueRelief) || /\brescue|relief|shelter|food|medicine|camp/i.test(sourceText);
  const recovery = hasMeaningfulText(bundle.recovery) || /\brecovery|reconstruction|rehabilitation|restoration|aftermath/i.test(sourceText);
  const meaningfulTimelineEntries = (bundle.timeline || []).filter((step) =>
    hasMeaningfulText(step.event) &&
    hasMeaningfulText(step.description) &&
    !/published|article|source|headline/i.test(`${step.event} ${step.description}`),
  ).length;
  const impactDimensions = [
    casualtyData,
    infrastructureDamage,
    economicImpact,
    governmentResponse,
    rescueRelief,
    recovery,
    hasMeaningfulText(bundle.affectedAreas),
  ].filter(Boolean).length;
  const sourceRelevanceScore = bundle.sources.length
    ? bundle.sources.reduce((sum, source) => sum + scoreIncidentEvidence(source), 0) / bundle.sources.length
    : 0;
  const evidenceDepthScore = impactDimensions + meaningfulTimelineEntries + (hasMeaningfulText(bundle.whatHappened) ? 1 : 0);
  const overallQualityScore = sourceRelevanceScore + evidenceDepthScore + Math.min(distinctPublisherCount, 3);
  const qualifies =
    eventConfirmed &&
    Boolean(bundle.eventDate || /\b(19\d\d|20\d\d)\b/.test(bundle.dateRange || bundle.eventName)) &&
    bundle.location !== 'India' &&
    hasMeaningfulText(bundle.whatHappened) &&
    impactDimensions >= 1 &&
    meaningfulTimelineEntries >= 1 &&
    (bundle.sources.length >= 2 || (bundle.sources.length === 1 && sourceRelevanceScore >= 4 && impactDimensions >= 2));

  return {
    eventConfirmed,
    eventNameConfidence: eventConfirmed ? 0.85 : 0.25,
    relevantSourceCount: bundle.sources.length,
    distinctPublisherCount,
    overview: hasMeaningfulText(bundle.whatHappened),
    eventDate: Boolean(bundle.eventDate || /\b(19\d\d|20\d\d)\b/.test(bundle.dateRange || bundle.eventName)),
    location: bundle.location !== 'India',
    affectedAreas: hasMeaningfulText(bundle.affectedAreas),
    casualtyData,
    injuryData: /\binjur/i.test(`${bundle.reportedCasualties} ${bundle.humanImpact} ${sourceText}`),
    displacementData: /\bdisplaced|evacuat/i.test(`${bundle.humanImpact} ${sourceText}`),
    infrastructureDamage,
    economicImpact,
    governmentResponse,
    rescueRelief,
    recovery,
    meaningfulTimelineEntries,
    sourceRelevanceScore,
    evidenceDepthScore,
    overallQualityScore,
    qualifies,
  };
}

function evidenceStatusFromCoverage(coverage: EvidenceCoverage): EvidenceBundle['evidenceStatus'] {
  if (
    coverage.qualifies &&
    coverage.relevantSourceCount >= 4 &&
    coverage.distinctPublisherCount >= 3 &&
    coverage.meaningfulTimelineEntries >= 2 &&
    coverage.evidenceDepthScore >= 5
  ) return 'High Confidence';
  if (coverage.qualifies && coverage.relevantSourceCount >= 2 && coverage.distinctPublisherCount >= 2) return 'Moderate Evidence';
  return 'Limited Coverage';
}

function makeEvidenceTimeline(sources: CitedSource[], eventDate?: string): TimelineEvent[] {
  const datePattern = /\b(?:\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(?:19|20)\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+(?:19|20)\d{2}|\d{4}-\d{2}-\d{2})\b/gi;
  const steps: TimelineEvent[] = [];
  const seen = new Set<string>();
  for (const source of sources) {
    const text = cleanEvidenceText(`${source.title}. ${source.summary}`);
    const dates = Array.from(text.matchAll(datePattern)).map((match) => match[0]);
    const selectedDate = dates[0] || (eventDate ? formatDisasterDate(eventDate) : '');
    if (!selectedDate) continue;
    const sentence = text.split(/(?<=[.!?])\s+/).find((part) => part.includes(dates[0] || '')) || text;
    const title = sentence.slice(0, 72).replace(/\s+\S*$/, '').trim() || source.title;
    const key = `${selectedDate}|${title.toLowerCase()}`;
    if (seen.has(key) || /published|article/i.test(sentence)) continue;
    seen.add(key);
    steps.push({
      date: selectedDate,
      event: title,
      description: `${sentence} [${source.id}]`,
      citations: [source.id],
    });
  }
  if (!steps.length && eventDate && sources[0]) {
    steps.push({
      date: formatDisasterDate(eventDate),
      event: 'Documented disaster occurrence',
      description: `${cleanEvidenceText(sources[0].summary || sources[0].title)} [${sources[0].id}]`,
      citations: [sources[0].id],
    });
  }
  return steps.slice(0, 6);
}

export async function buildHistoricalEvidenceBundle(
  userQuery: string,
  categoryFilter?: string,
  stateFilter?: string,
): Promise<EvidenceBundle> {
  const baseQuery = userQuery.trim();
  let normalizedEvent = normalizeHistoricalEventQuery(baseQuery);
  const cacheKey = JSON.stringify({
    baseQuery: baseQuery.toLowerCase(),
    normalizedQuery: normalizedEvent.normalizedQuery.toLowerCase(),
    categoryFilter: categoryFilter || '',
    stateFilter: stateFilter || '',
  });

  const cached = evidenceBundleCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.bundle;
  }

  let searchQueries = buildHistoricalResearchQueries(normalizedEvent, categoryFilter, stateFilter);

  const allArticles: NewsArticle[] = [];
  for (const q of searchQueries) {
    const res = await searchGoogleNews(q, { isCurrentNews: false, maxResults: 6 });
    allArticles.push(...res);
  }
  let eventFilterQuery = normalizedEvent.normalizedQuery;

  if (allArticles.length < 2) {
    const normalizedQuery = await normalizeDisasterSearchQuery(baseQuery);
    if (normalizedQuery) {
      normalizedEvent = normalizeHistoricalEventQuery(normalizedQuery);
      eventFilterQuery = normalizedQuery;
      const expandedQueries = buildHistoricalResearchQueries(normalizedEvent, categoryFilter, stateFilter);
      searchQueries = Array.from(new Set([...searchQueries, ...expandedQueries]));
      for (const q of expandedQueries) {
        const res = await searchGoogleNews(q, { isCurrentNews: false, maxResults: 6 });
        allArticles.push(...res);
      }
    }
  }

  const incidentArticles = filterIncidentEvidenceArticles(deduplicateNewsArticles(allArticles));
  let sourcesList = filterSourcesForEvent(incidentArticles, {
    eventName: eventFilterQuery,
    disasterType: categoryFilter || normalizedEvent.disasterType || inferDisasterType(baseQuery),
    state: stateFilter || normalizedEvent.state || inferState(baseQuery),
    approxDate: normalizedEvent.eventDate || String(normalizedEvent.year || eventFilterQuery),
  })
    .sort((a, b) => scoreIncidentEvidence(b) - scoreIncidentEvidence(a))
    .slice(0, 10);
  if (!sourcesList.length) {
    const normalizedQuery = await normalizeDisasterSearchQuery(baseQuery);
    if (normalizedQuery) {
      normalizedEvent = normalizeHistoricalEventQuery(normalizedQuery);
      eventFilterQuery = normalizedEvent.normalizedQuery;
      const correctedArticles: NewsArticle[] = [];
      const correctedQueries = buildHistoricalResearchQueries(normalizedEvent, categoryFilter, stateFilter);
      for (const q of correctedQueries) {
        const res = await searchGoogleNews(q, { isCurrentNews: false, maxResults: 6 });
        correctedArticles.push(...res);
      }
      searchQueries = Array.from(new Set([...searchQueries, ...correctedQueries]));
      sourcesList = filterSourcesForEvent(filterIncidentEvidenceArticles(correctedArticles), {
        eventName: normalizedEvent.normalizedQuery,
        disasterType: categoryFilter || normalizedEvent.disasterType || inferDisasterType(normalizedQuery),
        state: stateFilter || normalizedEvent.state || inferState(normalizedQuery),
        approxDate: normalizedEvent.eventDate || String(normalizedEvent.year || normalizedQuery),
      }).slice(0, 10);
    }
  }
  if (!sourcesList.length) {
    throw new Error('No live Google News sources were found for this query.');
  }

  const citedSources: CitedSource[] = sourcesList.map((art, idx) => ({
    id: `S${idx + 1}`,
    title: cleanEvidenceText(art.title),
    publisher: art.publisher,
    publishedAt: art.publishedAt,
    url: art.url,
    summary: cleanEvidenceText(art.summary),
    qualityScore: Math.max(20, 95 - idx * 4),
  }));

  const sourcesText = citedSources
    .map((s) => `[${s.id}] Title: ${s.title}\nPublisher: ${s.publisher} (${s.publishedAt})\nSummary: ${s.summary}\nURL: ${s.url}`)
    .join('\n\n');
  const casualtyReconciliation = reconcileNumericClaims(extractCasualtyNumericClaims(citedSources));
  const casualtyRangeText = formatCasualtyRange(casualtyReconciliation);
  const candidateFacts = extractCandidateFacts(citedSources);
  const factsText = Object.entries(candidateFacts)
    .map(([topic, facts]) => `${topic}: ${facts.length ? facts.join(' | ') : 'none extracted'}`)
    .join('\n');

  const systemInstruction = `You are a Senior Disaster Intelligence Research Architect.
Synthesize the provided disaster evidence strictly using the source documents labeled [S1], [S2], etc.
ABSOLUTE RULES:
1. Every factual statement MUST cite its source using [S1], [S2], etc.
2. NEVER invent casualty numbers, dates, locations, or source IDs.
3. If information is not provided in the sources, return an empty string for that field.
4. If sources conflict on numbers/facts, prefer a compact range when the values cluster closely (for example, 23-25). If one value is a clear outlier, do not merge it into the range; report it separately in conflictingReports and explain the likely reason for the spread.
5. Do not use article publication dates as incident chronology or event dates.
6. Timeline entries must describe disaster milestones, not source publication events.
7. Return JSON matching the requested schema.`;

  const prompt = `User Query: "${baseQuery}"
Category Filter: ${categoryFilter || 'None'}
State Filter: ${stateFilter || 'None'}
Retrieved Sources:
${sourcesText}
Per-source candidate facts extracted before synthesis:
${factsText}
Pre-computed casualty reconciliation:
${casualtyRangeText || 'No casualty/death numeric claims were confidently extracted from the source text.'}

Produce a structured historical evidence synthesis in JSON format:
{
  "eventName": "Clear event name",
  "disasterType": "Cyclone | Flood | Earthquake | Landslide | Heavy Rain | Heat Wave | General Alert",
  "location": "Affected City/District",
  "state": "State name",
  "country": "India",
  "eventDate": "ISO 8601 event date if the event occurrence date is supported by the sources",
  "dateRange": "Date or range",
  "reportedCasualties": "Reported human loss with citations",
  "reportedDamage": "Summary of infrastructure and economic loss with citations",
  "whatHappened": "3-5 factual sentences synthesizing the event with citations",
  "affectedAreas": "3-5 factual sentences on districts and communities impacted with citations",
  "humanImpact": "3-5 factual sentences on displacement, casualties, injuries, and missing people with citations",
  "infrastructureDamage": "3-5 factual sentences on power, roads, telecommunications, housing, and public infrastructure with citations",
  "economicImpact": "3-5 factual sentences on agricultural, business, and monetary loss with citations",
  "governmentResponse": "3-5 factual sentences on evacuation operations, declarations, deployments, and administration with citations",
  "rescueRelief": "3-5 factual sentences on shelters, ration distribution, medical aid, and rescue operations with citations",
  "recovery": "3-5 factual sentences on reconstruction, utility restoration, rehabilitation, and longer-term rebuilding with citations",
  "sourceAssessment": "Objective assessment of source reliability and coverage completeness",
  "conflictingReports": [{"topic": "Topic", "details": "Conflict summary", "sources": ["S1", "S2"]}],
  "timeline": [{"date": "Date string", "event": "Short title", "description": "Description with citations", "citations": ["S1"]}]
}`;

  const depthInstruction = `Write substantive narrative only where the evidence supports it. Do not output one-line placeholders, generic response claims, or boilerplate when source material lacks facts for that section.`;

  let synthesizedData: any = null;

  try {
    const rawJson = await generateWithFallback({
      prompt,
      systemInstruction: `${systemInstruction}\n${depthInstruction}`,
      responseMimeType: 'application/json',
      keyScope: categoryFilter || stateFilter ? 'pastFilters' : 'past',
    });

    if (rawJson) {
      synthesizedData = normalizeSynthesizedData(JSON.parse(stripCodeFences(rawJson)), baseQuery, citedSources);
    }
  } catch (err) {
    console.warn('Groq synthesis parse failure:', (err as Error).message);
  }

  if (!synthesizedData) {
    synthesizedData = normalizeSynthesizedData(buildDeterministicFallbackSynthesis(baseQuery, citedSources), baseQuery, citedSources);
  }

  const whatHappened = validateAndCleanCitations(synthesizedData.whatHappened || '', citedSources);
  const affectedAreas = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.affectedAreas || '', candidateFacts.location, 'Affected locations extracted from sources:'), citedSources);
  const humanImpact = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.humanImpact || '', candidateFacts.casualties, 'Human-impact facts extracted from sources:'), citedSources);
  const infrastructureDamage = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.infrastructureDamage || '', candidateFacts.damage, 'Damage facts extracted from sources:'), citedSources);
  const economicImpact = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.economicImpact || '', candidateFacts.damage, 'Economic or damage facts extracted from sources:'), citedSources);
  const governmentResponse = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.governmentResponse || '', candidateFacts.response, 'Response facts extracted from sources:'), citedSources);
  const rescueRelief = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.rescueRelief || '', candidateFacts.response, 'Rescue and relief facts extracted from sources:'), citedSources);
  const recovery = validateAndCleanCitations(synthesizedData.recovery || '', citedSources);
  const reportedCasualties = validateAndCleanCitations(
    casualtyRangeText || synthesizedData.reportedCasualties || '',
    citedSources,
  );
  const reportedDamage = validateAndCleanCitations(synthesizedData.reportedDamage || '', citedSources);

  const cleanTimeline: TimelineEvent[] = (synthesizedData.timeline || []).map((t: any) => ({
    date: t.date || 'Recorded Period',
    event: t.event || 'Incident Milestone',
    description: validateAndCleanCitations(t.description || '', citedSources),
    citations: (t.citations || []).filter((c: string) => citedSources.some((s) => s.id === c)),
  }));

  const cleanConflicts: ConflictingReport[] = [
    ...buildNumericConflictReports(casualtyReconciliation),
    ...(synthesizedData.conflictingReports || []).map((c: any) => ({
      topic: c.topic || 'Reported Figures',
      details: validateAndCleanCitations(c.details || '', citedSources),
      sources: (c.sources || []).filter((sId: string) => citedSources.some((s) => s.id === sId)),
    })),
  ];
  const eventDate = normalizedEvent.eventDate
    || coerceIsoDate(synthesizedData.eventDate || synthesizedData.dateRange)
    || coerceIsoDate([eventFilterQuery, ...candidateFacts.dates].join(' '));
  const evidenceTimeline = makeEvidenceTimeline(citedSources, eventDate);

  const draftBundle: EvidenceBundle = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    eventName: synthesizedData.eventName || normalizedEvent.normalizedQuery || baseQuery,
    disasterType: (synthesizedData.disasterType as DisasterCategory) || normalizedEvent.disasterType || inferDisasterType(eventFilterQuery),
    location: synthesizedData.location || normalizedEvent.location || 'India',
    state: synthesizedData.state || normalizedEvent.state || 'India',
    country: 'India',
    eventDate,
    dateRange: eventDate ? formatDisasterDate(eventDate) : synthesizedData.dateRange || 'Documented Occurrence',
    numericCasualtiesRange: buildNumericRangeObject(casualtyReconciliation),
    reportedCasualties: reportedCasualties || '',
    reportedDamage: reportedDamage || extractBestFact(citedSources, 'damage'),
    sources: citedSources,
    timeline: cleanTimeline.length > 0 ? cleanTimeline : evidenceTimeline,
    whatHappened: whatHappened || `${citedSources[0].summary} [${citedSources[0].id}]`,
    affectedAreas: affectedAreas || extractBestFact(citedSources, 'location'),
    humanImpact: humanImpact || (casualtyRangeText ? `${casualtyRangeText} [${citedSources[0].id}]` : extractBestFact(citedSources, 'casualties')),
    infrastructureDamage: infrastructureDamage || extractBestFact(citedSources, 'damage'),
    economicImpact: economicImpact || '',
    governmentResponse: governmentResponse || '',
    rescueRelief: rescueRelief || '',
    recovery: recovery || '',
    sourceAssessment: synthesizedData.sourceAssessment || `Retrieved ${citedSources.length} relevant source${citedSources.length === 1 ? '' : 's'} from ${new Set(citedSources.map(publisherKey)).size} publisher${new Set(citedSources.map(publisherKey)).size === 1 ? '' : 's'}.`,
    conflictingReports: cleanConflicts,
    synthesizedAt: new Date().toISOString(),
    evidenceStatus: 'Limited Coverage',
    retrievalMetadata: {
      queriesExecuted: searchQueries,
      rawSourcesCount: allArticles.length,
      dedupedSourcesCount: citedSources.length,
    },
  };
  const coverage = buildEvidenceCoverage(draftBundle);
  if (!coverage.qualifies) {
    throw new Error('Insufficient relevant historical evidence was retrieved to build a reliable dossier for this event.');
  }
  const bundle: EvidenceBundle = {
    ...draftBundle,
    evidenceStatus: evidenceStatusFromCoverage(coverage),
    sourceAssessment: draftBundle.sourceAssessment
      ? `${draftBundle.sourceAssessment} Coverage: ${coverage.relevantSourceCount} relevant source(s), ${coverage.distinctPublisherCount} distinct publisher(s), ${coverage.meaningfulTimelineEntries} incident timeline milestone(s).`
      : '',
  };

  evidenceBundleCache.set(cacheKey, {
    expiresAt: Date.now() + EVIDENCE_BUNDLE_CACHE_TTL_MS,
    bundle,
  });

  return bundle;
}

const RECENT_ARCHIVE_SEARCHES = [
  'Kerala flood 2024 India',
  'Assam flood 2024 India',
  'Himachal Pradesh landslide 2024 India',
  'Wayanad landslide 2024 India',
  'Sikkim earthquake 2023 India',
  'Odisha cyclone 2024 India',
  'Maharashtra flood 2024 India',
  'Delhi heat wave 2024 India',
  'Rajasthan flood 2024 India',
  'Tamil Nadu cyclone 2024 India',
  'Karnataka rain flood 2024 India',
  'Bihar flood 2024 India',
  'West Bengal flood 2024 India',
  'Uttarakhand landslide 2024 India',
  'Punjab flood 2024 India',
  'Gujarat heat wave 2024 India',
  'Andhra Pradesh cyclone 2024 India',
  'Telangana flood 2024 India',
  'Goa heavy rain 2024 India',
  'Arunachal Pradesh landslide 2024 India',
  'Meghalaya flood 2024 India',
  'Mizoram landslide 2024 India',
  'Nagaland heavy rain 2024 India',
  'Chhattisgarh forest fire 2024 India',
  'Ladakh avalanche 2024 India',
  'Jammu Kashmir snow avalanche 2024 India',
  'Madhya Pradesh flood 2024 India',
  'Uttar Pradesh flood 2024 India',
  'West Bengal cyclone 2024 India',
  'Bengaluru urban flood 2024 India',
  'Tripura flood 2024 India',
  'Jammu Kashmir flood 2024 India',
  'Sikkim landslide 2024 India',
  'Odisha heat wave 2024 India',
  'Haryana heat wave 2024 India',
];

function buildArchiveQueryPool(options?: {
  categoryFilter?: string;
  stateFilter?: string;
  decadeFilter?: string;
  limit?: number;
}): string[] {
  const limit = Math.max(options?.limit || 30, 1);
  const category = options?.categoryFilter?.trim() || '';
  const state = options?.stateFilter?.trim() || '';
  const decade = options?.decadeFilter?.trim() || '';
  const decadeYearHints: Record<string, string[]> = {
    '1990s': ['1993', '1998', '1999'],
    '2000s': ['2001', '2004', '2008', '2009'],
    '2010s': ['2013', '2014', '2015', '2018', '2019'],
    '2020s': ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
  };

  const searchRoots = [
    category && state ? `${state} ${category}` : '',
    state ? `${state} disaster` : '',
    category ? `India ${category}` : '',
    state && decade ? `${state} ${decade}` : '',
  ].filter(Boolean);

  const hints = decadeYearHints[decade] || ['2024', '2025', '2026'];
  const decorateQuery = (query: string) => {
    const parts = [query, category, state, decade ? hints.slice(0, 3).join(' ') : '']
      .filter(Boolean)
      .join(' ');
    return `${parts} India`.replace(/\s+/g, ' ').trim();
  };
  const targeted = searchRoots.flatMap((root) => {
    const variants = [root, `${root} flood`, `${root} disaster`, ...hints.map((year) => `${root} ${year}`)];
    return variants.map(decorateQuery);
  });

  const combined = [
    ...targeted,
    ...RECENT_ARCHIVE_SEARCHES.map(decorateQuery),
  ];
  const deduped: string[] = [];
  const seen = new Set<string>();

  for (const query of combined) {
    const key = query.toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(query);
    if (deduped.length >= Math.min(Math.max(limit * 3, 100), 240)) break;
  }

  return deduped;
}

function bundleToArchiveItem(bundle: EvidenceBundle, index: number): HistoricalDisasterItem {
  const year = deriveYearFromBundle(bundle);
  return {
    ...bundle,
    year,
    numericCasualties: bundle.numericCasualtiesRange?.max || Number(bundle.reportedCasualties?.match(/(\d[\d,]*)/)?.[1]?.replace(/,/g, '') || 0),
    decade: year < 2000 ? '1990s' : year < 2010 ? '2000s' : year < 2020 ? '2010s' : '2020s',
    id: bundle.id || `archive-${index}`,
  };
}

function makeArchiveTimeline(sources: CitedSource[], eventDate?: string): TimelineEvent[] {
  const incidentDate = eventDate ? formatDisasterDate(eventDate) : 'Recorded period';
  if (sources.length === 0) {
    return [
      {
        date: incidentDate,
        event: 'Event summary unavailable',
        description: 'No archived source timeline could be synthesized.',
        citations: [],
      },
    ];
  }

  return sources.map((source, idx) => ({
    date: incidentDate,
    event: source.title.slice(0, 48),
    description: `${source.summary} [${source.id}]`,
    citations: [source.id],
  }));
}

async function buildArchiveEvidenceBundle(query: string, index: number, seed?: EraDisasterSeed): Promise<HistoricalDisasterItem | null> {
  try {
    const bundle = await buildHistoricalEvidenceBundle(
      seed ? `${seed.eventName} ${seed.approxDate}` : query,
      seed?.disasterType,
      seed?.state,
    );
    return bundleToArchiveItem(bundle, index);
  } catch (error) {
    const message = (error as Error).message;
    if (/no live google news sources|insufficient relevant historical evidence/i.test(message)) {
      return null;
    }
    console.warn('Archive evidence research failed:', message);
    return null;
  }
}

export async function discoverEraDisasters(params: {
  decade?: string;
  state?: string;
  category?: string;
  limit: number;
}): Promise<EraDisasterSeed[]> {
  const cacheKey = JSON.stringify({
    decade: params.decade || '2020s',
    state: params.state || '',
    category: params.category || '',
    limit: params.limit,
  }).toLowerCase();
  const cached = eraDiscoveryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.events;

  const fallbackSeeds: EraDisasterSeed[] = [
    { eventName: '1999 Odisha Super Cyclone', approxDate: '1999-10-29', location: 'Odisha coast', state: 'Odisha', disasterType: 'Cyclone' },
    { eventName: '1993 Latur earthquake', approxDate: '1993-09-30', location: 'Latur and Osmanabad', state: 'Maharashtra', disasterType: 'Earthquake' },
    { eventName: '1998 Malpa landslide', approxDate: '1998-08-18', location: 'Malpa, Pithoragarh', state: 'Uttarakhand', disasterType: 'Landslide' },
    { eventName: '2001 Gujarat earthquake', approxDate: '2001-01-26', location: 'Bhuj and Kutch', state: 'Gujarat', disasterType: 'Earthquake' },
    { eventName: '2004 Indian Ocean tsunami Tamil Nadu', approxDate: '2004-12-26', location: 'Tamil Nadu coast', state: 'Tamil Nadu', disasterType: 'Tsunami' },
    { eventName: '2008 Bihar Kosi flood', approxDate: '2008-08-18', location: 'Kosi basin', state: 'Bihar', disasterType: 'Flood' },
    { eventName: '2013 Uttarakhand floods', approxDate: '2013-06-16', location: 'Kedarnath and Garhwal', state: 'Uttarakhand', disasterType: 'Flood' },
    { eventName: '2014 Kashmir floods', approxDate: '2014-09-05', location: 'Jammu and Kashmir', state: 'Jammu and Kashmir', disasterType: 'Flood' },
    { eventName: '2018 Kerala floods', approxDate: '2018-08-15', location: 'Kerala', state: 'Kerala', disasterType: 'Flood' },
    { eventName: '2020 Cyclone Amphan', approxDate: '2020-05-20', location: 'West Bengal and Odisha coast', state: 'West Bengal', disasterType: 'Cyclone' },
    { eventName: '2021 Chamoli disaster', approxDate: '2021-02-07', location: 'Chamoli', state: 'Uttarakhand', disasterType: 'Flood' },
    { eventName: '2024 Wayanad landslides', approxDate: '2024-07-30', location: 'Wayanad', state: 'Kerala', disasterType: 'Landslide' },
  ];

  const raw = await generateWithFallback({
    keyScope: 'pastFilters',
    responseMimeType: 'application/json',
    systemInstruction: 'You list only real, verifiable, well-known Indian disaster events. Return strict JSON only. Do not invent events.',
    prompt: `List up to ${Math.min(Math.max(params.limit, 1), 20)} real, notable Indian disaster events matching:
decade: ${params.decade || 'any, prefer 2020s'}
state: ${params.state || 'any'}
category: ${params.category || 'any'}
Return {"events":[{"eventName":"","approxDate":"YYYY-MM-DD or YYYY-MM","location":"","state":"","disasterType":"Cyclone | Flood | Earthquake | Landslide | Heavy Rain | Heat Wave | Tsunami | Avalanche | Forest Fire | Drought | General Alert"}]}.
Prefer high-confidence events with known names and dates.`,
  });

  let discovered: EraDisasterSeed[] = [];
  if (raw) {
    try {
      const parsed = JSON.parse(stripCodeFences(raw));
      discovered = Array.isArray(parsed?.events) ? parsed.events
        .map((event: any) => ({
          eventName: String(event.eventName || '').trim(),
          approxDate: String(event.approxDate || '').trim(),
          eventDate: coerceIsoDate(event.approxDate),
          location: String(event.location || '').trim(),
          state: String(event.state || '').trim() || undefined,
          disasterType: (event.disasterType as DisasterCategory) || 'General Alert',
        }))
        .filter((event: EraDisasterSeed) => event.eventName && event.location && event.eventDate) : [];
    } catch (error) {
      console.warn('Era discovery parse failed:', (error as Error).message);
    }
  }

  const decade = params.decade && params.decade !== 'all' ? params.decade : undefined;
  const state = params.state && params.state !== 'All States' ? params.state.toLowerCase() : undefined;
  const category = params.category && params.category !== 'all' ? params.category.toLowerCase() : undefined;
  const deterministic = fallbackSeeds.filter((event) => {
    const year = new Date(coerceIsoDate(event.approxDate) || event.approxDate).getFullYear();
    if (decade) {
      const eventDecade = year < 2000 ? '1990s' : year < 2010 ? '2000s' : year < 2020 ? '2010s' : '2020s';
      if (eventDecade !== decade) return false;
    }
    if (state && !(event.state || '').toLowerCase().includes(state) && !event.location.toLowerCase().includes(state)) return false;
    if (category && !event.disasterType.toLowerCase().includes(category)) return false;
    return true;
  });
  const merged = [...discovered, ...deterministic]
    .filter((event, idx, all) => all.findIndex((candidate) => candidate.eventName.toLowerCase() === event.eventName.toLowerCase()) === idx)
    .slice(0, params.limit);

  eraDiscoveryCache.set(cacheKey, {
    expiresAt: Date.now() + ERA_DISCOVERY_CACHE_TTL_MS,
    events: merged,
  });
  return merged;
}

export async function buildRecentIndiaArchive(limit: number = 100, options?: {
  categoryFilter?: string;
  stateFilter?: string;
  decadeFilter?: string;
}): Promise<HistoricalDisasterItem[]> {
  const cacheKey = JSON.stringify({
    limit,
    categoryFilter: options?.categoryFilter || '',
    stateFilter: options?.stateFilter || '',
    decadeFilter: options?.decadeFilter || '',
  });
  const cached = recentArchiveCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.items;
  }

  if (options?.decadeFilter && options.decadeFilter !== 'all') {
    const seeds = await discoverEraDisasters({
      decade: options.decadeFilter,
      state: options.stateFilter,
      category: options.categoryFilter,
      limit,
    });
    const results = await Promise.allSettled(
      seeds.map((seed, index) => buildArchiveEvidenceBundle(`${seed.eventName} ${seed.approxDate}`, index, seed)),
    );
    const sorted = sortArchiveItems(results
      .filter((result): result is PromiseFulfilledResult<HistoricalDisasterItem | null> => result.status === 'fulfilled')
      .map((result) => result.value)
      .filter((item): item is HistoricalDisasterItem => Boolean(item)))
      .slice(0, limit);
    recentArchiveCache.set(cacheKey, { expiresAt: Date.now() + RECENT_ARCHIVE_CACHE_TTL_MS, items: sorted });
    return sorted;
  }

  const queries = buildArchiveQueryPool({ ...options, limit });
  const archive: HistoricalDisasterItem[] = [];
  const seen = new Set<string>();
  const concurrency = 4;

  const matchesFilters = (item: HistoricalDisasterItem) => {
    if (options?.categoryFilter && options.categoryFilter !== 'all') {
      const category = options.categoryFilter.toLowerCase();
      const matchesCategory = item.disasterType.toLowerCase().includes(category) ||
        (category === 'landslide' && item.disasterType.toLowerCase().includes('avalanche'));
      if (!matchesCategory) return false;
    }
    if (options?.stateFilter && options.stateFilter !== 'All States') {
      const state = options.stateFilter.toLowerCase();
      if (!item.state.toLowerCase().includes(state) && !item.location.toLowerCase().includes(state)) return false;
    }
    if (options?.decadeFilter && options.decadeFilter !== 'all' && item.decade !== options.decadeFilter) {
      return false;
    }
    return true;
  };

  for (let i = 0; i < queries.length && archive.length < limit; i += concurrency) {
    const batch = queries.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((query, offset) => buildArchiveEvidenceBundle(query, i + offset))
    );

    for (const result of batchResults) {
      if (result.status !== 'fulfilled' || !result.value) continue;
      const item = result.value;
      if (!matchesFilters(item)) continue;
      const dedupeKey = `${item.eventName.toLowerCase()}|${item.state.toLowerCase()}|${item.dateRange.toLowerCase()}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      archive.push(item);
      if (archive.length >= limit) break;
    }

    if (archive.length >= limit) break;
  }

  const sorted = sortArchiveItems(archive).slice(0, limit);

  recentArchiveCache.set(cacheKey, {
    expiresAt: Date.now() + RECENT_ARCHIVE_CACHE_TTL_MS,
    items: sorted,
  });
  return sorted;
}

type ArchiveFilterOptions = {
  categoryFilter?: string;
  stateFilter?: string;
  decadeFilter?: string;
};

async function buildFilterSearchPlan(options: ArchiveFilterOptions, limit: number): Promise<string[]> {
  const filterSummary = [
    options.categoryFilter && options.categoryFilter !== 'all' ? `hazard: ${options.categoryFilter}` : '',
    options.stateFilter && options.stateFilter !== 'All States' ? `state: ${options.stateFilter}` : '',
    options.decadeFilter && options.decadeFilter !== 'all' ? `era: ${options.decadeFilter}` : '',
  ].filter(Boolean).join('; ') || 'all Indian disasters';

  const planned = await generateWithFallback({
    keyScope: 'pastFilters',
    responseMimeType: 'application/json',
    systemInstruction: 'You plan evidence searches for Indian disaster research. Return only JSON. Every query must target India and the requested filter. Do not invent events or facts.',
    prompt: `Create up to ${Math.min(Math.max(limit, 10), 40)} concise Google News search queries for this filter: ${filterSummary}.
Return exactly {"queries":["..."]}. Use specific Indian states, hazards, districts, or documented event names when helpful. For an era, include the era years in the queries.`,
  });

  let plannedQueries: string[] = [];
  if (planned) {
    try {
      const parsed = JSON.parse(stripCodeFences(planned));
      plannedQueries = Array.isArray(parsed?.queries)
        ? parsed.queries.filter((query: unknown): query is string => typeof query === 'string')
        : [];
    } catch (error) {
      console.warn('Filter search plan parse failed:', (error as Error).message);
    }
  }

  const generated = plannedQueries
    .map((query) => query.replace(/\s+/g, ' ').trim())
    .filter((query) => query.length >= 8 && /india/i.test(query))
    .slice(0, 40);
  const deterministicQueries = buildArchiveQueryPool({ ...options, limit });
  return Array.from(new Set([...generated, ...deterministicQueries]));
}

export async function buildFilteredIndiaArchive(
  limit: number = 100,
  options: ArchiveFilterOptions = {},
): Promise<HistoricalDisasterItem[]> {
  const safeLimit = Math.min(Math.max(Math.floor(limit) || 100, 1), 100);
  const cacheKey = `filter:${JSON.stringify({
    limit: safeLimit,
    categoryFilter: options.categoryFilter || '',
    stateFilter: options.stateFilter || '',
    decadeFilter: options.decadeFilter || '',
  })}`;
  const cached = recentArchiveCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.items;
  }

  const seeds = options.decadeFilter && options.decadeFilter !== 'all'
    ? await discoverEraDisasters({
      decade: options.decadeFilter,
      state: options.stateFilter,
      category: options.categoryFilter,
      limit: safeLimit,
    })
    : [];
  const queries = seeds.length
    ? seeds.map((seed) => `${seed.eventName} ${seed.approxDate}`)
    : await buildFilterSearchPlan(options, safeLimit);
  const archive: HistoricalDisasterItem[] = [];
  const seen = new Set<string>();
  const concurrency = 4;

  const matchesFilters = (item: HistoricalDisasterItem) => {
    if (options.categoryFilter && options.categoryFilter !== 'all') {
      const category = options.categoryFilter.toLowerCase();
      const matchesCategory = item.disasterType.toLowerCase().includes(category) ||
        (category === 'landslide' && item.disasterType.toLowerCase().includes('avalanche'));
      if (!matchesCategory) return false;
    }
    if (options.stateFilter && options.stateFilter !== 'All States') {
      const state = options.stateFilter.toLowerCase();
      const itemState = item.state.toLowerCase();
      const stateMatches = itemState === state || itemState.includes(state) ||
        (itemState === 'india' && item.location.toLowerCase().includes(state));
      if (!stateMatches) return false;
    }
    if (options.decadeFilter && options.decadeFilter !== 'all' && item.decade !== options.decadeFilter) {
      return false;
    }
    return true;
  };

  for (let i = 0; i < queries.length && archive.length < safeLimit; i += concurrency) {
    const batch = queries.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((query, offset) => buildArchiveEvidenceBundle(query, i + offset, seeds[i + offset])),
    );

    for (const result of batchResults) {
      if (result.status !== 'fulfilled' || !result.value || !matchesFilters(result.value)) continue;
      const item = result.value;
      const dedupeKey = `${item.eventName.toLowerCase()}|${item.state.toLowerCase()}|${item.dateRange.toLowerCase()}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      archive.push(item);
      if (archive.length >= safeLimit) break;
    }
  }

  const sorted = sortArchiveItems(archive).slice(0, safeLimit);
  recentArchiveCache.set(cacheKey, {
    expiresAt: Date.now() + RECENT_ARCHIVE_CACHE_TTL_MS,
    items: sorted,
  });
  return sorted;
}

export function warmRecentIndiaArchive(limit: number = 100): void {
  if (recentArchiveWarmupStarted) {
    return;
  }

  recentArchiveWarmupStarted = true;
  void buildRecentIndiaArchive(limit).catch((error) => {
    recentArchiveWarmupStarted = false;
    console.warn('Archive warmup failed:', (error as Error).message);
  });
}

function buildDeterministicFallbackSynthesis(query: string, sources: CitedSource[]) {
  const qLower = query.toLowerCase();
  let type: DisasterCategory = 'General Alert';
  if (qLower.includes('cyclon') || qLower.includes('fani') || qLower.includes('amphan')) type = 'Cyclone';
  else if (qLower.includes('flood') || qLower.includes('kerala')) type = 'Flood';
  else if (qLower.includes('earthquake') || qLower.includes('quake')) type = 'Earthquake';
  else if (qLower.includes('landslide')) type = 'Landslide';

  const facts = extractCandidateFacts(sources);
  const sourceSummary = sources.length
    ? sources.slice(0, 3).map((s) => `${cleanEvidenceText(s.summary || s.title)} [${s.id}]`).join(' ')
    : '';

  return {
    eventName: query,
    disasterType: type,
    location: inferLocation(query, inferState(query)),
    state: inferState(query),
    country: 'India',
    dateRange: coerceIsoDate(query) ? formatDisasterDate(coerceIsoDate(query)!) : 'Documented Occurrence',
    eventDate: coerceIsoDate(query),
    reportedCasualties: '',
    reportedDamage: facts.damage?.slice(0, 3).join('; ') || '',
    whatHappened: sourceSummary,
    affectedAreas: facts.location?.slice(0, 3).join('; ') || '',
    humanImpact: facts.casualties?.slice(0, 3).join('; ') || '',
    infrastructureDamage: facts.damage?.slice(0, 3).join('; ') || '',
    economicImpact: '',
    governmentResponse: facts.response?.slice(0, 3).join('; ') || '',
    rescueRelief: facts.response?.slice(0, 3).join('; ') || '',
    recovery: '',
    sourceAssessment: sources.length ? `Retrieved ${sources.length} source(s); automated synthesis was unavailable, so only extracted source fragments are shown.` : '',
    conflictingReports: [],
    timeline: makeEvidenceTimeline(sources, coerceIsoDate(query)),
  };
}

export async function compareDisasterEvents(bundles: EvidenceBundle[]): Promise<{
  comparisonPoints: { category: string; label: string; values: { eventId: string; value: string; citations: string[] }[] }[];
  aiSynthesis: { broaderImpact: string; responseDifferences: string; crossEventLessons: string; citations: string[] };
}> {
  const comparisonPoints = [
    {
      category: 'Overview',
      label: 'Disaster Type & Location',
      values: bundles.map((b) => ({
        eventId: b.id,
        value: `${b.disasterType} in ${b.location}, ${b.state} (${b.dateRange})`,
        citations: b.sources.slice(0, 1).map((s: CitedSource) => s.id),
      })),
    },
    {
      category: 'Human Impact',
      label: 'Casualties & Evacuation',
      values: bundles.map((b) => ({
        eventId: b.id,
        value: b.reportedCasualties || b.humanImpact.slice(0, 150),
        citations: b.sources.slice(0, 2).map((s: CitedSource) => s.id),
      })),
    },
    {
      category: 'Damage',
      label: 'Infrastructure & Economic Loss',
      values: bundles.map((b) => ({
        eventId: b.id,
        value: b.reportedDamage || b.infrastructureDamage.slice(0, 150),
        citations: b.sources.slice(0, 2).map((s: CitedSource) => s.id),
      })),
    },
    {
      category: 'Response',
      label: 'Government & Relief Response',
      values: bundles.map((b) => ({
        eventId: b.id,
        value: b.governmentResponse.slice(0, 150) || 'State Disaster Management response',
        citations: b.sources.slice(0, 1).map((s: CitedSource) => s.id),
      })),
    },
  ];

  const prompt = `Compare the following ${bundles.length} historical disaster events based solely on their evidence:
${bundles
      .map(
        (b, i) =>
          `Event ${i + 1}: ${b.eventName} (${b.disasterType}, ${b.location})\n` +
          `Impact: ${b.humanImpact}\nDamage: ${b.infrastructureDamage}\nResponse: ${b.governmentResponse}\nSources: ${b.sources.map((s: CitedSource) => `[${s.id}] ${s.title}`).join(', ')}`,
      )
      .join('\n\n')}

Analyze:
1. Which event had broader human/infrastructure impact?
2. How did government and rescue responses differ?
3. What key disaster preparedness lessons emerge across these events?
When sources disagree on a numeric fact, prefer a range if the values are tightly clustered and call out outliers separately.
Return JSON:
{
  "broaderImpact": "text with citations like [S1]",
  "responseDifferences": "text with citations",
  "crossEventLessons": "text with citations"
}`;

  let aiSynthesis = {
    broaderImpact: `Comparative impact analysis between ${bundles.map((b) => b.eventName).join(' and ')}.`,
    responseDifferences: `Early warning dissemination and evacuation preparedness differed based on lead time and terrain.`,
    crossEventLessons: `Key lessons include robust shelter networks, redundant communications, and staged evacuation planning.`,
    citations: bundles.flatMap((b) => b.sources.slice(0, 1).map((s: CitedSource) => s.id)),
  };

  try {
    const raw = await generateWithFallback({
      prompt,
      responseMimeType: 'application/json',
      systemInstruction: 'You are an objective disaster risk comparison analyst. Reference sources like [S1], [S2].',
      keyScope: 'past',
    });

    if (raw) {
      const parsed = JSON.parse(stripCodeFences(raw));
      const allSources = bundles.flatMap((b) => b.sources);
      aiSynthesis = {
        broaderImpact: validateAndCleanCitations(parsed.broaderImpact || aiSynthesis.broaderImpact, allSources),
        responseDifferences: validateAndCleanCitations(parsed.responseDifferences || aiSynthesis.responseDifferences, allSources),
        crossEventLessons: validateAndCleanCitations(parsed.crossEventLessons || aiSynthesis.crossEventLessons, allSources),
        citations: allSources.slice(0, 4).map((s: CitedSource) => s.id),
      };
    }
  } catch (error) {
    console.log('Groq comparison synthesis fallback:', (error as Error).message);
  }

  return { comparisonPoints, aiSynthesis };
}

export async function chatResearchAssistant(params: {
  message: string;
  history: { role: 'user' | 'assistant'; content: string }[];
  targetLanguage?: string;
  associatedBundle?: EvidenceBundle | null;
}): Promise<{
  reply: string;
  sources: CitedSource[];
}> {
  const { message, history, targetLanguage = 'en', associatedBundle } = params;
  const englishMessage = await translateText(message, 'en');

  let evidenceSources: CitedSource[] = [];
  let contextText = '';

  if (associatedBundle) {
    evidenceSources = associatedBundle.sources;
    const associatedEvent = normalizeHistoricalEventQuery(`${associatedBundle.eventName} ${associatedBundle.eventDate || associatedBundle.dateRange}`);
    const targetedQueries = buildHistoricalResearchQueries(associatedEvent, associatedBundle.disasterType, associatedBundle.state)
      .filter((query) => {
        const q = query.toLowerCase();
        const msg = englishMessage.toLowerCase();
        if (/death|died|killed|casualt|injur|missing/.test(msg)) return /casualt|death|injur|missing/.test(q);
        if (/house|damage|loss|road|bridge|power|infrastructure|crop|economic/.test(msg)) return /damage|economic|houses|infrastructure/.test(q);
        if (/rescue|relief|evacuat|government|response|ndrf|sdrf/.test(msg)) return /rescue|relief|evacuat|government/.test(q);
        if (/timeline|when|chronolog|after|before/.test(msg)) return /timeline|aftermath|history/.test(q);
        return false;
      })
      .slice(0, 4);
    if (targetedQueries.length) {
      const extraArticles: NewsArticle[] = [];
      for (const q of targetedQueries) {
        extraArticles.push(...await searchGoogleNews(q, { isCurrentNews: false, maxResults: 4 }));
      }
      const extraSources = filterSourcesForEvent(filterIncidentEvidenceArticles(deduplicateNewsArticles(extraArticles)), {
        eventName: associatedEvent.normalizedQuery,
        disasterType: associatedBundle.disasterType,
        state: associatedBundle.state,
        approxDate: associatedBundle.eventDate || associatedBundle.dateRange,
      }).slice(0, 4).map((art, idx) => ({
        id: `S${evidenceSources.length + idx + 1}`,
        title: cleanEvidenceText(art.title),
        publisher: art.publisher,
        publishedAt: art.publishedAt,
        url: art.url,
        summary: cleanEvidenceText(art.summary),
      }));
      evidenceSources = deduplicateNewsArticles([...evidenceSources, ...extraSources] as any).map((source: any, idx) => ({
        ...source,
        id: `S${idx + 1}`,
      }));
    }
    contextText = `Associated Event: ${associatedBundle.eventName} (${associatedBundle.disasterType}, ${associatedBundle.location})\n` +
      `Summary: ${associatedBundle.whatHappened}\nImpact: ${associatedBundle.humanImpact}\nDamage: ${associatedBundle.infrastructureDamage}\n` +
      `Sources:\n` +
      evidenceSources.map((s: CitedSource) => `[${s.id}] ${s.title} (${s.publisher}): ${s.summary}`).join('\n');
  } else {
    const normalizedEvent = normalizeHistoricalEventQuery(englishMessage);
    const chatQueries = buildHistoricalResearchQueries(normalizedEvent).slice(0, 8);
    let articles: NewsArticle[] = [];
    for (const q of chatQueries) {
      articles.push(...await searchGoogleNews(q, { isCurrentNews: false, maxResults: 4 }));
    }
    articles = filterSourcesForEvent(filterIncidentEvidenceArticles(deduplicateNewsArticles(articles)), {
      eventName: normalizedEvent.normalizedQuery,
      disasterType: normalizedEvent.disasterType,
      state: normalizedEvent.state,
      approxDate: normalizedEvent.eventDate || String(normalizedEvent.year || ''),
    }).slice(0, 8);
    if (articles.length < 2) {
      const normalizedQuery = await normalizeDisasterSearchQuery(englishMessage);
      if (normalizedQuery) {
        const fallbackEvent = normalizeHistoricalEventQuery(normalizedQuery);
        const fallbackArticles: NewsArticle[] = [];
        for (const q of buildHistoricalResearchQueries(fallbackEvent).slice(0, 8)) {
          fallbackArticles.push(...await searchGoogleNews(q, { isCurrentNews: false, maxResults: 4 }));
        }
        articles = filterSourcesForEvent(filterIncidentEvidenceArticles(deduplicateNewsArticles([...articles, ...fallbackArticles])), {
          eventName: fallbackEvent.normalizedQuery,
          disasterType: fallbackEvent.disasterType,
          state: fallbackEvent.state,
          approxDate: fallbackEvent.eventDate || String(fallbackEvent.year || ''),
        }).slice(0, 8);
      }
    }
    evidenceSources = articles.map((art, idx) => ({
      id: `S${idx + 1}`,
      title: art.title,
      publisher: art.publisher,
      publishedAt: art.publishedAt,
      url: art.url,
      summary: art.summary,
    }));
    contextText = `Retrieved Evidence Sources:\n` +
      evidenceSources.map((s: CitedSource) => `[${s.id}] ${s.title} (${s.publisher}): ${s.summary}`).join('\n');
  }

  const langInstruction =
    targetLanguage && targetLanguage !== 'en'
      ? `Respond fluently and naturally in the requested language code "${targetLanguage}" using accurate native script. Maintain all citation markers like [S1], [S2] intact.`
      : `Respond in clear, professional English.`;

  const systemInstruction = `You are the Lead Historical Disaster Intelligence Research Assistant.
Your goal is to answer queries strictly grounded in retrieved evidence.
RULES:
1. Support factual claims with citations [S1], [S2], etc.
2. If facts are not in the sources after checking titles and summaries, say exactly which detail could not be established from the retrieved evidence.
3. Check spelling and grammar before responding. Output only clean professional text in the requested language.
4. Use concise Markdown: short paragraphs and bullet lists. Use tables only for truly tabular comparisons.
5. Do not emit raw HTML entities such as &nbsp;.
6. Avoid boilerplate disclaimers unless the evidence is genuinely missing.
7. Use ASCII citation brackets only, such as [S1], never fullwidth citation brackets.
8. ${langInstruction}`;

  const prompt = `Conversation Context:
${history.slice(-4).map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')}

Evidence Documents:
${contextText}

User Question: "${message}"

Provide a professional, cited research answer:`;

  let reply: string = (await generateWithFallback({
    prompt,
    systemInstruction,
    keyScope: 'chat',
  })) || '';

  if (!reply) {
    reply = evidenceSources.length > 0
      ? `## Answer\n\nBased on retrieved historical records:\n\n` +
      evidenceSources.map((s) => `* **${s.title}** (${s.publisher}): ${s.summary} [${s.id}]`).join('\n\n')
      : `## Answer\n\nNo sufficiently relevant historical evidence was retrieved for this query after typo and alias normalization.`;
  }

  reply = sanitizeGeneratedReply(validateAndCleanCitations(reply, evidenceSources));
  reply = await translatePreservingCitations(reply, targetLanguage);
  reply = sanitizeGeneratedReply(reply);

  return {
    reply,
    sources: evidenceSources,
  };
}

export async function localizeEvidenceBundle(bundle: EvidenceBundle, targetLanguage?: string): Promise<EvidenceBundle> {
  const lang = normalizeLang(targetLanguage);
  if (lang === 'en') return bundle;

  const translatedSources = await Promise.all(
    bundle.sources.map(async (source) => ({
      ...source,
      title: await translateText(source.title, lang),
      summary: await translateText(source.summary, lang),
      keyFacts: source.keyFacts ? await translateArray(source.keyFacts, lang) : source.keyFacts,
    })),
  );

  const translatedTimeline = await Promise.all(
    bundle.timeline.map(async (step) => ({
      ...step,
      event: await translateText(step.event, lang),
      description: await translateText(step.description, lang),
    })),
  );

  const translatedConflicts = await Promise.all(
    bundle.conflictingReports.map(async (conflict) => ({
      ...conflict,
      topic: await translateText(conflict.topic, lang),
      details: await translateText(conflict.details, lang),
    })),
  );

  return {
    ...bundle,
    eventName: await translateText(bundle.eventName, lang),
    location: await translateText(bundle.location, lang),
    state: await translateText(bundle.state, lang),
    dateRange: await translateText(bundle.dateRange, lang),
    reportedCasualties: await translateText(bundle.reportedCasualties, lang),
    reportedDamage: await translateText(bundle.reportedDamage, lang),
    whatHappened: await translateText(bundle.whatHappened, lang),
    affectedAreas: await translateText(bundle.affectedAreas, lang),
    humanImpact: await translateText(bundle.humanImpact, lang),
    infrastructureDamage: await translateText(bundle.infrastructureDamage, lang),
    economicImpact: await translateText(bundle.economicImpact, lang),
    governmentResponse: await translateText(bundle.governmentResponse, lang),
    rescueRelief: await translateText(bundle.rescueRelief, lang),
    recovery: await translateText(bundle.recovery, lang),
    sourceAssessment: await translateText(bundle.sourceAssessment, lang),
    sources: translatedSources,
    timeline: translatedTimeline,
    conflictingReports: translatedConflicts,
  };
}

export async function generateTTSAudio(text: string, voiceName: string = getGroqTtsVoice()): Promise<string | null> {
  const apiKey = getGroqKey('tts');
  const baseUrl = getGroqBaseUrl();
  const ttsModel = getGroqTtsModel();
  const cleanText = stripMarkdownForSpeech(text).replace(/\[S\d+\]/gi, '').slice(0, 500);

  try {
    const response = await fetch(`${baseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ttsModel,
        input: cleanText,
        voice: voiceName || getGroqTtsVoice(),
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Groq TTS failed: HTTP ${response.status} ${text}`.trim());
    }

    const audioBuffer = await response.arrayBuffer();
    return toBase64(audioBuffer);
  } catch (error) {
    console.log('Groq TTS fallback:', (error as Error).message);
    return null;
  }
}



--- SIH-2026/backend/server/app.ts ---

import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import apiRouter from './routes';

export type AppMode = 'dev' | 'production' | 'vercel';

export interface CreateAppOptions {
  mode?: AppMode;
  serveStatic?: boolean;
}

function getAllowedOrigins(): Set<string> {
  const raw = [
    process.env.CORS_ORIGINS,
    process.env.FRONTEND_URL,
    process.env.APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '',
    process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5173' : '',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
  ]
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set(raw);
}

function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin as string | undefined;
  const allowedOrigins = getAllowedOrigins();

  if (origin && (allowedOrigins.size === 0 || allowedOrigins.has(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers']?.toString() ||
      'Content-Type, Authorization, If-None-Match, X-Requested-With',
  );

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express();
  const mode: AppMode =
    options.mode ||
    (process.env.VERCEL ? 'vercel' : process.env.NODE_ENV === 'production' ? 'production' : 'dev');
  const serveStatic = options.serveStatic ?? mode !== 'vercel';

  app.use(corsMiddleware);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', apiRouter);

  if (serveStatic) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}


--- SIH-2026/backend/server/googleNews.ts ---

import { XMLParser } from 'fast-xml-parser';
import { NewsArticle } from './types/disaster';
import { deduplicateNewsArticles, evaluateTemporalGate, filterIncidentEvidenceArticles } from './lib/evidenceUtils';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: true,
  trimValues: true,
});

type CacheEntry = {
  expiresAt: number;
  articles: NewsArticle[];
};

const newsCache = new Map<string, CacheEntry>();
const NEWS_CACHE_TTL_MS = 5 * 60 * 1000;

function cleanNewsText(value: string): string {
  return value
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSearchPhrase(query: string, isCurrentNews: boolean): string {
  const cleanQuery = query.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanQuery) return isCurrentNews ? 'India disaster alert' : 'India disaster';
  if (isCurrentNews) return `${cleanQuery} India disaster weather alert`;
  const hasIndia = /\bindia|indian|odisha|kerala|gujarat|bengal|uttarakhand|maharashtra|assam|bihar|tamil|karnataka|andhra|telangana|rajasthan|sikkim|kashmir|ladakh|goa|punjab|haryana|delhi\b/i.test(cleanQuery);
  return hasIndia ? cleanQuery : `${cleanQuery} India`;
}

/**
 * Searches Google News RSS for Indian disaster queries and constructs validated URLs.
 */
export async function searchGoogleNews(
  query: string,
  options: {
    isCurrentNews?: boolean; // If true, enforces strict 72h temporal gate
    windowHours?: number;
    maxResults?: number;
  } = {}
): Promise<NewsArticle[]> {
  const { isCurrentNews = false, windowHours = 72, maxResults = 12 } = options;
  const cacheKey = JSON.stringify({
    query: query.trim().toLowerCase(),
    isCurrentNews,
    windowHours,
    maxResults,
  });

  const cached = newsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.articles.slice(0, maxResults);
  }

  const searchPhrase = buildSearchPhrase(query, isCurrentNews);
  const encodedQuery = encodeURIComponent(searchPhrase);
  const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-IN&gl=IN&ceid=IN:en`;

  const articles: NewsArticle[] = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (response && response.ok) {
      const xmlText = await response.text();
      const parsed = xmlParser.parse(xmlText);

      const items = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
      const itemsArray = Array.isArray(items) ? items : [items];

      const now = new Date();

      for (let i = 0; i < itemsArray.length && articles.length < maxResults; i++) {
        const item = itemsArray[i];
        if (!item || !item.title) continue;

        const rawTitle = String(item.title || '');
        const pubDateStr = String(item.pubDate || item.published || item.updated || '');

        // Extract publisher if available in title "Headline - Publisher Name"
        let title = rawTitle;
        let publisher = item.source?.['#text'] || item.source || 'National News Media';

        if (typeof publisher === 'object') {
          publisher = publisher['#text'] || 'Media';
        }

        if (rawTitle.includes(' - ')) {
          const parts = rawTitle.split(' - ');
          if (parts.length > 1) {
            publisher = parts[parts.length - 1].trim();
            title = parts.slice(0, -1).join(' - ').trim();
          }
        }

        // Clean HTML tags from summary / description
        const rawDesc = String(item.description || item.summary || '');
        const summary = cleanNewsText(rawDesc) || cleanNewsText(title);

        const gateResult = evaluateTemporalGate(pubDateStr, now, windowHours);

        // For Present layer: strictly enforce gate
        if (isCurrentNews && !gateResult.isEligible) {
          continue;
        }

        // Direct validated Google News search URL for 100% reliable link resolution
        const validNewsUrl = item.link && item.link.startsWith('http')
          ? item.link
          : `https://news.google.com/search?q=${encodeURIComponent(title)}&hl=en-IN&gl=IN&ceid=IN:en`;

        articles.push({
          id: `gn-${Math.random().toString(36).substring(2, 9)}`,
          title,
          summary: summary.length > 280 ? summary.substring(0, 277) + '...' : summary,
          url: validNewsUrl,
          publisher: String(publisher),
          publishedAt: pubDateStr || new Date().toISOString(),
          relativeTime: gateResult.relativeTime,
          recencyVerified: gateResult.recencyVerified,
          isWithinTemporalGate: gateResult.isEligible,
          query,
        });
      }
    }
  } catch (err) {
    console.log('Google News fetch notice:', (err as Error).message);
  }

  const deduped = filterIncidentEvidenceArticles(deduplicateNewsArticles(articles)).slice(0, maxResults);
  newsCache.set(cacheKey, {
    expiresAt: Date.now() + NEWS_CACHE_TTL_MS,
    articles: deduped,
  });

  return deduped;
}



--- SIH-2026/backend/server/routes.ts ---

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { getSachetAlerts } from './sachet';
import { searchGoogleNews } from './googleNews';
import {
  buildHistoricalEvidenceBundle,
  buildRecentIndiaArchive,
  buildFilteredIndiaArchive,
  compareDisasterEvents,
  chatResearchAssistant,
  generateTTSAudio,
  transcribeAudio,
  isGroqConfigured,
  localizeEvidenceBundle,
  warmRecentIndiaArchive,
} from './aiGateway';
import { normalizeLang, resolveLocalizedPresentation, translateText } from './lib/translate';
import { moderateChatInput } from './lib/moderation';
import type { SachetAlert } from './types/disaster';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
warmRecentIndiaArchive(100);

// In-memory request limiter / counter for API cost safety (Section 14)
let globalSearchCounter = 0;
const GLOBAL_SEARCH_CEILING = 150; // resets periodically
const geocodeCache = new Map<string, { expiresAt: number; payload: any }>();
const GEOCODE_CACHE_TTL_MS = 10 * 60 * 1000;

async function translatePreservingCitations(text: string, targetLanguage?: string): Promise<string> {
  const lang = normalizeLang(targetLanguage);
  if (lang === 'en' || !text) return text;

  const citations = Array.from(new Set(text.match(/\[S\d+\]/gi) || []));
  const tokens = citations.map((citation, idx) => ({
    citation,
    token: `__CITE_${idx}__`,
  }));

  let working = text;
  for (const { citation, token } of tokens) {
    working = working.replace(new RegExp(citation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), token);
  }

  let translated = await translateText(working, lang);
  for (const { citation, token } of tokens) {
    translated = translated.replace(new RegExp(token, 'g'), citation.toUpperCase());
  }

  return translated;
}

async function localizeAlert(alert: SachetAlert, targetLanguage?: string): Promise<SachetAlert> {
  const lang = normalizeLang(targetLanguage);
  return {
    ...alert,
    event: await translateText(alert.event, lang),
    headline: await translateText(alert.headline, lang),
    description: await translateText(alert.description, lang),
    instruction: await translateText(alert.instruction, lang),
    areaDesc: await translateText(alert.areaDesc, lang),
    sourceAgency: alert.sourceAgency ? await translateText(alert.sourceAgency, lang) : alert.sourceAgency,
    sender: alert.sender ? await translateText(alert.sender, lang) : alert.sender,
    state: alert.state ? await translateText(alert.state, lang) : alert.state,
    district: alert.district ? await translateText(alert.district, lang) : alert.district,
    helpline: alert.helpline ? await translateText(alert.helpline, lang) : alert.helpline,
  };
}

function canonicalizeFilterCategory(value?: string): string | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (/all\s+hazard|^all$/.test(lower)) return undefined;
  if (lower.includes('cyclone')) return 'Cyclone';
  if (lower.includes('flood') || lower.includes('deluge')) return 'Flood';
  if (lower.includes('earthquake')) return 'Earthquake';
  if (lower.includes('tsunami')) return 'Tsunami';
  if (lower.includes('landslide') || lower.includes('avalanche')) return 'Landslide';
  if (lower.includes('heat') || lower.includes('extreme weather')) return 'Heat Wave';
  return value;
}

function canonicalizeFilterDecade(value?: string): string | undefined {
  if (!value || /^all$/i.test(value.trim())) return undefined;
  const match = value.match(/(19|20)\d{2}/);
  return match ? `${match[0].slice(0, 3)}0s` : value;
}

setInterval(() => {
  globalSearchCounter = Math.max(0, globalSearchCounter - 20);
}, 60000);

/**
 * POST /api/transcribe
 * Transcribes audio recordings from microphone using Groq Whisper.
 */
router.post('/transcribe', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!isGroqConfigured()) {
      return res.status(503).json({
        error: 'Groq is not configured on the server',
        details: 'Set GROQ_API_KEY in the server environment and restart the app.',
      });
    }

    const audioBase64 = typeof req.body.audioBase64 === 'string' ? req.body.audioBase64 : undefined;
    const mimeType = typeof req.body.mimeType === 'string' ? req.body.mimeType : req.file?.mimetype;
    if (!req.file?.buffer && !audioBase64) {
      return res.status(400).json({ error: 'Audio data is required for transcription' });
    }

    const { targetLanguage } = req.body;
    const transcription = await transcribeAudio(req.file?.buffer || audioBase64!, mimeType || 'audio/webm');
    const detectedLanguage = normalizeLang(transcription.language || 'en');
    // Keep the original transcript visible. The assistant decides the response
    // language from Whisper's detected language after the user presses Send.
    res.json({ text: transcription.text, detectedLanguage, sourceText: transcription.text, requestedLanguage: targetLanguage, success: true });
  } catch (error) {
    res.status(500).json({
      error: 'Audio transcription failed',
      details: (error as Error).message,
    });
  }
});

/**
 * GET /api/alerts
 * Returns all active official SACHET alerts with ETag support and expiry filtering.
 */
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const clientEtag = req.headers['if-none-match'];
    const result = await getSachetAlerts(typeof clientEtag === 'string' ? clientEtag : undefined);

    res.setHeader('ETag', result.etag);
    res.setHeader('Cache-Control', 'public, max-age=15');

    if (!result.isModified && clientEtag) {
      return res.status(304).end();
    }

    const categories = Array.from(new Set(result.alerts.map((a) => a.category)));
    // CAP/SACHET wording is authoritative source content. Keep it canonical and
    // let the client localize only its own surrounding UI.
    const alerts = result.alerts;

    res.json({
      alerts,
      activeCount: alerts.length,
      categoriesCount: categories.length,
      categories,
      lastUpdated: result.lastUpdated,
      cacheStatus: result.cacheStatus,
      etag: result.etag,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve SACHET alerts',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/localize/presentation
 * Resolves transient display translations while preserving canonical client data.
 */
router.post('/localize/presentation', async (req: Request, res: Response) => {
  const language = normalizeLang(typeof req.body?.language === 'string' ? req.body.language : undefined);
  const entries = Array.isArray(req.body?.entries) ? req.body.entries.slice(0, 200) : [];
  try {
    const items = await Promise.all(entries.map(async (entry: unknown, index: number) => {
      const record = entry && typeof entry === 'object' ? entry as { id?: unknown; text?: unknown } : {};
      const id = typeof record.id === 'string' ? record.id : String(index);
      const source = typeof record.text === 'string' ? record.text.slice(0, 12000) : '';
      const localized = await resolveLocalizedPresentation(source, language);
      return { id, ...localized };
    }));
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.json({ language, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to localize presentation text', details: (error as Error).message });
  }
});

/**
 * GET /api/alerts/:id/news
 * Returns temporally gated (72h default), recent news coverage for a selected alert.
 */
router.get('/alerts/:id/news', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = (req.query.q as string) || 'Odisha cyclone warning';
    const windowHours = parseInt((req.query.window as string) || '72', 10);

    const news = await searchGoogleNews(query, {
      isCurrentNews: true,
      windowHours,
      maxResults: 6,
    });

    res.setHeader('Cache-Control', 'public, max-age=60');

    res.json({
      alertId: id,
      query,
      windowHours,
      articles: news,
      count: news.length,
      retrievedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve current news for alert',
      details: (error as Error).message,
    });
  }
});

/**
 * GET /api/geocode?q=
 * Resolves a free-form Indian location query using the public Nominatim geocoder.
 */
router.get('/geocode', async (req: Request, res: Response) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!query) {
      return res.status(400).json({ error: 'Location query is required' });
    }

    const cacheKey = query.toLowerCase();
    const cached = geocodeCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader('Cache-Control', 'public, max-age=600');
      return res.json(cached.payload);
    }

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DisasterIntelligencePlatform/1.0 (geocoding)',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        error: 'Geocoding service unavailable',
      });
    }

    const results = await response.json();
    const places = Array.isArray(results)
      ? results.map((item: any) => ({
          name: item.display_name || item.name || query,
          lat: Number(item.lat),
          lng: Number(item.lon),
          state: item.address?.state || item.address?.state_district || item.address?.county || undefined,
          district: item.address?.county || item.address?.city_district || item.address?.district || undefined,
          country: item.address?.country || 'India',
          raw: item,
        }))
      : [];

    const filtered = places.filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng));

    const payload = {
      query,
      count: filtered.length,
      places: filtered,
      timestamp: new Date().toISOString(),
    };

    geocodeCache.set(cacheKey, {
      expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS,
      payload,
    });

    res.setHeader('Cache-Control', 'public, max-age=600');
    res.json(payload);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to resolve location',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/past/search
 * Searches historical disaster events and generates an EvidenceBundle with stable citations.
 */
router.post('/past/search', async (req: Request, res: Response) => {
  try {
    const { query, category, state, targetLanguage } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    if (globalSearchCounter >= GLOBAL_SEARCH_CEILING) {
      return res.status(429).json({
        error: 'Please allow results to load before searching again (Demo rate ceiling reached).',
      });
    }
    globalSearchCounter++;

    const englishQuery = await translateText(query, 'en', normalizeLang(targetLanguage));
    const bundle = await buildHistoricalEvidenceBundle(englishQuery, category, state);
    res.json({ bundle: await localizeEvidenceBundle(bundle, targetLanguage) });
  } catch (error) {
    const details = (error as Error).message;
    if (/no live google news sources were found|insufficient relevant historical evidence/i.test(details)) {
      return res.status(200).json({
        bundle: null,
        noResults: true,
        error: null,
        details: /insufficient/i.test(details)
          ? 'Insufficient relevant historical evidence was retrieved to build a reliable dossier for this event.'
          : 'No live news sources were found for this query.',
      });
    }

    res.status(500).json({
      error: 'Failed to execute historical research search',
      details,
    });
  }
});

/**
 * GET /api/past/archive
 * Returns a live recent-disaster archive built from Google News-backed evidence bundles.
 */
router.get('/past/archive', async (req: Request, res: Response) => {
  try {
    const categoryFilter = typeof req.query.category === 'string' ? req.query.category : undefined;
    const stateFilter = typeof req.query.state === 'string' ? req.query.state : undefined;
    const decadeFilter = typeof req.query.decade === 'string' ? req.query.decade : undefined;
    const targetLanguage = normalizeLang(typeof req.query.lang === 'string' ? req.query.lang : undefined);
    const items = await buildRecentIndiaArchive(100, { categoryFilter, stateFilter, decadeFilter });
    const localizedItems = targetLanguage === 'en'
      ? items
      : await Promise.all(items.map((item) => localizeEvidenceBundle(item, targetLanguage)));
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json({ items: localizedItems, count: localizedItems.length, retrievedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to build recent disaster archive',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/past/filter-search
 * Runs an explicit, filter-scoped live research pipeline. Unlike the archive
 * route, this endpoint is only called after the user presses Apply Filter.
 */
router.post('/past/filter-search', async (req: Request, res: Response) => {
  try {
    if (globalSearchCounter >= GLOBAL_SEARCH_CEILING) {
      return res.status(429).json({
        error: 'Please allow results to load before applying another filter.',
      });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const sourceLanguage = normalizeLang(typeof body.language === 'string' ? body.language : undefined);
    const translateFilter = async (value: unknown): Promise<string | undefined> => {
      if (typeof value !== 'string' || !value.trim()) return undefined;
      return (await translateText(value.trim(), 'en', sourceLanguage)).trim();
    };

    const [translatedCategory, translatedState, translatedDecade] = await Promise.all([
      translateFilter(body.category),
      translateFilter(body.state),
      translateFilter(body.decade),
    ]);

    const categoryFilter = canonicalizeFilterCategory(translatedCategory);
    const stateFilter = translatedState && !/^all\s+states?$/i.test(translatedState)
      ? translatedState
      : undefined;
    const decadeFilter = canonicalizeFilterDecade(translatedDecade);
    const requestedLimit = Number(body.limit);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(Math.floor(requestedLimit), 1), 100) : 100;

    globalSearchCounter++;
    const items = await buildFilteredIndiaArchive(limit, {
      categoryFilter,
      stateFilter,
      decadeFilter,
    });

    res.setHeader('Cache-Control', 'private, max-age=300');
    res.json({
      items,
      count: items.length,
      appliedFilters: {
        category: categoryFilter || 'all',
        state: stateFilter || 'All States',
        decade: decadeFilter || 'all',
      },
      retrievedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to apply disaster filters',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/past/compare
 * Compares 2-4 disaster events using their evidence bundles.
 */
router.post('/past/compare', async (req: Request, res: Response) => {
  try {
    const { bundles, targetLanguage } = req.body;
    if (!Array.isArray(bundles) || bundles.length < 2 || bundles.length > 4) {
      return res.status(400).json({ error: 'Select between 2 and 4 events to compare' });
    }

    const localizedBundles = await Promise.all(
      bundles.map((bundle) => localizeEvidenceBundle(bundle, targetLanguage)),
    );
    const comparison = await compareDisasterEvents(localizedBundles);
    const lang = normalizeLang(targetLanguage);
    if (lang !== 'en') {
      comparison.comparisonPoints = await Promise.all(
        comparison.comparisonPoints.map(async (point) => ({
          ...point,
          category: await translateText(point.category, lang),
          label: await translateText(point.label, lang),
          values: await Promise.all(
            point.values.map(async (value) => ({
              ...value,
              value: await translatePreservingCitations(value.value, lang),
            })),
          ),
        })),
      );
      comparison.aiSynthesis = {
        broaderImpact: await translatePreservingCitations(comparison.aiSynthesis.broaderImpact, lang),
        responseDifferences: await translatePreservingCitations(comparison.aiSynthesis.responseDifferences, lang),
        crossEventLessons: await translatePreservingCitations(comparison.aiSynthesis.crossEventLessons, lang),
        citations: comparison.aiSynthesis.citations,
      };
    }
    res.json(comparison);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate comparison matrix',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/past/chat
 * Multi-turn research assistant with multilingual voice support.
 */
router.post('/past/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, targetLanguage, associatedBundle } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const moderation = moderateChatInput(message);
    if (!moderation.allowed) {
      return res.status(422).json({
        error: 'Please rephrase your message using respectful, disaster-related language.',
        code: 'CHAT_INPUT_BLOCKED',
      });
    }

    const chatResponse = await chatResearchAssistant({
      message,
      history: Array.isArray(history) ? history : [],
      targetLanguage: targetLanguage || 'en',
      associatedBundle,
    });

    res.json(chatResponse);
  } catch (error) {
    res.status(500).json({
      error: 'AI Assistant query failed',
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/tts
 * Synthesizes speech audio for Indian languages.
 */
router.post('/tts', async (req: Request, res: Response) => {
  try {
    if (!isGroqConfigured()) {
      return res.status(503).json({
        error: 'Groq is not configured on the server',
        details: 'Set GROQ_API_KEY in the server environment and restart the app.',
      });
    }

    const { text, voiceName } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const audioBase64 = await generateTTSAudio(text, voiceName || 'Kore');
    res.json({ audioBase64 });
  } catch (error) {
    res.status(500).json({
      error: 'TTS generation failed',
      details: (error as Error).message,
    });
  }
});

/**
 * GET /api/health
 * Lightweight health endpoint with provider diagnostics.
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers: {
      sachet: 'operational',
      googleNews: 'operational',
      groqAI: isGroqConfigured() ? 'configured' : 'missing_key_fallback_active',
    },
    version: '1.0.0',
  });
});

export default router;


--- SIH-2026/backend/server/sachet.ts ---

import { XMLParser } from 'fast-xml-parser';
import { SachetAlert, DisasterCategory, AlertSeverity, AlertUrgency, AlertCertainty } from './types/disaster';
import { isAlertExpired } from './lib/relevanceEngine';

interface CacheEntry {
  etag: string;
  lastUpdated: string;
  data: SachetAlert[];
  sourceUrl?: string;
  liveSourceCount: number;
}

let sachetCache: CacheEntry = {
  etag: `sachet-${Date.now()}`,
  lastUpdated: new Date().toISOString(),
  data: [],
  liveSourceCount: 0,
};

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: true,
  trimValues: true,
});

/**
 * Normalizes raw category string from CAP feed or telemetry into our DisasterCategory enum.
 */
export function normalizeCategory(raw: string, eventName: string): DisasterCategory {
  const combined = `${raw || ''} ${eventName || ''}`.toLowerCase();

  if (combined.includes('cyclon') || combined.includes('depression') || combined.includes('gale')) return 'Cyclone';
  if (combined.includes('flood') || combined.includes('inundat')) {
    if (combined.includes('urban')) return 'Urban Flood';
    return 'Flood';
  }
  if (combined.includes('earthquake') || combined.includes('seismic') || combined.includes('tremor')) return 'Earthquake';
  if (combined.includes('landslide') || combined.includes('rockfall') || combined.includes('mudslide')) return 'Landslide';
  if (combined.includes('heat') || combined.includes('loo')) return 'Heat Wave';
  if (combined.includes('cold') || combined.includes('frost')) return 'Cold Wave';
  if (combined.includes('lightning') || combined.includes('thunderbolt')) return 'Lightning';
  if (combined.includes('thunderstorm') || combined.includes('squall')) return 'Thunderstorm';
  if (combined.includes('heavy rain') || combined.includes('rainfall') || combined.includes('downpour')) return 'Heavy Rain';
  if (combined.includes('storm')) return 'Storm';
  if (combined.includes('tsunami')) return 'Tsunami';
  if (combined.includes('avalanche')) return 'Avalanche';
  if (combined.includes('forest fire') || combined.includes('wildfire')) return 'Forest Fire';
  if (combined.includes('drought')) return 'Drought';
  if (combined.includes('air pollution') || combined.includes('smog') || combined.includes('aqi')) return 'Air Pollution';

  return 'General Alert';
}

const INDIA_BOUNDS = {
  minLat: 6.0,
  maxLat: 38.8,
  minLng: 67.5,
  maxLng: 98.8,
};

const STATE_CENTROIDS: Record<string, [number, number]> = {
  'andaman and nicobar islands': [11.7401, 92.6586],
  'andhra pradesh': [15.9129, 79.74],
  'arunachal pradesh': [28.218, 94.7278],
  assam: [26.2006, 92.9376],
  bihar: [25.0961, 85.3131],
  chhattisgarh: [21.2787, 81.8661],
  goa: [15.2993, 74.124],
  gujarat: [22.2587, 71.1924],
  haryana: [29.0588, 76.0856],
  'himachal pradesh': [31.1048, 77.1734],
  jharkhand: [23.6102, 85.2799],
  karnataka: [15.3173, 75.7139],
  kerala: [10.8505, 76.2711],
  ladakh: [34.1526, 77.577],
  'madhya pradesh': [22.9734, 78.6569],
  maharashtra: [19.7515, 75.7139],
  manipur: [24.6637, 93.9063],
  meghalaya: [25.467, 91.3662],
  mizoram: [23.1645, 92.9376],
  nagaland: [26.1584, 94.5624],
  odisha: [20.9517, 85.0985],
  punjab: [31.1471, 75.3412],
  rajasthan: [27.0238, 74.2179],
  sikkim: [27.533, 88.5122],
  'tamil nadu': [11.1271, 78.6569],
  telangana: [18.1124, 79.0193],
  tripura: [23.9408, 91.9882],
  uttarakhand: [30.0668, 79.0193],
  'uttar pradesh': [26.8467, 80.9462],
  'west bengal': [22.9868, 87.855],
  delhi: [28.6139, 77.209],
  'jammu and kashmir': [33.7782, 76.5762],
  'dadra and nagar haveli and daman and diu': [20.3974, 72.8328],
  'puducherry': [11.9416, 79.8083],
};

function isWithinIndiaBounds(lat: number, lng: number): boolean {
  return lat >= INDIA_BOUNDS.minLat && lat <= INDIA_BOUNDS.maxLat && lng >= INDIA_BOUNDS.minLng && lng <= INDIA_BOUNDS.maxLng;
}

function deriveIndicativeCentroid(...parts: Array<string | undefined | null>): [number, number] | undefined {
  const text = parts.filter(Boolean).join(' ').toLowerCase();
  if (!text) return undefined;

  for (const [needle, centroid] of Object.entries(STATE_CENTROIDS)) {
    if (text.includes(needle)) {
      return centroid;
    }
  }

  if (text.includes('bhubaneswar') || text.includes('puri') || text.includes('cuttack')) return STATE_CENTROIDS.odisha;
  if (text.includes('guwahati') || text.includes('kamrup') || text.includes('dibrugarh')) return STATE_CENTROIDS.assam;
  if (text.includes('shimla') || text.includes('kullu') || text.includes('manali')) return STATE_CENTROIDS['himachal pradesh'];
  if (text.includes('srinagar') || text.includes('jammu')) return STATE_CENTROIDS['jammu and kashmir'];
  if (text.includes('mumbai') || text.includes('raigad') || text.includes('konkan')) return STATE_CENTROIDS.maharashtra;
  if (text.includes('kozhikode') || text.includes('wayanad') || text.includes('thiruvananthapuram')) return STATE_CENTROIDS.kerala;
  if (text.includes('ahmedabad') || text.includes('surat') || text.includes('kutch')) return STATE_CENTROIDS.gujarat;
  if (text.includes('kolkata') || text.includes('sundarbans')) return STATE_CENTROIDS['west bengal'];
  if (text.includes('chennai') || text.includes('madurai') || text.includes('tirunelveli')) return STATE_CENTROIDS['tamil nadu'];
  if (text.includes('jaipur') || text.includes('bikaner') || text.includes('jaisalmer')) return STATE_CENTROIDS.rajasthan;
  if (text.includes('delhi') || text.includes('ncr') || text.includes('gurugram')) return STATE_CENTROIDS.delhi;

  const districtHints: Array<[string, [number, number]]> = [
    ['arvalli', STATE_CENTROIDS.gujarat],
    ['chhotaudepur', STATE_CENTROIDS.gujarat],
    ['chhota udaipur', STATE_CENTROIDS.gujarat],
    ['dahod', STATE_CENTROIDS.gujarat],
    ['mahisagar', STATE_CENTROIDS.gujarat],
    ['narmada', STATE_CENTROIDS.gujarat],
    ['panch mahals', STATE_CENTROIDS.gujarat],
    ['panchmahal', STATE_CENTROIDS.gujarat],
    ['sabarkantha', STATE_CENTROIDS.gujarat],
    ['sabar kantha', STATE_CENTROIDS.gujarat],
    ['banaskantha', STATE_CENTROIDS.gujarat],
    ['balrampur', STATE_CENTROIDS['chhattisgarh']],
    ['bastar', STATE_CENTROIDS['chhattisgarh']],
    ['bijapur', STATE_CENTROIDS['chhattisgarh']],
    ['dantewada', STATE_CENTROIDS['chhattisgarh']],
    ['koriya', STATE_CENTROIDS['chhattisgarh']],
    ['manendragarh', STATE_CENTROIDS['chhattisgarh']],
    ['sukma', STATE_CENTROIDS['chhattisgarh']],
    ['surajpur', STATE_CENTROIDS['chhattisgarh']],
    ['chengalpattu', STATE_CENTROIDS['tamil nadu']],
    ['cuddalore', STATE_CENTROIDS['tamil nadu']],
    ['kallakurichi', STATE_CENTROIDS['tamil nadu']],
    ['kancheepuram', STATE_CENTROIDS['tamil nadu']],
    ['pudukkottai', STATE_CENTROIDS['tamil nadu']],
    ['sivaganga', STATE_CENTROIDS['tamil nadu']],
    ['thanjavur', STATE_CENTROIDS['tamil nadu']],
    ['thiruvarur', STATE_CENTROIDS['tamil nadu']],
    ['viluppuram', STATE_CENTROIDS['tamil nadu']],
    ['ariyalur', STATE_CENTROIDS['tamil nadu']],
    ['karur', STATE_CENTROIDS['tamil nadu']],
    ['alipurduar', STATE_CENTROIDS['west bengal']],
    ['jalpaiguri', STATE_CENTROIDS['west bengal']],
    ['north dinajpur', STATE_CENTROIDS['west bengal']],
    ['south dinajpur', STATE_CENTROIDS['west bengal']],
    ['uttar dinajpur', STATE_CENTROIDS['west bengal']],
    ['dakshin dinajpur', STATE_CENTROIDS['west bengal']],
    ['dehradun', STATE_CENTROIDS.uttarakhand],
    ['tehri', STATE_CENTROIDS.uttarakhand],
    ['uttarkashi', STATE_CENTROIDS.uttarakhand],
    ['chamoli', STATE_CENTROIDS.uttarakhand],
    ['rudraprayag', STATE_CENTROIDS.uttarakhand],
    ['pithoragarh', STATE_CENTROIDS.uttarakhand],
    ['east garo hills', STATE_CENTROIDS.meghalaya],
    ['west garo hills', STATE_CENTROIDS.meghalaya],
    ['east khasi hills', STATE_CENTROIDS.meghalaya],
    ['west khasi hills', STATE_CENTROIDS.meghalaya],
    ['west jaintia hills', STATE_CENTROIDS.meghalaya],
    ['south west khasi hills', STATE_CENTROIDS.meghalaya],
    ['ri bhoi', STATE_CENTROIDS.meghalaya],
    ['bahraich', STATE_CENTROIDS['uttar pradesh']],
    ['shravasti', STATE_CENTROIDS['uttar pradesh']],
    ['saharanpur', STATE_CENTROIDS['uttar pradesh']],
    ['sonbhadra', STATE_CENTROIDS['uttar pradesh']],
    ['kamrup', STATE_CENTROIDS.assam],
    ['sonitpur', STATE_CENTROIDS.assam],
    ['dibrugarh', STATE_CENTROIDS.assam],
    ['goalpara', STATE_CENTROIDS.assam],
    ['barpeta', STATE_CENTROIDS.assam],
    ['raigad', STATE_CENTROIDS.maharashtra],
    ['ratnagiri', STATE_CENTROIDS.maharashtra],
    ['sindhudurg', STATE_CENTROIDS.maharashtra],
    ['wayanad', STATE_CENTROIDS.kerala],
    ['idukki', STATE_CENTROIDS.kerala],
    ['palakkad', STATE_CENTROIDS.kerala],
    ['bhadrak', STATE_CENTROIDS.odisha],
    ['balasore', STATE_CENTROIDS.odisha],
    ['khordha', STATE_CENTROIDS.odisha],
    ['kalahandi', STATE_CENTROIDS.odisha],
    ['koraput', STATE_CENTROIDS.odisha],
    ['jagatsinghpur', STATE_CENTROIDS.odisha],
    ['kendrapara', STATE_CENTROIDS.odisha],
    ['muzaffarpur', STATE_CENTROIDS.bihar],
    ['sitamarhi', STATE_CENTROIDS.bihar],
    ['madhubani', STATE_CENTROIDS.bihar],
    ['patna', STATE_CENTROIDS.bihar],
  ];

  for (const [needle, centroid] of districtHints) {
    if (text.includes(needle)) return centroid;
  }

  return undefined;
}

function isLikelyIndianEarthquake(place: string, lat: number, lng: number): boolean {
  if (!isWithinIndiaBounds(lat, lng)) return false;

  const text = place.toLowerCase();
  const indianHints = [
    'india',
    'assam',
    'bihar',
    'gujarat',
    'himachal pradesh',
    'jammu and kashmir',
    'karnataka',
    'kerala',
    'maharashtra',
    'odisha',
    'rajasthan',
    'sikkim',
    'tamil nadu',
    'uttarakhand',
    'west bengal',
    'delhi',
    'manipur',
    'nagaland',
    'mizoram',
    'tripura',
    'meghalaya',
    'arunachal pradesh',
    'andhra pradesh',
    'telangana',
    'punjab',
  ];

  return indianHints.some((hint) => text.includes(hint));
}

/**
 * Fetches real-time seismic events in India and surrounding fault boundaries (Lat 5-38°N, Lng 65-98°E)
 * from the official USGS Real-Time Earthquake GeoJSON API.
 */
async function fetchUSGSIndianEarthquakes(): Promise<SachetAlert[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.8&minlatitude=5.0&maxlatitude=38.0&minlongitude=65.0&maxlongitude=98.0&limit=15';
    const res = await fetch(url, { signal: controller.signal }).catch(() => null);
    clearTimeout(timeoutId);

    if (!res || !res.ok) return [];

    const json = (await res.json()) as { features?: Array<any> };
    const features = json.features || [];
    const alerts: SachetAlert[] = [];

    for (const f of features) {
      const props = f.properties || {};
      const geom = f.geometry || {};
      const [lng, lat, depth] = geom.coordinates || [0, 0, 0];

      if (!lat || !lng) continue;

      const mag = Number(props.mag || 0);
      const place = String(props.place || 'Northern Indian Subcontinent');
      const timeMs = Number(props.time || Date.now());
      const sentTime = new Date(timeMs).toISOString();
      const expiryTime = new Date(timeMs + 48 * 3600 * 1000).toISOString();

      if (!isLikelyIndianEarthquake(place, lat, lng)) {
        continue;
      }

      let severity: AlertSeverity = 'Minor';
      if (mag >= 5.5) severity = 'Extreme';
      else if (mag >= 4.5) severity = 'Severe';
      else if (mag >= 3.5) severity = 'Moderate';

      const alertId = `USGS-EQ-${f.id || Date.now()}`;
      const workingUrl = props.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${f.id}`;

      alerts.push({
        id: alertId,
        identifier: `USGS/NCS/EQ/${f.id}`,
        bulletinNo: `SEISMO-EQ-M${mag.toFixed(1)}-${f.id}`,
        sender: 'National Center for Seismology (NCS) & USGS Global Seismic Network',
        sourceAgency: 'National Center for Seismology (NCS) & USGS',
        helpline: '1070 (SEOC) | 1077 (DEOC) | 112 National Emergency',
        officialPortalUrl: 'https://seismo.gov.in',
        liveNewsQuery: `earthquake ${place} India magnitude ${mag.toFixed(1)}`,
        feedOrigin: 'NDMA_SACHET_LIVE',
        sent: sentTime,
        status: 'Actual',
        msgType: 'Alert',
        source: 'Live USGS / National Center for Seismology (NCS) Real-Time Seismic Stream',
        scope: 'Public',
        category: 'Earthquake',
        rawCategory: 'Geo / Seismic',
        event: `Seismic Activity (Magnitude ${mag.toFixed(1)})`,
        urgency: mag >= 4.5 ? 'Immediate' : 'Expected',
        severity,
        certainty: 'Observed',
        headline: `M ${mag.toFixed(1)} Earthquake Recorded near ${place}`,
        description: `A magnitude ${mag.toFixed(1)} earthquake was detected at coordinates ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E at a depth of ${depth} km. Monitored in real-time by seismic telemetry networks.`,
        instruction: mag >= 4.5
          ? '1. If indoors: DROP, COVER, and HOLD ON under sturdy furniture away from windows.\n2. If outdoors: Move to open areas away from buildings, overhead electrical wires, and steep slopes.\n3. Be prepared for potential secondary aftershocks. Check gas lines and structural cracks before re-entering buildings.'
          : 'Minor seismic tremor registered. No immediate structural damage expected. Stay calm and monitor official State Disaster Management Authority updates.',
        areaDesc: place,
        centroid: [lat, lng],
        circle: {
          center: [lat, lng],
          radiusKm: Math.max(15, mag * 18),
        },
        effective: sentTime,
        expires: expiryTime,
        isExpired: false,
        webUrl: workingUrl,
      });
    }

    return alerts;
  } catch (e) {
    console.log('USGS live seismic API notice:', (e as Error).message);
    return [];
  }
}

/**
 * Queries Open-Meteo real-time live meteorological telemetry across key Indian hazard sectors
 * and synthesizes live weather advisories with facts and figures.
 */
async function fetchOpenMeteoIndianTelemetry(): Promise<SachetAlert[]> {
  try {
    const locations = [
      { name: 'Coastal Odisha (Puri / Khordha)', state: 'Odisha', lat: 20.2961, lng: 85.8245, agency: 'IMD Coastal Cyclone Warning Center & OSDMA', helpline: '1070 (OSDMA) | 1077 (Puri) | 112', portal: 'https://osdma.org' },
      { name: 'Western Ghats / Central Kerala (Periyar Basin)', state: 'Kerala', lat: 10.1632, lng: 76.6413, agency: 'Kerala State Disaster Management Authority (KSDMA) & CWC', helpline: '1077 (KSDMA) | 1070 | 112', portal: 'https://sdma.kerala.gov.in' },
      { name: 'Himachal Western Himalayas (Kullu / Shimla)', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, agency: 'Himachal Pradesh State Disaster Management Authority (HPSDMA)', helpline: '1070 (HPSDMA) | 1077 | 112', portal: 'https://hpsdma.nic.in' },
      { name: 'Brahmaputra Valley (Guwahati / Kamrup)', state: 'Assam', lat: 26.1445, lng: 91.7362, agency: 'Assam State Disaster Management Authority (ASDMA) & CWC', helpline: '1070 (ASDMA) | 1077 | 112', portal: 'https://asdma.assam.gov.in' },
      { name: 'Konkan Coastal Belt (Mumbai / Raigad)', state: 'Maharashtra', lat: 19.076, lng: 72.8777, agency: 'IMD Regional Met Center Mumbai & BMC Disaster Cell', helpline: '1916 (BMC Disaster Cell) | 112', portal: 'https://mahasdma.maharashtra.gov.in' },
    ];

    const alerts: SachetAlert[] = [];
    const now = new Date();
    const future24 = new Date(now.getTime() + 24 * 3600 * 1000).toISOString();

    for (const loc of locations) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_gusts_10m&hourly=precipitation_probability,precipitation&timezone=Asia%2FKolkata`;
        const res = await fetch(url, { signal: controller.signal }).catch(() => null);
        clearTimeout(timeoutId);

        if (!res || !res.ok) continue;

        const data = (await res.json()) as { current?: Record<string, unknown> };
        const current = data.current || {};
        const temp = Number(current.temperature_2m || 28);
        const precip = Number(current.precipitation || 0);
        const windGust = Number(current.wind_gusts_10m || 0);
        const windSpeed = Number(current.wind_speed_10m || 0);
        const humidity = Number(current.relative_humidity_2m || 70);

        const isHighWind = windGust >= 35 || windSpeed >= 25;
        const isHeavyRain = precip >= 5;
        const isExtremeHeat = temp >= 40;

        let category: DisasterCategory = 'General Alert';
        let headline = '';
        let description = '';
        let instruction = '';
        let severity: AlertSeverity = 'Moderate';

        if (isHeavyRain) {
          category = 'Heavy Rain';
          severity = precip > 20 ? 'Extreme' : 'Severe';
          headline = `Heavy Rainfall & Inundation Watch for ${loc.name}`;
          description = `Live meteorological telemetry measures active precipitation of ${precip.toFixed(1)} mm/hr and ${humidity}% relative humidity. Localized waterlogging risk along low-lying corridors.`;
          instruction = '1. Avoid crossing waterlogged subways and low-lying river bridges.\n2. Keep emergency battery packs charged and follow local Municipal Emergency bulletins.';
        } else if (isHighWind) {
          category = 'Storm';
          severity = windGust > 60 ? 'Extreme' : 'Severe';
          headline = `Squally Wind & Gale Warning for ${loc.name}`;
          description = `Observed wind gusts of ${windGust.toFixed(1)} km/h (sustained ${windSpeed.toFixed(1)} km/h) recorded by live atmospheric sensors. Potential risk to tin roofs and loose banners.`;
          instruction = '1. Secure loose outdoor objects and stay away from overhead power transmission cables and large aged trees.\n2. Fishermen along coastal boundaries advised to heed harbor warnings.';
        } else if (isExtremeHeat) {
          category = 'Heat Wave';
          severity = temp >= 43 ? 'Extreme' : 'Severe';
          headline = `Severe Heat Wave & High Temperature Advisory for ${loc.name}`;
          description = `Live telemetry reports extreme ambient temperatures touching ${temp.toFixed(1)}°C. Elevated heat index poses acute dehydration risk.`;
          instruction = '1. Avoid direct sunlight exposure between 11:30 AM and 03:30 PM.\n2. Stay hydrated with ORS, lemon water, and buttermilk. Protect infants, elderly, and outdoor workers.';
        } else {
          category = loc.state === 'Odisha' ? 'Cyclone' : loc.state === 'Kerala' ? 'Flood' : 'General Alert';
          severity = 'Moderate';
          headline = `Live Weather Telemetry & Surveillance for ${loc.name}`;
          description = `Current live atmospheric conditions: Temperature ${temp.toFixed(1)}°C, Humidity ${humidity}%, Wind Speed ${windSpeed.toFixed(1)} km/h, Precipitation ${precip.toFixed(1)} mm. Monitored continuously.`;
          instruction = 'Stay updated with local district disaster management bulletins and NDMA SACHET early warnings. Dial 1070 or 112 for emergency queries.';
        }

        alerts.push({
          id: `MET-LIVE-${loc.state.toUpperCase().replace(/\s+/g, '')}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          identifier: `NDMA/MET/LIVE/${loc.state.substring(0, 2).toUpperCase()}/2026/08`,
          bulletinNo: `IMD-MET-${loc.state.substring(0, 2).toUpperCase()}-${Math.floor(temp)}C-${Math.floor(windGust)}K`,
          sender: loc.agency,
          sourceAgency: loc.agency,
          helpline: loc.helpline,
          officialPortalUrl: loc.portal,
          liveNewsQuery: `${category} alert ${loc.name} ${loc.state} IMD weather`,
          feedOrigin: 'NDMA_SACHET_LIVE',
          sent: now.toISOString(),
          status: 'Actual',
          msgType: 'Alert',
          source: 'Live Open-Meteo & IMD Telemetry Network',
          scope: 'Public',
          category,
          rawCategory: 'Met / Atmospheric Telemetry',
          event: headline,
          urgency: severity === 'Extreme' ? 'Immediate' : 'Expected',
          severity,
          certainty: 'Observed',
          headline,
          description,
          instruction,
          areaDesc: `${loc.name}, ${loc.state}`,
          centroid: [loc.lat, loc.lng],
          circle: {
            center: [loc.lat, loc.lng],
            radiusKm: 30,
          },
          state: loc.state,
          effective: now.toISOString(),
          expires: future24,
          isExpired: false,
          webUrl: `https://news.google.com/search?q=${encodeURIComponent(category + ' ' + loc.name + ' India weather alert')}&hl=en-IN&gl=IN&ceid=IN:en`,
        });
      } catch (innerErr) {
        // Skip to next loc
      }
    }

    return alerts;
  } catch (e) {
    console.log('Open-Meteo telemetry API notice:', (e as Error).message);
    return [];
  }
}

/**
 * Public NDMA SACHET India CAP/RSS feed.
 *
 * This is the public feed used when no agency-specific SACHET identifier
 * is available. No API key or SACHET_CAP_IDENTIFIER is required.
 */
const PUBLIC_SACHET_FEED_URL =
  'https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml';

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function asString(value: unknown, fallback = ''): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

function normalizeSeverityValue(value: unknown): AlertSeverity {
  const raw = asString(value).toLowerCase();
  if (raw === 'extreme' || raw.includes('red')) return 'Extreme';
  if (raw === 'severe' || raw.includes('orange')) return 'Severe';
  if (raw === 'moderate' || raw.includes('yellow')) return 'Moderate';
  return 'Minor';
}

function normalizeUrgencyValue(value: unknown): AlertUrgency {
  return asString(value).toLowerCase() === 'immediate' ? 'Immediate' : 'Expected';
}

function normalizeCertaintyValue(value: unknown): AlertCertainty {
  const raw = asString(value).toLowerCase();
  if (raw === 'observed') return 'Observed';
  if (raw === 'likely') return 'Likely';
  return 'Possible';
}

function parseCapPolygon(value: unknown): SachetAlert['polygon'] {
  const raw = asString(value);
  if (!raw) return undefined;

  const points: Array<[number, number]> = [];
  for (const pair of raw.split(/\s+/)) {
    const [latRaw, lngRaw] = pair.split(',');
    const lat = Number(latRaw);
    const lng = Number(lngRaw);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      points.push([lat, lng]);
    }
  }

  if (points.length < 3) return undefined;

  return {
    type: 'Polygon',
    coordinates: points,
  };
}

function parseCapCircle(value: unknown): SachetAlert['circle'] {
  const raw = asString(value);
  if (!raw) return undefined;

  const [latRaw, lngRaw, radiusRaw] = raw.split(',');
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  const radiusKm = Number(radiusRaw);

  if (![lat, lng, radiusKm].every(Number.isFinite)) {
    return undefined;
  }

  return {
    center: [lat, lng],
    radiusKm,
  };
}

function calculateCentroid(
  polygon?: SachetAlert['polygon'],
  circle?: SachetAlert['circle'],
): SachetAlert['centroid'] {
  if (circle) return circle.center;
  if (!polygon?.coordinates?.length) return undefined;

  const points = polygon.coordinates;
  const lat = points.reduce((sum: number, p: [number, number]) => sum + p[0], 0) / points.length;
  const lng = points.reduce((sum: number, p: [number, number]) => sum + p[1], 0) / points.length;

  return [lat, lng];
}

/**
 * Converts an actual CAP <alert> object into SachetAlert objects.
 *
 * SACHET may expose more than one <info> block for different languages.
 * Prefer English where available.
 */
function parseCapAlert(root: any): SachetAlert[] {
  const infos = asArray(root?.info || root?.['cap:info']);
  if (!infos.length) return [];

  const selectedInfo =
    infos.find((info: any) => {
      const language = asString(info.language || info['cap:language']).toLowerCase();
      return language === 'en' || language === 'en-in' || language.startsWith('en-');
    }) || infos[0];

  const info = selectedInfo || {};
  const area = asArray(info.area || info['cap:area'])[0] || {};

  const event = asString(
    info.event || info['cap:event'],
    'Disaster Warning',
  );

  const rawCategory = asString(
    info.category || info['cap:category'],
    'Met',
  );

  const polygon = parseCapPolygon(
    area.polygon || area['cap:polygon'],
  );

  const circle = parseCapCircle(
    area.circle || area['cap:circle'],
  );

  const centroid =
    calculateCentroid(polygon, circle) ||
    deriveIndicativeCentroid(
      asString(info.parameter?.state || info.parameter?.STATE),
      asString(info.parameter?.district || info.parameter?.DISTRICT),
      asString(area.areaDesc || area['cap:areaDesc']),
      event,
      rawCategory,
    );

  const sent = asString(
    root.sent,
    new Date().toISOString(),
  );

  const effective = asString(
    info.effective || info['cap:effective'],
    sent,
  );

  const expires = asString(
    info.expires || info['cap:expires'],
    new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  );

  const alertObj: SachetAlert = {
    id: asString(
      root.identifier,
      `SACHET-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    ),

    identifier: asString(
      root.identifier,
      `NDMA/SACHET/${Date.now()}`,
    ),

    bulletinNo: asString(
      info.parameter?.value || root.identifier,
      root.identifier || 'NDMA-CAP-OFFICIAL',
    ),

    sender: asString(
      root.sender,
      'NDMA / SACHET Portal',
    ),

    sourceAgency: asString(
      root.sender,
      'National Disaster Management Authority (NDMA)',
    ),

    helpline: '1070 (SEOC) | 1077 (District Control) | 112',

    officialPortalUrl: 'https://sachet.ndma.gov.in',

    liveNewsQuery:
      `${event} ${asString(area.areaDesc || area['cap:areaDesc'])} alert India`,

    feedOrigin: 'NDMA_SACHET_LIVE',

    sent,
    status: asString(root.status, 'Actual'),
    msgType: asString(root.msgType, 'Alert'),

    source: 'NDMA SACHET Public India CAP RSS Feed',

    scope: asString(root.scope, 'Public'),

    category: normalizeCategory(rawCategory, event),
    rawCategory,

    event,

    urgency: normalizeUrgencyValue(
      info.urgency || info['cap:urgency'],
    ),

    severity: normalizeSeverityValue(
      info.severity || info['cap:severity'],
    ),

    certainty: normalizeCertaintyValue(
      info.certainty || info['cap:certainty'],
    ),

    headline: asString(
      info.headline || info['cap:headline'],
      event,
    ),

    description: asString(
      info.description || info['cap:description'],
      'Active alert from NDMA SACHET.',
    ),

    instruction: asString(
      info.instruction || info['cap:instruction'],
      'Follow official instructions from local disaster management authorities.',
    ),

    areaDesc: asString(
      area.areaDesc || area['cap:areaDesc'],
      'Designated warning zone',
    ),

    polygon,
    circle,
    centroid,

    state: asString(info.parameter?.state || info.parameter?.STATE) || undefined,
    district: asString(info.parameter?.district || info.parameter?.DISTRICT) || undefined,

    effective,
    expires,

    isExpired: false,

    webUrl: asString(
      info.web || info['cap:web'],
      'https://sachet.ndma.gov.in',
    ),
  };

  if (isAlertExpired(alertObj)) return [];
  return [alertObj];
}

/**
 * Parses the public SACHET RSS feed.
 *
 * It supports:
 * 1. RSS items containing a CAP <alert>
 * 2. Direct CAP <alert>
 * 3. RSS items that expose the alert metadata directly
 */
function parseCapPayload(rawContent: string): SachetAlert[] {
  try {
    if (!rawContent.trim()) return [];

    if (
      rawContent.trim().startsWith('{') ||
      rawContent.trim().startsWith('[')
    ) {
      return [];
    }

    const parsed = xmlParser.parse(rawContent);
    const roots: any[] = [];

    const directAlerts =
      parsed?.alert ||
      parsed?.['cap:alert'];

    if (directAlerts) {
      roots.push(...asArray(directAlerts));
    }

    const items = asArray(
      parsed?.rss?.channel?.item,
    );

    for (const item of items) {
      const nested =
        item?.alert ||
        item?.['cap:alert'] ||
        item?.Alert;

      if (nested) {
        roots.push(...asArray(nested));
      }
    }

    const results: SachetAlert[] = [];

    for (const root of roots) {
      results.push(...parseCapAlert(root));
    }

    /*
     * Some RSS representations expose the CAP fields as RSS item fields.
     * Only use this path when a real CAP alert object is absent.
     */
    if (results.length === 0) {
      for (const item of items) {
        const title = asString(item.title);
        const description = asString(item.description);

        if (!title && !description) continue;

        const identifier = asString(
          item.guid || item.id || item.link,
          `SACHET-RSS-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        );

        const sent = asString(
          item.pubDate,
          new Date().toISOString(),
        );

        const fallbackAlert: SachetAlert = {
          id: identifier,
          identifier,
          bulletinNo: identifier,

          sender: asString(
            item.source,
            'NDMA SACHET',
          ),

          sourceAgency:
            'National Disaster Management Authority (NDMA)',

          helpline:
            '1070 (SEOC) | 1077 (District Control) | 112',

          officialPortalUrl:
            'https://sachet.ndma.gov.in',

          liveNewsQuery:
            `${title || 'disaster'} India alert`,

          feedOrigin:
            'NDMA_SACHET_LIVE',

          sent,
          status: 'Actual',
          msgType: 'Alert',

          source:
            'NDMA SACHET Public India CAP RSS Feed',

          scope: 'Public',

          category:
            normalizeCategory(title, title),

          rawCategory: 'RSS',

          event:
            title || 'Disaster Warning',

          urgency: 'Expected',
          severity: 'Moderate',
          certainty: 'Possible',

          headline:
            title || 'Official SACHET Alert',

          description:
            description || 'Official alert published through SACHET.',

          instruction:
            'Follow official instructions from NDMA and local authorities.',

          areaDesc:
            title || 'Designated warning zone',

          centroid: deriveIndicativeCentroid(
            title,
            description,
            asString(item.source),
          ),

          effective: sent,

          expires:
            new Date(
              new Date(sent).getTime() + 24 * 3600 * 1000,
            ).toISOString(),

          isExpired: false,

          webUrl:
            asString(
              item.link,
              'https://sachet.ndma.gov.in',
            ),
        };

        if (!isAlertExpired(fallbackAlert)) {
          results.push(fallbackAlert);
        }
      }
    }

    const seen = new Set<string>();

    return results.filter((alert) => {
      if (seen.has(alert.identifier)) return false;
      seen.add(alert.identifier);
      return true;
    });
  } catch (err) {
    console.error(
      'Error parsing public SACHET CAP/RSS payload:',
      (err as Error).message,
    );

    return [];
  }
}

/**
 * Retrieves live disaster data from:
 *
 * 1. PUBLIC NDMA SACHET India CAP/RSS feed
 * 2. USGS live earthquake stream
 * 3. Open-Meteo live telemetry
 *
 * IMPORTANT:
 * - No SACHET identifier is required.
 * - No hardcoded/fake disaster alerts are injected.
 * - Empty SACHET feed means zero official SACHET alerts.
 */
export async function getSachetAlerts(clientEtag?: string): Promise<{
  alerts: SachetAlert[];
  etag: string;
  isModified: boolean;
  lastUpdated: string;
  cacheStatus: 'LIVE_FETCH' | 'ETAG_CACHED' | 'FALLBACK_SNAPSHOT';
  sourceUrl?: string;
}> {
  const now = new Date();

  const cacheAgeMs =
    Date.now() -
    new Date(
      sachetCache.lastUpdated,
    ).getTime();

  /*
   * Preserve the existing API contract:
   * if the caller already has our current ETag and the cache
   * is still fresh, avoid hitting upstream again.
   */
  if (
    sachetCache.data.length > 0 &&
    cacheAgeMs < 45_000 &&
    clientEtag === sachetCache.etag
  ) {
    const active =
      sachetCache.data.filter(
        (a) => !isAlertExpired(a, now),
      );

    return {
      alerts: active,
      etag: sachetCache.etag,
      isModified: false,
      lastUpdated: sachetCache.lastUpdated,
      cacheStatus: 'ETAG_CACHED',
      sourceUrl: sachetCache.sourceUrl,
    };
  }

  /*
   * 1. PUBLIC SACHET FEED
   */
  let sachetLiveAlerts: SachetAlert[] = [];

  try {
    const controller =
      new AbortController();

    const timeoutId =
      setTimeout(
        () => controller.abort(),
        10_000,
      );

    const response =
      await fetch(
        PUBLIC_SACHET_FEED_URL,
        {
          method: 'GET',

          headers: {
            Accept:
              'application/rss+xml, application/xml, text/xml, */*',

            'User-Agent':
              'DisasterAlertPlatform/1.0',
          },

          signal:
            controller.signal,
        },
      ).catch(() => null);

    clearTimeout(timeoutId);

    if (response?.ok) {
      const contentType =
        (
          response.headers.get(
            'content-type',
          ) || ''
        ).toLowerCase();

      const body =
        await response.text();

      const looksLikeXml =
        body.trimStart().startsWith('<?xml') ||
        body.trimStart().startsWith('<rss') ||
        body.trimStart().startsWith('<feed') ||
        body.trimStart().startsWith('<alert') ||
        contentType.includes('xml') ||
        contentType.includes('rss');

      if (!looksLikeXml) {
        throw new Error(
          `SACHET returned a non-XML response. HTTP ${response.status}, content-type=${contentType || 'unknown'}`,
        );
      }

      sachetLiveAlerts =
        parseCapPayload(body);
    } else {
      throw new Error(
        `SACHET public feed request failed: HTTP ${
          response?.status ?? 'NO_RESPONSE'
        }`,
      );
    }
  } catch (err) {
    console.error(
      'Public SACHET feed notice:',
      (err as Error).message,
    );

    /*
     * If SACHET is temporarily unavailable, use the
     * last real SACHET response if one exists.
     */
    sachetLiveAlerts =
      sachetCache.data.filter(
        (a) =>
          a.feedOrigin === 'NDMA_SACHET_LIVE' &&
          !isAlertExpired(a, now),
      );
  }

  /*
   * 2. USGS live earthquakes.
   */
  const usgsAlerts =
    await fetchUSGSIndianEarthquakes();

  /*
   * 3. ONLY REAL/LIVE SOURCES.
   *
   * The old getVerifiedSnapshotAlerts() has intentionally
   * been removed. Nothing is fabricated when an upstream
   * source has no data.
   */
  const combinedAlerts: SachetAlert[] = [
    ...sachetLiveAlerts,
    ...usgsAlerts,
  ];

  /*
   * Remove expired records.
   */
  const activeAlerts =
    combinedAlerts
      .filter(
        (a) => !isAlertExpired(a, now),
      )
      .sort(
        (a, b) =>
          new Date(
            b.sent ||
              b.effective,
          ).getTime() -
          new Date(
            a.sent ||
              a.effective,
          ).getTime(),
      );

  /*
   * Stable-ish application ETag.
   */
  const fingerprint =
    activeAlerts
      .map(
        (a) =>
          `${a.identifier}|${a.sent}|${a.effective}|${a.expires}|${a.category}`,
      )
      .sort()
      .join('||');

  let hash = 2166136261;

  for (
    let i = 0;
    i < fingerprint.length;
    i++
  ) {
    hash ^= fingerprint.charCodeAt(i);
    hash = Math.imul(
      hash,
      16777619,
    );
  }

  const newEtag =
    `live-api-feed-${(
      hash >>> 0
    ).toString(16)}-${activeAlerts.length}`;

  sachetCache = {
    etag: newEtag,

    lastUpdated:
      new Date().toISOString(),

    data: activeAlerts,

    sourceUrl:
      PUBLIC_SACHET_FEED_URL,

      liveSourceCount:
      sachetLiveAlerts.length +
      usgsAlerts.length,
  };

  return {
    alerts: activeAlerts,

    etag: newEtag,

    isModified:
      clientEtag !== newEtag,

    lastUpdated:
      sachetCache.lastUpdated,

    cacheStatus:
      'LIVE_FETCH',

    sourceUrl:
      PUBLIC_SACHET_FEED_URL,
  };
}



--- SIH-2026/backend/server/types/disaster.ts ---

export type DisasterCategory =
  | 'Cyclone'
  | 'Flood'
  | 'Earthquake'
  | 'Landslide'
  | 'Heat Wave'
  | 'Cold Wave'
  | 'Lightning'
  | 'Thunderstorm'
  | 'Heavy Rain'
  | 'Storm'
  | 'Tsunami'
  | 'Avalanche'
  | 'Forest Fire'
  | 'Drought'
  | 'Urban Flood'
  | 'Air Pollution'
  | 'General Alert';

export type AlertSeverity = 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
export type AlertUrgency = 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown';
export type AlertCertainty = 'Observed' | 'Likely' | 'Possible' | 'Unlikely' | 'Unknown';

export interface AlertPolygon {
  type: 'Polygon';
  coordinates: [number, number][]; // [lat, lng] array
}

export interface AlertCircle {
  center: [number, number]; // [lat, lng]
  radiusKm: number;
}

export interface SachetAlert {
  id: string;
  identifier: string;
  sender: string;
  sent: string;
  status: string;
  msgType: string;
  source: string;
  scope: string;
  category: DisasterCategory;
  rawCategory: string;
  event: string;
  urgency: AlertUrgency;
  severity: AlertSeverity;
  certainty: AlertCertainty;
  headline: string;
  description: string;
  instruction: string; // Verbatim official instruction
  areaDesc: string;
  polygon?: AlertPolygon;
  circle?: AlertCircle;
  centroid?: [number, number]; // [lat, lng]
  state?: string;
  district?: string;
  effective: string;
  expires: string;
  isExpired: boolean;
  webUrl?: string;
  sourceAgency?: string;
  helpline?: string;
  bulletinNo?: string;
  officialPortalUrl?: string;
  liveNewsQuery?: string;
  disasterYear?: number;
  feedOrigin?: 'NDMA_SACHET_LIVE' | 'IMD_CAP_LIVE' | 'SDMA_TELEMETRY' | 'VERIFIED_SNAPSHOT';
}

export type RelevanceStatus =
  | 'NOT_RELEVANT'
  | 'AWARENESS_ONLY'
  | 'NEARBY'
  | 'WARNING'
  | 'HIGH_PRIORITY'
  | 'CRITICAL';

export type RelevanceConfidence =
  | 'exact_polygon' // Case 1: Point inside official polygon (highest confidence)
  | 'polygon_distance' // Case 2: Point within category buffer of polygon
  | 'circle' // Case 3: Point inside/near official circle
  | 'approximate_centroid' // Case 4: Centroid only - "approximate — precise boundary unavailable"
  | 'regional_match' // Case 5: Admin region / State match only
  | 'unverified';

export interface EmergencyContact {
  label: string;
  number: string;
  category: 'National' | 'State' | 'District' | 'Police' | 'Medical' | 'Disaster Force';
  description: string;
}

export interface EvacuationGuidance {
  hazardOriginName: string;
  bearingDegrees: number;
  bearingCardinal: string; // e.g. 'South', 'South-East'
  approachDescription: string; // e.g. 'Approaching from South (Puri) towards North (Bhubaneswar)'
  recommendedDirection: string; // e.g. 'North-West (Inland towards higher elevation)'
  safeDistanceKm: number; // e.g. 35
  urgencyLevel: 'IMMEDIATE_EVACUATION' | 'PREPARE_TO_MOVE' | 'SHELTER_IN_PLACE' | 'STANDBY_AWARE';
  actionableMeasures: string[];
  dos: string[];
  donts: string[];
  emergencyContacts: EmergencyContact[];
}

export interface RelevanceResult {
  status: RelevanceStatus;
  distanceKm: number;
  confidence: RelevanceConfidence;
  confidenceLabel: string;
  isInsideBoundary: boolean;
  reason: string;
  plainSummary: string; // Deterministic plain-language summary (Section 50)
  alert: SachetAlert;
  evacuationGuidance?: EvacuationGuidance;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  timestamp: number;
  cityName?: string;
  district?: string;
  state?: string;
  isCustomLookup?: boolean; // For "Check another location" (Section 49A)
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  publisher: string;
  publishedAt: string;
  relativeTime: string;
  recencyVerified: boolean;
  isWithinTemporalGate: boolean;
  matchedEventOrAlertId?: string;
  query?: string;
}

export interface CitedSource {
  id: string; // e.g. 'S1', 'S2' (stable across bundle)
  title: string;
  publisher: string;
  publishedAt: string;
  url: string;
  summary: string;
  qualityScore?: number;
  keyFacts?: string[];
}

export interface TimelineEvent {
  date: string;
  event: string;
  description: string;
  citations: string[]; // e.g. ['S1', 'S2']
}

export interface ConflictingReport {
  topic: string;
  details: string;
  sources: string[];
}

export interface NumericRange {
  min: number;
  max: number;
  outliers?: number[];
  outlierSources?: { value: number; sourceIds: string[] }[];
}

export interface EvidenceBundle {
  id: string;
  eventName: string;
  disasterType: DisasterCategory;
  location: string;
  state: string;
  country: string;
  eventDate?: string;
  dateRange: string;
  numericCasualtiesRange?: NumericRange;
  reportedCasualties: string;
  reportedDamage: string;
  sources: CitedSource[];
  timeline: TimelineEvent[];
  whatHappened: string;
  affectedAreas: string;
  humanImpact: string;
  infrastructureDamage: string;
  economicImpact: string;
  governmentResponse: string;
  rescueRelief: string;
  recovery: string;
  sourceAssessment: string;
  conflictingReports: ConflictingReport[];
  synthesizedAt: string;
  evidenceStatus: 'High Confidence' | 'Moderate Evidence' | 'Limited Coverage' | 'Model-Sourced / Limited External Citation';
  retrievalMetadata: {
    queriesExecuted: string[];
    rawSourcesCount: number;
    dedupedSourcesCount: number;
  };
}

export interface ComparisonMatrix {
  events: EvidenceBundle[];
  comparisonPoints: {
    category: string;
    label: string;
    values: { eventId: string; value: string; citations: string[] }[];
  }[];
  aiSynthesis: {
    broaderImpact: string;
    responseDifferences: string;
    crossEventLessons: string;
    citations: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: CitedSource[];
  stage?: 'understanding' | 'searching' | 'reviewing' | 'reconciling' | 'ready';
  language?: string;
  audioBase64?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  associatedEventId?: string;
}


--- SIH-2026/backend/server/types/language.ts ---

export interface Language {
  code: string; // ISO code (e.g., 'bn', 'hi', 'en')
  name: string; // English name (e.g., 'Bengali')
  nativeName: string; // Native script name (e.g., 'বাংলা')
  speechLocale: string; // BCP-47 locale (e.g., 'bn-IN')
  script: string;
}

export const INDIAN_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechLocale: 'en-IN', script: 'Latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechLocale: 'hi-IN', script: 'Devanagari' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechLocale: 'bn-IN', script: 'Bengali' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN', script: 'Telugu' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechLocale: 'mr-IN', script: 'Devanagari' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN', script: 'Tamil' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', speechLocale: 'ur-IN', script: 'Arabic' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechLocale: 'gu-IN', script: 'Gujarati' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechLocale: 'kn-IN', script: 'Kannada' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechLocale: 'or-IN', script: 'Odia' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechLocale: 'ml-IN', script: 'Malayalam' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechLocale: 'pa-IN', script: 'Gurmukhi' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speechLocale: 'as-IN', script: 'Bengali-Assamese' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', speechLocale: 'hi-IN', script: 'Devanagari' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ / संथाली', speechLocale: 'hi-IN', script: 'Ol Chiki' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / کٲشُر', speechLocale: 'ur-IN', script: 'Perso-Arabic' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', speechLocale: 'ne-NP', script: 'Devanagari' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', speechLocale: 'mr-IN', script: 'Devanagari' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', speechLocale: 'ur-IN', script: 'Arabic' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', speechLocale: 'hi-IN', script: 'Devanagari' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্', speechLocale: 'bn-IN', script: 'Meetei Mayek' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', speechLocale: 'hi-IN', script: 'Devanagari' },
];

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  presentTab: string;
  pastTab: string;
  liveStatus: string;
  staleStatus: string;
  activeAlerts: string;
  alertTypes: string;
  useMyLocation: string;
  checkAnotherLocation: string;
  searchLocationPlaceholder: string;
  nearMeMode: string;
  indiaMode: string;
  officialInstructionTitle: string;
  plainSummaryTitle: string;
  viewDetails: string;
  dismiss: string;
  share: string;
  copySummary: string;
  searchDisastersPlaceholder: string;
  historicalResearchTitle: string;
  compareEvents: string;
  aiAssistant: string;
  originalReports: string;
  timelineTitle: string;
  whatHappenedTitle: string;
  impactTitle: string;
  responseTitle: string;
  sourceAssessmentTitle: string;
  conflictingReportsTitle: string;
  noAlertsNearby: string;
  noActiveAlerts: string;
  currentNewsTitle: string;
  voiceAssistantTitle: string;
  voiceListening: string;
  voiceSpeakPrompt: string;
  searchLanguagePlaceholder: string;
  indiaMapTitle?: string;
  askAIAssistant?: string;
  pastDisastersTitle?: string;
  searchDisasterPlaceholder?: string;
  compareNow?: string;
}

export const TRANSLATIONS: Record<string, TranslationDictionary> = {
  en: {
    appTitle: "Disaster Intelligence Platform",
    appSubtitle: "Official Alerts • Geospatial Context • Grounded Research",
    presentTab: "PRESENT (Live Situation)",
    pastTab: "PAST (Historical Research)",
    liveStatus: "OFFICIAL FEED LIVE",
    staleStatus: "CACHED SNAPSHOT",
    activeAlerts: "Active Official Alerts",
    alertTypes: "Alert Categories",
    useMyLocation: "Use My Location",
    checkAnotherLocation: "Check Another Location",
    searchLocationPlaceholder: "Search Indian city, district or village...",
    nearMeMode: "NEAR ME",
    indiaMode: "ALL INDIA",
    officialInstructionTitle: "Official Instructions",
    plainSummaryTitle: "Situation Summary",
    viewDetails: "View Details",
    dismiss: "Dismiss",
    share: "Share Warning",
    copySummary: "Copy Summary",
    searchDisastersPlaceholder: "Search historical disasters, events or locations (e.g., Cyclone Fani, Kerala Floods)...",
    historicalResearchTitle: "Historical Disaster Research",
    compareEvents: "Compare Events",
    aiAssistant: "AI Research Assistant",
    originalReports: "Original Reports & Media",
    timelineTitle: "Chronological Timeline",
    whatHappenedTitle: "What Happened",
    impactTitle: "Human & Infrastructure Impact",
    responseTitle: "Government & Rescue Response",
    sourceAssessmentTitle: "Source Assessment",
    conflictingReportsTitle: "Conflicting Reports",
    noAlertsNearby: "No active alerts detected near your location.",
    noActiveAlerts: "No active official alerts currently in feed.",
    currentNewsTitle: "Verified Current News (72h Gate)",
    voiceAssistantTitle: "Multilingual Voice Assistant",
    voiceListening: "Listening in your language...",
    voiceSpeakPrompt: "Speak or ask anything in any Indian language",
    searchLanguagePlaceholder: "Search language (English or script)...",
  },
  hi: {
    appTitle: "आपदा सूचना एवं अनुसंधान मंच",
    appSubtitle: "आधिकारिक अलर्ट • भू-स्थानिक संदर्भ • प्रामाणिक शोध",
    presentTab: "वर्तमान (सक्रिय आपदाएं)",
    pastTab: "अतीत (ऐतिहासिक शोध)",
    liveStatus: "लाइव आधिकारिक अलर्ट",
    staleStatus: "कैश डेटा (सत्यापित)",
    activeAlerts: "सक्रिय आधिकारिक अलर्ट",
    alertTypes: "आपदा श्रेणियां",
    useMyLocation: "मेरा स्थान उपयोग करें",
    checkAnotherLocation: "अन्य स्थान की जांच करें",
    searchLocationPlaceholder: "शहर, जिला या गांव खोजें...",
    nearMeMode: "मेरे निकट",
    indiaMode: "अखिल भारतीय",
    officialInstructionTitle: "आधिकारिक निर्देश",
    plainSummaryTitle: "स्थिति सारांश",
    viewDetails: "विवरण देखें",
    dismiss: "हटाएं",
    share: "चेतावनी साझा करें",
    copySummary: "सारांश कॉपी करें",
    searchDisastersPlaceholder: "ऐतिहासिक आपदाएं या घटनाएं खोजें (उदा. फानी चक्रवात, केरल बाढ़)...",
    historicalResearchTitle: "ऐतिहासिक आपदा अनुसंधान",
    compareEvents: "घटनाओं की तुलना करें",
    aiAssistant: "एआई शोध सहायक",
    originalReports: "मूल समाचार और रिपोर्ट",
    timelineTitle: "घटनाक्रम (टाइमलाइन)",
    whatHappenedTitle: "क्या हुआ था",
    impactTitle: "मानवीय एवं ढांचागत प्रभाव",
    responseTitle: "सरकारी एवं राहत प्रतिक्रिया",
    sourceAssessmentTitle: "स्रोत विश्वसनीयता",
    conflictingReportsTitle: "विरोधाभासी रिपोर्टें",
    noAlertsNearby: "आपके स्थान के पास कोई सक्रिय अलर्ट नहीं है।",
    noActiveAlerts: "वर्तमान में कोई सक्रिय चेतावनी नहीं है।",
    currentNewsTitle: "सत्यापित हालिया समाचार (72 घंटे)",
    voiceAssistantTitle: "बहुभाषी वॉइस सहायक",
    voiceListening: "आपकी भाषा में सुन रहे हैं...",
    voiceSpeakPrompt: "किसी भी भारतीय भाषा में बोलें या पूछें",
    searchLanguagePlaceholder: "भाषा खोजें (अंग्रेजी या लिपि)...",
  },
  bn: {
    appTitle: "দুর্যোগ তথ্য ও গবেষণা প্ল্যাটফর্ম",
    appSubtitle: "সরকারি সতর্কতা • ভূ-স্থানিক বুদ্ধিমত্তা • তথ্যভিত্তিক গবেষণা",
    presentTab: "বর্তমান (লাইভ পরিস্থিতি)",
    pastTab: "অতীত (ঐতিহাসিক গবেষণা)",
    liveStatus: "লাইভ সরকারি তথ্য",
    staleStatus: "ক্যাশ ডেটা",
    activeAlerts: "সক্রিয় সরকারি সতর্কতা",
    alertTypes: "দুর্যোগের ধরন",
    useMyLocation: "আমার অবস্থান ব্যবহার করুন",
    checkAnotherLocation: "অন্য স্থান পরীক্ষা করুন",
    searchLocationPlaceholder: "শহর, জেলা বা স্থান অনুসন্ধান করুন...",
    nearMeMode: "আমার কাছে",
    indiaMode: "সমগ্র ভারত",
    officialInstructionTitle: "সরকারি নির্দেশাবলী",
    plainSummaryTitle: "পরিস্থিতি সারসংক্ষেপ",
    viewDetails: "বিস্তারিত দেখুন",
    dismiss: "বাতিল করুন",
    share: "সতর্কতা শেয়ার করুন",
    copySummary: "সারসংক্ষেপ কপি করুন",
    searchDisastersPlaceholder: "ঐতিহাসিক দুর্যোগ খুঁজুন (যেমন: ঘূর্ণিঝড় ফণী, কেরালা বন্যা)...",
    historicalResearchTitle: "ঐতিহাসিক দুর্যোগ গবেষণা",
    compareEvents: "ঘটনা তুলনা করুন",
    aiAssistant: "এআই গবেষণা সহকারী",
    originalReports: "মূল প্রতিবেদন ও সংবাদ",
    timelineTitle: "ঘটনাপঞ্জি (টাইমলাইন)",
    whatHappenedTitle: "কী ঘটেছিল",
    impactTitle: "মানবিক ও অবকাঠামোগত ক্ষয়ক্ষতি",
    responseTitle: "সরকারি ত্রাণ ও উদ্ধার কাজ",
    sourceAssessmentTitle: "উৎস নির্ভরযোগ্যতা",
    conflictingReportsTitle: "পরস্পরবিরোধী রিপোর্ট",
    noAlertsNearby: "আপনার এলাকার কাছে কোনো সক্রিয় সতর্কতা নেই।",
    noActiveAlerts: "বর্তমানে কোনো সক্রিয় সতর্কতা নেই।",
    currentNewsTitle: "যাচাইকৃত সাম্প্রতিক সংবাদ (৭২ ঘণ্টা)",
    voiceAssistantTitle: "বহুভাষিক ভয়েস সহকারী",
    voiceListening: "আপনার ভাষায় শুনছি...",
    voiceSpeakPrompt: "যেকোনো ভারতীয় ভাষায় কথা বলুন বা জিজ্ঞাসা করুন",
    searchLanguagePlaceholder: "ভাষা খুঁজুন (ইংরেজি বা বাংলা লিপিতে)...",
  },
  ta: {
    appTitle: "பேரிடர் தகவல் தளம்",
    appSubtitle: "அதிகாரப்பூர்வ எச்சரிக்கைகள் • புவிசார் சூழல் • ஆதார அடிப்படையிலான ஆய்வு",
    presentTab: "தற்போதைய நிலை (நேரலை)",
    pastTab: "கடந்த கால ஆய்வு (வரலாறு)",
    liveStatus: "நேரலை எச்சரிக்கை",
    staleStatus: "சேமிக்கப்பட்ட தகவல்",
    activeAlerts: "செயலில் உள்ள எச்சரிக்கைகள்",
    alertTypes: "பேரிடர் வகைகள்",
    useMyLocation: "எனது இருப்பிடத்தைப் பயன்படுத்து",
    checkAnotherLocation: "வேறு இடத்தை சரிபார்க்கவும்",
    searchLocationPlaceholder: "நகரம், மாவட்டம் அல்லது கிராமத்தை தேடுங்கள்...",
    nearMeMode: "என் அருகில்",
    indiaMode: "இந்தியா முழுவதும்",
    officialInstructionTitle: "அதிகாரப்பூர்வ வழிகாட்டுதல்கள்",
    plainSummaryTitle: "நிலைமை சுருக்கம்",
    viewDetails: "விவரங்களைக் காண்க",
    dismiss: "விலக்கு",
    share: "பகிரவும்",
    copySummary: "சுருக்கத்தை நகலெடு",
    searchDisastersPlaceholder: "வரலாற்றுப் பேரிடர்களைத் தேடுங்கள் (எ.கா. ஃபானி புயல்)...",
    historicalResearchTitle: "வரலாற்றுப் பேரிடர் ஆராய்ச்சி",
    compareEvents: "ஒப்பிடுக",
    aiAssistant: "AI ஆராய்ச்சி உதவியாளர்",
    originalReports: "அசல் அறிக்கைகள்",
    timelineTitle: "காலவரிசை",
    whatHappenedTitle: "என்ன நடந்தது",
    impactTitle: "பாதிப்புகள்",
    responseTitle: "அரசு நிவாரணப் பணிகள்",
    sourceAssessmentTitle: "ஆதார மதிப்பீடு",
    conflictingReportsTitle: "முரண்பட்ட அறிக்கைகள்",
    noAlertsNearby: "உங்கள் பகுதிக்கு அருகில் எச்சரிக்கைகள் இல்லை.",
    noActiveAlerts: "செயலில் உள்ள எச்சரிக்கைகள் எதுவும் இல்லை.",
    currentNewsTitle: "சரிபார்க்கப்பட்ட சமீபத்திய செய்திகள்",
    voiceAssistantTitle: "குரல் உதவியாளர்",
    voiceListening: "கேட்கிறது...",
    voiceSpeakPrompt: "எந்த இந்திய மொழியிலும் பேசுங்கள்",
    searchLanguagePlaceholder: "மொழியைத் தேடுங்கள்...",
  },
  te: {
    appTitle: "విపత్తు సమాచార వేదిక",
    appSubtitle: "అధికారిక హెచ్చరికలు • భౌగోళిక సమాచారం • పరిశోధన",
    presentTab: "ప్రస్తుత స్థితి (లైవ్)",
    pastTab: "గత చరిత్ర (పరిశోధన)",
    liveStatus: "ప్రత్యక్ష సమాచారం",
    staleStatus: "కాష్ సమాచారం",
    activeAlerts: "యాక్టివ్ హెచ్చరికలు",
    alertTypes: "విపత్తు రకాలు",
    useMyLocation: "నా లొకేషన్ ఉపయోగించండి",
    checkAnotherLocation: "మరో ప్రాంతాన్ని తనిఖీ చేయండి",
    searchLocationPlaceholder: "నగరం లేదా జిల్లాను శోధించండి...",
    nearMeMode: "నా దగ్గర",
    indiaMode: "భారతదేశం అంతటా",
    officialInstructionTitle: "అధికారిక సూచనలు",
    plainSummaryTitle: "పరిస్థితి సారాంశం",
    viewDetails: "వివరాలు చూడండి",
    dismiss: "రద్దు చేయి",
    share: "హెచ్చరికను పంచుకోండి",
    copySummary: "సారాంశాన్ని కాపీ చేయండి",
    searchDisastersPlaceholder: "చారిత్రక విపత్తులను శోధించండి...",
    historicalResearchTitle: "చారిత్రక విపత్తు పరిశోధన",
    compareEvents: "ఈవెంట్లను సరిపోల్చండి",
    aiAssistant: "AI సహాయకుడు",
    originalReports: "అసలు నివేదికలు",
    timelineTitle: "టైమ్‌లైన్",
    whatHappenedTitle: "ఏమి జరిగింది",
    impactTitle: "ప్రభావం మరియు నష్టం",
    responseTitle: "ప్రభుత్వ ప్రతిస్పందన",
    sourceAssessmentTitle: "మూలాల ధృవీకరణ",
    conflictingReportsTitle: "విరుద్ధ నివేదికలు",
    noAlertsNearby: "మీ ప్రాంతంలో హెచ్చరికలు లేవు.",
    noActiveAlerts: "యాక్టివ్ హెచ్చరికలు ఏవీ లేవు.",
    currentNewsTitle: "తాజా వార్తలు",
    voiceAssistantTitle: "వాయిస్ అసిస్టెంట్",
    voiceListening: "వింటోంది...",
    voiceSpeakPrompt: "భారతీయ భాషలో మాట్లాడండి",
    searchLanguagePlaceholder: "భాషను శోధించండి...",
  },
  mr: {
    appTitle: "आपत्ती माहिती व संशोधन व्यासपीठ",
    appSubtitle: "अधिकृत इशारे • भौगोलिक संदर्भ • पुरावा-आधारित संशोधन",
    presentTab: "सध्याची स्थिती (लाईव्ह)",
    pastTab: "भूतकाळ (ऐतिहासिक संशोधन)",
    liveStatus: "लाईव्ह अधिकृत डेटा",
    staleStatus: "कॅश डेटा",
    activeAlerts: "सक्रिय अधिकृत इशारे",
    alertTypes: "आपत्ती प्रकार",
    useMyLocation: "माझे स्थान वापरा",
    checkAnotherLocation: "इतर स्थान तपासा",
    searchLocationPlaceholder: "शहर, जिल्हा किंवा गाव शोधा...",
    nearMeMode: "माझ्या जवळ",
    indiaMode: "संपूर्ण भारत",
    officialInstructionTitle: "अधिकृत सूचना",
    plainSummaryTitle: "परिस्थितीचा सारांश",
    viewDetails: "तपशील पहा",
    dismiss: "बंद करा",
    share: "इशारा शेअर करा",
    copySummary: "सारांश कॉपी करा",
    searchDisastersPlaceholder: "ऐतिहासिक आपत्ती शोधा...",
    historicalResearchTitle: "ऐतिहासिक आपत्ती संशोधन",
    compareEvents: "तुलना करा",
    aiAssistant: "एआय संशोधन सहाय्यक",
    originalReports: "मूळ बातम्या व अहवाल",
    timelineTitle: "घटनाक्रम (टाइमलाइन)",
    whatHappenedTitle: "काय घडले होते",
    impactTitle: "मानवी व पायाभूत नुकसान",
    responseTitle: "शासकीय मदत व बचाव कार्य",
    sourceAssessmentTitle: "स्रोत विश्वसनीयता",
    conflictingReportsTitle: "परस्परविरोधी अहवाल",
    noAlertsNearby: "तुमच्या परिसरात कोणताही इशारा नाही.",
    noActiveAlerts: "सध्या कोणताही सक्रिय इशारा नाही.",
    currentNewsTitle: "सत्यापित ताज्या बातम्या",
    voiceAssistantTitle: "व्हॉइस सहाय्यक",
    voiceListening: "ऐकत आहे...",
    voiceSpeakPrompt: "कोणत्याही भारतीय भाषेत बोला",
    searchLanguagePlaceholder: "भाषा शोधा...",
  },
  or: {
    appTitle: "ବିପର୍ଯ୍ୟୟ ସୂଚନା ଓ ଅନୁସନ୍ଧାନ ମଞ୍ଚ",
    appSubtitle: "ସରକାରୀ ସତର୍କତା • ଭୌଗୋଳିକ ସୂଚନା • ତଥ୍ୟଭିତ୍ତିକ ଗବେଷଣା",
    presentTab: "ବର୍ତ୍ତମାନ (ଲାଇଭ ସ୍ଥିତି)",
    pastTab: "ଅତୀତ (ଐତିହାସିକ ଗବେଷଣା)",
    liveStatus: "ଲାଇଭ ସରକାରୀ ସୂଚନା",
    staleStatus: "କ୍ୟାସ୍ ତଥ୍ୟ",
    activeAlerts: "ସକ୍ରିୟ ସରକାରୀ ସତର୍କତା",
    alertTypes: "ବିପର୍ଯ୍ୟୟ ବର୍ଗ",
    useMyLocation: "ମୋର ସ୍ଥାନ ବ୍ୟବହାର କରନ୍ତୁ",
    checkAnotherLocation: "ଅନ୍ୟ ସ୍ଥାନ ଯାଞ୍ଚ କରନ୍ତୁ",
    searchLocationPlaceholder: "ସହର, ଜିଲ୍ଲା ବା ଗ୍ରାମ ଖୋଜନ୍ତୁ...",
    nearMeMode: "ମୋ ନିକଟରେ",
    indiaMode: "ସମଗ୍ର ଭାରତ",
    officialInstructionTitle: "ସରକାରୀ ନିର୍ଦ୍ଦେଶାବଳୀ",
    plainSummaryTitle: "ସ୍ଥିତି ସାରାଂଶ",
    viewDetails: "ବିବରଣୀ ଦେଖନ୍ତୁ",
    dismiss: "ଅଣଦେଖା କରନ୍ତୁ",
    share: "ସତର୍କତା ସେୟାର କରନ୍ତୁ",
    copySummary: "ସାରାଂଶ କପି କରନ୍ତୁ",
    searchDisastersPlaceholder: "ଐତିହାସିକ ବିପର୍ଯ୍ୟୟ ଖୋଜନ୍ତୁ (ଯଥା: ଫନି ବାତ୍ୟା)...",
    historicalResearchTitle: "ଐତିହାସିକ ବିପର୍ଯ୍ୟୟ ଗବେଷଣା",
    compareEvents: "ତୁଳନା କରନ୍ତୁ",
    aiAssistant: "AI ଗବେଷଣା ସହାୟକ",
    originalReports: "ମୂଳ ଖବର ଓ ରିପୋର୍ଟ",
    timelineTitle: "ଘଟଣାକ୍ରମ (ଟାଇମଲାଇନ୍)",
    whatHappenedTitle: "କଣ ଘଟିଥିଲା",
    impactTitle: "ମାନବୀୟ ଓ ଭିତ୍ତିଭୂମି କ୍ଷୟକ୍ଷତି",
    responseTitle: "ସରକାରୀ ଓ ରିଲିଫ ପ୍ରତିକ୍ରିୟା",
    sourceAssessmentTitle: "ଉତ୍ସ ବିଶ୍ୱସନୀୟତା",
    conflictingReportsTitle: "ପରସ୍ପର ବିରୋଧୀ ରିପୋର୍ଟ",
    noAlertsNearby: "ଆପଣଙ୍କ ଅଞ୍ଚଳ ନିକଟରେ କୌଣସି ସକ୍ରିୟ ସତର୍କତା ନାହିଁ।",
    noActiveAlerts: "ବର୍ତ୍ତମାନ କୌଣସି ସକ୍ରିୟ ସତର୍କତା ନାହିଁ।",
    currentNewsTitle: "ସତ୍ୟାପିତ ସାମ୍ପ୍ରତିକ ଖବର (୭୨ ଘଣ୍ଟା)",
    voiceAssistantTitle: "ବହୁଭାଷୀ ଭଏସ୍ ସହାୟକ",
    voiceListening: "ଶୁଣୁଛି...",
    voiceSpeakPrompt: "ଓଡ଼ିଆ କିମ୍ବା ଅନ୍ୟ ଭାରତୀୟ ଭାଷାରେ କୁହନ୍ତୁ",
    searchLanguagePlaceholder: "ଭାଷା ଖୋଜନ୍ତୁ...",
  },
};

export function getTranslation(langCode: string): TranslationDictionary {
  const base = TRANSLATIONS[langCode] || TRANSLATIONS.en;
  return {
    ...TRANSLATIONS.en,
    ...base,
    indiaMapTitle: base.indiaMapTitle || 'All India Disaster Live Map (Official SACHET)',
    askAIAssistant: base.askAIAssistant || base.aiAssistant || 'Ask AI Assistant',
    pastDisastersTitle: base.pastDisastersTitle || base.historicalResearchTitle || 'Historical Disaster Research',
    searchDisasterPlaceholder: base.searchDisasterPlaceholder || base.searchDisastersPlaceholder || 'Search historical disasters, events or locations (e.g., Cyclone Fani, Kerala Floods)...',
    compareNow: base.compareNow || base.compareEvents || 'Compare Events Now',
  };
}


--- SIH-2026/backend/server/lib/dateFormat.ts ---

export function formatDisasterDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function coerceIsoDate(value?: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const trimmed = value.trim();
  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) return date.toISOString();

  const yearMatch = trimmed.match(/\b(19\d\d|20\d\d)\b/);
  if (yearMatch) return new Date(`${yearMatch[0]}-01-01T00:00:00.000Z`).toISOString();
  return undefined;
}


--- SIH-2026/backend/server/lib/evidenceUtils.ts ---

import { CitedSource, NewsArticle } from '../types/disaster';

export interface NumericClaim {
  value: number;
  sourceId?: string;
  text: string;
  metric?: 'deaths' | 'injured' | 'missing' | 'displaced' | 'evacuated' | 'rescued' | 'affected';
  qualifier?: 'at least' | 'more than' | 'over' | 'around' | 'nearly' | 'reported';
}

export interface NumericReconciliationResult {
  rangeMin: number;
  rangeMax: number;
  outliers: number[];
  outlierClaims: NumericClaim[];
}

export interface EventSourceFilterContext {
  eventName: string;
  disasterType?: string;
  state?: string;
  approxDate?: string;
}

/**
 * Validates and sanitizes citation references in text.
 * If text contains [S7] or [S99] but only [S1, S2, S3] exist in the evidence bundle,
 * invalid citations are removed or cleaned so fake source references never reach the user (Section 23 / Section 94).
 */
export function validateAndCleanCitations(text: string, validSources: CitedSource[]): string {
  if (!text) return '';
  const validIds = new Set(validSources.map((s) => s.id.toUpperCase().trim()));

  const normalizedText = text
    .replace(/ã€\s*(S\d+)\s*ã€‘/gi, '[$1]')
    .replace(/【\s*(S\d+)\s*】/gi, '[$1]')
    .replace(/［\s*(S\d+)\s*］/gi, '[$1]');

  // Replace citation markers like [S1], [S2][S4], [S7]
  return normalizedText.replace(/\[(S\d+)\]/gi, (match, citationId) => {
    const upperId = citationId.toUpperCase().trim();
    if (validIds.has(upperId)) {
      return `[${upperId}]`;
    }
    // Invalid citation -> strip it cleanly
    return '';
  });
}

/**
 * Deduplicates news articles based on normalized URL, title similarity, and publisher.
 */
export function deduplicateNewsArticles(articles: NewsArticle[]): NewsArticle[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const results: NewsArticle[] = [];

  for (const article of articles) {
    if (!article.url || !article.title) continue;

    // Normalize URL: remove query params and protocol trailing slashes
    const normUrl = article.url
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/[\?#].*$/, '')
      .replace(/\/+$/, '');

    // Normalize title: remove punctuation and lowercase
    const normTitle = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (seenUrls.has(normUrl) || seenTitles.has(normTitle)) {
      continue;
    }

    seenUrls.add(normUrl);
    seenTitles.add(normTitle);
    results.push(article);
  }

  return results;
}

/**
 * Validates whether an article satisfies the Present Current-News Temporal Gate (default 72 hours).
 * Rejects articles from previous years (e.g. 2025 in 2026), future dates, or unparseable timestamps.
 */
export function evaluateTemporalGate(
  publishedAtStr: string,
  now: Date = new Date(),
  windowHours: number = 72
): { isEligible: boolean; recencyVerified: boolean; relativeTime: string; reason?: string } {
  if (!publishedAtStr) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: 'recency unverified',
      reason: 'Missing published timestamp',
    };
  }

  const pubDate = new Date(publishedAtStr);
  const pubTime = pubDate.getTime();
  const nowTime = now.getTime();

  if (isNaN(pubTime)) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: 'recency unverified',
      reason: 'Unparseable date format',
    };
  }

  // Reject future dates (more than 15 minutes ahead)
  if (pubTime > nowTime + 15 * 60 * 1000) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: 'recency unverified',
      reason: 'Timestamp is in the future',
    };
  }

  const diffHours = (nowTime - pubTime) / (1000 * 60 * 60);

  // Compute clean relative time
  let relativeTime: string;
  if (diffHours < 1) {
    const mins = Math.max(1, Math.round(diffHours * 60));
    relativeTime = `Published ${mins}m ago`;
  } else if (diffHours < 24) {
    const hrs = Math.round(diffHours);
    relativeTime = `Published ${hrs}h ago`;
  } else {
    const days = Math.round(diffHours / 24);
    relativeTime = `Published ${days}d ago`;
  }

  if (diffHours <= windowHours) {
    return {
      isEligible: true,
      recencyVerified: true,
      relativeTime,
    };
  } else {
    return {
      isEligible: false,
      recencyVerified: true,
      relativeTime,
      reason: `Article is older than ${windowHours} hours (${Math.round(diffHours)}h old)`,
    };
  }
}

const casualtyContextPattern =
  /\b(death|deaths|dead|killed|fatalit(?:y|ies)|casualt(?:y|ies)|missing|injured|injur(?:y|ies)|victims?|displaced|evacuat(?:ed|ion)|rescued?|affected)\b/i;
const numericPattern = /\b\d{1,3}(?:,\d{2,3})*(?:\.\d+)?\b/g;

function normalizeNumericClaim(raw: string): number | null {
  const value = Number(raw.replace(/,/g, ''));
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value);
}

/**
 * Extracts casualty and human-impact numeric claims from raw source text.
 * This intentionally requires nearby casualty language so years, dates, and money
 * do not get promoted into human-loss statistics.
 */
export function extractCasualtyNumericClaims(sources: Array<Pick<CitedSource, 'id' | 'title' | 'summary'>>): NumericClaim[] {
  const claims: NumericClaim[] = [];

  for (const source of sources) {
    const text = `${source.title || ''}. ${source.summary || ''}`;
    const matches = Array.from(text.matchAll(numericPattern));

    for (const match of matches) {
      const start = Math.max(0, (match.index || 0) - 120);
      const end = Math.min(text.length, (match.index || 0) + match[0].length + 120);
      const context = text.slice(start, end);
      if (!casualtyContextPattern.test(context)) continue;

      const value = normalizeNumericClaim(match[0]);
      if (value === null) continue;
      const lowerContext = context.toLowerCase();
      const metric: NumericClaim['metric'] =
        /\b(killed|dead|deaths?|fatalit)/i.test(lowerContext) ? 'deaths'
          : /\binjur/i.test(lowerContext) ? 'injured'
            : /\bmissing\b/i.test(lowerContext) ? 'missing'
              : /\bdisplaced\b/i.test(lowerContext) ? 'displaced'
                : /\bevacuat/i.test(lowerContext) ? 'evacuated'
                  : /\brescu/i.test(lowerContext) ? 'rescued'
                    : /\baffected\b/i.test(lowerContext) ? 'affected'
                      : undefined;
      const qualifier: NumericClaim['qualifier'] =
        /\bat least\b/i.test(lowerContext) ? 'at least'
          : /\bmore than\b/i.test(lowerContext) ? 'more than'
            : /\bover\b/i.test(lowerContext) ? 'over'
              : /\baround\b/i.test(lowerContext) ? 'around'
                : /\bnearly\b/i.test(lowerContext) ? 'nearly'
                  : 'reported';
      claims.push({
        value,
        sourceId: source.id,
        text: context.replace(/\s+/g, ' ').trim(),
        metric,
        qualifier,
      });
    }
  }

  return claims;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Reconciles numeric claims by clustering around the median and separating
 * extreme values. For small news sets, a value at least 3x the median is a
 * clearer signal than IQR, which is unstable with only 3-5 sources.
 */
export function reconcileNumericClaims(values: number[] | NumericClaim[]): NumericReconciliationResult {
  const claims: NumericClaim[] = values
    .map((value) => typeof value === 'number' ? { value, text: String(value) } : value)
    .filter((claim) => Number.isFinite(claim.value) && claim.value > 0);

  if (!claims.length) {
    return { rangeMin: 0, rangeMax: 0, outliers: [], outlierClaims: [] };
  }

  if (claims.length === 1) {
    return { rangeMin: claims[0].value, rangeMax: claims[0].value, outliers: [], outlierClaims: [] };
  }

  const valuesOnly = claims.map((claim) => claim.value);
  const med = median(valuesOnly);
  const sorted = [...valuesOnly].sort((a, b) => a - b);
  const lower = sorted.slice(0, Math.floor(sorted.length / 2));
  const upper = sorted.slice(Math.ceil(sorted.length / 2));
  const q1 = lower.length ? median(lower) : sorted[0];
  const q3 = upper.length ? median(upper) : sorted[sorted.length - 1];
  const iqr = q3 - q1;

  const outlierClaims = claims.filter((claim) => {
    if (claims.length <= 5 && med > 0 && claim.value >= med * 3) return true;
    if (iqr > 0 && (claim.value < q1 - 1.5 * iqr || claim.value > q3 + 1.5 * iqr)) return true;
    return false;
  });

  const outlierSet = new Set(outlierClaims);
  const clustered = claims.filter((claim) => !outlierSet.has(claim));
  const finalCluster = clustered.length ? clustered : claims;
  const clusterValues = finalCluster.map((claim) => claim.value);

  return {
    rangeMin: Math.min(...clusterValues),
    rangeMax: Math.max(...clusterValues),
    outliers: outlierClaims.map((claim) => claim.value),
    outlierClaims,
  };
}

const incidentEvidencePattern =
  /\b(killed|dead|deaths?|fatalit(?:y|ies)|injured|missing|evacuat(?:ed|ion)|rescued?|relief|shelter|ndrf|sdrf|damage(?:d)?|collapsed?|washed away|inundat(?:ed|ion)|landslide|flood(?:ed)?|cyclone|earthquake|quake|seismic|heatwave|heat wave|district|village|rainfall|warning issued)\b/i;
const hardIncidentPattern =
  /\b(killed|dead|deaths?|fatalit(?:y|ies)|injured|missing|evacuat(?:ed|ion)|rescued?|relief|shelter|ndrf|sdrf|damage(?:d)?|collapsed?|washed away|inundat(?:ed|ion)|district|village|quake|earthquake)\b/i;
const techAnnouncementPattern =
  /\b(new\s+(?:app|model|ai|system|tech|device|drone|sensor)\s+(?:to\s+|that\s+|for\s+)?(?:predict|counter|detect|prevent|warn)|launch(?:es|ed)?|unveils?|startup|funding|raises?\s+\$|partnership|research paper|study finds)\b/i;
const passingMentionPattern =
  /\b(astrologer|actor|film|celebrity|arrest(?:ed)?|politic(?:al|ian)|election|court|interview|opinion|column)\b/i;
const impactFactPattern =
  /\b(killed|dead|deaths?|fatalit(?:y|ies)|injured|missing|evacuat(?:ed|ion)|rescued?|relief|shelter|ndrf|sdrf|damage(?:d)?|collapsed?|washed away|inundat(?:ed|ion)|district|village|houses?|roads?|bridges?|power|economic|loss|crore)\b/i;

export function scoreIncidentEvidence(article: Pick<NewsArticle, 'title' | 'summary'>): number {
  const text = `${article.title || ''}. ${article.summary || ''}`;
  const matches = text.match(new RegExp(incidentEvidencePattern.source, 'gi'));
  const keywordScore = matches ? Math.min(matches.length, 5) : 0;
  if (keywordScore === 0) return 0;
  let score = keywordScore;
  if (/\b(19|20)\d{2}\b/.test(text)) score += 1;
  if (techAnnouncementPattern.test(text) && !hardIncidentPattern.test(text)) return 0;
  if (passingMentionPattern.test(text) && !impactFactPattern.test(text)) return 0;
  return score;
}

export function filterIncidentEvidenceArticles<T extends Pick<NewsArticle, 'title' | 'summary'>>(articles: T[]): T[] {
  return articles.filter((article) => scoreIncidentEvidence(article) > 0);
}

const disasterTerms = new Set([
  'cyclone',
  'flood',
  'floods',
  'earthquake',
  'landslide',
  'landslides',
  'disaster',
  'storm',
  'rain',
  'heavy',
  'heat',
  'wave',
  'india',
  'indian',
  'alert',
  'warning',
  'casualties',
  'damage',
  'rescue',
  'relief',
]);

function tokenizeSpecificTerms(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 4 && !disasterTerms.has(term));
}

function eventYear(value?: string): string | null {
  if (!value) return null;
  return value.match(/\b(19\d\d|20\d\d)\b/)?.[0] || null;
}

/**
 * Event-specific relevance gate for citation integrity. A source must mention
 * the named event/alias or enough specific entities to distinguish it from
 * generic disaster coverage.
 */
export function filterSourcesForEvent<T extends Pick<NewsArticle, 'title' | 'summary'>>(
  articles: T[],
  context: EventSourceFilterContext,
): T[] {
  const eventName = context.eventName.trim().toLowerCase();
  const specificTerms = tokenizeSpecificTerms(context.eventName);
  const requiredYear = eventYear(context.approxDate || context.eventName);
  const state = context.state?.trim().toLowerCase();
  const disasterType = context.disasterType?.trim().toLowerCase();

  return articles.filter((article) => {
    const text = `${article.title || ''}. ${article.summary || ''}`.toLowerCase();
    if (eventName.length >= 4 && text.includes(eventName)) return true;

    const overlap = specificTerms.filter((term) => text.includes(term)).length;
    if (overlap >= 1 && requiredYear && text.includes(requiredYear)) return true;
    if (overlap >= 2) return true;

    const hasState = Boolean(state && text.includes(state));
    const hasType = Boolean(disasterType && text.includes(disasterType));
    const hasYear = Boolean(requiredYear && text.includes(requiredYear));
    return hasState && hasType && hasYear;
  });
}


--- SIH-2026/backend/server/lib/moderation.ts ---

export type ModerationResult = {
  allowed: boolean;
  category?: 'profanity' | 'threat' | 'sexual' | 'abuse' | 'length';
};

const BLOCKED_PATTERNS: Array<{ category: ModerationResult['category']; pattern: RegExp }> = [
  { category: 'threat', pattern: /\b(?:kill|murder|rape|bomb|shoot)\s+(?:you|them|him|her|everyone)\b/i },
  { category: 'threat', pattern: /\b(?:kill yourself|go die|death threat)\b/i },
  { category: 'profanity', pattern: /\b(?:fuck|f+u+c+k|motherf+u+c+k|bitch|bastard|dick|cunt|slut|whore|asshole|bullshit|shithead)\b/i },
  { category: 'profanity', pattern: /\b(?:chutiya|chutiy|gand+u|harami|madarchod|behenchod|bhosdi|lund|randi|lauda)\b/i },
  { category: 'profanity', pattern: /(?:चूतिया|गांडू|हरामी|मादरचोद|बहनचोद|भोसड़ी|लौड़ा|रंडी)/u },
  { category: 'profanity', pattern: /(?:চোদা|চোদাচুদি|হারামি|বেশ্যা)/u },
  { category: 'profanity', pattern: /(?:தேவடியா|புண்டை|மயிரு|நாயே)/u },
  { category: 'profanity', pattern: /(?:ಲೋಫರ್|ಸೂಳೆ|ನಾಯಿಮಗ)/u },
  { category: 'profanity', pattern: /(?:లంజ|దెంగు|పూకు)/u },
  { category: 'profanity', pattern: /(?:ભાડવો|રાંડ|ચૂત)/u },
  { category: 'profanity', pattern: /(?:بکواس|حرامی|رنڈی)/u },
  { category: 'sexual', pattern: /\b(?:porn|xxx|sexually explicit|nude|nudes|child sexual|csam)\b/i },
  { category: 'abuse', pattern: /\b(?:idiot|moron|retard|stupid bastard|you are worthless)\b/i },
];

function normalizeForModeration(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toLowerCase()
    .replace(/[4@]/g, 'a')
    .replace(/[3]/g, 'e')
    .replace(/[1!]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[5$]/g, 's')
    .replace(/(.)\1{4,}/g, '$1$1')
    .replace(/[^\p{L}\p{M}\p{N}\s!?'-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function moderateChatInput(value: unknown): ModerationResult {
  if (typeof value !== 'string') return { allowed: false, category: 'length' };
  if (value.length === 0 || value.length > 4000) return { allowed: false, category: 'length' };
  const normalized = normalizeForModeration(value);
  const match = BLOCKED_PATTERNS.find(({ pattern }) => pattern.test(normalized));
  return match ? { allowed: false, category: match.category } : { allowed: true };
}


--- SIH-2026/backend/server/lib/relevanceEngine.ts ---

import {
  DisasterCategory,
  SachetAlert,
  RelevanceResult,
  RelevanceStatus,
  RelevanceConfidence,
  UserLocation,
  EvacuationGuidance,
  EmergencyContact,
} from '../types/disaster';
import { formatDisasterDate } from './dateFormat';

// Category-specific geographic relevance buffer thresholds in Kilometers
export const CATEGORY_DISTANCE_THRESHOLDS: Record<DisasterCategory | string, number> = {
  Cyclone: 150, // Cyclones have broad gale & surge radius
  Flood: 35, // Inundation / river basin impact radius
  'Urban Flood': 25,
  Earthquake: 250, // Tremors & seismic impact zone
  Landslide: 20, // Localized slope failure zone
  'Heat Wave': 75, // Regional thermal anomaly
  'Cold Wave': 75,
  Lightning: 25, // Convective thunderstorm cell
  Thunderstorm: 35,
  'Heavy Rain': 45,
  Storm: 60,
  Tsunami: 120, // Coastal surge perimeter
  Avalanche: 30,
  'Forest Fire': 30,
  Drought: 100,
  'Air Pollution': 80,
  'General Alert': 40,
};

/**
 * Haversine formula to compute great-circle distance between two coordinates in kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal precision
}

/**
 * Calculates initial compass bearing from point 1 to point 2 in degrees [0, 360).
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export function degreesToCardinal(deg: number): string {
  const cardinals = [
    'North',
    'North-East',
    'East',
    'South-East',
    'South',
    'South-West',
    'West',
    'North-West',
  ];
  const index = Math.round(deg / 45) % 8;
  return cardinals[index];
}

export function getOppositeCardinal(cardinal: string): string {
  const opposites: Record<string, string> = {
    North: 'South (Inland)',
    'North-East': 'South-West (Inland)',
    East: 'West (Inland / Higher Ground)',
    'South-East': 'North-West (Inland)',
    South: 'North (Inland)',
    'South-West': 'North-East (Inland)',
    West: 'East (Safe Elevation)',
    'North-West': 'South-East (Safe Zone)',
  };
  return opposites[cardinal] || 'Inland towards Higher Elevation';
}

/**
 * Generates verified emergency helplines for India / state / district.
 */
export function getEmergencyContactsForState(state?: string, helplineField?: string): EmergencyContact[] {
  const contacts: EmergencyContact[] = [
    {
      label: 'National Emergency Helpline (SOS)',
      number: '112',
      category: 'National',
      description: 'Single all-India emergency response for Police, Fire & Ambulance',
    },
    {
      label: 'NDRF Disaster Response Force',
      number: '1078',
      category: 'Disaster Force',
      description: 'National Disaster Response Force Headquarters 24x7 control room',
    },
    {
      label: 'State Emergency Operations Center (SEOC)',
      number: '1070',
      category: 'State',
      description: 'Toll-free state disaster management command control room',
    },
    {
      label: 'District Emergency Operations Center (DEOC)',
      number: '1077',
      category: 'District',
      description: 'District Collectorate emergency operations & shelter coordination',
    },
    {
      label: 'Police Control Room',
      number: '100',
      category: 'Police',
      description: 'Local law enforcement and rapid evacuation escorts',
    },
    {
      label: 'Ambulance & Medical Emergency',
      number: '108',
      category: 'Medical',
      description: 'National Health Mission 24x7 emergency medical transport',
    },
  ];

  if (helplineField && helplineField.trim()) {
    contacts.unshift({
      label: 'Official Issuer Helpline (From CAP Alert)',
      number: helplineField.replace(/[^0-9| ]/g, '').trim() || helplineField,
      category: 'State',
      description: helplineField,
    });
  }

  return contacts;
}

/**
 * Generates structured evacuation vector, safety measures, Do's & Don'ts tailored to hazard.
 */
export function generateEvacuationGuidance(
  userLoc: UserLocation,
  alert: SachetAlert,
  distanceKm: number,
  isInsideBoundary: boolean
): EvacuationGuidance {
  const originLat =
    alert.centroid?.[0] ??
    (alert.polygon?.coordinates?.[0]?.[0] ?? (alert.circle?.center[0] ?? userLoc.lat));
  const originLng =
    alert.centroid?.[1] ??
    (alert.polygon?.coordinates?.[0]?.[1] ?? (alert.circle?.center[1] ?? userLoc.lng));

  const bearingFromDisaster = calculateBearing(originLat, originLng, userLoc.lat, userLoc.lng);
  const disasterRelativeBearing = calculateBearing(userLoc.lat, userLoc.lng, originLat, originLng);

  const disasterDirFromUser = degreesToCardinal(disasterRelativeBearing);
  const safeEvacDir = getOppositeCardinal(disasterDirFromUser);

  const hazardOriginName = alert.areaDesc || alert.district || alert.state || 'Epicenter';
  const userCity = userLoc.cityName || 'your current area';

  let approachDescription = '';
  if (distanceKm === 0 || isInsideBoundary) {
    approachDescription = `Direct Impact Zone: Active hazard is currently centered over ${hazardOriginName} and encompasses ${userCity}.`;
  } else {
    approachDescription = `Hazard vector positioned ${distanceKm} km ${disasterDirFromUser} of ${userCity} (near ${hazardOriginName}).`;
  }

  // Recommended safe buffer distance to move
  let safeDistanceKm = 30;
  if (alert.category === 'Cyclone') safeDistanceKm = Math.max(35, Math.round(distanceKm * 0.7));
  else if (alert.category === 'Flood' || alert.category === 'Urban Flood') safeDistanceKm = 15;
  else if (alert.category === 'Landslide') safeDistanceKm = 10;
  else if (alert.category === 'Earthquake') safeDistanceKm = 20;

  // Tailored Actionable Measures & Do's / Don'ts
  let actionableMeasures: string[] = [];
  let dos: string[] = [];
  let donts: string[] = [];
  let urgencyLevel: EvacuationGuidance['urgencyLevel'] = 'STANDBY_AWARE';

  if (isInsideBoundary || distanceKm <= 20) {
    urgencyLevel = 'IMMEDIATE_EVACUATION';
  } else if (distanceKm <= 60) {
    urgencyLevel = 'PREPARE_TO_MOVE';
  } else if (distanceKm <= 120) {
    urgencyLevel = 'SHELTER_IN_PLACE';
  }

  const catLower = (alert.category || '').toLowerCase();

  if (catLower.includes('cyclon') || catLower.includes('storm')) {
    actionableMeasures = [
      `1. Immediate Evacuation Vector: Move at least ${safeDistanceKm} km towards the ${safeEvacDir} into designated Multi-Purpose Cyclone Shelters (MPCS) or sturdy reinforced concrete buildings.`,
      '2. Power & Gas Shutoff: Switch off main electrical circuit breakers and LPG gas regulators before leaving to prevent post-surge electrocution and fires.',
      '3. Emergency Survival Kit: Carry drinking water (3L/person), non-perishable food, power banks, battery torch, first-aid kit, and essential ID documents in waterproof bags.',
      '4. Structural Safety: Fasten loose rooftop tin sheets, secure windows, and move vehicles away from trees and hoardings.',
    ];
    dos = [
      'Relocate immediately to official cyclone shelters if residing in kutcha/low-lying structures.',
      'Keep mobile phones fully charged and stay tuned to official district disaster updates.',
      'Assist children, elderly persons, and pregnant women first during evacuation convoys.',
      'Store emergency drinking water in sealed, clean containers.',
    ];
    donts = [
      'DO NOT venture outdoors during the calm "eye of the cyclone" — gale winds will reverse abruptly with violent force.',
      'DO NOT touch fallen electric poles, dangling wires, or water in contact with submerged lines.',
      'DO NOT spread unverified social media rumours or ignore siren warning broadcasts.',
      'DO NOT attempt to cross coastal causeways or storm-surge inundated roads.',
    ];
  } else if (catLower.includes('flood') || catLower.includes('inundat')) {
    actionableMeasures = [
      `1. Immediate Flood Evacuation: Relocate ${safeDistanceKm} km towards ${safeEvacDir} to higher ground away from river embankments and low-lying drainage depressions.`,
      '2. Elevated Storage: Move valuable electronics, documents, and livestock to upper floors or earthen highlands.',
      '3. Water Safety: Boil drinking water or use chlorine purification tablets to prevent water-borne epidemics.',
      '4. Dial 1077 or 1070 for National Disaster Response Force (NDRF) rescue boat assistance.',
    ];
    dos = [
      'Disconnect main electrical supply to avoid short circuits in inundated ground floors.',
      'Keep a floating life jacket, inflated tube, or strong rope handy.',
      'Follow marked evacuation routes established by district administration.',
    ];
    donts = [
      'DO NOT walk or drive through flowing water — 15 cm of moving water can knock you down, and 30 cm can float vehicles.',
      'DO NOT consume flood water or food exposed to flood currents.',
      'DO NOT wade through flood water near electrical substations or transformer posts.',
    ];
  } else if (catLower.includes('landslide')) {
    actionableMeasures = [
      `1. Slope Evacuation: Evacuate immediately ${safeDistanceKm} km ${safeEvacDir} away from steep cut slopes, mountain streams, and debris paths.`,
      '2. Stay Alert for Warning Signs: Listen for unusual sounds like trees cracking, boulders knocking together, or muddy stream discharge.',
      '3. Highway Clearance: Halt mountain vehicular travel on affected corridors until State PWD and BRO confirm clearance.',
    ];
    dos = [
      'Move quickly out of the path of a landslide or debris flow towards solid bedrock ridge lines.',
      'Curl into a tight ball and protect your head if escape is not possible.',
      'Notify local authorities immediately about cracks appearing in road pavements or hillside retaining walls.',
    ];
    donts = [
      'DO NOT stay near stream channels, ravines, or cliff bottoms during prolonged heavy downpours.',
      'DO NOT cross active rockfall zones or newly formed debris piles.',
    ];
  } else if (catLower.includes('earthquake')) {
    actionableMeasures = [
      '1. Drop, Cover, and Hold On: Take cover under a sturdy desk or interior wall away from glass windows and heavy fixtures.',
      '2. Post-Tremor Evacuation: Once shaking stops, evacuate using stairwells (never use elevators) to open grounds.',
      '3. Gas & Electrical Safety: Shut off gas cylinders and main power breakers to avert aftershock fires.',
    ];
    dos = [
      'Stay inside if you are in a modern seismic-resistant building; protect head and neck.',
      'Move to open areas clear of power lines, high-rises, and brick parapets if outdoors.',
      'Expect aftershocks and keep emergency shoes and torches near your bed.',
    ];
    donts = [
      'DO NOT run outside during active ground tremors — falling debris causes most injuries.',
      'DO NOT use elevators or light matches/lighters until gas line integrity is verified.',
    ];
  } else {
    actionableMeasures = [
      `1. Precautionary Action: Follow official advisories and maintain readiness to move towards ${safeEvacDir} if conditions worsen.`,
      '2. Communication: Keep emergency helpline numbers handy (112 / 1070 / 1077).',
      '3. Stay Informed: Monitor official SACHET / NDMA / IMD bulletins.',
    ];
    dos = [
      'Follow instructions from local disaster management personnel.',
      'Check on vulnerable neighbors, elderly individuals, and pets.',
    ];
    donts = [
      'DO NOT venture into warning perimeters unnecessarily.',
      'DO NOT believe or propagate rumors.',
    ];
  }

  const emergencyContacts = getEmergencyContactsForState(alert.state, alert.helpline);

  return {
    hazardOriginName,
    bearingDegrees: Math.round(bearingFromDisaster),
    bearingCardinal: disasterDirFromUser,
    approachDescription,
    recommendedDirection: safeEvacDir,
    safeDistanceKm,
    urgencyLevel,
    actionableMeasures,
    dos,
    donts,
    emergencyContacts,
  };
}

/**
 * Ray-casting algorithm to test if a point (lat, lng) is strictly inside a polygon of [lat, lng] vertices.
 */
export function isPointInPolygon(
  point: [number, number],
  polygonCoords: [number, number][]
): boolean {
  if (!polygonCoords || polygonCoords.length < 3) return false;

  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygonCoords.length - 1; i < polygonCoords.length; j = i++) {
    const [xi, yi] = polygonCoords[i];
    const [xj, yj] = polygonCoords[j];

    const intersect =
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Computes minimum distance from a point to polygon perimeter (in km).
 */
export function minDistanceToPolygon(
  point: [number, number],
  polygonCoords: [number, number][]
): number {
  if (!polygonCoords || polygonCoords.length === 0) return Infinity;

  let minDistance = Infinity;
  for (let i = 0; i < polygonCoords.length; i++) {
    const vertex = polygonCoords[i];
    const d = calculateHaversineDistance(point[0], point[1], vertex[0], vertex[1]);
    if (d < minDistance) {
      minDistance = d;
    }
  }
  return minDistance;
}

/**
 * Checks if an alert is expired based on current wall-clock time (Section 77A).
 */
export function isAlertExpired(alert: SachetAlert, now: Date = new Date()): boolean {
  if (!alert.expires) return false;
  const expiryTime = new Date(alert.expires).getTime();
  return !isNaN(expiryTime) && expiryTime <= now.getTime();
}

/**
 * Generates a deterministic plain-language summary string from official structured fields (Section 50).
 * The LLM is NEVER used to invent or rephrase core alert facts.
 */
export function generatePlainLanguageSummary(alert: SachetAlert): string {
  const event = alert.event || alert.category || 'Disaster Alert';
  const area = alert.areaDesc || 'specified region';
  const severity = alert.severity || 'Active';

  let timeStr = 'further notice';
  if (alert.expires) {
    try {
      const exp = new Date(alert.expires);
      if (!isNaN(exp.getTime())) {
        timeStr =
          exp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) +
          ' on ' +
          formatDisasterDate(alert.expires);
      }
    } catch {
      timeStr = alert.expires;
    }
  }

  return `Official ${severity} ${event} is active for ${area}, valid until ${timeStr}.`;
}

/**
 * Evaluates the strict 5-case Location Relevance Engine for a user against an alert.
 */
export function evaluateLocationRelevance(
  userLoc: UserLocation,
  alert: SachetAlert
): RelevanceResult {
  const plainSummary = generatePlainLanguageSummary(alert);
  const threshold =
    CATEGORY_DISTANCE_THRESHOLDS[alert.category] || CATEGORY_DISTANCE_THRESHOLDS['General Alert'];

  // Case 1 & Case 2: Alert has an official polygon
  if (alert.polygon && alert.polygon.coordinates && alert.polygon.coordinates.length >= 3) {
    const inside = isPointInPolygon([userLoc.lat, userLoc.lng], alert.polygon.coordinates);

    if (inside) {
      // Case 1: Point strictly inside official polygon (highest confidence)
      const status: RelevanceStatus =
        alert.severity === 'Extreme' || alert.urgency === 'Immediate'
          ? 'CRITICAL'
          : alert.severity === 'Severe'
          ? 'HIGH_PRIORITY'
          : 'WARNING';

      const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, 0, true);

      return {
        status,
        distanceKm: 0,
        confidence: 'exact_polygon',
        confidenceLabel: 'Authoritative Official Boundary Match',
        isInsideBoundary: true,
        reason: `Your coordinates are directly inside the official ${alert.event} warning boundary for ${alert.areaDesc}.`,
        plainSummary,
        alert,
        evacuationGuidance,
      };
    } else {
      // Case 2: Point outside polygon -> compute distance
      const distance = minDistanceToPolygon([userLoc.lat, userLoc.lng], alert.polygon.coordinates);
      const roundedDist = Math.round(distance * 10) / 10;

      if (distance <= threshold) {
        const status: RelevanceStatus = distance <= threshold * 0.35 ? 'WARNING' : 'NEARBY';
        const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, roundedDist, false);

        return {
          status,
          distanceKm: roundedDist,
          confidence: 'polygon_distance',
          confidenceLabel: `Near Warning Boundary (${Math.round(distance)} km away)`,
          isInsideBoundary: false,
          reason: `Your location is approximately ${Math.round(distance)} km from the active ${alert.event} boundary (Buffer: ${threshold} km).`,
          plainSummary,
          alert,
          evacuationGuidance,
        };
      } else {
        return {
          status: 'NOT_RELEVANT',
          distanceKm: roundedDist,
          confidence: 'polygon_distance',
          confidenceLabel: 'Outside Category Relevance Buffer',
          isInsideBoundary: false,
          reason: `Distance (${Math.round(distance)} km) exceeds relevance threshold for ${alert.category} (${threshold} km).`,
          plainSummary,
          alert,
        };
      }
    }
  }

  // Case 3: Alert has an official circle
  if (alert.circle && alert.circle.center) {
    const distToCenter = calculateHaversineDistance(
      userLoc.lat,
      userLoc.lng,
      alert.circle.center[0],
      alert.circle.center[1]
    );
    const radius = alert.circle.radiusKm || 20;

    if (distToCenter <= radius) {
      const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, 0, true);
      return {
        status: alert.severity === 'Extreme' ? 'CRITICAL' : 'WARNING',
        distanceKm: 0,
        confidence: 'circle',
        confidenceLabel: 'Inside Official Warning Circle',
        isInsideBoundary: true,
        reason: `Your coordinates fall within the ${radius} km radius warning zone.`,
        plainSummary,
        alert,
        evacuationGuidance,
      };
    } else if (distToCenter <= radius + threshold) {
      const edgeDist = Math.max(0, distToCenter - radius);
      const roundedDist = Math.round(edgeDist * 10) / 10;
      const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, roundedDist, false);
      return {
        status: 'NEARBY',
        distanceKm: roundedDist,
        confidence: 'circle',
        confidenceLabel: `Near Warning Circle (${Math.round(edgeDist)} km away)`,
        isInsideBoundary: false,
        reason: `Your location is approximately ${Math.round(edgeDist)} km from the warning perimeter.`,
        plainSummary,
        alert,
        evacuationGuidance,
      };
    } else {
      return {
        status: 'NOT_RELEVANT',
        distanceKm: Math.round(distToCenter * 10) / 10,
        confidence: 'circle',
        confidenceLabel: 'Outside Circle Perimeter',
        isInsideBoundary: false,
        reason: `Distance (${Math.round(distToCenter)} km) is outside warning perimeter.`,
        plainSummary,
        alert,
      };
    }
  }

  // Case 4: Alert has centroid only (no polygon or circle geometry)
  if (alert.centroid) {
    const distToCentroid = calculateHaversineDistance(
      userLoc.lat,
      userLoc.lng,
      alert.centroid[0],
      alert.centroid[1]
    );
    const roundedDist = Math.round(distToCentroid * 10) / 10;

    if (distToCentroid <= threshold) {
      const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, roundedDist, false);
      return {
        status: 'NEARBY',
        distanceKm: roundedDist,
        confidence: 'approximate_centroid',
        confidenceLabel: 'approximate — precise boundary unavailable',
        isInsideBoundary: false,
        reason: `Located ~${Math.round(distToCentroid)} km from alert epicenter. Official precise polygon boundary was not supplied in feed.`,
        plainSummary,
        alert,
        evacuationGuidance,
      };
    } else {
      return {
        status: 'NOT_RELEVANT',
        distanceKm: roundedDist,
        confidence: 'approximate_centroid',
        confidenceLabel: 'approximate — outside radius',
        isInsideBoundary: false,
        reason: `Centroid distance (${Math.round(distToCentroid)} km) exceeds category threshold.`,
        plainSummary,
        alert,
      };
    }
  }

  // Case 5: Named administrative region match only (state/district match)
  if (alert.state && userLoc.state) {
    const normAlertState = alert.state.toLowerCase().trim();
    const normUserState = userLoc.state.toLowerCase().trim();

    if (
      normAlertState === normUserState ||
      normAlertState.includes(normUserState) ||
      normUserState.includes(normAlertState)
    ) {
      const evacuationGuidance = generateEvacuationGuidance(userLoc, alert, 0, false);
      return {
        status: 'AWARENESS_ONLY',
        distanceKm: 0,
        confidence: 'regional_match',
        confidenceLabel: 'State/District Administrative Match Only',
        isInsideBoundary: false,
        reason: `Regional match for ${alert.state}. Precise coordinates/polygon were not available from issuer.`,
        plainSummary,
        alert,
        evacuationGuidance,
      };
    }
  }

  // Default: Cannot establish geographical relevance
  return {
    status: 'NOT_RELEVANT',
    distanceKm: Infinity,
    confidence: 'unverified',
    confidenceLabel: 'No Geographic Relevance',
    isInsideBoundary: false,
    reason: 'Alert does not have proximity or overlap with current coordinates.',
    plainSummary,
    alert,
  };
}

/**
 * Evaluates relevance for all alerts against a user location and sorts them by priority and distance.
 */
export function evaluateAllAlertsRelevance(
  alerts: SachetAlert[],
  userLoc: UserLocation
): RelevanceResult[] {
  const priorityOrder: Record<RelevanceStatus, number> = {
    CRITICAL: 1,
    HIGH_PRIORITY: 2,
    WARNING: 3,
    NEARBY: 4,
    AWARENESS_ONLY: 5,
    NOT_RELEVANT: 6,
  };

  const results = alerts.map((alert) => evaluateLocationRelevance(userLoc, alert));

  return results.sort((a, b) => {
    const pDiff = (priorityOrder[a.status] || 99) - (priorityOrder[b.status] || 99);
    if (pDiff !== 0) return pDiff;
    return (a.distanceKm || 0) - (b.distanceKm || 0);
  });
}




--- SIH-2026/backend/server/lib/translate.ts ---

const translationCache = new Map<string, string>();
const TRANSLATION_ENDPOINT = String(process.env.TRANSLATION_API_URL || 'https://api.mymemory.translated.net/get').trim();
const MAX_QUERY_BYTES = 480;

export interface LocalizedPresentationText {
  original: string;
  text: string;
  language: string;
  translated: boolean;
}

/** Converts RSS/HTML fragments into safe display text before translation. */
export function normalizePresentationText(value: string): string {
  return (value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?p[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function fingerprint(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function protectNonTranslatableTokens(value: string) {
  const tokens = Array.from(new Set(value.match(/\[S\d+\]|https?:\/\/[^\s)]+|\b(?:CAP|SACHET)-[A-Za-z0-9_-]+\b/g) || []));
  let protectedValue = value;
  tokens.forEach((token, index) => {
    protectedValue = protectedValue.split(token).join(`__KEEP_${index}__`);
  });
  return { protectedValue, tokens };
}

/**
 * Localizes a display copy without changing canonical alert/evidence objects.
 * The cache fingerprint includes normalized source content, so changes naturally
 * produce a new cache entry.
 */
export async function resolveLocalizedPresentation(value: string, targetLanguage?: string): Promise<LocalizedPresentationText> {
  const original = normalizePresentationText(value);
  const language = normalizeLanguageCode(targetLanguage);
  if (!original || language === 'en') return { original, text: original, language, translated: false };

  const cacheKey = `presentation|${language}|${fingerprint(original)}|${original.length}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return { original, text: cached, language, translated: true };

  const { protectedValue, tokens } = protectNonTranslatableTokens(original);
  const translated = await translateText(protectedValue, language);
  let text = translated;
  tokens.forEach((token, index) => {
    text = text.split(`__KEEP_${index}__`).join(token);
  });
  const normalized = normalizePresentationText(text) || original;
  const wasTranslated = normalized !== original;
  if (wasTranslated) translationCache.set(cacheKey, normalized);
  return { original, text: normalized, language, translated: wasTranslated };
}

function normalizeLanguageCode(lang?: string): string {
  const code = (lang || 'en').trim().toLowerCase();
  if (!code || code === 'en') return 'en';
  const aliases: Record<string, string> = {
    english: 'en', hindi: 'hi', bengali: 'bn', bangla: 'bn', telugu: 'te', marathi: 'mr',
    tamil: 'ta', urdu: 'ur', gujarati: 'gu', kannada: 'kn', odia: 'or', oriya: 'or',
    malayalam: 'ml', punjabi: 'pa', assamese: 'as', maithili: 'mai', nepali: 'ne',
    konkani: 'kok', sindhi: 'sd', dogri: 'doi', manipuri: 'mni', bodo: 'brx',
  };
  return aliases[code] || code.split('-')[0];
}

function splitForProvider(text: string): string[] {
  if (new TextEncoder().encode(text).length <= MAX_QUERY_BYTES) return [text];
  const chunks: string[] = [];
  let current = '';
  for (const word of text.split(/(\s+)/)) {
    const candidate = current + word;
    if (current && new TextEncoder().encode(candidate).length > MAX_QUERY_BYTES) {
      chunks.push(current);
      current = word.trimStart();
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks.length ? chunks : [text];
}

async function translateChunk(text: string, targetLanguage: string, sourceLanguage: string): Promise<string> {
  const params = new URLSearchParams({
    q: text,
    langpair: `${sourceLanguage || 'en'}|${targetLanguage}`,
    mt: '1',
  });
  try {
    const response = await fetch(`${TRANSLATION_ENDPOINT}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return text;
    const payload = await response.json() as {
      responseStatus?: number;
      responseData?: { translatedText?: unknown };
    };
    const translated = payload.responseData?.translatedText;
    return payload.responseStatus === 200 && typeof translated === 'string' && translated.trim()
      ? translated
      : text;
  } catch {
    return text;
  }
}

export async function translateText(text: string, targetLanguage?: string, sourceLanguage = 'en'): Promise<string> {
  const lang = normalizeLanguageCode(targetLanguage);
  const source = normalizeLanguageCode(sourceLanguage);
  const cleanText = (text || '').toString();
  if (!cleanText.trim()) return cleanText;
  if (lang === source) return cleanText;

  const cacheKey = `${source}|${lang}|${cleanText}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  try {
    const chunks = splitForProvider(cleanText);
    const translated = await Promise.all(chunks.map((chunk) => translateChunk(chunk, lang, source)));
    const finalText = translated.join('') || cleanText;
    translationCache.set(cacheKey, finalText);
    return finalText;
  } catch {
    return cleanText;
  }
}

export async function translateArray(items: string[], targetLanguage?: string, sourceLanguage = 'en'): Promise<string[]> {
  const results: string[] = [];
  for (const item of items) {
    results.push(await translateText(item, targetLanguage, sourceLanguage));
  }
  return results;
}

export function normalizeLang(lang?: string): string {
  return normalizeLanguageCode(lang);
}


--- SIH-2026/backend/server/data/historicalDisasters.ts ---

import { EvidenceBundle } from '../types/disaster';

export interface HistoricalDisasterItem extends EvidenceBundle {
  year: number;
  numericCasualties: number;
  decade: '1990s' | '2000s' | '2010s' | '2020s';
  economicLossInrCr?: number;
}

/**
 * Historical archive data is loaded live from the API.
 * The client keeps this module only for shared types.
 */
export const HISTORICAL_DISASTERS_CATALOG: HistoricalDisasterItem[] = [];


--- SIH-2026/backend/api/[...path].ts ---

import { createApp } from '../../server/app';

const app = createApp({ mode: 'vercel', serveStatic: false });

export default app;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};