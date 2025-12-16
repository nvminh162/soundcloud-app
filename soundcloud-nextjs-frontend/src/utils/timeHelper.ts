export const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secondsRemainder = Math.round(seconds) % 60
    const paddedSeconds = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
}