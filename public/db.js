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
    console.log("Error", event.target.errorCode)
};


// function for saving the record from upgradeneeded event
function saveRec (record) {
    // pending read/write transaction from databse = transact
    const transact = db.transaction(["pending"], "readwrite")
    // function to store the pending transaction record
    const store = transact.objectStore("pending")
    // saving the pending objectStore record
    store.add(record)
};

// function to check the database for stored transaction records
function referenceDB () {
    const transact = db.transaction(["pending"], "readwrite")
    const store = transact.objectStore("pending")
    // getAll() method returns IDBRequest object containing all
    // objects in object store matching specified parameter OR
    // all objects in store if no parameters specified 
    const getAll = store.getAll()
    // get all object stores onsuccess event if result.length > 0
    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            // then fetch the bulk transactions pending
            // post getAll results via json stringify
            fetch("/api/transction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            // finally, clear the store of pending transactions once 
            // pending transactions are stored to database
            .then(() => {
                const transact = db.transaction(["pending"], "readwrite")
                const store = transact.objectStore("pending")
                store.clear()
            })
        }
    }
};

window.addEventListener("online", referenceDB);