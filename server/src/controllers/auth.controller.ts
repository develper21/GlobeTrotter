import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendCreated, sendSuccess } from '../utils/response.util';
import { AuthenticatedRequest } from '../types';
import { UnauthorizedError } from '../errors/AppError';
import { uploadToCloudinary } from '../middlewares/upload.middleware';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await authService.register(req.body);
    sendCreated(res, {
      message: 'Registration successful',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    sendSuccess(res, {
      message: 'Login successful',
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }
    const user = await authService.getMeById(req.user.id);
    sendSuccess(res, {
      message: 'Current user profile retrieved successfully',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }
    let profilePhotoUrl = req.body.profilePhoto;
    if (req.file) {
      const uploadResult: any = await uploadToCloudinary(req.file, 'profiles');
      profilePhotoUrl = uploadResult.secure_url;
    }
    const user = await authService.updateProfile(req.user.id, { ...req.body, profilePhoto: profilePhotoUrl });
    sendSuccess(res, {
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}
