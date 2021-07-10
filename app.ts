import { Request, Response } from "express";
import express from 'express';
import kue, { DoneCallback, Job } from 'kue';
import axios from "axios";
import { transporter, mailOptions } from './configMail';
import { performance } from 'perf_hooks';

const app = express();
const port = 3000;

const queue = kue.createQueue();

// edit email list
const toEmails = ['huyviet2582000@gmail.com', 'huyviet2182000@gmail.com'];

app.get('/', (req: Request, res: Response) => { 
    toEmails.forEach(email => {
        queue.createJob("send-email", {
            email
        })
        .priority("high") // default is 'normal'
        .ttl(4000) // Time To Live: default 2000ms
        .attempts(3) // default is 1
        .save();
    });

    return res.send('Hehe bro');
});


queue.process("send-email", (job: Job, done: DoneCallback) => {  
    console.log("worker run");

    let t0 = performance.now();

    mailOptions.to = job.data.email;
    transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            console.log(err);
            done(err);
        } else {
            console.log('Message sent to ' + job.data.email);
            setTimeout(() => {
                done();
            }, 2000); 
        }
        let t1 = performance.now();
        console.log(`send email to ${job.data.email} took ${(t1 - t0)} milliseconds.`)
    });
});

app.use("/kue-api/", kue.app);

app.listen(port, () => {
    console.log("Listening on port " + port);

})