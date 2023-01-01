class RequestBodyCheck {
  constructor(apiJSONDoc) {
    this.apiJSON = apiJSONDoc;
  }

  /**
   * check for types
   *
   * @param  {req} req
   * @param  {res} res
   * @return {function} next
   */
  requestBodyCheck = (req, res, next) => {
    try {
      if (this.apiJSON == undefined) throw new Error("api.json file not found");
      let validRequestFlag = true;
      let fields = this.apiJSON.apis.post.filter(
        (request) => request.url == req.url
      )[0].responsePayload;
      let missingFields = [];
      for (let i = 0; i < fields.length; i++) {
        let { field, typeCheck, type } = fields[i];
        if (
          !(field in req.body) ||
          (typeCheck && !this.checkType(type, req.body[field]))
        ) {
          missingFields.push(field);
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

  /**
   * check for types
   *
   * @param  {String} type
   * @param  {any} value
   * @return {Boolean}
   */
  checkType(type, value) {
    switch (type) {
      case "string": {
        return type == typeof JSON.parse(value);
      }
      case "number": {
        return type == typeof JSON.parse(value);
      }
      case "array": {
        return Array.isArray(JSON.parse(value));
      }
      default: {
        return false;
      }
    }
  }
}
module.exports = RequestBodyCheck;
