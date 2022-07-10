export function convertMillistoMinsSecs(milliseconds: number) {
    const mins = Math.floor(milliseconds/60000);
    const secs = Number(((milliseconds%60000) / 1000).toFixed(0));
    
    return secs == 60 ? 
    mins + 1 + ":00" : 
    mins + 1 + ":" + (secs < 10 ? "0" : "") + secs;
}