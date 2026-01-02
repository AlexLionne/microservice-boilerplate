const fs = require('fs')
const path = require('path')

/**
 * Transforme une config service YAML/JS en KrakenD JSON
 * @param {Object} config - Exemple : { name: 'home-service', routes: [...] }
 * @param {Object} options - options globales (jwtKey, hostPort)
 */
module.exports.buildApi = (config, options = {}) => {
  const { jwtKey = null } = options

  const endpoints = config.routes
    .filter(route => !route.endpoint.startsWith('/socket.io')) // exclut WS
    .map(route => {
      const ep = {
        endpoint: route.endpoint,
        method: route.method,
        backend: [
          {
            host: [`http://127.0.0.1:${options.port || 4000}`],
            url_pattern: route.endpoint
          }
        ]
      }

      // Healthcheck simple → no-op
      if (route.endpoint === '/status') {
        ep.output_encoding = 'no-op'
        ep.backend[0].encoding = 'no-op'
      }

      // JWT si middleware authenticate
      if (route.middlewares && route.middlewares.includes('authenticate') && jwtKey) {
        ep.extra_config = {
          'github_com/devopsfaith/krakend-jose/validator': {
            alg: 'HS256',
            key: jwtKey
          }
        }
      }

      return ep
    })

  // KrakenD JSON structure
  const krakendJson = {
    version: 3,
    name: `${config.name}-gateway`,
    port: options.krakendPort || 8080,
    timeout: '3000ms',
    extra_config: {
      'github_com/devopsfaith/krakend-cors': {
        allow_origins: options.allowOrigins || ['*'],
        allow_methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allow_headers: ['Authorization', 'Content-Type']
      }
    },
    endpoints
  }

  // Sauvegarde si chemin donné
  if (options.outputPath) {
    fs.writeFileSync(
      path.resolve(options.outputPath),
      JSON.stringify(krakendJson, null, 2),
      'utf8'
    )
    console.log(`✅ API on ${config.name} → ${options.outputPath}`)
  }

  return krakendJson
}
