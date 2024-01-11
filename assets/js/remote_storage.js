const STORAGE_TOKEN = 'TA7GJ1XH1MKBE4SSC2S3L43Q59O5BOFDC1V6FAIY';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
//key users

/**
 * Sets an item in the storage using a POST request.
 * 
 * @param {string} key - The key for the item.
 * @param {*} value - The value to be stored.
 * @returns {Promise} - A promise that resolves to the result of the fetch operation.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

/**
 * Retrieves an item from the storage using a GET request.
 * 
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise} - A promise that resolves to the result of the fetch operation.
 */

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}