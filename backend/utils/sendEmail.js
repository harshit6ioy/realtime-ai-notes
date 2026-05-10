const nodemailer=require("nodemailer");
const sendEmail=async (to,otp)=>{
    try{
        const transporter=nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}.`
        })
    }catch(error){
        console.log("Email error: ",error);
    }
};
module.exports=sendEmail;