const users = [];

export const addUser = ({ id, username, room }) => {
  username = username.trim();
  room = room.trim();

  if (!username || !room) {
    console.log("@");
    return {
      err: "Invalid username and room name",
    };
  }
  const existUser = users.find((user) => {
    return user.room === room && user.name === username;
  });

  // if (!existUser) {
  //   console.log("!=4");
  //   return {
  //     err: "Existing user",
  //   };
  // }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

export const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

export const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = (id) => {
  return users.find((user) => user.id === id);
};

export const getUsersInRoom = (room) => {
  room = room.trim();
  return users.filter((user) => user.room === room);
};
