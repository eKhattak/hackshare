const { expertiseDB, userDB } = require("../model");
const Joi = require("@hapi/joi");

exports.getAllExpertise = async (req, res) => {
  try {
    let expertise = await expertiseDB.find().populate("user_id");
    res.status(200).json({
      msg: expertise,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server Error!",
    });
  }
};

exports.getUserExpertise = async (req, res) => {
  const user_id = req.params.user_id;

  try {
    let expertise = await expertiseDB.find({ user_id: user_id });
    res.status(200).json({
      msg: expertise,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server Error!",
    });
  }
};

exports.addExpertise = async (req, res) => {
  const { sub } = req.user;
  const { topic } = req.body;

  const schema = Joi.object().keys({
    topic: Joi.string().required(),
  });

  // Schema Validation
  try {
    await schema.validateAsync({
      topic,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      error: error.message,
    });
  }

  try {
    const user = await userDB.findOne({ auth0Ref: sub });
    if (!user) {
      return res.status(404).json({
        msg: "User not Found!",
      });
    }

    const newExpertise = new expertiseDB({
      user_id: user._id,
      topic,
      auth0Ref: sub,
    });
    await newExpertise.save();

    return res.status(200).json({
      msg: "Expertise Added",
      responseData: newExpertise,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server Error!",
    });
  }
};

exports.updateExpertise = async (req, res) => {
  const { sub } = req.user;
  const { topic } = req.body;

  const schema = Joi.object().keys({
    // topic is Require and must be String
    topic: Joi.string().required(),
  });

  // Schema Validation
  try {
    await schema.validateAsync({
      topic,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      error: error.message,
    });
  }

  try {
    let expertise = await expertiseDB.findOneAndUpdate(
      {
        _id: expertise_id,
        auth0Ref: sub,
      },
      {
        $set: {
          topic,
        },
      },
      {
        new: true,
      }
    );

    if (!expertise) {
      return res.status(404).json({
        msg: "Expertise not Found!",
      });
    }

    return res.status(200).json({
      msg: "Expertise Updated",
      responseData: expertise,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Server Error!",
    });
  }
};

exports.removeExpertise = async (req, res) => {
  const { sub } = req.user;
  const { id } = req.params;

  const schema = Joi.object().keys({
    id: Joi.string().required(),
  });

  // Schema Validation
  try {
    await schema.validateAsync({
      id,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      error: error.message,
    });
  }

  try {
    const expertise = await expertiseDB.findOneAndDelete({
      _id: id,
      auth0Ref: sub,
    });

    if (!expertise) {
      return res.status(404).json({
        msg: "Expertise not Found!",
      });
    }

    return res.status(200).json({
      msg: "Expertise Removed",
      responseData: expertise,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Server Error!",
    });
  }
};
