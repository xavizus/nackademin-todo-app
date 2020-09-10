require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
require('../../database/mongodb');
const todoListModel = require('../../models/todoListModel');
const todoItemModel = require('../../models/todoItemModel');
const userModel = require('../../models/userModel');
const {MissingKeysError} = require('../../utilities/exceptionTypes');
const {users, taskLists} = require('../testData');


async function clearDatabase(){
    /**
     * Clear everything!
     */
    await userModel.userModel.deleteMany({});
    await todoListModel.todoListModel.deleteMany({});
    await todoItemModel.todoItemModel.deleteMany({});
}

describe('Unit test', function () {

    describe('User model tests', function () {
        let testUsers = [];

        beforeEach(async () => {
            await clearDatabase();
            testUsers = [];
            /**
             * Create test users
             */
            for (const user of users) {
                let testUser = await userModel.createUser(user, user.isAdmin);
                testUsers.push(testUser);
            }
        });
        describe('Successful tests', function () {
            it('Should be able to add a user', async function () {
                const testUser = {
                    "username": "testUser",
                    "password": "1234",
                    "firstName": "test",
                    "surname": "user"
                }
                let result = await userModel.createUser(testUser);
                expect(result._id).to.have.length(24);
                expect(result.roles).to.have.length(1);
                expect(result.roles[0]).to.eql('user');
            });

            it('Should be able to authenticate a user', async function () {
               for(const user of users) {
                    await expect(userModel.authenticateUser(user.username, user.password))
                        .to.eventually.be.an("String");
               }
            });
        });
        describe('Unsuccessful tests', function () {
            it('Should throw if missing username', async function () {
                const testUser = {
                    "password": "1234",
                    "firstName": "test",
                    "surname": "user"
                }
                expect(userModel.createUser(testUser)).to.eventually
                    .be.rejectedWith('Missing the key username!')
                    .and.be.an.instanceOf(Error);
            });
            it('Should throw if data in the username key', async function () {
                const testUser = {
                    "username": undefined,
                    "password": "1234",
                    "firstName": "test",
                    "surname": "user"
                }
                expect(userModel.createUser(testUser)).to.eventually
                    .be.rejectedWith('Missing the key username!')
                    .and.be.an.instanceOf(Error);
            });
            it('Should throw if missing password key', async function () {
                const testUser = {
                    "username": "testUser",
                    "firstName": "test",
                    "surname": "user"
                }
                expect(userModel.createUser(testUser)).to.eventually
                    .be.rejectedWith('Missing the key password!')
                    .and.be.an.instanceOf(Error);
            });
            it('Should throw if missing password data', async function () {
                const testUser = {
                    "username": "testUser",
                    "password": undefined,
                    "firstName": "test",
                    "surname": "user"
                }
                expect(userModel.createUser(testUser)).to.eventually
                    .be.rejectedWith('Missing the key password!')
                    .and.be.an.instanceOf(Error);
            });
        });
    });

    describe('TodoList Model tests', function () {
        let testUsers = [];

        beforeEach(async () => {
            await clearDatabase();
            testUsers = [];
            /**
             * Create test users
             */
            for (const user of users) {
                let testUser = await userModel.createUser(user, user.isAdmin);
                testUsers.push(testUser);
            }
        });
        describe('Successful tests', function () {
            it('Should create a todoList', async function() {
                for(const user of testUsers) {
                    let testList = {
                        title: taskLists[0],
                        userId: user._id,
                    }
                    let result = await todoListModel.addTodoList(testList);
                    expect(result._id).to.have.length(24);
                    expect(result.title).to.equal(testList.title);
                }
            });
            it('Should get all todo lists for the specific users', async function() {
                for(const user of testUsers) {
                    let testList = {
                        title: taskLists[0],
                        userId: user._id,
                    }
                    await todoListModel.addTodoList(testList);
                    let result = await todoListModel.getTodoLists({userId: user._id});
                    expect(result).to.have.length(1);
                    expect(result[0].title).to.equal(testList.title);
                    expect(result[0].userId).to.equal(testList.userId);
                }
            });
            it('Should get all todo lists for all users', async function () {
                for(const user of testUsers) {
                    let testList = {
                        title: taskLists[0],
                        userId: user._id,
                    }
                    await todoListModel.addTodoList(testList);
                }
                let result = await todoListModel.getTodoLists({});
                expect(result).to.have.length(3);

            });
        });
        describe('Unsuccessful tests', function () {
            it('Should get an empty todo list for specific users', async function() {
                for(const user of testUsers) {
                    let result = await todoListModel.getTodoLists({userId: user._id});
                    expect(result).to.have.length(0);
                }
            });
            it('Should get an empty todo list for non-existing user', async function() {
                for(const user of testUsers) {
                    let result = await todoListModel.getTodoLists({userId: "SomeUnknownUserThatShouldNotExist"});
                    expect(result).to.have.length(0);
                }
            });
        });
    });

    describe('todoItem Model tests', function () {
        describe('Successful tests', function () {

        });
        describe('Unsuccessful tests', function () {

        });
    });
});