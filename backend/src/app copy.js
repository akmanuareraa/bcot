const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const tweetnacl = require('tweetnacl');
const util = require('tweetnacl-util');
var blake = require('blakejs');

// custom addition
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const Web3 = require('web3');
const mongoose = require('mongoose');

// ===================================================
// custom addition
const mongoUrl = 'mongodb+srv://admin:jUdQCTB58QMNRW2Q@cluster0.gwedclb.mongodb.net/';

const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongoDB() {
  console.log('Establishing connection to MongoDB Atlas...');
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (e) {
    console.error(e);
  }
}

const initSetup = async () => {
  await connectToMongoDB();
  console.log('[2] Connected Successfully to MongoDB Atlas');
};

initSetup();

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// =================================================================
// custom addition
// =================================================================

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.post('/create-user-profile', async (req, res) => {
  console.log('[+] create-user-profile', req.body);
  try {
    const userId = req.body.userId;
    const role = req.body.role;
    const uid = req.body.uid;

    let userProfile = {
      userId: userId,
      role: role,
      uid: uid,
      vaccineBatches: [],
    };

    console.log('[+] userProfile', userProfile);

    const stringForHash =
      userProfile.userId + userProfile.role + userProfile.uid + JSON.stringify(userProfile.vaccineBatches);

    console.log('[+] stringForHash', stringForHash);

    let hash = blake.blake2bHex(stringForHash);

    console.log('[+] hash', hash);

    const key = tweetnacl.randomBytes(32);
    const nonce = tweetnacl.randomBytes(24);
    const encodedKey = util.encodeBase64(key);
    const encodedNonce = util.encodeBase64(nonce);

    const keyNonceString = encodedKey + 'xxxxx' + encodedNonce;

    console.log('[+] keyNonceString', keyNonceString);

    userProfile.role = util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(userProfile.role), nonce, key));
    userProfile.uid = util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(userProfile.uid), nonce, key));
    userProfile.vaccineBatches = util.encodeBase64(
      tweetnacl.secretbox(util.decodeUTF8(JSON.stringify(userProfile.vaccineBatches)), nonce, key)
    );

    console.log('[+] userProfile-role', userProfile.role);
    console.log('[+] userProfile-uid', userProfile.uid);
    console.log('[+] userProfile-vaccineBatches', userProfile.vaccineBatches);

    const db = client.db('bcot');
    const collection = db.collection('userprofiles');

    const result = await collection.insertOne(userProfile);
    console.log('User profile created successfully');
    return res.status(200).json({
      message: 'User profile created successfully',
      result: result,
      credentials: {
        key: keyNonceString,
        hash: hash,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating user profile', error: error });
  }
});

app.get('/user-profile', async (req, res) => {
  console.log('=========================================');
  console.log('[+] retrieve user-profile', req.query);
  console.log('=========================================');
  const userId = req.query.userId;

  try {
    const db = client.db('bcot');
    const collection = db.collection('userprofiles');

    const userProfile = await collection.findOne({ userId: userId });
    console.log('[+] userProfile', userProfile);

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    console.log('[+] sneding userProfile for verification ', userProfile, req.query.key, req.query.hash);

    const verificationResult = await verifyUserProfileIntegrity(userProfile, req.query.key, req.query.hash);

    return res.status(200).json(verificationResult);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving user profile', error: error });
  }
});

