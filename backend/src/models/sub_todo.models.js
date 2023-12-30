import mongoose, { Schema } from "mongoose";

const subTodoSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#FFFFFF",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const SubTodo = mongoose.model("SubTodo", subTodoSchema);
