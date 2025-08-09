const mongoose= require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: {
        type:String,
        required: true
    },
    output: {
        type: String,
        required: true
    }
});

const problemSchema = new mongoose.Schema({
   title:{
    type:String,
    required: true

   },
   description:{
    type: String,
    required: true
   },
   difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
   },
   sampleTestCases: [testCaseSchema],
   judgeTestCases: [testCaseSchema],

});

module.exports = mongoose.model("Problem", problemSchema);