app.post('/new-manufacture', async (req, res) => {
  console.log('=========================================');
  console.log('[+] new-manufacture', req.body);
  console.log('=========================================');

  let batchObject = req.body.batchObject;
  let userObject = req.body.userObject;

  try {
    const stringForHash =
      batchObject.batchId +
      batchObject.manufacturerID +
      batchObject.txnHash +
      batchObject.vaccineName +
      batchObject.vaccineCount +
      batchObject.expiry +
      batchObject.distributorId +
      JSON.stringify(batchObject.manufactureParams) +
      batchObject.authorizedBy +
      batchObject.status +
      batchObject.timestamp +
      JSON.stringify(batchObject.distributorParams) +
      batchObject.hprofId +
      batchObject.distAuthBy +
      batchObject.distTxnHash +
      batchObject.distTimestamp +
      batchObject.hprofAuthBy +
      batchObject.hprofTxnHash +
      batchObject.hprofTimestamp;

    console.log('[+] stringForHash', stringForHash);

    const batchHash = blake.blake2bHex(stringForHash);
    console.log('[+] batchHash', batchHash);

    const key = tweetnacl.randomBytes(32);
    const nonce = tweetnacl.randomBytes(24);
    const encodedKey = util.encodeBase64(key);
    const encodedNonce = util.encodeBase64(nonce);

    const keyNonceString = encodedKey + 'xxxxx' + encodedNonce;

    console.log('[+] keyNonceString', keyNonceString);

    const plainBatchObject = batchObject;

    const encryptedBatchObject = await encryptBatchObject(plainBatchObject, key, nonce);

    const db = client.db('bcot');
    const batchCollection = db.collection('batches');
    const userCollection = db.collection('userprofiles');
    const unenc = db.collection('unenc');

    const result = await unenc.insertOne({
      batchId: batchObject.batchId,
      manufacturerID: batchObject.manufacturerID,
      hprofId: batchObject.hprofId,
      distributorId: batchObject.distributorId,
    });

    const userProfile = await userCollection.findOne({ userId: userObject.id });

    console.log('[+] userProfile from DB ', userProfile);

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const verificationResult = await verifyUserProfileIntegrity(userProfile, userObject.key, userObject.hash);

    console.log(
      '[+] verificationResult',
      verificationResult,
      plainBatchObject,
      typeof verificationResult.userProfile.userProfile.vaccineBatches,
      verificationResult.userProfile.userProfile.vaccineBatches
    );

    if (verificationResult.status === 'success') {
      let stringify = JSON.stringify(verificationResult.userProfile.userProfile.vaccineBatches);
      console.log('[+] stringify', stringify, typeof stringify);
      let jsonConv = JSON.parse(stringify);
      console.log('[+] jsonConv', jsonConv, typeof jsonConv);
      if (typeof jsonConv === 'string') {
        jsonConv = JSON.parse(jsonConv);
        console.log('[+] reparse jsonConv', jsonConv, typeof jsonConv);
      }
      jsonConv.push(plainBatchObject);
      verificationResult.userProfile.userProfile.vaccineBatches = JSON.stringify(jsonConv);
    } else {
      return res.status(200).json({
        status: 'failed',
        message: verificationResult.message,
      });
    }

    const newHash = await hashUserProfile(verificationResult.userProfile.userProfile);

    console.log('[+] user profile hash', newHash);

    const encryptedUserProfile = await encryptUserProfile(verificationResult.userProfile, userObject.key);

    const userProfileUpdateResult = await userCollection.updateOne(
      { userId: userObject.id },
      {
        $set: {
          vaccineBatches: encryptedUserProfile.userProfile.vaccineBatches,
        },
      }
    );

    console.log('[+] userProfileUpdateResult', userProfileUpdateResult);

    console.log('[+] inserting encryptedBatchObject', encryptedBatchObject);

    const insertBatchResult = await batchCollection.insertOne(encryptedBatchObject.batchObject);

    console.log('[+] insertBatchResult', insertBatchResult);

    console.log('Manufacture created successfully');
    return res.status(200).json({
      message: 'Manufacture created successfully',
      batchHash: batchHash,
      batchKey: keyNonceString,
      newUserProfileHash: newHash,
      status: 'success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating new manufacture', error: error });
  }
});

