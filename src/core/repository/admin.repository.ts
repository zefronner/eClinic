import { Repository } from "typeorm";
import { AdminEntity } from "../entities/admin.entity";

export type AdminRepository = Repository<AdminEntity>