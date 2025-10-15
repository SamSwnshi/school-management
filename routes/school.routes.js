const express = require("express");
const db = require("../db/db");

const router = express.Router();

const haversine = `
    (6371 * ACOS(
        COS(RADIANS(?)) * COS(RADIANS(latitude)) *
        COS(RADIANS(longitude) - RADIANS(?)) +
        SIN(RADIANS(?)) * SIN(RADIANS(latitude))
    )) AS distance_km
`;

const isValidCoordinate = (value, min, max) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
};

router.post("/addSchool", async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    if (!name || name.length < 3) {
        return res.status(400).json({
            success: false,
            message:
                "Validation failed: Name is required and must be at least 3 characters.",
        });
    }
    if (!address || address.length < 5) {
        return res.status(400).json({
            success: false,
            message:
                "Validation failed: Address is required and must be at least 5 characters.",
        });
    }
    if (!isValidCoordinate(lat, -90, 90)) {
        return res.status(400).json({
            success: false,
            message:
                "Validation failed: Latitude must be a number between -90 and 90.",
        });
    }
    if (!isValidCoordinate(long, -180, 180)) {
        return res.status(400).json({
            success: false,
            message:
                "Validation failed: Longitude must be a number between -180 and 180.",
        });
    }

    const sql =
        "INSERT INTO schools (name,address,latitude,longitude) VALUES  (?, ?, ?, ?)";
    const values = [name, address, lat, long];

    try {
        const [result] = await db.execute(sql, values);
        res.status(201).json({
            success: true,
            message: "School added successfully.",
            school: {
                id: result.insertId,
                name: name,
                address: address,
            },
        });
    } catch (error) {
        console.error("Database error on /addSchool:", error);
        res
            .status(500)
            .json({
                success: false,
                error: "Failed to add school due to a server error.",
            });
    }
});

module.exports = router;
