import csv from "csvtojson";
import { Request, Response } from "express";
import mongoose, { mongo } from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getProvinces(req: Request, res: Response) {
  try {
    const provincesFilePath = path.join(__dirname, "../../data/provinces.csv");
    const provinces = await csv().fromFile(provincesFilePath);
    return res.status(200).json({
      status: "success",
      data: provinces,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

async function getRegencies(req: Request, res: Response) {
  try {
    const { province_code } = req.query;
    const regenciesFilePath = path.join(__dirname, "../../data/regencies.csv");
    const regencies = await csv().fromFile(regenciesFilePath);

    if (!province_code) {
      return res.status(200).json({
        data: regencies,
      });
    }

    const regenciesData = regencies.filter((regency) => {
      return regency.kode_provinsi === province_code;
    });

    return res.status(200).json({
      status: "success",
      data: regenciesData,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

async function getDistricts(req: Request, res: Response) {
  try {
    const { regency_code } = req.query;
    const districtsFilePath = path.join(__dirname, "../../data/districts.csv");
    const districts = await csv().fromFile(districtsFilePath);

    if (!regency_code) {
      return res.status(200).json({
        data: districts,
      });
    }

    const districtsData = districts.filter((district) => {
      return district.kode_kabupaten === regency_code;
    });

    return res.status(200).json({
      status: "success",
      data: districtsData,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

async function getVillages(req: Request, res: Response) {
  try {
    const { district_code } = req.query;
    const villagesFilePath = path.join(__dirname, "../../data/villages.csv");
    const villages = await csv().fromFile(villagesFilePath);

    if (!district_code) {
      return res.status(200).json({
        data: villages,
      });
    }

    const villagesData = villages.filter((village) => {
      return village.kode_kecamatan === district_code;
    });

    return res.status(200).json({
      status: "success",
      data: villagesData,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export { getProvinces, getRegencies, getDistricts, getVillages };