app.post('/update-status', async (req, res) => {
  console.log('=========================================');
  console.log('[+] update-status', req.body);
  console.log('=========================================');

  const recv = req.body.objectToSend;
  const misc = req.body.misc;

  console.log('[+] recv', recv);

  try {
    // database connection
    const db = client.db('bcot');
    const batchCollection = db.collection('batches');
    const userCollection = db.collection('userprofiles');

    // fetch batch and user profile from db
    const userProfile = await userCollection.findOne({ userId: recv.userId });
    const batch = await batchCollection.findOne({ batchId: recv.batchId });
    const unenc = db.collection('unenc');

    console.log('[+] userProfile from DB ', userProfile);
    console.log('[+] batch from DB ', batch);

    // check if batch and user profile exists
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // verify integrity of batch and user profile
    const userIntegrityVerification = await verifyUserProfileIntegrity(userProfile, recv.userKey, recv.userHash);
    const batchIntegrityVerification = await verifyBatchIntegrity(batch, recv.batchKey, recv.batchHash);

    console.log('[+] userIntegrityVerification', userIntegrityVerification);
    console.log('[+] batchIntegrityVerification', batchIntegrityVerification);

    // if integrity verification fails, return error
    if (userIntegrityVerification.status === 'failed') {
      return res.status(200).json({
        status: 'failed',
        message: 'User integrity verification failed',
      });
    }

    if (batchIntegrityVerification.status === 'failed') {
      return res.status(200).json({
        status: 'failed',
        message: 'Batch integrity verification failed',
      });
    }

    let userHash = '';
    let batchHash = '';

    // if integrity verification succeeds, update batch status and user profile
    if (userIntegrityVerification.status === 'success') {
      console.log('[+] userIntegrityVerification.userProfile', userIntegrityVerification);
      const userProfileObject = userIntegrityVerification.userProfile;
      console.log('[+] userProfileObject', userProfileObject);
      userProfileObject.userProfile.vaccineBatches = JSON.parse(userProfileObject.userProfile.vaccineBatches);
      userProfileObject.userProfile.vaccineBatches = userProfileObject.userProfile.vaccineBatches.map((batch) => {
        if (batch.batchId === recv.batchId) {
          batch.status = recv.status;
        }
        return batch;
      });
      userProfileObject.userProfile.vaccineBatches = JSON.stringify(userProfileObject.userProfile.vaccineBatches);
      console.log('[+] userProfileObject.userProfile.vaccineBatches', userProfileObject.userProfile.vaccineBatches);
      userHash = await hashUserProfile(userProfileObject.userProfile);
      console.log('[+] userHash', userHash);
      const encryptedUserProfile = await encryptUserProfile(userProfileObject, recv.userKey);
      console.log('[+] encryptedUserProfile', encryptedUserProfile);
      const updateUserProfileResult = await userCollection.updateOne(
        { userId: recv.userId },
        {
          $set: {
            vaccineBatches: encryptedUserProfile.userProfile.vaccineBatches,
          },
        }
      );
      console.log('[+] updateUserProfileResult', updateUserProfileResult);

      // batch integrity verfication
      if (batchIntegrityVerification.status === 'success') {
        console.log('[+] batchObject from int. verification', batchIntegrityVerification.batchObject);
        const batchObject = batchIntegrityVerification.batchObject.batchObject;
        console.log('[+] batchObject before status update', batchObject);
        batchObject.status = recv.status;
        console.log('[+] batchObject after status update', batchObject);
        batchHash = await hashBatchObject(batchObject);
        console.log('[+] batchHash', batchHash);
        const encryptedBatchObject = await encryptBatchObjectES(batchObject, recv.batchKey);
        console.log('[+] encryptedBatchObject', encryptedBatchObject);
        const updateBatchResult = await batchCollection.updateOne(
          { batchId: recv.batchId },
          {
            $set: {
              status: encryptedBatchObject.batchObject.status,
            },
          }
        );
        if (misc) {
          if (misc.hprofId !== '' && misc.hprofId !== undefined) {
            const unencResult = await unenc.updateOne(
              { batchId: recv.batchId },
              {
                $set: {
                  hprofId: hprofId,
                },
              }
            );
            console.log('[+] updateunenc', unencResult);
          }
        }

        console.log('[+] updateBatchResult', updateBatchResult);
        return res.status(200).json({
          status: 'success',
          message: 'Status updated successfully',
          userHash: userHash,
          batchHash: batchHash,
        });
      } else {
        return res.status(200).json({
          status: 'failed',
          message: "Batch integrity verification failed. Can't update the status",
        });
      }
    } else {
      return res.status(200).json({
        status: 'failed',
        message: "User profile integrity verification failed. Can't update the status",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating the status', error: error });
  }
});

app.post('/update-status-misc', async (req, res) => {
  console.log('=========================================');
  console.log('[+] update-status', req.body);
  console.log('=========================================');

  const recv = req.body.objectToSend;
  const misc = req.body.misc;

  console.log('[+] recv', recv);

  try {
    // database connection
    const db = client.db('bcot');
    const batchCollection = db.collection('batches');
    // const userCollection = db.collection('userprofiles');

    // fetch batch and user profile from db
    // const userProfile = await userCollection.findOne({ userId: recv.userId });
    const batch = await batchCollection.findOne({ batchId: recv.batchId });
    const unenc = db.collection('unenc');

    // console.log('[+] userProfile from DB ', userProfile);
    console.log('[+] batch from DB ', batch);

    // check if batch and user profile exists
    // if (!userProfile) {
    //   return res.status(404).json({ message: 'User profile not found' });
    // }

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // verify integrity of batch and user profile
    // const userIntegrityVerification = await verifyUserProfileIntegrity(userProfile, recv.userKey, recv.userHash);
    const batchIntegrityVerification = await verifyBatchIntegrity(batch, recv.batchKey, recv.batchHash);

    // console.log('[+] userIntegrityVerification', userIntegrityVerification);
    console.log('[+] batchIntegrityVerification', batchIntegrityVerification);

    // if integrity verification fails, return error
    // if (userIntegrityVerification.status === 'failed') {
    //   return res.status(200).json({
    //     status: 'failed',
    //     message: 'User integrity verification failed',
    //   });
    // }

    if (batchIntegrityVerification.status === 'failed') {
      return res.status(200).json({
        status: 'failed',
        message: 'Batch integrity verification failed',
      });
    }

    // let userHash = '';
    let batchHash = '';

    // if integrity verification succeeds, update batch status
    // batch integrity verfication
    if (batchIntegrityVerification.status === 'success') {
      console.log('[+] batchObject from int. verification', batchIntegrityVerification.batchObject);
      const batchObject = batchIntegrityVerification.batchObject.batchObject;
      console.log('[+] batchObject before status update', batchObject);
      batchObject.status = recv.status;
      if (misc.hprofId !== undefined && misc.hprofId !== '') batchObject.hprofId = misc.hprofId;
      if (misc.disAuthBy !== undefined && misc.disAuthBy !== '') batchObject.disAuthBy = misc.disAuthBy;
      if (misc.disTimestamp !== undefined && misc.disTimestamp !== '') batchObject.disTimestamp = misc.disTimestamp;
      if (misc.disTxnHash !== undefined && misc.disTxnHash !== '') batchObject.disTxnHash = misc.disTxnHash;
      if (misc.hprofAuthBy !== undefined && misc.hprofAuthBy !== '') batchObject.hprofAuthBy = misc.hprofAuthBy;
      if (misc.hprofTimestamp !== undefined && misc.hprofTimestamp !== '') batchObject.hprofTimestamp = misc.hprofTimestamp;
      if (misc.hprofTxnHash !== undefined && misc.hprofTxnHash !== '') batchObject.hprofTxnHash = misc.hprofTxnHash;
      console.log('[+] batchObject after status update', batchObject);
      batchHash = await hashBatchObject(batchObject);
      console.log('[+] batchHash', batchHash);
      const encryptedBatchObject = await encryptBatchObjectES(batchObject, recv.batchKey);
      console.log('[+] encryptedBatchObject', encryptedBatchObject);
      const updateBatchResult = await batchCollection.updateOne(
        { batchId: recv.batchId },
        {
          $set: encryptedBatchObject.batchObject,
        }
      );
      if (misc.hprofId !== undefined && misc.hprofId !== '') {
        const unencResult = await unenc.updateOne(
          { batchId: recv.batchId },
          {
            $set: {
              hprofId: misc.hprofId,
            },
          }
        );
        console.log('[+] updateunenc', unencResult);
      }

      console.log('[+] updateBatchResult', updateBatchResult);
      return res.status(200).json({
        status: 'success',
        message: 'Status updated successfully',
        batchHash: batchHash,
      });
    } else {
      return res.status(200).json({
        status: 'failed',
        message: "Batch integrity verification failed. Can't update the status",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating the status', error: error });
  }
});

app.post('/get-dis-batches', async (req, res) => {
  console.log('[+] [get-dis-batches] req.body', req.body);
  const recv = req.body.disId;
  try {
    const db = client.db('bcot');
    const unenc = db.collection('unenc');
    const batches = await unenc.find({ distributorId: recv }).toArray();
    console.log('[+] [get-dis-batches] batch', batches);
    res.status(200).json({
      status: 'success',
      message: 'Batches fetched successfully',
      batches: batches,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating the status', error: error });
  }
});

app.post('/get-man-batches', async (req, res) => {
  console.log('[+] [get-man-batches] req.body', req.body);
  const recv = req.body.manId;
  console.log('[+] [get-man-batches] recv', recv);
  try {
    const db = client.db('bcot');
    const unenc = db.collection('unenc');
    const batches = await unenc.find({ manufacturerID: recv }).toArray();
    console.log('[+] [get-man-batches] batch', batches);
    res.status(200).json({
      status: 'success',
      message: 'Batches fetched successfully',
      batches: batches,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating the status', error: error });
  }
});

app.post('/get-hpro-batches', async (req, res) => {
  console.log('[+] [get-hpro-batches] req.body', req.body);
  const recv = req.body.hproId;
  try {
    const db = client.db('bcot');
    const unenc = db.collection('unenc');
    const batches = await unenc.find({ hprofId: recv }).toArray();
    console.log('[+] [get-hpro-batches] batch', batches);
    res.status(200).json({
      status: 'success',
      message: 'Batches fetched successfully',
      batches: batches,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating the status', error: error });
  }
});

app.post('/get-batch-data', async (req, res) => {
  console.log('[+] [get-batch-data] req.body', req.body);
  const arrayWithKeys = req.body.arrayWithKeys;
  try {
    const db = client.db('bcot');
    const batchCollection = db.collection('batches');

    let batchDataArray = [];
    let status = '';
    let count = 0;

    await Promise.all(
      arrayWithKeys.map(async (item) => {
        if (item.key !== '') {
          count++;
          const batch = await batchCollection.findOne({ batchId: item.batchId });
          console.log('[+] [get-batch-data] batch', batch);

          let verifyResult = await verifyBatchIntegrity(batch, item.key, item.hash);
          if (verifyResult.status === 'failed') {
            status = 'failed';
            batchDataArray.push({
              batchId: item.batchId,
              status: 'failed',
              message: 'Data Integrity Verification Failed',
            });
          } else {
            status = 'success';
            batchDataArray.push(verifyResult.batchObject.batchObject);
          }
        }
      })
    );

    if (count === arrayWithKeys.length) {
      console.log('[+] [get-batch-data] batchDataArray', batchDataArray);
      res.status(200).json({
        status: status,
        message: 'Batches Retrieved',
        batches: batchDataArray,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving batches', error: error });
  }
});

const encryptUserProfile = async (userProfile, encodedString) => {
  console.log('[+] encryptUserProfile', userProfile, encodedString);
  const decodedString = encodedString.split('xxxxx');
  console.log('[+] [encryptUserProfile] decodedString', decodedString);
  const key = util.decodeBase64(decodedString[0]);
  console.log('[+] [encryptUserProfile] key', key);
  const nonce = util.decodeBase64(decodedString[1]);
  console.log('[+] [encryptUserProfile] nonce', nonce);
  let encryptedUserProfile = {};
  try {
    encryptedUserProfile = {
      userId: userProfile.userProfile.userId,
      role: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(userProfile.userProfile.role), nonce, key)),
      uid: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(userProfile.userProfile.uid), nonce, key)),
      vaccineBatches: util.encodeBase64(
        tweetnacl.secretbox(util.decodeUTF8(JSON.stringify(userProfile.userProfile.vaccineBatches)), nonce, key)
      ),
    };

    console.log('[+] [encryptUserProfile] encryptUserProfile', encryptedUserProfile);
    return {
      status: 'success',
      userProfile: encryptedUserProfile,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'Error encrypting user profile',
    };
  }
};

const decryptUserProfile = async (userProfile, key, nonce) => {
  console.log('[+] [decryptUserProfile] calling', userProfile);
  let decryptedUserProfile = {};
  try {
    decryptedUserProfile = {
      userId: userProfile.userId,
      role: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(userProfile.role), nonce, key)),
      uid: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(userProfile.uid), nonce, key)),
      vaccineBatches: JSON.parse(
        util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(userProfile.vaccineBatches), nonce, key))
      ),
    };
    console.log('[++] [decryptUserProfile] decryptedUserProfile', decryptedUserProfile);
    return {
      status: 'success',
      userProfile: decryptedUserProfile,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'failed',
      message: 'Error decrypting user profile',
    };
  }
};

const encryptBatchObject = async (batchObject, key, nonce) => {
  console.log('[+] [encryptBatchObject] calling', batchObject);
  let encryptedBatchObject = {};
  try {
    encryptedBatchObject = {
      batchId: batchObject.batchId,
      manufacturerID: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.manufacturerID), nonce, key)),
      txnHash: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.txnHash), nonce, key)),
      vaccineName: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.vaccineName), nonce, key)),
      vaccineCount: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.vaccineCount), nonce, key)),
      expiry: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.expiry), nonce, key)),
      distributorId: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.distributorId), nonce, key)),
      manufactureParams: util.encodeBase64(
        tweetnacl.secretbox(util.decodeUTF8(JSON.stringify(batchObject.manufactureParams)), nonce, key)
      ),
      distributorParams: util.encodeBase64(
        tweetnacl.secretbox(util.decodeUTF8(JSON.stringify(batchObject.distributorParams)), nonce, key)
      ),
      hprofId: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.hprofId), nonce, key)),
      authorizedBy: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.authorizedBy), nonce, key)),
      status: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.status), nonce, key)),
      timestamp: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.timestamp), nonce, key)),
      distAuthBy: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.distAuthBy), nonce, key)),
      distTxnHash: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.distTxnHash), nonce, key)),
      distTimestamp: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.distTimestamp), nonce, key)),
      hprofAuthBy: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.hprofAuthBy), nonce, key)),
      hprofTxnHash: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.hprofTxnHash), nonce, key)),
      hprofTimestamp: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.hprofTimestamp), nonce, key)),
    };
    console.log('[++] [encryptBatchObject] encryptedBatchObject', encryptedBatchObject);
    return {
      status: 'success',
      batchObject: encryptedBatchObject,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'Error encrypting batch object',
    };
  }
};

