/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("983io0h3c2581h0")

  // remove
  collection.schema.removeField("dipuguut")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zuk3dmku",
    "name": "tags",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("983io0h3c2581h0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dipuguut",
    "name": "tags",
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

  // remove
  collection.schema.removeField("zuk3dmku")

  return dao.saveCollection(collection)
})
