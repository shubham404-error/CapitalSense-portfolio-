import type { SupabaseClient } from "@supabase/supabase-js";

export type MomentAudience = "private" | "connections" | "explore";
export type MomentType =
  | "why_i_started"
  | "small_win"
  | "learning"
  | "goal"
  | "monthly_reflection"
  | "reflection";

export type SocialMoment = {
  id: string;
  userId: string;
  name: string;
  initials: string;
  caption: string;
  months: number;
  photo?: string;
  liked: boolean;
  likes: number;
  time: string;
  createdAt: string;
  audience: MomentAudience;
  momentType: MomentType;
  verification: "self_reported" | "reviewed" | "provider_confirmed";
  isOwner: boolean;
};

export type SocialProfile = {
  userId: string;
  displayName: string;
  username: string | null;
  avatar: string | null;
};

export type Connection = {
  id: string;
  status: "pending" | "accepted" | "declined";
  direction: "incoming" | "outgoing";
  person: SocialProfile;
  createdAt: string;
};

export type MomentComment = {
  id: string;
  userId: string;
  displayName: string;
  body: string;
  createdAt: string;
  isOwner: boolean;
};

export type SocialNotification = {
  id: string;
  actorId: string;
  actorName: string;
  momentId: string | null;
  kind: "connection_request" | "connection_accepted" | "cheer" | "comment";
  createdAt: string;
  read: boolean;
};

export type NotificationPreferences = {
  connectionRequests: boolean;
  cheers: boolean;
  comments: boolean;
  weeklyRecap: boolean;
};

const defaultNotificationPreferences: NotificationPreferences = {
  connectionRequests: true,
  cheers: true,
  comments: true,
  weeklyRecap: false,
};

type MomentRow = {
  id: string;
  user_id: string;
  author_display_name: string;
  caption: string;
  moment_type: MomentType;
  audience: MomentAudience;
  photo: string | null;
  milestone_months: number;
  verification: SocialMoment["verification"];
  created_at: string;
  moment_cheers?: Array<{ user_id: string }> | null;
};

export class SocialSchemaUnavailable extends Error {
  constructor() {
    super("Moments are waiting for the latest secure database update.");
    this.name = "SocialSchemaUnavailable";
  }
}

function throwSocialError(error: { code?: string; message?: string } | null) {
  if (!error) return;
  if (["PGRST205", "42P01", "42883"].includes(error.code || "")) {
    throw new SocialSchemaUnavailable();
  }
  throw new Error(error.message || "The social request could not be completed.");
}

