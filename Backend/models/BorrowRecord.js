// Backend/models/BorrowRecord.js
import mongoose from 'mongoose';

const borrowRecordSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  isReturned: { type: Boolean, default: false },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' } // link to request
}, { timestamps: true });

export default mongoose.model('BorrowRecord', borrowRecordSchema);
