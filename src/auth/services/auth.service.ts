import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/services/users.service';

import { User } from './../../users/entities/user.entity';

import { PayloadToken } from './../models/token.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  }

  generateJwt(user: User) {
    const payload: PayloadToken = { role: user.role, sub: user.id };
    const { password, ...rta } = user.toJSON();
    return { access_token: this.jwtService.sign(payload), rta };
  }
}
