import "reflect-metadata"
import RestApi from "./api/RestApi"

async function main(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await RestApi.getInstance().start()
}

void main()
