"use client";
import Account from "./account";
import OnboardingHelp from "./onboarding-help";
import { JourneyInvestments, JourneySpending } from "./journey-money";
import { NextMove, HabitPassport, ReviewToolkit } from "./launch-journey";
import Bucks from "./bucks";
import AssetPlusOnboarding from "./assetplus-onboarding";
import { investmentProvider } from "../lib/investment-provider";
import ProfilePage from "./profile-page";
import FundResearch from "./fund-research";
import GuidePage from "./guide-page";
import ShareComposer from "./share-composer";
import SocialHub from "./social-hub";
import SocialNotifications from "./social-notifications";
import MomentManager from "./moment-manager";
import { compressedSharePhoto } from "../lib/share-post";
import {
  addMomentComment,
  createMoment,
  listMoments,
  SocialSchemaUnavailable,
  toggleMomentCheer,
  type MomentAudience,
  type MomentType,
} from "../lib/social-client";
import { isGuideUnavailable, requestGuide } from "../lib/guide-client";
import { setRuleGuideAnswers } from "../lib/rule-guide";
import LensStudio from "./lens-studio";
import { supabase, oauthReturnFailed } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState, useRef } from "react";
import {
  Camera,
  Activity,
  ArrowUpRight,
  ArrowRight,
  Bell,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Globe,
  Heart,
  Home,
  ImagePlus,
  Leaf,
  Lock,
  Menu,
  MoreHorizontal,
  MessageCircle,
  Plus,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  UserRound,
  Wallet,
  Layers,
  X,
  Zap,
  Download,
  LogOut,
} from "lucide-react";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isStaticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "true";
type Tab =
  | "Feed"
  | "My journey"
  | "Discover"
  | "Circles"
  | "Account"
  | "Funds"
  | "AI Guide"
  | "Invest";
