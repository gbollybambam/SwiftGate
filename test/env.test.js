// Mock dotenv so it doesn't read from the real .env file during the test
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe('Environment Fail-Fast Check', () => {
  const originalEnv = process.env;
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });

  it('exits the process immediately if required variables are missing', () => {
    delete process.env.PORT; // Force a missing variable
    
    // Now when this is required, dotenv won't inject the real PORT
    require('../src/config/env');
    
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('CRITICAL ERROR'));
  });
});