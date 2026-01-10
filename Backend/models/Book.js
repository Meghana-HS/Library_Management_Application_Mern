// import mongoose from 'mongoose';
// const bookSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   author: String,
//   category: String,
//   isbn: String,
//   totalCopies: { type: Number, default: 1 },
//   availableCopies: { type: Number, default: 1 },
//   coverPath: String,
//   createdAt: { type: Date, default: Date.now }
// });
// export default mongoose.model('Book', bookSchema);


import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  category: String,
  isbn: String,
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  coverPath: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Book', bookSchema);
