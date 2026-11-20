"use client";import{Printer}from"lucide-react";export function PrintButton(){return <button className="btn secondary no-print" onClick={()=>window.print()}><Printer size={18}/>Басып шығару</button>}
