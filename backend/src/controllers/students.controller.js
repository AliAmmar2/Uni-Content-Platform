const Student = require("../models/Student");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
// GET ALL
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("faculty")
            .populate("major");

        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// GET BY ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .select("-passwordHash")
            .populate("faculty")
            .populate("major");

        if (!student) {
            return res.status(404).json({message: "Student not found"});
        }

        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.getMe = async (req, res) => {
    try {

        const student = await Student.findById(req.user.id)
            .populate('faculty', 'name code')
            .populate('major', 'name code')
            .select('-passwordHash');

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json(student);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};
// CREATE

exports.createStudent = async (req, res) => {
    try {
        const {
            universityId,
            universityEmail,
            name,
            faculty,
            major,
            academicYear,
            calendarYear,
            role,
            status,
            password
        } = req.body;

        // required validation
        if (
            !universityId ||
            !universityEmail ||
            !name ||
            !faculty ||
            !major ||
            !academicYear ||
            !calendarYear ||
            !password
        ) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        // unique university ID
        const existingStudentByUniversityId = await Student.findOne({
            universityId
        });

        if (existingStudentByUniversityId) {
            return res.status(409).json({
                message: "University ID already exists"
            });
        }

        // unique university email
        const existingStudentByEmail = await Student.findOne({
            universityEmail: universityEmail.toLowerCase()
        });

        if (existingStudentByEmail) {
            return res.status(409).json({
                message: "University email already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newStudent = new Student({
            universityId,
            universityEmail: universityEmail.toLowerCase(),
            name,
            faculty,
            major,
            academicYear,
            calendarYear,
            role,
            status,
            passwordHash
        });

        const saved = await newStudent.save();

        const populatedStudent = await Student.findById(saved._id)
            .populate("faculty")
            .populate("major");

        const studentResponse = populatedStudent.toObject();

        delete studentResponse.passwordHash;

        return res.status(201).json(studentResponse);

    } catch (err) {
        console.error("CREATE STUDENT ERROR:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// UPDATE
exports.updateStudent = async (req, res) => {
    try {
        const {id} = req.params;

        const {
            universityId,
            universityEmail,
            name,
            faculty,
            major,
            academicYear,
            calendarYear,
            role,
            status
        } = req.body;

        // required validation
        if (
            !universityId ||
            !universityEmail ||
            !name ||
            !faculty ||
            !major ||
            !academicYear ||
            !calendarYear
        ) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        // unique university ID
        const existingStudentByUniversityId = await Student.findOne({
            universityId,
            _id: {$ne: id}
        });

        if (existingStudentByUniversityId) {
            return res.status(409).json({
                message: "University ID already exists"
            });
        }

        // unique university email
        const existingStudentByEmail = await Student.findOne({
            universityEmail: universityEmail.toLowerCase(),
            _id: {$ne: id}
        });

        if (existingStudentByEmail) {
            return res.status(409).json({
                message: "University email already exists"
            });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            {
                universityId,
                universityEmail: universityEmail.toLowerCase(),
                name,
                faculty,
                major,
                academicYear,
                calendarYear,
                role,
                status
            },
            {
                new: true,
                runValidators: true
            }
        )
            .populate("faculty")
            .populate("major");

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const studentResponse = updatedStudent.toObject();

        delete studentResponse.passwordHash;

        return res.status(200).json(studentResponse);

    } catch (err) {
        console.error("UPDATE STUDENT ERROR:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// DELETE
exports.deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        const deleted = await Student.findOneAndDelete({
            universityId: req.params.id
        });

        if (!deletedStudent) {
            return res.status(404).json({message: "Student not found"});
        }

        res.status(200).json({
            message: "Student deleted successfully"
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.updatePasswordBySuperAdmin = async (req, res) => {
    try {

        const {id} = req.params;

        const {
            superAdminPassword,
            newPassword
        } = req.body;

        if (!superAdminPassword || !newPassword) {
            return res.status(400).json({
                message: "Super admin password and new password are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters"
            });
        }

        // logged in admin
        const admin = await Admin.findById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        // only super admin allowed
        if (admin.role !== "super_admin") {
            return res.status(403).json({
                message: "Only super admin can update student password"
            });
        }

        // verify super admin password
        const isPasswordValid = await bcrypt.compare(
            superAdminPassword,
            admin.passwordHash
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Super admin password is incorrect"
            });
        }

        // find student
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // update password
        student.passwordHash = await bcrypt.hash(newPassword, 10);

        // reset lock/login attempts
        student.loginAttempts = 0;
        student.lockUntil = undefined;

        await student.save();

        return res.status(200).json({
            message: "Student password updated successfully"
        });

    } catch (error) {

        console.error(
            "UPDATE STUDENT PASSWORD BY SUPER ADMIN ERROR:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
//
// exports.updateOwnPassword = async (req, res) => {
//     try {
//         const {
//             oldPassword,
//             newPassword
//         } = req.body;
//
//         if (!oldPassword || !newPassword) {
//             return res.status(400).json({
//                 message: "Old password and new password are required"
//             });
//         }
//
//         if (newPassword.length < 8) {
//             return res.status(400).json({
//                 message: "New password must be at least 8 characters"
//             });
//         }
//
//         const student = await Student.findById(req.user.id);
//
//         if (!student) {
//             return res.status(404).json({
//                 message: "Student not found"
//             });
//         }
//
//         const isOldPasswordValid = await bcrypt.compare(
//             oldPassword,
//             student.passwordHash
//         );
//
//         if (!isOldPasswordValid) {
//             return res.status(400).json({
//                 message: "Old password is incorrect"
//             });
//         }
//
//         const isSamePassword = await bcrypt.compare(
//             newPassword,
//             student.passwordHash
//         );
//
//         if (isSamePassword) {
//             return res.status(400).json({
//                 message: "New password must be different from old password"
//             });
//         }
//
//         student.passwordHash = await bcrypt.hash(newPassword, 10);
//
//         student.loginAttempts = 0;
//         student.lockUntil = undefined;
//
//         await student.save();
//
//         return res.status(200).json({
//             message: "Password updated successfully"
//         });
//
//     } catch (error) {
//         console.error("UPDATE OWN STUDENT PASSWORD ERROR:", error);
//
//         return res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// };