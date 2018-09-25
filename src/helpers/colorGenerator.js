export default function colorGenerator() {
    let hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];

    function populate(a) {
        for ( let i = 0; i < 6; i++ ) {
            const x = Math.round( Math.random() * 14 );
            const y = hexValues[x];
            a += y;
        }
        return a;
    }

    let newColor1 = populate('#');
    let newColor2 = populate('#');

    return {
        startColorGradient: newColor1,
        stopColorGradient : newColor2
    }
}