const decryptBatchObject = async (batchObject, key, nonce) => {
  console.log('[+] [decryptBatchObject] calling', batchObject);
  let decryptedBatchObject = {};
  try {
    decryptedBatchObject = {
      batchId: batchObject.batchId,
      manufacturerID: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.manufacturerID), nonce, key)),
      txnHash: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.txnHash), nonce, key)),
      vaccineName: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.vaccineName), nonce, key)),
      vaccineCount: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.vaccineCount), nonce, key)),
      expiry: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.expiry), nonce, key)),
      distributorId: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.distributorId), nonce, key)),
      manufactureParams: util.encodeUTF8(
        tweetnacl.secretbox.open(util.decodeBase64(batchObject.manufactureParams), nonce, key)
      ),
      authorizedBy: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.authorizedBy), nonce, key)),
      status: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.status), nonce, key)),
      timestamp: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.timestamp), nonce, key)),
      distributorParams: util.encodeUTF8(
        tweetnacl.secretbox.open(util.decodeBase64(batchObject.distributorParams), nonce, key)
      ),
      hprofId: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.hprofId), nonce, key)),
      distAuthBy: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.distAuthBy), nonce, key)),
      distTxnHash: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.distTxnHash), nonce, key)),
      distTimestamp: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.distTimestamp), nonce, key)),
      hprofAuthBy: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.hprofAuthBy), nonce, key)),
      hprofTxnHash: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.hprofTxnHash), nonce, key)),
      hprofTimestamp: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.hprofTimestamp), nonce, key)),
    };
    console.log('[++] [decryptBatchObject] decryptedBatchObject', decryptedBatchObject);
    return {
      status: 'success',
      batchObject: decryptedBatchObject,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'Error decrypting batch object',
    };
  }
};

