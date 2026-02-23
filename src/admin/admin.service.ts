import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(@InjectModel('Admin') private adminModel: Model<Admin>) {}

  async onModuleInit() {
    const existingAdmin = await this.adminModel.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (!existingAdmin) {
      const username = process.env.ADMIN_USERNAME;
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;
      const hashedpassword = await bcrypt.hash(password, 10);
      const admin = await this.adminModel.create({
        username,
        email,
        password: hashedpassword,
      });
    }
  }

  async findByEmail(email) {
    return await this.adminModel.findOne({ email });
  }
}
