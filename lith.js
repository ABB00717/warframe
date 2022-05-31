const { relic } = require('./relic')


class lith{
    constructor(name, g, s1, s2, b1, b2, b3) {
        this.name = name
        this.times = 0
        this.relics = [
            new relic(g, "rare"),
            new relic(s1, "uncommon"),
            new relic(s2, "uncommon"),
            new relic(b1, "common"),
            new relic(b2, "common"),
            new relic(b3, "common")
        ]
    }
}


module.exports.lith = lith