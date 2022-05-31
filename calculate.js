let { transform, liths } = require('./transFdata')  
/*  transform 用來初始化遺物(將data轉成遺物陣列)，liths就是遺物陣列
    因為執行的是這個檔案，要在這裡執行才能
*/

//"good" "flawless" "brilliance"
const priority = "good" //設定優先升級
const detail = false    //設定是否在運算完後log出整個liths

transform()
let voidTraces = 0, upgrade = "complete" //儲存光體跟

let relicList = [{name: "", times: 0, rarity: "", source: ""}]  //獨立紀錄每個的裝備的名稱、次數、稀有度、來源

let got = ""    //已經得到的裝備，用於檢測一個遺物的裝備是否都被開過
let total = 0   //總開遺物次數


for(let i = 0; i < liths.length; i++) {
    let check = true    //是否繼續開(沒有集齊)
    let limit = 6       //需要開到的裝備數，因Forma Blueprint不是裝備，當遺物裡可以開到Forma Blueprint則不列入計算
    for(let l = 0; l < 6; l++) {
        if(liths[i].relics[l].name === "Forma Blueprint") { //若為Forma Blueprint則不計數
            limit = 5
        }

    }
    while(check) {
        total++
        /* voidTraces =  */randomWithVoidTraces(liths[i])
        let count = isCollectAll(liths[i])
        check = !(count === limit)
        voidTraces += randomInt(6, 25)
        voidTraces = 0;
    }
    // console.log(voidTraces)
}


if(detail) {    //逐項log出liths
    for(let i = 0; i < liths.length; i++) {
        console.log(liths[i])    
    }
}

let mostCenturyTimes = 0, mostCentury = ""  //開最多次的遺物
let mostRelic = {name: "", times: 0, source: "", rarity: ""} //開到最多次的遺物
let centuryAverage, objectAverage   //遺物/裝備開/開到的平均次數
let wieryObject //奇怪欸

findMostCentury()
findMostRelic()
centuryAve()
objectAve()
somethingWiery()

console.log(`
共抽了: ${total}次`
)
console.log(`
最多次裝備:
        名稱:   ${mostRelic.name}
        次數:   ${mostRelic.times}
        稀有度: ${mostRelic.rarity}
        來自:   ${mostRelic.source}`
)
console.log(`
最多次遺物:
        名稱:   ${mostCentury}
        次數:   ${mostCenturyTimes}`
)
console.log(`
平均次數:
        遺物:   ${centuryAverage}
        裝備:   ${objectAverage}`
)
console.log(`
怪東西:
    超過兩次的稀有: ${wieryObject}`
)

//因應光體可以提升開到銀賞、金賞的機率，以及使用光的策略
function randomWithVoidTraces(century) {
    const randon = Math.random()*99.999999
    //檔案最上方有儲存priority，對應到option的數值
    const option = {
        "good": 25,
        "flawless": 50,
        "brilliance": 100
    }
    //根據priority及option，使用光體
    if(voidTraces > option[priority]) {
        voidTraces -= option[priority]
        upgrade = priority
    }
    //銅賞、銀賞、金賞在不同等級下的機率
    const gold = {
        "complete": 2,
        "good": 4,
        "flawless": 6,
        "brilliance": 10
    }
    const silver = {
        "complete": 11,
        "good": 13,
        "flawless": 17,
        "brilliance": 20
    }
    const bronze = {
        "complete": 25.33,
        "good": 23.33,
        "flawless": 20.0,
        "brilliance": 16.66
    }
    //計算各裝備的機率
    const rarity = [
        99.99-gold[upgrade],
        99.99-gold[upgrade]-silver[upgrade],
        99.99-gold[upgrade]-silver[upgrade]*2,
        99.99-gold[upgrade]-silver[upgrade]*2-bronze[upgrade],
        99.99-gold[upgrade]-silver[upgrade]*2-bronze[upgrade]*2,
    ]
    if(randon > rarity[0]) {
        recordRelic(century.relics[0], century.name)
    } else if(randon > rarity[1]) {
        recordRelic(century.relics[1], century.name)
    } else if(randon > rarity[2]) {
        recordRelic(century.relics[2], century.name)
    } else if(randon > rarity[3]) {
        recordRelic(century.relics[3], century.name)
    } else if(randon > rarity[4]) {
        recordRelic(century.relics[4], century.name)
    } else {
        recordRelic(century.relics[5], century.name)
    }
    recordCentury(century)  //紀錄遺物
    upgrade = "complete"    //使用掉光體升級，還原成完整
}

//確認是裝備是否集齊
function isCollectAll(century) {
    let count = 0
    for(let i = 0; i < 6; i++) {
        if(got.includes(century.relics[i].name)) {
            if(century.relics[i].name != "Forma Blueprint") 
                count++
        }
    }
    return count
}

//紀錄遺物開出的裝備的名稱、次數、稀有度、來源
function recordRelic(relic, source) {
    relic.times++
    if(!got.includes(relic.name)) {
        got = got.concat(', ', relic.name)
    }

    let shouldAdd = true
    const todo = relicList.length
    for(let i = 0; i < todo; i++) {
        if(relicList[i].name === relic.name) {
            relicList[i].times++
            // console.log(relicList[i].times)
            if(!relicList[i].source.includes(source)) {
                relicList[i].source = relicList[i].source.concat(", ", source)
            }
            shouldAdd = false
            break
        }
    }
    
    // if(addCount == todo) shouldAdd = true

    if(shouldAdd) {
        relicList.push({
            name: relic.name,
            times: 1,
            rarity: relic.rarity,
            source: source
        })
    }
}

//紀錄遺物
function recordCentury(century) {
    century.times++
}

//找出開最多次的遺物
function findMostCentury() {
    mostCenturyTimes = 0
    mostCentury = ""
    liths.map(century => {
        if(century.times > mostCenturyTimes) {
            mostCenturyTimes = century.times
            mostCentury = century.name
        }
    })

}

//找出開到最多次的裝備
function findMostRelic() {
    // let most = 0
    let todo = relicList.length
    
    for(let i = 0; i < todo; i++) {
        if(mostRelic.times < relicList[i].times) {
            mostRelic = relicList[i]
        }
    }
}

//計算平均開多少次可以集齊一個遺物的所有裝備
function centuryAve() {
    let centuryTotal = 0.0
    liths.map(century => {
        centuryTotal += century.times
    })
    centuryAverage = centuryTotal/liths.length
}

//計算平均開幾次可以收集一個新裝備
function objectAve() {
    let objectTotal = 0.0
    liths.map(century => {
        century.relics.map(object => {
            objectTotal += object.times
        })
    })
    objectAverage = objectTotal/(liths.length*6)
}

//找到開出超過一次的金賞
function somethingWiery() {
    wieryObject = []
    liths.map(century => {
        if(century.relics[0].times > 1 && century.relics[0].name !== "Forma Blueprint") {
            wieryObject.push(century.relics[0].name)
        }
    })
}

//產生隨機整數(可選範圍，ex:randomInt(6, 25)，則產生6~25的整數)
function randomInt(min, max) {
    return Math.floor((max - min + 1) * Math.random()) + min
}