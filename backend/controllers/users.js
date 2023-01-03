import User from '../models/User.js';

/** GET USER */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
}

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;

    // find the user
    const user = await User.findById(id);

    // get all friends for a friend
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // format in a proper way for the frontend
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
      }
    );
    res.status(200).json(formattedFriends)
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
}

export const addRemoveFriend = async (req, res) => {
  try {
    // distructure user id and friend id
    const { id, friendId } = req.params;

    // grab the user info
    const user = await User.findById(id);
    // grab the friend info
    const friend = await User.findById(friendId);

    // check if friend id is included in the user id
    if (user.friends.includes(friendId)) {
      // if true you remove the friend
      user.friends = user.friends.filter((id) => id !== friendId);
      // if true you remove the user
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // else add the user
      user.friends.push(friendId);
      // else add the friend
      friend.friends.push(id);
    }
    // save updated user and friend
    await user.save();
    await friend.save();
    // get all friends for a friend
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // format in a proper way for the frontend
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
      }
    );
    res.status(200).json(formattedFriends)
      // get all friends of users and map them
      // format the list in the frontend

  } catch (error) {
    res.status(404).json({ message: err.message });
  }
}