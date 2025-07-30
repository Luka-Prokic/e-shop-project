/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9hgwk78dst84m54")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "whkxtcjw",
    "name": "user",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "4cm5dwt9p4p06pu",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9hgwk78dst84m54")

  // remove
  collection.schema.removeField("whkxtcjw")

  return dao.saveCollection(collection)
})
