var crypto 			= require('crypto');
crypto.createHash('md5').update(data).digest("hex");