var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var documentSchema = new Schema ({
  ownerId: {
    ref: 'User',
    type: Schema.Types.ObjectId
  },
  title: {
    type: String,
    unique: true,
    required: true
  },
  accessLevel: {
    type: String,
    required: true,
    default: 'public'
  },
  content: String,
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  }
},{ timestamps: {createdAt: 'createdAt', updatedAt: 'modifiedAt'} });

var Document = mongoose.model('Document', documentSchema);

module.exports = Document;
