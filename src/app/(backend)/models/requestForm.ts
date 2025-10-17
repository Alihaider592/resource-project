import mongoose, { Schema, Document } from "mongoose";

export interface IRequestFormField {
  key: string;         // field name (e.g., "fromDate")
  label: string;       // field label
  type: string;        // text, textarea, select, date
  options?: string[];  // if type is select
  required: boolean;
}

export interface IRequestForm extends Document {
  name: string;                  // e.g., "Leave Request", "WFH Request"
  endpoint: string;              // backend endpoint to submit (e.g., /api/user/leave)
  fields: IRequestFormField[];
}

const RequestFormSchema = new Schema<IRequestForm>({
  name: { type: String, required: true },
  endpoint: { type: String, required: true },
  fields: [
    {
      key: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: String, required: true },
      options: [String],
      required: { type: Boolean, default: false },
    },
  ],
});

export default mongoose.models.RequestForm || mongoose.model<IRequestForm>("RequestForm", RequestFormSchema);
