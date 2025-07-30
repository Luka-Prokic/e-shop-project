/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9hgwk78dst84m54",
    "created": "2024-11-19 19:09:30.316Z",
    "updated": "2024-11-19 19:09:30.316Z",
    "name": "carts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ccii5lkc",
        "name": "bought_products",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "av2o2uud",
        "name": "time_of_buying",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "5rluej31",
        "name": "sum_of_bought_products",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9hgwk78dst84m54");

  return dao.deleteCollection(collection);
})
