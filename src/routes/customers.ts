import { Express } from 'express'
import { CustomerController } from '../endpoints/_index'
import { CONSTANTS } from '../util/SiteConfig';


export function routes(app: Express) {

  app.post(CONSTANTS.apiBasePath + 'customer/register', CustomerController.CustomerPost.register);
  app.post(CONSTANTS.apiBasePath + 'customer/login', CustomerController.CustomerPost.login);
  app.post(CONSTANTS.apiBasePath + 'customer/verifyAccount', CustomerController.CustomerPost.verifyAccount);
  app.post(CONSTANTS.apiBasePath + 'customer/forgotPassword', CustomerController.CustomerPost.forgotPassword);
  app.post(CONSTANTS.apiBasePath + 'customer/changePassword', CustomerController.CustomerPost.changePassword);
  app.post(CONSTANTS.apiBasePath + 'customer/getBusinessCategories', CustomerController.CustomerPost.getBusinessCategories);
}
