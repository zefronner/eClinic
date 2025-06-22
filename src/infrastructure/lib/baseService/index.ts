import { Repository } from "typeorm";
import { IFindOptions } from "./interface";
import { HttpException } from "@nestjs/common";


export class BaseService<CreateDto, Entity> {
    constructor(private readonly repository: Repository<any>) {}

    get getRepository() {
        return this.repository;
    };

    async create(dto: CreateDto) {
        let createdData = this.repository.create({
            ...dto,
        }) as unknown as Entity;
        createdData = await this.repository.save(createdData);
        return {
            statusCode: 201,
            message: 'success',
            data: createdData
        };
    };

    async findAll(options?: IFindOptions<Entity>) {
        const data = (await this.repository.find({
          ...options,
        })) as Entity[];
        return {
          status_code: 200,
          message: 'success',
          data: data,
        };
      };

    
  async findOneBy(options: IFindOptions<Entity>) {
    const data = (await this.repository.findOne({
      select: options.select || {},
      relations: options.relations || [],
      where: options.where,
    })) as Entity;
    if (!data) {
      throw new HttpException('not found', 404);
    }
    return {
      status_code: 200,
      message: 'success',
      data: data,
    };
  }

  async findOneById(id: number, options?: IFindOptions<Entity>) {
    const data = (await this.repository.findOne({
      select: options?.select || {},
      relations: options?.relations || [],
      where: { id, ...options?.where },
    })) as unknown as Entity;
    if (!data) {
      throw new HttpException('not found', 404);
    }
    return {
      status_code: 200,
      message: 'success',
      data,
    };
  };
  
  async update(id: number, dto: Partial<CreateDto>) {
    await this.findOneById(id);
    await this.repository.update(id, {
      ...dto,
      updated_at: Date.now(),
    });
    return {
      status_code: 200,
      message: 'success',
      data: {},
    };
  };

  async delete(id: number) {
    await this.findOneById(id);
    (await this.repository.delete(id)) as unknown as Entity;
    return {
      status_code: 200,
      message: 'success',
      data: {},
    };
  };
}