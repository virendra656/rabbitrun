"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function to(promise) {
    return promise.then(data => {
        return [null, data];
    })
        .catch(err => [err]);
}
exports.to = to;
function replaceEmailTemplateData(template, data) {
    const pattern = /\{(.*?)\}/g;
    return template.replace(pattern, (match, token) => data[token]);
}
exports.replaceEmailTemplateData = replaceEmailTemplateData;
function OTPSend(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((acc, rej) => {
            var request = require("request");
            var options = {
                method: 'POST',
                url: process.env.smsURL,
                headers: { 'Content-Type': 'application/json' },
                body: {
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
                    return rej(error);
                }
                ;
                console.log(body);
                acc(true);
            });
        }).catch((err) => {
            console.log("Error in sending mail");
            return Promise.reject(err);
        });
    });
}
exports.OTPSend = OTPSend;
function EmailSend(param) {
    return __awaiter(this, void 0, void 0, function* () {
        const nodemailer = require("nodemailer");
        return new Promise((acc, rej) => {
            let data = param;
            let err;
            let result;
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
            console.log("mail options", mailOptions);
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return rej(error);
                }
                else {
                    console.log(info);
                    return acc();
                }
            });
        }).catch((err) => {
            console.log("Error in sending mail");
            return Promise.reject(err);
        });
    });
}
exports.EmailSend = EmailSend;
function renderResponse(res, validation_err, err, data) {
    if (validation_err && !validation_err.isEmpty()) {
        let key = Object.keys(validation_err.mapped())[0];
        return res.status(200).json({ code: 400, message: validation_err.mapped()[key].msg, success: false, data: {} });
    }
    else if (err) {
        return res.status(200).json({ code: 500, message: err.message, success: false, data: {} });
    }
    else if (data) {
        let message = data.message || "";
        try {
            delete data.message;
        }
        catch (e) { }
        return res.status(200).json({ code: data.code || 200, message: message, success: true, data: data });
    }
}
exports.renderResponse = renderResponse;
function validateSchema(data, schema) {
    var jsv = require('json-validator');
    return new Promise((acc, rej) => {
        jsv.validate(data, schema, function (err, messages) {
            console.log(messages);
            if (err) {
                return rej(err);
            }
            else {
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
exports.validateSchema = validateSchema;
function checkNested(obj, params) {
    let args = params.split(".");
    for (var i = 0; i < args.length; i++) {
        if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
}
exports.checkNested = checkNested;
function parseQueryResponse(res) {
    let result = [];
    try {
        result = JSON.parse(JSON.stringify(res));
    }
    catch (e) {
        result = [];
    }
    return result;
}
exports.parseQueryResponse = parseQueryResponse;
function groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    });
}
exports.groupBy = groupBy;
function generate(idLen) {
    var ALPHABET = '123456789ABCDEFGHKMNPRSTVWXYZ';
    var rtn = '';
    for (var i = 0; i < idLen; i++) {
        rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
}
exports.generate = generate;
function generateUniqueId(previous, idLen) {
    var UNIQUE_RETRIES = 9999;
    previous = previous || [];
    var retries = 0;
    var id;
    while (!id && retries < UNIQUE_RETRIES) {
        id = generate(idLen);
        if (previous.indexOf(id) !== -1) {
            id = null;
            retries++;
        }
    }
    return id;
}
exports.generateUniqueId = generateUniqueId;
function encrypt(uid, secret) {
    const crypto = require('crypto-js');
    return crypto.AES.encrypt(uid, secret, {
        keySize: 128 / 8,
        iv: secret,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
    }).toString();
}
exports.encrypt = encrypt;
function decrypt(data, secret) {
    const crypto = require('crypto-js');
    return (crypto.AES.decrypt(data, secret, {
        keySize: 128 / 8,
        iv: secret,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
    })).toString(crypto.enc.Utf8);
}
exports.decrypt = decrypt;

//# sourceMappingURL=helper.js.map
