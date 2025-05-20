import colors from "colors";
import { User } from "../app/modules/user/user.model";
import config from "../config";
import { USER_ROLES } from "../enums/user";
import { logger } from "../shared/logger";
import generateSequentialId from "../app/utils/idGenerator";

const superUser = {
  id: "",
  firstName: "Super", // put client first name
  lastName: "Admin", // put client last name
  role: USER_ROLES.SUPER_ADMIN,
  email: config.admin.email,
  password: config.admin.password,
  isVerified: true,
};

const seedSuperAdmin = async () => {
  // generate sequence id
  const id = await generateSequentialId(User, "id");
  superUser.id = id;

  const isExistSuperAdmin = await User.findOne({
    role: USER_ROLES.SUPER_ADMIN,
  });

  if (!isExistSuperAdmin) {
    await User.create(superUser);
    logger.info(colors.green("✔ Super admin created successfully!"));
  }
};

export default seedSuperAdmin;
