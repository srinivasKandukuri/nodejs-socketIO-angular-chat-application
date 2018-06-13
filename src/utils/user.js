class Users{
    constructor(name){
        this.users = [];
    }

    addUser(id,name,room){
        var user = {id, name, room};
        console.log(user);
        this.users.push(user);
        return user;
    }

    getUser(id){
        var user = this.users.filter((user) => user.id === id);
        return user[0];
    }

    getUsersList(room){
        var userList =  this.users.filter((user) => user.room === room);
        var namesArr = userList.map((user) => user.name);
        return namesArr;
    }
}

module.exports = {Users};