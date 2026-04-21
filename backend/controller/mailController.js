import nodemailer from "nodemailer"

export const sendMailController=async(req,res)=>{
    
  try {
    const { mailTo, sendText } = req.body; // Assuming `mailTo` is passed as part of the request body

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: '2332vm@gmail.com',
            pass: "gvomjgrtpvairicg"
        }
    });
    
    const mailOptions = {
        from: '2332vm@gmail.com', 
        to: mailTo, // Use the `mailTo` variable here
        subject: "Life Link.....", 
        text:sendText
    };
    
    try {
        const data = await transporter.sendMail(mailOptions);
        res.status(200).send({
            success: true,
            message: "Email sent",
            data
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to send email",
            error: error.message
        });
    }
  
   } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:"mail not sent",
      error
    })
   }
}