const verifyUserProfileIntegrity = async (userProfile, encodedString, hash) => {
  console.log('[+] [verifyUserProfileIntegrity] verifyUserProfileIntegrity', encodedString);
  const decodedString = encodedString.split('xxxxx');
  console.log('[+] [verifyUserProfileIntegrity] decodedString', decodedString);
  const key = util.decodeBase64(decodedString[0]);
  console.log('[+] [verifyUserProfileIntegrity] key', key);
  const nonce = util.decodeBase64(decodedString[1]);
  console.log('[+] [verifyUserProfileIntegrity] nonce', nonce);

  const decryptedUserProfile = await decryptUserProfile(userProfile, key, nonce);

  console.log('[+] [verifyUserProfileIntegrity] decryptedUserProfile response', decryptedUserProfile);

  if (decryptedUserProfile.status === 'failed') {
    return {
      status: 'failed',
      message: 'Error decrypting user profile',
    };
  }

  let calculatedHash = '';

  const stringForHash =
    decryptedUserProfile.userProfile.userId +
    decryptedUserProfile.userProfile.role +
    decryptedUserProfile.userProfile.uid +
    JSON.stringify(decryptedUserProfile.userProfile.vaccineBatches);

  console.log('[+] [verifyUserProfileIntegrity] stringForHash', stringForHash);

  calculatedHash = blake.blake2bHex(stringForHash);
  console.log('[+] [verifyUserProfileIntegrity] calculatedHash', calculatedHash);
  console.log('[+] [verifyUserProfileIntegrity] hash', hash);

  if (calculatedHash !== hash) {
    return {
      status: 'failed',
      message: 'Hash mismatch',
    };
  } else {
    return {
      status: 'success',
      message: 'Data integrity verified',
      userProfile: decryptedUserProfile,
    };
  }
};

