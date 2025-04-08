const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// In models/User.js
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
});


// Hash password before saving
// UserSchema.pre('save', async function(next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// Add findOneOrCreate helper
UserSchema.statics.findOneOrCreate = async function (condition, doc) {
    const result = await this.findOne(condition);
    return result || this.create({ ...condition, ...doc });
};

const User = mongoose.model("User", UserSchema);

// Admin creation function
async function createInitialAdmins() {
    try {
        // Check if laundry admin exists
        const laundryAdmin = await User.findOne({ email: process.env.LAUNDRY_ADMIN_EMAIL });
        if (!laundryAdmin) {
            await User.create({
                name: "Laundry Admin",
                email: process.env.LAUNDRY_ADMIN_EMAIL,
                password: process.env.LAUNDRY_ADMIN_PASSWORD,
                role: "admin"
            });
            console.log("Laundry admin created");
        }

        // Check if salon admin exists
        const salonAdmin = await User.findOne({ email: process.env.SALON_ADMIN_EMAIL });
        if (!salonAdmin) {
            await User.create({
                name: "Salon Admin",
                email: process.env.SALON_ADMIN_EMAIL,
                password: process.env.SALON_ADMIN_PASSWORD,
                role: "admin"
            });
            console.log("Salon admin created");
        }
    } catch (error) {
        console.error("Admin creation error:", error);
    }
}



module.exports = {User, createInitialAdmins};