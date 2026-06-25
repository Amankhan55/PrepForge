/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const mongoose_1 = __webpack_require__(6);
const app_controller_1 = __webpack_require__(7);
const app_service_1 = __webpack_require__(8);
const auth_module_1 = __webpack_require__(9);
const users_module_1 = __webpack_require__(25);
const questions_module_1 = __webpack_require__(26);
const progress_module_1 = __webpack_require__(33);
const mock_tests_module_1 = __webpack_require__(37);
const notes_module_1 = __webpack_require__(41);
const analytics_module_1 = __webpack_require__(45);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: 'apps/server/.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('MONGODB_URI'),
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            questions_module_1.QuestionsModule,
            progress_module_1.ProgressModule,
            mock_tests_module_1.MockTestsModule,
            notes_module_1.NotesModule,
            analytics_module_1.AnalyticsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const app_service_1 = __webpack_require__(8);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
let AppService = class AppService {
    getData() {
        return { message: 'Hello API' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const jwt_1 = __webpack_require__(10);
const passport_1 = __webpack_require__(11);
const auth_controller_1 = __webpack_require__(12);
const auth_service_1 = __webpack_require__(14);
const jwt_strategy_1 = __webpack_require__(23);
const users_module_1 = __webpack_require__(25);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({}),
            users_module_1.UsersModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
    })
], AuthModule);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const express_1 = __webpack_require__(13);
const auth_service_1 = __webpack_require__(14);
const auth_dto_1 = __webpack_require__(19);
const jwt_auth_guard_1 = __webpack_require__(21);
const current_user_decorator_1 = __webpack_require__(22);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto, res) {
        const { user, accessToken, refreshToken } = await this.authService.register(dto);
        this.setCookies(res, accessToken, refreshToken);
        return { user };
    }
    async login(dto, res) {
        const { user, accessToken, refreshToken } = await this.authService.login(dto);
        this.setCookies(res, accessToken, refreshToken);
        return { user };
    }
    async refresh(req, res) {
        const authHeader = req.headers.authorization;
        const headerToken = authHeader?.split(' ')[1];
        const refreshToken = req.cookies?.['refresh_token'] || headerToken;
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is missing');
        }
        const { newTokens } = await this.authService.refreshWithToken(refreshToken);
        this.setCookies(res, newTokens.accessToken, newTokens.refreshToken);
        return { success: true };
    }
    async logout(user, res) {
        await this.authService.logout(user.userId);
        this.clearCookies(res);
    }
    me(user) {
        return user;
    }
    setCookies(res, accessToken, refreshToken) {
        const isProd = process.env['NODE_ENV'] === 'production';
        const sameSiteVal = isProd ? 'none' : 'lax';
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: sameSiteVal,
            path: '/',
            maxAge: 15 * 60 * 1000, // 15 mins
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: sameSiteVal,
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }
    clearCookies(res) {
        const isProd = process.env['NODE_ENV'] === 'production';
        const sameSiteVal = isProd ? 'none' : 'lax';
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: isProd,
            sameSite: sameSiteVal,
            path: '/',
        });
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: isProd,
            sameSite: sameSiteVal,
            path: '/',
        });
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Res)({ passthrough: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof auth_dto_1.RegisterDto !== "undefined" && auth_dto_1.RegisterDto) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Res)({ passthrough: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof auth_dto_1.LoginDto !== "undefined" && auth_dto_1.LoginDto) === "function" ? _d : Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)({ passthrough: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_f = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _f : Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
tslib_1.__decorate([
    (0, common_1.Delete)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__param(1, (0, common_1.Res)({ passthrough: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
tslib_1.__decorate([
    (0, common_1.Post)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const jwt_1 = __webpack_require__(10);
const config_1 = __webpack_require__(5);
const bcrypt = tslib_1.__importStar(__webpack_require__(15));
const users_service_1 = __webpack_require__(16);
let AuthService = class AuthService {
    constructor(usersService, jwtService, config) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.config = config;
    }
    async register(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        // Assign admin role if email is admin@prepforge.com or explicitly passed as admin
        const role = (dto.role === 'admin' || dto.email.toLowerCase() === 'admin@prepforge.com') ? 'admin' : 'user';
        const user = await this.usersService.create(dto.name, dto.email, passwordHash, role);
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        return { user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }, ...tokens };
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        return { user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }, ...tokens };
    }
    async refresh(userId, refreshToken) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.refreshToken)
            throw new common_1.UnauthorizedException();
        const match = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!match)
            throw new common_1.UnauthorizedException();
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        return tokens;
    }
    async refreshWithToken(refreshToken) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const userId = payload.sub;
        const user = await this.usersService.findById(userId);
        if (!user || !user.refreshToken)
            throw new common_1.UnauthorizedException('User session not found');
        const match = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!match)
            throw new common_1.UnauthorizedException('Session mismatch');
        const newTokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        return { userId, newTokens };
    }
    async logout(userId) {
        await this.usersService.updateRefreshToken(userId, null);
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: this.config.get('JWT_EXPIRES_IN'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);
        // Hash refresh token before storing
        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateRefreshToken(userId, hashedRefresh);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(17);
const user_schema_1 = __webpack_require__(18);
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(name, email, passwordHash, role = 'user') {
        return this.userModel.create({ name, email, passwordHash, role });
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async updateRefreshToken(userId, token) {
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: token }).exec();
    }
    async updateStreak(userId, streak, lastActiveDate) {
        await this.userModel.findByIdAndUpdate(userId, { streak, lastActiveDate }).exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UsersService);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
let User = class User {
};
exports.User = User;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['user', 'admin'], default: 'user' }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "role", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "streak", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "lastActiveDate", void 0);
exports.User = User = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = exports.RegisterDto = void 0;
const tslib_1 = __webpack_require__(1);
const class_validator_1 = __webpack_require__(20);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
class LoginDto {
}
exports.LoginDto = LoginDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const passport_1 = __webpack_require__(11);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrentUser = void 0;
const common_1 = __webpack_require__(4);
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const passport_1 = __webpack_require__(11);
const passport_jwt_1 = __webpack_require__(24);
const config_1 = __webpack_require__(5);
const cookieExtractor = (req) => {
    if (req && req.cookies) {
        return req.cookies['access_token'] || null;
    }
    return null;
};
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(config) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                cookieExtractor,
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET'),
        });
    }
    async validate(payload) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const users_service_1 = __webpack_require__(16);
