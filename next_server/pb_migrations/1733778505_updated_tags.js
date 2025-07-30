/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t5sd9k1q9tuzyqo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rbnbybjv",
    "name": "special",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t5sd9k1q9tuzyqo")

  // remove
  collection.schema.removeField("rbnbybjv")

  return dao.saveCollection(collection)
})
