const STORAGE_TOKEN = 'TA7GJ1XH1MKBE4SSC2S3L43Q59O5BOFDC1V6FAIY';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
//key users

async function setItem(key, value) {
    console.log("setItemCalled");
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

async function getItem(key) {
    console.log("getItemCalled");
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}