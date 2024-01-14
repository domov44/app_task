const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const requestsByIp = {}
require('dotenv').config();
const blacklistPath = path.join(__dirname, 'blacklist.json');

const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", true)
app.use(fileUpload());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'app_task',
});

// anti spam selon ip
function spamMiddleware(req, res, next) {
  if (!(req.ip in requestsByIp)) {
    next();
  } else {
    if (Date.now() - requestsByIp[req.ip] < 2000) {
      res.status(429).json({ redirectTo: '/erreur-429' });
    } else {
      next();
    }
  }
  requestsByIp[req.ip] = Date.now();
}


// vérifier le token JWT
const verifyJwt = (req, res, next) => {
  const token = req.headers["access-token"];
  if (!token) {
    return res.json("we need token please provide it for next time");
  } else {
    const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey';

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.locals.success = false;
        res.json("Not authenticated");
      } else {
        res.locals.success = true;
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
      }
    });
  }
};

function AdminMiddleware(req, res, next) {
  if (req.userRole === 1) {
    next();
  } else {
    res.status(403).json({ error: 'Accès interdit. Vous n\'avez pas les permissions nécessaires.' });
  }
}


// Middleware pour bloquer les adresses IP
function ipBlacklistMiddleware(req, res, next) {

  if (req.path === '/addBlacklistIp' && req.method === 'POST') {
    // Si la requête est pour ajouter une IP, passer à la nouvelle route
    next();
  } else {
    fs.promises.readFile(blacklistPath, 'utf-8')
      .then(data => {
        let blacklist;

        try {
          blacklist = JSON.parse(data);
        } catch (parseError) {
          console.error('Erreur lors de l\'analyse de la liste noire :', parseError);
          blacklist = [];
        }

        const clientIp = req.ip;
        const isBlacklisted = blacklist.some(entry => entry.ip === clientIp);

        if (isBlacklisted) {
          // Adresse IP bloquée
          return res.status(403).json({ error: 'Accès interdit depuis cette adresse IP.' });
        } else {
          // Adresse IP non bloquée, continuer
          next();
        }
      })
      .catch(err => {
        if (err.code === 'ENOENT') {
          // Le fichier n'existe pas, on le crée
          console.log('Création du fichier blacklist.json avec une liste noire vide.');
          fs.promises.writeFile(blacklistPath, '[]', 'utf-8')
            .then(() => next()) // Continuer la requête après la création du fichier
            .catch(writeError => {
              console.error('Erreur lors de la création du fichier blacklist.json :', writeError);
              return res.status(500).json({ error: 'Erreur interne du serveur' });
            });
        } else {
          console.error('Erreur lors de la lecture de la liste noire :', err);
          return res.status(500).json({ error: 'Erreur interne du serveur' });
        }
      });
  }
}

// Route des ip blacklist
app.post('/addBlacklistIp', verifyJwt, AdminMiddleware, (req, res) => {
  const newIp = req.body.ip;
  const raison = req.body.raison || "aucune précision"; // Utiliser la raison du formulaire ou "aucune précision" par défaut

  fs.promises.readFile(blacklistPath, 'utf-8')
    .then(data => {
      let blacklist;

      try {
        blacklist = JSON.parse(data);
      } catch (parseError) {
        console.error('Erreur lors de l\'analyse de la liste noire :', parseError);
        blacklist = [];
      }

      // Vérifier si l'adresse IP existe déjà dans la liste noire
      if (!blacklist.some(entry => entry.ip === newIp)) {
        // Ajoutez l'adresse IP à la liste noire avec timestamp et la raison du formulaire
        const newEntry = {
          timestamp: new Date().toISOString(),
          ip: newIp,
          raison: raison
        };

        blacklist.push(newEntry);

        // Enregistrez la liste noire mise à jour dans le fichier JSON
        fs.promises.writeFile(blacklistPath, JSON.stringify(blacklist, null, 2), 'utf-8')
          .then(() => {
            res.json({ success: true, message: 'Adresse IP ajoutée avec succès à la liste noire.' });
          })
          .catch(error => {
            console.error('Erreur lors de l\'écriture dans la liste noire :', error);
            res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
          });
      } else {
        res.status(400).json({ success: false, error: 'Cette adresse IP est déjà dans la liste noire.' });
      }
    })
    .catch(error => {
      console.error('Erreur lors de la lecture de la liste noire :', error);
      res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
    });
});




