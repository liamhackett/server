const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const apiCall = (req, res) => {
    const PAT = 'dc3ea0fc6da94fc4b616df8fdcaa74b6';
    const USER_ID = 'lhackett';
    const APP_ID = 'smartbrain';
    const modelId = req.body.modelId;
    const isFile = JSON.parse(req.body.isFile);
    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    if (isFile) {
        const base64File = req.file.buffer.toString('base64');
        stub.PostModelOutputs(
            {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: modelId,
            inputs: [
                { data: { image: { base64: base64File } } }
            ]
            },
            metadata,
            (err, response) => {
            if (err) {
                throw new Error(err);
            }
    
            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }
            res.json(response);
            }
        );
    } else {
        const imageUrl = req.body.imageUrl;
        stub.PostModelOutputs(
            {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: modelId,
            inputs: [
                { data: { image: { url: imageUrl, allow_duplicate_url: true } } }
            ]
            },
            metadata,
            (err, response) => {
            if (err) {
                throw new Error(err);
            }
    
            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }
            res.json(response);
            }
        );
        }
}
  

module.exports = {
  apiCall: apiCall
}
