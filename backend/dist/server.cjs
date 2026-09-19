"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_http = require("http");

// server/app.ts
var import_config = require("dotenv/config");
var import_express2 = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);

// server/routes.ts
var import_express = require("express");
var import_multer = __toESM(require("multer"), 1);

// server/sachet.ts
var import_fast_xml_parser = require("fast-xml-parser");

// server/lib/dateFormat.ts
function formatDisasterDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
function coerceIsoDate(value) {
  if (typeof value !== "string" || !value.trim()) return void 0;
  const trimmed = value.trim();
  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) return date.toISOString();
  const yearMatch = trimmed.match(/\b(19\d\d|20\d\d)\b/);
  if (yearMatch) return (/* @__PURE__ */ new Date(`${yearMatch[0]}-01-01T00:00:00.000Z`)).toISOString();
  return void 0;
}

// server/lib/relevanceEngine.ts
function isAlertExpired(alert, now = /* @__PURE__ */ new Date()) {
  if (!alert.expires) return false;
  const expiryTime = new Date(alert.expires).getTime();
  return !isNaN(expiryTime) && expiryTime <= now.getTime();
}

// server/sachet.ts
var sachetCache = {
  etag: `sachet-${Date.now()}`,
  lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
  data: [],
  liveSourceCount: 0
};
var xmlParser = new import_fast_xml_parser.XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  trimValues: true
});
function normalizeCategory(raw, eventName) {
  const combined = `${raw || ""} ${eventName || ""}`.toLowerCase();
  if (combined.includes("cyclon") || combined.includes("depression") || combined.includes("gale")) return "Cyclone";
  if (combined.includes("flood") || combined.includes("inundat")) {
    if (combined.includes("urban")) return "Urban Flood";
    return "Flood";
  }
  if (combined.includes("earthquake") || combined.includes("seismic") || combined.includes("tremor")) return "Earthquake";
  if (combined.includes("landslide") || combined.includes("rockfall") || combined.includes("mudslide")) return "Landslide";
  if (combined.includes("heat") || combined.includes("loo")) return "Heat Wave";
  if (combined.includes("cold") || combined.includes("frost")) return "Cold Wave";
  if (combined.includes("lightning") || combined.includes("thunderbolt")) return "Lightning";
  if (combined.includes("thunderstorm") || combined.includes("squall")) return "Thunderstorm";
  if (combined.includes("heavy rain") || combined.includes("rainfall") || combined.includes("downpour")) return "Heavy Rain";
  if (combined.includes("storm")) return "Storm";
  if (combined.includes("tsunami")) return "Tsunami";
  if (combined.includes("avalanche")) return "Avalanche";
  if (combined.includes("forest fire") || combined.includes("wildfire")) return "Forest Fire";
  if (combined.includes("drought")) return "Drought";
  if (combined.includes("air pollution") || combined.includes("smog") || combined.includes("aqi")) return "Air Pollution";
  return "General Alert";
}
var INDIA_BOUNDS = {
  minLat: 6,
  maxLat: 38.8,
  minLng: 67.5,
  maxLng: 98.8
};
var STATE_CENTROIDS = {
  "andaman and nicobar islands": [11.7401, 92.6586],
  "andhra pradesh": [15.9129, 79.74],
  "arunachal pradesh": [28.218, 94.7278],
  assam: [26.2006, 92.9376],
  bihar: [25.0961, 85.3131],
  chhattisgarh: [21.2787, 81.8661],
  goa: [15.2993, 74.124],
  gujarat: [22.2587, 71.1924],
  haryana: [29.0588, 76.0856],
  "himachal pradesh": [31.1048, 77.1734],
  jharkhand: [23.6102, 85.2799],
  karnataka: [15.3173, 75.7139],
  kerala: [10.8505, 76.2711],
  ladakh: [34.1526, 77.577],
  "madhya pradesh": [22.9734, 78.6569],
  maharashtra: [19.7515, 75.7139],
  manipur: [24.6637, 93.9063],
  meghalaya: [25.467, 91.3662],
  mizoram: [23.1645, 92.9376],
  nagaland: [26.1584, 94.5624],
  odisha: [20.9517, 85.0985],
  punjab: [31.1471, 75.3412],
  rajasthan: [27.0238, 74.2179],
  sikkim: [27.533, 88.5122],
  "tamil nadu": [11.1271, 78.6569],
  telangana: [18.1124, 79.0193],
  tripura: [23.9408, 91.9882],
  uttarakhand: [30.0668, 79.0193],
  "uttar pradesh": [26.8467, 80.9462],
  "west bengal": [22.9868, 87.855],
  delhi: [28.6139, 77.209],
  "jammu and kashmir": [33.7782, 76.5762],
  "dadra and nagar haveli and daman and diu": [20.3974, 72.8328],
  "puducherry": [11.9416, 79.8083]
};
function isWithinIndiaBounds(lat, lng) {
  return lat >= INDIA_BOUNDS.minLat && lat <= INDIA_BOUNDS.maxLat && lng >= INDIA_BOUNDS.minLng && lng <= INDIA_BOUNDS.maxLng;
}
function deriveIndicativeCentroid(...parts) {
  const text = parts.filter(Boolean).join(" ").toLowerCase();
  if (!text) return void 0;
  for (const [needle, centroid] of Object.entries(STATE_CENTROIDS)) {
    if (text.includes(needle)) {
      return centroid;
    }
  }
  if (text.includes("bhubaneswar") || text.includes("puri") || text.includes("cuttack")) return STATE_CENTROIDS.odisha;
  if (text.includes("guwahati") || text.includes("kamrup") || text.includes("dibrugarh")) return STATE_CENTROIDS.assam;
  if (text.includes("shimla") || text.includes("kullu") || text.includes("manali")) return STATE_CENTROIDS["himachal pradesh"];
  if (text.includes("srinagar") || text.includes("jammu")) return STATE_CENTROIDS["jammu and kashmir"];
  if (text.includes("mumbai") || text.includes("raigad") || text.includes("konkan")) return STATE_CENTROIDS.maharashtra;
  if (text.includes("kozhikode") || text.includes("wayanad") || text.includes("thiruvananthapuram")) return STATE_CENTROIDS.kerala;
  if (text.includes("ahmedabad") || text.includes("surat") || text.includes("kutch")) return STATE_CENTROIDS.gujarat;
  if (text.includes("kolkata") || text.includes("sundarbans")) return STATE_CENTROIDS["west bengal"];
  if (text.includes("chennai") || text.includes("madurai") || text.includes("tirunelveli")) return STATE_CENTROIDS["tamil nadu"];
  if (text.includes("jaipur") || text.includes("bikaner") || text.includes("jaisalmer")) return STATE_CENTROIDS.rajasthan;
  if (text.includes("delhi") || text.includes("ncr") || text.includes("gurugram")) return STATE_CENTROIDS.delhi;
  const districtHints = [
    ["arvalli", STATE_CENTROIDS.gujarat],
    ["chhotaudepur", STATE_CENTROIDS.gujarat],
    ["chhota udaipur", STATE_CENTROIDS.gujarat],
    ["dahod", STATE_CENTROIDS.gujarat],
    ["mahisagar", STATE_CENTROIDS.gujarat],
    ["narmada", STATE_CENTROIDS.gujarat],
    ["panch mahals", STATE_CENTROIDS.gujarat],
    ["panchmahal", STATE_CENTROIDS.gujarat],
    ["sabarkantha", STATE_CENTROIDS.gujarat],
    ["sabar kantha", STATE_CENTROIDS.gujarat],
    ["banaskantha", STATE_CENTROIDS.gujarat],
    ["balrampur", STATE_CENTROIDS["chhattisgarh"]],
    ["bastar", STATE_CENTROIDS["chhattisgarh"]],
    ["bijapur", STATE_CENTROIDS["chhattisgarh"]],
    ["dantewada", STATE_CENTROIDS["chhattisgarh"]],
    ["koriya", STATE_CENTROIDS["chhattisgarh"]],
    ["manendragarh", STATE_CENTROIDS["chhattisgarh"]],
    ["sukma", STATE_CENTROIDS["chhattisgarh"]],
    ["surajpur", STATE_CENTROIDS["chhattisgarh"]],
    ["chengalpattu", STATE_CENTROIDS["tamil nadu"]],
    ["cuddalore", STATE_CENTROIDS["tamil nadu"]],
    ["kallakurichi", STATE_CENTROIDS["tamil nadu"]],
    ["kancheepuram", STATE_CENTROIDS["tamil nadu"]],
    ["pudukkottai", STATE_CENTROIDS["tamil nadu"]],
    ["sivaganga", STATE_CENTROIDS["tamil nadu"]],
    ["thanjavur", STATE_CENTROIDS["tamil nadu"]],
    ["thiruvarur", STATE_CENTROIDS["tamil nadu"]],
    ["viluppuram", STATE_CENTROIDS["tamil nadu"]],
    ["ariyalur", STATE_CENTROIDS["tamil nadu"]],
    ["karur", STATE_CENTROIDS["tamil nadu"]],
    ["alipurduar", STATE_CENTROIDS["west bengal"]],
    ["jalpaiguri", STATE_CENTROIDS["west bengal"]],
    ["north dinajpur", STATE_CENTROIDS["west bengal"]],
    ["south dinajpur", STATE_CENTROIDS["west bengal"]],
    ["uttar dinajpur", STATE_CENTROIDS["west bengal"]],
    ["dakshin dinajpur", STATE_CENTROIDS["west bengal"]],
    ["dehradun", STATE_CENTROIDS.uttarakhand],
    ["tehri", STATE_CENTROIDS.uttarakhand],
    ["uttarkashi", STATE_CENTROIDS.uttarakhand],
    ["chamoli", STATE_CENTROIDS.uttarakhand],
    ["rudraprayag", STATE_CENTROIDS.uttarakhand],
    ["pithoragarh", STATE_CENTROIDS.uttarakhand],
    ["east garo hills", STATE_CENTROIDS.meghalaya],
    ["west garo hills", STATE_CENTROIDS.meghalaya],
    ["east khasi hills", STATE_CENTROIDS.meghalaya],
    ["west khasi hills", STATE_CENTROIDS.meghalaya],
    ["west jaintia hills", STATE_CENTROIDS.meghalaya],
    ["south west khasi hills", STATE_CENTROIDS.meghalaya],
    ["ri bhoi", STATE_CENTROIDS.meghalaya],
    ["bahraich", STATE_CENTROIDS["uttar pradesh"]],
    ["shravasti", STATE_CENTROIDS["uttar pradesh"]],
    ["saharanpur", STATE_CENTROIDS["uttar pradesh"]],
    ["sonbhadra", STATE_CENTROIDS["uttar pradesh"]],
    ["kamrup", STATE_CENTROIDS.assam],
    ["sonitpur", STATE_CENTROIDS.assam],
    ["dibrugarh", STATE_CENTROIDS.assam],
    ["goalpara", STATE_CENTROIDS.assam],
    ["barpeta", STATE_CENTROIDS.assam],
    ["raigad", STATE_CENTROIDS.maharashtra],
    ["ratnagiri", STATE_CENTROIDS.maharashtra],
    ["sindhudurg", STATE_CENTROIDS.maharashtra],
    ["wayanad", STATE_CENTROIDS.kerala],
    ["idukki", STATE_CENTROIDS.kerala],
    ["palakkad", STATE_CENTROIDS.kerala],
    ["bhadrak", STATE_CENTROIDS.odisha],
    ["balasore", STATE_CENTROIDS.odisha],
    ["khordha", STATE_CENTROIDS.odisha],
    ["kalahandi", STATE_CENTROIDS.odisha],
    ["koraput", STATE_CENTROIDS.odisha],
    ["jagatsinghpur", STATE_CENTROIDS.odisha],
    ["kendrapara", STATE_CENTROIDS.odisha],
    ["muzaffarpur", STATE_CENTROIDS.bihar],
    ["sitamarhi", STATE_CENTROIDS.bihar],
    ["madhubani", STATE_CENTROIDS.bihar],
    ["patna", STATE_CENTROIDS.bihar]
  ];
  for (const [needle, centroid] of districtHints) {
    if (text.includes(needle)) return centroid;
  }
  return void 0;
}
function isLikelyIndianEarthquake(place, lat, lng) {
  if (!isWithinIndiaBounds(lat, lng)) return false;
  const text = place.toLowerCase();
  const indianHints = [
    "india",
    "assam",
    "bihar",
    "gujarat",
    "himachal pradesh",
    "jammu and kashmir",
    "karnataka",
    "kerala",
    "maharashtra",
    "odisha",
    "rajasthan",
    "sikkim",
    "tamil nadu",
    "uttarakhand",
    "west bengal",
    "delhi",
    "manipur",
    "nagaland",
    "mizoram",
    "tripura",
    "meghalaya",
    "arunachal pradesh",
    "andhra pradesh",
    "telangana",
    "punjab"
  ];
  return indianHints.some((hint) => text.includes(hint));
}
async function fetchUSGSIndianEarthquakes() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.8&minlatitude=5.0&maxlatitude=38.0&minlongitude=65.0&maxlongitude=98.0&limit=15";
    const res = await fetch(url, { signal: controller.signal }).catch(() => null);
    clearTimeout(timeoutId);
    if (!res || !res.ok) return [];
    const json = await res.json();
    const features = json.features || [];
    const alerts = [];
    for (const f of features) {
      const props = f.properties || {};
      const geom = f.geometry || {};
      const [lng, lat, depth] = geom.coordinates || [0, 0, 0];
      if (!lat || !lng) continue;
      const mag = Number(props.mag || 0);
      const place = String(props.place || "Northern Indian Subcontinent");
      const timeMs = Number(props.time || Date.now());
      const sentTime = new Date(timeMs).toISOString();
      const expiryTime = new Date(timeMs + 48 * 3600 * 1e3).toISOString();
      if (!isLikelyIndianEarthquake(place, lat, lng)) {
        continue;
      }
      let severity = "Minor";
      if (mag >= 5.5) severity = "Extreme";
      else if (mag >= 4.5) severity = "Severe";
      else if (mag >= 3.5) severity = "Moderate";
      const alertId = `USGS-EQ-${f.id || Date.now()}`;
      const workingUrl = props.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${f.id}`;
      alerts.push({
        id: alertId,
        identifier: `USGS/NCS/EQ/${f.id}`,
        bulletinNo: `SEISMO-EQ-M${mag.toFixed(1)}-${f.id}`,
        sender: "National Center for Seismology (NCS) & USGS Global Seismic Network",
        sourceAgency: "National Center for Seismology (NCS) & USGS",
        helpline: "1070 (SEOC) | 1077 (DEOC) | 112 National Emergency",
        officialPortalUrl: "https://seismo.gov.in",
        liveNewsQuery: `earthquake ${place} India magnitude ${mag.toFixed(1)}`,
        feedOrigin: "NDMA_SACHET_LIVE",
        sent: sentTime,
        status: "Actual",
        msgType: "Alert",
        source: "Live USGS / National Center for Seismology (NCS) Real-Time Seismic Stream",
        scope: "Public",
        category: "Earthquake",
        rawCategory: "Geo / Seismic",
        event: `Seismic Activity (Magnitude ${mag.toFixed(1)})`,
        urgency: mag >= 4.5 ? "Immediate" : "Expected",
        severity,
        certainty: "Observed",
        headline: `M ${mag.toFixed(1)} Earthquake Recorded near ${place}`,
        description: `A magnitude ${mag.toFixed(1)} earthquake was detected at coordinates ${lat.toFixed(4)}\xB0N, ${lng.toFixed(4)}\xB0E at a depth of ${depth} km. Monitored in real-time by seismic telemetry networks.`,
        instruction: mag >= 4.5 ? "1. If indoors: DROP, COVER, and HOLD ON under sturdy furniture away from windows.\n2. If outdoors: Move to open areas away from buildings, overhead electrical wires, and steep slopes.\n3. Be prepared for potential secondary aftershocks. Check gas lines and structural cracks before re-entering buildings." : "Minor seismic tremor registered. No immediate structural damage expected. Stay calm and monitor official State Disaster Management Authority updates.",
        areaDesc: place,
        centroid: [lat, lng],
        circle: {
          center: [lat, lng],
          radiusKm: Math.max(15, mag * 18)
        },
        effective: sentTime,
        expires: expiryTime,
        isExpired: false,
        webUrl: workingUrl
      });
    }
    return alerts;
  } catch (e) {
    console.log("USGS live seismic API notice:", e.message);
    return [];
  }
}
var PUBLIC_SACHET_FEED_URL = "https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml";
function asArray(value) {
  if (value === void 0 || value === null) return [];
  return Array.isArray(value) ? value : [value];
}
function asString(value, fallback = "") {
  if (value === void 0 || value === null) return fallback;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}
function normalizeSeverityValue(value) {
  const raw = asString(value).toLowerCase();
  if (raw === "extreme" || raw.includes("red")) return "Extreme";
  if (raw === "severe" || raw.includes("orange")) return "Severe";
  if (raw === "moderate" || raw.includes("yellow")) return "Moderate";
  return "Minor";
}
function normalizeUrgencyValue(value) {
  return asString(value).toLowerCase() === "immediate" ? "Immediate" : "Expected";
}
function normalizeCertaintyValue(value) {
  const raw = asString(value).toLowerCase();
  if (raw === "observed") return "Observed";
  if (raw === "likely") return "Likely";
  return "Possible";
}
function parseCapPolygon(value) {
  const raw = asString(value);
  if (!raw) return void 0;
  const points = [];
  for (const pair of raw.split(/\s+/)) {
    const [latRaw, lngRaw] = pair.split(",");
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      points.push([lat, lng]);
    }
  }
  if (points.length < 3) return void 0;
  return {
    type: "Polygon",
    coordinates: points
  };
}
function parseCapCircle(value) {
  const raw = asString(value);
  if (!raw) return void 0;
  const [latRaw, lngRaw, radiusRaw] = raw.split(",");
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  const radiusKm = Number(radiusRaw);
  if (![lat, lng, radiusKm].every(Number.isFinite)) {
    return void 0;
  }
  return {
    center: [lat, lng],
    radiusKm
  };
}
function calculateCentroid(polygon, circle) {
  if (circle) return circle.center;
  if (!polygon?.coordinates?.length) return void 0;
  const points = polygon.coordinates;
  const lat = points.reduce((sum, p) => sum + p[0], 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p[1], 0) / points.length;
  return [lat, lng];
}
function parseCapAlert(root) {
  const infos = asArray(root?.info || root?.["cap:info"]);
  if (!infos.length) return [];
  const selectedInfo = infos.find((info2) => {
    const language = asString(info2.language || info2["cap:language"]).toLowerCase();
    return language === "en" || language === "en-in" || language.startsWith("en-");
  }) || infos[0];
  const info = selectedInfo || {};
  const area = asArray(info.area || info["cap:area"])[0] || {};
  const event = asString(
    info.event || info["cap:event"],
    "Disaster Warning"
  );
  const rawCategory = asString(
    info.category || info["cap:category"],
    "Met"
  );
  const polygon = parseCapPolygon(
    area.polygon || area["cap:polygon"]
  );
  const circle = parseCapCircle(
    area.circle || area["cap:circle"]
  );
  const centroid = calculateCentroid(polygon, circle) || deriveIndicativeCentroid(
    asString(info.parameter?.state || info.parameter?.STATE),
    asString(info.parameter?.district || info.parameter?.DISTRICT),
    asString(area.areaDesc || area["cap:areaDesc"]),
    event,
    rawCategory
  );
  const sent = asString(
    root.sent,
    (/* @__PURE__ */ new Date()).toISOString()
  );
  const effective = asString(
    info.effective || info["cap:effective"],
    sent
  );
  const expires = asString(
    info.expires || info["cap:expires"],
    new Date(Date.now() + 24 * 3600 * 1e3).toISOString()
  );
  const alertObj = {
    id: asString(
      root.identifier,
      `SACHET-${Date.now()}-${Math.random().toString(36).slice(2)}`
    ),
    identifier: asString(
      root.identifier,
      `NDMA/SACHET/${Date.now()}`
    ),
    bulletinNo: asString(
      info.parameter?.value || root.identifier,
      root.identifier || "NDMA-CAP-OFFICIAL"
    ),
    sender: asString(
      root.sender,
      "NDMA / SACHET Portal"
    ),
    sourceAgency: asString(
      root.sender,
      "National Disaster Management Authority (NDMA)"
    ),
    helpline: "1070 (SEOC) | 1077 (District Control) | 112",
    officialPortalUrl: "https://sachet.ndma.gov.in",
    liveNewsQuery: `${event} ${asString(area.areaDesc || area["cap:areaDesc"])} alert India`,
    feedOrigin: "NDMA_SACHET_LIVE",
    sent,
    status: asString(root.status, "Actual"),
    msgType: asString(root.msgType, "Alert"),
    source: "NDMA SACHET Public India CAP RSS Feed",
    scope: asString(root.scope, "Public"),
    category: normalizeCategory(rawCategory, event),
    rawCategory,
    event,
    urgency: normalizeUrgencyValue(
      info.urgency || info["cap:urgency"]
    ),
    severity: normalizeSeverityValue(
      info.severity || info["cap:severity"]
    ),
    certainty: normalizeCertaintyValue(
      info.certainty || info["cap:certainty"]
    ),
    headline: asString(
      info.headline || info["cap:headline"],
      event
    ),
    description: asString(
      info.description || info["cap:description"],
      "Active alert from NDMA SACHET."
    ),
    instruction: asString(
      info.instruction || info["cap:instruction"],
      "Follow official instructions from local disaster management authorities."
    ),
    areaDesc: asString(
      area.areaDesc || area["cap:areaDesc"],
      "Designated warning zone"
    ),
    polygon,
    circle,
    centroid,
    state: asString(info.parameter?.state || info.parameter?.STATE) || void 0,
    district: asString(info.parameter?.district || info.parameter?.DISTRICT) || void 0,
    effective,
    expires,
    isExpired: false,
    webUrl: asString(
      info.web || info["cap:web"],
      "https://sachet.ndma.gov.in"
    )
  };
  if (isAlertExpired(alertObj)) return [];
  return [alertObj];
}
function parseCapPayload(rawContent) {
  try {
    if (!rawContent.trim()) return [];
    if (rawContent.trim().startsWith("{") || rawContent.trim().startsWith("[")) {
      return [];
    }
    const parsed = xmlParser.parse(rawContent);
    const roots = [];
    const directAlerts = parsed?.alert || parsed?.["cap:alert"];
    if (directAlerts) {
      roots.push(...asArray(directAlerts));
    }
    const items = asArray(
      parsed?.rss?.channel?.item
    );
    for (const item of items) {
      const nested = item?.alert || item?.["cap:alert"] || item?.Alert;
      if (nested) {
        roots.push(...asArray(nested));
      }
    }
    const results = [];
    for (const root of roots) {
      results.push(...parseCapAlert(root));
    }
    if (results.length === 0) {
      for (const item of items) {
        const title = asString(item.title);
        const description = asString(item.description);
        if (!title && !description) continue;
        const identifier = asString(
          item.guid || item.id || item.link,
          `SACHET-RSS-${Date.now()}-${Math.random().toString(36).slice(2)}`
        );
        const sent = asString(
          item.pubDate,
          (/* @__PURE__ */ new Date()).toISOString()
        );
        const fallbackAlert = {
          id: identifier,
          identifier,
          bulletinNo: identifier,
          sender: asString(
            item.source,
            "NDMA SACHET"
          ),
          sourceAgency: "National Disaster Management Authority (NDMA)",
          helpline: "1070 (SEOC) | 1077 (District Control) | 112",
          officialPortalUrl: "https://sachet.ndma.gov.in",
          liveNewsQuery: `${title || "disaster"} India alert`,
          feedOrigin: "NDMA_SACHET_LIVE",
          sent,
          status: "Actual",
          msgType: "Alert",
          source: "NDMA SACHET Public India CAP RSS Feed",
          scope: "Public",
          category: normalizeCategory(title, title),
          rawCategory: "RSS",
          event: title || "Disaster Warning",
          urgency: "Expected",
          severity: "Moderate",
          certainty: "Possible",
          headline: title || "Official SACHET Alert",
          description: description || "Official alert published through SACHET.",
          instruction: "Follow official instructions from NDMA and local authorities.",
          areaDesc: title || "Designated warning zone",
          centroid: deriveIndicativeCentroid(
            title,
            description,
            asString(item.source)
          ),
          effective: sent,
          expires: new Date(
            new Date(sent).getTime() + 24 * 3600 * 1e3
          ).toISOString(),
          isExpired: false,
          webUrl: asString(
            item.link,
            "https://sachet.ndma.gov.in"
          )
        };
        if (!isAlertExpired(fallbackAlert)) {
          results.push(fallbackAlert);
        }
      }
    }
    const seen = /* @__PURE__ */ new Set();
    return results.filter((alert) => {
      if (seen.has(alert.identifier)) return false;
      seen.add(alert.identifier);
      return true;
    });
  } catch (err) {
    console.error(
      "Error parsing public SACHET CAP/RSS payload:",
      err.message
    );
    return [];
  }
}
async function getSachetAlerts(clientEtag) {
  const now = /* @__PURE__ */ new Date();
  const cacheAgeMs = Date.now() - new Date(
    sachetCache.lastUpdated
  ).getTime();
  if (sachetCache.data.length > 0 && cacheAgeMs < 45e3 && clientEtag === sachetCache.etag) {
    const active = sachetCache.data.filter(
      (a) => !isAlertExpired(a, now)
    );
    return {
      alerts: active,
      etag: sachetCache.etag,
      isModified: false,
      lastUpdated: sachetCache.lastUpdated,
      cacheStatus: "ETAG_CACHED",
      sourceUrl: sachetCache.sourceUrl
    };
  }
  let sachetLiveAlerts = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      1e4
    );
    const response = await fetch(
      PUBLIC_SACHET_FEED_URL,
      {
        method: "GET",
        headers: {
          Accept: "application/rss+xml, application/xml, text/xml, */*",
          "User-Agent": "DisasterAlertPlatform/1.0"
        },
        signal: controller.signal
      }
    ).catch(() => null);
    clearTimeout(timeoutId);
    if (response?.ok) {
      const contentType = (response.headers.get(
        "content-type"
      ) || "").toLowerCase();
      const body = await response.text();
      const looksLikeXml = body.trimStart().startsWith("<?xml") || body.trimStart().startsWith("<rss") || body.trimStart().startsWith("<feed") || body.trimStart().startsWith("<alert") || contentType.includes("xml") || contentType.includes("rss");
      if (!looksLikeXml) {
        throw new Error(
          `SACHET returned a non-XML response. HTTP ${response.status}, content-type=${contentType || "unknown"}`
        );
      }
      sachetLiveAlerts = parseCapPayload(body);
    } else {
      throw new Error(
        `SACHET public feed request failed: HTTP ${response?.status ?? "NO_RESPONSE"}`
      );
    }
  } catch (err) {
    console.error(
      "Public SACHET feed notice:",
      err.message
    );
    sachetLiveAlerts = sachetCache.data.filter(
      (a) => a.feedOrigin === "NDMA_SACHET_LIVE" && !isAlertExpired(a, now)
    );
  }
  const usgsAlerts = await fetchUSGSIndianEarthquakes();
  const combinedAlerts = [
    ...sachetLiveAlerts,
    ...usgsAlerts
  ];
  const activeAlerts = combinedAlerts.filter(
    (a) => !isAlertExpired(a, now)
  ).sort(
    (a, b) => new Date(
      b.sent || b.effective
    ).getTime() - new Date(
      a.sent || a.effective
    ).getTime()
  );
  const fingerprint = activeAlerts.map(
    (a) => `${a.identifier}|${a.sent}|${a.effective}|${a.expires}|${a.category}`
  ).sort().join("||");
  let hash = 2166136261;
  for (let i = 0; i < fingerprint.length; i++) {
    hash ^= fingerprint.charCodeAt(i);
    hash = Math.imul(
      hash,
      16777619
    );
  }
  const newEtag = `live-api-feed-${(hash >>> 0).toString(16)}-${activeAlerts.length}`;
  sachetCache = {
    etag: newEtag,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    data: activeAlerts,
    sourceUrl: PUBLIC_SACHET_FEED_URL,
    liveSourceCount: sachetLiveAlerts.length + usgsAlerts.length
  };
  return {
    alerts: activeAlerts,
    etag: newEtag,
    isModified: clientEtag !== newEtag,
    lastUpdated: sachetCache.lastUpdated,
    cacheStatus: "LIVE_FETCH",
    sourceUrl: PUBLIC_SACHET_FEED_URL
  };
}

// server/googleNews.ts
var import_fast_xml_parser2 = require("fast-xml-parser");

// server/lib/evidenceUtils.ts
function validateAndCleanCitations(text, validSources) {
  if (!text) return "";
  const validIds = new Set(validSources.map((s) => s.id.toUpperCase().trim()));
  const normalizedText = text.replace(/ã€\s*(S\d+)\s*ã€‘/gi, "[$1]").replace(/【\s*(S\d+)\s*】/gi, "[$1]").replace(/［\s*(S\d+)\s*］/gi, "[$1]");
  return normalizedText.replace(/\[(S\d+)\]/gi, (match, citationId) => {
    const upperId = citationId.toUpperCase().trim();
    if (validIds.has(upperId)) {
      return `[${upperId}]`;
    }
    return "";
  });
}
function deduplicateNewsArticles(articles) {
  const seenUrls = /* @__PURE__ */ new Set();
  const seenTitles = /* @__PURE__ */ new Set();
  const results = [];
  for (const article of articles) {
    if (!article.url || !article.title) continue;
    const normUrl = article.url.toLowerCase().replace(/^https?:\/\//, "").replace(/[\?#].*$/, "").replace(/\/+$/, "");
    const normTitle = article.title.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
    if (seenUrls.has(normUrl) || seenTitles.has(normTitle)) {
      continue;
    }
    seenUrls.add(normUrl);
    seenTitles.add(normTitle);
    results.push(article);
  }
  return results;
}
function evaluateTemporalGate(publishedAtStr, now = /* @__PURE__ */ new Date(), windowHours = 72) {
  if (!publishedAtStr) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: "recency unverified",
      reason: "Missing published timestamp"
    };
  }
  const pubDate = new Date(publishedAtStr);
  const pubTime = pubDate.getTime();
  const nowTime = now.getTime();
  if (isNaN(pubTime)) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: "recency unverified",
      reason: "Unparseable date format"
    };
  }
  if (pubTime > nowTime + 15 * 60 * 1e3) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: "recency unverified",
      reason: "Timestamp is in the future"
    };
  }
  const diffHours = (nowTime - pubTime) / (1e3 * 60 * 60);
  let relativeTime;
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
      relativeTime
    };
  } else {
    return {
      isEligible: false,
      recencyVerified: true,
      relativeTime,
      reason: `Article is older than ${windowHours} hours (${Math.round(diffHours)}h old)`
    };
  }
}
var casualtyContextPattern = /\b(death|deaths|dead|killed|fatalit(?:y|ies)|casualt(?:y|ies)|missing|injured|injur(?:y|ies)|victims?|displaced|evacuat(?:ed|ion)|rescued?|affected)\b/i;
var numericPattern = /\b\d{1,3}(?:,\d{2,3})*(?:\.\d+)?\b/g;
function normalizeNumericClaim(raw) {
  const value = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value);
}
function extractCasualtyNumericClaims(sources) {
  const claims = [];
  for (const source of sources) {
    const text = `${source.title || ""}. ${source.summary || ""}`;
    const matches = Array.from(text.matchAll(numericPattern));
    for (const match of matches) {
      const start = Math.max(0, (match.index || 0) - 120);
      const end = Math.min(text.length, (match.index || 0) + match[0].length + 120);
      const context = text.slice(start, end);
      if (!casualtyContextPattern.test(context)) continue;
      const value = normalizeNumericClaim(match[0]);
      if (value === null) continue;
      const lowerContext = context.toLowerCase();
      const metric = /\b(killed|dead|deaths?|fatalit)/i.test(lowerContext) ? "deaths" : /\binjur/i.test(lowerContext) ? "injured" : /\bmissing\b/i.test(lowerContext) ? "missing" : /\bdisplaced\b/i.test(lowerContext) ? "displaced" : /\bevacuat/i.test(lowerContext) ? "evacuated" : /\brescu/i.test(lowerContext) ? "rescued" : /\baffected\b/i.test(lowerContext) ? "affected" : void 0;
      const qualifier = /\bat least\b/i.test(lowerContext) ? "at least" : /\bmore than\b/i.test(lowerContext) ? "more than" : /\bover\b/i.test(lowerContext) ? "over" : /\baround\b/i.test(lowerContext) ? "around" : /\bnearly\b/i.test(lowerContext) ? "nearly" : "reported";
      claims.push({
        value,
        sourceId: source.id,
        text: context.replace(/\s+/g, " ").trim(),
        metric,
        qualifier
      });
    }
  }
  return claims;
}
function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
function reconcileNumericClaims(values) {
  const claims = values.map((value) => typeof value === "number" ? { value, text: String(value) } : value).filter((claim) => Number.isFinite(claim.value) && claim.value > 0);
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
    outlierClaims
  };
}
var incidentEvidencePattern = /\b(killed|dead|deaths?|fatalit(?:y|ies)|injured|missing|evacuat(?:ed|ion)|rescued?|relief|shelter|ndrf|sdrf|damage(?:d)?|collapsed?|washed away|inundat(?:ed|ion)|landslide|flood(?:ed)?|cyclone|earthquake|quake|seismic|heatwave|heat wave|district|village|rainfall|warning issued)\b/i;
var hardIncidentPattern = /\b(killed|dead|deaths?|fatalit(?:y|ies)|injured|missing|evacuat(?:ed|ion)|rescued?|relief|shelter|ndrf|sdrf|damage(?:d)?|collapsed?|washed away|inundat(?:ed|ion)|district|village|quake|earthquake)\b/i;
var techAnnouncementPattern = /\b(new\s+(?:app|model|ai|system|tech|device|drone|sensor)\s+(?:to\s+|that\s+|for\s+)?(?:predict|counter|detect|prevent|warn)|launch(?:es|ed)?|unveils?|startup|funding|raises?\s+\$|partnership|research paper|study finds)\b/i;
var passingMentionPattern = /\b(astrologer|actor|film|celebrity|arrest(?:ed)?|politic(?:al|ian)|election|court|interview|opinion|column)\b/i;
var impactFactPattern = /\b(killed|dead|deaths?|fatalit(?:y|ies)|injured|missing|evacuat(?:ed|ion)|rescued?|relief|shelter|ndrf|sdrf|damage(?:d)?|collapsed?|washed away|inundat(?:ed|ion)|district|village|houses?|roads?|bridges?|power|economic|loss|crore)\b/i;
function scoreIncidentEvidence(article) {
  const text = `${article.title || ""}. ${article.summary || ""}`;
  const matches = text.match(new RegExp(incidentEvidencePattern.source, "gi"));
  const keywordScore = matches ? Math.min(matches.length, 5) : 0;
  if (keywordScore === 0) return 0;
  let score = keywordScore;
  if (/\b(19|20)\d{2}\b/.test(text)) score += 1;
  if (techAnnouncementPattern.test(text) && !hardIncidentPattern.test(text)) return 0;
  if (passingMentionPattern.test(text) && !impactFactPattern.test(text)) return 0;
  return score;
}
function filterIncidentEvidenceArticles(articles) {
  return articles.filter((article) => scoreIncidentEvidence(article) > 0);
}
var disasterTerms = /* @__PURE__ */ new Set([
  "cyclone",
  "flood",
  "floods",
  "earthquake",
  "landslide",
  "landslides",
  "disaster",
  "storm",
  "rain",
  "heavy",
  "heat",
  "wave",
  "india",
  "indian",
  "alert",
  "warning",
  "casualties",
  "damage",
  "rescue",
  "relief"
]);
function tokenizeSpecificTerms(value) {
  return value.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).map((term) => term.trim()).filter((term) => term.length >= 4 && !disasterTerms.has(term));
}
function eventYear(value) {
  if (!value) return null;
  return value.match(/\b(19\d\d|20\d\d)\b/)?.[0] || null;
}
function filterSourcesForEvent(articles, context) {
  const eventName = context.eventName.trim().toLowerCase();
  const specificTerms = tokenizeSpecificTerms(context.eventName);
  const requiredYear = eventYear(context.approxDate || context.eventName);
  const state = context.state?.trim().toLowerCase();
  const disasterType = context.disasterType?.trim().toLowerCase();
  return articles.filter((article) => {
    const text = `${article.title || ""}. ${article.summary || ""}`.toLowerCase();
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

// server/googleNews.ts
var xmlParser2 = new import_fast_xml_parser2.XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  trimValues: true
});
var newsCache = /* @__PURE__ */ new Map();
var NEWS_CACHE_TTL_MS = 5 * 60 * 1e3;
function cleanNewsText(value) {
  return value.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#39;/g, "'").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}
function buildSearchPhrase(query, isCurrentNews) {
  const cleanQuery = query.replace(/[^\w\s]/gi, " ").replace(/\s+/g, " ").trim();
  if (!cleanQuery) return isCurrentNews ? "India disaster alert" : "India disaster";
  if (isCurrentNews) return `${cleanQuery} India disaster weather alert`;
  const hasIndia = /\bindia|indian|odisha|kerala|gujarat|bengal|uttarakhand|maharashtra|assam|bihar|tamil|karnataka|andhra|telangana|rajasthan|sikkim|kashmir|ladakh|goa|punjab|haryana|delhi\b/i.test(cleanQuery);
  return hasIndia ? cleanQuery : `${cleanQuery} India`;
}
async function searchGoogleNews(query, options = {}) {
  const { isCurrentNews = false, windowHours = 72, maxResults = 12 } = options;
  const cacheKey = JSON.stringify({
    query: query.trim().toLowerCase(),
    isCurrentNews,
    windowHours,
    maxResults
  });
  const cached = newsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.articles.slice(0, maxResults);
  }
  const searchPhrase = buildSearchPhrase(query, isCurrentNews);
  const encodedQuery = encodeURIComponent(searchPhrase);
  const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-IN&gl=IN&ceid=IN:en`;
  const articles = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4e3);
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: controller.signal
    }).catch(() => null);
    clearTimeout(timeoutId);
    if (response && response.ok) {
      const xmlText = await response.text();
      const parsed = xmlParser2.parse(xmlText);
      const items = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
      const itemsArray = Array.isArray(items) ? items : [items];
      const now = /* @__PURE__ */ new Date();
      for (let i = 0; i < itemsArray.length && articles.length < maxResults; i++) {
        const item = itemsArray[i];
        if (!item || !item.title) continue;
        const rawTitle = String(item.title || "");
        const pubDateStr = String(item.pubDate || item.published || item.updated || "");
        let title = rawTitle;
        let publisher = item.source?.["#text"] || item.source || "National News Media";
        if (typeof publisher === "object") {
          publisher = publisher["#text"] || "Media";
        }
        if (rawTitle.includes(" - ")) {
          const parts = rawTitle.split(" - ");
          if (parts.length > 1) {
            publisher = parts[parts.length - 1].trim();
            title = parts.slice(0, -1).join(" - ").trim();
          }
        }
        const rawDesc = String(item.description || item.summary || "");
        const summary = cleanNewsText(rawDesc) || cleanNewsText(title);
        const gateResult = evaluateTemporalGate(pubDateStr, now, windowHours);
        if (isCurrentNews && !gateResult.isEligible) {
          continue;
        }
        const validNewsUrl = item.link && item.link.startsWith("http") ? item.link : `https://news.google.com/search?q=${encodeURIComponent(title)}&hl=en-IN&gl=IN&ceid=IN:en`;
        articles.push({
          id: `gn-${Math.random().toString(36).substring(2, 9)}`,
          title,
          summary: summary.length > 280 ? summary.substring(0, 277) + "..." : summary,
          url: validNewsUrl,
          publisher: String(publisher),
          publishedAt: pubDateStr || (/* @__PURE__ */ new Date()).toISOString(),
          relativeTime: gateResult.relativeTime,
          recencyVerified: gateResult.recencyVerified,
          isWithinTemporalGate: gateResult.isEligible,
          query
        });
      }
    }
  } catch (err) {
    console.log("Google News fetch notice:", err.message);
  }
  const deduped = filterIncidentEvidenceArticles(deduplicateNewsArticles(articles)).slice(0, maxResults);
  newsCache.set(cacheKey, {
    expiresAt: Date.now() + NEWS_CACHE_TTL_MS,
    articles: deduped
  });
  return deduped;
}

