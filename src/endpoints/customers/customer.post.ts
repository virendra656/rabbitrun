
import { Request, Response } from 'express'
import { to, renderResponse, generateUniqueId, OTPSend, EmailSend } from '../../util/helper';
import { validateCustomerRegisteration, validateCustomerChangePassword } from '../../util/Validators';
import { UserDao } from '../../dao/_index'
import { Codes } from '../../util/SiteConfig';
import * as jwt from 'jsonwebtoken';

import * as _ from 'lodash';

export async function register(req: Request, res: Response): Promise<any> {
    try {
        let err: any, result: any, user: any, customerProfile: any;
        let finalResponse: any = {
            code: Codes.CREATED,
            data: {},
            message: "Registrated successfully !! We have sent you an otp please verify your mobile number"
        };

        [err, result] = await to(validateCustomerRegisteration(req));

        renderResponse(res, result, null, null);





        [err, user] = await to(UserDao.findCustomerByEmailOrPhone(req.body))

        if (err) throw err;

        if (user) {
            if (req.body.mobile.replace(/ +?/g, '') == user.mobile)
                throw new Error("User already exist with this mobile number");


            else if (req.body.email.toLowerCase() == user.email)
                throw new Error("User already exist with this email address");
        }

        req.body.verifyOTP = generateUniqueId(null, 6);

        [err, user] = await to(UserDao.register(req.body))

        if (err) throw err;


        [err, customerProfile] = await to(UserDao.setCustomerProfile(req.body, user))

        if (err) throw err;

        finalResponse.data.user = user;

        renderResponse(res, null, null, finalResponse);

        user.message = user.verifyOTP + " is your one time password  to verify your account";
        user.subject = " Rabbitrun Registration";
        user.html = `<p>Hello ${user.name},</p>

        <p>${user.verifyOTP} is your one time password for to verify your account account.</p>
        
        <p>Regards,</p>
        
        <p>RabbitRun Team</p>
        `;
        OTPSend(user);
        //EmailSend(user);

    } catch (e) {
        renderResponse(res, null, e, null);
    }


}

export async function login(req: Request, res: Response): Promise<any> {
    try {

        let err: any, result: any, user: any, customerProfile: any ,device :any;
        let finalResponse: any = {
            code: Codes.OK,
            data: {},
            message: "Logged in successfully !!"
        };

        if (!req.body.email_or_mobile && !req.body.password) {
            throw new Error("Insufficent credentials");
        }


        [err, user] = await to(UserDao.login(req.body))

        if (err) throw err;


        if (!user) {
            if (req.body.email_or_mobile.indexOf("@") > -1)
                throw new Error("Incorrect password or email");
            else
                throw new Error("Incorrect password or mobile number");
        }
/* 
        if (user.isVerified == 0)
            throw new Error("Your mobile number is not verified yet"); */


        req.body.id = user.id;
        if (req.body.deviceType && req.body.deviceToken) {
            
        [err, device] = await to(UserDao.updateDevice(req.body))

        if (err) throw err;
        }

        [err, customerProfile] = await to(UserDao.getCustomerById(user.id))

        _.extend(user, customerProfile);

        let token = jwt.sign({
            data: user
        }, process.env.EncryptionKEY, { expiresIn: '7d' });


        finalResponse.data.token = token;
        finalResponse.data.user = user;

        renderResponse(res, null, null, finalResponse);

    } catch (e) {
        renderResponse(res, null, e, null);
    }


}

export async function forgotPassword(req: Request, res: Response): Promise<any> {
    try {
        console.log("req", req.body);
        let err: any, result: any, user: any, customerProfile: any;
        let finalResponse: any = {
            code: Codes.OK,
            data: {},
            message: "otp sent successfully on "
        };

        if (!req.body.email_or_mobile) {
            throw new Error("Please enter valid email or mobile number");
        }

        req.body.email = req.body.email_or_mobile;
        req.body.mobile = req.body.email_or_mobile;
        [err, user] = await to(UserDao.findCustomerByEmailOrPhone(req.body))

        if (err) throw err;

        if (!user) {
            if (req.body.email_or_mobile.indexOf("@") > -1)
                throw new Error("Incorrect email address");
            else
                throw new Error("Incorrect mobile number");
        }
/* 
        if (user.isVerified == 0)
            throw new Error("Your mobile number is not verified yet"); */

        user.forgotPasswordOTP = generateUniqueId(null, 6);

        [err, customerProfile] = await to(UserDao.updateOTP(user))

        if (err) throw err;

        user.message = user.forgotPasswordOTP + " is your one time password  to change your password";
        user.subject = " Forgot Password on Rabbitrun";
        user.html = `<p>Hello User,</p>

        <p>${user.forgotPasswordOTP} is your one time password  to reset your password</p>
        
        <p>Regards,</p>
        
        <p>RabbitRun Team</p>
        `;
        if (req.body.email_or_mobile.indexOf("@") > -1) {
            EmailSend(user);

            finalResponse.message += "registered email address"
        }
        else {
            OTPSend(user);
            finalResponse.message += "registered mobile number"
        }



        finalResponse.data.user = user;

        renderResponse(res, null, null, finalResponse);

    } catch (e) {
        renderResponse(res, null, e, null);
    }


}

export async function verifyAccount(req: Request, res: Response): Promise<any> {
    try {
        let err: any, result: any, user: any, customerProfile: any;
        let finalResponse: any = {
            code: Codes.OK,
            data: {},
            message: "Account verified successfully"
        };

        if (!req.body.verifyOTP) {
            throw new Error("otp is missing");
        }


        [err, user] = await to(UserDao.findUserByOTP(req.body))

        if (err) throw err;

        if (!user) {
            throw new Error("Incorrect OTP");
        }

        if (user.isVerified == 1)
            throw new Error("Your account is already verified");


        [err, customerProfile] = await to(UserDao.verifyAccount(user))

        if (err) throw err;
        user.isVerified = 1;
        finalResponse.data.user = user;

        renderResponse(res, null, null, finalResponse);

    } catch (e) {
        renderResponse(res, null, e, null);
    }


}

export async function getBusinessCategories(req: Request, res: Response): Promise<any> {
    try {
        let err: any, result: any, categories: any, customerProfile: any;
        let finalResponse: any = {
            code: Codes.OK,
            data: {},
            message: "Categories found"
        };


        [err, categories] = await to(UserDao.getBusinessCategories())

        if (err) throw err;

        finalResponse.data.categories = categories;

        renderResponse(res, null, null, finalResponse);

    } catch (e) {
        renderResponse(res, null, e, null);
    }


}

export async function changePassword(req: Request, res: Response): Promise<any> {
    try {
        let err: any, result: any, user: any, customerProfile: any;
        let finalResponse: any = {
            code: Codes.OK,
            data: {},
            message: "Password reset successfully"
        };


        [err, result] = await to(validateCustomerChangePassword(req));

        renderResponse(res, result, null, null);



        [err, user] = await to(UserDao.findUserByOTP(req.body))

        if (err) throw err;

        if (!user) {
            throw new Error("Incorrect OTP");
        }
/* 
        if (user.isVerified == 0)
            throw new Error("Your account is not verified yet"); */


        [err, customerProfile] = await to(UserDao.changePassword(req.body))

        if (err) throw err;

        finalResponse.data.user = user;

        renderResponse(res, null, null, finalResponse);

    } catch (e) {
        renderResponse(res, null, e, null);
    }


}