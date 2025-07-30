/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "983io0h3c2581h0",
    "created": "2024-10-31 22:01:43.079Z",
    "updated": "2024-10-31 22:01:43.079Z",
    "name": "temu",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "3qnpljnv",
        "name": "product",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_2cjFRDI` ON `temu` (\n  `updated`,\n  `created`,\n  `product`\n)"
    ],
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
  const collection = dao.findCollectionByNameOrId("983io0h3c2581h0");

  return dao.deleteCollection(collection);
})
