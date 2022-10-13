export const KnexQueryBuilder =  (overload = {}) =>  ({
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    toSQL: jest.fn().mockReturnThis(),
    first: jest.fn().mockReturnThis(),
    insert: jest.fn(),
    toNative: jest.fn(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn(),
    findOne: jest.fn(),
    ...overload
});