type JourneySection = "Overview" | "Spending" | "Investments" | "Progress";
type Entry = {
  id: number | string;
  userId?: string;
  name: string;
  initials: string;
  caption: string;
  months: number;
  photo?: string;
  liked: boolean;
  likes: number;
  time: string;
  audience?: MomentAudience;
  momentType?: MomentType;
  cloud?: boolean;
};
const initial: Entry[] = [];
const vibes = [
  {
    emoji: "🏔️",
    tag: "THE DREAM",
    title: "A mountain morning beats another impulse buy.",
    text: "I like having something meaningful to look forward to.",
  },
  {
    emoji: "🛟",
    tag: "THE PEACE OF MIND",
    title: "An unexpected bill shouldn’t become a plot twist.",
    text: "Having a little breathing room sounds pretty good.",
  },
  {
    emoji: "🌱",
    tag: "THE LONG GAME",
    title: "Slow progress is still a flex.",
    text: "I’d rather build a habit than chase the next big thing.",
  },
  {
    emoji: "🧑‍🤝‍🧑",
    tag: "THE COMPANY",
    title: "A small win feels better with my people.",
    text: "I’d enjoy encouragement from a close circle.",
  },
  {
    emoji: "🧭",
    tag: "THE CLARITY",
    title: "Tell me the why before I tap yes.",
    text: "I want to understand a decision before making it.",
  },
];
vibes.push(
  ...[
    {
      emoji: "🗓️",
      tag: "THE PLAN",
      title: "A plan can change without being a failure.",
      text: "I like reviewing my goals when life changes.",
    },
    {
      emoji: "🧾",
      tag: "THE DETAILS",
      title: "The small print deserves a little daylight.",
      text: "Costs and access rules matter to me.",
    },
    {
      emoji: "🔒",
      tag: "THE BOUNDARIES",
      title: "Some wins belong in the close-friends group.",
      text: "I want control over who sees my milestones.",
    },
    {
      emoji: "☕",
      tag: "THE EVERYDAY",
      title: "A good money habit leaves room for living.",
      text: "I want a plan I can sustain, not a punishment.",
    },
    {
      emoji: "💬",
      tag: "THE QUESTIONS",
      title: "“I don’t understand” is a good place to start.",
      text: "I’m comfortable asking for an explanation.",
    },
    {
      emoji: "🎉",
      tag: "THE ENCOURAGEMENT",
      title: "A friend showing up deserves a cheer.",
      text: "I enjoy celebrating effort without comparing amounts.",
    },
    {
      emoji: "🎯",
      tag: "THE PURPOSE",
      title: "A named goal feels more real than a vague someday.",
      text: "Knowing what I’m working towards helps me.",
    },
    {
      emoji: "🔍",
      tag: "THE REASON",
      title: "A confident claim isn’t the same as a good explanation.",
      text: "I want to see the reasoning and its limits.",
    },
    {
      emoji: "🌙",
      tag: "THE QUIET",
      title: "Not every milestone needs an audience.",
      text: "I prefer to choose when I share.",
    },
    {
      emoji: "🧩",
      tag: "THE FLEXIBILITY",
      title: "A small step I can repeat beats a grand reset.",
      text: "I value manageable routines.",
    },
    {
      emoji: "🧠",
      tag: "THE LEARNING",
      title: "Understanding one thing well beats ten hot tips.",
      text: "I prefer useful context over information overload.",
    },
    {
      emoji: "🤝",
      tag: "THE SUPPORT",
      title: "A supportive circle shouldn’t feel like a scoreboard.",
      text: "I want encouragement without rankings.",
    },
    {
      emoji: "🌦️",
      tag: "THE RESET",
      title: "A difficult month doesn’t erase the journey.",
      text: "I value a plan that makes room for setbacks.",
    },
    {
      emoji: "🛠️",
      tag: "THE CONTROL",
      title: "Explain the options, then let me choose.",
      text: "I want a say in decisions affecting my money.",
    },
    {
      emoji: "📵",
      tag: "THE SPACE",
      title: "Good support knows when to leave me alone.",
      text: "I want to set my own reminder and sharing boundaries.",
    },
  ],
);
const vibeDomains = [
  "planning",
  "planning",
  "planning",
  "community",
  "clarity",
  "planning",
  "clarity",
  "community",
  "planning",
  "clarity",
  "community",
  "planning",
  "clarity",
  "community",
  "planning",
  "clarity",
  "community",
  "planning",
  "clarity",
  "community",
];
const questions = [
  {
    title: "What are you building towards?",
    hint: "Your money should have a reason. Pick the one that feels like you.",
    options: [
      "A safety net",
      "A dream trip",
      "Long-term freedom",
      "Still figuring it out",
    ],
  },
  {
    title: "When will you need this money?",
    hint: "Your deadline matters more than a personality label.",
    options: ["Within 1 year", "1–3 years", "3–7 years", "More than 7 years"],
  },
  {
    title: "How’s your emergency cushion?",
    hint: "Think accessible savings for unexpected essential expenses.",
    options: [
      "Not started yet",
      "Less than 3 months of essentials",
      "3–6 months of essentials",
      "More than 6 months of essentials",
    ],
  },
  {
    title: "Is your monthly budget comfortable?",
    hint: "Investing should leave room for essentials and breathing space.",
    options: [
      "I have expensive debt to address",
      "My income varies a lot",
      "I have a stable surplus",
      "I’m not sure yet",
    ],
  },
  {
    title: "A market dip. What’s your first thought?",
    hint: "Imagine your investment falls 20%. There’s no impressive answer.",
    options: [
      "I need this money back soon",
      "I’d be worried and want help",
      "I could wait if my goal allows",
      "I’ve experienced this and stayed invested",
    ],
  },
];
export default function Stride() {
  const [tab, setTab] = useState<Tab>("Feed"),
    [modal, setModal] = useState<string | null>(null),
    [entries, setEntries] = useState(initial),
    [audience, setAudience] = useState("Following"),
    [notice, setNotice] = useState(""),
    [caption, setCaption] = useState(""),
    [photo, setPhoto] = useState(""),
    [profile, setProfile] = useState(""),
    [name, setName] = useState(""),
    [step, setStep] = useState(0),
    [answers, setAnswers] = useState<string[]>([]),
    [selected, setSelected] = useState(""),
    [amount, setAmount] = useState("2500"),
    [joined, setJoined] = useState<string[]>([]),
    [saved, setSaved] = useState<Array<number | string>>([]),
    [shareEntry, setShareEntry] = useState<Entry>(initial[0]),
    [busy, setBusy] = useState(false),
    [explanation, setExplanation] = useState("");
  const [vibeStep, setVibeStep] = useState(0),
    [vibeAnswers, setVibeAnswers] = useState<(boolean | null)[]>([]),
    [drag, setDrag] = useState(0),
    [vibeDone, setVibeDone] = useState(false);
  const [user, setUser] = useState<User | null>(null),
    [authReady, setAuthReady] = useState(!supabase),
    [saveConsent, setSaveConsent] = useState(false),
    [cloudSaved, setCloudSaved] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [investFrom, setInvestFrom] = useState<Tab>("Funds");
  const [journeySection, setJourneySection] =
    useState<JourneySection>("Overview");
  const [momentAudience, setMomentAudience] =
    useState<MomentAudience>("private");
  const [momentType, setMomentType] = useState<MomentType>("reflection");
  const [socialBusy, setSocialBusy] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialSchemaReady, setSocialSchemaReady] = useState(true);
  useEffect(() => {
    setProfilePicture("");
    if (!user || !supabase) return;
    let active = true;
    supabase
      .from("profiles")
      .select("avatar,photo")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data?.avatar)
          setProfilePicture(
            data.photo || basePath + "/avatars/" + data.avatar + ".svg",
          );
      });
    return () => {
      active = false;
    };
  }, [user?.id]);
  const [guideError, setGuideError] = useState("");
  const guideAbort = useRef<AbortController | null>(null);
  useEffect(() => () => guideAbort.current?.abort(), []);
  const pointerStart = useRef<number | null>(null);
  function vote(value: boolean | null) {
    const next = [...vibeAnswers, value];
    setVibeAnswers(next);
    const count = vibeStep + 1;
    const groups = ["planning", "community", "clarity"].map((d) =>
      next.filter((a, i) => a !== null && vibeDomains[i] === d),
    );
    const consistent =
      count >= 5 &&
      next.filter((a) => a !== null).length >= 4 &&
      groups.every((g) => g.length > 0 && g.every((a) => a === g[0]));
    if (consistent || count === vibes.length) setVibeDone(true);
    setVibeStep(count);
    setDrag(0);
  }
  useEffect(() => {
    if (oauthReturnFailed) {
      setNotice("Sign-in didn’t finish. Try again or use an email link.");
      setModal("account");
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.slice(1));
      for (const name of ["error", "error_code", "error_description"]) {
        url.searchParams.delete(name);
        hash.delete(name);
      }
      url.hash = hash.toString();
      window.history.replaceState(null, "", url.toString());
    }
    if (!supabase) return;
    let live = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (live) {
        setUser(data.session?.user || null);
        setAuthReady(true);
        if (error && !oauthReturnFailed)
          setNotice("Could not restore your session. Please sign in again.");
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (live) {
        setUser(session?.user || null);
        setAuthReady(true);
      }
    });
    return () => {
      live = false;
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    guideAbort.current?.abort();
    setBusy(false);
    setExplanation("");
    setGuideError("");
    setAnswers([]);
    setVibeAnswers([]);
    setProfile("");
    setName("");
    setCloudSaved(false);
    if (!user || !supabase) return;
    let live = true;
    supabase
      .from("onboarding")
      .select("display_name,answers,preferences")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!live) return;
        if (error) {
          setNotice("Could not load saved onboarding. Please retry later.");
          return;
        }
        if (data) {
          setProfile(data.display_name);
          setName(data.display_name);
          setAnswers(data.answers);
          setVibeAnswers(data.preferences);
          setCloudSaved(true);
        }
      });
    return () => {
      live = false;
    };
  }, [user?.id]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(t);
  }, [notice]);
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement | null;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
      if (e.key === "Tab") {
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[role="dialog"] button:not(:disabled),[role="dialog"] input:not([hidden]),[role="dialog"] textarea',
          ),
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", close);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, [modal]);
  const toast = (s: string) => setNotice(s);
  async function refreshMoments(feed = audience) {
    if (!user || !supabase) {
      setSocialLoading(false);
      return;
    }
    setSocialLoading(true);
    try {
      const moments = await listMoments(
        supabase,
        user.id,
        feed === "Explore" ? "explore" : "following",
      );
      setEntries(
        moments.map((moment) => ({
          id: moment.id,
          userId: moment.userId,
          name: moment.name,
          initials: moment.initials,
          caption: moment.caption,
          months: moment.months,
          photo: moment.photo,
          liked: moment.liked,
          likes: moment.likes,
          time: moment.time,
          audience: moment.audience,
          momentType: moment.momentType,
          cloud: true,
        })),
      );
      setSocialSchemaReady(true);
    } catch (error) {
      if (error instanceof SocialSchemaUnavailable) setSocialSchemaReady(false);
      else toast("Could not refresh your moments. Please try again.");
    } finally {
      setSocialLoading(false);
    }
  }
  useEffect(() => {
    if (!user) {
      setSocialLoading(false);
      return;
    }
    void refreshMoments(audience);
  }, [user?.id, audience]);
  function sessionMoment(displayName: string): Entry {
    return {
      id: Date.now(),
      name: displayName,
      initials: displayName.slice(0, 2).toUpperCase(),
      caption: caption.trim(),
      photo: photo || undefined,
      months: 0,
      liked: false,
      likes: 0,
      time: "Just now",
      audience: "private",
      momentType,
    };
  }
  async function saveMoment() {
    if (!caption.trim() || socialBusy) return;
    const displayName =
      profile ||
      (typeof user?.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : "You");
    setSocialBusy(true);
    try {
      if (user && supabase && socialSchemaReady) {
        const compressed = photo
          ? await compressedSharePhoto(photo, basePath)
          : null;
        const moment = await createMoment(supabase, {
          userId: user.id,
          displayName,
          caption,
          audience: momentAudience,
          momentType,
          photo: compressed,
        });
        const savedMoment: Entry = {
          id: moment.id,
          userId: moment.userId,
          name: moment.name,
          initials: moment.initials,
          caption: moment.caption,
          months: moment.months,
          photo: moment.photo,
          liked: false,
          likes: 0,
          time: moment.time,
          audience: moment.audience,
          momentType: moment.momentType,
          cloud: true,
        };
        setAudience(momentAudience === "explore" ? "Explore" : "Following");
        setEntries((current) => [savedMoment, ...current]);
        toast(
          momentAudience === "private"
            ? "Your private moment is saved to Stride."
            : momentAudience === "connections"
              ? "Your moment is shared with accepted connections."
              : "Your moment is now visible in Explore.",
        );
      } else {
        setEntries((current) => [sessionMoment(displayName), ...current]);
        toast(
          user
            ? "Secure Moments storage is not active yet, so this stayed in your session."
            : "Your moment was added to this private session. Sign in to keep it across devices.",
        );
      }
      setCaption("");
      setPhoto("");
      setMomentAudience("private");
      setMomentType("reflection");
      setTab("Feed");
      setModal(null);
    } catch (error) {
      if (error instanceof SocialSchemaUnavailable) {
        setSocialSchemaReady(false);
        setEntries((current) => [sessionMoment(displayName), ...current]);
        setTab("Feed");
        setModal(null);
        toast("The secure database update is pending; this moment stayed in your session.");
      } else {
        toast(error instanceof Error ? error.message : "Could not save your moment.");
      }
    } finally {
      setSocialBusy(false);
    }
  }
  async function cheerMoment(entry: Entry) {
    if (entry.cloud && typeof entry.id === "string") {
      if (!user || !supabase) {
        setModal("account");
        return;
      }
      try {
        await toggleMomentCheer(supabase, user.id, entry.id, entry.liked);
      } catch (error) {
        toast(error instanceof Error ? error.message : "Could not update your cheer.");
        return;
      }
    }
    setEntries((current) =>
      current.map((item) =>
        item.id === entry.id
          ? {
              ...item,
              liked: !item.liked,
              likes: item.likes + (item.liked ? -1 : 1),
            }
          : item,
      ),
    );
  }
  async function encourageMoment(message: string) {
    if (shareEntry?.cloud && typeof shareEntry.id === "string") {
      if (!user || !supabase) {
        setModal("account");
        return;
      }
      try {
        await addMomentComment(supabase, {
          userId: user.id,
          momentId: shareEntry.id,
          displayName: profile || "Stride member",
          body: message,
        });
      } catch (error) {
        toast(error instanceof Error ? error.message : "Could not send encouragement.");
        return;
      }
    }
    setModal(null);
    toast(`${message} Encouragement sent.`);
  }
  const openInvest = () => {
    setInvestFrom(tab === "Invest" ? "Funds" : tab);
    setModal(null);
    setTab("Invest");
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const start = () => {
    guideAbort.current?.abort();
    setBusy(false);
    setGuideError("");
    setStep(0);
    setSelected("");
    setAnswers([]);
    setCloudSaved(false);
    setExplanation("");
    setVibeStep(0);
    setVibeDone(false);
    setVibeAnswers([]);
    setDrag(0);
    setModal("vibe");
  };
  const blocked =
    answers[1] === "Within 1 year" ||
    answers[2] === "Not started yet" ||
    answers[2] === "Less than 3 months of essentials" ||
    answers[3] === "I have expensive debt to address" ||
    answers[3] === "My income varies a lot" ||
    answers[3] === "I’m not sure yet";
  async function saveOnboarding(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !supabase || !saveConsent || answers.length !== 5) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("onboarding").upsert({
        user_id: user.id,
        display_name: name.trim(),
        adult_confirmed: true,
        consent_version: "2026-11-02",
        consented_at: new Date().toISOString(),
        answers,
        preferences: vibeAnswers,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setProfile(name.trim());
      setCloudSaved(true);
      setExplanation("");
      setGuideError("");
      setSaveConsent(false);
      setModal(null);
      toast("Your starting point is saved privately to your account.");
    } catch {
      toast(
        "Could not save your starting point. Your answers are still here; please retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function explain() {
    if (!user) {
      setModal("account");
      return;
    }
    if (!cloudSaved) {
      toast(
        "Save your starting point first so the guide uses your confirmed answers.",
      );
      return;
    }
    setRuleGuideAnswers(answers);
    if (!supabase) {
      setGuideError("AI_UNAVAILABLE");
      setTab("AI Guide");
      return;
    }
    guideAbort.current?.abort();
    const controller = new AbortController();
    guideAbort.current = controller;
    setModal(null);
    setTab("AI Guide");
    setBusy(true);
    setGuideError("");
    try {
      const text = await requestGuide(supabase, controller.signal);
      if (!controller.signal.aborted) setExplanation(text);
    } catch (e) {
      if (!controller.signal.aborted)
        setGuideError(
          isGuideUnavailable(e)
            ? "AI_UNAVAILABLE"
            : e instanceof Error
              ? e.message
              : "Could not generate an explanation.",
        );
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }
  return (
    <div className="app">
      <aside className="sidebar">
        <a className="brand" href={basePath + "/"}>
          stride
          <span>
            <ArrowUpRight size={35} />
          </span>
        </a>
        <div className="byline">BY CAPITAL SENSE</div>
        <nav>
          {(
            [
              { label: "Home", destination: "Feed", icon: Home },
              { label: "Journey", destination: "My journey", icon: Activity },
              { label: "Research", destination: "Funds", icon: Layers },
              { label: "Profile", destination: "Account", icon: UserRound },
            ] as const
          ).map(({ label, destination, icon: Icon }) => (
            <button
              key={label}
              className={tab === destination ? "nav active" : "nav"}
              onClick={() => setTab(destination)}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
          <button className="nav nav-create" onClick={() => setModal("post")}>
            <Camera size={20} />
            Create a moment
          </button>
        </nav>
        <div className="side-bottom">
          <div className="side-note">
            <span className="tiny">A LITTLE REMINDER</span>
            <Leaf size={26} />
            <p>
              Your pace.
              <br />
              Your future.
            </p>
            <small>Good things grow with time.</small>
          </div>
          <button className="nav" onClick={() => setModal("settings")}>
            <Settings size={19} />
            Settings & privacy
          </button>
          <button
            className="account"
            onClick={() => {
              setTab("Account");
              window.scrollTo({ top: 0 });
            }}
          >
            <span className="avatar peach">
              {profilePicture ? (
                <img
                  className="profile-header-photo"
                  src={profilePicture}
                  alt="Your avatar"
                />
              ) : profile ? (
                profile.slice(0, 2).toUpperCase()
              ) : (
                "YO"
              )}
            </span>
            <span>
              <b>{profile || (user ? "Your account" : "Your space")}</b>
              <small>{user ? "Signed in" : "Sign in / create account"}</small>
            </span>
            <ChevronRight size={17} />
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header>
          <div className="mobile-brand">
            stride
            <ArrowUpRight size={23} />
          </div>
          <div className="breadcrumb">Your future starts with showing up.</div>
          <div className="header-actions">
            <button
              className="text-button"
              onClick={() => (user ? setTab("Account") : setModal("account"))}
            >
              {!authReady ? "Loading…" : user ? "Account" : "Sign in"}
            </button>
            <button
              aria-label="Ask Bucks"
              className="bucks-header-button"
              onClick={() => setTab("AI Guide")}
            >
              <Sparkles size={20} />
              <span>Ask Bucks</span>
            </button>
            <button
              aria-label="Notifications"
              className="icon-btn"
              onClick={() => setModal("notifications")}
            >
              <Bell size={20} />
            </button>
            <button
              className="avatar dark"
              aria-label="Profile"
              onClick={() => {
                setTab("Account");
                window.scrollTo({ top: 0 });
              }}
            >
              {profilePicture ? (
                <img
                  className="profile-header-photo"
                  src={profilePicture}
                  alt=""
                />
              ) : profile ? (
                profile.slice(0, 2).toUpperCase()
              ) : (
                "YO"
              )}
            </button>
          </div>
        </header>
        <main>
          {tab === "Invest" ? (
            <AssetPlusOnboarding
              back={() => {
                setTab(investFrom);
                window.scrollTo({ top: 0 });
              }}
              account={() => setTab("Account")}
              funds={() => setTab("Funds")}
            />
          ) : tab === "AI Guide" ? (
            <GuidePage
              user={user}
              saved={cloudSaved}
              answer={explanation}
              error={guideError}
              busy={busy}
              onExplain={explain}
              onStart={start}
              onReview={() => {
                setStep(5);
                setModal("quiz");
              }}
              onSignIn={() => setModal("account")}
              notify={toast}
            />
          ) : tab === "Account" ? (
            <ProfilePage
              user={user}
              answers={answers}
              preferences={vibeAnswers}
              saved={cloudSaved}
              start={start}
              review={() => {
                setStep(5);
                setModal("quiz");
              }}
              signIn={() => setModal("account")}
              notify={toast}
              onName={setProfile}
              onIdentity={setProfilePicture}
              onGuide={() => setTab("AI Guide")}
              circles={() => {
                setTab("Circles");
                window.scrollTo({ top: 0 });
              }}
            />
          ) : tab === "Circles" ? (
            <SocialHub
              user={user}
              displayName={profile}
              signIn={() => setModal("account")}
              notify={toast}
            />
          ) : tab === "Funds" ? (
            <FundResearch onInvest={openInvest} />
          ) : (
            <>
              {user && cloudSaved && (
                <div className="saved-banner">
                  <ShieldCheck size={18} />
                  <span>Your private starting point is saved.</span>
                  <button
                    className="text-button"
                    onClick={() => {
                      setStep(5);
                      setModal("quiz");
                    }}
                  >
                    Review my answers <ArrowRight size={15} />
                  </button>
                </div>
              )}
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    {tab === "Feed"
                      ? "TODAY WITH BUCKS"
                      : "SMALL STEPS. REAL MOMENTUM."}
                  </div>
                  <h1>
                    {tab === "Feed"
                      ? "Your money, in motion."
                      : tab === "My journey"
                        ? "A future that feels like you."
                        : tab === "Discover"
                          ? "Find your next small step."
                          : "Better, together."}
                  </h1>
                  <p>
                    {tab === "Feed"
                      ? "One clear move, your momentum, and the moments that keep the journey meaningful."
                      : tab === "My journey"
                        ? "Your progress is personal. Every small step counts."
                        : tab === "Discover"
                          ? "Less noise. More understanding. Start with what matters to you."
                          : "Find people who celebrate the habit, whatever the amount."}
                  </p>
                </div>
                <button
                  className="camera-create"
                  aria-label="Add journal entry"
                  title="Add journal entry"
                  onClick={() => setModal("post")}
                >
                  <Camera size={22} />
                </button>
              </div>
              <div className={tab === "Feed" ? "columns" : "columns single-view"}>
                <section className="main-column">
                  {tab === "Feed" ? (
                    <>
                      <NextMove
                        answers={answers}
                        start={start}
                        account={() => setTab("Account")}
                        research={() => setTab("Funds")}
                      />
                      <Bucks onAction={start} />
                      <div className="hero-card legacy-home-hero" aria-hidden="true">
                        <div className="hero-copy">
                          <span className="pill">
                            <Flame size={14} /> THE SHOWING-UP CLUB
                          </span>
                          <h2>
                            Big dreams.
                            <br />
                            Small, steady steps.
                          </h2>
                          <p>
                            You don’t need to have it all figured out.
                            <br />
                            Just a reason to begin.
                          </p>
                          <button onClick={start}>
                            Explore my money mindset <ArrowUpRight size={18} />
                          </button>
                        </div>
                        <div className="hero-art">
                          <div className="orbit o1" />
                          <div className="orbit o2" />
                          <div className="orbit o3" />
                          <div className="stair s1" />
                          <div className="stair s2" />
                          <div className="stair s3" />
                          <div className="stair s4" />
                          <div className="spark" aria-hidden="true">
                            *
                          </div>
                          <span className="art-label">ONE STEP CLOSER</span>
                        </div>
                      </div>
                      <div className="info">
                        <Leaf size={18} />
                        <span>
                          Your community starts with you. Add a personal goal or
                          photo; posts in this preview stay in this session.
                        </span>
                      </div>
                      <div className="feed-tabs">
                        <div>
                          {["Following", "Explore"].map((s) => (
                            <button
                              className={audience === s ? "selected" : ""}
                              onClick={() => setAudience(s)}
                              key={s}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <span>
                          <Lock size={12} />
                          Amounts stay private. Always.
                        </span>
                      </div>
                      {!socialSchemaReady && user && (
                        <div className="social-schema-note" role="status">
                          Your secure Moments update is ready in code but has not been applied to Supabase yet. New moments stay in this session until it is applied.
                        </div>
                      )}
                      {socialLoading && (
                        <div className="social-loading" role="status">Opening your moments…</div>
                      )}
                      {(audience === "Following" ? entries : user ? entries : []).map((e) => (
                        <article className="post" key={e.id}>
                          <div className="post-top">
                            <span
                              className={
                                "avatar " +
                                (String(e.id).charCodeAt(0) % 2 ? "peach" : "sage")
                              }
                            >
                              {e.initials}
                            </span>
                            <div>
                              <b>{e.name}</b>
                              <small>
                                {e.time} · {e.audience === "private" ? <Lock size={10} /> : e.audience === "connections" ? <Users size={10} /> : <Globe size={10} />}
                              </small>
                            </div>
                            <button
                              aria-label="Open Moment controls"
                              className="icon-btn"
                              onClick={() => {
                                setShareEntry(e);
                                setModal("moment-manager");
                              }}
                            >
                              <MoreHorizontal size={19} />
                            </button>
                          </div>
                          <p className="caption">{e.caption}</p>
                          {e.photo && (
                            <div className="post-photo">
                              <img
                                src={
                                  e.photo.startsWith("/")
                                    ? basePath + e.photo
                                    : e.photo
                                }
                                alt={
                                  e.photo === "/journey.svg"
                                    ? "Mountain landscape illustrating a future travel goal"
                                    : "Personal goal journal photo"
                                }
                              />
                              <div className="photo-label">
                                <span>THE FUTURE I’M BUILDING</span>
                                <b>
                                  {e.photo === "/journey.svg"
                                    ? "More mornings like this."
                                    : "A reason to keep going."}
                                </b>
                              </div>
                              <span className="image-credit">
                                {e.photo === "/journey.svg"
                                  ? "ILLUSTRATED GOAL JOURNAL"
                                  : "PERSONAL MEMORY"}
                              </span>
                            </div>
                          )}
                          <div className="achievement">
                            <div className="achievement-icon">
                              <Flame size={24} />
                            </div>
                            <div>
                              <b>
                                {e.months === 0
                                  ? "A reason to keep going."
                                  : e.months === 1
                                    ? "The first step is the biggest."
                                    : `${e.months} months. One beautiful habit.`}
                              </b>
                              <small>
                                {e.months === 0
                                  ? "Personal goal journal"
                                  : e.months === 1
                                    ? "A new journey begins"
                                    : "Monthly consistency milestone"}{" "}
                                <span>· Self-reported</span>
                              </small>
                            </div>
                            <span className="badge">
                              {e.months === 0
                                ? "MY NEXT CHAPTER"
                                : e.months === 1
                                  ? "FIRST STEP"
                                  : "CONSISTENCY CLUB"}
                            </span>
                          </div>
                          <div className="post-actions">
                            <button
                              className={e.liked ? "orange" : ""}
                              onClick={() => void cheerMoment(e)}
                            >
                              <Heart
                                size={19}
                                fill={e.liked ? "currentColor" : "none"}
                              />
                              {e.likes} cheers
                            </button>
                            <button
                              onClick={() => {
                                setShareEntry(e);
                                setModal("encourage");
                              }}
                            >
                              <MessageCircle size={19} />
                              Encourage
                            </button>
                            <button
                              onClick={() => {
                                setShareEntry(e);
                                setModal("share");
                              }}
                            >
                              <Share2 size={18} />
                              Share
                            </button>
                            <button
                              aria-label={saved.includes(e.id) ? "Remove saved Moment" : "Save Moment"}
                              className={saved.includes(e.id) ? "orange" : ""}
                              onClick={() => setSaved(saved.includes(e.id) ? saved.filter((id) => id !== e.id) : [...saved, e.id])}
                            >
                              <Bookmark size={18} fill={saved.includes(e.id) ? "currentColor" : "none"} />
                              Save
                            </button>
                          </div>
                        </article>
                      ))}
                      <div className="feed-end">
                        <span className="round-icon">
                          <Check size={19} />
                        </span>
                        <h3>You’re all caught up.</h3>
                        <p>Your future grows outside the feed, too.</p>
                        <button
                          className="text-button"
                          onClick={() => setTab("My journey")}
                        >
                          Back to my journey <ArrowRight size={15} />
                        </button>
                      </div>
                    </>
                  ) : tab === "My journey" ? (
                    <>
                      <nav className="journey-switcher" aria-label="Journey sections">
                        {(
                          [
                            { label: "Overview", icon: Activity },
                            { label: "Spending", icon: Wallet },
                            { label: "Investments", icon: Layers },
                            { label: "Progress", icon: BookOpen },
                          ] as const
                        ).map(({ label, icon: Icon }) => (
                          <button
                            key={label}
                            className={journeySection === label ? "active" : ""}
                            aria-current={journeySection === label ? "page" : undefined}
                            onClick={() => setJourneySection(label)}
                          >
                            <Icon size={17} />
                            {label}
                          </button>
                        ))}
                      </nav>
                      {journeySection === "Overview" ? (
                        <>
                          <NextMove
                            answers={answers}
                            start={start}
                            account={() => setTab("Account")}
                            research={() => setTab("Funds")}
                          />
                          <section className="journey-overview-grid">
                            <button onClick={() => setJourneySection("Spending")}>
                              <span className="journey-overview-icon sage"><Wallet size={20} /></span>
                              <small>YOUR MONEY SCENE</small>
                              <h3>Understand where your money is going.</h3>
                              <p>Track spending and set flexible monthly budgets.</p>
                              <span className="text-button">Open spending <ArrowRight size={15} /></span>
                            </button>
                            <button onClick={() => setJourneySection("Investments")}>
                              <span className="journey-overview-icon peach"><Layers size={20} /></span>
                              <small>YOUR STASH</small>
                              <h3>Keep your investments in one clear view.</h3>
                              <p>Add existing holdings without exposing them socially.</p>
                              <span className="text-button">View investments <ArrowRight size={15} /></span>
                            </button>
                            <button onClick={() => setJourneySection("Progress")}>
                              <span className="journey-overview-icon lilac"><BookOpen size={20} /></span>
                              <small>YOUR MONEY ARC</small>
                              <h3>See the habits shaping your journey.</h3>
                              <p>Progress without rankings, pressure, or lost streaks.</p>
                              <span className="text-button">See progress <ArrowRight size={15} /></span>
                            </button>
                          </section>
                          <Bucks onAction={() => setTab("AI Guide")} compact />
                        </>
                      ) : journeySection === "Spending" ? (
                        <JourneySpending
                          key={`spending-${user?.id || "guest"}`}
                          owner={user?.id || "guest"}
                          signIn={() => setModal("account")}
                        />
                      ) : journeySection === "Investments" ? (
                        <JourneyInvestments
                          key={`investments-${user?.id || "guest"}`}
                          owner={user?.id || "guest"}
                          signIn={() => setModal("account")}
                        />
                      ) : (
                        <>
                          <HabitPassport
                            research={() => setTab("Funds")}
                            share={() => setModal("post")}
                          />
                          <ReviewToolkit
                            review={start}
                            guide={() => setTab("AI Guide")}
                          />
                        </>
                      )}
                    </>
                  ) : tab === "Discover" ? (
                    <>
                      <button
                        className="discover-funds-entry"
                        onClick={() => setTab("Funds")}
                      >
                        <Layers size={24} />
                        <span>
                          <b>Research the 22 launch funds</b>
                          <small>Add funds to your SIP cart and simulate the basket.</small>
                        </span>
                        <ArrowUpRight size={20} />
                      </button>
                      <div className="journey-hero">
                        <Sparkles className="orange" />
                        <h2>
                          Meet your
                          <br />
                          starting point.
                        </h2>
                        <p>
                          Five thoughtful questions. A clearer picture of what
                          matters. No fund tips disguised as a personality quiz.
                        </p>
                        <button className="primary" onClick={start}>
                          Let’s figure it out <ArrowRight size={17} />
                        </button>
                      </div>
                      {[
                        {
                          title: "Your buffer comes first.",
                          tag: "THE FOUNDATION",
                          text: "Emergency savings help you handle surprises without depending on market performance.",
                        },
                        {
                          title: "SIP is the habit. A fund is the choice.",
                          tag: "THE 2-MINUTE READ",
                          text: "A systematic investment plan is a way to invest regularly. Its risk depends on the underlying fund.",
                        },
                        {
                          title: "Consistency over comparison.",
                          tag: "MONEY & MINDSET",
                          text: "Someone else’s contribution says nothing about what is affordable for your life.",
                        },
                      ].map((x) => (
                        <article className="panel learn-card" key={x.title}>
                          <span className="eyebrow">{x.tag}</span>
                          <h2>{x.title}</h2>
                          <p>{x.text}</p>
                        </article>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="panel">
                        <span className="eyebrow">FIND YOUR PEOPLE</span>
                        <h2>
                          Same energy.
                          <br />
                          Different journeys.
                        </h2>
                        <p>
                          Private circles are not open yet. Explore your
                          personal journey while we prepare this feature.
                        </p>
                      </div>
                      <div className="panel">
                        <h3>Your circle is coming together.</h3>
                        <p>
                          Private circles are not open yet. Your personal
                          journey and fund research are available now.
                        </p>
                      </div>
                    </>
                  )}
                </section>
                {tab === "Feed" && <aside className="right-column">
                  <div className="panel streak-panel">
                    <div className="panel-title">
                      <span>YOUR MOMENTUM</span>
                      <Flame size={18} className="orange" />
                    </div>
                    <div className="momentum-state">
                      <span className="momentum-orbit"><Activity size={23} /></span>
                      <div><strong>Ready</strong><small>to start moving</small></div>
                    </div>
                    <p>Momentum grows from useful actions, not daily check-ins or investment returns.</p>
                    <button
                      className="outline-button"
                      onClick={() => {
                        setJourneySection("Overview");
                        setTab("My journey");
                      }}
                    >
                      See my money arc <ArrowRight size={16} />
                    </button>
                    <small>No streaks to lose. No pressure to perform.</small>
                  </div>
                  <div className="panel starting">
                    <span className="round-icon">
                      <Sparkles size={21} />
                    </span>
                    <h3>
                      Your future isn’t
                      <br />
                      one-size-fits-all.
                    </h3>
                    <p>
                      Find a starting point that fits your goals, timeline and
                      comfort.
                    </p>
                    <button className="text-button" onClick={start}>
                      Find my fit <ArrowRight size={16} />
                    </button>
                    <span className="time-chip">
                      Vibe check first · your pace
                    </span>
                  </div>
                  <div className="quiet-note">
                    <ShieldCheck size={19} />
                    <p>
                      Built around good habits.
                      <br />
                      Never around guaranteed returns.
                    </p>
                  </div>
                  <footer>
                    Capital Sense · Stride
                    <br />
                    Mutual fund investments are subject to market risks. Read
                    all scheme related documents carefully.
                    <button onClick={() => setModal("disclosures")}>
                      Disclosures & privacy ↗
                    </button>
                  </footer>
                </aside>}
              </div>
            </>
          )}
        </main>
        <nav className="mobile-nav" aria-label="Main navigation">
          {(
            [
              { label: "Feed", display: "Home", icon: Home },
              { label: "My journey", display: "Journey", icon: Activity },
              { label: "Camera", icon: Camera },
              { label: "Funds", display: "Research", icon: Layers },
              { label: "Account", display: "Profile", icon: UserRound },
            ] as const
          ).map((item) => {
            const { label, icon: Icon } = item;
            const display = "display" in item ? item.display : "Moment";
            return (
            <button
              key={label}
              aria-label={label === "Camera" ? "Capture a moment" : display}
              aria-current={
                tab === label || (label === "Funds" && tab === "Invest")
                  ? "page"
                  : undefined
              }
              className={
                label === "Camera"
                  ? "nav-camera"
                  : tab === label || (label === "Funds" && tab === "Invest")
                    ? "orange"
                    : ""
              }
              onClick={() => {
                if (label === "Camera") setModal("post");
                else {
                  setTab(label);
                  window.scrollTo({ top: 0, behavior: "instant" });
                }
              }}
            >
              <Icon size={22} />
              <span>{display}</span>
            </button>
            );
          })}
        </nav>
      </div>
      {notice && (
        <div role="status" className="toast">
          <Check size={18} />
          {notice}
        </div>
      )}
      {modal && (
        <div
          className={modal === "post" ? "overlay camera-overlay" : "overlay"}
          onClick={() => setModal(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={
              modal === "quiz"
                ? "Find your starting point"
                : modal === "post"
                  ? "Capture a journal moment"
                  : modal
            }
            className={modal === "post" ? "modal camera-modal" : "modal"}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close dialog"
              autoFocus
              className="close icon-btn"
              onClick={() => setModal(null)}
            >
              <X />
            </button>
            {modal === "vibe" && (
              <>
                <span className="eyebrow">FIRST, A LITTLE VIBE CHECK</span>
                {!vibeDone ? (
                  <>
                    <div className="vibe-top">
                      <span>
                        CARD {vibeStep + 1} · UP TO {vibes.length}
                      </span>
                      <button
                        className="text-button"
                        onClick={() => vote(null)}
                      >
                        Skip this
                      </button>
                    </div>
                    <div className="progress">
                      <span
                        style={{ width: `${(vibeStep / vibes.length) * 100}%` }}
                      />
                    </div>
                    <p>
                      No amounts. No perfect answers. We check after five cards
                      and stop when your preferences are consistent.
                    </p>
                    <div
                      className="vibe-card"
                      style={{
                        transform: `translateX(${drag}px) rotate(${drag / 18}deg)`,
                      }}
                      onPointerDown={(e) => {
                        pointerStart.current = e.clientX;
                        e.currentTarget.setPointerCapture(e.pointerId);
                      }}
                      onPointerMove={(e) => {
                        if (pointerStart.current !== null)
                          setDrag(
                            Math.max(
                              -120,
                              Math.min(120, e.clientX - pointerStart.current),
                            ),
                          );
                      }}
                      onPointerUp={(e) => {
                        const distance =
                          pointerStart.current === null
                            ? 0
                            : e.clientX - pointerStart.current;
                        pointerStart.current = null;
                        if (Math.abs(distance) > 65) vote(distance > 0);
                        else setDrag(0);
                      }}
                      onPointerCancel={() => {
                        pointerStart.current = null;
                        setDrag(0);
                      }}
                    >
                      <span
                        className="vibe-stamp"
                        style={{ opacity: Math.min(1, Math.abs(drag) / 70) }}
                      >
                        {drag > 0 ? "THAT’S ME" : "NOT MY VIBE"}
                      </span>
                      <span className="vibe-emoji">
                        {vibes[vibeStep].emoji}
                      </span>
                      <span className="eyebrow">{vibes[vibeStep].tag}</span>
                      <h2>{vibes[vibeStep].title}</h2>
                      <p>{vibes[vibeStep].text}</p>
                      <small>← Not my vibe · That’s me →</small>
                    </div>
                    <div className="swipe-actions">
                      <button
                        aria-label="Not my vibe"
                        onClick={() => vote(false)}
                      >
                        <X size={25} />
                        <span>Not my vibe</span>
                      </button>
                      <button aria-label="That's me" onClick={() => vote(true)}>
                        <Heart size={25} />
                        <span>That’s me</span>
                      </button>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setVibeDone(true)}
                    >
                      Finish with what I’ve shared
                    </button>
                    <p className="vibe-disclaimer">
                      Swipe or use the buttons. These preferences don’t
                      determine your investment risk profile.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="vibe-emoji">✳️</span>
                    <h2>A little more you.</h2>
                    <p>
                      Here’s what you shared across {vibeStep} cards. Tap a
                      choice to change it. This is a tentative preference recap,
                      not a personality assessment or financial conclusion.
                    </p>
                    <div className="options">
                      {vibes.slice(0, vibeStep).map((v, i) => (
                        <button
                          key={v.tag}
                          className={vibeAnswers[i] === true ? "chosen" : ""}
                          onClick={() =>
                            setVibeAnswers(
                              vibeAnswers.map((a, j) => (j === i ? !a : a)),
                            )
                          }
                        >
                          <span>
                            {v.emoji} {v.tag.replace("THE ", "")}
                          </span>
                          <span>
                            {vibeAnswers[i] === true
                              ? "That’s me"
                              : vibeAnswers[i] === false
                                ? "Not my vibe"
                                : "Skipped"}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="info">
                      <Lock size={18} />
                      <span>
                        Your swipe choices are private. They are saved to your
                        account only if you choose to save your starting point,
                        and aren’t sent to Gemini. We won’t infer your income,
                        affordability or investment risk from them.
                      </span>
                    </div>
                    <button
                      className="primary wide"
                      onClick={() => {
                        setStep(0);
                        setSelected("");
                        setModal("quiz");
                      }}
                    >
                      Next: a few practical details <ArrowRight size={17} />
                    </button>
                    <button
                      className="secondary wide"
                      onClick={() => {
                        setModal(null);
                        setTab("Discover");
                      }}
                    >
                      Just explore for now
                    </button>
                  </>
                )}
              </>
            )}
            {modal === "quiz" ? (
              <>
                <span className="eyebrow">YOUR LIFE. YOUR STARTING POINT.</span>
                {step < questions.length ? (
                  <>
                    <div className="progress">
                      <span style={{ width: `${(step / 5) * 100}%` }} />
                    </div>
                    <small>QUESTION {step + 1} OF 5</small>
                    <h2>{questions[step].title}</h2>
                    <p>{questions[step].hint}</p>
                    <div className="options">
                      {questions[step].options.map((o) => (
                        <button
                          key={o}
                          className={selected === o ? "chosen" : ""}
                          onClick={() => setSelected(o)}
                        >
                          {o}
                          {selected === o && <Check size={18} />}
                        </button>
                      ))}
                    </div>
                    <div className="modal-bottom">
                      <button
                        className="text-button"
                        disabled={step === 0}
                        onClick={() => {
                          setStep(step - 1);
                          setSelected(answers[step - 1] || "");
                        }}
                      >
                        Back
                      </button>
                      <button
                        className="primary"
                        disabled={!selected}
                        onClick={() => {
                          const next = [...answers];
                          next[step] = selected;
                          setAnswers(next);
                          setStep(step + 1);
                          setSelected(next[step + 1] || "");
                          setCloudSaved(false);
                        }}
                      >
                        {" "}
                        {step === 4 ? "See my starting point" : "Continue"}
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="result-icon">
                      <Leaf size={32} />
                    </div>
                    <h2>
                      {blocked
                        ? "A stronger foundation first."
                        : "You’ve got a starting point."}
                    </h2>
                    <p>
                      {blocked
                        ? "Your answers suggest prioritising accessible savings, affordability or a closer review before choosing a fund basket."
                        : "Your next step is a suitability review that considers your existing holdings, liquidity needs and ability to bear losses."}
                    </p>
                    <div className="result-summary">
                      {answers.map((a, i) => (
                        <div key={i}>
                          <small>
                            {
                              [
                                "Goal",
                                "Timeline",
                                "Safety net",
                                "Budget",
                                "Risk response",
                              ][i]
                            }
                          </small>
                          <b>{a}</b>
                        </div>
                      ))}
                    </div>
                    <label className="field">
                      Monthly amount you’d like to review (private)
                      <input
                        type="number"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </label>
                    <div className="info">
                      <ShieldCheck size={20} />
                      <span>
                        This is an educational profile, not a personalised fund
                        recommendation. You can register separately with
                        AssetPlus; your answers and demo amount are not sent
                        through the onboarding link.
                      </span>
                    </div>
                    {explanation && <p className="ai-answer">{explanation}</p>}
                    <button
                      className="primary wide"
                      onClick={() => {
                        setSaveConsent(false);
                        setModal(user ? "save" : "account");
                      }}
                    >
                      {cloudSaved
                        ? "Update saved starting point"
                        : "Save my starting point"}
                    </button>
                    <button
                      className="secondary wide"
                      disabled={busy}
                      onClick={explain}
                    >
                      <Sparkles size={17} />
                      {busy ? "Thinking…" : "Explain with Gemini"}
                    </button>
                    <button
                      className="secondary wide"
                      onClick={() => {
                        setModal(null);
                        setTab("Account");
                        window.scrollTo({ top: 0 });
                      }}
                    >
                      See my investor analytics <ArrowUpRight size={17} />
                    </button>
                    <button
                      className="primary wide"
                      onClick={() => {
                        setModal(null);
                        setTab("Funds");
                      }}
                    >
                      Research the shortlist <ArrowRight size={17} />
                    </button>
                  </>
                )}
              </>
            ) : null}
            {modal === "post" && (
              <>
                <span className="eyebrow">STRIDE CAMERA</span>
                <h2>Capture your moment.</h2>
                <p>Start with the picture, then add the reason behind it.</p>
                <div className="moment-type-picker" aria-label="Moment type">
                  {(
                    [
                      ["reflection", "Reflection"],
                      ["small_win", "Small win"],
                      ["learning", "Learning"],
                      ["goal", "Goal"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      className={momentType === value ? "selected" : ""}
                      onClick={() => setMomentType(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <label className="field">
                  Your journal note
                  <textarea
                    maxLength={400}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="The future I’m showing up for…"
                  />
                </label>
                <LensStudio autoStart onChange={setPhoto} notify={toast} />
                <fieldset className="moment-audience">
                  <legend>Who can see this?</legend>
                  {(
                    [
                      ["private", "Only me", "Saved privately"],
                      ["connections", "Connections", "Accepted connections only"],
                      ["explore", "Explore", "Visible to signed-in Stride members"],
                    ] as const
                  ).map(([value, label, detail]) => (
                    <label key={value} className={momentAudience === value ? "selected" : ""}>
                      <input
                        type="radio"
                        name="moment-audience"
                        value={value}
                        checked={momentAudience === value}
                        disabled={!user && value !== "private"}
                        onChange={() => setMomentAudience(value)}
                      />
                      <span><b>{label}</b><small>{detail}</small></span>
                    </label>
                  ))}
                </fieldset>
                <div className="info">
                  <Lock size={18} />
                  <span>
                    {user
                      ? "Your audience is enforced by the database, not just hidden in the interface. Financial amounts and holdings are never attached."
                      : "This stays in your current session. Sign in before choosing Connections or Explore. It does not confirm a contribution."}
                  </span>
                </div>
                <button
                  className="primary wide"
                  disabled={!caption.trim() || socialBusy}
                  onClick={() => void saveMoment()}
                >
                  {socialBusy ? "Saving moment…" : "Save moment"} <Send size={17} />
                </button>
              </>
            )}
            {modal === "share" && (
              <ShareComposer
                post={{
                  displayName: shareEntry.name,
                  caption: shareEntry.caption,
                  months: shareEntry.months,
                  photo: shareEntry.photo,
                }}
                user={user}
                notify={toast}
                signIn={() => setModal("account")}
              />
            )}
            {modal === "encourage" && (
              <>
                <span className="eyebrow">SEND SOME GOOD ENERGY</span>
                <h2>Cheer on {shareEntry.name.split(" ")[0]}.</h2>
                <p>{shareEntry?.cloud ? "Your encouragement will be saved with this moment." : "This session moment keeps encouragement on your device."}</p>
                <div className="options">
                  {[
                    "🌱 One step closer!",
                    "🔥 Keep showing up!",
                    "🧡 Proud of your consistency.",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        void encourageMoment(s);
                      }}
                    >
                      {s}
                      <Send size={16} />
                    </button>
                  ))}
                </div>
              </>
            )}
            {modal === "moment-manager" && shareEntry && (
              <MomentManager
                moment={shareEntry}
                user={user}
                displayName={profile}
                signIn={() => setModal("account")}
                notify={toast}
                close={() => setModal(null)}
                changed={() => void refreshMoments()}
              />
            )}
            {modal === "account" && <Account user={user} notify={toast} />}
            {modal === "save" && (
              <>
                <span className="eyebrow">
                  A STARTING POINT TO COME BACK TO
                </span>
                <h2>Save it. Keep it private.</h2>
                <p>
                  We’ll store your name, swipe preferences and five financial
                  onboarding answers in your account. No contribution amount or
                  photo is included. Other users cannot read this record.
                </p>
                <form onSubmit={saveOnboarding}>
                  <label className="field">
                    What should we call you?
                    <input
                      required
                      minLength={1}
                      maxLength={40}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="given-name"
                    />
                  </label>
                  <label className="consent">
                    <input
                      required
                      type="checkbox"
                      checked={saveConsent}
                      onChange={(e) => setSaveConsent(e.target.checked)}
                    />
                    <span>
                      I’m 18 or older and consent to saving these answers for my
                      private onboarding. If I request an AI explanation, my
                      five financial answers will be sent to Google Gemini. I
                      can delete the saved onboarding in Settings.
                    </span>
                  </label>
                  <button
                    disabled={busy || !saveConsent || !name.trim()}
                    className="primary wide"
                  >
                    {busy ? "Saving…" : "Save privately"}
                  </button>
                </form>
              </>
            )}
            {modal === "notifications" && (
              <SocialNotifications
                user={user}
                signIn={() => setModal("account")}
                notify={toast}
              />
            )}
            {(modal === "settings" || modal === "disclosures") && (
              <>
                <OnboardingHelp />
                <span className="eyebrow">YOUR TRUST COMES FIRST</span>
                <h2>
                  {modal === "settings"
                    ? "Your space. Your rules."
                    : "Before you take a step."}
                </h2>
                <p>
                  Stride is a Capital Sense product prototype. AssetPlus
                  registration is offered through{" "}
                  {investmentProvider.distributorName}, ARN-
                  {investmentProvider.arn}, as shown in the supplied provider
                  registration flow. Regular-plan distribution may involve
                  commissions. Review applicable costs and disclosures on
                  AssetPlus.
                </p>
                <div className="info">
                  <ShieldCheck size={20} />
                  <span>
                    Personal journals are self-reported. No real transactions,
                    public community or live fund recommendations are enabled
                    inside Stride. AssetPlus onboarding opens separately;
                    account and investment status are not synced here. Account
                    authentication uses Supabase when configured.
                  </span>
                </div>
                <p>
                  Mutual fund investments are subject to market risks. Read all
                  scheme related documents carefully. SIPs do not guarantee
                  returns or prevent losses.
                </p>
                <p>
                  Account sessions are stored in this browser by Supabase. Saved
                  onboarding is private to your account. Photos and feed changes
                  stay in this demo session. Gemini receives financial
                  questionnaire answers only when you request an explanation.
                </p>
                {user && (
                  <button
                    className="secondary wide"
                    disabled={busy}
                    onClick={async () => {
                      if (!supabase) return;
                      setBusy(true);
                      const { error } = await supabase
                        .from("onboarding")
                        .delete()
                        .eq("user_id", user.id);
                      setBusy(false);
                      if (error) {
                        toast(
                          "Could not delete saved onboarding. Please retry.",
                        );
                        return;
                      }
                      setAnswers([]);
                      setVibeAnswers([]);
                      setProfile("");
                      setName("");
                      setCloudSaved(false);
                      toast(
                        "Saved onboarding deleted. Your sign-in account remains.",
                      );
                    }}
                  >
                    Delete saved onboarding
                  </button>
                )}
                <button
                  className="secondary wide"
                  onClick={() => {
                    localStorage.removeItem("stride-profile");
                    localStorage.removeItem("stride-assessment");
                    localStorage.removeItem(
                      "stride-demo-fund-shortlist:" + (user?.id || "guest"),
                    );
                    window.dispatchEvent(new Event("stride-demo-reset"));
                    setProfile("");
                    setAnswers([]);
                    setEntries(initial);
                    setJoined([]);
                    setSaved([]);
                    setModal(null);
                    toast("Local demo data cleared.");
                  }}
                >
                  <LogOut size={17} />
                  Clear local demo data
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
