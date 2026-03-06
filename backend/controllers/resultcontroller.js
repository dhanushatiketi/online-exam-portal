const Result = require("../models/Result");

exports.getResult = async (req, res) => {
    try {
        const { email } = req.params;
        const result = await Result.findOne({ email }).sort({ submittedAt: -1 });

        if (!result) {
            return res.status(404).json({ message: "No result found for this user." });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
