/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.indexes = [
    "CREATE INDEX `idx_PUR2Gun` ON `users` (\n  `user_username`,\n  `user_email`,\n  `phone`,\n  `user_password`,\n  `avatar`,\n  `address`,\n  `created`,\n  `updated`\n)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vggeaxci",
    "name": "user_username",
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
    "id": "rq20rfdz",
    "name": "user_email",
    "type": "email",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0puc2qvv",
    "name": "user_password",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 8,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.indexes = []

  // remove
  collection.schema.removeField("vggeaxci")

  // remove
  collection.schema.removeField("rq20rfdz")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0puc2qvv",
    "name": "Password",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 8,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
