const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

//middleware para encrypy pass
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive numbre');
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word "password"');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true,
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true,
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', //conecta con id (campo owner) de ref (Task)
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });

    await user.save();

    return token;
};

//sobreescritura del metodo JSON.stringify(), para que al devolver el obj a postman filtre los campos
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject(); //metodo de mongoose para manipular los campos de los obj devueltos

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
};


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');//corta el flujo y no hace otro llamado await
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

//Hash the plain text password before saving
//pre->antes de un evento como el de .save()
//se usa function en vez de arrow, porq no se necesita bindear el this,
//el this corresponde al user
userSchema.pre('save', async function (next) {
    const user = this;
    //isModified->mongoose check que si el campo password se modifico 
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this;

    await Task.deleteMany({ owner: user._id });

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;