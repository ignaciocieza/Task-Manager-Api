const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'otro@mail.com',
        subject: 'hi!!',
        text: `Welcome to the app:${name} `
    });
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'otro@mail.com',
        subject: 'Bye Bye!!',
        text: `No one gonna miss you, ${name}! `
    })
}


module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}