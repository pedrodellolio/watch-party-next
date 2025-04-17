import { CreateRoomDialog } from "@/components/dialogs/create-room-dialog";
import { JoinRoomDialog } from "@/components/dialogs/join-room-dialog";

export default async function Home() {
  return (
    <div className="flex flex-col m-auto gap-4 items-center justify-center w-[380px] h-screen">
      <CreateRoomDialog />
      <p className="text-foreground">or</p>
      <JoinRoomDialog />
    </div>
  );
}
