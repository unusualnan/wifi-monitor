import { AutoRouter, cors } from 'itty-router'
import { handleUpload } from './handlers/upload'
import { handleLatest } from './handlers/latest'
import { handleHistory } from './handlers/history'
import { handleScheduled } from './handlers/cron'
import { handleGetSettings, handlePutSettings } from './handlers/setting'

const { preflight, corsify } = cors()


const router = AutoRouter({
  before: [preflight],
  finally: [corsify],
})

router
  .post('/api/upload', handleUpload)
  .get('/api/latest', handleLatest)
  .get('/api/history', handleHistory)
  .get('/api/settings', handleGetSettings)
  .put('/api/settings', handlePutSettings)

export default {
  ...router,
  scheduled: async (controller: ScheduledController, env: Env) => {
    await handleScheduled(env)
  },
} satisfies ExportedHandler<Env>
