import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Clinic from '../models/Clinic.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Create default clinic
    let clinic = await Clinic.findOne();
    if (!clinic) {
      clinic = await Clinic.create({
        name: 'MediFlow Demo Clinic',
        subscriptionPlan: 'pro',
        aiEnabled: true,
        address: '123 Medical Center, Health City',
        contact: '+1234567890',
      });
      console.log('Clinic created:', clinic.name);
    }

    // Create admin
    const adminExists = await User.findOne({ email: 'admin@mediflow.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@mediflow.com',
        password: 'admin123',
        role: 'admin',
        subscriptionPlan: 'enterprise',
        clinicId: clinic._id,
      });
      console.log('Admin: admin@mediflow.com / admin123');
    }

    // Create doctor
    const doctorExists = await User.findOne({ email: 'doctor@mediflow.com' });
    if (!doctorExists) {
      await User.create({
        name: 'Dr. Sarah Ahmed',
        email: 'doctor@mediflow.com',
        password: 'doctor123',
        role: 'doctor',
        specialization: 'General Physician',
        subscriptionPlan: 'pro',
        clinicId: clinic._id,
      });
      console.log('Doctor: doctor@mediflow.com / doctor123');
    }

    // Create receptionist
    const receptionistExists = await User.findOne({ email: 'reception@mediflow.com' });
    if (!receptionistExists) {
      await User.create({
        name: 'Receptionist',
        email: 'reception@mediflow.com',
        password: 'reception123',
        role: 'receptionist',
        subscriptionPlan: 'pro',
        clinicId: clinic._id,
      });
      console.log('Receptionist: reception@mediflow.com / reception123');
    }

    console.log('Seed completed.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
