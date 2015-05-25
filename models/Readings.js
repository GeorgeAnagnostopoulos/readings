var mongoose=require('mongoose');

var ReadingSchema = mongoose.Schema({
    title: String,
    link: String,
    description: String,
    notes: String,
    tags: [{type: String}],
    dateInserted: {type: Date, default: Date.now}
});

mongoose.model('Reading', ReadingSchema);
