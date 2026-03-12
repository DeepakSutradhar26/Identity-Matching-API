import {prisma} from "../lib/prisma";
import { Request, Response } from "express";

export const identityMatching = async(req : Request, res : Response) => {
    const {email, phoneNumber} = await req.body;

    if(!email || !phoneNumber){
        return res.status(400).json({error : "Email or phone number is missing"});
    }

    const contacts = await prisma.contact.findMany({
        where : {
            OR : [
                {email : email},
                {phoneNumber : phoneNumber}
            ]
        }
    });

    if(contacts.length === 0){
        const newContact = await prisma.contact.create({
            data : {
                email,
                phoneNumber,
                linkPrecedence : "primary"
            }
        });

        return res.status(200).json({newContact, secondaryContactIds : []});
    }

    
}