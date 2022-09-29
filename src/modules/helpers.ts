export class Getters {
    static get isProduction (): boolean {
        return process.env.NODE_ENV === 'production'
    }
 }