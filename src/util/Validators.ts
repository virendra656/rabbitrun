export async function validateCustomerRegisteration(req:any) : Promise <any>   {
    
  req.checkBody('name', 'Mobile is required').notEmpty()
  req.checkBody('address', 'Address is required').notEmpty()
  req.checkBody('latitude', 'Latitude is required').notEmpty()
  req.checkBody('longitude', 'Longitude is required').notEmpty()
  req.checkBody('businessType', 'Business type is required').notEmpty()
  req.checkBody('accountNumber', 'Account number is required').notEmpty()
  req.checkBody('ifsc', 'IFSC code is required').notEmpty()
  req.checkBody('bank_name', 'Bank name is required').notEmpty()
  req.checkBody('mobile', 'Mobile is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'A valid email is required').isEmail()

  return req.getValidationResult();

}




export async function validateDriverRegisteration(req:any) : Promise <any>   {
    
  req.checkBody('name', 'Mobile is required').notEmpty()
  req.checkBody('latitude', 'Latitude is required').notEmpty()
  req.checkBody('longitude', 'Longitude is required').notEmpty()
  req.checkBody('businessType', 'Business type is required').notEmpty()
  req.checkBody('mobile', 'Mobile is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'A valid email is required').isEmail()
  return req.getValidationResult();

}

export async function validateCustomerChangePassword(req:any) : Promise <any>   {
    
  req.checkBody('forgotPasswordOTP', 'OTP is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()

  return req.getValidationResult();

}

export async function validateLocation(req:any) : Promise <any>   {
    
  req.checkBody('latitude', 'latitude is required').notEmpty()
  req.checkBody('longitude', 'longitude is required').notEmpty()

  return req.getValidationResult();

}

