import RoomContent from "@/components/room-content";
import RoomSocket from "@/components/room-socket";
import { createClient } from "@/utils/supabase/server";

export default async function Socket({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select()
    .eq("code", code)
    .single<Room>();

  if (roomsError) {
    console.error("Error fetching room data:", roomsError.message);
    return <div>Error loading room data.</div>;
  }

  return <RoomSocket data={rooms} />;
}
