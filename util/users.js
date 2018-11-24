let users;

const getUsersMap = () => {
    if (!users) {
        users = new Map();
    }

    return users;
};

module.exports = getUsersMap();