function relativeTime(value: string) {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d` : new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function mapMoment(row: MomentRow, viewerId: string): SocialMoment {
  const cheers = row.moment_cheers || [];
  return {
    id: row.id,
    userId: row.user_id,
    name: row.author_display_name,
    initials: row.author_display_name.slice(0, 2).toUpperCase(),
    caption: row.caption,
    months: row.milestone_months,
    photo: row.photo || undefined,
    liked: cheers.some((cheer) => cheer.user_id === viewerId),
    likes: cheers.length,
    time: relativeTime(row.created_at),
    createdAt: row.created_at,
    audience: row.audience,
    momentType: row.moment_type,
    verification: row.verification,
    isOwner: row.user_id === viewerId,
  };
}

export async function listMoments(
  client: SupabaseClient,
  viewerId: string,
  feed: "following" | "explore",
) {
  let query = client
    .from("moments")
    .select("id,user_id,author_display_name,caption,moment_type,audience,photo,milestone_months,verification,created_at,moment_cheers(user_id)")
    .order("created_at", { ascending: false })
    .limit(40);
  query = feed === "explore" ? query.eq("audience", "explore") : query.neq("audience", "explore");
  const { data, error } = await query;
  throwSocialError(error);
  return ((data || []) as MomentRow[]).map((row) => mapMoment(row, viewerId));
}

export async function createMoment(
  client: SupabaseClient,
  input: {
    userId: string;
    displayName: string;
    caption: string;
    audience: MomentAudience;
    momentType: MomentType;
    photo?: string | null;
  },
) {
  const { data, error } = await client
    .from("moments")
    .insert({
      user_id: input.userId,
      author_display_name: input.displayName.trim().slice(0, 40),
      caption: input.caption.trim().slice(0, 400),
      audience: input.audience,
      moment_type: input.momentType,
      photo: input.photo || null,
    })
    .select("id,user_id,author_display_name,caption,moment_type,audience,photo,milestone_months,verification,created_at,moment_cheers(user_id)")
    .single();
  throwSocialError(error);
  if (!data) throw new Error("The moment was not returned after saving.");
  return mapMoment(data as MomentRow, input.userId);
}

export async function toggleMomentCheer(
  client: SupabaseClient,
  userId: string,
  momentId: string,
  currentlyCheered: boolean,
) {
  const request = currentlyCheered
    ? client.from("moment_cheers").delete().eq("moment_id", momentId).eq("user_id", userId)
    : client.from("moment_cheers").insert({ moment_id: momentId, user_id: userId, reaction: "cheer" });
  const { error } = await request;
  throwSocialError(error);
}

export async function addMomentComment(
  client: SupabaseClient,
  input: { userId: string; momentId: string; displayName: string; body: string },
) {
  const { error } = await client.from("moment_comments").insert({
    moment_id: input.momentId,
    user_id: input.userId,
    author_display_name: input.displayName.trim().slice(0, 40),
    body: input.body.trim().slice(0, 280),
  });
  throwSocialError(error);
}

export async function ensureSocialProfile(
  client: SupabaseClient,
  input: { userId: string; displayName: string; username?: string | null; avatar?: string | null },
) {
  const displayName = input.displayName.trim().slice(0, 40) || "Stride member";
  const payload: Record<string, string | null> = {
    user_id: input.userId,
    display_name: displayName,
    updated_at: new Date().toISOString(),
  };
  if (input.username !== undefined) payload.username = input.username || null;
  if (input.avatar !== undefined) payload.avatar = input.avatar || null;
  const { error } = await client.from("social_profiles").upsert(
    payload,
    { onConflict: "user_id" },
  );
  throwSocialError(error);
}

function mapProfile(row: { user_id: string; display_name: string; username: string | null; avatar: string | null }): SocialProfile {
  return { userId: row.user_id, displayName: row.display_name, username: row.username, avatar: row.avatar };
}

export async function listConnections(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("connections")
    .select("id,requester_id,addressee_id,status,created_at")
    .neq("status", "declined")
    .order("created_at", { ascending: false });
  throwSocialError(error);
  const rows = (data || []) as Array<{ id: string; requester_id: string; addressee_id: string; status: Connection["status"]; created_at: string }>;
  const ids = [...new Set(rows.map((row) => row.requester_id === userId ? row.addressee_id : row.requester_id))];
  if (!ids.length) return [] as Connection[];
  const profiles = await client.from("social_profiles").select("user_id,display_name,username,avatar").in("user_id", ids);
  throwSocialError(profiles.error);
  const byId = new Map(((profiles.data || []) as Array<{ user_id: string; display_name: string; username: string | null; avatar: string | null }>).map((row) => [row.user_id, mapProfile(row)]));
  return rows.flatMap((row) => {
    const otherId = row.requester_id === userId ? row.addressee_id : row.requester_id;
    const person = byId.get(otherId);
    return person ? [{ id: row.id, status: row.status, direction: row.addressee_id === userId ? "incoming" as const : "outgoing" as const, person, createdAt: row.created_at }] : [];
  });
}

export async function listPeople(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("social_profiles")
    .select("user_id,display_name,username,avatar")
    .neq("user_id", userId)
    .order("display_name")
    .limit(30);
  throwSocialError(error);
  return ((data || []) as Array<{ user_id: string; display_name: string; username: string | null; avatar: string | null }>).map(mapProfile);
}

export async function requestConnection(client: SupabaseClient, targetId: string) {
  const { error } = await client.rpc("create_connection_request", { target: targetId });
  throwSocialError(error);
}

export async function respondToConnection(client: SupabaseClient, connectionId: string, accept: boolean) {
  const { data, error } = await client.rpc("respond_connection", { connection_id: connectionId, accept_request: accept });
  throwSocialError(error);
  if (!data) throw new Error("This request is no longer available.");
}

export async function removeConnection(client: SupabaseClient, connectionId: string) {
  const { error } = await client.from("connections").delete().eq("id", connectionId);
  throwSocialError(error);
}

export async function listMomentComments(client: SupabaseClient, momentId: string, viewerId: string) {
  const { data, error } = await client
    .from("moment_comments")
    .select("id,user_id,author_display_name,body,created_at")
    .eq("moment_id", momentId)
    .order("created_at")
    .limit(100);
  throwSocialError(error);
  return ((data || []) as Array<{ id: string; user_id: string; author_display_name: string; body: string; created_at: string }>).map((row) => ({
    id: row.id, userId: row.user_id, displayName: row.author_display_name, body: row.body,
    createdAt: row.created_at, isOwner: row.user_id === viewerId,
  }));
}

export async function deleteMomentComment(client: SupabaseClient, commentId: string) {
  const { error } = await client.from("moment_comments").delete().eq("id", commentId);
  throwSocialError(error);
}

export async function reportMoment(client: SupabaseClient, input: { momentId: string; userId: string; reason: string; details?: string }) {
  const { error } = await client.from("moment_reports").upsert({
    moment_id: input.momentId, reporter_id: input.userId, reason: input.reason,
    details: input.details?.trim().slice(0, 500) || null,
  }, { onConflict: "moment_id,reporter_id", ignoreDuplicates: true });
  throwSocialError(error);
}

export async function blockUser(client: SupabaseClient, blockerId: string, blockedId: string) {
  const { error } = await client.from("user_blocks").upsert({ blocker_id: blockerId, blocked_id: blockedId });
  throwSocialError(error);
}

export async function archiveMoment(client: SupabaseClient, momentId: string) {
  const { error } = await client.from("moments").update({ archived_at: new Date().toISOString() }).eq("id", momentId);
  throwSocialError(error);
}

export async function deleteMoment(client: SupabaseClient, momentId: string) {
  const { error } = await client.from("moments").delete().eq("id", momentId);
  throwSocialError(error);
}

export async function listNotifications(client: SupabaseClient) {
  const { data, error } = await client.from("social_notifications")
    .select("id,actor_id,moment_id,kind,created_at,read_at").order("created_at", { ascending: false }).limit(50);
  throwSocialError(error);
  const rows = (data || []) as Array<{ id: string; actor_id: string; moment_id: string | null; kind: SocialNotification["kind"]; created_at: string; read_at: string | null }>;
  const actorIds = [...new Set(rows.map((row) => row.actor_id))];
  const actors = actorIds.length ? await client.from("social_profiles").select("user_id,display_name").in("user_id", actorIds) : { data: [], error: null };
  throwSocialError(actors.error);
  const names = new Map(((actors.data || []) as Array<{ user_id: string; display_name: string }>).map((row) => [row.user_id, row.display_name]));
  return rows.map((row) => ({ id: row.id, actorId: row.actor_id, actorName: names.get(row.actor_id) || "Someone", momentId: row.moment_id, kind: row.kind, createdAt: row.created_at, read: Boolean(row.read_at) }));
}

export async function markNotificationsRead(client: SupabaseClient) {
  const { error } = await client.from("social_notifications").update({ read_at: new Date().toISOString() }).is("read_at", null);
  throwSocialError(error);
}

export async function getNotificationPreferences(client: SupabaseClient, userId: string) {
  const { data, error } = await client.from("notification_preferences").select("connection_requests,cheers,comments,weekly_recap").eq("user_id", userId).maybeSingle();
  throwSocialError(error);
  if (!data) return defaultNotificationPreferences;
  return { connectionRequests: data.connection_requests, cheers: data.cheers, comments: data.comments, weeklyRecap: data.weekly_recap } as NotificationPreferences;
}

export async function saveNotificationPreferences(client: SupabaseClient, userId: string, value: NotificationPreferences) {
  const { error } = await client.from("notification_preferences").upsert({
    user_id: userId, connection_requests: value.connectionRequests, cheers: value.cheers,
    comments: value.comments, weekly_recap: value.weeklyRecap, updated_at: new Date().toISOString(),
  });
  throwSocialError(error);
}
