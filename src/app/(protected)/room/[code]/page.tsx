import RoomContent from "@/components/room-content";
import { createClient } from "@/utils/supabase/server";

export default async function Room({
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

  return <RoomContent data={rooms} />;
}
