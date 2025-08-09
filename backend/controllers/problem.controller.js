const Problem = require('../models/Problem');

// ➕ Create Problem (Admins only)
const createProblem = async (req, res) => {
  try {
    const problem = new Problem({
      ...req.body
    });
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    console.error('❌ Error while creating problem:', err);
    res.status(500).json({ message: 'Error creating problem' });
  }
};

// 📃 Get All Problems (Public)
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problems' });
  }
};

// 📄 Get One Problem (Optional – if you want this route)
const getOneProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problem' });
  }
};

// ✏️ Update Problem (Admins only)
const updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating problem' });
  }
};

// ❌ Delete Problem (Admins only)
const deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting problem' });
  }
};

// Export all controller functions
module.exports = {
  createProblem,
  getAllProblems,
  getOneProblem,
  updateProblem,
  deleteProblem
};
