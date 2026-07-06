"use client";

import { Gamepad2, Music, Palette, Users } from "lucide-react";

/** LaMovidaBO — Galería de Artistas Pixel Art (En Desarrollo) */
export default function LaMovidaApp() {
  const mockArtists = [
    { name: "PixelMaster_BO", genre: "Chiptune", tracks: 12, avatar: "🎮" },
    { name: "RetroSoundz", genre: "8-bit Synthwave", tracks: 8, avatar: "🕹️" },
    { name: "BolivianByte", genre: "Lo-fi Pixel", tracks: 15, avatar: "👾" },
    { name: "NeonCruz", genre: "Demoscene", tracks: 6, avatar: "🌈" },
    { name: "AndeanGlitch", genre: "Glitch Art", tracks: 9, avatar: "⚡" },
    { name: "ChiptuneKolla", genre: "Chiptune Folk", tracks: 11, avatar: "🎵" },
  ];

  return (
    <div className="p-4" style={{ fontFamily: "Tahoma, sans-serif", fontSize: "12px" }}>
      {/* Hero */}
      <div
        className="p-6 mb-4 text-center"
        style={{
          background: "linear-gradient(135deg, #E040FB, #7C4DFF, #448AFF)",
          color: "#FFFFFF",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gamepad2 size={28} />
          <h1 className="text-[20px] font-bold m-0">LaMovidaBO</h1>
        </div>
        <p className="text-[12px] opacity-90 m-0">
          Galería de Artistas Pixel Art — Bolivia
        </p>
        <div
          className="inline-block mt-2 px-3 py-1 text-[10px] font-bold"
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          🚧 EN DESARROLLO
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 win2k-sunken p-2 text-center" style={{ background: "#FFFFFF" }}>
          <Users size={16} className="mx-auto mb-1" />
          <div className="text-[16px] font-bold">6</div>
          <div className="text-[10px] text-[#808080]">Artistas</div>
        </div>
        <div className="flex-1 win2k-sunken p-2 text-center" style={{ background: "#FFFFFF" }}>
          <Music size={16} className="mx-auto mb-1" />
          <div className="text-[16px] font-bold">61</div>
          <div className="text-[10px] text-[#808080]">Tracks</div>
        </div>
        <div className="flex-1 win2k-sunken p-2 text-center" style={{ background: "#FFFFFF" }}>
          <Palette size={16} className="mx-auto mb-1" />
          <div className="text-[16px] font-bold">4</div>
          <div className="text-[10px] text-[#808080]">Géneros</div>
        </div>
      </div>

      {/* Artist Grid */}
      <div className="win2k-sunken p-1" style={{ background: "#FFFFFF" }}>
        <table className="w-full text-[11px]" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0A246A", color: "#FFFFFF" }}>
              <th className="text-left p-1 font-normal">Artista</th>
              <th className="text-left p-1 font-normal">Género</th>
              <th className="text-center p-1 font-normal">Tracks</th>
            </tr>
          </thead>
          <tbody>
            {mockArtists.map((artist, i) => (
              <tr
                key={artist.name}
                style={{ background: i % 2 === 0 ? "#FFFFFF" : "#F0F0F0" }}
                className="hover:bg-[#0A246A] hover:text-white cursor-pointer"
              >
                <td className="p-1">
                  <span className="mr-1">{artist.avatar}</span>
                  {artist.name}
                </td>
                <td className="p-1">{artist.genre}</td>
                <td className="p-1 text-center">{artist.tracks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