// Afficher les ip blacklist
app.get('/blacklist', verifyJwt, AdminMiddleware, (req, res) => {
  try {
    const logs = fs.readFileSync(blacklistPath, 'utf-8');
    const logsArray = JSON.parse(logs);
    res.json(logsArray);
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier de logs de la liste noire :', error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
});


// Route de suppression
app.delete('/blacklist/:ip', verifyJwt, AdminMiddleware, (req, res) => {
  try {
    const ipToDelete = req.params.ip;
    const blacklistData = fs.readFileSync(blacklistPath, 'utf-8');
    const blacklist = JSON.parse(blacklistData);
    const updatedBlacklist = blacklist.filter(entry => entry.ip !== ipToDelete);
    fs.writeFileSync(blacklistPath, JSON.stringify(updatedBlacklist, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'adresse IP de la liste noire :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});



// Utiliser la blacklist
app.use(['/logs', '/logs/:timestamp', '/user/getUserData', '/user/getForeachUserData/:id', '/user/update/:id', '/user/create', '/user/delete/:id', '/user/roles', '/user', '/user/login'], ipBlacklistMiddleware);



// gérer les logs des requêtes de l'app
const logFilePath = path.join(__dirname, 'log.json');

// créer un fichier json
async function ensureLogFile() {
  try {
    await fsPromises.access(logFilePath, fs.constants.F_OK);
  } catch (err) {
    await fsPromises.writeFile(logFilePath, '[]', 'utf-8');
  }
}
ensureLogFile();

// écrire dans le json
async function logMiddleware(req, res, next) {
  let requeteType;
  if (req.url === "/user/login") {
    requeteType = "Connexion";
  } else if (req.url === "/user/logout") {
    requeteType = "Déconnexion";
  } else if (req.url === "/user/create") {
    requeteType = "Création d'un compte";
  } else if (req.url.startsWith("/user/update/")) {
    requeteType = "Mise à jour d'un compte";
  } else if (req.url.startsWith("/user/delete/")) {
    requeteType = "Suppression d'un compte";
  } else if (req.url === "/user/updateCurrentUser") {
    requeteType = "Modification d'un compte perso";
  }
  else {
    requeteType = "autre";
  }

  const logMessage = {
    timestamp: new Date().toISOString(),
    url: req.url,
    ip: req.ip,
    requete: requeteType,
  };

  console.log('Log Message:', logMessage);

  try {
    await ensureLogFile();
    const existingLogs = await fsPromises.readFile(logFilePath, 'utf-8');
    const logsArray = existingLogs ? JSON.parse(existingLogs) : [];

    logMessage.status = res.locals.success === true ? 'Réussie' : 'Échouée';

    logsArray.push(logMessage);
    logsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    logsArray.forEach(log => {
      log.formattedTimestamp = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      }).format(new Date(log.timestamp));
    });

    await fsPromises.writeFile(logFilePath, JSON.stringify(logsArray, null, 2), 'utf-8');
    console.log('Log written successfully.');
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
  next();
}


// route des logs
app.get('/logs', verifyJwt, AdminMiddleware, (req, res) => {
  try {
    const logs = fs.readFileSync(logFilePath, 'utf-8');
    const logsArray = JSON.parse(logs);
    res.json(logsArray);
  } catch (error) {
    console.error('Error reading log file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Suppression d'un log
app.delete('/logs/:timestamp', verifyJwt, AdminMiddleware, (req, res) => {
  try {
    const timestampToDelete = req.params.timestamp;
    const logs = fs.readFileSync(logFilePath, 'utf-8');
    const logsArray = JSON.parse(logs);
    const updatedLogs = logsArray.filter(log => log.timestamp !== timestampToDelete);
    fs.writeFileSync(logFilePath, JSON.stringify(updatedLogs, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du log:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// fonction qui vérifie si l'utilisateur est connecté
app.get('/checkauth', verifyJwt, (req, res) => {
  return res.json({
    status: 'Authenticated',
    userRole: req.userRole,
  });
});


// Requête de connexion
app.post('/user/login', spamMiddleware, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Utilisez la jointure pour obtenir le rôle_label
  const sql = "SELECT user.id, user.password, role_id, role.label FROM user JOIN role ON user.role_id = role.id WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      res.locals.success = false;
      return res.json("Fail");
    }

    if (results.length === 0) {
      res.locals.success = false;
      return res.json("Fail");
    }

    const hashedPassword = results[0].password;

    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) {
        res.locals.success = false;
        return res.status(500).json("Erreur de hachage");
      }

      if (result) {
        res.locals.success = true;
        const id = results[0].id;
        const role = results[0].role_id;
        const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey';
        const token = jwt.sign({ id, role }, secretKey, { expiresIn: 30000 });
        const response = { Login: true, token, userRole: role };
        res.json(response);

      } else {
        res.locals.success = false;
        const response = { Login: false };
        res.json(response);
      }
      logMiddleware(req, res, () => { });
    });
  });
});



// Requête déconnexion
app.get('/user/logout', (req, res) => {
  res.clearCookie('token');
  res.locals.success = true;
  const response = { Status: "Success" };
  res.json(response);

  logMiddleware(req, res, () => { });
});


app.get('/user/getUserData', verifyJwt, (req, res) => {
  const userId = req.userId;
  const sql = `
    SELECT 
      user.name, 
      user.description, 
      user.ddn, 
      user.creation_date, 
      user.surname, 
      user.email, 
      user.picture, 
      user.cover_id,
      user.role_id,
      user.poste_id,
      user.entreprise_id,
      user.ville_id,
      user.linkedin,
      user.site_web,
      role.label AS role, 
      ville.label AS ville,
      entreprise.label AS entreprise,
      poste.label AS poste,
      cover.url AS cover_url,  -- Correction ici
      cover.label AS cover_label  -- Correction ici
    FROM user 
    JOIN role ON user.role_id = role.id 
    LEFT JOIN ville ON user.ville_id = ville.id
    LEFT JOIN entreprise ON user.entreprise_id = entreprise.id
    LEFT JOIN poste ON user.poste_id = poste.id
    LEFT JOIN cover ON user.cover_id = cover.id
    WHERE user.id = ?`;

  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur lors de la récupération des données de l'utilisateur", details: err.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const userData = data[0];
    res.json(userData);
  });
});


// récupérer les informations d'un utilisateur selon son id
app.get('/user/getForeachUserData/:id', verifyJwt, AdminMiddleware, (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT user.name, user.description, user.surname, user.email, user.picture, role.label FROM user JOIN role ON user.role_id = role.id WHERE user.id = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la récupération des données de l'utilisateur spécifique" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Utilisateur spécifique non trouvé" });
    }

    const userData = data[0];

    res.json(userData);
  });
});




app.get('/user', verifyJwt, AdminMiddleware, (req, res) => {
  const sql = "SELECT user.*, role.label AS role_label FROM user JOIN role ON user.role_id = role.id";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json("Erreur du serveur");
    return res.json(data);
  });
});


