import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

import { AppError } from "./app-error";

type ErrorResponse = {
  code: string;
  message: string;
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    const payload: ErrorResponse = {
      code: error.code,
      message: error.message,
    };

    res.status(error.statusCode).json(payload);
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      code: "INVALID_ID",
      message: "Identificador invalido",
    } satisfies ErrorResponse);
    return;
  }

  console.error(error);

  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Erro interno do servidor",
  } satisfies ErrorResponse);
};
