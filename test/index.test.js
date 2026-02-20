const { capitalizeWords, filterActiveUsers, logAction } = require('../index');

describe('Processing User Data Functions', () => {
  describe('capitalizeWords(input)', () => {
    test('capitalizes the first letter of each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
    });

    test('returns empty string when input is empty', () => {
      expect(capitalizeWords('')).toBe('');
    });

    test('handles hyphenated words', () => {
      expect(capitalizeWords('hello-world')).toBe('Hello-World');
    });

    test('handles single word', () => {
      expect(capitalizeWords('hello')).toBe('Hello');
    });
  });

  describe('filterActiveUsers(users)', () => {
    test('filters active users from a mixed array', () => {
      const users = [
        { name: 'Alice', isActive: true },
        { name: 'Bob', isActive: false },
        { name: 'Charlie', isActive: true },
      ];
      expect(filterActiveUsers(users)).toEqual([
        { name: 'Alice', isActive: true },
        { name: 'Charlie', isActive: true },
      ]);
    });

    test('returns empty array when all users are inactive', () => {
      const users = [
        { name: 'Alice', isActive: false },
        { name: 'Bob', isActive: false },
      ];
      expect(filterActiveUsers(users)).toEqual([]);
    });

    test('returns empty array when given an empty array', () => {
      expect(filterActiveUsers([])).toEqual([]);
    });
  });

  describe('logAction(action, username)', () => {
    let originalDate;

    beforeEach(() => {
      originalDate = global.Date;
    });

    afterEach(() => {
      global.Date = originalDate;
    });

    function mockDate(isoString) {
      const fixedDate = new originalDate(isoString);
      global.Date = class extends originalDate {
        constructor(...args) {
          if (args.length === 0) return fixedDate;
          super(...args);
        }
        toISOString() {
          return fixedDate.toISOString();
        }
      };
    }

    test('generates the correct log string with a fixed timestamp', () => {
      mockDate('2024-11-27T12:00:00.000Z');
      expect(logAction('login', 'Alice')).toBe(
        'User Alice performed login at 2024-11-27T12:00:00.000Z'
      );
    });

    test('does not crash when action or username is missing', () => {
      mockDate('2026-02-20T12:00:00.000Z');
      expect(logAction()).toBe(
        'User undefined performed undefined at 2026-02-20T12:00:00.000Z'
      );
      expect(logAction('login')).toBe(
        'User undefined performed login at 2026-02-20T12:00:00.000Z'
      );
      expect(logAction(undefined, 'Alice')).toBe(
        'User Alice performed undefined at 2026-02-20T12:00:00.000Z'
      );
    });

    test('handles empty strings as inputs', () => {
      mockDate('2026-02-20T12:00:00.000Z');
      expect(logAction('', '')).toBe(
        'User  performed  at 2026-02-20T12:00:00.000Z'
      );
    });
  });
});