import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateRoomForm } from "../forms/create-room-form";

export function CreateRoomDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          Create a Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create a new room</DialogTitle>
          <DialogDescription className="text-foreground/50">
            Give your room a name and share it with your friends.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <CreateRoomForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
