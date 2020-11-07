const clientAuthMiddleware = () => (req, res, next) => {
    if (!req.client.authorized) {
      return res.status(401).send('Invalid client certificate authentication.');
    }
    console.log("Client authenticated")
    return next();
  };
  
module.exports = clientAuthMiddleware;

// https://intown.biz/2016/11/22/node-client-auth/
// https://smallstep.com/hello-mtls/doc/server/express