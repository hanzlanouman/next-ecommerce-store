export const filterFormikErrors= <T extends object> (
    errors: T,
    touched: {[key:string] : boolean},
    value: T
) : string [] =>{
    const touchedKeys = Object.entries(touched).map(([key, value]) => {
        return value ? key : null
    })
    console.log(touchedKeys)
    
    const finalErrors: string[] = []
    
    Object.entries(errors).forEach(([key, value]) => {
        if (
            touchedKeys.includes(key) && value
        ) {
            finalErrors.push(value)
        }
    })
    
    return finalErrors
}