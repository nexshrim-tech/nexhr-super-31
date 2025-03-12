
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserHeader = () => {
  return (
    <div className="flex justify-between items-center p-4 mb-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="text-lg font-medium">Hi There, Admin</div>
          <div className="text-sm text-muted-foreground">Mon, 6 January</div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
