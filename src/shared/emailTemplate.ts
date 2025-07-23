import { ICreateAccount, IResetPassword } from "../types/emailTemplate";

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: "Verify your account",
    html: `
    <body style="margin: 0 !important; padding: 0 !important; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto; max-width: 600px; background-color: #ffffff; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
            <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background-color: #ffffff;">
                    <div style="font-size: 32px; font-weight: 300; color: #b8b095; letter-spacing: 2px; margin-bottom: 40px;">
                        re-wears
                    </div>
                    <div style="margin: 20px 0 40px; text-align: center;">
                        <div style="width: 280px; height: 160px; margin: 0 auto; position: relative; display: inline-block;">
                            <div style="width: 90px; height: 160px; background-color: #2c2c2c; border: 3px solid #2c2c2c; border-radius: 20px; position: absolute; left: 20px; top: 0;">
                                <div style="width: 78px; height: 140px; background-color: #ffffff; border-radius: 15px; position: absolute; top: 6px; left: 6px;">
                                    <div style="width: 20px; height: 4px; background-color: #2c2c2c; border-radius: 2px; position: absolute; top: 8px; left: 29px;"></div>
                                    <div style="width: 40px; height: 40px; background-color: #b8b095; border-radius: 50%; position: absolute; top: 50px; left: 19px; display: flex; align-items: center; justify-content: center;">
                                        <div style="width: 12px; height: 6px; border-left: 3px solid #ffffff; border-bottom: 3px solid #ffffff; transform: rotate(-45deg); margin-top: -3px;"></div>
                                    </div>
                                </div>
                            </div>
                            <div style="width: 120px; height: 160px; position: absolute; right: 20px; top: 0;">
                                <div style="width: 100px; height: 140px; border: 2px solid #2c2c2c; border-radius: 5px; position: absolute; right: 0; top: 10px; background-color: #ffffff;">
                                    <div style="width: 40px; height: 40px; border: 1px solid #d0d0d0; position: absolute; top: 15px; left: 10px;"></div>
                                    <div style="width: 40px; height: 40px; border: 1px solid #d0d0d0; position: absolute; top: 15px; right: 10px;"></div>
                                    <div style="width: 40px; height: 40px; border: 1px solid #d0d0d0; position: absolute; bottom: 30px; left: 10px;"></div>
                                    <div style="width: 40px; height: 40px; border: 1px solid #d0d0d0; position: absolute; bottom: 30px; right: 10px;"></div>
                                    <div style="width: 4px; height: 4px; background-color: #2c2c2c; border-radius: 50%; position: absolute; right: 15px; top: 65px;"></div>
                                </div>
                                <div style="width: 104px; height: 6px; background-color: #2c2c2c; position: absolute; right: -2px; top: 8px;"></div>
                                <div style="width: 6px; height: 144px; background-color: #2c2c2c; position: absolute; right: -4px; top: 8px;"></div>
                                <div style="width: 6px; height: 144px; background-color: #2c2c2c; position: absolute; left: 96px; top: 8px;"></div>
                            </div>
                            <div style="width: 35px; height: 80px; position: absolute; left: 140px; bottom: 0;">
                                <img src="https://res.cloudinary.com/dabd4udau/image/upload/v1751207222/n70qrjvilechglrvndqw.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding: 0 40px 40px; text-align: center;">
                    <h1 style="font-size: 28px; font-weight: 600; color: #2c2c2c; margin: 0 0 30px; line-height: 1.3;">
                        Email Verification Required
                    </h1>
                    <p style="font-size: 16px; color: #666666; margin: 0 0 30px; line-height: 1.5;">
                        ${values.name},
                    </p>
                    <p style="font-size: 16px; color: #666666; margin: 0 0 30px; line-height: 1.5; padding: 0 20px;">
                        Thank you for signing up with re-wears! To complete the
                        verification process, please enter the following code.
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 30px; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tr>
                            <td style="background-color: #f8f9fa; border: 2px dashed #b8b095; border-radius: 8px; padding: 20px 40px; text-align: center;">
                                <div style="font-size: 24px; font-weight: 700; color: #2c2c2c; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                                    ${values.otp}
                                </div>
                            </td>
                        </tr>
                    </table>
                    <p style="font-size: 14px; color: #999999; margin: 0 0 30px; line-height: 1.5;">
                        This code expires in 30 minutes and can only be used once.
                        Please ensure timely completion.
                    </p>
                    <p style="font-size: 14px; color: #999999; margin: 0; line-height: 1.5; padding: 0 20px;">
                        If you did not initiate this request or do not have an account with re-wears,
                        you may disregard this email.
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px; text-align: center; background-color: #b8b095;">
                    <div style="margin-bottom: 20px;">
                        <a href="#" style="display: inline-block; margin: 0 10px; width: 30px; height: 30px; background-color: rgba(255,255,255,0.2); border-radius: 50%; text-decoration: none; line-height: 30px; text-align: center;">
                            <span style="color: #ffffff; font-size: 14px;">@</span>
                        </a>
                        <a href="#" style="display: inline-block; margin: 0 10px; width: 30px; height: 30px; background-color: rgba(255,255,255,0.2); border-radius: 50%; text-decoration: none; line-height: 30px; text-align: center;">
                            <span style="color: #ffffff; font-size: 14px;">f</span>
                        </a>
                    </div>
                    <p style="font-size: 12px; color: #ffffff; line-height: 1.6; margin: 0; max-width: 400px; margin: 0 auto;">
                        We're sending you this email to comply with our Terms and Conditions as you have
                        previously signed up on our site. Don't want to receive these emails? You can
                        <a href="#" style="color: #ffffff; text-decoration: underline;">unsubscribe</a> at any time or
                        <a href="#" style="color: #ffffff; text-decoration: underline;">contact us</a> from our website. We hope
                        you continue to have a wonderful time shopping online with us!
                    </p>
                </td>
            </tr>
        </table>
    </body>
    `,
  };

  return data;
};

