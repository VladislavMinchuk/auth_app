import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUsersDto } from './dto/createUsers.dto';

export class UserRepository extends Repository<User> {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        super(userRepository.target, userRepository.manager, userRepository.queryRunner);
    }
    
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ email });
    }
    
    async findById(id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({ id });
    }
    
    async createUser(user: CreateUsersDto): Promise<User> {
        const userInstance = this.userRepository.create(user);
        return await this.userRepository.save(userInstance);
    }
    
    async findAll(): Promise<User[]> {
      return await this.userRepository.find();
    }
}