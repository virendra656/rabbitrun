import { userInfo } from "os";
import { CONSTANTS, Codes } from "./SiteConfig";

export function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}


export function replaceEmailTemplateData(template, data) {
  const pattern = /\{(.*?)\}/g; // {property}
  return template.replace(pattern, (match, token) => data[token]);
}

export async function OTPSend(user: any): Promise<any> {
  return new Promise((acc, rej) => {
    var request = require("request");

    var options = {
      method: 'POST',
      url: process.env.smsURL,
      headers:
        { 'Content-Type': 'application/json' },
      body:
      {
        apikey: process.env.smsApikey,
        secret: process.env.smsSecret,
        usetype: process.env.smsUsetype,
        senderid: process.env.smsSenderid,
        phone: user.mobile,
        message: user.message
      },
      json: true
    };

    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
        return rej(error)
      };
      
      console.log(body);
      acc(true);
      
    });

  }).catch((err) => {
    console.log("Error in sending mail")
    return Promise.reject(err);
  });


}

export async function EmailSend(param: any): Promise<any> {
  const nodemailer = require("nodemailer");

  return new Promise((acc, rej) => {

    let data = param;
    let err: Error;

    let result: any;

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: process.env.email_user,
          pass: process.env.email_pass
      }
  });
  
  



    var mailOptions = {
      from: process.env.email_from,
      to: data.email,
      subject: data.subject,
      html: data.html
    };

    console.log("mail options", mailOptions)
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return rej(error);
      } else {
        console.log(info);
        return acc();
      }
    });
  }).catch((err) => {
    console.log("Error in sending mail")
    return Promise.reject(err);
  });


}

export function renderResponse(res, validation_err, err, data) {
  /* if (validation_err && !validation_err.isEmpty()) {
    let key = Object.keys(validation_err.mapped())[0];
    return res.status(400).json({ error: validation_err.mapped()[key].msg, success: false, data: {} })
  }
  else if (err) {
    return res.status(err.code || 500).json({ error: err.message, success: false, data: {} })
  } else if (data) {
    return res.status(data.code || 200).json({ error: "", success: true, data: data })
  } */

  if (validation_err && !validation_err.isEmpty()) {
    let key = Object.keys(validation_err.mapped())[0];
    return res.status(200).json({ code : 400, message: validation_err.mapped()[key].msg, success: false, data: {} })
  }
  else if (err) {
    return res.status(200).json({ code : 500, message: err.message, success: false, data: {} })
  } else if (data) {
    let message = data.message || "";
    try {
      delete data.message;
    }catch(e) {}
    return res.status(200).json({code : data.code || 200,message: message, success: true, data: data })
  }
}

export function validateSchema(data: any, schema: any): Promise<any> {
  var jsv = require('json-validator');
  return new Promise((acc, rej) => {
    jsv.validate(data, schema, function (err, messages) {
      console.log(messages);
      if (err) {
        return rej(err);
      } else {
        if (Object.keys(messages).length == 0)
          return acc(true);
        else {
          let error = "Client Error";
          for (let i in messages) {
            error = messages[i][0];
            break;
          }
          let err = new Error(error.toString());
          err[CONSTANTS.STATUS_CODE] = Codes.BAD_REQUEST;
          throw err;
        }
      }

    });
  });

}



export function checkNested(obj: any, params: string) {
  let args = params.split(".");
  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}
export function parseQueryResponse(res: any): any {
  let result = [];
  try {
    result = JSON.parse(JSON.stringify(res));
  } catch (e) {
    result = [];
  }
  return result;
}






export function groupBy(array, f): any {
  var groups = {};
  array.forEach(function (o) {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  })
}

export function generate(idLen) {
  var ALPHABET = '123456789ABCDEFGHKMNPRSTVWXYZ';
  var rtn = '';
  for (var i = 0; i < idLen; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return rtn;
}

export function generateUniqueId(previous, idLen) {
  //var previous = []

  var UNIQUE_RETRIES = 9999;
  previous = previous || [];
  var retries = 0;
  var id;

  // Try to generate a unique ID,
  // i.e. one that isn't in the previous.
  while (!id && retries < UNIQUE_RETRIES) {
    id = generate(idLen);
    if (previous.indexOf(id) !== -1) {
      id = null;
      retries++;
    }
  }
  return id;
}

export function encrypt(uid, secret) {
  const crypto = require('crypto-js');
  return crypto.AES.encrypt(uid, secret,
    {
      keySize: 128 / 8,
      iv: secret,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7
    }).toString();
}

export function decrypt(data, secret) {
  const crypto = require('crypto-js');
  return (crypto.AES.decrypt(data, secret,
    {
      keySize: 128 / 8,
      iv: secret,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7
    })).toString(crypto.enc.Utf8);
}




