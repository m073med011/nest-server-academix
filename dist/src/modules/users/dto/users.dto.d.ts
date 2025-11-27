export declare class UpdateProfileDto {
    name?: string;
    email?: string;
    imageProfileUrl?: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class SwitchContextDto {
    organizationId: string;
}
export declare class SearchUsersDto {
    email: string;
}