// server/aiGateway.ts
var evidenceBundleCache = /* @__PURE__ */ new Map();
var recentArchiveCache = /* @__PURE__ */ new Map();
var eraDiscoveryCache = /* @__PURE__ */ new Map();
var recentArchiveWarmupStarted = false;
var EVIDENCE_BUNDLE_CACHE_TTL_MS = 10 * 60 * 1e3;
var RECENT_ARCHIVE_CACHE_TTL_MS = 20 * 60 * 1e3;
var ERA_DISCOVERY_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
var INDIAN_STATES = [
  "andaman and nicobar islands",
  "andhra pradesh",
  "arunachal pradesh",
  "assam",
  "bihar",
  "chhattisgarh",
  "goa",
  "gujarat",
  "haryana",
  "himachal pradesh",
  "jharkhand",
  "karnataka",
  "kerala",
  "ladakh",
  "madhya pradesh",
  "maharashtra",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "punjab",
  "rajasthan",
  "sikkim",
  "tamil nadu",
  "telangana",
  "tripura",
  "uttarakhand",
  "uttar pradesh",
  "west bengal",
  "delhi",
  "jammu and kashmir",
  "puducherry"
];
var NORMALIZATION_REPLACEMENTS = [
  [/\bgujrat\b/gi, "Gujarat"],
  [/\bgujarath\b/gi, "Gujarat"],
  [/\bgujrath\b/gi, "Gujarat"],
  [/\bearthqake\b/gi, "earthquake"],
  [/\bearthquak\b/gi, "earthquake"],
  [/\berthquake\b/gi, "earthquake"],
  [/\bwaynad\b/gi, "Wayanad"],
  [/\bwayanad landslides\b/gi, "Wayanad landslide"],
  [/\bamfan\b/gi, "Cyclone Amphan"],
  [/\bamphan cyclone\b/gi, "Cyclone Amphan"],
  [/\buttrakahand\b/gi, "Uttarakhand"],
  [/\buttrakhand\b/gi, "Uttarakhand"],
  [/\borrisa\b/gi, "Odisha"],
  [/\borissa\b/gi, "Odisha"],
  [/\bkutch quake\b/gi, "Bhuj earthquake"],
  [/\bbhuj quake\b/gi, "Bhuj earthquake"]
];
var KNOWN_EVENT_ALIASES = [
  {
    match: /\b(2001\s+)?(gujarat|bhuj|kutch).*(earthquake|quake)|\b(republic day earthquake)\b/i,
    event: {
      normalizedQuery: "2001 Gujarat earthquake",
      aliases: ["Bhuj earthquake", "Kutch earthquake", "Republic Day earthquake Gujarat 2001"],
      disasterType: "Earthquake",
      location: "Bhuj and Kutch",
      state: "Gujarat",
      year: 2001,
      eventDate: "2001-01-26T00:00:00.000Z",
      confidence: 0.96
    }
  },
  {
    match: /\b(amphan|amfan)\b/i,
    event: {
      normalizedQuery: "Cyclone Amphan",
      aliases: ["2020 Cyclone Amphan", "Amphan West Bengal cyclone"],
      disasterType: "Cyclone",
      location: "West Bengal and Odisha coast",
      state: "West Bengal",
      year: 2020,
      eventDate: "2020-05-20T00:00:00.000Z",
      confidence: 0.95
    }
  },
  {
    match: /\b(wayanad|waynad).*(landslide|landslides)\b/i,
    event: {
      normalizedQuery: "2024 Wayanad landslide",
      aliases: ["Wayanad landslides", "Chooralmala Mundakkai landslide"],
      disasterType: "Landslide",
      location: "Wayanad",
      state: "Kerala",
      year: 2024,
      eventDate: "2024-07-30T00:00:00.000Z",
      confidence: 0.94
    }
  },
  {
    match: /\b(1999\s+)?(odisha|orissa).*(super cyclone|cyclone)\b/i,
    event: {
      normalizedQuery: "1999 Odisha Super Cyclone",
      aliases: ["1999 Orissa cyclone", "Odisha super cyclone"],
      disasterType: "Cyclone",
      location: "Odisha coast",
      state: "Odisha",
      year: 1999,
      eventDate: "1999-10-29T00:00:00.000Z",
      confidence: 0.94
    }
  },
  {
    match: /\b(2018\s+)?kerala.*flood/i,
    event: {
      normalizedQuery: "2018 Kerala floods",
      aliases: ["Kerala floods 2018"],
      disasterType: "Flood",
      location: "Kerala",
      state: "Kerala",
      year: 2018,
      eventDate: "2018-08-15T00:00:00.000Z",
      confidence: 0.9
    }
  }
];
function getGroqBaseUrl() {
  return process.env.GROQ_BASE_URL?.trim() || "https://api.groq.com/openai/v1";
}
function getGroqChatModels() {
  return (process.env.GROQ_MODEL_FALLBACKS || process.env.GROQ_MODEL || "llama-3.3-70b-versatile").split(",").map((model) => model.trim()).filter(Boolean);
}
function getGroqSttModel() {
  return process.env.GROQ_STT_MODEL?.trim() || "whisper-large-v3-turbo";
}
function getGroqTtsModel() {
  return process.env.GROQ_TTS_MODEL?.trim() || "canopylabs/orpheus-v1-english";
}
function getGroqTtsVoice() {
  return process.env.GROQ_TTS_VOICE?.trim() || "austin";
}
function isGroqConfigured() {
  return Boolean(process.env.GROQ_API_KEY?.trim());
}
function getGroqKey(scope = "default") {
  const scopeEnvMap = {
    past: ["GROQ_API_KEY_PAST", "GROQ_API_KEY_HISTORY", "GROQ_API_KEY"],
    pastFilters: ["GROQ_API_KEY_PAST_FILTERS"],
    chat: ["GROQ_API_KEY_CHAT", "GROQ_API_KEY_ASSISTANT", "GROQ_API_KEY"],
    stt: ["GROQ_API_KEY_STT", "GROQ_API_KEY_AUDIO", "GROQ_API_KEY"],
    tts: ["GROQ_API_KEY_TTS", "GROQ_API_KEY_AUDIO", "GROQ_API_KEY"]
  };
  const envNames = scope === "default" ? ["GROQ_API_KEY"] : scopeEnvMap[scope];
  for (const envName of envNames) {
    const apiKey = process.env[envName]?.trim();
    if (apiKey) return apiKey;
  }
  const label = scope === "default" ? "GROQ_API_KEY" : envNames.join(" or ");
  throw new Error(`${label} is not configured.`);
}
function stripCodeFences(text) {
  return text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
}
function stripMarkdownForSpeech(text) {
  return text.replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*\]\([^)]+\)/g, " ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\[(S\d+)\]/gi, " ").replace(/[*_`>#-]+/g, " ").replace(/\r?\n+/g, " ").replace(/\s+/g, " ").trim();
}
function sanitizeGeneratedReply(text) {
  return text.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
function inferDisasterType(text) {
  const lower = text.toLowerCase();
  if (lower.includes("cyclone") || lower.includes("storm")) return "Cyclone";
  if (lower.includes("flood") || lower.includes("inundat") || lower.includes("waterlogging")) return "Flood";
  if (lower.includes("earthquake") || lower.includes("quake") || lower.includes("seismic") || lower.includes("tremor")) return "Earthquake";
  if (lower.includes("landslide") || lower.includes("mudslide") || lower.includes("rockfall")) return "Landslide";
  if (lower.includes("heat wave") || lower.includes("heatwave") || lower.includes("heat")) return "Heat Wave";
  if (lower.includes("thunderstorm")) return "Thunderstorm";
  if (lower.includes("lightning")) return "Lightning";
  if (lower.includes("heavy rain") || lower.includes("rain")) return "Heavy Rain";
  if (lower.includes("forest fire") || lower.includes("wildfire")) return "Forest Fire";
  if (lower.includes("drought")) return "Drought";
  if (lower.includes("avalanche")) return "Avalanche";
  return "General Alert";
}
function inferState(text) {
  const lower = text.toLowerCase();
  for (const state of INDIAN_STATES) {
    if (lower.includes(state)) {
      return state.replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }
  if (lower.includes("odisha") || lower.includes("puri") || lower.includes("bhubaneswar")) return "Odisha";
  if (lower.includes("kerala") || lower.includes("wayanad") || lower.includes("kochi")) return "Kerala";
  if (lower.includes("assam") || lower.includes("guwahati")) return "Assam";
  if (lower.includes("tamil nadu") || lower.includes("chennai")) return "Tamil Nadu";
  if (lower.includes("maharashtra") || lower.includes("mumbai")) return "Maharashtra";
  if (lower.includes("uttarakhand") || lower.includes("dehradun")) return "Uttarakhand";
  if (lower.includes("himachal") || lower.includes("shimla")) return "Himachal Pradesh";
  if (lower.includes("rajasthan") || lower.includes("jaipur")) return "Rajasthan";
  if (lower.includes("gujarat") || lower.includes("ahmedabad")) return "Gujarat";
  if (lower.includes("west bengal") || lower.includes("kolkata")) return "West Bengal";
  if (lower.includes("delhi") || lower.includes("ncr")) return "Delhi";
  return "India";
}
function inferLocation(text, fallbackState) {
  const lower = text.toLowerCase();
  const separators = [",", " - ", " near ", " in "];
  for (const sep of separators) {
    const idx = lower.indexOf(sep);
    if (idx > 0) {
      const raw = text.slice(0, idx).trim();
      if (raw.length >= 3) return raw;
    }
  }
  if (fallbackState !== "India") return fallbackState;
  return "India";
}
function deriveYearFromBundle(bundle) {
  const eventDate = coerceIsoDate(bundle.eventDate);
  if (eventDate) return new Date(eventDate).getFullYear();
  const dateRangeYear = bundle.dateRange?.match(/\b(19\d\d|20\d\d)\b/)?.[0];
  if (dateRangeYear) return Number(dateRangeYear);
  return new Date(bundle.synthesizedAt).getFullYear();
}
function formatCasualtyRange(range) {
  if (!range.rangeMin && !range.rangeMax) return null;
  const base = range.rangeMin === range.rangeMax ? `${range.rangeMin.toLocaleString("en-IN")} reported casualties/deaths in retrieved source claims.` : `${range.rangeMin.toLocaleString("en-IN")}-${range.rangeMax.toLocaleString("en-IN")} reported casualties/deaths across clustered source claims.`;
  if (!range.outliers.length) return base;
  return `${base} Outlier claim(s) ${range.outliers.map((value) => value.toLocaleString("en-IN")).join(", ")} excluded from the range.`;
}
function extractCandidateFacts(sources) {
  const patterns = {
    casualties: /\b(?:\d[\d,]*\s+(?:people\s+)?(?:dead|deaths?|killed|fatalit(?:y|ies)|injured|missing)|(?:dead|deaths?|killed|injured|missing|casualties)[^.;]{0,80}\d[\d,]*)\b/gi,
    damage: /\b(?:₹|rs\.?|inr|crore|lakh|damage(?:d)?|collapsed?|washed away|destroyed|houses?|roads?|bridges?|power|infrastructure)[^.;]{0,140}/gi,
    response: /\b(?:ndrf|sdrf|evacuat(?:ed|ion)|rescued?|relief|shelter|army|navy|air force|government|administration)[^.;]{0,140}/gi,
    location: /\b(?:district|village|state|coast|city|town|taluk|block|panchayat)[^.;]{0,120}/gi,
    dates: /\b(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+(?:19|20)\d{2}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(?:19|20)\d{2}|\b(?:19|20)\d{2}\b)/gi
  };
  return Object.fromEntries(Object.entries(patterns).map(([key, pattern]) => [
    key,
    sources.flatMap((source) => {
      const text = `${source.title}. ${source.summary}`;
      return Array.from(text.matchAll(pattern)).map((match) => `[${source.id}] ${match[0].replace(/\s+/g, " ").trim()}`).slice(0, 3);
    }).slice(0, 10)
  ]));
}
function sanitizeUnavailableField(value, facts, fallback) {
  if (facts.length && /information unavailable|not available|not clearly quantified|no .*details/i.test(value)) {
    return `${fallback} ${facts.slice(0, 3).join("; ")}.`;
  }
  return value;
}
function buildNumericRangeObject(range) {
  if (!range.rangeMin && !range.rangeMax) return void 0;
  return {
    min: range.rangeMin,
    max: range.rangeMax,
    outliers: range.outliers,
    outlierSources: range.outlierClaims.map((claim) => ({
      value: claim.value,
      sourceIds: claim.sourceId ? [claim.sourceId] : []
    }))
  };
}
function buildNumericConflictReports(range) {
  return range.outlierClaims.map((claim) => ({
    topic: "Casualty figure outlier",
    details: `${claim.value.toLocaleString("en-IN")} was excluded from the reported casualty range as a statistical outlier${claim.sourceId ? ` [${claim.sourceId}]` : ""}.`,
    sources: claim.sourceId ? [claim.sourceId] : []
  }));
}
function normalizeSynthesizedData(raw, fallbackQuery, sources) {
  const fallback = buildDeterministicFallbackSynthesis(fallbackQuery, sources);
  const data = raw && typeof raw === "object" ? raw : {};
  const textField = (key) => typeof data[key] === "string" && hasMeaningfulText(data[key]) ? cleanEvidenceText(data[key]) : fallback[key];
  return {
    ...fallback,
    ...data,
    eventName: typeof data.eventName === "string" && data.eventName.trim() ? data.eventName.trim() : fallback.eventName,
    disasterType: typeof data.disasterType === "string" && data.disasterType.trim() ? data.disasterType.trim() : fallback.disasterType,
    location: typeof data.location === "string" && data.location.trim() ? data.location.trim() : fallback.location,
    state: typeof data.state === "string" && data.state.trim() ? data.state.trim() : fallback.state,
    country: "India",
    dateRange: typeof data.dateRange === "string" && data.dateRange.trim() ? data.dateRange.trim() : fallback.dateRange,
    eventDate: coerceIsoDate(data.eventDate || data.approxDate || data.dateRange),
    reportedCasualties: textField("reportedCasualties"),
    reportedDamage: textField("reportedDamage"),
    whatHappened: textField("whatHappened"),
    affectedAreas: textField("affectedAreas"),
    humanImpact: textField("humanImpact"),
    infrastructureDamage: textField("infrastructureDamage"),
    economicImpact: textField("economicImpact"),
    governmentResponse: textField("governmentResponse"),
    rescueRelief: textField("rescueRelief"),
    recovery: textField("recovery"),
    sourceAssessment: textField("sourceAssessment"),
    conflictingReports: Array.isArray(data.conflictingReports) ? data.conflictingReports : [],
    timeline: Array.isArray(data.timeline) ? data.timeline : []
  };
}
function sortArchiveItems(items) {
  return items.sort((a, b) => {
    const aTime = a.eventDate ? new Date(a.eventDate).getTime() : NaN;
    const bTime = b.eventDate ? new Date(b.eventDate).getTime() : NaN;
    if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) return bTime - aTime;
    if (Number.isFinite(aTime)) return -1;
    if (Number.isFinite(bTime)) return 1;
    return b.year - a.year;
  });
}
function toBase64(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Buffer.from(bytes).toString("base64");
}
async function groqChatCompletion(params) {
  const apiKey = getGroqKey(params.keyScope || "default");
  const baseUrl = getGroqBaseUrl();
  let lastError = null;
  for (const model of [params.model, ...getGroqChatModels()].filter(Boolean)) {
    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: params.messages,
          temperature: params.temperature ?? 0.2,
          ...params.maxTokens ? { max_completion_tokens: params.maxTokens } : {}
        })
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Groq chat completion failed for ${model}: HTTP ${response.status} ${text}`.trim());
      }
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim()) {
        return content.trim();
      }
      throw new Error(`Groq chat completion returned an empty response for ${model}.`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Groq chat completion failed.");
}
function mimeToExt(mime) {
  const base = mime.split(";")[0].trim().toLowerCase();
  const map = {
    "audio/webm": "webm",
    "audio/mp4": "mp4",
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/flac": "flac",
    "audio/m4a": "m4a"
  };
  return map[base] || "webm";
}
async function transcribeAudio(audio, mimeType = "audio/webm") {
  const apiKey = getGroqKey("stt");
  const baseUrl = getGroqBaseUrl();
  const sttModel = getGroqSttModel();
  const audioBuffer = Buffer.isBuffer(audio) ? audio : Buffer.from(audio.replace(/^data:[^;]+;base64,/, ""), "base64");
  const form = new FormData();
  const normalizedMime = mimeType.split(";")[0] || "audio/webm";
  form.append("file", new Blob([audioBuffer], { type: normalizedMime }), `audio.${mimeToExt(mimeType)}`);
  form.append("model", sttModel);
  form.append("response_format", "json");
  form.append("temperature", "0");
  form.append(
    "prompt",
    "Transcribe the spoken English disaster query accurately. Return only the transcription text."
  );
  const response = await fetch(`${baseUrl}/audio/transcriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: form
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Groq transcription failed: HTTP ${response.status} ${text}`.trim());
  }
  const data = await response.json();
  return { text: String(data?.text || "").trim() };
}
async function generateWithFallback(params) {
  try {
    return await groqChatCompletion({
      messages: [
        ...params.systemInstruction ? [{ role: "system", content: params.systemInstruction }] : [],
        { role: "user", content: params.prompt }
      ],
      temperature: params.responseMimeType === "application/json" ? 0.1 : 0.2,
      keyScope: params.keyScope
    });
  } catch (error) {
    console.warn("Groq generation failed:", error.message);
    return null;
  }
}
async function normalizeDisasterSearchQuery(query) {
  const raw = await generateWithFallback({
    keyScope: "past",
    systemInstruction: "Correct Indian disaster event search phrases. Return only the corrected search phrase, with no commentary.",
    prompt: `The user is searching for an Indian disaster event. Correct spelling or typo errors to the most likely real event/location name. If it is already correct, return the original phrase.

Query: ${query}`
  });
  const normalized = raw?.replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim();
  if (!normalized || normalized.toLowerCase() === query.toLowerCase()) return null;
  return normalized;
}
function cleanEvidenceText(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#39;/g, "'").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}
function applyDeterministicNormalization(query) {
  return NORMALIZATION_REPLACEMENTS.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    query.replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim()
  ).replace(/\s+/g, " ").trim();
}
function normalizeHistoricalEventQuery(query) {
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
  const normalizedQuery = corrected.replace(/\bfloods\b/gi, "flood").replace(/\blandslides\b/gi, "landslide").replace(/\s+/g, " ").trim();
  return {
    originalQuery,
    normalizedQuery,
    aliases: normalizedQuery.toLowerCase() === originalQuery.toLowerCase() ? [] : [originalQuery],
    disasterType,
    location: inferLocation(normalizedQuery, state),
    state,
    year: year ? Number(year) : void 0,
    eventDate: coerceIsoDate(normalizedQuery),
    confidence: normalizedQuery === originalQuery ? 0.72 : 0.84
  };
}
function buildHistoricalResearchQueries(event, categoryFilter, stateFilter) {
  const base = event.normalizedQuery || event.originalQuery;
  const location = stateFilter || event.state || event.location || "";
  const type = categoryFilter || event.disasterType || "";
  const year = event.year ? String(event.year) : "";
  const aliases = [base, ...event.aliases].filter(Boolean);
  const dimensions = [
    "",
    "India",
    "what happened history impact",
    "casualties deaths injured missing",
    "affected districts villages towns",
    "houses damaged infrastructure roads bridges power",
    "economic loss damage estimate",
    "rescue relief evacuation government response",
    "timeline aftermath recovery reconstruction",
    "official report"
  ];
  const queries = aliases.flatMap(
    (alias) => dimensions.map((dimension) => [alias, year && !alias.includes(year) ? year : "", location, type, dimension].filter(Boolean).join(" ").replace(/\s+/g, " ").trim())
  );
  return Array.from(new Set(queries)).slice(0, 18);
}
function publisherKey(source) {
  return source.publisher.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() || "unknown";
}
function hasMeaningfulText(value) {
  if (!value) return false;
  const normalized = cleanEvidenceText(value).toLowerCase();
  if (normalized.length < 24) return false;
  const placeholders = [
    "information unavailable",
    "no information available",
    "details were not clearly quantified",
    "details were referenced",
    "were referenced in the retrieved source coverage",
    "were summarized in the retrieved source coverage",
    "requires external archival corroboration",
    "documented in source coverage",
    "documented in cited journalism",
    "state disaster management authority and ndrf mobilization recorded",
    "shelter operations, dry food packets, and medical deployment",
    "long-term rehabilitation and infrastructure reconstruction initiatives"
  ];
  if (placeholders.some((phrase) => normalized.includes(phrase))) return false;
  return /[a-z]/i.test(normalized.replace(/\[S\d+\]/gi, ""));
}
function extractBestFact(sources, topic, fallback = "") {
  const facts = extractCandidateFacts(sources)[topic] || [];
  return facts.length ? facts.slice(0, 3).join("; ") + "." : fallback;
}
function buildEvidenceCoverage(bundle) {
  const sourceText = bundle.sources.map((s) => `${s.title} ${s.summary}`).join(" ");
  const distinctPublisherCount = new Set(bundle.sources.map(publisherKey)).size;
  const eventConfirmed = bundle.sources.some((source) => scoreIncidentEvidence(source) >= 2);
  const casualtyData = hasMeaningfulText(bundle.reportedCasualties) || /killed|dead|death|fatalit|injured|missing/i.test(sourceText);
  const infrastructureDamage = hasMeaningfulText(bundle.infrastructureDamage) || /damage|destroyed|collapsed|washed away|houses?|roads?|bridges?|power|infrastructure/i.test(sourceText);
  const economicImpact = hasMeaningfulText(bundle.economicImpact) || /(?:rs\.?|inr|crore|lakh|economic|loss|crop|agriculture)/i.test(sourceText);
  const governmentResponse = hasMeaningfulText(bundle.governmentResponse) || /\bgovernment|ndrf|sdrf|army|navy|administration|evacuat/i.test(sourceText);
  const rescueRelief = hasMeaningfulText(bundle.rescueRelief) || /\brescue|relief|shelter|food|medicine|camp/i.test(sourceText);
  const recovery = hasMeaningfulText(bundle.recovery) || /\brecovery|reconstruction|rehabilitation|restoration|aftermath/i.test(sourceText);
  const meaningfulTimelineEntries = (bundle.timeline || []).filter(
    (step) => hasMeaningfulText(step.event) && hasMeaningfulText(step.description) && !/published|article|source|headline/i.test(`${step.event} ${step.description}`)
  ).length;
  const impactDimensions = [
    casualtyData,
    infrastructureDamage,
    economicImpact,
    governmentResponse,
    rescueRelief,
    recovery,
    hasMeaningfulText(bundle.affectedAreas)
  ].filter(Boolean).length;
  const sourceRelevanceScore = bundle.sources.length ? bundle.sources.reduce((sum, source) => sum + scoreIncidentEvidence(source), 0) / bundle.sources.length : 0;
  const evidenceDepthScore = impactDimensions + meaningfulTimelineEntries + (hasMeaningfulText(bundle.whatHappened) ? 1 : 0);
  const overallQualityScore = sourceRelevanceScore + evidenceDepthScore + Math.min(distinctPublisherCount, 3);
  const qualifies = eventConfirmed && Boolean(bundle.eventDate || /\b(19\d\d|20\d\d)\b/.test(bundle.dateRange || bundle.eventName)) && bundle.location !== "India" && hasMeaningfulText(bundle.whatHappened) && impactDimensions >= 1 && meaningfulTimelineEntries >= 1 && (bundle.sources.length >= 2 || bundle.sources.length === 1 && sourceRelevanceScore >= 4 && impactDimensions >= 2);
  return {
    eventConfirmed,
    eventNameConfidence: eventConfirmed ? 0.85 : 0.25,
    relevantSourceCount: bundle.sources.length,
    distinctPublisherCount,
    overview: hasMeaningfulText(bundle.whatHappened),
    eventDate: Boolean(bundle.eventDate || /\b(19\d\d|20\d\d)\b/.test(bundle.dateRange || bundle.eventName)),
    location: bundle.location !== "India",
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
    qualifies
  };
}
function evidenceStatusFromCoverage(coverage) {
  if (coverage.qualifies && coverage.relevantSourceCount >= 4 && coverage.distinctPublisherCount >= 3 && coverage.meaningfulTimelineEntries >= 2 && coverage.evidenceDepthScore >= 5) return "High Confidence";
  if (coverage.qualifies && coverage.relevantSourceCount >= 2 && coverage.distinctPublisherCount >= 2) return "Moderate Evidence";
  return "Limited Coverage";
}
function makeEvidenceTimeline(sources, eventDate) {
  const datePattern = /\b(?:\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(?:19|20)\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+(?:19|20)\d{2}|\d{4}-\d{2}-\d{2})\b/gi;
  const steps = [];
  const seen = /* @__PURE__ */ new Set();
  for (const source of sources) {
    const text = cleanEvidenceText(`${source.title}. ${source.summary}`);
    const dates = Array.from(text.matchAll(datePattern)).map((match) => match[0]);
    const selectedDate = dates[0] || (eventDate ? formatDisasterDate(eventDate) : "");
    if (!selectedDate) continue;
    const sentence = text.split(/(?<=[.!?])\s+/).find((part) => part.includes(dates[0] || "")) || text;
    const title = sentence.slice(0, 72).replace(/\s+\S*$/, "").trim() || source.title;
    const key = `${selectedDate}|${title.toLowerCase()}`;
    if (seen.has(key) || /published|article/i.test(sentence)) continue;
    seen.add(key);
    steps.push({
      date: selectedDate,
      event: title,
      description: `${sentence} [${source.id}]`,
      citations: [source.id]
    });
  }
  if (!steps.length && eventDate && sources[0]) {
    steps.push({
      date: formatDisasterDate(eventDate),
      event: "Documented disaster occurrence",
      description: `${cleanEvidenceText(sources[0].summary || sources[0].title)} [${sources[0].id}]`,
      citations: [sources[0].id]
    });
  }
  return steps.slice(0, 6);
}
async function buildHistoricalEvidenceBundle(userQuery, categoryFilter, stateFilter) {
  const baseQuery = userQuery.trim();
  let normalizedEvent = normalizeHistoricalEventQuery(baseQuery);
  const cacheKey = JSON.stringify({
    baseQuery: baseQuery.toLowerCase(),
    normalizedQuery: normalizedEvent.normalizedQuery.toLowerCase(),
    categoryFilter: categoryFilter || "",
    stateFilter: stateFilter || ""
  });
  const cached = evidenceBundleCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.bundle;
  }
  let searchQueries = buildHistoricalResearchQueries(normalizedEvent, categoryFilter, stateFilter);
  const allArticles = [];
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
      searchQueries = Array.from(/* @__PURE__ */ new Set([...searchQueries, ...expandedQueries]));
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
    approxDate: normalizedEvent.eventDate || String(normalizedEvent.year || eventFilterQuery)
  }).sort((a, b) => scoreIncidentEvidence(b) - scoreIncidentEvidence(a)).slice(0, 10);
  if (!sourcesList.length) {
    const normalizedQuery = await normalizeDisasterSearchQuery(baseQuery);
    if (normalizedQuery) {
      normalizedEvent = normalizeHistoricalEventQuery(normalizedQuery);
      eventFilterQuery = normalizedEvent.normalizedQuery;
      const correctedArticles = [];
      const correctedQueries = buildHistoricalResearchQueries(normalizedEvent, categoryFilter, stateFilter);
      for (const q of correctedQueries) {
        const res = await searchGoogleNews(q, { isCurrentNews: false, maxResults: 6 });
        correctedArticles.push(...res);
      }
      searchQueries = Array.from(/* @__PURE__ */ new Set([...searchQueries, ...correctedQueries]));
      sourcesList = filterSourcesForEvent(filterIncidentEvidenceArticles(correctedArticles), {
        eventName: normalizedEvent.normalizedQuery,
        disasterType: categoryFilter || normalizedEvent.disasterType || inferDisasterType(normalizedQuery),
        state: stateFilter || normalizedEvent.state || inferState(normalizedQuery),
        approxDate: normalizedEvent.eventDate || String(normalizedEvent.year || normalizedQuery)
      }).slice(0, 10);
    }
  }
  if (!sourcesList.length) {
    throw new Error("No live Google News sources were found for this query.");
  }
  const citedSources = sourcesList.map((art, idx) => ({
    id: `S${idx + 1}`,
    title: cleanEvidenceText(art.title),
    publisher: art.publisher,
    publishedAt: art.publishedAt,
    url: art.url,
    summary: cleanEvidenceText(art.summary),
    qualityScore: Math.max(20, 95 - idx * 4)
  }));
  const sourcesText = citedSources.map((s) => `[${s.id}] Title: ${s.title}
Publisher: ${s.publisher} (${s.publishedAt})
Summary: ${s.summary}
URL: ${s.url}`).join("\n\n");
  const casualtyReconciliation = reconcileNumericClaims(extractCasualtyNumericClaims(citedSources));
  const casualtyRangeText = formatCasualtyRange(casualtyReconciliation);
  const candidateFacts = extractCandidateFacts(citedSources);
  const factsText = Object.entries(candidateFacts).map(([topic, facts]) => `${topic}: ${facts.length ? facts.join(" | ") : "none extracted"}`).join("\n");
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
Category Filter: ${categoryFilter || "None"}
State Filter: ${stateFilter || "None"}
Retrieved Sources:
${sourcesText}
Per-source candidate facts extracted before synthesis:
${factsText}
Pre-computed casualty reconciliation:
${casualtyRangeText || "No casualty/death numeric claims were confidently extracted from the source text."}

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
  let synthesizedData = null;
  try {
    const rawJson = await generateWithFallback({
      prompt,
      systemInstruction: `${systemInstruction}
${depthInstruction}`,
      responseMimeType: "application/json",
      keyScope: categoryFilter || stateFilter ? "pastFilters" : "past"
    });
    if (rawJson) {
      synthesizedData = normalizeSynthesizedData(JSON.parse(stripCodeFences(rawJson)), baseQuery, citedSources);
    }
  } catch (err) {
    console.warn("Groq synthesis parse failure:", err.message);
  }
  if (!synthesizedData) {
    synthesizedData = normalizeSynthesizedData(buildDeterministicFallbackSynthesis(baseQuery, citedSources), baseQuery, citedSources);
  }
  const whatHappened = validateAndCleanCitations(synthesizedData.whatHappened || "", citedSources);
  const affectedAreas = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.affectedAreas || "", candidateFacts.location, "Affected locations extracted from sources:"), citedSources);
  const humanImpact = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.humanImpact || "", candidateFacts.casualties, "Human-impact facts extracted from sources:"), citedSources);
  const infrastructureDamage = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.infrastructureDamage || "", candidateFacts.damage, "Damage facts extracted from sources:"), citedSources);
  const economicImpact = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.economicImpact || "", candidateFacts.damage, "Economic or damage facts extracted from sources:"), citedSources);
  const governmentResponse = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.governmentResponse || "", candidateFacts.response, "Response facts extracted from sources:"), citedSources);
  const rescueRelief = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.rescueRelief || "", candidateFacts.response, "Rescue and relief facts extracted from sources:"), citedSources);
  const recovery = validateAndCleanCitations(synthesizedData.recovery || "", citedSources);
  const reportedCasualties = validateAndCleanCitations(
    casualtyRangeText || synthesizedData.reportedCasualties || "",
    citedSources
  );
  const reportedDamage = validateAndCleanCitations(synthesizedData.reportedDamage || "", citedSources);
  const cleanTimeline = (synthesizedData.timeline || []).map((t) => ({
    date: t.date || "Recorded Period",
    event: t.event || "Incident Milestone",
    description: validateAndCleanCitations(t.description || "", citedSources),
    citations: (t.citations || []).filter((c) => citedSources.some((s) => s.id === c))
  }));
  const cleanConflicts = [
    ...buildNumericConflictReports(casualtyReconciliation),
    ...(synthesizedData.conflictingReports || []).map((c) => ({
      topic: c.topic || "Reported Figures",
      details: validateAndCleanCitations(c.details || "", citedSources),
      sources: (c.sources || []).filter((sId) => citedSources.some((s) => s.id === sId))
    }))
  ];
  const eventDate = normalizedEvent.eventDate || coerceIsoDate(synthesizedData.eventDate || synthesizedData.dateRange) || coerceIsoDate([eventFilterQuery, ...candidateFacts.dates].join(" "));
  const evidenceTimeline = makeEvidenceTimeline(citedSources, eventDate);
  const draftBundle = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    eventName: synthesizedData.eventName || normalizedEvent.normalizedQuery || baseQuery,
    disasterType: synthesizedData.disasterType || normalizedEvent.disasterType || inferDisasterType(eventFilterQuery),
    location: synthesizedData.location || normalizedEvent.location || "India",
    state: synthesizedData.state || normalizedEvent.state || "India",
    country: "India",
    eventDate,
    dateRange: eventDate ? formatDisasterDate(eventDate) : synthesizedData.dateRange || "Documented Occurrence",
    numericCasualtiesRange: buildNumericRangeObject(casualtyReconciliation),
    reportedCasualties: reportedCasualties || "",
    reportedDamage: reportedDamage || extractBestFact(citedSources, "damage"),
    sources: citedSources,
    timeline: cleanTimeline.length > 0 ? cleanTimeline : evidenceTimeline,
    whatHappened: whatHappened || `${citedSources[0].summary} [${citedSources[0].id}]`,
    affectedAreas: affectedAreas || extractBestFact(citedSources, "location"),
    humanImpact: humanImpact || (casualtyRangeText ? `${casualtyRangeText} [${citedSources[0].id}]` : extractBestFact(citedSources, "casualties")),
    infrastructureDamage: infrastructureDamage || extractBestFact(citedSources, "damage"),
    economicImpact: economicImpact || "",
    governmentResponse: governmentResponse || "",
    rescueRelief: rescueRelief || "",
    recovery: recovery || "",
    sourceAssessment: synthesizedData.sourceAssessment || `Retrieved ${citedSources.length} relevant source${citedSources.length === 1 ? "" : "s"} from ${new Set(citedSources.map(publisherKey)).size} publisher${new Set(citedSources.map(publisherKey)).size === 1 ? "" : "s"}.`,
    conflictingReports: cleanConflicts,
    synthesizedAt: (/* @__PURE__ */ new Date()).toISOString(),
    evidenceStatus: "Limited Coverage",
    retrievalMetadata: {
      queriesExecuted: searchQueries,
      rawSourcesCount: allArticles.length,
      dedupedSourcesCount: citedSources.length
    }
  };
  const coverage = buildEvidenceCoverage(draftBundle);
  if (!coverage.qualifies) {
    throw new Error("Insufficient relevant historical evidence was retrieved to build a reliable dossier for this event.");
  }
  const bundle = {
    ...draftBundle,
    evidenceStatus: evidenceStatusFromCoverage(coverage),
    sourceAssessment: draftBundle.sourceAssessment ? `${draftBundle.sourceAssessment} Coverage: ${coverage.relevantSourceCount} relevant source(s), ${coverage.distinctPublisherCount} distinct publisher(s), ${coverage.meaningfulTimelineEntries} incident timeline milestone(s).` : ""
  };
  evidenceBundleCache.set(cacheKey, {
    expiresAt: Date.now() + EVIDENCE_BUNDLE_CACHE_TTL_MS,
    bundle
  });
  return bundle;
}
var RECENT_ARCHIVE_SEARCHES = [
  "Kerala flood 2024 India",
  "Assam flood 2024 India",
  "Himachal Pradesh landslide 2024 India",
  "Wayanad landslide 2024 India",
  "Sikkim earthquake 2023 India",
  "Odisha cyclone 2024 India",
  "Maharashtra flood 2024 India",
  "Delhi heat wave 2024 India",
  "Rajasthan flood 2024 India",
  "Tamil Nadu cyclone 2024 India",
  "Karnataka rain flood 2024 India",
  "Bihar flood 2024 India",
  "West Bengal flood 2024 India",
  "Uttarakhand landslide 2024 India",
  "Punjab flood 2024 India",
  "Gujarat heat wave 2024 India",
  "Andhra Pradesh cyclone 2024 India",
  "Telangana flood 2024 India",
  "Goa heavy rain 2024 India",
  "Arunachal Pradesh landslide 2024 India",
  "Meghalaya flood 2024 India",
  "Mizoram landslide 2024 India",
  "Nagaland heavy rain 2024 India",
  "Chhattisgarh forest fire 2024 India",
  "Ladakh avalanche 2024 India",
  "Jammu Kashmir snow avalanche 2024 India",
  "Madhya Pradesh flood 2024 India",
  "Uttar Pradesh flood 2024 India",
  "West Bengal cyclone 2024 India",
  "Bengaluru urban flood 2024 India",
  "Tripura flood 2024 India",
  "Jammu Kashmir flood 2024 India",
  "Sikkim landslide 2024 India",
  "Odisha heat wave 2024 India",
  "Haryana heat wave 2024 India"
];
function buildArchiveQueryPool(options) {
  const limit = Math.max(options?.limit || 30, 1);
  const category = options?.categoryFilter?.trim() || "";
  const state = options?.stateFilter?.trim() || "";
  const decade = options?.decadeFilter?.trim() || "";
  const decadeYearHints = {
    "1990s": ["1993", "1998", "1999"],
    "2000s": ["2001", "2004", "2008", "2009"],
    "2010s": ["2013", "2014", "2015", "2018", "2019"],
    "2020s": ["2020", "2021", "2022", "2023", "2024", "2025", "2026"]
  };
  const searchRoots = [
    category && state ? `${state} ${category}` : "",
    state ? `${state} disaster` : "",
    category ? `India ${category}` : "",
    state && decade ? `${state} ${decade}` : ""
  ].filter(Boolean);
  const hints = decadeYearHints[decade] || ["2024", "2025", "2026"];
  const decorateQuery = (query) => {
    const parts = [query, category, state, decade ? hints.slice(0, 3).join(" ") : ""].filter(Boolean).join(" ");
    return `${parts} India`.replace(/\s+/g, " ").trim();
  };
  const targeted = searchRoots.flatMap((root) => {
    const variants = [root, `${root} flood`, `${root} disaster`, ...hints.map((year) => `${root} ${year}`)];
    return variants.map(decorateQuery);
  });
  const combined = [
    ...targeted,
    ...RECENT_ARCHIVE_SEARCHES.map(decorateQuery)
  ];
  const deduped = [];
  const seen = /* @__PURE__ */ new Set();
  for (const query of combined) {
    const key = query.toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(query);
    if (deduped.length >= Math.min(Math.max(limit * 3, 100), 240)) break;
  }
  return deduped;
}
function bundleToArchiveItem(bundle, index) {
  const year = deriveYearFromBundle(bundle);
  return {
    ...bundle,
    year,
    numericCasualties: bundle.numericCasualtiesRange?.max || Number(bundle.reportedCasualties?.match(/(\d[\d,]*)/)?.[1]?.replace(/,/g, "") || 0),
    decade: year < 2e3 ? "1990s" : year < 2010 ? "2000s" : year < 2020 ? "2010s" : "2020s",
    id: bundle.id || `archive-${index}`
  };
}
async function buildArchiveEvidenceBundle(query, index, seed) {
  try {
    const bundle = await buildHistoricalEvidenceBundle(
      seed ? `${seed.eventName} ${seed.approxDate}` : query,
      seed?.disasterType,
      seed?.state
    );
    return bundleToArchiveItem(bundle, index);
  } catch (error) {
    const message = error.message;
    if (/no live google news sources|insufficient relevant historical evidence/i.test(message)) {
      return null;
    }
    console.warn("Archive evidence research failed:", message);
    return null;
  }
}
async function discoverEraDisasters(params) {
  const cacheKey = JSON.stringify({
    decade: params.decade || "2020s",
    state: params.state || "",
    category: params.category || "",
    limit: params.limit
  }).toLowerCase();
  const cached = eraDiscoveryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.events;
  const fallbackSeeds = [
    { eventName: "1999 Odisha Super Cyclone", approxDate: "1999-10-29", location: "Odisha coast", state: "Odisha", disasterType: "Cyclone" },
    { eventName: "1993 Latur earthquake", approxDate: "1993-09-30", location: "Latur and Osmanabad", state: "Maharashtra", disasterType: "Earthquake" },
    { eventName: "1998 Malpa landslide", approxDate: "1998-08-18", location: "Malpa, Pithoragarh", state: "Uttarakhand", disasterType: "Landslide" },
    { eventName: "2001 Gujarat earthquake", approxDate: "2001-01-26", location: "Bhuj and Kutch", state: "Gujarat", disasterType: "Earthquake" },
    { eventName: "2004 Indian Ocean tsunami Tamil Nadu", approxDate: "2004-12-26", location: "Tamil Nadu coast", state: "Tamil Nadu", disasterType: "Tsunami" },
    { eventName: "2008 Bihar Kosi flood", approxDate: "2008-08-18", location: "Kosi basin", state: "Bihar", disasterType: "Flood" },
    { eventName: "2013 Uttarakhand floods", approxDate: "2013-06-16", location: "Kedarnath and Garhwal", state: "Uttarakhand", disasterType: "Flood" },
    { eventName: "2014 Kashmir floods", approxDate: "2014-09-05", location: "Jammu and Kashmir", state: "Jammu and Kashmir", disasterType: "Flood" },
    { eventName: "2018 Kerala floods", approxDate: "2018-08-15", location: "Kerala", state: "Kerala", disasterType: "Flood" },
    { eventName: "2020 Cyclone Amphan", approxDate: "2020-05-20", location: "West Bengal and Odisha coast", state: "West Bengal", disasterType: "Cyclone" },
    { eventName: "2021 Chamoli disaster", approxDate: "2021-02-07", location: "Chamoli", state: "Uttarakhand", disasterType: "Flood" },
    { eventName: "2024 Wayanad landslides", approxDate: "2024-07-30", location: "Wayanad", state: "Kerala", disasterType: "Landslide" }
  ];
  const raw = await generateWithFallback({
    keyScope: "pastFilters",
    responseMimeType: "application/json",
    systemInstruction: "You list only real, verifiable, well-known Indian disaster events. Return strict JSON only. Do not invent events.",
    prompt: `List up to ${Math.min(Math.max(params.limit, 1), 20)} real, notable Indian disaster events matching:
decade: ${params.decade || "any, prefer 2020s"}
state: ${params.state || "any"}
category: ${params.category || "any"}
Return {"events":[{"eventName":"","approxDate":"YYYY-MM-DD or YYYY-MM","location":"","state":"","disasterType":"Cyclone | Flood | Earthquake | Landslide | Heavy Rain | Heat Wave | Tsunami | Avalanche | Forest Fire | Drought | General Alert"}]}.
Prefer high-confidence events with known names and dates.`
  });
  let discovered = [];
  if (raw) {
    try {
      const parsed = JSON.parse(stripCodeFences(raw));
      discovered = Array.isArray(parsed?.events) ? parsed.events.map((event) => ({
        eventName: String(event.eventName || "").trim(),
        approxDate: String(event.approxDate || "").trim(),
        eventDate: coerceIsoDate(event.approxDate),
        location: String(event.location || "").trim(),
        state: String(event.state || "").trim() || void 0,
        disasterType: event.disasterType || "General Alert"
      })).filter((event) => event.eventName && event.location && event.eventDate) : [];
    } catch (error) {
      console.warn("Era discovery parse failed:", error.message);
    }
  }
  const decade = params.decade && params.decade !== "all" ? params.decade : void 0;
  const state = params.state && params.state !== "All States" ? params.state.toLowerCase() : void 0;
  const category = params.category && params.category !== "all" ? params.category.toLowerCase() : void 0;
  const deterministic = fallbackSeeds.filter((event) => {
    const year = new Date(coerceIsoDate(event.approxDate) || event.approxDate).getFullYear();
    if (decade) {
      const eventDecade = year < 2e3 ? "1990s" : year < 2010 ? "2000s" : year < 2020 ? "2010s" : "2020s";
      if (eventDecade !== decade) return false;
    }
    if (state && !(event.state || "").toLowerCase().includes(state) && !event.location.toLowerCase().includes(state)) return false;
    if (category && !event.disasterType.toLowerCase().includes(category)) return false;
    return true;
  });
  const merged = [...discovered, ...deterministic].filter((event, idx, all) => all.findIndex((candidate) => candidate.eventName.toLowerCase() === event.eventName.toLowerCase()) === idx).slice(0, params.limit);
  eraDiscoveryCache.set(cacheKey, {
    expiresAt: Date.now() + ERA_DISCOVERY_CACHE_TTL_MS,
    events: merged
  });
  return merged;
}
async function buildRecentIndiaArchive(limit = 100, options) {
  const cacheKey = JSON.stringify({
    limit,
    categoryFilter: options?.categoryFilter || "",
    stateFilter: options?.stateFilter || "",
    decadeFilter: options?.decadeFilter || ""
  });
  const cached = recentArchiveCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.items;
  }
  if (options?.decadeFilter && options.decadeFilter !== "all") {
    const seeds = await discoverEraDisasters({
      decade: options.decadeFilter,
      state: options.stateFilter,
      category: options.categoryFilter,
      limit
    });
    const results = await Promise.allSettled(
      seeds.map((seed, index) => buildArchiveEvidenceBundle(`${seed.eventName} ${seed.approxDate}`, index, seed))
    );
    const sorted2 = sortArchiveItems(results.filter((result) => result.status === "fulfilled").map((result) => result.value).filter((item) => Boolean(item))).slice(0, limit);
    recentArchiveCache.set(cacheKey, { expiresAt: Date.now() + RECENT_ARCHIVE_CACHE_TTL_MS, items: sorted2 });
    return sorted2;
  }
  const queries = buildArchiveQueryPool({ ...options, limit });
  const archive = [];
  const seen = /* @__PURE__ */ new Set();
  const concurrency = 4;
  const matchesFilters = (item) => {
    if (options?.categoryFilter && options.categoryFilter !== "all") {
      const category = options.categoryFilter.toLowerCase();
      const matchesCategory = item.disasterType.toLowerCase().includes(category) || category === "landslide" && item.disasterType.toLowerCase().includes("avalanche");
      if (!matchesCategory) return false;
    }
    if (options?.stateFilter && options.stateFilter !== "All States") {
      const state = options.stateFilter.toLowerCase();
      if (!item.state.toLowerCase().includes(state) && !item.location.toLowerCase().includes(state)) return false;
    }
    if (options?.decadeFilter && options.decadeFilter !== "all" && item.decade !== options.decadeFilter) {
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
      if (result.status !== "fulfilled" || !result.value) continue;
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
    items: sorted
  });
  return sorted;
}
async function buildFilterSearchPlan(options, limit) {
  const filterSummary = [
    options.categoryFilter && options.categoryFilter !== "all" ? `hazard: ${options.categoryFilter}` : "",
    options.stateFilter && options.stateFilter !== "All States" ? `state: ${options.stateFilter}` : "",
    options.decadeFilter && options.decadeFilter !== "all" ? `era: ${options.decadeFilter}` : ""
  ].filter(Boolean).join("; ") || "all Indian disasters";
  const planned = await generateWithFallback({
    keyScope: "pastFilters",
    responseMimeType: "application/json",
    systemInstruction: "You plan evidence searches for Indian disaster research. Return only JSON. Every query must target India and the requested filter. Do not invent events or facts.",
    prompt: `Create up to ${Math.min(Math.max(limit, 10), 40)} concise Google News search queries for this filter: ${filterSummary}.
Return exactly {"queries":["..."]}. Use specific Indian states, hazards, districts, or documented event names when helpful. For an era, include the era years in the queries.`
  });
  let plannedQueries = [];
  if (planned) {
    try {
      const parsed = JSON.parse(stripCodeFences(planned));
      plannedQueries = Array.isArray(parsed?.queries) ? parsed.queries.filter((query) => typeof query === "string") : [];
    } catch (error) {
      console.warn("Filter search plan parse failed:", error.message);
    }
  }
  const generated = plannedQueries.map((query) => query.replace(/\s+/g, " ").trim()).filter((query) => query.length >= 8 && /india/i.test(query)).slice(0, 40);
  const deterministicQueries = buildArchiveQueryPool({ ...options, limit });
  return Array.from(/* @__PURE__ */ new Set([...generated, ...deterministicQueries]));
}
async function buildFilteredIndiaArchive(limit = 100, options = {}) {
  const safeLimit = Math.min(Math.max(Math.floor(limit) || 100, 1), 100);
  const cacheKey = `filter:${JSON.stringify({
    limit: safeLimit,
    categoryFilter: options.categoryFilter || "",
    stateFilter: options.stateFilter || "",
    decadeFilter: options.decadeFilter || ""
  })}`;
  const cached = recentArchiveCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.items;
  }
  const seeds = options.decadeFilter && options.decadeFilter !== "all" ? await discoverEraDisasters({
    decade: options.decadeFilter,
    state: options.stateFilter,
    category: options.categoryFilter,
    limit: safeLimit
  }) : [];
  const queries = seeds.length ? seeds.map((seed) => `${seed.eventName} ${seed.approxDate}`) : await buildFilterSearchPlan(options, safeLimit);
  const archive = [];
  const seen = /* @__PURE__ */ new Set();
  const concurrency = 4;
  const matchesFilters = (item) => {
    if (options.categoryFilter && options.categoryFilter !== "all") {
      const category = options.categoryFilter.toLowerCase();
      const matchesCategory = item.disasterType.toLowerCase().includes(category) || category === "landslide" && item.disasterType.toLowerCase().includes("avalanche");
      if (!matchesCategory) return false;
    }
    if (options.stateFilter && options.stateFilter !== "All States") {
      const state = options.stateFilter.toLowerCase();
      const itemState = item.state.toLowerCase();
      const stateMatches = itemState === state || itemState.includes(state) || itemState === "india" && item.location.toLowerCase().includes(state);
      if (!stateMatches) return false;
    }
    if (options.decadeFilter && options.decadeFilter !== "all" && item.decade !== options.decadeFilter) {
      return false;
    }
    return true;
  };
  for (let i = 0; i < queries.length && archive.length < safeLimit; i += concurrency) {
    const batch = queries.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((query, offset) => buildArchiveEvidenceBundle(query, i + offset, seeds[i + offset]))
    );
    for (const result of batchResults) {
      if (result.status !== "fulfilled" || !result.value || !matchesFilters(result.value)) continue;
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
    items: sorted
  });
  return sorted;
}
function warmRecentIndiaArchive(limit = 100) {
  if (recentArchiveWarmupStarted) {
    return;
  }
  recentArchiveWarmupStarted = true;
  void buildRecentIndiaArchive(limit).catch((error) => {
    recentArchiveWarmupStarted = false;
    console.warn("Archive warmup failed:", error.message);
  });
}
function buildDeterministicFallbackSynthesis(query, sources) {
  const qLower = query.toLowerCase();
  let type = "General Alert";
  if (qLower.includes("cyclon") || qLower.includes("fani") || qLower.includes("amphan")) type = "Cyclone";
  else if (qLower.includes("flood") || qLower.includes("kerala")) type = "Flood";
  else if (qLower.includes("earthquake") || qLower.includes("quake")) type = "Earthquake";
  else if (qLower.includes("landslide")) type = "Landslide";
  const facts = extractCandidateFacts(sources);
  const sourceSummary = sources.length ? sources.slice(0, 3).map((s) => `${cleanEvidenceText(s.summary || s.title)} [${s.id}]`).join(" ") : "";
  return {
    eventName: query,
    disasterType: type,
    location: inferLocation(query, inferState(query)),
    state: inferState(query),
    country: "India",
    dateRange: coerceIsoDate(query) ? formatDisasterDate(coerceIsoDate(query)) : "Documented Occurrence",
    eventDate: coerceIsoDate(query),
    reportedCasualties: "",
    reportedDamage: facts.damage?.slice(0, 3).join("; ") || "",
    whatHappened: sourceSummary,
    affectedAreas: facts.location?.slice(0, 3).join("; ") || "",
    humanImpact: facts.casualties?.slice(0, 3).join("; ") || "",
    infrastructureDamage: facts.damage?.slice(0, 3).join("; ") || "",
    economicImpact: "",
    governmentResponse: facts.response?.slice(0, 3).join("; ") || "",
    rescueRelief: facts.response?.slice(0, 3).join("; ") || "",
    recovery: "",
    sourceAssessment: sources.length ? `Retrieved ${sources.length} source(s); automated synthesis was unavailable, so only extracted source fragments are shown.` : "",
    conflictingReports: [],
    timeline: makeEvidenceTimeline(sources, coerceIsoDate(query))
  };
}
async function compareDisasterEvents(bundles) {
  const comparisonPoints = [
    {
      category: "Overview",
      label: "Disaster Type & Location",
      values: bundles.map((b) => ({
        eventId: b.id,
        value: `${b.disasterType} in ${b.location}, ${b.state} (${b.dateRange})`,
        citations: b.sources.slice(0, 1).map((s) => s.id)
      }))
    },
    {
      category: "Human Impact",
      label: "Casualties & Evacuation",
      values: bundles.map((b) => ({
        eventId: b.id,
        value: b.reportedCasualties || b.humanImpact.slice(0, 150),
        citations: b.sources.slice(0, 2).map((s) => s.id)
      }))
    },
    {
      category: "Damage",
      label: "Infrastructure & Economic Loss",
      values: bundles.map((b) => ({
        eventId: b.id,
        value: b.reportedDamage || b.infrastructureDamage.slice(0, 150),
        citations: b.sources.slice(0, 2).map((s) => s.id)
      }))
    },
    {
      category: "Response",
      label: "Government & Relief Response",
      values: bundles.map((b) => ({
        eventId: b.id,
        value: b.governmentResponse.slice(0, 150) || "State Disaster Management response",
        citations: b.sources.slice(0, 1).map((s) => s.id)
      }))
    }
  ];
  const prompt = `Compare the following ${bundles.length} historical disaster events based solely on their evidence:
${bundles.map(
    (b, i) => `Event ${i + 1}: ${b.eventName} (${b.disasterType}, ${b.location})
Impact: ${b.humanImpact}
Damage: ${b.infrastructureDamage}
Response: ${b.governmentResponse}
Sources: ${b.sources.map((s) => `[${s.id}] ${s.title}`).join(", ")}`
  ).join("\n\n")}

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
    broaderImpact: `Comparative impact analysis between ${bundles.map((b) => b.eventName).join(" and ")}.`,
    responseDifferences: `Early warning dissemination and evacuation preparedness differed based on lead time and terrain.`,
    crossEventLessons: `Key lessons include robust shelter networks, redundant communications, and staged evacuation planning.`,
    citations: bundles.flatMap((b) => b.sources.slice(0, 1).map((s) => s.id))
  };
  try {
    const raw = await generateWithFallback({
      prompt,
      responseMimeType: "application/json",
      systemInstruction: "You are an objective disaster risk comparison analyst. Reference sources like [S1], [S2].",
      keyScope: "past"
    });
    if (raw) {
      const parsed = JSON.parse(stripCodeFences(raw));
      const allSources = bundles.flatMap((b) => b.sources);
      aiSynthesis = {
        broaderImpact: validateAndCleanCitations(parsed.broaderImpact || aiSynthesis.broaderImpact, allSources),
        responseDifferences: validateAndCleanCitations(parsed.responseDifferences || aiSynthesis.responseDifferences, allSources),
        crossEventLessons: validateAndCleanCitations(parsed.crossEventLessons || aiSynthesis.crossEventLessons, allSources),
        citations: allSources.slice(0, 4).map((s) => s.id)
      };
    }
  } catch (error) {
    console.log("Groq comparison synthesis fallback:", error.message);
  }
  return { comparisonPoints, aiSynthesis };
}
async function chatResearchAssistant(params) {
  const { message, history, associatedBundle } = params;
  const englishMessage = message;
  let evidenceSources = [];
  let contextText = "";
  if (associatedBundle) {
    evidenceSources = associatedBundle.sources;
    const associatedEvent = normalizeHistoricalEventQuery(`${associatedBundle.eventName} ${associatedBundle.eventDate || associatedBundle.dateRange}`);
    const targetedQueries = buildHistoricalResearchQueries(associatedEvent, associatedBundle.disasterType, associatedBundle.state).filter((query) => {
      const q = query.toLowerCase();
      const msg = englishMessage.toLowerCase();
      if (/death|died|killed|casualt|injur|missing/.test(msg)) return /casualt|death|injur|missing/.test(q);
      if (/house|damage|loss|road|bridge|power|infrastructure|crop|economic/.test(msg)) return /damage|economic|houses|infrastructure/.test(q);
      if (/rescue|relief|evacuat|government|response|ndrf|sdrf/.test(msg)) return /rescue|relief|evacuat|government/.test(q);
      if (/timeline|when|chronolog|after|before/.test(msg)) return /timeline|aftermath|history/.test(q);
      return false;
    }).slice(0, 4);
    if (targetedQueries.length) {
      const extraArticles = [];
      for (const q of targetedQueries) {
        extraArticles.push(...await searchGoogleNews(q, { isCurrentNews: false, maxResults: 4 }));
      }
      const extraSources = filterSourcesForEvent(filterIncidentEvidenceArticles(deduplicateNewsArticles(extraArticles)), {
        eventName: associatedEvent.normalizedQuery,
        disasterType: associatedBundle.disasterType,
        state: associatedBundle.state,
        approxDate: associatedBundle.eventDate || associatedBundle.dateRange
      }).slice(0, 4).map((art, idx) => ({
        id: `S${evidenceSources.length + idx + 1}`,
        title: cleanEvidenceText(art.title),
        publisher: art.publisher,
        publishedAt: art.publishedAt,
        url: art.url,
        summary: cleanEvidenceText(art.summary)
      }));
      evidenceSources = deduplicateNewsArticles([...evidenceSources, ...extraSources]).map((source, idx) => ({
        ...source,
        id: `S${idx + 1}`
      }));
    }
    contextText = `Associated Event: ${associatedBundle.eventName} (${associatedBundle.disasterType}, ${associatedBundle.location})
Summary: ${associatedBundle.whatHappened}
Impact: ${associatedBundle.humanImpact}
Damage: ${associatedBundle.infrastructureDamage}
Sources:
` + evidenceSources.map((s) => `[${s.id}] ${s.title} (${s.publisher}): ${s.summary}`).join("\n");
  } else {
    const normalizedEvent = normalizeHistoricalEventQuery(englishMessage);
    const chatQueries = buildHistoricalResearchQueries(normalizedEvent).slice(0, 8);
    let articles = [];
    for (const q of chatQueries) {
      articles.push(...await searchGoogleNews(q, { isCurrentNews: false, maxResults: 4 }));
    }
    articles = filterSourcesForEvent(filterIncidentEvidenceArticles(deduplicateNewsArticles(articles)), {
      eventName: normalizedEvent.normalizedQuery,
      disasterType: normalizedEvent.disasterType,
      state: normalizedEvent.state,
      approxDate: normalizedEvent.eventDate || String(normalizedEvent.year || "")
    }).slice(0, 8);
    if (articles.length < 2) {
      const normalizedQuery = await normalizeDisasterSearchQuery(englishMessage);
      if (normalizedQuery) {
        const fallbackEvent = normalizeHistoricalEventQuery(normalizedQuery);
        const fallbackArticles = [];
        for (const q of buildHistoricalResearchQueries(fallbackEvent).slice(0, 8)) {
          fallbackArticles.push(...await searchGoogleNews(q, { isCurrentNews: false, maxResults: 4 }));
        }
        articles = filterSourcesForEvent(filterIncidentEvidenceArticles(deduplicateNewsArticles([...articles, ...fallbackArticles])), {
          eventName: fallbackEvent.normalizedQuery,
          disasterType: fallbackEvent.disasterType,
          state: fallbackEvent.state,
          approxDate: fallbackEvent.eventDate || String(fallbackEvent.year || "")
        }).slice(0, 8);
      }
    }
    evidenceSources = articles.map((art, idx) => ({
      id: `S${idx + 1}`,
      title: art.title,
      publisher: art.publisher,
      publishedAt: art.publishedAt,
      url: art.url,
      summary: art.summary
    }));
    contextText = `Retrieved Evidence Sources:
` + evidenceSources.map((s) => `[${s.id}] ${s.title} (${s.publisher}): ${s.summary}`).join("\n");
  }
  const systemInstruction = `You are the Lead Historical Disaster Intelligence Research Assistant.
Your goal is to answer queries strictly grounded in retrieved evidence.
RULES:
1. Support factual claims with citations [S1], [S2], etc.
2. If facts are not in the sources after checking titles and summaries, say exactly which detail could not be established from the retrieved evidence.
3. Check spelling and grammar before responding. Output only clean professional English.
4. Use concise Markdown: short paragraphs and bullet lists. Use tables only for truly tabular comparisons.
5. Do not emit raw HTML entities such as &nbsp;.
6. Avoid boilerplate disclaimers unless the evidence is genuinely missing.
7. Use ASCII citation brackets only, such as [S1], never fullwidth citation brackets.
8. Respond in clear, professional English.`;
  const prompt = `Conversation Context:
${history.slice(-4).map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`).join("\n")}