const user_schema_1 = __webpack_require__(18);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }])],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestionsModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const questions_controller_1 = __webpack_require__(27);
const questions_service_1 = __webpack_require__(28);
const question_schema_1 = __webpack_require__(29);
let QuestionsModule = class QuestionsModule {
};
exports.QuestionsModule = QuestionsModule;
exports.QuestionsModule = QuestionsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: question_schema_1.Question.name, schema: question_schema_1.QuestionSchema }])],
        controllers: [questions_controller_1.QuestionsController],
        providers: [questions_service_1.QuestionsService],
        exports: [questions_service_1.QuestionsService],
    })
], QuestionsModule);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestionsController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const questions_service_1 = __webpack_require__(28);
const questions_dto_1 = __webpack_require__(30);
const jwt_auth_guard_1 = __webpack_require__(21);
const roles_guard_1 = __webpack_require__(31);
const roles_decorator_1 = __webpack_require__(32);
let QuestionsController = class QuestionsController {
    constructor(questionsService) {
        this.questionsService = questionsService;
    }
    findAll(query) {
        return this.questionsService.findAll(query);
    }
    getTopics(category) {
        return this.questionsService.getTopics(category);
    }
    findOne(id) {
        return this.questionsService.findById(id);
    }
    create(dto) {
        return this.questionsService.create(dto);
    }
    update(id, dto) {
        return this.questionsService.update(id, dto);
    }
    delete(id) {
        return this.questionsService.delete(id);
    }
};
exports.QuestionsController = QuestionsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof questions_dto_1.QueryQuestionsDto !== "undefined" && questions_dto_1.QueryQuestionsDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], QuestionsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('topics'),
    tslib_1.__param(0, (0, common_1.Query)('category')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], QuestionsController.prototype, "getTopics", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], QuestionsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof questions_dto_1.CreateQuestionDto !== "undefined" && questions_dto_1.CreateQuestionDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], QuestionsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_d = typeof Partial !== "undefined" && Partial) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], QuestionsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], QuestionsController.prototype, "delete", null);
