'use strict'

const { Schema, Types, model } = require('mongoose')
const DOCUMENT_NAME = 'Inventory'       //Convention Mongoose: Model name viết PascalCase & singular.
const COLLECTION_NAME = 'inventories'

const inventorySchema = new Schema({
    inven_productId: { type: Types.ObjectId, ref: 'product' },
    inven_location: { type: String, default: 'Unknow' },
    inven_stock: { type: Number, required: true},
    inven_shopId: { type: Types.ObjectId, ref: 'Shop'},
    inven_reservations: { type: Array, default: []}
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = {
    Inventory: model(DOCUMENT_NAME, inventorySchema)
}


