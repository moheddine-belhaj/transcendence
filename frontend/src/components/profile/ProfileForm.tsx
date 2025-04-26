
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "@/components/ui/UserAvatar";

type ProfileFormValues = {
  displayName: string;
  avatar: FileList;
};

const ProfileForm = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatar);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      displayName: user?.displayName || "",
    },
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      // In a real application, you would upload the image to a server and get a URL
      // For this demo, we'll just use the preview as the avatar URL
      await updateProfile({
        displayName: data.displayName,
        avatar: avatarPreview,
      });
    } catch (error) {
      // Error is handled in the auth hook with toast notifications
    }
  };
  
  if (!user) return null;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="avatar">Profile Avatar</Label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <UserAvatar 
            src={avatarPreview} 
            name={user.displayName} 
            size="lg"
          />
          <div className="flex-1">
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              {...register("avatar")}
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          type="text"
          placeholder="Your display name"
          {...register("displayName", {
            required: "Display name is required",
            minLength: {
              value: 3,
              message: "Display name must be at least 3 characters",
            },
          })}
        />
        {errors.displayName && (
          <p className="text-destructive text-sm mt-1">{errors.displayName.message}</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-purple-gradient"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
