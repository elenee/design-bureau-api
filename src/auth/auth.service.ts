import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string) {
    const admin = await this.adminService.findByEmail(email);
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    const isValidPassw = await bcrypt.compare(password, admin.password);
    if (!isValidPassw) throw new UnauthorizedException('Invalid Credentials');
    return admin;
  }

  async signIn(admin: any) {
    const payload = {
      adminId: admin._id,
    };

    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    return { accessToken };
  }
}
