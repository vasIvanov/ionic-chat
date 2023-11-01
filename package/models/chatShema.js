import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: String,
  text: String,
  user: String,
  time: String
}, {timestamps: true});

const channelSchema = new mongoose.Schema({
  id: String,
  name: String,
  messages: [messageSchema]
}, { timestamps: true });

export const Schema = mongoose.model('chatSchema', channelSchema);
export const MessageSchema = mongoose.model('messageSchema', messageSchema);