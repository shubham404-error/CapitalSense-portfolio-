"use client";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Bell, Check, Heart, MessageCircle, UserPlus } from "lucide-react";
import { supabase } from "../lib/supabase";
import { getNotificationPreferences, listNotifications, markNotificationsRead, saveNotificationPreferences, type NotificationPreferences, type SocialNotification } from "../lib/social-client";

const initial: NotificationPreferences = { connectionRequests: true, cheers: true, comments: true, weeklyRecap: false };
type Props = { user: User | null; signIn: () => void; notify: (message: string) => void };
const copy: Record<SocialNotification["kind"], string> = { connection_request: "sent you a connection request", connection_accepted: "accepted your connection request", cheer: "cheered your Moment", comment: "encouraged your Moment" };
const Icon = ({ kind }: { kind: SocialNotification["kind"] }) => kind === "cheer" ? <Heart /> : kind === "comment" ? <MessageCircle /> : <UserPlus />;

export default function SocialNotifications({ user, signIn, notify }: Props) {
  const [items, setItems] = useState<SocialNotification[]>([]), [preferences, setPreferences] = useState(initial), [loading, setLoading] = useState(Boolean(user)), [saving, setSaving] = useState(false);
  const load = useCallback(async () => { if (!user || !supabase) return; setLoading(true); try { const [nextItems, nextPreferences] = await Promise.all([listNotifications(supabase), getNotificationPreferences(supabase, user.id)]); setItems(nextItems); setPreferences(nextPreferences); } catch (error) { notify(error instanceof Error ? error.message : "Notifications could not be opened."); } finally { setLoading(false); } }, [notify, user]);
  useEffect(() => { void load(); }, [load]);
  if (!user) return <div className="notification-empty"><Bell size={30} /><h2>Your updates, without the noise.</h2><p>Sign in to see connection requests, cheers, and encouragement.</p><button className="primary" onClick={signIn}>Sign in</button></div>;
  async function readAll() { if (!supabase) return; try { await markNotificationsRead(supabase); setItems((current) => current.map((item) => ({ ...item, read: true }))); } catch (error) { notify(error instanceof Error ? error.message : "Notifications could not be updated."); } }
  async function save(next: NotificationPreferences) { if (!supabase || !user) return; setPreferences(next); setSaving(true); try { await saveNotificationPreferences(supabase, user.id, next); } catch (error) { notify(error instanceof Error ? error.message : "Preferences could not be saved."); } finally { setSaving(false); } }
  return <div className="notifications-panel"><span className="eyebrow">YOUR UPDATES</span><div className="notification-heading"><h2>What’s moving.</h2>{items.some((item) => !item.read) && <button className="text-button" onClick={() => void readAll()}><Check size={15} /> Mark all read</button>}</div>{loading ? <div className="social-loading">Opening updates…</div> : items.length ? <div className="notification-list">{items.map((item) => <article className={item.read ? "notification-item" : "notification-item unread"} key={item.id}><span><Icon kind={item.kind} /></span><div><b>{item.actorName}</b> {copy[item.kind]}<small>{new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</small></div></article>)}</div> : <div className="notification-empty"><Bell size={28} /><b>You’re all caught up.</b><p>Your connection activity will appear here.</p></div>}<div className="notification-preferences"><span className="eyebrow">PREFERENCES</span><h3>Choose what reaches you</h3>{([ ["connectionRequests", "Connection requests"], ["cheers", "Cheers"], ["comments", "Encouragement"], ["weeklyRecap", "A calm weekly recap"] ] as const).map(([key, label]) => <label key={key}><span>{label}</span><input type="checkbox" checked={preferences[key]} disabled={saving} onChange={(event) => void save({ ...preferences, [key]: event.target.checked })} /></label>)}</div></div>;
}
