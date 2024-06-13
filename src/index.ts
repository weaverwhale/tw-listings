import express, { Request, Response } from 'express'
import chalk from 'chalk'
import * as dotenv from 'dotenv'
import { getFolderData } from './get-folder-data'
import testData from './test_data'

// -----------------------
// data
// -----------------------
dotenv.config()
const { NODE_ENV } = process.env
const isProd = NODE_ENV === 'production'
const appName = chalk.hex('#1877f2')('[🐳] ')

// -----------------------
// express app
// -----------------------
const app = express()
const port = isProd ? 80 : 9179
app.use(express.json())

// -----------------------
// routes
// -----------------------
// Since we only need to get the data once per deploy, we can cache the data in memory.
const cachedData = new Map<string, any>()
app.post('/get-folder-data', (req: Request, res: Response) => {
  try {
    if (!req.body.path) {
      throw new Error('path is required')
    }

    if (isProd) {
      if (!cachedData.has(req.body.path)) {
        const { path } = req.body
        const data = getFolderData(path)
        cachedData.set(path, data)
        res.json({ path, data })
      } else {
        res.json({ path: req.body.path, data: cachedData.get(req.body.path) })
      }
    } else {
      res.json({ ...testData })
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// -----------------------
// static
// -----------------------
app.use(express.static('public', { extensions: ['html'] }))

// -----------------------
// start listening
// -----------------------
app
  .listen(port, () =>
    console.log(
      appName +
        chalk.yellow(
          isProd ? `Listening on port ${port}` : `Listening on http://localhost:${port}`,
        ),
    ),
  )
  .on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(chalk.red(`Port ${port} is already in use`))
      process.exit(1)
    }
  })
