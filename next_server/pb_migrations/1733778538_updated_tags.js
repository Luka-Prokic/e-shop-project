/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t5sd9k1q9tuzyqo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9jblyx4h",
    "name": "description",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t5sd9k1q9tuzyqo")

  // remove
  collection.schema.removeField("9jblyx4h")

  return dao.saveCollection(collection)
})
