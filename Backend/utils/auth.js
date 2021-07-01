module.exports = {
    /**
    * Generates a JWT for authentication with the Visionstrust API
    * 
    * @params {string} serviceKey The key of your service
    * @params {string} secretKey The secret key of your service
    */
    getJwtToken: function (serviceKey, secretKey) {
        let token = jwt.sign(
        {
            serviceKey: serviceKey,
        },
        secretKey,
        { expiresIn: 5 * 60 }
        );
        return token;
    },
};