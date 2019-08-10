
import { Request, Response } from 'express'
import { to, renderResponse, generateUniqueId, OTPSend, EmailSend } from '../../util/helper';
import { validateCustomerRegisteration, validateCustomerChangePassword, validateDriverRegisteration, validateLocation } from '../../util/Validators';
import { UserDao } from '../../dao/_index'
import { Codes } from '../../util/SiteConfig';
import * as jwt from 'jsonwebtoken';

import * as _ from 'lodash';

export async function register(req: Request, res: Response): Promise<any> {
    try {
        let err: any, result: any, user: any, driverProfile: any;
        let finalResponse: any = {
            code: Codes.CREATED,
            data: {},
            message: "Driver registrated successfully !!"
        };
        [err, result] = await to(validateDriverRegisteration(req));

        renderResponse(res, result, null, null);

        req.body.role = 2;
        [err, user] = await to(UserDao.findCustomerByEmailOrPhone(req.body))

        if (err) throw err;

        if (user) {
            if (req.body.mobile.replace(/ +?/g, '') == user.mobile)
                throw new Error("User already exist with this mobile number");


            else if (req.body.email.toLowerCase() == user.email)
                throw new Error("User already exist with this email address");
        }

        req.body.verifyOTP = generateUniqueId(null, 6);
        req.body.isVerified = 1;
        [err, user] = await to(UserDao.register(req.body))

        if (err) throw err;


        [err, driverProfile] = await to(UserDao.setDriverProfile(req.body, user))

        if (err) throw err;
        _.extend(user, driverProfile);
        finalResponse.data.user = user;

        renderResponse(res, null, null, finalResponse);

        user.subject = " Rabbitrun Driver Registration";
        user.html = `<p>Hello ${user.name},</p>

        <p> your account  is created successfully . you email address is ${user.email} and password would be ${user.password} for login.</p>
        
        <p>Regards,</p>
        
        <p>RabbitRun Team</p>
        `;
        //OTPSend(user);
        EmailSend(user);

    } catch (e) {
        renderResponse(res, null, e, null);
    }


}

export async function updateDriverLocation(req: Request, res: Response): Promise<any> {
    try {

        let err: any, result: any, user: any, driverProfile: any, device: any;
        let finalResponse: any = {
            code: Codes.OK,
            data: {},
            message: "Location updated successfully !!"
        };


        [err, result] = await to(validateLocation(req));

        if (result && !result.isEmpty()) {
            renderResponse(res, result, null, null);
        }
        req.body.id = req.body.user.id;
        [err, device] = await to(UserDao.updateDriverLocation(req.body))

        if (err) throw err;

        renderResponse(res, null, null, finalResponse);

    } catch (e) {
        renderResponse(res, null, e, null);
    }


}


export async function nearByDrivers(req: Request, res: Response): Promise<any> {
    try {

        let err: any, result: any, user: any, driverProfile: any, device: any;
        let finalResponse: any = {
            code: Codes.OK,
            data: {
                drivers:[]
            },
            message: "Drivers listed successfully !!"
        };


        [err, result] = await to(validateLocation(req));

        if (result && !result.isEmpty()) {
            renderResponse(res, result, null, null);
        }
        
        req.body.id = req.body.user.id;

        [err, finalResponse.data.drivers] = await to(UserDao.nearByDrivers(req.body))

        if (err) throw err;

        renderResponse(res, null, null, finalResponse);

    } catch (e) {
        renderResponse(res, null, e, null);
    }


}


export async function login(req: Request, res: Response): Promise<any> {
    try {

        let err: any, result: any, user: any, driverProfile: any, device: any;
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

        [err, driverProfile] = await to(UserDao.getDriverById(user.id))
        console.log("driverProfile =========");
        console.log(driverProfile);

        _.extend(user, driverProfile);

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

