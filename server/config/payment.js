require('dotenv').config();
module.exports = {
  paypal: {
    mode: process.env.MODE || 'sandbox', //sandbox or live
    client_id: 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
    client_secret: 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM',
  },
  stripe: {},
};