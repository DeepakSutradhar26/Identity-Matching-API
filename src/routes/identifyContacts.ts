import {prisma} from "../lib/prisma";
import { Request, Response } from "express";

export const identityMatching = async(req : Request, res : Response) => {
    try{
        const {email, phoneNumber} = req.body;

        if(!email && !phoneNumber){
            return res.status(400).json({error : "Either email or phone number is required"});
        }

        // Find all matching contact [1, 2, 3, ...]
        const matchedContacts = await prisma.contact.findMany({
            where : {
                OR : [
                    {email : email || null},
                    {phoneNumber : phoneNumber || null}
                ]
            }
        });

        // If no matching contact found, just create one in db and send response
        if(matchedContacts.length === 0){
            const newContact = await prisma.contact.create({
                data : {
                    email : email || null,
                    phoneNumber : phoneNumber || null,
                    linkPrecedence : "primary"
                }
            });

            return res.status(200).json({
                contact : {
                    primaryContactId : newContact.id,
                    emails : newContact.email ? [newContact.email] : [],
                    phoneNumbers : newContact.phoneNumber ? [newContact.phoneNumber] : [],
                    secondaryContactIds : []
                }
            });
        }

        const primaryIds = new Set<number>();
        
        // Get all primary ids either from linkedId or id [p1, p2, p3, ...]
        matchedContacts.forEach(c => primaryIds.add(c.linkedId || c.id));

        // Find all related contacts from primary ids [p1 -> [s1, s2, ...], p2 -> [s3, ...]]
        // Sorted by primary contacts then createdAt
        const allRelatedContacts = await prisma.contact.findMany({
            where : {
                OR : [
                    {id : {in : Array.from(primaryIds)}},
                    {linkedId : {in : Array.from(primaryIds)}}
                ]
            },
            orderBy : {
                createdAt : "asc"
            }
        });

        const primaryContact = allRelatedContacts[0];

        // Update all contacts since new primary contact case can also occur
        const secondaryContacts = allRelatedContacts.slice(1);

        const newEmail = email && !(allRelatedContacts.some(c => c.email == email));
        const newPhone = phoneNumber && !(allRelatedContacts.some(c => c.phoneNumber == phoneNumber));

        // Only if new email or phone otherwise same person can make multiple request
        if(newEmail || newPhone){
            const newContact = await prisma.contact.create({
                data : {
                    email : email,
                    phoneNumber : phoneNumber,
                    linkedId : primaryContact.id,
                    linkPrecedence : "secondary"
                }
            });

            secondaryContacts.push(newContact);
        }

        await prisma.contact.updateMany({
            where : {
                id : {in : Array.from(secondaryContacts.map(c => c.id))}
            },
            data : {
                linkedId : primaryContact.id,
                linkPrecedence : "secondary"
            }
        });

        return res.status(200).json(formatResponse(primaryContact, secondaryContacts));
    }catch(err:any){
        console.log(err);
        res.status(500).json({error: err.message || "Internal Server Error"});
    }
}

function formatResponse(primary : any, secondary : any[]){
    const emailList = new Set<String>();
    const phoneList = new Set<String>();

    if(primary.email != null){
        emailList.add(primary.email);
    }

    if(primary.phoneNumber != null){
        phoneList.add(primary.phoneNumber);
    }

    secondary.forEach(c => {
        if(c.email != null){
            emailList.add(c.email);
        }
        if(c.phoneNumber != null){
            phoneList.add(c.phoneNumber);
        }
    });

    return {
        contact : {
            primaryContactId : primary.id,
            emails : Array.from(emailList),
            phoneNumbers : Array.from(phoneList),
            secondaryContactIds : secondary.map(c => c.id)
        }
    }
}