exports.QuestionsController = QuestionsController = tslib_1.__decorate([
    (0, common_1.Controller)('questions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof questions_service_1.QuestionsService !== "undefined" && questions_service_1.QuestionsService) === "function" ? _a : Object])
], QuestionsController);


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestionsService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(17);
const question_schema_1 = __webpack_require__(29);
let QuestionsService = class QuestionsService {
    constructor(questionModel) {
        this.questionModel = questionModel;
    }
    async findAll(query) {
        const filter = {};
        if (query.category)
            filter.category = query.category;
        if (query.topic)
            filter.topic = new RegExp(query.topic, 'i');
        if (query.difficulty)
            filter.difficulty = query.difficulty;
        if (query.tag)
            filter.tags = query.tag;
        if (query.search) {
            filter.$text = { $search: query.search };
        }
        return this.questionModel.find(filter).sort({ order: 1, createdAt: 1 }).exec();
    }
    async findById(id) {
        const q = await this.questionModel.findById(id).exec();
        if (!q)
            throw new common_1.NotFoundException(`Question ${id} not found`);
        return q;
    }
    async create(dto) {
        return this.questionModel.create(dto);
    }
    async update(id, dto) {
        const q = await this.questionModel.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!q)
            throw new common_1.NotFoundException(`Question ${id} not found`);
        return q;
    }
    async delete(id) {
        await this.questionModel.findByIdAndDelete(id).exec();
    }
    async getTopics(category) {
        const filter = category ? { category } : {};
        return this.questionModel.distinct('topic', filter).exec();
    }
    async bulkCreate(questions) {
        await this.questionModel.insertMany(questions);
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(question_schema_1.Question.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], QuestionsService);


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestionSchema = exports.Question = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
let Question = class Question {
};
exports.Question = Question;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['angular', 'javascript', 'system-design'] }),
    tslib_1.__metadata("design:type", String)
], Question.prototype, "category", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    tslib_1.__metadata("design:type", String)
], Question.prototype, "topic", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    tslib_1.__metadata("design:type", String)
], Question.prototype, "title", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Question.prototype, "description", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Question.prototype, "answer", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    tslib_1.__metadata("design:type", String)
], Question.prototype, "codeSnippet", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['beginner', 'intermediate', 'advanced'] }),
    tslib_1.__metadata("design:type", String)
], Question.prototype, "difficulty", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    tslib_1.__metadata("design:type", Array)
], Question.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Question.prototype, "order", void 0);
exports.Question = Question = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Question);
exports.QuestionSchema = mongoose_1.SchemaFactory.createForClass(Question);
exports.QuestionSchema.index({ category: 1, difficulty: 1 });
exports.QuestionSchema.index({ tags: 1 });
exports.QuestionSchema.index({ title: 'text', description: 'text' });


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueryQuestionsDto = exports.CreateQuestionDto = void 0;
const tslib_1 = __webpack_require__(1);
const class_validator_1 = __webpack_require__(20);
const question_schema_1 = __webpack_require__(29);
class CreateQuestionDto {
}
exports.CreateQuestionDto = CreateQuestionDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEnum)(['angular', 'javascript', 'system-design']),
    tslib_1.__metadata("design:type", typeof (_a = typeof question_schema_1.QuestionCategory !== "undefined" && question_schema_1.QuestionCategory) === "function" ? _a : Object)
], CreateQuestionDto.prototype, "category", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    tslib_1.__metadata("design:type", String)
], CreateQuestionDto.prototype, "topic", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    tslib_1.__metadata("design:type", String)
], CreateQuestionDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateQuestionDto.prototype, "description", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateQuestionDto.prototype, "answer", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateQuestionDto.prototype, "codeSnippet", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEnum)(['beginner', 'intermediate', 'advanced']),
    tslib_1.__metadata("design:type", typeof (_b = typeof question_schema_1.Difficulty !== "undefined" && question_schema_1.Difficulty) === "function" ? _b : Object)
], CreateQuestionDto.prototype, "difficulty", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], CreateQuestionDto.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreateQuestionDto.prototype, "order", void 0);
class QueryQuestionsDto {
}
exports.QueryQuestionsDto = QueryQuestionsDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['angular', 'javascript', 'system-design']),
    tslib_1.__metadata("design:type", typeof (_c = typeof question_schema_1.QuestionCategory !== "undefined" && question_schema_1.QuestionCategory) === "function" ? _c : Object)
], QueryQuestionsDto.prototype, "category", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], QueryQuestionsDto.prototype, "topic", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['beginner', 'intermediate', 'advanced']),
    tslib_1.__metadata("design:type", typeof (_d = typeof question_schema_1.Difficulty !== "undefined" && question_schema_1.Difficulty) === "function" ? _d : Object)
], QueryQuestionsDto.prototype, "difficulty", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], QueryQuestionsDto.prototype, "search", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], QueryQuestionsDto.prototype, "tag", void 0);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const core_1 = __webpack_require__(2);
const roles_decorator_1 = __webpack_require__(32);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            return false;
        }
        return requiredRoles.includes(user.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(4);
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgressModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const progress_controller_1 = __webpack_require__(34);
const progress_service_1 = __webpack_require__(35);
const user_progress_schema_1 = __webpack_require__(36);
let ProgressModule = class ProgressModule {
};
exports.ProgressModule = ProgressModule;
exports.ProgressModule = ProgressModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: user_progress_schema_1.UserProgress.name, schema: user_progress_schema_1.UserProgressSchema }])],
        controllers: [progress_controller_1.ProgressController],
        providers: [progress_service_1.ProgressService],
        exports: [progress_service_1.ProgressService],
    })
], ProgressModule);


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgressController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const progress_service_1 = __webpack_require__(35);
const jwt_auth_guard_1 = __webpack_require__(21);
const current_user_decorator_1 = __webpack_require__(22);
let ProgressController = class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    getAll(user) {
        return this.progressService.getUserProgress(user.userId);
    }
    getSummary(user) {
        return this.progressService.getSummary(user.userId);
    }
    getActivity(user) {
        return this.progressService.getActivityByDate(user.userId);
    }
    upsert(user, questionId, body) {
        return this.progressService.upsertProgress(user.userId, questionId, body);
    }
};
exports.ProgressController = ProgressController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProgressController.prototype, "getAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('summary'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProgressController.prototype, "getSummary", null);
tslib_1.__decorate([
    (0, common_1.Get)('activity'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProgressController.prototype, "getActivity", null);
tslib_1.__decorate([
    (0, common_1.Put)(':questionId'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__param(1, (0, common_1.Param)('questionId')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ProgressController.prototype, "upsert", null);
exports.ProgressController = ProgressController = tslib_1.__decorate([
    (0, common_1.Controller)('progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof progress_service_1.ProgressService !== "undefined" && progress_service_1.ProgressService) === "function" ? _a : Object])
], ProgressController);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgressService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(17);
const user_progress_schema_1 = __webpack_require__(36);
let ProgressService = class ProgressService {
    constructor(progressModel) {
        this.progressModel = progressModel;
    }
    async getUserProgress(userId) {
        return this.progressModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).exec();
    }
    async upsertProgress(userId, questionId, update) {
        return this.progressModel.findOneAndUpdate({
            userId: new mongoose_2.Types.ObjectId(userId),
            questionId: new mongoose_2.Types.ObjectId(questionId),
        }, { ...update, lastSeenAt: new Date() }, { upsert: true, new: true }).exec();
    }
    async getSummary(userId) {
        const all = await this.getUserProgress(userId);
        return {
            total: all.length,
            reviewed: all.filter((p) => p.status === 'reviewed').length,
            mastered: all.filter((p) => p.status === 'mastered').length,
            bookmarked: all.filter((p) => p.bookmarked).length,
        };
    }
    async getActivityByDate(userId) {
        const results = await this.progressModel.aggregate([
            { $match: { userId: new mongoose_2.Types.ObjectId(userId), lastSeenAt: { $ne: null } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastSeenAt' } },
                    count: { $sum: 1 },
                },
            },
        ]);
        return results.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), {});
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(user_progress_schema_1.UserProgress.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ProgressService);


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserProgressSchema = exports.UserProgress = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(17);
let UserProgress = class UserProgress {
};
exports.UserProgress = UserProgress;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], UserProgress.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Question', required: true }),
    tslib_1.__metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], UserProgress.prototype, "questionId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ enum: ['unseen', 'reviewed', 'mastered'], default: 'unseen' }),
    tslib_1.__metadata("design:type", String)
], UserProgress.prototype, "status", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], UserProgress.prototype, "bookmarked", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    tslib_1.__metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], UserProgress.prototype, "lastSeenAt", void 0);
exports.UserProgress = UserProgress = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], UserProgress);
exports.UserProgressSchema = mongoose_1.SchemaFactory.createForClass(UserProgress);
exports.UserProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MockTestsModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const mock_tests_controller_1 = __webpack_require__(38);
const mock_tests_service_1 = __webpack_require__(39);
const mock_test_schema_1 = __webpack_require__(40);
const questions_module_1 = __webpack_require__(26);
let MockTestsModule = class MockTestsModule {
};
exports.MockTestsModule = MockTestsModule;
exports.MockTestsModule = MockTestsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: mock_test_schema_1.MockTest.name, schema: mock_test_schema_1.MockTestSchema }]),
            questions_module_1.QuestionsModule,
        ],
        controllers: [mock_tests_controller_1.MockTestsController],
        providers: [mock_tests_service_1.MockTestsService],
        exports: [mock_tests_service_1.MockTestsService],
    })
], MockTestsModule);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MockTestsController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mock_tests_service_1 = __webpack_require__(39);
const jwt_auth_guard_1 = __webpack_require__(21);
const current_user_decorator_1 = __webpack_require__(22);
let MockTestsController = class MockTestsController {
    constructor(mockTestsService) {
        this.mockTestsService = mockTestsService;
    }
    start(user, body) {
        return this.mockTestsService.startTest(user.userId, body.category, body.difficulty, body.durationMinutes, body.questionCount);
    }
    submit(user, id, body) {
        return this.mockTestsService.submitTest(user.userId, id, body.answers, body.timeTakenSeconds);
    }
    history(user) {
        return this.mockTestsService.findHistory(user.userId);
    }
    scoreTrend(user) {
        return this.mockTestsService.getScoreTrend(user.userId);
    }
    findOne(user, id) {
        return this.mockTestsService.findOne(user.userId, id);
    }
};
exports.MockTestsController = MockTestsController;
tslib_1.__decorate([
    (0, common_1.Post)('start'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MockTestsController.prototype, "start", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id/submit'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MockTestsController.prototype, "submit", null);
tslib_1.__decorate([
    (0, common_1.Get)('history'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MockTestsController.prototype, "history", null);
tslib_1.__decorate([
    (0, common_1.Get)('score-trend'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MockTestsController.prototype, "scoreTrend", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], MockTestsController.prototype, "findOne", null);
exports.MockTestsController = MockTestsController = tslib_1.__decorate([
    (0, common_1.Controller)('mock-tests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mock_tests_service_1.MockTestsService !== "undefined" && mock_tests_service_1.MockTestsService) === "function" ? _a : Object])
], MockTestsController);


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MockTestsService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(17);
const mock_test_schema_1 = __webpack_require__(40);
const questions_service_1 = __webpack_require__(28);
let MockTestsService = class MockTestsService {
    constructor(mockTestModel, questionsService) {
        this.mockTestModel = mockTestModel;
        this.questionsService = questionsService;
    }
    async startTest(userId, category, difficulty, durationMinutes, questionCount = 20) {
        const query = {};
        if (category !== 'mixed')
            query.category = category;
        if (difficulty !== 'mixed')
            query.difficulty = difficulty;
        const questions = await this.questionsService.findAll(query);
        const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, questionCount);
        return this.mockTestModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            category,
            difficulty,
            durationMinutes,
            questions: shuffled.map((q) => q._id),
            totalQuestions: shuffled.length,
        });
    }
    async submitTest(userId, testId, answers, timeTakenSeconds) {
        const test = await this.mockTestModel.findOne({
            _id: testId,
            userId: new mongoose_2.Types.ObjectId(userId),
        }).populate('questions').exec();
        if (!test)
            throw new common_1.NotFoundException('Test not found');
        // Grade each descriptive answer using keyword-matching heuristics
        let score = 0;
        const questionsList = (test.questions || []);
        for (const q of questionsList) {
            const userAnswer = answers[q._id.toString()];
            if (userAnswer && this.gradeAnswer(userAnswer, q.answer, q.tags || [])) {
                score++;
            }
        }
        return this.mockTestModel.findByIdAndUpdate(testId, {
            answers,
            score,
            timeTakenSeconds,
            status: 'completed',
            completedAt: new Date(),
        }, { new: true }).populate('questions').exec();
    }
    gradeAnswer(userAnswer, correctAnswer, tags) {
        if (!userAnswer || userAnswer.trim().length < 5)
            return false;
        const cleanUser = userAnswer.toLowerCase();
        // 1. Check for matches against the question tags (case-insensitive)
        const matchedTags = tags.filter(tag => cleanUser.includes(tag.toLowerCase()));
        // 2. Extract significant keywords from the correct answer (length > 4, omitting common stop words)
        const stopWords = new Set([
            'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
            'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
            'can', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
            'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'him', 'his', 'how', 'if', 'in',
            'into', 'is', 'it', 'its', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off',
            'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
            'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
            'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
            'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why',
            'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
        ]);
        const correctWords = correctAnswer
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 4 && !stopWords.has(w));
        const uniqueKeywords = Array.from(new Set(correctWords));
        // 3. Count matching keywords in the user's answer
        const matchedKeywords = uniqueKeywords.filter(kw => cleanUser.includes(kw));
        const tagMatchCount = matchedTags.length;
        const keywordMatchCount = matchedKeywords.length;
        const keywordMatchRatio = uniqueKeywords.length > 0 ? keywordMatchCount / uniqueKeywords.length : 0;
        // Heuristics:
        // - At least 1 tag matched AND at least 2 significant keywords matched
        // - OR, at least 4 significant keywords matched
        // - OR, at least 25% of the unique keywords matched (minimum of 2)
        if (tagMatchCount >= 1 && keywordMatchCount >= 2)
            return true;
        if (keywordMatchCount >= 4)
            return true;
        if (keywordMatchRatio >= 0.25 && keywordMatchCount >= 2)
            return true;
        return false;
    }
    async findOne(userId, testId) {
        const test = await this.mockTestModel.findOne({
            _id: testId,
            userId: new mongoose_2.Types.ObjectId(userId),
        }).populate('questions').exec();
        if (!test)
            throw new common_1.NotFoundException('Test session not found');
        return test;
    }
    findHistory(userId) {
        return this.mockTestModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId), status: 'completed' })
            .sort({ completedAt: -1 })
            .exec();
    }
    async getScoreTrend(userId) {
        const tests = await this.findHistory(userId);
        return tests.map((t) => ({
            date: t.completedAt,
            score: t.score,
            total: t.totalQuestions,
            percentage: t.totalQuestions > 0 ? Math.round((t.score / t.totalQuestions) * 100) : 0,
            category: t.category,
        }));
    }
};
exports.MockTestsService = MockTestsService;
exports.MockTestsService = MockTestsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(mock_test_schema_1.MockTest.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof questions_service_1.QuestionsService !== "undefined" && questions_service_1.QuestionsService) === "function" ? _b : Object])
], MockTestsService);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MockTestSchema = exports.MockTest = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(17);
let MockTest = class MockTest {
};
exports.MockTest = MockTest;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], MockTest.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ enum: ['angular', 'javascript', 'system-design', 'mixed'], required: true }),
    tslib_1.__metadata("design:type", String)
], MockTest.prototype, "category", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ enum: ['beginner', 'intermediate', 'advanced', 'mixed'], required: true }),
    tslib_1.__metadata("design:type", String)
], MockTest.prototype, "difficulty", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Number)
], MockTest.prototype, "durationMinutes", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Question' }] }),
    tslib_1.__metadata("design:type", Array)
], MockTest.prototype, "questions", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    tslib_1.__metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], MockTest.prototype, "answers", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], MockTest.prototype, "score", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], MockTest.prototype, "totalQuestions", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], MockTest.prototype, "timeTakenSeconds", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ enum: ['in-progress', 'completed'], default: 'in-progress' }),
    tslib_1.__metadata("design:type", String)
], MockTest.prototype, "status", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    tslib_1.__metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], MockTest.prototype, "completedAt", void 0);
exports.MockTest = MockTest = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MockTest);
exports.MockTestSchema = mongoose_1.SchemaFactory.createForClass(MockTest);
exports.MockTestSchema.index({ userId: 1, createdAt: -1 });


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotesModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const notes_controller_1 = __webpack_require__(42);
const notes_service_1 = __webpack_require__(43);
const note_schema_1 = __webpack_require__(44);
let NotesModule = class NotesModule {
};
exports.NotesModule = NotesModule;
exports.NotesModule = NotesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: note_schema_1.Note.name, schema: note_schema_1.NoteSchema }])],
        controllers: [notes_controller_1.NotesController],
        providers: [notes_service_1.NotesService],
    })
], NotesModule);


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotesController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const notes_service_1 = __webpack_require__(43);
const jwt_auth_guard_1 = __webpack_require__(21);
const current_user_decorator_1 = __webpack_require__(22);
let NotesController = class NotesController {
    constructor(notesService) {
        this.notesService = notesService;
    }
    findAll(user, search) {
        return this.notesService.findAll(user.userId, search);
    }
    findOne(user, id) {
        return this.notesService.findOne(user.userId, id);
    }
    create(user, body) {
        return this.notesService.create(user.userId, body.title, body.content, body.questionId);
    }
    update(user, id, body) {
        return this.notesService.update(user.userId, id, body.title, body.content);
    }
    delete(user, id) {
        return this.notesService.delete(user.userId, id);
    }
};
exports.NotesController = NotesController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__param(1, (0, common_1.Query)('search')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], NotesController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], NotesController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], NotesController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], NotesController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], NotesController.prototype, "delete", null);
exports.NotesController = NotesController = tslib_1.__decorate([
    (0, common_1.Controller)('notes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof notes_service_1.NotesService !== "undefined" && notes_service_1.NotesService) === "function" ? _a : Object])
], NotesController);


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotesService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(17);
const note_schema_1 = __webpack_require__(44);
let NotesService = class NotesService {
    constructor(noteModel) {
        this.noteModel = noteModel;
    }
    findAll(userId, search) {
        const filter = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (search)
            filter.$text = { $search: search };
        return this.noteModel.find(filter).sort({ updatedAt: -1 }).exec();
    }
    async findOne(userId, id) {
        const note = await this.noteModel.findOne({ _id: id, userId: new mongoose_2.Types.ObjectId(userId) }).exec();
        if (!note)
            throw new common_1.NotFoundException('Note not found');
        return note;
    }
    create(userId, title, content, questionId) {
        return this.noteModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            title,
            content,
            questionId: questionId ? new mongoose_2.Types.ObjectId(questionId) : null,
        });
    }
    async update(userId, id, title, content) {
        const note = await this.noteModel.findOneAndUpdate({ _id: id, userId: new mongoose_2.Types.ObjectId(userId) }, { ...(title && { title }), ...(content !== undefined && { content }) }, { new: true }).exec();
        if (!note)
            throw new common_1.NotFoundException('Note not found');
        return note;
    }
    async delete(userId, id) {
        await this.noteModel.findOneAndDelete({ _id: id, userId: new mongoose_2.Types.ObjectId(userId) }).exec();
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(note_schema_1.Note.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], NotesService);


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoteSchema = exports.Note = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(17);
let Note = class Note {
};
exports.Note = Note;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Note.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    tslib_1.__metadata("design:type", String)
], Note.prototype, "title", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    tslib_1.__metadata("design:type", String)
], Note.prototype, "content", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Question', default: null }),
    tslib_1.__metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Note.prototype, "questionId", void 0);
