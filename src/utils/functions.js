import path from "path";
export const getPath = (folderName) => {
  return path.join(process.cwd(), "src", folderName);
};

/**
 * Sorts an array of user objects based on their roles and creation date.
 *
 * @param {Array} users - An array of user objects. Each user object should have properties:
 *                         roles: an array of user roles (strings),
 *                         createdAt: a timestamp indicating when the user was created.
 *
 * @returns {Array} - The sorted array of user objects.
 */
export const sortUsers = (users) => {
  const roleOrder = {
    admin: 1,
    empleado: 2,
    user: 3,
  };

  function compareRoles(a, b) {
    const roleA = a.toLowerCase();
    const roleB = b.toLowerCase();

    if (roleA < roleB) {
      return -1;
    }
    if (roleA > roleB) {
      return 1;
    }
    return 0;
  }

  users.sort((user1, user2) => {
    const roles1 = user1.roles.sort(compareRoles);
    const roles2 = user2.roles.sort(compareRoles);

    const maxRole1 = roles1.reduce(
      (acc, role) => (roleOrder[role] < roleOrder[acc] ? role : acc),
      roles1[0]
    );
    const maxRole2 = roles2.reduce(
      (acc, role) => (roleOrder[role] < roleOrder[acc] ? role : acc),
      roles2[0]
    );

    if (roleOrder[maxRole1] < roleOrder[maxRole2]) {
      return -1;
    }
    if (roleOrder[maxRole1] > roleOrder[maxRole2]) {
      return 1;
    }

    const rolesComparison = roles1.join().localeCompare(roles2.join());
    if (rolesComparison !== 0) {
      return rolesComparison;
    }

    return user1.createdAt - user2.createdAt;
  });

  return users;
};
