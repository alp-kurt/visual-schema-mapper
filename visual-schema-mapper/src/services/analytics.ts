export type AnalyticsEvent = 'MAPPING_SUCCESS' | 'VALIDATION_ERROR' | 'APP_CRASH' | 'MAPPINGS_SAVED'

interface AnalyticsPayloads {
  MAPPING_SUCCESS: { source: string; target: string }
  VALIDATION_ERROR: { source: string; target: string }
  APP_CRASH: { error: unknown }
  MAPPINGS_SAVED: { count: number }
}

class AnalyticsService {
  private static instance: AnalyticsService

  private constructor() {}

  static getInstance() {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }

    return AnalyticsService.instance
  }

  track<Event extends AnalyticsEvent>(eventName: Event, properties?: AnalyticsPayloads[Event]) {
    console.group(`📊 Analytics: ${eventName}`)
    console.log('timestamp', new Date().toISOString())

    if (properties) {
      console.log('properties', properties)
    }

    console.groupEnd()
  }
}

export const Analytics = AnalyticsService.getInstance()
