/* eslint-disable @typescript-eslint/no-magic-numbers */
const UTILS = {
    randomPassword(len: number = 8): string {
        const length = len ? len : 10
        const string = "abcdefghijklmnopqrstuvwxyz"
        const numeric = "0123456789"
        const punctuation = "!@#$&*?~"
        let password = ""
        let character = ""
        while (password.length < length) {
            const entity1 = Math.ceil(string.length * Math.random() * Math.random())
            const entity2 = Math.ceil(numeric.length * Math.random() * Math.random())
            const entity3 = Math.ceil(punctuation.length * Math.random() * Math.random())
            let hold = string.charAt(entity1)
            hold = password.length % 2 === 0 ? hold.toUpperCase() : hold
            character += hold
            character += numeric.charAt(entity2)
            character += punctuation.charAt(entity3)
            password = character
        }
        password = password
            .split("")
            .sort(() => 0.5 - Math.random())
            .join("")

        return password.substr(0, len)
    },
    randomString(length: number = 8): string {
        let result = ""
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        const charactersLength = characters.length
        for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength))

        return result
    },

    randomInt(length: number = 8): number {
        let result = ""
        const characters = "01234567899876543210"
        const charactersLength = characters.length
        for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength))

        return Number(result)
    },

    randomNumericString(len: number = 8): string {
        const length = len ? len : 10
        const string = "abcdefghijklmnopqrstuvwxyz"
        const numeric = "0123456789"
        let result = ""
        let character = ""
        while (result.length < length) {
            const entity1 = Math.ceil(string.length * Math.random() * Math.random())
            const entity2 = Math.ceil(numeric.length * Math.random() * Math.random())
            let hold = string.charAt(entity1)
            hold = result.length % 2 === 0 ? hold.toUpperCase() : hold
            character += hold
            character += numeric.charAt(entity2)
            result = character
        }
        result = result
            .split("")
            .sort(() => 0.5 - Math.random())
            .join("")

        return result.substr(0, len)
    },

    timeFormatter(seconds: string): string {
        const date = new Date(0)
        date.setSeconds(Number(seconds))

        return date.toISOString().substr(11, 8)
    },
    isNumeric(value: string): boolean {
        return /^[0-9]+$/.test(value)
    },
}

export default UTILS
