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
app.get('/sendmail', (req: Request, res: Response) => { 
    for(let i = 1; i < 13; i++){
        queue.createJob('send-email',{
            data: i
        })
        .priority("high") // default is 'normal'
        .ttl(60000) // Time To Live: default 2000ms
        .attempts(3) // default is 1
        .save();
    }
    return res.send('Sending email...');
});

// processing send mail under background
queue.process("send-email", (job: Job, done: DoneCallback) => {  
    console.log("worker run");
    axios
        .get("https://my-json-server.typicode.com/minhnhat2904/job-queue/list/" + job.data.data)
        .then(result => {
            let t0 = performance.now();            
            mailOptions.to = result.data.gmail;
            transporter.sendMail(mailOptions, function(err:any, info: any){
                if (err) {
                    console.log(err);
                    done(err);
                } else {
                    console.log('Message sent to ' + result.data.gmail);
                    setTimeout(() => {
                        done();
                    }, 2000); 
                }
                let t1 = performance.now();
                console.log(`send email to ${result.data.gmail} took ${(t1 - t0)} milliseconds.`)
            });
        })
        .catch(err => {
            done(err);
        });
});

app.use("/kue-api/", kue.app);

app.listen(port, () => {
    console.log("Listening on port " + port);

})

export = queue;