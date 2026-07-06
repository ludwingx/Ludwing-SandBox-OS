"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  X, 
  Music, 
  Volume2, 
  VolumeX, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Trash2, 
  UserCog, 
  Sun, 
  Moon, 
  Plus, 
  Search, 
  Upload
} from "lucide-react";

// ==========================================
// CUSTOM EMBEDDED ICONS (for brand accuracy)
// ==========================================
const FacebookIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
  </svg>
);

const InstagramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.54 12 3.54 12 3.54s-7.53 0-9.388.515a3.003 3.003 0 0 0-2.11 2.108C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.46 12 20.46 12 20.46s7.53 0 9.388-.515a3.003 3.003 0 0 0 2.11-2.108C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TiktokIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 448 512" fill="currentColor" className={className}>
    <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25v178.72c0 101.71-82.44 184.15-184.15 184.15S0 451.09 0 349.38 82.44 165.23 184.15 165.23c20.1 0 39.14 3.25 56.91 9.27v-9.27H241v71.43c-17.77-10.45-38.38-16.43-60.36-16.43-62.24 0-112.7 50.46-112.7 112.7s50.46 112.7 112.7 112.7 112.7-50.46 112.7-112.7V0h70.22c1.35 44.57 24.32 83.92 58.91 108.06V209.91z" />
  </svg>
);

const SoundcloudIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 640 512" fill="currentColor" className={className}>
    <path d="M511.4 128c-12.8 0-25.1 2.9-36.2 8.1C455.5 83.1 405.3 48 346.7 48c-70.1 0-128 54.4-133.5 123.5-3.3-.3-6.6-.5-10-.5-41.4 0-75 33.6-75 75s33.6 75 75 75h308.3c41.4 0 75-33.6 75-75s-33.6-75-75-75zm-324.2 245.3c0 11.8-9.5 21.3-21.3 21.3s-21.3-9.5-21.3-21.3v-90.7c0-11.8 9.5-21.3 21.3-21.3s21.3 9.5 21.3 21.3v90.7zm42.7 0c0 11.8-9.5 21.3-21.3 21.3s-21.3-9.5-21.3-21.3V256c0-11.8 9.5-21.3 21.3-21.3s21.3 9.5 21.3 21.3v121.3zm42.7 0c0 11.8-9.5 21.3-21.3 21.3s-21.3-9.5-21.3-21.3V224c0-11.8 9.5-21.3 21.3-21.3s21.3 9.5 21.3 21.3v145.3zm42.7 0c0 11.8-9.5 21.3-21.3 21.3s-21.3-9.5-21.3-21.3V192c0-11.8 9.5-21.3 21.3-21.3s21.3 9.5 21.3 21.3v177.3zM640 288c0 53-43 96-96 96H320V160h224c53 0 96 43 96 96v32z" />
  </svg>
);

// ==========================================
// DATA TYPES
// ==========================================
interface SpriteConfig {
  id?: string;
  artistId?: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  fps: number;
}

interface SocialLinks {
  id?: string;
  artistId?: string;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  soundcloud: string | null;
  website: string | null;
}

interface Artist {
  id: string;
  userId: string;
  artistName: string;
  city: string | null;
  genre: string | null;
  description: string | null;
  photoUrl: string | null;
  photoColor: string; // Gradient color used for mock photo simulation
  characterType: "synth" | "rocker" | "folklore" | "rapper" | "dj";
  spriteSheetUrl: string | null;
  audioPreviewUrl: string | null;
  audioPreviewStart: number;
  priority: number;
  isActive: boolean;
  songTitle: string;
  spriteConfig: SpriteConfig | null;
  socialLinks: SocialLinks | null;
  user?: {
    name: string;
    avatarUrl: string | null;
  };
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  artistId?: string;
}

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

// ==========================================
// MOCK USERS & ARTISTS DATA
// ==========================================
const INITIAL_ARTISTS: Artist[] = [
  {
    id: "art-1",
    userId: "u-2",
    artistName: "Kala Marka",
    city: "La Paz",
    genre: "Electro Andino",
    description: "Pioneros en fusionar instrumentos autóctonos andinos con sintetizadores modernos y beats de música electrónica. Su propuesta visual incluye danzas tradicionales estilizadas.",
    photoUrl: "/artists/kalamarka.png",
    photoColor: "from-amber-500 to-rose-600",
    characterType: "folklore",
    spriteSheetUrl: "/sprites/kalamarka_sprite.png",
    audioPreviewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    audioPreviewStart: 45,
    priority: 10,
    isActive: true,
    songTitle: "Ama Amazonas (Electronic Remix)",
    spriteConfig: { frameWidth: 128, frameHeight: 128, frameCount: 6, fps: 8 },
    socialLinks: {
      facebook: "https://facebook.com/kalamarka",
      instagram: "https://instagram.com/kalamarka",
      tiktok: null,
      youtube: "https://youtube.com/kalamarka",
      soundcloud: null,
      website: "https://kalamarka.bo"
    },
    user: { name: "Kala Marka", avatarUrl: null }
  },
  {
    id: "art-2",
    userId: "u-3",
    artistName: "Octavia",
    city: "La Paz",
    genre: "Rock Alternativo",
    description: "Una de las bandas más influyentes y representativas del rock boliviano, con más de tres décadas fusionando rock pop y elementos folclóricos sutiles.",
    photoUrl: "/artists/octavia.png",
    photoColor: "from-blue-600 to-indigo-900",
    characterType: "rocker",
    spriteSheetUrl: "/sprites/octavia_sprite.png",
    audioPreviewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    audioPreviewStart: 12,
    priority: 9,
    isActive: true,
    songTitle: "Después de Ti",
    spriteConfig: { frameWidth: 128, frameHeight: 128, frameCount: 4, fps: 6 },
    socialLinks: {
      facebook: "https://facebook.com/octavia",
      instagram: "https://instagram.com/octavia",
      tiktok: null,
      youtube: "https://youtube.com/octavia",
      soundcloud: null,
      website: null
    },
    user: { name: "Octavia Rock", avatarUrl: null }
  },
  {
    id: "art-3",
    userId: "u-4",
    artistName: "Matamba",
    city: "Santa Cruz",
    genre: "Reggae Latino",
    description: "El máximo exponente del reggae roots en Bolivia. Creador del estilo 'Dread Rock', que combina la potencia del metal con el compás y mensaje espiritual del reggae.",
    photoUrl: "/artists/matamba.png",
    photoColor: "from-emerald-500 to-yellow-500",
    characterType: "synth",
    spriteSheetUrl: null,
    audioPreviewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    audioPreviewStart: 64,
    priority: 8,
    isActive: true,
    songTitle: "La Luna y el Sol",
    spriteConfig: null,
    socialLinks: {
      facebook: "https://facebook.com/matamba",
      instagram: "https://instagram.com/matamba",
      tiktok: "https://tiktok.com/@matamba",
      youtube: null,
      soundcloud: "https://soundcloud.com/matamba",
      website: null
    },
    user: { name: "Matamba Oficial", avatarUrl: null }
  },
  {
    id: "art-4",
    userId: "u-5",
    artistName: "Corona",
    city: "Cochabamba",
    genre: "Hip-Hop",
    description: "Lírica callejera y flows contundentes desde el valle. Sus canciones retratan la realidad social urbana y rescatan expresiones populares de la cotidianidad boliviana.",
    photoUrl: null,
    photoColor: "from-red-600 to-amber-700",
    characterType: "rapper",
    spriteSheetUrl: "/sprites/corona_sprite.png",
    audioPreviewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    audioPreviewStart: 5,
    priority: 7,
    isActive: true,
    songTitle: "Desde el Valle Seco",
    spriteConfig: { frameWidth: 128, frameHeight: 128, frameCount: 6, fps: 8 },
    socialLinks: {
      facebook: null,
      instagram: "https://instagram.com/corona",
      tiktok: null,
      youtube: "https://youtube.com/corona",
      soundcloud: null,
      website: null
    },
    user: { name: "Corona MC", avatarUrl: null }
  }
];

