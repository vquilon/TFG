var nodemailer = require('nodemailer'); // email sender 

function exports.sendEmail = function(to, text){
   var transporter = nodemailer.createTransport({
       service: 'Gmail',
       auth: {
           user: 'example@gmail.com',
           pass: 'password'
       }
  });

  var mailOptions = {
         from: 'Web Prosumer',
         to: to,
         subject: 'Medidas alcanzadas',
         text: text
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error){
          console.log(error);
      } else {
          console.log("Email sent");
      }
  });
};

