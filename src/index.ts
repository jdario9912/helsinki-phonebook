/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import { info } from "./libs/info";
import { type Contact } from "./types";
// import { uuid } from "./libs/uuid";
import { uknownEndpointLogger } from "./middlewares/loggers";
import morgan from "morgan";
import cors from "cors";
import { PORT } from "./config";
import { connectDB } from "./db/mongo";
import ContactModel from "./schemas/contact";

connectDB();

// MongoDB
const app = express();

app.use(express.static("client"));

app.use(express.json());
app.disable("x-powered-by");
app.use(cors({ origin: "http://localhost:5173" }));
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
morgan.token("body", (req: Request) => JSON.stringify(req.body));
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan(":method :url :status :response-time :body"));

app.get("/info", (_: Request, res: Response) => {
  return res.send(info());
});

app.get("/api/contacts", async (_: Request, res: Response) => {
  try {
    const contacts = await ContactModel.find({});
    return res.json(contacts);
  } catch (error) {
    if (error instanceof Error) res.statusMessage = "Internal server error";
    return res.status(500).end();
  }
});

app.get("/api/contacts/:id", (req: Request, res: Response) => {
  req;
  res;
});

app.delete("/api/contacts/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const deletedContact = await ContactModel.findByIdAndDelete(id);

    if (!deletedContact) {
      res.statusMessage = `Contact with id ${id} not found`;
      return res.status(404).end();
    }

    return res.status(204).end();
  } catch (error) {
    res.statusMessage = "Internal server error";
    return res.status(500).end();
  }

  res.statusMessage = `Contact with id ${id} deleted`;

  return res.status(204).end();
});

app.post("/api/contacts", async (req: Request, res: Response) => {
  const contactReq = req.body as Omit<Contact, "id">;

  try {
    const newContact = new ContactModel(contactReq);
    const savedContact = await newContact.save();
    console.log(savedContact);
    return res.json(savedContact);
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(500).json({ error: error.message });
  }
});

app.use(uknownEndpointLogger);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
