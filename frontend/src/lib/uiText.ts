export const UI_TEXT = {
  share: 'Share',
  viewDetails: 'View Details',
  noAlertsNearby: 'No alerts nearby',
  officialInstructionTitle: 'Official Instructions',
  compareNow: 'Compare Now',
  voiceAssistantTitle: 'AI Research Assistant',
};

const LABELS: Record<string, string> = {
  'present.allHazards': '{count} Hazards',
  'present.nearMe': 'Near Me ({count})',
  'present.mapTitle': 'Live Disaster Intelligence Map',
  'present.activeHazards': '{count} Active Hazards',
  'present.locationOptional': 'Enable location or search another place to check whether a verified event is relevant to you.',
  'present.yourLocation': 'Your Location',
  'present.mapOffline': 'Map temporarily unavailable',
  'present.retryMap': 'Retry map',
  'present.legend': 'Legend',
  'present.highPriority': 'High priority hazard',
  'present.moderatePriority': 'Moderate priority hazard',
  'present.boundary': 'Affected boundary',
  'present.centerLocation': 'Center on location',
  'present.monitoredLocation': 'Monitored location',
  'present.liveGps': 'Live GPS',
  'present.legendTitle': 'Map Legend',
  'present.legendHighPriority': 'Extreme / Severe hazard',
  'present.legendModeratePriority': 'Moderate / Minor hazard',
  'present.legendBoundary': 'Affected boundary',
  'present.legendYourLocation': 'Your location',
  'present.indiaOverview': 'India overview ({count})',
  'alerts.shareAlert': 'Share alert',
  'alerts.closeDrawer': 'Close alert details',
  'alerts.overview': 'Overview',
  'alerts.protectiveMeasures': 'Protective Measures',
  'alerts.helplines': 'Helplines',
  'alerts.liveAdvisory': 'Verified advisory',
  'alerts.issuingAuthority': 'Issuing authority',
  'alerts.severityUrgency': 'Severity / urgency',
  'alerts.certainty': 'Certainty',
  'alerts.effectiveTime': 'Effective time',
  'alerts.expiryTime': 'Expiry time',
  'alerts.coordinates': '{count} vector coordinates defined',
  'alerts.evacuationProtocol': 'Evacuation protocol',
  'alerts.protectiveActions': 'Protective actions',
  'alerts.dos': "Do's",
  'alerts.donts': "Don'ts",
  'alerts.noGeometry': 'This alert has no precise center or polygon. Showing verified instructions and supporting coverage only.',
  'alerts.controlRooms': 'Emergency control rooms and helplines',
  'alerts.tapToCall': 'Tap to call',
  'alerts.officialPortal': 'Official portal',
  'alerts.portalUnavailable': 'Official portal unavailable',
  'alerts.forward': 'Forward alert',
  'history.maxCompare': 'Select up to 4 events for comparison.',
  'history.sourcesCount': '{count} sources',
  'history.casualties': 'Casualties',
  'history.damage': 'Damage',
  'history.inCompare': 'In Compare',
  'history.addCompare': 'Add Compare',
  'history.askAi': 'Ask AI',
  'history.copySummary': 'Copy summary',
  'history.liveDossier': 'Open Dossier',
  'history.searchPlaceholder': 'Search disaster, district, state, or year...',
  'assistant.grounded': 'Grounded in verified evidence',
  'assistant.pipeline': 'Reviewing evidence...',
  'assistant.record': 'Record voice query',
  'assistant.placeholder': 'Ask a disaster intelligence question...',
  'common.close': 'Close',
  'common.stop': 'Stop',
  'common.listen': 'Listen',
  'common.sources': 'Sources',
  'voice.microphoneDenied': 'Microphone permission was denied.',
  'voice.noSpeech': 'No speech detected.',
  'voice.transcriptionError': 'Audio transcription failed.',
  'voice.stop': 'Stop ({seconds}s)',
  'voice.transcribing': 'Transcribing...',
  'voice.record': 'Record voice query',
};

export function uiText(key: string, values: Record<string, string | number> = {}): string {
  let value = LABELS[key] || key;
  for (const [token, replacement] of Object.entries(values)) {
    value = value.replace(new RegExp(`\\{${token}\\}`, 'g'), String(replacement));
  }
  return value;
}

export function hazardLabel(category: string): string {
  return category || 'General Alert';
}

export function alertEnumLabel(value: string): string {
  return value || 'Unknown';
}
