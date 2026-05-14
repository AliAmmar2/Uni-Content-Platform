const UniStudent = require("../models/Student");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
// GET ALL
exports.getStudents = async (req, res) => {
    try {
        const students = await UniStudent.find()
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
        const student = await UniStudent.findById(req.params.id)
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
        const existingStudentByUniversityId = await UniStudent.findOne({
            universityId
        });

        if (existingStudentByUniversityId) {
            return res.status(409).json({
                message: "University ID already exists"
            });
        }

        // unique university email
        const existingStudentByEmail = await UniStudent.findOne({
            universityEmail: universityEmail.toLowerCase()
        });

        if (existingStudentByEmail) {
            return res.status(409).json({
                message: "University email already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newStudent = new UniStudent({
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

        const populatedStudent = await UniStudent.findById(saved._id)
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
        const existingStudentByUniversityId = await UniStudent.findOne({
            universityId,
            _id: {$ne: id}
        });

        if (existingStudentByUniversityId) {
            return res.status(409).json({
                message: "University ID already exists"
            });
        }

        // unique university email
        const existingStudentByEmail = await UniStudent.findOne({
            universityEmail: universityEmail.toLowerCase(),
            _id: {$ne: id}
        });

        if (existingStudentByEmail) {
            return res.status(409).json({
                message: "University email already exists"
            });
        }

        const updatedStudent = await UniStudent.findByIdAndUpdate(
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
        const deletedStudent = await UniStudent.findByIdAndDelete(req.params.id);

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
        const student = await UniStudent.findById(id);

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