exports.Note = Note = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Note);
exports.NoteSchema = mongoose_1.SchemaFactory.createForClass(Note);
exports.NoteSchema.index({ userId: 1, createdAt: -1 });
exports.NoteSchema.index({ title: 'text', content: 'text' });


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const analytics_controller_1 = __webpack_require__(46);
const analytics_service_1 = __webpack_require__(47);
const progress_module_1 = __webpack_require__(33);
const mock_tests_module_1 = __webpack_require__(37);
const users_module_1 = __webpack_require__(25);
const user_progress_schema_1 = __webpack_require__(36);
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_progress_schema_1.UserProgress.name, schema: user_progress_schema_1.UserProgressSchema }]),
            progress_module_1.ProgressModule,
            mock_tests_module_1.MockTestsModule,
            users_module_1.UsersModule,
        ],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const analytics_service_1 = __webpack_require__(47);
const jwt_auth_guard_1 = __webpack_require__(21);
const current_user_decorator_1 = __webpack_require__(22);
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    summary(user) {
        return this.analyticsService.getSummary(user.userId);
    }
    heatmap(user) {
        return this.analyticsService.getHeatmap(user.userId);
    }
    radar(user) {
        return this.analyticsService.getTopicRadar(user.userId);
    }
};
exports.AnalyticsController = AnalyticsController;
tslib_1.__decorate([
    (0, common_1.Get)('summary'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AnalyticsController.prototype, "summary", null);
tslib_1.__decorate([
    (0, common_1.Get)('heatmap'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AnalyticsController.prototype, "heatmap", null);
tslib_1.__decorate([
    (0, common_1.Get)('radar'),
    tslib_1.__param(0, (0, current_user_decorator_1.CurrentUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AnalyticsController.prototype, "radar", null);
exports.AnalyticsController = AnalyticsController = tslib_1.__decorate([
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _a : Object])
], AnalyticsController);


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(4);
const progress_service_1 = __webpack_require__(35);
const mock_tests_service_1 = __webpack_require__(39);
const users_service_1 = __webpack_require__(16);
const mongoose_1 = __webpack_require__(6);
const user_progress_schema_1 = __webpack_require__(36);
const mongoose_2 = __webpack_require__(17);
let AnalyticsService = class AnalyticsService {
    constructor(progressService, mockTestsService, usersService, progressModel) {
        this.progressService = progressService;
        this.mockTestsService = mockTestsService;
        this.usersService = usersService;
        this.progressModel = progressModel;
    }
    async getSummary(userId) {
        const [progressSummary, scoreTrend, user] = await Promise.all([
            this.progressService.getSummary(userId),
            this.mockTestsService.getScoreTrend(userId),
            this.usersService.findById(userId),
        ]);
        const avgScore = scoreTrend.length
            ? Math.round(scoreTrend.reduce((a, t) => a + t.percentage, 0) / scoreTrend.length)
            : 0;
        return {
            ...progressSummary,
            streak: user?.streak ?? 0,
            testsCompleted: scoreTrend.length,
            avgScore,
        };
    }
    async getHeatmap(userId) {
        return this.progressService.getActivityByDate(userId);
    }
    async getTopicRadar(userId) {
        const results = await this.progressModel.aggregate([
            { $match: { userId: new mongoose_2.Types.ObjectId(userId), status: { $in: ['reviewed', 'mastered'] } } },
            {
                $lookup: {
                    from: 'questions',
                    localField: 'questionId',
                    foreignField: '_id',
                    as: 'question',
                },
            },
            { $unwind: '$question' },
            {
                $group: {
                    _id: { topic: '$question.topic', category: '$question.category' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);
        return results;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(3, (0, mongoose_1.InjectModel)(user_progress_schema_1.UserProgress.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof progress_service_1.ProgressService !== "undefined" && progress_service_1.ProgressService) === "function" ? _a : Object, typeof (_b = typeof mock_tests_service_1.MockTestsService !== "undefined" && mock_tests_service_1.MockTestsService) === "function" ? _b : Object, typeof (_c = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object])
], AnalyticsService);


/***/ }),
/* 48 */
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const cookie_parser_1 = tslib_1.__importDefault(__webpack_require__(48));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.use((0, cookie_parser_1.default)());
    const clientUrl = process.env['CLIENT_URL'];
    const allowedOrigins = [
        'http://localhost:4200',
        'http://localhost:3000',
        'https://prep-forge-delta.vercel.app',
    ];
    if (clientUrl) {
        allowedOrigins.push(clientUrl);
    }
    app.enableCors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, or server-to-server calls)
            if (!origin) {
                return callback(null, true);
            }
            const isAllowed = allowedOrigins.some(allowed => {
                // Compare case-insensitively and strip trailing slashes to prevent configuration typos
                return allowed.toLowerCase().replace(/\/$/, '') === origin.toLowerCase().replace(/\/$/, '');
            });
            if (isAllowed) {
                callback(null, true);
            }
            else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
    });
    const port = process.env['PORT'] || 3000;
    await app.listen(port);
    console.log(`🚀 PrepForge API running at http://localhost:${port}/api`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map