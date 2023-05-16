// eslint-disable-next-line filenames/match-exported
import { currentUserChecker } from "./auth/currentUserChecker"
import { authorizationChecker } from "./auth/authorizationChecker"
import { useExpressServer } from "routing-controllers"
import { normalizeWithUnixPaths } from "../utils/NormalizeWithUnixPaths"
import type { Application } from "express"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import type * as http from "http"

export default class RestApi {
    private static _instance: RestApi
    private readonly _app: Application
    private readonly _serverPort: number
    private _server: http.Server | undefined

    static getInstance(): RestApi {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!RestApi._instance) RestApi._instance = new RestApi()

        return RestApi._instance
    }

    private constructor() {
        this._app = express()
        this._serverPort = 3000
    }

    async start(): Promise<void> {
        this._app.use(express.json())
        this._app.use(express.urlencoded({ extended: true }))
        this._app.use(cors())
        this._app.use(helmet())

        const expressApp: Application = await normalizeWithUnixPaths(() =>
            useExpressServer(this._app, {
                cors: true,
                classTransformer: true,
                routePrefix: "/api",
                controllers: [`${__dirname}/controllers/**/*.ts`],
                middlewares: [`${__dirname}/middlewares/**/*.ts`],
                authorizationChecker: authorizationChecker(),
                currentUserChecker: currentUserChecker(),
            }),
        )

        this._server = expressApp.listen(this._serverPort)
        this._server.addListener("listening", () => {
            console.log("Server is running on port 3000")
        })
    }

    stop(): void {
        if (this._server) this._server.close()
        console.log("Server stopped")
    }
}
