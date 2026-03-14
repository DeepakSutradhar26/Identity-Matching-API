import request from "supertest";
import app from "../src/app";
import {prisma} from "../src/lib/prisma";

describe("POST /identify", () => {
    beforeAll(async () => {
        await prisma.contact.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test("When email and phone number both are missing", async () => {
        const res = await request(app)
        .post("/identify")
        .send({});

        expect(res.status).toBe(400);
    });

    test("Create new primary contact when their is none", async () => {
        const res = await request(app)
        .post("/identify")
        .send({email : "adam@gmail.com", phoneNumber : "3345"});

        const data = res.body.contact;

        expect(res.status).toBe(200);
        expect(data.primaryContactId).toBeDefined();
        expect(data.emails).toContain("adam@gmail.com");
        expect(data.phoneNumbers).toContain("3345");
        expect(data.secondaryContactIds).toBe([]);
    });

    test("When either email is matching", async () => {
        const primary = await prisma.contact.create({
            data : {
                email : "adam@gmail.com",
                phoneNumber : "4554",
                linkPrecedence : "primary",
            }
        });

        const res = await request(app)
        .post("/identify")
        .send({
            email : "adam@gmail.com",
            phoneNumber : "5668"
        });

        const data = res.body.contact;

        expect(res.status).toBe(200);
        expect(data.primaryContactId).toBe(primary.id);
        expect(data.emails.length).toBe(1);
        expect(data.phoneNumbers.length).toBe(2);
        expect(data.secondaryContactIds.length).toBe(1);
    });

    test("When either phone number is matching", async () => {
        const primary = await prisma.contact.create({
            data : {
                email : "adam@gmail.com",
                phoneNumber : "4554",
                linkPrecedence : "primary",
            }
        });

        const res = await request(app)
        .post("/identify")
        .send({
            email : "gkfs@gmail.com",
            phoneNumber : "4554"
        });

        const data = res.body.contact;

        expect(res.status).toBe(200);
        expect(data.primaryContactId).toBe(primary.id);
        expect(data.emails.length).toBe(2);
        expect(data.phoneNumbers.length).toBe(1);
        expect(data.secondaryContactIds.length).toBe(1);
    });

    test("When primary becomes secondary contact", async () => {
        const primary = await prisma.contact.create({
            data : {
                email : "george@hillvalley.edu",
                phoneNumber : "919191",
                linkPrecedence : "primary",
            }
        });

        const secondary = await prisma.contact.create({
            data : {
                email : "biffsucks@hillvalley.edu",
                phoneNumber : "717171",
                linkPrecedence : "primary",
            }
        });

        const res = await request(app)
        .post("/identify")
        .send({
            email : "george@hillvalley.edu",
            phoneNumber : "717171",
        });

        const data = res.body.contact;

        expect(res.status).toBe(200);
        expect(data.primaryContactId).toBe(primary.id);
        expect(data.emails.length).toBe(2);
        expect(data.phoneNumbers.length).toBe(2);
        expect(data.secondaryContactIds).toBe([secondary.id]);
    });

    test("Does not create duplicate contacts", async () => {
        const primary = await prisma.contact.create({
            data : {
                email : "george@hillvalley.edu",
                phoneNumber : "919191",
                linkPrecedence : "primary",
            }
        });

        const res = await request(app)
        .post("/identify")
        .send({
            email : "george@hillvalley.edu",
            phoneNumber : "919191",
        });

        const data = res.body.contact;

        expect(res.status).toBe(200);
        expect(data.primaryContactId).toBe(primary.id);
        expect(data.emails.length).toBe(1);
        expect(data.secondaryContactIds).toBe([]);
    });
});