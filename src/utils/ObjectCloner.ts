export default class ObjectCloner {
    //utiulity function to clone an object and override some of its properties
    static clone<T>(config: T, overrider?: T | any): T {
        if (overrider) {
            const clone = { ...config } as T;
            for (const key in overrider) {
                if (overrider[key as keyof T] || overrider[key as keyof T] == 0) {
                    clone[key as keyof T] = overrider[key as keyof T];
                }
            }

            return clone as T;
        }
        return { ...config } as T
    }
}