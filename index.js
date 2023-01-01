class RequestBodyCheck {
  constructor(apiJSONDoc) {
    this.apiJSON = apiJSONDoc;
  }

  requestBodyCheck = (req, res, next) => {
    try {
      if (this.apiJSON == undefined) throw new Error("api.json file not found");
      let validRequestFlag = true;
      let fields = this.apiJSON.apis.post.filter(
        (request) => request.url == req.url
      )[0].responsePayload;
      let missingFields = [];
      for (let i = 0; i < fields.length; i++) {
        if (fields[i] in req.body) {
          console.log(typeof JSON.parse(req.body[fields[i]]));
        } else {
          missingFields.push(fields[i]);
          validRequestFlag = false;
        }
      }
      if (validRequestFlag) {
        next();
      } else {
        return res.status(400).json({ missingFields: missingFields });
      }
    } catch (e) {
      console.error(e);
      return res.status(400).send("api.json file not found in the server");
    }
  };
}
module.exports = RequestBodyCheck;
