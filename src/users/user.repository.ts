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
    
    // sample method for demo purposes
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ email }); // could also be this.findOneBy({ email });, but depending on your IDE/TS settings, could warn that userRepository is not used though. Up to you to use either of the 2 methods
    }
    
    // sample method for demo purposes
    async findById(id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({ id }); // could also be this.findOneBy({ email });, but depending on your IDE/TS settings, could warn that userRepository is not used though. Up to you to use either of the 2 methods
    }
    
    async createUser(user: CreateUsersDto): Promise<User> {
        return await this.userRepository.save(user);
    }
    
    async findAll(): Promise<User[]> {
      return await this.userRepository.find();
    }
}