import {clsx,type ClassValue} from "clsx";import {twMerge} from "tailwind-merge";export const cn=(...x:ClassValue[])=>twMerge(clsx(x));
export function normalizeAnswer(v:string){return v.trim().toLocaleLowerCase("kk").replace(/\s+/g," ").replace(/[.,!?;:]+$/g,"")}
export function scoreAnswers(questions:{id:string;points:number;correct:string[]}[],answers:Record<string,string[]>){return questions.reduce((s,q)=>s+(q.correct.length===answers[q.id]?.length&&q.correct.every(x=>answers[q.id].includes(x))?q.points:0),0)}