const resetPassword = (values: IResetPassword) => {
    const data = {
        to: values.email,
        subject: "Reset your password",
        html: `
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="padding: 40px 40px 20px; text-align: center; background-color: #ffffff;">
                    <div style="font-size: 32px; font-weight: 300; color: #b8b095; letter-spacing: 2px; margin-bottom: 40px;">
                        re-wears
                    </div>
                </div>
                <img src="https://res.cloudinary.com/dabd4udau/image/upload/v1753263876/qn93vgcydyy8bsniu4ru.jpg" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
                <div style="padding: 0 40px 40px; text-align: center;">
                    <h1 style="font-size: 28px; font-weight: 600; color: #2c2c2c; margin: 0 0 30px; line-height: 1.3;">
                        Let's make sure it's really you
                    </h1>
                    <p style="font-size: 16px; color: #666666; margin: 0 0 30px; line-height: 1.5;">
                        Hi ${values.email},
                    </p>
                    <p style="font-size: 16px; color: #666666; margin: 0 0 30px; line-height: 1.5; padding: 0 20px;">
                        You have asked to reset your password on re-wears. To keep<br />
                        things secure, we just need to verify your email.
                    </p>
                    <div style="background-color: #b8b095; color: #ffffff; padding: 15px 30px; border-radius: 25px; display: inline-block; font-size: 18px; font-weight: 600; letter-spacing: 2px; margin: 0 0 30px;">
                        ${values.otp}
                    </div>
                    <p style="font-size: 14px; color: #999999; margin: 0 0 30px; line-height: 1.5;">
                        This code expires in 3 minutes and can only be used once.<br />
                        Please ensure timely completion.
                    </p>
                    <p style="font-size: 14px; color: #999999; margin: 0; line-height: 1.5; padding: 0 20px;">
                        If you did not initiate this request or do not have an account with re-wears,<br />
                        you may disregard this email.
                    </p>
                </div>
                <div style="padding: 40px; text-align: center; background-color: #b8b095;">
                    <div style="margin-bottom: 20px;">
                        <a href="#" style="display: inline-block; margin: 0 10px; width: 30px; height: 30px; background-color: rgba(255,255,255,0.2); border-radius: 50%; text-decoration: none; line-height: 30px; text-align: center; color: #ffffff; font-size: 14px;">
                            @
                        </a>
                        <a href="#" style="display: inline-block; margin: 0 10px; width: 30px; height: 30px; background-color: rgba(255,255,255,0.2); border-radius: 50%; text-decoration: none; line-height: 30px; text-align: center; color: #ffffff; font-size: 14px;">
                            f
                        </a>
                    </div>
                    <p style="font-size: 12px; color: #ffffff; line-height: 1.6; margin: 0; max-width: 400px; margin: 0 auto;">
                        We're sending you this email to comply with our Terms and Conditions as you have<br />
                        previously signed up on our site. Don't want to receive these emails? You can
                        <a href="#" style="color: #ffffff; text-decoration: underline;">
                            unsubscribe
                        </a>
                        at any time or
                        <a href="#" style="color: #ffffff; text-decoration: underline;">
                            contact us
                        </a>
                        from our website. We hope<br />
                        you continue to have a wonderful time shopping online with us!
                    </p>
                </div>
            </div>
        </body>
        `,
    };
    return data;
};
const forgetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: "Forget password",
    html: `
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
                <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <img src="https://res.cloudinary.com/dabd4udau/image/upload/v1753261491/ttlyurasewxyfk5ghjtc.jpg" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
                    <div style="text-align: center;">
                          <tr>
                        <td style="padding: 0 40px 40px; text-align: center;">
                
                <!-- Title -->
                            <h1 style="font-size: 28px; font-weight: 600; color: #2c2c2c; margin: 0 0 30px; line-height: 1.3;">
                    Forgot your password?
                </h1>
                
                // <!-- Greeting -->
                <p style="font-size: 16px; color: #666666; margin: 0 0 40px; line-height: 1.5;">
                    Hi ${values.email},
                </p>
                
                <!-- CTA Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 40px; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                    <tr>
                        <td style="background-color: #a8a084; border-radius: 50px; text-align: center;">
                            <a href="#" style="display: inline-block; color: #ffffff; text-decoration: none; padding: 16px 40px; font-size: 16px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; line-height: 1;">
                                ${values.otp}
                            </a>
                        </td>
                    </tr>
                </table>
                
                // <!-- Disclaimer -->
                <p style="font-size: 14px; color: #999999; line-height: 1.5; margin: 0; padding: 0 20px;">
                    If you did not initiate this request or do not have an account<br>
                    with re-wears, you may disregard this email.
                </p>
                
            </td>
        </tr>
                    </div>
                </div>
            </body>
        `,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
  forgetPassword,
};
