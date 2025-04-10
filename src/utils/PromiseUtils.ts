
export default class PromiseUtils {
    //this functtion is used to delay the execution of a function for a given amount of time
    //it just make the code prettier
    static delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}