import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  keywords: { type: [String], required: true }, // ["đau răng", "ê buốt"]
  reply: { type: String, required: true },
  services: [
    {
      slug: { type: String, required: true },
      name: { type: String, required: true }
    }
  ]
});

const Symptom = mongoose.models.Symptom || mongoose.model("Symptom", symptomSchema);
export default Symptom;
