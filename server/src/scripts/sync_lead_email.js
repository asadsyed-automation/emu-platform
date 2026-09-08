import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const syncLeadEmail = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to DB');

    const lead = await User.findOne({
      $or: [
        { rollNumber: 'COSC231122114' },
        { name: /Syed Asad Ali Raza/i },
      ],
    });

    if (lead) {
      console.log('Current Lead Record:', lead.name, lead.rollNumber, lead.email);
      lead.email = 'eum.syed.asad.14@gmail.com';
      await lead.save();
      console.log('✅ Updated Lead email to:', lead.email);
    } else {
      console.log('Lead not found.');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

syncLeadEmail();
