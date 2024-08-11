import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from 'src/schemas/Question.schema';
import { HttpService } from '@nestjs/axios';
import { map,firstValueFrom } from 'rxjs';
import { Agent } from 'https';
import * as FormData from 'form-data';
import Groq from "groq-sdk";

@Injectable()
export class GenerativeAIService {
    private httpsAgent: Agent;
    private groq;
    constructor(private readonly httpService: HttpService) {
        this.httpsAgent = new Agent({ rejectUnauthorized: false });
        this.groq = new Groq({ apiKey: process.env.GROQ_KEY,httpAgent:this.httpsAgent});
     }

   async getTranscribe(file: Express.Multer.File){
    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    form.append('model', 'whisper-large-v3');
    form.append('temperature', '0');
    form.append('response_format', 'json');
    form.append('language', 'en');

    const response = await firstValueFrom(
        this.httpService.post('https://api.groq.com/openai/v1/audio/transcriptions', form, {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${process.env.GROQ_KEY}`,
          },
          httpsAgent:this.httpsAgent
        },)
      );

    console.log(response.data)
      return response.data?.text;
    }

    async getCompletion(question:string,answer:string){

        try {
            let response =  await this.groq.chat.completions.create({
                messages: [
                   {
                       "role": "system",
                       "content": "Generate a feedback report on an interview question response. The response is based on the provided transcript. Evaluate the candidate'\''s communication skills, including clarity, relevance, completeness, depth of knowledge, and correctness on the question and nothing else. Provide a rating for each criterion on a scale of 1 to 5. Offer constructive feedback on areas where the candidate excelled and areas that may need improvement. Clarity: How well did the candidate articulate their thoughts and ideas? Was the response easy to understand, with clear communication? Relevance: Did the response directly address the question asked? Was it on-topic and free from unrelated information? Completeness: Did the response provide a comprehensive answer, covering all aspects of the question, or did it leave out important details? Depth of Knowledge: Did the candidate demonstrate a deep understanding of the topic discussed? Were they able to provide insightful explanations and examples? Correctness: Was the information provided in the response accurate and free from factual errors?I want the response in json format and follow this format {clarity,relevance,completeness,depthOfKnowledge,correctness,feedback}"
                     },
                     {
                       "role": "user",
                       "content":  `Please provide feedback on the following interview question: ${question}. Based on the provided transcript: ${answer}`
                     }
                ],
                model: "llama3-8b-8192",
                temperature: 1,
                max_tokens: 1024,
                top_p: 1,
                stream: false,
                response_format: {
                   type: "json_object"
                 },
                "stop": null
              });
       let data = response?.choices[0]?.message?.content 
       return data
        } catch (error) {
            console.info(error?.error?.error?.failed_generation)
            let failedResponse = error?.error?.error?.failed_generation
            return failedResponse
        }
           
    }
}
