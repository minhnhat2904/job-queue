import { Request, Response } from "express";
import express from 'express';
import kue, { DoneCallback, Job } from 'kue';
import axios from "axios";
import { transporter, mailOptions } from './configMail';
import { performance } from 'perf_hooks';
import {join}  from 'path';


const app = express();
const port = 3000;
const ROOT_DIR = process.cwd();
const PUBLIC_PATH = join(ROOT_DIR, 'public');
const VIEW_PATH = join(ROOT_DIR,'views');
const queue = kue.createQueue();

app.set('view engine', 'pug');
app.set('views',VIEW_PATH);
app.use(express.static(PUBLIC_PATH));

app.get('/', (req: Request, res: Response) => {
    return res.render('home.pug');
})

// create jobs
app.get('/sendmail', async (req: Request, res: Response) => { 
    const emailList = await axios.get("https://my-json-server.typicode.com/minhnhat2904/job-queue/list/");
    const emailAddressList = emailList.data.map((email: any) => email.emailAddress);

    emailAddressList.forEach((emailAddress: any) => { 
        queue.createJob('send-email', {
            emailAddress
        })
        .priority("high") // default is 'normal'
        .ttl(5000) // Time To Live: default 2000ms
        .attempts(3) // default is 1
        .save();
    })
    
    return res.send(`Sending to ${emailList.data.length} email...`);
});

// processing send mail under background
queue.process("send-email", (job: Job, done: DoneCallback) => {  
    let emailAddress = job.data.emailAddress;
    console.log(`start worker sent email to ${emailAddress}`);
    let startTime = performance.now();   
    
    mailOptions.to = emailAddress;
    transporter.sendMail(mailOptions, function(err:any, info: any){
        if (err) {
            console.log(`Gửi tới email ni fail rồi bro: ${emailAddress}, err: ${err}`);
            done(err);
        } else {
            console.log(`sent email to ${emailAddress} took ${(performance.now() - startTime)} milliseconds.`)
            done();
        }
    });
});

app.use("/kue-api/", kue.app);

app.listen(port, () => {
    console.log("Listening on port " + port);

})

export = queue;