app.post('/user/create', verifyJwt, AdminMiddleware, (req, res) => {
  const sqlCheckEmail = 'SELECT COUNT(*) AS count FROM user WHERE email = ?';
  const valuesCheckEmail = [req.body.email];

  db.query(sqlCheckEmail, valuesCheckEmail, (err, result) => {
    if (err) {
      res.locals.success = false;
      return res.status(500).json('Erreur lors de la vérification de l\'email');
    }

    else if (result[0].count > 0) {
      res.locals.success = false;
      return res.status(409).json('Cet email est déjà associé à un compte');
    }

    else {
      res.locals.success = true;
    }

    // L'email est unique, continuer avec l'insertion
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        res.locals.success = false;
        return res.status(500).json('Erreur de hachage du mot de passe');
      }

      let imageFullPath = '';

      if (req.files && req.files.image) {
        const image = req.files.image;
        const extname = path.extname(image.name);
        const uniqueFilename =
          image.name + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000) + extname;
        const uploadPath = path.join(__dirname, '../front-end/public/data/images', uniqueFilename);

        image.mv(uploadPath, (err) => {
          if (err) {
            res.locals.success = false;
            return res.status(500).json('Erreur lors de l\'enregistrement du fichier');
          }
        });

        imageFullPath = '/data/images/' + uniqueFilename;
      } else {
        imageFullPath = 'https://www.club.reltim.com/wp-content/uploads/2023/01/engineer-1.png';
      }

      const sql = 'INSERT INTO user (`name`, `surname`, `email`, `password`, `picture`, `role_id`) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [req.body.name, req.body.surname, req.body.email, hash, imageFullPath, req.body.role_id];

      db.query(sql, values, (err, data) => {
        if (err) {
          res.locals.success = false;
          return res.status(500).json('Erreur lors de l\'insertion en base de données');
        } else {
          res.locals.success = true;
          res.json(data);
        }
      });
    });
  });
  logMiddleware(req, res, () => { });
});



