import nodemailer from 'nodemailer';

export const transporter =  nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'phancaominhnhat29@gmail.com',
        pass: 'minhnhat2904:)'
    }
});

export var mailOptions = { // thiết lập đối tượng, nội dung gửi mail
    from: 'Team BE SGroup supercup',
    to: 'huyviet2582000@gmail.com',
    subject: 'QUEUE AND BACKGROUND JOB',
    text: 'You recieved message from me',
    html: 
    `<div>
        <div><img src='https://res.cloudinary.com/ddqzgiilu/image/upload/v1625922959/123530478_367219177883513_9062475103320185042_n_fz9ce0.jpg'></img></div>
        <h2>You are very lucky</h2>
        <p style='color: red; font-size: 24px'>Why you receive this email?</p>
        <p>Because you are in our black list, we will hack your facebook in next 2 days</p>
        <p style='color: blue;font-size: 24px'>What you can do?</p>
        <p>Laugh. Just laugh</p>
    </div>`
}