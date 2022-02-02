const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'audioexpress.sqlite'
});
exports.sequelize = sequelize;

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    steamid64: {
      type: DataTypes.INTEGER
    },
    steamid32: {
      type: DataTypes.INTEGER
    },
    locationid: {
      type: DataTypes.INTEGER
    },
    gamepassword: {
      type: DataTypes.STRING
    }
}, {
    // Other model options go here
});
exports.User = User;

const Song = sequelize.define('Song', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING
  },
  artist: {
    type: DataTypes.STRING
  },
  fullTitle: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.artist} - ${this.title}`;
    },
    set(value) {
      throw new Error('Do not try to set the `fullTitle` value!');
    }
  },
  musicbrainzid: {
    type: DataTypes.STRING
  }
}, {
  // Other model options go here
});
exports.Song = Song;

const Score = sequelize.define('Score', {
  rideid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  songid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  leagueid: {
    type: DataTypes.INTEGER
  },
  trackshape: {
    type: DataTypes.TEXT
  },
  xstats: {
    type: DataTypes.TEXT
  },
  density: {
    type: DataTypes.INTEGER
  },
  vehicleid: {
    type: DataTypes.INTEGER
  },
  score: {
    type: DataTypes.INTEGER
  },
  ridetime: {
    type: DataTypes.INTEGER
  },
  feats: {
    type: DataTypes.STRING
  },
  songlength: {
    type: DataTypes.INTEGER
  },
  trafficcount: {
    type: DataTypes.INTEGER
  },
  goldthreshold: {
    type: DataTypes.INTEGER
  },
  iss: { 
    type: DataTypes.INTEGER
  },
  isj: {
    type: DataTypes.INTEGER
  }
}, {
  // Other model options go here
});
exports.Score = Score;

//Song.hasMany(Score, { foreignKey: 'songid' });
//Score.belongsTo(Song);

(async function() {
  await User.sync();
  await Song.sync();
  await Score.sync();
})();