// Route pour la mise à jour
app.put('/user/update/:id', verifyJwt, AdminMiddleware, (req, res) => {
  const id = req.params.id;

  const sql = "UPDATE user SET `name` = ?, `surname` = ?, `email` = ?, `role_id` = ?" + (req.body.password ? ", `password` = ?" : "") + " WHERE id = ?";
  let values = [
    req.body.name,
    req.body.surname,
    req.body.email,
    req.body.role_id,
    // Si un nouveau mot de passe est fourni, ajouter la valeur hachée, sinon ignorer le champ
    ...(req.body.password ? [bcrypt.hashSync(req.body.password, 10)] : []),
    id
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.locals.success = false;
        res.status(409).json("L'email est déjà pris");
      } else {
        res.locals.success = false;
        res.status(500).json("Erreur lors de la mise à jour en base de données");
      }
    } else {
      res.locals.success = true;
      res.json(data);
    }
    logMiddleware(req, res, () => { });
  });
});

app.put('/user/updateCurrentUser', verifyJwt, (req, res) => {
  const userId = req.userId;

  const sql = "UPDATE user SET `name` = ?, `surname` = ?, `email` = ?, `ddn` = ?, `poste_id` = ?, `entreprise_id` = ?, `ville_id` = ?, `description` = ?, `linkedin` = ?, `site_web` = ?" + (req.body.password ? ", `password` = ?" : "") + " WHERE id = ?";
  let values = [
    req.body.name,
    req.body.surname,
    req.body.email,
    req.body.ddn,
    req.body.poste_id,
    req.body.entreprise_id,
    req.body.ville_id,
    req.body.description,
    req.body.linkedin,
    req.body.site_web,
    // Si un nouveau mot de passe est fourni, ajouter la valeur hachée, sinon ignorer le champ
    ...(req.body.password ? [bcrypt.hashSync(req.body.password, 10)] : []),
    userId // Ajout de l'ID à la fin des valeurs
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.locals.success = false;
        res.status(409).json("L'email est déjà pris");
      } else {
        res.locals.success = false;
        res.status(500).json("Erreur lors de la mise à jour en base de données");
      }
    } else {
      res.locals.success = true;
      res.json(data);
    }
    logMiddleware(req, res, () => { });
  });
});


// supprimer un utlisateur
app.delete('/user/delete/:id', verifyJwt, AdminMiddleware, (req, res) => {
  const id = req.params.id; // Récupérer l'ID depuis les paramètres de la route
  const sql = "DELETE FROM user WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      res.locals.success = false;
      res.json("Erreur");
    } else {
      res.locals.success = true;
      res.json(data);
    }
    logMiddleware(req, res, () => { });
  });
});


// Récupérer les rôles possibles depuis la base de données
app.get('/roles', verifyJwt, AdminMiddleware, (req, res) => {
  const sql = "SELECT id, label FROM role";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json('Erreur lors de la récupération des rôles');
    }

    return res.json(data);
  });
});

// Récupérer les postes possibles depuis la base de données
app.get('/poste', verifyJwt, (req, res) => {
  const sql = "SELECT id, label FROM poste";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json('Erreur lors de la récupération des rôles');
    }

    return res.json(data);
  });
});


// Récupérer les entreprises possibles depuis la base de données
app.get('/entreprise', verifyJwt, (req, res) => {
  const sql = "SELECT id, label, logo FROM entreprise";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json('Erreur lors de la récupération des rôles');
    }

    return res.json(data);
  });
});

// Récupérer les villes possibles depuis la base de données
app.get('/ville', (req, res) => {
  const sql = "SELECT id, label, code_postal FROM ville";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json('Erreur lors de la récupération des rôles');
    }

    return res.json(data);
  });
});


app.listen(8081, () => {
  console.log("Le serveur backend tourne correctement");
})