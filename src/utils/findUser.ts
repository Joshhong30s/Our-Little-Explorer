import bcrypt from 'bcrypt';
import { UserModel } from '@/types/users'; //
async function findUser(username: string, password: string) {
  const user = await UserModel.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return {
    id: user._id.toString(),
    name: user.username,
  };
}

export default findUser;
