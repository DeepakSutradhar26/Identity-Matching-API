import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = 3000;

app.listen(PORT, async() => {
    try{
        await prisma.$connect();
        console.log("Prisma connected");

        const result = await prisma.$queryRaw`SELECT 1`;
        console.log("Database query success:", result);
    }catch(error:any){
        console.log("Database error", error);
    }
    console.log(`Server listening at PORT ${PORT}`,);
});