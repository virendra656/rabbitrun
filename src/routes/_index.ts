import * as winston from 'winston'
import { Express, Request, Response } from 'express'
import * as LanguagesRoutes from './languages'
import * as AppUserRoutes from './appusers'
import * as CustomerRoutes from './customers'
import * as DriverRoutes from './drivers'

export function initRoutes(app: Express) {
  winston.log('info', '--> Initialisations des routes')

  app.get('/api', (req: Request, res: Response) => res.status(200).send({
    message: 'server is running!'
  }))

  LanguagesRoutes.routes(app)
  AppUserRoutes.routes(app)
  CustomerRoutes.routes(app)
  DriverRoutes.routes(app)

  

  app.all('*', (req: Request, res: Response) => res.boom.notFound())
}
