"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Check, Clock3, Lock, Search, ShieldCheck, UserMinus, UserPlus, Users, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  ensureSocialProfile,
  listConnections,
  listPeople,
  removeConnection,
  requestConnection,
  respondToConnection,
  SocialSchemaUnavailable,
  type Connection,
  type SocialProfile,
} from "../lib/social-client";

type Props = { user: User | null; displayName: string; signIn: () => void; notify: (message: string) => void };

export default function SocialHub({ user, displayName, signIn, notify }: Props) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [people, setPeople] = useState<SocialProfile[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(Boolean(user));
  const [busy, setBusy] = useState("");
  const [unavailable, setUnavailable] = useState(false);

  const load = useCallback(async () => {
    if (!user || !supabase) return;
    setLoading(true);
    try {
      await ensureSocialProfile(supabase, { userId: user.id, displayName: displayName || user.user_metadata?.full_name || user.email?.split("@")[0] || "Stride member" });
      const [nextConnections, nextPeople] = await Promise.all([listConnections(supabase, user.id), listPeople(supabase, user.id)]);
      setConnections(nextConnections);
      setPeople(nextPeople);
      setUnavailable(false);
    } catch (error) {
      if (error instanceof SocialSchemaUnavailable) setUnavailable(true);
      else notify(error instanceof Error ? error.message : "Connections could not be opened.");
    } finally { setLoading(false); }
  }, [displayName, notify, user]);

  useEffect(() => { void load(); }, [load]);
  const relationship = useMemo(() => new Map(connections.map((item) => [item.person.userId, item])), [connections]);
  const incoming = connections.filter((item) => item.status === "pending" && item.direction === "incoming");
  const accepted = connections.filter((item) => item.status === "accepted");
  const filtered = people.filter((person) => {
    const text = `${person.displayName} ${person.username || ""}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && !relationship.has(person.userId);
  });

  async function act(key: string, action: () => Promise<void>, success: string) {
    setBusy(key);
    try { await action(); notify(success); await load(); }
    catch (error) { notify(error instanceof Error ? error.message : "That action could not be completed."); }
    finally { setBusy(""); }
  }

  if (!user) return <section className="social-hub social-locked"><span className="social-hero-icon"><Lock /></span><span className="eyebrow">YOUR PEOPLE, YOUR PACE</span><h1>Connections stay private.</h1><p>Sign in to send requests, choose who sees connection-only Moments, and keep control of your circle.</p><button className="primary" onClick={signIn}>Sign in to continue</button></section>;
  if (unavailable) return <section className="social-hub social-locked"><span className="social-hero-icon"><ShieldCheck /></span><span className="eyebrow">SECURE SOCIAL LAYER</span><h1>Connections are almost ready.</h1><p>The interface is complete. Apply the secure social database migration to turn requests and notifications on.</p></section>;

  return <section className="social-hub">
    <div className="social-hub-hero"><div><span className="eyebrow">YOUR PRIVATE CIRCLE</span><h1>Good energy, minus the noise.</h1><p>Connect intentionally. Only accepted connections can see Moments you share with your circle.</p></div><span className="social-hero-icon"><Users /></span></div>
    {loading ? <div className="social-loading">Opening your connections…</div> : <>
      {incoming.length > 0 && <div className="social-section"><div className="social-section-title"><div><span className="eyebrow">REQUESTS</span><h2>Waiting for you</h2></div><span>{incoming.length}</span></div><div className="connection-list">{incoming.map((item) => <article className="connection-card" key={item.id}><Avatar person={item.person} /><div><b>{item.person.displayName}</b><small>{item.person.username ? `@${item.person.username}` : "Would like to connect"}</small></div><div className="connection-actions"><button className="primary compact" disabled={busy === item.id} onClick={() => void act(item.id, () => respondToConnection(supabase!, item.id, true), "Connection accepted.")}><Check size={16} /> Accept</button><button className="icon-btn" aria-label="Decline request" disabled={busy === item.id} onClick={() => void act(item.id, () => respondToConnection(supabase!, item.id, false), "Request declined.")}><X size={18} /></button></div></article>)}</div></div>}
      <div className="social-section"><div className="social-section-title"><div><span className="eyebrow">CONNECTIONS</span><h2>Your circle</h2></div><span>{accepted.length}</span></div>{accepted.length ? <div className="connection-list">{accepted.map((item) => <article className="connection-card" key={item.id}><Avatar person={item.person} /><div><b>{item.person.displayName}</b><small>{item.person.username ? `@${item.person.username}` : "Connected"}</small></div><button className="secondary compact" disabled={busy === item.id} onClick={() => void act(item.id, () => removeConnection(supabase!, item.id), "Connection removed.")}><UserMinus size={15} /> Remove</button></article>)}</div> : <div className="social-empty"><Users size={25} /><b>Your circle starts small.</b><p>Search below and invite someone whose progress you want to support.</p></div>}</div>
      <div className="social-section"><div className="social-section-title"><div><span className="eyebrow">DISCOVER PEOPLE</span><h2>Find your people</h2></div></div><label className="social-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or username" /></label><div className="connection-list">{filtered.map((person) => <article className="connection-card" key={person.userId}><Avatar person={person} /><div><b>{person.displayName}</b><small>{person.username ? `@${person.username}` : "On Stride"}</small></div><button className="secondary compact" disabled={busy === person.userId} onClick={() => void act(person.userId, () => requestConnection(supabase!, person.userId), "Request sent.")}><UserPlus size={15} /> Connect</button></article>)}{!filtered.length && <div className="social-empty"><Clock3 size={24} /><b>No new people here yet.</b><p>As discoverable profiles join, they will appear here.</p></div>}</div></div>
    </>}
  </section>;
}

function Avatar({ person }: { person: SocialProfile }) { return <span className="avatar sage social-avatar">{person.displayName.slice(0, 2).toUpperCase()}</span>; }
