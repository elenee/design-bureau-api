import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      properties: {
        accessToken: { type: 'string' },
      },
    },
    example: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjk5YzQyMTM5MWI2NDRjNDVhODViZDNmIiwiaWF0IjoxNzcyMDk5NTcyLCJleHAiOjE3NzIxMDMxNzJ9.rrrHXFqwUag0x0wgAqZxtnAzJarZ3r5whdtd2ZZpf9o',
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }
}
