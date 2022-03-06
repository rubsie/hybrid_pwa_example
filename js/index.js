console.log("run index.js");


const POKEMON_DATA = [
    {id: 113, name: "chansey", type: "normal"},
    {id: 202, name: "wobbuffet", type: "psychic"},
    {id: 289, name: "slaking", type: "normal"},
    {id: 376, name: "metagross", type: "steel/psychic"},
    {id: 862, name: "obstagoon", type: "dark/normal"}];

const alertElem = document.getElementById("alert_div");
const imgElem = document.getElementById("pokemon_img");
const pokemonIdElem = document.getElementById("pokemon_id");
const pokemonNameElem = document.getElementById("pokemon_name");
const typeElem = document.getElementById("pokemon_type");


let currentPokemonIndex = -1;
showNextPokemon();

function showNextPokemon() {
    currentPokemonIndex = currentPokemonIndex < POKEMON_DATA.length - 1 ? currentPokemonIndex + 1 : 0;
    const pokemonToShow = POKEMON_DATA[currentPokemonIndex];
    imgElem.src = `images/${pokemonToShow.id}.png`;
    pokemonIdElem.innerText = pokemonToShow.id;
    pokemonNameElem.innerText = pokemonToShow.name;
    typeElem.innerText = pokemonToShow.type;
}

async function clearCache() {
    const keys = await caches.keys();
    keys.map(key => caches.delete(key))
}

let serviceWorkerRegistration;

async function requestVersionFromServiceWorker() {
    console.log("requesting version from service worker")
    serviceWorkerRegistration.active?.postMessage({command: "REQUEST_VERSION"})
}

navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('@@@ version: ' + event.data.payload)
    if (event.data.command == "RESPONSE_VERSION") {
        document.getElementById('serviceWorkerVersion').innerText = event.data.payload
    } else console.log('@@@ Wrong message')
})

// Register service worker to control making site work offline
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        console.log("start registering Service Worker");
        serviceWorkerRegistration = await navigator.serviceWorker.register('service_worker.js');
        console.log('registration Service Worker done');
        await requestVersionFromServiceWorker();
        //check if a new serviceworker is waiting
        if (await serviceWorkerRegistration.waiting && await serviceWorkerRegistration.active) {
            navigator.serviceWorker.controller.postMessage({command: "SKIP_WAITING"})
        }
    } else {
        console.log("geen Service Worker mogelijk in deze browser");
    }

}

registerServiceWorker();



