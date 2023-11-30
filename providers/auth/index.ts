import { API } from "../../config/api";
import axiosInstance from "../../config/axios";

async function createCodeToken(email: string) {
  try {
    const code = await axiosInstance.post(API.GET_ACCESS_CODE, {
      email,
    });

    if (code.status === 201) {
      return {
        success: true,
        data: code.data,
      };
    }

    return {
      success: false,
      data: {
        error: "EMAIL_505",
      },
    };
  } catch (error) {
    return {
      success: false,
      data: {
        error: "EMAIL_505" + error,
      },
    };
  }
}

async function validateCodeToken(code: string, email: string) {
  try {
    const token = await axiosInstance.post(API.VALIDATE_ACCESS_CODE, {
      email,
      code,
    });

    if (token.status === 201) {
      return {
        success: true,
        data: token.data,
      };
    }

    return {
      success: false,
      data: {
        error: "CODE_505",
      },
    };
  } catch (error) {
    return {
      success: false,
      data: {
        error: "CODE_505" + error,
      },
    };
  }
}

export { createCodeToken, validateCodeToken };
