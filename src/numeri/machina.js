const dom = {
    responsum: document.querySelector('.responsum'),
    numerus: document.querySelector('.numerus'),
    bullaVerumne: document.querySelector('.bulla.verumne'),
    bullaNescio: document.querySelector('.bulla.nescio'),
    bullaNovumNumerum: document.querySelector('.bulla.novum-numerum'),
    indicium: document.querySelector('.indicium'),
}

let condiciones = condicionesFacere()

const MINIMUM = 1
const MAXIMUM = 1999

function princepesCondiciones() {
    return {
        numerus: 1,
        // arabicus verbae romanicus
        ab: 'arabicus',
        ad: 'verbae',
    }
}

function condicionesFacere() {
    let prioresCondiciones
    try {
        prioresCondiciones = localStorage.getItem('condiciones')
    }
    catch (error) {
        return princepesCondiciones()
    }

    if (prioresCondiciones) {
        return JSON.parse(prioresCondiciones)
        
    }
    else {
        return princepesCondiciones()
    }
}

const formae = ['arabicus', 'verbae', 'romanicus']

const KEY_ENTER = 13
const KEY_ESC = 27

function quidquidIntegerNumerus(initium, finis) {
    return Math.floor(Math.random() * (finis - initium + 1)) + initium;
}

function arabicoRomanicum(arabicus) {
    const tabula = {
        M : 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
    }
    let romanicus = ""

    for (let digitus in tabula) {
        while (arabicus >= tabula[digitus]) {
            romanicus += digitus
            arabicus -= tabula[digitus]
        }
    }
    return romanicus
}

// partem(12345, 1)    ===  40
// partem(12345, 1, 2) === 340
function partem(numerus, minimum, maximum) {
    if (typeof maximum === 'undefined') {
        maximum = minimum + 1
    }
    return (numerus % Math.pow(10, maximum)) - (numerus % Math.pow(10, minimum))
}

function arabicoVerbas(numerus, data) {
    if (!data) {
        data = window.exercitia.data
    }
    if (numerus <= 20) {
        // ut 8 aut 14
        return data['1'][numerus - 1]
    }
    else if (numerus % 10 === 0 && numerus < 100) {
        // ut 70
        return data['10'][numerus / 10 - 1]
    }
    else if (numerus % 10 === 8 && numerus < 100 - 2) {
        // ut 88, non 88
        return 'duodē' + arabicoVerbas(numerus + 2, data)
    }
    else if (numerus % 10 === 9 && numerus < 100 - 1) {
        // ut 39, non 99
        return 'ūndē' + arabicoVerbas(numerus + 1, data)
    }
    else if (numerus % 100 === 0 && numerus <= 1000) {
        // ut 700
        return data['100'][numerus / 100 - 1]
    }
    else if (numerus < 2000) {
        // Numerus compostus
        const digiti = String(numerus).length
        return [
            arabicoVerbas(partem(numerus, digiti - 1), data),
            arabicoVerbas(partem(numerus, 0, digiti - 1), data),
        ].join(' ')
    }
}

function arabicoFormam(arabicus, forma) {
    switch (forma) {
        case 'arabicus': {
            return String(arabicus)
        }
        case 'verbae': {
            return arabicoVerbas(arabicus)
        }
        case 'romanicus': {
            return arabicoRomanicum(arabicus)
        }
        default: {
            console.error(`Forma ignota: ${forma}`)
            return String(arabicus)
        }
    }
}

// DOM

function verificare() {
    const responsum = dom.responsum.innerText
    const veritas = arabicoFormam(condiciones.numerus, condiciones.ad)
    if (responsum.toLowerCase() === veritas.toLowerCase()) {
        dom.indicium.innerHTML = 'Vērum!'
    }
    else {
        dom.indicium.innerHTML = 'Nōn vērum est. Cōnāre iterum?'
    }
}

dom.bullaVerumne.onclick = verificare
dom.responsum.onkeypress = (event) => {
    if (event.charCode === KEY_ENTER) {
        event.preventDefault()
        verificare()
    }
}

function nescio() {
    dom.indicium.innerHTML = arabicoFormam(condiciones.numerus, condiciones.ad)
    dom.bullaNovumNumerum.style.display = 'inline-block'
}

dom.bullaNescio.onclick = nescio
document.body.onkeydown = (event) => {
    if (event.keyCode === KEY_ESC) {
        nescio()
    }
}

function modosPingere() {
    ;[].slice.apply(document.querySelectorAll(`.arca-modi span`))
    .map(node => node.classList.remove('illustrans'))

    document.querySelector(`.ab span.${condiciones.ab}`).classList.add('illustrans')
    document.querySelector(`.ad span.${condiciones.ad}`).classList.add('illustrans')
}

function numerumPingere() {
    switch (condiciones.ab) {
        case 'arabicus': {
            dom.numerus.innerHTML = condiciones.numerus
            break
        }
        case 'verbae': {
            dom.numerus.innerHTML = arabicoVerbas(condiciones.numerus)
            break
        }
        case 'romanicus': {
            dom.numerus.innerHTML = arabicoRomanicum(condiciones.numerus)
            break
        }
    }
}

function aliumPingere() {
    dom.responsum.innerHTML = ''
    dom.indicium.innerHTML = ''
    dom.bullaNovumNumerum.style.display = 'none'
}

function pigere() {
    modosPingere()
    numerumPingere()
    aliumPingere()

    try {
        localStorage.setItem('condiciones', JSON.stringify(condiciones))
    }
    catch (error) {}
}

function novumExercitiumFacere() {
    condiciones.numerus = quidquidIntegerNumerus(MINIMUM, MAXIMUM)
    pigere()
}

function formam(className) {
    const regex = className.match(/arabicus|verbae|romanicus/)
    return regex ? regex[0] : regex
}

function modum(className) {
    const regex = className.match(/ab|ad/)
    return regex ? regex[0] : regex
}

function contra(directio) {
    if (directio === 'ad') {
        return 'ab'
    }
    else {
        return 'ad'
    }
}

function secunda(forma) {
    for (let formaSecunda of formae) {
        if (formaSecunda !== forma) {
            return formaSecunda
        }
    }
    return formae[0]
}

for (let node of document.querySelectorAll('.arca-modi')) {
    node.onclick = (event) => {
        const modus = modum(event.currentTarget.className)
        const forma = formam(event.target.className)
        if (modus && forma) {
            condiciones[modus] = forma
            if (condiciones[contra(modus)] === forma) {
                condiciones[contra(modus)] = secunda(forma)
            }
            pigere()
        }
    }
}

dom.bullaNovumNumerum.onclick = novumExercitiumFacere

novumExercitiumFacere()
dom.responsum.focus()