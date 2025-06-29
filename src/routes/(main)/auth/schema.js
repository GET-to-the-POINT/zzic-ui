import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('올바른 이메일 주소를 입력해주세요').min(1, '이메일을 입력해주세요')
});

export const signUpSchema = z
	.object({
		email: z.string().email('올바른 이메일 주소를 입력해주세요').min(1, '이메일을 입력해주세요'),
		nickname: z
			.string()
			.min(2, '닉네임은 2자 이상이어야 합니다')
			.max(20, '닉네임은 20자 이하여야 합니다'),
		password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
		confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: '비밀번호가 일치하지 않습니다',
		path: ['confirmPassword']
	});
