import {prisma} from "../lib/prisma";
import { Request, Response } from "express";
import { Contact } from "@prisma/client";

export const identityMatching = async(req : Request, res : Response) => {
    const {email, phoneNumber} = await req.body;

    if(!email || !phoneNumber){
        return res.status(400).json({error : "Email or phone number is missing"});
    }

    const matchedContacts = await prisma.contact.findMany({
        where : {
            OR : [
                {email : email},
                {phoneNumber : phoneNumber}
            ]
        }
    });

    if(matchedContacts.length === 0){
        const newContact = await prisma.contact.create({
            data : {
                email,
                phoneNumber,
                linkPrecedence : "primary"
            }
        });

        return res.status(200).json({newContact, secondaryContactIds : []});
    }

    const allRelatedContacts = new Set<Contact>();

    matchedContacts.forEach(async(c)=> {
        const nestedMatchedContacts = await prisma.contact.findMany({
            where : {
                OR : [
                    {email : c.email},
                    {phoneNumber : phoneNumber},
                ]
            },
        });
        nestedMatchedContacts.forEach(c => {
            if(c.linkPrecedence === "primary"){
                allRelatedContacts.add(c);
            }
        });
    });

    
}