module.exports = {
    /**
    * Generates a JWT for authentication with the Visionstrust API
    * 
    * Expiration time is in minutes
    *
    * @params {string} serviceKey The key of your service
    * @params {string} secretKey The secret key of your service
    */
    getJwtToken: function (serviceKey, secretKey) {
        let token = jwt.sign(
        {
            serviceKey: serviceKey,
            iat: (new Date().getTime())
        },
        secretKey,
        { expiresIn: 5 * 60 }
        );
        return token;
    },
};
