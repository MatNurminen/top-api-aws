import { NotFoundException } from '@nestjs/common';
import { EntityTarget, EntityManager, Repository } from 'typeorm';

// simple Repository
export async function validateEntityExists<T>(
  repository: Repository<T>,
  entity: EntityTarget<T>,
  id: number,
  entityName?: string,
) {
  const found = await repository.findOne({ where: { id } as any });
  if (!found) {
    throw new NotFoundException(
      `${entityName || (entity as any).name} #${id} not found`,
    );
  }
}

// with transaction
export async function validateEntitiesWithManager(
  manager: EntityManager,
  entities: { entity: EntityTarget<any>; id: number; name?: string }[],
) {
  await Promise.all(
    entities.map(async ({ entity, id, name }) => {
      const found = await manager.findOne(entity, { where: { id } as any });
      if (!found) {
        throw new NotFoundException(
          `${name || (entity as any).name} #${id} not found`,
        );
      }
    }),
  );
}
