const { Analytics } = require('@segment/analytics-node')

const segmentClient = new Analytics({ writeKey: process.env.ANALYTICS_API_KEY })

export const EVENTS = {
  // Service Oriented
  MS_HTTP_REQUEST: 'MS_HTTP_REQUEST',
  MS_HTTP_ERROR: 'MS_HTTP_ERROR',
  MS_ERROR: 'MS_ERROR',
  MS_MESSAGE: 'MS_MESSAGE'
}

export const track = (agent, event, properties) => {
  segmentClient.track({
    userId: agent,
    event,
    properties: {
      ...properties,
      happenedAt: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      debug: process.env.NODE_ENV !== 'production'
    }
  })
}