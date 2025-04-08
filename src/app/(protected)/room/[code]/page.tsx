import RoomContent from "@/components/room-content";
import { createClient } from "@/utils/supabase/server";

export default async function Room({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select()
    .eq("code", code)
    .single<Room>();
    
  if (error) {
    console.error("Error fetching room data:", error.message);
    return <div>Error loading room data.</div>;
  }

  return <RoomContent data={data} />;
}