const hashUserProfile = async (userProfile) => {
  console.log('[+] [hashUserProfile] hashUserProfile', userProfile);
  let calculatedHash = '';

  const stringForHash = userProfile.userId + userProfile.role + userProfile.uid + JSON.stringify(userProfile.vaccineBatches);

  console.log('[+] [hashUserProfile] stringForHash', stringForHash);

  calculatedHash = blake.blake2bHex(stringForHash);
  console.log('[+] [hashUserProfile] calculatedHash', calculatedHash);

  return calculatedHash;
};

const hashBatchObject = async (batchObject) => {
  console.log('[+] [hashBatchObject]  hashBatchObject', batchObject);
  let calculatedHash = '';

  const stringForHash =
    batchObject.batchId +
    batchObject.manufacturerID +
    batchObject.txnHash +
    batchObject.vaccineName +
    batchObject.vaccineCount +
    batchObject.expiry +
    batchObject.distributorId +
    batchObject.manufactureParams +
    batchObject.authorizedBy +
    batchObject.status +
    batchObject.timestamp +
    batchObject.distributorParams +
    batchObject.hprofId +
    batchObject.distAuthBy +
    batchObject.distTxnHash +
    batchObject.distTimestamp +
    batchObject.hprofAuthBy +
    batchObject.hprofTxnHash +
    batchObject.hprofTimestamp;

  console.log('[+] [hashBatchObject] stringForHash', stringForHash);
  let svar = stringForHash.replace(/\\/g, '');
  console.log('[+] [hashBatchObject] stringForHash-jsonify', svar);
  // svar = JSON.stringify(svar)
  // console.log('[+] [hashBatchObject] stringForHash-stringify', svar);

  calculatedHash = blake.blake2bHex(svar);
  console.log('[+] [hashBatchObject] calculatedHash', calculatedHash);

  return calculatedHash;
};

