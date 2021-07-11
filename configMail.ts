import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter =  nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export var mailOptions = { // thiết lập đối tượng, nội dung gửi mail
    from: 'Team BE SGroup supercup',
    to: '',
    subject: 'QUEUE AND BACKGROUND JOB',
    text: 'You recieved message from me',
    html: 
    `<div>
        <div><img src='https://res.cloudinary.com/ddqzgiilu/image/upload/v1625981996/179546573_476241690296811_7153108016670037673_n_yzy2kd.jpg'></img></div>
        <h2>You are very lucky</h2>
        <p style='color: red; font-size: 24px'>Why you receive this email?</p>
        <p>Because you are in our black list, we will hack your facebook in next 2 days</p>
        <p style='color: blue;font-size: 24px'>What you can do?</p>
        <p>Laugh. Just laugh</p>
    </div>`
}