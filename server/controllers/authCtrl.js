const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase/auth");
const { getFirebaseApp } = require("../config/firebaseConfig");
const admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");
const { createConnection, removeConnection } = require("../db");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = getFirebaseApp();
auth = getAuth(app);

const getTenantNames = async (req, res) => {
  try {
    const tenants = await admin.auth().tenantManager().listTenants();
    const tenantNames = tenants.tenants.map((tenant) => tenant.displayName);
    return res.status(200).json(tenantNames);
  } catch (error) {
    console.error("Error listing tenants:", error);
    return res.status(500).json({ error: "Failed to get tenant names" });
  }
};

async function tenantIDFromTenantName(tenantName) {
  try {
    const tenants = await admin.auth().tenantManager().listTenants();
    for (const tenant of tenants.tenants) {
      if (tenant.displayName === tenantName) {
        return tenant.tenantId;
      }
    }
    return null;
  } catch (error) {
    console.error("Error listing tenants:", error);
    throw error;
  }
}

function tenantsFromEmail(email) {
  return new Promise(async (resolve, reject) => {
    let arr = [];
    try {
      const tenants = await admin.auth().tenantManager().listTenants();
      for (const tenant of tenants.tenants) {
        const users = await listAllUsers(tenant.tenantId);
        for (const user of users) {
          if (user.email == email) {
            const item = { id: tenant.tenantId, name: tenant.displayName };
            arr.push(item);
          }
        }
      }
      resolve(arr);
    } catch (error) {
      console.error("Error listing tenants:", error);
      reject(error);
    }
  });
}

function listAllUsers(tenantId) {
  return new Promise((resolve, reject) => {
    let usersArr = [];
    const tenantAuth = admin.auth().tenantManager().authForTenant(tenantId);
    tenantAuth
      .listUsers()
      .then((listUsersResult) => {
        listUsersResult.users.map((userRecord) =>
          usersArr.push(userRecord.toJSON())
        );
        resolve(usersArr);
      })
      .catch((error) => {
        console.error("Error listing users:", error);
        reject(error);
      });
  });
}

const signin = async (req, res) => {
  try {
    const body = req.body;
    const { email, password } = body;
    const tenantArr = await tenantsFromEmail(email);
    if (tenantArr.length === 0) {
      console.error("Wrong email");
      return res.status(404).json({ error: "Wrong email" });
    }
    const tenantId = tenantArr[0].id;
    const tenantName = tenantArr[0].name;
    auth.tenantId = tenantId;
    try {
      const authRes = await signInWithEmailAndPassword(auth, email, password);
      createConnection(tenantId);
      const user = authRes.user;
      const userTenants = tenantArr.map((tenant) => tenant.name);
      return res.status(200).json({ tenantName, userTenants });
    } catch (error) {
      console.error("Firebase authentication failed:", error);
      return res.status(400).json({ error: error.code });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const signup = async (req, res) => {
  try {
    const body = req.body;
    const { email, password, selectedTenant } = body;
    const tenantName = selectedTenant;
    const tenantId = await tenantIDFromTenantName(tenantName);
    if (tenantId === null) {
      console.error("Tenant not found");
      return res.status(404).json({ error: "Tenant not found" });
    }

    auth.tenantId = tenantId;
    try {
      const authRes = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      createConnection(tenantId);
      authRes.user;
      const tenantArr = await tenantsFromEmail(email);
      const userTenants = tenantArr.map((tenant) => tenant.name);
      return res.status(200).json({ tenantName, userTenants });
    } catch (error) {
      console.error("Firebase authentication failed:", error);
      return res
        .status(400)
        .json({ error: "Email already exists or invalid password" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const signOutUser = async (req, res) => {
  try {
    auth = getAuth(app);
    await signOut(auth);
    removeConnection();
    return res.status(200).json({ message: "User signed out successfully" });
  } catch (err) {
    console.error("Sign out failed:", err);
    return res.status(500).json({ error: "Failed to sign out user" });
  }
};

const switchTenant = async (req, res) => {
  try {
    const { tenantName } = req.body;
    const tenantId = await tenantIDFromTenantName(tenantName);
    auth.tenantId = tenantId;
    removeConnection();
    createConnection(tenantId);
    return res.status(200).json({ message: "Tenants switched sucessfully" });
  } catch (err) {
    console.error("Tenant switch failed:", err);
    return res.status(500).json({ error: "Failed to switch tenant" });
  }
};

module.exports = { signin, signup, signOutUser, getTenantNames, switchTenant };