const verifyBatchIntegrity = async (batchObject, encodedString, hash) => {
  console.log('[+] [verifyBatchIntegrity] verifyBatchIntegrity', encodedString);
  const decodedString = encodedString.split('xxxxx');
  console.log('[+] [verifyBatchIntegrity] decodedString', decodedString);
  const key = util.decodeBase64(decodedString[0]);
  console.log('[+] [verifyBatchIntegrity] key', key);
  const nonce = util.decodeBase64(decodedString[1]);
  console.log('[+] [verifyBatchIntegrity] nonce', nonce);

  const decryptedBatchObject = await decryptBatchObject(batchObject, key, nonce);

  console.log('[+] [verifyBatchIntegrity] decryptedBatchObject response', decryptedBatchObject);

  if (decryptedBatchObject.status === 'failed') {
    return {
      status: 'failed',
      message: 'Error decrypting batch object',
    };
  }

  let calculatedHash = '';

  const stringForHash =
    decryptedBatchObject.batchObject.batchId +
    decryptedBatchObject.batchObject.manufacturerID +
    decryptedBatchObject.batchObject.txnHash +
    decryptedBatchObject.batchObject.vaccineName +
    decryptedBatchObject.batchObject.vaccineCount +
    decryptedBatchObject.batchObject.expiry +
    decryptedBatchObject.batchObject.distributorId +
    decryptedBatchObject.batchObject.manufactureParams +
    decryptedBatchObject.batchObject.authorizedBy +
    decryptedBatchObject.batchObject.status +
    decryptedBatchObject.batchObject.timestamp +
    decryptedBatchObject.batchObject.distributorParams +
    decryptedBatchObject.batchObject.hprofId +
    decryptedBatchObject.batchObject.distAuthBy +
    decryptedBatchObject.batchObject.distTxnHash +
    decryptedBatchObject.batchObject.distTimestamp +
    decryptedBatchObject.batchObject.hprofAuthBy +
    decryptedBatchObject.batchObject.hprofTxnHash +
    decryptedBatchObject.batchObject.hprofTimestamp;

  console.log('[+] [verifyBatchIntegrity] stringForHash', stringForHash);
  let svar = stringForHash.replace(/\\/g, '');
  console.log('[+] [hashBatchObject] stringForHash-jsonify', svar);
  svar = svar.replace('"{"', '{"');
  svar = svar.replace('"}"', '"}');
  svar = svar.replace('"{}"', '{}');
  console.log('[+] [hashBatchObject] stringForHash-replace', svar);

  calculatedHash = blake.blake2bHex(svar);
  console.log('[+] [verifyBatchIntegrity] calculatedHash', calculatedHash);
  console.log('[+] [verifyBatchIntegrity] hash', hash);

  if (calculatedHash !== hash) {
    return {
      status: 'failed',
      message: 'Hash mismatch',
    };
  } else {
    return {
      status: 'success',
      message: 'Data integrity verified',
      batchObject: decryptedBatchObject,
    };
  }
};

