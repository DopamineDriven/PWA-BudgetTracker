let db;
// indexedDB.open() returns an IDBRequest object 
// opening database through three events:
// error, success, upgradeneeded
const request = indexedDB.open("budget", 1);

// upgradeneeded event
request.onupgradeneeded = (event) => {
    const db = event.target.result
    // creates new object store with given name and options
    // returns new IDBObjectStore
    db.createObjectStore("pending", { autoIncrement: true })
};

// success event
request.onsuccess = (event) => {
    db = event.target.result
    // if navigator is online, check the database
    if (navigator.onLine) {
        checkDatabase()
    }
};

// error event
request.onerror = (event) => {
    // console log "error" and the corresponding
    // error code for targeted event
    console.log("Error". event.target.errorCode)
};

function saveRec(record)