class Users {

    constructor() {
        this.people = [];
    }

    addPerson(id, name, room) {
        let person = {
            id,
            name,
            room
        }
        this.people.push(person);
        return this.people;
    }

    getPerson(id) {
        let person = this.people.filter(person => person.id === id)[0];
        return person;
    }

    getPeople() {
        return this.people;
    }

    getPeople(room) {
        let personByRoom = this.people.filter(person => person.room == room);
        return personByRoom;
    }

    deletePerson(id) {
        let personDeleted = this.getPerson(id);
        this.people = this.people.filter(person => person.id != id);
        return personDeleted;
    }
}

module.exports = {
    Users
}