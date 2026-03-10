import app from "./app";

app.listen(process.env.PORT, () => {
    console.log(`Server listening at PORT ${process.env.PORT}`,);
});