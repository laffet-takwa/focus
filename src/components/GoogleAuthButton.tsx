import { useState } from "react";
import { supabase } from "./supabaseClient";

type GoogleAuthButtonProps = {
  label?: string;
  onError?: (message: string) => void;
};

const PROVIDER_DISABLED =
  "Google sign-in is not enabled yet for this project. Enable it in Supabase under Authentication > Providers > Google.";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.74-6-6.1s2.7-6.1 6-6.1c1.88 0 3.14.8 3.86 1.49l2.63-2.53C16.8 3.2 14.63 2.2 12 2.2 6.98 2.2 2.8 6.38 2.8 11.4s4.18 9.2 9.2 9.2c5.31 0 8.83-3.73 8.83-8.98 0-.6-.07-1.06-.15-1.52H12z"
      />
    </svg>
  );
}

export default function GoogleAuthButton({
  label = "Continue with Google",
  onError,
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/notes`,
      },
    });

    // On success the browser navigates away to Google, so no reset here.
    if (error) {
      setLoading(false);
      const isDisabled =
        error.code === "validation_failed" ||
        /provider is not enabled|unsupported provider/i.test(error.message);
      onError?.(isDisabled ? PROVIDER_DISABLED : error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="glass-card w-full py-2 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-3 hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <GoogleMark />
      {loading ? "Redirecting..." : label}
    </button>
  );
}