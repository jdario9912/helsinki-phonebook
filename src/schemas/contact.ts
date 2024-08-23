import { Schema, model } from "mongoose";

const contactSchema = new Schema({
  name: String,
  number: String,
});

contactSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

contactSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Contact = model("Contact", contactSchema);

export default Contact;
