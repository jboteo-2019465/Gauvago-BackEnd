import {initServer} from "./configs/app.js"
import {connect} from "./configs/mondongo.js"
import {defaultCategory } from "./src/category/category.controller.js"
import { defaultUser } from "./src/user/user.controller.js"

initServer()
connect()
defaultCategory()
defaultUser()


