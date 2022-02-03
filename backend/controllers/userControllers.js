const User = require("../models/User.js");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const config = require("../config/config");


async function signup(req, res) {
  const { password, email, company, sector } = req.body;
  if (!email || !password || !company || !sector) {
    // Case where the email or pw was not submitted (or are null)
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  // Creation of a user object, in which we hash the pw
  const user = {
    email,
    password: passwordHash.generate(password),
    company,
    sector,
    isAdmin: false,
  };
  // We check in the db if the user already exists
  try {
    const foundUserEmail = await User.findOne({
      email
    });
    if (foundUserEmail) {
      return res.status(400).json({
        text: "Email existe déjà"
      });
    }
    const foundUserCompany = await User.findOne({
        company
      });
      if (foundUserCompany) {
        return res.status(400).json({
          text: "Utilisateur existe déjà"
        });
      }
  } catch (error) {
    return res.status(500).json({ error });
  }
  try {
    // We save the user in the db
    var userData = new User(user);
    const userObject = await userData.save();
    return res.status(201).json({
      text: "Succès",
      token: jwt.sign(
        { 
          userId: userObject._id,
        }, 
        config.secret
      ),                    
      userInfo: {
        id: userObject._id, 
        company: userObject.company, 
        sector: userObject.sector,
        isAdmin: userObject.isAdmin,
        email: userObject.email
      }
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error });
  }
}



async function login(req, res) {
  const { password, email } = req.body;
  if (!email || !password) {
    // Case where the email or pw was not submitted (or are null)
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    // We check in the db if the user already exists
    const foundUser = await User.findOne({ email });
    if (!foundUser){
      return res.status(404).json({
        text: "L'utilisateur n'existe pas"
      });
    }
    if (!passwordHash.verify(password, foundUser.password)){
      return res.status(401).json({
        text: "Mot de passe incorrect"
      });
    }
    return res.status(200).json({
      token: jwt.sign(
        { 
          userId: foundUser._id,
        }, 
        config.secret
      ),
      text: "Authentification réussie",
      userInfo: {
        id: foundUser._id, 
        sector: foundUser.sector,
        company: foundUser.company,
        email: foundUser.email, 
        isAdmin: foundUser.isAdmin
      }
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error
    });
  }
}


async function editProfile(req, res) {
  const { id, email, company, password, sector } = req.body;

  if (!email || !password || !company || !sector) {
    // Case where the email or pw was not submitted (or are null)
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    // we check if the user, when mofidying its account, does not copy an already existing one
    const foundUserEmail = await User.findOne({
      email
    });
    if (foundUserEmail && String(foundUserEmail._id) !== id) {
      return res.status(400).json({
        text: "Email existe déjà"
      });
    }
    const foundUserCompany = await User.findOne({
      company
    });
    if (foundUserCompany && String(foundUserCompany._id) !== id) {
      return res.status(400).json({
        text: "Utilisateur existe déjà"
      });
    }
    // update phase
    await User.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          sector,
          company,
          email,
          sector,
          password: passwordHash.generate(password),
        }
      }
    )
    return res.status(200).json({
        text: "Profil mis à jour"
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      text: error
    });
  }
}


async function getUser(req, res) {
  const token = req.query.token;
  try {
    const decrypted = jwt.verify(token, config.secret);
    const user = await User.findById(decrypted.userId);
    const userInfo = {
      id: user._id,
      company: user.company,
      email: user.email,
      sector: user.sector,
      isAdmin: user.isAdmin
    };
    return res.status(200).json(userInfo)
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error
    })
  }
}



exports.login = login;
exports.signup = signup;
exports.editProfile = editProfile;
exports.getUser = getUser;