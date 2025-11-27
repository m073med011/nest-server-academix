import { Test, TestingModule } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';

@Injectable()
class TestService {}

describe('Nest Sanity Check', () => {
  let service: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestService],
    }).compile();

    service = module.get<TestService>(TestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
