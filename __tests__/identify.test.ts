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
        
    });
});