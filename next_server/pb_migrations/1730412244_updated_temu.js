/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("983io0h3c2581h0")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_2cjFRDI` ON `temu` (\n  `name`,\n  `description`,\n  `image`,\n  `price`,\n  `discount`,\n  `created`,\n  `updated`\n)"
  ]

  // remove
  collection.schema.removeField("3qnpljnv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8rm3cnyy",
    "name": "name",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ui2sewox",
    "name": "image",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d1muclyf",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5syqprft",
    "name": "price",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rv0n4wpm",
    "name": "discount",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("983io0h3c2581h0")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_2cjFRDI` ON `temu` (\n  `updated`,\n  `created`,\n  `product`\n)"
  ]

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // remove
  collection.schema.removeField("8rm3cnyy")

  // remove
  collection.schema.removeField("ui2sewox")

  // remove
  collection.schema.removeField("d1muclyf")

  // remove
  collection.schema.removeField("5syqprft")

  // remove
  collection.schema.removeField("rv0n4wpm")

  return dao.saveCollection(collection)
})