const encryptBatchObjectES = async (batchObject, encodedString) => {
  console.log('[+] [encryptBatchObjectES] encryptBatchObjectES', batchObject);
  console.log('[+] [encryptBatchObjectES] calling encryptBatchObject', batchObject);

  const decodedString = encodedString.split('xxxxx');
  console.log('[+] [encryptBatchObjectES] decodedString', decodedString);
  const key = util.decodeBase64(decodedString[0]);
  console.log('[+] [encryptBatchObjectES] key', key);
  const nonce = util.decodeBase64(decodedString[1]);
  console.log('[+] [encryptBatchObjectES] nonce', nonce);

  let encryptedBatchObject = {};
  try {
    encryptedBatchObject = {
      batchId: batchObject.batchId,
      manufacturerID: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.manufacturerID), nonce, key)),
      txnHash: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.txnHash), nonce, key)),
      vaccineName: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.vaccineName), nonce, key)),
      vaccineCount: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.vaccineCount), nonce, key)),
      expiry: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.expiry), nonce, key)),
      distributorId: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.distributorId), nonce, key)),
      manufactureParams: util.encodeBase64(
        tweetnacl.secretbox(util.decodeUTF8(JSON.stringify(batchObject.manufactureParams)), nonce, key)
      ),
      authorizedBy: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.authorizedBy), nonce, key)),
      status: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.status), nonce, key)),
      timestamp: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.timestamp), nonce, key)),
      distributorParams: util.encodeBase64(
        tweetnacl.secretbox(util.decodeUTF8(JSON.stringify(batchObject.distributorParams)), nonce, key)
      ),
      hprofId: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.hprofId), nonce, key)),
      distAuthBy: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.distAuthBy), nonce, key)),
      distTxnHash: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.distTxnHash), nonce, key)),
      distTimestamp: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.distTimestamp), nonce, key)),
      hprofAuthBy: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.hprofAuthBy), nonce, key)),
      hprofTxnHash: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.hprofTxnHash), nonce, key)),
      hprofTimestamp: util.encodeBase64(tweetnacl.secretbox(util.decodeUTF8(batchObject.hprofTimestamp), nonce, key)),
    };
    console.log('[++] [encryptBatchObjectES] encryptedBatchObject', encryptedBatchObject);
    return {
      status: 'success',
      batchObject: encryptedBatchObject,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'Error encrypting batch object',
    };
  }
};

const decryptBatchObjectES = async (batchObject, encodedString) => {
  console.log('[+] [decryptBatchObject] calling', batchObject);
  const decodedString = encodedString.split('xxxxx');
  console.log('[+] [decryptBatchObject] decodedString', decodedString);
  const key = util.decodeBase64(decodedString[0]);
  console.log('[+] [decryptBatchObject] key', key);
  const nonce = util.decodeBase64(decodedString[1]);
  console.log('[+] [decryptBatchObject] nonce', nonce);

  let decryptedBatchObject = {};
  try {
    decryptedBatchObject = {
      batchId: batchObject.batchId,
      manufacturerID: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.manufacturerID), nonce, key)),
      txnHash: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.txnHash), nonce, key)),
      vaccineName: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.vaccineName), nonce, key)),
      vaccineCount: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.vaccineCount), nonce, key)),
      expiry: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.expiry), nonce, key)),
      distributorId: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.distributorId), nonce, key)),
      manufactureParams: util.encodeUTF8(
        tweetnacl.secretbox.open(util.decodeBase64(batchObject.manufactureParams), nonce, key)
      ),
      authorizedBy: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.authorizedBy), nonce, key)),
      status: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.status), nonce, key)),
      timestamp: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.timestamp), nonce, key)),
      distributorParams: util.encodeUTF8(
        tweetnacl.secretbox.open(util.decodeBase64(batchObject.distributorParams), nonce, key)
      ),
      hprofId: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.hprofId), nonce, key)),
      distAuthBy: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.distAuthBy), nonce, key)),
      distTxnHash: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.distTxnHash), nonce, key)),
      distTimestamp: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.distTimestamp), nonce, key)),
      hprofAuthBy: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.hprofAuthBy), nonce, key)),
      hprofTxnHash: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.hprofTxnHash), nonce, key)),
      hprofTimestamp: util.encodeUTF8(tweetnacl.secretbox.open(util.decodeBase64(batchObject.hprofTimestamp), nonce, key)),
    };
    console.log('[++] [decryptBatchObject] decryptedBatchObject', decryptedBatchObject);
    return {
      status: 'success',
      batchObject: decryptedBatchObject,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'Error decrypting batch object',
    };
  }
};

// =================================================================

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
