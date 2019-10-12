const warnIf = (condition: boolean, message: string) => {
    if (condition) {
        console.warn(message)
    }
}

export default warnIf;