Evidence Documents:
${contextText}

User Question: "${message}"

Provide a professional, cited research answer:`;
  let reply = await generateWithFallback({
    prompt,
    systemInstruction,
    keyScope: "chat"
  }) || "";
  if (!reply) {
    reply = evidenceSources.length > 0 ? `## Answer

Based on retrieved historical records:

` + evidenceSources.map((s) => `* **${s.title}** (${s.publisher}): ${s.summary} [${s.id}]`).join("\n\n") : `## Answer

No sufficiently relevant historical evidence was retrieved for this query after typo and alias normalization.`;
  }
  reply = sanitizeGeneratedReply(validateAndCleanCitations(reply, evidenceSources));
  reply = sanitizeGeneratedReply(reply);
  return {
    reply,
    sources: evidenceSources
  };
}
async function generateTTSAudio(text, voiceName = getGroqTtsVoice()) {
  const apiKey = getGroqKey("tts");
  const baseUrl = getGroqBaseUrl();
  const ttsModel = getGroqTtsModel();
  const cleanText = stripMarkdownForSpeech(text).replace(/\[S\d+\]/gi, "").slice(0, 500);
  try {
    const response = await fetch(`${baseUrl}/audio/speech`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: ttsModel,
        input: cleanText,
        voice: voiceName || getGroqTtsVoice(),
        response_format: "mp3"
      })
    });
    if (!response.ok) {
      const text2 = await response.text().catch(() => "");
      throw new Error(`Groq TTS failed: HTTP ${response.status} ${text2}`.trim());
    }
    const audioBuffer = await response.arrayBuffer();
    return toBase64(audioBuffer);
  } catch (error) {
    console.log("Groq TTS fallback:", error.message);
    return null;
  }
}

// server/lib/moderation.ts
var BLOCKED_PATTERNS = [
  { category: "threat", pattern: /\b(?:kill|murder|rape|bomb|shoot)\s+(?:you|them|him|her|everyone)\b/i },
  { category: "threat", pattern: /\b(?:kill yourself|go die|death threat)\b/i },
  { category: "profanity", pattern: /\b(?:fuck|f+u+c+k|motherf+u+c+k|bitch|bastard|dick|cunt|slut|whore|asshole|bullshit|shithead)\b/i },
  { category: "profanity", pattern: /\b(?:chutiya|chutiy|gand+u|harami|madarchod|behenchod|bhosdi|lund|randi|lauda)\b/i },
  { category: "profanity", pattern: /(?:चूतिया|गांडू|हरामी|मादरचोद|बहनचोद|भोसड़ी|लौड़ा|रंडी)/u },
  { category: "profanity", pattern: /(?:চোদা|চোদাচুদি|হারামি|বেশ্যা)/u },
  { category: "profanity", pattern: /(?:தேவடியா|புண்டை|மயிரு|நாயே)/u },
  { category: "profanity", pattern: /(?:ಲೋಫರ್|ಸೂಳೆ|ನಾಯಿಮಗ)/u },
  { category: "profanity", pattern: /(?:లంజ|దెంగు|పూకు)/u },
  { category: "profanity", pattern: /(?:ભાડવો|રાંડ|ચૂત)/u },
  { category: "profanity", pattern: /(?:بکواس|حرامی|رنڈی)/u },
  { category: "sexual", pattern: /\b(?:porn|xxx|sexually explicit|nude|nudes|child sexual|csam)\b/i },
  { category: "abuse", pattern: /\b(?:idiot|moron|retard|stupid bastard|you are worthless)\b/i }
];
function normalizeForModeration(value) {
  return value.normalize("NFKC").replace(/[\u200B-\u200D\uFEFF]/g, "").toLowerCase().replace(/[4@]/g, "a").replace(/[3]/g, "e").replace(/[1!]/g, "i").replace(/[0]/g, "o").replace(/[5$]/g, "s").replace(/(.)\1{4,}/g, "$1$1").replace(/[^\p{L}\p{M}\p{N}\s!?'-]/gu, " ").replace(/\s+/g, " ").trim();
}
function moderateChatInput(value) {
  if (typeof value !== "string") return { allowed: false, category: "length" };
  if (value.length === 0 || value.length > 4e3) return { allowed: false, category: "length" };
  const normalized = normalizeForModeration(value);
  const match = BLOCKED_PATTERNS.find(({ pattern }) => pattern.test(normalized));
  return match ? { allowed: false, category: match.category } : { allowed: true };
}

// server/data/historicalDisasters.ts
var HISTORICAL_DISASTERS_CATALOG = [];

// server/db/supabase.ts
var SUPABASE_URL = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
var SUPABASE_PUBLISHABLE_KEY = String(process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "");
var SUPABASE_SECRET_KEY = String(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "");
function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SECRET_KEY);
}
function getSupabaseUrl() {
  return SUPABASE_URL;
}
async function supabaseRest(path2, init = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path2.replace(/^\/+/, "")}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers || {}
    }
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase REST request failed (${response.status}): ${detail || response.statusText}`);
  }
  if (response.status === 204) return void 0;
  return response.json();
}

