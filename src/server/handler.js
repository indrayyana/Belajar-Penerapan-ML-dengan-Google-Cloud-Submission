const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const getAllData = require('../services/getAllData');
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "createdAt": createdAt
  }
 
  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data
  })
  response.code(201);
  return response;
}
 
async function postPredictHistoriesHandler(request, h) {
  const allData = await getAllData();
  
  const formatAllData = [];
  allData.forEach(doc => {
      const data = doc.data();
      formatAllData.push({
          id: doc.id,
          history: {
              result: data.result,
              createdAt: data.createdAt,
              suggestion: data.suggestion,
              id: doc.id
          }
      });
  });
  
  const response = h.response({
    status: 'success',
    data: formatAllData
  })
  response.code(200);
  return response;
}

module.exports = { postPredictHandler, postPredictHistoriesHandler };