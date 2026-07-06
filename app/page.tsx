import { Suspense } from "react";
import Desktop from "@/app/components/Desktop";

/**
 * Main page — renders the Windows 2000 virtual desktop.
 * The Desktop component reads ?app= query param via useSearchParams
 * (wrapped in Suspense as required by Next.js for prerendering).
 */
export default function Home() {
  return (
    <Suspense
      fallback={
        <div
          className="w-screen h-screen flex items-center justify-center"
          style={{ background: "#3A6EA5" }}
        >
          <div
            className="win2k-raised p-8 text-center"
            style={{ background: "#C0C0C0" }}
          >
            <p className="text-[14px] font-bold">Ludwing Sandbox OS</p>
            <p className="text-[11px] text-[#808080] mt-1">Loading desktop...</p>
          </div>
        </div>
      }
    >
      <Desktop />
    </Suspense>
  );
}
