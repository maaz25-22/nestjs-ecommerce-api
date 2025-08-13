import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    const verificationToken = uuidv4();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    const user = this.userRepository.create({
      ...createUserDto,
      isActive: false,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    const savedUser = await this.userRepository.save(user);

    try {
      await this.emailService.sendVerificationEmail(
        savedUser.email,
        verificationToken,
        savedUser.firstName
      );
    } catch (error) {
      console.error('Email gönderilemedi:', error);
    }

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['orders'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.findByUsername(updateUserDto.username);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Geçersiz doğrulama token\'ı');
    }

    if (user.isEmailVerified) {
      throw new ConflictException('Email zaten doğrulanmış');
    }

    if (user.emailVerificationExpires < new Date()) {
      throw new ConflictException('Doğrulama token\'ı süresi dolmuş');
    }

    user.isEmailVerified = true;
    user.isActive = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    return this.userRepository.save(user);
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Bu email adresi ile kayıtlı kullanıcı bulunamadı');
    }

    if (user.isEmailVerified) {
      throw new ConflictException('Email zaten doğrulanmış');
    }
    
    const verificationToken = uuidv4();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;

    await this.userRepository.save(user);

    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        verificationToken,
        user.firstName
      );
    } catch (error) {
      console.error('Email gönderilemedi:', error);
      throw new Error('Email gönderilemedi');
    }
  }
}
