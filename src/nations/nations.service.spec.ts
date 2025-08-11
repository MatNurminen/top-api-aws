import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { NationsService } from './nations.service';
import { Nation } from './entities/nation.entity';
import { CreateNationDto } from './dto/create-nation.dto';

describe('NationsService', () => {
  let service: NationsService;
  let nationRepository: Repository<Nation>;

  const mockNation = {
    id: 1,
    name: 'Test Nation',
    short_name: 'TNT',
    flag: 'flag.png',
    logo: 'logo.png',
    color: '#FF0000',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NationsService,
        {
          provide: getRepositoryToken(Nation),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NationsService>(NationsService);
    nationRepository = module.get<Repository<Nation>>(
      getRepositoryToken(Nation),
    );
  });

  describe('findAll', () => {
    it('should return an array of nations', async () => {
      jest.spyOn(nationRepository, 'find').mockResolvedValue([mockNation]);
      const result = await service.findAll();
      expect(result).toEqual([mockNation]);
      expect(nationRepository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
    });
  });

  it('should throw NotFoundException if nation not found', async () => {
    jest.spyOn(nationRepository, 'findOne').mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(
      new NotFoundException(`Nation #999 not found`),
    );
    expect(nationRepository.findOne).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });

  describe('create', () => {
    it('should create and return a nation', async () => {
      const createNationDto: CreateNationDto = {
        name: 'New Nation',
        short_name: 'NNT',
        flag: 'flag.png',
        logo: 'logo.png',
        color: '#0000',
      };
      const createdNation = { ...mockNation, ...createNationDto };
      jest.spyOn(nationRepository, 'create').mockReturnValue(createdNation);
      jest.spyOn(nationRepository, 'save').mockResolvedValue(createdNation);

      const result = await service.create(createNationDto);

      expect(result).toEqual(createdNation);
      expect(nationRepository.create).toHaveBeenCalledWith(createNationDto);
      expect(nationRepository.save).toHaveBeenCalledWith(createdNation);
    });
  });

  describe('update', () => {
    it('should update and return the nation', async () => {
      const updateDto = { name: 'Update Nation' };

      jest
        .spyOn(nationRepository, 'preload')
        .mockResolvedValue({ ...mockNation, ...updateDto });
      jest
        .spyOn(nationRepository, 'save')
        .mockResolvedValue({ ...mockNation, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(nationRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateDto,
      });
      expect(nationRepository.save).toHaveBeenCalledWith({
        ...mockNation,
        ...updateDto,
      });
      expect(result.name).toBe('Update Nation');
    });

    it('should throw NotFoundException if nation not found', async () => {
      jest.spyOn(nationRepository, 'preload').mockResolvedValue(null);

      await expect(service.update(999, { name: 'Unknown' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove and return the nation', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockNation);
      jest.spyOn(nationRepository, 'remove').mockResolvedValue(mockNation);

      const result = await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(nationRepository.remove).toHaveBeenCalledWith(mockNation);
      expect(result).toEqual(mockNation);
    });

    it('should throw NotFoundException if nation to remove not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
