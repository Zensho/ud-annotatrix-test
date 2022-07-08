"use strict";

if (!window.indexedDB) {
    console.log(`Your browser doesn't support IndexedDB`);
}
else{
    console.log('Supported');
}


const request = indexedDB.open('UDA', 3);

request.onerror = (event) => {
    console.error(`Database error: ${event.target.errorCode}`);
};

 request.onupgradeneeded = (event) => {
     let db = event.target.result;

     // Object store with auto-increment id
     let store = db.createObjectStore('Corpus', {
         autoIncrement: true
     });

     // property 'sentid', or sentence id, as index
     let index = store.createIndex('sentid', 'sentid', {
         unique: true
     });
 };

function insertCorpus(db, corpus) {
    // create a new transaction
    const txn = db.transaction('Corpus', 'readwrite');

    // get the Corpus object store
    const store = txn.objectStore('Corpus');
    //
    let query = store.put(corpus);

    // handle success case
    query.onsuccess = function (event) {
        console.log(event);
    };

    // handle the error case
    query.onerror = function (event) {
        console.log(event.target.errorCode);
    }

    // close the database once the
    // transaction completes
    txn.oncomplete = function () {
        db.close();
    };
}

function getSentencebyID(db, sentid) {
    const txn = db.transaction('Corpus', 'readonly');
    const store = txn.objectStore('Corpus');

    // get the index from the Object Store
    const index = store.index('sentid');
    // query by indexes
    let query = index.get(sentid);

    // return the result object on success
    query.onsuccess = (event) => {
        console.log(query.result); // result objects
    };

    query.onerror = (event) => {
        console.log(event.target.errorCode);
    }

    // close the database connection
    txn.oncomplete = function () {
        db.close();
    };
}

function saveEntry(db, value){
    value = JSON.stringify(value);
    sentid = '' + funcs.getTreebankId()
    insertCorpus(db, {sentid: sentid, text: value})
}

function getEntry(db, sentid){
    sent = getSentencebyID(db, sentid).text
    return JSON.parse(sent)
}


function loadEntry(d)
request.onsuccess = (event) => {
     const db = event.target.result;

     insertCorpus(db, {
         sentid: '1',
         text: 'i would like the cheapest flight from pittsburgh to atlanta leaving april twenty fifth and returning may sixth',
     });

     insertCorpus(db, {
         sentid: '2',
         text: 'i want a flight from memphis to seattle that arrives no later than 3 pm',
     });

     insertCorpus(db, {
         sentid: '' + funcs.getTreebankId(),
         text: 'i want a flight from memphis to seattle that arrives no later than 3 pm',
     });
};
