import { Request, Response } from "express";
import express from 'express';
import kue, { DoneCallback, Job } from 'kue';
import axios from "axios";

const app = express();
const port = 3000;

const queue = kue.createQueue();

app.get('/', (req: Request, res: Response) => {
    for (let i = 1; i <= 20; i++) {
        queue
            .create("queue example", {
                title: "This testing request",
                data: i
            })
            .priority("high")
            .save();
    }
    return res.send('Hello');
});

queue.process("queue example", (job: Job, done: DoneCallback) => {
    axios
        .get("https://jsonplaceholder.typicode.com/todos/" + job.data.data)
        .then(result => {
            console.log(result.data);
            setTimeout(() => {
                done();
            }, 2000);
            
            return result.data;
        })
        .catch(err => {
            done(err);
        });

})

app.use("/kue-api/", kue.app);

app.listen(port, () => {
    console.log("Listening on port " + port);

})