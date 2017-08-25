var expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {

  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: 1,
      name: 'user1',
      room: 'Test room 1'
    },{
      id: 2,
      name: 'user2',
      room: 'Test room 2'
    },{
      id: 3,
      name: 'user3',
      room: 'Test room 1'
    }];
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'user',
      room: 'Test room'
    }
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should return names for test room 1', () => {
    var userList = users.getUserList('Test room 1');

    expect(userList).toEqual(['user1', 'user3']);
  });

  it('should return names for test room 2', () => {
    var userList = users.getUserList('Test room 2');

    expect(userList).toEqual(['user2']);
  });

  it('should remove a user', () => {
    var userId = 2;
    var user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var userId = 44;
    var user = users.removeUser(userId);
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should return find user', () => {
    var userId = 2;
    var user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not return find user', () => {
    var userId = 44;
    var user = users.getUser(userId);
    expect(user).toNotExist();
  });

});