const INITIAL_USERS = [
  { id: "u-1", name: "Admin La Movida", email: "admin@lamovida.bo", role: "ADMIN" as const },
  { id: "u-2", name: "Kala Marka", email: "kalamarka@lamovida.bo", role: "USER" as const },
  { id: "u-3", name: "Octavia", email: "octavia@lamovida.bo", role: "USER" as const },
  { id: "u-4", name: "Matamba", email: "matamba@lamovida.bo", role: "USER" as const },
  { id: "u-5", name: "Corona", email: "corona@lamovida.bo", role: "USER" as const }
];

export default function LaMovidaApp() {
  // Navigation / Auth Mode State
  // "gallery" | "profile" | "admin"
  const [activeTab, setActiveTab] = useState<"gallery" | "profile" | "admin">("gallery");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null); // null = visitor, logged in user otherwise
  const [sessionOpen, setSessionOpen] = useState(false); // Auth popup state

  // Simulated Database State
  const [artists, setArtists] = useState<Artist[]>(INITIAL_ARTISTS);
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);

  // Gallery view mode & scroll
  const [viewMode, setViewMode] = useState<"photo" | "pixel">("photo");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [selectedCity, setSelectedCity] = useState("Todas");
  
  // Selected artist for modal dialog
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  // Bottom Audio Player states
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(0.8);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  // Profile Edit states
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [editMinutes, setEditMinutes] = useState("0");
  const [editSeconds, setEditSeconds] = useState("0");
  const [profileFormData, setProfileFormData] = useState({
    artistName: "",
    city: "",
    genre: "",
    description: "",
    photoUrl: "",
    spriteSheetUrl: "",
    audioPreviewUrl: "",
    audioPreviewStart: "0",
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    soundcloud: "",
    website: "",
    frameWidth: "128",
    frameHeight: "128",
    frameCount: "6",
    fps: "8",
  });

  // Admin Dashboard States
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRole, setAdminRole] = useState<"USER" | "ADMIN">("USER");
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);

  // Audio simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Load profile editing form data when user logs in or edits profile
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (session && activeTab === "profile") {
      const artist = artists.find(a => a.userId === session.id);
      if (artist) {
        setEditMinutes(Math.floor(artist.audioPreviewStart / 60).toString());
        setEditSeconds((artist.audioPreviewStart % 60).toString());
        setProfileFormData({
          artistName: artist.artistName || "",
          city: artist.city || "",
          genre: artist.genre || "",
          description: artist.description || "",
          photoUrl: artist.photoUrl || "",
          spriteSheetUrl: artist.spriteSheetUrl || "",
          audioPreviewUrl: artist.audioPreviewUrl || "",
          audioPreviewStart: artist.audioPreviewStart.toString(),
          facebook: artist.socialLinks?.facebook || "",
          instagram: artist.socialLinks?.instagram || "",
          tiktok: artist.socialLinks?.tiktok || "",
          youtube: artist.socialLinks?.youtube || "",
          soundcloud: artist.socialLinks?.soundcloud || "",
          website: artist.socialLinks?.website || "",
          frameWidth: artist.spriteConfig?.frameWidth?.toString() || "128",
          frameHeight: artist.spriteConfig?.frameHeight?.toString() || "128",
          frameCount: artist.spriteConfig?.frameCount?.toString() || "6",
          fps: artist.spriteConfig?.fps?.toString() || "8",
        });
      } else {
        // Reset form for fresh creation
        setProfileFormData({
          artistName: session.name,
          city: "",
          genre: "",
          description: "",
          photoUrl: "",
          spriteSheetUrl: "",
          audioPreviewUrl: "",
          audioPreviewStart: "0",
          facebook: "",
          instagram: "",
          tiktok: "",
          youtube: "",
          soundcloud: "",
          website: "",
          frameWidth: "128",
          frameHeight: "128",
          frameCount: "6",
          fps: "8",
        });
      }
    }
  }, [session, activeTab, artists]);

  // Playback handlers
  const playArtist = (artist: Artist) => {
    setCurrentArtist(artist);
    setIsPlayerVisible(true);
    setIsPlaying(true);
    setCurrentTime(artist.audioPreviewStart);
    setDuration(180); // standard simulated preview duration
  };

  const handleNextArtist = () => {
    if (!selectedArtist) return;
    const activeList = getFilteredArtists();
    const index = activeList.findIndex(a => a.id === selectedArtist.id);
    if (index !== -1) {
      const nextArtist = activeList[(index + 1) % activeList.length];
      setSelectedArtist(nextArtist);
      playArtist(nextArtist);
    }
  };

  const handlePrevArtist = () => {
    if (!selectedArtist) return;
    const activeList = getFilteredArtists();
    const index = activeList.findIndex(a => a.id === selectedArtist.id);
    if (index !== -1) {
      const prevArtist = activeList[(index - 1 + activeList.length) % activeList.length];
      setSelectedArtist(prevArtist);
      playArtist(prevArtist);
    }
  };

  // Helper formatting function
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Filter lists
  const getFilteredArtists = () => {
    return artists.filter(art => {
      const matchesSearch = art.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (art.genre && art.genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (art.city && art.city.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesGenre = selectedGenre === "Todos" || art.genre === selectedGenre;
      const matchesCity = selectedCity === "Todas" || art.city === selectedCity;
      return art.isActive && matchesSearch && matchesGenre && matchesCity;
    }).sort((a, b) => b.priority - a.priority);
  };

  const genres = ["Todos", ...Array.from(new Set(artists.map(a => a.genre).filter(Boolean) as string[]))];
  const cities = ["Todas", ...Array.from(new Set(artists.map(a => a.city).filter(Boolean) as string[]))];

  // Simulated Login Actions
  const handleSelectRole = (user: MockUser) => {
    const userArtist = artists.find(a => a.userId === user.id);
    setSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      artistId: userArtist?.id
    });
    setSessionOpen(false);
  };

  const handleSignOut = () => {
    setSession(null);
    setActiveTab("gallery");
  };

  // Edit profile submit
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setProfileLoading(true);
    setProfileSuccess("");
    setProfileError("");

    setTimeout(() => {
      const artistIndex = artists.findIndex(a => a.userId === session.id);
      const totalSeconds = parseInt(editMinutes || "0") * 60 + parseInt(editSeconds || "0");
      
      const newArtistData: Artist = {
        id: artistIndex !== -1 ? artists[artistIndex].id : `art-${Date.now()}`,
        userId: session.id,
        artistName: profileFormData.artistName,
        city: profileFormData.city || null,
        genre: profileFormData.genre || null,
        description: profileFormData.description || null,
        photoUrl: profileFormData.photoUrl || null,
        photoColor: artistIndex !== -1 ? artists[artistIndex].photoColor : "from-violet-500 to-indigo-600",
        characterType: artistIndex !== -1 ? artists[artistIndex].characterType : "synth",
        spriteSheetUrl: profileFormData.spriteSheetUrl || null,
        audioPreviewUrl: profileFormData.audioPreviewUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        audioPreviewStart: totalSeconds,
        priority: artistIndex !== -1 ? artists[artistIndex].priority : 5,
        isActive: true,
        songTitle: `Demo - ${profileFormData.artistName}`,
        spriteConfig: profileFormData.spriteSheetUrl ? {
          frameWidth: parseInt(profileFormData.frameWidth) || 128,
          frameHeight: parseInt(profileFormData.frameHeight) || 128,
          frameCount: parseInt(profileFormData.frameCount) || 6,
          fps: parseInt(profileFormData.fps) || 8,
        } : null,
        socialLinks: {
          facebook: profileFormData.facebook || null,
          instagram: profileFormData.instagram || null,
          tiktok: profileFormData.tiktok || null,
          youtube: profileFormData.youtube || null,
          soundcloud: profileFormData.soundcloud || null,
          website: profileFormData.website || null,
        }
      };

      if (artistIndex !== -1) {
        const updated = [...artists];
        updated[artistIndex] = newArtistData;
        setArtists(updated);
      } else {
        setArtists([...artists, newArtistData]);
      }

      setProfileLoading(false);
      setProfileSuccess("Perfil guardado con éxito.");
      setTimeout(() => {
        setActiveTab("gallery");
      }, 1000);
    }, 800);
  };

  // Admin Actions
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName || !adminEmail) return;

    const newUser = {
      id: `u-${Date.now()}`,
      name: adminName,
      email: adminEmail,
      role: adminRole,
    };

    setUsers([newUser, ...users]);
    setAdminName("");
    setAdminEmail("");
    setAdminPassword("");
    setAdminRole("USER");
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    setArtists(artists.filter(a => a.userId !== id));
  };

  const handleUpdateUserRole = (id: string, nextRole: "ADMIN" | "USER") => {
    setUsers(users.map(u => u.id === id ? { ...u, role: nextRole } : u));
    if (session?.id === id) {
      setSession(prev => prev ? { ...prev, role: nextRole } : null);
    }
  };

  // Bobbing Sprite Renderer
  const renderSprite = (artist: Artist, size = "w-20 h-20") => {
    const hasSprite = !!artist.spriteSheetUrl && !!artist.spriteConfig;
    if (!hasSprite) {
      return <Music className="h-6 w-6 text-muted-foreground" />;
    }

    const type = artist.characterType;
    let color = "#ef4444";
    let accent = "#1e1b4b";
    let sub = "#f59e0b";
    let customHat = false;

    if (type === "folklore") {
      color = "#d97706";
      accent = "#78350f";
      sub = "#b45309";
      customHat = true;
    } else if (type === "rocker") {
      color = "#b91c1c";
      accent = "#0f172a";
      sub = "#64748b";
    } else if (type === "rapper") {
      color = "#10b981";
      accent = "#064e3b";
      sub = "#facc15";
    } else if (type === "dj") {
      color = "#8b5cf6";
      accent = "#c084fc";
      sub = "#10b981";
    }

    return (
      <div className={`${size} relative flex items-center justify-center bg-muted/40 border rounded overflow-hidden`}>
        <div className="w-full h-full flex items-center justify-center animate-[bob_1.2s_infinite_ease-in-out]">
          <svg viewBox="0 0 16 16" className="w-4/5 h-4/5" style={{ imageRendering: "pixelated" }}>
            {customHat ? (
              <path d="M 4 4 L 12 4 L 12 6 L 4 6 Z M 2 5 L 14 5 L 14 6 L 2 6 Z" fill="#78350f" />
            ) : (
              <rect x="5" y="3" width="6" height="2" fill={accent} />
            )}
            <rect x="5" y="5" width="6" height="5" fill="#fed7aa" />
            <rect x="6" y="6" width="1" height="1" fill="#1e293b" />
            <rect x="9" y="6" width="1" height="1" fill="#1e293b" />
            <rect x="7" y="8" width="2" height="1" fill="#f43f5e" />
            <rect x="4" y="10" width="8" height="5" fill={color} />
            {type === "rocker" && (
              <path d="M 2 12 L 6 12 L 8 10 L 9 11 L 7 13 L 2 13 Z" fill={sub} />
            )}
            {type === "folklore" && (
              <rect x="6" y="9" width="4" height="3" fill="#eab308" />
            )}
            {type === "dj" && (
              <rect x="5" y="6" width="6" height="1" fill="#22c55e" />
            )}
          </svg>
        </div>
      </div>
    );
  };

  const getArtistForUser = (userId: string) => {
    return artists.find(a => a.userId === userId);
  };

  return (
    <div className={`w-full h-full ${isDarkMode ? "dark" : ""} select-none font-sans overflow-hidden flex flex-col`}>
      {/* Styles for dynamic fonts, keyframes, and custom inputs */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        :root {
          --background: 255 255 255;
          --foreground: 9 9 11;
          --card: 255 255 255;
          --card-foreground: 9 9 11;
          --popover: 255 255 255;
          --popover-foreground: 9 9 11;
          --primary: 9 9 11;
          --primary-foreground: 250 250 250;
          --secondary: 244 244 245;
          --secondary-foreground: 9 9 11;
          --muted: 244 244 245;
          --muted-foreground: 113 113 122;
          --accent: 244 244 245;
          --accent-foreground: 9 9 11;
          --destructive: 239 68 68;
          --border: 228 228 231;
          --input: 228 228 231;
          --ring: 161 161 170;
          --pixel-primary: 220 38 38;
        }

        .dark {
          --background: 10 10 10;
          --foreground: 250 250 250;
          --card: 18 18 18;
          --card-foreground: 250 250 250;
          --popover: 18 18 18;
          --popover-foreground: 250 250 250;
          --primary: 250 250 250;
          --primary-foreground: 9 9 11;
          --secondary: 39 39 42;
          --secondary-foreground: 250 250 250;
          --muted: 39 39 42;
          --muted-foreground: 161 161 170;
          --accent: 39 39 42;
          --accent-foreground: 250 250 250;
          --destructive: 239 68 68;
          --border: 39 39 42;
          --input: 39 39 42;
          --ring: 82 82 91;
          --pixel-primary: 248 113 113;
        }

        .bg-background { background-color: rgb(var(--background)); }
        .text-foreground { color: rgb(var(--foreground)); }
        .bg-card { background-color: rgb(var(--card)); }
        .text-card-foreground { color: rgb(var(--card-foreground)); }
        .bg-muted { background-color: rgb(var(--muted)); }
        .text-muted-foreground { color: rgb(var(--muted-foreground)); }
        .border-border { border-color: rgb(var(--border)); }
        .accent-pixel-primary { accent-color: rgb(var(--pixel-primary)); }
        .text-pixel-primary { color: rgb(var(--pixel-primary)); }
        .border-pixel-primary { border-color: rgb(var(--pixel-primary)); }
        .bg-pixel-primary { background-color: rgb(var(--pixel-primary)); }

        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes playwave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1.0); }
        }
      `}</style>

      {/*Root SaaS Container */}
      <div className="flex-1 w-full h-full flex flex-col bg-background text-foreground overflow-y-auto">
        
        {/* ==========================================
            SITE HEADER (Faithful Recreation)
            ========================================== */}
        <header className="bg-background z-50 w-full border-b shrink-0">
          <div className="relative flex h-12 w-full items-center justify-center border-b bg-muted/50 px-4">
            
            {/* Centered Title with Pixel Font */}
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab("gallery")}>
              <h1 
                className="scroll-m-20 text-sm tracking-tight lg:text-md text-foreground select-none"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                La Movida BO
              </h1>
            </div>

            {/* Actions on the Right */}
            <div className="absolute right-4 flex items-center gap-2 text-xs">
              {session ? (
                <>
                  {session.role === "ADMIN" && (
                    <button 
                      onClick={() => setActiveTab("admin")}
                      className={`h-8 px-3 rounded-md transition-all font-semibold ${
                        activeTab === "admin" ? "bg-accent text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Gestionar Usuarios
                    </button>
                  )}
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className={`h-8 px-3 rounded-md transition-all font-semibold ${
                      activeTab === "profile" ? "bg-accent text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Mi Perfil
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="h-8 px-3 rounded-md border border-border bg-background hover:bg-muted text-foreground transition-all"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setSessionOpen(true)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                  title="Acceso"
                >
                  <User className="h-4 w-4" />
                </button>
              )}

              {/* Theme Mode Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground transition-all"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* ==========================================
            VIEWPORT AREA
            ========================================== */}
        <main className="flex-1 w-full relative">
          
          {/* TAB 1: VISITOR GALLERY */}
          {activeTab === "gallery" && (
            <section className="max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
              
              {/* Header with Search and Layout Toggle */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight">Artistas Urbanos</h2>
                  <p className="text-xs text-muted-foreground">Descubre talentos bolivianos e interactúa con su música y sprites.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative w-48 sm:w-60">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Buscar artista..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 text-xs bg-muted/50 rounded-md border border-border focus:outline-none focus:border-pixel-primary"
                    />
                  </div>

                  {/* Filter Selects */}
                  <select 
                    value={selectedGenre} 
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="h-8 px-2 text-xs bg-muted/60 border border-border rounded-md text-foreground focus:outline-none"
                  >
                    {genres.map(g => <option key={g} value={g}>{g === "Todos" ? "Estilo: Todos" : g}</option>)}
                  </select>

                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="h-8 px-2 text-xs bg-muted/60 border border-border rounded-md text-foreground focus:outline-none"
                  >
                    {cities.map(c => <option key={c} value={c}>{c === "Todas" ? "Ciudad: Todas" : c}</option>)}
                  </select>

                  {/* View mode toggle */}
                  <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                    <button
                      onClick={() => setViewMode("photo")}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                        viewMode === "photo" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Foto
                    </button>
                    <button
                      onClick={() => setViewMode("pixel")}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                        viewMode === "pixel" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Píxel
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of Artist Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                {getFilteredArtists().map((art) => {
                  const hasSprite = !!art.spriteSheetUrl && !!art.spriteConfig;
                  const isCurrent = currentArtist?.id === art.id;

                  return (
                    <div
                      key={art.id}
                      onClick={() => {
                        if (art.audioPreviewUrl) playArtist(art);
                        setSelectedArtist(art);
                      }}
                      className="w-full max-w-[240px] mx-auto border-2 border-border/50 rounded-lg transition-all duration-300 flex flex-col overflow-hidden bg-card hover:border-foreground hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transform hover:-translate-y-1 cursor-pointer relative"
                    >
                      {/* Image/Sprite Cover Container */}
                      <div className="p-0 relative aspect-square overflow-hidden bg-muted/20 flex items-center justify-center">
                        <div className="w-full h-full relative flex items-center justify-center p-2">
                          {viewMode === "photo" || !hasSprite ? (
                            art.photoUrl ? (
                              <div className={`w-full h-full rounded-md bg-gradient-to-br ${art.photoColor} flex flex-col items-center justify-center text-center p-2 relative`}>
                                <div className="w-10 h-10 rounded-full bg-slate-950/40 border border-white/20 flex items-center justify-center text-white font-extrabold text-sm mb-1">
                                  {art.artistName.charAt(0)}
                                </div>
                                <span className="text-white text-xs font-bold drop-shadow">{art.artistName}</span>
                              </div>
                            ) : (
                              <div className="text-muted-foreground text-xs">Sin foto</div>
                            )
                          ) : (
                            renderSprite(art, "w-full h-full")
                          )}
                        </div>

                        {/* Playing Status Overlay Badge */}
                        {isCurrent && isPlaying && (
                          <div className="absolute top-2 left-2 bg-pixel-primary rounded-full p-1 border border-white/25 animate-pulse">
                            <Volume2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content Card Body */}
                      <div className="p-3 space-y-2 border-t border-border/30">
                        <div>
                          <h3 
                            className="text-xs font-bold truncate text-foreground"
                            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", lineHeight: "12px" }}
                          >
                            {art.artistName}
                          </h3>
                          <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
                            {art.genre || "Artista"} {art.city ? `• ${art.city}` : ""}
                          </p>
                        </div>

                        <div className="flex justify-center pt-2 border-t border-border/20">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {art.socialLinks?.website && <a href={art.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="Web"><Globe className="h-3.5 w-3.5" /></a>}
                            {art.socialLinks?.instagram && <a href={art.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="Instagram"><InstagramIcon className="h-3.5 w-3.5" /></a>}
                            {art.socialLinks?.facebook && <a href={art.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="Facebook"><FacebookIcon className="h-3.5 w-3.5" /></a>}
                            {art.socialLinks?.youtube && <a href={art.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="YouTube"><YoutubeIcon className="h-3.5 w-3.5" /></a>}
                            {art.socialLinks?.tiktok && <a href={art.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="TikTok"><TiktokIcon className="h-3.5 w-3.5" /></a>}
                            {art.socialLinks?.soundcloud && <a href={art.socialLinks.soundcloud} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="SoundCloud"><SoundcloudIcon className="h-3.5 w-3.5" /></a>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {getFilteredArtists().length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                  No hay artistas que coincidan con la búsqueda.
                </div>
              )}
            </section>
          )}

          {/* TAB 2: PROFILE EDIT PAGE */}
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto p-4 py-8 space-y-6">
              <div className="bg-card border-2 border-border/50 rounded-lg overflow-hidden shadow-sm">
                
                {/* Card Header */}
                <div className="p-6 pb-2">
                  <h3 
                    style={{ fontFamily: "'Press Start 2P', monospace" }} 
                    className="text-md font-bold tracking-tight text-foreground"
                  >
                    Edita tu Perfil de Artista
                  </h3>
                </div>

                {/* Card Content Form */}
                <div className="p-6">
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {profileError && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-md">
                        {profileError}
                      </div>
                    )}
                    {profileSuccess && (
                      <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs p-3 rounded-md">
                        {profileSuccess}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-foreground block mb-1">Nombre Artístico *</label>
                          <input
                            type="text"
                            name="artistName"
                            value={profileFormData.artistName}
                            onChange={(e) => setProfileFormData(p => ({ ...p, artistName: e.target.value }))}
                            required
                            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none focus:border-pixel-primary"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-foreground block mb-1">Ciudad</label>
                          <input
                            type="text"
                            name="city"
                            value={profileFormData.city}
                            onChange={(e) => setProfileFormData(p => ({ ...p, city: e.target.value }))}
                            placeholder="Ej: La Paz"
                            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-foreground block mb-1">Género Musical</label>
                          <input
                            type="text"
                            name="genre"
                            value={profileFormData.genre}
                            onChange={(e) => setProfileFormData(p => ({ ...p, genre: e.target.value }))}
                            placeholder="Ej: Trap, Hip-Hop"
                            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Biografía</label>
                        <textarea
                          name="description"
                          value={profileFormData.description}
                          onChange={(e) => setProfileFormData(p => ({ ...p, description: e.target.value }))}
                          placeholder="Cuéntanos sobre ti..."
                          className="w-full h-[142px] p-3 text-xs bg-background border border-border rounded-md focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    <hr className="border-border/50" />

                    {/* Files Upload Simulators */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Photo upload */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground block">Foto de Perfil</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setProfileFormData(p => ({ ...p, photoUrl: "/artists/custom.png" }))}
                            className="h-9 px-3 bg-muted border border-border rounded-md hover:bg-muted/80 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Upload className="h-3.5 w-3.5" /> Subir Foto
                          </button>
                        </div>
                        {profileFormData.photoUrl && (
                          <div className="mt-2 space-y-1">
                            <div className="relative w-20 h-20 rounded-md overflow-hidden border bg-muted/20 flex items-center justify-center">
                              <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                Preview
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate">{profileFormData.photoUrl}</p>
                          </div>
                        )}
                      </div>

                      {/* Sprite upload */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground block">Sprite Sheet (PNG)</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setProfileFormData(p => ({ ...p, spriteSheetUrl: "/sprites/custom_sprite.png" }))}
                            className="h-9 px-3 bg-muted border border-border rounded-md hover:bg-muted/80 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Upload className="h-3.5 w-3.5" /> Subir Sprite
                          </button>
                        </div>
                        {profileFormData.spriteSheetUrl && (
                          <div className="mt-2 space-y-1">
                            <div className="w-20 h-20 rounded-md overflow-hidden border bg-muted/40 flex items-center justify-center">
                              {/* Bobbing animated sprite block preview */}
                              <div className="animate-[bob_1.2s_infinite_ease-in-out]">
                                <svg viewBox="0 0 16 16" className="w-8 h-8" style={{ imageRendering: "pixelated" }}>
                                  <rect x="5" y="3" width="6" height="2" fill="#8b5cf6" />
                                  <rect x="5" y="5" width="6" height="5" fill="#fed7aa" />
                                  <rect x="6" y="6" width="1" height="1" fill="#1e293b" />
                                  <rect x="9" y="6" width="1" height="1" fill="#1e293b" />
                                  <rect x="4" y="10" width="8" height="5" fill="#ec4899" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate">{profileFormData.spriteSheetUrl}</p>
                          </div>
                        )}
                      </div>

                      {/* Audio upload */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground block">Audio Preview (MP3)</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setProfileFormData(p => ({ ...p, audioPreviewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" }))}
                            className="h-9 px-3 bg-muted border border-border rounded-md hover:bg-muted/80 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Upload className="h-3.5 w-3.5" /> Subir Audio
                          </button>
                        </div>
                        {profileFormData.audioPreviewUrl && (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2 bg-muted p-2 rounded-md border border-border">
                              <Music className="h-4 w-4 text-pixel-primary" />
                              <span className="text-[10px] text-foreground font-mono truncate max-w-[120px]">
                                SoundHelix-Song-5.mp3
                              </span>
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Punto de inicio para la preview (Min:Seg)</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Min"
                                  value={editMinutes}
                                  onChange={(e) => setEditMinutes(e.target.value.replace(/[^0-9]/g, ""))}
                                  className="h-8 w-12 text-center text-xs bg-background border border-border rounded focus:outline-none"
                                />
                                <span className="font-bold">:</span>
                                <input
                                  type="text"
                                  placeholder="Seg"
                                  value={editSeconds}
                                  onChange={(e) => setEditSeconds(e.target.value.replace(/[^0-9]/g, ""))}
                                  className="h-8 w-12 text-center text-xs bg-background border border-border rounded focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sprite configuration details */}
                    {profileFormData.spriteSheetUrl && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/40 border border-border/50 rounded-lg">
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Ancho Frame (px)</label>
                          <input
                            type="number"
                            value={profileFormData.frameWidth}
                            onChange={(e) => setProfileFormData(p => ({ ...p, frameWidth: e.target.value }))}
                            className="w-full h-8 px-2.5 text-xs bg-background border border-border rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Alto Frame (px)</label>
                          <input
                            type="number"
                            value={profileFormData.frameHeight}
                            onChange={(e) => setProfileFormData(p => ({ ...p, frameHeight: e.target.value }))}
                            className="w-full h-8 px-2.5 text-xs bg-background border border-border rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Num Frames</label>
                          <input
                            type="number"
                            value={profileFormData.frameCount}
                            onChange={(e) => setProfileFormData(p => ({ ...p, frameCount: e.target.value }))}
                            className="w-full h-8 px-2.5 text-xs bg-background border border-border rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-1">FPS</label>
                          <input
                            type="number"
                            value={profileFormData.fps}
                            onChange={(e) => setProfileFormData(p => ({ ...p, fps: e.target.value }))}
                            className="w-full h-8 px-2.5 text-xs bg-background border border-border rounded focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <hr className="border-border/50" />

                    {/* Social links */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-foreground block">Redes Sociales</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Facebook URL</label>
                          <input
                            type="text"
                            value={profileFormData.facebook}
                            onChange={(e) => setProfileFormData(p => ({ ...p, facebook: e.target.value }))}
                            placeholder="https://facebook.com/..."
                            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Instagram URL</label>
                          <input
                            type="text"
                            value={profileFormData.instagram}
                            onChange={(e) => setProfileFormData(p => ({ ...p, instagram: e.target.value }))}
                            placeholder="https://instagram.com/..."
                            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">TikTok URL</label>
                          <input
                            type="text"
                            value={profileFormData.tiktok}
                            onChange={(e) => setProfileFormData(p => ({ ...p, tiktok: e.target.value }))}
                            placeholder="https://tiktok.com/@..."
                            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">YouTube URL</label>
                          <input
                            type="text"
                            value={profileFormData.youtube}
                            onChange={(e) => setProfileFormData(p => ({ ...p, youtube: e.target.value }))}
                            placeholder="https://youtube.com/..."
                            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">SoundCloud URL</label>
                          <input
                            type="text"
                            value={profileFormData.soundcloud}
                            onChange={(e) => setProfileFormData(p => ({ ...p, soundcloud: e.target.value }))}
                            placeholder="https://soundcloud.com/..."
                            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Sitio Web URL</label>
                          <input
                            type="text"
                            value={profileFormData.website}
                            onChange={(e) => setProfileFormData(p => ({ ...p, website: e.target.value }))}
                            placeholder="https://..."
                            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="w-full h-10 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 rounded-md transition-all text-xs"
                    >
                      {profileLoading ? "Guardando..." : "Guardar Perfil"}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: ADMIN DASHBOARD */}
          {activeTab === "admin" && (
            <div className="max-w-6xl mx-auto p-4 py-8 space-y-6">
              
              {/* Header Panel info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                  <h2 
                    className="text-lg font-bold"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    Admin Dashboard
                  </h2>
                  <button 
                    onClick={() => setActiveTab("gallery")}
                    className="h-7 px-2.5 border border-border rounded-md text-[10px] font-mono hover:bg-muted text-foreground"
                  >
                    Volver a Inicio
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Panel de Gestión de Usuarios y Artistas
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Form: Create User */}
                <div className="lg:col-span-1">
                  <div className="bg-card border-2 border-border/50 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-border/30 flex items-center gap-2">
                      <UserCog className="h-4.5 w-4.5 text-pixel-primary" />
                      <span className="text-xs font-bold text-foreground">Crear Usuario</span>
                    </div>

                    <div className="p-4">
                      <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">Nombre</label>
                          <input 
                            type="text" 
                            required
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            placeholder="Nombre Completo"
                            className="w-full h-8 px-2.5 text-xs bg-background border border-border rounded focus:outline-none focus:border-pixel-primary"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">Email</label>
                          <input 
                            type="email" 
                            required
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="email@lamovida.bo"
                            className="w-full h-8 px-2.5 text-xs bg-background border border-border rounded focus:outline-none focus:border-pixel-primary"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">Contraseña</label>
                          <input 
                            type="password" 
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-8 px-2.5 text-xs bg-background border border-border rounded focus:outline-none focus:border-pixel-primary"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">Rol de Cuenta</label>
                          <select 
                            value={adminRole}
                            onChange={(e) => setAdminRole(e.target.value as "USER" | "ADMIN")}
                            className="w-full h-8 px-2 text-xs bg-background border border-border rounded focus:outline-none"
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>

                        <button 
                          type="submit"
                          className="w-full h-8 bg-pixel-primary text-white text-xs font-bold rounded hover:bg-pixel-primary/95 transition-all flex items-center justify-center gap-1"
                        >
                          <Plus className="h-3.5 w-3.5" /> Crear Cuenta
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Right Form: Users List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-card border-2 border-border/50 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Usuarios y Artistas ({users.length})</span>
                    </div>

                    <div className="p-4 space-y-3 max-h-[460px] overflow-y-auto">
                      {users.map((u) => {
                        const art = getArtistForUser(u.id);
                        return (
                          <div key={u.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 border-2 border-border/30 rounded-lg hover:border-pixel-primary/30 transition-colors gap-3 bg-muted/10">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs">{u.name || "Sin nombre"}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  u.role === "ADMIN" 
                                    ? "bg-destructive/10 text-destructive border border-destructive/20" 
                                    : "bg-pixel-primary/10 text-pixel-primary border border-pixel-primary/20"
                                }`}>
                                  {u.role}
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono">{u.email}</span>
                            </div>

                            <div className="flex flex-row items-center gap-3">
                              {art ? (
                                <div className="text-[10px] bg-muted px-2 py-1 rounded border border-border/50 min-w-[120px]">
                                  <div className="font-bold text-pixel-primary truncate">{art.artistName}</div>
                                  <div className="text-[9px] text-green-500 font-semibold mt-0.5 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    {art.spriteSheetUrl ? "✓ Sprite Asignado" : "Sin Sprite"}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-[10px] text-muted-foreground px-2 py-1 bg-muted/40 rounded border border-dashed min-w-[120px] text-center">
                                  Sin Perfil
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingUser(u);
                                  }}
                                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all"
                                  title="Editar Rol"
                                >
                                  <UserCog className="h-4 w-4" />
                                </button>
                                {u.id !== session?.id && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/20 transition-all"
                                    title="Eliminar Cuenta"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

        {/* ==========================================
            PERSISTENT BOTTOM PLAYER (Recreation)
            ========================================== */}
        {currentArtist && isPlayerVisible && (
          <footer 
            id="bottom-player" 
            className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-auto bg-background/95 border-t border-border/50 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] p-4 transition-all duration-300 transform translate-y-0 shrink-0"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Left Side: Playing Artist info */}
              <div className="flex items-center gap-3 w-full md:w-1/3">
                <div className="relative w-12 h-12 bg-muted/20 border border-border/50 rounded-md overflow-hidden shrink-0 flex items-center justify-center">
                  {currentArtist.photoUrl ? (
                    renderSprite(currentArtist, "w-full h-full")
                  ) : (
                    <Music className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 
                    className="text-xs font-bold truncate text-foreground leading-tight"
                    style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px" }}
                  >
                    {currentArtist.artistName}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
                    {currentArtist.genre || "Artista Urbano"} {currentArtist.city ? `• ${currentArtist.city}` : ""}
                  </p>
                </div>
              </div>

              {/* Center Controls */}
              <div className="flex items-center gap-4 w-full md:w-1/3 justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-9 w-9 rounded-full border border-pixel-primary/30 shrink-0 bg-background hover:bg-pixel-primary/10 flex items-center justify-center transition-all"
                >
                  {isPlaying ? (
                    <Pause className="h-4.5 w-4.5 text-pixel-primary" />
                  ) : (
                    <Play className="h-4.5 w-4.5 text-pixel-primary translate-x-[1px]" />
                  )}
                </button>

                {/* Progress bar */}
                <div className="flex items-center gap-2 w-full">
                  <span className="text-[9px] font-mono text-muted-foreground shrink-0 min-w-[28px]">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-pixel-primary focus:outline-none"
                  />
                  <span className="text-[9px] font-mono text-muted-foreground shrink-0 min-w-[28px]">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center justify-end w-full md:w-1/3 shrink-0 gap-4">
                
                {/* Simulated wave equalizer animation when audio is playing */}
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-5">
                    <span className="w-0.5 bg-pixel-primary animate-[playwave_0.8s_infinite_ease-in-out_delay-100]" style={{ height: "40%" }}></span>
                    <span className="w-0.5 bg-pixel-primary animate-[playwave_1.2s_infinite_ease-in-out_delay-300]" style={{ height: "80%" }}></span>
                    <span className="w-0.5 bg-pixel-primary animate-[playwave_0.9s_infinite_ease-in-out]" style={{ height: "60%" }}></span>
                    <span className="w-0.5 bg-pixel-primary animate-[playwave_1s_infinite_ease-in-out_delay-200]" style={{ height: "50%" }}></span>
                  </div>
                )}

                {/* Volume slider */}
                <div className="flex items-center gap-2 bg-muted/20 px-2 py-1 rounded-md border border-border/20">
                  <button
                    onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-pixel-primary"
                  />
                </div>

                <button
                  onClick={() => setIsPlayerVisible(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border transition-all"
                  title="Cerrar reproductor"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

            </div>
          </footer>
        )}

      </div>

      {/* ==========================================
          DETAIL DIALOG MODAL (Faithful Recreation)
          ========================================== */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-2 border-border/50 rounded-lg p-6 pl-10 pr-10 relative">
            
            {/* Modal close icon */}
            <button 
              onClick={() => setSelectedArtist(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevArtist(); }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background border border-border/50 shadow flex items-center justify-center hover:bg-accent text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNextArtist(); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background border border-border/50 shadow flex items-center justify-center hover:bg-accent text-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 pt-2">
              
              {/* Cover area (Photo or Sprite) */}
              <div className="relative aspect-square w-full md:w-48 bg-muted/20 border-2 border-border/50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                {viewMode === "photo" || !selectedArtist.spriteSheetUrl ? (
                  selectedArtist.photoUrl ? (
                    <div className={`w-full h-full bg-gradient-to-br ${selectedArtist.photoColor} flex flex-col items-center justify-center text-white text-center p-3 relative`}>
                      <span className="font-extrabold text-sm drop-shadow">{selectedArtist.artistName}</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">Sin foto</div>
                  )
                ) : (
                  renderSprite(selectedArtist, "w-full h-full")
                )}
              </div>

              {/* Title & Info */}
              <div className="space-y-1.5 flex-1 min-w-0 pt-2">
                <h3 
                  className="text-xl font-bold truncate text-foreground tracking-tight"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {selectedArtist.artistName}
                </h3>
                
                <div className="text-xs text-muted-foreground font-mono">
                  {selectedArtist.genre && (
                    <span className="text-pixel-primary font-semibold">{selectedArtist.genre}</span>
                  )}
                  {selectedArtist.genre && selectedArtist.city && <span className="mx-2">•</span>}
                  {selectedArtist.city && <span>{selectedArtist.city}</span>}
                </div>

                <hr className="border-border/40 my-3" />

                {/* Biography */}
                <div className="max-h-[160px] overflow-y-auto pr-1">
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold font-mono mb-1">
                    Biografía
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {selectedArtist.description || "Este artista no ha agregado una biografía todavía."}
                  </p>
                </div>
              </div>

            </div>

            {/* Social links */}
            {selectedArtist.socialLinks && (
              <div className="pt-4 border-t border-border/50 mt-5">
                <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold font-mono mb-2">
                  Enlaces y Redes Sociales
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Facebook */}
                  {selectedArtist.socialLinks.facebook && (
                    <a
                      href={selectedArtist.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-2 rounded-md border border-border/30 bg-muted/10 hover:bg-muted/40 transition-colors"
                    >
                      <div className="p-1 rounded bg-background border border-border/20 flex items-center justify-center">
                        <FacebookIcon className="h-4 w-4 text-[#1877F2]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold block text-foreground leading-none mb-0.5">Facebook</span>
                        <span className="text-[9px] text-muted-foreground truncate block font-mono">facebook.com/kalamarka</span>
                      </div>
                    </a>
                  )}

                  {/* Instagram */}
                  {selectedArtist.socialLinks.instagram && (
                    <a
                      href={selectedArtist.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-2 rounded-md border border-border/30 bg-muted/10 hover:bg-muted/40 transition-colors"
                    >
                      <div className="p-1 rounded bg-background border border-border/20 flex items-center justify-center">
                        <InstagramIcon className="h-4 w-4 text-[#E4405F]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold block text-foreground leading-none mb-0.5">Instagram</span>
                        <span className="text-[9px] text-muted-foreground truncate block font-mono">instagram.com/artist</span>
                      </div>
                    </a>
                  )}

                  {/* YouTube */}
                  {selectedArtist.socialLinks.youtube && (
                    <a
                      href={selectedArtist.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-2 rounded-md border border-border/30 bg-muted/10 hover:bg-muted/40 transition-colors"
                    >
                      <div className="p-1 rounded bg-background border border-border/20 flex items-center justify-center">
                        <YoutubeIcon className="h-4 w-4 text-[#FF0000]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold block text-foreground leading-none mb-0.5">YouTube</span>
                        <span className="text-[9px] text-muted-foreground truncate block font-mono">youtube.com/artist</span>
                      </div>
                    </a>
                  )}

                  {/* SoundCloud */}
                  {selectedArtist.socialLinks.soundcloud && (
                    <a
                      href={selectedArtist.socialLinks.soundcloud}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-2 rounded-md border border-border/30 bg-muted/10 hover:bg-muted/40 transition-colors"
                    >
                      <div className="p-1 rounded bg-background border border-border/20 flex items-center justify-center">
                        <SoundcloudIcon className="h-4 w-4 text-[#FF5500]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold block text-foreground leading-none mb-0.5">SoundCloud</span>
                        <span className="text-[9px] text-muted-foreground truncate block font-mono">soundcloud.com/artist</span>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ==========================================
          ADMIN EDIT USER DIALOG (Simulated Popup)
          ========================================== */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-sm w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Editar Rol de Cuenta</h3>
            <div>
              <p className="text-xs text-muted-foreground">Nombre: <span className="font-bold text-foreground">{editingUser.name}</span></p>
              <p className="text-xs text-muted-foreground">Email: <span className="font-mono text-foreground">{editingUser.email}</span></p>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Rol</label>
              <select 
                defaultValue={editingUser.role}
                onChange={(e) => handleUpdateUserRole(editingUser.id, e.target.value as "USER" | "ADMIN")}
                className="w-full h-8 px-2 mt-1 text-xs bg-background border border-border rounded focus:outline-none"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setEditingUser(null)}
                className="h-8 px-3 rounded border border-border text-xs hover:bg-muted"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          AUTHENTICATION SIMULATOR DIALOG (Simulated Popup)
          ========================================== */}
      {sessionOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 
                className="text-xs font-bold text-foreground"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Simulador de Sesión
              </h3>
              <button onClick={() => setSessionOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Elige una de las siguientes identidades simuladas en memoria para iniciar sesión y probar la interfaz y formularios correspondientes:
            </p>

            <div className="space-y-2 pt-2">
              {users.map(u => {
                const isUserAdmin = u.role === "ADMIN";
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSelectRole(u)}
                    className="w-full flex items-center justify-between p-3 border border-border hover:border-pixel-primary rounded-lg text-left hover:bg-muted/30 transition-all group"
                  >
                    <div>
                      <div className="font-semibold text-xs text-foreground group-hover:text-pixel-primary transition-all">
                        {u.name}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">{u.email}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      isUserAdmin 
                        ? "bg-destructive/10 text-destructive border border-destructive/20" 
                        : "bg-pixel-primary/10 text-pixel-primary border border-pixel-primary/20"
                    }`}>
                      {u.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
