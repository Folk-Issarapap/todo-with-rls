"use server";

import { z } from "zod";
import { signInSchema, type SignInFormData } from "./schema";

export async function signIn(data: SignInFormData) {
  try {
    // Validate the input data
    const validatedData = signInSchema.parse(data);

    // TODO: Implement your actual authentication logic here
    // For now, we'll just simulate a successful login
    if (
      validatedData.email === "test@example.com" &&
      validatedData.password === "password123"
    ) {
      return { success: true };
    }

    return {
      success: false,
      error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
    };
  }
}
