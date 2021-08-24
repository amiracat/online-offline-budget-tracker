export function checkForIndexedDb() {
    if (!window.indexedDB) {
      console.log("Your browser doesn't support a stable version of IndexedDB.");
      return false;
    }
    return true;
  };
  
export function useIndexedDb(databaseName, storeName, method, object) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(databaseName, 1);
        let db,
            tx,
            store;

        request.onupgradeneeded = function (e) {
            const db = request.result;
            db.createObjectStore(storeName, {
                keyPath: "_id"
            });
        };

        request.onerror = function (e) {
            console.log("There was an error");
        };

        request.onsuccess = function (e) {
            db = request.result;
            tx = db.transaction(storeName, "readwrite");
            store = tx.objectStore(storeName);

            db.onerror = function (e) {
                console.log("error");
            };
            if (method === "put") {
                store.put(object);
            }
            if (method === "clear") {
                store.clear();
            }
            if (method === "get") {
                const all = store.getAll();
                all.onsuccess = function () {
                    resolve(all.result);
                };
            }
            tx.oncomplete = function () {
                db.close();
            };
        };
    });
};