// server/repositories/canonicalEvents.ts
function rowToDto(row) {
  const coordinates = row.centroid?.coordinates;
  return {
    id: row.id,
    eventKey: row.event_key,
    title: row.title,
    eventType: row.event_type,
    status: row.status,
    severity: row.severity || "Unknown",
    urgency: row.urgency || "Unknown",
    certainty: row.certainty || "Unknown",
    description: row.description || "",
    locationName: row.location_name || [row.district, row.state].filter(Boolean).join(", ") || "India",
    city: row.city || void 0,
    district: row.district || void 0,
    state: row.state || void 0,
    country: row.country || "India",
    longitude: row.longitude ?? coordinates?.[0],
    latitude: row.latitude ?? coordinates?.[1],
    geometry: row.geometry || void 0,
    startedAt: row.started_at || void 0,
    lastObservedAt: row.last_observed_at || void 0,
    lastVerifiedAt: row.last_verified_at || void 0,
    presentUntil: row.present_until || void 0,
    endedAt: row.ended_at || void 0,
    verificationStatus: row.verification_status,
    verificationScore: Number(row.verification_score || 0),
    verificationMethod: row.verification_method || "SOURCE_WEIGHTED",
    verificationReason: row.verification_reason || "Stored canonical event with source provenance.",
    locationConfidence: Number(row.location_confidence || 0),
    sourceCount: Number(row.source_count || row.citations?.length || 0),
    citations: row.citations || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
function seedEvents() {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return HISTORICAL_DISASTERS_CATALOG.slice(0, 12).map((item) => ({
    id: item.id,
    eventKey: item.id,
    title: item.eventName,
    eventType: item.disasterType,
    status: "ARCHIVED",
    severity: "Severe",
    urgency: "Past",
    certainty: "Observed",
    description: item.whatHappened,
    locationName: `${item.location}, ${item.state}`,
    state: item.state,
    country: item.country,
    startedAt: item.eventDate,
    lastObservedAt: item.eventDate,
    lastVerifiedAt: item.synthesizedAt,
    endedAt: item.eventDate,
    verificationStatus: "PROVISIONALLY_VERIFIED",
    verificationScore: item.evidenceStatus === "High Confidence" ? 0.82 : 0.62,
    verificationMethod: "SEED_FIXTURE_RECONCILIATION",
    verificationReason: "Seeded from existing verified historical fixture for initial database population fallback.",
    locationConfidence: 0.55,
    sourceCount: item.sources.length,
    citations: item.sources.map((source) => ({
      id: source.id,
      sourceName: source.publisher,
      sourceType: "SEED",
      publisher: source.publisher,
      title: source.title,
      url: source.url,
      publishedAt: source.publishedAt,
      retrievedAt: item.synthesizedAt,
      summary: source.summary
    })),
    createdAt: now,
    updatedAt: item.synthesizedAt || now
  }));
}
async function listActiveCanonicalEvents() {
  if (!isSupabaseConfigured()) {
    return {
      items: [],
      count: 0,
      retrievedAt: (/* @__PURE__ */ new Date()).toISOString(),
      cacheStatus: "SEED_FALLBACK"
    };
  }
  const rows = await supabaseRest(
    "active_canonical_events?select=*&order=last_observed_at.desc.nullslast&limit=200"
  );
  const items = rows.map(rowToDto);
  return { items, count: items.length, retrievedAt: (/* @__PURE__ */ new Date()).toISOString(), cacheStatus: "SUPABASE" };
}
async function listArchivedCanonicalEvents() {
  if (!isSupabaseConfigured()) {
    const items2 = seedEvents();
    return { items: items2, count: items2.length, retrievedAt: (/* @__PURE__ */ new Date()).toISOString(), cacheStatus: "SEED_FALLBACK" };
  }
  const rows = await supabaseRest(
    "past_canonical_events?select=*&order=started_at.desc.nullslast&limit=200"
  );
  const items = rows.map(rowToDto);
  return { items, count: items.length, retrievedAt: (/* @__PURE__ */ new Date()).toISOString(), cacheStatus: "SUPABASE" };
}
async function searchCanonicalEvents(query) {
  const q = query.trim();
  if (!q) return [];
  if (!isSupabaseConfigured()) {
    const lower = q.toLowerCase();
    return seedEvents().filter(
      (item) => [item.title, item.eventType, item.state, item.locationName, item.description].some(
        (value) => String(value || "").toLowerCase().includes(lower)
      )
    );
  }
  const encoded = encodeURIComponent(`%${q.replace(/[%_]/g, "")}%`);
  const rows = await supabaseRest(
    `past_canonical_events?select=*&or=(title.ilike.${encoded},description.ilike.${encoded},state.ilike.${encoded},district.ilike.${encoded},event_type.ilike.${encoded})&order=started_at.desc.nullslast&limit=50`
  );
  return rows.map(rowToDto);
}

// server/auth.ts
async function requireAuth(req, res, next) {
  try {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
    if (!token) return res.status(401).json({ error: "Authentication required" });
    if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase Auth is not configured" });
    const baseUrl = getSupabaseUrl();
    const response = await fetch(`${baseUrl}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY || SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) return res.status(401).json({ error: "Invalid or expired session" });
    const user = await response.json();
    if (!user.id) return res.status(401).json({ error: "Invalid authenticated user" });
    const profiles = await supabaseRest(
      `profiles?id=eq.${encodeURIComponent(user.id)}&select=role&limit=1`,
      { method: "GET" }
    );
    req.user = {
      id: user.id,
      email: user.email,
      role: profiles[0]?.role === "admin" ? "admin" : "user"
    };
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication check failed", details: error.message });
  }
}
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Authentication required" });
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin role required" });
  next();
}

// server/routes.ts
var router = (0, import_express.Router)();
var upload = (0, import_multer.default)({ storage: import_multer.default.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
warmRecentIndiaArchive(100);
var globalSearchCounter = 0;
var GLOBAL_SEARCH_CEILING = 150;
var geocodeCache = /* @__PURE__ */ new Map();
var GEOCODE_CACHE_TTL_MS = 10 * 60 * 1e3;
function canonicalizeFilterCategory(value) {
  if (!value) return void 0;
  const lower = value.toLowerCase();
  if (/all\s+hazard|^all$/.test(lower)) return void 0;
  if (lower.includes("cyclone")) return "Cyclone";
  if (lower.includes("flood") || lower.includes("deluge")) return "Flood";
  if (lower.includes("earthquake")) return "Earthquake";
  if (lower.includes("tsunami")) return "Tsunami";
  if (lower.includes("landslide") || lower.includes("avalanche")) return "Landslide";
  if (lower.includes("heat") || lower.includes("extreme weather")) return "Heat Wave";
  return value;
}
function canonicalizeFilterDecade(value) {
  if (!value || /^all$/i.test(value.trim())) return void 0;
  const match = value.match(/(19|20)\d{2}/);
  return match ? `${match[0].slice(0, 3)}0s` : value;
}
setInterval(() => {
  globalSearchCounter = Math.max(0, globalSearchCounter - 20);
}, 6e4);
function canonicalEventToEvidenceBundle(event) {
  const year = event.startedAt ? new Date(event.startedAt).getFullYear() : new Date(event.updatedAt).getFullYear();
  const sources = event.citations.map((citation, index) => ({
    id: citation.id || `S${index + 1}`,
    title: citation.title,
    publisher: citation.publisher || citation.sourceName,
    publishedAt: citation.publishedAt || citation.retrievedAt || event.updatedAt,
    url: citation.url || "",
    summary: citation.summary || `${citation.sourceName} reported this event.`,
    qualityScore: event.verificationScore
  }));
  return {
    id: event.id,
    eventName: event.title,
    disasterType: event.eventType,
    location: event.locationName,
    state: event.state || "India",
    country: event.country,
    eventDate: event.startedAt,
    dateRange: event.startedAt ? new Date(event.startedAt).toLocaleDateString("en-IN") : "Date unavailable",
    numericCasualtiesRange: void 0,
    reportedCasualties: "Details were not clearly quantified in the verified database record.",
    reportedDamage: "Details were not clearly quantified in the verified database record.",
    sources,
    timeline: [
      {
        date: event.lastObservedAt || event.updatedAt,
        event: event.status,
        description: event.description,
        citations: sources.map((source) => source.id)
      }
    ],
    whatHappened: event.description,
    affectedAreas: event.locationName,
    humanImpact: "Refer to source citations for confirmed public impact details.",
    infrastructureDamage: "Refer to source citations for confirmed infrastructure impact details.",
    economicImpact: "Refer to source citations for confirmed economic impact details.",
    governmentResponse: event.verificationReason,
    rescueRelief: event.instruction || "No verified instruction was attached to this record.",
    recovery: event.status === "ARCHIVED" || event.status === "ENDED" ? "Event is available in the historical archive." : "Event remains active or developing.",
    sourceAssessment: `${event.verificationStatus} via ${event.verificationMethod}. Verification score ${Math.round(event.verificationScore * 100)}%.`,
    conflictingReports: [],
    synthesizedAt: event.updatedAt,
    evidenceStatus: event.verificationScore >= 0.8 ? "High Confidence" : event.verificationScore >= 0.55 ? "Moderate Evidence" : "Limited Coverage",
    retrievalMetadata: {
      queriesExecuted: ["canonical_events"],
      rawSourcesCount: event.sourceCount,
      dedupedSourcesCount: event.sourceCount
    },
    year: Number.isFinite(year) ? year : (/* @__PURE__ */ new Date()).getFullYear(),
    numericCasualties: 0,
    decade: Number.isFinite(year) ? `${String(Math.floor(year / 10) * 10)}s` : "2020s"
  };
}
function pointWkt(longitude, latitude) {
  return `SRID=4326;POINT(${longitude} ${latitude})`;
}
function readNumber(value) {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : void 0;
}
async function getOwnedProfile(userId) {
  const profiles = await supabaseRest(
    `profiles?id=eq.${encodeURIComponent(userId)}&select=id,name,email,role,created_at,updated_at&limit=1`,
    { method: "GET" }
  );
  return profiles[0] || null;
}
router.get("/events/active", async (_req, res) => {
  try {
    const result = await listActiveCanonicalEvents();
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve active canonical events",
      details: error.message
    });
  }
});
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const profile = await getOwnedProfile(req.user.id);
    const locations = await supabaseRest(
      `user_locations?user_id=eq.${encodeURIComponent(req.user.id)}&select=id,location_type,label,city,district,state,country,accuracy_meters,created_at,updated_at&order=created_at.desc`,
      { method: "GET" }
    );
    const subscriptions = await supabaseRest(
      `subscriptions?user_id=eq.${encodeURIComponent(req.user.id)}&select=id,email_enabled,sms_enabled,push_enabled,nearby_radius_km,severity_threshold,created_at,updated_at&limit=1`,
      { method: "GET" }
    );
    res.json({ profile, locations, subscription: subscriptions[0] || null });
  } catch (error) {
    res.status(500).json({ error: "Failed to load profile", details: error.message });
  }
});
router.post("/profile/setup", requireAuth, async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    if (!name) return res.status(400).json({ error: "Name is required" });
    const rows = await supabaseRest(
      "profiles?on_conflict=id",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          id: req.user.id,
          name,
          email: req.user.email || "",
          role: "user",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      }
    );
    res.status(201).json({ profile: rows[0] || null });
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize profile", details: error.message });
  }
});
router.post("/profile/home-location", requireAuth, async (req, res) => {
  try {
    const latitude = readNumber(req.body.latitude);
    const longitude = readNumber(req.body.longitude);
    if (latitude === void 0 || longitude === void 0) {
      return res.status(400).json({ error: "Coordinates are required for a saved home location" });
    }
    const rows = await supabaseRest(
      "user_locations",
      {
        method: "POST",
        body: JSON.stringify({
          user_id: req.user.id,
          location_type: "HOME",
          label: typeof req.body.label === "string" ? req.body.label : "Home",
          geometry: pointWkt(longitude, latitude),
          city: typeof req.body.city === "string" ? req.body.city : null,
          state: typeof req.body.state === "string" ? req.body.state : null,
          country: "India",
          accuracy_meters: readNumber(req.body.accuracyMeters)
        })
      }
    );
    res.status(201).json({ location: rows[0] || null });
  } catch (error) {
    res.status(500).json({ error: "Failed to save home location", details: error.message });
  }
});
router.patch("/profile", requireAuth, async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    if (!name) return res.status(400).json({ error: "Name is required" });
    const updated = await supabaseRest(
      `profiles?id=eq.${encodeURIComponent(req.user.id)}`,
      { method: "PATCH", body: JSON.stringify({ name, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) }
    );
    res.json({ profile: updated[0] || null });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile", details: error.message });
  }
});
router.patch("/subscriptions", requireAuth, async (req, res) => {
  try {
    const payload = {
      user_id: req.user.id,
      email_enabled: Boolean(req.body.emailEnabled),
      sms_enabled: Boolean(req.body.smsEnabled),
      push_enabled: Boolean(req.body.pushEnabled),
      nearby_radius_km: readNumber(req.body.nearbyRadiusKm) || 50,
      severity_threshold: typeof req.body.severityThreshold === "string" ? req.body.severityThreshold : "Moderate",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const rows = await supabaseRest(
      "subscriptions?on_conflict=user_id",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(payload)
      }
    );
    res.json({ subscription: rows[0] || null });
  } catch (error) {
    res.status(500).json({ error: "Failed to update subscriptions", details: error.message });
  }
});
router.post("/reports", requireAuth, async (req, res) => {
  try {
    const reportText = typeof req.body.reportText === "string" ? req.body.reportText.trim() : "";
    const latitude = readNumber(req.body.latitude);
    const longitude = readNumber(req.body.longitude);
    const accuracyMeters = readNumber(req.body.accuracyMeters);
    const maxAccuracy = Number(process.env.REPORT_MAX_ACCURACY_METERS || 150);
    if (!reportText) return res.status(400).json({ error: "Report text is required" });
    if (latitude === void 0 || longitude === void 0 || accuracyMeters === void 0) {
      return res.status(400).json({ error: "Current browser coordinates and accuracy are required" });
    }
    if (accuracyMeters > maxAccuracy) {
      return res.status(422).json({ error: `Location accuracy must be ${maxAccuracy} meters or better` });
    }
    const rows = await supabaseRest(
      "citizen_reports",
      {
        method: "POST",
        body: JSON.stringify({
          user_id: req.user.id,
          report_text: reportText,
          geometry: pointWkt(longitude, latitude),
          accuracy_meters: accuracyMeters,
          reported_category: typeof req.body.category === "string" ? req.body.category : null,
          status: "PENDING",
          verification_score: 0,
          verification_reason: "Awaiting cross-source verification"
        })
      }
    );
    res.status(201).json({ report: rows[0] || null });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit citizen report", details: error.message });
  }
});
router.get("/reports/mine", requireAuth, async (req, res) => {
  try {
    const reports = await supabaseRest(
      `citizen_reports?user_id=eq.${encodeURIComponent(req.user.id)}&select=id,report_text,accuracy_meters,reported_category,reported_at,status,verification_score,verification_reason,linked_event_id,created_at&order=reported_at.desc`,
      { method: "GET" }
    );
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: "Failed to load reports", details: error.message });
  }
});
router.get("/notifications", requireAuth, async (req, res) => {
  try {
    const notifications = await supabaseRest(
      `notifications?user_id=eq.${encodeURIComponent(req.user.id)}&select=id,event_id,channel,status,reason,sent_at,created_at&order=created_at.desc`,
      { method: "GET" }
    );
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to load notifications", details: error.message });
  }
});
router.get("/admin/events", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const events = await supabaseRest("canonical_events?select=id,title,event_type,status,severity,verification_status,verification_score,updated_at&order=updated_at.desc&limit=100", { method: "GET" });
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: "Failed to load admin events", details: error.message });
  }
});
router.get("/admin/reports", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const reports = await supabaseRest("citizen_reports?select=id,user_id,report_text,reported_category,status,verification_score,verification_reason,reported_at&order=reported_at.desc&limit=100", { method: "GET" });
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: "Failed to load admin reports", details: error.message });
  }
});
router.get("/admin/sources", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const sources = await supabaseRest("source_definitions?select=id,name,source_type,enabled,priority,trust_weight,last_success_at,last_failure_at,health_status&order=name.asc", { method: "GET" });
    res.json({ sources });
  } catch (error) {
    res.status(500).json({ error: "Failed to load admin sources", details: error.message });
  }
});
router.get("/admin/jobs", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const jobs = await supabaseRest("job_runs?select=id,job_type,started_at,finished_at,status,records_processed,records_created,records_updated,records_rejected,error_message&order=started_at.desc&limit=100", { method: "GET" });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: "Failed to load admin jobs", details: error.message });
  }
});
router.post("/transcribe", upload.single("file"), async (req, res) => {
  try {
    if (!isGroqConfigured()) {
      return res.status(503).json({
        error: "Groq is not configured on the server",
        details: "Set GROQ_API_KEY in the server environment and restart the app."
      });
    }
    const audioBase64 = typeof req.body.audioBase64 === "string" ? req.body.audioBase64 : void 0;
    const mimeType = typeof req.body.mimeType === "string" ? req.body.mimeType : req.file?.mimetype;
    if (!req.file?.buffer && !audioBase64) {
      return res.status(400).json({ error: "Audio data is required for transcription" });
    }
    const transcription = await transcribeAudio(req.file?.buffer || audioBase64, mimeType || "audio/webm");
    res.json({ text: transcription.text, sourceText: transcription.text, success: true });
  } catch (error) {
    res.status(500).json({
      error: "Audio transcription failed",
      details: error.message
    });
  }
});
router.get("/alerts", async (req, res) => {
  try {
    const clientEtag = req.headers["if-none-match"];
    const result = await getSachetAlerts(typeof clientEtag === "string" ? clientEtag : void 0);
    res.setHeader("ETag", result.etag);
    res.setHeader("Cache-Control", "public, max-age=15");
    if (!result.isModified && clientEtag) {
      return res.status(304).end();
    }
    const categories = Array.from(new Set(result.alerts.map((a) => a.category)));
    const alerts = result.alerts;
    res.json({
      alerts,
      activeCount: alerts.length,
      categoriesCount: categories.length,
      categories,
      lastUpdated: result.lastUpdated,
      cacheStatus: result.cacheStatus,
      etag: result.etag
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve SACHET alerts",
      details: error.message
    });
  }
});
router.get("/alerts/:id/news", async (req, res) => {
  try {
    const { id } = req.params;
    const query = req.query.q || "Odisha cyclone warning";
    const windowHours = parseInt(req.query.window || "72", 10);
    const news = await searchGoogleNews(query, {
      isCurrentNews: true,
      windowHours,
      maxResults: 6
    });
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json({
      alertId: id,
      query,
      windowHours,
      articles: news,
      count: news.length,
      retrievedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve current news for alert",
      details: error.message
    });
  }
});
router.get("/geocode", async (req, res) => {
  try {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!query) {
      return res.status(400).json({ error: "Location query is required" });
    }
    const cacheKey = query.toLowerCase();
    const cached = geocodeCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader("Cache-Control", "public, max-age=600");
      return res.json(cached.payload);
    }
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "DisasterIntelligencePlatform/1.0 (geocoding)",
        Accept: "application/json"
      }
    });
    if (!response.ok) {
      return res.status(502).json({
        error: "Geocoding service unavailable"
      });
    }
    const results = await response.json();
    const places = Array.isArray(results) ? results.map((item) => ({
      name: item.display_name || item.name || query,
      lat: Number(item.lat),
      lng: Number(item.lon),
      state: item.address?.state || item.address?.state_district || item.address?.county || void 0,
      district: item.address?.county || item.address?.city_district || item.address?.district || void 0,
      country: item.address?.country || "India",
      raw: item
    })) : [];
    const filtered = places.filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng));
    const payload = {
      query,
      count: filtered.length,
      places: filtered,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    geocodeCache.set(cacheKey, {
      expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS,
      payload
    });
    res.setHeader("Cache-Control", "public, max-age=600");
    res.json(payload);
  } catch (error) {
    res.status(500).json({
      error: "Failed to resolve location",
      details: error.message
    });
  }
});
router.post("/past/search", async (req, res) => {
  try {
    const { query, category, state } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    if (globalSearchCounter >= GLOBAL_SEARCH_CEILING) {
      return res.status(429).json({
        error: "Please allow results to load before searching again (Demo rate ceiling reached)."
      });
    }
    globalSearchCounter++;
    const databaseMatches = await searchCanonicalEvents(query);
    if (databaseMatches.length > 0) {
      res.setHeader("Cache-Control", "private, max-age=900");
      return res.json({ bundle: canonicalEventToEvidenceBundle(databaseMatches[0]), source: "database" });
    }
    const bundle = await buildHistoricalEvidenceBundle(query, category, state);
    res.json({ bundle });
  } catch (error) {
    const details = error.message;
    if (/no live google news sources were found|insufficient relevant historical evidence/i.test(details)) {
      return res.status(200).json({
        bundle: null,
        noResults: true,
        error: null,
        details: /insufficient/i.test(details) ? "Insufficient relevant historical evidence was retrieved to build a reliable dossier for this event." : "No live news sources were found for this query."
      });
    }
    res.status(500).json({
      error: "Failed to execute historical research search",
      details
    });
  }
});
router.get("/past/archive", async (req, res) => {
  try {
    const archive = await listArchivedCanonicalEvents();
    const items = archive.items.map(canonicalEventToEvidenceBundle);
    res.setHeader("Cache-Control", "public, max-age=300");
    res.json({
      items,
      count: items.length,
      retrievedAt: archive.retrievedAt,
      cacheStatus: archive.cacheStatus
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to build recent disaster archive",
      details: error.message
    });
  }
});
router.post("/past/filter-search", async (req, res) => {
  try {
    if (globalSearchCounter >= GLOBAL_SEARCH_CEILING) {
      return res.status(429).json({
        error: "Please allow results to load before applying another filter."
      });
    }
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const readFilter = (value) => {
      if (typeof value !== "string" || !value.trim()) return void 0;
      return value.trim();
    };
    const categoryFilter = canonicalizeFilterCategory(readFilter(body.category));
    const requestedState = readFilter(body.state);
    const stateFilter = requestedState && !/^all\s+states?$/i.test(requestedState) ? requestedState : void 0;
    const decadeFilter = canonicalizeFilterDecade(readFilter(body.decade));
    const requestedLimit = Number(body.limit);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(Math.floor(requestedLimit), 1), 100) : 100;
    const archived = await listArchivedCanonicalEvents();
    let items = archived.items.map(canonicalEventToEvidenceBundle);
    if (categoryFilter) items = items.filter((item) => item.disasterType === categoryFilter);
    if (stateFilter) items = items.filter((item) => item.state.toLowerCase() === stateFilter.toLowerCase());
    if (decadeFilter) items = items.filter((item) => item.decade === decadeFilter);
    if (items.length === 0) {
      globalSearchCounter++;
      items = await buildFilteredIndiaArchive(limit, {
        categoryFilter,
        stateFilter,
        decadeFilter
      });
    }
    res.setHeader("Cache-Control", "private, max-age=300");
    res.json({
      items: items.slice(0, limit),
      count: items.length,
      appliedFilters: {
        category: categoryFilter || "all",
        state: stateFilter || "All States",
        decade: decadeFilter || "all"
      },
      retrievedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to apply disaster filters",
      details: error.message
    });
  }
});
router.post("/past/compare", async (req, res) => {
  try {
    const { bundles } = req.body;
    if (!Array.isArray(bundles) || bundles.length < 2 || bundles.length > 4) {
      return res.status(400).json({ error: "Select between 2 and 4 events to compare" });
    }
    const comparison = await compareDisasterEvents(bundles);
    res.json(comparison);
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate comparison matrix",
      details: error.message
    });
  }
});
router.post("/past/chat", async (req, res) => {
  try {
    const { message, history, associatedBundle } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const moderation = moderateChatInput(message);
    if (!moderation.allowed) {
      return res.status(422).json({
        error: "Please rephrase your message using respectful disaster-related wording.",
        code: "CHAT_INPUT_BLOCKED"
      });
    }
    const chatResponse = await chatResearchAssistant({
      message,
      history: Array.isArray(history) ? history : [],
      associatedBundle
    });
    res.json(chatResponse);
  } catch (error) {
    res.status(500).json({
      error: "AI Assistant query failed",
      details: error.message
    });
  }
});
router.post("/tts", async (req, res) => {
  try {
    if (!isGroqConfigured()) {
      return res.status(503).json({
        error: "Groq is not configured on the server",
        details: "Set GROQ_API_KEY in the server environment and restart the app."
      });
    }
    const { text, voiceName } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required for TTS" });
    }
    const audioBase64 = await generateTTSAudio(text, voiceName || "Kore");
    res.json({ audioBase64 });
  } catch (error) {
    res.status(500).json({
      error: "TTS generation failed",
      details: error.message
    });
  }
});
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    providers: {
      sachet: "operational",
      googleNews: "operational",
      groqAI: isGroqConfigured() ? "configured" : "missing_key_fallback_active"
    },
    version: "1.0.0"
  });
});
var routes_default = router;

// server/app.ts
function getAllowedOrigins() {
  const raw = [
    process.env.CORS_ORIGINS,
    process.env.FRONTEND_URL,
    process.env.APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    process.env.NODE_ENV === "development" ? "http://localhost:5173" : "",
    process.env.NODE_ENV === "development" ? "http://127.0.0.1:5173" : "",
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : ""
  ].filter((value) => Boolean(value)).flatMap((value) => value.split(",")).map((value) => value.trim()).filter(Boolean);
  return new Set(raw);
}
function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  if (origin && (allowedOrigins.size === 0 || allowedOrigins.has(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]?.toString() || "Content-Type, Authorization, If-None-Match, X-Requested-With"
  );
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
}
function createApp(options = {}) {
  const app = (0, import_express2.default)();
  const mode = options.mode || (process.env.VERCEL ? "vercel" : process.env.NODE_ENV === "production" ? "production" : "dev");
  const serveStatic = options.serveStatic ?? mode !== "vercel";
  app.use(corsMiddleware);
  app.use(import_express2.default.json({ limit: "10mb" }));
  app.use(import_express2.default.urlencoded({ extended: true }));
  app.use("/api", routes_default);
  if (serveStatic) {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express2.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  return app;
}

// server.ts
async function startServer() {
  const app = createApp({ mode: "dev", serveStatic: false });
  const port = Number(process.env.PORT || 3e3);
  const server = (0, import_http.createServer)(app);
  server.listen(port, "0.0.0.0", () => {
    console.log(`Disaster Intelligence Platform API listening on port ${port}`);
  });
}
startServer().catch((error) => {
  console.error("Failed to start backend server:", error);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
