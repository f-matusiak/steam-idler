const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

const sequelize = new Sequelize("sqlite:steam.db");

const Model = Sequelize.Model;
class User extends Model {}
User.init(
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: { isEmail: true },
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: Sequelize.STRING(255),
    steamLogin: Sequelize.STRING,
    steamPassword: Sequelize.STRING,
    confirmation: Sequelize.NUMBER,
    steamID64: Sequelize.STRING, //should be unique but need to set it to empty string at start!
    profileName: Sequelize.STRING,
    imageUrl: Sequelize.STRING,
    profileUrl: Sequelize.STRING,
    apps: Sequelize.JSON,
  },
  {
    sequelize,
    modelName: "User",
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.sync();

module.exports = User;
